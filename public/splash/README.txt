SPLASH LAYER ASSETS — REQUIRED FOR CINEMATIC SCROLL EXPERIENCE
================================================================
Place these files in this directory:

  layer-bg.avif        — Runway background (opaque), <300KB
  layer-mid.png        — Midground with alpha transparency, <400KB
  layer-model.png      — Featured model/dress with alpha, <500KB
  layer-foreground.png — Close foreground elements with alpha, <200KB
  fallback.avif        — Single composite image for reduced-motion fallback, <400KB
  fallback.webp        — WebP fallback for the above
  fallback.jpg         — JPEG fallback (no-JS safety)

TOTAL BUDGET: under 2MB

UNTIL ASSETS ARRIVE: The app launches with SplashFallback (static editorial photo).
The GSAP cinematic scroll-through activates automatically once layer-bg.avif is present.

TIP: You can generate layered PNGs with alpha using Photoshop, Figma (export frames),
or AI image generation (generate subject on transparent background).
