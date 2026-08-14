type PollingOptions<TResult> = {
    isPolling: () => boolean;
    start: () => AbortController;
    poll: (signal: AbortSignal) => Promise<TResult>;
    complete: (result: TResult) => void | Promise<void>;
    fail: (error: unknown) => void;
    finish: (controller: AbortController) => void;
};

export function enqueueVideoTaskPolling<TResult>(options: PollingOptions<TResult>) {
    if (options.isPolling()) return false;
    const controller = options.start();
    void options
        .poll(controller.signal)
        .then(options.complete)
        .catch(options.fail)
        .finally(() => options.finish(controller));
    return true;
}
