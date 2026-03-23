---
module: Lenape Bronx Map
date: 2026-03-23
problem_type: database_issue
component: database
symptoms:
  - "No backup mechanism for student annotations and site proposals"
  - "Accidental Firestore collection deletion would lose all student work"
root_cause: incomplete_setup
resolution_type: code_fix
severity: high
tags: [backup, firestore, data-loss, student-data]
---

# Troubleshooting: No Backup System for Student Data

## Problem
Student annotations and site proposals were stored only in Firestore `annotations` and `submissions` collections with no redundancy. An accidental deletion or Firestore issue would permanently lose all student work.

## Environment
- Module: Lenape Bronx Map (Firebase Firestore)
- Affected Component: submit.js (data persistence)
- Date: 2026-03-23

## Symptoms
- No backup collections existed
- No way to export data
- Single point of failure for all student work

## What Didn't Work
**Direct solution:** The problem was identified and fixed on the first attempt.

## Solution

**1. Automatic Firestore backup collections (`submit.js`):**
```javascript
// After every annotation/submission write, fire-and-forget a backup copy
const docRef = await db.collection('annotations').add(data);
db.collection('backups_annotations').add({
  ...data,
  originalId: docRef.id,
  backedUpAt: firebase.firestore.FieldValue.serverTimestamp()
}).catch(err => console.error('Backup failed:', err));
```

**2. Admin JSON export (`index.html`):**
```javascript
// Visible only with ?admin query param
// Downloads all data (live + backups) as timestamped JSON
async function exportAllData() {
  const [annotations, submissions, backupAnnotations, backupSubmissions] = await Promise.all([
    db.collection('annotations').get(),
    db.collection('submissions').get(),
    db.collection('backups_annotations').get().catch(() => ({ docs: [] })),
    db.collection('backups_submissions').get().catch(() => ({ docs: [] })),
  ]);
  // ... download as JSON blob
}
```

## Why This Works
- Backup collections are independent from main collections — deleting `annotations` doesn't affect `backups_annotations`
- Fire-and-forget pattern means backups don't slow down the student experience
- JSON export gives the teacher a local copy they can save anywhere
- `originalId` in backups allows cross-referencing with the live collection

## Prevention
- Always add backup/redundancy when storing user-generated content
- Include an export mechanism for any project that will be handed off
- Access export via `?admin` query param: `emilezounon.com/lenape-bronx-map/?admin`

## Related Issues
No related issues documented yet.
