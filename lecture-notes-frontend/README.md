# AI Lecture Notes Assistant

A web app that turns lecture recordings into structured, searchable study material. Upload an audio recording and it's transcribed automatically, with AI-generated key concepts, definitions, formulas, and teacher-emphasized points extracted for you — all organized by course, with a chat interface to ask questions across an entire course's lectures.

This is the frontend (Next.js). It talks to a separate backend API for transcription, note generation, and chat — see [AI Lecture Notes Backend](https://github.com/Zee-Gg/AI-Lecture-Notes-Backend).

## Features

- **Email/password auth** via Supabase, with protected routes
- **Courses** — create, rename inline, and delete
- **Lecture upload** — attach an audio recording (up to 45MB) to a course
- **Automatic processing** — lectures move through `pending → processing → done`/`failed`, with live status polling and one-click retry on failure
- **AI-generated notes** — key concepts, definitions, formulas, and emphasized points per lecture
- **Full transcript view** — per-segment transcript alongside the notes
- **Course-level Q&A chat** — ask questions across every lecture in a course, with answers cited back to the source lecture and timestamp

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) for authentication
- [react-markdown](https://github.com/remarkjs/react-markdown) for rendering chat responses

## Getting started

### Prerequisites

- Node.js 18.18+ and npm
- A Supabase project (for auth)
- The backend API running locally or deployed — see [AI Lecture Notes Backend](https://github.com/Zee-Gg/AI-Lecture-Notes-Backend)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root with:

   | Variable | Description |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase project's anon/public API key |
   | `NEXT_PUBLIC_BACKEND_URL` | Base URL of the backend API (e.g. `http://localhost:8000`) |

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
app/
  page.tsx              Landing page
  login/, signup/        Auth pages
  dashboard/              Course list
  courses/[id]/           Lecture list + course chat for a single course
  lectures/[id]/          Lecture detail: status, notes, transcript
  components/            Shared UI (cards, modals, chat, status badges, etc.)
  context/AuthContext.tsx Supabase auth session provider
  hooks/useLecturePolling.ts  Polls a lecture until processing finishes
  lib/                    Supabase client + authenticated API fetch helper
  types/database.ts       Shared TypeScript types
```

## Deploying

This app is set up for [Vercel](https://vercel.com). If you're deploying from a GitHub repo where this Next.js project lives in a subfolder (rather than the repo root), set the Vercel project's **Root Directory** (Settings → General) to that subfolder, or the build won't find `package.json` and every route will 404.
