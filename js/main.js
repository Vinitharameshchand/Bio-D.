// Scroll reveal animations for elements with [data-animate]
// - Adds the class 'in-view' when elements enter viewport
// - Supports simple staggering using CSS var --reveal-delay

(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // respect user preference

  const animated = Array.from(document.querySelectorAll('[data-animate]'));
  if (!animated.length) return;

  // Group elements by their nearest parent with data-animate-group (or section), for stagger
  function groupFor(el) {
    return el.closest('[data-animate-group]') || el.closest('section') || document.body;
  }

  const groups = new Map();
  animated.forEach((el) => {
    const key = groupFor(el);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });

  // Assign stagger delays within each group
  groups.forEach((els) => {
    els.forEach((el, idx) => {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', `${Math.min(idx * 100, 600)}ms`);
      }
    });
  });

  // Intersection observer to toggle 'in-view'
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
        entry.target.classList.add('in-view');
      } else {
        // Remove if you want re-animate on scroll back up; keep if one-time only
        entry.target.classList.remove('in-view');
      }
    });
  }, { root: null, threshold: [0, 0.2, 0.5, 1] });

  animated.forEach((el) => io.observe(el));
})();

