/* ============================================================
   GDS Digital Solutions — HALIMBAWANG CONFIG (SAMPLE)
   ------------------------------------------------------------
   HINDI ginagamit ng site ang file na ito. Halimbawa lang ito kung
   ano ang hitsura ng config.js kapag napunan na. Peke ang lahat ng

   detalye rito. Ang aayusin mo ay ang config.js, hindi ito.
   magpapakita ito ng malinis na mensahe na "message us" imbes na
   sirang page. Kaya safe kahit hindi mo pa kumpleto agad.
   ============================================================ */

var GDS_CONFIG_SAMPLE = {

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
    // Facebook Page URL mo — HALIMBAWA: "https://www.facebook.com/GDSDigitalSolutions"
    facebookPage: "https://www.facebook.com/GDSDigitalSolutions",
    // Direktang Messenger link — HALIMBAWA: "https://m.me/GDSDigitalSolutions"
    messenger: "https://m.me/GDSDigitalSolutions",
    // Email na tatanggap ng orders (dito rin ipapadala ang notification)
    email: "orders@example.com",
    // Mobile number — HALIMBAWA: "0917 123 4567"
    mobile: "0917 000 0000",
    // Oras ng operasyon — HALIMBAWA: "Lunes–Linggo, 8:00 AM – 10:00 PM"
    hours: "Lunes-Linggo, 8:00 AM - 10:00 PM",
    // Gaano ka kabilis sumagot — HALIMBAWA: "Karaniwang 15–60 minuto"
    responseTime: "Karaniwang 15-60 minuto"
  },

  /* ---------- 3. PAYMENT DETAILS ----------
     ⚠ Doble-tsekin mo ito. Ito ang literal na ipapakita sa customer
     at pagbabasehan nila ng ipapadalang bayad. */
  payment: {
    gcash: {
      enabled: true,
      // Registered name sa GCash account mo
      accountName: "JUAN D. CRUZ",
      // GCash number — HALIMBAWA: "0917 123 4567"
      accountNumber: "0917 000 0000",
      // Ilagay ang QR code image sa assets/pay/ tapos isulat ang filename dito.
      // HALIMBAWA: "gcash-qr.png"  (iwan blangko kung wala pa)
      qrImage: ""
    },
    bank: {
      enabled: true,
      // HALIMBAWA: "BDO Unibank" / "BPI" / "Landbank"
      bankName: "BDO Unibank",
      accountName: "JUAN DELA CRUZ",
      accountNumber: "0917 000 0000",
      // Opsyonal — HALIMBAWA: "Savings" o branch name
      accountType: ""
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
    endpoint: "http://localhost:8080/__test__",
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
    baseUrl: "",
    // Ipakita ang presyo sa product cards? Kapag `false`, "Message for price"
    // ang lalabas kahit may nakalagay na presyo sa products.js.
    showPrices: true
  }

};
