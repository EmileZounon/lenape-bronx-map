---
module: Lenape Bronx Map
date: 2026-03-23
problem_type: workflow_issue
component: database
symptoms:
  - "Admin panel approve/reject buttons fail with console error"
  - "Firestore security rules block status updates from client"
root_cause: missing_permission
resolution_type: config_change
severity: high
tags: [firestore, security-rules, admin, approval]
---

# Troubleshooting: Firestore Rules Blocking Admin Approval

## Problem
The admin panel (`admin.html`) could not approve or reject student submissions because Firestore security rules did not allow `update` operations from the client.

## Environment
- Module: Lenape Bronx Map (Firebase Firestore)
- Affected Component: admin.html + Firestore security rules
- Date: 2026-03-23

## Symptoms
- Clicking "Approve" or "Reject" in admin.html shows console error
- Firestore rules only allowed `create` (for student submissions), not `update`
- No Firebase Auth in the project, so admin can't be distinguished from students at the rules level

## What Didn't Work
**Direct solution:** The problem was identified and fixed on the first attempt by updating Firestore security rules.

## Solution

**Updated Firestore security rules (Firebase Console > Firestore > Rules):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /annotations/{doc} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }
    match /submissions/{doc} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }
    match /backups_annotations/{doc} {
      allow create: if true;
    }
    match /backups_submissions/{doc} {
      allow create: if true;
    }
  }
}
```

## Why This Works
- `allow update: if true` permits the admin panel's `.update({ status: newStatus })` calls
- Backup collections only need `create` (append-only — never updated)
- Without Firebase Auth, we can't restrict updates to admin-only at the Firestore level
- The admin panel is protected by a password gate (session-based) to keep casual users out

## Prevention
- When building an admin panel for a no-auth project, remember Firestore rules must allow the operations the admin needs
- If the project later adds Firebase Auth, tighten rules to: `allow update: if request.auth != null && request.auth.uid == 'teacher-uid'`
- For classroom projects, the password-gated admin.html + open Firestore rules is an acceptable tradeoff

## Related Issues
- See also: [xss-and-upload-vulnerabilities-20260323.md](../security-issues/xss-and-upload-vulnerabilities-20260323.md) — security hardening done in same session
