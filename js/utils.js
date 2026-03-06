/* =============================================
   Janaa Payroll Dashboard — Shared Utilities
   Production-ready v2
   ============================================= */

/* ─── API CLIENT with error handling ─── */
const API = {
  _handleResponse: async (res) => {
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`API error ${res.status}: ${text || res.statusText}`);
    }
    if (res.status === 204) return null;
    return res.json();
  },

  get: async (table, params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`tables/${table}${q ? '?' + q : ''}`);
    return API._handleResponse(res);
  },

  getOne: async (table, id) => {
    const res = await fetch(`tables/${table}/${id}`);
    return API._handleResponse(res);
  },

  post: async (table, data) => {
    const res = await fetch(`tables/${table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return API._handleResponse(res);
  },

  put: async (table, id, data) => {
    const res = await fetch(`tables/${table}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return API._handleResponse(res);
  },

  patch: async (table, id, data) => {
    const res = await fetch(`tables/${table}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return API._handleResponse(res);
  },

  delete: async (table, id) => {
    const res = await fetch(`tables/${table}/${id}`, { method: 'DELETE' });
    return API._handleResponse(res);
  }
};

/* ─── FORMATTING ─── */
const fmt = {
  currency: (amount, currency = 'INR') => {
    const n = Number(amount) || 0;
    const sym = currency === 'INR' ? '₹' : currency === 'PHP' ? '₱' : '$';
    if (currency === 'INR') {
      if (n >= 10000000) return sym + (n / 10000000).toFixed(2) + ' Cr';
      if (n >= 100000)   return sym + (n / 100000).toFixed(2) + ' L';
      if (n >= 1000)     return sym + (n / 1000).toFixed(1) + 'K';
    } else {
      if (n >= 1000000) return sym + (n / 1000000).toFixed(2) + 'M';
      if (n >= 1000)    return sym + (n / 1000).toFixed(1) + 'K';
    }
    return sym + n.toLocaleString();
  },

  currencyFull: (amount, currency = 'INR') => {
    const n = Number(amount) || 0;
    const sym = currency === 'INR' ? '₹' : currency === 'PHP' ? '₱' : '$';
    const locale = currency === 'INR' ? 'en-IN' : 'en-PH';
    return sym + n.toLocaleString(locale);
  },

  date: (d) => {
    if (!d) return '—';
    try {
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return d; }
  },

  period: (p) => {
    if (!p) return '—';
    try {
      const [y, m] = p.split('-');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${months[parseInt(m, 10) - 1]} ${y}`;
    } catch { return p; }
  },

  initials: (name) => {
    if (!name) return '??';
    return name.trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  },

  daysUntil: (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).setHours(23,59,59) - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  },

  escapeHtml: (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

/* ─── STATUS BADGES ─── */
const statusBadge = (status) => {
  const map = {
    paid:             ['badge-green',  '✓ Paid'],
    approved:         ['badge-green',  '✓ Approved'],
    pending_approval: ['badge-yellow', '⏳ Pending Approval'],
    processing:       ['badge-blue',   '⚙ Processing'],
    draft:            ['badge-gray',   '○ Draft'],
    failed:           ['badge-red',    '✗ Failed'],
    active:           ['badge-green',  'Active'],
    inactive:         ['badge-gray',   'Inactive'],
    onboarding:       ['badge-blue',   'Onboarding'],
    open:             ['badge-red',    '● Open'],
    resolved:         ['badge-green',  '✓ Resolved'],
    escalated:        ['badge-red',    '↑ Escalated'],
    pending:          ['badge-gray',   '○ Pending'],
    in_progress:      ['badge-blue',   '⚙ In Progress'],
    done:             ['badge-green',  '✓ Done'],
    blocked:          ['badge-red',    '✗ Blocked'],
    finalized:        ['badge-blue',   'Finalized'],
  };
  const [cls, label] = map[status] || ['badge-gray', fmt.escapeHtml(status) || '—'];
  return `<span class="badge ${cls}">${label}</span>`;
};

const severityBadge = (sev) => {
  const map = { high: 'badge-red', medium: 'badge-yellow', low: 'badge-green' };
  return `<span class="badge ${map[sev] || 'badge-gray'}">${fmt.escapeHtml(sev)}</span>`;
};

const countryFlag = (country) => {
  if (country === 'India') return '🇮🇳';
  if (country === 'Philippines') return '🇵🇭';
  return '🌐';
};

/* ─── SESSION ─── */
const Session = {
  set: (user) => {
    try { localStorage.setItem('janaa_user', JSON.stringify(user)); } catch(e) {}
  },
  get: () => {
    try { return JSON.parse(localStorage.getItem('janaa_user') || 'null'); }
    catch { return null; }
  },
  clear: () => {
    try { localStorage.removeItem('janaa_user'); } catch(e) {}
  },
  require: (allowedRoles = []) => {
    const user = Session.get();
    if (!user) {
      window.location.replace('index.html');
      return null;
    }
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      const dest = user.role === 'ops' ? 'ops.html' : user.role === 'admin' ? 'admin.html' : 'me.html';
      window.location.replace(dest);
      return null;
    }
    return user;
  }
};

/* ─── TOAST NOTIFICATIONS ─── */
const Toast = {
  _container: null,
  _getContainer() {
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.setAttribute('role', 'status');
      this._container.setAttribute('aria-live', 'polite');
      this._container.style.cssText = [
        'position:fixed', 'top:20px', 'right:20px', 'z-index:9999',
        'display:flex', 'flex-direction:column', 'gap:8px',
        'max-width:360px', 'pointer-events:none'
      ].join(';');
      document.body.appendChild(this._container);
    }
    return this._container;
  },
  show(msg, type = 'success', duration = 3500) {
    const icons  = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' };
    const colors = { success: '#10B981', error: '#EF4444', warning: '#F59E0B', info: '#1B4FFF' };
    const c = colors[type] || colors.info;
    const el = document.createElement('div');
    el.style.cssText = [
      'background:#fff', `border:1px solid #E5E7EB`, `border-left:4px solid ${c}`,
      'border-radius:8px', 'padding:12px 16px', 'font-size:.84rem', 'color:#374151',
      'box-shadow:0 4px 16px rgba(0,0,0,.12)', 'display:flex', 'align-items:center',
      'gap:10px', 'pointer-events:all', 'animation:toastIn .2s ease',
      'transition:opacity .3s ease', "font-family:'Inter',sans-serif"
    ].join(';');
    el.innerHTML = `<span style="color:${c};font-weight:700;font-size:1rem">${icons[type]||'ℹ'}</span><span style="flex:1">${fmt.escapeHtml(msg)}</span>`;
    this._getContainer().appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 350); }, duration);
  },
  success: (m) => Toast.show(m, 'success'),
  error:   (m) => Toast.show(m, 'error', 5000),
  warning: (m) => Toast.show(m, 'warning'),
  info:    (m) => Toast.show(m, 'info')
};

/* ─── LOADING STATE ─── */
const Loading = {
  show: (containerId, msg = 'Loading…') => {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                  min-height:300px;gap:16px;color:var(--gray-400)">
        <div class="spinner"></div>
        <span style="font-size:.9rem">${fmt.escapeHtml(msg)}</span>
      </div>`;
  },
  error: (containerId, msg = 'Failed to load data.', retryFn = null) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                  min-height:300px;gap:12px;text-align:center;padding:32px">
        <div style="font-size:2rem">⚠️</div>
        <h3 style="color:var(--gray-700)">Something went wrong</h3>
        <p style="color:var(--gray-400);font-size:.85rem">${fmt.escapeHtml(msg)}</p>
        ${retryFn ? `<button class="btn btn-primary btn-sm" onclick="(${retryFn.toString()})()">↻ Try Again</button>` : ''}
      </div>`;
  }
};

/* ─── MODAL HELPERS ─── */
const Modal = {
  open: (id) => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); }
  },
  close: (id) => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); }
  },
  closeAll: () => {
    document.querySelectorAll('.modal-overlay.open')
      .forEach(el => { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); });
  }
};

// Close modal on overlay backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) Modal.closeAll();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') Modal.closeAll();
});

/* ─── CONFIRM DIALOG (named janaaConfirm to avoid collision with window.confirm) ─── */
function janaaConfirm(message, onOk, onCancel = null) {
  const id = 'janaa-confirm-modal';
  let modal = document.getElementById(id);
  if (!modal) {
    modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'janaa-confirm-title');
    modal.innerHTML = `
      <div class="modal" style="max-width:420px">
        <div class="modal-header">
          <span class="modal-title" id="janaa-confirm-title">Confirm Action</span>
          <button class="modal-close" onclick="Modal.close('${id}')">✕</button>
        </div>
        <div class="modal-body">
          <p id="janaa-confirm-msg" style="font-size:.9rem;color:#374151;line-height:1.6"></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="janaa-confirm-cancel">Cancel</button>
          <button class="btn btn-primary"   id="janaa-confirm-ok">Confirm</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  document.getElementById('janaa-confirm-msg').textContent = message;

  // Clone buttons to remove old listeners
  ['janaa-confirm-ok', 'janaa-confirm-cancel'].forEach(btnId => {
    const old = document.getElementById(btnId);
    const fresh = old.cloneNode(true);
    old.parentNode.replaceChild(fresh, old);
  });

  document.getElementById('janaa-confirm-ok').addEventListener('click', () => {
    Modal.close(id); onOk();
  });
  document.getElementById('janaa-confirm-cancel').addEventListener('click', () => {
    Modal.close(id); if (onCancel) onCancel();
  });

  Modal.open(id);
}

/* ─── TABS ─── */
function initTabs(scopeEl = document) {
  scopeEl.querySelectorAll('.tabs .tab-btn').forEach(btn => {
    // Remove old listeners by cloning
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', () => {
      const tabId = fresh.dataset.tab;
      const container = fresh.closest('.tab-scope') || scopeEl;
      container.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      fresh.classList.add('active');
      const panel = container.querySelector(`#tab-${tabId}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ─── SIDEBAR BUILDER ─── */
function buildSidebar({ name, email, role, navItems, activePage }) {
  const roleLabels = { ops: 'Internal Ops', admin: 'Client Admin', employee: 'Employee' };
  const roleColors = { ops: '#1B4FFF', admin: '#10B981', employee: '#8B5CF6' };

  const navHTML = navItems.map(item => {
    if (item.type === 'section') {
      return `<div class="nav-section-label">${fmt.escapeHtml(item.label)}</div>`;
    }
    const isActive = activePage === item.id;
    const badge = item.badge ? `<span class="nav-badge">${fmt.escapeHtml(String(item.badge))}</span>` : '';
    const isExternal = item.href && item.href !== '#' && !item.href.startsWith('#');
    return `
      <a href="${isExternal ? item.href : '#'}"
         class="nav-item ${isActive ? 'active' : ''}"
         data-nav-id="${item.id}"
         ${!isExternal ? 'role="button" tabindex="0"' : ''}>
        <span class="nav-icon" aria-hidden="true">${item.icon}</span>
        <span>${fmt.escapeHtml(item.label)}</span>
        ${badge}
      </a>`;
  }).join('');

  return `
    <div class="sidebar-logo">
      <div class="logo-mark" aria-label="Janaa">J</div>
      <div>
        <div class="logo-text">Janaa</div>
        <span class="logo-sub">Global Payroll</span>
      </div>
    </div>
    <div class="sidebar-role-badge">
      <strong style="color:${roleColors[role] || '#fff'}">${roleLabels[role] || role}</strong>
      <span>${role === 'ops' ? 'Operations Portal' : role === 'admin' ? 'Employer Portal' : 'My Pay Portal'}</span>
    </div>
    <nav class="sidebar-nav" role="navigation" aria-label="Main navigation">${navHTML}</nav>
    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar" aria-hidden="true">${fmt.initials(name)}</div>
        <div class="user-info">
          <div class="user-name">${fmt.escapeHtml(name)}</div>
          <div class="user-email">${fmt.escapeHtml(email)}</div>
        </div>
        <button class="sign-out-btn" onclick="signOut()" title="Sign out" aria-label="Sign out">⏏</button>
      </div>
    </div>`;
}

/* ─── SIDEBAR NAV CLICK DELEGATION ─── */
function initSidebarNav(tabSwitchFn) {
  const nav = document.querySelector('.sidebar-nav');
  if (!nav) return;
  nav.addEventListener('click', (e) => {
    const item = e.target.closest('.nav-item[data-nav-id]');
    if (!item) return;
    const href = item.getAttribute('href');
    if (href && href !== '#') return; // let normal link navigation happen
    e.preventDefault();
    const id = item.dataset.navId;
    if (id && tabSwitchFn) tabSwitchFn(id);
  });
  // Keyboard accessibility
  nav.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const item = e.target.closest('.nav-item[data-nav-id]');
      if (!item) return;
      const href = item.getAttribute('href');
      if (href && href !== '#') return;
      e.preventDefault();
      const id = item.dataset.navId;
      if (id && tabSwitchFn) tabSwitchFn(id);
    }
  });
}

/* ─── SIGN OUT ─── */
function signOut() {
  Session.clear();
  window.location.replace('index.html');
}

/* ─── DUE DATE LABEL ─── */
function dueLabel(dateStr) {
  const days = fmt.daysUntil(dateStr);
  if (days === null) return '';
  if (days < 0)   return `<span class="badge badge-red">${Math.abs(days)}d overdue</span>`;
  if (days === 0) return `<span class="badge badge-red">Due today</span>`;
  if (days <= 3)  return `<span class="badge badge-red">${days}d left</span>`;
  if (days <= 7)  return `<span class="badge badge-yellow">${days}d left</span>`;
  return `<span class="badge badge-gray">${days}d left</span>`;
}

/* ─── GLOBAL ERROR HANDLER ─── */
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  Toast.error('An unexpected error occurred. Please refresh and try again.');
});

window.addEventListener('error', (e) => {
  // Only show toast for non-script-load errors
  if (e.filename) return;
  console.error('Global error:', e.error);
});

/* ─── SPINNER & ANIMATION STYLES ─── */
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastIn {
      from { opacity:0; transform:translateX(20px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes fadeIn {
      from { opacity:0; transform:translateY(6px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .page-content { animation: fadeIn .3s ease; }
    .spinner {
      width: 36px; height: 36px;
      border: 3px solid var(--gray-200);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin .8s linear infinite;
    }
    .skeleton {
      background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 4px;
    }
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
})();
