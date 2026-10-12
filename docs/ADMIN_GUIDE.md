# Lenape Bronx Map Admin Guide

## Student admin

Sign in at `/admin.html` with the Google account that tech support added.

1. Leave the review filter on **Needs review** to see new notes and site proposals.
2. Open sources and check the location or settlement details before deciding.
3. Use **Set owner** when an older submission needs to be linked to its student. Use a verified `@lc.cuny.edu` or `@lehman.cuny.edu` address.
4. Choose **Approve** to publish a submission or **Reject** to keep it off the public map. Use **Return to review** if an approved or rejected item needs another look.
5. Search by student, school, site, or note. Use the status menu to find older decisions.

Student admins can review records and assign ownership. They cannot grant admin access, export backups, or delete records.

## Tech support

Sign in with the designated support Google account. The **Tech support** panel lets you:

- Add a student admin using their Lehman/CUNY email.
- Remove a student's admin access when their role ends.
- Download a JSON copy of submissions and existing backup records before a handoff or recovery task.
- Restore missing records from a downloaded JSON file. Existing records are skipped and never overwritten; older saved backup records can also be recovered by their original IDs.
- Delete a record when necessary. Deletion is permanent from this page.

Keep a copy of the downloaded data somewhere access-controlled. Restore writes only missing records and does not overwrite the current version of a record.

## Student and public access

Students enter a Lehman/CUNY email to submit work, find matching submissions, and edit them. No password or Google sign-in is required. Edits return to **Needs review**.

The entered email is not verified. Firestore must allow reads for this no-password workflow, so do not treat pending submissions as private; someone who knows an owner's email can claim to be that student and edit their work. The public map displays approved work to visitors, but the underlying records are readable from the database.

## Publishing changes

The public site is hosted by GitHub Pages. Firestore permissions are deployed separately from this page. Publish the updated site and Firestore rules together so the email-only submission flow and admin roles stay in sync.

From the project folder, deploy the rules with:

```sh
firebase deploy --only firestore:rules
```

After the new admin page and rules are live, the support account should add the student admin in the **Tech support** panel. The student can then sign in at `/admin.html`.
