# Design System Specification: Tactical Command & Control

## 1. Overview & Creative North Star: "The Kinetic Ledger"
The North Star for this design system is **"The Kinetic Ledger."** It represents a fusion of high-density data integrity (The Ledger) and rapid-response urgency (Kinetic). 

While most modern interfaces prioritize "friendliness" through rounded corners and soft shadows, this system embraces **Editorial Brutalism**. We use sharp, zero-radius edges and aggressive typography to convey authority and precision. The "Tactical Glass" layer adds a sophisticated depth—making the UI feel like a high-end heads-up display (HUD) projected onto a sleek, dark substrate. This is a mission-critical environment where every pixel must earn its place.

### Design Principles
*   **Absolute Zero:** No rounded corners. Hard edges signify structural integrity and mathematical precision.
*   **Information Density as a Feature:** Don't fear "busy" layouts. Organize high-velocity data through strict alignment and tonal layering.
*   **Intentional Asymmetry:** Break the grid for mission-critical alerts to force eye movement to SOS events.
*   **Tactical Glow:** Use light as a functional signal, not just decoration.

---

## 2. Colors & Surface Logic

### The Palette
We utilize a high-contrast palette against a "Void Black" foundation. 
*   **Background (Void Black):** `#030509` (Primary substrate)
*   **Primary / SOS (Orange-Red):** `#FF3C00` (Urgency, critical action)
*   **Safe / Online (Emerald):** `#00E676` (System health, confirmed status)
*   **AI / Detection (Purple):** `#9333EA` (Augmented intelligence, pattern recognition)
*   **Warning (Amber):** `#F59E0B` (Pre-critical states, caution)

### Surface Hierarchy & The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for structural sectioning. Instead, we define boundaries through **Tonal Layering**:
*   **Surface-Container-Lowest:** Use for the most recessed areas (e.g., secondary data panels).
*   **Surface-Container-High:** Use for active command modules.
*   **The Glass Rule:** For floating HUD elements, use `rgba(16, 20, 25, 0.8)` with a `20px` backdrop-blur. This "frosted glass" effect prevents the UI from feeling flat and adds a "military-grade hardware" texture.

### Signature Textures
Apply a subtle linear gradient to main SOS CTAs: `linear-gradient(180deg, #FF3C00 0%, #93000A 100%)`. This adds a "physical" presence to buttons that flat colors lack.

---

## 3. Typography: The Hierarchy of Data

We utilize three distinct typefaces to separate human-readable narrative from machine-generated data.

*   **Titles & Headlines (Space Grotesk Bold):** Our "Editorial" voice. Used for high-level module names and critical alerts. It feels technical yet avant-garde.
*   **Body & Interface (Inter):** The "General" voice. Used for labels, instructions, and descriptions. Provides maximum legibility during high-stress operations.
*   **Data & Numbers (JetBrains Mono):** The "Machine" voice. **Every** numerical value, timestamp, or coordinate must use JetBrains Mono. Monospacing ensures that shifting data values don't cause layout "jitter."

---

## 4. Elevation & Depth: Tonal Layering

In this design system, "Up" is signaled by light and transparency, not shadows.

*   **The Layering Principle:** To lift a card off the background, shift the background color from `surface` (#101419) to `surface-container-low` (#181C21). 
*   **The Ghost Border:** For accessibility in high-density areas, use a `1px` border of `rgba(255, 60, 0, 0.15)`. This creates a "faint wireframe" look reminiscent of tactical blueprints.
*   **Tactical Glow:** For SOS/Critical states, apply an outer glow using the accent color: `box-shadow: 0 0 15px rgba(255, 60, 0, 0.4)`. This is the *only* time a shadow is permitted.

---

## 5. Components

### Buttons (Tactical Trigger)
*   **Primary (SOS):** Zero radius, Orange-Red background, white text (Inter Bold). High-contrast.
*   **Secondary (Ghost):** Zero radius, `rgba(255, 60, 0, 0.15)` border, no fill.
*   **Interaction:** On hover, the "Ghost Border" should increase opacity to 100%.

### Segmented Progress Bars (The "System Load" Look)
Do not use smooth, continuous loading bars. Use segmented blocks (e.g., 10 individual rectangles). 
*   **Inactive segments:** `surface-container-highest`
*   **Active segments:** Use the relevant Accent Token (Emerald for safe, Orange-Red for critical).

### Input Fields (Command Entry)
*   **Style:** Underline-only or Ghost Border. 
*   **Focus State:** The entire field container gains a subtle Purple (#9333EA) glow if AI-assisted, or Orange-Red if manual. 
*   **Text:** All numerical input must default to JetBrains Mono.

### Cards & Lists
*   **Separation:** Prohibit the use of divider lines. Separate list items using a `4px` vertical gap and a slight background shift between even/odd rows (Zebra striping using `surface-container-lowest`).

### Tactical HUD Tooltips
*   **Style:** `Void Black` background, `100%` opacity, with a `1px` Orange-Red left-edge accent. No shadows; use backdrop-blur on the parent container.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** align every element to a strict 4px/8px grid.
*   **Do** use "Data Density." If there is empty space, consider adding tactical metadata (lat/long, system uptime, operator ID).
*   **Do** use uppercase for all `label-sm` and `label-md` typography to enhance the "Official Document" feel.

### Don't:
*   **Don't** use border-radius. Ever. If a library defaults to `4px`, override it to `0px`.
*   **Don't** use "Blue" for anything other than standard links. In a tactical environment, Blue is often "Friendly," but here, Emerald Green is our "Safe" state.
*   **Don't** use soft drop shadows. Use tonal shifts or glows.
*   **Don't** use "fluff" icons. Every icon must be a functional representation of a data state.