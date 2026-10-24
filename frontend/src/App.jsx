import React, { useEffect, useState } from "react";
import Sidebar, { PAGES } from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import BrandProfilesPage from "./pages/BrandProfilesPage.jsx";
import ContentReviewPage from "./pages/ContentReviewPage.jsx";
import ReviewHistoryPage from "./pages/ReviewHistoryPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import useLocalStorage from "./hooks/useLocalStorage.js";
import { reviewContent } from "./services/reviewApi.js";
import { createHistoryEntry, addEntry } from "./utils/history.js";
import { DEFAULT_PROFILE, SAMPLE_CONTENT, SAMPLE_REVIEW } from "./utils/sampleData.js";

const pageFromHash = () => {
  const id = window.location.hash.replace("#", "");
  return PAGES.some((page) => page.id === id) ? id : "review";
};

export default function App() {
  const [page, setPage] = useState(pageFromHash);
  const [profile, setProfile] = useLocalStorage("brandguard.profile", DEFAULT_PROFILE);
  const [history, setHistory] = useLocalStorage("brandguard.history", []);
  const [settings, setSettings] = useLocalStorage("brandguard.settings", { initials: "AC" });
  const [text, setText] = useState(SAMPLE_CONTENT);
  const [review, setReview] = useState({ result: SAMPLE_REVIEW, isSample: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onHashChange = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function navigate(id) {
    window.location.hash = id;
    setPage(id);
  }

  async function runReview() {
    setLoading(true);
    setError("");
    try {
      const result = await reviewContent(text, profile);
      setReview({ result, isSample: false });
      setHistory((current) => addEntry(current, createHistoryEntry({ text, profileName: profile.brandName, result })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openFromHistory(entry) {
    setText(entry.text);
    setReview({ result: entry.result, isSample: false });
    setError("");
    navigate("review");
  }

  const pageLabel = PAGES.find((item) => item.id === page).label;
  const initials = settings.initials || "AC";

  return (
    <div className="shell">
      <Sidebar page={page} onNavigate={navigate} />
      <div className="workspace">
        <Topbar pageLabel={pageLabel} brandName={profile.brandName} initials={initials} />
        <main className="main">
          {page === "overview" && <OverviewPage history={history} brandName={profile.brandName} onNavigate={navigate} />}
          {page === "profiles" && <BrandProfilesPage profile={profile} onSave={setProfile} />}
          {page === "review" && (
            <ContentReviewPage brandName={profile.brandName} text={text} onTextChange={setText}
              review={review} loading={loading} error={error} onRun={runReview} />
          )}
          {page === "history" && (
            <ReviewHistoryPage history={history} onOpen={openFromHistory} onNavigate={navigate}
              onDelete={(id) => setHistory((current) => current.filter((entry) => entry.id !== id))} />
          )}
          {page === "settings" && (
            <SettingsPage brandName={profile.brandName} initials={initials}
              onInitialsChange={(value) => setSettings({ ...settings, initials: value })}
              historyCount={history.length} onClearHistory={() => setHistory([])}
              onResetProfile={() => setProfile(DEFAULT_PROFILE)} />
          )}
        </main>
      </div>
    </div>
  );
}
