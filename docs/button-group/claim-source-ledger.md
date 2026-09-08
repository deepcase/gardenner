# Button Group claim-to-source ledger

| Claim | Primary support | Applied outcome |
| --- | --- | --- |
| Button groups represent related peer operations | Arco Button; Element Plus Button; Bootstrap Button group | Basic named `role="group"` examples |
| Compact connected controls need collapsed borders and may be horizontal or vertical | Ant Design Space.Compact; Element Plus Button Group | Horizontal seam model plus `vertical` variant |
| Full-width compact groups are a supported layout need | Ant Design Space.Compact `block` | `block` and `justified` variants |
| Split buttons have distinct primary and menu-trigger regions | Element Plus Dropdown; Ant Design Dropdown | `split`, primary-action part, trigger part, menu ARIA guidance |
| Toolbars are semantically distinct and should support directional focus movement | WAI-ARIA APG Toolbar; Bootstrap Button toolbar | `.g-btn-toolbar`, named toolbar, roving tabindex demo |
| Toggle buttons expose state with a stable label and `aria-pressed` | WAI-ARIA APG Button | `toggle` variant and interactive pressed-state demo |
| Ordinary groups and toolbars require an accessible name | Bootstrap Button group; WAI-ARIA APG Toolbar | Metadata attributes and labelled examples |
| A connected group should not wrap like a generic flex row | Inference from connected-border patterns across Arco, Ant, Element Plus, Bootstrap | Group stays single-axis; toolbar owns responsive wrapping |
| Exclusive selection should not be represented as independent toggle buttons | WAI-ARIA pattern separation; existing Gardenerim Segmented/Radio components | Explicit API/docs boundary |
