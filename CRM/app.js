/* ============================================================
   app.js — all UI rendering and interactions
   Depends on store.js (Store, STATUSES, PRODUCTS, SOURCES, PRIORITIES…)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- State ---------- */
  let leads = [];
  let filters = { search: '', status: '', priority: '', followupOnly: false };
  let view = 'table';
  let sortKey = 'updatedAt';
  let sortDir = -1;            // 1 = ascending, -1 = descending
  let editingId = null;
  let dragId = null;

  /* ---------- Element refs ---------- */
  const $ = (s) => document.querySelector(s);
  const el = {
    stats: $('#stats'),
    content: $('#content'),
    search: $('#search'),
    filterStatus: $('#filterStatus'),
    filterPriority: $('#filterPriority'),
    followupToggle: $('#followupToggle'),
    viewTable: $('#viewTable'),
    viewPipeline: $('#viewPipeline'),
    addBtn: $('#addBtn'),
    drawer: $('#drawer'),
    overlay: $('#drawerOverlay'),
    menuBtn: $('#menuBtn'),
    menu: $('#menu'),
    importFile: $('#importFile'),
    toasts: $('#toasts'),
    syncBtn: $('#syncBtn'),
    syncBadge: $('#syncBadge'),
    syncModal: $('#syncModal'),
    syncOverlay: $('#syncOverlay'),
    syncUrl: $('#syncUrl'),
    syncStatus: $('#syncStatus'),
  };

  /* ---------- Icons (inline SVG) ---------- */
  const ICONS = {
    whatsapp: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" stroke="none"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.3 7.3 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4 0-.7.3s-1 1-1 2.4 1 2.8 1.2 3a9.3 9.3 0 0 0 3.6 3.2c.5.2.9.4 1.2.5.5.1 1 .1 1.3.1.4-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.4-.3z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="17" height="17"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7 12 12 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12 12 0 0 0 2.8.7A2 2 0 0 1 22 16.9z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="17" height="17"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    edit: '<svg viewBox="0 0 24 24" width="17" height="17"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="17" height="17"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
    inbox: '<svg viewBox="0 0 24 24"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.5z"/></svg>',
  };

  /* ---------- Utilities ---------- */
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function daysUntil(ds) {
    if (!ds) return null;
    const p = ds.split('-').map(Number);
    if (p.length < 3) return null;
    const target = new Date(p[0], p[1] - 1, p[2]);
    const n = new Date();
    const t0 = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    return Math.round((target - t0) / 86400000);
  }
  function formatDate(ds) {
    if (!ds) return '';
    const p = ds.split('-').map(Number);
    if (p.length < 3) return ds;
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function waNumber(phone) {
    let d = String(phone || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.startsWith('0')) d = '60' + d.slice(1);
    return d;
  }
  function statusMeta(k) { return STATUS_BY_KEY[k] || { label: k, color: '#888' }; }
  function priorityMeta(k) { return PRIORITY_BY_KEY[k] || { label: k, color: '#888' }; }

  /* ---------- Filtering & sorting ---------- */
  const STATUS_ORDER = Object.fromEntries(STATUSES.map((s, i) => [s.key, i]));
  const PRIORITY_ORDER = { hot: 0, warm: 1, cold: 2 };

  function sortVal(l, key) {
    switch (key) {
      case 'status': return STATUS_ORDER[l.status] ?? 99;
      case 'priority': return PRIORITY_ORDER[l.priority] ?? 99;
      case 'nextFollowUp': return l.nextFollowUp || '9999-99-99';
      case 'name': return (l.name || '').toLowerCase();
      case 'source': return (l.source || '').toLowerCase();
      default: return (l[key] || '').toString().toLowerCase();
    }
  }
  function visibleLeads() {
    const q = filters.search.trim().toLowerCase();
    let arr = leads.filter((l) => {
      if (filters.status && l.status !== filters.status) return false;
      if (filters.priority && l.priority !== filters.priority) return false;
      if (filters.followupOnly) {
        const du = daysUntil(l.nextFollowUp);
        if (du === null || du > 0) return false;
      }
      if (q) {
        const hay = [l.name, l.phone, l.email, l.notes, (l.products || []).join(' '), l.source]
          .join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    arr.sort((a, b) => {
      const va = sortVal(a, sortKey), vb = sortVal(b, sortKey);
      if (va < vb) return -1 * sortDir;
      if (va > vb) return 1 * sortDir;
      return 0;
    });
    return arr;
  }

  /* ---------- Render: stats ---------- */
  function renderStats() {
    const counts = {};
    STATUSES.forEach((s) => (counts[s.key] = 0));
    leads.forEach((l) => { if (counts[l.status] !== undefined) counts[l.status]++; });
    const due = leads.filter((l) => { const d = daysUntil(l.nextFollowUp); return d !== null && d <= 0; }).length;

    const cards = [];
    const totalActive = !filters.status && !filters.followupOnly;
    cards.push(statCard('total', 'Total leads', leads.length, 'var(--blue)', totalActive));
    cards.push(statCard('due', 'Follow-ups due', due, '#dc2626', filters.followupOnly));
    STATUSES.forEach((s) => {
      cards.push(statCard(s.key, s.label, counts[s.key], s.color, filters.status === s.key && !filters.followupOnly));
    });
    el.stats.innerHTML = cards.join('');
  }
  function statCard(id, label, num, color, active) {
    return `<div class="stat${active ? ' is-active' : ''}" data-stat="${id}" style="--c:${color}">
      <div class="stat__num">${num}</div><div class="stat__label">${escapeHtml(label)}</div></div>`;
  }

  /* ---------- Render: content (table / pipeline / empty) ---------- */
  function renderContent() {
    if (leads.length === 0) { el.content.innerHTML = emptyStateAll(); return; }
    const rows = visibleLeads();
    if (rows.length === 0) { el.content.innerHTML = emptyStateFiltered(); return; }
    el.content.innerHTML = view === 'pipeline' ? pipelineHTML(rows) : tableHTML(rows);
  }

  function emptyStateAll() {
    return `<div class="empty">${ICONS.inbox}
      <h3>No leads yet</h3>
      <p>Add your first lead, or load a few samples to see how it works.</p>
      <div class="empty-actions">
        <button class="btn btn--primary" data-emptyadd>Add your first lead</button>
        <button class="btn" data-emptysample>Load sample leads</button>
      </div></div>`;
  }
  function emptyStateFiltered() {
    return `<div class="empty">${ICONS.inbox}
      <h3>No matches</h3><p>No leads match your search or filters.</p>
      <div class="empty-actions"><button class="btn" data-clearfilters>Clear filters</button></div></div>`;
  }

  function sortArrow(key) {
    if (sortKey !== key) return '';
    return `<span class="arrow">${sortDir === 1 ? '▲' : '▼'}</span>`;
  }
  function tableHTML(rows) {
    const head = `<tr>
      <th data-sort="name">Name ${sortArrow('name')}</th>
      <th class="no-label">Contact</th>
      <th data-sort="status">Status ${sortArrow('status')}</th>
      <th data-sort="priority">Priority ${sortArrow('priority')}</th>
      <th>Products</th>
      <th data-sort="nextFollowUp">Next follow-up ${sortArrow('nextFollowUp')}</th>
      <th>Notes</th>
      <th class="no-label"></th></tr>`;
    const body = rows.map(rowHTML).join('');
    return `<div class="table-wrap"><table class="leads"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
  }

  function rowHTML(l) {
    const sm = statusMeta(l.status), pm = priorityMeta(l.priority);
    const products = (l.products || []).map((p) => `<span class="tag">${escapeHtml(p)}</span>`).join('');
    const note = l.notes ? escapeHtml(l.notes.length > 70 ? l.notes.slice(0, 70) + '…' : l.notes) : '<span class="row-sub">—</span>';
    return `<tr data-id="${l.id}">
      <td data-label="Name"><div class="cell-content"><div class="row-name" data-edit="${l.id}">${escapeHtml(l.name || 'Unnamed')}</div>
        ${l.source ? `<div class="row-sub">${escapeHtml(l.source)}</div>` : ''}</div></td>
      <td data-label="Contact"><div class="cell-content">${contactButtons(l)}</div></td>
      <td data-label="Status"><div class="cell-content">${statusSelect(l)}</div></td>
      <td data-label="Priority"><div class="cell-content"><span class="prio-dot" style="--c:${pm.color}"></span>${escapeHtml(pm.label)}</div></td>
      <td data-label="Products"><div class="cell-content"><div class="tags">${products || '<span class="row-sub">—</span>'}</div></div></td>
      <td data-label="Follow-up"><div class="cell-content followcell">${followupText(l.nextFollowUp)}</div></td>
      <td data-label="Notes"><div class="cell-content row-sub">${note}</div></td>
      <td class="no-label"><div class="cell-content cell-actions">
        <button class="iconlink" data-edit="${l.id}" title="Edit" aria-label="Edit ${escapeHtml(l.name)}">${ICONS.edit}</button>
        <button class="iconlink del" data-del="${l.id}" title="Delete" aria-label="Delete ${escapeHtml(l.name)}">${ICONS.trash}</button>
      </div></td></tr>`;
  }

  function contactButtons(l) {
    const parts = [];
    const wa = waNumber(l.phone);
    if (wa) parts.push(`<a class="wa" href="https://wa.me/${wa}" target="_blank" rel="noopener" title="WhatsApp">${ICONS.whatsapp}</a>`);
    if (l.phone) parts.push(`<a href="tel:${escapeHtml(l.phone.replace(/\s+/g, ''))}" title="Call">${ICONS.phone}</a>`);
    if (l.email) parts.push(`<a href="mailto:${escapeHtml(l.email)}" title="Email">${ICONS.mail}</a>`);
    return `<span class="contact-btns">${parts.join('') || '<span class="row-sub">—</span>'}</span>`;
  }
  function statusSelect(l) {
    const opts = STATUSES.map((s) => `<option value="${s.key}"${s.key === l.status ? ' selected' : ''}>${s.label}</option>`).join('');
    return `<select class="status-select" data-status="${l.id}" style="--c:${statusMeta(l.status).color}">${opts}</select>`;
  }
  function followupText(ds) {
    if (!ds) return '<span class="none">—</span>';
    const d = daysUntil(ds), label = formatDate(ds);
    if (d < 0) return `<span class="due">${label} · ${Math.abs(d)}d overdue</span>`;
    if (d === 0) return `<span class="today">${label} · today</span>`;
    if (d <= 7) return `<span class="soon">${label} · in ${d}d</span>`;
    return `<span>${label}</span>`;
  }

  /* ---------- Render: pipeline ---------- */
  function pipelineHTML(rows) {
    const cols = STATUSES.map((s) => {
      const items = rows.filter((l) => l.status === s.key);
      const cards = items.map(pcardHTML).join('') || '<div class="row-sub" style="padding:8px 4px;">Drop here</div>';
      return `<div class="pcol" data-status="${s.key}">
        <div class="pcol__head" style="color:${s.color}">${s.label}<span class="count">${items.length}</span></div>
        <div class="pcol__body" data-status="${s.key}">${cards}</div></div>`;
    }).join('');
    return `<div class="pipeline">${cols}</div>`;
  }
  function pcardHTML(l) {
    const pm = priorityMeta(l.priority);
    const products = (l.products || []).slice(0, 3).map((p) => `<span class="tag">${escapeHtml(p)}</span>`).join('');
    return `<div class="pcard" draggable="true" data-id="${l.id}" style="--c:${statusMeta(l.status).color}">
      <div class="pcard__name" data-edit="${l.id}">${escapeHtml(l.name || 'Unnamed')}</div>
      <div class="pcard__meta"><span class="prio-dot" style="--c:${pm.color}"></span>${escapeHtml(pm.label)}${l.source ? ' · ' + escapeHtml(l.source) : ''}</div>
      <div class="tags" style="margin-top:6px">${products}</div>
      <div class="pcard__foot"><span class="followcell" style="font-size:12px">${followupText(l.nextFollowUp)}</span>${contactButtons(l)}</div>
    </div>`;
  }

  /* ---------- Drawer / form ---------- */
  function openForm(id) {
    editingId = id || null;
    const lead = id ? leads.find((l) => l.id === id) : blankLead();
    el.drawer.innerHTML = formHTML(lead, !!id);
    el.drawer.hidden = false;
    el.overlay.hidden = false;
    bindFormEvents();
    const nameInput = el.drawer.querySelector('#f_name');
    if (nameInput && !id) setTimeout(() => nameInput.focus(), 50);
  }
  function closeForm() {
    el.drawer.hidden = true;
    el.overlay.hidden = true;
    el.drawer.innerHTML = '';
    editingId = null;
  }
  function formHTML(l, editing) {
    const statusOpts = STATUSES.map((s) => `<option value="${s.key}"${s.key === l.status ? ' selected' : ''}>${s.label}</option>`).join('');
    const prioOpts = PRIORITIES.map((p) => `<option value="${p.key}"${p.key === l.priority ? ' selected' : ''}>${p.label}</option>`).join('');
    const srcOpts = ['<option value="">— Source —</option>'].concat(
      SOURCES.map((s) => `<option value="${s}"${s === l.source ? ' selected' : ''}>${s}</option>`)).join('');
    const langOpts = ['<option value="">— Language —</option>'].concat(
      (typeof LANGUAGES !== 'undefined' ? LANGUAGES : []).map((s) => `<option value="${s}"${s === l.language ? ' selected' : ''}>${s}</option>`)).join('');
    const stageOpts = ['<option value="">— Life stage —</option>'].concat(
      (typeof LIFE_STAGES !== 'undefined' ? LIFE_STAGES : []).map((s) => `<option value="${s}"${s === l.lifeStage ? ' selected' : ''}>${s}</option>`)).join('');
    const productChecks = PRODUCTS.map((p) => {
      const on = (l.products || []).includes(p);
      return `<label class="check${on ? ' is-checked' : ''}"><input type="checkbox" value="${p}"${on ? ' checked' : ''}>${p}</label>`;
    }).join('');
    const showPolicy = l.status === 'policyholder' || l.policyNo || l.planName || l.premium || l.policyStart;
    return `
      <div class="drawer__head">
        <h2>${editing ? 'Edit lead' : 'New lead'}</h2>
        <button class="icon-btn" data-close style="background:#eef1f7;color:#5b6677">✕</button>
      </div>
      <div class="drawer__body">
        <div class="field"><label>Name <span class="req">*</span></label>
          <input id="f_name" type="text" value="${escapeHtml(l.name)}" placeholder="e.g. Lim Wei Jie" />
          <div class="field-error" id="err_name" style="display:none">Please enter a name.</div></div>
        <div class="field--row">
          <div class="field"><label>Phone (WhatsApp)</label><input id="f_phone" type="tel" value="${escapeHtml(l.phone)}" placeholder="+60 12-345 6789" /></div>
          <div class="field"><label>Email</label><input id="f_email" type="email" value="${escapeHtml(l.email)}" placeholder="name@email.com" /></div>
        </div>
        <div class="field--row">
          <div class="field"><label>Status</label><select id="f_status">${statusOpts}</select></div>
          <div class="field"><label>Priority</label><select id="f_priority">${prioOpts}</select></div>
        </div>
        <div class="field"><label>Products of interest</label><div class="checks" id="f_products">${productChecks}</div></div>
        <div class="field--row">
          <div class="field"><label>Source</label><select id="f_source">${srcOpts}</select></div>
          <div class="field"><label>Next follow-up</label><input id="f_followup" type="date" value="${escapeHtml(l.nextFollowUp)}" /></div>
        </div>
        <div class="field--row">
          <div class="field"><label>Language</label><select id="f_language">${langOpts}</select></div>
          <div class="field"><label>Life stage</label><select id="f_lifestage">${stageOpts}</select></div>
        </div>
        <div class="field--row">
          <div class="field"><label>Est. FYC (RM)</label><input id="f_fyc" type="number" min="0" step="any" value="${escapeHtml(l.fyc)}" placeholder="6500" /></div>
          <div class="field"><label>Last contact</label><input id="f_lastcontact" type="date" value="${escapeHtml(l.lastContact)}" /></div>
        </div>
        <div class="field"><label>Notes</label><textarea id="f_notes" placeholder="What did you discuss? Family, budget, concerns, next steps…">${escapeHtml(l.notes)}</textarea></div>

        <div id="policySection" style="${showPolicy ? '' : 'display:none'}">
          <div class="section-title">Policy details (for policyholders)</div>
          <div class="field--row">
            <div class="field"><label>Policy no.</label><input id="f_policyNo" type="text" value="${escapeHtml(l.policyNo)}" placeholder="AZ-000000" /></div>
            <div class="field"><label>Plan name</label><input id="f_planName" type="text" value="${escapeHtml(l.planName)}" placeholder="e.g. Allianz Life Protect" /></div>
          </div>
          <div class="field--row">
            <div class="field"><label>Annual premium (RM)</label><input id="f_premium" type="number" min="0" step="any" value="${escapeHtml(l.premium)}" placeholder="3600" /></div>
            <div class="field"><label>Policy start</label><input id="f_policyStart" type="date" value="${escapeHtml(l.policyStart)}" /></div>
          </div>
        </div>
      </div>
      <div class="drawer__foot">
        ${editing ? `<button class="btn btn--danger" data-delete="${l.id}">Delete</button>` : ''}
        <span style="flex:1"></span>
        <button class="btn" data-close>Cancel</button>
        <button class="btn btn--primary" data-save>Save</button>
      </div>`;
  }

  function collectForm() {
    const q = (id) => el.drawer.querySelector(id);
    const products = Array.from(el.drawer.querySelectorAll('#f_products input:checked')).map((c) => c.value);
    const v = (id) => { const n = q(id); return n ? n.value.trim() : ''; };
    return {
      name: q('#f_name').value.trim(),
      phone: q('#f_phone').value.trim(),
      email: q('#f_email').value.trim(),
      status: q('#f_status').value,
      priority: q('#f_priority').value,
      products,
      source: q('#f_source').value,
      nextFollowUp: q('#f_followup').value,
      language: v('#f_language'),
      lifeStage: v('#f_lifestage'),
      fyc: v('#f_fyc'),
      lastContact: v('#f_lastcontact'),
      notes: q('#f_notes').value.trim(),
      policyNo: q('#f_policyNo').value.trim(),
      planName: q('#f_planName').value.trim(),
      premium: q('#f_premium').value.trim(),
      policyStart: q('#f_policyStart').value,
    };
  }
  async function saveForm() {
    const data = collectForm();
    if (!data.name) {
      const e = el.drawer.querySelector('#err_name');
      if (e) e.style.display = 'block';
      el.drawer.querySelector('#f_name').focus();
      return;
    }
    if (editingId) { await Store.update(editingId, data); toast('Lead updated', 'success'); }
    else { await Store.add(data); toast('Lead added', 'success'); }
    await refresh();
    closeForm();
    AutoSync.pushChange();
  }

  function bindFormEvents() {
    el.drawer.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeForm));
    el.drawer.querySelector('[data-save]').addEventListener('click', saveForm);
    const del = el.drawer.querySelector('[data-delete]');
    if (del) del.addEventListener('click', () => deleteLead(del.getAttribute('data-delete')));
    // product chip highlight
    el.drawer.querySelectorAll('#f_products .check input').forEach((c) => {
      c.addEventListener('change', () => c.closest('.check').classList.toggle('is-checked', c.checked));
    });
    // reveal policy section when status becomes Policyholder
    const st = el.drawer.querySelector('#f_status');
    st.addEventListener('change', () => {
      if (st.value === 'policyholder') el.drawer.querySelector('#policySection').style.display = '';
    });
  }

  /* ---------- Actions ---------- */
  async function changeStatus(id, status) {
    await Store.update(id, { status });
    await refresh();
    AutoSync.pushChange();
  }
  async function deleteLead(id) {
    const lead = leads.find((l) => l.id === id);
    if (!confirm(`Delete "${lead ? lead.name : 'this lead'}"? This cannot be undone.`)) return;
    await Store.remove(id);
    if (editingId === id) closeForm();
    await refresh();
    toast('Lead deleted');
    AutoSync.pushChange();
  }
  async function loadSample() {
    if (leads.length && !confirm('Load sample leads? This adds 7 example leads to your list.')) return;
    const existing = await Store.getAll();
    await Store.loadSample();
    if (existing.length) { // loadSample replaces; restore + append samples instead
      const samples = await Store.getAll();
      await Store.replaceAll(existing.concat(samples));
    }
    await refresh();
    toast('Sample leads loaded', 'success');
    AutoSync.pushChange();
  }
  async function clearAll() {
    if (!confirm('Delete ALL leads permanently? Consider exporting to Excel first. This cannot be undone.')) return;
    await Store.clear();
    await refresh();
    toast('All data cleared');
    AutoSync.pushChange();
  }

  /* ---------- CSV export / import ---------- */
  const CSV_HEADERS = ['Name', 'Phone', 'Email', 'Status', 'Priority', 'Products', 'Source', 'Next Follow-up', 'Notes', 'Policy No', 'Plan', 'Premium (RM)', 'Policy Start', 'Created', 'Updated'];
  function csvCell(v) {
    const s = String(v == null ? '' : v);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function exportCSV() {
    if (!leads.length) { toast('Nothing to export', 'error'); return; }
    const rows = leads.map((l) => [
      l.name, l.phone, l.email, statusMeta(l.status).label, priorityMeta(l.priority).label,
      (l.products || []).join('; '), l.source, l.nextFollowUp, l.notes,
      l.policyNo, l.planName, l.premium, l.policyStart, l.createdAt, l.updatedAt,
    ]);
    const csv = [CSV_HEADERS, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `yh-crm-${todayStr()}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast('Exported to CSV', 'success');
  }
  function parseCSV(text) {
    const rows = []; let row = [], field = '', inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
        else field += c;
      } else if (c === '"') inQ = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* ignore */ }
      else field += c;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter((r) => r.some((c) => c.trim() !== ''));
  }
  function importCSV(file) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        let text = String(reader.result || '');
        if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
        const rows = parseCSV(text);
        if (rows.length < 2) { toast('No rows found in file', 'error'); return; }
        const headers = rows[0].map((h) => h.trim().toLowerCase());
        const idx = (names) => { for (const n of names) { const i = headers.indexOf(n); if (i !== -1) return i; } return -1; };
        const col = {
          name: idx(['name']), phone: idx(['phone']), email: idx(['email']),
          status: idx(['status']), priority: idx(['priority']), products: idx(['products']),
          source: idx(['source']), followup: idx(['next follow-up', 'next followup', 'follow-up']),
          notes: idx(['notes']), policyNo: idx(['policy no', 'policy no.']), plan: idx(['plan', 'plan name']),
          premium: idx(['premium (rm)', 'premium']), start: idx(['policy start']),
        };
        const statusByLabel = {}; STATUSES.forEach((s) => { statusByLabel[s.label.toLowerCase()] = s.key; statusByLabel[s.key] = s.key; });
        const prioByLabel = {}; PRIORITIES.forEach((p) => { prioByLabel[p.label.toLowerCase()] = p.key; prioByLabel[p.key] = p.key; });
        const get = (r, i) => (i >= 0 && i < r.length ? r[i].trim() : '');
        const imported = rows.slice(1).map((r) => {
          const rec = blankLead();
          rec.name = get(r, col.name); rec.phone = get(r, col.phone); rec.email = get(r, col.email);
          rec.status = statusByLabel[get(r, col.status).toLowerCase()] || 'new';
          rec.priority = prioByLabel[get(r, col.priority).toLowerCase()] || 'warm';
          rec.products = get(r, col.products).split(/[;,]/).map((s) => s.trim()).filter(Boolean);
          rec.source = get(r, col.source); rec.nextFollowUp = get(r, col.followup); rec.notes = get(r, col.notes);
          rec.policyNo = get(r, col.policyNo); rec.planName = get(r, col.plan);
          rec.premium = get(r, col.premium); rec.policyStart = get(r, col.start);
          return rec;
        }).filter((r) => r.name);
        if (!imported.length) { toast('No valid rows (Name required)', 'error'); return; }
        if (!confirm(`Import ${imported.length} lead(s)? They will be added to your current ${leads.length} lead(s).`)) return;
        await Store.replaceAll(leads.concat(imported));
        await refresh();
        toast(`Imported ${imported.length} lead(s)`, 'success');
        AutoSync.pushChange();
      } catch (e) {
        console.error(e); toast('Could not read that file', 'error');
      }
    };
    reader.readAsText(file);
  }

  /* ---------- Sync UI ---------- */
  function renderSyncBadge() {
    const cfg = Sync.getConfig();
    if (!cfg.url) {
      // Not connected — keep the appbar clean, no badge clutter.
      el.syncBadge.hidden = true;
      el.syncBadge.textContent = '';
      el.syncBadge.className = 'sync-badge';
      return;
    }
    el.syncBadge.hidden = false;
    if (cfg.lastSync) {
      const d = new Date(cfg.lastSync);
      const ago = humanAgo(d);
      el.syncBadge.textContent = 'Synced ' + ago;
      el.syncBadge.className = 'sync-badge is-connected';
      el.syncBadge.title = 'Last synced: ' + d.toLocaleString();
    } else {
      el.syncBadge.textContent = 'Connected';
      el.syncBadge.className = 'sync-badge is-connected';
      el.syncBadge.title = 'Connected, not yet synced';
    }
  }
  function humanAgo(d) {
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }
  function openSyncModal() {
    const cfg = Sync.getConfig();
    el.syncUrl.value = cfg.url || '';
    el.syncStatus.hidden = true;
    el.syncStatus.textContent = '';
    el.syncStatus.className = 'sync-status';
    el.syncModal.querySelector('[data-syncdisconnect]').hidden = !cfg.url;
    el.syncModal.querySelector('[data-syncrun]').hidden = !cfg.url;
    const autoToggle = el.syncModal.querySelector('#syncAutoToggle');
    if (autoToggle) autoToggle.checked = cfg.autoSync === true;
    el.syncModal.hidden = false;
    el.syncOverlay.hidden = false;
  }
  function closeSyncModal() {
    el.syncModal.hidden = true;
    el.syncOverlay.hidden = true;
  }
  function showSyncStatus(msg, type) {
    el.syncStatus.textContent = msg;
    el.syncStatus.className = 'sync-status ' + (type || 'info');
    el.syncStatus.hidden = false;
  }
  async function syncTestAndSave() {
    const url = el.syncUrl.value.trim();
    if (!url) { showSyncStatus('Please paste your Apps Script URL.', 'error'); return; }
    if (!/^https:\/\/script\.google\.com\//.test(url)) {
      showSyncStatus('That does not look like an Apps Script URL. It should start with https://script.google.com/', 'error');
      return;
    }
    Sync.setConfig({ url });
    showSyncStatus('Testing connection…', 'info');
    try {
      const remote = await Sync.pull();
      // Default auto-sync to ON on first successful connect
      const cfg = Sync.getConfig();
      if (cfg.autoSync !== false) Sync.setConfig({ autoSync: true });
      showSyncStatus(`✓ Connected. Found ${remote.length} lead(s) in Sheets. Auto-sync is ON.`, 'success');
      renderSyncBadge();
      el.syncModal.querySelector('[data-syncdisconnect]').hidden = false;
      el.syncModal.querySelector('[data-syncrun]').hidden = false;
      const autoToggle = el.syncModal.querySelector('#syncAutoToggle');
      if (autoToggle) autoToggle.checked = Sync.getConfig().autoSync === true;
      // Start auto-sync (which will do an initial sync immediately)
      AutoSync.start();
    } catch (e) {
      console.error(e);
      showSyncStatus('✗ Could not reach Apps Script: ' + (e.message || 'unknown error'), 'error');
    }
  }
  function toggleAutoSync(on) {
    AutoSync.setEnabled(on);
    if (on) {
      AutoSync.start();
      toast('Auto-sync enabled', 'success');
    } else {
      toast('Auto-sync disabled — use Sync now to sync manually');
    }
    renderSyncBadge();
  }
  async function syncRun() {
    el.syncBtn.classList.add('is-syncing');
    el.syncBadge.textContent = 'Syncing…';
    el.syncBadge.className = 'sync-badge is-syncing';
    showSyncStatus('Syncing in both directions…', 'info');
    try {
      const result = await Sync.syncNow();
      showSyncStatus(`✓ Synced. Local: ${result.localCount} · Sheets: ${result.remoteCount} · Merged: ${result.mergedCount}`, 'success');
      await refresh();
      toast('Synced with Google Sheets', 'success');
    } catch (e) {
      console.error(e);
      showSyncStatus('✗ Sync failed: ' + (e.message || 'unknown error'), 'error');
      toast('Sync failed — see modal', 'error');
    } finally {
      el.syncBtn.classList.remove('is-syncing');
      renderSyncBadge();
    }
  }
  function syncDisconnect() {
    if (!confirm('Disconnect from Google Sheets? Your local leads stay here; you can reconnect later.')) return;
    Sync.setConfig({ url: '', lastSync: '', autoSync: false });
    AutoSync._started = false;
    if (AutoSync._periodicTimer) { clearInterval(AutoSync._periodicTimer); AutoSync._periodicTimer = null; }
    renderSyncBadge();
    closeSyncModal();
    toast('Disconnected');
  }
  async function syncFromMenu() {
    if (!Sync.isConfigured()) { openSyncModal(); return; }
    await syncRun();
  }

  /* ---------- Toasts ---------- */
  function toast(msg, type) {
    const t = document.createElement('div');
    t.className = 'toast' + (type ? ' ' + type : '');
    t.textContent = msg;
    el.toasts.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 2600);
  }

  /* ---------- Toolbar sync ---------- */
  function syncToolbar() {
    el.filterStatus.value = filters.status;
    el.filterPriority.value = filters.priority;
    el.followupToggle.setAttribute('aria-pressed', String(filters.followupOnly));
    el.viewTable.classList.toggle('is-active', view === 'table');
    el.viewPipeline.classList.toggle('is-active', view === 'pipeline');
    el.viewTable.setAttribute('aria-selected', String(view === 'table'));
    el.viewPipeline.setAttribute('aria-selected', String(view === 'pipeline'));
  }

  /* ---------- Render all ---------- */
  function renderAll() { renderStats(); syncToolbar(); renderContent(); }
  async function refresh() { leads = await Store.getAll(); renderAll(); }

  /* ---------- Build static option lists ---------- */
  function buildFilterOptions() {
    el.filterStatus.innerHTML = '<option value="">All statuses</option>' +
      STATUSES.map((s) => `<option value="${s.key}">${s.label}</option>`).join('');
    el.filterPriority.innerHTML = '<option value="">All priorities</option>' +
      PRIORITIES.map((p) => `<option value="${p.key}">${p.label}</option>`).join('');
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    el.search.addEventListener('input', () => { filters.search = el.search.value; renderContent(); });
    el.filterStatus.addEventListener('change', () => { filters.status = el.filterStatus.value; if (filters.status) filters.followupOnly = false; renderAll(); });
    el.filterPriority.addEventListener('change', () => { filters.priority = el.filterPriority.value; renderContent(); });
    el.followupToggle.addEventListener('click', () => { filters.followupOnly = !filters.followupOnly; if (filters.followupOnly) filters.status = ''; renderAll(); });
    el.viewTable.addEventListener('click', () => { view = 'table'; renderAll(); });
    el.viewPipeline.addEventListener('click', () => { view = 'pipeline'; renderAll(); });
    el.addBtn.addEventListener('click', () => openForm());
    el.overlay.addEventListener('click', closeForm);

    // menu
    el.menuBtn.addEventListener('click', (e) => { e.stopPropagation(); el.menu.hidden = !el.menu.hidden; });
    document.addEventListener('click', () => { el.menu.hidden = true; });
    el.menu.addEventListener('click', (e) => {
      const a = e.target.closest('button'); if (!a) return;
      const act = a.getAttribute('data-action');
      if (act === 'export') exportCSV();
      else if (act === 'import') el.importFile.click();
      else if (act === 'sample') loadSample();
      else if (act === 'clear') clearAll();
      else if (act === 'syncSettings') openSyncModal();
      else if (act === 'syncNow') syncFromMenu();
    });

    // sync button in appbar
    el.syncBtn.addEventListener('click', syncFromMenu);

    // sync modal
    el.syncOverlay.addEventListener('click', closeSyncModal);
    el.syncModal.querySelectorAll('[data-syncclose]').forEach(b => b.addEventListener('click', closeSyncModal));
    el.syncModal.querySelector('[data-synctest]').addEventListener('click', syncTestAndSave);
    el.syncModal.querySelector('[data-syncrun]').addEventListener('click', syncRun);
    el.syncModal.querySelector('[data-syncdisconnect]').addEventListener('click', syncDisconnect);
    const autoToggle = el.syncModal.querySelector('#syncAutoToggle');
    if (autoToggle) autoToggle.addEventListener('change', (e) => toggleAutoSync(e.target.checked));
    el.importFile.addEventListener('change', () => { if (el.importFile.files[0]) importCSV(el.importFile.files[0]); el.importFile.value = ''; });

    // stats click → filter
    el.stats.addEventListener('click', (e) => {
      const card = e.target.closest('.stat'); if (!card) return;
      const id = card.getAttribute('data-stat');
      if (id === 'total') { filters.status = ''; filters.followupOnly = false; }
      else if (id === 'due') { filters.followupOnly = !filters.followupOnly; filters.status = ''; }
      else { filters.followupOnly = false; filters.status = filters.status === id ? '' : id; }
      renderAll();
    });

    // content delegation (table + pipeline + empty states)
    el.content.addEventListener('click', (e) => {
      const edit = e.target.closest('[data-edit]');
      if (edit) { openForm(edit.getAttribute('data-edit')); return; }
      const del = e.target.closest('[data-del]');
      if (del) { deleteLead(del.getAttribute('data-del')); return; }
      const th = e.target.closest('th[data-sort]');
      if (th) { const k = th.getAttribute('data-sort'); if (sortKey === k) sortDir *= -1; else { sortKey = k; sortDir = 1; } renderContent(); return; }
      if (e.target.closest('[data-emptyadd]')) { openForm(); return; }
      if (e.target.closest('[data-emptysample]')) { loadSample(); return; }
      if (e.target.closest('[data-clearfilters]')) { filters = { search: '', status: '', priority: '', followupOnly: false }; el.search.value = ''; renderAll(); return; }
    });
    el.content.addEventListener('change', (e) => {
      const sel = e.target.closest('.status-select');
      if (sel) changeStatus(sel.getAttribute('data-status'), sel.value);
    });

    // pipeline drag & drop
    el.content.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.pcard'); if (!card) return;
      dragId = card.getAttribute('data-id'); card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.content.addEventListener('dragend', (e) => {
      const card = e.target.closest('.pcard'); if (card) card.classList.remove('dragging');
      el.content.querySelectorAll('.drag-over').forEach((x) => x.classList.remove('drag-over'));
    });
    el.content.addEventListener('dragover', (e) => {
      const body = e.target.closest('.pcol__body'); if (!body) return;
      e.preventDefault(); body.classList.add('drag-over');
    });
    el.content.addEventListener('dragleave', (e) => {
      const body = e.target.closest('.pcol__body'); if (body) body.classList.remove('drag-over');
    });
    el.content.addEventListener('drop', (e) => {
      const body = e.target.closest('.pcol__body'); if (!body || !dragId) return;
      e.preventDefault();
      const status = body.getAttribute('data-status');
      const id = dragId; dragId = null;
      changeStatus(id, status);
    });

    // keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (el.syncModal && !el.syncModal.hidden) { closeSyncModal(); return; }
      if (!el.drawer.hidden) { closeForm(); return; }
      el.menu.hidden = true;
    });
  }

  /* ---------- Init ---------- */
  async function init() {
    buildFilterOptions();
    bindEvents();
    leads = await Store.getAll();
    renderAll();
    renderSyncBadge();
    // Refresh badge time every 60s so "synced 3m ago" stays current
    setInterval(renderSyncBadge, 60000);

    // When an auto-sync finishes, re-render and update the badge
    AutoSync.onAfterSync(async (result) => {
      if (result.ok) {
        leads = await Store.getAll();
        renderAll();
      }
      renderSyncBadge();
    });

    // Kick off auto-sync (no-op if not configured or disabled)
    AutoSync.start();
  }
  init();
})();
