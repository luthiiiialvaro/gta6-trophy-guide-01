// Leonida Trophy Atlas — checklist, tracker, roadmap and cited guides.
// All data lives in data/trophies.json; progress lives in localStorage.
import { ROADMAP, KIND_LABELS, GRADE_LABELS } from './roadmap.js';

const STORE_KEY = 'leonida-trophy-atlas-v1';
const $ = (id) => document.getElementById(id);

const params = new URLSearchParams(location.search);
const shot = params.get('shot');

// Demo progress for the deterministic screenshot scenes (?shot=…).
// In-memory only: never written to localStorage.
const DEMO_EARNED = [2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 30, 35];

const state = {
  trophies: [],
  earned: new Set(),
  kind: 'all',
  grade: 'all',
  status: 'all',
  search: '',
  spoiler: true,
  missableOnly: false,
  selectedId: null,
  view: 'checklist',
  demo: shot !== null,
};

function loadStored() {
  if (state.demo) return new Set(DEMO_EARNED);
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) ?? 'null');
    const ids = Array.isArray(raw) ? raw : raw?.earned;
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
  } catch {
    return new Set();
  }
}

function save() {
  if (state.demo) return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ app: 'leonida-trophy-atlas', version: 1, earned: [...state.earned] }));
  } catch { /* storage unavailable: progress lives for the session only */ }
}

function trophyById(id) {
  return state.trophies.find((t) => t.id === id);
}

function isMasked(t) {
  return state.spoiler && t.kind === 'story' && !state.earned.has(t.id);
}

function visibleTrophies() {
  const q = state.search.trim().toLowerCase();
  return state.trophies.filter((t) => {
    if (state.kind === 'missable') {
      if (!t.missable) return false;
    } else if (state.kind !== 'all' && t.kind !== state.kind) {
      return false;
    }
    if (state.missableOnly && !t.missable) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.status === 'earned' && !state.earned.has(t.id)) return false;
    if (state.status === 'unearned' && state.earned.has(t.id)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function gradePill(t) {
  return `<span class="grade-pill grade-${t.grade}">${t.grade}</span>`;
}

function renderProgress() {
  const total = state.trophies.length;
  const n = state.earned.size;
  $('progressText').textContent = `${n} of ${total} earned`;
  $('progressPct').textContent = total ? `${Math.round((n / total) * 100)}%` : '0%';
  $('progressFill').style.width = total ? `${(n / total) * 100}%` : '0%';
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const all = state.trophies.filter((t) => t.grade === g).length;
    const got = state.trophies.filter((t) => t.grade === g && state.earned.has(t.id)).length;
    return `<span><b>${got}/${all}</b> ${GRADE_LABELS[g]}</span>`;
  });
  $('byGrade').innerHTML = parts.join('');
}

function renderKindChips() {
  const kinds = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];
  $('kindChips').replaceChildren(...kinds.map((k) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `chip${state.kind === k ? ' active' : ''}`;
    b.textContent = KIND_LABELS[k];
    b.setAttribute('aria-pressed', String(state.kind === k));
    b.addEventListener('click', () => {
      state.kind = k;
      renderKindChips();
      renderList();
    });
    return b;
  }));
}

function renderList() {
  const rows = $('rows');
  const list = visibleTrophies();
  rows.replaceChildren();
  for (const t of list) {
    const earned = state.earned.has(t.id);
    const masked = isMasked(t);
    const tr = document.createElement('tr');
    if (earned) tr.classList.add('earned');
    if (state.selectedId === t.id) tr.classList.add('selected');

    const tdEarn = document.createElement('td');
    tdEarn.className = 'c-earn';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'earn-box';
    box.checked = earned;
    box.setAttribute('aria-label', `Mark ${masked ? 'hidden trophy' : t.name} earned`);
    box.addEventListener('change', () => {
      if (box.checked) state.earned.add(t.id);
      else state.earned.delete(t.id);
      save();
      renderProgress();
      renderList();
      renderRoadmap();
      if (state.selectedId === t.id) renderDetail();
    });
    tdEarn.append(box);

    const tdMain = document.createElement('td');
    const name = document.createElement('div');
    name.className = 't-name';
    name.textContent = masked ? 'Hidden trophy' : t.name;
    const desc = document.createElement('div');
    desc.className = 't-desc';
    desc.textContent = masked ? 'Earn this trophy to reveal its name and description.' : t.description;
    const badges = document.createElement('div');
    badges.className = 't-badges';
    const kindBadge = document.createElement('span');
    kindBadge.className = `badge kind-${t.kind}`;
    kindBadge.textContent = t.kind;
    badges.append(kindBadge);
    if (t.missable) {
      const b = document.createElement('span');
      b.className = 'badge missable';
      b.textContent = '⚠ Missable';
      badges.append(b);
    }
    if (t.hidden) {
      const b = document.createElement('span');
      b.className = 'badge hidden-flag';
      b.textContent = 'Hidden';
      badges.append(b);
    }
    if (t.count) {
      const b = document.createElement('span');
      b.className = 'badge count';
      b.textContent = `× ${t.count.toLocaleString('en-US')}`;
      badges.append(b);
    }
    tdMain.append(name, desc, badges);

    const tdGrade = document.createElement('td');
    tdGrade.className = 'c-grade';
    tdGrade.innerHTML = gradePill(t);

    const tdGuide = document.createElement('td');
    tdGuide.className = 'c-guide';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-btn';
    btn.textContent = 'Guide →';
    btn.addEventListener('click', () => openDetail(t.id));
    tdGuide.append(btn);

    tr.append(tdEarn, tdMain, tdGrade, tdGuide);
    rows.append(tr);
  }
  $('emptyMsg').hidden = list.length > 0;
  $('filterCount').textContent = `Showing ${list.length} of ${state.trophies.length} trophies.`;
}

function renderDetail() {
  const t = trophyById(state.selectedId);
  const pane = $('detail');
  if (!t) {
    pane.hidden = true;
    document.querySelector('.layout').classList.remove('with-detail');
    return;
  }
  const earned = state.earned.has(t.id);
  const body = $('detailBody');
  body.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = t.name;
  const desc = document.createElement('p');
  desc.className = 't-desc';
  desc.textContent = t.description;
  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.innerHTML = '';
  const gradeLine = document.createElement('p');
  gradeLine.className = 'meta';
  gradeLine.append(document.createTextNode('Grade: '), (() => { const s = document.createElement('b'); s.textContent = GRADE_LABELS[t.grade]; return s; })());
  const kindLine = document.createElement('p');
  kindLine.className = 'meta';
  kindLine.append(document.createTextNode('Kind: '), (() => { const s = document.createElement('b'); s.textContent = t.kind; return s; })());
  if (t.missable) {
    const warn = document.createElement('p');
    warn.className = 'meta';
    warn.innerHTML = '<b>⚠ Missable</b> — do this before it can pass you by. See the guide.';
    body.append(warn);
  }
  const stage = ROADMAP.find((s) => s.stage === t.stage);
  const stageLine = document.createElement('p');
  stageLine.className = 'meta';
  stageLine.append(document.createTextNode('Roadmap: '), (() => { const s = document.createElement('b'); s.textContent = stage ? `Stage ${stage.stage} — ${stage.title}` : '—'; return s; })());
  const guideHead = document.createElement('h3');
  guideHead.textContent = 'How to earn it';
  const guideText = document.createElement('div');
  guideText.className = 'guide-text';
  const gp = document.createElement('p');
  gp.textContent = t.guide;
  guideText.append(gp);
  const srcHead = document.createElement('h3');
  srcHead.textContent = 'Sources';
  const srcList = document.createElement('ul');
  srcList.className = 'src-list';
  for (const s of t.sources) {
    const li = document.createElement('li');
    if (s.url) {
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      a.target = '_blank';
      a.rel = 'noopener';
      li.append(a);
    } else {
      li.textContent = s.name;
    }
    srcList.append(li);
  }
  const earnRow = document.createElement('div');
  earnRow.className = 'earn-row';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'earn-box';
  box.checked = earned;
  box.id = 'detailEarn';
  box.addEventListener('change', () => {
    if (box.checked) state.earned.add(t.id);
    else state.earned.delete(t.id);
    save();
    renderProgress();
    renderList();
    renderRoadmap();
    renderDetail();
  });
  const lab = document.createElement('label');
  lab.htmlFor = 'detailEarn';
  lab.textContent = earned ? 'Earned ✓' : 'Mark as earned';
  earnRow.append(box, lab);

  const nav = document.createElement('div');
  nav.className = 'nav-row';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.textContent = '← Previous trophy';
  prev.addEventListener('click', () => openDetail(t.id > 1 ? t.id - 1 : 55));
  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = 'Next trophy →';
  next.addEventListener('click', () => openDetail(t.id < 55 ? t.id + 1 : 1));
  nav.append(prev, next);

  body.append(h, desc, gradeLine, kindLine, stageLine, guideHead, guideText, srcHead, srcList, earnRow, nav);
  pane.hidden = false;
  document.querySelector('.layout').classList.add('with-detail');
}

function openDetail(id) {
  state.selectedId = id;
  renderList();
  renderDetail();
  $('detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderRoadmap() {
  const wrap = $('roadmapStages');
  wrap.replaceChildren();
  for (const s of ROADMAP) {
    const card = document.createElement('article');
    card.className = 'stage';
    const head = document.createElement('div');
    head.className = 'stage-head';
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = String(s.stage);
    const title = document.createElement('h3');
    title.textContent = s.title;
    const count = document.createElement('span');
    count.className = 'stage-count';
    const stageTrophies = state.trophies.filter((t) => t.stage === s.stage);
    const done = stageTrophies.filter((t) => state.earned.has(t.id)).length;
    count.textContent = `${done}/${stageTrophies.length} earned`;
    head.append(num, title, count);
    const note = document.createElement('p');
    note.className = 'stage-note';
    note.textContent = s.note;
    const chips = document.createElement('div');
    chips.className = 'stage-trophies';
    for (const t of stageTrophies) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `stage-chip${state.earned.has(t.id) ? ' earned' : ''}`;
      chip.textContent = t.name;
      const g = document.createElement('span');
      g.className = 'mini-grade';
      g.textContent = ` · ${t.grade}`;
      chip.append(g);
      if (t.missable) chip.title = 'Missable — do it before it can pass you by';
      chip.addEventListener('click', () => {
        switchView('checklist');
        openDetail(t.id);
      });
      chips.append(chip);
    }
    card.append(head, note, chips);
    if (s.warn) {
      const w = document.createElement('p');
      w.className = 'warn-line';
      w.textContent = `⚠ ${s.warn}`;
      card.append(w);
    }
    wrap.append(card);
  }
}

function renderSources() {
  const seen = new Map();
  for (const t of state.trophies) {
    for (const s of t.sources) {
      if (!seen.has(s.name)) seen.set(s.name, s.url ?? null);
    }
  }
  const ul = $('sourceList');
  ul.replaceChildren();
  for (const [name, url] of [...seen.entries()].sort()) {
    const li = document.createElement('li');
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.textContent = name;
      a.target = '_blank';
      a.rel = 'noopener';
      li.append(a);
    } else {
      li.textContent = name;
    }
    ul.append(li);
  }
}

function switchView(view) {
  state.view = view;
  for (const v of ['checklist', 'roadmap', 'sources']) {
    $(`view-${v}`).hidden = v !== view;
    $(`tab-${v}`).classList.toggle('active', v === view);
  }
}

function exportProgress() {
  const data = { app: 'leonida-trophy-atlas', version: 1, exportedAt: new Date().toISOString(), earned: [...state.earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'leonida-trophy-atlas-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function importProgress(file) {
  if (!file) return;
  let data;
  try {
    data = JSON.parse(await file.text());
  } catch {
    alert('That file is not valid JSON.');
    return;
  }
  const ids = Array.isArray(data) ? data : data?.earned;
  if (!Array.isArray(ids)) {
    alert('That file does not hold a trophy list.');
    return;
  }
  const valid = ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55);
  const skipped = ids.length - valid.length;
  state.earned = new Set(valid);
  save();
  renderProgress();
  renderList();
  renderRoadmap();
  renderDetail();
  alert(`Imported ${valid.length} earned trophies${skipped ? ` (${skipped} entries ignored)` : ''}.`);
}

function wireEvents() {
  for (const v of ['checklist', 'roadmap', 'sources']) {
    $(`tab-${v}`).addEventListener('click', () => switchView(v));
  }
  $('search').addEventListener('input', (e) => {
    state.search = e.target.value;
    renderList();
  });
  $('gradeFilter').addEventListener('change', (e) => {
    state.grade = e.target.value;
    renderList();
  });
  $('statusFilter').addEventListener('change', (e) => {
    state.status = e.target.value;
    renderList();
  });
  $('spoilerToggle').addEventListener('change', (e) => {
    state.spoiler = e.target.checked;
    renderList();
  });
  $('missableOnly').addEventListener('change', (e) => {
    state.missableOnly = e.target.checked;
    renderList();
  });
  $('missableJump').addEventListener('click', () => {
    switchView('checklist');
    openDetail(28);
  });
  $('detailClose').addEventListener('click', () => {
    state.selectedId = null;
    renderList();
    renderDetail();
  });
  $('exportBtn').addEventListener('click', exportProgress);
  $('importFile').addEventListener('change', (e) => {
    importProgress(e.target.files[0]);
    e.target.value = '';
  });
  $('resetBtn').addEventListener('click', () => {
    if (!confirm('Clear all earned trophies? This cannot be undone.')) return;
    state.earned = new Set();
    save();
    renderProgress();
    renderList();
    renderRoadmap();
    renderDetail();
  });
}

async function init() {
  const doc = await (await fetch('data/trophies.json')).json();
  state.trophies = doc.trophies;
  state.earned = loadStored();
  state.spoiler = $('spoilerToggle').checked;
  wireEvents();
  renderKindChips();
  renderProgress();
  renderList();
  renderRoadmap();
  renderSources();
  applyShotScene();
  window.__shotReady = true;
}

function applyShotScene() {
  if (!shot) return;
  if (shot === 'roadmap') {
    switchView('roadmap');
  } else if (shot === 'guide') {
    state.spoiler = false;
    $('spoilerToggle').checked = false;
    openDetail(28);
    // The detail pane scrolls itself into view on open; for the screenshot
    // scene, bring the page back to the top so the header stays in frame.
    window.scrollTo(0, 0);
  } else if (shot === 'filters') {
    state.kind = 'story';
    state.spoiler = true;
    $('spoilerToggle').checked = true;
    renderKindChips();
    renderList();
  }
  // shot=checklist (or anything else): the plain checklist with demo progress.
}

init();
