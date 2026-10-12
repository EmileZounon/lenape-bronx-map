# Lenape Bronx Map Admin Guide

## How publishing works

Student work goes live the moment a student submits it. There is no approval queue. Admins check the dashboard from time to time and take down anything that should not be on the map.

- **Hide from map** takes an entry off the public map but keeps it. **Show on map** puts it back.
- **Delete** (Tech Support only) removes it for good. A restore will never bring a deleted entry back.

The public can only read entries that are on the map. Hidden entries are visible to admins only.

## Student admin

Built-in student admin: `agescamilla2006@gmail.com` (Alexa). Tech Support can add more in the Tech support panel.

Sign in at `/admin.html` with your Google account.

1. The list opens on **Everything (newest first)**. Use the menu to see only **On the map** or **Hidden**, and the search box to find a student, school, site, or note.
2. Check sources and details. Use **Hide from map** for anything that should not be public.
3. Use **Set owner** to link an older entry to its student. Use a `@lc.cuny.edu` or `@lehman.cuny.edu` address. After that, the student can edit it.
4. An **Edited by student** badge means the student changed the entry after posting it. Edits go live right away, so give those a second look.

Student admins cannot delete entries, change admin access, or export and restore data.

## Tech support

Sign in with `emile.giovannie@gmail.com`. You can do everything a student admin can, plus the Tech support panel:

- Add or remove student admins.
- **Download all data** as a JSON file. Keep it somewhere access-controlled.
- **Restore missing records** from a downloaded JSON file. Restore never overwrites an entry that exists, and it always skips entries that were deleted on purpose. The checkbox for automatic backup copies is for disaster recovery only.
- **Delete** an entry. Every delete is recorded, so a later restore will not bring it back.

Automatic backups: when a student submits, their browser also saves one copy to a backup collection. Only Tech Support can read those copies, and they are included in **Download all data**.

## Student access

Students type their name, school, and CUNY email once per device. No password or Google sign-in. They can then add notes and sites, find their work under **My Submissions**, and edit their own entries. Edits stay on the map.

Limits to know:

- The email is not verified. Someone who types a classmate's email could edit that classmate's work. A class roster check can tighten this later.
- Anything a student submits is public right away, until an admin hides it.

## Publishing changes

The public site is hosted by GitHub Pages. Firestore rules are deployed separately. Publish both together, or the map and the database will disagree (for example, student edits failing).

From the project folder:

```sh
git push origin main
firebase deploy --only firestore:rules --project lenape-bronx-map
```

Bump `submit.js?v=N` in `index.html` whenever `submit.js` changes, so browsers load the new version.
