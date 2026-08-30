# Social Media Kit

Kung paano gawing benta ang mga post mo sa Facebook Page na **GDS Digital Solutions**.

---

## Ang pinakamahalagang bahagi

**Isang link kada post, at diretso sa product page.**

Huwag mag-post ng link papunta sa home page tapos sasabihing "check our products".
Bawat click na kailangan mong idagdag ay may nawawalang bibili. Ang link mo ay dapat
diretso sa mismong bagay na pinag-uusapan ng post.

Palitan mo lang ang `SITE` sa ibaba ng live URL mo
(hal. `https://gdsdigital.github.io/gds-site`):

| Saan | Link na ipo-post |
|---|---|
| **BayadTrack** | `SITE/products/bayadtrack/?utm_source=facebook` |
| Website development | `SITE/products/website-development/?utm_source=facebook` |
| Lahat ng product | `SITE/products/?utm_source=facebook` |
| Paano umorder | `SITE/#paano-umorder` |
| Track order | `SITE/track/` |

Ang `?utm_source=facebook` ay naitatala sa Google Sheet mo sa column na **Source** —
kaya makikita mo kung ilan sa mga order ang galing sa Facebook.

---

## I-refresh ang preview sa Facebook (gawin mo ito minsan lang kada page)

Kapag na-post mo na ang isang link, itinatago ito ng Facebook. Kapag na-update mo
ang page mamaya, luma pa rin ang lalabas na preview.

1. Pumunta sa [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
2. I-paste ang link ng product page
3. I-click ang **Debug**, tapos ang **Scrape Again**
4. Tingnan kung tama ang larawan, pamagat, at paglalarawan

Gawin mo ito sa **bawat page** bago ka magsimulang mag-post, at ulitin tuwing may
binabago ka sa pamagat o larawan.

---

## Mga larawan

May naka-handang **1200 × 630** na share image ang bawat product sa `assets/social/` —
ang sa BayadTrack ay ang dashboard slide mula sa carousel mo. Awtomatiko itong ginagamit
ng Facebook.

**May handa ka nang carousel para sa FB posts** sa
`Desktop\BayadTrack\Marketing BayadTrack\`:

- `BayadTrack_Public_Carousel.zip` — 9 slides, pang-public post. I-upload bilang
  photo album o carousel ad, tapos ilagay ang product link sa caption.
- `BayadTrack_Portrait_Carousel.zip` — portrait na bersyon, bagay sa Reels/Stories.
- `BayadTrack_Buyer_Carousel.zip` — pang-follow-up sa mga interesado na.

**Pero mas mabenta pa rin ang totoong screenshot.** Kapag nag-post ka, mag-attach ng
aktwal na larawan bukod sa carousel:

- Ang DASHBOARD ng BayadTrack na may totoong bilang (takpan ang pangalan ng kliyente)
- Ang FOLLOW UP sheet — kita mo agad ang halaga nito
- Screenshot mula sa **cellphone**, hindi sa laptop — ito ang nagpapatunay ng pinakamalaking benepisyo
- Bago-at-pagkatapos: gulong-gulong notebook sa kaliwa, malinis na dashboard sa kanan

---

## Mga handang caption

Kopyahin, palitan ang detalye, i-post. Nasa Taglish para tumugma sa madla.

### 1. Ang pangunahing post ng BayadTrack

```
Ilang beses ka nang nakalimutang singilin ang isang kliyente?

Kapag nasa notebook ang isang listahan, nasa chat ang isa, at nasa
ulo mo na lang ang iba — normal na may nakakalusot. Ang masakit,
ikaw ang lugi.

BayadTrack: Google Sheets na pang-koleksyon para sa internet reseller
at kahit sinong may buwanang sisingilin.

• Kita mo agad kung magkano ang nakolekta at magkano pa ang utang
• May listahan kung sino ang dapat mong puntahan bukas
• Kayang-kaya sa cellphone — doon ka naman nangongolekta
• Lumipat ka lang ng buwan, walang binubura
• Kasama ang setup at 30 araw na suporta

Nakasulat sa page ang presyo at kung ano ang kasama.

SITE/products/bayadtrack/?utm_source=facebook
```

### 2. Isang problema kada post (ito ang pinakamabisa)

```
"Bayad na po ako last month" — pero wala kang record.

Kanino ka maniniwala? Sa memory mo, o sa notebook na basang-basa
na sa ulan?

Sa BayadTrack, buksan mo lang ang buwan na sinasabi niya at nandoon
ang record — hindi ito nabubura kahit lumipat ka na ng buwan.
Walang "start new month" na magbubura ng nakaraan mo.

SITE/products/bayadtrack/?utm_source=facebook
```

```
Bumalik yung na-disconnect mong kliyente. May utang pa ba siya?

Sa BayadTrack, hindi nabubura ang na-disconnect — nakatago lang
siya kasama ang huling balanse niya. Kapag bumalik siya, dala niya
ang dating utang. Ikaw ang magdedesisyon kung sisingilin mo pa o
papatawarin.

SITE/products/bayadtrack/?utm_source=facebook
```

### 3. Website development

```
Nasa Facebook lang ba ang buong negosyo mo?

Gumagawa ako ng website para sa maliliit na negosyo sa Pilipinas.
Hindi template. Hindi drag-and-drop. Kinakausap muna kita bago
mag-disenyo.

• Gumagana sa cellphone — dito manggagaling ang karamihan
• May order at payment flow kung kailangan mo (GCash, bank transfer)
• Naka-connect sa FB Page mo — diretso sa tamang page ang link mo
• Tinuturuan kitang mag-update mag-isa

Halimbawa ng gawa ko? Ang site mismo sa link na ito.

Libre ang quote. Sabihin mo lang ang kailangan mo.

SITE/products/website-development/?utm_source=facebook
```

### 4. Trust post (i-pin mo ito sa page mo)

```
Paano umorder sa GDS — para malinaw sa lahat.

1. Piliin ang product sa website. Nakasulat doon ang presyo
   at kung ano ang kasama.
2. Punan ang order form. Makukuha mo agad ang Order Reference mo
   (hal. GDS-2608-0042).
3. Magbayad via GCash o bank transfer. Ilagay ang reference sa notes.
4. I-upload ang screenshot ng resibo. Ve-verify namin at itatakda
   natin ang setup mo.

Matra-track mo ang order mo kahit hindi ka nagme-message:
SITE/track/

MAHALAGA: Hindi kami humihingi ng password, OTP, o card details —
kailanman. Isang GCash at isang bank account lang ang gamit namin,
at nakasulat ang mga ito sa website. Kung may nagpakilalang GDS sa
ibang account, hindi iyon kami — i-report niyo agad sa akin.
```

### 5. Kapag tinanong kung may iba pang produkto

```
Isa lang muna ang binebenta ko, at sinasadya ko iyon.

May mga sistemang binubuo pa ako. Hindi ko ito ibebenta hangga't
hindi tapos at hangga't hindi ko kayang suportahan nang maayos.

Mas mabuting isang produktong gumagana talaga, kaysa sampung
pangakong hindi ko matutupad.

Kapag may bagong handa na, dito niyo unang malalaman.
```

---

## Ilang paalala sa pag-post

- **Hindi lahat ng post ay benta.** Sa bawat 4 na post, isa lang ang direktang nagbebenta.
  Ang tatlo ay tips sa pangongolekta, karanasan mo sa trabaho, o kaunting kuwento.
- **Isang problema kada post.** Mas mabisa ang "nakalimutan mong singilin?" kaysa sa
  listahan ng lahat ng feature. Sa product page na sila magbabasa ng buong listahan.
- **Sumagot sa lahat ng comment**, kahit "interested" lang. Nakikita ito ng Facebook.
- **Huwag mag-post ng bare link.** Laging may 3–5 linyang caption bago ang link.
- **Pin mo ang trust post** sa page mo. Ito ang unang nakikita ng bagong bisita.
- **I-post sa oras na gising ang tao** — 7–9 AM, 12–1 PM, at 7–10 PM.
- **Kapag may nagtanong ng presyo sa comments**, sagutin mo at i-link ang product page.
  Huwag "PM na lang po" — iyon ang dahilan kung bakit may website ka.

---

## Saan hahanapin ang mga bibili ng BayadTrack

Hindi lahat ng nasa FB page mo ay nangongolekta. Mas mabuting pumunta ka kung nasaan sila:

- Mga grupo ng **internet reseller** at **kapitbahay-net operator**
- Mga grupo ng **piso-WiFi at piso-net** na may buwanang subscriber
- Mga **coop** at **lending** na may listahan ng hulugan
- Mga may-ari ng **apartment at boarding house** na naniningil buwan-buwan

Basahin muna ang rules ng grupo bago mag-post ng benta. Sa maraming grupo, mas
tinatanggap ang pagsagot sa tanong ng iba kaysa sa direktang ad — at doon ka rin
naman makakakuha ng kliyente.

---

## Kapag nagdagdag ka ng bagong product

1. Idagdag ito sa `js/products.js`
2. Patakbuhin: `powershell -ExecutionPolicy Bypass -File tools\build-pages.ps1`
3. I-upload sa GitHub (tingnan ang [`DEPLOY.md`](DEPLOY.md))
4. Ang link nito ay `SITE/products/<slug>/?utm_source=facebook`
5. Patakbuhin ito sa Facebook Sharing Debugger bago i-post
