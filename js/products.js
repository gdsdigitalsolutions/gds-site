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
    "images": ["bayadtrack.jpg", "bayadtrack-flow.jpg", "bayadtrack-steps.jpg", "bayadtrack-features.jpg"],
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
      "Suporta": "Check-in pagkatapos ng unang buwan; aayusin natin kung may kulang"
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
    "short": "One-click na pag-convert ng Huawei HG8145X6-10 mula ISP-locked patungong open (COMMON) firmware — automatic, brick-safe, may GPON at EPON changer.",
    "category": "tool",
    "categoryLabel": "Software Tool",
    "badge": "Bagong labas",
    "featured": true,
    "price": 3500,
    "priceNote": "One-time kada PC — lifetime license, walang renewal",
    "image": "gds-ont-flasher.jpg",
    "images": ["gds-ont-flasher.jpg"],
    "summary":
      "Windows app na kumo-convert ng Huawei HG8145X6-10 ONT mula sa ISP-locked na firmware patungong open (COMMON “blue”) firmware — halos isang pindot lang. Awtomatiko ang buong proseso: nilo-login, binubuksan ang access, ina-upload ang firmware, at nire-restore ang credentials — LAN cable lang ang kailangan, walang serial box o hardware programmer. May built-in na safety checks na tumatanggi sa unit na hindi eligible bago pa magsimula, kaya brick-safe. Para lang ito sa unit na pag-aari mo o may pahintulot kang i-service.",
    "highlights": [
      "One-click conversion — automatic mula sa pag-detect hanggang tapos, minimal na pindot",
      "Brick-safe: may pre-flight check na tumatanggi sa hindi eligible na unit bago magsimula",
      "Optical GPON ↔ EPON changer — reversible, pabalik-balik anumang oras",
      "Sinusuportahan ang R022 at R024 na stock firmware — parehong na-validate sa totoong hardware",
      "Ipinapakita ang bagong login credentials (web, telnet, at Wi-Fi) pagkatapos ng conversion",
      "Kasama na ang lahat ng firmware sa loob ng app — walang hiwalay na hahanapin",
      "Single .exe — walang i-install, buksan lang; may in-app na Help",
      "Online license activation na may 14-araw na offline grace"
    ],
    "specs": {
      "Presyo": "₱3,500 one-time kada PC — lifetime, walang buwanan",
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
    "faq": [
      {
        "q": "Anong unit ang sinusuportahan?",
        "a": "Huawei HG8145X6-10 na naka-stock firmware (R022 o R024) — parehong na-validate sa totoong hardware. Kung iba ang unit o firmware mo, message mo muna ako bago bumili at itsetsek ko kung kaya."
      },
      {
        "q": "Paano kung ma-brick ang unit?",
        "a": "May pre-flight check ang app na tumatanggi sa hindi eligible na unit bago pa magsimula, at may safety gates sa bawat hakbang — kaya nga brick-safe ang tawag dito. Na-validate na ito sa maraming totoong unit. Basahin mo ang in-app na Help bago magsimula, at kung may aberya, message mo ako at tutulungan kita — pero digital-at-hardware ang usapan, kaya hindi ako pwedeng mangako ng 100% recovery sa lahat ng kaso."
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
        "a": "Oo — nasa loob na mismo ng app ang lahat ng firmware na kailangan. Walang hiwalay na hahanapin o ida-download."
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
