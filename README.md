# Universal Tola's Day 🎂

A one-of-one digital magazine for Tola's 22nd birthday (1 July) — built from Tobi's brief.
It's a real **flipbook**: turn the pages by dragging a corner, tapping the ‹ › buttons, or
using the arrow keys. Phone-first, inspired by madeforanita.

## The issue, page by page
1. **Cover** — `Universal Tola's Day` masthead over the cover shot, with the cover lines (Sexy Since 01, She's Fabulous, A Real Life Princess, Hottest Girl Industrial Maths, Sexy 22).
2. **The Tola Times crossword** — an interactive newspaper puzzle. Fill it in (MATHS · FABULOUS · TOLA · JULY · QUEEN) and it reveals her birthday: **01 / 07**. Stuck? There's a "peek at the answers" button.
3. **Sexy Since 01** — throwback baby photos.
4. **She's Fabulous** — fashion / flower-wall shots.
5. **A Real Life Princess** — the red-gown hero.
6. **Hottest Girl, Industrial Maths** — corporate + campus shots.
7. **A Letter From Her Number One Fan** — the full letter, signed Tobi.
8. **The Final Page** — the heart from her equation `(x² + y² − 1)³ − x²y³ = 0`, plotted live on graph paper, then *Happy Birthday, Baby.*

## Run it locally
```bash
npm install
npm run dev      # opens a local dev URL
```

## Build / deploy
```bash
npm run build    # outputs static files to dist/
```
Deploy `dist/` anywhere static. Easiest (and matches the inspo): push to GitHub and import into **Vercel** — framework preset "Vite", build `npm run build`, output `dist`. Done.

## Swap photos / words
- Photos live in `public/photos/`. Replace a file (keep the name) to swap an image.
- Page copy and captions are in `src/App.jsx` (the `spreads` array).
- The letter text is in `src/components/Letter.jsx`.
- The crossword answers/clues are in `src/components/Puzzle.jsx`.

Built with React + Vite + Framer Motion + react-pageflip.
