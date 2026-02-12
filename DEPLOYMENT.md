# RevealJS Deck GitHub Pages Deployment Guide

## Problem Summary

When deploying a RevealJS presentation to GitHub Pages, you encountered:
- **404 errors** for all CSS, JavaScript, and image assets
- **STRTGY_REVEAL_CONFIG is not defined** error
- Blank page with no visible content

## Root Cause

The HTML file used **relative paths** like `../../../templates/revealjs/shared/css/strtgy-reveal-theme.css` which:
1. Work locally (relative to the workspace directory structure)
2. **Break on GitHub Pages** because the repository only contained `index.html`, not the parent directory structure

## Solution

### 1. Copy All Assets into the Deployment Repository

Run the deployment script to gather all required files:

```bash
cd reports/lugon_zmm_starter/deck_entrega
bash prepare_deploy.sh
```

This creates the following structure:
```
deck_entrega/
├── index.html
├── assets/
│   ├── logo-strtgy-white.png
│   └── logo-strtgy-black.png
├── css/
│   └── strtgy-reveal-theme.css
├── js/
│   └── strtgy-particles.js
├── tokens/
│   └── reveal-config.js
└── mapas/
    ├── screenshots/
    │   └── *.png (map screenshots)
    └── interactive/
        └── *.html (interactive maps)
```

### 2. Fix All Path References

Run the path fixer to convert relative paths to deployment-friendly paths:

```bash
python fix_paths.py
```

This converts:
- `../../../templates/revealjs/shared/css/strtgy-reveal-theme.css` → `./css/strtgy-reveal-theme.css`
- `../../../templates/revealjs/shared/assets/logo-strtgy-white.png` → `./assets/logo-strtgy-white.png`
- `../mapas/screenshots/mapa_demanda_zmm.png` → `./mapas/screenshots/mapa_demanda_zmm.png`
- `../mapas/mapa_isocronas_multizona.html` → `./mapas/interactive/mapa_isocronas_multizona.html`

### 3. Fix JavaScript Loading Race Condition

The original code tried to use `STRTGY_REVEAL_CONFIG` immediately, but the external script might not have loaded yet.

**Fixed by wrapping in `DOMContentLoaded`:**

```javascript
window.addEventListener('DOMContentLoaded', function() {
    if (typeof STRTGY_REVEAL_CONFIG !== 'undefined') {
        Reveal.initialize({
            ...STRTGY_REVEAL_CONFIG,
            plugins: [RevealNotes, RevealZoom]
        });
    } else {
        // Fallback config if tokens fail to load
        console.warn('STRTGY_REVEAL_CONFIG not loaded, using fallback');
        Reveal.initialize({
            width: 1920,
            height: 1080,
            margin: 0.08,
            transition: 'fade',
            plugins: [RevealNotes, RevealZoom]
        });
    }
});
```

### 4. Deploy to GitHub Pages

```bash
git add -A
git commit -m "Add all required assets and fix paths for GitHub Pages deployment"
git push
```

Wait 30-60 seconds for GitHub Pages to rebuild, then verify at:
https://strtgy.github.io/L1_delivery_deck/

## Quick Deployment Checklist

For future decks:

- [ ] Run `bash prepare_deploy.sh` to copy assets
- [ ] Run `python fix_paths.py` to fix paths in index.html
- [ ] Verify locally: `python -m http.server 8000` and open http://localhost:8000/
- [ ] Commit: `git add -A && git commit -m "Deploy deck"`
- [ ] Push: `git push`
- [ ] Wait 30-60 seconds for GitHub Pages rebuild
- [ ] Verify: Open the GitHub Pages URL

## Files Created

- `prepare_deploy.sh` - Copies all required assets into deck directory
- `fix_paths.py` - Converts relative paths to deployment-friendly paths
- `.gitignore` - Excludes deployment scripts from git tracking

## Known Issues

**Harmless iframe sandbox warnings:** RevealJS uses iframes for plugins (Notes, Zoom). The browser warns about `allow-scripts` and `allow-same-origin` being potentially unsafe, but this is expected RevealJS behavior and doesn't break functionality.

## Deployment URL

- **Live Site:** https://strtgy.github.io/L1_delivery_deck/
- **Repository:** https://github.com/STRTGY/L1_delivery_deck

## Testing

To test locally before deploying:

```bash
cd deck_entrega
python -m http.server 8000
# Open http://localhost:8000/ in browser
```

All assets should load correctly with no 404 errors in the console.
