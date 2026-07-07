/* ============================================================
   store.js — data layer for the CRM
   Phase 1: saves to this browser (localStorage).
   Phase 2: bidirectional sync with Google Sheets CRM via Apps Script.
   The same async API stays compatible with app.js.
   ============================================================ */

/* ----- Reference data (the insurance pipeline) ----- */
const STATUSES = [
  { key: 'new',          label: 'New Lead',           color: '#2563eb' },
  { key: 'contacted',    label: 'Contacted',          color: '#0891b2' },
  { key: 'followup',     label: 'Follow-up',          color: '#d97706' },
  { key: 'appointment',  label: 'Appointment Set',    color: '#7c3aed' },
  { key: 'proposal',     label: 'Proposal Presented', color: '#4f46e5' },
  { key: 'policyholder', label: 'Policyholder',       color: '#16a34a' },
  { key: 'lost',         label: 'Not Interested',     color: '#94a3b8' },
];

const PRODUCTS = ['Medical Card', 'Term Life', 'Whole Life', 'Critical Illness', 'Personal Accident', 'Savings Plan', 'Investment-Linked (ILP)'];

const SOURCES = ['Referral', 'Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'WhatsApp', 'Cold DM', 'Walk-in', 'Student Event', 'A5 Survey', 'Roadshow / Event', 'Strategic Partner', 'Landing Page', 'Existing Client', 'Family/Warm', 'Other'];

const LANGUAGES = ['BM', 'English', 'Mandarin', 'Mixed'];

const LIFE_STAGES = ['Student', 'Single working', 'Just married', 'New parent', 'Family with kids', 'Pre-retirement', 'Other'];

const PRIORITIES = [
  { key: 'hot',  label: 'Hot',  color: '#dc2626' },
  { key: 'warm', label: 'Warm', color: '#d97706' },
  { key: 'cold', label: 'Cold', color: '#0891b2' },
];

/* Quick lookups */
const STATUS_BY_KEY = Object.fromEntries(STATUSES.map(s => [s.key, s]));
const PRIORITY_BY_KEY = Object.fromEntries(PRIORITIES.map(p => [p.key, p]));

/* ----- Field mappings between this CRM and the Sheets CRM ----- */

/* Web status (key) ↔ Sheets pipeline stage (label) */
const WEB_TO_SHEETS_STATUS = {
  'new':          'New Lead',
  'contacted':    'Contacted',
  'followup':     'Nurture',
  'appointment':  'Diagnostic Booked',
  'proposal':     'Proposal Sent',
  'policyholder': 'Closed Won',
  'lost':         'Closed Lost',
};
const SHEETS_TO_WEB_STATUS = {
  'New Lead':           'new',
  'Contacted':          'contacted',
  'Touch 1 - Value':    'contacted',
  'Touch 2 - Resource': 'contacted',
  'Touch 3 - Meeting Ask': 'contacted',
  'Diagnostic Booked':  'appointment',
  'Diagnostic Done':    'appointment',
  'Proposal Sent':      'proposal',
  'Negotiating':        'proposal',
  'Closed Won':         'policyholder',
  'Closed Lost':        'lost',
  'Nurture':            'followup',
};

const WEB_TO_SHEETS_PRIORITY = { hot: 'High', warm: 'Medium', cold: 'Low' };
const SHEETS_TO_WEB_PRIORITY = { High: 'hot', Medium: 'warm', Low: 'cold' };

/* ----- Helpers ----- */
function uid() {
  return 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function nowISO() { return new Date().toISOString(); }

/* A fresh, empty lead with sensible defaults */
function blankLead() {
  return {
    id: uid(),
    name: '', phone: '', email: '',
    status: 'new', priority: 'warm',
    products: [], source: '',
    nextFollowUp: '', notes: '',
    policyNo: '', planName: '', premium: '', policyStart: '',
    /* New fields (sync with Sheets CRM) */
    fyc: '',           // estimated FYC in RM (for MDRT tracking)
    language: '',      // BM / English / Mandarin / Mixed
    lifeStage: '',     // Student, New parent, etc.
    lastContact: '',   // last interaction date — feeds Sheets A8CC counter when stage=Closed Won
    createdAt: nowISO(), updatedAt: nowISO(),
  };
}

/* ----- Storage backend (localStorage for Phase 1) ----- */
const KEY = 'yh.crm.leads.v1';
const SYNC_KEY = 'yh.crm.sync.v1';

const Store = {
  version: 3,

  async getAll() {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      console.error('Failed to read data', e);
      return [];
    }
  },

  async _writeAll(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
    return arr;
  },

  async add(lead) {
    const arr = await this.getAll();
    const rec = Object.assign(blankLead(), lead, { updatedAt: nowISO() });
    if (!rec.createdAt) rec.createdAt = nowISO();
    arr.unshift(rec);
    await this._writeAll(arr);
    return rec;
  },

  async update(id, patch) {
    const arr = await this.getAll();
    const i = arr.findIndex(l => l.id === id);
    if (i === -1) return null;
    arr[i] = Object.assign({}, arr[i], patch, { updatedAt: nowISO() });
    await this._writeAll(arr);
    return arr[i];
  },

  async remove(id) {
    const arr = await this.getAll();
    await this._writeAll(arr.filter(l => l.id !== id));
  },

  async replaceAll(arr) {
    const clean = arr.map(l => Object.assign(blankLead(), l));
    return this._writeAll(clean);
  },

  async clear() {
    return this._writeAll([]);
  },

  /* Demo data so the app isn't empty on first open */
  async loadSample() {
    const d = (offset) => {
      const x = new Date(); x.setDate(x.getDate() + offset);
      return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
    };
    const sample = [
      { name: 'Lim Wei Jie', phone: '+60123456789', email: 'weijie.lim@gmail.com', status: 'appointment', priority: 'hot', products: ['Medical', 'Critical Illness'], source: 'Referral', nextFollowUp: d(1), notes: 'Newly married, expecting first child. Wants medical card + CI. Meeting at Starbucks SS15 Tue 3pm.' },
      { name: 'Nurul Aina', phone: '+60198887766', email: 'aina.nurul@yahoo.com', status: 'proposal', priority: 'hot', products: ['Savings', 'Life'], source: 'Instagram', nextFollowUp: d(0), notes: 'Presented education savings plan for 2 kids. Comparing with one other agent — follow up TODAY.' },
      { name: 'Tan Boon Hock', phone: '+60127334455', email: 'bhtan@hotmail.com', status: 'policyholder', priority: 'warm', products: ['Life', 'Personal Accident'], source: 'Existing Client', nextFollowUp: d(180), notes: 'Existing client since 2021. Annual review due. Possible top-up.', policyNo: 'AZ-883201', planName: 'Allianz Life Protect', premium: '3600', policyStart: '2021-03-15' },
      { name: 'Priya Raman', phone: '+60165542310', email: 'priya.r@gmail.com', status: 'contacted', priority: 'warm', products: ['Medical'], source: 'Facebook', nextFollowUp: d(3), notes: 'Asked about medical card for parents. Send brochure + quote.' },
      { name: 'Daniel Wong', phone: '+60112239988', email: '', status: 'new', priority: 'cold', products: ['Personal Accident'], source: 'Roadshow / Event', nextFollowUp: d(7), notes: 'Met at Sunway Pyramid roadshow. Interested in cheap PA plan.' },
      { name: 'Siti Khadijah', phone: '+60134567120', email: 'siti.k@gmail.com', status: 'followup', priority: 'warm', products: ['Savings'], source: 'Referral', nextFollowUp: d(-2), notes: 'Said call back after payday. OVERDUE — call her.' },
      { name: 'Gopal Krishnan', phone: '+60195551234', email: 'gopal.k@outlook.com', status: 'lost', priority: 'cold', products: ['Life'], source: 'WhatsApp', nextFollowUp: '', notes: 'Already covered by another insurer. Re-approach next year.' },
    ];
    const recs = sample.map(s => Object.assign(blankLead(), s));
    return this._writeAll(recs);
  },
};

/* ============================================================
   Sync module — bidirectional sync with Google Sheets CRM
   ============================================================ */

const Sync = {
  /* ----- Config (URL + last sync time) persists in localStorage ----- */
  getConfig() {
    try {
      const raw = localStorage.getItem(SYNC_KEY);
      return raw ? JSON.parse(raw) : { url: '', lastSync: '', autoSync: false };
    } catch (e) {
      return { url: '', lastSync: '', autoSync: false };
    }
  },
  setConfig(patch) {
    const cur = this.getConfig();
    const next = Object.assign({}, cur, patch);
    localStorage.setItem(SYNC_KEY, JSON.stringify(next));
    return next;
  },
  isConfigured() {
    return !!this.getConfig().url;
  },

  /* ----- Convert a web lead to Sheets row payload ----- */
  webToSheets(lead) {
    return {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.source,
      product: (lead.products || [])[0] || '',
      products: (lead.products || []).join('; '),
      stage: WEB_TO_SHEETS_STATUS[lead.status] || 'New Lead',
      priority: WEB_TO_SHEETS_PRIORITY[lead.priority] || 'Medium',
      nextFollowUp: lead.nextFollowUp || '',
      lastContact: lead.lastContact || '',
      language: lead.language || '',
      fyc: lead.fyc || lead.premium || '',
      notes: lead.notes || '',
      lifeStage: lead.lifeStage || '',
      policyNo: lead.policyNo || '',
      planName: lead.planName || '',
      policyStart: lead.policyStart || '',
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  },

  /* ----- Convert a Sheets row to web lead ----- */
  sheetsToWeb(row) {
    const status = SHEETS_TO_WEB_STATUS[row.stage] || 'new';
    const priority = SHEETS_TO_WEB_PRIORITY[row.priority] || 'warm';
    // products: prefer explicit products list, else parse the single Product Interest field
    let products = [];
    if (row.products) {
      products = String(row.products).split(/[;,]/).map(s => s.trim()).filter(Boolean);
    } else if (row.product) {
      products = [row.product];
    }
    return {
      id: row.id || uid(),
      name: row.name || '',
      phone: row.phone || '',
      email: row.email || '',
      status, priority, products,
      source: row.source || '',
      nextFollowUp: row.nextFollowUp || '',
      lastContact: row.lastContact || '',
      language: row.language || '',
      fyc: row.fyc || '',
      lifeStage: row.lifeStage || '',
      notes: row.notes || '',
      policyNo: row.policyNo || '',
      planName: row.planName || '',
      premium: row.fyc || '',
      policyStart: row.policyStart || '',
      createdAt: row.createdAt || nowISO(),
      updatedAt: row.updatedAt || nowISO(),
    };
  },

  /* ----- HTTP request to Apps Script (no-cors compatible) ----- */
  async _request(payload) {
    const cfg = this.getConfig();
    if (!cfg.url) throw new Error('Sync URL not configured. Open Sync Settings.');
    const res = await fetch(cfg.url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Sync server error ' + res.status);
    return await res.json();
  },

  /* ----- Pull all leads from Sheets ----- */
  async pull() {
    const result = await this._request({ action: 'getAll' });
    if (!result || !Array.isArray(result.leads)) {
      throw new Error('Invalid response from Apps Script');
    }
    return result.leads.map(r => this.sheetsToWeb(r));
  },

  /* ----- Push local leads to Sheets (bulk) ----- */
  async push(leads) {
    const payload = {
      action: 'pushBulk',
      leads: leads.map(l => this.webToSheets(l)),
    };
    return await this._request(payload);
  },

  /* ----- Bidirectional merge (by id, with updatedAt timestamp tiebreaker) ----- */
  async syncNow() {
    const localLeads = await Store.getAll();
    const remoteLeads = await this.pull();

    // Build map by id
    const merged = {};
    localLeads.forEach(l => { merged[l.id] = l; });

    remoteLeads.forEach(r => {
      const local = merged[r.id];
      if (!local) {
        merged[r.id] = r; // remote-only — add it
      } else {
        // both exist — newer updatedAt wins
        const lt = new Date(local.updatedAt || 0).getTime();
        const rt = new Date(r.updatedAt || 0).getTime();
        merged[r.id] = (rt > lt) ? r : local;
      }
    });

    const finalLeads = Object.values(merged);
    await Store.replaceAll(finalLeads);
    await this.push(finalLeads); // push merged result back to Sheets so both sides match
    this.setConfig({ lastSync: nowISO() });
    return { localCount: localLeads.length, remoteCount: remoteLeads.length, mergedCount: finalLeads.length };
  },
};

/* ============================================================
   AutoSync — keeps web CRM continuously in step with Sheets
   without you ever clicking a button.

   Fires sync on:
     - app load (pulls latest)
     - every add/update/delete (debounced 1s)
     - tab becomes visible (you came back to the CRM)
     - browser comes back online
     - periodic background refresh while tab is active (every 3 min)

   Cross-tab safety: localStorage lock prevents two open tabs from
   syncing at the same time (which could cause races).
   ============================================================ */

const AutoSync = {
  _started: false,
  _pushTimer: null,
  _periodicTimer: null,
  _onChangeCallbacks: [], // app.js can register a callback that fires after a successful sync

  /* ----- Lock (localStorage) ----- */
  LOCK_KEY: 'yh.crm.sync.lock',
  LOCK_TTL: 10000, // 10 seconds

  _acquireLock() {
    const now = Date.now();
    const raw = localStorage.getItem(this.LOCK_KEY);
    if (raw) {
      const lock = parseInt(raw, 10);
      if (!isNaN(lock) && now - lock < this.LOCK_TTL) return false; // someone else has it
    }
    localStorage.setItem(this.LOCK_KEY, String(now));
    return true;
  },
  _releaseLock() {
    localStorage.removeItem(this.LOCK_KEY);
  },

  /* ----- Public API ----- */
  isEnabled() {
    return Sync.getConfig().autoSync === true;
  },
  setEnabled(on) {
    Sync.setConfig({ autoSync: !!on });
    if (on && Sync.isConfigured()) this.start();
  },
  onAfterSync(fn) {
    this._onChangeCallbacks.push(fn);
  },
  _fireAfterSync(result) {
    this._onChangeCallbacks.forEach(fn => {
      try { fn(result); } catch (e) { console.warn('AutoSync callback failed', e); }
    });
  },

  /* ----- Start (called from app.js init) ----- */
  start() {
    if (this._started) return;
    if (!Sync.isConfigured() || !this.isEnabled()) return;
    this._started = true;

    // 1. Sync on app load (pulls latest changes from other devices)
    this._doSync('initial');

    // 2. Sync when tab becomes visible (you came back to the CRM)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this._doSync('visibility');
    });

    // 3. Sync when browser comes back online
    window.addEventListener('online', () => this._doSync('online'));

    // 4. Periodic full sync every 3 minutes while tab is active
    this._periodicTimer = setInterval(() => {
      if (!document.hidden && navigator.onLine) this._doSync('periodic');
    }, 180000);
  },

  /* ----- Triggered after every local change ----- */
  pushChange() {
    if (!this._started || !navigator.onLine) return;
    // Debounce: wait 1s after the last change, then push.
    // This batches rapid edits (e.g. drag-drop a card, then status change) into one network call.
    if (this._pushTimer) clearTimeout(this._pushTimer);
    this._pushTimer = setTimeout(() => this._doSync('change'), 1000);
  },

  /* ----- Internal sync runner ----- */
  async _doSync(reason) {
    if (!navigator.onLine) return;
    if (!this._acquireLock()) return; // another tab is syncing
    try {
      const result = await Sync.syncNow();
      this._fireAfterSync({ ok: true, reason, ...result });
    } catch (e) {
      console.warn('AutoSync failed (' + reason + '):', e.message || e);
      this._fireAfterSync({ ok: false, reason, error: e.message || String(e) });
    } finally {
      this._releaseLock();
    }
  },

  /* ----- Manual force-sync (still respects lock) ----- */
  async forceNow() {
    return await this._doSync('manual');
  },
};
