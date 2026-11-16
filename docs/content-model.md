# Content model (for the Astro build)

One collection, `posts`, with a `type` field. The feed is the collection sorted by date; section pages are filters over it.

## Post frontmatter

```yaml
title: ""            # optional for note and album
type: note | album | writing | project | milestone | review | restaurant | trip | monthly | link   # shape of the post; optional, see "Inferred type"
category: work | projects | travel | culture | restaurant | family | gear | personal      # what the post is about
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
rating: 4.5          # review and restaurant, 0.5–5 in half steps
link: https://...    # optional: an external URL or a site route ("/gear/"); see "Where `link` is read" below
draft: false
```

### Inferred type

`type` may be left out. The schema (`src/content.config.ts`) then resolves it, and every page, the feed and RSS read the resolved value:

- no `type`, no `title` and at least one photo in `photos` → `album`;
- no `type` otherwise → `note`.

A written `type` always wins: `type: note` with photos stays a note. Nothing else is inferred. A title does not make a post a `writing` (many notes have a title), and `cover`, `photo` or `rating` do not change the type; every type other than note and album has to be written.

Two things follow from the rule as it is built today:

- An album shows only its first paragraph, on Home, on Life and on `/notes/<slug>/`; the rest of the body is drawn for notes only (`src/pages/notes/[...slug].astro`, `src/lib/feed.ts`). An untitled photo post with more than one paragraph therefore needs `type: note` written out, or the later paragraphs are published nowhere.
- The type is resolved per file. Translated siblings (`index.tr.md`, `index.en.md`) must agree on `title` and `photos`, or write the type: otherwise the same post can be an album on `/tr/life/` and a note on `/life/`. Nothing checks this.

### Where `link` is read

- Life cards: note, album, review and milestone (see "Life page"); not trip, restaurant or monthly.
- Home: the title of a review, the log of a project, the source of a `type: link` post; on a restaurant or trip it replaces the detail route. Home ignores it on a note, album or milestone. A review title that links out opens in the same tab on Home, unlike the Life card.
- `/notes/<slug>/`: a site route becomes the "details" button; an external URL is not shown.

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
# restaurant (the type; its topic is normally category: restaurant)
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
photos: [./01.jpg, ./02.jpg]     # up to 4; none is allowed (text card, no photo grid)
```

Restaurants and trips may link to a detail page (`/life/restaurants/<slug>/`, `/life/trips/<slug>/`); the link renders as a visible button, not a small text link. Platform marks are neutral monograms, not brand logos.

## Life page (ADR-007)

`/life/` and `/tr/life/` show posts of the seven types note, album, review, milestone, trip, monthly and restaurant whose `category` is **family**, **travel**, **restaurant** or **culture**, grouped by the month of `date`, newest first. The four filters are that field and nothing else (`src/lib/life.ts`). `category` is what a post is about, `type` is how it is drawn: a restaurant visit is `type: restaurant, category: restaurant`, and a note about a dinner can be `type: note, category: restaurant`. The home feed has no Restaurants topic and lists `restaurant` posts under Culture (`feedCategory()` in `src/lib/feed.ts`).

The type picks the card family, nothing else: compact (note, review without `cover`), standard (album, restaurant, monthly, review with `cover`), featured (trip, milestone). Picture used: restaurant `photo`, album and note `photos[0]`, review `cover`, trip, milestone and monthly `cover` then `photos[0]`. A published entry without a picture gets no picture block; nothing is invented (no rating, place or link unless the field or the page exists). An untitled post with a photo and no `type` is an album (see "Inferred type"), so it is a standard photo card, not a compact note. A `rating` is drawn as stars in half steps. A card shows a language chip only when its text is not in the page's language. A monthly diary is dated inside the month it covers, so it sits in that month's group.

Years (2026-11-16; ADR-007 amendment). Months are grouped by year. The year of the newest entry is shown open, without a year row; every older year is a closed `<details>` whose row shows the year and its number of entries, and opens to the same month groups. Nothing in the frontmatter controls this: the year comes from `date`. Month headings have the id `life-month-<yyyy-mm>` and a year `life-year-<yyyy>`; a link to either opens the year it is in, and puts the category filter back on All if the filter would hide the target. The category filter counts inside closed years too and hides a year with no matching entry.

Which cards link (owner decision, 2026-11-16; ADR-007 amendment). A card is one link or none:

- trip → `/life/trips/<slug>/`, restaurant → `/life/restaurants/<slug>/`, monthly → `/life/culture/<yyyy-mm>/`: the detail pages. `link` is not read for these on Life.
- note, album, review, milestone: no detail page on Life. The card links only when the post sets `link`, and has no link otherwise. Life never links to `/notes/<slug>/`; those pages still exist and Home and RSS use them. Sample and real posts follow the same rule.
- `link` starting with `http://` or `https://` is external: new tab (`target="_blank" rel="noopener noreferrer"`, as on the social links, the About page and the home feed's shared link; the review title on Home is the exception, see "Where `link` is read"), an outward arrow (↗) and the hostname without "www." as the label (`example.com ↗`); the link's accessible name ends with the hostname and "opens in a new tab".
- `link` starting with `/` is a page of this site: same tab, the usual arrow, the label "Open the page".
- Any other value (a relative path, another scheme, a URL that does not parse) is not treated as a link.

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

The home feed filters by **category** (topic), by month and by search. `type` is not a filter: it decides how a post renders and is shown as a label in the meta column. It can be left out for the two everyday shapes, so the only choice at posting time is the category: without a `type`, a post with no title and at least one photo is an album and anything else is a note. A written `type` always wins, and a title never makes a post a `writing`; that type, like every type other than note and album, is written out (see "Inferred type").
