import React from "react";
import PageHeading from "../components/PageHeading.jsx";
import { summarizeHistory } from "../utils/history.js";

export default function OverviewPage({ history, brandName, onNavigate }) {
  const { reviews, findings, high, categories } = summarizeHistory(history);
  const maxCount = categories.length ? categories[0].count : 1;
  const stats = [
    { label: "Reviews run", value: reviews },
    { label: "Findings flagged", value: findings },
    { label: "High severity", value: high },
  ];

  return (
    <>
      <PageHeading
        eyebrow={`OVERVIEW / ${brandName.toUpperCase()}`}
        title="Your brand, at a glance."
        subtitle="See how your content is doing and which issues keep coming back, so guidelines can be made clearer."
      />
      <div className="stat-row">
        {stats.map(({ label, value }) => (
          <section className="card stat-card" key={label}>
            <p className="stat-value">{value}</p>
            <p className="card-sub">{label}</p>
          </section>
        ))}
      </div>
      <div className="two-col even">
        <section className="card" aria-labelledby="recurring-title">
          <div className="card-head">
            <div>
              <h2 id="recurring-title">Recurring issues</h2>
              <p className="card-sub">Findings grouped by type across all saved reviews.</p>
            </div>
          </div>
          {categories.length === 0 ? (
            <p className="no-findings">Nothing to show yet. Run a review to start building insights.</p>
          ) : (
            <ul className="bars">
              {categories.map(({ category, label, count }) => (
                <li key={category}>
                  <div className="bar-label"><span>{label}</span><span>{count}</span></div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.max(8, (count / maxCount) * 100)}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card" aria-labelledby="start-title">
          <div className="card-head">
            <div>
              <h2 id="start-title">Quick start</h2>
              <p className="card-sub">Three steps to a reviewed draft.</p>
            </div>
          </div>
          <ol className="steps">
            <li>Check your brand profile.</li>
            <li>Paste your copy and run a review.</li>
            <li>Review each finding, then copy the suggested revision.</li>
          </ol>
          <div className="button-row left">
            <button type="button" className="btn-primary" onClick={() => onNavigate("review")}>Start a review</button>
            <button type="button" className="btn-outline" onClick={() => onNavigate("profiles")}>Edit brand profile</button>
          </div>
        </section>
      </div>
      <p className="page-footnote">AI suggestions support human review and approval.</p>
    </>
  );
}
