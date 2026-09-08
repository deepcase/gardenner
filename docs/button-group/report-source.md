# Button Group deep-research source report

Status: canonical internal research record  
Checked: 2026-09-04  
Scope: Gardenerim 2.1 Button Group visual system, component contract, accessibility semantics, framework parity, and showcase completeness.

## Decision summary

The previous Gardenerim Button Group was not merely under-demonstrated. It had two independent gaps:

1. The dedicated catalog page was routed through the generic CSS-component renderer, so it rendered a single placeholder instead of child buttons.
2. The implementation only covered horizontal edge joining plus group-level button type, size, shape, status, and disabled styling. It did not define vertical, full-width/justified, split-button, toggle-button, or toolbar patterns, nor their structural and accessibility contracts.

## Pattern taxonomy adopted

| Pattern | Purpose | Container semantics | Required details |
| --- | --- | --- | --- |
| Plain button group | Related peer commands | `role="group"` with accessible name | Collapsed borders, end radii, focus seam handling |
| Split button | Primary command plus menu of related alternatives | Named group; trigger uses `aria-haspopup="menu"` and `aria-expanded` | Square trigger, separate hit area, dropdown owned by menu component |
| Button toolbar | Three or more frequently used controls, often arranged as groups | `role="toolbar"`, accessible name | Roving tabindex and directional keyboard navigation when toolbar semantics are used |
| Toggle button group | Independent on/off commands | Named group; each toggle uses `aria-pressed` | Stable label, persistent selected appearance |
| Exclusive choice | One value from a set | Radio group or segmented control | Explicitly not modeled as a plain Button Group |

## Official-source findings

- Arco Design Vue demonstrates `a-button-group` for peer actions, publish-plus-more compositions, previous/next actions, icon-only groups, group-level type, status, shape, size, and disabled appearance.
- Ant Design 6 uses `Space.Compact` as the generalized border-collapsing primitive. It supports horizontal and vertical orientation, block width, and group-level size for buttons and several form controls. Dropdown owns menu behavior.
- Element Plus Button Group documents grouping similar operations and supports horizontal/vertical direction. Element Plus Dropdown separately provides `split-button`, where the left region performs the command and the right region opens the menu.
- Bootstrap 5.3 treats horizontal, vertical, mixed-style, outlined, sizing, nested-dropdown, toggle, and toolbar compositions as first-class examples. It explicitly requires `role="group"`/`role="toolbar"` and an accessible label.
- WAI-ARIA APG differentiates ordinary buttons, toggle buttons (`aria-pressed`), menu buttons (`aria-haspopup`), and toolbars. Toolbar semantics imply directional navigation and are recommended for three or more controls.

## Gardenerim implementation decisions

- Preserve `GButtonGroup` as a CSS-first composition; adapters continue to forward native/ARIA attributes rather than inventing framework-specific events.
- Add `vertical`, `block`, `justified`, `split`, and `toggle` variants.
- Add structural parts for the split primary action and trigger, plus toolbar layout utilities.
- Keep dropdown popup state and menu interaction in the Dropdown/Menu layer. The `split` variant is deliberately visual and semantic scaffolding only.
- Keep exclusive selection in Segmented or Radio Group. Toggle Button Group is only for independent boolean states.
- Use logical CSS properties for RTL-safe horizontal seams and a dedicated vertical seam model.
- Keep compact groups non-wrapping; wrapping breaks the visual attachment model. Use `.g-btn-toolbar` when controls must wrap responsively.
- Demonstrate toolbar roving tabindex in the Vue showcase so the semantics shown are not merely decorative.

## Source register

1. Arco Design Vue — Button: https://arco.design/vue/component/button
2. Ant Design — Space / Space.Compact: https://ant.design/components/space/
3. Ant Design — Dropdown: https://ant.design/components/dropdown/
4. Element Plus — Button / Button Group: https://element-plus.org/en-US/component/button.html
5. Element Plus — Dropdown / split-button: https://element-plus.org/en-US/component/dropdown.html
6. Bootstrap 5.3 — Button group: https://getbootstrap.com/docs/5.3/components/button-group/
7. WAI-ARIA APG — Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
8. WAI-ARIA APG — Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

## Verification requirements

- Metadata schema, CSS build assertions, generated adapter catalogs, and framework runtime tests must cover the new variants and accessibility metadata.
- The dedicated Vue showcase must render multiple real groups, not catalog placeholders.
- Desktop and narrow viewport browser inspection must confirm seams, width behavior, vertical radii, focus affordance, selected contrast, and toolbar wrapping.

## Verification record

- CSS build assertions, schema validation, runtime tests, HTML validation, package budget, and quality audit passed.
- Vue, React, and AngularJS builds plus runtime/type contracts passed with the new variants and native accessibility attributes.
- Blazor generation, schema/API/assets checks, and performance budget passed. CLR compilation was not rerun because this machine has no .NET SDK.
- The Vue showcase type check and production build passed.
- Browser-computed evidence confirmed a 32 by 32 pixel split trigger, white text on the solid primary background, vertical flex direction and end radii, equal-width block children, persistent pressed styling, and toolbar roving tabindex.
- Desktop Chromium/WebKit (62), Firefox (31), mobile Chromium/WebKit (52), and accessibility/keyboard/RTL/theme contrast (26) test matrices all passed.
