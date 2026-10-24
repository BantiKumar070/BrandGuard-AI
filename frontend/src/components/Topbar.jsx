import React, { useState } from "react";
import { HelpIcon, BellIcon } from "./Icons.jsx";

// One small dropdown at a time; clicking the backdrop closes it.
function Menu({ title, children }) {
  return (
    <div className="menu" role="dialog" aria-label={title}>
      <p className="menu-title">{title}</p>
      {children}
    </div>
  );
}

export default function Topbar({ pageLabel, brandName, initials }) {
  const [open, setOpen] = useState(null); // "help" | "bell" | null
  const toggle = (name) => setOpen((current) => (current === name ? null : name));

  return (
    <header className="topbar">
      {open && <button type="button" className="menu-backdrop" aria-label="Close menu" onClick={() => setOpen(null)} />}
      <div className="crumbs">
        <strong>Workspace</strong>
        <span className="crumb-sep">/</span>
        <span>{pageLabel}</span>
      </div>
      <div className="topbar-right">
        <div className="profile-pill"><span className="dot" />Brand profile: {brandName}</div>
        <div className="menu-wrap">
          <button type="button" className="icon-button" aria-label="Help" onClick={() => toggle("help")}><HelpIcon size={20} /></button>
          {open === "help" && (
            <Menu title="How it works">
              <p>1. Pick or edit a brand profile.</p>
              <p>2. Paste your copy and run a review.</p>
              <p>3. Check each finding, then copy the suggested revision.</p>
              <p className="menu-note">Findings are advisory. A person must approve content before it is published.</p>
            </Menu>
          )}
        </div>
        <div className="menu-wrap">
          <button type="button" className="icon-button" aria-label="Notifications" onClick={() => toggle("bell")}><BellIcon size={20} /></button>
          {open === "bell" && <Menu title="Notifications"><p className="menu-note">You are all caught up.</p></Menu>}
        </div>
        <span className="avatar" aria-label="Your account">{initials}</span>
      </div>
    </header>
  );
}
