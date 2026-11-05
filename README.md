# Wrap Studio

A lightweight Next.js vehicle preview studio. Browse commercial vans, compare
viewing angles, and preview a selection of paint finishes in a clean,
responsive interface.

## Requirements

- Node.js 20.9 or newer

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the studio.

## Available commands

- `npm run dev` — start the local development server
- `npm run build` — create a production build
- `npm start` — serve a production build
- `npm run lint` — check the application with ESLint

Vehicle photos are stored in `public/vehicles`. Camera angles can be selected
from the view thumbnails or the previous/next buttons; the preview does not
react to pointer movement.
