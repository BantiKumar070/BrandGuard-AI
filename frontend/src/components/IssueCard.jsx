import React from "react";

const CATEGORY_LABELS = {
  terminology: "Terminology",
  tone: "Tone",
  style: "Style",
  claim_risk: "Claim risk",
};

export default function IssueCard({ issue }) {
  return (
    <article className={`issue issue-${issue.severity}`}>
      <header>
        <span className={`badge badge-${issue.severity}`}>{issue.severity}</span>
        <span className="issue-category">{CATEGORY_LABELS[issue.category] || issue.category}</span>
      </header>
      <p className="issue-snippet">&ldquo;{issue.snippet}&rdquo;</p>
      <p><strong>Why:</strong> {issue.reason}</p>
      <p><strong>Suggestion:</strong> {issue.suggestion}</p>
    </article>
  );
}
