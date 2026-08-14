import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const storage = new Map();
globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
    clear: () => storage.clear(),
};

test("renders task_id and refresh action for a failed asynchronous video task", async () => {
    const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
    try {
        const { CanvasNode } = await vite.ssrLoadModule("/src/components/canvas/canvas-node.tsx");
        const { CanvasNodeType } = await vite.ssrLoadModule("/src/types/canvas.ts");
        const noop = () => {};
        const html = renderToStaticMarkup(
            React.createElement(CanvasNode, {
                data: {
                    id: "mock-video-node",
                    type: CanvasNodeType.Video,
                    title: "Mock video task",
                    position: { x: 0, y: 0 },
                    width: 420,
                    height: 236,
                    metadata: {
                        status: "error",
                        errorDetails: "mock polling interrupted",
                        taskId: "task_mock_123",
                        taskProvider: "openai",
                        taskModel: "mock-video-model",
                    },
                },
                scale: 1,
                isSelected: true,
                isRelated: false,
                isFocusRelated: false,
                isConnectionTarget: false,
                isConnecting: false,
                showPanel: false,
                showImageInfo: false,
                onMouseDown: noop,
                onHoverStart: noop,
                onHoverEnd: noop,
                onConnectStart: noop,
                onResizeStart: noop,
                onResize: noop,
                onResizeEnd: noop,
                onContentChange: noop,
                onTitleChange: noop,
                onRefreshTask: noop,
                onContextMenu: noop,
            }),
        );

        assert.match(html, /task_id: task_mock_123/);
        assert.match(html, /更新状态/);
        assert.match(html, /aria-label="手动拉取任务状态"/);
    } finally {
        await vite.close();
    }
});
