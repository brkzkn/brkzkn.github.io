# ADR-007: Life is a month timeline; restaurant becomes a category

Date: 2026-11-13 · Status: accepted (revises one point of ADR-005). Revised the same day after the owner's review: the Restaurants category moved from a rule on the Life page into the schema.

## Context
The Life page listed entries in three columns (date, text, picture), one row per entry, with three filters taken straight from the post's `category` field: family, travel, culture. Every entry had the same weight, a trip looked like a note, and restaurants could not be found without scrolling the culture list. The owner approved a redesign: a chronological timeline grouped by month, a Restaurants filter, and cards whose size follows the kind of entry.

ADR-005 decided that restaurants live under the culture category and rejected a separate food category. The home feed, its filters and the content schema are built on that list of seven topics.

## Decision
**Two independent axes.** `category` says what a post is about; `type` says how it is drawn. `restaurant` is now both: the existing type, and a new value of the schema's `category` field (`src/content.config.ts`). Neither implies the other. A restaurant visit is normally `type: restaurant, category: restaurant`, a short note about a dinner can be `type: note, category: restaurant`, and nothing reads the type to decide a category.

**Life categories are the field.** The Life page shows the posts whose `category` is one of four, listed once in `src/lib/life.ts` (`LIFE_CATEGORIES`): family, travel, restaurant, culture. `lifeCategoryOf` is a lookup in that list, with no knowledge of types.

**Home keeps its seven topics.** The home feed and the Writing page have no Restaurants topic and are not redesigned here, so they read the field through one small mapping: `feedCategory()` in `src/lib/feed.ts` lists a `restaurant` post under Culture, as ADR-005 decided for the feed, and the Writing topic table has the same entry. Home renders exactly as before.

**Migration.** One file: the sample restaurant `kucuk-liman` changed from `category: culture` to `category: restaurant`. A restaurant post still filed under `culture` keeps working everywhere and appears under Culture on Life until its field is changed.

**Type decides the card, not the filter.** Seven post types are drawn by one component (`src/components/life/LifeCard.astro`) in three families (`familyOf`):

| Family | Types | Shape |
|---|---|---|
| compact | note; review without a cover | text first, optional 88px thumbnail |
| standard | album, restaurant, monthly; review with a cover | picture and text in balance, two per row on desktop |
| featured | trip, milestone | the whole row, large cover, serif title |

**Timeline.** Entries are grouped by the month of `date` (UTC), newest first, order inside a month unchanged. A monthly diary needs no extra field: it is already dated inside the month it covers (its URL `/life/culture/<yyyy-mm>/` comes from the same date). Rows are packed by one pure function (`src/lib/life-layout.ts`, `packRow`) used by the build and by the filter script: a featured card takes the row, two neighbours of the same shape share a row (compact; standard with a photo, with a poster, or with no picture), a card left alone takes the row. Chronological order is never changed to fill a gap.

**Ratings and language.** A rating is the owner's own score in half steps and is drawn with the Gear stars (`src/components/StarRating.astro`, helper `src/lib/rating.ts`); the posts schema now accepts half steps like the gear schema. A card carries a language chip only when its text is not in the page's language, taken from the file that is shown (`postFileLang`), never guessed.

**Filtering** is client-side (`src/scripts/life-filters.ts`): cards outside the category are hidden, empty months are hidden, visible months are re-packed, the count and the empty state update. No URL change. The line of the timeline is drawn on the container, so it ends with the last visible month without script.

**Turkish.** `/tr/life/` is a real page (same component, `lang` prop, listed in `src/i18n/translated.ts`), like Gear and About. Page labels, month names, day dates and the rating label are rendered in Turkish at build time; a trip's free-text `dates` and the language chip's tooltip are translated in the browser by the existing client dictionary (`src/scripts/i18n/patterns.ts`). Entries stay in the language they were written in until a translated sibling file exists (`getPosts('tr')` then prefers it); a card whose text is not Turkish carries a language chip.

## Consequences
- A new post must be filed under `restaurant` to appear under Restaurants on Life; the type alone no longer puts it there. On Home it is still listed under Culture.
- The restaurant detail page's breadcrumb reads "Life / Restaurant" for a post filed under `restaurant` (it used to insert "Culture"); a restaurant still filed under culture keeps the old crumb.
- The half star of the shared rating was drawn as a shrunken star; the one-line CSS fix corrects it on Gear as well.
- If Home ever gets a Restaurants topic, delete the mapping in `feedCategory()` and add the label; no content changes.
- The home feed and the Life detail pages still draw ratings as five dots and do not show half steps exactly (a 4.5 reads as "4.5/5" with rounded dots). Open until those pages are revisited.
- Sample restaurants are no longer held back from the Life index: the general `sample` gate in `getPosts` (PUBLIC_PREVIEW) is the only rule, as for every other entry.
- Entries of other categories (personal, gear, work, projects) still do not appear on Life.
- A card shows the date the timeline sorts by (`date`). A restaurant's `visited` date stays on its detail page.
- A card links only when the entry has a page: trip, restaurant and monthly go to their existing detail routes; other published entries go to `/notes/<slug>/`; sample notes have no link. (Superseded for the other entries by the 2026-11-16 amendment below.)
- The dev-only page `/dev/life/cards/` draws fixtures with the same components, for the layout cases the real entries do not cover yet.

## Alternatives considered
- **Derive the Restaurants category on the Life page from `type: restaurant`** (the first version of this ADR): no schema change, but the filter then depends on a hidden link between type and category, and a note about a restaurant could never be filed there.
- **Add the category and show it on Home too:** changes the home filter row and sidebar, outside the scope of this work.
- **A separate `lifeCategory` frontmatter field:** a second topic field next to `category` and one more choice at posting time, against the low-friction rule; one more value in the existing field is enough.
- **Seven card designs, one per type:** more to maintain and no clearer for the reader than three sizes.
- **Masonry or dense packing:** fills every gap but breaks reading order inside a month.

## Amendment, 2026-11-16: which cards link

Owner decision after reviewing the sample timeline: detail pages on Life exist for restaurants and trips; the other card types have none, and if such a card links at all it is an outward link taken from the post.

- trip, restaurant and monthly keep their detail routes (`/life/trips/<slug>/`, `/life/restaurants/<slug>/`, `/life/culture/<yyyy-mm>/`). The monthly diary page already exists, so its card keeps its link.
- note, album, review and milestone link only through the post's own `link` field and have no link without it. Life no longer links to `/notes/<slug>/`, and the special case for sample notes is gone: sample and real entries behave the same. The `/notes/<slug>/` pages are not removed; Home and RSS still use them.
- A `link` that starts with `http://` or `https://` is external: it opens in a new tab with `rel="noopener noreferrer"` (the convention of the social links, the About page and the home feed's shared link and platform chips), the call to action shows the hostname without "www." and an outward arrow (↗), and the card's one anchor ends its accessible name with the hostname and "opens in a new tab". A `link` that starts with `/` is a page of this site: same tab, the usual arrow, the label "Open the page". Any other value is ignored (`lifeLink()` in `src/lib/life.ts`).
- A compact card has no call-to-action label, only the arrow, as before; on an external compact card the arrow is ↗ and the hostname is in the link's accessible name.
- Consequence, accepted and not solved here: card text is clamped (two to four lines). Without the `/notes/` link, a note longer than its clamp cannot be read in full from Life.
- Decided the same day: a post without `type`, without a title and with at least one photo is an album (schema, `docs/content-model.md`, "Inferred type"), so an untitled photo note is drawn as a standard photo card, not a compact note.

## Amendment, 2026-11-16: older years are collapsed

Owner request: with every month on one page the timeline is long and keeps growing; fold it at year level. The page design is otherwise closed, so this adds one quiet row per older year and changes nothing else.

- **Grouping rule.** Months are grouped by year (`groupByYear()` in `src/lib/life.ts`). The year of the newest entry is drawn exactly as before: no year row, its months directly on the timeline, open. It is the newest entry's year, not the calendar year, because the site is static: in January the page would otherwise open on an empty year until the first post.
- **Older years are native `<details>`, closed by default.** One `<details class="life-year">` per year inside `.life-years`; the `<summary>` shows the year, the number of entries in it (the page's own count words: "8 entries", "1 entry", "8 içerik") and a chevron. All cards are in the HTML and the element opens and closes without JavaScript. Inside, the months look exactly as they do in the newest year (`LifeMonth.astro` draws both).
- **Filter.** The count in a year row is the number of entries of that year that match the selected category; a year with none is hidden; months inside are re-packed as before, whether the year is open or closed. A filter never opens or closes a year: the reader's choice is kept. The page count line counts every matching entry, including those in closed years, so "8 entries" can be shown above a page whose visible cards are fewer; the year rows carry the rest. The empty state and its reset button are unchanged.
- **Hash.** A URL hash that points inside a closed year (month headings have ids such as `life-month-2025-03`; a year is `life-year-2025`) opens that year and scrolls to the target, on load and on `hashchange` (a few lines in `src/scripts/life-filters.ts`). If the selected category hides the target (its year or its month has no matching entry), the filter goes back to All first; otherwise the year would be opened where the reader cannot see it. Without JavaScript this depends on the browser.
- **The line.** The vertical line still belongs to `.life-timeline`, so it runs through the year rows whether they are open or closed. A year row sits on the same two columns as a month: the year in the label column, a hollow ring on the line where a month has its orange dot, the count and chevron in a hairline box in the card column; under 768px the year moves into the box. The line ends at the ring of the last year while that year is closed, and with the last month when it is open.
- **Headings.** The year row is a disclosure control, not a heading. Month headings stay `<h2>` in every year and their accessible name already carries the year ("March 2025"); card titles stay `<h3>`. Nothing is renumbered, on Life or elsewhere. The summary's accessible name is "2025, 8 entries": the comma is inline text at `font-size:0` (`.life-year-sep`), because a `.sr-only` span is absolutely positioned and Chrome then computes "2025 , 8 entries". The count inside it is not a live region: after a filter change only the page count line is announced.
- **Dev review page.** `/dev/life/cards/` passes `collapse={false}` to `LifeTimeline`, which draws every month flat, so no fixture is hidden behind a closed year.
- Rejected: a year heading with a script-driven toggle (needs JavaScript and ARIA for what `<details>` does natively); collapsing months (too many rows, and the newest months are the page); pagination by year (new routes, and the category filter would no longer see the whole timeline); remembering the open years in `localStorage` (state the reader did not ask for).
- Sample content: seven sample posts dated 2025 were added (`src/content/posts/2025/`, all `sample: true`) so that the 2025 row has several months to show. They follow the same launch rule as every other sample.
