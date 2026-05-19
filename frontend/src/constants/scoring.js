/** Judging: 5 categories × 10 marks max = 50 total per judge */
export const SCORING_CATEGORIES = [
    { key: "cat1", label: "Kalam", maxMarks: 10 },
    { key: "cat2", label: "Tarz o Tarannum", maxMarks: 10 },
    { key: "cat3", label: "Talaffuz", maxMarks: 10 },
    { key: "cat4", label: "Harkat o Saknaat", maxMarks: 10 },
    { key: "cat5", label: "Libas o Andaz", maxMarks: 10 }
];

export const SCORING = {
    CATEGORY_COUNT: SCORING_CATEGORIES.length,
    MAX_PER_CATEGORY: 10,
    MAX_TOTAL_PER_JUDGE: 50,
    MAX_JUDGES: 3,
    CATEGORY_KEYS: SCORING_CATEGORIES.map((c) => c.key),
    CATEGORY_LABELS: SCORING_CATEGORIES.map((c) => c.label)
};

export const getCategoryByKey = (key) =>
    SCORING_CATEGORIES.find((c) => c.key === key);

export const clampCategoryScore = (value) => {
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) return 0;
    if (n > SCORING.MAX_PER_CATEGORY) return SCORING.MAX_PER_CATEGORY;
    return Math.round(n);
};

export const computeTotalFromCategories = (scoreEntry) =>
    SCORING.CATEGORY_KEYS.reduce(
        (sum, key) => sum + clampCategoryScore(scoreEntry?.[key]),
        0
    );

export const validateScoresBeforeSubmit = (scoreEntry) => {
    for (const cat of SCORING_CATEGORIES) {
        const v = Number(scoreEntry?.[cat.key]);
        if (Number.isNaN(v) || v < 0 || v > cat.maxMarks) {
            return {
                valid: false,
                message: `${cat.label} must be between 0 and ${cat.maxMarks} marks.`
            };
        }
    }

    const total = computeTotalFromCategories(scoreEntry);
    if (total > SCORING.MAX_TOTAL_PER_JUDGE) {
        return {
            valid: false,
            message: `Total marks cannot exceed ${SCORING.MAX_TOTAL_PER_JUDGE} (${SCORING.CATEGORY_COUNT} categories × ${SCORING.MAX_PER_CATEGORY} each).`
        };
    }

    return { valid: true, total };
};

export const maxGrandTotal = (judgeCount = SCORING.MAX_JUDGES) =>
    judgeCount * SCORING.MAX_TOTAL_PER_JUDGE;

export const scoringScaleLabel = () =>
    `0–${SCORING.MAX_TOTAL_PER_JUDGE} (${SCORING.CATEGORY_COUNT} × ${SCORING.MAX_PER_CATEGORY})`;

export const scoringCategoriesList = () =>
    SCORING_CATEGORIES.map(
        (c, i) => `${i + 1}) ${c.label} = ${c.maxMarks} Marks`
    );
