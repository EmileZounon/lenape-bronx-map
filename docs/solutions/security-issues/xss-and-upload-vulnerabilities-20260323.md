---
module: Lenape Bronx Map
date: 2026-03-23
problem_type: security_issue
component: frontend_stimulus
symptoms:
  - "User-generated text rendered via innerHTML without escaping"
  - "No file type validation on photo uploads — any file accepted"
  - "URLs from user input rendered as href without protocol check"
root_cause: missing_validation
resolution_type: code_fix
severity: critical
tags: [xss, file-upload, url-injection, security, student-input]
---

# Troubleshooting: XSS and Malicious Upload Vulnerabilities

## Problem
All user-generated content (student names, notes, descriptions, URLs) was injected directly into `innerHTML` via template literals with zero escaping. File uploads accepted any file type. URLs were rendered as `href` without protocol validation, allowing `javascript:` injection.

## Environment
- Module: Lenape Bronx Map (static HTML + Firebase)
- Affected Component: index.html (rendering), submit.js (uploads)
- Date: 2026-03-23

## Symptoms
- A student typing `<script>alert('xss')</script>` in any text field would have it execute
- `<img onerror="malicious code" src="x">` in a note field would execute JS
- Any file type could be uploaded (HTML, SVG with embedded JS, executables)
- `javascript:alert(1)` could be entered as a video URL or source URL
- Firebase Storage had no content-type enforcement

## What Didn't Work
**Direct solution:** The problem was identified and fixed on the first attempt via security audit.

## Solution

**1. HTML escaping for all user text (`submit.js`):**
```javascript
// Before (broken):
`<div class="annotation-item__note">${a.note}</div>`

// After (fixed):
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
`<div class="annotation-item__note">${escapeHtml(a.note)}</div>`
```

**2. URL sanitization (`submit.js`):**
```javascript
// Before (broken):
`<a href="${a.videoUrl}">Watch</a>`

// After (fixed):
function sanitizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (['https:', 'http:'].includes(parsed.protocol)) return parsed.href;
  } catch {}
  return '';
}
```

**3. File upload validation (`submit.js`):**
```javascript
// Before (broken): accepted any file
await ref.put(file);

// After (fixed): MIME + extension check, explicit contentType
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error(...);
await ref.put(file, { contentType: file.type });
```

## Why This Works
1. `escapeHtml()` uses the browser's own `textContent` setter to escape HTML entities, preventing any HTML/JS from executing when inserted via `innerHTML`.
2. `sanitizeUrl()` parses the URL and only allows `http:` and `https:` protocols, blocking `javascript:`, `data:`, and other dangerous schemes.
3. File validation checks both MIME type and extension, and sets explicit `contentType` on Firebase Storage upload so files can't masquerade as different types.

## Prevention
- **Always escape user input before innerHTML** — use `escapeHtml()` for every piece of user-generated text
- **Always sanitize URLs** — never render user-provided URLs as `href` without `sanitizeUrl()`
- **Validate file uploads client-side AND server-side** — check MIME, extension, and set contentType
- **For new features:** any template literal that includes `${variable}` going into `.innerHTML` must use `escapeHtml()` unless the variable is a known-safe constant

## Related Issues
No related issues documented yet.
