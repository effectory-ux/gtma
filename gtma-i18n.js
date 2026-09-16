/* ── One language for the whole prototype ────────────────────────────────────
   The Your voice dashboards are drawn by effectiveness.js and translated by the
   design system's i18n.js. Every other screen here writes its own markup, so it
   brings its own strings (gtma-strings.js) and leans on the design system's map
   for everything the two share: the sidebar, the breadcrumb, the buttons, the
   action planner. Same storage key as the dashboard, effx-lang, so the language
   you pick in one place follows you through the whole demo.

   These screens render as you click: dialogs, side panels, list rows, wizard
   rails. Rather than hunting down every render path, this walks the page once
   and then keeps watching it, so anything drawn later is translated too. */
(function () {
  var KEY = 'effx-lang';
  var LANGS = [['en', 'English'], ['nl', 'Nederlands'], ['de', 'Deutsch']];
  var lang = 'en';
  try { lang = localStorage.getItem(KEY) || 'en'; } catch (e) {}
  /* The dashboard's own picker swaps languages without a reload: it sets
     window.LANG and re-renders. Read that whenever it is there, so this layer
     never lags a language behind. */
  function cur() { return window.LANG || lang; }

  var MONTHS = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
    de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  };
  var MONTHS_FULL = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    nl: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  };
  var DAYS = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    nl: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
    de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  };

  /* Dates are swapped word for word, the way the dashboard's locDate does it:
     the month and the weekday change language, the order stays as it was. */
  function localizeDates(s) {
    var lang = cur();
    if (lang === 'en') return s;
    var out = s;
    out = out.replace(/\b([A-Z][a-z]{2,8})\b/g, function (m) {
      var i = MONTHS_FULL.en.indexOf(m); if (i > -1) return MONTHS_FULL[lang][i];
      i = MONTHS.en.indexOf(m); if (i > -1) return MONTHS[lang][i];
      i = DAYS.en.indexOf(m); if (i > -1) return DAYS[lang][i];
      return m;
    });
    return out;
  }
  window.gtmaDate = localizeDates;
  var DATE_RE = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b|\b(January|February|March|April|June|July|August|September|October|November|December)\b/;

  function fill(tpl, m) {
    return tpl.replace(/\$(\d)/g, function (_, i) { return m[Number(i)]; });
  }

  /* The one lookup everything goes through: this prototype's own map first, then
     the patterns, then dates, then the design system's map, then English. */
  function t(s) {
    var lang = cur();
    if (lang === 'en' || s == null) return s;
    /* A page may read a word differently than the rest of the prototype does:
       Response is the planner's column on the scan, and the response rate on the
       survey page. Page overrides win over the shared map. */
    var page = location.pathname.split('/').pop();
    var over = (window.GTMA_PAGE_STRINGS || {})[page];
    var e = over && over[s];
    if (e && e[lang]) return e[lang];
    e = (window.GTMA_STRINGS || {})[s];
    if (e && e[lang]) return e[lang];
    var RULES = window.GTMA_RULES || [];
    for (var i = 0; i < RULES.length; i++) {
      var m = s.match(RULES[i].re);
      if (m) {
        var v = RULES[i][lang];
        if (!v) break;
        return typeof v === 'function' ? v(m) : fill(v, m);
      }
    }
    if (DATE_RE.test(s)) {
      var d = localizeDates(s);
      if (d !== s) return d;
    }
    return window.tr ? window.tr(s) : s;
  }
  window.gtmaT = t;
  window.gtmaLang = cur;

  /* ── Walking the page ── */
  var busy = false;
  var ATTRS = ['aria-label', 'placeholder', 'title'];

  function translateNode(n) {
    var raw = n.nodeValue, key = raw.trim();
    if (!key || key.length < 2) return;
    var v = t(key);
    if (v !== key) n.nodeValue = raw.replace(key, v);
  }

  function translate(root) {
    if (cur() === 'en' || !root) return;
    busy = true;
    try {
      if (root.nodeType === 3) { translateNode(root); return; }
      if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      var nodes = [];
      while (w.nextNode()) {
        var p = w.currentNode.parentElement;
        if (p && /SCRIPT|STYLE|TEXTAREA/.test(p.tagName)) continue;
        /* data-i18n-skip marks text that must stay as it is: the language menu
           names every language in its own language. */
        if (p && p.closest('[data-i18n-skip]')) continue;
        nodes.push(w.currentNode);
      }
      nodes.forEach(translateNode);
      ATTRS.forEach(function (a) {
        var els = root.querySelectorAll ? [].slice.call(root.querySelectorAll('[' + a + ']')) : [];
        if (root.nodeType === 1 && root.hasAttribute && root.hasAttribute(a)) els.push(root);
        els.forEach(function (el) {
          var val = el.getAttribute(a), v = t(val);
          if (v !== val) el.setAttribute(a, v);
        });
      });
    } finally { busy = false; }
  }
  window.gtmaTranslate = translate;

  /* ── The language menu ──────────────────────────────────────────────────
     Two homes, one component. On the screens with the app sidebar it hangs off
     the user block, exactly where the dashboard puts it. The survey creator has
     no sidebar, so it takes over the globe button in its header, which until now
     said "English" and did nothing. */
  var NAMES = { en: 'English', nl: 'Nederlands', de: 'Deutsch' };

  function picker() {
    if (document.getElementById('gtma-lang-pop')) return;
    /* The dashboard renders its own picker in the same spot; one is enough. */
    if (document.getElementById('lang-pop')) return;

    var user = document.querySelector('.mn-user');
    var chip = document.querySelector('.cyos-head-actions .btn');
    var host = user || (chip && chip.parentElement);
    if (!host) return;

    var pop = document.createElement('div');
    pop.className = 'menu lang-pop' + (user ? '' : ' is-below');
    pop.id = 'gtma-lang-pop';
    pop.setAttribute('role', 'menu');
    pop.setAttribute('data-i18n-skip', '');
    pop.hidden = true;
    pop.innerHTML = '<div class="menu-group-lbl">' + t('Language') + '</div>' +
      LANGS.map(function (l) {
        var on = l[0] === cur();
        return '<div class="menu-item' + (on ? ' is-selected' : '') + '" role="menuitemradio" aria-checked="' + on +
          '" tabindex="0" data-lang="' + l[0] + '"><span class="menu-item-title">' + l[1] + '</span>' +
          (on ? '<i data-icon="check" class="menu-item-check"></i>' : '') + '</div>';
      }).join('');
    host.appendChild(pop);

    var trigger = user || chip;
    if (user) {
      user.setAttribute('role', 'button');
      user.setAttribute('tabindex', '0');
    } else {
      /* The creator's button names the language it is set to, in that language. */
      chip.innerHTML = '<i data-icon="globe"></i> ' + NAMES[cur()];
      chip.setAttribute('data-i18n-skip', '');
    }

    pop.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        try { localStorage.setItem(KEY, b.dataset.lang); } catch (err) {}
        /* Translation runs one way, so the honest way back to English is a reload. */
        location.reload();
      });
    });
    trigger.addEventListener('click', function (e) { e.stopPropagation(); pop.hidden = !pop.hidden; });
    document.addEventListener('click', function () { pop.hidden = true; });
    if (window.Icons) window.Icons.render(trigger.parentElement || pop);
  }

  /* The popover lives in effectiveness.css, which not every screen here loads. */
  var css = document.createElement('style');
  css.textContent = '.mn-user, .cyos-head-actions { position: relative; }' +
    '.mn-user, .cyos-head-actions .btn { cursor: pointer; }' +
    '#gtma-lang-pop { position: absolute; bottom: calc(100% + var(--spacing-tight)); left: 0; right: 0; z-index: 60; max-height: none; overflow: visible; }' +
    /* In the creator the button sits at the top of the screen, so the menu drops down. */
    '#gtma-lang-pop.is-below { bottom: auto; top: calc(100% + var(--spacing-tight)); left: auto; right: 0; min-width: 200px; }' +
    '#gtma-lang-pop[hidden] { display: none; }' +
    '#gtma-lang-pop .menu-item-check { margin-left: auto; }';
  document.head.appendChild(css);

  /* This file is the last thing in the body, so the page is parsed by the time it
     runs. Translating here rather than on DOMContentLoaded means the reader never
     sees the English flash past first. */
  translate(document.body);
  /* The head held the first paint back for this; the text is swapped, so show it. */
  document.documentElement.classList.remove('gtma-lang-wait');

  function start() {
    translate(document.body);
    document.title = t(document.title);
    picker();
    new MutationObserver(function (muts) {
      if (busy) return;
      muts.forEach(function (m) {
        if (m.type === 'characterData') { busy = true; try { translateNode(m.target); } finally { busy = false; } return; }
        [].forEach.call(m.addedNodes, function (n) { translate(n); });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
