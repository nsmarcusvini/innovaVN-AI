/* =============================================================
   INNOVAVN AI — Scripts
   Navbar, Mobile Menu, Scroll Animations, Smooth Scroll
   ============================================================= */

// ============================
// ANIMATE ON SCROLL (Inspired by design-system.html reference)
// ============================
(function () {
  const once = true;

  if (!window.__inViewIO) {
    window.__inViewIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (once) window.__inViewIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
  }

  window.initInViewAnimations = function (selector = '.animate-on-scroll') {
    document.querySelectorAll(selector).forEach((el) => {
      window.__inViewIO.observe(el);
    });
  };

  document.addEventListener('DOMContentLoaded', () => initInViewAnimations());
})();


// ============================
// NAVBAR SCROLL EFFECT
// ============================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ============================
// MOBILE MENU TOGGLE
// ============================
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
  });
});


// ============================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
