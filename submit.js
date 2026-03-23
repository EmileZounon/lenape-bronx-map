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

// ── Load approved annotations for a settlement ───────────────────────────
async function loadAnnotations(settlementId) {
  const session = getSession();
  const snapshot = await db.collection('annotations')
    .where('settlementId', '==', settlementId)
    .get();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(a =>
      a.status === 'approved' ||
      (session && a.className === session.className && a.school === session.school)
    );
}

// ── Submit an annotation ─────────────────────────────────────────────────
async function submitAnnotation({ settlementId, studentName, className, school, note, source, photos = [], videoUrl = '' }) {
  const photoUrls = photos.length > 0 ? await uploadPhotos(photos, 'annotations') : [];
  const data = {
    settlementId,
    studentName: studentName.trim(),
    className: className.trim(),
    school: school.trim(),
    note: note.trim(),
    sources: source.trim() ? [source.trim()] : [],
    photos: photoUrls,
    videoUrl: videoUrl.trim(),
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  const docRef = await db.collection('annotations').add(data);
  // Backup: write a copy to backups collection (fire-and-forget)
  db.collection('backups_annotations').add({
    ...data,
    originalId: docRef.id,
    backedUpAt: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(err => console.error('Backup annotation failed:', err));
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
async function submitSiteProposal({ name, lat, lng, description, source, studentName, className, school, photos = [], videoUrl = '' }) {
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
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  const docRef = await db.collection('submissions').add(data);
  // Backup: write a copy to backups collection (fire-and-forget)
  db.collection('backups_submissions').add({
    ...data,
    originalId: docRef.id,
    backedUpAt: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(err => console.error('Backup submission failed:', err));
  setSession({ studentName: data.studentName, className: data.className, school: data.school });
}
