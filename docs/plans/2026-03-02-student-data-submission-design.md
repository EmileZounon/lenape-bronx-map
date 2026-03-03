# Student Data Submission — Design Doc
**Date:** 2026-03-02
**Project:** Pre-Colonial Lenape Settlements of the Bronx
**Repo:** EmileZounon/emilezounon.com (lenape-bronx-map/)
**Live:** https://emilezounon.com/lenape-bronx-map/

---

## Goal

Allow students to contribute historical data to the map — annotating existing settlement markers and proposing new locations — stored in Firebase Firestore.

---

## Constraints

- Static HTML site on GitHub Pages — no build step
- Full repo + domain will be handed off to a school later
- Data must be portable: exportable from one Firebase project and importable into another
- No student login — identify by name + class + school only
- Admin panel deferred — teachers moderate via Firebase Console for now

---

## Database

**Firebase project:** `lenape-bronx-map` (new, dedicated project)
**Database:** Firestore (Spark free tier)

### Collections

#### `annotations` — notes on existing settlements
```json
{
  "settlementId": 4,
  "studentName": "Maria",
  "className": "History 101",
  "school": "PS 123",
  "note": "I found a source that says...",
  "sources": ["https://..."],
  "status": "pending | approved",
  "createdAt": "timestamp"
}
```

#### `submissions` — student-proposed new markers
```json
{
  "name": "Proposed Site Name",
  "lat": 40.85,
  "lng": -73.89,
  "description": "...",
  "sources": ["https://..."],
  "studentName": "Maria",
  "className": "History 101",
  "school": "PS 123",
  "status": "pending | approved",
  "createdAt": "timestamp"
}
```

---

## User Flows

### Annotating an existing marker
1. Student clicks a settlement marker → info panel opens
2. "Add a Note" button at bottom of panel
3. Form: name, class, school, note, optional source URL
4. Submit → Firestore `annotations` with `status: "pending"`
5. Visible immediately to same class/school; public after approval

### Proposing a new location
1. "Add a Site" button floats on the map
2. Click → pin-drop cursor mode
3. Click map → pin drops, form opens: site name, description, source, name, class, school
4. Submit → Firestore `submissions` with `status: "pending"`
5. Visible immediately to same class/school; public after approval

### Teacher moderation (interim)
- Firebase Console → flip `status` from `"pending"` to `"approved"`
- Admin panel (`admin.html`) to be built later before school handoff

---

## Architecture

### Files changed
| File | Change |
|------|--------|
| `index.html` | Add Firebase SDK (CDN), annotation UI, new site UI, fetch approved data |
| `submit.js` | New — handles all Firestore reads/writes |
| `admin.html` | Deferred — add before school handoff |

### Map behavior
- On load: fetch all `approved` submissions from Firestore, render as distinct markers (different color to distinguish from original hardcoded data)
- Annotations: shown in settlement detail panel when marker clicked
- Pending items: shown only when class/school matches current student session

---

## Portability / School Handoff

```bash
# Export from current Firebase
gcloud firestore export gs://your-bucket

# Import into school's Firebase
gcloud firestore import gs://your-bucket
```

All data in two clean collections — no vendor lock-in beyond standard Firestore JSON format.
