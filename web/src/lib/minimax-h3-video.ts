export const minimaxH3Resolution = "1440P";

export const minimaxH3SizeOptions = [
    { ratio: "21:9", size: "3360x1440" },
    { ratio: "16:9", size: "2560x1440" },
    { ratio: "4:3", size: "1920x1440" },
    { ratio: "1:1", size: "1440x1440" },
    { ratio: "3:4", size: "1440x1920" },
    { ratio: "9:16", size: "1440x2560" },
] as const;

export function isMinimaxH3Model(model: string | undefined) {
    const name = String(model || "").split("::").pop()?.trim().toLowerCase();
    return name === "minimax-h3";
}

export function normalizeMinimaxH3Resolution(_value: string | undefined) {
    return minimaxH3Resolution;
}

export function normalizeMinimaxH3Size(value: string | undefined) {
    return minimaxH3SizeOptions.find((item) => item.size === value || item.ratio === value)?.size || "2560x1440";
}

export function minimaxH3Ratio(value: string | undefined) {
    return minimaxH3SizeOptions.find((item) => item.size === normalizeMinimaxH3Size(value))!.ratio;
}

export function normalizeMinimaxH3Duration(value: string | undefined) {
    const duration = Math.floor(Number(value) || 6);
    return String(Math.max(5, Math.min(30, duration)));
}
