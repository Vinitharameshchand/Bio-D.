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


// Hamburger toggle: works on every page load and across pages
document.addEventListener('DOMContentLoaded', function () {
  try {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    // Ensure accessible mapping
    if (!navMenu.id) navMenu.id = 'primary-navigation';
    hamburger.setAttribute('aria-controls', navMenu.id);
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');

    const root = document.body;
    const isOpen = () => root.classList.contains('nav-open');
    const open = () => {
      root.classList.add('nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      root.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    };
    const toggle = () => (isOpen() ? close() : open());

    // Click to toggle
    hamburger.addEventListener('click', toggle);
    // Keyboard support
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
    // Close when a nav link is clicked
    navMenu.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link) close();
    });
    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    // Click outside header closes the menu
    const header = document.querySelector('header, .navbar') || document.body;
    document.addEventListener('click', (e) => {
      if (!isOpen()) return;
      const withinHeader = header.contains(e.target);
      if (!withinHeader) close();
    }, true);
    
    // Active state for nav links (pill ring)
    const navLinks = Array.from(navMenu.querySelectorAll('a'));
    const setActiveByURL = () => {
      const path = (location.pathname || '').toLowerCase();
      navLinks.forEach((a) => a.classList.remove('is-active'));
      // Try to match by href filename or path segment
      let matched = false;
      for (const a of navLinks) {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (!href) continue;
        if (path.endsWith(href) || path.includes('/' + href)) {
          a.classList.add('is-active');
          matched = true;
          break;
        }
      }
      return matched;
    };
    setActiveByURL();

    // On click, show immediate feedback by adding is-active before navigation
    navLinks.forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.forEach((x) => x.classList.remove('is-active'));
        a.classList.add('is-active');
      });
    });
  } catch (_) {
    // no-op fail safe
  }
});

// Fixed header scroll animation (shared across pages)
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    if (window.scrollY > 10) navbar.classList.add('navbar-scrolled');
    else navbar.classList.remove('navbar-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});


// Count-up animation for stats numbers
document.addEventListener('DOMContentLoaded', function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Only animate numbers explicitly marked in HTML
  const nodes = Array.from(document.querySelectorAll('.stats-card-number[data-count="true"]'));
  if (!nodes.length) return;

  function parseTarget(text) {
    const hasPlus = /\+$/.test(text.trim());
    const digits = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
    return { value: digits, suffix: hasPlus ? '+' : '' };
  }

  function animateCount(el, to, suffix, duration = 800) {
    const start = 0;
    const t0 = performance.now();
    function step(t) {
      const p = Math.min(1, (t - t0) / duration);
      // easeOutCubic
      const e = 1 - Math.pow(1 - p, 3);
      const val = Math.round(start + (to - start) * e);
      el.textContent = `${val}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const seen = new WeakSet();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.3) return;
      const el = entry.target;
      if (seen.has(el)) return; // run once
      seen.add(el);
      const { value, suffix } = parseTarget(el.textContent || '0');
      const customDuration = parseInt(el.getAttribute('data-duration'), 10);
      const dur = Number.isFinite(customDuration) ? customDuration : 800;
      if (prefersReduced) {
        el.textContent = `${value}${suffix}`;
        io.unobserve(el);
        return;
      }
      animateCount(el, value, suffix, dur);
      io.unobserve(el);
    });
  }, { threshold: [0, 0.3, 0.6, 1] });

  nodes.forEach((el) => io.observe(el));

  // Also trigger when user reaches near the bottom of the page
  function triggerAllIfNearBottom() {
    const doc = document.documentElement;
    const scrolled = window.scrollY + window.innerHeight;
    const bottom = doc.scrollHeight - 200; // 200px from bottom
    if (scrolled >= bottom) {
      nodes.forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const { value, suffix } = parseTarget(el.textContent || '0');
        const customDuration = parseInt(el.getAttribute('data-duration'), 10);
        const dur = Number.isFinite(customDuration) ? customDuration : 800;
        if (prefersReduced) {
          el.textContent = `${value}${suffix}`;
          return;
        }
        animateCount(el, value, suffix, dur);
      });
      window.removeEventListener('scroll', triggerAllIfNearBottom, { passive: true });
    }
  }
  window.addEventListener('scroll', triggerAllIfNearBottom, { passive: true });
  // Run once on load in case page opens near bottom
  triggerAllIfNearBottom();
});

