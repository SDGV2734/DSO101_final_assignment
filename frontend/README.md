# CST Booking System Frontend

React + Vite + TypeScript + Tailwind frontend for the CST Booking System.

## Features

- Student login and registration screens.
- Protected dashboard with upcoming booking summary.
- Laundry washer/dryer availability and reservation flow.
- Football ground availability and reservation flow.
- Student booking history with cancellation actions.
- In-app notifications list with mark-as-read support.
- Responsive Tailwind UI using the CST Booking System visual theme.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

The backend should run at `http://localhost:4000` by default.

## Environment

```env
VITE_API_URL="http://localhost:4000/api"
```

## Useful Commands

```bash
npm run dev
npm run lint
npm run build
npm run preview
```
