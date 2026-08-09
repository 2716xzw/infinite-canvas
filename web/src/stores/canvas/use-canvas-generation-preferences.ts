import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CanvasNodeMetadata } from "@/types/canvas";

export type CanvasGenerationPreferenceMode = "image" | "video";

type CanvasGenerationPreferencesStore = {
    image: Partial<CanvasNodeMetadata>;
    video: Partial<CanvasNodeMetadata>;
    remember: (mode: CanvasGenerationPreferenceMode, metadata: Partial<CanvasNodeMetadata>) => void;
};

const keysByMode = {
    image: ["model", "size", "quality", "background", "count"],
    video: ["model", "size", "seconds", "vquality", "generateAudio", "watermark"],
} as const;

export const useCanvasGenerationPreferences = create<CanvasGenerationPreferencesStore>()(
    persist(
        (set) => ({
            image: {},
            video: {},
            remember: (mode, metadata) =>
                set((state) => {
                    const patch = Object.fromEntries(keysByMode[mode].filter((key) => metadata[key] !== undefined).map((key) => [key, metadata[key]]));
                    return { [mode]: { ...state[mode], ...patch } };
                }),
        }),
        { name: "infinite-canvas:generation_preferences", partialize: ({ image, video }) => ({ image, video }) },
    ),
);
