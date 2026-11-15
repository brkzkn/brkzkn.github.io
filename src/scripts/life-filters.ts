// Life timeline category filter. Island for components/life/LifeTimeline.astro: hides cards outside the chosen
// category, hides the months left empty, re-packs the rows of each visible month (same rule as the build, see
// src/lib/life-layout.ts), keeps aria-pressed on the real <button> filters, updates the live count and shows the
// empty state. No URL change, no fetch; data-life-* attributes so the home-feed and Gear filters never bind here.
// The line of the timeline belongs to the container, so it follows the months that are still visible on its own.
import { packRow, type LifeRow } from '../lib/life-layout';

const root = document.querySelector<HTMLElement>('[data-life-root]');
if (root) {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-life-filter]')];
  const months = [...root.querySelectorAll<HTMLElement>('[data-life-month]')].map((el) => ({
    el,
    cards: [...el.querySelectorAll<HTMLElement>('[data-life-card]')],
  }));
  const timeline = root.querySelector<HTMLElement>('[data-life-timeline]');
  const summary = root.querySelector<HTMLElement>('[data-life-summary]');
  const empty = root.querySelector<HTMLElement>('[data-life-empty]');
  const one = root.dataset.one ?? '1 entry';
  const many = root.dataset.many ?? '{n} entries';
  let selected = 'all';

  const apply = () => {
    let count = 0;
    for (const month of months) {
      const shown = month.cards.filter((card) => {
        const show = selected === 'all' || card.dataset.lifeCategory === selected;
        card.hidden = !show;
        return show;
      });
      month.el.hidden = shown.length === 0;
      packRow(shown.map((card) => card.dataset.lifeRow as LifeRow)).forEach((span, i) => (shown[i].dataset.span = span));
      count += shown.length;
    }
    if (timeline) timeline.hidden = count === 0;
    if (summary) summary.textContent = count === 1 ? one : many.replace('{n}', String(count));
    if (empty) empty.hidden = count !== 0;
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.lifeFilter === selected));
  };

  for (const b of buttons) {
    b.addEventListener('click', () => {
      selected = b.dataset.lifeFilter ?? 'all';
      apply();
    });
    // On phones the row scrolls sideways: bring a filter reached with the keyboard fully into view.
    b.addEventListener('focus', () => b.scrollIntoView({ block: 'nearest', inline: 'nearest' }));
  }
  root.querySelector('[data-life-reset]')?.addEventListener('click', () => {
    selected = 'all';
    apply();
    buttons[0]?.focus();
  });
}
