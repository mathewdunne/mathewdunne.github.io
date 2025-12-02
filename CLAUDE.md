# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a personal portfolio website with a linktree-style layout deployed to GitHub Pages at `mathewdunne.github.io`. The site features an animated starfield background, real-time Spotify integration showing currently playing music, and social media links.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling and dev server
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **TanStack Query** for data fetching (Spotify API)
- **React Icons** (specifically `react-icons/fa6` for FontAwesome 6 icons)

## Development Commands

### Essential Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (typically runs on http://localhost:5173)
npm run build        # Build for production (outputs to ./dist)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run prettier     # Format code with Prettier
```

### TypeScript

The build command runs TypeScript compiler before building: `tsc -b && vite build`

## Architecture

### Entry Point & App Structure

- **Entry**: `src/main.tsx` initializes React with StrictMode and wraps the app in `QueryClientProvider` (TanStack Query)
- **Root Component**: `src/App.tsx` contains the entire single-page layout with header, social links, and footer

### Component Architecture

The app follows a simple component hierarchy:

```
App.tsx (root)
├── ShootingStars (background animation)
├── StarsBackground (starfield effect)
├── Header (logo + name)
├── About Section (intro text)
├── LinkCard[] (social media links)
│   └── SpotifyNowPlaying (conditional render inside Spotify card)
└── Footer (MadeWith + copyright)
```

### Key Patterns

**Social Links System**: Social links are defined centrally in `src/constants/socialLinks.ts` as an array of `SocialLink` objects containing icon, title, and URL. The main app maps over this array to render `LinkCard` components with staggered animation delays.

**Spotify Integration**: The `SpotifyNowPlaying` component uses TanStack Query to fetch data from `https://spotify.mathewdunne.ca/` every 30 seconds. It conditionally renders inside the Spotify `LinkCard` when `isPlaying: true`. The component features album art, track info, and an animated equalizer using Framer Motion.

**Path Alias**: The project uses `@/` as an alias for `./src` (configured in `vite.config.ts` and `tsconfig.json`). Always use this alias for imports (e.g., `@/components/ui/shooting-stars`).

**Utility Function**: `src/lib/utils.ts` exports a `cn()` function that combines `clsx` and `tailwind-merge` for conditional className management.

**TypeScript Types**: All type definitions are centralized in `src/types/index.ts`, including `SocialLink` and `SpotifyResponse` (discriminated union with `isPlaying` field).

### Animation Strategy

All animations use Framer Motion with staggered delays:

- Header/Logo: delay 0.2s
- About section: delay 0.5s
- LinkCards: start at 0.7s + index \* 0.1s
- Background effects render continuously

## Deployment

The site deploys automatically to GitHub Pages via `.github/workflows/deploy.yml`:

- Triggers on pushes to `main` branch
- Builds the project (`npm run build`)
- Deploys `./dist` folder to GitHub Pages
- Custom domain configured via `CNAME` file

## Project-Specific Notes

### Adding New Social Links

Edit `src/constants/socialLinks.ts` and import the appropriate icon from `react-icons/fa6`. The LinkCard will automatically render with proper animation timing.

### Spotify API

The Spotify "Now Playing" feature depends on an external API at `https://spotify.mathewdunne.ca/`. The API returns either:

- `{ isPlaying: true, title, artist, album, albumImageUrl, url }` when playing
- `{ isPlaying: false }` when not playing

The component only displays when `isPlaying: true` and uses AnimatePresence for smooth mount/unmount.

### UI Components

Custom UI components in `src/components/ui/` (shooting-stars, stars-background) are likely sourced from a UI library or template. Treat these as stable, self-contained animation components.
