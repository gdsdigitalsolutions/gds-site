# Setup ng Order System (Google Sheets + Apps Script)

Ito ang "utak" ng order system mo. Tatanggapin nito ang mga order mula sa website,
isusulat sa isang Google Sheet, ise-save ang mga resibo sa Google Drive, at magpapadala
ng email sa customer at sa iyo.

**Libre lahat ito.** Kailangan mo lang ng Google account.
**Tinatayang oras: 15–20 minuto.** Isang beses mo lang ito gagawin.

---

## Hakbang 1 — Gumawa ng Google Sheet

1. Pumunta sa [sheets.new](https://sheets.new) — gagawa ito ng bagong blangkong spreadsheet.
2. Pangalanan ito: **GDS Orders**
3. Huwag mo nang gagalawin ang laman — ang script na ang bahala sa mga column.

---

## Hakbang 2 — Buksan ang Apps Script

1. Sa loob ng sheet, i-click ang **Extensions → Apps Script**.
2. May bubukas na bagong tab na may `Code.gs` at kaunting halimbawang code.
3. **Burahin ang lahat** ng nandoon.
4. Buksan ang `Code.gs` mula sa folder na `site/apps-script/` sa computer mo,
   kopyahin ang **buong laman**, at i-paste sa Apps Script editor.
5. I-click ang icon ng disk (**Save**), o pindutin ang `Ctrl + S`.

---

## Hakbang 3 — Punan ang SETTINGS

Sa itaas ng code, may bahaging `var SETTINGS = { ... }`. Ito ang mga kailangan mong palitan:

| Ano | Ilagay |
|---|---|
| `ownerEmail` | Email mo — dito darating ang notification kada order |
| `siteUrl` | Live URL ng website mo, walang slash sa dulo. Punan mo ito **pagkatapos** ng [DEPLOY.md](../DEPLOY.md) |
| `deliveryPromise` | Hal. `"within 1-6 oras pagka-verify ng bayad"` |
| `gcash.name` / `gcash.number` | Registered name at number ng GCash mo |
| `bank.name` / `bank.accountName` / `bank.accountNumber` | Bank details mo |

> **Doble-tsekin mo ang GCash at bank details.** Ito ang ipapadala sa email ng customer.
> Ang maling numero dito ay nangangahulugang mapupunta sa ibang tao ang bayad.

I-save ulit (`Ctrl + S`).

---

## Hakbang 4 — Subukan bago i-deploy

1. Sa itaas ng editor, may dropdown na nagsasabing `doPost` o `doGet`.
   Palitan ito ng **`testSetup`**.
2. I-click ang **Run**.
3. Unang beses lang: hihingi ito ng permiso.
   - **Review permissions** → piliin ang Google account mo
   - Lalabas ang *"Google hasn't verified this app"* — **normal ito**, ikaw ang gumawa nito.
     I-click ang **Advanced** → **Go to [pangalan ng project] (unsafe)** → **Allow**.
4. Tingnan ang **Execution log** sa ibaba. Dapat mong makita ang pangalan ng sheet,
   ang timezone, at ang Drive folder. Kung may `!! Palitan ang ownerEmail`, balik ka sa Hakbang 3.
5. Balik sa Google Sheet mo — may bagong tab na **Orders** na may mga heading.

> Kung gusto mong subukan ang buong daloy, patakbuhin ang **`testOrder`**.
> Magsu-sulat ito ng isang test row at magpapadala ng email sa iyo.
> Burahin mo ang row na iyon pagkatapos.

---

## Hakbang 5 — I-deploy bilang Web App

1. Sa kanang itaas, i-click ang **Deploy → New deployment**.
2. Sa tabi ng **Select type**, i-click ang gear icon → piliin ang **Web app**.
3. Punan:
   - **Description:** `GDS order backend v1`
   - **Execute as:** `Me` (ang email mo)
   - **Who has access:** `Anyone`  ← **mahalaga ito**
4. I-click ang **Deploy**, tapos **Authorize access** kung hihingi ulit.
5. Kokopyahin mo ang **Web app URL**. Ganito ang hitsura:

   ```
   https://script.google.com/macros/s/AKfycb.....................…/exec
   ```

> ⚠️ Ang `Who has access: Anyone` ay **hindi** nangangahulugang makikita ng iba ang sheet mo.
> Ibig lang sabihin nito ay puwedeng magpadala ng order ang website papunta sa script.
> Ang sheet at Drive folder mo ay pribado pa rin.

---

## Hakbang 6 — Ilagay ang URL sa website

1. Buksan ang `site/js/config.js`.
2. Hanapin ang linyang `endpoint: "",`
3. I-paste ang Web app URL sa loob ng mga panipi:

   ```js
   endpoint: "https://script.google.com/macros/s/AKfycb....../exec",
   ```

4. I-save. Kung na-deploy mo na ang site, i-upload ulit ang `config.js`.

---

## Hakbang 7 — Subukan mula sa website

1. Buksan ang website mo, pumili ng product, at mag-order gamit ang **sarili mong email**.
2. Dapat mangyari ang lahat ng ito:
   - May lumabas na order reference (hal. `GDS-2608-0001`)
   - May bagong row sa Google Sheet mo
   - May email sa customer (ikaw) at may notification email sa iyo
3. Mag-upload ng kahit anong screenshot bilang test na resibo.
   - Dapat may bagong file sa Drive folder na `GDS Orders / 2026-08 /`
   - Dapat may link ito sa column na **Proof of Payment**
   - Dapat naging **Payment Received** ang Status
4. Pumunta sa `/track/` at ilagay ang reference. Dapat lumabas ang tamang status.
5. **Burahin ang test row** sa sheet pagkatapos.

---

## Araw-araw na paggamit

Ganito mo hahawakan ang mga order. Sa **Status** column lang ang gagalawin mo:

| Status | Kailan mo ito ilalagay |
|---|---|
| `Pending` | Awtomatiko. Naghihintay pa ng bayad. |
| `Payment Received` | Awtomatiko kapag nag-upload sila ng resibo. |
| `Verified` | **Ikaw** — kapag nakita mo na sa GCash o bank app mo ang bayad. |
| `Delivered` | **Ikaw** — kapag naipadala mo na ang file. |
| `Cancelled` | **Ikaw** — kapag hindi natuloy. |

Ang status na ito mismo ang nakikita ng customer sa `/track/` page.
Kaya kapag nag-update ka, awtomatiko nilang nakikita — hindi na sila magme-message.

---

## Kapag may binago ka sa Code.gs

Kailangan mong mag-deploy ulit para gumana ang pagbabago:

**Deploy → Manage deployments → (i-click ang lapis na icon) → Version: New version → Deploy**

> Huwag gagawa ng bagong deployment gamit ang **New deployment** —
> magbabago ang URL at hihinto ang website mo. Palaging **New version** sa lumang deployment.

---

## Kapag may problema

| Problema | Solusyon |
|---|---|
| "Hindi maintindihan ang sagot ng server" | Hindi naka-`Anyone` ang access. Balik sa Manage deployments at ayusin. |
| Walang dumarating na email | Tingnan ang Spam. May 100 email kada araw na limit ang libreng Gmail — sapat na ito para sa karamihan. |
| Walang naisusulat sa sheet | Buksan ang Apps Script → **Executions** sa kaliwa. Makikita mo ang error doon. |
| `Authorization required` | Patakbuhin ulit ang `testSetup` sa editor at aprubahan ang permiso. |
| Naging mali ang reference numbering | Apps Script → **Project Settings → Script Properties**. May `REF_COUNTER` doon na pwede mong baguhin. |

---

## Tungkol sa seguridad

- **Walang password, OTP, o card details** ang tinatanggap ng system na ito. Wala itong field para doon.
- Ang `/track/` page ay **status lang** ang ibinabalik — walang pangalan, email, o numero.
  Kahit may makakita ng reference number, wala silang makukuhang personal na impormasyon.
- May honeypot at rate limit (5 order kada email kada oras) laban sa bot.
- Ang mga resibo ay nasa pribadong Drive folder mo. Ikaw lang ang nakakakita.
