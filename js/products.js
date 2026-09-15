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
    "short": "Alam mo agad kung sino ang bayad na at sino ang may utang. Payment tracker para sa internet reseller — Google Sheets lang, gumagana sa phone, real-time.",
    "category": "system",
    "categoryLabel": "Business System",
    "badge": "Available na",
    "featured": true,
    "price": 2499,
    "priceNote": "One-time payment. Walang monthly. Sa iyo ang file.",
    "image": "bayadtrack.jpg",
    "heroImage": "bayadtrack-dashboard.jpg",
    "images": ["bayadtrack-dashboard.jpg", "bayadtrack-tracker.jpg", "bayadtrack-collection.jpg", "bayadtrack-followup.jpg"],
    "imageInfo": {
      "bayadtrack-dashboard.jpg":  { "alt": "BayadTrack dashboard showing overdue clients, collections and follow-up summary using fictional demo data", "caption": "Dashboard — makikita agad kung sino ang may utang at magkano (demo · fictional data)" },
      "bayadtrack-tracker.jpg":    { "alt": "BayadTrack client tracker showing payment status and balances using fictional demo data", "caption": "Tracker — isang view ng status ng lahat ng clients (demo · fictional data)" },
      "bayadtrack-collection.jpg": { "alt": "BayadTrack collection sheet showing monthly client payment recording using fictional demo data", "caption": "Collection — mabilis na pag-record ng bayad (demo · fictional data)" },
      "bayadtrack-followup.jpg":   { "alt": "BayadTrack follow-up list showing clients with overdue balances using fictional demo data", "caption": "Follow Up — automatic na listahan ng kailangang singilin (demo · fictional data)" }
    },
    "ctaLabel": "Get BayadTrack — ₱2,499",
    "ctaSecondary": "Magtanong muna",
    "unsureTitle": "Hindi ka sigurado kung bagay ang BayadTrack sa negosyo mo?",
    "unsureLead": "",
    "unsureTail": "at sabihin kung ilan ang clients mo at paano ka nangongolekta ngayon.",
    "deliveryNote": "Pagka-verify ng payment, iko-coordinate namin ang client-list import, Google Drive setup, at walkthrough ng BayadTrack.",
    "summary":
      "Para sa mga nangongolekta ng buwanang bayad — internet reseller, kapitbahay-net, coop, o kahit anong negosyong may listahan ng sinisingil. Tina-type lang ng collector ang bayad sa phone habang nasa field; sa loob ng ilang segundo, updated na ang dashboard mo — magkano ang nakolekta ngayong araw, sino pa ang may utang, at sino ang dapat i-follow up. Walang tawagan, walang \"i-send ko mamaya.\" Hindi ito problema ng sipag — problema ito ng sistema, at iyon ang inaayos ng BayadTrack.",
    "highlights": [
      "Done-with-you setup ng file at script — kasama ka sa buong proseso, hindi ka iiwan",
      "Import ng buong client list mo — ikaw ang magfi-fill ng template, kami ang mag-i-import",
      "Dashboard, follow-up list, disconnected list, at buwanang record",
      "Automatic ang status — PAID, PARTIAL, UNPAID, OVERDUE. Halaga lang ang tina-type",
      "Ang \"promise Sept 5\" sa remarks ay awtomatikong nagiging follow-up date",
      "Putol pero may record — pagbalik ng kliyente, dala pa rin niya ang utang; pwede ring i-pardon",
      "Discount at advance — may downtime? Naka-record na may dahilan. May advance? Naka-credit sa susunod na buwan",
      "Bagong kabit sa phone — ADD CLIENT form na may automatic na prorated na unang bill",
      "Lumipat ng buwan sa dropdown lang — walang \"close month,\" walang nabubura",
      "Walkthrough para sa iyo at sa collector mo, sa phone, at may check-in pagkatapos ng unang buwan"
    ],
    "specs": {
      "Presyo": "₱2,499 one-time — walang monthly",
      "Platform": "Google Sheets (libre ang Google account)",
      "Gumagana sa": "Cellphone at computer — phone-first ang disenyo",
      "Setup": "Done-with-you; tapos sa loob ng 1 araw pagkabigay mo ng client list",
      "Walkthrough": "30 minuto, kasama ang collector — bayad, promise, bagong kabit, putol",
      "Kapasidad": "Hanggang 1,000 kliyente kada file",
      "Pagmamay-ari": "Sa iyo ang file — nasa Google Drive mo, hindi sa amin",
      "Suporta": "30 days support after setup, including a first-month check-in"
    },
    "requirements": [
      "Google account (libre)",
      "Internet connection — hindi ito gumagana offline",
      "Listahan ng kliyente mo: pangalan, area, plan, petsa ng kabit, at kasalukuyang utang — bibigyan ka namin ng template",
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
        "a": "Walang mine-maintain. Halaga lang ang tina-type ng collector — automatic na ang date, time, at status. Bagong kabit? May form. Lipat ng buwan? Dropdown. Tapos may check-in pa kami pagkatapos ng unang buwan para ayusin ang anumang kulang."
      },
      {
        "q": "Kaya ba talaga ito sa cellphone?",
        "a": "Oo — ito mismo ang punto nito. Nagta-type ang collector sa COLLECTION sheet habang nasa field, walang laptop na kailangan. Ilang segundo pagkatapos, kita mo na sa DASHBOARD ang bayad, kahit nasaan ka."
      },
      {
        "q": "Ano ang mangyayari kapag nag-disconnect ako ng kliyente?",
        "a": "Hindi siya nabubura. Naka-freeze ang utang at petsa niya sa DISCONNECTED list. Pagbalik niya, dala niya ang dating utang — o pwede mo itong i-pardon kung iyon ang desisyon mo."
      },
      {
        "q": "Mawawala ba ang record ko kapag lumipat ako ng buwan?",
        "a": "Hindi. Lumipat ka lang ng buwan sa dropdown. Ang nakaraang buwan ay nasa RECORD — buo, buwan-buwan, hindi nabubura. Walang \"close month.\""
      },
      {
        "q": "Paano ang mga may lumang utang bago pa ako gumamit nito?",
        "a": "Kasama sa client list template ang kasalukuyang utang ng bawat kliyente. Ilalagay ito bilang opening balance, kaya tuloy-tuloy ang singilan — hindi nagre-reset sa zero ang lahat."
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
    "short": "Windows service utility para sa supported Huawei HG8145X6-10 units — guided conversion workflow na may built-in safety checks, status monitoring, at GPON ↔ EPON mode switching. Validated sa R022 at R024 variants · 1 PC kada license key, online activation · Para sa unit na pag-aari mo o may pahintulot kang i-service.",
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
      "gds-ont-flasher-3.jpg": { "alt": "GDS ONT Flasher Windows application showing conversion controls, progress and GPON EPON options", "caption": "Tapos ang conversion — progress stages at session log (naka-mask ang device access details)" },
      "gds-ont-flasher-2.jpg": { "alt": "GDS ONT Flasher main window before a conversion, showing the pre-flight notices, optical mode choice and Start conversion button", "caption": "Bago magsimula — notices, optical mode, at Start conversion" },
      "gds-ont-flasher-4.jpg": { "alt": "GDS ONT Flasher pre-flight confirmation dialog showing the detected model and firmware variant, with brand and serial censored", "caption": "Pre-flight confirmation — model at firmware variant bago magpatuloy" }
    },
    "unsureTitle": "Hindi ka sigurado?",
    "unsureLead": "Mas mabuting magtanong muna kaysa mabili ang maling produkto.",
    "unsureTail": "ng model at firmware ng unit mo.",
    "deliveryNote": "Pagka-verify ng bayad, ipapadala namin ang download link at license key via email o Messenger.",
    "summary":
      "Guided Windows service utility para sa supported Huawei HG8145X6-10 units. Ina-automate nito ang validated service workflow para sa supported R022/R024 firmware variants — may pre-flight checks, conversion status monitoring, at GPON ↔ EPON mode switching. ₱3,499 one-time · 1 PC kada license key · walang monthly subscription. Para lang sa hardware na pag-aari mo o may pahintulot kang i-configure, i-repair, o i-service.",
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
      "Presyo": "₱3,499 one-time kada PC — lifetime, walang monthly",
      "License": "1 PC kada key, online activation, lifetime",
      "Sinusuportahang unit": "Huawei HG8145X6-10 (stock R022 at R024)",
      "Operating system": "Windows 10 / 11, 64-bit",
      "Format ng bigay": "Single .exe (~170 MB) — download link + license key",
      "Optical": "GPON ↔ EPON, reversible",
      "Delivery": "Download link + key via email o Messenger pagka-verify ng bayad"
    },
    "requirements": [
      "Windows 10 o 11 (64-bit) na PC o laptop",
      "LAN cable papunta sa ONT — hindi sapat ang Wi-Fi",
      "ONT na pag-aari mo o may pahintulot kang i-service",
      "Internet sa PC para sa isang beses na license activation"
    ],
    "warning":
      "Para lang ito sa ONT na pag-aari mo o may pahintulot kang i-service. Ang pagbabago ng firmware ay laging may kaakibat na panganib — maaaring masira (brick) ang unit kapag hindi sinunod ang tamang proseso — at maaaring labag sa kasunduan mo sa iyong service provider kung naka-lease ang unit. May built-in safety checks ang app, pero ikaw pa rin ang may responsibilidad na tiyaking may karapatan kang baguhin ang unit bago ito gawin.",
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
        "a": "Huawei HG8145X6-10 na naka-stock firmware (R022 o R024) — parehong na-validate sa totoong hardware. Kung iba ang unit o firmware mo, message mo muna kami bago bumili at titingnan namin kung supported."
      },
      {
        "q": "Paano kung ma-brick ang unit?",
        "a": "May pre-flight checks ang app na hindi magpapatuloy kapag hindi supported ang unit o firmware variant, at may safety gates sa bawat hakbang. Pero ang pagbabago ng firmware ay laging may kaakibat na panganib, at maaaring mag-iba ang resulta depende sa kondisyon ng hardware at firmware — hindi kami makakapangako ng 100% recovery sa lahat ng kaso. Basahin ang in-app na Help bago magsimula; kung may aberya, message mo kami at tutulungan ka namin hangga't kaya."
      },
      {
        "q": "Ilang PC ang pwede kong gamitan?",
        "a": "Isang PC kada license (online activation). Kung papalit ka ng PC o mag-fo-format, message mo lang kami para mailipat ang activation mo sa bagong makina — libre ito."
      },
      {
        "q": "Kailangan ba ng internet?",
        "a": "Sa PC, oo — isang beses para sa license activation, tapos may 14-araw na offline grace kaya magagamit mo ito kahit walang internet paminsan-minsan. Ang koneksyon sa ONT mismo ay via LAN cable, hindi internet."
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
    "short": "Gagawan namin ng website ang negosyo mo — hindi template, hindi drag-and-drop.",
    "category": "service",
    "categoryLabel": "Serbisyo",
    "badge": "Libreng quote",
    "featured": true,
    "price": null,
    "priceNote": "Nakadepende sa laki — libre ang quote",
    "image": "website-development.jpg",
    "images": ["website-development.jpg"],
    "unsureTitle": "Hindi ka sigurado?",
    "unsureLead": "Mas mabuting magtanong muna kaysa mabili ang maling serbisyo.",
    "unsureTail": "kung anong klaseng site ang kailangan mo.",
    "deliveryNote": "Pagka-verify ng unang bayad, kakausapin ka namin para sa detalye ng project at sisimulan ang disenyo.",
    "quoteOnly": true,
    "summary":
      "Gumagawa kami ng website at landing page para sa maliliit na negosyo sa Pilipinas — mula sa isang page na pang-benta hanggang sa buong catalog na may order at payment flow, katulad mismo ng site na binabasa mo ngayon. Kinakausap ka muna namin bago mag-disenyo; walang template na kulay lang ang pinalitan.",
    "highlights": [
      "Kinakausap ka muna namin — kailangan naming maintindihan ang negosyo mo bago mag-disenyo",
      "Gumagana sa cellphone — dito manggagaling ang karamihan ng bisita mo",
      "May order at payment flow kung kailangan mo (GCash at bank transfer, may proof of payment)",
      "Naka-connect sa Facebook Page mo — diretso sa tamang page ang link ng post mo",
      "Tuturuan ka naming mag-update ng teksto at larawan mag-isa",
      "Sa iyo ang lahat ng files at accounts pagkatapos"
    ],
    "specs": {
      "Karaniwang tagal": "1–3 linggo, depende sa laki",
      "Kasama": "Disenyo, pagbuo, hosting setup, at deployment",
      "Hosting": "Libreng hosting sa umpisa; tutulungan ka naming bumili ng domain",
      "Bayad": "50% para magsimula, 50% pagkatapos i-launch",
      "Revisions": "2 rounds, kasama sa presyo",
      "Turnover": "Sa iyo ang lahat ng files at accounts"
    },
    "requirements": [
      "Malinaw na ideya kung ano ang gusto mong ipagawa",
      "Logo at mga larawan ng produkto — o tutulungan ka naming gumawa",
      "Handang mag-usap sa Messenger o call sa umpisa",
      "May taong mag-a-update ng laman pagkatapos — tuturuan namin siya"
    ],
    "warning": null,
    "faq": [
      {
        "q": "Magkano ba talaga?",
        "a": "Nakadepende sa laki. Malayo ang isang landing page sa buong site na may order system. Message mo kami kung ano ang kailangan mo at bibigyan ka namin ng tapat na quote — libre ito at walang obligasyon."
      },
      {
        "q": "Kasama ba ang domain at hosting?",
        "a": "Kasama ang setup ng hosting, at libre ito sa umpisa. Ang domain ay binabayaran taon-taon sa registrar — humigit-kumulang ₱600–₱900 kada taon. Hindi kami ang naniningil nito; tutulungan ka lang naming bumili at i-connect."
      },
      {
        "q": "Paano kung may gusto akong ipabago pagkatapos?",
        "a": "May 2 rounds ng revision na kasama. Pagkatapos noon, may bayad ang malalaking pagbabago — pero tuturuan ka naming mag-update ng teksto at larawan mag-isa, libre."
      },
      {
        "q": "Ano ang halimbawa ng nagawa ninyo?",
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
