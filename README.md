Beauty & Style Recommender (React + Express + Supabase)

Prerequisites
- Node 18+
- Supabase project (free tier is fine)

1) Setup env vars
Create `server/.env` from `server/.env.example` and fill keys:
```
PORT=4000
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
FLIPKART_AFFILIATE_ID=
FLIPKART_TOKEN=
AMAZON_ACCESS_KEY=
AMAZON_SECRET_KEY=
AMAZON_ASSOCIATE_TAG=
AJIO_RAPIDAPI_KEY=
```

Create `client/.env` (not committed) like:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE=http://localhost:4000
```

2) Supabase schema
Run the SQL in `supabase/schema.sql` in the Supabase SQL editor.
Enable email OTP in Auth → Providers.

3) Install and run (Next.js single app)
From repo root:
```
npm run install:all
npm run dev
```
App runs on http://localhost:5173

Notes
- Provider integrations return mock data when credentials are missing so the app runs out-of-the-box. Add keys later for real results.
- Never expose server secrets in the client. Put them in `.env.local`.


