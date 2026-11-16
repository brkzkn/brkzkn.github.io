// Home feed model. A feed entry has the same shape as the prototype's FEED_ENTRIES (feed-data.js), so the
// renderers in src/components/feed/ draw both the real posts (via postToEntry) and the dev review page examples.
// Conventions that fill the fields the posts schema does not have (documented in docs/content-model.md):
//   body = first paragraph is the lede / note text / caption; later `##` sections are read by name:
//   project: "## Status", "## What changed" (list), "## Next step"; review: "## Recommend"; link: "## About the link";
//   monthly: "## Stats" ("- 3 | films") and "## Highlight". Everything else is derived (labels, dates, hrefs).
import { getPosts, postSlug, type Post } from './posts';
import { writingMeta } from './writing';

export interface FeedEntry { id: string; type: string; category: string; publishedAt: string; language: string; tags: string[]; sample?: boolean; [k: string]: any }

export const feedTypeLabels: Record<string, string> = {
  note: 'Short note', album: 'Photo album', writing: 'Writing', project: 'Project update', milestone: 'Milestone',
  review: 'Review', restaurant: 'Restaurant', trip: 'Trip', monthly: 'Monthly summary', link: 'Shared link',
};
export const feedCategoryLabels: Record<string, string> = {
  work: 'Work', projects: 'Projects', travel: 'Travel', culture: 'Culture', family: 'Family', gear: 'Gear', personal: 'Personal',
};
/** The home feed has no Restaurants topic: a post with category `restaurant` is listed under Culture there (ADR-005, ADR-007). */
export const feedCategory = (category: string) => (category === 'restaurant' ? 'culture' : category);
// Where a film or series was watched. `mark` is a neutral monogram, not a logo (real logos are brand assets).
export const feedPlatforms: Record<string, { label: string; mark: string }> = {
  netflix: { label: 'Netflix', mark: 'N' }, prime: { label: 'Prime Video', mark: 'P' }, appletv: { label: 'Apple TV+', mark: 'tv' },
  disney: { label: 'Disney+', mark: 'D+' }, mubi: { label: 'MUBI', mark: 'M' }, cinema: { label: 'Cinema', mark: '' },
};
export const langNames: Record<string, string> = { en: 'English', tr: 'Turkish' };

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const parts = (e: { publishedAt: string }) => { const [y, m, d] = e.publishedAt.split('-'); return { y, m, d, month: `${y}-${m}` }; };
export const dateText = (e: { publishedAt: string }) => { const p = parts(e); return p.d ? `${p.d} ${months[+p.m - 1]}` : months[+p.m - 1]; };
export const fullDate = (e: { publishedAt: string }) => { const p = parts(e); return p.d ? `${+p.d} ${months[+p.m - 1]} ${p.y}` : `${monthsLong[+p.m - 1]} ${p.y}`; };
export const monthName = (key: string) => { const [y, m] = key.split('-'); return `${monthsLong[+m - 1]} ${y}`; };

// Prototype-era paths (dev review data keeps them) -> Astro routes and root-relative images.
const ROUTES: Record<string, string> = {
  'index.html': '/', 'work.html': '/work/', 'architecture-notes.html': '/work/architecture-notes/', 'projects.html': '/projects/',
  'smart-home.html': '/projects/smart-home/', 'life.html': '/life/', 'london-guide.html': '/life/trips/london-guide/',
  'october-2026.html': '/life/culture/2026-10/', 'restaurant.html': '/life/restaurants/kucuk-liman/', 'gear.html': '/gear/',
  'note.html': '/notes/kadikoy-kalamar/', 'blog.html': '/writing/', 'agentic-workflows.html': '/writing/agentic-workflows/', 'profile.html': '/about/',
};
export const fixHref = (h?: string) => {
  if (!h) return h;
  const [file, hash] = h.split('#');
  return (ROUTES[file] ?? file) + (hash ? `#${hash}` : '');
};
export const fixSrc = (s: string) => (/^(https?:|\/|data:)/.test(s) ? s : `/${s}`);

// ---- body helpers ----------------------------------------------------------------------------
export const plainText = (s: string) =>
  s.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();

export function bodyParts(raw = '') {
  const text = raw.replace(/<!--[\s\S]*?-->/g, '');
  const chunks = text.split(/^## +/m);
  const intro = chunks.shift() ?? '';
  const paragraphs = intro.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  const sections = new Map<string, string>();
  for (const c of chunks) { const nl = c.indexOf('\n'); sections.set(c.slice(0, nl < 0 ? undefined : nl).trim().toLowerCase(), nl < 0 ? '' : c.slice(nl + 1).trim()); }
  return { paragraphs, sections, all: [...text.matchAll(/^(?!#|\s*[-*]|\s*$|\s*<).+$/gm)].length };
}
const listOf = (s = '') => s.split('\n').filter((l) => /^\s*[-*]\s+/.test(l)).map((l) => plainText(l.replace(/^\s*[-*]\s+/, '')));
const iso = (d: Date) => d.toISOString().slice(0, 10);
const hasTime = (d: Date) => d.getUTCHours() + d.getUTCMinutes() > 0;

/** Title of a post for lists and <title>: its title, or the lead clause of its first paragraph (notes have no title). */
export function postHeading(p: Post): string {
  if (p.data.title) return p.data.title;
  const lead = plainText(bodyParts(p.body).paragraphs[0] ?? '');
  const clause = lead.split(/[:.]/)[0] ?? lead;
  return clause.length > 70 ? clause.slice(0, 67).trimEnd() + '…' : clause;
}

export function postToEntry(p: Post): FeedEntry {
  const d = p.data, slug = postSlug(p), b = bodyParts(p.body);
  const lede = plainText(b.paragraphs[0] ?? '');
  const photos = d.photos.map((im, i) => ({ src: im.src, alt: d.alt[i] ?? '', w: im.width, h: im.height }));
  const img = (im?: { src: string; width: number; height: number }, alt = d.alt[0] ?? '') => (im ? { src: im.src, alt, w: im.width, h: im.height } : undefined);
  const e: FeedEntry = {
    id: slug, type: d.type, category: feedCategory(d.category), publishedAt: iso(d.date), language: d.lang, tags: d.tags, sample: d.sample,
  };
  const detail = b.paragraphs.length > 1 || b.sections.size > 0 || (d.photos.length === 0 && d.alt.length > 0);
  switch (d.type) {
    case 'note':
      Object.assign(e, { body: lede, href: detail ? `/notes/${slug}/` : undefined, linkLabel: 'Open note' });
      break;
    case 'album':
      Object.assign(e, { title: d.title, caption: lede, place: d.place?.name ?? '', photos });
      break;
    case 'writing': {
      const m = writingMeta(p);
      const full = b.all > 1;
      Object.assign(e, {
        title: d.title, summary: full ? m.lede : lede, cover: img(d.cover), href: full ? `/writing/${slug}/` : undefined,
        readingMinutes: full ? m.minutes : undefined, art: !d.cover && d.category === 'work' ? 'architecture' : undefined,
      });
      break;
    }
    case 'project':
      Object.assign(e, {
        project: d.subject ?? 'Project', title: d.title, status: plainText(b.sections.get('status') ?? ''),
        image: photos[0], changes: listOf(b.sections.get('what changed')), next: plainText(b.sections.get('next step') ?? '') || undefined,
        logHref: d.link, logLabel: d.link === '/projects/smart-home/' ? 'Smart home log' : 'Project log',
      });
      break;
    case 'milestone':
      Object.assign(e, { title: d.title, dateLabel: fullDate(e), body: lede, illustration: 'Illustration, not a family photo' });
      break;
    case 'review': {
      const subject = d.subject ?? 'Review';
      const verb: Record<string, string> = { Book: 'Finished', Exhibition: 'Visited', Concert: 'Heard' };
      const meta = subject === 'Device' ? 'Added to my gear' : `${verb[subject] ?? 'Watched'} ${fullDate(e)}`;
      Object.assign(e, {
        subject, title: d.title, creator: d.creator, cover: img(d.cover), rating: d.rating, ratingMax: 5, meta, body: lede,
        platforms: d.platforms, recommend: plainText(b.sections.get('recommend') ?? '') || undefined,
        href: d.link, linkLabel: subject === 'Device' ? 'Full note on the gear page' : undefined,
        fictional: !d.sample ? undefined : subject === 'Film' ? 'Fictional film and director, sample content.' : subject === 'Book' && d.creator ? 'Fictional book and author, sample content.'
          : subject === 'Series' ? 'Fictional series, sample content.' : subject === 'Exhibition' ? 'Fictional exhibition, sample content.' : subject === 'Concert' ? 'Fictional concert, sample content.' : undefined,
      });
      break;
    }
    case 'restaurant':
      Object.assign(e, {
        name: d.name ?? d.title, cuisine: d.cuisine, area: d.area, price: d.price, rating: d.rating, ratingMax: 5,
        visited: `Visited ${fullDate({ publishedAt: iso(d.visited ?? d.date) })}`, body: lede, order: d.order, photo: img(d.photo),
        href: d.link ?? `/life/restaurants/${slug}/`, linkLabel: 'Restaurant details', fictional: d.sample ? 'Fictional place, sample content.' : undefined,
      });
      break;
    case 'trip':
      Object.assign(e, {
        destination: d.destination, country: d.country, dates: d.dates, days: d.days ? `${d.days} day${d.days === 1 ? '' : 's'}` : undefined,
        caption: lede, photos, href: d.link ?? `/life/trips/${slug}/`, linkLabel: `Read the ${d.destination} guide`,
      });
      break;
    case 'monthly': {
      const stats = (b.sections.get('stats') ?? '').split('\n').filter((l) => l.includes('|')).map((l) => l.replace(/^\s*[-*]\s+/, '').split('|').map((x) => x.trim()));
      const hl = plainText((b.sections.get('highlight') ?? '').split('\n').filter((l) => !l.startsWith('@')).join(' '));
      let short = ''; for (const s of hl.match(/[^.!?]+[.!?]+\s*/g) ?? [hl]) { if (short.length >= 90) break; short += s; }
      Object.assign(e, {
        title: d.title, href: `/life/culture/${iso(d.date).slice(0, 7)}/`, collage: photos, counts: stats.map(([n, l]) => [n, l]), highlight: short.trim() || lede,
      });
      break;
    }
    case 'link': {
      const live = !!d.link && /^https?:/.test(d.link);
      Object.assign(e, {
        comment: lede, url: d.link, domain: live ? new URL(d.link!).hostname.replace(/^www\./, '') : '', linkTitle: d.title,
        description: plainText(b.sections.get('about the link') ?? ''), verified: live,
      });
      break;
    }
  }
  return e;
}

/** All published posts as feed entries, newest first (date, then time). */
export async function getFeedEntries(): Promise<FeedEntry[]> {
  const posts = await getPosts();
  return posts.map((p) => ({ p, e: postToEntry(p) })).sort((a, b) => +b.p.data.date - +a.p.data.date).map((x) => x.e);
}

/** Every string an entry shows, for client-side search (the prototype's collect()). Computed at build time. */
export function searchText(e: FeedEntry): string {
  const skip = new Set(['src', 'href', 'logHref', 'url', 'id']);
  const out: string[] = [];
  const walk = (v: any) => {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => skip.has(k) || walk(x));
  };
  walk(e);
  out.push(feedCategoryLabels[e.category], feedTypeLabels[e.type], dateText(e), fullDate(e));
  return out.join(' ');
}
export { hasTime };
