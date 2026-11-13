# Content model (for the Astro build)

One collection, `posts`, with a `type` field. The feed is the collection sorted by date; section pages are filters over it.

## Post frontmatter

```yaml
title: ""            # optional for type: note
type: note | album | writing | project | milestone | review | restaurant | trip | monthly | link   # shape of the post
category: work | projects | travel | culture | family | gear | personal      # topic of the post
date: 2026-10-30
lang: tr | en        # original language
translated: true     # a sibling file exists in the other language, same slug
tags: [kadikoy, seafood]
place:               # optional
  name: ""
  area: "Kadıköy, Istanbul"
  lat: 0
  lng: 0
photos: [./01.jpg, ./02.jpg]   # colocated with the post
cover: ./cover.jpg   # trips and writing
rating: 4            # review and restaurant, 1–5
draft: false
```

Folder: `src/content/posts/2026/2026-10-30-kadikoy-kalamar/index.tr.md` (+ `index.en.md`). Photos live in the same folder.

## Type-specific fields (ADR-005)

```yaml
# review (book, film, series, device)
subject: Film                    # Book | Film | Series | Device | ...
creator: ""
cover: ./poster.jpg              # film and series: poster (2:3); device: product image; book: drawn by the renderer
platforms:                       # optional, film and series only
  - id: netflix                  # netflix | prime | appletv | disney | mubi | cinema
    href: https://...            # optional; without it the chip is a plain label
# restaurant (category: culture)
name: ""
cuisine: ""
area: "Kadıköy, Istanbul"
price: 3                         # 1–4
rating: 4
visited: 2026-10-30
order: "what I would order again"
photo: ./cover.jpg
# trip (category: travel)
destination: ""
country: ""
dates: "14 to 16 Mar 2025"       # a range, written as text
days: 3
photos: [./01.jpg, ./02.jpg]     # 1–4
```

Restaurants and trips may link to a detail page (`/life/restaurants/<slug>/`, `/life/trips/<slug>/`); the link renders as a visible button, not a small text link. Platform marks are neutral monograms, not brand logos.

## Separate collections

- `work`: case studies. Fields: client (anonymised), industry, years, role, stack, summary, sections (context, problem, constraints, decisions, boundaries, operations, outcomes, lessons), `featured` (bool, default false) and `featuredOrder` (number), `cover` (optional photo, 56:19; when absent the renderer shows the case study's diagram, `diagram`, an SVG file). Featured, published studies feed the home strip: up to three, see ADR-004.
  - Required: summary (lede), the facts block (role, duration, stack), `problem` and `decisions` (each with its trade-off). Optional: context, constraints, system map, operations, outcomes, lessons, `cover`.
  - An empty section is not rendered. The "Jump to" links are built from the sections that exist and are hidden when there are fewer than three. The outcome strip shows only when at least two real figures exist; placeholders like `[n]` block publishing. Section order is fixed so every case reads the same way. The closing call to action is always shown.
- `gear`: one file per device (2026-11-12 redesign). Required: name, category (computing | smart-home | workshop | everyday | entertainment; labels and icons in `src/lib/gear.ts`), take (2–3 lines, English). Optional: rating (the owner's own score, 0.5–5 in half steps; renders the card's star footer, which is omitted without it), takeTr, status (in-use | retired | sold; kept in the data, no longer shown on the card), since / until ("2024" or "2024-03"), updated (feeds the hero's "Last updated"), image (next to the file, `./images/<slug>.jpg`, rendered through `<Picture>`), imageAlt / imageAltTr, related (post slugs, data only; cards do not link anywhere), order, sample. Both `/gear/` and `/tr/gear/` render the same files; the category filter is client-side (`src/scripts/gear-filters.ts`).
- `pages`: about, now.

## URL scheme

```
/                     feed
/notes/<slug>/        any post (type-independent; types are filters, not paths)
/work/  /work/<slug>/
/projects/            filtered view + project pages
/life/  /life/trips/<slug>/  /life/culture/<yyyy-mm>/
/gear/  /gear/<slug>/
/writing/  (long posts only) /writing/<slug>/
/about/  /now/
/tr/...               Turkish routes mirror the above
/rss.xml  /rss.tr.xml
```

## Publishing flow (target)

1. Write a Markdown file (phone: GitHub mobile or Obsidian + git; desktop: VS Code).
2. Push to `main`. GitHub Actions builds Astro and deploys to Pages.
3. Translation step (later): an action or local script produces the sibling language file; owner reviews before merge.
4. Email digest: the RSS feed drives a Buttondown (or Kit) digest; the subscribe form posts there.

## Home feed prototype (2026-11-01)

The prototype home feed renders `prototype/assets/js/feed-data.js` (sample entries) with `feed.js`. Shared fields: `id`, `type`, `category`, `publishedAt`, `language`, `tags`. Title, cover, rating and detail link are optional per type. Books, films, series and devices are `review` entries with a `subject`. Restaurants and trips are their own types (ADR-005). The older `food`, `home`, `print`, `culture`, `gear-added` values are now categories or review subjects.

The home feed filters by **category** (topic), by month and by search. `type` is not a filter: it decides how a post renders and is shown as a label in the meta column. It can be inferred (no title and photos = album, titled = writing, default = note), so the only choice at posting time is the category.
