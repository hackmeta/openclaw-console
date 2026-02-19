# OpenClaw Console - User Dashboard

## Overview

User control panel for managing OpenClaw instances, billing, and logs.

## Tech Stack

Next.js 15 + Tailwind CSS + TypeScript

## Pages

- `/login`, `/register` - Authentication
- `/dashboard` - Instance list overview
- `/instances/new` - Create new instance
- `/instances/[id]` - Instance details + logs
- `/billing` - Subscription management
- `/docs` - Help documentation
- `/settings` - Account settings

## Development

```bash
pnpm install && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

## Build

```bash
pnpm build
pnpm start
```

## License

MIT
