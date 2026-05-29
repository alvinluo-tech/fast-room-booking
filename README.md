<div align="center">

# Durham Room

**Batch Room Booking Assistant for Durham University Students**

[简体中文](./README.zh-CN.md) | English

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

<br/>

A high-efficiency room booking tool built for St John's College students.
Select multiple time slots and batch-book in one click.

</div>

---

## Features

- **Batch Booking** — Select multiple time slots on the calendar and book them all at once. Supports quick-select by morning, afternoon, or evening.
- **Visual Calendar** — Clean monthly calendar view with today highlight, weekend tinting, and real-time slot availability.
- **Smart Management** — View all upcoming bookings, cancel with one click, and track batch booking progress with success/failure stats.
- **Auto-Retry** — Handles SimplyBook.it rate-limiting gracefully with exponential backoff (up to 3 retries).
- **Skeleton Loading** — Shimmer placeholders replace generic spinners for a smoother loading experience.
- **Dark Glassmorphism UI** — Polished dark-mode interface with Phosphor icons, ambient gradient orbs, and micro-interactions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Icons | [Phosphor Icons](https://phosphoricons.com/) |
| Fonts | [Geist](https://vercel.com/font) + Geist Mono |
| Booking API | [SimplyBook.it](https://simplybook.me/) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/alvinluo-tech/fast-room-booking.git
cd fast-room-booking

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/login    # Authentication
│   │   ├── slots/        # Fetch available slots
│   │   ├── book/         # Single booking
│   │   ├── batch-book/   # Batch booking
│   │   └── bookings/     # List & cancel bookings
│   ├── bookings/         # Bookings page
│   ├── login/            # Login page
│   ├── slots/            # Calendar & slot selection
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles & animations
├── components/           # Shared UI components
│   ├── GlassCard.tsx
│   ├── GradientButton.tsx
│   ├── GhostButton.tsx
│   ├── LoadingSpinner.tsx
│   ├── NavBar.tsx
│   ├── PageShell.tsx
│   └── StatusBadge.tsx
└── lib/
    └── simplybook.ts     # SimplyBook.it API client
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with feature overview |
| `/login` | SimplyBook.it authentication |
| `/slots` | Calendar view + time slot selection + batch booking |
| `/bookings` | Upcoming bookings list with cancel support |

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login with email & password |
| `GET` | `/api/slots` | Fetch available time slots |
| `POST` | `/api/book` | Book a single time slot |
| `POST` | `/api/batch-book` | Book multiple time slots |
| `GET` | `/api/bookings` | List all bookings |
| `DELETE` | `/api/bookings/[id]` | Cancel a booking |

## License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">

Built with Next.js, React, and Tailwind CSS

</div>
