# Kinetix Pro Studio — Complete Catalog, Animated Gallery, Inspector & 1080p Export Plan

## 1. Executive Summary & Architectural Goals

This plan upgrades **Kinetix Studio** into a production-ready, zero-lag social media motion graphics editor that surpasses reference studio workflows in visual polish, motion precision, and export fidelity:

1. **Complete 70-Template Kinetix Pro Catalog across 9 Categories**: Expand the motion preset library and formation engine to cover all **70 templates** across the exact 9 categories shown in the reference screenshots (`3D & Perspective · 12`, `Multiscene · 14`, `Isometric · 3`, `Orbit · 8`, `Carousel & Flow · 10`, `Grid · 8`, `Spotlight & Focus · 4`, `Reveal & Wipe · 4`, `Stack & Scatter · 7`), crafted with Kinetix Pro naming, distinct mathematical choreographies, and zero overlapping/skewed jitter.
2. **Zero-Lag Animated Schematic Mini-Previews**: Every template card in the Left Gallery features a **subtle continuous GPU-composited CSS keyframe loop** (`transform`, `opacity` only) that accelerates smoothly on hover or active selection—giving users instant visual clarity of how each template moves without impacting main-thread FPS.
3. **Redesigned `Layers` & `Media` Inspector UI (`LeftGalleryPanel.tsx`)**: Overhaul the `Layers` tab to eliminate overlapping badges/buttons, matching the clean segmented hierarchy, spacing, and card structure of the Right Inspector panel.
4. **100% Functional Right Inspector, TopBar & Timeline Controls**:
   - **Background Studio (`Colour` | `Gradient` | `Image`)**:
     - **Gradient Mode**: 12 curated Premade Studio Gradients (1-click apply) + Custom Gradient Builder (angle slider, dual color pickers, radial/linear toggle).
     - **Image Mode**: 8 curated studio backdrop presets + custom image upload + **Background Blur (`0px–40px`)** and **Backdrop Dim/Opacity (`0%–90%`)** sliders.
   - **Universal `Position` Sliders**: Wire all 8 spatial sliders (`Padding`, `Corner radius`, `Horizon / Ring tilt`, `Ring opening`, `Ring size`, `Card size`, `Back fade`, `Perspective`) plus `Card ratio` (`16:9`, `4:3`, `1:1`, `3:4`, `9:16`) and `Shadow` so they dynamically control every template across all 9 categories.
5. **Social-Media-Ready 1080p Full-Duration Video Export (`videoExporter.ts` & `ExportModal.tsx`)**:
   - Fix the 0.1s MP4 bug by replacing the fixed 48-tick loop with a **real-time duration-accurate frame scheduler** supporting **Scene Loop Duration (`5s`, `10s`, `15s`, or custom scene length)** at **30 FPS / 60 FPS** up to **Full HD 1080p** (`1080×1920`, `1920×1080`, `1080×1080`, `1080×1350`).
   - Guarantee **100% visual parity** between the live canvas stage and exported video (including linear/radial gradients, background images with blur & dim scrim, custom card aspect ratios, 3D foreshortening, card shadows, logo watermarks, and kinetic typography).

---

## 2. Complete 70-Template Catalog & Mathematical Choreography (`src/engine/presets.ts` & `src/engine/motionEngine.ts`)

We will implement a parameterized procedural choreography engine (`computeTemplateSlotTransforms`) supporting all **70 templates** grouped into the **9 categories**:

| Category | Count | Kinetix Pro Templates (with Kinetix Pro Titles & Reference Mapping) |
| :--- | :---: | :--- |
| **3D & PERSPECTIVE** | **12** | 1. `Orbital Ring` *(Showcase Ring)* · 2. `Dome Matrix` *(Sphere Wall)* · 3. `Geodesic Sphere` *(Card Globe)* · 4. `Core Cluster` *(Orbit Globe)* · 5. `Meridian Cascade` *(Sphere Cascade)* · 6. `Monolith Wall` *(Totem Wall)* · 7. `Depth Pillars` *(Parallax Totem)* · 8. `Infinity Corridor` *(Card Tunnel)* · 9. `Helix Ribbon` *(Spiral Stream)* · 10. `Z-Space Drift` *(Depth Stack)* · 11. `Panoramic Ring H` *(Cover Ring)* · 12. `Panoramic Ring V` *(Cover Ring V)* |
| **MULTISCENE** | **14** | 13. `Aero Rolodex` *(Flyby Rolodex · NEW)* · 14. `Petal Belt` *(Bloom Belt · NEW)* · 15. `Aperture Orbit` *(Lens Orbit · NEW)* · 16. `Stepped Ascent` *(Stairway · NEW)* · 17. `Matrix Plunge` *(Grid Dive · NEW)* · 18. `Kinetic Parade` *(Pop Parade · NEW)* · 19. `Triptych Stage` *(Triple Scene)* · 20. `Editorial Montage` *(Collage Reel)* · 21. `Deck Fanning` *(Fan Shuffle · NEW)* · 22. `sweeping Halo` *(Sweep Ring · NEW)* · 23. `Radial Dial` *(Scatter Dial · NEW)* · 24. `Macro Split Zoom` *(Grid Zoom)* · 25. `Horizontal Strata` *(Spread Rows)* · 26. `Vertical Columns` *(Spread Columns)* |
| **ISOMETRIC** | **3** | 27. `Iso Domino Cascade` *(Iso Cascade)* · 28. `Iso Spotlight Deck` *(Iso Focus)* · 29. `Iso Tabletop Orbit` *(Iso Orbit)* |
| **ORBIT** | **8** | 30. `Crown Carousel` *(Orbit Showcase)* · 31. `Starburst Bloom` *(Orbit Bloom)* · 32. `Panoramic Belt` *(Orbit Carousel)* · 33. `Aperture Ring` *(Photo Orbit)* · 34. `Chrono Ring` *(Focus Orbit)* · 35. `Turbine Vortex` *(Vortex Spin)* · 36. `Ferris Wheel` *(Wheel Spin)* · 37. `Horizon Arc` *(Wheel Spin Arc)* |
| **CAROUSEL & FLOW** | **10** | 38. `Vertical Totem` *(Card Totem)* · 39. `Cinema Strip` *(Film Strip)* · 40. `Paddle Wheel` *(Wheel Carousel)* · 41. `Studio Coverflow H` *(Cover Flow)* · 42. `Studio Coverflow V` *(Cover Flow V)* · 43. `Asymmetric Glide` *(Carousel Flow)* · 44. `Echelon Cascade` *(Diagonal Cascade)* · 45. `Hero Slider` *(Focus Slider)* · 46. `Bento Marquee` *(Mosaic Marquee)* · 47. `Ribbon Showreel` *(Hero Reel)* |
| **GRID** | **8** | 48. `Bento Reveal` *(Grid Reveal)* · 49. `Macro Cell Zoom` *(Spotlight Zoom)* · 50. `Kinetic Flip Grid` *(Flip Grid)* · 51. `Harmonic Pop Grid` *(Pop Grid)* · 52. `Slanted Ticker` *(Ticker Loop)* · 53. `Perspective Masonry` *(Ticker Tilt)* · 54. `Parallax Columns` *(Column Drift)* · 55. `Social Feed Scroll` *(Feed Scroll · NEW)* |
| **SPOTLIGHT & FOCUS** | **4** | 56. `Solo Monolith` *(Center Stage)* · 57. `Sidebar Dock Shift` *(Focus Shift)* · 58. `Top-Card Peel` *(Deck Peel)* · 59. `Depth Breath Zoom` *(Zoom Parallax)* |
| **REVEAL & WIPE** | **4** | 60. `Razor Diagonal Wipe` *(Diagonal Wipe)* · 61. `Venetian Louver Reveal` *(Stripe Reveal)* · 62. `Dual Curtain Split` *(Split Reveal)* · 63. `Tile Shutter Wipe` *(Mosaic Wipe)* |
| **STACK & SCATTER** | **7** | 64. `Layered Deck Slide` *(Stack Slide)* · 65. `Gravity Stack Drop` *(Cascade Drop)* · 66. `Stepped Trail` *(Cascade Diagonal)* · 67. `Echo Motion Trail` *(Image Trail)* · 68. `Centrifugal Burst` *(Poster Burst)* · 69. `Physics Table Toss` *(Card Toss)* · 70. `Modular Bento Dance` *(Position Dance)* |

---

## 3. Lightweight Animated Schematic Thumbnails (`LeftGalleryPanel.tsx` & `src/index.css`)

- **Schematic Geometry Engine**: Each template card renders a crisp monochrome dark-slate schematic preview (`#16161B` surface with `#4B4E58` to `#9CA3AF` geometric cards) matching the visual language of the 8 reference screenshots.
- **Compositor-Only CSS Keyframe Loops**:
  - Define 9 lightweight `@keyframes` families in `src/index.css` (`kinetix-orbit-ring`, `kinetix-sphere-wave`, `kinetix-iso-slide`, `kinetix-vortex-spin`, `kinetix-carousel-glide`, `kinetix-grid-pulse`, `kinetix-spotlight-shift`, `kinetix-wipe-sweep`, `kinetix-stack-peel`) that animate only `transform` and `opacity`.
  - **Default State**: Plays a calm, continuous 6-second cycle (`animation-duration: 6s`) with `content-visibility: auto` so off-screen categories consume zero GPU/CPU cycles.
  - **Hover / Active State**: Smoothly speeds up (`animation-duration: 2.2s`) and highlights the active card elements.

---

## 4. Redesigned `Layers` Tab & Complete Right Inspector (`LeftGalleryPanel.tsx` & `RightInspectorPanel.tsx`)

### A. Clean `Layers` Tab Architecture (`LeftGalleryPanel.tsx`)
- Replace the cramped single-row pill layout with a **2-tier Inspector Card Row** matching `RightInspectorPanel`:
  - **Row 1**: Drag-order index badge, layer type icon (`Image`, `Text`, `Shape`), clean single-line truncated title (`font-medium text-xs`), and right-aligned action icons (`Move Up`, `Move Down`, `Visible`, `Lock`, `Delete`) with proper `28×28px` hit targets and zero overlap.
  - **Row 2**: Compact timeline bar preview showing `startTime` to `endTime` span + quick entrance/exit preset badge.

### B. Background Studio: `Colour` | `Gradient` | `Image` (`RightInspectorPanel.tsx`)
- **Extend `SceneConfig` in `motionEngine.ts`**:
  - Add `backgroundGradientPreset?: string`, `backgroundGradientAngle?: number` (`0–360°`), `backgroundGradientType?: 'linear' | 'radial'`, `backgroundBlur?: number` (`0–40px`), and `backgroundDim?: number` (`0–90%`).
- **`Gradient` Tab UI**:
  - **Premade Studio Gradients Grid (12 Swatches)**: `Obsidian Night`, `Cobalt Pulse`, `Violet Velvet`, `Emerald Cyber`, `Sunset Ember`, `Titanium Mist`, `Crimson Noir`, `Deep Ocean`, `Gold Luxe`, `Arctic Aurora`, `Magenta Dusk`, `Carbon Monolith`.
  - **Custom Gradient Controls**: Start Color picker (`backgroundColor`), End Color picker (`backgroundSecondaryColor`), Linear/Radial switch, and Angle slider (`0°–360°`).
- **`Image` Tab UI**:
  - **Curated Studio Backdrops (8 Swatches)**: Dark architectural concrete, soft studio cyclorama, neon bokeh blur, abstract brushed metal, dark linen grain, warm atmospheric dusk, minimal grid mesh, deep cosmic dust (rendered via resilient SVG/Canvas data URLs + local assets so they never break offline or taint canvas exports).
  - **Upload Custom Backdrop**: File picker (`accept="image/*"`) + Clear button.
  - **Backdrop Optics Sliders**: `Blur` (`0px` to `40px`) and `Dim Overlay` (`0%` to `85%`).

### C. Universal `Position` & `Timing` Controls
- Update `computeFormationSlotTransforms` so **all 8 Position sliders** (`Padding`, `Corner radius`, `Horizon / Ring tilt`, `Ring opening`, `Ring size`, `Card size`, `Back fade`, `Perspective`) and `Card ratio` (`16:9`, `4:3`, `1:1`, `3:4`, `9:16`) mathematically modulate every single template category.
- Ensure `CenterCanvasViewport.tsx` applies `pos.padding` as a safe-frame scale factor on the formation container so cards never clip unintentionally while keeping full 3D depth.

---

## 5. Social-Media-Ready 1080p Video Export Engine (`src/engine/videoExporter.ts` & `src/components/ExportModal.tsx`)

### A. Root Cause Fix for 0.1s MP4 Duration
- `canvas.captureStream(fps)` paired with `MediaRecorder` records **real wall-clock time**. Previously, running 48 ticks at `18ms` only spanned ~0.8 seconds of wall-clock time (and browsers only emitted 1 keyframe chunk, resulting in a 0.1s–0.5s file).
- **Solution**:
  1. Add an explicit **Export Duration Selector** in `ExportModal.tsx`: **Match Scene Loop (`scene.duration`s)**, **5s Social Clip**, **10s Standard Reel**, or **15s Extended Story**, plus **Resolution Selector** (`1080p Full HD`, `720p Fast HD`) and **Frame Rate** (`30 FPS`, `60 FPS`).
  2. Use a precision **wall-clock synchronized `requestAnimationFrame` / high-precision timer loop** during `MediaRecorder` capture that steps `time = elapsedSeconds % scene.duration`, requests frames on the capture track (`track.requestFrame()` where supported), and records for the exact target duration with a live progress bar (`Elapsed / Total Seconds`, `Current Frame / Total Frames`, and `Cancel Export` button).
  3. **100% Visual Parity in `renderSceneFrameToCanvas`**:
     - Render `Colour`, `Linear/Radial Gradient` (at exact `backgroundGradientAngle`), or `Background Image` (with canvas filter `blur(Npx)` and dim overlay).
     - Render all 70 template formations using the exact same `computeFormationSlotTransforms(scene, time)` output, applying `cardRatio` dimensions, 3D perspective foreshortening (`rotateX`, `rotateY`, `z`), `cornerRadius`, `backFade`, and `shadow` elevation.
     - Render custom `Text`, `Logo`, and `Overlay` layers on top.

---

## 6. Verification & Acceptance Plan

1. **Automated Unit Tests (`src/engine/motionEngine.test.ts`)**:
   - Verify all 70 templates across the 9 categories exist, have unique IDs, valid category counts (`12, 14, 3, 8, 10, 8, 4, 4, 7`), and return finite, non-NaN transforms across `t = 0..duration`.
   - Verify all 8 `PositionSettings` sliders (`padding`, `cornerRadius`, `ringTilt`, `ringOpening`, `ringSize`, `cardSize`, `backFade`, `perspective`) produce measurable transform deltas across every category.
2. **Build & Lint Verification**:
   - Run `compile_applet` and `lint_applet` with zero TypeScript or ESLint errors.
3. **Interactive Browser Verification (`playwright-cli`)**:
   - Inspect all 9 collapsible template categories and verify the animated mini-previews run smoothly at 60fps.
   - Switch to the `Layers` tab and verify clean inspector-grade rows with zero overlapping elements.
   - Test `Background -> Gradient` (premade swatches + custom angle/colors) and `Background -> Image` (studio presets + custom upload + blur/dim sliders) and verify live reflection on the center stage.
   - Open `ExportModal`, test 1080p MP4/WebM export with duration presets, and verify the exported video blob size and duration.
