import React, { useState } from "react";
import PageHeading from "../components/PageHeading.jsx";
import { MAX_TEXT_LENGTH } from "../utils/sampleData.js";

export default function SettingsPage({ initials, onInitialsChange, historyCount, onClearHistory, onResetProfile, brandName }) {
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState("");

  function clearHistory() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onClearHistory();
    setConfirming(false);
    setNotice("Review history cleared.");
  }

  return (
    <>
      <PageHeading eyebrow={`SETTINGS / ${brandName.toUpperCase()}`} title="Make it yours." subtitle="Small preferences for this browser. Nothing here is sent to a server." />
      <div className="two-col even">
        <section className="card" aria-labelledby="account-title">
          <div className="card-head"><div><h2 id="account-title">Account</h2><p className="card-sub">Shown in the top bar.</p></div></div>
          <div className="field">
            <label htmlFor="initials">Your initials</label>
            <input id="initials" className="input" maxLength={2} value={initials} onChange={(e) => onInitialsChange(e.target.value.toUpperCase())} />
            <small>Up to two letters.</small>
          </div>
        </section>
        <section className="card" aria-labelledby="engine-title">
          <div className="card-head"><div><h2 id="engine-title">Review engine</h2><p className="card-sub">How reviews are produced today.</p></div><span className="chip">Read only</span></div>
          <dl className="info-list">
            <div><dt>Analysis mode</dt><dd>Rule-based checks</dd></div>
            <div><dt>Maximum draft length</dt><dd>{MAX_TEXT_LENGTH} characters</dd></div>
            <div><dt>Human approval</dt><dd>Always required</dd></div>
          </dl>
        </section>
      </div>
      <section className="card data-card" aria-labelledby="data-title">
        <div className="card-head"><div><h2 id="data-title">Your data</h2><p className="card-sub">Profile and history are stored only in this browser.</p></div></div>
        <div className="data-row">
          <div><strong>Review history</strong><p className="card-sub">{historyCount} saved {historyCount === 1 ? "review" : "reviews"}</p></div>
          <button type="button" className="btn-outline" onClick={clearHistory} disabled={historyCount === 0 && !confirming}>{confirming ? "Click again to confirm" : "Clear history"}</button>
        </div>
        <div className="card-divider" />
        <div className="data-row">
          <div><strong>Brand profile</strong><p className="card-sub">Go back to the sample profile.</p></div>
          <button type="button" className="btn-outline" onClick={() => { onResetProfile(); setNotice("Brand profile reset to the sample."); }}>Reset profile</button>
        </div>
        {notice && <p className="status" role="status">{notice}</p>}
      </section>
      <p className="page-footnote">AI suggestions support human review and approval.</p>
    </>
  );
}
