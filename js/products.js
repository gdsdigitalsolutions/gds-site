/* ============================================================
   GDS Digital Solutions — PRODUCT CATALOG
   ------------------------------------------------------------
   Ito ang source of truth ng lahat ng products. Ginagamit ito ng:
     • products/index.html   (catalog)
     • index.html            (featured grid)
     • order/index.html      (prefill + pagkuha ng presyo)

   PARA MAGDAGDAG NG PRODUCT:
     1. Kopyahin ang isang object sa ibaba, palitan ang laman.
        Panatilihing naka-quote ang mga key ("slug", "name", ...) —
        kailangan ito ng tools/build-pages.ps1.
     2. Idagdag ang larawan sa assets/products/.
     3. Patakbuhin ang tools/build-pages.ps1 — gagawa ito ng page
        at ng Facebook share image.

   PRESYO: ilagay ang bilang lang, hal. "price": 850
           Kapag `null`, "Message for price" ang lalabas.
   ============================================================ */

window.GDS_PRODUCTS = [

  {
    "slug": "bayadtrack",
    "name": "BayadTrack",
    "short": "Sino pa ang may utang? Alam mo agad. Payment tracker para sa internet reseller — Google Sheets lang, gumagana sa phone, real-time.",
    "category": "system",
    "categoryLabel": "Business System",
    "badge": "Gumagana na",
    "featured": true,
    "price": 2499,
    "priceNote": "One-time lang. Walang monthly. Sa iyo ang file.",
    "image": "bayadtrack.jpg",
    "heroImage": "bayadtrack-dashboard.jpg",
    "images": ["bayadtrack-dashboard.jpg", "bayadtrack-tracker.jpg", "bayadtrack-collection.jpg", "bayadtrack-followup.jpg"],
    "imageInfo": {
      "bayadtrack-dashboard.jpg":  { "alt": "BayadTrack dashboard showing overdue clients, collections and follow-up summary using fictional demo data", "caption": "Dashboard — makita agad kung sino ang may utang at magkano (demo · fictional data)" },
      "bayadtrack-tracker.jpg":    { "alt": "BayadTrack client tracker showing payment status and balances using fictional demo data", "caption": "Tracker — isang view ng status ng lahat ng clients (demo · fictional data)" },
      "bayadtrack-collection.jpg": { "alt": "BayadTrack collection sheet showing monthly client payment recording using fictional demo data", "caption": "Collection — mabilis na payment recording (demo · fictional data)" },
      "bayadtrack-followup.jpg":   { "alt": "BayadTrack follow-up list showing clients with overdue balances using fictional demo data", "caption": "Follow Up — kusang listahan ng kailangang singilin (demo · fictional data)" }
    },
    "ctaLabel": "Get BayadTrack — ₱2,499",
    "ctaSecondary": "Magtanong muna",
    "unsureTitle": "Hindi ka sigurado kung bagay ang BayadTrack sa negosyo mo?",
    "unsureLead": "",
    "unsureTail": "at sabihin kung ilan ang clients mo at paano ka nangongolekta ngayon.",
    "deliveryNote": "Pagka-verify ng payment, iko-coordinate namin ang client-list import, Google Drive setup, at walkthrough ng BayadTrack.",
    "summary":
      "Para sa mga nangongolekta ng buwanang bayad — internet reseller, kapitbahay-net, coop, o kahit anong negosyong may listahan ng singilin. Tina-type lang ng collector ang bayad sa phone habang nasa field; ilang segundo lang, updated na ang dashboard mo — magkano ang nakolekta ngayong araw, sino pa ang may utang, sino ang dapat i-follow up. Walang tawagan, walang \"i-send ko mamaya\". Hindi ito problema ng sipag — problema ito ng sistema, at ito ang sistemang inaayos iyon.",
    "highlights": [
      "Done-with-you setup ng file at script — kasama ka, hindi ka iiwan",
      "Import ng buong client list mo — ikaw ang magfi-fill ng template, kami ang mag-i-import",
      "Dashboard, follow-up list, disconnected list, at buwanang record",
      "Automatic ang status — PAID, PARTIAL, UNPAID, OVERDUE. Walang tina-type kundi ang halaga",
      "Ang \"promise Sept 5\" sa remarks ay awtomatikong nagiging follow-up date",
      "Putol pero may record — pagbalik ng kliyente, dala pa rin niya ang utang; pwede ring i-pardon",
      "Discount at advance — may downtime? Naka-record na may dahilan. May advance? Naka-credit sa susunod na buwan",
      "Bagong kabit sa phone — ADD CLIENT form na may awtomatikong prorated na unang bill",
      "Lumipat ng buwan sa dropdown lang — walang \"close month\", walang nabubura",
      "Walkthrough sa iyo at sa collector, sa phone, at may check-in pagkatapos ng unang buwan"
    ],
    "specs": {
      "Presyo": "₱2,499 one-time — walang buwanang bayad",
      "Platform": "Google Sheets (libre ang Google account)",
      "Gumagana sa": "Cellphone at computer — phone-first ang pagkakagawa",
      "Setup": "Done-with-you; tapos sa loob ng 1 araw pagkabigay mo ng client list",
      "Walkthrough": "30 minuto kasama ang collector — bayad, promise, bagong kabit, putol",
      "Kapasidad": "Hanggang 1,000 kliyente kada file",
      "Pagmamay-ari": "Sa iyo ang file — nasa Google Drive mo, hindi sa amin",
      "Suporta": "30 days support after setup, including a first-month check-in"
    },
    "requirements": [
      "Google account (libre)",
      "Internet connection — hindi ito gumagana offline",
      "Listahan ng kliyente mo: pangalan, area, plan, petsa ng kabit, at utang ngayon — bibigyan ka namin ng template",
      "Cellphone ng collector mo na may libreng Google Sheets app"
    ],
    "warning": null,
    "faq": [
      {
        "q": "Kaya ko naman gawin sa Sheets — bakit pa ako magbabayad?",
        "a": "Kaya nga. Ang binabayaran mo ay ang naka-set na lahat: status formulas, follow-up, putol at balik, proration, at ang script na gumagana sa phone. Isang beses lang — hindi mo na kailangang gawin, at hindi mo na kailangang ayusin tuwing may masisira."
      },
      {
        "q": "Bakit hindi na lang app?",
        "a": "Ang app ay kailangang i-install, i-update, at bayaran buwan-buwan. Ang Google Sheets ay libre, nasa phone na ng collector mo, at sa iyo ang file kahit wala na kami."
      },
      {
        "q": "Paano kung hindi ko ma-maintain?",
        "a": "Walang mine-maintain. Ang halaga lang ang tina-type ng collector — automatic na ang date, time, at status. Bagong kabit? May form. Lipat ng buwan? Dropdown. Tapos may check-in pa kami pagkatapos ng unang buwan para ayusin ang anumang kulang."
      },
      {
        "q": "Kaya ba talaga ito sa cellphone?",
        "a": "Oo, at ito ang pinakapunto nito. Ang collector ay nagta-type sa COLLECTION sheet habang nasa field — walang laptop na kailangan. Ilang segundo pagkatapos, kita mo na sa DASHBOARD ang bayad, kahit nasaan ka."
      },
      {
        "q": "Ano ang mangyayari kapag nag-disconnect ako ng kliyente?",
        "a": "Hindi siya nabubura. Naka-freeze ang utang at petsa niya sa DISCONNECTED list. Pagbalik niya, dala niya ang dating utang — o pwede mo itong i-pardon kung iyon ang pasya mo."
      },
      {
        "q": "Mawawala ba ang record ko kapag lumipat ako ng buwan?",
        "a": "Hindi. Lumipat ka ng buwan sa dropdown lang. Ang nakaraang buwan ay nasa RECORD — buo, buwan-buwan, hindi nabubura. Walang \"close month\"."
      },
      {
        "q": "Paano ang mga may lumang utang bago pa ako gumamit nito?",
        "a": "Kasama sa client list template ang utang ngayon ng bawat kliyente. Ilalagay ito bilang opening balance, kaya tuloy-tuloy ang singilan — hindi nagre-reset sa zero ang lahat."
      },
      {
        "q": "Ilang kliyente ang kaya nito?",
        "a": "Hanggang 1,000 kada file. Kung lampas ka na roon, message mo kami — may paraan, pero pag-uusapan muna natin ang setup."
      }
    ]
  },

  {
    "slug": "gds-ont-flasher",
    "name": "GDS ONT Flasher",
    "short": "Windows service utility para sa supported Huawei HG8145X6-10 units. Guided conversion workflow with built-in safety checks, status monitoring, at GPON ↔ EPON mode switching. Validated on supported R022 & R024 variants · 1 PC per license key, online activation · For devices you own or are authorized to service.",
    "category": "tool",
    "categoryLabel": "Software Tool",
    "badge": "Bagong labas",
    "featured": true,
    "price": 3499,
    "priceNote": "One-time kada PC — lifetime license, walang renewal",
    "image": "gds-ont-flasher.jpg",
    "heroImage": "gds-ont-flasher-3.jpg",
    "images": ["gds-ont-flasher-3.jpg", "gds-ont-flasher-2.jpg", "gds-ont-flasher-4.jpg"],
    "imageInfo": {
      "gds-ont-flasher-3.jpg": { "alt": "GDS ONT Flasher Windows application showing conversion controls, progress and GPON EPON options", "caption": "Conversion complete — progress stages at session log (device access details naka-mask)" },
      "gds-ont-flasher-2.jpg": { "alt": "GDS ONT Flasher main window before a conversion, showing the pre-flight notices, optical mode choice and Start conversion button", "caption": "Bago magsimula — notices, optical mode, at Start conversion" },
      "gds-ont-flasher-4.jpg": { "alt": "GDS ONT Flasher pre-flight confirmation dialog showing the detected model and firmware variant, with brand and serial censored", "caption": "Pre-flight confirmation — model at firmware variant bago magpatuloy" }
    },
    "unsureTitle": "Hindi ka sigurado?",
    "unsureLead": "Mas mabuting magtanong muna kaysa mabili ang maling bagay.",
    "unsureTail": "ng model ng unit mo.",
    "deliveryNote": "Pagka-verify ng bayad, ipapadala namin ang download link at license key via email o Messenger.",
    "summary":
      "A guided Windows service utility designed for supported Huawei HG8145X6-10 units. It automates the validated service workflow for supported R022/R024 firmware variants, with pre-flight checks, conversion status monitoring, and GPON ↔ EPON mode switching. ₱3,499 one-time · 1 PC per license key · No monthly subscription. Intended only for hardware you own or are authorized to configure, repair, or service.",
    "highlights": [
      "Guided one-click conversion workflow — pre-flight checks bago magsimula, tapos hakbang-hakbang na status habang tumatakbo",
      "Supported unit: Huawei HG8145X6-10 — validated sa R022 at R024 firmware variants sa totoong hardware",
      "Built-in pre-flight checks — tinitingnan muna ang model at firmware variant; hindi magpapatuloy kapag hindi supported",
      "Conversion progress monitoring — live na listahan ng bawat hakbang at session log",
      "GPON ↔ EPON mode switching — reversible optical changer para sa converted unit",
      "Package integrity verification — sine-check ang package bago ang bawat run",
      "Ipinapakita ang device access details pagkatapos ng conversion (web, telnet, at Wi-Fi SSID)",
      "Single .exe na may in-app na Help; online license activation, 1 PC kada key, may 14-araw na offline grace"
    ],
    "specs": {
      "Presyo": "₱3,499 one-time kada PC — lifetime, walang buwanan",
      "License": "1 PC kada key, online activation, habambuhay",
      "Sinusuportahang unit": "Huawei HG8145X6-10 (stock R022 at R024)",
      "Operating system": "Windows 10 / 11, 64-bit",
      "Format ng bigay": "Single .exe (~170 MB) — download link + license key",
      "Optical": "GPON ↔ EPON, reversible",
      "Delivery": "Download link + key via email o Messenger pagka-verify ng bayad"
    },
    "requirements": [
      "Windows 10 o 11 (64-bit) na PC o laptop",
      "LAN cable papuntang ONT — hindi pwedeng WiFi lang ang koneksyon",
      "ONT na pag-aari mo o may pahintulot ka nang i-service",
      "Internet sa PC para sa isang beses na license activation"
    ],
    "warning":
      "Para lang ito sa ONT na pag-aari mo o may pahintulot ka nang i-service. Ang pagbabago ng firmware ay may panganib na masira (brick) ang unit kapag hindi sinunod ang tamang paraan, at maaaring labag sa kasunduan mo sa iyong ISP kung naka-lease ang unit. May built-in na safety checks ang app, pero ikaw pa rin ang may responsibilidad na tiyakin na may karapatan kang baguhin ang unit bago ito gawin.",
    "useNotice": {
      "title": "Compatibility & Use Notice",
      "paragraphs": [
        "GDS ONT Flasher is intended for qualified users servicing supported hardware they own or are authorized to service.",
        "Compatibility is limited to specifically tested models and firmware variants. Firmware modification carries inherent risk and results may vary depending on hardware and firmware condition.",
        "GDS Digital Solutions is not affiliated with or endorsed by Huawei or any internet service provider. Product and company names referenced for compatibility purposes remain the property of their respective owners."
      ]
    },
    "faq": [
      {
        "q": "Anong unit ang sinusuportahan?",
        "a": "Huawei HG8145X6-10 na naka-stock firmware (R022 o R024) — parehong na-validate sa totoong hardware. Kung iba ang unit o firmware mo, message mo muna ako bago bumili at itsetsek ko kung kaya."
      },
      {
        "q": "Paano kung ma-brick ang unit?",
        "a": "May pre-flight checks ang app na hindi magpapatuloy kapag hindi supported ang unit o firmware variant, at may safety gates sa bawat hakbang. Pero ang pagbabago ng firmware ay laging may kaakibat na panganib, at maaaring mag-iba ang resulta depende sa kondisyon ng hardware at firmware — hindi kami makakapangako ng 100% recovery sa lahat ng kaso. Basahin mo ang in-app na Help bago magsimula, at kung may aberya, message mo kami at tutulungan ka namin hangga't kaya."
      },
      {
        "q": "Ilang PC ang pwede kong gamitan?",
        "a": "Isang PC kada license (online activation). Kung papalit ka ng PC o mag-format, message mo lang ako para i-transfer ang activation mo sa bagong makina — libre iyon."
      },
      {
        "q": "Kailangan ba ng internet?",
        "a": "Sa PC, oo — isang beses para sa license activation, tapos may 14-araw na offline grace kaya kaya mong gamitin kahit walang internet paminsan-minsan. Ang koneksyon sa ONT mismo ay via LAN cable, hindi internet."
      },
      {
        "q": "Kasama ba ang firmware files?",
        "a": "Kumpleto ang package — walang hiwalay na ida-download o hahanapin. May package integrity verification na sine-check ang package bago magsimula ang bawat run."
      },
      {
        "q": "Pwede bang gawing GPON o EPON?",
        "a": "Oo. May optical changer na kayang mag-set ng GPON o EPON, at reversible ito — pabalik-balik anumang oras."
      }
    ]
  },

  {
    "slug": "website-development",
    "name": "Website at Landing Page Development",
    "short": "Ginagawa kong website ang negosyo mo — hindi template, hindi drag-and-drop.",
    "category": "service",
    "categoryLabel": "Serbisyo",
    "badge": "Libreng quote",
    "featured": true,
    "price": null,
    "priceNote": "Nakadepende sa laki — libre ang quote",
    "image": "website-development.jpg",
    "images": ["website-development.jpg"],
    "unsureTitle": "Hindi ka sigurado?",
    "unsureLead": "Mas mabuting magtanong muna kaysa mabili ang maling bagay.",
    "unsureTail": "kung anong klaseng site ang kailangan mo.",
    "deliveryNote": "Pagka-verify ng unang bayad, kakausapin ka namin para sa detalye ng project at sisimulan ang disenyo.",
    "quoteOnly": true,
    "summary":
      "Gumagawa ako ng website at landing page para sa maliliit na negosyo sa Pilipinas — mula sa isang page na pangbenta hanggang sa buong catalog na may order at payment flow, katulad mismo ng site na binabasa mo ngayon. Kinakausap muna kita bago mag-disenyo; walang template na binabago lang ang kulay.",
    "highlights": [
      "Kinakausap muna kita — kailangan kong maintindihan ang negosyo mo bago mag-disenyo",
      "Gumagana sa cellphone — dito manggagaling ang karamihan ng bibisita mo",
      "May order at payment flow kung kailangan mo (GCash at bank transfer, may proof of payment)",
      "Naka-connect sa Facebook Page mo — diretso sa tamang page ang link ng post mo",
      "Tinuturuan kitang mag-update ng teksto at larawan mag-isa",
      "Sa iyo ang lahat ng files at accounts pagkatapos"
    ],
    "specs": {
      "Karaniwang tagal": "1–3 linggo depende sa laki",
      "Kasama": "Disenyo, pagbuo, hosting setup, at deployment",
      "Hosting": "Libreng hosting sa umpisa; tutulungan kitang bumili ng domain",
      "Bayad": "50% para magsimula, 50% pagkatapos i-launch",
      "Revisions": "2 round na kasama sa presyo",
      "Turnover": "Sa iyo ang lahat ng files at accounts"
    },
    "requirements": [
      "Malinaw na ideya kung ano ang gusto mong ipagawa",
      "Logo at mga larawan ng produkto — o tutulungan kitang gumawa",
      "Handang mag-usap sa Messenger o call sa umpisa",
      "May taong mag-a-update ng laman pagkatapos — tuturuan ko siya"
    ],
    "warning": null,
    "faq": [
      {
        "q": "Magkano ba talaga?",
        "a": "Nakadepende sa laki. Ang isang landing page ay malayo sa buong site na may order system. Message mo ako kung ano ang kailangan mo at bibigyan kita ng tapat na quote — libre ito at walang obligasyon."
      },
      {
        "q": "Kasama ba ang domain at hosting?",
        "a": "Kasama ang setup ng hosting, at libre ito sa umpisa. Ang domain ay bayad taon-taon sa registrar — humigit-kumulang ₱600–₱900 kada taon. Hindi ako ang naniningil nito; tutulungan lang kitang bumili at i-connect."
      },
      {
        "q": "Paano kung may gusto akong ipabago pagkatapos?",
        "a": "May 2 round ng revision na kasama. Pagkatapos noon, may bayad ang malalaking pagbabago — pero tuturuan kitang mag-update ng teksto at larawan mag-isa nang libre."
      },
      {
        "q": "Ano ang halimbawa ng nagawa mo?",
        "a": "Ang site mismong binabasa mo ngayon. Ginawa ito mula sa wala: disenyo, order form, GCash at bank payment flow na may proof of payment, at order tracking page."
      }
    ]
  }

];

window.GDS_CATEGORIES = [
  { id: "all", label: "Lahat" },
  { id: "system", label: "Business Systems" },
  { id: "tool", label: "Software Tools" },
  { id: "service", label: "Serbisyo" }
];
