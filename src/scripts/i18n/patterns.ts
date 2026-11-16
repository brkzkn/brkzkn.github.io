// @ts-nocheck: dense prototype code ported 1:1 for behaviour parity.
// translatePatterns + translatePattern: regex-based Turkish for dates, counts and ratings (moved verbatim from site.js).
import { translations } from './tr';
const trMonths=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],trMonthsLong=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],enMonths='Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'.split('|'),enMonthsLong='January|February|March|April|May|June|July|August|September|October|November|December'.split('|');
const countNouns={project:'proje',item:'öğe',photo:'fotoğraf',entry:'içerik',entrie:'içerik',note:'not',device:'cihaz',post:'yazı',place:'mekân',film:'film',book:'kitap',series:'dizi',serie:'dizi',trip:'gezi',review:'değerlendirme',article:'yazı',year:'yıl',month:'ay',week:'hafta'};
const monthIdx=name=>enMonths.indexOf(name.slice(0,3));
// translatePatterns: [RegExp, (match)=>turkish]. Tried in order against a trimmed text node or attribute value; return a string. Add new date/count shapes here, not to the dictionary.
const translatePatterns: [RegExp, (m: RegExpMatchArray) => string | null][]=[
 [/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) (\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December)$/,m=>`${m[2]} ${trMonthsLong[monthIdx(m[3])]} ${{Monday:'Pazartesi',Tuesday:'Salı',Wednesday:'Çarşamba',Thursday:'Perşembe',Friday:'Cuma',Saturday:'Cumartesi',Sunday:'Pazar'}[m[1]]}`],
 [/^(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December)$/,m=>`${m[1]} ${trMonthsLong[monthIdx(m[2])]}`],
 [/^(\d{1,2}) to (\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/,m=>`${m[1]}–${m[2]} ${trMonthsLong[monthIdx(m[3])]} ${m[4]}`],
 [/^(\d{4}) to (\d{4})$/,m=>`${m[1]}–${m[2]}`],
 [/^(\d+) days?, (\d+) nights?$/,m=>`${m[1]} gün, ${m[2]} gece`],
 [/^, (\d+) min$/,m=>`, ${m[1]} dk`],
 [/^(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/,m=>`${m[1]} ${trMonthsLong[monthIdx(m[2])]} ${m[3]}`],
 [/^(Updated|Last updated|Published) (.+)$/,m=>{const rest=translatePattern(m[2])||translations[m[2]];return rest?({'Updated':'Güncellendi','Last updated':'Son güncelleme','Published':'Yayımlandı'}[m[1]])+': '+rest:null}],
 [/^Since (\d{4})$/,m=>`Başlangıç: ${m[1]}`],
 [/^Since (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/,m=>`Başlangıç: ${trMonthsLong[monthIdx(m[1])]} ${m[2]}`],
 [/^(\d+)\+? (projects?|items?|photos?|entries|entry|notes?|devices?|posts?|places?|films?|books?|series|trips?|reviews?|articles?|years?|months?|weeks?)$/,m=>`${m[1]} ${countNouns[m[2].replace(/ies$/,'ie').replace(/s$/,'')]||m[2]}`],
 [/^(\d+) (in use|retired|active|planned)$/,m=>`${m[1]} ${{'in use':'kullanımda',retired:'emekli',active:'aktif',planned:'planlanan'}[m[2]]}`],
 [/^(\d(?:\.\d)?) of 5(?: stars?)?$/,m=>`5 üzerinden ${m[1]}`],
 [/^Rating: (\d(?:\.\d)?) of 5$/,m=>`Puan: 5 üzerinden ${m[1]}`],
 [/^Page (\d+) of (\d+)$/,m=>`Sayfa ${m[1]} / ${m[2]}`],
 [/^(.+) — Burak Özkan$/,m=>{const t=translations[m[1]];return t?`${t} — Burak Özkan`:null}]
];
export function translatePattern(t: string): string | null {let m;
 if(m=t.match(/^Showing (\d+) of (\d+) entries$/))return `${m[2]} içerikten ${m[1]} tanesi gösteriliyor`;
 if(m=t.match(/^(\d+) photos?$/))return `${m[1]} fotoğraf`;
 if(m=t.match(/^(\d+) min read$/))return `${m[1]} dk okuma`;
 if(m=t.match(/^(Finished |Watched |Visited |Heard )?(\d{1,2} )?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)( \d{4})?$/)){const out=(m[2]||'')+trMonths[enMonths.indexOf(m[3])]+(m[4]||'');return m[1]?({'Finished ':'Bitirildi: ','Watched ':'İzlendi: ','Visited ':'Gidildi: ','Heard ':'Dinlendi: '}[m[1]])+out:out}
 if(m=t.match(/^(\d{1,2}) to (\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})$/))return `${m[1]}–${m[2]} ${trMonths[enMonths.indexOf(m[3])]} ${m[4]}`
 if(m=t.match(/^(\d+) days?$/))return `${m[1]} gün`
 if(m=t.match(/^Price level (\d) of 4$/))return `Fiyat seviyesi ${m[1]} / 4`
 if(m=t.match(/^Review · (.+)$/)){const subject={Book:'Kitap',Device:'Cihaz',Film:'Film',Series:'Dizi',Place:'Mekân',Restaurant:'Restoran',Game:'Oyun',Album:'Albüm',Podcast:'Podcast'}[m[1]];if(subject)return 'Değerlendirme · '+subject}
 if(m=t.match(/^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/))return trMonthsLong[enMonthsLong.indexOf(m[1])]+' '+m[2];
 if(m=t.match(/^Written in (English|Turkish)$/))return m[1]==='English'?'İngilizce yazıldı':'Türkçe yazıldı';
 for(const [re,fn] of translatePatterns){if(m=t.match(re)){const out=fn(m);if(out)return out}}
 return null}
