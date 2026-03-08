# LifeGuard AI

An AI-powered health assistant built with Next.js that triages symptoms, generates shareable PDF reports, suggests diet plans, estimates lifestyle risk, finds nearby hospitals via OpenStreetMap, and offers an AI chatbot for follow-up questions—all in a responsive Tailwind UI.

## Features
- Symptom checker (Groq LLM) with concise triage advice
- AI Health Report with recommendations + one-click PDF export (jsPDF)
- Diet plan generator (goal/activity/restrictions aware)
- Lifestyle risk estimator; dashboard metrics (Health Score, BMI, Sleep Quality, Stress Level)
- Nearby hospitals via Overpass/OSM (no paid maps); fallback list
- AI health chatbot for quick Q&A
- Profile page with local storage (age, weight, height, lifestyle, allergies, etc.)

## Stack
- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, framer-motion; jsPDF for client PDF
- Groq LLM (GROQ_API_KEY) for AI endpoints
- Overpass/OSM for hospital search
- Node.js runtime for API routes (no separate backend needed)

## Setup
1. `cd web`
2. `npm install`
3. Create `.env.local`:
4. GROQ_API_KEY=your_key_here
5. `npm run dev` and open http://localhost:3000

## Usage (key flows)
- Symptom checker: enter symptoms → Analyze
- Health report: fill symptoms/name/age → Generate AI Health Report → Download PDF
- Diet plan: fill age/weight/height/goal/activity/restrictions → Get Diet Plan
- Risk: fill age/stress/sleep/exercise → Predict Risk updates dashboard cards
- Hospitals: click Find Nearby Hospitals (uses geolocation + OSM)
- Chatbot: open floating AI chat and ask questions
- Profile: edit and Save (stored locally in browser)

## Build & Run
- Dev: `npm run dev`
- Prod build: `npm run build`
- Start: `npm start`

## Notes
- Keep your `GROQ_API_KEY` secret; do not commit `.env.local`.
- Overpass/OSM is free; no billing required.
- PDF export is client-side, no server dependency.
