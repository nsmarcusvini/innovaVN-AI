/* =============================================================
   WHATSAPP AI — Page Scripts
   Wizard, FAQ, Navbar, Scroll Animations, Interactions
   ============================================================= */

// ============================
// ANIMATE ON SCROLL
// ============================
(function () {
  if (!window.__inViewIO) {
    window.__inViewIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            window.__inViewIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      window.__inViewIO.observe(el);
    });
  });
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

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
  });
});


// ============================
// SMOOTH SCROLL
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


// ============================
// SETUP WIZARD
// ============================
document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 5;
  const progressBar = document.getElementById('wizard-progress-bar');
  const stepDots = document.querySelectorAll('.wai-wizard__step-dot');
  const steps = document.querySelectorAll('.wai-wizard__step');

  function updateWizard(step) {
    currentStep = step;

    // Update progress bar
    const progress = (step / totalSteps) * 100;
    progressBar.style.setProperty('--wizard-progress', progress + '%');

    // Update dots
    stepDots.forEach((dot) => {
      const dotStep = parseInt(dot.dataset.step);
      dot.classList.remove('active', 'completed');
      if (dotStep === step) {
        dot.classList.add('active');
      } else if (dotStep < step) {
        dot.classList.add('completed');
      }
    });

    // Update step visibility
    steps.forEach((s) => {
      s.classList.remove('active');
      if (parseInt(s.dataset.step) === step) {
        s.classList.add('active');
      }
    });

    // If success step, populate phone
    if (step === 5) {
      const phone = document.getElementById('whatsapp-number').value || '(11) 99999-9999';
      document.getElementById('success-phone').textContent = '+55 ' + phone;
    }
  }

  // Next buttons
  document.querySelectorAll('.wai-wizard__next').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.dataset.next);
      if (nextStep <= totalSteps) {
        updateWizard(nextStep);
      }
    });
  });

  // Prev buttons
  document.querySelectorAll('.wai-wizard__prev').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.dataset.prev);
      if (prevStep >= 1) {
        updateWizard(prevStep);
      }
    });
  });

  // Click on step dots
  stepDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.dataset.step);
      if (step <= currentStep) {
        updateWizard(step);
      }
    });
  });
});


// ============================
// PRICING BUTTON (FAKE LOADING)
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const btnActivate = document.getElementById('btn-activate');

  if (btnActivate) {
    btnActivate.addEventListener('click', () => {
      btnActivate.classList.add('loading');
      btnActivate.disabled = true;

      setTimeout(() => {
        btnActivate.classList.remove('loading');
        btnActivate.disabled = false;

        // Scroll to wizard
        const wizard = document.getElementById('configurar');
        if (wizard) {
          wizard.scrollIntoView({ behavior: 'smooth' });
        }
      }, 2000);
    });
  }
});


// ============================
// FAQ ACCORDION
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.wai-faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.wai-faq-question');
    const answer = item.querySelector('.wai-faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach((other) => {
        other.classList.remove('active');
        other.querySelector('.wai-faq-answer').style.maxHeight = null;
      });

      // Open clicked if not already active
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});


// ============================
// ADD RESPONSE (WIZARD STEP 4)
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.wai-add-response');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const list = document.querySelector('.wai-responses-list');
      const newItem = document.createElement('div');
      newItem.className = 'wai-response-item';
      newItem.innerHTML = `
        <div class="wai-response-question">
          <span class="wai-response-label">Pergunta do cliente</span>
          <input type="text" class="wai-input" placeholder="Ex: Tem desconto para pagamento a vista?">
        </div>
        <div class="wai-response-answer">
          <span class="wai-response-label">Resposta da IA</span>
          <textarea class="wai-textarea" placeholder="Ex: Sim! Oferecemos 10% de desconto no PIX."></textarea>
        </div>
      `;
      list.insertBefore(newItem, addBtn);

      // Animate entry
      newItem.style.opacity = '0';
      newItem.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        newItem.style.transition = 'all 0.3s ease';
        newItem.style.opacity = '1';
        newItem.style.transform = 'translateY(0)';
      });
    });
  }
});


// ============================
// PHONE INPUT MASK
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('whatsapp-number');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
      } else if (value.length > 2) {
        value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
      } else if (value.length > 0) {
        value = '(' + value;
      }

      e.target.value = value;
    });
  }
});
