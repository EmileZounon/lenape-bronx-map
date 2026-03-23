---
module: Lenape Bronx Map
date: 2026-03-23
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "Student gets 'Failed to submit' when uploading photos from iPhone"
  - "Generic error message gives no indication of what went wrong"
root_cause: missing_validation
resolution_type: code_fix
severity: medium
tags: [heic, iphone, upload, file-validation, error-message]
---

# Troubleshooting: iPhone Photo Uploads Failing Silently

## Problem
A student uploading photos from an iPhone received "Failed to submit. Please try again." with no useful detail. The security hardening (file type validation) rejected HEIC/HEIF files, which is the default photo format on modern iPhones.

## Environment
- Module: Lenape Bronx Map
- Affected Component: submit.js (uploadPhotos), index.html (error handlers)
- Date: 2026-03-23

## Symptoms
- Student taps "Submit Note" with a photo attached from iPhone
- Alert shows: "Failed to submit. Please try again."
- Console shows the actual error but students don't check console
- The file type `image/heic` was not in the allowed list

## What Didn't Work
**Direct solution:** The problem was identified and fixed on the first attempt.

## Solution

**1. Added HEIC/HEIF to allowed types (`submit.js`):**
```javascript
// Before:
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// After:
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
```

**2. Show actual error message to students (`index.html`):**
```javascript
// Before:
alert('Failed to submit. Please try again.');

// After:
alert(err.message || 'Failed to submit. Please try again.');
```

## Why This Works
- Modern iPhones (iOS 11+) use HEIC as the default photo format
- The validation was correctly blocking non-image files, but HEIC was missing from the allowlist
- Showing `err.message` gives students actionable info like `"photo.heic" is not an allowed image type`

## Prevention
- When validating image uploads, always include HEIC/HEIF for iPhone compatibility
- Always surface the actual error message to users, not just a generic "failed" message
- Test uploads from both Android (JPEG) and iPhone (HEIC) devices

## Related Issues
- See also: [xss-and-upload-vulnerabilities-20260323.md](../security-issues/xss-and-upload-vulnerabilities-20260323.md) — the security hardening that introduced the strict file validation
