import React from "react";
import PageHeading from "../components/PageHeading.jsx";

function severityCounts(issues) {
  return ["high", "medium", "low"]
    .map((severity) => ({ severity, count: issues.filter((issue) => issue.severity === severity).length }))
    .filter((item) => item.count > 0);
}

const preview = (text) => (text.length > 140 ? `${text.slice(0, 140)}...` : text);

export default function ReviewHistoryPage({ history, onOpen, onDelete, onNavigate }) {
  return (
    <>
      <PageHeading
        eyebrow="REVIEW HISTORY"
        title="Every review, on record."
        subtitle="Your past reviews are kept in this browser so you can reopen a draft and its findings at any time."
      />
      {history.length === 0 ? (
        <section className="card empty-card">
          <h2>No reviews yet</h2>
          <p className="card-sub">Run your first review and it will appear here.</p>
          <button type="button" className="btn-primary" onClick={() => onNavigate("review")}>Go to Content Review</button>
        </section>
      ) : (
        <section className="card" aria-label="Saved reviews">
          <div className="card-head">
            <div>
              <h2>Saved reviews</h2>
              <p className="card-sub">Newest first. Up to 50 are kept.</p>
            </div>
            <span className="chip">{history.length} {history.length === 1 ? "review" : "reviews"}</span>
          </div>
          <ul className="history-list">
            {history.map((entry) => (
              <li className="history-item" key={entry.id}>
                <div className="history-main">
                  <p className="history-meta">{new Date(entry.createdAt).toLocaleString()} &middot; {entry.profileName}</p>
                  <p className="history-text">{preview(entry.text)}</p>
                  <div className="history-badges">
                    {entry.result.issues.length === 0 && <span className="severity severity-low">No issues</span>}
                    {severityCounts(entry.result.issues).map(({ severity, count }) => (
                      <span key={severity} className={`severity severity-${severity}`}>{count} {severity}</span>
                    ))}
                  </div>
                </div>
                <div className="button-row">
                  <button type="button" className="btn-outline" onClick={() => onOpen(entry)}>Open</button>
                  <button type="button" className="btn-outline" onClick={() => onDelete(entry.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
