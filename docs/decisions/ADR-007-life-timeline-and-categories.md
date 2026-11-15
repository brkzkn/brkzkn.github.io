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
- A card links only when the entry has a page: trip, restaurant and monthly go to their existing detail routes; other published entries go to `/notes/<slug>/`; sample notes have no link.
- The dev-only page `/dev/life/cards/` draws fixtures with the same components, for the layout cases the real entries do not cover yet.

## Alternatives considered
- **Derive the Restaurants category on the Life page from `type: restaurant`** (the first version of this ADR): no schema change, but the filter then depends on a hidden link between type and category, and a note about a restaurant could never be filed there.
- **Add the category and show it on Home too:** changes the home filter row and sidebar, outside the scope of this work.
- **A separate `lifeCategory` frontmatter field:** a second topic field next to `category` and one more choice at posting time, against the low-friction rule; one more value in the existing field is enough.
- **Seven card designs, one per type:** more to maintain and no clearer for the reader than three sizes.
- **Masonry or dense packing:** fills every gap but breaks reading order inside a month.
