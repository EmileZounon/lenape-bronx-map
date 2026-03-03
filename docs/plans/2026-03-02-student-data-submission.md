# Student Data Submission — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow students to annotate existing settlement markers and propose new map locations, stored in Firestore, visible to same class immediately and publicly after teacher approval.

**Architecture:** Static HTML/JS app — no build step. Firebase JS SDK v9 (compat) loaded via CDN. All Firestore logic isolated in a new `submit.js` file. `index.html` calls `submit.js` functions to render student data and open forms.

**Tech Stack:** Firebase Firestore (CDN v9 compat), Google Maps Advanced Markers API, vanilla JS, localStorage for session memory.

---

## Task 1: Create Firebase Project (Manual Setup)

This task requires the developer to do manual steps in the Firebase Console. No code to write.

**Step 1: Create the project**
1. Go to https://console.firebase.google.com
2. Click "Add project" → name it `lenape-bronx-map`
3. Disable Google Analytics (not needed) → Create project

**Step 2: Enable Firestore**
1. In the project sidebar: Build → Firestore Database
2. Click "Create database" → choose "Start in production mode" → select `us-east1` region → Enable

**Step 3: Set Firestore Security Rules**
In Firestore → Rules tab, replace the default rules with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Anyone can read approved items
    match /annotations/{doc} {
      allow read: if true;
      allow create: if request.resource.data.status == 'pending'
                    && request.resource.data.studentName is string
                    && request.resource.data.note is string
                    && request.resource.data.note.size() > 0;
      allow update, delete: if false;
    }

    match /submissions/{doc} {
      allow read: if true;
      allow create: if request.resource.data.status == 'pending'
                    && request.resource.data.studentName is string
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0;
      allow update, delete: if false;
    }
  }
}
```
Click "Publish".

**Step 4: Get the Firebase config**
1. Project Settings (gear icon) → General → Your apps
2. Click "</>" (Web) → Register app as `lenape-bronx-map` (no Firebase Hosting)
3. Copy the `firebaseConfig` object — you'll need it in Task 2

**Step 5: Verify**
- Open Firestore → Data tab. You should see an empty database with no collections yet.

---

## Task 2: Create `submit.js`

**Files:**
- Create: `submit.js`

**Step 1: Create the file**

Create `/Users/emilegiovannie/lenape-bronx-map/submit.js` with this content:

```javascript
// ── Firebase config ───────────────────────────────────────────────────────
// Replace with your actual Firebase project config from Task 1
const FIREBASE_CONFIG = {
  apiKey: "REPLACE_ME",
  authDomain: "lenape-bronx-map.firebaseapp.com",
  projectId: "lenape-bronx-map",
  storageBucket: "lenape-bronx-map.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

// ── Init ──────────────────────────────────────────────────────────────────
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();

// ── Session (localStorage) ───────────────────────────────────────────────
// Remembers student name/class/school so pending items show for same student
function getSession() {
  try {
    return JSON.parse(localStorage.getItem('lenape_session') || 'null');
  } catch { return null; }
}

function setSession(data) {
  localStorage.setItem('lenape_session', JSON.stringify(data));
}

// ── Load approved annotations for a settlement ───────────────────────────
async function loadAnnotations(settlementId) {
  const session = getSession();
  let query = db.collection('annotations')
    .where('settlementId', '==', settlementId);

  const snapshot = await query.get();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(a =>
      a.status === 'approved' ||
      (session && a.className === session.className && a.school === session.school)
    );
}

// ── Submit an annotation ─────────────────────────────────────────────────
async function submitAnnotation({ settlementId, studentName, className, school, note, source }) {
  const data = {
    settlementId,
    studentName: studentName.trim(),
    className: className.trim(),
    school: school.trim(),
    note: note.trim(),
    sources: source.trim() ? [source.trim()] : [],
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  await db.collection('annotations').add(data);
  setSession({ studentName: data.studentName, className: data.className, school: data.school });
}

// ── Load approved submissions (new site proposals) ───────────────────────
async function loadSubmissions() {
  const session = getSession();
  const snapshot = await db.collection('submissions').get();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(s =>
      s.status === 'approved' ||
      (session && s.className === session.className && s.school === session.school)
    );
}

// ── Submit a new site proposal ───────────────────────────────────────────
async function submitSiteProposal({ name, lat, lng, description, source, studentName, className, school }) {
  const data = {
    name: name.trim(),
    lat,
    lng,
    description: description.trim(),
    sources: source.trim() ? [source.trim()] : [],
    studentName: studentName.trim(),
    className: className.trim(),
    school: school.trim(),
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  await db.collection('submissions').add(data);
  setSession({ studentName: data.studentName, className: data.className, school: data.school });
}
```

**Step 2: Replace the config values**
Open `submit.js` and replace the `REPLACE_ME` placeholders with the actual values from your Firebase config (copied in Task 1 Step 4).

**Step 3: Verify in browser console**
After adding the Firebase SDK to `index.html` (Task 3), open the browser console on localhost and run:
```javascript
await db.collection('annotations').get()
// Expected: QuerySnapshot { size: 0, ... }
```

---

## Task 3: Add Firebase SDK to `index.html` and Load Approved Data on Map Init

**Files:**
- Modify: `index.html`

This task has two parts: (A) load the Firebase scripts, and (B) fetch approved submissions and render them as student markers on the map after `initMap()` completes.

**Step 1: Add Firebase SDK scripts**

In `index.html`, find the closing `</body>` tag. Just before it, add these scripts (before the Google Maps script tag):

```html
<!-- Firebase SDK (compat v9) -->
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>
<script src="submit.js"></script>
```

The Google Maps script tag is the last `<script>` — keep it last.

**Step 2: Add CSS for student-submitted markers**

In the `<style>` block, after the `.marker-landmark` styles (around line 87), add:

```css
/* ── Student submission markers ─────────────────────────────────────── */
.marker-student {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1e293b;
  border: 2px dashed #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}
.marker-student:hover {
  transform: scale(1.2);
}
.marker-student--pending {
  border-color: #f59e0b;
  opacity: 0.8;
}
```

**Step 3: Add `studentMarkers` array to module-level references**

Find this line in `index.html` (around line 1463):
```javascript
let map, settlementMarkers = [], infoWindow, layers;
```
Replace with:
```javascript
let map, settlementMarkers = [], studentMarkers = [], infoWindow, layers;
```

**Step 4: Add `renderStudentSubmissions()` function**

After the `closeDetail()` function (around line 1622), add:

```javascript
// Render student-submitted site proposals on the map
async function renderStudentSubmissions() {
  // Clear existing student markers
  studentMarkers.forEach(m => { m.map = null; });
  studentMarkers = [];

  const submissions = await loadSubmissions();
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

  submissions.forEach(sub => {
    const el = document.createElement('div');
    el.className = 'marker-student' + (sub.status === 'pending' ? ' marker-student--pending' : '');
    el.innerHTML = '📍';
    el.setAttribute('aria-label', sub.name + ' — student submission');

    const marker = new AdvancedMarkerElement({
      map,
      position: { lat: sub.lat, lng: sub.lng },
      content: el,
      title: sub.name
    });

    marker.addListener('click', () => showStudentSubmissionDetail(sub));
    studentMarkers.push(marker);
  });
}

// Show detail panel for a student-submitted site
function showStudentSubmissionDetail(sub) {
  const isPending = sub.status === 'pending';
  const html = `
    <h2 class="detail__name">${sub.name}</h2>
    <p class="detail__meaning" style="color:${isPending ? '#f59e0b' : '#10b981'}">
      ${isPending ? '⏳ Pending approval' : '✓ Student submission'}
    </p>
    <div class="detail__section">
      <div class="detail__section-title">Description</div>
      <div class="detail__section-text">${sub.description || 'No description provided.'}</div>
    </div>
    ${sub.sources && sub.sources.length ? `
    <div class="detail__section">
      <div class="detail__section-title">Source</div>
      <div class="detail__section-text">
        <a href="${sub.sources[0]}" target="_blank" rel="noopener" style="color:var(--accent)">${sub.sources[0]}</a>
      </div>
    </div>` : ''}
    <div class="detail__section">
      <div class="detail__section-title">Submitted by</div>
      <div class="detail__section-text">${sub.studentName} — ${sub.className}, ${sub.school}</div>
    </div>
  `;

  if (isMobile()) {
    const mobilePanel = document.getElementById('detail-panel-mobile');
    mobilePanel.querySelector('.detail-content').innerHTML = html;
    mobilePanel.hidden = false;
  } else {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('sidebar--collapsed');
    document.getElementById('sidebar-toggle-icon').innerHTML = '&times;';
    const desktopPanel = document.getElementById('detail-panel-desktop');
    desktopPanel.querySelector('.detail-content').innerHTML = html;
    desktopPanel.hidden = false;
  }
}
```

**Step 5: Call `renderStudentSubmissions()` at the end of `initMap()`**

Find the end of the `initMap()` function. It ends just before the closing `}` of the async function. Add this call before that closing brace:

```javascript
  // Load student submissions from Firestore
  await renderStudentSubmissions();
```

**Step 6: Verify in browser**
- Open `index.html` locally (via a local server, e.g. `npx serve .`)
- Open browser console — no Firebase errors should appear
- Firestore tab in Firebase Console should still show 0 documents

---

## Task 4: Add "Add a Note" Form to Settlement Detail Panel

**Files:**
- Modify: `index.html`

This task adds an annotation form + display of existing annotations at the bottom of the settlement detail panel.

**Step 1: Add annotation form CSS**

In the `<style>` block, after the `.sources-note` style (around line 716), add:

```css
/* ── Annotation form & display ───────────────────────────────────────── */
.annotations-section {
  margin-top: 20px;
  border-top: 1px solid var(--border);
  padding-top: 16px;
}
.annotations-section__title {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}
.annotation-item {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
  font-size: 13px;
}
.annotation-item__note {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 4px;
}
.annotation-item__meta {
  font-size: 11px;
  color: var(--text-muted);
}
.annotation-item--pending {
  border-color: #f59e0b44;
  opacity: 0.8;
}
.add-note-btn {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  background: transparent;
  border: 1px dashed var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}
.add-note-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.annotation-form {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.annotation-form input,
.annotation-form textarea {
  width: 100%;
  padding: 9px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-family: inherit;
  font-size: 13px;
  outline: none;
  resize: vertical;
}
.annotation-form input:focus,
.annotation-form textarea:focus {
  border-color: var(--accent);
}
.annotation-form input::placeholder,
.annotation-form textarea::placeholder {
  color: var(--text-muted);
}
.annotation-form__submit {
  padding: 10px;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}
.annotation-form__submit:hover {
  opacity: 0.85;
}
.annotation-form__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Step 2: Update `showSettlementDetail()` to append annotations**

Find the `showSettlementDetail(site)` function (around line 1575). At the very end of the `html` template string (just before the closing backtick), add:

```javascript
        <div class="annotations-section" id="annotations-${site.id}">
          <div class="annotations-section__title">Student Notes</div>
          <div id="annotation-list-${site.id}">
            <div style="color:var(--text-muted);font-size:12px;">Loading notes...</div>
          </div>
          <button class="add-note-btn" onclick="toggleAnnotationForm(${site.id})">+ Add a Note</button>
          <div id="annotation-form-${site.id}" class="annotation-form" style="display:none">
            <input id="af-name-${site.id}" type="text" placeholder="Your name *" maxlength="80">
            <input id="af-class-${site.id}" type="text" placeholder="Class name *" maxlength="80">
            <input id="af-school-${site.id}" type="text" placeholder="School *" maxlength="80">
            <textarea id="af-note-${site.id}" placeholder="Your note or research finding *" rows="3" maxlength="1000"></textarea>
            <input id="af-source-${site.id}" type="url" placeholder="Source URL (optional)">
            <button class="annotation-form__submit" onclick="handleSubmitAnnotation(${site.id})">Submit Note</button>
          </div>
        </div>
```

**Step 3: Add annotation helper functions**

After `showStudentSubmissionDetail()` (added in Task 3), add:

```javascript
// Load and render annotations for a settlement after detail panel opens
async function loadAndRenderAnnotations(settlementId) {
  const listEl = document.getElementById('annotation-list-' + settlementId);
  if (!listEl) return;

  const annotations = await loadAnnotations(settlementId);
  if (annotations.length === 0) {
    listEl.innerHTML = '<div style="color:var(--text-muted);font-size:12px;">No notes yet. Be the first!</div>';
    return;
  }

  listEl.innerHTML = annotations.map(a => `
    <div class="annotation-item ${a.status === 'pending' ? 'annotation-item--pending' : ''}">
      <div class="annotation-item__note">${a.note}</div>
      <div class="annotation-item__meta">
        ${a.studentName} · ${a.className}, ${a.school}
        ${a.status === 'pending' ? ' · <span style="color:#f59e0b">Pending approval</span>' : ''}
        ${a.sources && a.sources.length ? ` · <a href="${a.sources[0]}" target="_blank" rel="noopener" style="color:var(--accent)">Source</a>` : ''}
      </div>
    </div>
  `).join('');
}

// Toggle annotation form visibility, pre-fill from session
function toggleAnnotationForm(settlementId) {
  const form = document.getElementById('annotation-form-' + settlementId);
  if (!form) return;
  const isHidden = form.style.display === 'none';
  form.style.display = isHidden ? 'flex' : 'none';

  if (isHidden) {
    // Pre-fill from session if available
    const session = getSession();
    if (session) {
      document.getElementById('af-name-' + settlementId).value = session.studentName || '';
      document.getElementById('af-class-' + settlementId).value = session.className || '';
      document.getElementById('af-school-' + settlementId).value = session.school || '';
    }
  }
}

// Handle annotation form submit
async function handleSubmitAnnotation(settlementId) {
  const btn = document.querySelector(`#annotation-form-${settlementId} .annotation-form__submit`);
  const name = document.getElementById('af-name-' + settlementId).value.trim();
  const className = document.getElementById('af-class-' + settlementId).value.trim();
  const school = document.getElementById('af-school-' + settlementId).value.trim();
  const note = document.getElementById('af-note-' + settlementId).value.trim();
  const source = document.getElementById('af-source-' + settlementId).value.trim();

  if (!name || !className || !school || !note) {
    alert('Please fill in your name, class, school, and note.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Submitting...';

  try {
    await submitAnnotation({ settlementId, studentName: name, className, school, note, source });
    // Hide form, reload annotations
    document.getElementById('annotation-form-' + settlementId).style.display = 'none';
    await loadAndRenderAnnotations(settlementId);
  } catch (err) {
    console.error('Submit annotation error:', err);
    alert('Failed to submit. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Submit Note';
  }
}
```

**Step 4: Trigger annotation load when detail panel opens**

In `showSettlementDetail(site)`, at the very end of the function (after the `if (isMobile()) { ... } else { ... }` block), add:

```javascript
  // Load annotations after panel is rendered
  setTimeout(() => loadAndRenderAnnotations(site.id), 0);
```

**Step 5: Verify**
- Click a settlement marker
- Detail panel should show "Student Notes" section with "Loading notes..." → "No notes yet. Be the first!"
- Click "+ Add a Note" — form should appear
- Fill it in and submit — check Firebase Console Firestore → `annotations` collection for the new document with `status: "pending"`

---

## Task 5: Add "Add a Site" Floating Button + Pin-Drop Mode

**Files:**
- Modify: `index.html`

**Step 1: Add button HTML**

In `index.html`, find the `<button id="sources-btn"` element (around line 931). Just before it, add:

```html
<button id="add-site-btn" class="add-site-btn" aria-label="Propose a new historical site" title="Add a new site">
  + Add Site
</button>
```

**Step 2: Add CSS for the button and site proposal form**

In the `<style>` block, after the `.sources-btn:hover` style (around line 643), add:

```css
/* ── Add Site button ─────────────────────────────────────────────────── */
.add-site-btn {
  position: fixed;
  bottom: 80px;
  left: 100px;
  background: #10b981;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  padding: 7px 16px;
  cursor: pointer;
  z-index: 160;
  transition: background 0.15s;
}
.add-site-btn:hover {
  background: #059669;
}
.add-site-btn--active {
  background: #f59e0b;
}
.add-site-btn--active:hover {
  background: #d97706;
}

/* ── Site proposal modal ─────────────────────────────────────────────── */
.site-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.site-modal[hidden] {
  display: none;
}
.site-modal__content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
.site-modal__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}
.site-modal__subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 16px;
}
.site-modal__form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.site-modal__form input,
.site-modal__form textarea {
  width: 100%;
  padding: 9px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-family: inherit;
  font-size: 13px;
  outline: none;
  resize: vertical;
}
.site-modal__form input:focus,
.site-modal__form textarea:focus {
  border-color: var(--accent);
}
.site-modal__form input::placeholder,
.site-modal__form textarea::placeholder {
  color: var(--text-muted);
}
.site-modal__coords {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-muted);
  padding: 8px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.site-modal__actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.site-modal__submit {
  flex: 1;
  padding: 10px;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}
.site-modal__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.site-modal__cancel {
  padding: 10px 16px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
}
.site-modal__cancel:hover {
  border-color: var(--text-muted);
  color: var(--text);
}
/* Cursor crosshair when in pin-drop mode */
body.pin-drop-mode #map {
  cursor: crosshair !important;
}
```

**Step 3: Add site proposal modal HTML**

Just after the `#sources-modal` closing `</div>` (around line 967), add:

```html
<!-- Site proposal modal -->
<div id="site-modal" class="site-modal" hidden>
  <div class="site-modal__content">
    <div class="site-modal__title">Propose a New Site</div>
    <div class="site-modal__subtitle" id="site-modal-subtitle">Fill in the details for this location.</div>
    <div class="site-modal__form">
      <div class="site-modal__coords" id="site-modal-coords">📍 No location selected</div>
      <input id="sm-name" type="text" placeholder="Site name *" maxlength="100">
      <textarea id="sm-description" placeholder="Description / historical significance *" rows="3" maxlength="1000"></textarea>
      <input id="sm-source" type="url" placeholder="Source URL (optional)">
      <input id="sm-student" type="text" placeholder="Your name *" maxlength="80">
      <input id="sm-class" type="text" placeholder="Class name *" maxlength="80">
      <input id="sm-school" type="text" placeholder="School *" maxlength="80">
      <div class="site-modal__actions">
        <button class="site-modal__cancel" onclick="closeSiteModal()">Cancel</button>
        <button class="site-modal__submit" id="site-modal-submit" onclick="handleSubmitSite()">Submit Site</button>
      </div>
    </div>
  </div>
</div>
```

**Step 4: Add pin-drop state and handler functions**

Add these functions after `handleSubmitAnnotation()` (added in Task 4):

```javascript
// ── Pin-drop mode for proposing new sites ────────────────────────────────
let pendingPin = null;  // { lat, lng } of the clicked location
let mapClickListener = null;

function enterPinDropMode() {
  const btn = document.getElementById('add-site-btn');
  btn.textContent = '✕ Cancel';
  btn.classList.add('add-site-btn--active');
  document.body.classList.add('pin-drop-mode');

  mapClickListener = map.addListener('click', (e) => {
    pendingPin = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    exitPinDropMode(false);
    openSiteModal(pendingPin);
  });
}

function exitPinDropMode(resetBtn = true) {
  document.body.classList.remove('pin-drop-mode');
  if (mapClickListener) {
    google.maps.event.removeListener(mapClickListener);
    mapClickListener = null;
  }
  if (resetBtn) {
    const btn = document.getElementById('add-site-btn');
    btn.textContent = '+ Add Site';
    btn.classList.remove('add-site-btn--active');
    pendingPin = null;
  }
}

function openSiteModal(coords) {
  const modal = document.getElementById('site-modal');
  document.getElementById('site-modal-coords').textContent =
    `📍 ${coords.lat.toFixed(5)}°N, ${Math.abs(coords.lng).toFixed(5)}°W`;
  document.getElementById('site-modal-subtitle').textContent =
    'Fill in the details for this location.';

  // Pre-fill student info from session
  const session = getSession();
  if (session) {
    document.getElementById('sm-student').value = session.studentName || '';
    document.getElementById('sm-class').value = session.className || '';
    document.getElementById('sm-school').value = session.school || '';
  }

  modal.hidden = false;
}

function closeSiteModal() {
  document.getElementById('site-modal').hidden = true;
  exitPinDropMode();
}

async function handleSubmitSite() {
  const name = document.getElementById('sm-name').value.trim();
  const description = document.getElementById('sm-description').value.trim();
  const source = document.getElementById('sm-source').value.trim();
  const studentName = document.getElementById('sm-student').value.trim();
  const className = document.getElementById('sm-class').value.trim();
  const school = document.getElementById('sm-school').value.trim();

  if (!name || !description || !studentName || !className || !school) {
    alert('Please fill in all required fields (marked with *).');
    return;
  }

  if (!pendingPin) {
    alert('No location selected. Please close and try again.');
    return;
  }

  const btn = document.getElementById('site-modal-submit');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  try {
    await submitSiteProposal({
      name,
      lat: pendingPin.lat,
      lng: pendingPin.lng,
      description,
      source,
      studentName,
      className,
      school
    });

    closeSiteModal();
    await renderStudentSubmissions();  // Refresh markers
  } catch (err) {
    console.error('Submit site error:', err);
    alert('Failed to submit. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Submit Site';
  }
}
```

**Step 5: Wire up the "Add Site" button**

Find this section in `index.html` where event listeners are set up (it's near the bottom of the `<script>` tag, where you'll see the sources button listener, territory filter, etc.). Add:

```javascript
// Add Site button
document.getElementById('add-site-btn').addEventListener('click', () => {
  const btn = document.getElementById('add-site-btn');
  if (btn.classList.contains('add-site-btn--active')) {
    exitPinDropMode();
  } else {
    enterPinDropMode();
  }
});
```

**Step 6: Verify**
- Click "Add Site" — button turns yellow/orange, cursor over map becomes a crosshair
- Click anywhere on map — site proposal modal opens with the coordinates shown
- Fill in the form and submit — check Firebase Console for new document in `submissions` with `status: "pending"`
- The submitted marker (📍 green dashed circle) should appear on the map immediately

---

## Task 6: Add Student Submissions Layer Toggle

**Files:**
- Modify: `index.html`

This is a small task: add a "Student Notes" toggle to the Layers panel so teachers/students can show/hide student submissions.

**Step 1: Add layer option to the Layers panel**

Find the layers panel HTML (around line 900):
```html
<label class="layer-option"><input type="checkbox" data-layer="neighbors"><span ...></span> Neighboring Peoples</label>
```
After it, add:
```html
<label class="layer-option"><input type="checkbox" data-layer="studentSubmissions" checked><span class="layer-swatch" style="background:#10b981;border:2px dashed #10b981;border-radius:50%"></span> Student Sites</label>
```

**Step 2: Handle the toggle in the layer checkbox listener**

Find the layer checkbox event listener in the script (search for `data-layer`). It will look like a `querySelectorAll('[data-layer]')` loop with a switch/if-else block. Add a case for `studentSubmissions`:

```javascript
case 'studentSubmissions':
  studentMarkers.forEach(m => { m.map = checked ? map : null; });
  break;
```

**Step 3: Verify**
- Uncheck "Student Sites" in the Layers panel — student markers disappear
- Re-check — they reappear

---

## Task 7: Update Legend

**Files:**
- Modify: `index.html`

Add student submission entry to the legend.

**Step 1: Find the legend HTML** (around line 910). After the last `legend__section`, add:

```html
<div class="legend__section">
  <div class="legend__subtitle">Student Submissions</div>
  <div class="legend__item">
    <span style="width:14px;height:14px;border-radius:50%;border:2px dashed #10b981;display:inline-block;flex-shrink:0"></span>
    Approved student site
  </div>
  <div class="legend__item">
    <span style="width:14px;height:14px;border-radius:50%;border:2px dashed #f59e0b;display:inline-block;flex-shrink:0"></span>
    Pending approval
  </div>
</div>
```

---

## Task 8: End-to-End Test

**Step 1: Run a local server**
```bash
cd /Users/emilegiovannie/lenape-bronx-map
npx serve .
# Open http://localhost:3000
```

**Step 2: Test annotation flow**
1. Click the "Snakapins" marker
2. Detail panel opens → scroll to "Student Notes" section
3. Click "+ Add a Note" → form appears
4. Fill in: Name = "Test Student", Class = "Test 101", School = "Test School", Note = "Test note"
5. Click "Submit Note"
6. Firebase Console → Firestore → `annotations` collection → verify new doc with `status: "pending"`
7. Reload the page → the note should reappear (same class/school match)

**Step 3: Test site proposal flow**
1. Click "Add Site" button → cursor becomes crosshair
2. Click somewhere on the map → modal opens with coordinates
3. Fill in all fields → Submit
4. Firebase Console → `submissions` collection → verify new doc
5. Green dashed marker should appear on the map at clicked location

**Step 4: Test approval flow (simulate teacher)**
1. In Firebase Console, open the `annotations` collection → click the test doc
2. Edit the `status` field: change `"pending"` → `"approved"`
3. Reload the map → the annotation should now be visible to everyone (not just same class)

**Step 5: Test layer toggle**
- Uncheck "Student Sites" → markers disappear
- Re-check → markers reappear

---

## Task 9: Commit and Deploy

**Step 1: Stage files**
```bash
cd /Users/emilegiovannie/lenape-bronx-map
git add index.html submit.js
```

**Step 2: Commit**
```bash
git commit -m "feat: add student annotation and site submission via Firebase Firestore"
```

**Step 3: Push to deploy**
```bash
git push
```

**Step 4: Verify live**
- Open https://emilezounon.com/lenape-bronx-map/
- Test annotation and site submission flows on the live site
- Confirm Firebase Console shows the documents

---

## Notes for School Handoff

When handing off to the school:
1. Create a new Firebase project under the school's Google account
2. Export data: `gcloud firestore export gs://your-backup-bucket`
3. Import into school project: `gcloud firestore import gs://your-backup-bucket`
4. Update `FIREBASE_CONFIG` in `submit.js` with new project values
5. Transfer the domain DNS to school's hosting
6. Build the admin panel (`admin.html`) before handoff for teacher moderation UI
