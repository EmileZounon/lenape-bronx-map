// ── Firebase config ───────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAmfoJ7SSz5TnUTQ6c0RL5fDoeJD_HKrhg",
  authDomain: "lenape-bronx-map.firebaseapp.com",
  projectId: "lenape-bronx-map",
  storageBucket: "lenape-bronx-map.firebasestorage.app",
  messagingSenderId: "866654319434",
  appId: "1:866654319434:web:48c0528863564f1ac1c7b3"
};

// ── Init ──────────────────────────────────────────────────────────────────
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();
const storage = firebase.storage();

// ── Session (localStorage) ───────────────────────────────────────────────
function getSession() {
  try {
    return JSON.parse(localStorage.getItem('lenape_session') || 'null');
  } catch { return null; }
}

function setSession(data) {
  localStorage.setItem('lenape_session', JSON.stringify(data));
}

function clearSession() {
  localStorage.removeItem('lenape_session');
}

// ── Student identity (email entered by the student) ─────────────────────
// This keeps the familiar no-password workflow. The email is not verified,
// so it is a convenience for finding submissions, not proof of ownership.
const CUNY_DOMAINS = ['lc.cuny.edu', 'lehman.cuny.edu'];

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

function isCunyEmail(email) {
  const e = normalizeEmail(email);
  const at = e.lastIndexOf('@');
  if (at < 1) return false;
  return CUNY_DOMAINS.includes(e.slice(at + 1));
}

function isSignedIn() {
  const s = getSession();
  return !!(s && isCunyEmail(s.email) && s.studentName);
}

// True when the signed-in student owns this entry. Entries without an
// email (made before sign-in existed) belong to nobody until an admin
// sets an owner email in admin.html.
function isMine(entry) {
  const session = getSession();
  if (!session || !entry || !entry.email) return false;
  return normalizeEmail(entry.email) === normalizeEmail(session.email);
}

// ── Security helpers ─────────────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function sanitizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (['https:', 'http:'].includes(parsed.protocol)) return parsed.href;
  } catch {}
  return '';
}

// ── Upload photos to Firebase Storage ────────────────────────────────────
async function uploadPhotos(files, folder) {
  const urls = [];
  for (const file of files) {
    // Validate file type (MIME + extension)
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(`"${file.name}" is not an allowed image type. Use JPEG, PNG, GIF, or WebP.`);
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'].includes(ext)) {
      throw new Error(`"${file.name}" has an invalid file extension.`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`"${file.name}" exceeds the 15 MB size limit.`);
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;
    const ref = storage.ref(`photos/${folder}/${filename}`);
    await ref.put(file, { contentType: file.type });
    const url = await ref.getDownloadURL();
    urls.push(url);
  }
  return urls;
}

// ── Live records only ───────────────────────────────────────────────────
// firestore.rules lets the public read only status == 'approved' (live)
// records, and rules are not filters: every public query must ask for
// live records explicitly or the whole query is denied.
const LIVE = 'approved';

// Write-once backup copy, keyed by the record id (rules require that).
function backupRecord(collection, id, data) {
  db.collection('backups_' + collection).doc(id).set({
    ...data,
    originalId: id,
    backedUpAt: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(err => console.error('Backup failed:', err));
}

// ── Load live notes for one settlement ──────────────────────────────────
async function loadAnnotations(settlementId) {
  const snapshot = await db.collection('annotations')
    .where('settlementId', '==', settlementId)
    .where('status', '==', LIVE)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ── Submit an annotation ─────────────────────────────────────────────────
async function submitAnnotation({ settlementId, studentName, className, school, email, note, source, photos = [], videoUrl = '' }) {
  const photoUrls = photos.length > 0 ? await uploadPhotos(photos, 'annotations') : [];
  const data = {
    settlementId,
    studentName: studentName.trim(),
    className: className.trim(),
    school: school.trim(),
    email: normalizeEmail(email),
    note: note.trim(),
    sources: source.trim() ? [source.trim()] : [],
    photos: photoUrls,
    videoUrl: videoUrl.trim(),
    status: LIVE,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  const docRef = await db.collection('annotations').add(data);
  backupRecord('annotations', docRef.id, data);
  setSession({ studentName: data.studentName, className: data.className, school: data.school, email: data.email });
}

// ── Load live student sites ─────────────────────────────────────────────
async function loadSubmissions() {
  const snapshot = await db.collection('submissions').where('status', '==', LIVE).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ── Submit a new site proposal ───────────────────────────────────────────
async function submitSiteProposal({ name, lat, lng, description, source, studentName, className, school, email, photos = [], videoUrl = '' }) {
  const photoUrls = photos.length > 0 ? await uploadPhotos(photos, 'submissions') : [];
  const data = {
    name: name.trim(),
    lat,
    lng,
    description: description.trim(),
    sources: source.trim() ? [source.trim()] : [],
    photos: photoUrls,
    videoUrl: videoUrl.trim(),
    studentName: studentName.trim(),
    className: className.trim(),
    school: school.trim(),
    email: normalizeEmail(email),
    status: LIVE,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  const docRef = await db.collection('submissions').add(data);
  backupRecord('submissions', docRef.id, data);
  setSession({ studentName: data.studentName, className: data.className, school: data.school, email: data.email });
}

// ── Update an existing annotation ───────────────────────────────────────
// Edits publish right away; status and owner never change here.
async function updateAnnotation(docId, { note, source, videoUrl = '', photos = [] }) {
  const newPhotoUrls = photos.length > 0 ? await uploadPhotos(photos, 'annotations') : [];
  const updates = {
    note: note.trim(),
    sources: source.trim() ? [source.trim()] : [],
    videoUrl: videoUrl.trim(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (newPhotoUrls.length > 0) {
    updates.photos = newPhotoUrls;
  }
  await db.collection('annotations').doc(docId).update(updates);
}

// ── Update an existing site proposal ────────────────────────────────────
async function updateSiteProposal(docId, { name, description, source, videoUrl = '', photos = [] }) {
  const newPhotoUrls = photos.length > 0 ? await uploadPhotos(photos, 'submissions') : [];
  const updates = {
    name: name.trim(),
    description: description.trim(),
    sources: source.trim() ? [source.trim()] : [],
    videoUrl: videoUrl.trim(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (newPhotoUrls.length > 0) {
    updates.photos = newPhotoUrls;
  }
  await db.collection('submissions').doc(docId).update(updates);
}

// ── Load all submissions owned by an email ───────────────────────────────
async function loadSubmissionsByEmail(email) {
  const e = normalizeEmail(email);
  const session = getSession();
  if (!session || !isCunyEmail(e) || normalizeEmail(session.email) !== e) {
    throw new Error('Enter the same CUNY email you used when you submitted this work.');
  }
  const [annByEmail, subByEmail] = await Promise.all([
    db.collection('annotations').where('email', '==', e).where('status', '==', LIVE).get(),
    db.collection('submissions').where('email', '==', e).where('status', '==', LIVE).get()
  ]);
  return {
    annotations: annByEmail.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    submissions: subByEmail.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  };
}
