// Helpers for the Writing pages (/writing/ and /writing/<slug>/). Posts of type `writing` come from the posts collection.
import { getPosts, postSlug, type Post } from './posts';

export const isPreview = import.meta.env.PUBLIC_PREVIEW !== 'false';

/** Filter bucket used by the Writing page: work -> architecture, projects -> projects, everything else -> life. */
export const filterOf = (p: Post) =>
  p.data.category === 'work' ? 'architecture' : p.data.category === 'projects' ? 'projects' : 'life';

const TOPIC: Record<Post['data']['category'], string> = {
  work: 'Software architecture', projects: 'Projects', travel: 'Travel', culture: 'Culture', restaurant: 'Culture',
  family: 'Personal notes', gear: 'Gear', personal: 'Personal notes',
};

// TEMPORARY presentation extras per slug (lede, topic, read time, image captions). The posts schema has no
// summary / readingMinutes / topic fields yet (see needsFromOthers in the group report). Every value falls
// back to something derived from the post itself, so a new writing post works without an entry here.
type Extra = { lede?: string; topic?: string; minutes?: number; card?: string; tone?: string };
const EXTRAS: Record<string, Extra> = {
  'agentic-workflows': {
    lede: 'The diagram you draw before you understand the constraints becomes the thing you defend instead of the thing you test.',
    topic: 'Software architecture',
    minutes: 7,
    card: 'Illustration: a crossed-out architecture diagram',
    tone: 'blue',
  },
};

const plain = (md: string) => md.replace(/<[^>]+>/g, '').replace(/[#>*_`]/g, '').trim();
const firstParagraph = (body = '') =>
  plain(body.split(/\n\s*\n/).find((s) => s.trim() && !/^\s*(#|<pre|>)/.test(s)) ?? '');

export function writingMeta(p: Post) {
  const x = EXTRAS[postSlug(p)] ?? {};
  const words = (p.body ?? '').split(/\s+/).filter(Boolean).length;
  const lede = x.lede ?? firstParagraph(p.body);
  return {
    lede,
    topic: x.topic ?? TOPIC[p.data.category],
    minutes: x.minutes ?? Math.max(1, Math.round(words / 220)),
    card: x.card ?? p.data.alt[0] ?? 'Cover image',
    tone: x.tone ?? 'blue',
    description: lede.length > 200 ? lede.slice(0, 197) + '…' : lede,
  };
}

const D = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-GB', { ...o, timeZone: 'UTC' });
export const longDate = (d: Date) => D(d, { day: 'numeric', month: 'long', year: 'numeric' });
export const shortDate = (d: Date) => D(d, { day: 'numeric', month: 'short', year: 'numeric' });
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const originTitle = (lang: 'en' | 'tr') => (lang === 'tr' ? 'Written in Turkish' : 'Written in English');

/** Published writing posts, newest first. */
export async function getWriting(): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.data.type === 'writing');
}

// Sample cards from blog.html with no content behind them. They render as non-interactive `.unavailable`
// cards and only while the preview flag is on, so they disappear at launch (docs/roadmap.md cleanup list).
export type SampleCard = {
  filter: 'architecture' | 'projects' | 'life'; cat: string; title: string; text: string;
  iso: string; date: string; min: number; tone: string; cap: string; img?: string;
};
export const SAMPLE_WRITING: SampleCard[] = [
  { filter: 'projects', cat: 'Smart home', title: 'Presence detection without a camera in every room', text: 'mmWave sensors, a few rules about what “home” means, and the automations that stopped turning lights off on guests.', iso: '2026-10-11', date: '11 Oct 2026', min: 9, tone: 'sage', cap: 'Photo: mmWave sensor on skirting', img: '/assets/images/stock-smart-home.jpg' },
  { filter: 'life', cat: 'Personal notes', title: 'Notes from the second year of being a father of two', text: 'Less sleep, better priorities, and a surprising amount of time spent thinking about chairs.', iso: '2026-09-28', date: '28 Sep 2026', min: 5, tone: 'sand', cap: 'Photo: two chairs' },
  { filter: 'architecture', cat: 'Backend engineering', title: 'Outbox before you need it', text: 'Why the outbox table goes in on day one of any service that publishes events, even when it feels like overkill.', iso: '2026-09-02', date: '2 Sep 2026', min: 8, tone: 'deep', cap: 'Diagram: outbox relay' },
  { filter: 'projects', cat: '3D printing', title: 'Printing sensor mounts that match the skirting board', text: 'Measuring a 1970s moulding, three failed prints, and the profile that finally fit.', iso: '2026-04-14', date: '14 Apr 2026', min: 6, tone: 'warm', cap: 'Photo: printed bracket on bench', img: '/assets/images/stock-3d-printer.jpg' },
  { filter: 'projects', cat: 'AI', title: 'What a local model can and cannot do with my photo library', text: 'Evals on a home server, where it worked, where it confidently failed, and what that says about trusting classifiers.', iso: '2026-02-09', date: '9 Feb 2026', min: 12, tone: 'plum', cap: 'Chart: eval results' },
  { filter: 'life', cat: 'Travel', title: 'Travelling with twins: the packing list that survived London', text: 'What we carried, what we never used, and the one thing we bought on arrival.', iso: '2025-03-22', date: '22 Mar 2025', min: 4, tone: 'blue', cap: 'Photo: Elizabeth line platform', img: '/assets/images/mock-london.jpg' },
];

export const SAMPLE_RELATED = [
  { cat: 'Backend engineering', title: 'Outbox before you need it', text: 'Why the outbox table goes in on day one of any service that publishes events.', iso: '2026-09-02', date: '2 Sep 2026', min: 8 },
  { cat: 'Software architecture', title: 'One database per service, enforced by credentials', text: 'Boundaries that live in a diagram erode; boundaries that live in IAM do not.', iso: '2026-06-17', date: '17 Jun 2026', min: 6 },
  { cat: 'Software architecture', title: 'What “operational concerns” actually means in a design review', text: 'A checklist of the questions that only get asked after the first incident.', iso: '2026-03-03', date: '3 Mar 2026', min: 10 },
];

export { postSlug };
