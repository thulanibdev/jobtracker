# JobTracker

A student portfolio project for tracking job and internship applications.

[Live demo](https://jobtracker-beryl-eight.vercel.app/) · [Source](https://github.com/thulanibdev/jobtracker)

## Features

Application board, search, statistics, CSV export and optional AI cover letters.

The API validates input and returns explicit errors for missing configuration, provider failures and empty responses.

## Stack and data

Next.js 14, React, Tailwind CSS, browser localStorage and a server-side Anthropic API integration.

Browser-stored data belongs to the current browser profile. It does not sync to a user account, and clearing site data removes it. This is a portfolio project in ongoing development.

## Run locally

```bash
npm ci
cp .env.local.example .env.local
# Add the required API credentials locally.
npm run dev
```

Open http://localhost:3000. Set `ANTHROPIC_API_KEY` for cover-letter generation. The tracker works without it. API usage may incur provider charges; do not expose a paid key in client code.

## Verification

```bash
npm test
npm run build
```

The tests cover the project's persistence or business logic and error cases. They do not validate third-party services or prove that every live-demo feature works.

## Development priorities

Improve accessibility, document design decisions and add integration coverage as the project develops. Keep secret keys in local environment configuration and out of Git.
