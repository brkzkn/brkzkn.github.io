// Personal ratings (0.5 steps, out of 5), shared by Gear cards and Life cards. Drawing is src/components/StarRating.astro.
export type StarKind = 'full' | 'half' | 'empty';
/** The state of star `i` (0-based) for a rating: 3.5 -> full, full, full, half, empty. */
export const starKind = (rating: number, i: number): StarKind => (rating >= i + 1 ? 'full' : rating >= i + 0.5 ? 'half' : 'empty');
/** 4.5 -> "4.5" in English, "4,5" in Turkish. */
export const formatRating = (rating: number, lang: 'en' | 'tr') => (lang === 'tr' ? String(rating).replace('.', ',') : String(rating));
