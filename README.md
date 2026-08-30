# GDS Digital Solutions — Website

Website para sa pagbebenta ng digital products na may kumpletong order at payment flow
(GCash at bank transfer, may proof of payment at order tracking).

Plain HTML, CSS, at JavaScript — **walang build tool, walang npm, walang framework.**
I-upload mo lang ang mga file at gumagana na.

---

## Simulan dito — tatlong hakbang

| # | Gawin | Gabay | Oras |
|---|---|---|---|
| 1 | Punan ang payment at contact details | `js/config.js` | 5 min |
| 2 | I-set up ang order system | [`apps-script/SETUP.md`](apps-script/SETUP.md) | 20 min |
| 3 | I-online ang site | [`DEPLOY.md`](DEPLOY.md) | 15 min |

Pagkatapos: basahin ang [`SOCIAL-KIT.md`](SOCIAL-KIT.md) para sa pag-post sa Facebook.

> ⚠️ **Basahin muna ang [`REVIEW-BAGO-I-LIVE.md`](REVIEW-BAGO-I-LIVE.md).** May mga pangako sa
> product descriptions na kailangan mong kumpirmahin o baguhin bago makakita ng customer.

---

## Ano ang nasa loob

```
index.html              Home page
products/               Catalog + isang folder kada product
order/                  Order form, payment, at proof of payment
track/                  Status ng order
about/ contact/         Impormasyon
terms/ privacy/ refund/ Legal — kailangan ito kapag may pera sa usapan
404.html                Kapag mali ang link

css/tokens.css          Kulay, font, at spacing — galing sa logo mo
css/base.css            Reset, typography, header, footer
css/components.css      Buttons, cards, forms, at iba pa

js/config.js            ⭐ ITO LANG ANG KAILANGAN MONG PUNAN
js/config.sample.js     Halimbawa kung ano ang hitsura kapag punan na
js/products.js          ⭐ Listahan ng lahat ng product
js/ui.js                Menu, copy buttons, product grids
js/order.js             Order flow
js/track.js             Status lookup

apps-script/Code.gs     Backend — i-paste sa script.google.com
apps-script/SETUP.md    Hakbang-hakbang na gabay

assets/brand/           Logo, favicon, share image
assets/products/        Larawan kada product
assets/pay/             Dito ilagay ang GCash QR mo
assets/social/          Awtomatikong ginagawang share images

tools/build-pages.ps1   Bumubuo ng product at content pages
tools/make-product-images.ps1  Bumubuo ng branded na larawan
tools/serve.ps1         Local preview server
tools/templates/        Template ng page
tools/content/          Teksto ng about, contact, terms, privacy, refund
```

---

## Preview sa computer mo

Bago i-upload, tingnan mo muna:

```powershell
powershell -ExecutionPolicy Bypass -File tools\serve.ps1
```

Buksan ang **http://localhost:8080/**. Pindutin ang `Ctrl+C` para itigil.

> Kailangan mo ang server na ito. Kapag double-click mo lang ang `index.html`,
> hindi gagana ang mga link tulad ng `products/bayadtrack/`.

---

## Paano magdagdag o mag-edit ng product

1. Buksan ang **`js/products.js`**.
2. Kopyahin ang isang buong `{ ... }` na block, i-paste, at palitan ang laman.
   Tiyaking may kuwit (`,`) sa pagitan ng bawat block.
3. Idagdag ang larawan sa `assets/products/` at isulat ang filename sa `image`.
   - Wala pang larawan? Idagdag ang product sa listahan sa loob ng
     `tools/make-product-images.ps1` at patakbuhin ito — gagawa ito ng branded na larawan.
4. Patakbuhin ang generator:

   ```powershell
   powershell -ExecutionPolicy Bypass -File tools\build-pages.ps1
   ```

5. I-upload ang mga bagong file sa GitHub.

> ⚠️ **Huwag i-edit nang direkta ang `products/<slug>/index.html`.**
> Mapapalitan ito sa susunod na pagbuo. Ang `js/products.js` ang totoong pinagmumulan.

### Paglalagay ng presyo

```js
"price": 850,        // ₱850 ang lalabas
"price": null,       // "Message for price" ang lalabas
```

---

## Paano baguhin ang teksto ng about, contact, terms, privacy, refund

I-edit ang mga file sa **`tools/content/`**, tapos patakbuhin ang `build-pages.ps1`.
Ang tuktok ng bawat file ay may `TITLE:` at `DESC:` — ang `---` ang naghihiwalay
nito sa laman ng page.

---

## Paano baguhin ang kulay o hitsura

Nasa **`css/tokens.css`** ang lahat ng kulay, laki ng espasyo, at font.
Isang lugar lang ang babaguhin mo at susunod ang buong site.

Ang mga kulay ay literal na kinuha mula sa logo mo:

| Token | Kulay | Saan galing |
|---|---|---|
| `--navy-900` | `#00102c` | Background ng logo |
| `--blue-700` | `#0043b9` | Madilim na dulo ng gradient |
| `--blue-600` | `#0065eb` | Gitnang asul |
| `--blue-500` | `#008afc` | Pangunahing asul |
| `--cyan-400` | `#03c6fa` | Maliwanag na dulo ng gradient |

---

## Ang mga larawan ng product

Ang mga nasa `assets/products/` ngayon ay **branded na placeholder** — gawa mula sa logo mo.
Maayos ang hitsura nila, pero **mas mabenta ang totoong screenshot.**

Kapag may screenshot ka na:

1. I-save ito bilang JPG, humigit-kumulang **1600 × 1000** (16:10)
2. Palitan ang file sa `assets/products/` gamit ang parehong pangalan
3. Patakbuhin ang `build-pages.ps1` — gagawa ito ng bagong share image para sa Facebook

Mga screenshot na pinakamalaking tulong:
- Ang DASHBOARD ng BayadTrack na may totoong bilang
- Ang FOLLOW UP sheet — dito kitang-kita ang halaga ng sistema
- Kuha mula sa cellphone — ito ang pinakamalaking benepisyo

> Takpan ang pangalan ng kliyente bago mag-screenshot, o gumamit ng malinis na kopya
> na may halimbawang pangalan.

---

## Seguridad at privacy — mga desisyong sinadya

- **Walang password, OTP, o card details** ang tinatanggap ng site. Walang field para dito.
  Ang customer mismo ang nagpapadala ng bayad mula sa sarili niyang app.
- **Ang `/track/` ay status lang** ang ibinabalik — walang pangalan, email, o numero.
  Kahit may makakita ng reference number, wala silang makukuhang personal na impormasyon.
- **Walang tracking cookie** — walang Facebook Pixel, walang Google Analytics.
  `sessionStorage` lang ang gamit para hindi mawala ang order reference kapag nag-refresh.
- **Naka-`noindex` ang `/order/`** para hindi ito lumabas sa Google.
- May **honeypot at rate limit** sa backend laban sa bot.

---

## Kapag may nasira

| Sintomas | Tingnan mo |
|---|---|
| Walang lumalabas na product | May typo sa `js/products.js`. Buksan ang page, pindutin ang `F12`, basahin ang Console. |
| Hindi tumatakbo ang `build-pages.ps1` | Nawala ang `,` o `"` sa `js/products.js`. Sasabihin ng script kung saan. |
| Walang CSS | Kulang ang na-upload na `css` folder. |
| Hindi gumagana ang order form | Walang `endpoint` sa `config.js`, o hindi naka-`Anyone` ang Apps Script. |
| Luma ang preview sa Facebook | Gamitin ang Sharing Debugger — nasa [`SOCIAL-KIT.md`](SOCIAL-KIT.md). |
