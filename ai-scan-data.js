/* ── The AI Adoption Scan, per group ──────────────────────
   One source for the scan's numbers, so the overview, the scores table and the
   themes page cannot drift apart. Each question carries a value per group and
   per period, the same shape the Your voice screens use in effectiveness.js.

   Which group a page shows comes from the URL: ?group=team-it, otherwise the
   whole organisation. The filter in the header switches between them. */
(function () {
  var GROUPS = {
    'novanta': {
      key: 'novanta', label: 'Novanta B.V.',
      /* the response rate card on the overview */
      responded: 171, invited: 204, rate: 84, benchmark: 79, trend: 6
    },
    'team-it': {
      key: 'team-it', label: 'Team IT',
      responded: 21, invited: 24, rate: 88, benchmark: 79, trend: 9
    }
  };

  /* Per question: the benchmark, and the score per group for both surveys. */
  var QUESTIONS = [
    { theme: 'AI clarity', rows: [
      { q: 'I understand where AI is relevant in my work', bench: 76,
        v: { 'novanta': { before: 72, after: 81 }, 'team-it': { before: 66, after: 84 } } },
      { q: 'Novanta B.V. has clear guidelines and policies on how to use AI safely and securely', bench: 68,
        v: { 'novanta': { before: 57, after: 66 }, 'team-it': { before: 49, after: 71 } } },
      { q: 'I know where to go if I have questions about AI usage', bench: 71,
        v: { 'novanta': { before: 64, after: 74 }, 'team-it': { before: 58, after: 78 } } }
    ] },
    { theme: 'AI capability', rows: [
      { q: 'I feel confident in my ability to use AI effectively', bench: 64,
        v: { 'novanta': { before: 56, after: 66 }, 'team-it': { before: 61, after: 77 } } },
      { q: 'I would like to further develop my AI skills', bench: 82,
        v: { 'novanta': { before: 81, after: 84 }, 'team-it': { before: 84, after: 89 } } },
      { q: 'I have sufficient opportunities to develop my AI skills', bench: 60,
        v: { 'novanta': { before: 48, after: 55 }, 'team-it': { before: 44, after: 58 } } }
    ] },
    { theme: 'AI environment', rows: [
      { q: 'I feel comfortable being open about AI usage at work', bench: 82,
        v: { 'novanta': { before: 80, after: 87 }, 'team-it': { before: 83, after: 92 } } },
      { q: 'In my team, learning about and experimenting with AI is actively encouraged', bench: 76,
        v: { 'novanta': { before: 71, after: 82 }, 'team-it': { before: 74, after: 88 } } },
      { q: "My manager actively supports my team's use of AI", bench: 74,
        v: { 'novanta': { before: 70, after: 79 }, 'team-it': { before: 72, after: 86 } } },
      { q: 'The AI tools available to me fit well into existing systems and processes I use at work', bench: 70,
        v: { 'novanta': { before: 62, after: 70 }, 'team-it': { before: 55, after: 64 } } },
      { q: 'AI in our organization is managed in a way that makes me feel supported', bench: 71,
        v: { 'novanta': { before: 66, after: 76 }, 'team-it': { before: 60, after: 74 } } }
    ] },
    { theme: 'AI usage', rows: [
      { q: 'I feel positive about using AI in my work', bench: 79,
        v: { 'novanta': { before: 74, after: 83 }, 'team-it': { before: 78, after: 90 } } },
      { q: 'AI is a regular part of how I work', bench: 63,
        v: { 'novanta': { before: 51, after: 67 }, 'team-it': { before: 58, after: 81 } } },
      { q: 'I regularly explore new ways to use AI tools in my work', bench: 61,
        v: { 'novanta': { before: 48, after: 62 }, 'team-it': { before: 52, after: 73 } } }
    ] },
    { theme: 'AI impact', rows: [
      { q: 'AI tools help me achieve my work-related goals', bench: 70,
        v: { 'novanta': { before: 65, after: 74 }, 'team-it': { before: 68, after: 83 } } },
      { q: 'AI tools help improve my productivity', bench: 74,
        v: { 'novanta': { before: 68, after: 79 }, 'team-it': { before: 71, after: 87 } } }
    ] },
    { theme: 'AI wellbeing', rows: [
      { q: 'I feel secure in my employment as AI becomes more integrated into my work', bench: 66,
        v: { 'novanta': { before: 60, after: 61 }, 'team-it': { before: 51, after: 54 } } },
      { q: 'AI helps reduce my workload', bench: 65,
        v: { 'novanta': { before: 62, after: 68 }, 'team-it': { before: 57, after: 70 } } }
    ] }
  ];

  /* What each theme means, and the benchmark it is held against. */
  var THEME_INFO = {
    'AI clarity': { benchmark: 72,
      desc: "Clarity is the degree to which your employees understand where AI is relevant in their work. It also refers to how well they know the guidelines and support available to use it safely and responsibly." },
    'AI capability': { benchmark: 69,
      desc: "Capability is the degree to which your employees feel skilled and confident using AI in their work. It also refers to whether they have real opportunities to keep building on that skill." },
    'AI environment': { benchmark: 75,
      desc: "Environment is the degree to which your employees feel enabled and supported to use AI by the people and systems around them. It also refers to whether the organization is managing the shift to AI in a way that feels supportive rather than imposed." },
    'AI usage': { benchmark: 68,
      desc: "Usage is the degree to which AI has actually become part of how your employees work day to day, not just something they have been given access to. It also refers to how positively they experience that use, and how far they are pushing past the basics." },
    'AI impact': { benchmark: 72,
      desc: "Impact is the degree to which AI is delivering real, felt value in your employees' work, not just activity but outcomes. Job security and workload are reported separately under Wellbeing, so this score is always about the work itself." },
    'AI wellbeing': { benchmark: 66,
      desc: "Wellbeing captures what AI costs your employees personally, alongside what it gives their work. It asks whether AI is easing or adding to their workload, and whether they feel secure in their role as AI becomes more embedded in it." }
  };

  function current() {
    var asked = new URLSearchParams(location.search).get('group');
    return GROUPS[asked] || GROUPS['novanta'];
  }

  /* Every question of a group, flattened, newest score first. */
  function scores(key, period) {
    var out = [];
    QUESTIONS.forEach(function (g) {
      g.rows.forEach(function (r) {
        var v = r.v[key];
        if (v) out.push({ theme: g.theme, q: r.q, score: v[period || 'after'], prev: v.before, bench: r.bench });
      });
    });
    return out;
  }

  /* A theme scores the average of its questions, rounded. */
  function themes(key) {
    return QUESTIONS.map(function (g) {
      var rows = g.rows.filter(function (r) { return r.v[key]; });
      var avg = function (p) {
        return Math.round(rows.reduce(function (t, r) { return t + r.v[key][p]; }, 0) / rows.length);
      };
      var info = THEME_INFO[g.theme] || {};
      return {
        name: g.theme, current: avg('after'), previous: avg('before'),
        benchmark: info.benchmark, desc: info.desc,
        questions: rows.map(function (r) { return { q: r.q, s: r.v[key].after + '%' }; })
      };
    });
  }

  window.AIScan = {
    groups: GROUPS,
    questions: QUESTIONS,
    group: current,
    scores: scores,
    themes: themes,
    /* Keep the chosen group while walking between the scan's own screens. */
    link: function (href) {
      var g = current();
      return g.key === 'novanta' ? href : href + (href.indexOf('?') < 0 ? '?' : '&') + 'group=' + g.key;
    }
  };
})();
