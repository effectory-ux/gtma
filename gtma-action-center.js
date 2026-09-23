/* ── The Action Center, ahead of the design system ───────────────────────────
   Behaviour that goes with gtma-action-center.css: the Action Center prototype
   (effectory-ux/action-center, action-center-manager-stepper.html) has moved on
   since the design system's last release, and this brings the dashboards in line
   until it catches up. It leans on effectiveness.js's own globals (FV_CARDS,
   focusCard, actState, apOpenActions …) rather than copying them, so it changes
   only what the prototype changed. Loaded by every <group>-<moment>-<screen>.html
   after the dashboard has rendered.

   1. Pinning in the Overview asks "Choose how to respond", then opens the side
      panel on that goal with a new action ready, instead of a popover and a toast.
   2. The Focus View shows three focus areas and three wins, with the rest behind
      "Explore more areas" and "Explore more wins". */
(function () {
  var root = document.getElementById('root');
  if (!root || typeof FV_CARDS === 'undefined' || typeof DATA === 'undefined') return;

  var T = function (s) { return window.gtmaT ? window.gtmaT(s) : (window.tr ? window.tr(s) : s); };
  var m = location.pathname.match(/(team-it|novanta)-(before|after)-/);
  var d = m && DATA[m[1] + '-' + m[2]];
  if (!d) return;

  /* ── 1. Pinning in the Overview asks for the response, then opens the panel ──
     The design system asked for a goal in the pin's popover and showed a toast.
     The prototype asks in a compact "Choose how to respond" dialog instead (the
     Focus View's respond step, without the stepper), and picking a response
     opens the side panel on that goal with a new action already open, so the
     only thing left is to write it. A subject that already has a response skips
     the dialog and opens the panel: on a new action if it has none yet, otherwise
     on its actions. On a card with several items the list of questions stays;
     only the goal step in it goes. */
  var RESPOND = null;
  function closePinPops() {
    document.querySelectorAll('.sc-pin-pop').forEach(function (p) { p.hidden = true; });
    document.querySelectorAll('.is-pin-open').forEach(function (r) { r.classList.remove('is-pinning', 'is-pin-open'); });
    document.querySelectorAll('.sc-pin.is-pressed').forEach(function (b) { b.classList.remove('is-pressed'); });
  }
  function openPanel(key, name, scoreText, addAction) {
    var overlay = window.apOpenActions(key, name, scoreText, addAction);
    if (overlay && addAction) dropEmptyOnClose(overlay, key);
  }
  function respondEl() {
    var el = document.getElementById('gtma-pin-respond');
    if (el) return el;
    el = document.createElement('div');
    el.className = 'overlay step-overlay';
    el.id = 'gtma-pin-respond';
    el.hidden = true;
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target === el || e.target.closest('[data-gtma-respond-x]')) { closeRespond(); return; }
      var opt = e.target.closest('[data-gtma-resp]');
      if (opt) pickResponse(opt.dataset.gtmaResp);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !el.hidden) closeRespond(); });
    return el;
  }
  function openRespond(subject) {
    RESPOND = subject;
    var el = respondEl();
    var score = subject.tone ? '<span class="fv-score is-' + subject.tone + '">' + esc(subject.scoreText) + '</span>' : '';
    el.innerHTML = '<div class="step-modal" role="dialog" aria-modal="true" aria-labelledby="gtma-respond-title">' +
      '<button class="step-close ib ib-36 ib-tertiary" aria-label="' + T('Close') + '" data-gtma-respond-x><i data-icon="cross"></i></button>' +
      '<div class="step-body"><div class="step-hero"><div class="step-hero-row"><span class="step-hero-ico"><i data-icon="list-unordered"></i></span>' +
      '<h2 class="step-h2" id="gtma-respond-title">' + T('Choose how to respond') + '</h2></div>' +
      '<p class="step-sub">' + T('Pick the response that fits this question \u2014 you can change it later.') + '</p></div>' +
      '<div class="fv-card step-context-card"><div class="fv-card-head"><div class="fv-card-top">' +
      '<div class="fv-card-q"><p class="fv-card-question">' + T(subject.name) + '</p><span class="fv-card-theme">' + esc(subject.theme) + '</span></div>' +
      score + '</div></div></div>' +
      '<div class="step-options">' + GOAL_ORDER.map(function (key) {
        var g = GOAL_CHIPS[key];
        return '<button class="step-opt is-' + key + '" data-gtma-resp="' + key + '" aria-label="' + T('Choose ' + g.label) + '">' +
          '<span class="step-opt-ico"><i data-icon="' + g.icon + '"></i></span>' +
          '<span class="step-opt-title">' + T(g.label) + '</span>' +
          '<span class="step-opt-desc">' + T(RESP_DESC[key]) + '</span></button>';
      }).join('') + '</div></div></div>';
    el.hidden = false;
    document.body.classList.add('step-open');
    if (window.Icons) window.Icons.render(el);
    var first = el.querySelector('.step-opt'); if (first) first.focus();
  }
  function closeRespond() {
    var el = document.getElementById('gtma-pin-respond');
    if (el) el.hidden = true;
    document.body.classList.remove('step-open');
    RESPOND = null;
  }
  function pickResponse(goal) {
    var s = RESPOND; closeRespond();
    if (!s) return;
    var st = actState(s.key);
    st.goal = goal; st.lastEdited = Date.now();
    if (!AP_PINNED.some(function (r) { return r.key === s.key; })) AP_PINNED.push({ key: s.key, name: s.name, scoreText: s.scoreText });
    AP_REMOVED.delete(s.key);
    syncPinsForKey(s.key);
    refreshMultiPins();
    openPanel(s.key, s.name, s.scoreText, true);
  }
  function pinSubject(el, key, name, scoreText) {
    var card = el.closest('.card');
    var title = card && card.querySelector('.qs-title, .text-l5, h3, h2');
    var tone = card && card.classList.contains('qs-card') ? (card.classList.contains('is-high') ? 'win' : 'focus') : '';
    return { key: key, name: name, scoreText: scoreText, tone: tone,
      theme: FV_THEME[key] ? T(FV_THEME[key]) : T('Overview') + (title ? ' \u00b7 ' + title.textContent.trim() : '') };
  }
  function pinned(e, el, key, name, scoreText) {
    e.stopPropagation(); e.preventDefault();
    closePinPops();
    var st = actState(key);
    if (st.goal) openPanel(key, name, scoreText, !st.actions.length);
    else openRespond(pinSubject(el, key, name, scoreText));
  }
  /* Capture phase, so this runs instead of the design system's own pin handlers. */
  document.addEventListener('click', function (e) {
    if (!window.apOpenActions || !e.target.closest) return;
    var view = document.getElementById('view-overview');
    if (!view || !view.contains(e.target)) return;
    var item = e.target.closest('.sc-pinlist-item');
    if (item) { pinned(e, item, item.dataset.pinKey, item.dataset.pinName, item.dataset.pinScore); return; }
    var pin = e.target.closest('.sc-pin');
    var wrap = pin && pin.closest('.sc-pin-wrap[data-pin-key]');
    if (wrap) pinned(e, wrap, wrap.dataset.pinKey, wrap.dataset.pinName, wrap.dataset.pinScore);
  }, true);

  /* The open action is a placeholder until something is typed in it. Closing the
     panel with it still empty would leave an untitled action in the Actions tab,
     so take it out again then. */
  function dropEmptyOnClose(overlay, key) {
    var obs = new MutationObserver(function () {
      if (!overlay.hidden) return;
      obs.disconnect();
      var st = actState(key), before = st.actions.length;
      st.actions = st.actions.filter(function (a) { return (a.text || '').trim(); });
      if (st.actions.length !== before && window.renderAPBody) window.renderAPBody();
    });
    obs.observe(overlay, { attributes: true, attributeFilter: ['hidden'] });
  }

  /* The design system redraws a multi-item pin only when its list opens, so the
     card's pin would stay hollow after the goal was set here. */
  function refreshMultiPins() {
    document.querySelectorAll('.sc-pin-multi').forEach(function (wrap) {
      var n = 0;
      wrap.querySelectorAll('.sc-pinlist-item').forEach(function (it) {
        var st = actState(it.dataset.pinKey), pinned = !!st.goal;
        if (pinned) n++;
        it.classList.toggle('is-pinned', pinned);
        var ico = it.querySelector('.sc-pinlist-pin');
        if (ico) GOAL_ORDER.forEach(function (g) { ico.classList.toggle('is-goal-' + g, st.goal === g); });
      });
      var cnt = wrap.querySelector('.sc-pin-count'); if (cnt) { cnt.textContent = n; cnt.hidden = n === 0; }
      var btn = wrap.querySelector('.sc-pin'); if (!btn) return;
      btn.classList.toggle('is-pinned', n > 0);
      var i = btn.querySelector('[data-icon]'), want = n > 0 ? 'pin-filled' : 'pin';
      if (i && i.dataset.icon !== want) { i.dataset.icon = want; delete i.dataset.iconLoaded; i.innerHTML = ''; if (window.Icons) window.Icons.renderOne(i); }
    });
  }

  /* ── 2. "Explore more" in the Focus View ──
     The extra focus areas are the next-lowest questions still under their
     benchmark: first the rest of the dataset's lowest scores, then the Scores
     tab's own rows, lowest first. The extra wins are the rest of the highest
     scores. They sit in FV_CARDS / FV_WINS like the first three, so the respond
     dialog finds their score and theme, and a response reflects on the card. */
  var MAX_MORE = 4;
  var g = groupKey(d), per = periodKey(d);
  var extraFocus = (function () {
    var taken = {}, out = [];
    d.lowScores.slice(0, 3).concat(d.highScores).forEach(function (s) { taken[s.q] = 1; });
    var add = function (q, s) { if (!taken[q]) { taken[q] = 1; out.push({ q: q, s: s }); } };
    d.lowScores.slice(3).forEach(function (s) { add(s.q, s.s); });
    var rows = [];
    SCORES_GROUPS.forEach(function (grp) {
      grp.rows.forEach(function (r) {
        var s = r.v[g] && r.v[g][per];
        if (r.scale || s == null || s >= r.bench) return;
        rows.push({ q: r.q, s: s });
      });
    });
    rows.sort(function (a, b) { return a.s - b.s; }).forEach(function (r) { add(r.q, r.s); });
    return out.slice(0, MAX_MORE).map(function (s) { return { q: s.q, s: s.s, tag: '', more: true }; });
  })();
  var extraWins = d.highScores.slice(3, 3 + MAX_MORE).map(function (s) { return { q: s.q, s: s.s, more: true }; });

  var OPEN = { focus: false, wins: false };
  var LABEL = {
    focus: ['Explore more areas', 'Show fewer areas'],
    wins: ['Explore more wins', 'Show fewer wins']
  };

  function moreHTML(which, listClass) {
    return '<button type="button" class="fv-explore-more" data-gtma-more="' + which + '" aria-expanded="' + OPEN[which] + '" aria-controls="gtma-more-' + which + '">' +
      '<span class="fv-explore-more-lbl">' + T(LABEL[which][OPEN[which] ? 1 : 0]) + '</span> <i data-icon="' + (OPEN[which] ? 'chevron-up' : 'chevron-down') + '"></i></button>' +
      '<div class="fv-more' + (OPEN[which] ? ' is-open' : '') + '" id="gtma-more-' + which + '"><div class="' + listClass + ' gtma-more-list"></div></div>';
  }

  /* The design system's renderFocusCards writes every card into the first list, so
     replace it with one that splits them. Its own handlers call it by name, so a
     confirmed response re-renders both halves. */
  window.renderFocusCards = function () {
    var fill = function (sel, cards, tpl) {
      var el = document.querySelector(sel);
      if (el) { el.innerHTML = cards.map(tpl).join(''); if (window.Icons) window.Icons.render(el); }
    };
    var first = function (c) { return !c.more; }, rest = function (c) { return c.more; };
    fill('#view-focus .fv-focus .fv-block-main > .fv-cards', FV_CARDS.filter(first), focusCard);
    fill('#gtma-more-focus .fv-cards', FV_CARDS.filter(rest), focusCard);
    fill('#view-focus .fv-wins .fv-block-main > .fv-win-cards', FV_WINS.filter(first), winCard);
    fill('#gtma-more-wins .fv-win-cards', FV_WINS.filter(rest), winCard);
  };

  function augment() {
    var focusList = document.querySelector('#view-focus .fv-focus .fv-block-main > .fv-cards');
    var winList = document.querySelector('#view-focus .fv-wins .fv-block-main > .fv-win-cards');
    if (!focusList || document.getElementById('gtma-more-focus')) return;
    FV_CARDS = FV_CARDS.filter(function (c) { return !c.more; }).concat(extraFocus);
    FV_WINS = FV_WINS.filter(function (c) { return !c.more; }).concat(extraWins);
    if (extraFocus.length) focusList.insertAdjacentHTML('afterend', moreHTML('focus', 'fv-cards'));
    if (winList && extraWins.length) winList.insertAdjacentHTML('afterend', moreHTML('wins', 'fv-win-cards'));
    window.renderFocusCards();
    if (window.Icons) window.Icons.render(document.getElementById('view-focus'));
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-gtma-more]');
    if (!btn) return;
    var which = btn.dataset.gtmaMore;
    OPEN[which] = !OPEN[which];
    document.getElementById('gtma-more-' + which).classList.toggle('is-open', OPEN[which]);
    btn.setAttribute('aria-expanded', OPEN[which]);
    btn.querySelector('.fv-explore-more-lbl').textContent = T(LABEL[which][OPEN[which] ? 1 : 0]);
    var i = btn.querySelector('i[data-icon]');
    i.dataset.icon = OPEN[which] ? 'chevron-up' : 'chevron-down'; delete i.dataset.iconLoaded; i.innerHTML = '';
    if (window.Icons) window.Icons.renderOne(i);
  });

  augment();
  /* A language or theme switch re-renders #root from scratch and resets FV_CARDS,
     so put the extra cards back then. */
  new MutationObserver(augment).observe(root, { childList: true });
})();
