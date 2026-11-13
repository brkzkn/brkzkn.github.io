// Gear page category filter. Island for components/GearPage.astro: hides cards outside the chosen category,
// keeps aria-pressed on the real <button> filters, updates the live summary and shows the empty state.
// No URL change, no fetch; data-gear-* attributes so the home-feed and Life filters never bind here.
export {};

const root = document.querySelector<HTMLElement>('[data-gear-root]');
if (root) {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-gear-filter]')];
  const cards = [...root.querySelectorAll<HTMLElement>('[data-gear-category]')];
  const summary = root.querySelector<HTMLElement>('[data-gear-summary]');
  const empty = root.querySelector<HTMLElement>('[data-gear-empty]');
  const one = root.dataset.one ?? '1 device';
  const many = root.dataset.many ?? '{n} devices';
  let selected = 'all';

  const apply = () => {
    let count = 0;
    for (const card of cards) {
      const show = selected === 'all' || card.dataset.gearCategory === selected;
      card.hidden = !show;
      if (show) count++;
    }
    if (summary) summary.textContent = count === 1 ? one : many.replace('{n}', String(count));
    if (empty) empty.hidden = count !== 0;
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.gearFilter === selected));
  };

  for (const b of buttons)
    b.addEventListener('click', () => {
      selected = b.dataset.gearFilter ?? 'all';
      apply();
    });
  root.querySelector('[data-gear-reset]')?.addEventListener('click', () => {
    selected = 'all';
    apply();
    buttons[0]?.focus();
  });
}
