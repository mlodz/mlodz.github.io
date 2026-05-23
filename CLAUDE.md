# CLAUDE.md

Personal GitHub Pages site at https://mlodz.github.io. Static HTML only — no build step, no framework, no bundler. Files are served directly by GitHub Pages from `main`.

## Layout

```
mlodz.github.io/
├── index.html                       Root "table of contents" — links to every topic
├── <topic-slug>/
│   └── index.html                   One folder per topic; the page lives at index.html
└── README.md
```

Each topic is a self-contained folder with its own `index.html`. The root `index.html` is the only page that knows about all topics; topics do not link to each other.

## Adding a new topic

1. Create a new folder at the repo root using a kebab-case slug (e.g. `boston-coffee-map/`).
2. Put the page at `<slug>/index.html`. Everything that page needs — JS, CSS, images, data files, etc. — must live inside its own `<slug>/` directory and be referenced with relative paths. Never reach outside the slug folder (no `../shared/foo.js`, no sibling-topic imports). External libraries via CDN are fine. The rule is that each topic folder is movable and removable as one unit.
3. Add a "← Home" link at the top of the page that points to `../index.html`. Match the styling to the page's own palette so it doesn't look bolted on.
4. Add an `icon.svg` (full-bleed, designed at viewBox `0 0 180 180` but with width/height of `1024` so qlmanage scales it cleanly) and an `icon-180.png` (180×180, rasterized from the SVG). Generate the PNG with: `qlmanage -t -s 1024 -f 1 -o <slug> <slug>/icon.svg && mv <slug>/icon.svg.png <slug>/icon-1024.png && sips -z 180 180 <slug>/icon-1024.png --out <slug>/icon-180.png && rm <slug>/icon-1024.png`.
5. In the page's `<head>`, include the icon + iOS home-screen meta tags (see existing pages for the exact block). Pick a short `apple-mobile-web-app-title` (one word ideally — it's the label under the home-screen icon) and a `theme-color` that matches the page's hero background.
6. Add a card to the root `index.html` `.topics` grid linking to `./<slug>/index.html` (use the explicit `index.html`, not a trailing slash — the site needs to work when opened via `file://` for local previewing).

## Mobile-first, iPhone-friendly — non-negotiable

Every page on this site is designed to be opened on an iPhone first, desktop second. When adding or editing a topic:

- Include `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">` in `<head>`.
- Design at iPhone widths (~375–430px) first. Use `max-width` to cap layouts on desktop rather than designing wide and squashing down.
- Respect the safe area on notched devices: pad bottom-fixed elements with `env(safe-area-inset-bottom)`.
- Tap targets ≥ 44×44px. No hover-only affordances.
- Use system or web fonts that render well at small sizes; avoid hairline weights on body copy.
- Test in Safari on iOS, not just Chrome devtools — `-webkit-` quirks (backdrop-filter, sticky positioning, 100vh) bite there first.

If a page can't be made to work well on a phone, it doesn't belong on this site.

## Conventions

- No build tools, no package.json, no node_modules. If a change would require any of that, push back before adding it.
- External dependencies are loaded from CDNs (Google Fonts, Leaflet, etc.) — never vendored.
- The root `index.html` uses a navy + Playfair Display + DM Sans aesthetic. Topic pages are free to have their own palette and typography.
