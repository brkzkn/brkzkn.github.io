// Converted from prototype/assets/js/feed-type-examples.js (+ the referenced entries of feed-data.js). All sample content.
// Descriptions are Turkish for the owner. Variant = { ref } (an entry in feedRefEntries) or { entry }.
export interface FeedExampleEntry { id: string; type: string; category: string; publishedAt: string; language: string; tags: string[]; sample?: boolean; [k: string]: any }
export interface FeedVariant { label: string; note: string; ref?: string; entry?: FeedExampleEntry }
export interface FeedExampleGroup { type: string; use: string; fields: string; review?: string; variants: FeedVariant[] }
export const feedTypeLabels: Record<string,string> = {
 "note": "Short note",
 "album": "Photo album",
 "writing": "Writing",
 "project": "Project update",
 "milestone": "Milestone",
 "review": "Review",
 "restaurant": "Restaurant",
 "trip": "Trip",
 "monthly": "Monthly summary",
 "link": "Shared link"
};
export const feedRefEntries: FeedExampleEntry[] = [
 {
  "id": "monthly-2026-10",
  "type": "monthly",
  "category": "culture",
  "publishedAt": "2026-10-31",
  "language": "en",
  "tags": [
   "monthly",
   "culture"
  ],
  "sample": true,
  "title": "October 2026 — Watched, read, visited",
  "href": "october-2026.html",
  "collage": [
   {
    "src": "assets/images/london-01.jpg",
    "alt": "Red bus on a wet London street"
   },
   {
    "src": "assets/images/note-view.jpg",
    "alt": "View from a terrace table"
   },
   {
    "src": "assets/images/hero-istanbul.jpg",
    "alt": "Istanbul rooftops at dawn"
   }
  ],
  "counts": [
   [
    "3",
    "films"
   ],
   [
    "1",
    "series"
   ],
   [
    "2",
    "books"
   ],
   [
    "1",
    "theatre"
   ],
   [
    "1",
    "cultural trip"
   ]
  ],
  "highlight": "The one that stayed with me was the theatre evening: two actors, one table, no set. I walked home instead of taking the ferry."
 },
 {
  "id": "restaurant-liman",
  "type": "restaurant",
  "category": "culture",
  "publishedAt": "2026-10-30",
  "language": "tr",
  "tags": [
   "meyhane",
   "kadikoy"
  ],
  "sample": true,
  "name": "Küçük Liman",
  "cuisine": "Meyhane, deniz ürünleri",
  "area": "Kadıköy, Istanbul",
  "price": 3,
  "rating": 4,
  "ratingMax": 5,
  "visited": "Visited 30 Oct 2026",
  "body": "Kadıköy’de yeni açılan bir yer: kalamar iyi, servis yavaş, manzara her şeyi affettiriyor. We will go back on a weekday.",
  "order": "Kalamar, haydari, mevsim yeşillikleri",
  "photo": {
   "src": "assets/images/note-calamari.jpg",
   "alt": "Grilled calamari on a white plate",
   "w": 700,
   "h": 700
  },
  "href": "restaurant.html",
  "linkLabel": "Restaurant details",
  "fictional": "Fictional place, sample content."
 },
 {
  "id": "review-rayban-meta",
  "type": "review",
  "category": "gear",
  "publishedAt": "2026-10-29",
  "language": "en",
  "tags": [
   "gear",
   "wearables"
  ],
  "sample": true,
  "subject": "Device",
  "title": "Ray-Ban Meta glasses",
  "href": "gear.html",
  "linkLabel": "Full note on the gear page",
  "cover": {
   "src": "assets/images/gear-rayban-meta.jpg",
   "alt": "Ray-Ban Meta glasses",
   "w": 960,
   "h": 720
  },
  "meta": "Added to my gear",
  "body": "Two weeks in. The camera is the reason I bought them; the speakers are the reason I keep wearing them."
 },
 {
  "id": "note-coffee",
  "type": "note",
  "category": "personal",
  "publishedAt": "2026-10-28",
  "language": "tr",
  "tags": [
   "coffee"
  ],
  "sample": true,
  "body": "Sabah kahvesini beklerken dünkü sorunun aslında iki sınıf ve bir kuyruk meselesi olduğunu fark ettim. Üç günlük çözümüm, kahve soğumadan yarım sayfaya sığdı. Bazen basit olan, sadece henüz çizilmemiş olandır."
 },
 {
  "id": "project-ha-mount",
  "type": "project",
  "category": "projects",
  "publishedAt": "2026-10-26",
  "language": "en",
  "tags": [
   "home-assistant",
   "3d-printing",
   "petg"
  ],
  "sample": true,
  "project": "Home Assistant sensor mount",
  "title": "A bracket that stops the sensor sliding off the shelf edge",
  "status": "Iteration 03 / Testing",
  "image": {
   "src": "assets/images/stock-3d-printer.jpg",
   "alt": "Printed cable holders next to a desktop 3D printer",
   "w": 1448,
   "h": 1086
  },
  "changes": [
   "Wall thickness 1.6 mm to 2.4 mm; iteration 02 flexed under the cable weight.",
   "Added a 3 mm lip so the sensor cannot rotate out.",
   "Moved the cable slot to the back; the front is clean now."
  ],
  "next": "Print in PETG and leave it on the hallway shelf for a week.",
  "logHref": "smart-home.html",
  "logLabel": "Smart home log"
 },
 {
  "id": "album-hallway",
  "type": "album",
  "category": "personal",
  "publishedAt": "2026-10-25",
  "language": "en",
  "tags": [
   "home",
   "shelves"
  ],
  "sample": true,
  "caption": "The hallway after a weekend of drilling. The sensor mount is the small thing on the left.",
  "place": "Home, Istanbul",
  "photos": [
   {
    "src": "assets/images/stock-smart-home.jpg",
    "alt": "A hallway shelf with a smart-home sensor",
    "w": 1448,
    "h": 1086
   },
   {
    "src": "assets/images/print-cable-clip.jpg",
    "alt": "A printed clip on the edge of a desk",
    "w": 960,
    "h": 720
   }
  ]
 },
 {
  "id": "review-film-keeper",
  "type": "review",
  "category": "culture",
  "publishedAt": "2026-10-23",
  "language": "en",
  "tags": [
   "film"
  ],
  "sample": true,
  "subject": "Film",
  "title": "The Keeper of Salt Point",
  "creator": "Sample director",
  "fictional": "Fictional film and director, sample content.",
  "cover": {
   "src": "assets/images/poster-lighthouse.svg",
   "alt": "Illustrative poster: a lighthouse on a rocky point at night",
   "w": 600,
   "h": 900
  },
  "rating": 4,
  "ratingMax": 5,
  "meta": "Watched 23 Oct 2026",
  "platforms": [
   {
    "id": "cinema"
   }
  ],
  "body": "Slow, quiet and very well lit. I watched it twice in one week, which I almost never do."
 },
 {
  "id": "review-book-salt-ledger",
  "type": "review",
  "category": "culture",
  "publishedAt": "2026-10-21",
  "language": "en",
  "tags": [
   "books",
   "fiction"
  ],
  "sample": true,
  "subject": "Book",
  "title": "The Salt Ledger",
  "creator": "Ines Varga",
  "rating": 4,
  "ratingMax": 5,
  "meta": "Finished 21 Oct 2026",
  "body": "A slow novel about a harbour accountant who finds the numbers have been lying for thirty years. Quiet, precise, and the last forty pages earn every earlier one.",
  "recommend": "Readers who like patient fiction and unreliable spreadsheets.",
  "fictional": "Fictional book and author, sample content."
 },
 {
  "id": "link-esphome",
  "type": "link",
  "category": "projects",
  "publishedAt": "2026-10-18",
  "language": "en",
  "tags": [
   "open-source",
   "iot"
  ],
  "sample": true,
  "comment": "Worth a look if your sensors live on cheap microcontrollers. Configuration instead of firmware code is the right trade for a hallway dashboard.",
  "url": "https://github.com/esphome/esphome",
  "domain": "github.com",
  "linkTitle": "esphome/esphome",
  "description": "ESPHome is a system to control your ESP32, ESP8266, BK72xx, RP2040 by simple yet powerful configuration files and control them remotely through Home Automation systems.",
  "verified": true
 },
 {
  "id": "trip-london",
  "type": "trip",
  "category": "travel",
  "publishedAt": "2026-10-15",
  "language": "en",
  "tags": [
   "london",
   "rain"
  ],
  "sample": true,
  "destination": "London",
  "country": "United Kingdom",
  "dates": "14 to 16 Mar 2025",
  "days": "3 days",
  "caption": "Wet pavements, red buses, one flag. Four frames from three rainy days.",
  "photos": [
   {
    "src": "assets/images/london-01.jpg",
    "alt": "Red double-decker bus passing Big Ben on a wet road",
    "w": 960,
    "h": 640
   },
   {
    "src": "assets/images/london-02.jpg",
    "alt": "Union flag and black railings on a rainy street",
    "w": 960,
    "h": 640
   },
   {
    "src": "assets/images/london-03.jpg",
    "alt": "Lamp light reflected on a wet pavement",
    "w": 960,
    "h": 640
   },
   {
    "src": "assets/images/london-04.jpg",
    "alt": "Clock tower and a street lamp above the river bridge",
    "w": 960,
    "h": 640
   }
  ],
  "href": "london-guide.html",
  "linkLabel": "Read the London guide"
 },
 {
  "id": "writing-ayvalik",
  "type": "writing",
  "category": "travel",
  "publishedAt": "2026-10-12",
  "language": "en",
  "tags": [
   "ayvalik",
   "weekend"
  ],
  "sample": true,
  "title": "A long weekend in Ayvalık",
  "summary": "Three days, one rented house, olive oil bought by the litre. Itinerary, where we ate, and what we would change.",
  "cover": {
   "src": "assets/images/trip-ayvalik.jpg",
   "alt": "Ayvalık harbour",
   "w": 1400,
   "h": 700
  }
 },
 {
  "id": "project-thread",
  "type": "project",
  "category": "projects",
  "publishedAt": "2026-10-06",
  "language": "en",
  "tags": [
   "thread",
   "smart-home"
  ],
  "sample": true,
  "project": "Smart home log",
  "title": "Thread border router: first impressions",
  "status": "Entry 23 / Comparing",
  "changes": [
   "Pairing is better than Zigbee.",
   "Range in a concrete building is not."
  ],
  "next": "Keep both networks for now.",
  "logHref": "smart-home.html",
  "logLabel": "Smart home log"
 },
 {
  "id": "writing-ideal-architecture",
  "type": "writing",
  "category": "work",
  "publishedAt": "2026-09-24",
  "language": "en",
  "tags": [
   "architecture",
   "design-reviews",
   "trade-offs"
  ],
  "sample": true,
  "title": "Why I stopped drawing the “ideal” architecture first",
  "href": "agentic-workflows.html",
  "summary": "The diagram you draw before you understand the constraints becomes the thing you defend instead of the thing you test.",
  "readingMinutes": 7,
  "art": "architecture"
 },
 {
  "id": "note-nursery",
  "type": "note",
  "category": "family",
  "publishedAt": "2026-09-20",
  "language": "en",
  "tags": [
   "nursery"
  ],
  "sample": true,
  "body": "First nursery day. They walked in holding hands and did not look back. We stood outside longer than they would have liked."
 },
 {
  "id": "milestone-twins",
  "type": "milestone",
  "category": "family",
  "publishedAt": "2024-07",
  "language": "en",
  "tags": [
   "family",
   "twins"
  ],
  "sample": true,
  "title": "The twins arrive",
  "dateLabel": "July 2024",
  "body": "Two daughters, one summer, and a house that went quiet and loud at the same time. Everything I plan now starts with where they will be.",
  "illustration": "Illustration, not a family photo"
 }
];
export const feedTypeExamples: FeedExampleGroup[] = [
 {
  "type": "note",
  "use": "Varsayılan biçim. Başlıksız, kısa; salı gecesi iki dakikada yazılabilen şey. Serif yazıyla, kutusuz.",
  "fields": "Zorunlu: body. Başlık, görsel ve bağlantı yok.",
  "variants": [
   {
    "label": "Tek cümle",
    "note": "En kısa hâl: tek satır.",
    "entry": {
     "id": "ex-note-one-line",
     "type": "note",
     "category": "personal",
     "publishedAt": "2026-10-27",
     "language": "en",
     "tags": [],
     "sample": true,
     "body": "Rain, a window seat, and the ferry running late. Fine by me."
    }
   },
   {
    "label": "Kısa, EN",
    "note": "İki üç cümle (ana sayfadaki aile notu).",
    "ref": "note-nursery"
   },
   {
    "label": "Orta, TR",
    "note": "Türkçe, üç dört satır (ana sayfadaki kahve notu).",
    "ref": "note-coffee"
   },
   {
    "label": "Uzun",
    "note": "Bir paragraf; satır uzunluğu ve ritmi görmek için.",
    "entry": {
     "id": "ex-note-long",
     "type": "note",
     "category": "work",
     "publishedAt": "2026-10-14",
     "language": "en",
     "tags": [
      "architecture"
     ],
     "sample": true,
     "body": "Spent the morning reading a design document that was twelve pages long and answered none of the three questions I had. The diagrams were careful and the decisions were missing. I now start every review by asking which decision is hardest to reverse, and then I read only the pages that talk about it."
    }
   }
  ]
 },
 {
  "type": "album",
  "use": "Sadece fotoğraf: 1 ila 4 fotoğraf, kısa açıklama, yer. Yemek (Restaurant) ve gezi (Trip) kayıtları artık ayrı türler; albüm bunların dışındaki anlar içindir. Fotoğrafa tıklayınca görüntüleyici açılır.",
  "fields": "Zorunlu: photos (1–4), caption. Opsiyonel: title, place, href + linkLabel (varsa belirgin düğme olarak çıkar).",
  "variants": [
   {
    "label": "1 foto",
    "note": "Tek geniş fotoğraf (2:1). Oran ilk fotoğraftan alınır.",
    "entry": {
     "id": "ex-album-1",
     "type": "album",
     "category": "personal",
     "publishedAt": "2026-10-13",
     "language": "en",
     "tags": [
      "harbour"
     ],
     "sample": true,
     "caption": "The harbour at seven in the morning, before anyone was awake.",
     "place": "Ayvalık, Balıkesir",
     "photos": [
      {
       "src": "assets/images/trip-ayvalik.jpg",
       "alt": "Ayvalık harbour",
       "w": 1400,
       "h": 700
      }
     ]
    }
   },
   {
    "label": "2 foto",
    "note": "İki fotoğraf yan yana (ana sayfadaki koridor albümü).",
    "ref": "album-hallway"
   },
   {
    "label": "3 foto",
    "note": "Üç kare yan yana.",
    "entry": {
     "id": "ex-album-3",
     "type": "album",
     "category": "personal",
     "publishedAt": "2026-10-09",
     "language": "en",
     "tags": [
      "evening"
     ],
     "sample": true,
     "caption": "Three frames from the walk home.",
     "place": "Moda, Istanbul",
     "photos": [
      {
       "src": "assets/images/note-calamari.jpg",
       "alt": "A plate on a table",
       "w": 700,
       "h": 700
      },
      {
       "src": "assets/images/note-view.jpg",
       "alt": "The view from the table",
       "w": 700,
       "h": 700
      },
      {
       "src": "assets/images/note-terrace.jpg",
       "alt": "The terrace",
       "w": 700,
       "h": 700
      }
     ]
    }
   },
   {
    "label": "4 + başlık",
    "note": "Dört fotoğraf 2×2, başlık ve belirgin detay düğmesi.",
    "entry": {
     "id": "ex-album-4",
     "type": "album",
     "category": "projects",
     "publishedAt": "2026-09-30",
     "language": "en",
     "tags": [
      "workshop"
     ],
     "sample": true,
     "title": "The workshop, tidied",
     "caption": "Four corners of the bench after a Saturday of sorting.",
     "place": "Home, Istanbul",
     "photos": [
      {
       "src": "assets/images/stock-3d-printer.jpg",
       "alt": "A desktop 3D printer on the bench",
       "w": 1448,
       "h": 1086
      },
      {
       "src": "assets/images/print-cable-clip.jpg",
       "alt": "Printed cable clips",
       "w": 960,
       "h": 720
      },
      {
       "src": "assets/images/stock-smart-home.jpg",
       "alt": "A shelf with a smart-home sensor",
       "w": 1448,
       "h": 1086
      },
      {
       "src": "assets/images/hero-workshop.jpg",
       "alt": "The workshop bench with printed parts",
       "w": 900,
       "h": 900
      }
     ],
     "href": "projects.html",
     "linkLabel": "See the projects"
    }
   }
  ]
 },
 {
  "type": "writing",
  "use": "Başlıklı, uzun yazı. Seyrek. Akışta özet görünür, metin kendi sayfasındadır. Başlık bağlantı gibi görünür.",
  "fields": "Zorunlu: title, summary. Opsiyonel: href, cover, art, readingMinutes, tags.",
  "variants": [
   {
    "label": "Çizimli",
    "note": "Sağda diyagram, başlık bağlantılı (ana sayfadaki mimari yazısı).",
    "ref": "writing-ideal-architecture"
   },
   {
    "label": "Kapaklı",
    "note": "Üstte geniş kapak; bağlantı yoksa \"Sample preview\" notu çıkar (ana sayfadaki Ayvalık yazısı).",
    "ref": "writing-ayvalik"
   },
   {
    "label": "Yalın",
    "note": "Kapak ve çizim yok; sadece başlık, özet ve bilgi satırı.",
    "entry": {
     "id": "ex-writing-plain",
     "type": "writing",
     "category": "work",
     "publishedAt": "2026-09-10",
     "language": "en",
     "tags": [
      "design-reviews"
     ],
     "sample": true,
     "title": "What I check first in a design review",
     "href": "agentic-workflows.html",
     "summary": "Three questions, in this order, before I read a single diagram. Most reviews end after the second one.",
     "readingMinutes": 5
    }
   },
   {
    "label": "Türkçe",
    "note": "Türkçe yazı; dil etiketi TR görünür.",
    "entry": {
     "id": "ex-writing-tr",
     "type": "writing",
     "category": "personal",
     "publishedAt": "2026-08-30",
     "language": "tr",
     "tags": [
      "istanbul"
     ],
     "sample": true,
     "title": "Anadolu yakasında bir pazar sabahı",
     "href": "blog.html",
     "summary": "Vapur, simit ve yarım kalan bir toplantı notu. Şehri hatırlamanın en sakin yolu.",
     "readingMinutes": 4
    }
   }
  ]
 },
 {
  "type": "project",
  "use": "Bir projenin günlüğü: ne değişti, sıradaki adım. Makale değil, kısa bir kayıt. Sakin, çizgili kutu.",
  "fields": "Zorunlu: project, title, status, changes[]. Opsiyonel: image, next, logHref + logLabel, tags.",
  "variants": [
   {
    "label": "Görselli",
    "note": "Sağda görsel (ana sayfadaki Home Assistant braketi).",
    "ref": "project-ha-mount"
   },
   {
    "label": "Görselsiz",
    "note": "Sadece liste ve sonraki adım (ana sayfadaki Thread kaydı).",
    "ref": "project-thread"
   },
   {
    "label": "En kısa",
    "note": "Tek değişiklik, sonraki adım ve bağlantı yok.",
    "entry": {
     "id": "ex-project-min",
     "type": "project",
     "category": "projects",
     "publishedAt": "2026-09-28",
     "language": "en",
     "tags": [
      "petg"
     ],
     "sample": true,
     "project": "3D printing",
     "title": "Spool holder, second try",
     "status": "Printed / Works",
     "changes": [
      "Hole moved 4 mm; the spool no longer rubs the wall."
     ]
    }
   }
  ]
 },
 {
  "type": "milestone",
  "use": "Yaşamdaki dönüm noktası. Akıştaki tek kartlı, tek turuncu vurgulu kayıt; seyrek kullanılmalı.",
  "fields": "Zorunlu: title, dateLabel, body, illustration. Fotoğraf yok; aile fotoğraflarında yüz gösterilmez.",
  "variants": [
   {
    "label": "Dönüm noktası",
    "note": "Ana sayfadaki \"The twins arrive\" kaydı.",
    "ref": "milestone-twins"
   }
  ],
  "review": "Çizim şu an koda sabitlenmiş (iki figür). Başka bir dönüm noktası (yeni iş, taşınma) için genel bir çizim ya da çizimsiz bir düzen gerekir. Karar bekliyor."
 },
 {
  "type": "review",
  "use": "Kitap, film, dizi ve cihaz için tek biçim. Solda kapak ya da poster, sağda puan ve kısa yorum. Film ve dizide izlediğin yer küçük chip olarak eklenebilir (opsiyonel); href verirsen tıklanır, vermezsen düz etiket kalır. Restoran artık ayrı tür (Restaurant).",
  "fields": "Zorunlu: subject, title, body. Opsiyonel: creator, rating + ratingMax, cover (kitapta kodla çizilir, film/dizide poster, cihazda ürün görseli), meta, platforms[{id, href?}], recommend, href + linkLabel.",
  "variants": [
   {
    "label": "Kitap",
    "note": "Kapak kodla çizilir, puan var, kurgu etiketi (ana sayfadaki The Salt Ledger).",
    "ref": "review-book-salt-ledger"
   },
   {
    "label": "Cihaz",
    "note": "Gerçek görsel, puansız, bağlantılı (ana sayfadaki Ray-Ban Meta).",
    "ref": "review-rayban-meta"
   },
   {
    "label": "Film, sinema",
    "note": "Poster (2:3), puan ve \"Watched on: Cinema\" chip'i; bağlantısız düz etiket (ana sayfadaki film).",
    "ref": "review-film-keeper"
   },
   {
    "label": "Dizi, 2 yer",
    "note": "Poster, iki platform: Netflix tıklanır (bağlantı verilmiş), Prime Video düz etiket.",
    "entry": {
     "id": "ex-review-series",
     "type": "review",
     "category": "culture",
     "publishedAt": "2026-10-17",
     "language": "en",
     "tags": [
      "series"
     ],
     "sample": true,
     "subject": "Series",
     "title": "Night Train South",
     "creator": "Sample creator",
     "fictional": "Fictional series and creator, sample content.",
     "cover": {
      "src": "assets/images/poster-night-train.svg",
      "alt": "Illustrative poster: a lit train crossing a bridge at dusk",
      "w": 600,
      "h": 900
     },
     "rating": 5,
     "ratingMax": 5,
     "meta": "Watched Oct 2026",
     "platforms": [
      {
       "id": "netflix",
       "href": "https://www.netflix.com/"
      },
      {
       "id": "prime"
      }
     ],
     "body": "Six episodes, one train, and nobody explains anything twice. I paced myself to one a night so it would last."
    }
   },
   {
    "label": "Posterşiz film",
    "note": "Poster yok, platform yok; metin tam genişliği kullanır.",
    "entry": {
     "id": "ex-review-film-plain",
     "type": "review",
     "category": "culture",
     "publishedAt": "2026-10-11",
     "language": "en",
     "tags": [
      "film"
     ],
     "sample": true,
     "subject": "Film",
     "title": "A short film about a bridge",
     "creator": "Sample director",
     "fictional": "Fictional film and director, sample content.",
     "rating": 3,
     "ratingMax": 5,
     "meta": "Watched 11 Oct 2026",
     "body": "Twenty minutes, one location, and a very good use of silence."
    }
   }
  ]
 },
 {
  "type": "restaurant",
  "use": "Gittiğin bir restoran: ad, mutfak, mahalle, fiyat seviyesi, yıldız ve kısa yorum. Culture kategorisinde durur. Detay sayfası varsa belirgin bir düğme çıkar (şu an örnek: restaurant.html).",
  "fields": "Zorunlu: name, body, rating + ratingMax. Opsiyonel: cuisine, area, price (1–4), visited, order (\"tekrar söyleyeceklerim\"), photo (kare/dikey: yan sütun, yatay: üstte banner), href + linkLabel.",
  "variants": [
   {
    "label": "Tam kayıt",
    "note": "Fotoğraf, fiyat seviyesi, puan, yorum, tekrar söyleyeceklerim ve detay düğmesi (ana sayfadaki Küçük Liman).",
    "ref": "restaurant-liman"
   },
   {
    "label": "Fotoğrafsız",
    "note": "Fotoğraf ve detay sayfası yok; metin tam genişliği kullanır.",
    "entry": {
     "id": "ex-restaurant-plain",
     "type": "restaurant",
     "category": "culture",
     "publishedAt": "2026-10-08",
     "language": "en",
     "tags": [
      "lunch"
     ],
     "sample": true,
     "name": "Dükkan No. 4",
     "cuisine": "Lunch counter",
     "area": "Karaköy, Istanbul",
     "price": 1,
     "rating": 3,
     "ratingMax": 5,
     "visited": "Visited 8 Oct 2026",
     "body": "Fast, cheap, and exactly what it says on the door. The soup is the reason to go.",
     "fictional": "Fictional place, sample content."
    }
   },
   {
    "label": "Yatay foto",
    "note": "Yatay (geniş) fotoğraf metnin üstünde banner olur; yön, fotoğrafın oranından otomatik seçilir.",
    "entry": {
     "id": "ex-restaurant-landscape",
     "type": "restaurant",
     "category": "culture",
     "publishedAt": "2026-09-21",
     "language": "tr",
     "tags": [
      "balik"
     ],
     "sample": true,
     "name": "Çıkmaz Sokak Balıkçısı",
     "cuisine": "Balık, meze",
     "area": "Ayvalık",
     "price": 2,
     "rating": 4,
     "ratingMax": 5,
     "visited": "Visited 21 Sep 2026",
     "body": "Limanı gören masa, sade bir menü ve zamanında gelen çorba. Fiyat, manzaraya göre makul.",
     "order": "Çupra, ahtapot salatası",
     "photo": {
      "src": "assets/images/trip-ayvalik.jpg",
      "alt": "Illustrative harbour view from a table",
      "w": 1400,
      "h": 700
     },
     "href": "restaurant.html",
     "linkLabel": "Restaurant details",
     "fictional": "Fictional place, sample content."
    }
   },
   {
    "label": "EN, kare foto",
    "note": "İngilizce kayıt, kare fotoğraf yan sütunda, detay sayfası yok.",
    "entry": {
     "id": "ex-restaurant-en",
     "type": "restaurant",
     "category": "culture",
     "publishedAt": "2026-09-14",
     "language": "en",
     "tags": [
      "dinner"
     ],
     "sample": true,
     "name": "Terrace Eleven",
     "cuisine": "Modern Turkish",
     "area": "Moda, Istanbul",
     "price": 4,
     "rating": 5,
     "ratingMax": 5,
     "visited": "Visited 14 Sep 2026",
     "body": "Everything arrived when it should have. The view does half the work and the kitchen does the other half.",
     "order": "The lamb, the quince dessert",
     "photo": {
      "src": "assets/images/note-terrace.jpg",
      "alt": "A terrace table at sunset",
      "w": 700,
      "h": 700
     },
     "fictional": "Fictional place, sample content."
    }
   }
  ]
 },
 {
  "type": "trip",
  "use": "Bir seyahat: yer, ülke, tarih aralığı, kısa açıklama, 1–4 fotoğraf. Travel kategorisinde durur. Detay (rehber) sayfasının bağlantısı belirgin bir düğme olarak çıkar.",
  "fields": "Zorunlu: destination, country, dates, caption, photos (1–4). Opsiyonel: days, href + linkLabel.",
  "variants": [
   {
    "label": "Rehberli, 4 foto",
    "note": "Dört fotoğraf ve belirgin rehber düğmesi (ana sayfadaki Londra).",
    "ref": "trip-london"
   },
   {
    "label": "1 foto, rehbersiz",
    "note": "Tek geniş fotoğraf; rehber sayfası henüz yok, düğme çıkmaz.",
    "entry": {
     "id": "ex-trip-1",
     "type": "trip",
     "category": "travel",
     "publishedAt": "2026-08-20",
     "language": "en",
     "tags": [
      "weekend"
     ],
     "sample": true,
     "destination": "Ayvalık",
     "country": "Türkiye",
     "dates": "20 to 23 Aug 2026",
     "days": "3 days",
     "caption": "A rented house, olive oil bought by the litre, and a harbour that empties out by nine.",
     "photos": [
      {
       "src": "assets/images/trip-ayvalik.jpg",
       "alt": "Ayvalık harbour",
       "w": 1400,
       "h": 700
      }
     ]
    }
   },
   {
    "label": "2 foto, Türkçe",
    "note": "İki fotoğraf, Türkçe açıklama ve rehber düğmesi.",
    "entry": {
     "id": "ex-trip-2",
     "type": "trip",
     "category": "travel",
     "publishedAt": "2026-07-12",
     "language": "tr",
     "tags": [
      "kısa-gezi"
     ],
     "sample": true,
     "destination": "Bozcaada",
     "country": "Türkiye",
     "dates": "10 to 12 Jul 2026",
     "days": "2 days",
     "caption": "Rüzgâr, şarap ve bisikletle bir tur. Geri dönerken feribot kuyruğu bile keyifliydi.",
     "photos": [
      {
       "src": "assets/images/note-view.jpg",
       "alt": "Illustrative view from a table",
       "w": 700,
       "h": 700
      },
      {
       "src": "assets/images/note-terrace.jpg",
       "alt": "Illustrative terrace",
       "w": 700,
       "h": 700
      }
     ],
     "href": "london-guide.html",
     "linkLabel": "Read the trip guide"
    }
   }
  ]
 },
 {
  "type": "monthly",
  "use": "Ay sonunda kültür günlüğünün özeti: sayılar ve ayın öne çıkanı. Üç görsellik kolaj ve başlık bağlantısı.",
  "fields": "Zorunlu: title, href, collage (3), counts[], highlight.",
  "variants": [
   {
    "label": "Aylık özet",
    "note": "Ana sayfadaki Ekim 2026 özeti.",
    "ref": "monthly-2026-10"
   }
  ]
 },
 {
  "type": "link",
  "use": "Başkasının bir şeyine kısa yorumum. Yorum büyük yazılır, kaynak kartı altta. Doğrulanmamış bağlantı tıklanamaz.",
  "fields": "Zorunlu: comment, url, domain, linkTitle, description, verified. Önizleme görseli kodla çizilen yer tutucudur.",
  "variants": [
   {
    "label": "Doğrulanmış",
    "note": "Yeni sekmede açılır, kart tıklanabilir (ana sayfadaki ESPHome).",
    "ref": "link-esphome"
   },
   {
    "label": "Tıklanamaz",
    "note": "verified: false. Kart bağlantı değil, \"Fictional link\" notu çıkar.",
    "entry": {
     "id": "ex-link-unverified",
     "type": "link",
     "category": "work",
     "publishedAt": "2026-09-30",
     "language": "en",
     "tags": [
      "architecture"
     ],
     "sample": true,
     "comment": "A good short read on why queues hide problems instead of removing them.",
     "url": "https://example.com/queues",
     "domain": "example.com",
     "linkTitle": "Queues do not fix overload",
     "description": "A made-up article used to show the unverified state of a shared link.",
     "verified": false
    }
   }
  ]
 }
];
