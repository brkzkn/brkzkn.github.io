// Gear catalogue helpers: the five fixed categories, the published device list, and the small formatting
// the /gear/ and /tr/gear/ pages share. Device files live in src/content/gear/ (schema in src/content.config.ts).
import { getCollection, type CollectionEntry } from 'astro:content';
import { showSamples } from './posts';

export type Gear = CollectionEntry<'gear'>;
export type GearLang = 'en' | 'tr';
export type GearCategoryId = Gear['data']['category'];

/** Category ids are stable and language-independent; only the labels change. Order here is the order of the filter row. */
export const GEAR_CATEGORIES: ReadonlyArray<{ id: GearCategoryId; en: string; tr: string; icon: string }> = [
  { id: 'computing', en: 'Computing & Workspace', tr: 'Bilgisayar ve Çalışma Alanı', icon: 'laptop' },
  { id: 'smart-home', en: 'Smart Home & Network', tr: 'Akıllı Ev ve Ağ', icon: 'wifi' },
  { id: 'workshop', en: '3D Printing & Workshop', tr: '3D Baskı ve Atölye', icon: 'cube' },
  { id: 'everyday', en: 'Everyday Tech', tr: 'Günlük Teknoloji', icon: 'zap' },
  { id: 'entertainment', en: 'Entertainment', tr: 'Eğlence', icon: 'gamepad' },
];

export const categoryLabel = (id: GearCategoryId, lang: GearLang) => GEAR_CATEGORIES.find((c) => c.id === id)?.[lang] ?? id;

/** Published devices: drafts hidden in production, samples hidden when PUBLIC_PREVIEW is 'false' (same rule as posts). */
export async function getGear(): Promise<Gear[]> {
  const all = await getCollection('gear', (g) => (import.meta.env.DEV || !g.data.draft) && (showSamples || !g.data.sample));
  const rank = (g: Gear) => (g.data.status === 'in-use' ? 0 : g.data.status === undefined ? 1 : 2);
  return all.sort(
    (a, b) =>
      (a.data.order ?? Infinity) - (b.data.order ?? Infinity) ||
      rank(a) - rank(b) ||
      (b.data.since ?? '').localeCompare(a.data.since ?? '') ||
      a.data.name.localeCompare(b.data.name),
  );
}

const MONTHS: Record<GearLang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  tr: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
};

/** "2024" -> "2024"; "2024-11" or "2024-11-05" -> "Nov 2024" / "Kas 2024". */
export function formatYearMonth(s: string | undefined, lang: GearLang): string | undefined {
  if (!s) return undefined;
  const m = s.match(/^(\d{4})(?:-(\d{2}))?/);
  if (!m) return s;
  return m[2] ? `${MONTHS[lang][+m[2] - 1]} ${m[1]}` : m[1];
}

/** Latest content change across the list: the newest `updated`, `since` or `until`; undefined when nothing is dated. */
export function lastUpdated(items: Gear[]): string | undefined {
  const dates = items.flatMap((g) => [g.data.updated, g.data.since, g.data.until]).filter((d): d is string => !!d);
  return dates.sort().at(-1);
}
