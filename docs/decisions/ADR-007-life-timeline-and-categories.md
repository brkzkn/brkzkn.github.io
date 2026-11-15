# ADR-007: Life is a month timeline with its own four categories

Date: 2026-11-13 · Status: accepted (revises one point of ADR-005)

## Context
The Life page listed entries in three columns (date, text, picture), one row per entry, with three filters taken straight from the post's `category` field: family, travel, culture. Every entry had the same weight, a trip looked like a note, and restaurants could not be found without scrolling the culture list. The owner approved a redesign: a chronological timeline grouped by month, a Restaurants filter, and cards whose size follows the kind of entry.

ADR-005 decided that restaurants live under the culture category and rejected a separate food category. The home feed, its filters and the content schema are built on that list of seven topics.

## Decision
**Two axes, kept apart.** The post's `category` field stays the topic of the post and is not changed. The Life page has its own short list of reader-facing categories, defined once in `src/lib/life.ts` (`LIFE_CATEGORIES`): family, travel, restaurant, culture. Three map one-to-one to the schema field. **Restaurant is a Life-page category: every `type: restaurant` post belongs to it**, whatever its `category` field says (`lifeCategoryOf`). This is the one place where a type decides a category, and it is written in one function. The schema enum, the home feed and its filters are untouched; ADR-005 still describes the feed.

**Type decides the card, not the filter.** Seven post types are drawn by one component (`src/components/life/LifeCard.astro`) in three families (`familyOf`):

| Family | Types | Shape |
|---|---|---|
| compact | note; review without a cover | text first, optional 88px thumbnail |
| standard | album, restaurant, monthly; review with a cover | picture and text in balance, two per row on desktop |
| featured | trip, milestone | the whole row, large cover, serif title |

**Timeline.** Entries are grouped by the month of `date` (UTC), newest first, order inside a month unchanged. A monthly diary needs no extra field: it is already dated inside the month it covers (its URL `/life/culture/<yyyy-mm>/` comes from the same date). Rows are packed by one pure function (`src/lib/life-layout.ts`, `packRow`) used by the build and by the filter script: a featured card takes the row, two neighbours of the same shape share a row (compact; standard with a photo, with a poster, or with no picture), a card left alone takes the row. Chronological order is never changed to fill a gap.

**Filtering** is client-side (`src/scripts/life-filters.ts`): cards outside the category are hidden, empty months are hidden, visible months are re-packed, the count and the empty state update. No URL change. The line of the timeline is drawn on the container, so it ends with the last visible month without script.

**Turkish.** `/tr/life/` is a real page (same component, `lang` prop, listed in `src/i18n/translated.ts`), like Gear and About. Page labels, month names and day dates are rendered in Turkish at build time; a trip's free-text `dates`, the original-language chip title and the rating label are translated in the browser by the existing client dictionary (`src/scripts/i18n/patterns.ts`). Entries stay in the language they were written in until a translated sibling file exists (`getPosts('tr')` then prefers it); every card carries the original-language chip.

## Consequences
- A restaurant keeps `category: culture` in its file and on the home feed, and appears under Restaurants on Life. Changing that later is a one-line change in `lifeCategoryOf`.
- Sample restaurants are no longer held back from the Life index: the general `sample` gate in `getPosts` (PUBLIC_PREVIEW) is the only rule, as for every other entry.
- Entries of other categories (personal, gear, work, projects) still do not appear on Life.
- A card shows the date the timeline sorts by (`date`). A restaurant's `visited` date stays on its detail page.
- A card links only when the entry has a page: trip, restaurant and monthly go to their existing detail routes; other published entries go to `/notes/<slug>/`; sample notes have no link.
- The dev-only page `/dev/life/cards/` draws fixtures with the same components, for the layout cases the real entries do not cover yet.

## Alternatives considered
- **Add `restaurant` to the schema's `category` enum:** the cleanest data, but the home feed builds its filters and labels from that enum, so Home would have to change in the same step, and ADR-005 would be reversed for the whole site rather than for one page.
- **A `lifeCategory` frontmatter field:** one more choice at posting time, against the low-friction rule; the type already says it.
- **Seven card designs, one per type:** more to maintain and no clearer for the reader than three sizes.
- **Masonry or dense packing:** fills every gap but breaks reading order inside a month.
