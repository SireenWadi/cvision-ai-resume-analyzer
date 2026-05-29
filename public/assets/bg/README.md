# CVision AI — Background Image Assets
=======================================

Place these 8 images in this folder: `/public/assets/bg/`

The CSS classes in `app/globals.css` reference them via:
  `url('/assets/bg/<filename>')`

─────────────────────────────────────────────────────────
FILE NAME                 USED IN               DESCRIPTION
─────────────────────────────────────────────────────────
bg-body-space.jpg         <body> (global)        Deep space / nebula dark texture.
                                                 Applied site-wide via body CSS.
                                                 background-attachment: fixed
                                                 Creates ambient parallax effect.

bg-hero-grid.jpg          Hero section           High-tech abstract circuit board
                                                 or network topology grid image.
                                                 Blended under a dark gradient
                                                 overlay — only hints of grid
                                                 lines should be visible.

bg-auth-glass.jpg         Login & Register       Dark holographic / fractured
                          page wrappers          glass or abstract crystal texture.
                                                 The glassmorphism card (blur:28px)
                                                 on top will reveal it beautifully.

bg-features-mesh.jpg      Features section       Dark geometric gradient mesh /
                          Stats section          abstract parametric surface.
                                                 Very subtle — almost invisible.

bg-dashboard-cyber.jpg    Dashboard page         Dark cybernetic HUD / data-grid
                          Results page           wireframe. Used for main app
                          Sidebar panel          experience pages.

bg-upload-circuit.jpg     Upload page            Dark PCB / circuit board
                                                 wireframe abstract. Reinforces
                                                 the "scanning document" vibe.

bg-cta-pulse.jpg          CTA section            Dark radial energy burst / neon
                          Pricing section        pulse abstract. Adds energy to
                                                 the conversion sections.

bg-testimonials-dark.jpg  Testimonials section   Dark frosted bokeh / abstract
                                                 dark blur / deep space variant.
─────────────────────────────────────────────────────────

IMAGE REQUIREMENTS
──────────────────
• Format:      JPEG preferred (smaller file size), PNG acceptable
• Resolution:  Minimum 1920×1080 px, ideally 2560×1440 px
• Color:       Dark dominant — no bright whites or light backgrounds
• Style:       Abstract/tech/ambient — no photos of people
• File size:   Optimize to under 400KB each (use tools like Squoosh)

WHERE TO FIND SUITABLE IMAGES (Free)
─────────────────────────────────────
• Unsplash.com → search: "dark abstract tech", "circuit board dark",
                          "space nebula dark", "holographic dark",
                          "cyber grid dark", "mesh gradient dark"
• Pexels.com   → same search terms
• Freepik.com  → "dark cyberpunk background", "dark mesh abstract"
• Pixabay.com  → "dark tech abstract"

CSS BLEND MODES USED
─────────────────────
All bg classes in globals.css use this layering pattern:

  background-image:
    linear-gradient(rgba overlay),   ← dark overlay for readability
    url('/assets/bg/<image>.jpg');    ← the actual image behind

The overlay opacity controls how much of the image shows through:
  • 0.90–0.96 = barely visible (features, sidebar)
  • 0.80–0.90 = subtle visible (hero, dashboard, auth)
  • 0.75–0.85 = more visible (testimonials, CTA)

You can tune these values in globals.css to match your actual images.

TESTING TIPS
────────────
1. Add images one at a time and preview each section.
2. If an image is too bright, increase the overlay opacity.
3. If too dark/invisible, decrease the overlay opacity.
4. The animated grid overlay (CSS only) in Hero & Upload
   adds extra depth even before images are placed.
