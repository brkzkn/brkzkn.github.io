# Roadmap

## Phase 0 — prototype (done)
13-page static HTML prototype with design system, dark theme, EN/TR UI toggle, feed filters and search. See `prototype/`.

## Phase 1 — Astro skeleton
- [x] Astro 7 scaffolded at the repo root, static output, `site: https://burakozkan.net`, sitemap (ADR-001).
- [x] `site.css` ported as a global stylesheet (`src/styles/site.css`, unchanged); `site.js` copied to `src/scripts/site-legacy.js`, loaded through `src/scripts/main.ts`. Still to do: split it into small modules (menu, filters, theme/lang).
- [x] `Base` layout with Header and Footer components; demo banner and "V4.2 preview" footer line behind `PUBLIC_PREVIEW`. Still to do: `Feed`, `Post`, `Work`, `Gear` layouts.
- [x] Content collections per `docs/content-model.md` with Zod schemas (`src/content.config.ts`).
- [ ] Rebuild home, note, writing, gear, about (and the other pages) from the prototype markup. Keep pixel parity; the prototype is the design source of truth.
- [x] GitHub Actions deploy to Pages (`.github/workflows/deploy.yml`); `public/CNAME`; `robots.txt`; `404.astro`. Still to do by the owner: enable Pages (Source = GitHub Actions) and DNS at the registrar (A records to GitHub Pages, www CNAME).
- [x] ADR-001 (Astro), ADR-002 (URL scheme), ADR-003 (content storage).
- [ ] Home "selected architecture" strip: render from `work` entries per ADR-004 (0 to 3 cards, no placeholders).
- [x] `/rss.xml` endpoint (published, non-sample posts; titles and links only for now, full content is Phase 2).

## Phase 2 — real content
- Owner provides: ~5 real notes, 1 real case study, gear list, About photos.
- Replace mock images; keep the `.ph` placeholder only where no photo exists yet.
- RSS feeds, sitemap, OpenGraph images (typographic, generated at build).

## Phase 3 — publishing comfort
- Mobile posting path tested end to end (GitHub mobile or Obsidian).
- Translation script (owner writes TR, script drafts EN or vice versa; review before merge).
- Email digest wired to the RSS feed.
- WordPress archive import: keep original dates and slugs, redirect old URLs.

## Launch cleanup: remove prototype and placeholder markers
Do this while porting to Astro; none of these belong on the live site. Items marked (keep) look similar but stay.
- **Header banner** "DESIGN PREVIEW · Stories, product ownership, career examples and metrics are sample content." (`.demo-notice`, on every page). Drop it from the `Base` layout.
- **Footer line** "V4.2 preview · Sample entries and illustrative images" (every page). Keep the copyright line.
- **"EN · Sample" label in the feed's left column** (`origin()` in `feed-render.js`): remove the "Sample" part only. **(keep) the original-language marker "EN" / "TR"**; the site rules require it on every post.
- **`sample: true`** on every feed entry in `feed-data.js`, and the **`.mock` chips** it drives: "Fictional", "Fictional place, sample content.", "Fictional book/film and author, sample content.", "Illustrative case study", "Sample preview · Full entry coming later", "Preview image is a placeholder drawn in code", "Illustrative image" (photo viewer), "Fictional link, not clickable".
- **Feed footer** "End of the sample journal."; **subscribe note** "Subscriptions are not connected yet in this preview." (remove once the provider is wired).
- **Bracketed placeholders**, for example `[hello@yourdomain]`, `[Reservation link or phone number]`, `[Open to consulting...]`, `[metric]`, `[book]`: replace with real text or delete the line.
- **Placeholder link targets:** the second "selected architecture" card points at `architecture-notes.html` until it has its own page (ADR-004); the "Restaurant details" and "Read the London guide" buttons point at sample pages.
- **Mock images, posters and platform monograms:** replace with real photos; film posters come from the owner; add platform logos only with permission.
- **`prototype/feed-types.html`** (the feed type review page): keep it as a dev-only page or exclude it from the production build (and keep it `noindex`).
- **Sample copy on About, Work, Life, Gear, Projects pages** (Design-preview banner, sample case studies, `mock` tags): replace as real content arrives (Phase 2).

## Open issues from the prototype review
1. Subscribe form removed from the home sidebar (2026-11-04). **TODO after launch:** pick a provider (Buttondown or Kit), re-add the `sidebar-subscribe` module (CSS was deleted; restore from git history `f284334`), wire the form, add the TR strings.
2. Life filters visual only (Gear filters work since the 2026-11-12 redesign).
3. Placeholder images outside the home hero.
4. TR dictionary does not cover all page copy (by design; content translated at publish time).
5. Mobile menu is a dropdown; full-screen menu design exists in the original concept.
6. Life page still shows the "Design preview" banner; remove the banner at launch. Gear shows a `mock` note instead while sample entries exist.

## Coming-soon mode (2026-11-04)
While content is being written, `deploy.yml` sets `PUBLIC_COMING_SOON: 'true'`: `/` and `/tr/` show a short holding page (`src/components/ComingSoon.astro`, minimal header and footer, no nav), every other page is `noindex`, and the sitemap lists only the holding page and privacy. The real home page stays at the unlisted `/preview/`. Locally (`npm run dev`) the flag is off, so `/` is the real home.
**At launch:** set `PUBLIC_COMING_SOON` to `'false'` (or delete the line) and `PUBLIC_PREVIEW` to `'false'`; delete `src/pages/preview/` if no longer wanted. Everything else is already in place.

## Go-live gate
Audit date 2026-11-04. Method: source search of `src/`, `public/`, `.github/` against the Launch cleanup list. NOT verified against `dist/`: `PUBLIC_PREVIEW=false npm run build` could not run here because the local Node is 22.22.2 and Astro 7 needs >=22.23.4 (`engines`). Re-run the dist search once Node is upgraded.

### BLOCKERS (owner must supply or decide)
1. All 38 content entries are `sample: true`, and nothing filters them in production. `getPosts()` (`src/lib/posts.ts`) only hides `draft`; only `rss.xml.ts` excludes samples. With `PUBLIC_PREVIEW=false` the site still publishes 100% sample posts, case study and gear. Decide: add a prod filter on `sample` (hides all) or replace entries with real ones.
2. Bracketed placeholders in shipped content: About CV rows `[Company]` x4, `[/in/your-handle]`, `github.com/[your-handle]`; gear titles (`[NAS model]`, `[Laptop model]`, `[Monitor model]`, `[Mechanical keyboard]`, `[Mini PC]`, `[Previous laptop]`); `projects/index` and `smart-home` model names; restaurant page (`[Reservation link or phone number]`, `[opening hours]`, `[price per person...]`, `[nearest stop]`); culture diary (`[Film one]`, `[Series title]`, `[Artist]`, `[Exhibition name]`...); case study `[weeks]`, `[orders/day]`, `[metric]`; `[Restaurant name]` in kadikoy-kalamar.tr.md; `[Title]`/`[Author]` in the book note.
3. ~~Social links are bare roots~~ LinkedIn and GitHub now point at the real profiles from `src/config/site.ts`; Instagram is hidden (private account, `enabled: false`). The CV PDF is still `unavailable`.
4. ~~Subscribe form not connected~~ Removed from the home page (2026-11-04); re-adding is a post-launch TODO (Open issue 1).
5. Privacy review of images: `public/assets/images/` is mock art, which I could not verify for faces. Posts `the-twins-arrive` and `first-day-at-nursery` mention "two daughters" (no names found; acceptable) but need the owner's image check when real photos replace mocks.
6. Node on the build machine and CI: local Node must be upgraded to >=22.23.4 to build at all.

### Shipped even with PUBLIC_PREVIEW=false (markers not behind the flag)
- Hard-coded `.mock` chips and strings in `work/index`, `work/[slug]` ("Sample preview", "mock content, anonymised", "design preview"), `projects/index`, `projects/smart-home`, `writing/index`, `writing/[slug]`, `life/*`, `notes/[...slug]` and the lightbox ("Illustrative image"). Only some are gated by `d.sample`.
- `src/scripts/i18n/tr.ts` and `i18n.ts` contain "DESIGN PREVIEW", "V4.2", "sample content" strings: dictionary keys only, inert, but a dist grep will match them. Safe, but exclude from the grep.
- "Fictional" chips come from `fictional` flags (Restaurant, Review components); clear them with the sample entries.
- Placeholder targets: `.unavailable` cards/tags on Projects and Work ("Related reading"); second "selected architecture" card (ADR-004, roadmap item still open); "Restaurant details" and "Read the London guide" buttons point at sample pages.

### Safe to ship
- Header banner and "V4.2 preview" footer: gated by `PUBLIC_PREVIEW !== 'false'` in `Base.astro` and `Footer.astro`; index copy and RSS also gated.
- `/dev/feed-types/`: `getStaticPaths` returns `[]` in PROD and the sitemap filters `/dev/`.
- No analytics or trackers found. External requests: Google Fonts only (`Base.astro`). External content links are `github.com/esphome/esphome` (real) in a sample post, `netflix.com` and `example.com/queues` only in `src/data/feed-type-examples.ts` (dev page).
- No `.html` hrefs or `href="#"` in ported markup. `robots.txt` and `CNAME` (`burakozkan.net`) correct; sitemap URL matches `site`. `mailto:hello@burakozkan.net` is real-looking: owner must confirm the mailbox exists.
- `.env` and `.env.production` are git-ignored, so the CI value in `deploy.yml` is the only control that matters.

### Can be hidden by excluding sample entries
Posts, gear, work and pages are all collection-driven, so a `sample` filter in `getPosts`, `getWork` and the gear query (plus the About page) hides almost everything. Hand-written pages (Projects, Smart home, Work index, Life index) are not collection-driven and need real content or removal from nav and sitemap.

### deploy.yml review
- Permissions (`contents: read`, `pages: write`, `id-token: write`), concurrency, `github-pages` environment, `needs: build`: correct.
- `actions/checkout@v4`, `actions/deploy-pages@v4`: exist. `withastro/action@v3`: exists but the docs now show `@v6` (verified via the README page, tag list not checked); v3 still works, consider bumping. Its default Node is 24 and `node-version: 22` resolves to latest 22.x, which satisfies >=22.23.4 (unverified at run time).
- `PUBLIC_PREVIEW: 'true'` is set on the build job env and is read by the action's build step; flip to `'false'` at launch.
- No `base` needed: custom domain at the apex, site root. `public/CNAME` is copied into `dist/`.
- Owner steps: Settings, Pages, Source = GitHub Actions; set custom domain; enable "Enforce HTTPS" after the certificate issues.

### DNS (verified against GitHub docs, 2026-11-04)
- Apex `burakozkan.net` A: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153.
- Optional AAAA: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153.
- `www` CNAME to `<github-user>.github.io` (account domain, no repo name). The README says this but does not list the IPs; add them when launching.
- Unverified: the owner's GitHub username and registrar-specific syntax.
