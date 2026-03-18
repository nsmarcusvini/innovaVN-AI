/* =============================================================
   INNOVAVN AI — ADMIN DASHBOARD
   admin.js — Auth guard, mock data, all section logic
   ============================================================= */

(function () {
  'use strict';

  /* ════════════════════════════════════════
     AUTH GUARD
     ════════════════════════════════════════ */
  function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) { window.location.replace('login.html'); return null; }
    try {
      const payload = JSON.parse(atob(token));
      if (payload.role !== 'admin' || payload.exp < Date.now()) {
        localStorage.removeItem('adminToken');
        window.location.replace('login.html');
        return null;
      }
      return payload;
    } catch (e) {
      localStorage.removeItem('adminToken');
      window.location.replace('login.html');
      return null;
    }
  }

  const currentUser = checkAuth();
  if (!currentUser) return;

  /* ════════════════════════════════════════
     MOCK DATA — API-ready structure
     ════════════════════════════════════════ */
  const MOCK_CLIENTS = [
    { id: 1,  name: 'Boutique Elegance',    email: 'contato@elegance.com.br',    phone: '(11) 98765-4321', status: 'active',    plan: 'Pro',        joinDate: '2024-08-15', lastPayment: '2026-03-01', notes: 'Cliente VIP. Prefere contato por e-mail.', paymentHistory: [{ date:'2026-03-01',amount:297,status:'paid',method:'Cartão de Crédito' },{ date:'2026-02-01',amount:297,status:'paid',method:'Cartão de Crédito' },{ date:'2026-01-01',amount:297,status:'paid',method:'PIX' }] },
    { id: 2,  name: 'TechFlow Solutions',   email: 'admin@techflow.io',           phone: '(11) 97654-3210', status: 'active',    plan: 'Business',   joinDate: '2024-06-01', lastPayment: '2026-03-01', notes: '', paymentHistory: [{ date:'2026-03-01',amount:597,status:'paid',method:'Cartão de Crédito' },{ date:'2026-02-01',amount:597,status:'paid',method:'Cartão de Crédito' }] },
    { id: 3,  name: 'Padaria Artesanal',    email: 'padaria@artesanal.com.br',    phone: '(21) 99876-5432', status: 'active',    plan: 'Starter',    joinDate: '2025-01-10', lastPayment: '2026-03-01', notes: 'Dono é o Sr. Marcos. Ligar sempre antes das 14h.', paymentHistory: [{ date:'2026-03-01',amount:147,status:'paid',method:'PIX' },{ date:'2026-02-01',amount:147,status:'paid',method:'PIX' }] },
    { id: 4,  name: 'Clínica VitaSaúde',   email: 'ti@vitasaude.med.br',         phone: '(31) 98123-4567', status: 'active',    plan: 'Business',   joinDate: '2024-11-20', lastPayment: '2026-02-28', notes: '', paymentHistory: [{ date:'2026-02-28',amount:597,status:'paid',method:'Boleto' },{ date:'2026-01-28',amount:597,status:'paid',method:'Boleto' }] },
    { id: 5,  name: 'Autopeças Rodrigues',  email: 'ger@autopecas.com',           phone: '(41) 97543-2109', status: 'inactive',  plan: 'Starter',    joinDate: '2024-09-05', lastPayment: '2025-12-01', notes: 'Tentou cancelar em dezembro. Aguardando retorno.', paymentHistory: [{ date:'2025-12-01',amount:147,status:'paid',method:'PIX' },{ date:'2025-11-01',amount:147,status:'failed',method:'PIX' }] },
    { id: 6,  name: 'Academia FitPower',    email: 'academia@fitpower.com.br',    phone: '(85) 99210-3456', status: 'active',    plan: 'Pro',        joinDate: '2025-03-01', lastPayment: '2026-03-01', notes: '', paymentHistory: [{ date:'2026-03-01',amount:297,status:'paid',method:'Cartão de Crédito' },{ date:'2026-02-01',amount:297,status:'paid',method:'Cartão de Crédito' }] },
    { id: 7,  name: 'E-comm Express',       email: 'ops@ecommexpress.com.br',     phone: '(11) 96789-0123', status: 'trial',     plan: 'Business',   joinDate: '2026-03-01', lastPayment: '—',          notes: 'Trial de 14 dias. Demo agendada para 20/03.', paymentHistory: [] },
    { id: 8,  name: 'Studio Bella Hair',    email: 'studio@bellahair.com',        phone: '(21) 98456-7890', status: 'active',    plan: 'Starter',    joinDate: '2025-05-12', lastPayment: '2026-03-01', notes: '', paymentHistory: [{ date:'2026-03-01',amount:147,status:'paid',method:'PIX' }] },
    { id: 9,  name: 'Construtora Apex',     email: 'comercial@apex.eng.br',       phone: '(11) 95678-9012', status: 'active',    plan: 'Enterprise', joinDate: '2024-04-01', lastPayment: '2026-03-01', notes: 'Contrato anual. Renovação em abril/2026.', paymentHistory: [{ date:'2026-03-01',amount:1197,status:'paid',method:'Transferência' },{ date:'2026-02-01',amount:1197,status:'paid',method:'Transferência' }] },
    { id: 10, name: 'PetShop Amigos',       email: 'contato@petshopamigos.com',   phone: '(31) 99012-3456', status: 'cancelled', plan: 'Starter',    joinDate: '2025-02-01', lastPayment: '2025-10-01', notes: 'Cancelou por questão financeira. Retornar em Q3.', paymentHistory: [{ date:'2025-10-01',amount:147,status:'paid',method:'PIX' },{ date:'2025-09-01',amount:147,status:'failed',method:'PIX' }] },
    { id: 11, name: 'Farmácia Popular',     email: 'adm@farmaciapopular.com.br',  phone: '(41) 98901-2345', status: 'active',    plan: 'Pro',        joinDate: '2025-07-15', lastPayment: '2026-03-01', notes: '', paymentHistory: [{ date:'2026-03-01',amount:297,status:'paid',method:'Cartão de Crédito' }] },
    { id: 12, name: 'Imobiliária Horizonte',email: 'ti@imobilhorizonte.com.br',   phone: '(11) 97890-1234', status: 'active',    plan: 'Business',   joinDate: '2024-12-01', lastPayment: '2026-03-01', notes: '', paymentHistory: [{ date:'2026-03-01',amount:597,status:'paid',method:'Boleto' }] },
    { id: 13, name: 'Restaurante Sabores',  email: 'gerencia@sabores.rest',        phone: '(21) 96789-0123', status: 'active',    plan: 'Starter',    joinDate: '2025-09-01', lastPayment: '2026-02-28', notes: '', paymentHistory: [{ date:'2026-02-28',amount:147,status:'paid',method:'PIX' }] },
    { id: 14, name: 'FinTech Crédito+',    email: 'dev@creditomais.com.br',      phone: '(11) 95432-1098', status: 'active',    plan: 'Enterprise', joinDate: '2025-06-01', lastPayment: '2026-03-01', notes: 'Solicitou integração personalizada. Em andamento.', paymentHistory: [{ date:'2026-03-01',amount:1197,status:'paid',method:'Transferência' }] },
    { id: 15, name: 'ONG EduMais',          email: 'tic@edumais.org.br',           phone: '(61) 99321-0987', status: 'inactive',  plan: 'Starter',    joinDate: '2024-10-01', lastPayment: '2025-11-01', notes: 'Desconto social aplicado. Verificar renovação.', paymentHistory: [{ date:'2025-11-01',amount:97,status:'paid',method:'PIX' }] },
  ];

  const MOCK_PAYMENTS = [
    { id: 'PAY-001', clientId: 1,  clientName: 'Boutique Elegance',    amount: 297,  date: '2026-03-01', status: 'paid',    method: 'Cartão de Crédito', invoiceId: 'INV-2026031' },
    { id: 'PAY-002', clientId: 2,  clientName: 'TechFlow Solutions',   amount: 597,  date: '2026-03-01', status: 'paid',    method: 'Cartão de Crédito', invoiceId: 'INV-2026032' },
    { id: 'PAY-003', clientId: 3,  clientName: 'Padaria Artesanal',    amount: 147,  date: '2026-03-01', status: 'paid',    method: 'PIX',               invoiceId: 'INV-2026033' },
    { id: 'PAY-004', clientId: 6,  clientName: 'Academia FitPower',    amount: 297,  date: '2026-03-01', status: 'paid',    method: 'Cartão de Crédito', invoiceId: 'INV-2026034' },
    { id: 'PAY-005', clientId: 8,  clientName: 'Studio Bella Hair',    amount: 147,  date: '2026-03-01', status: 'paid',    method: 'PIX',               invoiceId: 'INV-2026035' },
    { id: 'PAY-006', clientId: 9,  clientName: 'Construtora Apex',     amount: 1197, date: '2026-03-01', status: 'paid',    method: 'Transferência',     invoiceId: 'INV-2026036' },
    { id: 'PAY-007', clientId: 11, clientName: 'Farmácia Popular',     amount: 297,  date: '2026-03-01', status: 'paid',    method: 'Cartão de Crédito', invoiceId: 'INV-2026037' },
    { id: 'PAY-008', clientId: 12, clientName: 'Imobiliária Horizonte',amount: 597,  date: '2026-03-01', status: 'paid',    method: 'Boleto',            invoiceId: 'INV-2026038' },
    { id: 'PAY-009', clientId: 14, clientName: 'FinTech Crédito+',    amount: 1197, date: '2026-03-01', status: 'paid',    method: 'Transferência',     invoiceId: 'INV-2026039' },
    { id: 'PAY-010', clientId: 4,  clientName: 'Clínica VitaSaúde',   amount: 597,  date: '2026-02-28', status: 'paid',    method: 'Boleto',            invoiceId: 'INV-2026021' },
    { id: 'PAY-011', clientId: 13, clientName: 'Restaurante Sabores',  amount: 147,  date: '2026-02-28', status: 'paid',    method: 'PIX',               invoiceId: 'INV-2026022' },
    { id: 'PAY-012', clientId: 1,  clientName: 'Boutique Elegance',    amount: 297,  date: '2026-02-01', status: 'paid',    method: 'Cartão de Crédito', invoiceId: 'INV-2026023' },
    { id: 'PAY-013', clientId: 2,  clientName: 'TechFlow Solutions',   amount: 597,  date: '2026-02-01', status: 'paid',    method: 'Cartão de Crédito', invoiceId: 'INV-2026024' },
    { id: 'PAY-014', clientId: 3,  clientName: 'Padaria Artesanal',    amount: 147,  date: '2026-02-01', status: 'paid',    method: 'PIX',               invoiceId: 'INV-2026025' },
    { id: 'PAY-015', clientId: 7,  clientName: 'E-comm Express',       amount: 597,  date: '2026-02-15', status: 'pending', method: 'Boleto',            invoiceId: 'INV-2026026' },
    { id: 'PAY-016', clientId: 5,  clientName: 'Autopeças Rodrigues',  amount: 147,  date: '2026-01-01', status: 'failed',  method: 'PIX',               invoiceId: 'INV-2026011' },
    { id: 'PAY-017', clientId: 6,  clientName: 'Academia FitPower',    amount: 297,  date: '2026-02-01', status: 'paid',    method: 'Cartão de Crédito', invoiceId: 'INV-2026027' },
    { id: 'PAY-018', clientId: 9,  clientName: 'Construtora Apex',     amount: 1197, date: '2026-02-01', status: 'paid',    method: 'Transferência',     invoiceId: 'INV-2026028' },
    { id: 'PAY-019', clientId: 10, clientName: 'PetShop Amigos',       amount: 147,  date: '2025-10-01', status: 'paid',    method: 'PIX',               invoiceId: 'INV-20251001' },
    { id: 'PAY-020', clientId: 15, clientName: 'ONG EduMais',          amount: 97,   date: '2025-11-01', status: 'paid',    method: 'PIX',               invoiceId: 'INV-20251101' },
  ];

  const MOCK_PLANS = [
    { id: 1, name: 'Starter',    price: 147,  status: 'active',   subscriberCount: 5,  featured: false, features: ['1 número WhatsApp','500 mensagens/mês','Respostas automáticas','Suporte por e-mail','Dashboard básico'] },
    { id: 2, name: 'Pro',        price: 297,  status: 'active',   subscriberCount: 4,  featured: true,  features: ['3 números WhatsApp','5.000 mensagens/mês','IA avançada','Suporte prioritário','Analytics completo','Integrações básicas'] },
    { id: 3, name: 'Business',   price: 597,  status: 'active',   subscriberCount: 4,  featured: false, features: ['10 números WhatsApp','20.000 mensagens/mês','IA personalizada','Suporte 24/7','API access','Integrações avançadas','Relatórios customizados'] },
    { id: 4, name: 'Enterprise', price: 1197, status: 'active',   subscriberCount: 2,  featured: false, features: ['Números ilimitados','Mensagens ilimitadas','IA dedicada','Gerente de conta','SLA garantido','Onboarding dedicado','Contrato anual'] },
  ];

  const MOCK_METRICS = {
    activeClients: 11,
    mrr: 7527,
    totalRevenue: 89132,
    newClientsThisMonth: 2,
    revenueByMonth: [4210, 4890, 5340, 5890, 6450, 7120, 6980, 7310, 6870, 7640, 7200, 7527],
    clientGrowthByMonth: [8, 9, 9, 10, 10, 11, 11, 12, 13, 13, 14, 15],
    retentionRate: 94.8,
    monthLabels: ['Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez','Jan','Fev','Mar'],
  };

  /* ════════════════════════════════════════
     UTILITIES
     ════════════════════════════════════════ */
  function fmt(n) {
    return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
  }

  function fmtDate(d) {
    if (!d || d === '—') return '—';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  function initials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  function avatarColor(name) {
    const colors = [
      'linear-gradient(135deg,#00B894,#0EA5E9)',
      'linear-gradient(135deg,#8B5CF6,#EC4899)',
      'linear-gradient(135deg,#F97316,#EAB308)',
      'linear-gradient(135deg,#0EA5E9,#6366F1)',
      'linear-gradient(135deg,#10B981,#14B8A6)',
    ];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + (h << 5) - h;
    return colors[Math.abs(h) % colors.length];
  }

  function statusBadge(status) {
    const map = {
      active:    ['badge--active',    'Ativo'],
      inactive:  ['badge--inactive',  'Inativo'],
      trial:     ['badge--trial',     'Trial'],
      cancelled: ['badge--cancelled', 'Cancelado'],
      paid:      ['badge--paid',      'Pago'],
      pending:   ['badge--pending',   'Pendente'],
      failed:    ['badge--failed',    'Falhou'],
    };
    const [cls, label] = map[status] || ['badge--inactive', status];
    return `<span class="badge ${cls}">${label}</span>`;
  }

  /* ════════════════════════════════════════
     TOAST NOTIFICATIONS
     ════════════════════════════════════════ */
  const ICONS = {
    success: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info:    '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  };

  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `${ICONS[type] || ICONS.info}${message}<button class="toast-close" aria-label="Fechar">&times;</button>`;
    container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));
    setTimeout(() => dismissToast(toast), 4000);
  }

  function dismissToast(toast) {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }

  /* ════════════════════════════════════════
     NAVIGATION
     ════════════════════════════════════════ */
  const SECTION_TITLES = {
    overview:      'Dashboard',
    clients:       'Clientes',
    payments:      'Pagamentos',
    reports:       'Relatórios',
    subscriptions: 'Assinaturas',
    settings:      'Configurações',
  };

  let currentSection = 'overview';
  let chartsInitialized = false;

  function navigateTo(section) {
    if (!SECTION_TITLES[section]) return;
    currentSection = section;

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.section === section);
    });

    // Update sections
    document.querySelectorAll('.admin-section').forEach(el => {
      el.classList.toggle('active', el.id === `section-${section}`);
    });

    // Update topbar title
    document.getElementById('topbarTitle').textContent = SECTION_TITLES[section];

    // Initialize section content
    if (section === 'overview' && !chartsInitialized) {
      initOverviewCharts();
      chartsInitialized = true;
    }
    if (section === 'clients')       renderClients();
    if (section === 'payments')      renderPayments();
    if (section === 'reports')       renderReports();
    if (section === 'subscriptions') renderSubscriptions();

    // Close mobile sidebar
    closeMobileSidebar();
  }

  // Sidebar nav
  document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.section));
  });

  // Settings dropdown link
  document.getElementById('dropdownSettings').addEventListener('click', () => {
    document.getElementById('profileDropdown').classList.remove('open');
    navigateTo('settings');
  });

  /* ════════════════════════════════════════
     SIDEBAR COLLAPSE
     ════════════════════════════════════════ */
  const sidebar = document.getElementById('adminSidebar');

  document.getElementById('collapseBtn').addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // Mobile hamburger
  const overlay = document.getElementById('sidebarOverlay');

  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('visible');
  });

  overlay.addEventListener('click', closeMobileSidebar);

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('visible');
  }

  /* ════════════════════════════════════════
     PROFILE DROPDOWN
     ════════════════════════════════════════ */
  const profileToggle  = document.getElementById('profileToggle');
  const profileDropdown = document.getElementById('profileDropdown');

  // Set admin name
  document.getElementById('topbarName').textContent = currentUser.name.split(' ')[0];
  document.getElementById('topbarAvatar').textContent = initials(currentUser.name);
  document.getElementById('topbarAvatar').style.background = avatarColor(currentUser.name);

  profileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => profileDropdown.classList.remove('open'));

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.replace('login.html');
  });

  /* ════════════════════════════════════════
     GLOBAL SEARCH
     ════════════════════════════════════════ */
  document.getElementById('globalSearch').addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    if (!q) return;

    // If on clients section, forward to client search
    if (currentSection === 'clients') {
      const cs = document.getElementById('clientSearch');
      if (cs) { cs.value = q; filterClients(); }
    } else if (currentSection === 'payments') {
      const ps = document.getElementById('paymentSearch');
      if (ps) { ps.value = q; filterPayments(); }
    } else {
      // Navigate to clients and search
      navigateTo('clients');
      setTimeout(() => {
        const cs = document.getElementById('clientSearch');
        if (cs) { cs.value = q; filterClients(); }
      }, 50);
    }
  });

  /* ════════════════════════════════════════
     SECTION: OVERVIEW
     ════════════════════════════════════════ */
  function renderOverviewStats() {
    const m = MOCK_METRICS;
    const stats = [
      { label: 'Clientes Ativos', value: m.activeClients, trend: '+2', trendUp: true, meta: 'vs. mês anterior', iconClass: 'stat-icon-green', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
      { label: 'MRR', value: fmt(m.mrr), trend: '+12%', trendUp: true, meta: 'Receita recorrente mensal', iconClass: 'stat-icon-blue', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
      { label: 'Receita Total', value: fmt(m.totalRevenue), trend: '+8%', trendUp: true, meta: 'Desde o início', iconClass: 'stat-icon-purple', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
      { label: 'Novos este mês', value: m.newClientsThisMonth, trend: '+1', trendUp: true, meta: 'Clientes adquiridos', iconClass: 'stat-icon-orange', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>' },
    ];

    document.getElementById('overviewStats').innerHTML = stats.map(s => `
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">${s.label}</span>
          <div class="stat-card-icon ${s.iconClass}">${s.icon}</div>
        </div>
        <div class="stat-card-value">${s.value}</div>
        <div>
          <span class="stat-card-trend ${s.trendUp ? 'trend-up' : 'trend-down'}">${s.trendUp ? '▲' : '▼'} ${s.trend}</span>
          <span class="stat-card-meta"> ${s.meta}</span>
        </div>
      </div>
    `).join('');
  }

  const chartDefaults = {
    borderRadius: 6,
    borderSkipped: false,
  };

  function initOverviewCharts() {
    renderOverviewStats();

    const m = MOCK_METRICS;
    const labels = m.monthLabels.slice(-6);
    const revenue = m.revenueByMonth.slice(-6);
    const growth  = m.clientGrowthByMonth.slice(-6);

    // Revenue line chart
    new Chart(document.getElementById('revenueChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'MRR (R$)',
          data: revenue,
          borderColor: '#00B894',
          backgroundColor: 'rgba(0,184,148,0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#00B894',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }]
      },
      options: chartOptions('R$')
    });

    // Growth bar chart
    new Chart(document.getElementById('growthChart'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Clientes',
          data: growth,
          backgroundColor: 'rgba(14,165,233,0.8)',
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: chartOptions('')
    });
  }

  function chartOptions(prefix) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0D1B2A',
          titleColor: 'rgba(255,255,255,0.6)',
          bodyColor: '#fff',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: ctx => prefix === 'R$' ? ` ${fmt(ctx.parsed.y)}` : ` ${ctx.parsed.y} clientes`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11, family: "'Inter', sans-serif" }, color: '#9CA3AF' }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
          ticks: {
            font: { size: 11, family: "'Inter', sans-serif" },
            color: '#9CA3AF',
            callback: v => prefix === 'R$' ? 'R$' + (v/1000).toFixed(0) + 'k' : v
          }
        }
      }
    };
  }

  /* ════════════════════════════════════════
     SECTION: CLIENTS
     ════════════════════════════════════════ */
  let clientsData        = [...MOCK_CLIENTS];
  let clientsPage        = 1;
  const CLIENTS_PER_PAGE = 10;

  function renderClients() {
    document.getElementById('clientsSubtitle').textContent =
      `${clientsData.length} clientes no total`;
    renderClientsTable(clientsData, clientsPage);
  }

  function renderClientsTable(data, page) {
    const tbody = document.getElementById('clientsTableBody');
    const start = (page - 1) * CLIENTS_PER_PAGE;
    const slice = data.slice(start, start + CLIENTS_PER_PAGE);

    if (!slice.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state-icon">👤</div><h3>Nenhum cliente encontrado</h3><p>Tente ajustar os filtros de busca.</p></div></td></tr>`;
      renderClientsPagination(data, page);
      return;
    }

    tbody.innerHTML = slice.map(c => `
      <tr data-client-id="${c.id}">
        <td>
          <div class="cell-user">
            <div class="cell-avatar" style="background:${avatarColor(c.name)}">${initials(c.name)}</div>
            <div>
              <div class="cell-name">${c.name}</div>
              <div class="cell-email">${c.email}</div>
            </div>
          </div>
        </td>
        <td>${statusBadge(c.status)}</td>
        <td class="cell-muted">${c.plan}</td>
        <td class="cell-muted">${fmtDate(c.joinDate)}</td>
        <td class="cell-muted">${fmtDate(c.lastPayment)}</td>
        <td>
          <div class="row-actions">
            <button class="row-action-btn" title="Ver detalhes" onclick="event.stopPropagation();window.AdminApp.openClientDrawer(${c.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="row-action-btn" title="Editar" onclick="event.stopPropagation();window.AdminApp.showToast('Abrindo editor...','info')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="row-action-btn danger" title="${c.status === 'active' ? 'Desativar' : 'Ativar'}" onclick="event.stopPropagation();window.AdminApp.toggleClientStatus(${c.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Row click → open drawer
    tbody.querySelectorAll('tr[data-client-id]').forEach(row => {
      row.addEventListener('click', () => openClientDrawer(parseInt(row.dataset.clientId)));
    });

    renderClientsPagination(data, page);
  }

  function renderClientsPagination(data, page) {
    const total = data.length;
    const pages = Math.ceil(total / CLIENTS_PER_PAGE);
    const start = (page - 1) * CLIENTS_PER_PAGE + 1;
    const end   = Math.min(page * CLIENTS_PER_PAGE, total);

    document.getElementById('clientsPagination').innerHTML = `
      <span class="pagination-info">Mostrando ${start}–${end} de ${total}</span>
      <div class="pagination-controls">
        <button class="pagination-btn" ${page <= 1 ? 'disabled' : ''} onclick="window.AdminApp.clientsGo(${page - 1})">‹</button>
        ${Array.from({length: pages}, (_, i) => `<button class="pagination-btn ${i+1===page?'current':''}" onclick="window.AdminApp.clientsGo(${i+1})">${i+1}</button>`).join('')}
        <button class="pagination-btn" ${page >= pages ? 'disabled' : ''} onclick="window.AdminApp.clientsGo(${page + 1})">›</button>
      </div>
    `;
  }

  function filterClients() {
    const q       = (document.getElementById('clientSearch')?.value || '').toLowerCase();
    const status  = document.getElementById('clientStatusFilter')?.value || '';
    const plan    = document.getElementById('clientPlanFilter')?.value || '';
    const sortBy  = document.getElementById('clientSort')?.value || 'name';

    clientsData = MOCK_CLIENTS.filter(c => {
      const matchQ      = !q      || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const matchStatus = !status || c.status === status;
      const matchPlan   = !plan   || c.plan === plan;
      return matchQ && matchStatus && matchPlan;
    }).sort((a, b) => {
      if (sortBy === 'name')        return a.name.localeCompare(b.name);
      if (sortBy === 'joinDate')    return b.joinDate.localeCompare(a.joinDate);
      if (sortBy === 'lastPayment') return (b.lastPayment || '0').localeCompare(a.lastPayment || '0');
      return 0;
    });

    clientsPage = 1;
    renderClientsTable(clientsData, clientsPage);
    document.getElementById('clientsSubtitle').textContent =
      `${clientsData.length} de ${MOCK_CLIENTS.length} clientes`;
  }

  ['clientSearch', 'clientStatusFilter', 'clientPlanFilter', 'clientSort'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', filterClients);
  });

  // Column sort
  document.querySelectorAll('#section-clients th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const sortEl = document.getElementById('clientSort');
      if (sortEl) { sortEl.value = th.dataset.sort; filterClients(); }
    });
  });

  function toggleClientStatus(id) {
    const c = MOCK_CLIENTS.find(x => x.id === id);
    if (!c) return;
    c.status = c.status === 'active' ? 'inactive' : 'active';
    filterClients();
    showToast(`Cliente ${c.name} ${c.status === 'active' ? 'ativado' : 'desativado'}.`, 'success');
  }

  /* ════════════════════════════════════════
     CLIENT DRAWER
     ════════════════════════════════════════ */
  const drawer  = document.getElementById('clientDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  let currentDrawerClient = null;

  function openClientDrawer(id) {
    const c = MOCK_CLIENTS.find(x => x.id === id);
    if (!c) return;
    currentDrawerClient = c;

    // Header
    document.getElementById('drawerAvatar').textContent = initials(c.name);
    document.getElementById('drawerAvatar').style.background = avatarColor(c.name);
    document.getElementById('drawerName').textContent  = c.name;
    document.getElementById('drawerEmail').textContent = c.email;
    document.getElementById('drawerStatusBadge').innerHTML = statusBadge(c.status);

    // Actions
    document.getElementById('drawerToggleBtn').textContent = c.status === 'active' ? 'Desativar' : 'Ativar';

    // Overview tab
    document.getElementById('drawerOverviewGrid').innerHTML = `
      <div class="detail-field"><span class="detail-label">Nome</span><span class="detail-value">${c.name}</span></div>
      <div class="detail-field"><span class="detail-label">E-mail</span><span class="detail-value">${c.email}</span></div>
      <div class="detail-field"><span class="detail-label">Telefone</span><span class="detail-value">${c.phone}</span></div>
      <div class="detail-field"><span class="detail-label">Plano</span><span class="detail-value">${c.plan}</span></div>
      <div class="detail-field"><span class="detail-label">Status</span><span class="detail-value">${statusBadge(c.status)}</span></div>
      <div class="detail-field"><span class="detail-label">Cadastro</span><span class="detail-value">${fmtDate(c.joinDate)}</span></div>
      <div class="detail-field"><span class="detail-label">Último pagamento</span><span class="detail-value">${fmtDate(c.lastPayment)}</span></div>
      <div class="detail-field"><span class="detail-label">Total pago</span><span class="detail-value">${fmt(c.paymentHistory.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0))}</span></div>
    `;

    // Payments tab
    const paymentsBody = document.getElementById('drawerPaymentsBody');
    if (!c.paymentHistory.length) {
      paymentsBody.innerHTML = `<tr><td colspan="4"><div class="empty-state" style="padding:30px"><div class="empty-state-icon">💳</div><h3>Sem pagamentos</h3></div></td></tr>`;
    } else {
      paymentsBody.innerHTML = c.paymentHistory.map(p => `
        <tr>
          <td class="cell-muted">${fmtDate(p.date)}</td>
          <td><strong>${fmt(p.amount)}</strong></td>
          <td>${statusBadge(p.status)}</td>
          <td class="cell-muted">${p.method}</td>
        </tr>
      `).join('');
    }

    // Notes tab
    document.getElementById('drawerNotesArea').value = c.notes || '';

    // Reset to first tab
    switchDrawerTab('overview');

    // Open
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.addEventListener('keydown', closeOnEsc);
  }

  function closeClientDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.removeEventListener('keydown', closeOnEsc);
    currentDrawerClient = null;
  }

  function closeOnEsc(e) {
    if (e.key === 'Escape') closeClientDrawer();
  }

  document.getElementById('drawerClose').addEventListener('click', closeClientDrawer);
  backdrop.addEventListener('click', closeClientDrawer);

  document.getElementById('drawerToggleBtn').addEventListener('click', () => {
    if (!currentDrawerClient) return;
    toggleClientStatus(currentDrawerClient.id);
    const c = MOCK_CLIENTS.find(x => x.id === currentDrawerClient.id);
    document.getElementById('drawerStatusBadge').innerHTML = statusBadge(c.status);
    document.getElementById('drawerToggleBtn').textContent = c.status === 'active' ? 'Desativar' : 'Ativar';
    currentDrawerClient = c;
  });

  document.getElementById('drawerEditBtn').addEventListener('click', () => {
    showToast('Editor de cliente em breve...', 'info');
  });

  document.getElementById('drawerPlanBtn').addEventListener('click', () => {
    showToast('Alteração de plano em breve...', 'info');
  });

  document.getElementById('saveNoteBtn').addEventListener('click', () => {
    if (!currentDrawerClient) return;
    const note = document.getElementById('drawerNotesArea').value;
    currentDrawerClient.notes = note;
    const c = MOCK_CLIENTS.find(x => x.id === currentDrawerClient.id);
    if (c) c.notes = note;
    showToast('Nota salva com sucesso!', 'success');
  });

  // Drawer tabs
  document.querySelectorAll('.drawer-tab').forEach(tab => {
    tab.addEventListener('click', () => switchDrawerTab(tab.dataset.drawerTab));
  });

  function switchDrawerTab(tab) {
    document.querySelectorAll('.drawer-tab').forEach(t => t.classList.toggle('active', t.dataset.drawerTab === tab));
    document.querySelectorAll('.drawer-tab-content').forEach(c => c.classList.remove('active'));
    const target = document.getElementById(`drawerTab${tab.charAt(0).toUpperCase()+tab.slice(1)}`);
    if (target) target.classList.add('active');
  }

  /* ════════════════════════════════════════
     SECTION: PAYMENTS
     ════════════════════════════════════════ */
  let paymentsData        = [...MOCK_PAYMENTS];
  let paymentsPage        = 1;
  const PAYMENTS_PER_PAGE = 10;

  function renderPayments() {
    document.getElementById('paymentsSubtitle').textContent =
      `${MOCK_PAYMENTS.length} transações no total`;
    filterPayments();
  }

  function filterPayments() {
    const q      = (document.getElementById('paymentSearch')?.value || '').toLowerCase();
    const status = document.getElementById('paymentStatusFilter')?.value || '';
    const month  = document.getElementById('paymentMonthFilter')?.value || '';
    const method = document.getElementById('paymentMethodFilter')?.value || '';

    paymentsData = MOCK_PAYMENTS.filter(p => {
      const matchQ      = !q      || p.clientName.toLowerCase().includes(q);
      const matchStatus = !status || p.status === status;
      const matchMonth  = !month  || p.date.startsWith(month);
      const matchMethod = !method || p.method === method;
      return matchQ && matchStatus && matchMonth && matchMethod;
    }).sort((a, b) => b.date.localeCompare(a.date));

    paymentsPage = 1;
    renderPaymentsTable(paymentsData, paymentsPage);
    document.getElementById('paymentsSubtitle').textContent =
      `${paymentsData.length} de ${MOCK_PAYMENTS.length} transações`;
  }

  ['paymentSearch', 'paymentStatusFilter', 'paymentMonthFilter', 'paymentMethodFilter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', filterPayments);
  });

  function renderPaymentsTable(data, page) {
    const tbody = document.getElementById('paymentsTableBody');
    const start = (page - 1) * PAYMENTS_PER_PAGE;
    const slice = data.slice(start, start + PAYMENTS_PER_PAGE);

    if (!slice.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-state-icon">💳</div><h3>Nenhum pagamento encontrado</h3><p>Tente ajustar os filtros.</p></div></td></tr>`;
      renderPaymentsPagination(data, page);
      return;
    }

    tbody.innerHTML = slice.map(p => `
      <tr>
        <td>
          <div class="cell-user">
            <div class="cell-avatar" style="background:${avatarColor(p.clientName)}">${initials(p.clientName)}</div>
            <span class="cell-name">${p.clientName}</span>
          </div>
        </td>
        <td><strong>${fmt(p.amount)}</strong></td>
        <td class="cell-muted">${fmtDate(p.date)}</td>
        <td>${statusBadge(p.status)}</td>
        <td class="cell-muted">${p.method}</td>
        <td>
          <button class="row-action-btn" title="Ver fatura" onclick="window.AdminApp.showToast('Fatura ${p.invoiceId} em PDF em breve...','info')" style="opacity:1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </button>
        </td>
      </tr>
    `).join('');

    renderPaymentsPagination(data, page);
  }

  function renderPaymentsPagination(data, page) {
    const total = data.length;
    const pages = Math.ceil(total / PAYMENTS_PER_PAGE);
    const start = (page - 1) * PAYMENTS_PER_PAGE + 1;
    const end   = Math.min(page * PAYMENTS_PER_PAGE, total);

    document.getElementById('paymentsPagination').innerHTML = `
      <span class="pagination-info">Mostrando ${start}–${end} de ${total}</span>
      <div class="pagination-controls">
        <button class="pagination-btn" ${page<=1?'disabled':''} onclick="window.AdminApp.paymentsGo(${page-1})">‹</button>
        ${Array.from({length:pages},(_,i)=>`<button class="pagination-btn ${i+1===page?'current':''}" onclick="window.AdminApp.paymentsGo(${i+1})">${i+1}</button>`).join('')}
        <button class="pagination-btn" ${page>=pages?'disabled':''} onclick="window.AdminApp.paymentsGo(${page+1})">›</button>
      </div>
    `;
  }

  /* ════════════════════════════════════════
     SECTION: REPORTS
     ════════════════════════════════════════ */
  let reportCharts = {};

  function renderReports() {
    const m = MOCK_METRICS;

    // Destroy existing charts
    Object.values(reportCharts).forEach(c => { try { c.destroy(); } catch(e){} });
    reportCharts = {};

    const period = parseInt(document.getElementById('reportPeriod')?.value || 12);
    const labels  = m.monthLabels.slice(-period);
    const revenue = m.revenueByMonth.slice(-period);
    const growth  = m.clientGrowthByMonth.slice(-period);

    reportCharts.revenue = new Chart(document.getElementById('reportRevenueChart'), {
      type: 'line',
      data: { labels, datasets: [{ label: 'MRR (R$)', data: revenue, borderColor: '#00B894', backgroundColor: 'rgba(0,184,148,0.08)', borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#00B894' }] },
      options: chartOptions('R$')
    });

    reportCharts.growth = new Chart(document.getElementById('reportGrowthChart'), {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Novos Clientes', data: growth, backgroundColor: 'rgba(14,165,233,0.8)', borderRadius: 5 }] },
      options: chartOptions('')
    });

    reportCharts.retention = new Chart(document.getElementById('reportRetentionChart'), {
      type: 'doughnut',
      data: {
        labels: ['Retidos', 'Cancelados'],
        datasets: [{ data: [m.retentionRate, 100 - m.retentionRate], backgroundColor: ['#00B894', '#F3F5F7'], borderWidth: 0, cutout: '72%' }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 12, family: "'Inter'" }, color: '#6B7280', boxWidth: 12, padding: 16 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.toFixed(1)}%` } }
        }
      }
    });


    // Insights
    const prevMRR = revenue[revenue.length - 2] || 0;
    const currMRR = revenue[revenue.length - 1] || 0;
    const mrrChange = prevMRR ? (((currMRR - prevMRR) / prevMRR) * 100).toFixed(1) : 0;

    document.getElementById('insightCards').innerHTML = [
      { icon: '📈', iconClass: 'insight-icon-green', title: `MRR cresceu ${mrrChange}% este mês`, sub: `De ${fmt(prevMRR)} para ${fmt(currMRR)}` },
      { icon: '👥', iconClass: 'insight-icon-blue',  title: `${m.newClientsThisMonth} novos clientes em março`, sub: 'Acima da média mensal histórica' },
      { icon: '🔄', iconClass: 'insight-icon-green', title: `Taxa de retenção: ${m.retentionRate}%`, sub: 'Acima do benchmark de 90% do setor' },
    ].map(i => `
      <div class="insight-card">
        <div class="insight-icon ${i.iconClass}" style="font-size:1.25rem">${i.icon}</div>
        <div class="insight-text">
          <strong>${i.title}</strong>
          <span>${i.sub}</span>
        </div>
      </div>
    `).join('');
  }

  /* ════════════════════════════════════════
     SECTION: SUBSCRIPTIONS
     ════════════════════════════════════════ */
  function renderSubscriptions() {
    const grid = document.getElementById('plansGrid');
    grid.innerHTML = MOCK_PLANS.map(p => `
      <div class="plan-card ${p.featured ? 'featured' : ''}" id="plan-card-${p.id}">
        <div class="plan-card-header">
          <div>
            <div class="plan-name">${p.name}</div>
            <div style="margin-top:4px">${p.status === 'active' ? '<span class="badge badge--plan-active">Ativo</span>' : '<span class="badge badge--plan-inactive">Inativo</span>'}</div>
          </div>
          ${p.featured ? '<span class="badge badge--active">⭐ Popular</span>' : ''}
        </div>
        <div class="plan-price">${fmt(p.price)}<span>/mês</span></div>
        <ul class="plan-features">
          ${p.features.map(f => `
            <li class="plan-feature">
              <svg class="plan-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ${f}
            </li>
          `).join('')}
        </ul>
        <div class="plan-subscribers">${p.subscriberCount} assinante${p.subscriberCount!==1?'s':''}</div>
        <div class="plan-card-footer">
          <button class="toolbar-btn" style="flex:1" onclick="window.AdminApp.editPlan(${p.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </button>
          <button class="toolbar-btn ${p.status==='active'?'':'primary'}" onclick="window.AdminApp.togglePlan(${p.id})">
            ${p.status === 'active' ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>
    `).join('');
  }

  function showNewPlanForm() {
    const container = document.getElementById('newPlanFormContainer');
    if (container.innerHTML) { container.innerHTML = ''; return; }
    container.innerHTML = `
      <div class="new-plan-form-card">
        <h3 style="margin:0 0 16px;font-size:1rem;font-weight:700;color:var(--color-text)">Novo Plano</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div class="form-field"><label class="form-label">Nome do plano</label><input class="form-input" id="newPlanName" placeholder="Ex: Premium"></div>
          <div class="form-field"><label class="form-label">Preço (R$/mês)</label><input class="form-input" id="newPlanPrice" type="number" placeholder="497"></div>
        </div>
        <div class="form-field" style="margin-bottom:12px"><label class="form-label">Recursos (um por linha)</label><textarea class="notes-area" id="newPlanFeatures" rows="4" placeholder="5 números WhatsApp&#10;10.000 mensagens/mês&#10;IA avançada"></textarea></div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button class="toolbar-btn" onclick="document.getElementById('newPlanFormContainer').innerHTML=''">Cancelar</button>
          <button class="toolbar-btn primary" onclick="window.AdminApp.savePlan()">Criar Plano</button>
        </div>
      </div>
    `;
    document.getElementById('newPlanName').focus();
  }

  function savePlan() {
    const name  = document.getElementById('newPlanName')?.value.trim();
    const price = parseInt(document.getElementById('newPlanPrice')?.value || '0');
    const features = (document.getElementById('newPlanFeatures')?.value || '').split('\n').map(f=>f.trim()).filter(Boolean);

    if (!name || !price) { showToast('Preencha nome e preço do plano.', 'error'); return; }

    const newPlan = { id: MOCK_PLANS.length + 1, name, price, status: 'active', subscriberCount: 0, features, featured: false };
    MOCK_PLANS.push(newPlan);
    document.getElementById('newPlanFormContainer').innerHTML = '';
    renderSubscriptions();
    showToast(`Plano "${name}" criado com sucesso!`, 'success');
  }

  function editPlan(id) {
    showToast('Editor de plano em breve...', 'info');
  }

  function togglePlan(id) {
    const p = MOCK_PLANS.find(x => x.id === id);
    if (!p) return;
    p.status = p.status === 'active' ? 'inactive' : 'active';
    renderSubscriptions();
    showToast(`Plano "${p.name}" ${p.status === 'active' ? 'ativado' : 'desativado'}.`, 'success');
  }

  /* ════════════════════════════════════════
     SETTINGS TABS
     ════════════════════════════════════════ */
  document.querySelectorAll('.settings-tab-link').forEach(link => {
    link.addEventListener('click', () => {
      const tab = link.dataset.settingsTab;
      document.querySelectorAll('.settings-tab-link').forEach(l => l.classList.toggle('active', l.dataset.settingsTab === tab));
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.toggle('active', p.id === `settings-${tab}`));
    });
  });

  /* ════════════════════════════════════════
     UTILITIES (exposed globally)
     ════════════════════════════════════════ */
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast('Copiado para a área de transferência!', 'success'));
    } else {
      showToast('Não foi possível copiar.', 'error');
    }
  }

  function exportData()   { showToast('Exportação de dados em breve...', 'info'); }
  function exportPayments() { showToast('Exportação CSV em breve...', 'info'); }
  function openNewClientModal() { showToast('Formulário de novo cliente em breve...', 'info'); }
  function updateReports() { renderReports(); }

  /* ════════════════════════════════════════
     GLOBAL API (used in HTML onclick attrs)
     ════════════════════════════════════════ */
  window.AdminApp = {
    showToast,
    exportData,
    exportPayments,
    openNewClientModal,
    openClientDrawer,
    toggleClientStatus,
    clientsGo: (page) => { clientsPage = page; renderClientsTable(clientsData, clientsPage); },
    paymentsGo: (page) => { paymentsPage = page; renderPaymentsTable(paymentsData, paymentsPage); },
    showNewPlanForm,
    savePlan,
    editPlan,
    togglePlan,
    copyToClipboard,
    updateReports,
  };

  /* ════════════════════════════════════════
     AUTO-CANCELLATION
     Cancela plano de clientes com pagamento
     atrasado há mais de 35 dias (grace period)
     ════════════════════════════════════════ */
  function checkOverdueClients() {
    const today      = new Date();
    const GRACE_DAYS = 35; // dias após vencimento antes de cancelar
    const cancelled  = [];

    MOCK_CLIENTS.forEach(function(c) {
      if (c.status !== 'active' && c.status !== 'trial') return;
      if (!c.lastPayment || c.lastPayment === '—') return;

      const lastPay  = new Date(c.lastPayment);
      const diffDays = Math.floor((today - lastPay) / (1000 * 60 * 60 * 24));

      if (diffDays > GRACE_DAYS) {
        c.status = 'cancelled';
        c.notes  = (c.notes ? c.notes + '\n' : '') +
          '[Auto] Plano cancelado automaticamente por inadimplência em ' +
          today.toLocaleDateString('pt-BR') + '.';
        cancelled.push(c.name);
      }
    });

    if (cancelled.length > 0) {
      showToast(
        cancelled.length === 1
          ? `Plano de "${cancelled[0]}" cancelado por inadimplência.`
          : `${cancelled.length} planos cancelados automaticamente por inadimplência.`,
        'error'
      );
    }
  }

  /* ════════════════════════════════════════
     INIT
     ════════════════════════════════════════ */
  checkOverdueClients();
  initOverviewCharts();
  chartsInitialized = true;

})();
