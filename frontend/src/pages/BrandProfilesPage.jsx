import React, { useState } from "react";
import PageHeading from "../components/PageHeading.jsx";
import { profileToForm, formToProfile } from "../utils/profileForm.js";
import { DEFAULT_PROFILE } from "../utils/sampleData.js";

const FIELDS = [
  { name: "brandName", label: "Brand name", hint: "Shown in the top bar and on reviews.", rows: 0 },
  { name: "voice", label: "Voice traits", hint: "Comma-separated, e.g. clear, confident, supportive.", rows: 0 },
  { name: "avoidWords", label: "Words and phrases to avoid", hint: "Comma-separated. These are flagged as high severity.", rows: 0 },
  { name: "preferredTerms", label: "Preferred terms", hint: "One per line, written as: customers -> teams", rows: 4 },
  { name: "notes", label: "Notes for reviewers", hint: "Extra guidance, for example evidence rules.", rows: 3 },
];

export default function BrandProfilesPage({ profile, onSave }) {
  const [form, setForm] = useState(() => profileToForm(profile));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function change(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  function save() {
    const next = formToProfile(form);
    if (!next.brandName) {
      setError("Please give the brand profile a name.");
      return;
    }
    setError("");
    onSave(next);
    setMessage("Profile saved. It will be used for your next review.");
  }

  function resetToSample() {
    setForm(profileToForm(DEFAULT_PROFILE));
    setError("");
    setMessage("Sample profile loaded. Click Save profile to use it.");
  }

  return (
    <>
      <PageHeading
        eyebrow={`BRAND PROFILES / ${profile.brandName.toUpperCase()}`}
        title="Define how your brand sounds."
        subtitle="Set the voice, the words to avoid and the preferred terms. Every review uses the profile you save here."
      />
      <section className="card form-card" aria-labelledby="profile-title">
        <div className="card-head">
          <div>
            <h2 id="profile-title">Active brand profile</h2>
            <p className="card-sub">Saved in this browser.</p>
          </div>
          <span className="chip">Editable</span>
        </div>
        {FIELDS.map(({ name, label, hint, rows }) => (
          <div className="field" key={name}>
            <label htmlFor={`f-${name}`}>{label}</label>
            {rows > 0 ? (
              <textarea id={`f-${name}`} className="input" rows={rows} value={form[name]} onChange={(e) => change(name, e.target.value)} />
            ) : (
              <input id={`f-${name}`} className="input" value={form[name]} onChange={(e) => change(name, e.target.value)} />
            )}
            <small>{hint}</small>
          </div>
        ))}
        <div className="card-divider" />
        <div className="form-actions">
          <p className={error ? "status status-error" : "status"} role={error ? "alert" : undefined}>{error || message}</p>
          <div className="button-row">
            <button type="button" className="btn-outline" onClick={resetToSample}>Reset to sample</button>
            <button type="button" className="btn-primary" onClick={save}>Save profile</button>
          </div>
        </div>
      </section>
    </>
  );
}
