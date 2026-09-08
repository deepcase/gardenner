# Gardenerim 2.2.0 component-by-component quality audit

This deterministic report checks every published component against the same evidence model. It deliberately does not equate “CSS exists” with “the component is optimal”. Subjective visual review and browser testing remain required after this gate.

## Summary

- Components: 575
- Average evidence score: 93/100
- Large gaps: 0
- Medium gaps: 268
- Small gaps: 1
- No detected structural gap: 306

## Per-component results

| Component | Category | Score | Benchmark gap | Evidence gap |
| --- | --- | ---: | --- | --- |
| agent-handoff | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| agent-plan | ai | 100 | none | No structural gap detected by the audit model. |
| agent-status | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| ai-command-menu | ai | 100 | none | No structural gap detected by the audit model. |
| ai-context-manager | ai | 100 | none | No structural gap detected by the audit model. |
| ai-feedback | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| ai-run-timeline | ai | 89 | medium | Component declares a disabled state but has no matching selector. Data-heavy component does not expose component-specific loading or empty styling. |
| ai-safety-notice | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| ai-structured-output | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| ai-usage-panel | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| ai-workspace | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| artifact-panel | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| artifact-workspace | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| attachment | ai | 85 | medium | Component declares a disabled state but has no matching selector. |
| chat | ai | 85 | medium | Component declares a disabled state but has no matching selector. |
| context-meter | ai | 87 | medium | Component declares a disabled state but has no matching selector. |
| conversation-list | ai | 87 | medium | Component declares a disabled state but has no matching selector. |
| cost-rate-limit | ai | 81 | medium | Component declares a disabled state but has no matching selector. |
| file-tree | ai | 100 | none | No structural gap detected by the audit model. |
| generation-card | ai | 100 | none | No structural gap detected by the audit model. |
| generation-gallery | ai | 100 | none | No structural gap detected by the audit model. |
| generation-placeholder | ai | 83 | medium | Component declares a disabled state but has no matching selector. |
| mention-slash-command | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| message | ai | 94 | medium | Component declares a disabled state but has no matching selector. |
| model-selector | ai | 100 | none | No structural gap detected by the audit model. |
| multi-agent-board | ai | 100 | none | No structural gap detected by the audit model. |
| permission-scope | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| privacy-notice | ai | 83 | medium | Component declares a disabled state but has no matching selector. |
| prompt-composer | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| prompt-library | ai | 83 | medium | Component declares a disabled state but has no matching selector. |
| prompt-starter | ai | 94 | medium | Component declares a disabled state but has no matching selector. |
| sources-citations | ai | 94 | medium | Component declares a disabled state but has no matching selector. |
| streaming-response | ai | 85 | medium | Component declares a disabled state but has no matching selector. |
| thinking | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| tool-approval | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| tool-call | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| version-history | ai | 89 | medium | Component declares a disabled state but has no matching selector. |
| voice-state | ai | 85 | medium | Component declares a disabled state but has no matching selector. |
| account-chooser | auth | 100 | none | No structural gap detected by the audit model. |
| account-security | auth | 84 | medium | Component declares a disabled state but has no matching selector. Composition has no signature-specific responsive rule. |
| auth-centered | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| auth-consent | auth | 87 | medium | Component declares a disabled state but has no matching selector. |
| auth-result | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| auth-split | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| authentication-shell | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| connected-accounts | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| device-management | auth | 100 | none | No structural gap detected by the audit model. |
| email-verification | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| first-time-setup | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| identity-switcher | auth | 100 | none | No structural gap detected by the audit model. |
| invitation-composition | auth | 84 | medium | Component declares a disabled state but has no matching selector. Composition has no signature-specific responsive rule. |
| lock-screen | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| login-activity | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| magic-link | auth | 80 | medium | Component declares a disabled state but has no matching selector. Composition has no signature-specific responsive rule. |
| mfa-challenge | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| otp-input | auth | 100 | none | No structural gap detected by the audit model. |
| passkey-composition | auth | 80 | medium | Component declares a disabled state but has no matching selector. Composition has no signature-specific responsive rule. |
| password-recovery | auth | 87 | medium | Component declares a disabled state but has no matching selector. |
| password-reset | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| password-strength | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| phone-verification | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| profile-setup | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| qr-login | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| recovery-codes | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| registration-composition | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| security-alert | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| session-expired | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| sign-in-composition | auth | 89 | medium | Component declares a disabled state but has no matching selector. |
| sso-composition | auth | 94 | medium | Component declares a disabled state but has no matching selector. |
| tenant-chooser | auth | 100 | none | No structural gap detected by the audit model. |
| trusted-device | auth | 85 | medium | Component declares a disabled state but has no matching selector. |
| avatar | basic | 100 | none | No structural gap detected by the audit model. |
| avatar-group | basic | 100 | none | No structural gap detected by the audit model. |
| badge | basic | 100 | none | No structural gap detected by the audit model. |
| badge-tag-chip | basic | 100 | none | No structural gap detected by the audit model. |
| button | basic | 100 | none | No structural gap detected by the audit model. |
| button-group | basic | 100 | none | No structural gap detected by the audit model. |
| card | basic | 100 | none | No structural gap detected by the audit model. |
| chip | basic | 100 | none | No structural gap detected by the audit model. |
| divider-with-text | basic | 100 | none | No structural gap detected by the audit model. |
| icon | basic | 94 | none | No structural gap detected by the audit model. |
| link | basic | 94 | none | No structural gap detected by the audit model. |
| tag | basic | 100 | none | No structural gap detected by the audit model. |
| typography | basic | 83 | medium | Component declares a disabled state but has no matching selector. |
| cms-shell | cms | 89 | medium | Component declares a disabled state but has no matching selector. |
| content-workflow | cms | 89 | medium | Component declares a disabled state but has no matching selector. |
| localization-grid | cms | 89 | medium | Component declares a disabled state but has no matching selector. |
| media-library | cms | 89 | medium | Component declares a disabled state but has no matching selector. |
| rich-editor | cms | 89 | medium | Component declares a disabled state but has no matching selector. |
| visual-builder | cms | 83 | medium | Component declares a disabled state but has no matching selector. |
| address-card | commerce | 94 | medium | Component declares a disabled state but has no matching selector. |
| address-selector | commerce | 94 | medium | Component declares a disabled state but has no matching selector. |
| billing-history | commerce | 100 | none | No structural gap detected by the audit model. |
| cart-item | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| cart-summary | commerce | 85 | medium | Component declares a disabled state but has no matching selector. |
| checkout | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| commerce-cart | commerce | 100 | none | No structural gap detected by the audit model. |
| commerce-cart-item | commerce | 100 | none | No structural gap detected by the audit model. |
| commerce-checkout | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| commerce-checkout-steps | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| commerce-order-summary | commerce | 87 | medium | Component declares a disabled state but has no matching selector. |
| commerce-order-timeline | commerce | 100 | none | No structural gap detected by the audit model. |
| commerce-product-card | commerce | 94 | medium | Component declares a disabled state but has no matching selector. |
| commerce-product-detail | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| commerce-product-gallery | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| commerce-product-list | commerce | 100 | none | No structural gap detected by the audit model. |
| commerce-quantity-stepper | commerce | 100 | none | No structural gap detected by the audit model. |
| commerce-usage-meter | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| coupon | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| invoice-information | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| mini-cart | commerce | 100 | none | No structural gap detected by the audit model. |
| order-detail | commerce | 87 | medium | Component declares a disabled state but has no matching selector. |
| payment-method | commerce | 95 | none | No structural gap detected by the audit model. |
| payment-result | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| payment-sheet | commerce | 85 | medium | Component declares a disabled state but has no matching selector. |
| pickup-selector | commerce | 95 | none | No structural gap detected by the audit model. |
| price-display | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| price-quantity | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| pricing-comparison | commerce | 87 | medium | Component declares a disabled state but has no matching selector. |
| product-card | commerce | 94 | medium | Component declares a disabled state but has no matching selector. |
| product-detail | commerce | 87 | medium | Component declares a disabled state but has no matching selector. |
| promotion-list | commerce | 100 | none | No structural gap detected by the audit model. |
| refund-status | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| shipping-method | commerce | 95 | none | No structural gap detected by the audit model. |
| sku-selector | commerce | 95 | none | No structural gap detected by the audit model. |
| subscription-plan | commerce | 94 | medium | Component declares a disabled state but has no matching selector. |
| tax-summary | commerce | 89 | medium | Component declares a disabled state but has no matching selector. |
| activity-feed | communication | 89 | medium | Component declares a disabled state but has no matching selector. |
| comment-thread | communication | 89 | medium | Component declares a disabled state but has no matching selector. |
| communication-composer | communication | 83 | medium | Component declares a disabled state but has no matching selector. |
| communication-contacts | communication | 83 | medium | Component declares a disabled state but has no matching selector. |
| communication-delivery | communication | 83 | medium | Component declares a disabled state but has no matching selector. |
| inbox | communication | 100 | none | No structural gap detected by the audit model. |
| notification-center | communication | 89 | medium | Component declares a disabled state but has no matching selector. |
| notification-preferences | communication | 83 | medium | Component declares a disabled state but has no matching selector. |
| article-layout | content | 100 | none | No structural gap detected by the audit model. |
| audio-player-shell | content | 100 | none | No structural gap detected by the audit model. |
| block-editor | content | 100 | none | No structural gap detected by the audit model. |
| chunk-upload | content | 100 | none | No structural gap detected by the audit model. |
| code-block | content | 100 | none | No structural gap detected by the audit model. |
| code-editor-shell | content | 100 | none | No structural gap detected by the audit model. |
| comment-thread-composition | content | 100 | none | No structural gap detected by the audit model. |
| content-autosave-indicator | content | 100 | none | No structural gap detected by the audit model. |
| content-file-drop | content | 100 | none | No structural gap detected by the audit model. |
| content-file-list | content | 100 | none | No structural gap detected by the audit model. |
| content-outline | content | 100 | none | No structural gap detected by the audit model. |
| content-upload-queue | content | 100 | none | No structural gap detected by the audit model. |
| diff-viewer | content | 100 | none | No structural gap detected by the audit model. |
| document-viewer-composition | content | 100 | none | No structural gap detected by the audit model. |
| editor-toolbar-composition | content | 100 | none | No structural gap detected by the audit model. |
| failed-upload | content | 100 | none | No structural gap detected by the audit model. |
| file-browser-composition | content | 100 | none | No structural gap detected by the audit model. |
| file-card-composition | content | 100 | none | No structural gap detected by the audit model. |
| file-preview-composition | content | 100 | none | No structural gap detected by the audit model. |
| file-properties | content | 100 | none | No structural gap detected by the audit model. |
| find-replace | content | 100 | none | No structural gap detected by the audit model. |
| folder-tree-composition | content | 100 | none | No structural gap detected by the audit model. |
| image-annotation-composition | content | 100 | none | No structural gap detected by the audit model. |
| image-crop-composition | content | 100 | none | No structural gap detected by the audit model. |
| markdown-editor | content | 100 | none | No structural gap detected by the audit model. |
| markdown-viewer | content | 100 | none | No structural gap detected by the audit model. |
| media-details-composition | content | 100 | none | No structural gap detected by the audit model. |
| media-grid-composition | content | 100 | none | No structural gap detected by the audit model. |
| media-library-composition | content | 100 | none | No structural gap detected by the audit model. |
| pdf-viewer | content | 100 | none | No structural gap detected by the audit model. |
| report-invoice | content | 100 | none | No structural gap detected by the audit model. |
| revision-compare-composition | content | 100 | none | No structural gap detected by the audit model. |
| rich-text-editor-composition | content | 100 | none | No structural gap detected by the audit model. |
| search-results | content | 100 | none | No structural gap detected by the audit model. |
| storage-meter | content | 100 | none | No structural gap detected by the audit model. |
| terminal | content | 100 | none | No structural gap detected by the audit model. |
| upload-progress-composition | content | 100 | none | No structural gap detected by the audit model. |
| version-history-composition | content | 100 | none | No structural gap detected by the audit model. |
| video-player-shell | content | 100 | none | No structural gap detected by the audit model. |
| chart-container | dashboard | 91 | none | No structural gap detected by the audit model. |
| dashboard-widget | dashboard | 91 | none | No structural gap detected by the audit model. |
| filter-bar | dashboard | 91 | none | No structural gap detected by the audit model. |
| gauge-chart | dashboard | 91 | small | Data-heavy component does not expose component-specific loading or empty styling. |
| goal-tracker | dashboard | 91 | none | No structural gap detected by the audit model. |
| kpi-group | dashboard | 95 | none | No structural gap detected by the audit model. |
| kpi-stat | dashboard | 95 | none | No structural gap detected by the audit model. |
| agenda | data | 96 | none | No structural gap detected by the audit model. |
| audit-log-composition | data | 100 | none | No structural gap detected by the audit model. |
| calendar | data | 100 | none | No structural gap detected by the audit model. |
| column-chooser | data | 100 | none | No structural gap detected by the audit model. |
| column-toggle | data | 93 | none | No structural gap detected by the audit model. |
| comparison-table | data | 100 | none | No structural gap detected by the audit model. |
| data-filter | data | 89 | none | No structural gap detected by the audit model. |
| data-grid | data | 90 | none | No structural gap detected by the audit model. |
| data-inspector | data | 91 | none | No structural gap detected by the audit model. |
| data-legend | data | 91 | none | No structural gap detected by the audit model. |
| data-matrix | data | 100 | none | No structural gap detected by the audit model. |
| data-state | data | 100 | none | No structural gap detected by the audit model. |
| data-toolbar | data | 100 | none | No structural gap detected by the audit model. |
| data-view | data | 93 | none | No structural gap detected by the audit model. |
| data-view-switcher | data | 100 | none | No structural gap detected by the audit model. |
| dense-list | data | 100 | none | No structural gap detected by the audit model. |
| description-list | data | 100 | none | No structural gap detected by the audit model. |
| descriptions | data | 85 | none | No structural gap detected by the audit model. |
| editable-grid | data | 100 | none | No structural gap detected by the audit model. |
| expandable-table | data | 82 | none | No structural gap detected by the audit model. |
| export-panel | data | 91 | none | No structural gap detected by the audit model. |
| file-manager | data | 91 | none | No structural gap detected by the audit model. |
| filter-builder | data | 100 | none | No structural gap detected by the audit model. |
| filter-summary | data | 82 | none | No structural gap detected by the audit model. |
| gantt-shell | data | 96 | none | No structural gap detected by the audit model. |
| grouped-table | data | 82 | none | No structural gap detected by the audit model. |
| heatmap | data | 100 | none | No structural gap detected by the audit model. |
| kanban | data | 96 | none | No structural gap detected by the audit model. |
| key-value | data | 100 | none | No structural gap detected by the audit model. |
| list | data | 100 | none | No structural gap detected by the audit model. |
| list-group | data | 100 | none | No structural gap detected by the audit model. |
| map-shell | data | 91 | none | No structural gap detected by the audit model. |
| media-list | data | 100 | none | No structural gap detected by the audit model. |
| metric-card | data | 100 | none | No structural gap detected by the audit model. |
| organization-chart | data | 100 | none | No structural gap detected by the audit model. |
| overflow-list | data | 79 | medium | Component declares a disabled state but has no matching selector. Data-heavy component does not expose component-specific loading or empty styling. |
| pivot-table | data | 91 | none | No structural gap detected by the audit model. |
| progress-stats | data | 100 | none | No structural gap detected by the audit model. |
| query-builder | data | 91 | none | No structural gap detected by the audit model. |
| ranking | data | 100 | none | No structural gap detected by the audit model. |
| record-detail | data | 100 | none | No structural gap detected by the audit model. |
| responsive-table | data | 93 | none | No structural gap detected by the audit model. |
| row-disclosure | data | 82 | none | No structural gap detected by the audit model. |
| row-selection | data | 89 | none | No structural gap detected by the audit model. |
| selection-summary | data | 100 | none | No structural gap detected by the audit model. |
| sparkline | data | 100 | none | No structural gap detected by the audit model. |
| stat-list | data | 100 | none | No structural gap detected by the audit model. |
| statistic | data | 89 | none | No structural gap detected by the audit model. |
| status-summary | data | 100 | none | No structural gap detected by the audit model. |
| table | data | 100 | none | No structural gap detected by the audit model. |
| table-density | data | 93 | none | No structural gap detected by the audit model. |
| table-sort | data | 87 | none | No structural gap detected by the audit model. |
| timeline | data | 95 | none | No structural gap detected by the audit model. |
| tree | data | 100 | none | No structural gap detected by the audit model. |
| tree-table | data | 93 | none | No structural gap detected by the audit model. |
| virtual-list | data | 91 | none | No structural gap detected by the audit model. |
| watermark | data | 79 | medium | Component declares a disabled state but has no matching selector. |
| about-dialog | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| background-task-center | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| crash-recovery | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| deep-link-handler | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-activity-bar-composition | desktop | 100 | none | No structural gap detected by the audit model. |
| desktop-bottom-panel | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-command-palette | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-context-menu | desktop | 100 | none | No structural gap detected by the audit model. |
| desktop-dock-panel | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-document-tabs | desktop | 100 | none | No structural gap detected by the audit model. |
| desktop-drag-region | desktop | 87 | medium | Component declares a disabled state but has no matching selector. |
| desktop-inspector-panel | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-menubar-composition | desktop | 100 | none | No structural gap detected by the audit model. |
| desktop-native-titlebar | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-notification-center | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-permission-request | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-preferences | desktop | 83 | medium | Component declares a disabled state but has no matching selector. |
| desktop-problems-panel | desktop | 83 | medium | Component declares a disabled state but has no matching selector. |
| desktop-session-manager | desktop | 83 | medium | Component declares a disabled state but has no matching selector. |
| desktop-shell | desktop | 83 | medium | Component declares a disabled state but has no matching selector. |
| desktop-split-pane | desktop | 94 | medium | Component declares a disabled state but has no matching selector. |
| desktop-status-bar | desktop | 94 | medium | Component declares a disabled state but has no matching selector. |
| desktop-titlebar | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-toolbar | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-window-controls-composition | desktop | 94 | medium | Component declares a disabled state but has no matching selector. |
| desktop-window-switcher | desktop | 100 | none | No structural gap detected by the audit model. |
| desktop-workbench | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| desktop-workspace-composition | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| multi-window-placeholder | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| native-file-picker | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| recent-documents | desktop | 94 | medium | Component declares a disabled state but has no matching selector. |
| shortcut-recorder | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| single-instance-notice | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| sync-status | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| tray-menu-shell | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| update-available | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| update-progress | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| window-loading | desktop | 89 | medium | Component declares a disabled state but has no matching selector. |
| accordion | disclosure | 100 | none | No structural gap detected by the audit model. |
| collapse | disclosure | 100 | none | No structural gap detected by the audit model. |
| read-more | disclosure | 100 | none | No structural gap detected by the audit model. |
| audit-log | enterprise | 89 | medium | Component declares a disabled state but has no matching selector. |
| enterprise-integrations | enterprise | 83 | medium | Component declares a disabled state but has no matching selector. |
| enterprise-settings | enterprise | 85 | medium | Component declares a disabled state but has no matching selector. |
| invitation-manager | enterprise | 83 | medium | Component declares a disabled state but has no matching selector. Data-heavy component does not expose component-specific loading or empty styling. |
| member-management | enterprise | 83 | medium | Component declares a disabled state but has no matching selector. |
| permission-matrix | enterprise | 89 | medium | Component declares a disabled state but has no matching selector. |
| role-manager | enterprise | 83 | medium | Component declares a disabled state but has no matching selector. Data-heavy component does not expose component-specific loading or empty styling. |
| team-management | enterprise | 83 | medium | Component declares a disabled state but has no matching selector. |
| alert | feedback | 100 | none | No structural gap detected by the audit model. |
| context-bar | feedback | 100 | none | No structural gap detected by the audit model. |
| empty-state | feedback | 100 | none | No structural gap detected by the audit model. |
| page-loading | feedback | 100 | none | No structural gap detected by the audit model. |
| page-state-system | feedback | 100 | none | No structural gap detected by the audit model. |
| progress-meter | feedback | 100 | none | No structural gap detected by the audit model. |
| spinner-skeleton | feedback | 100 | none | No structural gap detected by the audit model. |
| status-bar | feedback | 100 | none | No structural gap detected by the audit model. |
| toast | feedback | 94 | none | No structural gap detected by the audit model. |
| address-group | form | 100 | none | No structural gap detected by the audit model. |
| autosave-status | form | 95 | none | No structural gap detected by the audit model. |
| character-counter | form | 95 | none | No structural gap detected by the audit model. |
| checkbox-group | form | 100 | none | No structural gap detected by the audit model. |
| checkbox-radio | form | 100 | none | No structural gap detected by the audit model. |
| choice-card-group | form | 100 | none | No structural gap detected by the audit model. |
| clearable-field | form | 100 | none | No structural gap detected by the audit model. |
| color-picker | form | 83 | medium | Component declares a disabled state but has no matching selector. |
| combobox | form | 100 | none | No structural gap detected by the audit model. |
| compact-form | form | 100 | none | No structural gap detected by the audit model. |
| conditional-field | form | 89 | none | No structural gap detected by the audit model. |
| consent-group | form | 100 | none | No structural gap detected by the audit model. |
| date-picker | form | 100 | none | No structural gap detected by the audit model. |
| date-range-group | form | 100 | none | No structural gap detected by the audit model. |
| field | form | 100 | none | No structural gap detected by the audit model. |
| fieldset | form | 100 | none | No structural gap detected by the audit model. |
| file-drop | form | 100 | none | No structural gap detected by the audit model. |
| file-field | form | 66 | none | No structural gap detected by the audit model. |
| form | form | 100 | none | No structural gap detected by the audit model. |
| form-actions | form | 100 | none | No structural gap detected by the audit model. |
| form-builder | form | 100 | none | No structural gap detected by the audit model. |
| form-grid | form | 100 | none | No structural gap detected by the audit model. |
| form-progress | form | 100 | none | No structural gap detected by the audit model. |
| form-review | form | 100 | none | No structural gap detected by the audit model. |
| form-row | form | 100 | none | No structural gap detected by the audit model. |
| form-section | form | 100 | none | No structural gap detected by the audit model. |
| horizontal-form | form | 100 | none | No structural gap detected by the audit model. |
| inline-form | form | 100 | none | No structural gap detected by the audit model. |
| input | form | 100 | none | No structural gap detected by the audit model. |
| input-affix | form | 100 | none | No structural gap detected by the audit model. |
| input-group | form | 100 | none | No structural gap detected by the audit model. |
| input-number | form | 81 | medium | Component declares a disabled state but has no matching selector. |
| input-tag | form | 79 | medium | Component declares a disabled state but has no matching selector. |
| money-group | form | 100 | none | No structural gap detected by the audit model. |
| name-group | form | 100 | none | No structural gap detected by the audit model. |
| password-field | form | 100 | none | No structural gap detected by the audit model. |
| phone-group | form | 100 | none | No structural gap detected by the audit model. |
| pin-input | form | 100 | none | No structural gap detected by the audit model. |
| radio-group | form | 100 | none | No structural gap detected by the audit model. |
| range-color | form | 100 | none | No structural gap detected by the audit model. |
| range-field | form | 76 | none | No structural gap detected by the audit model. |
| rating | form | 100 | none | No structural gap detected by the audit model. |
| repeatable-field | form | 87 | none | No structural gap detected by the audit model. |
| search-field | form | 100 | none | No structural gap detected by the audit model. |
| select | form | 100 | none | No structural gap detected by the audit model. |
| switch | form | 100 | none | No structural gap detected by the audit model. |
| switch-row | form | 100 | none | No structural gap detected by the audit model. |
| textarea | form | 100 | none | No structural gap detected by the audit model. |
| time-picker | form | 100 | none | No structural gap detected by the audit model. |
| time-range-group | form | 100 | none | No structural gap detected by the audit model. |
| unit-field | form | 86 | none | No structural gap detected by the audit model. |
| upload-queue | form | 100 | none | No structural gap detected by the audit model. |
| validation-state | form | 100 | none | No structural gap detected by the audit model. |
| validation-summary | form | 100 | none | No structural gap detected by the audit model. |
| callout | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| coach-mark | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| contextual-help | help | 87 | medium | Component declares a disabled state but has no matching selector. |
| definition-help | help | 81 | medium | Component declares a disabled state but has no matching selector. |
| faq | help | 100 | none | No structural gap detected by the audit model. |
| feature-hint | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| guidance-pair | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| help-card | help | 100 | none | No structural gap detected by the audit model. |
| help-center | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| help-checklist | help | 100 | none | No structural gap detected by the audit model. |
| help-feedback | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| help-glossary | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| help-panel | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| help-popover | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| help-search | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| help-text | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| help-topics | help | 94 | medium | Component declares a disabled state but has no matching selector. |
| help-trigger | help | 100 | none | No structural gap detected by the audit model. |
| hotspot | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| inline-hint | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| key-hint | help | 81 | medium | Component declares a disabled state but has no matching selector. |
| note | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| rich-tooltip | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| shortcut-list | help | 85 | medium | Component declares a disabled state but has no matching selector. |
| spotlight | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| tip | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| tour-spotlight | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| troubleshooting | help | 89 | medium | Component declares a disabled state but has no matching selector. |
| whats-new | help | 100 | none | No structural gap detected by the audit model. |
| action-bar | interaction | 100 | none | No structural gap detected by the audit model. |
| batch-toolbar | interaction | 100 | none | No structural gap detected by the audit model. |
| bulk-action-bar | interaction | 100 | none | No structural gap detected by the audit model. |
| bulk-confirmation | interaction | 100 | none | No structural gap detected by the audit model. |
| bulk-progress | interaction | 100 | none | No structural gap detected by the audit model. |
| cascader | interaction | 100 | none | No structural gap detected by the audit model. |
| color-picker-composition | interaction | 100 | none | No structural gap detected by the audit model. |
| copy-action | interaction | 100 | none | No structural gap detected by the audit model. |
| date-range-picker-composition | interaction | 100 | none | No structural gap detected by the audit model. |
| drag-sort | interaction | 100 | none | No structural gap detected by the audit model. |
| dual-list | interaction | 100 | none | No structural gap detected by the audit model. |
| entity-picker | interaction | 100 | none | No structural gap detected by the audit model. |
| floating-action-bar | interaction | 100 | none | No structural gap detected by the audit model. |
| fullscreen-action | interaction | 100 | none | No structural gap detected by the audit model. |
| group-builder | interaction | 100 | none | No structural gap detected by the audit model. |
| icon-picker | interaction | 100 | none | No structural gap detected by the audit model. |
| infinite-scroll | interaction | 100 | none | No structural gap detected by the audit model. |
| media-picker | interaction | 100 | none | No structural gap detected by the audit model. |
| mention-picker | interaction | 100 | none | No structural gap detected by the audit model. |
| organization-picker | interaction | 100 | none | No structural gap detected by the audit model. |
| pull-refresh | interaction | 100 | none | No structural gap detected by the audit model. |
| relation-picker | interaction | 100 | none | No structural gap detected by the audit model. |
| resource-picker | interaction | 100 | none | No structural gap detected by the audit model. |
| saved-filters | interaction | 100 | none | No structural gap detected by the audit model. |
| saved-views | interaction | 100 | none | No structural gap detected by the audit model. |
| selection-controls | interaction | 100 | none | No structural gap detected by the audit model. |
| sort-builder | interaction | 100 | none | No structural gap detected by the audit model. |
| split-pane | interaction | 100 | none | No structural gap detected by the audit model. |
| sticky-actions | interaction | 100 | none | No structural gap detected by the audit model. |
| tag-picker | interaction | 100 | none | No structural gap detected by the audit model. |
| time-range-picker-composition | interaction | 100 | none | No structural gap detected by the audit model. |
| transfer-list | interaction | 100 | none | No structural gap detected by the audit model. |
| tree-select | interaction | 100 | none | No structural gap detected by the audit model. |
| undo-history | interaction | 100 | none | No structural gap detected by the audit model. |
| user-picker | interaction | 100 | none | No structural gap detected by the audit model. |
| affix | layout | 79 | medium | Component declares a disabled state but has no matching selector. |
| app-shell | layout | 89 | medium | Component declares a disabled state but has no matching selector. |
| classic-layout-primitives | layout | 89 | medium | Component declares a disabled state but has no matching selector. |
| dashboard | layout | 95 | none | No structural gap detected by the audit model. |
| footer-bar | layout | 89 | medium | Component declares a disabled state but has no matching selector. |
| grid-system | layout | 100 | none | No structural gap detected by the audit model. |
| mobile-shell | layout | 87 | medium | Component declares a disabled state but has no matching selector. |
| page-header | layout | 89 | medium | Component declares a disabled state but has no matching selector. |
| region-layout-system | layout | 89 | medium | Component declares a disabled state but has no matching selector. |
| resize-box | layout | 81 | medium | Component declares a disabled state but has no matching selector. |
| responsive-container | layout | 89 | medium | Component declares a disabled state but has no matching selector. |
| scrollbar | layout | 79 | medium | Component declares a disabled state but has no matching selector. |
| section-header | layout | 89 | medium | Component declares a disabled state but has no matching selector. |
| space | layout | 79 | medium | Component declares a disabled state but has no matching selector. |
| subheader | layout | 89 | medium | Component declares a disabled state but has no matching selector. |
| consent-history | legal | 83 | medium | Component declares a disabled state but has no matching selector. |
| consent-preferences | legal | 85 | medium | Component declares a disabled state but has no matching selector. |
| cookie-consent | legal | 87 | medium | Component declares a disabled state but has no matching selector. |
| legal-agreement | legal | 89 | medium | Component declares a disabled state but has no matching selector. |
| legal-document | legal | 89 | medium | Component declares a disabled state but has no matching selector. |
| policy-updates | legal | 83 | medium | Component declares a disabled state but has no matching selector. |
| privacy-request | legal | 89 | medium | Component declares a disabled state but has no matching selector. |
| privacy-request-status | legal | 83 | medium | Component declares a disabled state but has no matching selector. |
| announcement-bar | marketing | 83 | medium | Component declares a disabled state but has no matching selector. |
| cta-section | marketing | 83 | medium | Component declares a disabled state but has no matching selector. |
| feature-grid | marketing | 78 | medium | Component declares a disabled state but has no matching selector. Composition has no signature-specific responsive rule. |
| hero | marketing | 89 | medium | Component declares a disabled state but has no matching selector. |
| logo-cloud | marketing | 78 | medium | Component declares a disabled state but has no matching selector. Composition has no signature-specific responsive rule. |
| newsletter | marketing | 83 | medium | Component declares a disabled state but has no matching selector. |
| pricing | marketing | 94 | medium | Component declares a disabled state but has no matching selector. |
| site-footer | marketing | 89 | medium | Component declares a disabled state but has no matching selector. |
| site-header | marketing | 85 | medium | Component declares a disabled state but has no matching selector. |
| testimonial | marketing | 80 | medium | Component declares a disabled state but has no matching selector. Composition has no signature-specific responsive rule. |
| carousel | media | 94 | medium | Component declares a disabled state but has no matching selector. |
| document-viewer | media | 89 | medium | Component declares a disabled state but has no matching selector. |
| gallery-lightbox | media | 94 | medium | Component declares a disabled state but has no matching selector. |
| image | media | 100 | none | No structural gap detected by the audit model. |
| image-comparison | media | 89 | medium | Component declares a disabled state but has no matching selector. |
| image-crop-shell | media | 89 | medium | Component declares a disabled state but has no matching selector. |
| media-player | media | 85 | medium | Component declares a disabled state but has no matching selector. |
| responsive-image | media | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-action-sheet | mobile | 100 | none | No structural gap detected by the audit model. |
| mobile-app-bar | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-auth | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-bottom-navigation | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-bottom-sheet | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-card-carousel | mobile | 94 | medium | Component declares a disabled state but has no matching selector. |
| mobile-category | mobile | 100 | none | No structural gap detected by the audit model. |
| mobile-category-view | mobile | 100 | none | No structural gap detected by the audit model. |
| mobile-checkout | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-fab | mobile | 87 | medium | Component declares a disabled state but has no matching selector. |
| mobile-feed | mobile | 100 | none | No structural gap detected by the audit model. |
| mobile-filter-sheet | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-form | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-fullscreen-dialog | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-gesture-hint | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-infinite-load | mobile | 85 | medium | Component declares a disabled state but has no matching selector. |
| mobile-keyboard-avoidance | mobile | 87 | medium | Component declares a disabled state but has no matching selector. |
| mobile-keyboard-toolbar | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-media-viewer | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-offline-banner | mobile | 87 | medium | Component declares a disabled state but has no matching selector. |
| mobile-permission-prompt | mobile | 87 | medium | Component declares a disabled state but has no matching selector. |
| mobile-picker | mobile | 100 | none | No structural gap detected by the audit model. |
| mobile-pull-refresh | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-purchase-bar | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-safe-shell | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-search | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-segmented-control | mobile | 95 | none | No structural gap detected by the audit model. |
| mobile-selection-mode | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-snackbar | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-state | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-swipe-actions | mobile | 89 | medium | Component declares a disabled state but has no matching selector. |
| mobile-swipe-tabs | mobile | 95 | none | No structural gap detected by the audit model. |
| mobile-wheel-picker | mobile | 100 | none | No structural gap detected by the audit model. |
| account-navigation | navigation | 86 | none | No structural gap detected by the audit model. |
| activity-bar | navigation | 100 | none | No structural gap detected by the audit model. |
| anchor-navigation | navigation | 77 | none | No structural gap detected by the audit model. |
| back-navigation | navigation | 77 | none | No structural gap detected by the audit model. |
| back-to-top | navigation | 72 | none | No structural gap detected by the audit model. |
| bottom-navigation | navigation | 92 | none | No structural gap detected by the audit model. |
| breadcrumb | navigation | 100 | none | No structural gap detected by the audit model. |
| collapsible-navigation | navigation | 100 | none | No structural gap detected by the audit model. |
| command-bar | navigation | 94 | none | No structural gap detected by the audit model. |
| command-navigation | navigation | 94 | none | No structural gap detected by the audit model. |
| command-palette | navigation | 100 | none | No structural gap detected by the audit model. |
| context-menu | navigation | 100 | none | No structural gap detected by the audit model. |
| cursor-pagination | navigation | 90 | none | No structural gap detected by the audit model. |
| drawer-navigation | navigation | 94 | none | No structural gap detected by the audit model. |
| jump-navigation | navigation | 66 | none | No structural gap detected by the audit model. |
| load-more-navigation | navigation | 84 | none | No structural gap detected by the audit model. |
| locale-navigation | navigation | 86 | none | No structural gap detected by the audit model. |
| mega-menu | navigation | 88 | none | No structural gap detected by the audit model. |
| menu-bar | navigation | 100 | none | No structural gap detected by the audit model. |
| menu-dropdown | navigation | 100 | none | No structural gap detected by the audit model. |
| mobile-tab-bar | navigation | 90 | none | No structural gap detected by the audit model. |
| mobile-top-navigation | navigation | 86 | none | No structural gap detected by the audit model. |
| navbar | navigation | 100 | none | No structural gap detected by the audit model. |
| navigation-rail | navigation | 100 | none | No structural gap detected by the audit model. |
| pagination | navigation | 100 | none | No structural gap detected by the audit model. |
| pill-navigation | navigation | 88 | none | No structural gap detected by the audit model. |
| previous-next-navigation | navigation | 90 | none | No structural gap detected by the audit model. |
| primary-navigation | navigation | 100 | none | No structural gap detected by the audit model. |
| quick-navigation | navigation | 90 | none | No structural gap detected by the audit model. |
| scrollspy-navigation | navigation | 68 | none | No structural gap detected by the audit model. |
| segmented-control | navigation | 100 | none | No structural gap detected by the audit model. |
| sidebar | navigation | 100 | none | No structural gap detected by the audit model. |
| skip-navigation | navigation | 88 | none | No structural gap detected by the audit model. |
| stepper | navigation | 100 | none | No structural gap detected by the audit model. |
| sub-navigation | navigation | 100 | none | No structural gap detected by the audit model. |
| tabs | navigation | 100 | none | No structural gap detected by the audit model. |
| toolbar | navigation | 100 | none | No structural gap detected by the audit model. |
| tree-navigation | navigation | 87 | none | No structural gap detected by the audit model. |
| utility-navigation | navigation | 100 | none | No structural gap detected by the audit model. |
| vertical-tabs | navigation | 87 | none | No structural gap detected by the audit model. |
| wizard-navigation | navigation | 94 | none | No structural gap detected by the audit model. |
| confirm-dialog | overlay | 100 | none | No structural gap detected by the audit model. |
| dialog | overlay | 100 | none | No structural gap detected by the audit model. |
| drawer | overlay | 89 | none | No structural gap detected by the audit model. |
| popconfirm | overlay | 95 | none | No structural gap detected by the audit model. |
| popover | overlay | 89 | none | No structural gap detected by the audit model. |
| tooltip | overlay | 82 | none | No structural gap detected by the audit model. |
| solution-admin-list | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-approval-center | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-article-page | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-blog-index | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-booking-portal | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-community-page | solution | 94 | medium | Component declares a disabled state but has no matching selector. |
| solution-contact-page | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-corporate-home | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-crm-workspace | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-dashboard-overview | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-docs-portal | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-event-portal | solution | 94 | medium | Component declares a disabled state but has no matching selector. |
| solution-finance-portal | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-healthcare-portal | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-help-center | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-knowledge-base | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-learning-portal | solution | 94 | medium | Component declares a disabled state but has no matching selector. |
| solution-marketplace-page | solution | 94 | medium | Component declares a disabled state but has no matching selector. |
| solution-notification-center | solution | 100 | none | No structural gap detected by the audit model. |
| solution-onboarding-flow | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-personal-home | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-portfolio-page | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-pricing-page | solution | 94 | medium | Component declares a disabled state but has no matching selector. |
| solution-product-landing | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-project-workspace | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-public-service-portal | solution | 100 | none | No structural gap detected by the audit model. |
| solution-record-detail | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-search-results | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-settings-center | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-status-center | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-support-center | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| solution-user-center | solution | 89 | medium | Component declares a disabled state but has no matching selector. |
| onboarding | workflow | 89 | medium | Component declares a disabled state but has no matching selector. |
| wizard-layout | workflow | 85 | medium | Component declares a disabled state but has no matching selector. |
| workflow-approval | workflow | 85 | medium | Component declares a disabled state but has no matching selector. |
| workflow-builder | workflow | 83 | medium | Component declares a disabled state but has no matching selector. |
| workflow-checklist | workflow | 83 | medium | Component declares a disabled state but has no matching selector. |
| workflow-run-detail | workflow | 83 | medium | Component declares a disabled state but has no matching selector. |
| workflow-run-history | workflow | 83 | medium | Component declares a disabled state but has no matching selector. |
| workflow-trigger | workflow | 83 | medium | Component declares a disabled state but has no matching selector. |
