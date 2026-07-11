# Vidtube

A modern YouTube-inspired video platform frontend with a dark cyberpunk/neon UI.

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v4**
- **shadcn/ui** (Radix primitives)
- **React Router v7**
- **Axios** (API client)
- **Zustand** (state management)
- **Framer Motion** (animations)
- **Sonner** (toast notifications)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Environment

Copy `.env.example` to `.env`:

```
VITE_API_URL=http://localhost:8000
```

When the backend is unavailable, the app automatically falls back to **mock data** for development and testing.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — video grid with infinite scroll |
| `/watch/:videoId` | Watch page — player, comments, recommendations |
| `/channel/:username` | Channel profile with gradient banner |
| `/login` | Login with glassmorphism card |
| `/signup` | Signup with avatar/cover upload |

## Demo

- Browse videos on the home page (mock data loads if API is down)
- Visit `/channel/yashmittal` for the channel profile
- Click any video to open the watch page
- Login/signup works in **demo mode** when backend is offline

## Project Structure

```
src/
├── components/     # UI, layout, video components
├── pages/          # Route pages
├── services/       # Axios API layer
├── store/          # Zustand stores
├── hooks/          # Custom hooks
├── data/           # Mock data
└── lib/            # Utilities
```

## Build

```bash
npm run build
npm run preview
```
