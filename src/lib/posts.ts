// Helpers for the posts collection. Ids are `<slug>.<fileLang>`; see src/content.config.ts.
import { getCollection, type CollectionEntry } from 'astro:content';

/** Sample entries (`sample: true`) are published only while PUBLIC_PREVIEW !== 'false' (docs/roadmap.md, go-live gate). */
export const showSamples = import.meta.env.PUBLIC_PREVIEW !== 'false';

export type Post = CollectionEntry<'posts'>;

export const postSlug = (p: Post) => p.id.replace(/\.(en|tr)$/, '');
export const postFileLang = (p: Post): 'en' | 'tr' => (p.id.endsWith('.tr') ? 'tr' : 'en');
export const postUrl = (p: Post) => `/notes/${postSlug(p)}/`;

/**
 * Published posts, one per slug, newest first. Drafts are hidden in production. When a post has both language files the
 * `prefer` one wins: `en` by default, `tr` for a real Turkish page (so far only /tr/life/).
 */
export async function getPosts(prefer: 'en' | 'tr' = 'en'): Promise<Post[]> {
  const all = await getCollection('posts', (p) => (import.meta.env.DEV || !p.data.draft) && (showSamples || !p.data.sample));
  const bySlug = new Map<string, Post>();
  for (const p of all) {
    const prev = bySlug.get(postSlug(p));
    if (!prev || postFileLang(p) === prefer) bySlug.set(postSlug(p), p);
  }
  return [...bySlug.values()].sort((a, b) => +b.data.date - +a.data.date);
}
