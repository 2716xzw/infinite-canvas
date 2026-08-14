import assert from "node:assert/strict";
import test from "node:test";

import { enqueueVideoTaskPolling } from "../src/lib/canvas/video-task-polling.ts";

const deferred = () => {
    let resolve;
    let reject;
    const promise = new Promise((nextResolve, nextReject) => {
        resolve = nextResolve;
        reject = nextReject;
    });
    return { promise, resolve, reject };
};

test("does not enqueue a task that is already polling", () => {
    let started = 0;
    const queued = enqueueVideoTaskPolling({
        isPolling: () => true,
        start: () => (started++, new AbortController()),
        poll: async () => "done",
        complete: () => {},
        fail: () => {},
        finish: () => {},
    });

    assert.equal(queued, false);
    assert.equal(started, 0);
});

test("requeues an inactive task and applies the completed result", async () => {
    const result = deferred();
    let active = false;
    let completed;
    let finished = 0;
    const queued = enqueueVideoTaskPolling({
        isPolling: () => active,
        start: () => ((active = true), new AbortController()),
        poll: () => result.promise,
        complete: (value) => {
            completed = value;
        },
        fail: assert.fail,
        finish: () => {
            active = false;
            finished++;
        },
    });

    assert.equal(queued, true);
    assert.equal(active, true);
    result.resolve({ url: "mock://completed-video" });
    await result.promise;
    await new Promise(setImmediate);
    assert.deepEqual(completed, { url: "mock://completed-video" });
    assert.equal(active, false);
    assert.equal(finished, 1);
});

test("removes failed polling from the queue so it can be resumed", async () => {
    const result = deferred();
    let active = false;
    let failure;
    enqueueVideoTaskPolling({
        isPolling: () => active,
        start: () => ((active = true), new AbortController()),
        poll: () => result.promise,
        complete: assert.fail,
        fail: (error) => {
            failure = error;
        },
        finish: () => {
            active = false;
        },
    });

    result.reject(new Error("mock upstream unavailable"));
    await assert.rejects(result.promise);
    await new Promise(setImmediate);
    assert.equal(failure.message, "mock upstream unavailable");
    assert.equal(active, false);
});
