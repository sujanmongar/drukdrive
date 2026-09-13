# DrukDrive

A coded, clickable front-end prototype of **DrukDrive** — a cab, rental and self-drive vehicle booking platform for Bhutan — built to accompany a portfolio case study.

Recreates the key screens from the Figma design (desktop + mobile) as a real, navigable React app: sign in / sign up, the customer booking flow (search → vehicle details → payment → confirmation/invoice), a customer account area, and a service-provider (driver) dashboard.

**This is a front-end-only prototype.** There is no backend — all data (vehicles, bookings, users, notifications, reviews, earnings) is static mock data in [`src/data/mockData.ts`](src/data/mockData.ts), and "payment" is simulated.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- [React Router v7](https://reactrouter.com) for client-side routing
- [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`, config lives in `src/index.css`)

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Project structure

```
src/
  components/   shared UI: Button, Icon, Header, Footer, PageShell, VehicleCard, ...
  data/         mock data (vehicles, bookings, users, notifications, reviews, ...)
  lib/          route constants (lib/routes.ts) and shared fare math (lib/pricing.ts)
  pages/
    auth/       sign in, sign up, OTP, forgot/reset password, role select
    customer/   home, search results, vehicle details, checkout, profile/*
    provider/   the driver-side dashboard (bookings, vehicles, finance, account)
```
