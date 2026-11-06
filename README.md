# Vehicle Wrap Studio

An interactive 3D WebGL commercial fleet wrap studio and finish configurator built with Next.js.

## Requirements

- Node.js 20.9 or newer

## Getting started

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the studio.

## Available commands

- `pnpm run dev` — start the local development server
- `pnpm run build` — create a production build
- `pnpm start` — serve a production build
- `pnpm run lint` — check the application with ESLint

## Project Structure

- `public/models/` — Default 3D vehicle models (`.glb`) and `credits.json` CC BY 4.0 attribution manifest.
- `public/wraps/` — Default full-body vinyl wrap textures (`.svg`, `.png`, `.jpg`, `.webp`).
- `public/templates/` — Reference 2:1 unfolded vehicle skin template (`unfolded-wrap-reference.png`).
