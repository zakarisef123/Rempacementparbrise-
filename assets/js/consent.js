/* ==========================================================
   PARE BRISE EXPRESS — gestion du consentement (cookies / traceurs)
   Conforme RGPD + recommandations CNIL + Google Consent Mode v2.

   - Aucun traceur ni contenu tiers n'est chargé avant le consentement.
   - « Tout refuser » est aussi simple que « Tout accepter ».
   - Aucune case pré-cochée ; le choix est conservé 6 mois puis redemandé.
   - Les signaux Consent Mode v2 (ad_storage, ad_user_data,
     ad_personalization, analytics_storage) sont envoyés à Google.

   ► Pour activer Google Analytics 4, Google Ads ou Google Tag Manager,
     renseignez simplement l'identifiant ci-dessous : la catégorie
     correspondante apparaît alors automatiquement dans le bandeau.
   ========================================================== */
(function () {
  "use strict";

  var CONFIG = {
    ga4Id: "",        // ex. "G-XXXXXXXXXX"  (Google Analytics 4)
    adsId: "",        // ex. "AW-XXXXXXXXXX" (Google Ads)
    gtmId: "",        // ex. "GTM-XXXXXXX"   (Google Tag Manager)
    maxAgeDays: 182,  // durée de conservation du choix : 6 mois (CNIL)
    storageKey: "pbe-consent",
    policyUrl: "cookies.html"
  };

  var CATEGORIES = [
    {
      id: "analytics", enabled: !!(CONFIG.ga4Id || CONFIG.gtmId),
      title: "Mesure d'audience",
      text: "Nous aide à comprendre comment le site est utilisé (pages vues, provenance) afin de l'améliorer. Service : Google Analytics."
    },
    {
      id: "ads", enabled: !!(CONFIG.adsId || CONFIG.gtmId),
      title: "Publicité",
      text: "Permet de mesurer l'efficacité de nos annonces et de vous proposer des publicités adaptées. Service : Google Ads."
    },
    {
      id: "external", enabled: true,
      title: "Contenus externes (cartes)",
      text: "Affiche la carte Google Maps du garage. Google peut déposer des cookies et recevoir votre adresse IP."
    }
  ];
  var ACTIVE = CATEGORIES.filter(function (c) { return c.enabled; });
  // Si les catégories changent (ex. ajout de Google Analytics), le consentement est redemandé.
  var VERSION = "2:" + ACTIVE.map(function (c) { return c.id; }).join(",");

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (typeof window.gtag !== "function") window.gtag = gtag;

  /* ---------- Lecture / écriture du choix ---------- */
  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(CONFIG.storageKey));
      if (!c || c.v !== VERSION) return null;
      if (Date.now() - c.date > CONFIG.maxAgeDays * 864e5) return null;
      return c;
    } catch (e) { return null; }
  }
  function save(choices) {
    var c = { v: VERSION, date: Date.now(), choices: choices };
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(c)); } catch (e) {}
    current = c;
    apply(choices);
  }

  /* ---------- Application du choix ---------- */
  var googleLoaded = false;
  function apply(ch) {
    window.gtag("consent", "update", {
      analytics_storage: ch.analytics ? "granted" : "denied",
      ad_storage: ch.ads ? "granted" : "denied",
      ad_user_data: ch.ads ? "granted" : "denied",
      ad_personalization: ch.ads ? "granted" : "denied"
    });
    window.dataLayer.push({ event: "consent_update", consent: ch });
    if ((ch.analytics || ch.ads) && !googleLoaded) loadGoogle();
    if (ch.external) loadEmbeds();
  }

  function addScript(src) {
    var s = document.createElement("script");
    s.async = true; s.src = src;
    document.head.appendChild(s);
  }
  // Mode « basique » : les balises Google ne sont chargées qu'après consentement.
  function loadGoogle() {
    googleLoaded = true;
    if (CONFIG.gtmId) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      addScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(CONFIG.gtmId));
      return;
    }
    var ids = [CONFIG.ga4Id, CONFIG.adsId].filter(Boolean);
    if (!ids.length) return;
    addScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ids[0]));
    window.gtag("js", new Date());
    ids.forEach(function (id) { window.gtag("config", id); });
  }

  /* ---------- Contenus externes (cartes) chargés à la demande ---------- */
  function loadEmbeds() {
    document.querySelectorAll(".ext-embed[data-src]").forEach(function (box) {
      if (box.querySelector("iframe")) return;
      var f = document.createElement("iframe");
      f.src = box.getAttribute("data-src");
      f.title = box.getAttribute("data-title") || "Carte";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      box.innerHTML = "";
      box.appendChild(f);
      box.classList.add("is-loaded");
    });
  }

  /* ---------- Interface ---------- */
  function esc(t) { return String(t).replace(/[&<>"]/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]; }); }

  var banner, modal, lastFocus, current = read();

  function allChoices(value) {
    var c = {};
    CATEGORIES.forEach(function (cat) { c[cat.id] = cat.enabled ? value : false; });
    return c;
  }

  function buildBanner() {
    banner = document.createElement("div");
    banner.className = "cmp-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-labelledby", "cmp-title");
    banner.setAttribute("aria-describedby", "cmp-desc");
    banner.innerHTML =
      '<button class="cmp-close" type="button" data-cmp="refuse">Continuer sans accepter <span aria-hidden="true">✕</span></button>' +
      '<p class="cmp-title" id="cmp-title">Vos choix concernant les cookies</p>' +
      '<p class="cmp-desc" id="cmp-desc">Avec votre accord, nous utilisons des cookies et des services tiers pour : ' +
      esc(ACTIVE.map(function (c) { return c.title.toLowerCase(); }).join(", ")) +
      '. Vous pouvez accepter, refuser ou personnaliser vos choix, et les modifier à tout moment via le lien « Gérer les cookies » en bas de page. ' +
      '<a href="' + CONFIG.policyUrl + '">En savoir plus</a></p>' +
      '<div class="cmp-actions">' +
      '<button class="cmp-btn" type="button" data-cmp="refuse">Tout refuser</button>' +
      '<button class="cmp-btn cmp-btn--ghost" type="button" data-cmp="customize">Personnaliser</button>' +
      '<button class="cmp-btn" type="button" data-cmp="accept">Tout accepter</button>' +
      "</div>";
    document.body.appendChild(banner);
  }

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "cmp-modal";
    modal.hidden = true;
    var rows = ACTIVE.map(function (c) {
      return '<div class="cmp-cat"><div class="cmp-cat-head"><label class="cmp-cat-title" for="cmp-' + c.id + '">' + esc(c.title) + "</label>" +
        '<span class="cmp-switch"><input type="checkbox" role="switch" id="cmp-' + c.id + '" data-cat="' + c.id + '"><span aria-hidden="true"></span></span></div>' +
        '<p>' + esc(c.text) + "</p></div>";
    }).join("");
    modal.innerHTML =
      '<div class="cmp-dialog" role="dialog" aria-modal="true" aria-labelledby="cmp-m-title" tabindex="-1">' +
      '<button class="cmp-x" type="button" data-cmp="close" aria-label="Fermer">✕</button>' +
      '<p class="cmp-title" id="cmp-m-title">Paramètres des cookies</p>' +
      '<p class="cmp-desc">Choisissez les catégories que vous acceptez. Vous pouvez modifier votre choix à tout moment. <a href="' + CONFIG.policyUrl + '">Politique de cookies</a></p>' +
      '<div class="cmp-cat"><div class="cmp-cat-head"><span class="cmp-cat-title">Strictement nécessaires</span><span class="cmp-always">Toujours actifs</span></div>' +
      "<p>Indispensables au fonctionnement du site, par exemple pour mémoriser vos choix en matière de cookies. Ils ne nécessitent pas votre consentement.</p></div>" +
      rows +
      '<div class="cmp-actions">' +
      '<button class="cmp-btn" type="button" data-cmp="refuse">Tout refuser</button>' +
      '<button class="cmp-btn" type="button" data-cmp="accept">Tout accepter</button>' +
      '<button class="cmp-btn cmp-btn--ghost" type="button" data-cmp="save">Enregistrer mes choix</button>' +
      "</div></div>";
    document.body.appendChild(modal);
  }

  function showBanner() { if (!banner) buildBanner(); banner.hidden = false; document.body.classList.add("cmp-open"); }
  function hideBanner() { if (banner) banner.hidden = true; document.body.classList.remove("cmp-open"); }

  function openModal() {
    if (!modal) buildModal();
    var ch = (current && current.choices) || {};
    modal.querySelectorAll("input[data-cat]").forEach(function (i) { i.checked = !!ch[i.getAttribute("data-cat")]; });
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.documentElement.classList.add("cmp-lock");
    modal.querySelector(".cmp-dialog").focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.documentElement.classList.remove("cmp-lock");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function decide(choices) { save(choices); hideBanner(); closeModal(); showStatus(); }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-cmp], [data-consent-open], .ext-load");
    if (!t) return;
    if (t.hasAttribute("data-consent-open")) { e.preventDefault(); openModal(); return; }
    if (t.classList.contains("ext-load")) {
      var ch = (current && current.choices) ? JSON.parse(JSON.stringify(current.choices)) : allChoices(false);
      ch.external = true;
      decide(ch);
      return;
    }
    var a = t.getAttribute("data-cmp");
    if (a === "accept") decide(allChoices(true));
    else if (a === "refuse") decide(allChoices(false));
    else if (a === "customize") openModal();
    else if (a === "close") closeModal();
    else if (a === "save") {
      var c = allChoices(false);
      modal.querySelectorAll("input[data-cat]").forEach(function (i) { c[i.getAttribute("data-cat")] = i.checked; });
      decide(c);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
    if (e.key === "Tab" && modal && !modal.hidden) {   // garder le focus dans la fenêtre
      var f = modal.querySelectorAll("button, a, input");
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Démarrage ---------- */
  if (current) apply(current.choices);
  else showBanner();

  // Affichage de l'état actuel sur la page « Cookies »
  function showStatus() {
    var status = document.querySelector("[data-consent-status]");
    if (!status) return;
    status.textContent = current
      ? "Votre choix actuel : " + ACTIVE.map(function (c) { return c.title + " — " + (current.choices[c.id] ? "accepté" : "refusé"); }).join(" · ") +
        " (enregistré le " + new Date(current.date).toLocaleDateString("fr-FR") + ")."
      : "Vous n'avez pas encore fait de choix.";
  }
  showStatus();
})();
