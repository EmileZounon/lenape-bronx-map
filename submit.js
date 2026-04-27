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

// ── School name fuzzy match ─────────────────────────────────────────────
// 1. Normalizes (lowercase, strips suffixes / punctuation).
// 2. Checks alias groups — schools that share a community (e.g., Macaulay
//    Honors students AT Lehman are part of both, so "Macaulay" and
//    "Lehman" map to the same group).
// 3. Falls back to prefix match ("Lehman" / "Lehman College") and
//    Levenshtein distance ≤ 2 for typos ("Macaulay" / "Macauley").

// Each inner array is a group of names that should be treated as equivalent.
// First entry of the group is the canonical id used internally.
const SCHOOL_ALIAS_GROUPS = [
  // Macaulay Honors students at Lehman College — visible to each other.
  ['lehman', 'macaulay', 'macauley']
];

function normalizeSchool(s) {
  return (s || '')
    .toLowerCase()
    .replace(/\b(college|university|school|the|honors|program)\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function schoolGroupId(normalized) {
  if (!normalized) return null;
  for (const group of SCHOOL_ALIAS_GROUPS) {
    for (const alias of group) {
      if (
        normalized === alias ||
        normalized.startsWith(alias) ||
        alias.startsWith(normalized)
      ) {
        return group[0];
      }
    }
  }
  return null;
}

function schoolsMatch(a, b) {
  const nA = normalizeSchool(a);
  const nB = normalizeSchool(b);
  if (!nA || !nB) return false;
  if (nA === nB) return true;
  if (nA.startsWith(nB) || nB.startsWith(nA)) return true;
  // Alias groups (e.g., Macaulay + Lehman = same community)
  const gA = schoolGroupId(nA);
  const gB = schoolGroupId(nB);
  if (gA && gA === gB) return true;
  // Levenshtein distance ≤ 2 for typos in 5+ char names
  if (nA.length < 5 || nB.length < 5) return false;
  const m = nA.length, n = nB.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[0][i] = i;
  for (let j = 0; j <= n; j++) dp[j][0] = j;
  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      const cost = nA[i - 1] === nB[j - 1] ? 0 : 1;
      dp[j][i] = Math.min(dp[j - 1][i] + 1, dp[j][i - 1] + 1, dp[j - 1][i - 1] + cost);
    }
  }
  return dp[n][m] <= 2;
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

// ── Load annotations: approved are public; pending only show to same school
async function loadAnnotations(settlementId) {
  const session = getSession();
  const snapshot = await db.collection('annotations')
    .where('settlementId', '==', settlementId)
    .get();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(a =>
      a.status === 'approved' ||
      (session && schoolsMatch(a.school, session.school))
    );
}

// ── Submit an annotation ─────────────────────────────────────────────────
async function submitAnnotation({ settlementId, studentName, className, school, email, note, source, photos = [], videoUrl = '' }) {
  const photoUrls = photos.length > 0 ? await uploadPhotos(photos, 'annotations') : [];
  const data = {
    settlementId,
    studentName: studentName.trim(),
    className: className.trim(),
    school: school.trim(),
    email: email.trim(),
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
  setSession({ studentName: data.studentName, className: data.className, school: data.school, email: data.email });
}

// ── Load submissions: approved are public; pending only show to same school
async function loadSubmissions() {
  const session = getSession();
  const snapshot = await db.collection('submissions').get();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(s =>
      s.status === 'approved' ||
      (session && schoolsMatch(s.school, session.school))
    );
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
    email: email.trim(),
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
  setSession({ studentName: data.studentName, className: data.className, school: data.school, email: data.email });
}

// ── Update an existing annotation ───────────────────────────────────────
async function updateAnnotation(docId, { note, source, videoUrl = '', photos = [], email = '' }) {
  const newPhotoUrls = photos.length > 0 ? await uploadPhotos(photos, 'annotations') : [];
  const updates = {
    note: note.trim(),
    sources: source.trim() ? [source.trim()] : [],
    videoUrl: videoUrl.trim(),
    status: 'pending',
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (newPhotoUrls.length > 0) {
    updates.photos = newPhotoUrls;
  }
  if (email.trim()) {
    updates.email = email.trim();
  }
  await db.collection('annotations').doc(docId).update(updates);
}

// ── Update an existing site proposal ────────────────────────────────────
async function updateSiteProposal(docId, { name, description, source, videoUrl = '', photos = [], email = '' }) {
  const newPhotoUrls = photos.length > 0 ? await uploadPhotos(photos, 'submissions') : [];
  const updates = {
    name: name.trim(),
    description: description.trim(),
    sources: source.trim() ? [source.trim()] : [],
    videoUrl: videoUrl.trim(),
    status: 'pending',
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (newPhotoUrls.length > 0) {
    updates.photos = newPhotoUrls;
  }
  if (email.trim()) {
    updates.email = email.trim();
  }
  await db.collection('submissions').doc(docId).update(updates);
}

// ── Load all submissions by email, falling back to name+school ───────────
async function loadSubmissionsByEmail(email, studentName, school) {
  // Query by email
  const [annByEmail, subByEmail] = await Promise.all([
    db.collection('annotations').where('email', '==', email).get(),
    db.collection('submissions').where('email', '==', email).get()
  ]);

  const annotations = annByEmail.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const submissions = subByEmail.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const seenIds = new Set([...annotations.map(a => a.id), ...submissions.map(s => s.id)]);

  // Also query by name+school to find old submissions without email
  if (studentName && school) {
    const [annByName, subByName] = await Promise.all([
      db.collection('annotations').where('studentName', '==', studentName).where('school', '==', school).get(),
      db.collection('submissions').where('studentName', '==', studentName).where('school', '==', school).get()
    ]);
    annByName.docs.forEach(doc => {
      if (!seenIds.has(doc.id)) {
        annotations.push({ id: doc.id, ...doc.data() });
      }
    });
    subByName.docs.forEach(doc => {
      if (!seenIds.has(doc.id)) {
        submissions.push({ id: doc.id, ...doc.data() });
      }
    });
  }

  return { annotations, submissions };
}
