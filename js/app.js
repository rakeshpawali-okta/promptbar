  // ── Built-in Templates ────────────────────────────────────────────
  const BUILT_IN_PACK_FILES = [
    'everyday.json',
    'developer.json',
    'product-owner.json',
    'business-analyst.json',
    'sales.json',
    'customer-success.json',
    'technical-account-management.json',
    'engineering-manager.json',
    'hr-people.json',
    'legal.json',
    'marketing.json'
  ];

  let TEMPLATES = [];
  let PERSONAS = ['All'];
  let currentPersona = 'Everyday';
  let searchQuery = '';
  const sectionStates = {}; // group -> true (expanded) | false (collapsed)

  async function loadBuiltInTemplates() {
    const packs = await Promise.all(
      BUILT_IN_PACK_FILES.map(async fileName => {
        const response = await fetch(`./prompts/${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to load ${fileName}`);
        }

        const data = await response.json();
        const prompts = Array.isArray(data) ? data : (data.prompts || []);
        return prompts;
      })
    );

    TEMPLATES = packs.flat();
    PERSONAS = ['All', ...new Set(TEMPLATES.map(t => t.group))];
  }

  // ── Helpers ───────────────────────────────────────────────────────
  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function showToast(msg) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const d = document.createElement('div');
    d.className = 'toast';
    d.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ${escHtml(msg)}`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 3000);
  }

  function togglePromptPreview(el) {
    const preview = el.nextElementSibling;
    const chevron = el.querySelector('.chevron');
    const hint    = el.querySelector('.expand-hint span');
    const isOpen  = preview.classList.toggle('open');
    chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
    hint.textContent = isOpen ? 'Hide prompt' : 'Preview prompt';
  }

  // ── Bookmarklet ───────────────────────────────────────────────────
  function makeBookmarkletHref(promptText) {
    const cleaned = promptText.replace(/^\[[A-Z]+\]\s*/gm, '').trim() + '\n';
    const escaped = cleaned
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r?\n/g, '\\n');

    const js =
      `(function(){` +
        `var el=document.querySelector('.ql-editor')||` +
        `document.querySelector('[contenteditable]')||` +
        `document.querySelector('textarea');` +
        `if(el){` +
          `el.focus();` +
          `var t='${escaped}';` +
          `var sel=window.getSelection();` +
          `var range=document.createRange();` +
          `range.selectNodeContents(el);` +
          `range.collapse(false);` +
          `sel.removeAllRanges();` +
          `sel.addRange(range);` +
          `document.execCommand('insertText',false,t);` +
        `}` +
      `})();`;

    return 'javascript:' + js;
  }

  // ── Copy helpers ──────────────────────────────────────────────────
  function flashCopied(btn) {
    const original = btn.innerHTML;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><polyline points="20 6 9 17 4 12"/></svg> Copied`;
    btn.style.color = '#16a34a'; btn.style.borderColor = '#86efac';
    setTimeout(() => { btn.innerHTML = original; btn.style.color = ''; btn.style.borderColor = ''; }, 2000);
  }

  function copyPromptText(idx) {
    const btn = document.querySelector(`[data-copy-idx="${idx}"]`);
    navigator.clipboard.writeText(TEMPLATES[idx].prompt).then(() => { if (btn) flashCopied(btn); });
  }

  function copyCustomPromptText(idx) {
    const btn = document.querySelector(`[data-custom-copy-idx="${idx}"]`);
    const prompts = loadCustomPrompts();
    navigator.clipboard.writeText(prompts[idx].prompt).then(() => { if (btn) flashCopied(btn); });
  }

  // ── Card HTML ─────────────────────────────────────────────────────
  const BOOKMARK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
  const COPY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  const EDIT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
  const DELETE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
  const CHEVRON = `<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

  function builtInCardHTML(t, i) {
    return `
      <div class="template-card">
        <div class="card-clickable" onclick="togglePromptPreview(this)">
          <div class="card-top">
            <span class="card-title">${t.title}</span>
            <span class="card-tag">${t.tag}</span>
          </div>
          <p class="card-desc">${t.desc}</p>
          <div class="expand-hint">${CHEVRON}<span>Preview prompt</span></div>
        </div>
        <pre class="prompt-preview">${escHtml(t.prompt)}</pre>
        <div class="card-footer">
          <a class="bookmark-btn" href="${makeBookmarkletHref(t.prompt)}" title="Drag to bookmarks bar">${BOOKMARK_ICON} ${t.title}</a>
          <button class="copy-btn" data-copy-idx="${i}" onclick="copyPromptText(${i})" title="Copy prompt text">${COPY_ICON} Copy</button>
          <button class="edit-btn" onclick="editBuiltInTemplate(${i})" title="Edit this prompt">${EDIT_ICON} Edit</button>
        </div>
      </div>`;
  }

  function customCardHTML(t, i) {
    return `
      <div class="template-card">
        <div class="card-clickable" onclick="togglePromptPreview(this)">
          <div class="card-top">
            <span class="card-title">${t.title}</span>
            <span class="card-tag card-tag-custom">${t.tag || 'Custom'}</span>
          </div>
          <p class="card-desc">${t.prompt.substring(0, 100).replace(/\n/g,' ')}…</p>
          <div class="expand-hint">${CHEVRON}<span>Preview prompt</span></div>
        </div>
        <pre class="prompt-preview">${escHtml(t.prompt)}</pre>
        <div class="card-footer">
          <a class="bookmark-btn" href="${makeBookmarkletHref(t.prompt)}" title="Drag to bookmarks bar">${BOOKMARK_ICON} ${t.title}</a>
          <button class="copy-btn" data-custom-copy-idx="${i}" onclick="copyCustomPromptText(${i})" title="Copy prompt text">${COPY_ICON} Copy</button>
          <button class="edit-btn" onclick="editCustomPrompt(${i})" title="Edit">${EDIT_ICON} Edit</button>
          <button class="delete-btn" onclick="confirmDelete(this,${i})" title="Delete">${DELETE_ICON}</button>
        </div>
      </div>`;
  }

  // ── Search ────────────────────────────────────────────────────────
  function handleSearch(val) {
    searchQuery = val.trim().toLowerCase();
    document.getElementById('search-clear').style.display = val ? 'flex' : 'none';
    renderTemplates();
    renderCustomPrompts();
  }

  function clearSearch() {
    document.getElementById('search-input').value = '';
    handleSearch('');
    document.getElementById('search-input').focus();
  }

  // ── Render tabs ───────────────────────────────────────────────────
  function renderTabs() {
    const bar = document.getElementById('persona-tabs');
    const counts = {};
    TEMPLATES.forEach(t => { counts[t.group] = (counts[t.group] || 0) + 1; });
    bar.innerHTML = PERSONAS.map(p => {
      const count = p === 'All' ? TEMPLATES.length : (counts[p] || 0);
      return `<button class="tab ${p === currentPersona ? 'active' : ''}" onclick="filterByPersona('${p}')">${p}<span class="tab-count">${count}</span></button>`;
    }).join('');
  }

  function filterByPersona(persona) {
    currentPersona = persona;
    renderTabs();
    renderTemplates();
  }

  // ── Helpers ───────────────────────────────────────────────────────
  function slugify(s) { return s.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''); }

  function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function isCollapsible(isCustom) {
    return currentPersona === 'All' || isCustom;
  }

  function toggleSection(group, isCustom) {
    sectionStates[group] = !sectionStates[group];
    if (isCustom) renderCustomPrompts();
    else renderTemplates();
  }

  function sectionHeader(group, count, isCustom, gi) {
    const collapsible = isCollapsible(isCustom);
    const expanded = sectionStates[group] === true;
    const chevron = collapsible ? `
      <svg class="section-chevron" style="transform:${expanded ? 'rotate(180deg)' : 'rotate(0deg)'}"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>` : '';

    return `
      <div class="section-header ${collapsible ? 'section-collapsible' : ''}"
           style="${gi > 0 ? 'margin-top:36px;' : ''}"
           ${collapsible ? `onclick="toggleSection('${group}',${isCustom})"` : ''}>
        <div style="display:flex;align-items:center;gap:8px;">
          ${chevron}
          <h2 class="section-title">${group}</h2>
          <span class="section-count">${count} templates</span>
        </div>
      </div>`;
  }

  // ── Render built-in templates ─────────────────────────────────────
  function renderTemplates() {
    const container = document.getElementById('templates-container');

    let filtered = TEMPLATES.map((t, i) => ({ t, i }));

    if (currentPersona !== 'All')
      filtered = filtered.filter(({ t }) => t.group === currentPersona);

    if (searchQuery)
      filtered = filtered.filter(({ t }) =>
        `${t.title} ${t.desc} ${t.tag} ${t.group} ${t.prompt}`.toLowerCase().includes(searchQuery));

    if (!filtered.length) {
      container.innerHTML = `<div class="empty-state">${searchQuery ? `No prompts matching "<strong>${escHtml(searchQuery)}</strong>"` : 'No templates for this persona yet.'}</div>`;
      return;
    }

    // When searching, show flat list with result count
    if (searchQuery) {
      container.innerHTML = `
        <p class="search-results-label">${filtered.length} result${filtered.length > 1 ? 's' : ''} for "<strong>${escHtml(searchQuery)}</strong>"</p>
        <div class="templates-grid">${filtered.map(({ t, i }) => builtInCardHTML(t, i)).join('')}</div>`;
      return;
    }

    const groups = {};
    filtered.forEach(({ t, i }) => {
      if (!groups[t.group]) groups[t.group] = [];
      groups[t.group].push({ t, i });
    });

    container.innerHTML = Object.entries(groups).map(([g, items], gi) => {
      const collapsible = isCollapsible(false);
      const expanded = !collapsible || sectionStates[g] === true;
      return `
        ${sectionHeader(g, items.length, false, gi)}
        ${expanded ? `<div class="templates-grid">${items.map(({ t, i }) => builtInCardHTML(t, i)).join('')}</div>` : ''}
      `;
    }).join('');
  }

  // ── localStorage ──────────────────────────────────────────────────
  function loadCustomPrompts() {
    try { return JSON.parse(localStorage.getItem('promptbar_prompts') || '[]'); }
    catch { return []; }
  }

  function saveCustomPrompt(entry) {
    const prompts = loadCustomPrompts();
    prompts.push(entry);
    localStorage.setItem('promptbar_prompts', JSON.stringify(prompts));
  }

  function deleteCustomPrompt(idx) {
    const prompts = loadCustomPrompts();
    prompts.splice(idx, 1);
    localStorage.setItem('promptbar_prompts', JSON.stringify(prompts));
    renderCustomPrompts();
    showToast('Prompt deleted');
  }

  function confirmDelete(btn, idx) {
    if (btn.dataset.confirming === 'true') {
      deleteCustomPrompt(idx);
      return;
    }
    btn.dataset.confirming = 'true';
    btn.style.borderColor = '#ef4444';
    btn.style.color = '#ef4444';
    btn.innerHTML = '<span style="font-size:11px;font-weight:600;padding:0 2px;">Sure?</span>';
    setTimeout(() => {
      if (btn.dataset.confirming === 'true') {
        btn.dataset.confirming = 'false';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.innerHTML = `${DELETE_ICON}`;
      }
    }, 3000);
  }

  function renderCustomPrompts() {
    const allPrompts = loadCustomPrompts();
    const grid = document.getElementById('my-templates-grid');
    const count = document.getElementById('my-template-count');
    count.textContent = `${allPrompts.length} saved`;

    if (!allPrompts.length) {
      grid.innerHTML = `<div class="empty-state">No saved prompts yet. Add your own below or import a category.</div>`;
      return;
    }

    // Apply search filter — preserve original index for edit/delete
    let items = allPrompts.map((t, i) => ({ t, i }));

    if (searchQuery) {
      items = items.filter(({ t }) =>
        `${t.title} ${t.desc} ${t.tag} ${t.group} ${t.prompt}`.toLowerCase().includes(searchQuery));

      if (!items.length) {
        grid.innerHTML = `<div class="empty-state">No saved prompts matching "<strong>${escHtml(searchQuery)}</strong>"</div>`;
        return;
      }

      grid.innerHTML = `
        <p class="search-results-label">${items.length} saved result${items.length > 1 ? 's' : ''} for "<strong>${escHtml(searchQuery)}</strong>"</p>
        <div class="templates-grid">${items.map(({ t, i }) => customCardHTML(t, i)).join('')}</div>`;
      return;
    }

    // Group by persona
    const groups = {};
    items.forEach(({ t, i }) => {
      const g = t.group || 'Custom';
      if (!groups[g]) groups[g] = [];
      groups[g].push({ t, i });
    });

    grid.innerHTML = Object.entries(groups).map(([g, groupItems], gi) => {
      const expanded = sectionStates[g] === true;
      return `
        ${sectionHeader(g, groupItems.length, true, gi)}
        ${expanded ? `<div class="templates-grid">${groupItems.map(({ t, i }) => customCardHTML(t, i)).join('')}</div>` : ''}
      `;
    }).join('');
  }

  // ── Import / Export ───────────────────────────────────────────────
  function readJSON(input, onData) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        onData(data);
      } catch { showToast('Invalid JSON file'); }
    };
    reader.readAsText(file);
    input.value = '';
  }

  function mergeIntoStorage(incoming) {
    const existing = loadCustomPrompts();
    localStorage.setItem('promptbar_prompts', JSON.stringify([...existing, ...incoming]));
    renderCustomPrompts();
  }

  // Import a new category (respects group from file, creates new section)
  function importNewCategory(input) {
    readJSON(input, data => {
      const incoming = Array.isArray(data) ? data : (data.prompts || []);
      if (!incoming.length) { showToast('No prompts found in file'); return; }
      mergeIntoStorage(incoming);
      const groups = [...new Set(incoming.map(p => p.group).filter(Boolean))];
      showToast(`Imported ${incoming.length} prompt${incoming.length > 1 ? 's' : ''}${groups.length ? ' → ' + groups.join(', ') : ''}`);
    });
  }

  // Export all custom prompts
  function exportAllCustom() {
    const prompts = loadCustomPrompts();
    if (!prompts.length) { showToast('No saved prompts to export'); return; }
    downloadJSON({ version: '1.0', tool: 'PromptBar', prompts }, 'promptbar-all.json');
    showToast(`Exported ${prompts.length} prompt${prompts.length > 1 ? 's' : ''}`);
  }

  // ── Edit state ────────────────────────────────────────────────────
  let editingCustomIndex = null;

  function setFormMode(isEditing) {
    document.getElementById('save-btn-label').textContent = isEditing ? 'Update Prompt' : 'Save Prompt';
    document.getElementById('cancel-edit-btn').style.display = isEditing ? 'inline-flex' : 'none';
    document.getElementById('form-hint').textContent = isEditing
      ? 'Editing existing prompt — click Update to save'
      : 'Saved prompts appear in My Templates above';
  }

  function editBuiltInTemplate(i) {
    const t = TEMPLATES[i];
    document.getElementById('prompt-name').value = t.title;
    document.getElementById('prompt-tag').value = t.tag;
    document.getElementById('prompt-persona').value = t.group;
    document.getElementById('prompt-text').value = t.prompt;
    editingCustomIndex = null;
    setFormMode(false);
    document.querySelector('.add-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('prompt-name').focus();
  }

  function editCustomPrompt(i) {
    const t = loadCustomPrompts()[i];
    document.getElementById('prompt-name').value = t.title;
    document.getElementById('prompt-tag').value = t.tag || '';
    document.getElementById('prompt-persona').value = t.group || 'General';
    document.getElementById('prompt-text').value = t.prompt;
    editingCustomIndex = i;
    setFormMode(true);
    document.querySelector('.add-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('prompt-name').focus();
  }

  function cancelEdit() {
    editingCustomIndex = null;
    setFormMode(false);
    ['prompt-name','prompt-tag','prompt-text'].forEach(id => document.getElementById(id).value = '');
  }

  // ── Guided builder ────────────────────────────────────────────────
  function builderValue(id) {
    return document.getElementById(id).value.trim();
  }

  function defaultPromptName(task) {
    if (!task) return 'New Prompt';
    return task
      .replace(/^(write|create|generate|draft|summarise|summarize|turn|reply to)\s+/i, '')
      .replace(/\.$/, '')
      .split(' ')
      .slice(0, 5)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function buildGuidedPromptText() {
    const role = builderValue('builder-role') || 'You are a helpful professional.';
    const task = builderValue('builder-task') || 'Complete the task described below.';
    const style = builderValue('builder-style') || 'Clear, direct, and practical.';
    const format = builderValue('builder-format') || 'Return only the final output, no commentary.';
    const input = builderValue('builder-input') || 'Paste the content or context here.';

    return `[ROLE]    ${role}\n[TASK]    ${task}\n[STYLE]   ${style}\n[FORMAT]  ${format}\n[INPUT]   ${input}`;
  }

  function updateBuilderPreview() {
    const preview = document.getElementById('guided-builder-preview');
    if (!preview) return;
    preview.textContent = buildGuidedPromptText();
  }

  function loadBuilderExample() {
    document.getElementById('builder-name').value = 'Post-Incident Customer Summary';
    document.getElementById('builder-tag').value = 'Support';
    document.getElementById('builder-persona').value = 'Technical Account Management';
    document.getElementById('builder-role').value = 'You are a Technical Account Manager.';
    document.getElementById('builder-task').value = 'Write a post-incident email to the customer based on the outage details below.';
    document.getElementById('builder-style').value = 'Transparent, accountable, and reassuring. No defensive language.';
    document.getElementById('builder-format').value = 'Return only the email. Structure: What Happened, Customer Impact, What We Fixed, Next Steps.';
    document.getElementById('builder-input').value = 'Paste the incident timeline, root cause notes, and customer context here.';
    updateBuilderPreview();
  }

  function clearBuilder() {
    ['builder-name', 'builder-tag', 'builder-role', 'builder-task', 'builder-style', 'builder-format', 'builder-input'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('builder-persona').value = 'Everyday';
    updateBuilderPreview();
  }

  function buildGuidedPrompt() {
    const task = builderValue('builder-task');
    const role = builderValue('builder-role');

    if (!role) {
      document.getElementById('builder-role').focus();
      return;
    }

    if (!task) {
      document.getElementById('builder-task').focus();
      return;
    }

    const name = builderValue('builder-name') || defaultPromptName(task);
    const tag = builderValue('builder-tag') || 'Custom';
    const persona = document.getElementById('builder-persona').value;
    const promptText = buildGuidedPromptText();

    document.getElementById('prompt-name').value = name;
    document.getElementById('prompt-tag').value = tag;
    document.getElementById('prompt-persona').value = persona;
    document.getElementById('prompt-text').value = promptText;

    showToast('Draft added to the save form');
    document.getElementById('prompt-name').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ── Save / update prompt ──────────────────────────────────────────
  function savePrompt() {
    const name    = document.getElementById('prompt-name').value.trim();
    const tag     = document.getElementById('prompt-tag').value.trim();
    const persona = document.getElementById('prompt-persona').value;
    const text    = document.getElementById('prompt-text').value.trim();

    if (!name) { document.getElementById('prompt-name').focus(); return; }
    if (!text) { document.getElementById('prompt-text').focus(); return; }

    const entry = { title: name, tag: tag || 'Custom', group: persona, prompt: text };

    if (editingCustomIndex !== null) {
      const prompts = loadCustomPrompts();
      prompts[editingCustomIndex] = entry;
      localStorage.setItem('promptbar_prompts', JSON.stringify(prompts));
      editingCustomIndex = null;
      showToast('Prompt updated');
    } else {
      saveCustomPrompt(entry);
      showToast('Prompt saved');
    }

    setFormMode(false);
    renderCustomPrompts();
    document.getElementById('my-templates-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    ['prompt-name','prompt-tag','prompt-text'].forEach(id => document.getElementById(id).value = '');
  }

  // ── Shareable Pack URL ──────────────────────────────────────────────
  function encodePackToURL(prompts, packName) {
    const data = { name: packName, prompts };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    return `${location.origin}${location.pathname}?pack=${encoded}`;
  }

  function decodePackFromURL() {
    try {
      const raw = new URLSearchParams(location.search).get('pack');
      if (!raw) return null;
      return JSON.parse(decodeURIComponent(escape(atob(raw))));
    } catch { return null; }
  }

  let _sharedPackData = null;

  function showSharedPackBanner(data) {
    _sharedPackData = data;
    const count = (data.prompts || []).length;
    const name  = data.name || 'Shared Pack';
    document.getElementById('shared-pack-title').textContent = `${count} prompt${count !== 1 ? 's' : ''} shared with you — ${name}`;
    document.getElementById('shared-pack-sub').textContent   = 'Click Import to add them to My Templates. They stay local in your browser.';
    document.getElementById('shared-pack-banner').style.display = 'flex';
  }

  function importSharedPack() {
    if (!_sharedPackData) return;
    const incoming = _sharedPackData.prompts || [];
    if (!incoming.length) { showToast('No prompts found in this pack'); return; }
    mergeIntoStorage(incoming);
    showToast(`Imported ${incoming.length} prompt${incoming.length > 1 ? 's' : ''}`);
    dismissSharedBanner();
  }

  function dismissSharedBanner() {
    document.getElementById('shared-pack-banner').style.display = 'none';
    _sharedPackData = null;
    history.replaceState(null, '', location.pathname);
  }

  function shareCustomPack() {
    const prompts = loadCustomPrompts();
    if (!prompts.length) { showToast('No saved prompts to share'); return; }
    const url = encodePackToURL(prompts, 'My Templates');
    navigator.clipboard.writeText(url).then(() => showToast(`Share link copied — ${prompts.length} prompts`));
  }

  // ── Init ──────────────────────────────────────────────────────────
  function dismissSetup() {
    document.getElementById('setup-banner').style.display = 'none';
    localStorage.setItem('promptbar_setup_dismissed', '1');
  }

  async function init() {
    renderCustomPrompts();

    const _sharedPack = decodePackFromURL();
    if (_sharedPack && (_sharedPack.prompts || []).length) {
      showSharedPackBanner(_sharedPack);
    }

    if (localStorage.getItem('promptbar_setup_dismissed')) {
      document.getElementById('setup-banner').style.display = 'none';
    }

    updateBuilderPreview();

    const container = document.getElementById('templates-container');
    container.innerHTML = '<div class="empty-state">Loading built-in prompts…</div>';

    try {
      await loadBuiltInTemplates();
      renderTabs();
      renderTemplates();
    } catch (error) {
      document.getElementById('persona-tabs').innerHTML = '';
      container.innerHTML = '<div class="empty-state">Could not load built-in prompts. Refresh the page and try again.</div>';
      console.error(error);
      showToast('Could not load built-in prompts');
    }
  }

  init();

  // ── Demo animation controller ─────────────────────────────────────
  (function () {
    const screens  = [0,1,2,3].map(i => document.getElementById('ds-' + i));
    const dots     = [0,1,2,3].map(i => document.getElementById('dd-' + i));
    const lbl      = document.getElementById('demo-step-lbl');
    const urlBar   = document.getElementById('demo-url-bar');
    const bmBar    = document.getElementById('demo-bm-bookmark');
    const bmItem   = document.getElementById('demo-bm-bookmark');
    const typed    = document.getElementById('ds3-typed');

    const labels   = ['Browse templates', 'Drag to bookmarks bar', 'Open Gemini — click the bookmark', 'Prompt injected instantly'];
    const urls     = ['promptbar.app', 'promptbar.app', 'gemini.google.com', 'gemini.google.com'];
    const durations = [2800, 2200, 2200, 3800];

    let step = 0;

    function goTo(next) {
      // Outgoing
      screens[step].classList.remove('active');
      dots[step].classList.remove('active');
      step = next % 4;
      // Incoming
      screens[step].classList.add('active');
      dots[step].classList.add('active');
      lbl.textContent = labels[step];
      urlBar.textContent = urls[step];

      // Show bookmark in bar from step 1 onward
      bmItem.style.opacity = step >= 1 ? '1' : '0';

      // Highlight bookmark on step 2
      if (step === 2) {
        setTimeout(() => bmItem.classList.add('highlight'), 800);
        setTimeout(() => bmItem.classList.remove('highlight'), 1400);
      }

      // Re-trigger typing animation on step 3
      if (step === 3) {
        typed.style.animation = 'none';
        typed.offsetHeight; // reflow
        typed.style.animation = '';
      }

      setTimeout(() => goTo(step + 1), durations[step]);
    }

    setTimeout(() => goTo(1), durations[0]);
  })();

  // Cmd+K / Ctrl+K focuses search
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.getElementById('search-input');
      input.focus(); input.select();
    }
    if (e.key === 'Escape' && document.activeElement.id === 'search-input') {
      clearSearch();
    }
  });