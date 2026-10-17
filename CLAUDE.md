# Sobaina — Portfolio

Personal portfolio for Sobaina, a UI/UX designer & frontend developer based in Lahore.
Target audience: recruiters/hiring managers for **UI/UX and frontend developer roles**.
The site is mid-revamp: hero, Work sequences and the folder are in the new design; About, Contact,
navbar and footer are still the old design.

## Stack
- Vite + React 19 + TypeScript, Tailwind CSS v4 (config lives in `src/index.css`, no tailwind.config)
- Routing: wouter (`/` home, `/case/:id` case study)
- Animation: framer-motion
- 3D: three + @react-three/fiber v9 + @react-three/drei v10 (hero only, lazy-loaded chunk)
- shadcn-style components in `src/components/ui/` (most are unused)
- Path alias `@/` → `src/`

## Commands
- `npm run dev` — dev server (http://localhost:5173)
- `npm run build` — production build
- `npm run serve` — preview the build (http://localhost:4173)
- `npx tsc --noEmit -p tsconfig.json` — type-check (`tsconfig.app.json` lacks the `@/` path alias, so use `tsconfig.json`)

## Design direction (agreed)
Inspired by https://type-garden.vercel.app/ — one memorable interaction, strict palette, not many effects.
- Background: pure black `#000`
- Accents: signal red `#FF1400` (`--primary`), ultramarine `#3257FF` (`--accent`);
  supporting tints `#FFB4A8`, `#FFE2B8`, `#9FB4FF`, `#E63CFF`, `#FF8A00`
- Type: Playfair Display (`font-display`, headings), DM Mono (`font-mono`, small uppercase labels),
  Bricolage Grotesque (`font-sans`, body/UI). Fonts load from Google Fonts in `index.html`.
  Don't use Inter — the user specifically doesn't want the "generic AI site" font.
- Visual motifs: gradient mesh, 3D wireframe, isometric.
- Core concept — **"Wireframe → Render"**: the designer-who-codes story. Structure (wireframe)
  turns into finished surface (rendered gradient).

## Hero (done)
- `src/components/hero.tsx` — layout, copy, Wireframe/Render toggle (auto-toggles every 3.8s until clicked)
- `src/components/hero-scene/`
  - `scene.tsx` — R3F Canvas, isometric orthographic camera at (10,10,10), gradient backdrop, drei Grid floor
  - `screen-stack.tsx` — 3 isometric phone slabs; wireframe ↔ render transition; `DESKTOP_MIN = 1024`.
    In Render mode each phone shows the mobile view of one live site (`public/work/<site>/mobile.webp`,
    top → bottom: Ihsan Connect, Tasleem, Aistear); the wireframe linework fades out.
    (side-by-side layout at `lg`, stack above the copy below that)
  - `mesh-gradient.ts` — GLSL gradient-mesh ShaderMaterial (fullscreen or on a flat surface).
    Colors are passed as raw sRGB vectors to bypass three's color management.
  - `ui-skeleton.ts` — line geometry for the UI wireframes on each screen (3 layouts)
- Respects `prefers-reduced-motion`.
- `src/components/hero-cursor.tsx` — Figma-style multiplayer cursor near the stack (desktop only):
  "sobaina · designing" in Wireframe, "sobaina · shipping" in Render.
- The hero section is `h-[200vh]` with a sticky `100dvh` inner panel; that extra screen of scroll drives the bloom.

## Blooming name (Type Garden-style, SVG + Framer Motion)
`src/components/bloom/` — growth model adapted from Type Garden (type-garden.vercel.app, Akshat Agarwal),
whose source the user shared. Name is lowercase bold Playfair ("sobaina"). It types out like a live
input: `typing-caret.tsx` — `useTyping()` reveals one character per keystroke on `letterBirth(i)` (shared,
slightly uneven schedule in `garden.ts`), and `TypingCaret` is a `|` bar measured from the live letters that
stays solid while typing and blinks (`.bloom-caret` in `index.css`) once done. Each letter's garden grows
as it's typed; scroll opens the buds. `GardenLayer` is memoised so keystrokes don't re-render it.
- `vine.ts` — math: seeded PRNG, wandering `vine()`, `curl()`, `weave()` (stem runs alternate behind/in
  front of the type), `toPath()` → SVG path data (fixed structure per point count, so paths can morph).
- `garden.ts` — geometry/timing only (px + seconds). Per letter: 1–2 vines (the first one rooted in the
  letter's loop/arch via `COUNTERS` — o, b, a, n… — starting behind it so it threads out), maybe a hanging
  vine, a runner back to the previous letter, a curl off the first letter, a bouquet after the last; leaves,
  thorns, side branches. Roses on/near letters go behind them; up to two high roses become sunflowers.
  Colors: rose `#FF1E27`, stem/leaf `#0A3BFF`, line-art `#FFFFFF`.
- `shapes.ts` — pure SVG geometry: sharp leaf (two cubics), `roseParts(R, open)` (bud → scalloped bloom
  with white ring/spiral/doodles), `sunflowerParts(R, open)`.
- `flowers.tsx` — Framer Motion components: `StemRuns` (pathLength springs, runs grow in sequence),
  `Leaf` / `Rose` / `Sunflower` (pop-in `scale: [0, 1]` easeOut; flower paths morph from scroll `bloom`).
- `garden-layer.tsx` — one `<svg>` per plane (behind `-z-10` / in front `z-10`); groups per letter sway
  about the letter base (idle sine + scroll-velocity "wind") via `useAnimationFrame`.
- `blooming-name.tsx` — measures letters, builds the garden, renders both layers; click name to regrow.
  `useReducedMotion` → everything appears instantly, no sway.
- Hero: `bloom = useSpring(useTransform(scrollYProgress, [0, 0.85], [0, 1]))`; name `clamp(3.5rem,10vw,7.5rem)`.

## Work section — scroll image sequences (done)
`src/components/work/` + data in `src/data/work.ts`.
- `work-section.tsx` (`#work`) → one `project-sequence.tsx` per project: pinned for `frames × 70vh + 60vh`;
  scroll maps to a continuous frame index; `sequence-viewer.tsx` slides each frame up over the previous one.
- Frame styles: `phone` (raw screens in a bezel — PAL), `screen` (portrait mockups — SyncKaro),
  `poster` (landscape crops — CareLink, IJS), `browser` (live sites — `browser-viewer.tsx`: a browser
  window whose full-page capture scrolls with the section; pin length scales with `site.pageRatio`).
- Live websites first (Sobaina designed, built and maintains all three):
  Ihsan Connect https://ihsanconnect.org/ (Next.js, Vercel), Tasleem Institute https://tasleemwomen.org/
  (Vite + Tailwind, Vercel), Aistear https://aistearedu.vercel.app/ (Vercel). Captures in
  `public/work/<ihsan|tasleem|aistear>/{full,mobile}.webp`, taken with headless Chrome (pop-ups closed)
  — re-capture when the sites change.
- Frames are optimised WebP in `public/work/<id>/NN.webp` (~590 KB total). SyncKaro/PAL come from
  `public/figma/`; CareLink/IJS were cropped section-by-section from the Canva PDF posters
  (rendered with pdf.js, cropped + encoded with ffmpeg). Originals in `public/figma/` are untouched.

## Folder (end of page)
`design-dev-showcase.tsx` (`#folder`, "Open the folder.") — folder click fans out the design project files
(bouquet), click one to see screens / PDF + source link. The Dev tab was removed (user request).

## Page order & leftovers
`src/pages/home.tsx`: Navbar → Hero → WorkSection → DesignDevShowcase (folder) → About → Contact → Footer.
Old effects still mounted: custom cursor (`body { cursor: none }`), noise overlay, coin/badge gamification
(`coin-context`, `reward-trigger`, `coin-toast`, `coin-counter`). `marquee-strip.tsx` is no longer used.

## Content data
- `src/data/figma-projects.ts` — design projects. **Real**: SyncKaro (real-estate CRM app), PAL (mental-health
  app, HCI group project — Sobaina did prototype docs, usability testing, poster), CareLink & IJS (Canva store
  assets, PDFs). Placeholder entries were removed. Images/PDFs live in `public/figma/`.
- `src/data/work.ts` — the four real projects for the scroll sequences (copy based on the descriptions above;
  no invented metrics).
- `src/data/dev/projects.ts` — dev case studies Horizon, Gloss, Roots Foundation are **fabricated placeholders**
  (fake metrics, PDFs point to the WCAG spec). Do not present them as real.
- Sobaina is a soon-to-graduate student (LUMS): copy says "open to full-time roles, internships & freelance".
  About stats are real counts (3 live websites, 7 projects). About bio is from Sobaina's own story (HCI course →
  everyday-design curiosity → UI/UX internship at a software house → client projects). Targets remote / abroad / anywhere.
- Personal: loves cats. Coins are themed as 🐾 treats; badges are cat names (`data/badges.ts`); `cat.tsx`
  is a line-art cat beside the About text (eyes follow cursor, click = "mrrp", happy once all treats are found).
  About: short bio + "Off-screen: cats. That's why there's one on the right", stats, Design/Build tool tags.
- Not yet deployed; plan is Vercel.
- Links: GitHub https://github.com/sobainaPrivate, LinkedIn https://www.linkedin.com/in/sobaina-sheikh/,
  email sobainashiekh@gmail.com.
- Contact form: `src/lib/send-message.ts` — Web3Forms if `VITE_WEB3FORMS_KEY` is set (`.env.local`, see
  `.env.example`), otherwise opens a pre-filled mailto. No backend or database.

## Known issues / TODO
- Folder bouquet labels overlap a little with long project names.
- Headless-Chrome testing: `window.scrollTo` doesn't trigger framer scroll animations reliably — use real wheel
  input (CDP `Input.dispatchMouseEvent` mouseWheel). Array-mapped `useTransform` on scrollYProgress may run as
  a native ScrollTimeline; function transforms run in JS.
- Dead code: `projects.tsx`, `badge-tray.tsx`, `marquee-strip.tsx`, `ui/neon-background.tsx`, `projects` badge in `data/badges.ts`.
- Navbar crowds around ~900px width; still has old indigo glow on the logo.
- Hero 3D chunk is ~250 KB gzip, mostly drei — could replace `Grid` with a custom one and drop drei.
- `npm audit` reports 4 vulnerabilities (not yet reviewed).

## Planned next steps
1. Restyle navbar, About, Contact and footer to the new direction.
2. Remove fake content (dev tab projects, About stats) and old effects (cursor, noise; decide on coins).
3. Working contact (Formspree/EmailJS or mailto), real links, CV download, OG image.
4. Optional: proper case-study pages per project (problem → role → process → screens → outcome).

## Conventions
- Functional components, TypeScript, Tailwind for styling (no new CSS files unless necessary)
- Keep components under ~150 lines; split into subcomponents past that
- Use `import type` for types (`verbatimModuleSyntax` is on)
- Ask before adding new dependencies
- Check layouts at mobile (390px), tablet (~900px) and desktop (1440px)
