/* PARE BRISE EXPRESS — scripts du site */
(function () {
  "use strict";

  /* Coordonnées utilisées par les formulaires (à modifier si besoin) */
  var CONTACT_EMAIL = "contact@parebrise-express.fr";
  var WHATSAPP_NUMBER = "33626159377"; // format international sans "+" ni espaces

  /* ---------- Aperçu d'une palette : ajouter ?palette=nom à l'adresse ---------- */
  var preview = new URLSearchParams(window.location.search).get("palette");
  if (preview) document.documentElement.setAttribute("data-palette", preview);
  var ambiance = new URLSearchParams(window.location.search).get("ambiance");
  if (ambiance) document.documentElement.setAttribute("data-ambiance", ambiance);

  /* ---------- Vidéo d'en-tête : pause si l'utilisateur préfère réduire les animations ---------- */
  var heroVideo = document.querySelector(".hero-bg");
  if (heroVideo && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroVideo.removeAttribute("autoplay");
    heroVideo.pause();
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll(".dropdown > button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dd = btn.parentElement;
      var open = dd.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".dropdown.open").forEach(function (dd) {
      if (!dd.contains(e.target) && window.innerWidth > 1180) dd.classList.remove("open");
    });
  });

  /* ---------- Apparition au défilement ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Année du pied de page ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Formulaires (devis / contact) ----------
     Le site est statique : la demande est transmise par e-mail
     (ouverture de la messagerie) ou par WhatsApp. */
  function collect(form) {
    var lines = [];
    var data = new FormData(form);
    var seen = {};
    form.querySelectorAll("[name]").forEach(function (field) {
      var name = field.name;
      if (seen[name] || name === "consentement") return;
      seen[name] = true;
      var values = data.getAll(name).filter(function (v) { return String(v).trim() !== ""; });
      if (!values.length) return;
      var label = field.getAttribute("data-label") || name;
      lines.push(label + " : " + values.join(", "));
    });
    return lines;
  }

  document.querySelectorAll("form[data-request]").forEach(function (form) {
    var subject = form.getAttribute("data-request");
    var success = form.querySelector(".form-success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var body = collect(form).join("\n");
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body + "\n\n— Envoyé depuis le site Pare Brise Express");
      if (success) success.classList.add("show");
    });

    var wa = form.querySelector("[data-whatsapp]");
    if (wa) {
      wa.addEventListener("click", function () {
        if (!form.reportValidity()) return;
        var text = subject + "\n\n" + collect(form).join("\n");
        window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank", "noopener");
        if (success) success.classList.add("show");
      });
    }
  });
})();
