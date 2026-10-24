# BrandGuard AI

A brand-governance assistant: paste marketing copy, pick or edit a brand profile, run a review, and get explained findings plus a suggested draft. Findings are advisory; a human approves content before publication.

**Status:** Round 2 build in progress. See `PROGRESS_TRACKER.md` for what works and what is next.

## Run locally (Node 20.12+)

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

Open http://localhost:5173 and click **Review content**. The app has five pages: Overview, Brand Profiles, Content Review, Review History and Settings.

## Configuration

- `backend/.env.example` - PORT, CORS_ORIGIN, MAX_TEXT_LENGTH. Never commit a real `.env`.
- `frontend/.env.example` - VITE_API_URL (empty in development; set to the public backend URL in production).
- API keys (for the LLM step) belong only in backend environment variables.

## Structure

See the file map in `PROGRESS_TRACKER.md`.
