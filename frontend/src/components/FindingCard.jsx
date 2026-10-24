import React from "react";

const TITLES = {
  claim_risk: "Unapproved claim",
  tone: "Off-brand phrase",
  terminology: "Terminology consistency",
  style: "Style",
};
const SEVERITY_LABELS = { high: "High", medium: "Medium", low: "Low" };

export default function FindingCard({ issue }) {
  return (
    <article className="finding">
      <header className="finding-head">
        <span className={`severity severity-${issue.severity}`}>{SEVERITY_LABELS[issue.severity] || issue.severity}</span>
        <h3>{TITLES[issue.category] || issue.category}</h3>
      </header>
      <p className="finding-reason">{issue.reason}</p>
      <p className="finding-suggestion">{issue.suggestion}</p>
    </article>
  );
}
