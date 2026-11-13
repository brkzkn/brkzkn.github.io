// Content collections for burakozkan.net. Field reference: docs/content-model.md, ADR-003 and ADR-005.
// Rendering of every type (note, album, ...) is decided by the page owners from `type`; nothing here renders.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const LANGS = ['tr', 'en'] as const;

// ---- posts ---------------------------------------------------------------------------------
// Folder:  src/content/posts/<year>/<yyyy-mm-dd>-<slug>/index.<lang>.md   (photos colocated)
//
// Translated siblings: `index.tr.md` and `index.en.md` in the SAME folder are two files of one post.
//  - the folder name decides the slug (date prefix stripped), so both share the URL slug `<slug>`;
//  - the file suffix is the language of that file's text; `lang` in frontmatter is the ORIGINAL language
//    of the post and is identical in both siblings; `translated: true` marks that a sibling exists;
//  - entry ids are `<slug>.<suffix>` (e.g. `kadikoy-kalamar.tr`) so siblings never collide. Use
//    postSlug(entry) / postFileLang(entry) from src/lib/posts.ts rather than parsing ids by hand.
//  - Phase 1 ships English routes only (ADR-002). Until `/tr/` routes exist, pages pick the `en` file when
//    present, otherwise the single file, and show the original-language marker from `lang`.
const platform = z.object({
  id: z.enum(['netflix', 'prime', 'appletv', 'disney', 'mubi', 'cinema']),
  href: z.url().optional(), // without href the chip is a plain label
});

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/index.{en,tr}.md',
    generateId: ({ entry }) => {
      const parts = entry.split('/');
      const file = parts.pop() ?? '';
      const folder = parts.pop() ?? '';
      const fileLang = file.match(/^index\.(en|tr)\.md$/)?.[1] ?? 'en';
      const slug = folder.replace(/^\d{4}-\d{2}-\d{2}-/, '');
      return `${slug}.${fileLang}`;
    },
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().optional(), // optional for note / album
        type: z.enum([
          'note', 'album', 'writing', 'project', 'milestone',
          'review', 'restaurant', 'trip', 'monthly', 'link',
        ]).default('note'),
        category: z.enum(['work', 'projects', 'travel', 'culture', 'family', 'gear', 'personal']),
        date: z.coerce.date(),
        lang: z.enum(LANGS), // original language of the post
        translated: z.boolean().default(false), // a sibling file in the other language exists
        tags: z.array(z.string()).default([]),
        place: z
          .object({
            name: z.string().optional(),
            area: z.string().optional(),
            lat: z.number().optional(),
            lng: z.number().optional(),
          })
          .optional(),
        photos: z.array(image()).default([]), // trips take 1-4
        cover: image().optional(), // trips, writing; film/series poster (2:3); device product image
        alt: z.array(z.string()).default([]), // optional alt text per photo, same order as `photos`
        rating: z.number().int().min(1).max(5).optional(), // review, restaurant
        link: z.string().optional(), // detail page route (restaurant, trip, album) or external URL for type: link
        draft: z.boolean().default(false),
        sample: z.boolean().default(false), // sample content, tracked for the launch cleanup (docs/roadmap.md)

        // review (book, film, series, device)
        subject: z.string().optional(), // Book | Film | Series | Device | ...
        creator: z.string().optional(),
        platforms: z.array(platform).optional(), // film and series only

        // restaurant (category: culture)
        name: z.string().optional(),
        cuisine: z.string().optional(),
        area: z.string().optional(),
        price: z.number().int().min(1).max(4).optional(),
        visited: z.coerce.date().optional(),
        order: z.string().optional(), // what I would order again
        photo: image().optional(),

        // trip (category: travel)
        destination: z.string().optional(),
        country: z.string().optional(),
        dates: z.string().optional(), // a range written as text: "14 to 16 Mar 2025"
        days: z.number().int().positive().optional(),
      })
      .superRefine((d, ctx) => {
        const need = (ok: unknown, path: string, msg: string) =>
          ok || ctx.addIssue({ code: 'custom', path: [path], message: msg });
        if (d.type === 'writing') need(d.title, 'title', 'writing posts need a title');
        if (d.type === 'restaurant') need(d.name, 'name', 'restaurant posts need a name');
        if (d.type === 'trip') need(d.destination, 'destination', 'trip posts need a destination');
        if (d.type === 'review') need(d.subject, 'subject', 'review posts need a subject (Book, Film, ...)');
        if (d.type === 'trip' && d.photos.length > 4) need(false, 'photos', 'trips take at most 4 photos');
      }),
});

// ---- work (anonymised case studies) -------------------------------------------------------
// Folder: src/content/work/<slug>/index.md (cover and diagram colocated or in public/). See content-model.md:
// required: summary, facts (role, duration, stack), sections.problem, sections.decisions (each with trade-off).
// Empty sections are not rendered; order is fixed by the renderer; `[n]` placeholders in metrics block publishing.
const section = z.string(); // markdown
const work = defineCollection({
  loader: glob({
    base: './src/content/work',
    pattern: '**/index.md',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(), // anonymised: "Multi-brand retailer"
      industry: z.string(),
      years: z.string(), // "2024 to 2025"
      date: z.coerce.date(), // sort key
      role: z.string(),
      duration: z.string(),
      stack: z.array(z.string()).min(1),
      summary: z.string(), // the lede
      sections: z.object({
        context: section.optional(),
        problem: section,
        constraints: section.optional(),
        decisions: z.array(z.object({ title: z.string(), body: section, tradeoff: z.string() })).min(1),
        boundaries: section.optional(), // system map text
        operations: section.optional(),
        outcomes: section.optional(),
        lessons: section.optional(),
      }),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]), // outcome strip, needs >= 2 real figures
      featured: z.boolean().default(false),
      featuredOrder: z.number().optional(),
      cover: image().optional(), // 56:19; when absent the renderer shows `diagram`
      diagram: z.string().optional(), // path of an SVG under public/, e.g. /assets/diagrams/orders.svg
      draft: z.boolean().default(false),
      sample: z.boolean().default(false),
    }),
});

// ---- gear: one file per device, src/content/gear/<slug>.md --------------------------------
// Categories are fixed and language-independent (labels and icons live in src/lib/gear.ts). The English and Turkish
// pages render the same files: `take` is the English line, `takeTr` the Turkish one; model names are never translated.
// Only `name`, `category` and `take` are required: nothing is shown for a status or a date that is not known.
const gear = defineCollection({
  loader: glob({ base: './src/content/gear', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      category: z.enum(['computing', 'smart-home', 'workshop', 'everyday', 'entertainment']),
      take: z.string(), // 2–3 lines of personal experience, English
      takeTr: z.string().optional(), // the same in Turkish; falls back to `take` on /tr/gear/
      status: z.enum(['in-use', 'retired', 'sold']).optional(), // retired and sold both render as "previously used"
      since: z.string().regex(/^\d{4}(-\d{2})?$/).optional(), // "2021" or "2021-03": when it arrived
      until: z.string().regex(/^\d{4}(-\d{2})?$/).optional(), // when it left
      updated: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/).optional(), // last edit of this entry; feeds "Last updated"
      image: image().optional(), // product photo next to the file, e.g. ./images/<slug>.jpg; a category icon stands in without one
      imageFit: z.enum(['cover', 'contain']).default('cover'), // contain for square product renders on white, so nothing is cropped
      imageAlt: z.string().optional(), // defaults to `name`
      imageAltTr: z.string().optional(),
      related: z.array(z.string()).default([]), // post slugs, kept as data; cards do not link out (owner decision, 2026-11-13)
      rating: z.number().min(0.5).max(5).multipleOf(0.5).optional(), // the owner's own score, half steps; the card footer is omitted without it
      order: z.number().int().optional(), // manual sort inside the grid; lower comes first, unset sorts after
      draft: z.boolean().default(false),
      sample: z.boolean().default(false), // design fixture, not a verified device; hidden when PUBLIC_PREVIEW is 'false'
    }), // `notes` is the Markdown body
});

// ---- pages: about, now ---------------------------------------------------------------------
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      updated: z.coerce.date().optional(),
      lang: z.enum(LANGS).default('en'),
      portrait: image().optional(),
      draft: z.boolean().default(false),
      sample: z.boolean().default(false),
    }),
});

export const collections = { posts, work, gear, pages };
