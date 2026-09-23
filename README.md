# PASTOR ABAYOMI BIBLE STORIES — Family Devotion (2026, 365 readings)

This GitHub/Vercel-ready edition includes all 365 dated devotional entries in **12 monthly reading files** instead of 365 individual day files. **No Supabase connection is required to read the devotionals.**

## Publish

1. Extract the ZIP file, then upload **all 19 files**, preserving the `assets/` and `readings/` folders, to the root of the Family Devotion GitHub repository. Upload the *contents* of this ZIP, not just the ZIP itself.
2. **Replace or delete the old `readings/day-001.js` through `day-365.js` files** and the prior `app.js` in the GitHub repository. Do not leave the old 365 daily files behind, as that would defeat the smaller file count.
3. Deploy on Vercel as a static site (Framework preset Other, project root/output `.`), or allow Vercel to deploy the new commit automatically.
4. Visit the site and select a date: each day of 2026 should display its reading, reflection, focus point, prayers, memory verse reference, hymn suggestion and family activity.

The current app loads one month at a time. All 365 devotions are retained. It has no export button or full-book download, but the monthly files and publicly displayed content can still be retrieved or copied by visitors. To restrict actual bulk access, a protected server-side system is required.

Editorial note: Several entries are thematic drafts. Review the text before commercial/book publication. No hymn lyrics or full copyrighted Bible passages are included.

## Official branding

The ministry brand is **PASTOR ABAYOMI BIBLE STORIES**. **Family Devotion** is the application name. The owner-provided original illustrated artwork is used as the header logo, footer identity and browser icon. A separate, correctly spaced text brand beside the logo reads **PASTOR ABAYOMI BIBLE STORIES** and the product label is **FAMILY DEVOTION**. The wide homepage illustration remains a family reading the Bible, rather than repeating the logo. The website address is `devotion.pastorabayomibiblestorykids.org`.

## Audit and implementation notes

- Replaced the generic book emoji with the uploaded official illustrated logo in the header, and added a subtle footer logo and matching favicon. The page retains the correctly spaced ministry name.
- Fixed a calendar navigation bug: selecting a different month now stays on that month until a devotion is chosen.
- Retained all 365 dated devotionals in 12 monthly reading scripts; no Supabase or login is needed to read.
- All public reading scripts remain accessible to visitors even though the site provides no export button. Keep your private book/CSV files off public GitHub.
