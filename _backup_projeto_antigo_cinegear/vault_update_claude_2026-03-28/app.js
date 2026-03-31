/* ══════════════════════════════════════════════
   VAULT — app.js
   Controle financeiro pessoal com LocalStorage
══════════════════════════════════════════════ */

// ── PALETA DE CORES DOS GRÁFICOS ───────────────────────────────────────────
const CAT_COLORS = {
  'alimentação': '#6ee7b0',
  'transporte':  '#60a5fa',
  'saúde':       '#f87171',
  'lazer':       '#c084fc',
  'casa':        '#fb923c',
  'roupas':      '#f472b6',
  'educação':    '#34d399',
  'outros':      '#94a3b8',
};

const CAT_EMOJI = {
  'alimentação': '🛒',
  'transporte':  '🚌',
  'saúde':       '💊',
  'lazer':       '🎭',
  'casa':        '🏠',
  'roupas':      '👗',
  'educação':    '📚',
  'outros':      '📦',
};

// ── ESTADO ─────────────────────────────────────────────────────────────────
let gastos = JSON.parse(localStorage.getItem('vault_gastos') || '[]');
let contas = JSON.parse(localStorage.getItem('vault_contas') || '[]');
let contasFiltro = 'todas';
let chartDonut = null, chartBar = null, relChartDonut = null, relChartLine = null, relChartBar = null;

// ── INIT ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setDefaultDates();
  populateMonthSelects();
  setupNavigation();
  setupSidebar();
  setupTheme();
  renderAll();

  // Período no dashboard
  const now = new Date();
  document.getElementById('dash-periodo').textContent =
    now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
});

// ── DATAS ──────────────────────────────────────────────────────────────────
function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('g-data').value = today;
  document.getElementById('c-venc').value = today;
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
}

function populateMonthSelects() {
  const now = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    months.push({ val, label });
  }
  const opts = months.map(m => `<option value="${m.val}">${m.label}</option>`).join('');
  document.getElementById('filter-mes').innerHTML = opts;
  document.getElementById('rel-mes').innerHTML = opts;
}

// ── NAVEGAÇÃO ──────────────────────────────────────────────────────────────
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const section = item.dataset.section;
      navigate(section);
      // Fechar sidebar no mobile
      if (window.innerWidth <= 680) closeSidebar();
    });
  });
}

function navigate(section) {
  // Seções
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${section}`).classList.add('active');
  // Nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');
  // Título
  const titles = { dashboard: 'Dashboard', gastos: 'Gastos', contas: 'Contas', relatorios: 'Relatórios' };
  document.getElementById('page-title').textContent = titles[section] || '';
  // Re-render ao entrar em relatórios para criar gráficos
  if (section === 'relatorios') renderRelatorios();
  if (section === 'dashboard') renderDashboard();
}

// ── SIDEBAR (MOBILE) ───────────────────────────────────────────────────────
function setupSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  document.getElementById('menu-btn').addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
  });
  document.getElementById('sidebar-close').addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

// ── TEMA ───────────────────────────────────────────────────────────────────
function setupTheme() {
  const saved = localStorage.getItem('vault_theme') || 'dark';
  applyTheme(saved);
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('vault_theme', theme);
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-moon';
    label.textContent = 'Modo Escuro';
  } else {
    icon.className = 'fa-solid fa-sun';
    label.textContent = 'Modo Claro';
  }
  // Recriar gráficos com novo tema
  setTimeout(() => { renderDashboard(); if (document.getElementById('section-relatorios').classList.contains('active')) renderRelatorios(); }, 50);
}

// ── SAVE / LOAD ────────────────────────────────────────────────────────────
function saveGastos() { localStorage.setItem('vault_gastos', JSON.stringify(gastos)); }
function saveContas()  { localStorage.setItem('vault_contas',  JSON.stringify(contas)); }
function renderAll()   { renderDashboard(); renderGastos(); renderContas(); }

// ══════════════════════════════════════════════
// GASTOS
// ══════════════════════════════════════════════
function openModal(type) {
  document.getElementById(`modal-${type}`).classList.add('open');
}
function closeModal(type) {
  document.getElementById(`modal-${type}`).classList.remove('open');
  document.getElementById(`${type === 'gasto' ? 'g' : 'c'}-error`).textContent = '';
}

// Fechar modal ao clicar fora
document.querySelectorAll('.modal-backdrop').forEach(b => {
  b.addEventListener('click', e => { if (e.target === b) b.classList.remove('open'); });
});

function saveGasto() {
  const desc  = document.getElementById('g-desc').value.trim();
  const valor = parseFloat(document.getElementById('g-valor').value);
  const data  = document.getElementById('g-data').value;
  const cat   = document.getElementById('g-cat').value;
  const err   = document.getElementById('g-error');

  if (!desc)  { err.textContent = 'Digite uma descrição.'; return; }
  if (!valor || valor <= 0) { err.textContent = 'Digite um valor válido.'; return; }
  if (!data)  { err.textContent = 'Selecione uma data.'; return; }

  gastos.push({ id: Date.now(), desc, valor, data, cat, ts: Date.now() });
  saveGastos();
  renderAll();
  closeModal('gasto');
  document.getElementById('g-desc').value = '';
  document.getElementById('g-valor').value = '';
  showToast('Gasto adicionado com sucesso!', 'success');
}

function deleteGasto(id) {
  gastos = gastos.filter(g => g.id !== id);
  saveGastos();
  renderAll();
  showToast('Gasto removido.', '');
}

function renderGastos() {
  const filterCat = document.getElementById('filter-cat').value;
  const filterMes = document.getElementById('filter-mes').value || currentMonth();
  const list = document.getElementById('gastos-list');

  let filtered = gastos
    .filter(g => g.data && g.data.startsWith(filterMes))
    .filter(g => !filterCat || g.cat === filterCat)
    .sort((a, b) => b.ts - a.ts);

  const total = filtered.reduce((s, g) => s + g.valor, 0);
  document.getElementById('gastos-summary').textContent =
    `${filtered.length} gasto${filtered.length !== 1 ? 's' : ''} · Total: ${fmtBRL(total)}`;

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-receipt"></i>Nenhum gasto encontrado para este período</div>`;
    return;
  }

  list.innerHTML = filtered.map((g, i) => `
    <div class="tx-item" style="animation-delay:${i * 0.04}s">
      <div class="tx-left">
        <div class="tx-emoji">${CAT_EMOJI[g.cat] || '📦'}</div>
        <div class="tx-info">
          <div class="tx-desc">${esc(g.desc)}</div>
          <div class="tx-meta">${fmtDate(g.data)} · ${g.cat}</div>
        </div>
      </div>
      <div class="tx-right">
        <div class="tx-value">${fmtBRL(g.valor)}</div>
        <button class="tx-delete" onclick="deleteGasto(${g.id})" title="Remover">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════
// CONTAS
// ══════════════════════════════════════════════
function saveConta() {
  const nome  = document.getElementById('c-nome').value.trim();
  const valor = parseFloat(document.getElementById('c-valor').value);
  const venc  = document.getElementById('c-venc').value;
  const rec   = document.getElementById('c-rec').value;
  const err   = document.getElementById('c-error');

  if (!nome)  { err.textContent = 'Digite o nome da conta.'; return; }
  if (!valor || valor <= 0) { err.textContent = 'Digite um valor válido.'; return; }
  if (!venc)  { err.textContent = 'Selecione a data de vencimento.'; return; }

  contas.push({ id: Date.now(), nome, valor, venc, rec, paga: false, ts: Date.now() });
  saveContas();
  renderAll();
  closeModal('conta');
  document.getElementById('c-nome').value = '';
  document.getElementById('c-valor').value = '';
  showToast('Conta adicionada!', 'success');
}

function togglePaga(id) {
  const c = contas.find(c => c.id === id);
  if (c) { c.paga = !c.paga; saveContas(); renderAll(); showToast(c.paga ? 'Conta marcada como paga!' : 'Conta reaberta.', 'success'); }
}

function deleteConta(id) {
  contas = contas.filter(c => c.id !== id);
  saveContas();
  renderAll();
  showToast('Conta removida.', '');
}

function filterContas(btn, filtro) {
  document.querySelectorAll('.ctab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  contasFiltro = filtro;
  renderContas();
}

function getContaStatus(c) {
  if (c.paga) return 'paga';
  const today = new Date().toISOString().split('T')[0];
  if (c.venc < today) return 'vencida';
  return 'pendente';
}

function renderContas() {
  const list = document.getElementById('contas-list');
  let filtered = contas.sort((a, b) => a.venc.localeCompare(b.venc));

  if (contasFiltro !== 'todas') {
    filtered = filtered.filter(c => getContaStatus(c) === contasFiltro);
  }

  const pendentes = contas.filter(c => !c.paga);
  const totalPend = pendentes.reduce((s, c) => s + c.valor, 0);
  document.getElementById('contas-summary').textContent =
    `${pendentes.length} pendente${pendentes.length !== 1 ? 's' : ''} · ${fmtBRL(totalPend)} a pagar`;

  const pend = contas.filter(c => !c.paga).length;
  document.getElementById('kpi-pendentes').textContent = pend;
  document.getElementById('kpi-pendentes-val').textContent = fmtBRL(totalPend);

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-file-invoice-dollar"></i>Nenhuma conta encontrada</div>`;
    return;
  }

  list.innerHTML = filtered.map((c, i) => {
    const status = getContaStatus(c);
    const badges = { pendente: 'badge-pendente', paga: 'badge-paga', vencida: 'badge-vencida' };
    const labels = { pendente: 'Pendente', paga: 'Paga', vencida: 'Vencida' };
    return `
      <div class="conta-item status-${status}" style="animation-delay:${i * 0.04}s">
        <div class="conta-left">
          <div class="conta-nome">${esc(c.nome)}</div>
          <div class="conta-info">Vence ${fmtDate(c.venc)} · ${c.rec}</div>
        </div>
        <div class="conta-right">
          <span class="badge ${badges[status]}">${labels[status]}</span>
          <div class="conta-valor">${fmtBRL(c.valor)}</div>
          ${!c.paga ? `<button class="btn-pagar" onclick="togglePaga(${c.id})"><i class="fa-solid fa-check"></i> Pagar</button>` : `<button class="btn-pagar" onclick="togglePaga(${c.id})" style="opacity:.6">Desfazer</button>`}
          <button class="tx-delete" onclick="deleteConta(${c.id})" title="Remover"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
    `;
  }).join('');
}

// ══════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════
function renderDashboard() {
  const mes = currentMonth();
  const doMes = gastos.filter(g => g.data && g.data.startsWith(mes));
  const total = doMes.reduce((s, g) => s + g.valor, 0);

  document.getElementById('kpi-total').textContent = fmtBRL(total);
  document.getElementById('kpi-transacoes').textContent = doMes.length;

  // Barra proporcional (meta simbólica = R$3000)
  const meta = 3000;
  document.getElementById('kpi-bar').style.width = Math.min((total / meta) * 100, 100) + '%';

  // Maior gasto
  if (doMes.length) {
    const maior = doMes.reduce((a, b) => b.valor > a.valor ? b : a);
    document.getElementById('kpi-maior').textContent = fmtBRL(maior.valor);
    document.getElementById('kpi-maior-cat').textContent = esc(maior.desc);
  } else {
    document.getElementById('kpi-maior').textContent = '—';
    document.getElementById('kpi-maior-cat').textContent = 'sem gastos';
  }

  // Recent
  const recent = [...gastos].sort((a, b) => b.ts - a.ts).slice(0, 5);
  const recList = document.getElementById('dash-recent');
  if (!recent.length) {
    recList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-receipt"></i>Nenhuma transação ainda. Adicione seu primeiro gasto!</div>`;
  } else {
    recList.innerHTML = recent.map((g, i) => `
      <div class="tx-item" style="animation-delay:${i * 0.04}s">
        <div class="tx-left">
          <div class="tx-emoji">${CAT_EMOJI[g.cat] || '📦'}</div>
          <div class="tx-info">
            <div class="tx-desc">${esc(g.desc)}</div>
            <div class="tx-meta">${fmtDate(g.data)} · ${g.cat}</div>
          </div>
        </div>
        <div class="tx-right">
          <div class="tx-value">${fmtBRL(g.valor)}</div>
        </div>
      </div>
    `).join('');
  }

  // Gráficos
  buildDonutChart(doMes, 'chart-donut', 'legend-cat');
  buildBarChart(doMes, 'chart-bar');
}

// ── DONUT CHART ────────────────────────────────────────────────────────────
function buildDonutChart(data, canvasId, legendId) {
  const bycat = {};
  data.forEach(g => { bycat[g.cat] = (bycat[g.cat] || 0) + g.valor; });
  const entries = Object.entries(bycat).sort((a, b) => b[1] - a[1]);

  const isDark = document.documentElement.dataset.theme !== 'light';

  if (canvasId === 'chart-donut' && chartDonut)  { chartDonut.destroy();  chartDonut = null; }
  if (canvasId === 'rel-chart-donut' && relChartDonut) { relChartDonut.destroy(); relChartDonut = null; }

  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: entries.map(([k]) => k),
      datasets: [{
        data: entries.map(([, v]) => v),
        backgroundColor: entries.map(([k]) => CAT_COLORS[k] || '#94a3b8'),
        borderColor: isDark ? '#1f2332' : '#ffffff',
        borderWidth: 3,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${fmtBRL(ctx.raw)} (${((ctx.raw / data.reduce((s,g)=>s+g.valor,0))*100).toFixed(0)}%)`
          },
          backgroundColor: isDark ? '#1f2332' : '#fff',
          titleColor: isDark ? '#eef0f5' : '#111827',
          bodyColor: isDark ? '#8b92a8' : '#6b7280',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          borderWidth: 1,
        }
      }
    }
  });

  if (canvasId === 'chart-donut') chartDonut = chart;
  else relChartDonut = chart;

  // Legend
  const leg = document.getElementById(legendId);
  if (leg) {
    leg.innerHTML = entries.map(([k, v]) => `
      <div class="legend-item">
        <div class="legend-dot" style="background:${CAT_COLORS[k] || '#94a3b8'}"></div>
        <span>${k}</span>
        <span style="margin-left:4px;font-weight:600;color:var(--text)">${fmtBRL(v)}</span>
      </div>
    `).join('');
  }
}

// ── BAR CHART (diário) ─────────────────────────────────────────────────────
function buildBarChart(data, canvasId) {
  const byday = {};
  data.forEach(g => { byday[g.data] = (byday[g.data] || 0) + g.valor; });
  const days = Object.entries(byday).sort((a, b) => a[0].localeCompare(b[0]));

  const isDark = document.documentElement.dataset.theme !== 'light';
  const textColor = isDark ? '#555d74' : '#9ca3af';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

  if (canvasId === 'chart-bar' && chartBar)  { chartBar.destroy();  chartBar = null; }
  if (canvasId === 'rel-chart-bar' && relChartBar) { relChartBar.destroy(); relChartBar = null; }

  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days.map(([d]) => {
        const [, , day] = d.split('-');
        return `${parseInt(day)}`;
      }),
      datasets: [{
        label: 'Gastos',
        data: days.map(([, v]) => v),
        backgroundColor: isDark ? 'rgba(110,231,176,0.7)' : 'rgba(5,150,105,0.7)',
        hoverBackgroundColor: isDark ? '#6ee7b0' : '#059669',
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ` ${fmtBRL(ctx.raw)}` },
          backgroundColor: isDark ? '#1f2332' : '#fff',
          titleColor: isDark ? '#eef0f5' : '#111827',
          bodyColor: isDark ? '#8b92a8' : '#6b7280',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          borderWidth: 1,
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Outfit', size: 12 } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Outfit', size: 12 }, callback: v => `R$${v}` }, border: { display: false } }
      }
    }
  });

  if (canvasId === 'chart-bar') chartBar = chart;
  else relChartBar = chart;
}

// ══════════════════════════════════════════════
// RELATÓRIOS
// ══════════════════════════════════════════════
function renderRelatorios() {
  const mes = document.getElementById('rel-mes')?.value || currentMonth();
  const doMes = gastos.filter(g => g.data && g.data.startsWith(mes));
  const total = doMes.reduce((s, g) => s + g.valor, 0);

  document.getElementById('rel-total').textContent = fmtBRL(total);

  // Média por dia
  const days = [...new Set(doMes.map(g => g.data))].length || 1;
  document.getElementById('rel-media').textContent = fmtBRL(total / days);

  // Maior gasto
  if (doMes.length) {
    const maior = doMes.reduce((a, b) => b.valor > a.valor ? b : a);
    document.getElementById('rel-maior').textContent = fmtBRL(maior.valor);

    // Categoria com mais gasto
    const bycat = {};
    doMes.forEach(g => { bycat[g.cat] = (bycat[g.cat] || 0) + g.valor; });
    const topCat = Object.entries(bycat).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('rel-cat-top').textContent = topCat ? `${CAT_EMOJI[topCat[0]]} ${topCat[0]}` : '—';
  } else {
    document.getElementById('rel-maior').textContent = '—';
    document.getElementById('rel-cat-top').textContent = '—';
  }

  buildDonutChart(doMes, 'rel-chart-donut', 'rel-legend');
  buildBarChart(doMes, 'rel-chart-bar');
  buildLineChart(mes);
}

function buildLineChart(mesSelecionado) {
  const isDark = document.documentElement.dataset.theme !== 'light';
  const textColor = isDark ? '#555d74' : '#9ca3af';
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

  if (relChartLine) { relChartLine.destroy(); relChartLine = null; }
  const ctx = document.getElementById('rel-chart-line');
  if (!ctx) return;

  // Últimos 6 meses
  const [yr, mo] = mesSelecionado.split('-').map(Number);
  const monthsData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(yr, mo - 1 - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const label = d.toLocaleDateString('pt-BR', { month: 'short' });
    const total = gastos.filter(g => g.data && g.data.startsWith(key)).reduce((s, g) => s + g.valor, 0);
    monthsData.push({ label, total });
  }

  relChartLine = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthsData.map(m => m.label),
      datasets: [{
        label: 'Total Mensal',
        data: monthsData.map(m => m.total),
        borderColor: isDark ? '#6ee7b0' : '#059669',
        backgroundColor: isDark ? 'rgba(110,231,176,0.08)' : 'rgba(5,150,105,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: isDark ? '#6ee7b0' : '#059669',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: ctx => ` ${fmtBRL(ctx.raw)}` },
          backgroundColor: isDark ? '#1f2332' : '#fff',
          titleColor: isDark ? '#eef0f5' : '#111827',
          bodyColor: isDark ? '#8b92a8' : '#6b7280',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          borderWidth: 1,
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Outfit', size: 12 } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Outfit', size: 12 }, callback: v => `R$${v}` }, border: { display: false } }
      }
    }
  });
}

// ══════════════════════════════════════════════
// UTILITÁRIOS
// ══════════════════════════════════════════════
function fmtBRL(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function fmtDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

let toastTimer = null;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  }
});
