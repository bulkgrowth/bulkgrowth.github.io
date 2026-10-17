/* Bulk Growth language switcher.
   The site is written in English; other languages are machine-translated in the
   visitor's browser by Google Translate. The choice is kept in the "googtrans" cookie. */
(function () {
  var LANGS = [
    ["en", "English", "English"], ["ar", "العربية", "Arabic"], ["fr", "Français", "French"], ["es", "Español", "Spanish"],
    ["de", "Deutsch", "German"], ["it", "Italiano", "Italian"], ["pt", "Português", "Portuguese"], ["tr", "Türkçe", "Turkish"],
    ["ru", "Русский", "Russian"], ["uk", "Українська", "Ukrainian"], ["pl", "Polski", "Polish"], ["nl", "Nederlands", "Dutch"],
    ["sv", "Svenska", "Swedish"], ["no", "Norsk", "Norwegian"], ["da", "Dansk", "Danish"], ["fi", "Suomi", "Finnish"],
    ["el", "Ελληνικά", "Greek"], ["ro", "Română", "Romanian"], ["cs", "Čeština", "Czech"], ["hu", "Magyar", "Hungarian"],
    ["bg", "Български", "Bulgarian"], ["sr", "Српски", "Serbian"], ["hr", "Hrvatski", "Croatian"], ["iw", "עברית", "Hebrew"],
    ["fa", "فارسی", "Persian"], ["ur", "اردو", "Urdu"], ["hi", "हिन्दी", "Hindi"], ["bn", "বাংলা", "Bengali"],
    ["ta", "தமிழ்", "Tamil"], ["ml", "മലയാളം", "Malayalam"], ["zh-CN", "简体中文", "Chinese (Simplified)"], ["zh-TW", "繁體中文", "Chinese (Traditional)"],
    ["ja", "日本語", "Japanese"], ["ko", "한국어", "Korean"], ["id", "Bahasa Indonesia", "Indonesian"], ["ms", "Bahasa Melayu", "Malay"],
    ["th", "ไทย", "Thai"], ["vi", "Tiếng Việt", "Vietnamese"], ["tl", "Filipino", "Filipino"], ["sw", "Kiswahili", "Swahili"],
    ["am", "አማርኛ", "Amharic"], ["so", "Soomaali", "Somali"], ["ha", "Hausa", "Hausa"], ["af", "Afrikaans", "Afrikaans"],
    ["az", "Azərbaycan", "Azerbaijani"], ["kk", "Қазақ", "Kazakh"], ["uz", "Oʻzbek", "Uzbek"], ["ku", "Kurdî", "Kurdish"]
  ];
  var RTL = { ar: 1, fa: 1, ur: 1, iw: 1, ku: 0 };

  function current() {
    var m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "en";
  }
  function setCookie(v) {
    var host = location.hostname, exp = v ? "" : ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
    var val = v ? "/en/" + v : "";
    document.cookie = "googtrans=" + val + ";path=/" + exp;
    if (host.indexOf(".") > 0) document.cookie = "googtrans=" + val + ";path=/;domain=" + host + exp;
  }
  function choose(code) {
    try { (window.dataLayer = window.dataLayer || []).push({ event: "language_change", language: code }); } catch (e) {}
    setCookie(code === "en" ? "" : code);
    try { sessionStorage.removeItem("bg_tr_fallback"); } catch (e) {}
    location.reload();
  }

  var lang = current();
  var meta = LANGS.filter(function (l) { return l[0] === lang; })[0] || [lang, lang, lang];

  /* ---------- UI ---------- */
  var slot = document.querySelector("[data-lang-slot]");
  if (slot) {
    slot.innerHTML =
      '<button type="button" class="lang-btn notranslate" aria-haspopup="dialog" aria-expanded="false" aria-label="Change language">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.8 3.9 6 3.9 9.5S14.6 18.7 12 21.5M12 2.5C9.4 5.3 8.1 8.5 8.1 12s1.3 6.7 3.9 9.5"/></svg>' +
      '<span>' + (lang === "en" ? "EN" : lang.toUpperCase().slice(0, 5)) + '</span></button>' +
      '<div class="lang-panel notranslate" role="dialog" aria-label="Choose a language" hidden>' +
      '<div class="lang-head"><b>Choose your language</b><button type="button" class="lang-x" aria-label="Close">×</button></div>' +
      '<input type="search" class="lang-q" placeholder="Search language… / ابحث عن لغة" aria-label="Search language">' +
      '<ul class="lang-list"></ul>' +
      '<p class="lang-note">Translated automatically by Google. The original English version is the reference.</p></div>';
    var btn = slot.querySelector(".lang-btn"), panel = slot.querySelector(".lang-panel"),
        list = slot.querySelector(".lang-list"), q = slot.querySelector(".lang-q");
    list.innerHTML = LANGS.map(function (l) {
      return '<li><button type="button" data-code="' + l[0] + '" data-k="' + (l[1] + " " + l[2] + " " + l[0]).toLowerCase() + '"' +
        (l[0] === lang ? ' class="on" aria-current="true"' : "") + ' lang="' + l[0] + '"><b>' + l[1] + '</b><small>' + l[2] + "</small></button></li>";
    }).join("");
    function open(o) {
      panel.hidden = !o; btn.setAttribute("aria-expanded", o);
      if (o) { q.value = ""; filter(); setTimeout(function () { q.focus(); }, 30); }
    }
    function filter() {
      var v = q.value.trim().toLowerCase();
      list.querySelectorAll("button").forEach(function (b) { b.parentNode.hidden = v && b.dataset.k.indexOf(v) < 0; });
    }
    btn.addEventListener("click", function (e) { e.stopPropagation(); open(panel.hidden); });
    slot.querySelector(".lang-x").addEventListener("click", function () { open(false); });
    q.addEventListener("input", filter);
    list.addEventListener("click", function (e) { var b = e.target.closest("button[data-code]"); if (b) choose(b.dataset.code); });
    document.addEventListener("click", function (e) { if (!panel.hidden && !slot.contains(e.target)) open(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); } });
  }

  if (lang === "en") return;

  /* ---------- translate ---------- */
  document.documentElement.setAttribute("lang", lang);
  if (RTL[lang]) document.documentElement.setAttribute("dir", "rtl");
  var holder = document.createElement("div");
  holder.id = "google_translate_element"; holder.style.display = "none";
  document.body.appendChild(holder);
  window.bgTranslateInit = function () {
    try { new google.translate.TranslateElement({ pageLanguage: "en", autoDisplay: false }, "google_translate_element"); } catch (e) {}
  };
  function fallback() {
    // If the in-page translator can't run, open Google's hosted translation of this page instead (once per visit).
    try { if (sessionStorage.getItem("bg_tr_fallback")) return; sessionStorage.setItem("bg_tr_fallback", "1"); } catch (e) {}
    var host = location.hostname.replace(/-/g, "--").replace(/\./g, "-");
    location.href = "https://" + host + ".translate.goog" + location.pathname + "?_x_tr_sl=en&_x_tr_tl=" + encodeURIComponent(lang) + "&_x_tr_hl=" + encodeURIComponent(lang) + location.hash;
  }
  var s = document.createElement("script");
  s.src = "https://translate.google.com/translate_a/element.js?cb=bgTranslateInit";
  s.async = true; s.onerror = fallback;
  document.head.appendChild(s);
  setTimeout(function () {
    var c = document.documentElement.className;
    if (c.indexOf("translated-") < 0) fallback();
  }, 9000);
})();
