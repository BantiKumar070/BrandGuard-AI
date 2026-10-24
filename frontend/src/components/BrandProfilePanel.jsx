import React from "react";

const FIELDS = [
  { name: "brandName", label: "Brand name", type: "input" },
  { name: "voice", label: "Voice traits", hint: "Comma-separated, e.g. clear, helpful", type: "input" },
  { name: "avoidWords", label: "Words to avoid", hint: "Comma-separated", type: "input" },
  { name: "preferredTerms", label: "Preferred terms", hint: "One per line: cheap -> affordable", type: "textarea", rows: 3 },
  { name: "notes", label: "Notes", hint: "Extra guidance for reviewers", type: "textarea", rows: 3 },
];

export default function BrandProfilePanel({ form, onChange, onReset, disabled }) {
  return (
    <section className="panel" aria-labelledby="profile-title">
      <div className="panel-header">
        <h2 id="profile-title">Brand profile</h2>
        <button type="button" className="link-button" onClick={onReset} disabled={disabled}>
          Reset to sample
        </button>
      </div>
      {FIELDS.map(({ name, label, hint, type, rows }) => {
        const Control = type === "textarea" ? "textarea" : "input";
        return (
          <label className="field" key={name}>
            <span>{label}</span>
            <Control
              name={name}
              value={form[name]}
              rows={rows}
              disabled={disabled}
              onChange={(event) => onChange(name, event.target.value)}
            />
            {hint && <small>{hint}</small>}
          </label>
        );
      })}
    </section>
  );
}
