import React from "react";
import { MAX_TEXT_LENGTH } from "../utils/sampleContent.js";

export default function ContentEditor({ text, onChange, onSubmit, onLoadSample, onClear, loading, error }) {
  const tooLong = text.length > MAX_TEXT_LENGTH;
  const empty = text.trim().length === 0;

  return (
    <section className="panel" aria-labelledby="content-title">
      <div className="panel-header">
        <h2 id="content-title">Content to review</h2>
        <div className="actions-inline">
          <button type="button" className="link-button" onClick={onLoadSample} disabled={loading}>Load sample</button>
          <button type="button" className="link-button" onClick={onClear} disabled={loading || empty}>Clear</button>
        </div>
      </div>
      <textarea
        className="editor"
        value={text}
        rows={9}
        placeholder="Paste your marketing copy here..."
        aria-label="Content to review"
        disabled={loading}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="editor-footer">
        <span className={tooLong ? "counter counter-bad" : "counter"}>
          {text.length} / {MAX_TEXT_LENGTH}
        </span>
        <button type="button" className="primary" onClick={onSubmit} disabled={loading || empty || tooLong}>
          {loading ? "Reviewing..." : "Run review"}
        </button>
      </div>
      {tooLong && <p className="message error" role="alert">Content is too long. Please shorten it to {MAX_TEXT_LENGTH} characters or less.</p>}
      {error && <p className="message error" role="alert">{error}</p>}
    </section>
  );
}
