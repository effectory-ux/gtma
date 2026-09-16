/* ── The group filter on the AI Adoption Scan screens ─────
   Same behaviour as the Your voice results: the filter in the header is a
   toggle, not a menu. Clicking it swaps the group and keeps you on the tab you
   were reading, the way effectiveness.js does it for those screens. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    if (!window.AIScan) return;
    var group = window.AIScan.group();

    /* The scan's own tabs stay inside this group. */
    document.querySelectorAll('a[href^="ai-adoption-scan-"]').forEach(function (a) {
      a.href = window.AIScan.link(a.getAttribute('href'));
    });

    var btn = document.querySelector('.results-filters .sel-btn');
    if (!btn) return;
    var value = btn.querySelector('.sel-btn-value');
    if (value) value.textContent = group.label;

    btn.addEventListener('click', function () {
      var other = group.key === 'novanta' ? 'team-it' : 'novanta';
      var here = location.pathname.split('/').pop();
      /* Stay on the view you were reading: the tab is in the hash now. */
      location.href = (other === 'novanta' ? here : here + '?group=' + other) + location.hash;
    });
  });
})();
