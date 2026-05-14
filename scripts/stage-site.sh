#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="${1:-/root/voiddo-ops/drops/message-next-step-live-route-sync-20260514}"
LIVE_DIR="/var/www/tells.voiddo.com/message-next-step"
DIST_DIR="/var/www/tells.voiddo.com/frontend/dist/message-next-step"

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR/src"

cp "$ROOT_DIR/site/index.html" "$TARGET_DIR/index.html"
cp "$ROOT_DIR/site/compare-chatgpt-gemini.html" "$TARGET_DIR/compare-chatgpt-gemini.html"
cp "$ROOT_DIR/site/styles.css" "$TARGET_DIR/styles.css"
cp "$ROOT_DIR/site/app.js" "$TARGET_DIR/app.js"
cp "$ROOT_DIR/src/index.js" "$TARGET_DIR/src/index.js"
cp "$ROOT_DIR/README.md" "$TARGET_DIR/README.md"
cp "$ROOT_DIR/compare-chatgpt-gemini.md" "$TARGET_DIR/compare-chatgpt-gemini.md"
cp "$ROOT_DIR/from-the-studio.md" "$TARGET_DIR/from-the-studio.md"

perl -0pi -e 's#\.\./src/index\.js#./src/index.js#g' "$TARGET_DIR/app.js"

cat > "$TARGET_DIR/verify-pack.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

sha256sum -c SHA256SUMS

grep -q "Decide what this message actually earns right now" index.html
grep -q "message-next-step vs ChatGPT or Gemini" compare-chatgpt-gemini.html
grep -q "soft-yes-or-no" index.html
grep -q "raincheck-or-run" compare-chatgpt-gemini.html

printf 'message-next-step route pack checks passed\n'
EOF

chmod +x "$TARGET_DIR/verify-pack.sh"

cat > "$TARGET_DIR/README-DROP.md" <<'EOF'
# message-next-step live route sync

Purpose: replace the stale `message-next-step` tells SPA fallback with a dedicated static
browser route and compare page aligned with the npm/GitHub install surface.

Contents:

- dedicated live route `index.html`
- dedicated compare page `compare-chatgpt-gemini.html`
- browser app shell `app.js`
- deterministic analyzer source `src/index.js`
- README/package collateral copies for traceability

Verification:

```bash
./verify-pack.sh
```

Live follow-through:

```bash
./deploy-live.sh
```
EOF

cat > "$TARGET_DIR/deploy-live.sh" <<EOF
#!/usr/bin/env bash
set -euo pipefail

LIVE_DIR="${LIVE_DIR}"
DIST_DIR="${DIST_DIR}"
SOURCE_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "\$LIVE_DIR/src" "\$DIST_DIR/src"
cp "\$SOURCE_DIR/index.html" "\$LIVE_DIR/index.html"
cp "\$SOURCE_DIR/compare-chatgpt-gemini.html" "\$LIVE_DIR/compare-chatgpt-gemini.html"
cp "\$SOURCE_DIR/styles.css" "\$LIVE_DIR/styles.css"
cp "\$SOURCE_DIR/app.js" "\$LIVE_DIR/app.js"
cp "\$SOURCE_DIR/src/index.js" "\$LIVE_DIR/src/index.js"

cp "\$SOURCE_DIR/index.html" "\$DIST_DIR/index.html"
cp "\$SOURCE_DIR/compare-chatgpt-gemini.html" "\$DIST_DIR/compare-chatgpt-gemini.html"
cp "\$SOURCE_DIR/styles.css" "\$DIST_DIR/styles.css"
cp "\$SOURCE_DIR/app.js" "\$DIST_DIR/app.js"
cp "\$SOURCE_DIR/src/index.js" "\$DIST_DIR/src/index.js"

printf 'deployed message-next-step bundle to %s and %s\n' "\$LIVE_DIR" "\$DIST_DIR"
EOF

chmod +x "$TARGET_DIR/deploy-live.sh"

cat > "$TARGET_DIR/DEPLOY-NOTES.md" <<'EOF'
# message-next-step deploy notes

## Intended live route

- public URL: `https://tells.voiddo.com/message-next-step/`
- live filesystem target: `/var/www/tells.voiddo.com/frontend/dist/message-next-step/`

## Files to copy

- `index.html`
- `compare-chatgpt-gemini.html`
- `styles.css`
- `app.js`
- `src/index.js`

## Discovery wiring required at publish time

1. Add a footer/catalog link for `/message-next-step/` if it is missing from the current SPA shell.
2. Add sitemap entry in `/var/www/tells.voiddo.com/frontend/public/sitemap.xml`:
   - `https://tells.voiddo.com/message-next-step/`
   - `lastmod` current publish date
   - `changefreq` weekly
   - `priority` `0.82`
3. Rebuild frontend from `/var/www/tells.voiddo.com/frontend/` so `dist/sitemap.xml` and shell links stay aligned.

## Verification

- `curl -I https://tells.voiddo.com/message-next-step/`
- `curl https://tells.voiddo.com/message-next-step/ | rg "Decide what this message actually earns right now"`
- `curl https://tells.voiddo.com/message-next-step/compare-chatgpt-gemini.html | rg "message-next-step vs ChatGPT or Gemini"`
- browser/screenshot check on the public route
- confirm footer or toolkit links mention `message-next-step`
EOF

(
  cd "$TARGET_DIR"
  sha256sum index.html compare-chatgpt-gemini.html styles.css app.js src/index.js README.md compare-chatgpt-gemini.md from-the-studio.md DEPLOY-NOTES.md deploy-live.sh verify-pack.sh README-DROP.md > SHA256SUMS
)

printf 'staged message-next-step site at %s\n' "$TARGET_DIR"
