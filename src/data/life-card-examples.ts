// Fixtures for the dev-only review page /dev/life/cards/ (src/pages/dev/life/[page].astro). Not content: every text is
// a [bracketed] placeholder, and nothing here reaches a production build. The months are arranged to show the layout
// cases the real entries may not cover yet: a month with one entry, a month without a featured card, several standard
// cards in a row, cards without a picture, ratings in half steps (3.5, 4, 4.5, 5) and none, an entry in another language
// (the only one with a language chip), a note without a title, a photo-only note (its call to action is the link), and an entry with no page of its own (no link).
// December 2025 holds the linked cards that are not trip, restaurant or monthly: a note, album, review or milestone links
// only through the post's own `link` (ADR-007, 2026-11-16), outward (new tab, ↗, hostname) or to a page of this site (→).
// The example.com addresses are placeholders, like every other text here.
import type { LifeEntry } from '../lib/life';
import london from '../content/posts/2025/2025-03-16-london-guide/london-01.jpg';
import calamari from '../content/posts/2026/2026-10-30-kucuk-liman/note-calamari.jpg';
import poster from '../content/posts/2026/2026-10-23-keeper-of-salt-point/poster-lighthouse.svg';

const base = { lang: 'en' as const, textLang: 'en' as const, facts: [] as string[], warm: false };
const text = '[Two or three sentences of the entry. Long enough to show how the card clamps its text when the entry runs past the space the family gives it.]';

export const lifeCardExamples: LifeEntry[] = [
  // March: a month with a single entry (compact, no title)
  { ...base, id: 'x-note-untitled', type: 'note', category: 'family', family: 'compact', month: '2026-03', iso: '2026-03-14', dateText: '14 Mar 2026', tag: 'Family', text: '[A note without a title: the text itself is the entry, in the journal voice.]' },

  // February: no featured card, several standard cards, then compact ones
  { ...base, textLang: undefined, id: 'x-album', type: 'album', category: 'family', family: 'standard', month: '2026-02', iso: '2026-02-26', dateText: '26 Feb 2026', tag: 'Family', title: '[Album title]', text, facts: ['[Place]', '6 photos'], media: { kind: 'ph', cap: '[Album: first photo]', hue: 'sand' } },
  { ...base, id: 'x-restaurant', type: 'restaurant', category: 'restaurant', family: 'standard', month: '2026-02', iso: '2026-02-21', dateText: '21 Feb 2026', tag: 'Restaurant', title: '[Restaurant name]', text, facts: ['[Area, City]'], rating: 4.5, href: '/life/restaurants/kucuk-liman/', cta: 'Details', media: { kind: 'image', src: calamari, alt: '', portrait: false } },
  { ...base, id: 'x-monthly', type: 'monthly', category: 'culture', family: 'standard', month: '2026-02', iso: '2026-02', dateText: 'February 2026', tag: 'Culture', kind: 'Culture diary', title: '[Monthly diary title]', text, href: '/life/culture/2026-10/', cta: 'Open the diary', media: { kind: 'ph', cap: '[Diary: cover photo]', hue: 'plum' } },
  { ...base, id: 'x-review-cover', type: 'review', category: 'culture', family: 'standard', month: '2026-02', iso: '2026-02-12', dateText: '12 Feb 2026', tag: 'Culture', kind: 'Film', title: '[Film title]', text, rating: 4, media: { kind: 'image', src: poster, alt: '', portrait: true } },
  { ...base, id: 'x-restaurant-plain', type: 'restaurant', category: 'restaurant', family: 'standard', month: '2026-02', iso: '2026-02-09', dateText: '9 Feb 2026', tag: 'Restaurant', title: '[Restaurant without a photo or a rating]', text, facts: ['[Area, City]'], href: '/life/restaurants/kucuk-liman/', cta: 'Details' },
  { ...base, id: 'x-review-plain', type: 'review', category: 'culture', family: 'compact', month: '2026-02', iso: '2026-02-06', dateText: '6 Feb 2026', tag: 'Culture', kind: 'Book', title: '[Book title]', text, rating: 5 },
  { ...base, id: 'x-note-titled', type: 'note', category: 'culture', family: 'compact', month: '2026-02', iso: '2026-02-03', dateText: '3 Feb 2026', lang: 'tr', textLang: 'tr', tag: 'Culture', title: '[Not başlığı: Türkçe yazılmış, İngilizce sayfada TR rozetiyle]', text: '[Kısa bir not.]' },
  { ...base, id: 'x-note-photo', type: 'note', category: 'travel', family: 'compact', month: '2026-02', iso: '2026-02-01', dateText: '1 Feb 2026', tag: 'Travel', text: '[A note with one photo: the thumbnail sits at the end of the row.]', media: { kind: 'image', src: london, alt: '', portrait: false } },

  { ...base, id: 'x-review-cover-2', type: 'review', category: 'culture', family: 'standard', month: '2026-02', iso: '2026-02-01', dateText: '1 Feb 2026', tag: 'Culture', kind: 'Series', title: '[Series title]', text, rating: 3.5, media: { kind: 'image', src: poster, alt: '', portrait: true } },
  { ...base, id: 'x-review-cover-3', type: 'review', category: 'culture', family: 'standard', month: '2026-02', iso: '2026-02-01', dateText: '1 Feb 2026', tag: 'Culture', kind: 'Film', title: '[Second poster: two posters share a row]', text: '[A short verdict.]', media: { kind: 'image', src: poster, alt: '', portrait: true } },
  { ...base, id: 'x-note-bare', type: 'note', category: 'family', family: 'compact', month: '2026-02', iso: '2026-02-01', dateText: '1 Feb 2026', tag: 'Family', text: '', href: '/gear/', cta: 'Open the page', media: { kind: 'image', src: calamari, alt: '[Photo-only note: no title, no text, still one link (a page of this site)]', portrait: false } },

  // January: featured cards with and without a picture
  { ...base, id: 'x-trip', type: 'trip', category: 'travel', family: 'featured', month: '2026-01', iso: '2026-01-25', dateText: '23 to 25 January 2026', tag: 'Travel', kind: '3 days', title: '[Trip title]', text, href: '/life/trips/london-guide/', cta: 'Read the guide', media: { kind: 'image', src: london, alt: '', portrait: false } },
  { ...base, id: 'x-milestone-plain', type: 'milestone', category: 'family', family: 'featured', month: '2026-01', iso: '2026-01-18', dateText: '18 Jan 2026', tag: 'Milestone', warm: true, title: '[Milestone without a picture]', text },
  { ...base, id: 'x-milestone', type: 'milestone', category: 'family', family: 'featured', month: '2026-01', iso: '2026-01-10', dateText: '10 Jan 2026', tag: 'Milestone', warm: true, title: '[Milestone with a cover, and a title long enough to wrap onto a second line]', text, media: { kind: 'ph', cap: '[Milestone: cover photo, nobody facing the camera]', hue: 'sage' } },
  { ...base, id: 'x-trip-plain', type: 'trip', category: 'travel', family: 'featured', month: '2026-01', iso: '2026-01-04', dateText: '4 Jan 2026', tag: 'Travel', kind: '1 day', title: '[Trip without a cover]', text, href: '/life/trips/london-guide/', cta: 'Read the guide' },

  // December 2025: cards that link through the post's own `link`
  { ...base, id: 'x-link-album', type: 'album', category: 'travel', family: 'standard', month: '2025-12', iso: '2025-12-28', dateText: '28 Dec 2025', tag: 'Travel', title: '[Album with an external link]', text, facts: ['[Place]', '4 photos'], href: 'https://example.com/album', external: true, cta: 'example.com', media: { kind: 'ph', cap: '[Album: first photo]', hue: 'sand' } },
  { ...base, id: 'x-link-album-bare', type: 'album', category: 'family', family: 'standard', month: '2025-12', iso: '2025-12-27', dateText: '27 Dec 2025', tag: 'Family', text: '', href: 'https://example.com/photos', external: true, cta: 'example.com', media: { kind: 'image', src: london, alt: '[Photo-only album with an external link: the call to action is the link]', portrait: false } },
  { ...base, id: 'x-link-review-cover', type: 'review', category: 'culture', family: 'standard', month: '2025-12', iso: '2025-12-20', dateText: '20 Dec 2025', tag: 'Culture', kind: 'Book', title: '[Poster review with an external link]', text, rating: 4.5, href: 'https://example.com/book', external: true, cta: 'example.com', media: { kind: 'image', src: poster, alt: '', portrait: true } },
  { ...base, id: 'x-link-review-plain', type: 'review', category: 'culture', family: 'compact', month: '2025-12', iso: '2025-12-14', dateText: '14 Dec 2025', tag: 'Culture', kind: 'Concert', title: '[Compact review with an external link]', text: '[A short verdict.]', rating: 5, href: 'https://example.com/concert', external: true, cta: 'example.com' },
  { ...base, id: 'x-link-note-untitled', type: 'note', category: 'culture', family: 'compact', month: '2025-12', iso: '2025-12-11', dateText: '11 Dec 2025', tag: 'Culture', text: '[An untitled note with an external link: the text itself is the link.]', href: 'https://example.com/note', external: true, cta: 'example.com' },
  { ...base, id: 'x-link-note-bare', type: 'note', category: 'family', family: 'compact', month: '2025-12', iso: '2025-12-09', dateText: '9 Dec 2025', tag: 'Family', text: '', href: 'https://example.com/photo', external: true, cta: 'example.com', media: { kind: 'image', src: calamari, alt: '[Photo-only note with an external link: the arrow is the link]', portrait: false } },
  { ...base, id: 'x-link-note-internal', type: 'note', category: 'culture', family: 'compact', month: '2025-12', iso: '2025-12-06', dateText: '6 Dec 2025', tag: 'Culture', title: '[Note that links to a page of this site]', text: '[A short note.]', href: '/gear/', cta: 'Open the page' },
  { ...base, id: 'x-link-milestone', type: 'milestone', category: 'family', family: 'featured', month: '2025-12', iso: '2025-12-02', dateText: '2 Dec 2025', tag: 'Milestone', warm: true, title: '[Milestone with an external link]', text, href: 'https://example.com/milestone', external: true, cta: 'example.com' },
];
