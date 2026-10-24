import React from "react";
import IssueCard from "./IssueCard.jsx";
import RevisedDraft from "./RevisedDraft.jsx";

export default function ReviewResults({ result, originalText }) {
  const { issues, overallAssessment, revisedDraft, analysisMode } = result;
  const clean = overallAssessment === "no_issues_found";

  return (
    <div className="results" aria-live="polite">
      <section className="panel">
        <div className="panel-header">
          <h2>Review results</h2>
          <span className="mode">Mode: {analysisMode === "rules_only" ? "rules only" : analysisMode}</span>
        </div>
        {clean ? (
          <p className="message success">No issues were found by the automated checks. A person should still review before publishing.</p>
        ) : (
          <p className="message warning">{issues.length} {issues.length === 1 ? "finding" : "findings"} to review.</p>
        )}
        {issues.map((issue, index) => (
          <IssueCard key={`${issue.snippet}-${index}`} issue={issue} />
        ))}
      </section>
      <RevisedDraft original={originalText} revised={revisedDraft} />
      <p className="disclaimer">
        These findings are advisory. A flagged claim means &ldquo;verify against approved evidence&rdquo;, not &ldquo;this is false&rdquo;.
        A human must approve content before it is published.
      </p>
    </div>
  );
}
