# Gardenerim 2.1 design language

This release applies one visual and interaction contract to the 506-component catalog instead of treating each component pack as an isolated stylesheet.

## Reference principles

- Arco Design: compact 24/28/32/36 px controls, quiet neutral surfaces, clear selected rows, restrained elevation, and top-centered transient feedback.
- Ant Design: explicit information hierarchy, predictable data-entry feedback, task-oriented navigation, and layered feedback based on urgency.
- Element Plus: practical size and state APIs, dense data-display patterns, and usable dialog, table, form, and empty-state defaults.

The implementation is original Gardenerim CSS. References define quality targets rather than copied markup or selectors.

## Shared contract

| Concern | Contract |
| --- | --- |
| Control size | `mini`, `small`, `medium`, `large` map to 24, 28, 32, and 36 px by default. |
| Interaction | Hover, active, focus-visible, selected, disabled, read-only, and loading use shared timing, focus, and cursor semantics. |
| Feedback | Success, warning, danger/error, and info reuse the same semantic token family across controls, alerts, progress, tags, rows, and overlays. |
| Surfaces | Base, subtle, raised, sunken, popup, and dialog surfaces share border and elevation tokens and adapt to every theme axis. |
| Density | Tables, lists, menus, forms, and navigation preserve compact defaults while offering comfortable/relaxed or touch-friendly variants. |
| Responsive behavior | Narrow screens keep controls operable, make dense tables scroll or stack explicitly, and bound popup surfaces to the viewport. |
| Accessibility | Visible keyboard focus, semantic disabled states, forced-colors support, increased-contrast support, and minimum target sizing are part of the base language. |

## Component coverage

- Basic: button and button group, card, badge/tag/chip, avatar, alert, progress, spinner, skeleton, divider, and empty state.
- Forms: input, textarea, select, affix controls, validation feedback, checkbox/radio, switch, range, inline and responsive forms.
- Navigation: menu, tabs, segmented control, pagination, stepper, breadcrumb, and command navigation.
- Data: table, managed data grid, list, description list, tree, timeline, KPI, and responsive data states.
- Feedback and overlays: toast, dialog, drawer, popover, tooltip, accordion, loading, confirmation, and viewport-safe overlay surfaces.
- Extended interaction: calendar/date/time picker, transfer, kanban, gantt, carousel, gallery, media, split pane, and commerce cards.
- Business compositions: shared hover, selection, focus, destructive, disabled, surface, and mobile contracts cover AI, auth, commerce, CMS, desktop, help, mobile, solution, and workflow packs.

## Release verification

The release build validates 42 themes, 28 component packs, 5 platform profiles, 72 runtime behaviors, 79 event contracts, and the full 506-component catalog. Vue, React, AngularJS, and Blazor adapters are generated from the same metadata so variant and state APIs remain aligned.
