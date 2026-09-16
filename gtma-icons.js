/* ── Icons that are already there ────────────────────────────────────────────
   icons.js fetches every icon as its own file from the design system's Pages
   site, and GitHub Pages serves them with max-age=600. So for ten minutes they
   come from the browser cache and appear at once, and after that every single
   one needs a round trip to GitHub to be revalidated. The surveys page has 57 of
   them, the results 537, and you watch the sidebar fill in.

   This keeps them in localStorage and paints them synchronously, before icons.js
   starts fetching, so they are on screen with the first paint. Three things keep
   that store honest, all of them after the page is drawn and none of them
   visible: it picks up whatever icons.js rendered, it warms the ones this
   prototype uses but this browser has not seen yet, and once a day it fetches
   the whole store again so an icon changed in the design system lands. */
(function () {
  var KEY = 'gtma-icons-v2';
  var DAY = 24 * 60 * 60 * 1000;
  var BASE = 'https://effectory-ux.github.io/Engage-Design-system-/assets/icons/';

  /* Every icon this prototype and the dashboard it embeds can draw. Warming
     these means the next screen is instant, even one you have not opened yet. */
  var USED = [
    'Clock', 'Trend-down', 'Trend-up', 'alert-circle', 'arrow-down', 'arrow-left',
    'arrow-right', 'arrow-up', 'barchart-2', 'bell', 'benchmark-down', 'benchmark-up',
    'book-open', 'building', 'calendar', 'category', 'check', 'chevron-down', 'chevron-left',
    'chevron-right', 'chevron-up', 'clipboard', 'clipboard-a', 'correlation-positive', 'cross',
    'down-vote', 'download', 'edit', 'external-link', 'eye', 'eye-off', 'featured', 'file',
    'filter', 'flag', 'folder', 'from-to', 'gear', 'globe', 'goals', 'group', 'hierarchy',
    'home', 'info', 'layout', 'lightbulb', 'list-unordered', 'message', 'more-vertical',
    'net-promoter-score', 'net-promoter-score-detractor', 'net-promoter-score-passive',
    'pie-chart', 'pin', 'pin-filled', 'plus', 'privacy', 'refresh', 'rotate-backward',
    'moon', 'sun', 'pin-filled',
    'search', 'segments', 'send', 'sort-descending', 'star', 'table', 'target', 'text-entry',
    'trash', 'up-vote', 'user', 'users', 'version-history'
  ];

  var store = { at: 0, icons: {} };
  try {
    var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && raw.icons) store = raw;
  } catch (e) {}

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
  }

  function paint(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('[data-icon]:not([data-icon-loaded])').forEach(function (el) {
      var svg = store.icons[el.getAttribute('data-icon')];
      if (!svg) return;
      el.innerHTML = svg;
      el.dataset.iconLoaded = '1';
    });
  }
  paint(document);

  /* The dashboard renders its shell at runtime and then calls Icons.render, so
     take that call first and leave icons.js only what the store does not have. */
  function wrap() {
    if (!window.Icons || window.Icons.__gtma) return false;
    var render = window.Icons.render;
    window.Icons.render = function (root) { paint(root); return render.apply(this, arguments); };
    /* Some controls swap their own icon and re-render just that one element. */
    var one = window.Icons.renderOne;
    window.Icons.renderOne = function (el) {
      if (el && el.getAttribute) {
        var svg = store.icons[el.getAttribute('data-icon')];
        if (svg && !el.dataset.iconLoaded) { el.innerHTML = svg; el.dataset.iconLoaded = '1'; return; }
      }
      return one.apply(this, arguments);
    };
    window.Icons.__gtma = true;
    return true;
  }
  if (!wrap()) document.addEventListener('DOMContentLoaded', wrap);

  /* Whatever icons.js drew, the store now knows. */
  function harvest() {
    var changed = false;
    document.querySelectorAll('[data-icon][data-icon-loaded]').forEach(function (el) {
      var name = el.getAttribute('data-icon');
      if (store.icons[name] || !el.firstElementChild) return;
      store.icons[name] = el.innerHTML;
      changed = true;
    });
    if (changed) save();
    return changed;
  }

  /* Fetch in small batches, so warming never competes with the page itself. */
  function fill(names, done) {
    var i = 0;
    (function next() {
      if (i >= names.length) return done && done();
      var batch = names.slice(i, i + 6); i += 6;
      Promise.all(batch.map(function (n) {
        return fetch(BASE + encodeURIComponent(n) + '.svg')
          .then(function (r) { return r.ok ? r.text() : ''; })
          .then(function (t) {
            if (!t) return;
            /* Same treatment icons.js gives them: one colour, sized by its box. */
            store.icons[n] = t
              .replace(/\sfill="#[0-9a-fA-F]{3,8}"/g, ' fill="currentColor"')
              .replace(/\sstroke="#[0-9a-fA-F]{3,8}"/g, ' stroke="currentColor"')
              .replace(/<svg([^>]*?)\swidth="[^"]*"/, '<svg$1')
              .replace(/<svg([^>]*?)\sheight="[^"]*"/, '<svg$1')
              .replace(/<svg\b/, '<svg aria-hidden="true" width="100%" height="100%" style="display:block"');
          })
          .catch(function () {});
      })).then(function () { save(); setTimeout(next, 60); });
    })();
  }

  function idle(fn) {
    if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 3000 });
    else setTimeout(fn, 800);
  }

  window.addEventListener('load', function () {
    idle(function () {
      harvest();
      var stale = Date.now() - (store.at || 0) > DAY;
      var todo = stale ? USED.slice() : USED.filter(function (n) { return !store.icons[n]; });
      if (!todo.length) return;
      fill(todo, function () { store.at = Date.now(); save(); });
    });
  });
  /* Dialogs and side panels draw later and bring icons of their own. */
  setInterval(harvest, 4000);
})();
