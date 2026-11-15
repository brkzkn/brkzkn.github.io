# ADR-005: Restaurants and trips are their own feed types

Date: 2026-11-03 · Status: accepted · Revised by ADR-007 (2026-11-13): `restaurant` is also a `category` value; the home feed still lists it under Culture.

## Context
In the prototype a restaurant visit and a trip were both rendered as a photo album with a caption. Both have structured facts (restaurant: name, cuisine, price level, stars; trip: destination, dates) and both are expected to have a detail page. A photo album has no place for those fields, and the link to the detail page was a small text link that was easy to miss. An earlier version of the content model also treated restaurants as a `review` subject.

## Decision
The feed has ten types: note, album, writing, project, milestone, review, **restaurant**, **trip**, monthly, link.

- **restaurant** has its own fields (`name`, `cuisine`, `area`, `price` 1–4, `rating`, `visited`, `order`, `photo`) and lives under the existing **culture** category. No new category.
- **trip** has `destination`, `country`, `dates`, `days`, 1–4 photos and a caption, and lives under **travel**.
- **album** stays for photo-only moments that are neither a meal nor a trip.
- **review** keeps books, films, series and devices. Film and series reviews take a poster (`cover`, 2:3) and an optional `platforms` list. A platform chip is clickable only when the entry gives an `href`; otherwise it is a plain label. Marks are neutral monograms; official logos are brand assets and are added only when permission exists.
- Restaurants and trips link to their detail page with a **visible button** (outlined, with an arrow), not a text link. The same button is used for any album that has a link.
- The filters do not change: category, month and search. Type is still a rendering hint, not a filter (see `docs/content-model.md`).

## Consequences
- The content schema gains two types and a few optional fields; the Astro collection needs a branch per type.
- Detail pages get predictable URLs: `/life/restaurants/<slug>/` and `/life/trips/<slug>/` (to be confirmed in the URL-scheme ADR).
- The feed type review page (`prototype/feed-types.html`) lists every variant of each type and is the place to review a change before it ships.
- Reversible in the data layer: a restaurant or trip can be re-tagged as an album without losing content; the extra fields would simply be unused.

## Alternatives considered
- **Keep restaurants and trips as album variants:** no schema work, but the structured fields would be free text inside a caption and could not be filtered, rated or shown as a card.
- **Restaurants as a review subject:** one fewer type, but a restaurant needs price, area, "order again" and a detail page that books and films do not.
- **A separate "Food" category:** rejected by the owner; culture already covers it.
