# Publishing convention: cache-busted asset URLs

GitHub Pages serves everything with `cache-control: max-age=600`, and iOS Safari
keeps rendering cached images long after that in open tabs. Because this site
reuses the same asset filenames on every republish, viewers used to see stale
images after each update round.

**Convention:** every asset reference in `index.html` carries a
`?v=<10-char git blob sha>` query derived from the asset's current content.
When an asset's content changes, its blob sha changes, the URL changes, and
every browser fetches it fresh — no hard refresh needed.

**How to apply (last step of EVERY publish):** from the main ChargeControl
workspace, run

    node scripts/version-brand-guide-assets.mjs

(`--dry-run` writes the result to /tmp without pushing). The script rebases on
the latest commit, restamps all references idempotently (static refs, meta/og
tags, downloads, and the JS `STOCK` grid via per-entry `"v"` fields), pushes
via the GitHub API, triggers a Pages build, and polls until built.

## Social assets: verification gate

Whenever `assets/social/` or its generator changes, run the check BEFORE
pushing (from the main ChargeControl workspace root, so `sharp` resolves):

    node <this-checkout>/assets/social/check-social.mjs [--repo <this-checkout>]

It re-runs `assets/social/generate-social.mjs` in a temp dir and fails unless
all 10 committed SVGs are byte-identical to a fresh run (outputs are never
hand-edited), all 10 PNGs have their exact platform dimensions, and every
full-opacity mark/text sits inside its platform safe zone (circular profile
crops ≤62%, LinkedIn/Facebook bottom-left overlap, X center band, YouTube
1546×423 mobile window). It must exit 0 before the social assets are pushed.

Notes:
- Download links keep their real file extensions; the `?v=` query does not
  affect the downloaded filename.
- If you add a NEW kind of asset reference (new JS-built URL pattern), extend
  the script so it gets stamped too — unstamped references can serve stale
  content.
