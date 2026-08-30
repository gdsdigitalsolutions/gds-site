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
  { id: "service", label: "Serbisyo" }
];
