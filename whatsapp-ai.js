/* =============================================================
   WHATSAPP AI — Page Scripts
   Wizard, FAQ, Navbar, Scroll Animations, API Integration
   ============================================================= */

// ============================
// CONFIG
// ============================
const API_BASE = 'https://n8n.nsdigitalsolution.cloud/webhook';

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
  const totalSteps = 6;
  const progressBar = document.getElementById('wizard-progress-bar');
  const stepDots = document.querySelectorAll('.wai-wizard__step-dot');
  const steps = document.querySelectorAll('.wai-wizard__step');

  // Label maps for display
  const toneLabels = {
    profissional: 'Profissional',
    amigavel: 'Amigavel',
    casual: 'Casual',
    persuasivo: 'Persuasivo'
  };
  const styleLabels = {
    direto: 'Direto',
    detalhado: 'Detalhado',
    consultivo: 'Consultivo',
    agressivo: 'Vendedor',
    simples: 'Simples'
  };
  const goalLabels = {
    vender: 'Vender produtos',
    suporte: 'Suporte ao cliente',
    leads: 'Captar leads',
    agendamento: 'Agendamentos'
  };

  // ---- Data Collection ----
  function collectWizardData() {
    const phone = document.getElementById('whatsapp-number').value.replace(/\D/g, '');
    const businessParts = [
      document.getElementById('business-what')?.value?.trim(),
      document.getElementById('business-products')?.value?.trim(),
      document.getElementById('business-audience')?.value?.trim()
    ].filter(Boolean);

    return {
      aiName: document.getElementById('ai-name').value.trim(),
      whatsappNumber: '55' + phone,
      tone: document.querySelector('input[name="tone"]:checked')?.value || 'profissional',
      style: document.querySelector('input[name="style"]:checked')?.value || 'direto',
      behavior: document.querySelector('input[name="behavior"]:checked')?.value || 'objetivo',
      businessContext: businessParts.join('. '),
      goal: document.querySelector('input[name="goal"]:checked')?.value || 'vender',
      faq: collectFaqItems(),
      plan: getSelectedPlan()
    };
  }

  function collectFaqItems() {
    const items = [];
    document.querySelectorAll('.wai-response-item').forEach(item => {
      const q = item.querySelector('.wai-response-question input')?.value?.trim();
      const a = item.querySelector('.wai-response-answer textarea')?.value?.trim();
      if (q && a) items.push({ q, a });
    });
    return items;
  }

  function getSelectedPlan() {
    return 'Basico';
  }

  // ---- Preview Generator ----
  function generatePreview() {
    const data = collectWizardData();

    const greetings = {
      profissional: `Ola! Sou ${data.aiName || 'sua assistente'}, assistente virtual. Como posso ajuda-lo hoje?`,
      amigavel: `Oi! 😊 Eu sou ${data.aiName || 'sua assistente'}! Que bom que voce entrou em contato! Como posso te ajudar?`,
      casual: `E ai! Sou ${data.aiName || 'sua assistente'}, to aqui pra te ajudar. Manda ai o que precisa!`,
      persuasivo: `Ola! Sou ${data.aiName || 'sua assistente'} e tenho otimas novidades pra voce! O que esta procurando hoje?`
    };

    const goalSuffix = {
      vender: ' Temos ofertas incriveis esperando por voce!',
      suporte: ' Estou aqui para resolver qualquer duvida.',
      leads: ' Me conta um pouco sobre o que voce precisa?',
      agendamento: ' Quer agendar um horario? Posso te ajudar agora mesmo!'
    };

    let msg = greetings[data.tone] || greetings.profissional;
    msg += goalSuffix[data.goal] || '';

    const previewName = document.getElementById('preview-ai-name');
    const previewMsg = document.getElementById('preview-ai-message');
    if (previewName) previewName.textContent = data.aiName || 'Sua IA';
    if (previewMsg) previewMsg.textContent = msg;
  }

  // ---- Summary Populator ----
  function populateSummary() {
    const data = collectWizardData();
    const phone = document.getElementById('whatsapp-number').value || '';

    document.getElementById('summary-ai-name').textContent = data.aiName || '-';
    document.getElementById('summary-phone').textContent = '+55 ' + phone;
    document.getElementById('summary-tone').textContent = toneLabels[data.tone] || data.tone;
    document.getElementById('summary-style').textContent = styleLabels[data.style] || data.style;
    document.getElementById('summary-goal').textContent = goalLabels[data.goal] || data.goal;
  }

  // ---- Validation ----
  function validateStep(step) {
    hideError(step);

    switch (step) {
      case 1: {
        const aiName = document.getElementById('ai-name').value.trim();
        const phone = document.getElementById('whatsapp-number').value.replace(/\D/g, '');
        if (!aiName) return showError(1, 'Informe o nome da sua IA');
        if (phone.length < 10) return showError(1, 'Informe um numero de WhatsApp valido');
        return true;
      }
      case 2: {
        const tone = document.querySelector('input[name="tone"]:checked');
        if (!tone) return showError(2, 'Selecione um tom de voz');
        return true;
      }
      case 3: {
        const what = document.getElementById('business-what').value.trim();
        if (!what) return showError(3, 'Descreva o que sua empresa faz');
        return true;
      }
      case 4: {
        const goal = document.querySelector('input[name="goal"]:checked');
        if (!goal) return showError(4, 'Selecione um objetivo');
        return true;
      }
      default:
        return true;
    }
  }

  function showError(step, msg) {
    const el = document.getElementById('wizard-error-' + step);
    if (el) {
      el.textContent = msg;
      el.style.display = 'block';
    }
    return false;
  }

  function hideError(step) {
    const el = document.getElementById('wizard-error-' + step);
    if (el) el.style.display = 'none';
  }

  // ---- Wizard Navigation ----
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

    // Step-specific actions
    if (step === 5) {
      generatePreview();
    }
    if (step === 6) {
      populateSummary();
    }
  }

  // Next buttons (with validation)
  document.querySelectorAll('.wai-wizard__next').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.dataset.next);
      if (nextStep <= totalSteps && validateStep(currentStep)) {
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

  // ---- Activate AI Button ----
  let connectionPollInterval = null;

  function stopPolling() {
    if (connectionPollInterval) {
      clearInterval(connectionPollInterval);
      connectionPollInterval = null;
    }
  }

  function showQRCode(qrCode, instanceName, wizardData) {
    const activateView = document.getElementById('wizard-activate-view');
    const qrcodeView = document.getElementById('wizard-qrcode-view');
    const qrcodeImage = document.getElementById('qrcode-image');
    const qrcodeLoading = document.getElementById('qrcode-loading');
    const qrcodeStatus = document.getElementById('qrcode-status');

    if (activateView) activateView.style.display = 'none';
    if (qrcodeView) qrcodeView.style.display = 'block';

    // Show QR code image
    if (qrcodeImage && qrCode) {
      const src = qrCode.startsWith('data:') ? qrCode : 'data:image/png;base64,' + qrCode;
      qrcodeImage.src = src;
      qrcodeImage.style.display = 'block';
      if (qrcodeLoading) qrcodeLoading.style.display = 'none';
    }

    // Start polling for connection
    stopPolling();
    connectionPollInterval = setInterval(async () => {
      try {
        const res = await fetch(API_BASE + '/check-connection?instance=' + encodeURIComponent(instanceName));
        const status = await res.json();

        if (status.connected) {
          stopPolling();

          // Show success
          if (qrcodeView) qrcodeView.style.display = 'none';
          const successView = document.getElementById('wizard-success-view');
          if (successView) successView.style.display = 'block';

          const successName = document.getElementById('success-ai-name');
          const successPhone = document.getElementById('success-phone');
          if (successName) successName.textContent = wizardData.aiName;
          if (successPhone) successPhone.textContent = '+55 ' + document.getElementById('whatsapp-number').value;
        }
      } catch (e) {
        // Polling error — continue trying
      }
    }, 3000);

    // Stop polling after 2 minutes (QR code expires)
    setTimeout(() => {
      if (connectionPollInterval) {
        stopPolling();
        if (qrcodeStatus) qrcodeStatus.innerHTML = '<span style="color:var(--color-error)">QR Code expirado</span>';
        const btnNewQR = document.getElementById('btn-new-qrcode');
        if (btnNewQR) btnNewQR.style.display = 'inline-flex';
      }
    }, 120000);
  }

  const btnActivateAI = document.getElementById('btn-activate-ai');
  if (btnActivateAI) {
    btnActivateAI.addEventListener('click', async () => {
      const btnText = btnActivateAI.querySelector('.wai-btn-text');
      const btnLoader = btnActivateAI.querySelector('.wai-btn-loader');
      const btnArrow = btnActivateAI.querySelector('.wai-btn-arrow');

      btnActivateAI.disabled = true;
      if (btnText) btnText.textContent = 'Ativando...';
      if (btnLoader) btnLoader.style.display = 'inline-flex';
      if (btnArrow) btnArrow.style.display = 'none';
      hideError(6);

      const data = collectWizardData();

      try {
        const response = await fetch(API_BASE + '/setup-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || 'Falha na ativacao');
        }

        const result = await response.json();

        // Store locally
        localStorage.setItem('innovavn_userId', result.userId || '');
        localStorage.setItem('innovavn_phone', data.whatsappNumber);
        localStorage.setItem('innovavn_instance', result.instanceName || '');

        // Show QR Code screen
        if (result.qrCode) {
          showQRCode(result.qrCode, result.instanceName, data);
        } else {
          // No QR code = already connected or error
          showError(6, 'Nao foi possivel gerar o QR Code. Tente novamente.');
          btnActivateAI.disabled = false;
          if (btnText) btnText.textContent = 'Ativar agora';
          if (btnLoader) btnLoader.style.display = 'none';
          if (btnArrow) btnArrow.style.display = '';
        }

      } catch (err) {
        showError(6, err.message || 'Erro ao ativar. Tente novamente.');
        btnActivateAI.disabled = false;
        if (btnText) btnText.textContent = 'Ativar agora';
        if (btnLoader) btnLoader.style.display = 'none';
        if (btnArrow) btnArrow.style.display = '';
      }
    });
  }

  // ---- New QR Code Button ----
  const btnNewQR = document.getElementById('btn-new-qrcode');
  if (btnNewQR) {
    btnNewQR.addEventListener('click', async () => {
      btnNewQR.style.display = 'none';
      const qrcodeLoading = document.getElementById('qrcode-loading');
      const qrcodeImage = document.getElementById('qrcode-image');
      const qrcodeStatus = document.getElementById('qrcode-status');
      const errorQR = document.getElementById('wizard-error-qr');

      if (qrcodeLoading) qrcodeLoading.style.display = 'flex';
      if (qrcodeImage) qrcodeImage.style.display = 'none';
      if (qrcodeStatus) qrcodeStatus.innerHTML = '<span class="wai-spinner wai-spinner--sm"></span><span>Aguardando conexao...</span>';
      if (errorQR) errorQR.style.display = 'none';

      const data = collectWizardData();

      try {
        const response = await fetch(API_BASE + '/setup-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.qrCode) {
          showQRCode(result.qrCode, result.instanceName, data);
        } else {
          if (errorQR) {
            errorQR.textContent = 'Nao foi possivel gerar novo QR Code.';
            errorQR.style.display = 'block';
          }
          btnNewQR.style.display = 'inline-flex';
        }
      } catch (e) {
        if (errorQR) {
          errorQR.textContent = 'Erro ao gerar QR Code. Tente novamente.';
          errorQR.style.display = 'block';
        }
        btnNewQR.style.display = 'inline-flex';
      }
    });
  }
});


// ============================
// PRICING BUTTON
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
      }, 1000);
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
// ADD RESPONSE (FAQ in Wizard)
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.wai-add-response');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const list = addBtn.closest('.wai-responses-list');
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
