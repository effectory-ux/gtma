/* ── Review and plan ──────────────────────────────────────
   The closing summary of the survey setup, shared by all three steps. It reads
   the steps back out of session storage, so it says what was actually chosen.

   Which lines appear was checked against My Effectory:
   · Participants shows the structure, then either the randomized sample or, when
     sampling is off, who is invited. The product writes that second line as a
     bare sentence; here it carries a label, so it stays in the same two columns
     as every other line.
   · A survey without a frequency shows "Survey period" with Starts and Ends;
     with a frequency the block becomes "Schedule" with the frequency, the start
     and end of the schedule, and how many surveys that adds up to.
   · Starting immediately makes the action "Launch survey" instead of "Plan
     survey".
   The time zone and the survey duration are set in the step but do not appear
   in this dialog. */
(function () {
  var read = function (key) {
    try { return JSON.parse(sessionStorage.getItem(key)); } catch (e) { return null; }
  };
  /* Read at the moment of use, not at load: the steps write to session storage
     while you work, and this script also runs on those pages. */
  var SAMPLING, PERIOD, DESIGN, QUESTIONS;
  function refresh() {
    SAMPLING = read('gtma-cyos-sampling');
    PERIOD = read('gtma-cyos-period');
    DESIGN = read('gtma-cyos-layout') || {};
    QUESTIONS = read('gtma-cyos-questions');
  }

  var DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function stamp(ms, time) {
    if (!ms) return null;
    var d = new Date(ms);
    return DAY[d.getDay()] + ', ' + MON[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() +
      (time ? ', ' + time : '');
  }

  /* How many rounds a recurring schedule fits in its own window. */
  var UNIT_DAYS = { Weekly: 7, Monthly: 30, Quarterly: 91 };
  function rounds() {
    if (!PERIOD || !PERIOD.start || !PERIOD.end) return null;
    var unit = UNIT_DAYS[PERIOD.freq];
    if (!unit) return null;
    var days = (PERIOD.end - PERIOD.start) / 86400000;
    return Math.max(1, Math.floor(days / unit) + 1);
  }

  var recurring = function () { return !!(PERIOD && PERIOD.freq && PERIOD.freq !== 'Once'); };
  /* Starting immediately means there is no start date to fill in, only an end. */
  var periodSet = function () { return !!(PERIOD && PERIOD.end && (PERIOD.when === 'now' || PERIOD.start)); };
  var immediate = function () { return !!(PERIOD && PERIOD.when === 'now'); };
  /* Planning waits for every step that can still be empty. Layout and emails is
     pre-filled from the start, so it never holds the button back. */
  var ready = function () {
    return !!QUESTIONS && !!(SAMPLING && SAMPLING.groups) && periodSet();
  };

  function steps() {
    var out = [
      { icon: 'check-square', tile: 'is-questions', title: 'Questions',
        href: 'ai-adoption-scan-questionnaire.html', facts: [
          ['Questions', QUESTIONS ? String(QUESTIONS.questions) : 'Not selected yet'],
          ['Completion time', QUESTIONS ? QUESTIONS.minutes + ' minutes' : '—']
        ] }
    ];

    var people = [];
    if (SAMPLING && SAMPLING.groups) {
      people.push(['Inviting structure', SAMPLING.structure]);
      if (SAMPLING.sampling) {
        people.push(['Randomized sample', SAMPLING.pct + '%', SAMPLING.invited + ' participants']);
      } else {
        people.push(['Invited', SAMPLING.total + ' participants from ' + SAMPLING.groups + ' groups']);
      }
    } else {
      people.push(['Participants', 'Not selected yet']);
    }
    out.push({ icon: 'users', tile: 'is-people', title: 'Participants',
      href: 'cyos-participants.html', facts: people });

    var when = [];
    if (periodSet()) {
      if (recurring()) {
        when.push(['Frequency', PERIOD.freq]);
        when.push(['Start of schedule', immediate() ? 'Immediately' : stamp(PERIOD.start, PERIOD.startTime)]);
        when.push(['End of schedule', stamp(PERIOD.end, PERIOD.endTime)]);
        var n = rounds();
        if (n) when.push(['Total surveys created', String(n)]);
      } else {
        when.push(['Starts', immediate() ? 'Immediately' : stamp(PERIOD.start, PERIOD.startTime)]);
        when.push(['Ends', stamp(PERIOD.end, PERIOD.endTime)]);
      }
    } else {
      when.push(['Survey period', 'Not selected yet']);
    }
    out.push({ icon: 'calendar', tile: 'is-period', title: recurring() ? 'Schedule' : 'Survey period',
      href: 'cyos-survey-period.html', facts: when });

    out.push({ icon: 'layout', tile: 'is-design', title: 'Design',
      href: 'cyos-layout-emails.html', facts: [
        ['Survey', DESIGN.layout || 'Novanta yellow'],
        ['Email', DESIGN.mailTemplate || 'Novanta yellow'],
        ['Email content', 'Default text']
      ] });
    return out;
  }

  var MARKUP =
    '<div class="overlay" id="rpOv" hidden>' +
      '<div class="dialog dialog-s rp-dlg" role="dialog" aria-modal="true" aria-labelledby="rpTitle">' +
        '<button class="dialog-close" type="button" id="rpClose" aria-label="Close"><i data-icon="cross"></i></button>' +
        '<div class="dialog-header">' +
          '<h2 class="dialog-title" id="rpTitle">Review and plan</h2>' +
          '<p class="dialog-subtitle">Review your survey details and plan your survey. No worries, you can still make edits up to 2 hours before the survey starts.</p>' +
        '</div>' +
        '<div class="rp-list" id="rpList"></div>' +
        '<div class="dialog-footer">' +
          '<button class="btn btn-secondary" type="button" id="rpCancel">Cancel</button>' +
          '<button class="btn btn-primary" type="button" id="rpPlan"><i data-icon="send"></i> <span id="rpPlanLabel">Plan survey</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';

  function render() {
    refresh();
    var here = location.pathname.split('/').pop();
    document.getElementById('rpList').innerHTML = steps().map(function (st) {
      var facts = st.facts.map(function (f) {
        if (f[0] === null) return '<dd class="rp-wide">' + f[1] + '</dd>';
        return '<dt>' + f[0] + '</dt><dd>' + f[1] +
          (f[2] ? ' <span class="rp-note">(' + f[2] + ')</span>' : '') + '</dd>';
      }).join('');
      /* Every card gets its Edit, including the step you are on: there it just
         closes the dialog, because you are already looking at that step. */
      var edit = st.href === here
        ? '<button class="btn btn-tertiary rp-edit" type="button" data-here>Edit</button>'
        : '<a class="btn btn-tertiary rp-edit" href="' + st.href + '">Edit</a>';
      return '<div class="rp-step">' +
        '<div class="rp-head">' +
          '<span class="rp-tile ' + st.tile + '"><i data-icon="' + st.icon + '"></i></span>' +
          '<p class="rp-title">' + st.title + '</p>' + edit +
        '</div>' +
        '<dl class="rp-facts">' + facts + '</dl></div>';
    }).join('');
    document.getElementById('rpPlanLabel').textContent = immediate() ? 'Launch survey' : 'Plan survey';
    if (window.Icons) window.Icons.render(document.getElementById('rpOv'));
  }

  function close() {
    document.getElementById('rpOv').hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertAdjacentHTML('beforeend', MARKUP);

    var btn = document.getElementById('reviewBtn');
    if (btn) {
      var sync = function () {
        refresh();
        var can = ready();
        btn.disabled = !can;
        btn.classList.toggle('is-disabled', !can);
        btn.title = can ? '' : 'Complete every step before planning the survey';
      };
      sync();
      /* The step you are on writes to session storage from its own handlers, so read
         back after those have run, not before them. */
      var later = function () { setTimeout(sync, 0); };
      document.addEventListener('click', later);
      document.addEventListener('change', later);
      document.addEventListener('keyup', later);
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        render();
        document.getElementById('rpOv').hidden = false;
        document.body.style.overflow = 'hidden';
      });
    }

    /* Planning the survey closes the setup and lands on the confirmation. */
    document.getElementById('rpPlan').addEventListener('click', function () {
      /* Planning parks the survey with everything it was given, so the overview
         and its own page can read it back. */
      if (window.cyosSurveys) {
        window.cyosSurveys.save(immediate() ? 'running' : 'planned', 'design');
      }
      location.href = 'cyos-launched.html';
    });

    document.getElementById('rpList').addEventListener('click', function (e) {
      if (e.target.closest('[data-here]')) close();
    });

    document.getElementById('rpClose').addEventListener('click', close);
    document.getElementById('rpCancel').addEventListener('click', close);
    document.getElementById('rpOv').addEventListener('click', function (e) {
      if (e.target === document.getElementById('rpOv')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !document.getElementById('rpOv').hidden) close();
    });
  });
})();
