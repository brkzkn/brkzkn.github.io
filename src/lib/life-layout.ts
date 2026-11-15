// Row packing for the Life timeline. Pure, with no Astro imports, because two callers must agree: the build
// (src/lib/life.ts groupByMonth, first paint and no-JS) and the category filter in the browser
// (src/scripts/life-filters.ts), which re-packs each month after hiding cards.
export type LifeFamily = 'compact' | 'standard' | 'featured';
/**
 * The shape a card takes in a row. Compact and featured are their family; a standard card is one of three shapes of
 * very different height: `photo` (3:2 picture above the text), `portrait` (poster beside the text), `text` (no picture).
 */
export type LifeRow = 'compact' | 'photo' | 'portrait' | 'text' | 'featured';
/** full: a featured card, always the whole row. half: one of two neighbours of the same shape. wide: a card left alone in its row. */
export type LifeSpan = 'full' | 'half' | 'wide';

export const rowOf = (family: LifeFamily, media?: { kind: string; portrait?: boolean }): LifeRow =>
  family !== 'standard' ? family : !media ? 'text' : media.kind === 'image' && media.portrait ? 'portrait' : 'photo';

/**
 * One month's cards in chronological order -> the width of each. Order is never changed: only direct neighbours of the
 * same shape share a row, so a short card is never stretched to the height of a photo card.
 */
export function packRow(rows: readonly LifeRow[]): LifeSpan[] {
  const out: LifeSpan[] = [];
  for (let i = 0; i < rows.length; ) {
    const r = rows[i];
    if (r === 'featured') {
      out.push('full');
      i += 1;
    } else if (rows[i + 1] === r) {
      out.push('half', 'half');
      i += 2;
    } else {
      out.push('wide');
      i += 1;
    }
  }
  return out;
}
