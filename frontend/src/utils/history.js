// Helpers for the saved review history (stored in this browser only).
export const HISTORY_LIMIT = 50;

export function createHistoryEntry({ text, profileName, result }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    text,
    profileName,
    result: {
      overallAssessment: result.overallAssessment,
      analysisMode: result.analysisMode,
      issues: result.issues,
      revisedDraft: result.revisedDraft,
    },
  };
}

export function addEntry(history, entry) {
  return [entry, ...history].slice(0, HISTORY_LIMIT);
}

export const CATEGORY_LABELS = {
  claim_risk: "Claim risk",
  terminology: "Terminology",
  tone: "Tone",
  style: "Style",
};

// Numbers shown on the Overview page.
export function summarizeHistory(history) {
  const byCategory = {};
  let findings = 0;
  let high = 0;
  history.forEach((entry) => {
    entry.result.issues.forEach((issue) => {
      findings += 1;
      if (issue.severity === "high") high += 1;
      byCategory[issue.category] = (byCategory[issue.category] || 0) + 1;
    });
  });
  const categories = Object.entries(byCategory)
    .map(([category, count]) => ({ category, label: CATEGORY_LABELS[category] || category, count }))
    .sort((a, b) => b.count - a.count);
  return { reviews: history.length, findings, high, categories };
}
