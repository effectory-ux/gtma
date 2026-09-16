/* Ties the results screens back into the Surveys page.
   The shell of these screens (main nav, breadcrumb) is rendered by effectiveness.js, which
   lives in the design system, so the flow-specific links are wired here — in this repo —
   right after that render. Loaded by every <group>-<moment>-<screen>.html. */
(function () {
  var HOME = 'surveys.html';
  var root = document.getElementById('root');

  /* Results are opened from the survey list, so "All surveys" is the active sub-item. */
  function markActive() {
    document.querySelectorAll('.mn-sub .mn-subitem').forEach(function (a) {
      /* The sidebar speaks the reader's language, so compare against the
         translated label rather than the English one. */
      var label = window.tr ? tr('All surveys') : 'All surveys';
      var isAll = a.textContent.trim() === label;
      a.classList.toggle('is-active', isAll);
      if (isAll) {
        a.setAttribute('href', HOME);
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }
  markActive();
  /* A language or theme switch re-renders #root from scratch, so re-apply it then. */
  if (root) new MutationObserver(markActive).observe(root, { childList: true });

  /* Back leaves the survey and returns to the list. Delegated, so it survives that
     same re-render. */
  document.addEventListener('click', function (e) {
    if (e.target.closest('.breadcrumb .btn')) location.href = HOME;
  });
})();
