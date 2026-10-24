import React from "react";
import { OverviewIcon, LayersIcon, ScanTextIcon, HistoryIcon, SlidersIcon, ShieldCheckIcon } from "./Icons.jsx";

export const PAGES = [
  { id: "overview", label: "Overview", Icon: OverviewIcon },
  { id: "profiles", label: "Brand Profiles", Icon: LayersIcon },
  { id: "review", label: "Content Review", Icon: ScanTextIcon },
  { id: "history", label: "Review History", Icon: HistoryIcon },
  { id: "settings", label: "Settings", Icon: SlidersIcon },
];

export default function Sidebar({ page, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-logo"><ShieldCheckIcon size={20} /></span>
        <span className="brand-name">BrandGuard AI</span>
      </div>
      <p className="nav-label">WORKSPACE</p>
      <nav className="nav" aria-label="Main">
        {PAGES.map(({ id, label, Icon }) => (
          <button key={id} type="button" className={page === id ? "nav-item active" : "nav-item"}
            aria-current={page === id ? "page" : undefined} onClick={() => onNavigate(id)}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <p className="sidebar-footer">Your brand standards, in every draft.</p>
    </aside>
  );
}
