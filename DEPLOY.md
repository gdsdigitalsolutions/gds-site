# Paano i-online ang website (GitHub Pages)

Libre ang GitHub Pages, walang bayad habambuhay, at kayang-kaya nito ang site na ito.
**Hindi mo kailangang marunong sa git.** Drag-and-drop lang.

**Tinatayang oras: 15 minuto.**

---

## Bago magsimula

Tiyakin mong tapos na ang mga ito:

- [ ] Napunan mo na ang `js/config.js` — GCash, bank, at contact details
- [ ] Nasunod mo na ang [`apps-script/SETUP.md`](apps-script/SETUP.md) at may Web app URL ka na sa `config.js`
- [ ] Napatakbo mo na ang `tools/build-pages.ps1` matapos ang huling pagbabago sa `js/products.js`

---

## Hakbang 1 — Gumawa ng GitHub account

1. Pumunta sa [github.com/signup](https://github.com/signup).
2. Gumamit ng email na madalas mong bineberipika — kakailanganin ito.
3. Pumili ng username. **Ito ang magiging bahagi ng link mo**, kaya piliin nang maayos —
   halimbawa, kung `gdsdigital` ang username mo, ang site mo ay:

   ```
   https://gdsdigital.github.io/gds-site/
   ```

4. Libre ang lahat ng kailangan mo. Huwag kang bibili ng anuman.

---

## Hakbang 2 — Gumawa ng repository

1. Pagka-login, i-click ang **+** sa kanang itaas → **New repository**.
2. Punan:
   - **Repository name:** `gds-site`
   - **Public** ← kailangan ito para libre ang GitHub Pages
   - **Add a README file** — huwag i-check
3. I-click ang **Create repository**.

---

## Hakbang 3 — I-upload ang mga file

1. Sa bagong repo, i-click ang **uploading an existing file**
   (nasa gitna ng page — "Get started by … uploading an existing file").
2. Buksan ang folder na `site` sa computer mo.
3. Piliin ang **lahat ng laman ng loob ng `site` folder** — `Ctrl + A`.

   > ⚠️ Ang **laman** ng `site` folder ang i-uupload mo, **hindi** ang `site` folder mismo.
   > Dapat nasa ugat ng repo ang `index.html`, hindi sa loob ng `site/index.html`.

4. I-drag ang mga ito papunta sa GitHub page.
5. Hintayin mong ma-upload lahat (may ilang minuto ito dahil sa mga larawan).
6. Sa ibaba, sa **Commit changes**, isulat: `Unang bersyon ng website`
7. I-click ang **Commit changes**.

---

## Hakbang 4 — Buksan ang GitHub Pages

1. Sa repo, i-click ang **Settings** (nasa itaas).
2. Sa kaliwang menu, i-click ang **Pages**.
3. Sa ilalim ng **Source**, piliin ang **Deploy from a branch**.
4. **Branch:** `main` &nbsp; **Folder:** `/ (root)` → **Save**.
5. Maghintay ng **1–3 minuto**. I-refresh ang page.
6. May lalabas na berdeng kahon:

   > Your site is live at `https://<username>.github.io/gds-site/`

7. I-click ito. **Live na ang website mo.**

---

## Hakbang 5 — Ilagay ang live URL sa dalawang lugar

Kailangan ito para tama ang mga link sa Facebook at sa email.

**1. Sa `js/config.js`:**

```js
site: {
  baseUrl: "https://gdsdigital.github.io/gds-site",
```

*(walang slash sa dulo)*

**2. Sa `apps-script/Code.gs` → `SETTINGS.siteUrl`:**

```js
siteUrl: "https://gdsdigital.github.io/gds-site",
```

Pagkatapos: i-upload ulit ang `config.js` sa GitHub, at sa Apps Script gawin ang
**Deploy → Manage deployments → New version → Deploy**.

---

## Paano mag-update pagkatapos

Tuwing may babaguhin ka:

1. Ayusin ang file sa computer mo.
2. Kung binago mo ang `js/products.js`, patakbuhin muna:

   ```powershell
   powershell -ExecutionPolicy Bypass -File tools\build-pages.ps1
   ```

3. Sa GitHub repo mo, i-click ang **Add file → Upload files**, i-drag ang mga binagong file,
   tapos **Commit changes**.
4. Maghintay ng 1–2 minuto para mag-update ang live site.

> Ang GitHub ay nagtatabi ng lumang bersyon ng bawat file. Kung may masira ka,
> mababalik mo ito sa **Commits** na nasa itaas ng repo.

---

## Sariling domain (opsyonal)

Kapag gusto mong maging `gdsdigitalsolutions.com` sa halip na `.github.io`:

1. Bumili ng domain — humigit-kumulang **₱600–₱900 kada taon**.
   Mga mapagkakatiwalaan: Namecheap, Cloudflare Registrar, Porkbun, o Dynadot.
2. Sa GitHub repo: **Settings → Pages → Custom domain** → ilagay ang domain → **Save**.
   Gagawa ito ng file na `CNAME` sa repo mo — huwag mo itong buburahin.
3. Sa dashboard ng binilhan mo ng domain, magdagdag ng mga **DNS record** na ito:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `<username>.github.io` |

4. Maghintay ng 10 minuto hanggang 24 oras para kumalat ang DNS.
5. Balik sa **Settings → Pages** at i-check ang **Enforce HTTPS**.
6. I-update ang `baseUrl` sa `config.js` at ang `siteUrl` sa `Code.gs` gamit ang bagong domain.

---

## Bago mo i-post sa Facebook

- [ ] Bisitahin ang bawat product page — walang sirang larawan o link
- [ ] Subukan ang isang totoong order gamit ang sarili mong email, mula umpisa hanggang dulo
- [ ] Tiyaking tama ang GCash at bank details — kopyahin mo ito at ihambing sa app mo
- [ ] Buksan ang site sa cellphone mo, hindi lang sa computer
- [ ] Patakbuhin ang bawat product link sa
      [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) —
      basahin ang [`SOCIAL-KIT.md`](SOCIAL-KIT.md)

---

## Kapag may problema

| Problema | Solusyon |
|---|---|
| 404 sa live URL | Hindi nasa ugat ang `index.html`. Sa GitHub, dapat nakikita mo agad ang `index.html`, hindi ang `site` folder. |
| Walang CSS, plain text lang ang site | Hindi na-upload ang buong `css` folder. I-upload ulit ito. |
| Walang product na lumalabas | Hindi na-upload ang `js/products.js`, o may typo dito. Buksan ang page, pindutin ang `F12`, at basahin ang error sa Console. |
| Hindi gumagana ang order form | Walang `endpoint` sa `config.js`, o hindi naka-`Anyone` ang Apps Script deployment. |
| Luma pa rin ang nakikita ko | I-refresh nang malakas: `Ctrl + Shift + R`. |
| Walang `.nojekyll` | Nasa repo na ito. Kung nabura, gumawa ng blangkong file na ganyan ang pangalan sa ugat ng repo. |
