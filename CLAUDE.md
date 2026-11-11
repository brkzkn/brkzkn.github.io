# burakozkan.net — personal site

Personal website and self-hosted "social media" for Burak Özkan, Director of Engineering and (in practice) Technical Architect in Istanbul.
Central idea, used verbatim in the hero: *"A personal space for the systems I design, the things I build, and the life I want to remember."*

This repo currently holds a **static HTML prototype** (`prototype/`) that is design-complete for 13 pages. The next phase is migrating it to **Astro** with Markdown content and deploying to **GitHub Pages** on the custom domain `burakozkan.net`. Read `docs/roadmap.md` before starting migration work.

## What this site is (and is not)

- It replaces Twitter/Instagram/LinkedIn posting for the owner. Publishing a short note with two photos must take under a minute; friction is the enemy. Optimise every content decision for "will he actually post this on a Tuesday night".
- Two post shapes: **Note** (no title, short, photo-led, the default) and **Writing** (titled, long, rare). Everything else (trip, food, home log, print, gear, culture) is a note or writing with a type tag; the type decides how large it renders in the feed.
- The homepage is one chronological feed with a sidebar, not a set of "latest X" sections.
- **Work** is the professional door: anonymised architecture case studies, serious tone, kept visually separate from the personal stream.
- **Gear** is a living catalog (device, since when, one-line take, in use / retired), not blog posts.
- Owner writes in Turkish or English per post; translation to the other language is done at publish time (agent or manual), never client-side for content. The UI chrome is bilingual (EN/TR toggle). The original language of a post is always marked.
- Privacy: children's faces are never shown; family photos are from behind or cropped. Names of the children are never published.

## Repository layout

```
prototype/            static prototype, open any page directly or serve with `python3 -m http.server`
  index.html          home (feed + sidebar)
  work.html           Work (was portfolio.html)
  architecture-notes.html   case study detail
  projects.html, smart-home.html
  life.html, london-guide.html (travel detail), october-2026.html (culture diary)
  gear.html, note.html (single short post), blog.html, agentic-workflows.html (article), profile.html (About)
  feed-types.html     review page: every home-feed entry type with its variants, drawn by the same code as the feed (assets/js/feed-render.js). Not in the nav.
  assets/site.css     the whole design system; tokens on :root, dark theme under [data-theme=dark]
  assets/js/site.js   menu, feed filters + search, lightbox, theme/language toggles, UI string dictionary
  assets/images/      mock images (illustrative, replace with real photos)
docs/
  design-system.md    tokens, type, components, do/don't
  content-model.md    post types, fields, URL scheme for the Astro build
  roadmap.md          migration plan and open issues, in order
  decisions/          ADRs; add one for any decision that is hard to reverse
```

## Design system (summary; full version in docs/design-system.md)

- Ground `#F7F4EF`, ink `#1E2430`, secondary `#525A68`, borders `#E4DED4`, primary accent muted blue `#3B6B9A`, warm accent burnt orange `#C4561F` used sparingly (active nav mark, ratings, one highlight per page). Dark theme values live under `[data-theme="dark"]` in `site.css`; never hard-code colours in markup, use the CSS variables.
- Type: **Newsreader** (serif) for headlines and the journal voice, **IBM Plex Sans** for body and UI, IBM Plex Mono only inside code blocks. Loaded from Google Fonts with a real fallback stack.
- Layout: max-width 1240px, 12-column grid, asymmetric but balanced. Quiet components: one hairline border, no shadows, no gradients, no glassmorphism.
- Sidebar modules are borderless blocks separated by hairlines with a tiny uppercase kicker. Do not drop coloured "panel" boxes into the sidebar.
- Placeholders: hatched `.ph` blocks with a caption say what photo goes there. Anything tagged `mock` or in `[square brackets]` is sample content.

## Writing rules for site copy

Thoughtful, clear, personal, technically credible, calm. No marketing language: never "passionate", "innovative solutions", "cutting-edge", "transforming ideas into reality". Prefer concrete detail ("40 minutes, PETG") over adjectives. Sentence case for labels. Keep the owner's real voice; do not genericise personal paragraphs (the Fenerbahçe congress membership and the Anatolian side stay).

## Working conventions

- Before changing a page, open `assets/site.css` and reuse an existing class; add new rules at the end of the file under a dated comment.
- Every change that touches layout must be checked at 1440px, 1000px and 390px, in light and dark, in EN and TR. `site.js` translates by exact text match: when you add UI text, add its Turkish string to the dictionary at the bottom of `site.js`.
- Do not introduce external scripts, trackers or ads. Exceptions (owner decision, 2026-11-04): Google Fonts, and the Cloudflare Web Analytics beacon (cookieless; rendered by `src/components/Analytics.astro` only when `PUBLIC_CF_ANALYTICS_TOKEN` is set). No other analytics, tracking or advertising script may be added.
- Contact address and social profile URLs live in `src/config/site.ts`; do not hard-code them in pages. Instagram is `enabled: false` (private account) until the owner says otherwise. The owner's personal mailbox never goes into the repo: `hello@burakozkan.net` is a Cloudflare Email Routing alias.
- While `PUBLIC_COMING_SOON` is `'true'` (deploy.yml) `/` is a holding page and all other pages are noindex; the real home is at `/preview/` (docs/roadmap.md, "Coming-soon mode"). Do not remove the flag before the owner says the site launches.
- Language is the URL: English at `/`, Turkish at `/tr/` (ADR-006). A `/tr/` page without a real translation is a noindex fallback; register a real one in `src/i18n/translated.ts`.
- Mock images are illustrations generated for layout; do not describe them to the owner as photos.
- Commit messages: imperative, one line, what and why (`Add gear filters; previous ones were unstyled spans`).
- When a decision is hard to reverse (framework, URL scheme, content storage, hosting), write `docs/decisions/ADR-NNN-title.md` first.

## Known gaps in the prototype (do not "fix" silently; see roadmap)

- Email subscribe form is not connected to a provider.
- Filters on Gear and Life pages are visual only; only the home feed filters work.
- Most images outside the home hero are placeholders.
- The TR dictionary covers UI chrome and the home feed, not all page body copy (intended: content is translated at publish time).
- Mobile menu is a simple dropdown; the original full-screen menu design was not carried over.
- `agentic-workflows.html` has the Fenerbahçe/football sample removed; About keeps it.

## Owner context that matters

- 14+ years in software (since 2012), 8 as an architect; .NET, Azure, AWS, PostgreSQL/SQL Server, Kubernetes. CV-verified career rows live on the About page. Comfortable with code; do not over-explain.
- Comfortable in Turkish and English; will often write prompts in Turkish. Reply in the language he uses.
- Had a WordPress blog that went silent for 4–5 years; he closed it. Low-friction publishing is the whole point of this project.
- Active elsewhere on LinkedIn, Instagram and GitHub; those are the only social links to show (GitHub added 2026-11-04 at the owner's request).
