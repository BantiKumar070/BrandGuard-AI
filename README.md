# BrandGuard AI

> **Your brand standards, in every draft.**
> A brand-governance assistant that checks marketing copy against a company's brand rules, explains every finding, suggests a cleaner draft, and routes the content through a human approval workflow before it goes live.

Built by **Team INNOVEXA** for the **Future Stack Hackathon** (Round 1 → Round 2 → Round 3). Deployed on **Vercel** (React frontend + Express backend in one repository).

---

## Table of contents

1. [The problem](#the-problem)
2. [Project journey (Round 1 → Round 3)](#project-journey-round-1--round-3)
3. [Features](#features)
4. [Roles and permissions](#roles-and-permissions)
5. [How it works](#how-it-works)
6. [Tech stack](#tech-stack)
7. [Project structure](#project-structure)
8. [API reference](#api-reference)
9. [Run locally](#run-locally)
10. [Configuration](#configuration)
11. [Deploy on Vercel](#deploy-on-vercel)
12. [Testing](#testing)
13. [Security notes](#security-notes)
14. [Known limitations and roadmap](#known-limitations-and-roadmap)
15. [Responsible-use note](#responsible-use-note)

---

## The problem

Marketing teams, agencies and brand managers publish a lot of copy. Brand voice drifts, banned words slip in, preferred terminology is forgotten, and risky claims ("guaranteed", "100%", "#1") go out without evidence. Manual review is slow and inconsistent.

BrandGuard AI makes that review **fast, explainable and accountable**: it flags problems with a reason and a fix, and a person always makes the final call.

**Product principle:** help humans make better brand decisions. BrandGuard never says a claim is *false* or that content is *legally compliant*. A claim flag only means **"verify against approved evidence."**

---

## Project journey (Round 1 → Round 3)

| Round | Theme | What happened |
|---|---|---|
| **Round 1** | Idea and design | The team defined the product: a brand-governance assistant for marketing teams, the core user journey (pick a brand profile → paste content → run a review → read explained findings → copy a revised draft → human approves) and the dark workspace UI design (`BrandGuard_AI_website.png`) with five prototype features. |
| **Round 2** | The build | The idea became a working, **publicly deployed** app. Express backend with a rule-based review engine and request validation; React + Vite frontend with five pages; editable brand profile; review history; empty / long-input / API-failure states; a human-approval reminder everywhere. Deployed on Vercel (`vercel.json` with two services and `/api` rewrites). |
| **Round 3** | Production features | **Authentication and authorization** (signup, login, three roles) plus **two new features**: an **Approval Workflow** and a **Brand Compliance Score with Team Insights**. Existing routes, links and response shapes were kept intact so the live deployment stays compatible. |

### Round 1 - idea and design
- Problem and target users: marketing teams, content writers/agencies, brand managers, review/compliance teams.
- Core journey and the principle "advisory findings, human approval".
- UI design with a left sidebar, top bar and two-card content-review layout.

### Round 2 - working MVP
- **Backend:** `POST /api/review` with validation (empty text, 5,000-character limit, bad JSON), a deterministic **rule engine** (avoid-list words, preferred terms, risky-claim patterns, style checks), health check, CORS, safe error messages (no stack traces).
- **Frontend:** Overview, Brand Profiles, Content Review, Review History, Settings; loading, empty, too-long and network-failure states; copy-to-clipboard for the suggested revision; profile, history and settings saved in the browser.
- **Quality:** 19 backend unit tests, plain CSS (no UI framework), no unnecessary dependencies.
- **Deployment:** Vercel monorepo with `frontend` (Vite) and `backend` (Express) services.

### Round 3 - authentication, authorization and two features
- **Auth:** signup / login, password hashing with `scrypt`, signed JWT sessions, role-based access control (`creator`, `reviewer`, `manager`). No new npm packages were added.
- **Feature 1 - Approval Workflow:** submit → server-side review → approve or request changes → edit and resubmit, with a full decision history.
- **Feature 2 - Brand Compliance Score + Team Insights:** a 0-100 score per submission, approval rate, queue size, role management and an activity log.
- **Testing:** 8 new backend tests (27 total, all passing) plus an end-to-end browser run of the full flow.

---

## Features

### Content review (Round 2)
- Paste marketing copy and review it against a **brand profile**.
- Findings include **category, severity (high / medium / low), reason and suggestion**.
- Checks: avoid-list words, preferred terminology, unsupported or absolute claims (guarantees, statistics, superlatives, health/result claims), repeated "!" and ALL-CAPS words.
- **Suggested revision** with a Copy button. Only safe, mechanical edits are applied automatically; risky claims are left for a human.
- **Brand Profiles:** edit brand name, voice, avoid words, preferred terms and notes.
- **Review History** and **Overview** (stats and recurring issues) stored in the browser, separately for each signed-in account.

### Authentication and authorization (Round 3)
- Sign up and sign in from a dedicated page; session restored on reload; automatic sign-out when a token expires or is invalid.
- Pages and API routes are protected by role. Hiding a menu item is never the only protection - the server enforces every rule.

### Feature 1 - Approval Workflow (Round 3)
1. A **Creator** reviews a draft and clicks **Submit for approval**.
2. The **server re-runs the review itself**, so the score and findings cannot be faked by the client.
3. A **Reviewer** or **Manager** opens the *Approvals* page and either **approves** or **requests changes** (a comment is required).
4. The Creator edits the draft and **resubmits**; earlier decisions stay on record.

Rules: nobody can decide on their own submission, only pending items can be decided, and Creators only see their own submissions.

### Feature 2 - Brand Compliance Score + Team Insights (Round 3)
- Every submission gets a **Brand Compliance Score (0-100)**: starts at 100, minus 15 per high, 8 per medium and 3 per low finding (labels: Excellent, Good, Needs work, At risk).
- **Team Insights** (Reviewer and Manager): average score, approval rate and number of items waiting for review.
- **Manager only:** team member list with role management, and an activity log of recent actions (submitted, approved, requested changes, resubmitted).

---

## Roles and permissions

| Capability | Creator | Reviewer | Manager |
|---|:-:|:-:|:-:|
| Review content, edit brand profile, local history | ✅ | ✅ | ✅ |
| Submit drafts for approval | ✅ | ✅ | ✅ |
| See own submissions | ✅ | ✅ | ✅ |
| See everyone's submissions | ❌ | ✅ | ✅ |
| Approve / request changes (not on own work) | ❌ | ✅ | ✅ |
| Team Insights (score, approval rate) | ❌ | ✅ | ✅ |
| Manage user roles, view activity log | ❌ | ❌ | ✅ |

- New sign-ups are always **Creators**. The **first account created becomes Manager**, or any email listed in `ADMIN_EMAILS`.
- Managers cannot change their own role (this prevents locking everyone out).

---

## How it works

```
React UI (Vite)
   │  Authorization: Bearer <JWT>
   ▼
Express API ── CORS · JSON size limit · rate limit on login/signup
   ├─ /api/auth/*          signup, login, me
   ├─ /api/users/*         role management        (manager)
   ├─ /api/submissions/*   approval workflow      (signed-in; decisions: reviewer/manager)
   ├─ /api/insights        score + activity       (reviewer/manager)
   └─ /api/review          rule-based review      (signed-in)
            │
            ├─ validation → rule engine → findings + suggested draft
            └─ storage adapter → Upstash Redis (production) or memory (local)
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, plain CSS (dark theme, DM Sans) |
| Backend | Node.js 20+, Express 4, ES modules |
| Auth | `scrypt` password hashing and HS256 JWT using Node's built-in `crypto` |
| Storage | Upstash Redis over REST in production, in-memory fallback for local use |
| Review engine | Deterministic rules (LLM step planned) |
| Tests | Node's built-in test runner (`node --test`) |
| Hosting | Vercel (two services, `/api` rewritten to the backend) |

---

## Project structure

```
BrandGuard-AI/
├── vercel.json                  Vercel services + /api rewrites
├── PROGRESS_TRACKER.md          Session-by-session log and honest status
├── PROJECT_MASTER_PLAN.txt      Original plan and priorities
├── backend/
│   ├── src/
│   │   ├── app.js               Express app and wiring
│   │   ├── server.js            Local server entry
│   │   ├── config/env.js        Environment variables
│   │   ├── routes/              review, brand, auth, submission routes
│   │   ├── services/            ruleEngine.js, reviewService.js
│   │   ├── validators/          request validation
│   │   ├── auth/                crypto (scrypt, JWT), auth service, middleware, rate limit
│   │   ├── workflow/            submission service, compliance score
│   │   ├── store/store.js       Upstash / memory storage adapter
│   │   └── data/                sample brand profile
│   └── tests/                   27 tests (rules, validation, handler, auth, workflow)
└── frontend/
    └── src/
        ├── App.jsx, main.jsx    App shell and sign-in gate
        ├── auth/                AuthContext (session handling)
        ├── pages/               Overview, Brand Profiles, Content Review,
        │                        Review History, Approvals, Team Insights,
        │                        Settings, Login / Signup
        ├── components/          Sidebar, Topbar, FindingCard, Badges, Icons
        ├── services/            API client, auth API, session helper
        └── utils/, hooks/       profile form, history, local storage
```

---

## API reference

All errors use the shape `{ "error": { "code": "...", "message": "..." } }`.

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | public | Health check |
| GET | `/api/brand/sample` | public | Sample brand profile |
| POST | `/api/auth/signup` | public | Create account `{ name, email, password }` |
| POST | `/api/auth/login` | public | Sign in `{ email, password }` → `{ token, user }` |
| GET | `/api/auth/me` | signed in | Current user |
| POST | `/api/review` | signed in | Review content `{ text, brandProfile? }` |
| POST | `/api/submissions` | signed in | Submit a draft for approval |
| GET | `/api/submissions` | signed in | List submissions (Creators: own only) |
| GET | `/api/submissions/:id` | signed in | One submission |
| PUT | `/api/submissions/:id` | author | Edit and resubmit after "changes requested" |
| POST | `/api/submissions/:id/decision` | reviewer, manager | `{ decision: "approve" \| "request_changes", comment }` |
| GET | `/api/insights` | reviewer, manager | Score, approval rate, queue (activity log: manager) |
| GET | `/api/users` | manager | List users |
| PATCH | `/api/users/:id/role` | manager | Change a role |

---

## Run locally

Requires **Node 20.12+**.

```bash
# terminal 1 - backend (http://localhost:5000)
cd backend
cp .env.example .env
npm install
npm test
npm start

# terminal 2 - frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Open https://brandguard-ai-omega.vercel.app/ , **create an account** (the first one becomes Manager), then try **Content Review → Review content → Submit for approval**.
To see the workflow end to end, create a second account (a Creator), submit a draft, then sign in as the Manager to review it.

Locally, no database is needed: storage falls back to memory and a temporary JWT secret is generated (accounts reset when the backend restarts).

---

## Configuration

**`backend/.env`** (never commit a real `.env`):

| Variable | Required | Description |
|---|---|---|
| `PORT` | no | Backend port (default 5000) |
| `CORS_ORIGIN` | no | Comma-separated allowed frontend origins |
| `MAX_TEXT_LENGTH` | no | Max characters per review (default 5000) |
| `JWT_SECRET` | **production** | Long random string used to sign sessions |
| `ADMIN_EMAILS` | no | Emails that become Manager when they sign up |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | **production** | Storage (also accepts `KV_REST_API_URL` / `KV_REST_API_TOKEN`) |

Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

**`frontend/.env`:** `VITE_API_URL` - leave empty in development and on Vercel (same domain); set it only if the backend is hosted elsewhere.

API keys (for the planned LLM step) belong only in backend environment variables.

---

## Deploy on Vercel

1. Import the repository in Vercel (the root `vercel.json` defines the `frontend` and `backend` services).
2. Add environment variables: **`JWT_SECRET`** (required) and optionally `ADMIN_EMAILS`.
3. Connect **Upstash Redis** from the Vercel Marketplace (free tier) - it adds the REST URL and token automatically. Without it, accounts and submissions are lost on cold starts.
4. Redeploy, open the site, and sign up. The first account becomes Manager.

If `JWT_SECRET` is missing in production, the auth endpoints return a clear *"Authentication is not configured"* error instead of running insecurely.

---

## Testing

```bash
cd backend && npm test
```

**27 tests, all passing:**
- Rule engine, request validation and review handler (Round 2 - 19 tests)
- Password hashing (including rejection of empty or malformed hashes) and JWT (tampered, wrong-secret and expired tokens)
- Signup / login rules, role-based access, token-based protection of `/api/review`
- Full approval workflow: submit, decide, resubmit, visibility rules, self-approval blocked, insights and activity log

The full user flow was also exercised in a real browser (headless Chromium) against a running backend: signup, login errors, role-based menus, submit, approve / request changes, resubmit, role change, session restore after reload and invalid-token handling, with no console errors.

---

## Security notes

- Passwords are hashed with `scrypt` and a random salt; they are never stored or returned in plain text.
- Login and unknown-email errors share one message to avoid revealing which emails exist.
- Sessions are signed JWTs; the server re-reads the user on every request, so role changes apply immediately.
- Authorization is enforced on the server for every protected route.
- Login and signup are rate limited (per server instance).
- Request size is limited and error responses never expose stack traces.
- Secrets live in environment variables only.

---

## Known limitations and roadmap

**Current limitations (honest list)**
- The review engine is **rule-based only**; tone and voice traits are stored but not yet checked.
- The suggested revision only applies mechanical fixes (preferred terms, repeated "!", ALL CAPS).
- Brand profile, review history and settings are stored in the **browser**, not on the server.
- The login rate limiter is per server instance (not shared across serverless instances).
- No password reset or email verification yet.

**Planned next steps**
- LLM-assisted review for tone and style, with schema validation and automatic fallback to the rules.
- Evidence-backed claim review: attach approved source documents and show supporting or missing evidence.
- Server-side, shared brand profiles for teams.
- PDF / CSV export of reviews and approval reports.

---

## Responsible-use note

BrandGuard AI supports human review - it does not replace it. Findings are advisory, a flagged claim means *"verify against approved evidence"*, and a person must approve content before it is published. The tool does not provide legal advice or guarantee legal compliance.

---

*Team INNOVEXA · Future Stack Hackathon*
