/** Judging: 5 categories × 10 marks max = 50 total per judge */
const SCORING_CATEGORIES = [
    { key: "cat1", label: "Kalam", maxMarks: 10 },
    { key: "cat2", label: "Tarz o Tarannum", maxMarks: 10 },
    { key: "cat3", label: "Talaffuz", maxMarks: 10 },
    { key: "cat4", label: "Harkat o Saknaat", maxMarks: 10 },
    { key: "cat5", label: "Libas o Andaz", maxMarks: 10 }
];

const SCORING = {
    CATEGORY_COUNT: SCORING_CATEGORIES.length,
    MAX_PER_CATEGORY: 10,
    MAX_TOTAL_PER_JUDGE: 50,
    MAX_JUDGES: 3,
    CATEGORY_KEYS: SCORING_CATEGORIES.map((c) => c.key),
    CATEGORY_LABELS: SCORING_CATEGORIES.map((c) => c.label)
};

const clampCategoryScore = (value) => {
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) return 0;
    if (n > SCORING.MAX_PER_CATEGORY) return SCORING.MAX_PER_CATEGORY;
    return Math.round(n);
};

const computeTotalFromCategories = (scoreData) =>
    SCORING.CATEGORY_KEYS.reduce((sum, key) => sum + clampCategoryScore(scoreData[key]), 0);

/**
 * Validates and normalizes judge score payload.
 * @returns {{ ok: true, data: object } | { ok: false, message: string }}
 */
const normalizeAndValidateScore = (scoreData) => {
    if (!scoreData || typeof scoreData !== "object") {
        return { ok: false, message: "Invalid score data" };
    }

    const normalized = {};
    for (const cat of SCORING_CATEGORIES) {
        const value = clampCategoryScore(scoreData[cat.key]);
        if (value > cat.maxMarks) {
            return {
                ok: false,
                message: `${cat.label} cannot exceed ${cat.maxMarks} marks`
            };
        }
        normalized[cat.key] = value;
    }

    const totalScore = computeTotalFromCategories(normalized);

    if (totalScore > SCORING.MAX_TOTAL_PER_JUDGE) {
        return {
            ok: false,
            message: `Total marks cannot exceed ${SCORING.MAX_TOTAL_PER_JUDGE} (Kalam, Tarz o Tarannum, Talaffuz, Harkat o Saknaat, Libas o Andaz — ${SCORING.MAX_PER_CATEGORY} each)`
        };
    }

    return {
        ok: true,
        data: {
            ...normalized,
            totalScore,
            comments: typeof scoreData.comments === "string" ? scoreData.comments.trim() : ""
        }
    };
};

module.exports = {
    SCORING,
    SCORING_CATEGORIES,
    clampCategoryScore,
    computeTotalFromCategories,
    normalizeAndValidateScore
};
