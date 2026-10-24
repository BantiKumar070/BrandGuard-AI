// Orchestrates one review. Today it is rules-only; the LLM step (roadmap step 3)
// will be added here, merged with the rule findings.
import { runRules, buildRevisedDraft } from "./ruleEngine.js";

function toPublicIssue({ category, severity, snippet, reason, suggestion }) {
  return { category, severity, snippet, reason, suggestion };
}

export async function reviewContent({ text, brandProfile }) {
  const issues = runRules(text, brandProfile);
  return {
    overallAssessment: issues.length > 0 ? "needs_review" : "no_issues_found",
    issues: issues.map(toPublicIssue),
    revisedDraft: buildRevisedDraft(text, issues),
    humanReviewRequired: true, // always true: a person approves content before publication
    analysisMode: "rules_only",
  };
}
