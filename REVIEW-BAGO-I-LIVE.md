# Basahin ito bago i-live ang site

Ang catalog ay **BayadTrack at website development lang** — inalis ang mga flasher at firmware
dahil hindi pa tapos ang mga iyon. Kapag handa na, ibabalik natin sila sa `js/products.js`.

Ang teknikal na detalye ng BayadTrack sa product page ay batay sa aktwal na gawa ng sistema
(buwanang view, opening balance sa buwan, disconnect at reconnect, FOLLOW UP, area totals,
phone-first na dropdown, 1,000 kliyente). **Pero may mga pangakong pang-negosyo ako na hindi
ko mapapatunayan** — ikaw ang dapat magpasya kung totoo ang mga ito, dahil ito ang aasahan
ng bibili mo.

---

## 1. Mga pangakong kailangan mong kumpirmahin o baguhin

Nasa `js/products.js` maliban kung may nakasulat na ibang file:

**Na-update na (Aug 30):** Ang presyo (₱2,499 one-time), ang kasama (done-with-you setup,
import ng client list, walkthrough, check-in pagkatapos ng unang buwan), at ang setup timeline
(sa loob ng 1 araw) ay galing na sa opisyal mong carousel sa
`Desktop\BayadTrack\Marketing BayadTrack` — hindi na hula. Ang natitira sa listahan sa ibaba
ang kailangan mo pa ring kumpirmahin.

| Saan | Ang isinulat ko | Tanong sa iyo |
|---|---|---|
| BayadTrack | `"Kapasidad": "Hanggang 1,000 kliyente kada file"` | Tama ba ito sa kasalukuyang file mo? |
| BayadTrack FAQ | *"May paraan, pero pag-uusapan muna natin ang setup"* (lampas 1,000) | Sang-ayon ka ba rito? |
| Website dev | `"Karaniwang tagal": "1–3 linggo"` | Realistiko ba ito kasabay ng ibang trabaho mo? |
| Website dev | `"Revisions": "2 round"`, `"Bayad": "50% / 50%"` | Ito ba ang aktwal mong terms? |
| Website dev | *"Libreng hosting sa umpisa"* | GitHub Pages ang tinutukoy ko. Sang-ayon ka ba? |
| `js/config.js` | `deliveryPromise: "within 1–6 oras"` | Kaya mo ba ito araw-araw? **Mas mabuting mag-promise ng mahaba tapos maaga kang magpadala,** kaysa mag-promise ng maikli tapos ma-late ka. |
| `js/config.js` | `since: "2022"` | Kailan ka talaga nagsimula? |
| `tools/content/about.html` | *"Nagsimula ang BayadTrack sa isang simpleng problema…"* | **Palitan mo ito ng totoong kuwento mo.** Hindi ko alam ang aktwal na pinagsimulan mo — hulaan ko lang ito. Ang totoong kuwento ang pinakamabentang parte ng About page. |
| `tools/content/refund.html` | *3–7 araw ng negosyo bago ibalik ang bayad* | Kaya mo ba ito? |

> Ang bawat mali dito ay magiging reklamo mamaya. Mas mabuting mangako nang kaunti
> at higitan mo, kaysa mangako nang marami at mabigo.

Pagkatapos mong mag-edit sa `tools/content/`, patakbuhin ito:

```powershell
powershell -ExecutionPolicy Bypass -File tools\build-pages.ps1
```

---

## 2. Presyo ng BayadTrack — TAPOS NA

Naka-set na ang **₱2,499 one-time** sa `js/products.js`, galing sa carousel mo.
Lumalabas na ito sa product card, sa buy box, at sa order form — awtomatiko nang
kinukuwenta ang kabuuan sa checkout.

Ang Website Development ay nananatiling `"quoteOnly": true` — **"Libreng quote"**
ang lumalabas. Tama iyon para sa serbisyo.

---

## 3. Payment at contact details

Sa `js/config.js`. **Ito ang pinaka-delikadong bahagi** — literal na kokopyahin ng
customer mo ang mga numerong ito.

- [ ] GCash: registered name at number
- [ ] GCash QR: i-save sa `assets/pay/gcash-qr.png`, isulat ang filename sa `qrImage`
- [ ] Bank: pangalan ng bangko, account name, account number
- [ ] Facebook Page URL at Messenger link
- [ ] Email na tatanggap ng orders
- [ ] Mobile number
- [ ] Oras ng operasyon at karaniwang oras ng pagsagot

**Pagkatapos mong punan: kopyahin mo ang numero mula mismo sa website, tapos i-paste mo
sa GCash app mo at tingnan kung tama ang lumalabas na pangalan.** Huwag lang basahin —
subukan mo talaga.

---

## 4. Mga larawan — malaki na ang iginanda

Ang product gallery ay gumagamit na ng **apat na slide mula sa opisyal mong carousel**
(dashboard, paano gumagana, tatlong hakbang, features) — hindi na generic na placeholder.
Ito rin ang Facebook share image.

Ang isa pang aayos na papatong dito ay totoong screenshot mula sa aktwal na file:

- [ ] Screenshot ng **DASHBOARD** — takpan ang pangalan ng kliyente, iwan ang mga numero
- [ ] Screenshot ng **FOLLOW UP** sheet — dito kitang-kita ang halaga ng sistema
- [ ] Screenshot mula sa **cellphone** — ito ang pinakamalaking benepisyo mo at dapat kitang-kita

I-save bilang JPG na humigit-kumulang **1600 × 1000**, pangalanan mong `bayadtrack.jpg`,
ilagay sa `assets/products/`, tapos patakbuhin ang `build-pages.ps1`.

> ⚠️ **Huwag mong gagamitin ang test files na may totoong pangalan ng kliyente.**
> Gumawa ka ng malinis na kopya na may halimbawang pangalan, o takpan mo ang column
> ng pangalan bago mag-screenshot.

---

## 5. Ang mga bagay na sinasadya kong iwanang wala

Hindi ako naglagay ng mga ito dahil **hindi ako pwedeng gumawa ng peke**:

- **Testimonials** — walang review section sa site ngayon. May aktwal ka nang gumagamit
  ng BayadTrack. Humingi ka sa kanila ng maikling feedback at pahintulot, tapos sabihin
  mo lang at ilalagay natin nang may pangalan at petsa. **Ito ang pinakamalakas na
  susunod mong idadagdag** — mas malakas pa sa kahit anong caption.
- **Bilang ng nabentang kopya o na-serve na customer** — walang "500+ satisfied customers"
  kahit saan. Ang pekeng bilang ang pinakamabilis mahalatang scam.
- **Business registration** — kung may DTI o BIR registration ka, sabihin mo at ilalagay
  natin sa footer at sa About page. Malaking tulong ito sa tiwala kapag may pera sa usapan.
- **Pangalan ng mga kasalukuyang kliyente mo** — hindi ko ito nilagay kahit saan.
  Huwag mong ilalagay nang walang nakasulat nilang pahintulot.

---

## 6. Huling tsek bago mag-post sa Facebook

- [ ] Nag-order ako mismo mula umpisa hanggang dulo gamit ang sarili kong email
- [ ] May dumating na email sa akin bilang customer, at may notification sa akin bilang may-ari
- [ ] May bagong row sa Google Sheet, at nasa Drive ang resibo
- [ ] Gumana ang `/track/` gamit ang reference number
- [ ] Binuksan ko ang site sa cellphone, hindi lang sa computer
- [ ] Tama ang GCash at bank details — sinubukan ko sa app
- [ ] Napatakbo ko ang bawat product link sa Facebook Sharing Debugger
      (tingnan ang [`SOCIAL-KIT.md`](SOCIAL-KIT.md))
- [ ] Nabasa ko ang Terms, Privacy, at Refund — sang-ayon ako sa lahat ng nakasulat doon
- [ ] Walang natirang teksto sa site na nangangako ng wala pa akong maibibigay

---

## 7. Kapag handa na ang mga flasher at firmware

Ibalik lang sila sa `js/products.js` — isang entry kada produkto. Nasa git history
ang lumang bersyon kung gusto mong balikan ang dating teksto:

```bash
git show 5c3d649:js/products.js
```

Idagdag din ang mga ito sa listahan sa loob ng `tools/make-product-images.ps1`,
tapos patakbuhin ang dalawang script. Ibabalik nito ang page, ang larawan, at ang
Facebook share image.

**Bago mo sila ibalik:** basahin mo ulit ang seksyong nasa dating Terms tungkol sa
firmware at ONT — may mga babala doon tungkol sa warranty, brick, at ISP-leased na
unit na kailangan mong ibalik kasama nila.
