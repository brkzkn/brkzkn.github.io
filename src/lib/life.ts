// Life timeline data layer: the four user-facing categories, the three card families, the month groups and the copy
// the /life/ and /tr/life/ pages share. Entries come from the posts collection (schema in src/content.config.ts).
//
// Category and type are two independent axes (ADR-007):
//  - the *category* is what the post is about and what the reader filters by. It is the post's `category` field,
//    nothing else: family, travel, restaurant or culture. Posts of any other category are not on the Life page.
//  - the *type* (note, album, ..., restaurant) is how the post is drawn: it only picks the card family.
// A `type: restaurant` post is normally `category: restaurant`, but neither implies the other: a note about a
// dinner can be filed under restaurant, and nothing here looks at the type to decide a category.
import type { ImageMetadata } from 'astro';
import { getPosts, postSlug, postUrl, postFileLang, type Post } from './posts';
import { parseBody, isoMonth, isoDay } from './life-body';
import { plainText } from './feed';
import { packRow, rowOf, type LifeFamily, type LifeSpan } from './life-layout';

export type LifeLang = 'en' | 'tr';
export type LifeCategoryId = 'family' | 'travel' | 'restaurant' | 'culture';
export const LIFE_TYPES = ['note', 'album', 'review', 'milestone', 'trip', 'monthly', 'restaurant'] as const;
export type LifeType = (typeof LIFE_TYPES)[number];

/** Ids are stable and language-independent. Order here is the order of the filter row. `tag` is the short label on a card. */
export const LIFE_CATEGORIES: ReadonlyArray<{ id: LifeCategoryId; en: string; tr: string; tag: Record<LifeLang, string>; icon: string }> = [
  { id: 'family', en: 'Family & Milestones', tr: 'Aile ve Özel Anlar', tag: { en: 'Family', tr: 'Aile' }, icon: 'heart' },
  { id: 'travel', en: 'Travel', tr: 'Seyahat', tag: { en: 'Travel', tr: 'Seyahat' }, icon: 'pin' },
  { id: 'restaurant', en: 'Restaurants', tr: 'Restoranlar', tag: { en: 'Restaurant', tr: 'Restoran' }, icon: 'utensils' },
  { id: 'culture', en: 'Culture', tr: 'Kültür & Sanat', tag: { en: 'Culture', tr: 'Kültür & Sanat' }, icon: 'ticket' },
];

/** The Life category of a post: its `category` field when that is one of the four, otherwise null (not on the Life page). */
export function lifeCategoryOf(d: { category: string }): LifeCategoryId | null {
  return LIFE_CATEGORIES.find((c) => c.id === d.category)?.id ?? null;
}

/** Seven post types, three card families. A review is a photo card only when it has a real cover. */
export function familyOf(type: LifeType, hasImage: boolean): LifeFamily {
  if (type === 'trip' || type === 'milestone') return 'featured';
  if (type === 'note') return 'compact';
  if (type === 'review') return hasImage ? 'standard' : 'compact';
  return 'standard'; // album, restaurant, monthly
}

export type LifeMedia =
  | { kind: 'image'; src: ImageMetadata; alt: string; portrait: boolean }
  | { kind: 'ph'; cap: string; hue: string }; // hatched placeholder: sample entries and the dev review page only

export interface LifeEntry {
  id: string;
  type: LifeType;
  category: LifeCategoryId;
  family: LifeFamily;
  month: string; // yyyy-mm, the group key
  iso: string; // <time datetime>
  dateText: string;
  lang: LifeLang; // original language of the post
  textLang?: LifeLang; // language of the text shown (the file's language). Unknown -> no language chip, no lang attribute
  title?: string; // notes and albums may have none
  text: string;
  href?: string; // only when a real page exists
  cta?: string;
  tag: string;
  warm: boolean; // milestone: the one warm tag
  kind?: string; // small label next to the tag: review subject, trip length, "Culture diary"
  facts: string[]; // place, photo count
  rating?: number;
  media?: LifeMedia;
}

const MONTHS: Record<LifeLang, { short: string[]; long: string[] }> = {
  en: {
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
  tr: {
    short: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    long: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  },
};
/** "2026-10" -> { short: "Oct 2026", long: "October 2026" } (Eki 2026 / Ekim 2026). */
export function monthLabel(month: string, lang: LifeLang): { short: string; long: string } {
  const [y, m] = month.split('-').map(Number);
  return { short: `${MONTHS[lang].short[m - 1]} ${y}`, long: `${MONTHS[lang].long[m - 1]} ${y}` };
}
/** 30 Oct 2026 / 30 Eki 2026 */
export const dayLabel = (d: Date, lang: LifeLang) => `${d.getUTCDate()} ${MONTHS[lang].short[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

const SUBJECTS_TR: Record<string, string> = { Book: 'Kitap', Film: 'Film', Series: 'Dizi', Device: 'Cihaz', Theatre: 'Tiyatro', Concert: 'Konser', Exhibition: 'Sergi', Game: 'Oyun', Album: 'Albüm', Podcast: 'Podcast' };

export function lifeCopy(lang: LifeLang) {
  return lang === 'tr'
    ? {
        title: 'Yaşam',
        h1: 'Hatırlamak istediğim hayat.',
        description: 'Dönüm noktaları, geziler, izlediklerimiz ve okuduklarımız, bir de sonradan önem kazandığı anlaşılan sıradan günler. Kendimiz için yazıldı, herkese açık bırakıldı.',
        sampleNote: 'içerikler örnektir',
        heroCapA: 'Fotoğraf: dördümüz arkadan, Caddebostan sahili',
        heroCapB: 'Fotoğraf: bilet koçanları',
        all: 'Tümü', filterLabel: 'Kategoriye göre filtrele', timelineLabel: 'Zaman çizelgesi',
        one: '1 içerik', many: '{n} içerik',
        emptyH: 'Bu kategoride henüz içerik yok.', emptyP: 'Başka bir kategori seç ya da tüm zaman çizelgesine dön.', emptyBtn: 'Tümünü göster',
        noneH: 'Zaman çizelgesi şimdilik boş.', noneP: 'Kayıtlar yaşandıkça eklenecek. Yakında.',
        originalNote: 'Türkçesi olmayan içerikler yazıldıkları dilde gösterilir ve kartta belirtilir.',
        milestone: 'Özel an', diary: 'Kültür günlüğü',
        days: (n: number) => `${n} gün`, photos: (n: number) => `${n} fotoğraf`,
        rated: (r: string) => `5 üzerinden ${r} puan`,
        cta: { trip: 'Rehberi oku', restaurant: 'Detaylar', monthly: 'Günlüğü aç', note: 'Notu oku' },
        subject: (s: string) => SUBJECTS_TR[s] ?? s,
      }
    : {
        title: 'Life',
        h1: 'The life I want to remember.',
        description: 'Milestones, trips, what we watched and read, and the ordinary days that turned out to matter. Written for us, left open for anyone.',
        sampleNote: 'entries are samples',
        heroCapA: 'Photo: the four of us from behind, Caddebostan shore',
        heroCapB: 'Photo: ticket stubs',
        all: 'All', filterLabel: 'Filter by category', timelineLabel: 'Timeline',
        one: '1 entry', many: '{n} entries',
        emptyH: 'Nothing in this category yet.', emptyP: 'Pick another category or go back to the full timeline.', emptyBtn: 'Show all',
        noneH: 'The timeline is empty for now.', noneP: 'Entries get added as they happen. Soon.',
        originalNote: '',
        milestone: 'Milestone', diary: 'Culture diary',
        days: (n: number) => `${n} day${n === 1 ? '' : 's'}`, photos: (n: number) => `${n} photo${n === 1 ? '' : 's'}`,
        rated: (r: string) => `Rated ${r} out of 5`,
        cta: { trip: 'Read the guide', restaurant: 'Details', monthly: 'Open the diary', note: 'Read the note' },
        subject: (s: string) => s,
      };
}
export type LifeCopy = ReturnType<typeof lifeCopy>;

// Placeholder tint per type (sample imagery only; a real photo replaces the block).
const PH_HUE: Record<LifeType, string> = { trip: 'deep', milestone: 'sage', restaurant: 'warm', monthly: 'plum', album: 'sand', review: 'sand', note: 'sage' };

/** One post -> one card. Returns null for posts that do not belong on the Life page. */
export function toLifeEntry(p: Post, lang: LifeLang): LifeEntry | null {
  const d = p.data;
  const category = lifeCategoryOf(d);
  if (!category || !(LIFE_TYPES as readonly string[]).includes(d.type)) return null;
  const type = d.type as LifeType;
  const c = lifeCopy(lang);
  const slug = postSlug(p);
  const body = parseBody(p.body ?? '');

  const image: ImageMetadata | undefined =
    type === 'restaurant' ? d.photo ?? d.photos[0]
    : type === 'album' || type === 'note' ? d.photos[0] ?? d.cover
    : type === 'review' ? d.cover
    : d.cover ?? d.photos[0]; // trip, milestone, monthly
  const family = familyOf(type, !!image);
  const media: LifeMedia | undefined = image
    ? { kind: 'image', src: image, alt: d.alt[0] ?? '', portrait: image.width / image.height < 0.85 }
    : d.sample && d.alt[0] && family !== 'compact'
      ? { kind: 'ph', cap: d.alt[0], hue: PH_HUE[type] }
      : undefined;

  // Detail routes are the existing ones; an entry without a page of its own gets no link at all.
  const href =
    type === 'monthly' ? `/life/culture/${isoMonth(d.date)}/`
    : type === 'trip' ? `/life/trips/${slug}/`
    : type === 'restaurant' ? `/life/restaurants/${slug}/`
    : d.sample ? undefined // sample notes have no page of their own yet
    : postUrl(p);
  const cta = !href ? undefined : type === 'trip' ? c.cta.trip : type === 'restaurant' ? c.cta.restaurant : type === 'monthly' ? c.cta.monthly : c.cta.note;

  // The card shows the date the timeline sorts by. A restaurant's visit date stays on its detail page.
  const dateText = type === 'monthly' ? monthLabel(isoMonth(d.date), lang).long : type === 'trip' && d.dates ? d.dates : dayLabel(d.date, lang);

  const kind =
    type === 'review' && d.subject ? c.subject(d.subject)
    : type === 'trip' && d.days ? c.days(d.days)
    : type === 'monthly' ? c.diary
    : undefined;
  const facts: string[] = [];
  if (type === 'restaurant' && (d.area ?? d.place?.area)) facts.push((d.area ?? d.place?.area)!);
  if (type === 'album' && d.place?.name) facts.push(d.place.name);
  if (type === 'album' && d.photos.length > 1) facts.push(c.photos(d.photos.length));

  return {
    id: slug, type, category, family,
    month: isoMonth(d.date), // a monthly diary is dated inside the month it covers (its URL is built from the same date)
    iso: type === 'monthly' ? isoMonth(d.date) : isoDay(d.date),
    dateText,
    lang: d.lang,
    textLang: postFileLang(p),
    title: type === 'restaurant' ? d.name ?? d.title : type === 'trip' ? d.title ?? d.destination : d.title,
    text: plainText(body.sections.get('Summary')?.before[0] ?? body.lede),
    href, cta,
    tag: type === 'milestone' ? c.milestone : LIFE_CATEGORIES.find((x) => x.id === category)!.tag[lang],
    warm: type === 'milestone',
    kind, facts,
    rating: d.rating,
    media,
  };
}

/** Published Life entries, newest first. A Turkish page prefers the Turkish file of a translated post. */
export async function getLifeEntries(lang: LifeLang): Promise<{ entries: LifeEntry[]; hasSamples: boolean; mixedLanguage: boolean }> {
  const posts = (await getPosts(lang)).filter((p) => toLifeEntry(p, lang));
  return {
    entries: posts.map((p) => toLifeEntry(p, lang)!),
    hasSamples: posts.some((p) => p.data.sample),
    mixedLanguage: posts.some((p) => postFileLang(p) !== lang),
  };
}

export interface LifeMonth { month: string; short: string; long: string; cards: { e: LifeEntry; span: LifeSpan }[] }

/** Entries (already newest first) -> month groups, newest month first, each card with its row width. */
export function groupByMonth(entries: LifeEntry[], lang: LifeLang): LifeMonth[] {
  const sorted = [...entries].sort((a, b) => (a.month < b.month ? 1 : a.month > b.month ? -1 : 0)); // stable: order inside a month is kept
  const groups: LifeMonth[] = [];
  for (const e of sorted) {
    let g = groups.at(-1);
    if (!g || g.month !== e.month) groups.push((g = { month: e.month, ...monthLabel(e.month, lang), cards: [] }));
    g.cards.push({ e, span: 'wide' });
  }
  for (const g of groups) packRow(g.cards.map((x) => rowOf(x.e.family, x.e.media))).forEach((span, i) => (g.cards[i].span = span));
  return groups;
}
