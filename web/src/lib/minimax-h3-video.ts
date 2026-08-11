export const minimaxH3ResolutionOptions = ["1440P", "768P"] as const;

export function isMinimaxH3Model(model: string | undefined) {
    const name = String(model || "").split("::").pop()?.trim().toLowerCase();
    return name === "minimax-h3";
}

export function normalizeMinimaxH3Resolution(value: string | undefined) {
    const normalized = String(value || "").trim().toUpperCase();
    return minimaxH3ResolutionOptions.includes(normalized as (typeof minimaxH3ResolutionOptions)[number]) ? normalized : "1440P";
}
