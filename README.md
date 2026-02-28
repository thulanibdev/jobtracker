# 🚀 JobTracker AI — Smart Job Application Tracker

Track every internship and job application in one place, with an AI-powered cover letter generator built in.

## Features

- **🗂️ Kanban Board** — Drag applications across Applied → Interview → Offer → Rejected
- **✨ AI Cover Letter Generator** — Paste a job description, get a tailored cover letter powered by Claude AI
- **📊 Analytics Dashboard** — Response rate, interview conversion, weekly activity chart
- **🏷️ Skills Tagging** — Tag each application with required skills
- **📝 Notes** — Recruiter info, interview notes, follow-up reminders
- **📥 CSV Export** — Download all your applications as a spreadsheet
- **🔍 Search** — Filter by company or role instantly

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/jobtracker.git
cd jobtracker
npm install
```

### Set up your API key (for AI cover letters)

1. Get a free API key at [console.anthropic.com](https://console.anthropic.com)
2. Copy the example env file:
```bash
cp .env.local.example .env.local
```
3. Add your key to `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — comes preloaded with sample applications!

> **Note:** The app works fully without an API key — only the AI cover letter feature requires it.

## Deploy to Vercel

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add environment variable: `ANTHROPIC_API_KEY` = your key
4. Deploy!

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | React framework + API routes |
| Tailwind CSS | Styling |
| Claude AI (Haiku) | Cover letter generation |
| localStorage | Data persistence |
| Vercel | Deployment |

## What Makes This Stand Out

- **Real AI integration** via Anthropic API with a proper server-side API route
- **Drag and drop Kanban** built from scratch using HTML5 drag events
- **Production-quality UX** — loading skeletons, error states, keyboard shortcuts
- **The story** — "I built this to manage my own job search" is a memorable interview answer

## License

MIT
