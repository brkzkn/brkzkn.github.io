// Life timeline category filter. Island for components/life/LifeTimeline.astro: hides cards outside the chosen
// category, hides the months left empty, re-packs the rows of each visible month (same rule as the build, see
// src/lib/life-layout.ts), keeps aria-pressed on the real <button> filters, updates the live count and shows the
// empty state. No URL change, no fetch; data-life-* attributes so the home-feed and Gear filters never bind here.
// The line of the timeline belongs to the container, so it follows the months that are still visible on its own.
//
// Older years are native <details> (LifeTimeline.astro) and open and close without this script. Here they only get:
// the number of matching entries in their row, `hidden` when nothing in the year matches, and one reveal: a URL hash
// that points inside a closed year opens it (and puts the filter back on All if the filter is what hides the target).
// A filter never opens or closes a year; the reader's choice is kept.
// The count sits inside the <summary>, which is not a live region: only the page count line announces a change.
import { packRow, type LifeRow } from '../lib/life-layout';

const root = document.querySelector<HTMLElement>('[data-life-root]');
if (root) {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-life-filter]')];
  const months = [...root.querySelectorAll<HTMLElement>('[data-life-month]')].map((el) => ({
    el,
    cards: [...el.querySelectorAll<HTMLElement>('[data-life-card]')],
  }));
  const years = [...root.querySelectorAll<HTMLDetailsElement>('details[data-life-year]')].map((el) => ({
    el,
    count: el.querySelector<HTMLElement>('[data-life-year-count]'),
    cards: [...el.querySelectorAll<HTMLElement>('[data-life-card]')],
  }));
  const yearList = root.querySelector<HTMLElement>('[data-life-years]');
  const timeline = root.querySelector<HTMLElement>('[data-life-timeline]');
  const summary = root.querySelector<HTMLElement>('[data-life-summary]');
  const empty = root.querySelector<HTMLElement>('[data-life-empty]');
  const one = root.dataset.one ?? '1 entry';
  const many = root.dataset.many ?? '{n} entries';
  const entries = (n: number) => (n === 1 ? one : many.replace('{n}', String(n)));
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
    let inYears = 0;
    for (const year of years) {
      const n = year.cards.filter((card) => !card.hidden).length; // counted whether the year is open or closed
      year.el.hidden = n === 0;
      if (year.count) year.count.textContent = entries(n);
      inYears += n;
    }
    if (yearList) yearList.hidden = inYears === 0;
    if (timeline) timeline.hidden = count === 0;
    if (summary) summary.textContent = entries(count);
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

  // A hash that points inside a closed year (a month heading, #life-month-2025-03, or the year itself) opens that year
  // and scrolls to the target, on load and on later in-page navigation. If the active filter hides the target (its
  // year or its month has no matching entry), the filter goes back to All first: opening a year behind the filter
  // would show nothing and leave it open for later, although the reader never opened it.
  const reveal = () => {
    let target: HTMLElement | null = null;
    try {
      target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    } catch {
      return; // malformed escape in the hash
    }
    const year = target?.closest<HTMLDetailsElement>('details[data-life-year]');
    if (!target || !year) return;
    const filtered = target.closest('[hidden]') !== null;
    if (year.open && !filtered) return;
    if (filtered) {
      selected = 'all';
      apply();
    }
    year.open = true;
    target.scrollIntoView();
  };
  reveal();
  window.addEventListener('hashchange', reveal);
}
