// Starting data for the demo. Keep DEFAULT_PROFILE in sync with backend/src/data/sampleBrandProfile.json.
export const MAX_TEXT_LENGTH = 5000; // keep in sync with MAX_TEXT_LENGTH in backend/.env.example

export const DEFAULT_PROFILE = {
  brandName: "Acme Core",
  voice: ["clear", "confident", "supportive"],
  avoidWords: ["guaranteed", "flawless", "crush your goals"],
  preferredTerms: [
    { from: "cheap", to: "affordable" },
    { from: "customers", to: "teams" },
    { from: "customer", to: "team" },
  ],
  notes: "Avoid absolute promises. Support numbers and performance claims with an approved source.",
};

export const SAMPLE_CONTENT =
  "Meet the smarter way to keep every campaign moving. Acme Core guarantees flawless results for every customer. Crush your goals with faster reviews and a clearer path from first draft to launch.";

// Shown before the first real review so the page never looks empty. Clearly labelled "Sample review".
export const SAMPLE_REVIEW = {
  overallAssessment: "needs_review",
  analysisMode: "sample",
  humanReviewRequired: true,
  issues: [
    { category: "claim_risk", severity: "high", snippet: "Guarantees flawless results", reason: "\u201cGuarantees flawless results\u201d makes an absolute promise.", suggestion: "Try: \u201chelps teams deliver more consistent work.\u201d" },
    { category: "tone", severity: "medium", snippet: "Crush your goals", reason: "\u201cCrush your goals\u201d feels too aggressive for this voice.", suggestion: "Try: \u201cmove your work forward.\u201d" },
    { category: "terminology", severity: "medium", snippet: "customer", reason: "Use the approved audience term \u201cteams\u201d rather than \u201ccustomers.\u201d", suggestion: "Replace \u201ccustomer\u201d with \u201cteam\u201d where appropriate." },
  ],
  revisedDraft:
    "Meet the smarter way to keep every campaign moving. Acme Core helps teams deliver more consistent work for every team. move your work forward with faster reviews and a clearer path from first draft to launch.",
};
