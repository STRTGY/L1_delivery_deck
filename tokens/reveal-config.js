/**
 * STRTGY RevealJS Configuration — Lugon ZMM Starter Deck
 * 
 * Only overrides navigation. Viewport (960x700), margin, transitions,
 * scaling, and autoAnimate all use Reveal.js defaults.
 * See: https://revealjs.com/config/
 */

const STRTGY_REVEAL_CONFIG = {
    // --- Navigation enhancements (the ONLY overrides) ---
    hash: true,
    history: true,
    slideNumber: "c/t",
    showSlideNumber: "speaker",

    // --- Everything else inherits Reveal.js defaults ---
    // width: 960,    height: 700     (default — do NOT override)
    // margin: 0.04                   (default — do NOT override)
    // transition: "slide"            (default)
    // minScale: 0.2, maxScale: 2.0   (default)
};

// Usage: Reveal.initialize({ ...STRTGY_REVEAL_CONFIG, plugins: [...] });
