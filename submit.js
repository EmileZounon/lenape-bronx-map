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

// ── Upload photos to Firebase Storage ────────────────────────────────────
async function uploadPhotos(files, folder) {
  const urls = [];
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;
    const ref = storage.ref(`photos/${folder}/${filename}`);
    await ref.put(file);
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
  await db.collection('submissions').add(data);
  setSession({ studentName: data.studentName, className: data.className, school: data.school });
}
