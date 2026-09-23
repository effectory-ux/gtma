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
      "Explore more areas" and "Explore more wins".
   3. The Actions tab: a "Your responses" eyebrow, a plain Export button, scores
      as pills, the prototype's row menu, custom pins that start without a goal
      and only list once named, and the empty state with clickable responses. */
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
      '<p class="step-sub">' + T('Pick the response that fits \u2014 you can change it later.') + '</p></div>' +
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


  /* ── 3. The Actions tab ── */
  var ICON_OF = { improve: 'target', monitor: 'eye', support: 'flag', promote: 'win' };
  /* The empty state's own copy, as the prototype writes it (Figma "Actions 01 -
     Empty state"). Promote reads shorter here than in the respond dialog. */
  var EMPTY_DESC = {
    improve: 'Something the team can influence, so commit to a concrete next step now.',
    monitor: 'Not urgent yet, so keep it on your radar and revisit at the next survey.',
    support: "Outside the team's control, so flag it for the right person to pick up.",
    promote: 'A real strength worth celebrating, so find a way to share the win with your team.'
  };
  var WIN_KEYS = {};
  d.highScores.forEach(function (s) { WIN_KEYS[s.q] = 1; });
  var QUESTION_KEYS = {};
  d.lowScores.concat(d.highScores).forEach(function (s) { QUESTION_KEYS[s.q] = 1; });
  SCORES_GROUPS.forEach(function (grp) { grp.rows.forEach(function (r) { QUESTION_KEYS[r.q] = 1; }); });

  /* Rows: a question's score is a pill, the way the Focus View shows it, and the
     row menu uses the prototype's words. Everything else is the design system's row. */
  var dsRow = window.apRowHTML;
  window.apRowHTML = function (r) {
    var tpl = document.createElement('template');
    tpl.innerHTML = dsRow(r).trim();
    var row = tpl.content.firstElementChild;
    var sc = row.querySelector('.ap-score');
    if (sc && QUESTION_KEYS[r.key] && /%$/.test(sc.textContent.trim())) {
      sc.innerHTML = '<span class="fv-score is-' + (WIN_KEYS[r.key] ? 'win' : 'focus') + '">' + esc(sc.textContent.trim()) + '</span>';
    }
    var lbl = function (sel, text) { var el = row.querySelector(sel + ' .menu-item-title'); if (el) el.textContent = T(text); };
    lbl('.ap-edit', 'Edit details'); lbl('.ap-addk', 'Add action'); lbl('.ap-remove', 'Remove');
    return row.outerHTML;
  };

  /* A custom pin without a name is still being made: it stays out of the list,
     and it is dropped altogether if the panel closes before it has one. */
  var dsRows = window.actionPlannerRows;
  window.actionPlannerRows = function (dd) {
    return dsRows(dd).filter(function (r) { return !(r.custom && !(r.name || '').trim()); });
  };
  function dropUnnamedCustom() {
    var before = AP_CUSTOM.length;
    AP_CUSTOM = AP_CUSTOM.filter(function (r) {
      if ((r.name || '').trim()) return true;
      delete ACT_STORE[r.key];
      return false;
    });
    if (AP_CUSTOM.length !== before && window.renderAPBody) window.renderAPBody();
  }

  /* A new custom pin opens the panel on its title with no goal yet: the goal
     dropdown reads "Select a goal", as it does for a question. From an empty-state
     card the pin already has that card's goal and opens on a new action. */
  function newCustomPin(goal) {
    var key = 'custom:' + (++AP_CUSTOM_SEQ);
    ACT_STORE[key] = { goal: goal || '', desc: '', actions: [] };
    AP_CUSTOM.push({ key: key, name: '', score: null, custom: true });
    AP_REMOVED.delete(key);
    var overlay = window.apOpenActions(key, '', '–', !!goal);
    if (!overlay) return;
    if (goal) dropEmptyOnClose(overlay, key);
    var obs = new MutationObserver(function () {
      if (!overlay.hidden) return;
      obs.disconnect();
      dropUnnamedCustom();
    });
    obs.observe(overlay, { attributes: true, attributeFilter: ['hidden'] });
  }

  window.actionsEmptyHTML = function () {
    return '<div class="actions-empty gtma-actions-empty">' +
      '<img class="actions-illo" src="assets/illustrations/action-planning.svg" width="286" height="205" alt="" />' +
      '<div class="ae-hero-txt">' +
        '<h2 class="ae-title">' + T('Turn your results into action') + '</h2>' +
        '<p class="ae-desc">' + T('Respond to a focus area to decide how you’ll act on it, and it shows up here.') + '</p>' +
      '</div>' +
      '<div class="ae-cards">' + GOAL_ORDER.map(function (key) {
        var g = GOAL_CHIPS[key];
        return '<button type="button" class="ae-card" data-gtma-custom="' + key + '" aria-label="' + T('Create a custom ' + g.label + ' pin') + '">' +
          '<span class="ae-card-ico is-' + key + '"><i data-icon="' + ICON_OF[key] + '"></i></span>' +
          '<span class="ae-card-t">' + T(g.label) + '</span>' +
          '<span class="ae-card-d">' + T(EMPTY_DESC[key]) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="ae-cta-row"><button type="button" class="btn btn-primary ae-cta" data-gtma-custom=""><i data-icon="plus"></i> ' + T('Add custom pin') + '</button></div>' +
    '</div>';
  };

  function exportToast() {
    var stack = document.getElementById('sysnotif-stack');
    if (!stack) return;
    var el = document.createElement('div');
    el.className = 'sysnotif';
    el.innerHTML = '<span class="sysnotif-title">' + T('Preparing your export…') + '</span>' +
      '<button class="sysnotif-close" aria-label="' + T('Close') + '"><i data-icon="cross"></i></button>';
    stack.appendChild(el);
    if (window.Icons) window.Icons.render(el);
    el.querySelector('.sysnotif-close').addEventListener('click', function () { el.remove(); });
    setTimeout(function () { el.remove(); }, 3200);
  }

  /* Capture phase, ahead of the design system's handlers in the Actions view. */
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var view = document.getElementById('view-actions');
    if (!view || !view.contains(e.target)) return;
    var custom = e.target.closest('.ap-custom, [data-gtma-custom]');
    if (custom && window.apOpenActions) {
      e.stopPropagation(); e.preventDefault();
      newCustomPin(custom.dataset.gtmaCustom || '');
      return;
    }
    if (e.target.closest('.ap-export')) {
      e.stopPropagation(); e.preventDefault();
      exportToast();
    }
  }, true);

  /* The header: an eyebrow above the title, and Export as one button rather than
     a menu. Then redraw the body so the rows and the empty state above apply. */
  function augmentActions() {
    var head = document.querySelector('#view-actions .actions-head-txt');
    if (!head || head.querySelector('.gtma-eyebrow')) return;
    head.insertAdjacentHTML('afterbegin', '<span class="fv-eyebrow is-focus gtma-eyebrow">' + T('Your responses') + '</span>');
    var exp = document.querySelector('#view-actions .ap-export');
    if (exp) { var chev = exp.querySelector('[data-icon="chevron-down"]'); if (chev) chev.remove(); }
    var menu = document.querySelector('#view-actions .ap-export-menu'); if (menu) menu.remove();
    if (window.renderAPBody) window.renderAPBody();
  }

  augment();
  augmentActions();
  /* A language or theme switch re-renders #root from scratch and resets FV_CARDS,
     so put the extra cards and the Actions header back then. */
  new MutationObserver(function () { augment(); augmentActions(); }).observe(root, { childList: true });
})();
