"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { FolderOpen, ImagePlus, Music2, Type, Upload, Video } from "lucide-react";

import { canvasThemes } from "@/lib/canvas-theme";
import { useThemeStore } from "@/stores/use-theme-store";

type BlankMenuAction = "text" | "image" | "video" | "audio" | "upload" | "asset";

type CanvasBlankContextMenuProps = {
    x: number;
    y: number;
    onClose: () => void;
    onAction: (action: BlankMenuAction) => void;
};

const menuItems: { key: BlankMenuAction; label: string; icon: typeof Type; divider?: boolean }[] = [
    { key: "text", label: "文本", icon: Type },
    { key: "image", label: "生成图片", icon: ImagePlus },
    { key: "video", label: "生成视频", icon: Video },
    { key: "audio", label: "生成音频", icon: Music2 },
    { key: "upload", label: "上传素材", icon: Upload, divider: true },
    { key: "asset", label: "选择资产", icon: FolderOpen },
];

export function CanvasBlankContextMenu({ x, y, onClose, onAction }: CanvasBlankContextMenuProps) {
    const theme = canvasThemes[useThemeStore((state) => state.theme)];
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ left: x, top: y });

    useLayoutEffect(() => {
        const menu = menuRef.current;
        const parent = menu?.parentElement;
        if (!menu || !parent) return;

        const padding = 12;
        const parentRect = parent.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const maxLeft = Math.max(padding, parentRect.width - menuRect.width - padding);
        const maxTop = Math.max(padding, parentRect.height - menuRect.height - padding);
        const nextLeft = Math.min(Math.max(x, padding), maxLeft);
        const nextTop = y + menuRect.height + padding > parentRect.height ? Math.max(padding, y - menuRect.height) : Math.min(Math.max(y, padding), maxTop);

        setPosition((current) => (current.left === nextLeft && current.top === nextTop ? current : { left: nextLeft, top: nextTop }));
    }, [x, y]);

    return (
        <>
            <div className="absolute inset-0 z-[130]" onMouseDown={onClose} />
            <div
                ref={menuRef}
                className="absolute z-[140] w-[280px] overflow-hidden rounded-[22px] border px-3 py-3 shadow-2xl backdrop-blur-xl"
                style={{
                    left: position.left,
                    top: position.top,
                    background: `linear-gradient(180deg, ${theme.toolbar.panel}, ${theme.node.panel})`,
                    borderColor: theme.toolbar.border,
                    color: theme.node.text,
                }}
                onMouseDown={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
                onContextMenu={(event) => event.preventDefault()}
            >
                <div className="px-3 pb-3 text-sm" style={{ color: theme.node.muted }}>
                    添加节点
                </div>
                <div className="grid gap-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.key}>
                                {item.divider ? <div className="mx-2 mb-2 mt-1 h-px" style={{ background: theme.toolbar.border }} /> : null}
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition"
                                    style={{ color: theme.node.text }}
                                    onClick={() => onAction(item.key)}
                                    onMouseEnter={(event) => {
                                        event.currentTarget.style.background = theme.toolbar.itemHover;
                                    }}
                                    onMouseLeave={(event) => {
                                        event.currentTarget.style.background = "transparent";
                                    }}
                                >
                                    <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: theme.node.fill, color: theme.node.muted }}>
                                        <Icon className="size-5" />
                                    </span>
                                    <span className="text-[15px]">{item.label}</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
