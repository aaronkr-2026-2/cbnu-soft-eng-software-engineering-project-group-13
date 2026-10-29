# AI_LOG.md

Every time you update your project, please make a note of what you did in the `AI_LOG.md` file, according to the following template.

---

### [Added Note Taking Feature] — [30 September, 2026]

- _Tool(s) used:_ Gemini
- _What I asked for:_ Guidance and code to persist note data in `localStorage`.
- _What I kept as-is:_ The core logic for saving, retrieving, and updating notes in `localStorage`.
- _What I changed or rejected, and why:_ Removed the AI given styling to match my project's UI design, and removed extra features like image attachments that were outside the scope of my feature.
- _Something the AI got wrong that I had to catch:_ It didn't handle null checks when `localStorage` is empty on first load, which threw a runtime error during initialization.

### [Made Note App Responsive] — [8 October, 2026]

- _Tool(s) used:_ Gemini
- _What I asked for:_ Assistance and CSS/Tailwind layout tweaks to make the note application fully responsive across desktop, tablet, and mobile screen sizes.
- _What I kept as-is:_ The responsive grid and flexbox layout structure for adapting the sidebar, note list, and editor components.
- _What I changed or rejected, and why:_ Custom-tuned padding, breakpoint thresholds, and mobile navigation toggles to seamlessly match the existing UI design.
- _Something the AI got wrong that I had to catch:_ It caused layout overflow on smaller viewports due to fixed widths on the note editor container, requiring min-width and flex-shrink adjustments.

---
