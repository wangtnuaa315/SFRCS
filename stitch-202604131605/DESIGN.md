# Design System Document: Tactical Command & Editorial Brutalism

## 1. Overview & Creative North Star: "The Kinetic Intelligence"
This design system is engineered for the high-stakes environment of Fire Rescue Command. Our Creative North Star is **"The Kinetic Intelligence"**—a visual language that treats data as a live, breathing asset. 

We are moving away from the "clunky dashboard" trope. Instead, we are merging the aggressive, raw structuralism of **Editorial Brutalism** with the precision of a **Military HUD**. The layout is intentionally dense and asymmetric, favoring technical utility over decorative whitespace. By utilizing high-contrast typography and tactical glassmorphism, we create a UI that feels like an advanced optics system overlaying a chaotic reality. 

**Key Design Pillars:**
*   **Zero-Radius Geometry:** No rounded corners. Ever. The world of rescue is sharp and decisive; the UI must reflect that.
*   **OLED Depth:** Utilizing `#030509` (Void Black) to ensure critical data "pops" with emissive brilliance.
*   **Monospaced Authority:** Data is not just information; it is a coordinate. Monospaced type ensures vertical alignment and a "machine-read" aesthetic.

---

## 2. Colors & Surface Logic

### The Palette
The color roles are strictly functional, tied to the urgency of fire rescue operations.

*   **Primary (Critical/SOS):** `#FF3C00` (Neon Orange). Use for active fires, structural collapses, and life-safety alerts.
*   **Secondary (Active/Safe):** `#00E676` (Radioactive Green). Use for stabilized zones, active personnel, and clear pathways.
*   **Tertiary (AI/Analysis):** `#9333EA` (Cyber Purple). Reserved for predictive heat mapping, drone flight paths, and sensor data.
*   **Neutral (Slate-800):** `#1E293B`. Used exclusively for ultra-thin "Ghost Borders."

### Surface Hierarchy & The "No-Line" Rule
Traditional 1px solid borders are prohibited for sectioning. Boundaries are defined through **Tonal Layering**:
1.  **Level 0 (Base):** `surface-dim` (`#101419`). The "Void."
2.  **Level 1 (Panels):** `surface-container-low` (`#181c21`) at 70% opacity with a 12px backdrop-blur.
3.  **Level 2 (Active Modules):** `surface-container-high` (`#272a30`). Used to highlight a focused drone feed or a specific fire sector.

**The Glass & Gradient Rule:**
Floating HUD elements must use tactical glassmorphism. Apply `surface-variant` with a 40% alpha and a `backdrop-filter: blur(12px)`. To give CTAs "soul," use a linear gradient from `primary` (#FF3C00) to `primary-container` (#FF562D) at a 45-degree angle.

---

## 3. Typography: Monospaced Precision
The type system prioritizes legibility under duress. We pair the technical rigidity of **JetBrains Mono** with the clarity of **Inter** for secondary Chinese/English descriptors.

*   **Display (Data Metrics):** `Space Grotesk`, Bold, All Caps. Used for large-scale casualty counts or temperature readings.
*   **Headline (Section IDs):** `Space Grotesk`. Example: `[01_南部战区_指挥]`
*   **Technical Data:** `JetBrains Mono`. Used for all GPS coordinates, timestamps, and unit IDs. 
*   **Body (Operational Notes):** `Inter`. Used for longer Chinese text blocks, incident descriptions, and dispatch logs.

**Scale Highlight:**
*   `label-sm`: 0.6875rem (JetBrains Mono). This is the "HUD Micro-copy" used for labeling axes and sensor metadata.

---

## 4. Elevation & Depth: The Layering Principle

We reject drop shadows in favor of **Ambient Glow** and **Subtle Tonal Shifts**.

*   **Stacking:** To "lift" a component, move it from `surface-container-lowest` to `surface-container-highest`. 
*   **Ghost Borders:** When a container needs a hard edge (e.g., a map overlay), use the `outline-variant` (`#5E3F38`) at 15% opacity. It should be felt, not seen.
*   **Tactical Glow:** Critical elements (Neon Orange) may use a subtle outer glow: `0 0 12px rgba(255, 60, 0, 0.3)`. This mimics the emissive light of a cockpit display.

---

## 5. Components

### Buttons
*   **Primary (Urgent Action):** Sharp 0px corners. Background: `primary` (#FF3C00). Text: `on-primary` (#621100). No border.
*   **Secondary (Standard):** 1px `outline-variant` border. Background: Transparent. Hover state: Fill with `surface-bright` at 10% opacity.

### Input Fields
*   **Technical Input:** Background: `surface-container-lowest`. Bottom-only border (1px) in `outline`. Use `JetBrains Mono` for all numeric input.
*   **Error State:** Border shifts to `error` (#FFB4AB). Label flashes `error`.

### Cards & Lists
*   **Forbid Dividers:** Do not use horizontal lines to separate list items. Use a 4px vertical gap and alternate background tints between `surface-container-low` and `surface-container-lowest`.
*   **Status Chips:** Rectangular, no rounding. `secondary` (#00E676) background with `on-secondary` text for "STABLE."

### Specialized HUD Components
*   **Crosshair Overlays:** 0.5px `Slate-800` lines used at the corners of video feeds to reinforce the "Tactical" aesthetic.
*   **Data Scanners:** Progress bars should be segmented (brutalism) rather than smooth fills, showing individual blocks of data processing.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use intentional asymmetry. A sidebar that is 314px wide is better than a standard 300px if it fits the data density.
*   **Do** use Chinese characters as structural elements. Treat large Simplified Chinese glyphs as part of the "Brutalist" background.
*   **Do** maintain a "High-Contrast" ratio for all technical readouts to ensure visibility in smoky or high-glare environments.

### Don't:
*   **Don't** use any border-radius. Even a 2px radius destroys the "Tactical" soul of this system.
*   **Don't** use generic icons. Every icon should look like a technical schematic or a vector coordinate.
*   **Don't** use soft "Pastel" colors. If it's not OLED-dark or Neon-bright, it doesn't belong in the Command Dashboard.
*   **Don't** use standard animations. Use "Glitch" transitions or "Frame-by-Frame" stepped reveals to mimic hardware-accelerated HUDs.