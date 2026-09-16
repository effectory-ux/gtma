/* ── The surveys you are setting up ───────────────────────
   Every survey you create gets its own entry, so the overview can list them all
   instead of showing only the last one. The four setup steps keep their own
   state in session storage while you work; parking a survey (Save & Close) or
   planning it copies that state into its entry, and opening a survey again puts
   it back. Starting a new survey clears the steps, so it does not inherit the
   ticks of the one before it. */
(function () {
  var LIST = 'gtma-cyos-surveys';
  var CURRENT = 'gtma-cyos-current';
  /* What each step writes down, and what has to travel with a survey. */
  var STEP_KEYS = [
    'gtma-cyos-questions',
    'gtma-cyos-participants',
    'gtma-cyos-sampling',
    'gtma-cyos-period',
    'gtma-cyos-layout'
  ];
  var STEP = {
    'ai-adoption-scan-questionnaire.html': 'questions',
    'cyos-participants.html': 'participants',
    'cyos-survey-period.html': 'period',
    'cyos-layout-emails.html': 'design'
  };

  var read = function (k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } };
  var write = function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  function list() { return read(LIST) || []; }
  function currentId() { try { return sessionStorage.getItem(CURRENT); } catch (e) { return null; } }

  /* Everything the steps have filled in so far. */
  function snapshot() {
    var out = {};
    STEP_KEYS.forEach(function (k) { out[k] = read(k); });
    return out;
  }
  function clearSteps() {
    STEP_KEYS.forEach(function (k) { try { sessionStorage.removeItem(k); } catch (e) {} });
  }
  function applySteps(steps) {
    clearSteps();
    if (!steps) return;
    STEP_KEYS.forEach(function (k) { if (steps[k]) write(k, steps[k]); });
  }

  /* Park the survey being edited: status, the step you were on, and its state. */
  function save(status, step) {
    var id = currentId();
    if (!id) return;
    var all = list();
    var i = all.findIndex(function (s) { return s.id === id; });
    if (i < 0) return;
    var s = all[i];
    if (status) s.status = status;
    if (step) s.step = step;
    s.steps = snapshot();
    all[i] = s;
    write(LIST, all);
    /* The survey page and the rails read this one. */
    write('gtma-cyos-survey', { name: s.name, project: s.project, status: s.status, step: s.step });
  }

  window.cyosSurveys = {
    list: list,
    save: save,
    clearSteps: clearSteps,
    /* Starting a new survey: a clean slate plus a fresh entry at the top. */
    create: function (name, project) {
      clearSteps();
      var id = 's' + list().length + '-' + name.replace(/\W+/g, '').slice(0, 12);
      var all = list();
      all.unshift({ id: id, name: name, project: project, status: 'draft', step: 'questions', steps: {} });
      write(LIST, all);
      try { sessionStorage.setItem(CURRENT, id); } catch (e) {}
      write('gtma-cyos-survey', { name: name, project: project, status: 'draft', step: 'questions' });
      return id;
    },
    /* Opening one from the overview: make it the one you are editing again. */
    open: function (id) {
      var s = list().filter(function (x) { return x.id === id; })[0];
      if (!s) return null;
      try { sessionStorage.setItem(CURRENT, id); } catch (e) {}
      applySteps(s.steps);
      write('gtma-cyos-survey', { name: s.name, project: s.project, status: s.status, step: s.step });
      return s;
    }
  };

  /* Each step is its own page and carries its own copy of the header, so the name
     in it is whatever that page happened to be built with. Fill it from the survey
     you are actually setting up, so it stops changing as you walk through the steps. */
  function paintHeader() {
    var s = read('gtma-cyos-survey');
    if (!s || !s.name) return;
    var name = document.querySelector('.cyos-survey-name');
    if (name && name.textContent.trim() !== s.name) name.textContent = s.name;
  }

  document.addEventListener('DOMContentLoaded', function () {
    paintHeader();
    document.querySelectorAll('[data-saveclose], .js-saveclose').forEach(function (b) {
      b.addEventListener('click', function () {
        var here = location.pathname.split('/').pop();
        save(null, STEP[here] || 'questions');
        location.href = 'surveys.html';
      });
    });
  });
})();
