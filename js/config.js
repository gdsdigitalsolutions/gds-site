/* ============================================================
   GDS Digital Solutions — SITE CONFIG
   ------------------------------------------------------------
   ITO LANG ANG FILE NA KAILANGAN MONG I-EDIT para gumana ang site.
   Palitan ang bawat "" ng totoong detalye mo, tapos i-save.

   Ang anumang naiwang blangko ay HINDI lalabas sa site — sa halip,
   magpapakita ito ng malinis na mensahe na "message us" imbes na
   sirang page. Kaya safe kahit hindi mo pa kumpleto agad.
   ============================================================ */

window.GDS_CONFIG = {

  /* ---------- 1. BUSINESS ---------- */
  business: {
    name: "GDS Digital Solutions",
    tagline: "Digital Products • Websites • Smart Solutions",
    // Taon nang nagsimula ka (para sa footer at About page)
    since: "2022",
    // Saan ka naka-base — lalabas sa About/Contact
    location: "Philippines",
    // Pangalan mo bilang may-ari (para sa About page; pwedeng iwan blangko)
    ownerName: ""
  },

  /* ---------- 2. CONTACT ---------- */
  contact: {
    // Facebook Page URL mo (GDS Digital Solutions)
    facebookPage: "https://www.facebook.com/profile.php?id=61593397667884",
    // Direktang Messenger link papunta sa page
    messenger: "https://m.me/61593397667884",
    // Email na tatanggap ng orders (dito rin ipapadala ang notification)
    email: "geraldsinio@gmail.com",
    // Mobile number — HALIMBAWA: "0917 123 4567"
    mobile: "",
    // Oras ng operasyon — HALIMBAWA: "Lunes–Linggo, 8:00 AM – 10:00 PM"
    hours: "",
    // Gaano ka kabilis sumagot — HALIMBAWA: "Karaniwang 15–60 minuto"
    responseTime: ""
  },

  /* ---------- 3. PAYMENT DETAILS ----------
     ⚠ Doble-tsekin mo ito. Ito ang literal na ipapakita sa customer
     at pagbabasehan nila ng ipapadalang bayad. */
  payment: {
    gcash: {
      enabled: true,
      // Registered name sa GCash — ganito rin ang makikita ng nagpapadala sa app
      accountName: "GE***D S.",
      // GCash number — HALIMBAWA: "0917 123 4567"
      accountNumber: "0919 703 0111",
      // Ilagay ang QR code image sa assets/pay/ tapos isulat ang filename dito.
      qrImage: "gcash-qr.jpg"
    },
    bank: {
      enabled: true,
      // HALIMBAWA: "MariBank" / "BDO Unibank" / "BPI"
      bankName: "MariBank",
      accountName: "GERALD SINIO",
      accountNumber: "",
      // Opsyonal — HALIMBAWA: "Savings" o branch name
      accountType: "",
      // Screenshot ng bank QR mo — ilagay sa assets/pay/ tapos isulat ang filename.
      qrImage: "maribank-qr.jpg"
    },
    // Sinusuportahang paraan bukod sa taas (para sa FAQ text lang)
    otherMethods: "Maya at InstaPay/PESONet transfer — message lang kami."
  },

  /* ---------- 4. ORDER SYSTEM ----------
     Ang endpoint ay galing sa Google Apps Script Web App mo.
     Basahin ang apps-script/SETUP.md para sa hakbang-hakbang. */
  order: {
    // I-paste dito ang "Web app URL" mula sa Apps Script deployment.
    // Mukhang: "https://script.google.com/macros/s/AKfy..../exec"
    endpoint: "https://script.google.com/macros/s/AKfycbwGtadgDZMqpwHBADZ_HH7Bx71qxSaaYGOfURO-7i2h7iPcVQRC6UqnO76mhxK-iJwf_A/exec",
    // Pangako mo sa delivery — lalabas sa lahat ng product page
    deliveryPromise: "Ipapadala within 1–6 oras pagka-verify ng bayad",
    // Max na laki ng screenshot na tatanggapin (MB)
    maxProofSizeMB: 5,
    currency: "PHP",
    currencySymbol: "₱"
  },

  /* ---------- 5. SITE ----------
     Kapag na-deploy na sa GitHub Pages, ilagay dito ang live URL
     (walang slash sa dulo). Ginagamit ito ng social share links. */
  site: {
    baseUrl: "https://gdsdigitalsolutions.github.io/gds-site",
    // Ipakita ang presyo sa product cards? Kapag `false`, "Message for price"
    // ang lalabas kahit may nakalagay na presyo sa products.js.
    showPrices: true
  }

};
