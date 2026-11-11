// Helpers for the work collection (case studies). Rules: docs/content-model.md, ADR-004.
import { getCollection, type CollectionEntry } from 'astro:content';

/** Sample entries (`sample: true`) are published only while PUBLIC_PREVIEW !== 'false' (docs/roadmap.md, go-live gate). */
export const showSamples = import.meta.env.PUBLIC_PREVIEW !== 'false';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type Work = CollectionEntry<'work'>;

export const workUrl = (w: Work) => `/work/${w.id}/`;

/** Published case studies, newest first. Drafts are hidden in production. */
export async function getWork(): Promise<Work[]> {
  const all = await getCollection('work', (w) => (import.meta.env.DEV || !w.data.draft) && (showSamples || !w.data.sample));
  return all.sort((a, b) => +b.data.date - +a.data.date);
}

/** Home strip (ADR-004): featured, published; featuredOrder asc then date desc; at most three. */
export async function getFeaturedWork(): Promise<Work[]> {
  const featured = (await getWork()).filter((w) => w.data.featured);
  featured.sort(
    (a, b) =>
      (a.data.featuredOrder ?? Infinity) - (b.data.featuredOrder ?? Infinity) || +b.data.date - +a.data.date,
  );
  if (featured.length > 3) {
    console.warn(`[work] ${featured.length} case studies are featured; the home strip shows the first 3.`);
  }
  return featured.slice(0, 3);
}

/** Reads a diagram SVG from public/ so it can be inlined (the .wk-art styles only apply to inline SVG). */
export function readDiagram(path: string): { svg: string; caption?: string } {
  const svg = readFileSync(join(process.cwd(), 'public', path.replace(/^\//, '')), 'utf8').trim();
  return { svg, caption: svg.match(/data-caption="([^"]*)"/)?.[1] };
}
