# Design system

Editorial, calm, personal. Inspired by independent magazines and architecture portfolios, not SaaS.

## Tokens (`prototype/assets/site.css`, `:root`)

| Token | Light | Role |
|---|---|---|
| `--bg` | `#F7F4EF` | page ground, warm off-white |
| `--surface` | `#FDFCFA` | cards, inputs |
| `--ink` | `#1E2430` | text, deep navy-charcoal |
| `--ink2` / `--ink3` | `#525A68` / `#6F7683` | secondary / tertiary text |
| `--line` / `--line2` | `#E4DED4` / `#D5CEC2` | hairlines / chip borders |
| `--blue` / `--blue-ink` / `--blue-tint` | `#3B6B9A` / `#2C5479` / `#E6EEF5` | primary accent, links, active states |
| `--orange` / `--orange-tint` | `#C4561F` / `#F6E7DC` | warm accent: active nav mark, ratings, one highlight per page |

Dark theme overrides the same variables under `[data-theme="dark"]`. Images are not re-tinted.

## Type

- `Newsreader` serif, weights 400/500 + italic: `.display` 84px, `.h1` 64px, `.h2` 44px, `.h3` 30px, `.h4` 23px, `.lede` 24px. Notes in the feed use the serif at 22px: the journal voice.
- `IBM Plex Sans` 400/500/600: body 17px/1.55, `.small` 14px, `.tiny` 13px, kickers 10–11px uppercase with letter-spacing (sidebar and section eyebrows only).
- `IBM Plex Mono` only in `pre`.

## Layout

- `.wrap` max 1240px, 40px gutters (20px under 640px). `.grid` is 12 columns, 32px gap; `.spanN` classes 2–12.
- Breakpoints: 1000px (nav collapses to menu button, grids go 2-col, spans go full) and 640px (single column).
- Asymmetry is intentional: hero text 7 cols + image composition 5 cols; feed 8 cols + sidebar 4 cols.

## Components

- `.nav` one row, six/seven items, active item has a 2px orange underline. Right side: EN/TR toggle, theme toggle, menu button on mobile.
- Feed item: date column (serif date, year, type label) with a small diamond marker, then content. Type decides size: Trip gets a 2:1 cover, Note gets up to three 1:1 photos, Gear gets a 110px thumbnail card, Writing gets title + excerpt only.
- Sidebar module: `.sidebar-module` with `.sidebar-kicker`; hairline separators, no boxes. Order on home: Stay in touch, Elsewhere, Now, Search, Browse by topic, Archive, Take a different path.
- Chips: `.filters > *` pill, active is inverted (ink on ground). `.tag` small outlined pill; `.tag.fill` blue tint, `.tag.warm` orange tint.
- `.panel` bordered card for Work decision/trade-off blocks; `.box` + `.conn/.vconn` for small system maps built from HTML elements. The case-study illustrations on Work are original inline SVG figures (`.wk-fig` frame, `.wk-art` drawing): flat, hairline strokes, every colour from the theme variables so they follow light and dark, an `aria-label` and a one-line caption. Solid lines are requests, dashed lines are events, orange marks the one thing to look at.
- Life timeline (2026-11-13, `src/components/life/`): `.life-timeline` draws one vertical line, each `.life-month` has an uppercase month label (the one all-caps label outside kickers, with the full month name for screen readers) and an orange dot on the line. Cards are `.life-card` in three families: `.is-compact` (text first, metadata in the top row, no foot), `.is-standard` (3:2 picture above the text, beside it when alone in the row; `.is-portrait` for posters), `.is-featured` (whole row, cover on 56%, serif title up to 40px). `data-span` (`full`, `half`, `wide`) is the row width: two neighbours of the same shape share a row, anything else takes the row. Orange on this page is an accent, never a surface: month dots, rating stars, the label and arrow of a real link, the active filter, the milestone rule and tag, and the border of a linked card on hover. A card without a link has no hover. The filter row is the Gear one (`.gear-filters`), scrolling sideways under 768px. Review page: `/dev/life/cards/`.
- Star rating: `src/components/StarRating.astro` (`.gear-stars`), five read-only stars in half steps, orange fill on a muted outline, shared by Gear and Life cards. The value is given in words on a `role="img"` wrapper; the stars are hidden from assistive technology.
- `.ph` placeholder: hatched tinted block with caption; ratio classes `.r169 .r43 .r11 .r34 .r21 .r32`.
- Ratings: `.stars` five 10px dots in orange, `.off` for empty (home feed and Life detail pages; Gear and Life cards use the star rating above).

## Do / don't

Do: generous whitespace, one bold accent per page, concrete captions, sentence case.
Don't: shadows, gradients, glassmorphism, equal visual weight for every section, nine-item nav, stock photos of people coding, ALL-CAPS labels outside kickers.

Case-study image slot: each Work card has one `figure.wk-fig`. It holds the drawing (`svg`) until the owner has a real photo, then the `img` replaces the `svg` inside the same figure. Ratio 56:19 (`object-fit: cover`), descriptive `alt`, keep the caption. A drawing replaced by a photo can move to the case-study detail page. Photos are checked for client names, product names and addresses before upload, because case studies are anonymised.

Imagery and licences: only the owner's own photos or illustrations made for this site (vector drawings, diagrams). No stock photography and no third-party icon or logo sets, so there is nothing to license or attribute.
