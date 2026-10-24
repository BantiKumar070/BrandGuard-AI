import React, { useState } from "react";

// Shows the original and the suggested draft separately; the original is never overwritten.
export default function RevisedDraft({ original, revised }) {
  const [view, setView] = useState("revised");
  const [copied, setCopied] = useState(false);
  const unchanged = original === revised;
  const shown = view === "revised" ? revised : original;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(shown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false); // clipboard blocked - the text can still be selected manually
    }
  }

  return (
    <section className="panel" aria-labelledby="draft-title">
      <div className="panel-header">
        <h2 id="draft-title">Draft</h2>
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={view === "revised"} className={view === "revised" ? "tab active" : "tab"} onClick={() => setView("revised")}>Suggested</button>
          <button role="tab" aria-selected={view === "original"} className={view === "original" ? "tab active" : "tab"} onClick={() => setView("original")}>Original</button>
        </div>
      </div>
      {view === "revised" && unchanged && (
        <p className="message info">No automatic edits were possible. Review the suggestions above and edit manually.</p>
      )}
      <pre className="draft">{shown}</pre>
      <button type="button" className="secondary" onClick={copyText}>{copied ? "Copied" : `Copy ${view === "revised" ? "suggested" : "original"} draft`}</button>
    </section>
  );
}
