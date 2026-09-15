# Archived: Berlin journal

Not part of the live site (no routes, no nav links). Kept for reference — this is where I
learned gray-matter/frontmatter parsing and built the MDX + photo-grid/lightbox rendering.

`page.tsx` / `slug-page.tsx` are the original `app/berlin` route components, left outside
`app/` so Next.js won't build them into pages. `berlin-lib.ts` is the original `lib/berlin.ts`,
just pointed at `content/` in this folder instead of a top-level `content/berlin`.

`admin/` is the Decap CMS dashboard (was `public/admin`) used to write these journal posts
through a GitHub-backed editor UI — moved here so it's no longer served at `/admin`. It still
talks to the OAuth proxy in `oauth-worker.js` at the repo root, which is generic (not
Berlin-specific) and was left in place.
