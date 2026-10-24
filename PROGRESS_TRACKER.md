# BrandGuard AI - Progress Tracker (resume file)

> **If the chat/connection breaks:** upload this file + the latest repo ZIP to the new chat and say
> "Read PROGRESS_TRACKER.md and PROJECT_MASTER_PLAN.txt, verify the repo, then continue from NEXT ACTIONS."
> The repository is the source of truth. Verify before assuming anything below is still true.

Team: INNOVEXA | Hackathon: Future Stack, Round 2 (The Build) | Plan file: PROJECT_MASTER_PLAN.txt

## 1. Current state (updated: 2026-10-23, session 2)

| Area | State |
|---|---|
| Backend (Express, rules-only review) | Written. Core logic unit-tested (19/19 pass). HTTP layer with real Express NOT yet run. |
| Frontend (React + Vite) | **Redesigned in session 2 to match the team's UI screenshot** (dark theme, sidebar, 5 pages). Checked in headless Chromium with a mocked API: all 5 pages render, review flow works, no console errors. Real `npm install` / `vite build` NOT yet run. |
| LLM integration | NOT started (waiting for provider decision + API key). Rules-only mode works. |
| Deployment | NOT started. |
| Round 2 PDF | NOT started. |

## 2. Roadmap checklist (from master plan, section 7)

- [x] STEP 0 - Project created (no starter ZIP was provided, so repo was created from scratch)
- [~] STEP 0 - Install dependencies, start both apps, call /api/health and /api/review  **(you must do this: sandbox had no network)**
- [x] STEP 1 - Rule-based workflow: validation, length limit, findings with category/severity/snippet/reason/suggestion, disclaimer, error handling (code + unit tests done; manual browser test pending)
- [x] STEP 2 - Editable brand profile (form -> sent with each request; sample profile by default) (code done; manual test pending)
- [ ] STEP 3 - LLM-assisted review (one provider, adapter module, schema validation, timeout, fallback to rules)
- [~] STEP 4 - Original vs suggested draft with copy (original stays in the editor, suggested revision shown separately with Copy; per-suggestion selection not built)
- [x] UI REDESIGN (session 2) - matches screenshot `BrandGuard_AI_website.png`; 5 prototype features = 5 sidebar pages (see section 3)
- [ ] STEP 5 - Reliability test pass (empty, long, LLM timeout, invalid JSON, backend down, mobile, repeated reviews)
- [ ] STEP 6 - Deploy backend + frontend, test public links signed out
- [ ] STEP 7 - Round 2 submission (links, updated PDF, honest feature list, 3 Round 3 improvements)

## 3. Session log

### Session 1 - 2026-10-22
- Read PROJECT_MASTER_PLAN.txt. No starter ZIP existed, so created `brandguard-ai/` from scratch following section 6 structure (smaller: files split only where useful).
- Backend: `src/app.js`, `server.js`, `config/env.js` (native .env loading, no dotenv), `routes/reviewHandler.js` (Express-free handler, testable), `routes/reviewRoutes.js`, `routes/brandRoutes.js`, `services/ruleEngine.js`, `services/reviewService.js`, `validators/requestSchema.js`, `data/sampleBrandProfile.json`.
- Frontend: `App.jsx`, components (BrandProfilePanel, ContentEditor, ReviewResults, IssueCard, RevisedDraft), `services/reviewApi.js`, `utils/profileForm.js`, `utils/sampleContent.js`, `styles.css` (plain CSS).
- Tests run: `node --test` in backend -> 19 passed, 0 failed. Frontend: esbuild bundle OK + server-render smoke test OK.
- NOT tested: `npm install`, real Express server, CORS, browser UI, `vite build`, mobile layout, deployment.
- Decisions: plain CSS (no Tailwind); no dotenv; sample profile served by `GET /api/brand/sample`; `analysisMode: "rules_only"`; overall assessment values are `needs_review` / `no_issues_found` (never "approved"); claim flags always say "verify", never "false".
- Blockers: sandbox has no network, so dependencies could not be installed here.

### Session 2 - 2026-10-23 (UI redesign + 5 features)
- Team asked for the UI to match their design screenshot exactly and for at least 5 prototype features.
- Measured colours/spacing from the screenshot (sidebar #1e273e, topbar #2b374a, page #374357, cards #111d30, accent #387cff, font DM Sans) and rebuilt the frontend.
- **5 features (pages):** Overview (stats + recurring issues from history), Brand Profiles (edit + save profile), Content Review (draft editor, findings, suggested revision + copy), Review History (saved reviews, open/delete), Settings (initials, engine info, clear history, reset profile). Plus working Help and Notifications menus in the top bar.
- Persistence: profile, history, settings in browser localStorage (no database). History is a P2 item in the master plan; built now because the team requires 5 features.
- The first load shows a clearly labelled **Sample review** (static demo data in `utils/sampleData.js`); after "Review content" the chip changes to **Live review** and the result comes from the backend.
- Removed old components (BrandProfilePanel, ContentEditor, ReviewResults, IssueCard, RevisedDraft) - replaced by pages/ + FindingCard.
- Backend: sample profile renamed to "Acme Core" (matches design); suggestion wording made shorter ("Replace ... with ..."); tests updated, still 19/19.
- Verified in Chromium: layout matches the design structure (sidebar, topbar, two cards, button, chips). The sandbox has no DM Sans font, so text wrapping/heights could only be checked with a fallback font. Final pixel check must be done on a machine with internet (Google Fonts loads DM Sans).
- Tested: review flow with mocked API, empty-input button disabled, network-failure message, profile save updates the top-bar pill, all pages open without console errors.
- NOT tested: real backend + frontend together, `vite build`, mobile device, 500-error path in browser.
- Decisions: `DEFAULT_PROFILE` in `frontend/src/utils/sampleData.js` duplicates `backend/src/data/sampleBrandProfile.json` (keep in sync); frontend no longer calls `GET /api/brand/sample` (endpoint kept).

## 4. NEXT ACTIONS (do in this order)

1. **You:** `cd backend && npm install && npm test && npm start` -> open http://localhost:5000/api/health (expect `{"status":"ok",...}`).
2. **You:** `cd frontend && npm install && npm run dev` -> open http://localhost:5173 (needs internet for the DM Sans font). Click "Review content", then visit all 5 pages. Compare with your design screenshot and report any visible difference (with a screenshot) so it can be fixed.
3. **Decide the LLM provider** (OpenAI / Gemini / Anthropic): which one does the team have an API key + quota for? Then build STEP 3 in `backend/src/services/reviewProvider.js`.
4. Then STEP 5 (reliability tests), STEP 6 (deploy), STEP 7 (submission).

## 5. File map

```
PROJECT_MASTER_PLAN.txt     plan from team (section 13 now points here)
PROGRESS_TRACKER.md         this file - update every session
README.md                   how to run
backend/src/app.js          Express app (CORS, JSON limit, health, error handler)
backend/src/server.js       starts the server
backend/src/config/env.js   env variables
backend/src/routes/         reviewHandler.js (logic), reviewRoutes.js, brandRoutes.js
backend/src/services/       ruleEngine.js (rules), reviewService.js (orchestration; LLM goes here later)
backend/src/validators/     requestSchema.js
backend/tests/              node:test unit tests
frontend/src/               App.jsx, pages/ (5 pages), components/ (Sidebar, Topbar, FindingCard, Icons, PageHeading), hooks/useLocalStorage.js, services/reviewApi.js, utils/ (sampleData, history, profileForm), styles.css
```

## 6. API contract (current, matches master plan section 12)

`POST /api/review` body `{ text, brandProfile? }` -> `{ overallAssessment, issues[{category,severity,snippet,reason,suggestion}], revisedDraft, humanReviewRequired, analysisMode }`.
Errors: `{ error: { code, message } }` (400 invalid request, 413 too large, 500 generic). Also `GET /api/health`, `GET /api/brand/sample`.

## 7. Known limitations (honest list)

- Rules only: tone/voice traits are stored but not checked until the LLM step.
- Revised draft only applies mechanical edits (preferred terms, repeated "!", ALL CAPS). Avoid-words and risky claims are left for a human.
- No persistence, auth, history or deployment yet (P2 items).
