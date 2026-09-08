# Gardenerim Blazor 组件完整目录

由 `@gardenerim/css@2.2.0` 元数据生成，共 575 个 Razor 组件，无省略。全部组件继承 `GardenerimComponentBase`，共享 23 个参数与 6 个实例成员；状态与无障碍契约原样保留。

| Razor 组件 | CSS 组件 | 分类 | 类型 | 状态 | 默认标签 | 根类/选择器 | 行为 | 无障碍契约 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GButton` | `button` | basic | css | css-ready | `button` | `g-btn` | — | — |
| `GButtonGroup` | `button-group` | basic | css | css-ready | `div` | `g-btn-group` | — | role:group, role:toolbar, aria-label, aria-labelledby, aria-orientation, aria-pressed, aria-haspopup, aria-expanded |
| `GCard` | `card` | basic | css | css-ready | `div` | `g-card` | — | — |
| `GBadge` | `badge` | basic | css | css-ready | `span` | `g-badge` | — | role:status, aria-label, aria-live, aria-atomic, title |
| `GTag` | `tag` | basic | interactive | runtime-ready | `span` | `g-tag` | tag | role:button, role:option, key:Enter, key:Space, aria-pressed, aria-selected, aria-label, aria-disabled |
| `GChip` | `chip` | basic | css | css-ready | `span` | `g-chip` | — | role:button, role:option, key:Enter, key:Space, key:Backspace, key:Delete, aria-pressed, aria-selected, aria-label, aria-disabled |
| `GBadgeTagChip` | `badge-tag-chip` | basic | css | deprecated | `div` | `g-badge` | — | — |
| `GAvatar` | `avatar` | basic | css | css-ready | `div` | `g-avatar` | — | role:button, role:img, aria-label, aria-hidden, aria-busy, aria-disabled, alt |
| `GAvatarGroup` | `avatar-group` | basic | css | css-ready | `div` | `g-avatar-group` | — | role:group, aria-label, aria-labelledby, aria-disabled |
| `GAlert` | `alert` | feedback | css | css-ready | `div` | `g-alert` | — | role:alert, role:status, aria-live, aria-atomic, aria-label, aria-labelledby, aria-describedby, aria-busy |
| `GProgressMeter` | `progress-meter` | feedback | css | css-ready | `div` | `g-progress` | — | role:progressbar, role:meter, aria-label, aria-labelledby, aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext, aria-busy |
| `GSpinnerSkeleton` | `spinner-skeleton` | feedback | css | css-ready | `div` | `g-spinner` | — | role:status, role:progressbar, aria-label, aria-labelledby, aria-describedby, aria-live, aria-busy, aria-hidden |
| `GEmptyState` | `empty-state` | feedback | css | css-ready | `div` | `g-empty` | — | role:status, aria-label, aria-labelledby, aria-describedby, aria-live, aria-atomic |
| `GInput` | `input` | form | css | css-ready | `input` | `g-input` | — | role:textbox, role:searchbox, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-required, aria-busy, aria-disabled, autocomplete, inputmode, readonly, disabled |
| `GTextarea` | `textarea` | form | css | css-ready | `textarea` | `g-textarea` | — | role:textbox, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-required, aria-disabled, aria-readonly, maxlength, rows, wrap, spellcheck, readonly, disabled, data-g-auto-resize, data-g-min-rows, data-g-max-rows |
| `GSelect` | `select` | form | css | css-ready | `select` | `g-select` | — | role:combobox, role:listbox, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-required, aria-busy, aria-disabled, autocomplete, disabled, required, multiple, size, name |
| `GCheckboxRadio` | `checkbox-radio` | form | css | css-ready | `div` | `g-check` | — | role:checkbox, role:radio, checked, disabled, name, value, aria-checked, aria-invalid, aria-describedby, aria-disabled |
| `GSwitch` | `switch` | form | css | css-ready | `div` | `g-switch` | — | role:switch, role:checkbox, checked, disabled, name, value, role, aria-checked, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-busy, aria-disabled |
| `GRangeColor` | `range-color` | form | css | css-ready | `div` | `g-range-color` | — | role:slider, role:group, key:ArrowLeft/ArrowDown decrease, key:ArrowRight/ArrowUp increase, key:PageUp/PageDown larger step, key:Home/End min/max, type, min, max, step, value, name, disabled, readonly, orient, aria-label, aria-labelledby, aria-describedby, aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext, aria-orientation, aria-invalid, aria-disabled, aria-readonly |
| `GFileDrop` | `file-drop` | form | interactive | runtime-ready | `div` | `g-file-drop` | dropzone | role:button, role:group, role:status, key:Enter/Space opens the native file chooser, key:Tab reaches file actions, accept, multiple, capture, webkitdirectory, disabled, tabindex, aria-label, aria-labelledby, aria-describedby, aria-disabled, aria-invalid, aria-busy, aria-live, data-g-accept, data-g-max-size, data-g-max-files, data-g-paste |
| `GCombobox` | `combobox` | form | interactive | runtime-ready | `div` | `g-combobox` | combobox | role:combobox, role:listbox, role:option, role:group, role:status, key:ArrowDown, key:ArrowUp, key:Home, key:End, key:Enter, key:Escape, key:Tab, aria-autocomplete, aria-controls, aria-expanded, aria-activedescendant, aria-selected, aria-disabled, aria-invalid, aria-busy, aria-describedby, data-g-value, data-g-label, data-g-keywords, data-g-filter, data-g-open-on-focus, data-g-loop-navigation, data-g-select-on-tab |
| `GForm` | `form` | form | css | css-ready | `form` | `g-form` | — | role:form, role:group, role:alert, role:status, aria-labelledby, aria-describedby, aria-invalid, aria-busy, aria-live, aria-disabled, aria-readonly, novalidate |
| `GFormSection` | `form-section` | form | css | css-ready | `div` | `g-form-section` | — | role:region, role:group, role:status, role:alert, key:Enter, key:Space, aria-labelledby, aria-describedby, aria-expanded, aria-controls, aria-current, aria-invalid, aria-disabled, open |
| `GField` | `field` | form | css | css-ready | `div` | `g-field` | — | role:group, role:status, role:alert, for, required, aria-required, aria-describedby, aria-errormessage, aria-invalid, aria-busy, aria-live, aria-disabled, aria-readonly |
| `GFieldset` | `fieldset` | form | css | css-ready | `fieldset` | `g-fieldset` | — | role:group, role:radiogroup, role:status, role:alert, disabled, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-live |
| `GFormRow` | `form-row` | form | css | css-ready | `div` | `g-form-row` | — | role:group, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly |
| `GFormGrid` | `form-grid` | form | css | css-ready | `div` | `g-form-grid` | — | role:group, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly |
| `GHorizontalForm` | `horizontal-form` | form | css | css-ready | `div` | `g-form-horizontal` | — | role:form, role:group, role:alert, role:status, aria-labelledby, aria-describedby, aria-invalid, aria-busy, aria-disabled, aria-readonly, novalidate |
| `GInlineForm` | `inline-form` | form | css | css-ready | `div` | `g-form-inline` | — | role:form, role:group, role:alert, role:status, aria-labelledby, aria-describedby, aria-invalid, aria-busy, aria-disabled, aria-readonly, novalidate |
| `GCompactForm` | `compact-form` | form | css | css-ready | `form` | `g-form-compact` | — | role:form, role:group, role:alert, role:status, aria-labelledby, aria-describedby, aria-invalid, aria-busy, aria-disabled, aria-readonly, novalidate |
| `GInputGroup` | `input-group` | form | css | css-ready | `div` | `g-input-group` | — | role:group, role:search, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-busy, aria-disabled, aria-readonly |
| `GInputAffix` | `input-affix` | form | css | css-ready | `div` | `g-input-affix` | — | role:group, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-busy, aria-disabled, aria-readonly |
| `GSearchField` | `search-field` | form | css | css-ready | `div` | `g-search-field` | — | role:search, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-controls, aria-expanded, aria-busy, aria-invalid, aria-disabled, aria-readonly, aria-live |
| `GPasswordField` | `password-field` | form | interactive | runtime-ready | `div` | `g-password-field` | password-toggle | role:group, key:Enter, key:Space, key:Escape, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-pressed, aria-controls, autocomplete, readonly, disabled, data-g-default-visible, data-g-visibility, data-g-hide-on-blur |
| `GClearableField` | `clearable-field` | form | interactive | runtime-ready | `div` | `g-clearable-field` | clear-input | role:group, key:Enter, key:Space, key:Escape, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-controls, disabled, readonly, data-g-clear-visibility, data-g-clear-on-escape |
| `GCharacterCounter` | `character-counter` | form | interactive | runtime-ready | `div` | `g-character-field` | character-count | role:status, role:alert, aria-describedby, aria-invalid, aria-live, aria-atomic, disabled, readonly, maxlength, data-g-character-count, data-g-character-warning, data-g-character-mode, data-g-character-hard-limit |
| `GValidationState` | `validation-state` | form | css | css-ready | `div` | `g-validation-state` | — | role:status, role:alert, aria-describedby, aria-invalid, aria-live, aria-atomic, aria-busy, aria-disabled, aria-readonly, aria-required, disabled, readonly |
| `GCheckboxGroup` | `checkbox-group` | form | interactive | runtime-ready | `fieldset` | `g-check-group` | row-select | role:group, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-live, aria-atomic, disabled, required, data-g-select-all, data-g-select-row, data-g-selection-count |
| `GRadioGroup` | `radio-group` | form | css | css-ready | `fieldset` | `g-radio-group` | — | role:group, role:radiogroup, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-required |
| `GSwitchRow` | `switch-row` | form | css | css-ready | `label` | `g-switch-row` | — | role:group, role:switch, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-disabled, aria-busy, aria-invalid, aria-readonly, aria-live |
| `GChoiceCardGroup` | `choice-card-group` | form | css | css-ready | `fieldset` | `g-choice-group` | — | role:group, role:radiogroup, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-required, aria-live |
| `GNameGroup` | `name-group` | form | css | css-ready | `fieldset` | `g-name-group` | — | role:group, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-required, aria-live, autocomplete |
| `GAddressGroup` | `address-group` | form | css | css-ready | `fieldset` | `g-address-group` | — | role:group, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-required, aria-live, autocomplete |
| `GPhoneGroup` | `phone-group` | form | css | css-ready | `fieldset` | `g-phone-group` | — | role:group, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-required, aria-live, autocomplete, inputmode |
| `GMoneyGroup` | `money-group` | form | css | css-ready | `fieldset` | `g-money-group` | — | role:group, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-required, aria-live, autocomplete, inputmode |
| `GDateRangeGroup` | `date-range-group` | form | css | css-ready | `fieldset` | `g-date-range-group` | — | role:group, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-required, aria-live, min, max |
| `GTimeRangeGroup` | `time-range-group` | form | css | css-ready | `div` | `g-time-range-group` | — | role:group, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-required, aria-live, min, max, step |
| `GUnitField` | `unit-field` | form | css | css-ready | `div` | `g-unit-field` | — | — |
| `GRangeField` | `range-field` | form | interactive | runtime-ready | `div` | `g-range-field` | field-sync | — |
| `GFileField` | `file-field` | form | interactive | runtime-ready | `div` | `g-file-field` | field-sync | — |
| `GRepeatableField` | `repeatable-field` | form | interactive | runtime-ready | `div` | `g-repeatable-field` | repeatable-field | — |
| `GConditionalField` | `conditional-field` | form | interactive | runtime-ready | `div` | `g-conditional-field` | conditional-field | aria-controls, aria-hidden, hidden, inert |
| `GFormActions` | `form-actions` | form | css | css-ready | `div` | `g-form-actions` | — | role:group, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-busy, aria-disabled, aria-live |
| `GAutosaveStatus` | `autosave-status` | form | interactive | runtime-ready | `div` | `g-autosave-status` | autosave | role:status, role:alert, aria-live, aria-atomic, aria-busy, aria-disabled, aria-label, datetime |
| `GFormProgress` | `form-progress` | form | css | css-ready | `div` | `g-form-progress` | — | role:progressbar, role:list, role:listitem, role:status, aria-label, aria-labelledby, aria-describedby, aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext, aria-current, aria-invalid, aria-disabled |
| `GFormReview` | `form-review` | form | css | css-ready | `div` | `g-form-review` | — | role:region, role:group, role:status, role:alert, aria-label, aria-labelledby, aria-describedby, aria-live, aria-current, aria-invalid, aria-disabled |
| `GConsentGroup` | `consent-group` | form | css | css-ready | `div` | `g-consent-group` | — | role:group, role:checkbox, role:status, role:alert, required, checked, aria-required, aria-checked, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-live |
| `GNavbar` | `navbar` | navigation | css | css-ready | `nav` | `g-navbar` | — | role:navigation, key:Tab, key:Enter, key:Space, key:Escape, aria-label, aria-labelledby, aria-current, aria-disabled, aria-controls, aria-expanded, aria-hidden, hidden |
| `GSidebar` | `sidebar` | navigation | css | css-ready | `aside` | `g-sidebar` | — | role:complementary, role:navigation, key:Tab, key:ArrowUp, key:ArrowDown, key:Home, key:End, key:Enter, key:Space, key:Escape, aria-label, aria-labelledby, aria-current, aria-disabled, aria-controls, aria-expanded, aria-hidden, hidden |
| `GBreadcrumb` | `breadcrumb` | navigation | css | css-ready | `nav` | `g-breadcrumb` | — | role:navigation, role:list, key:Tab, key:Enter, key:Space, aria-label, aria-labelledby, aria-current, aria-disabled |
| `GTabs` | `tabs` | navigation | interactive | runtime-ready | `div` | `g-tabs` | tabs | role:tablist, role:tab, role:tabpanel, key:ArrowLeft, key:ArrowRight, key:ArrowUp, key:ArrowDown, key:Home, key:End, key:Enter, key:Space, aria-label, aria-labelledby, aria-orientation, aria-selected, aria-controls, aria-disabled, aria-busy, tabindex, hidden, data-g-activation |
| `GSegmentedControl` | `segmented-control` | navigation | interactive | runtime-ready | `div` | `g-segmented` | data-view | role:radiogroup, role:radio, key:ArrowLeft, key:ArrowRight, key:ArrowUp, key:ArrowDown, key:Home, key:End, key:Space, aria-label, aria-labelledby, aria-orientation, aria-checked, aria-disabled, aria-busy, tabindex, data-g-view, data-g-current-view |
| `GPagination` | `pagination` | navigation | css | css-ready | `nav` | `g-pagination` | — | role:navigation, role:list, role:listitem, role:status, key:Tab, key:Enter, key:Space, aria-label, aria-labelledby, aria-current, aria-disabled, aria-busy, aria-live |
| `GMenuDropdown` | `menu-dropdown` | navigation | interactive | runtime-ready | `div` | `g-dropdown` | dropdown | role:menu, role:menuitem, role:menuitemcheckbox, role:menuitemradio, role:group, role:separator, key:ArrowUp, key:ArrowDown, key:ArrowLeft, key:ArrowRight, key:Home, key:End, key:Enter, key:Space, key:Escape, key:Tab, key:Typeahead, aria-haspopup, aria-controls, aria-expanded, aria-labelledby, aria-checked, aria-disabled, aria-busy, hidden, tabindex, data-g-align, data-g-side, data-g-value, data-g-keep-open |
| `GStepper` | `stepper` | navigation | interactive | runtime-ready | `div` | `g-stepper` | stepper | role:list, role:listitem, role:status, key:Tab, key:ArrowLeft, key:ArrowRight, key:ArrowUp, key:ArrowDown, key:Home, key:End, key:Enter, key:Space, aria-label, aria-current, aria-disabled, aria-busy, aria-live, tabindex, data-g-value, data-g-auto-complete |
| `GCommandPalette` | `command-palette` | navigation | interactive | runtime-ready | `div` | `g-command-palette-overlay` | command-palette | role:dialog, role:combobox, role:listbox, role:option, role:status, key:Control+K, key:Meta+K, key:Escape, key:Tab, key:ArrowDown, key:ArrowUp, key:Home, key:End, key:Enter, aria-label, aria-modal, aria-expanded, aria-controls, aria-activedescendant, aria-selected, aria-disabled, aria-busy, aria-live, data-g-value, data-g-keywords, data-g-shortcut, focus-trap |
| `GPrimaryNavigation` | `primary-navigation` | navigation | css | css-ready | `div` | `g-primary-nav` | — | role:navigation, role:list, role:listitem, key:Tab, key:Enter, key:Space, aria-label, aria-labelledby, aria-current, aria-disabled, aria-busy |
| `GUtilityNavigation` | `utility-navigation` | navigation | css | css-ready | `div` | `g-utility-nav` | — | role:navigation, role:list, role:listitem, key:Tab, key:Enter, key:Space, aria-label, aria-labelledby, aria-current, aria-disabled, aria-busy |
| `GSubNavigation` | `sub-navigation` | navigation | css | css-ready | `div` | `g-subnav` | — | role:navigation, role:list, role:listitem, key:Tab, key:Enter, key:Space, aria-label, aria-labelledby, aria-current, aria-disabled, aria-busy |
| `GCollapsibleNavigation` | `collapsible-navigation` | navigation | interactive | runtime-ready | `div` | `g-collapsible-nav` | nav-toggle | role:navigation, role:region, role:list, role:listitem, role:status, key:Tab, key:Enter, key:Space, key:Escape, aria-controls, aria-expanded, aria-hidden, aria-current, aria-disabled, aria-busy, aria-label, aria-labelledby, hidden, data-g-nav-toggle, data-g-collapsible-trigger, data-g-nav-close, data-g-focus-first |
| `GNavigationRail` | `navigation-rail` | navigation | interactive | runtime-ready | `nav` | `g-nav-rail` | roving-nav | role:navigation, role:list, role:listitem, role:status, key:Tab, key:Enter, key:Space, key:ArrowUp, key:ArrowDown, key:Home, key:End, aria-label, aria-labelledby, aria-current, aria-disabled, aria-busy, aria-selected, data-g-roving-nav, data-g-orientation, data-g-selection |
| `GActivityBar` | `activity-bar` | navigation | interactive | runtime-ready | `nav` | `g-activitybar` | roving-nav | role:navigation, role:list, role:listitem, role:status, key:Tab, key:Enter, key:Space, key:ArrowUp, key:ArrowDown, key:Home, key:End, aria-label, aria-labelledby, aria-current, aria-disabled, aria-busy, aria-live, data-g-roving-nav, data-g-orientation |
| `GMenuBar` | `menu-bar` | navigation | interactive | runtime-ready | `nav` | `g-menubar` | roving-nav | role:menubar, role:menu, role:menuitem, role:menuitemcheckbox, role:group, role:separator, role:status, key:Tab, key:Enter, key:Space, key:ArrowLeft, key:ArrowRight, key:ArrowUp, key:ArrowDown, key:Home, key:End, key:Escape, aria-label, aria-labelledby, aria-haspopup, aria-controls, aria-expanded, aria-checked, aria-disabled, aria-busy, data-g-roving-nav, data-g-dropdown, data-g-dropdown-trigger, data-g-dropdown-menu |
| `GContextMenu` | `context-menu` | navigation | interactive | runtime-ready | `div` | `g-context-menu` | context-menu | role:menu, role:menuitem, role:menuitemcheckbox, role:menuitemradio, role:group, role:separator, role:status, key:Shift+F10, key:ContextMenu, key:ArrowUp, key:ArrowDown, key:Home, key:End, key:Enter, key:Space, key:Tab, key:Escape, aria-label, aria-labelledby, aria-haspopup, aria-controls, aria-hidden, aria-checked, aria-disabled, aria-busy, data-g-context-menu, data-g-context-target, data-g-context-menu-panel, data-g-long-press, data-g-long-press-delay, data-g-keep-open, data-g-value |
| `GTreeNavigation` | `tree-navigation` | navigation | interactive | runtime-ready | `div` | `g-tree-nav` | tree | role:tree, role:treeitem, role:group, key:ArrowUp, key:ArrowDown, key:ArrowLeft, key:ArrowRight, key:Home, key:End, key:Enter, key:Space |
| `GVerticalTabs` | `vertical-tabs` | navigation | interactive | runtime-ready | `div` | `g-vertical-tabs` | tabs | role:tablist, role:tab, role:tabpanel, key:ArrowUp, key:ArrowDown, key:Home, key:End |
| `GPillNavigation` | `pill-navigation` | navigation | css | css-ready | `div` | `g-pill-nav` | — | — |
| `GScrollspyNavigation` | `scrollspy-navigation` | navigation | interactive | runtime-ready | `div` | `g-scrollspy-nav` | scrollspy | — |
| `GCursorPagination` | `cursor-pagination` | navigation | css | css-ready | `div` | `g-cursor-pagination` | — | — |
| `GLoadMoreNavigation` | `load-more-navigation` | navigation | css | css-ready | `div` | `g-load-more-nav` | — | — |
| `GWizardNavigation` | `wizard-navigation` | navigation | css | css-ready | `div` | `g-wizard-nav` | — | — |
| `GBackNavigation` | `back-navigation` | navigation | css | css-ready | `div` | `g-back-nav` | — | — |
| `GPreviousNextNavigation` | `previous-next-navigation` | navigation | css | css-ready | `div` | `g-prev-next-nav` | — | — |
| `GSkipNavigation` | `skip-navigation` | navigation | css | css-ready | `div` | `g-skip-nav` | — | — |
| `GMobileTopNavigation` | `mobile-top-navigation` | navigation | css | css-ready | `div` | `g-mobile-top-nav` | — | — |
| `GBottomNavigation` | `bottom-navigation` | navigation | css | css-ready | `div` | `g-bottom-nav` | — | — |
| `GMobileTabBar` | `mobile-tab-bar` | navigation | css | css-ready | `div` | `g-mobile-tab-bar` | — | — |
| `GDrawerNavigation` | `drawer-navigation` | navigation | css | css-ready | `div` | `g-drawer-nav` | — | — |
| `GCommandNavigation` | `command-navigation` | navigation | css | css-ready | `div` | `g-command-nav` | — | — |
| `GJumpNavigation` | `jump-navigation` | navigation | interactive | runtime-ready | `div` | `g-jump-nav` | jump-nav | — |
| `GQuickNavigation` | `quick-navigation` | navigation | css | css-ready | `div` | `g-quick-nav` | — | — |
| `GLocaleNavigation` | `locale-navigation` | navigation | css | css-ready | `div` | `g-locale-nav` | — | — |
| `GAccountNavigation` | `account-navigation` | navigation | css | css-ready | `div` | `g-account-nav` | — | — |
| `GDialog` | `dialog` | overlay | interactive | runtime-ready | `div` | `g-dialog-backdrop` | dialog | role:dialog, key:Escape, key:Tab, focus-trap |
| `GDrawer` | `drawer` | overlay | interactive | runtime-ready | `div` | `g-drawer-backdrop` | drawer | role:dialog, key:Escape, key:Tab, focus-trap |
| `GPopover` | `popover` | overlay | interactive | runtime-ready | `div` | `g-popover` | popover | — |
| `GTooltip` | `tooltip` | overlay | interactive | runtime-ready | `div` | `g-tooltip` | tooltip | role:tooltip, key:Focus, key:Escape |
| `GPopconfirm` | `popconfirm` | overlay | interactive | runtime-ready | `div` | `g-popconfirm` | popover | role:dialog, key:Escape, key:Tab |
| `GConfirmDialog` | `confirm-dialog` | overlay | interactive | runtime-ready | `div` | `g-confirm-dialog-backdrop` | dialog | role:alertdialog, key:Escape, key:Tab, focus-trap |
| `GToast` | `toast` | feedback | interactive | runtime-ready | `div` | `g-toast` | toast | role:status, role:alert, aria-live, aria-atomic, aria-label, aria-labelledby, aria-describedby, aria-busy |
| `GAccordion` | `accordion` | disclosure | interactive | runtime-ready | `div` | `g-accordion` | accordion | key:Enter, key:Space, key:ArrowUp, key:ArrowDown, key:Home, key:End, aria-expanded, aria-controls, aria-labelledby |
| `GTable` | `table` | data | css | css-ready | `table` | `g-table` | — | — |
| `GDataGrid` | `data-grid` | data | interactive | runtime-ready | `div` | `g-data-grid` | data-grid | — |
| `GKpiStat` | `kpi-stat` | dashboard | interactive | runtime-ready | `div` | `g-kpi` | dashboard | — |
| `GDescriptionList` | `description-list` | data | css | css-ready | `div` | `g-description-list` | — | — |
| `GDescriptions` | `descriptions` | data | interactive | runtime-ready | `div` | `g-descriptions` | data-display | — |
| `GList` | `list` | data | interactive | runtime-ready | `div` | `g-list` | data-display | — |
| `GListGroup` | `list-group` | data | css | css-ready | `div` | `g-list-group` | — | — |
| `GTree` | `tree` | data | interactive | runtime-ready | `div` | `g-tree` | tree | — |
| `GTimeline` | `timeline` | data | interactive | runtime-ready | `div` | `g-timeline` | data-display | role:list, role:listitem, key:Tab, key:Enter, key:Space, key:ArrowLeft, key:ArrowRight, key:ArrowUp, key:ArrowDown, key:Home, key:End, aria-label, aria-busy, aria-posinset, aria-setsize |
| `GResponsiveTable` | `responsive-table` | data | interactive | runtime-ready | `div` | `g-responsive-table` | table-scroll | — |
| `GTableSort` | `table-sort` | data | interactive | runtime-ready | `div` | `g-data-scope-table-sort` | table-sort | key:Enter, key:Space, aria-sort |
| `GRowSelection` | `row-selection` | data | interactive | runtime-ready | `div` | `g-data-scope-row-selection` | row-select | key:Space, key:Shift+Click, aria-selected |
| `GRowDisclosure` | `row-disclosure` | data | interactive | runtime-ready | `div` | `g-data-scope-row-disclosure` | row-disclosure | key:Enter, key:Space, key:Escape, aria-controls, aria-expanded |
| `GColumnToggle` | `column-toggle` | data | interactive | runtime-ready | `div` | `g-data-scope-column-toggle` | column-toggle | — |
| `GDataFilter` | `data-filter` | data | interactive | runtime-ready | `div` | `g-data-scope-data-filter` | data-filter | — |
| `GDataView` | `data-view` | data | interactive | runtime-ready | `div` | `g-data-scope-data-view` | data-view | key:ArrowLeft, key:ArrowRight, key:ArrowUp, key:ArrowDown, key:Home, key:End, aria-pressed |
| `GEditableGrid` | `editable-grid` | data | interactive | runtime-ready | `div` | `g-editable-grid` | data-grid | — |
| `GTreeTable` | `tree-table` | data | interactive | runtime-ready | `div` | `g-tree-table` | row-disclosure | — |
| `GGroupedTable` | `grouped-table` | data | interactive | runtime-ready | `div` | `g-grouped-table` | row-disclosure | — |
| `GExpandableTable` | `expandable-table` | data | interactive | runtime-ready | `div` | `g-expandable-table` | row-disclosure | — |
| `GComparisonTable` | `comparison-table` | data | css | css-ready | `div` | `g-comparison-table` | — | — |
| `GKeyValue` | `key-value` | data | css | css-ready | `div` | `g-key-value` | — | — |
| `GRecordDetail` | `record-detail` | data | css | css-ready | `div` | `g-record-detail` | — | — |
| `GMediaList` | `media-list` | data | css | css-ready | `div` | `g-media-list` | — | — |
| `GDenseList` | `dense-list` | data | css | css-ready | `div` | `g-dense-list` | — | — |
| `GAuditLogComposition` | `audit-log-composition` | data | css | css-ready | `div` | `g-audit-log` | — | — |
| `GStatList` | `stat-list` | data | css | css-ready | `div` | `g-stat-list` | — | — |
| `GMetricCard` | `metric-card` | data | css | css-ready | `div` | `g-metric-card` | — | — |
| `GSparkline` | `sparkline` | data | css | css-ready | `div` | `g-sparkline` | — | — |
| `GProgressStats` | `progress-stats` | data | css | css-ready | `div` | `g-progress-stats` | — | — |
| `GDataLegend` | `data-legend` | data | interactive | runtime-ready | `div` | `g-data-legend` | data-display | — |
| `GRanking` | `ranking` | data | css | css-ready | `div` | `g-ranking` | — | — |
| `GStatusSummary` | `status-summary` | data | css | css-ready | `div` | `g-status-summary` | — | — |
| `GDataMatrix` | `data-matrix` | data | css | css-ready | `div` | `g-data-matrix` | — | — |
| `GHeatmap` | `heatmap` | data | css | css-ready | `div` | `g-heatmap` | — | — |
| `GDataToolbar` | `data-toolbar` | data | css | css-ready | `div` | `g-data-toolbar` | — | — |
| `GColumnChooser` | `column-chooser` | data | css | css-ready | `div` | `g-column-chooser` | — | — |
| `GSavedViews` | `saved-views` | interaction | interactive | runtime-ready | `div` | `g-saved-views` | saved-choice, interaction | — |
| `GExportPanel` | `export-panel` | data | interactive | runtime-ready | `div` | `g-export-panel` | data-display | — |
| `GDataState` | `data-state` | data | css | css-ready | `div` | `g-data-state` | — | — |
| `GDataViewSwitcher` | `data-view-switcher` | data | css | css-ready | `div` | `g-data-view-switcher` | — | — |
| `GSelectionSummary` | `selection-summary` | data | css | css-ready | `div` | `g-selection-summary` | — | — |
| `GTableDensity` | `table-density` | data | interactive | runtime-ready | `div` | `g-table-density` | table-density | — |
| `GFilterSummary` | `filter-summary` | data | interactive | runtime-ready | `div` | `g-filter-summary` | filter-summary | — |
| `GSortBuilder` | `sort-builder` | interaction | interactive | runtime-ready | `div` | `g-sort-builder` | builder-list, interaction | — |
| `GDataInspector` | `data-inspector` | data | interactive | runtime-ready | `div` | `g-data-inspector` | data-display | — |
| `GSelectionControls` | `selection-controls` | interaction | interactive | runtime-ready | `div` | `g-selection-control` | row-select, interaction | key:Space, key:Shift+Click, aria-selected |
| `GBatchToolbar` | `batch-toolbar` | interaction | interactive | runtime-ready | `div` | `g-batch-toolbar` | interaction | — |
| `GDualList` | `dual-list` | interaction | interactive | runtime-ready | `div` | `g-dual-list` | transfer, interaction | key:Control+ArrowLeft, key:Control+ArrowRight |
| `GTreeSelect` | `tree-select` | interaction | interactive | runtime-ready | `div` | `g-tree-select` | picker, interaction | role:combobox, role:tree, role:treeitem, role:group, key:ArrowUp, key:ArrowDown, key:ArrowLeft, key:ArrowRight, key:Home, key:End, key:Enter, key:Space, key:Escape, aria-label, aria-labelledby, aria-describedby, aria-expanded, aria-selected, aria-checked, aria-multiselectable, aria-disabled, aria-invalid, aria-busy, data-g-picker-tree, data-g-picker-multiple, data-g-picker-cascade, data-g-tree-value-strategy, data-g-picker-clear, data-g-tree-toggle |
| `GCascader` | `cascader` | interaction | interactive | runtime-ready | `div` | `g-cascader` | cascader, interaction | key:ArrowLeft, key:ArrowRight, key:Enter, key:Space |
| `GMentionPicker` | `mention-picker` | interaction | interactive | runtime-ready | `div` | `g-mention-picker` | picker, interaction | — |
| `GUserPicker` | `user-picker` | interaction | interactive | runtime-ready | `div` | `g-user-picker` | picker, interaction | — |
| `GOrganizationPicker` | `organization-picker` | interaction | interactive | runtime-ready | `div` | `g-organization-picker` | picker, interaction | — |
| `GResourcePicker` | `resource-picker` | interaction | interactive | runtime-ready | `div` | `g-resource-picker` | picker, interaction | — |
| `GMediaPicker` | `media-picker` | interaction | interactive | runtime-ready | `div` | `g-media-picker` | picker, interaction | — |
| `GIconPicker` | `icon-picker` | interaction | interactive | runtime-ready | `div` | `g-icon-picker` | saved-choice, interaction | — |
| `GColorPickerComposition` | `color-picker-composition` | interaction | interactive | runtime-ready | `div` | `g-color-picker` | saved-choice, interaction | — |
| `GDateRangePickerComposition` | `date-range-picker-composition` | interaction | interactive | runtime-ready | `div` | `g-date-range-picker` | range-picker, interaction | — |
| `GTimeRangePickerComposition` | `time-range-picker-composition` | interaction | interactive | runtime-ready | `div` | `g-time-range-picker` | range-picker, interaction | — |
| `GSavedFilters` | `saved-filters` | interaction | interactive | runtime-ready | `div` | `g-saved-filters` | saved-choice, interaction | — |
| `GGroupBuilder` | `group-builder` | interaction | interactive | runtime-ready | `div` | `g-group-builder` | builder-list, interaction | — |
| `GEntityPicker` | `entity-picker` | interaction | interactive | runtime-ready | `div` | `g-entity-picker` | picker, interaction | — |
| `GTagPicker` | `tag-picker` | interaction | interactive | runtime-ready | `div` | `g-tag-picker` | picker, interaction | — |
| `GRelationPicker` | `relation-picker` | interaction | interactive | runtime-ready | `div` | `g-relation-picker` | picker, interaction | — |
| `GBulkConfirmation` | `bulk-confirmation` | interaction | interactive | runtime-ready | `div` | `g-bulk-confirmation` | interaction | — |
| `GBulkProgress` | `bulk-progress` | interaction | interactive | runtime-ready | `div` | `g-bulk-progress` | interaction | — |
| `GFilterBar` | `filter-bar` | dashboard | interactive | runtime-ready | `div` | `g-filter-bar` | dashboard | — |
| `GCodeBlock` | `code-block` | content | interactive | runtime-ready | `div` | `g-code-block` | content | — |
| `GTerminal` | `terminal` | content | interactive | runtime-ready | `div` | `g-terminal` | content | — |
| `GDiffViewer` | `diff-viewer` | content | interactive | runtime-ready | `div` | `g-diff` | content | — |
| `GChartContainer` | `chart-container` | dashboard | interactive | runtime-ready | `div` | `g-chart` | dashboard | — |
| `GGridSystem` | `grid-system` | layout | interactive | runtime-ready | `div` | `g-grid-24` | layout | — |
| `GRegionLayoutSystem` | `region-layout-system` | layout | interactive | runtime-ready | `div` | `g-region-frame` | layout | — |
| `GClassicLayoutPrimitives` | `classic-layout-primitives` | layout | interactive | runtime-ready | `div` | `g-stack` | layout | — |
| `GPageHeader` | `page-header` | layout | interactive | runtime-ready | `div` | `g-page-header` | layout | — |
| `GSectionHeader` | `section-header` | layout | interactive | runtime-ready | `div` | `g-section-header` | layout | — |
| `GSubheader` | `subheader` | layout | interactive | runtime-ready | `div` | `g-subheader` | layout | — |
| `GToolbar` | `toolbar` | navigation | css | css-ready | `div` | `g-toolbar` | — | — |
| `GActionBar` | `action-bar` | interaction | interactive | runtime-ready | `div` | `g-action-bar` | interaction | — |
| `GStatusBar` | `status-bar` | feedback | css | css-ready | `div` | `g-status-bar` | — | role:status, role:toolbar, role:contentinfo, aria-label, aria-labelledby, aria-live, aria-atomic, aria-busy, aria-current, aria-pressed, aria-disabled |
| `GCommandBar` | `command-bar` | navigation | css | css-ready | `div` | `g-command-bar` | — | — |
| `GContextBar` | `context-bar` | feedback | css | css-ready | `div` | `g-context-bar` | — | role:status, role:alert, role:region, aria-label, aria-labelledby, aria-describedby, aria-live, aria-atomic, aria-busy, aria-disabled |
| `GBulkActionBar` | `bulk-action-bar` | interaction | interactive | runtime-ready | `div` | `g-bulk-action-bar` | interaction | — |
| `GFooterBar` | `footer-bar` | layout | interactive | runtime-ready | `div` | `g-footer-bar` | layout | — |
| `GFloatingActionBar` | `floating-action-bar` | interaction | interactive | runtime-ready | `div` | `g-floating-action-bar` | interaction | — |
| `GDividerWithText` | `divider-with-text` | basic | css | css-ready | `div` | `g-divider` | — | role:separator, role:presentation, aria-label, aria-labelledby, aria-orientation, aria-hidden |
| `GStickyActions` | `sticky-actions` | interaction | interactive | runtime-ready | `div` | `g-sticky-actions` | interaction | — |
| `GPageLoading` | `page-loading` | feedback | css | css-ready | `div` | `g-page-loading` | — | role:status, role:progressbar, role:alert, aria-label, aria-labelledby, aria-describedby, aria-live, aria-atomic, aria-busy, aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext, aria-disabled |
| `GPageStateSystem` | `page-state-system` | feedback | css | css-ready | `div` | `g-page-state` | — | role:status, role:alert, role:region, aria-label, aria-labelledby, aria-describedby, aria-live, aria-atomic, aria-hidden, aria-disabled |
| `GTip` | `tip` | help | interactive | runtime-ready | `div` | `g-tip` | help | — |
| `GInlineHint` | `inline-hint` | help | interactive | runtime-ready | `div` | `g-inline-hint` | help | — |
| `GHelpText` | `help-text` | help | interactive | runtime-ready | `div` | `g-help-text` | help | — |
| `GHelpTrigger` | `help-trigger` | help | interactive | runtime-ready | `div` | `g-help-trigger` | help | — |
| `GRichTooltip` | `rich-tooltip` | help | interactive | runtime-ready | `div` | `g-tooltip-rich` | tooltip, help | — |
| `GHelpPopover` | `help-popover` | help | interactive | runtime-ready | `div` | `g-help-popover` | popover, help | key:Enter, key:Space, key:Escape |
| `GDefinitionHelp` | `definition-help` | help | interactive | runtime-ready | `div` | `g-definition` | help | — |
| `GCallout` | `callout` | help | interactive | runtime-ready | `div` | `g-callout` | help | — |
| `GNote` | `note` | help | interactive | runtime-ready | `div` | `g-note` | help | — |
| `GGuidancePair` | `guidance-pair` | help | interactive | runtime-ready | `div` | `g-guidance-pair` | help | — |
| `GKeyHint` | `key-hint` | help | interactive | runtime-ready | `div` | `g-key-hint` | help | — |
| `GShortcutList` | `shortcut-list` | help | interactive | runtime-ready | `div` | `g-shortcut-list` | help | — |
| `GHelpCard` | `help-card` | help | interactive | runtime-ready | `div` | `g-help-card` | help | — |
| `GHelpPanel` | `help-panel` | help | interactive | runtime-ready | `div` | `g-help-panel` | help | — |
| `GHelpCenter` | `help-center` | help | interactive | runtime-ready | `div` | `g-help-center` | help | — |
| `GHelpTopics` | `help-topics` | help | interactive | runtime-ready | `div` | `g-help-topics` | help | — |
| `GFaq` | `faq` | help | interactive | runtime-ready | `div` | `g-faq` | accordion, help | key:Enter, key:Space |
| `GContextualHelp` | `contextual-help` | help | interactive | runtime-ready | `div` | `g-contextual-help` | help | — |
| `GCoachMark` | `coach-mark` | help | interactive | runtime-ready | `div` | `g-coach-mark` | help | — |
| `GSpotlight` | `spotlight` | help | interactive | runtime-ready | `div` | `g-spotlight` | help | — |
| `GHotspot` | `hotspot` | help | interactive | runtime-ready | `div` | `g-hotspot` | help | — |
| `GFeatureHint` | `feature-hint` | help | interactive | runtime-ready | `div` | `g-feature-hint` | help | — |
| `GWhatsNew` | `whats-new` | help | interactive | runtime-ready | `div` | `g-whats-new` | help | — |
| `GHelpChecklist` | `help-checklist` | help | interactive | runtime-ready | `div` | `g-help-checklist` | help | — |
| `GTroubleshooting` | `troubleshooting` | help | interactive | runtime-ready | `div` | `g-troubleshooting` | help | — |
| `GHelpFeedback` | `help-feedback` | help | interactive | runtime-ready | `div` | `g-help-feedback` | saved-choice, help | — |
| `GAppShell` | `app-shell` | layout | interactive | runtime-ready | `div` | `g-app-shell` | layout | — |
| `GDashboard` | `dashboard` | layout | interactive | runtime-ready | `div` | `g-dashboard` | layout | — |
| `GMobileShell` | `mobile-shell` | layout | interactive | runtime-ready | `div` | `g-mobile-shell` | layout | — |
| `GChat` | `chat` | ai | interactive | runtime-ready | `div` | `g-chat` | ai | — |
| `GMessage` | `message` | ai | interactive | runtime-ready | `div` | `g-message` | ai | — |
| `GPromptComposer` | `prompt-composer` | ai | interactive | runtime-ready | `div` | `g-composer` | ai-composer, ai | — |
| `GAttachment` | `attachment` | ai | interactive | runtime-ready | `div` | `g-attachment` | ai | — |
| `GThinking` | `thinking` | ai | interactive | runtime-ready | `div` | `g-thinking` | accordion, ai | — |
| `GToolCall` | `tool-call` | ai | interactive | runtime-ready | `div` | `g-tool-call` | accordion, ai | — |
| `GToolApproval` | `tool-approval` | ai | interactive | runtime-ready | `div` | `g-approval` | ai-approval, ai | — |
| `GAgentStatus` | `agent-status` | ai | interactive | runtime-ready | `div` | `g-agent-status` | ai | — |
| `GAgentPlan` | `agent-plan` | ai | interactive | runtime-ready | `div` | `g-plan` | ai | — |
| `GSourcesCitations` | `sources-citations` | ai | interactive | runtime-ready | `div` | `g-sources` | ai | — |
| `GArtifactPanel` | `artifact-panel` | ai | interactive | runtime-ready | `div` | `g-artifact-panel` | tabs, ai | — |
| `GModelSelector` | `model-selector` | ai | interactive | runtime-ready | `div` | `g-model-selector` | dropdown, ai | — |
| `GContextMeter` | `context-meter` | ai | interactive | runtime-ready | `div` | `g-context-meter` | ai | — |
| `GVoiceState` | `voice-state` | ai | interactive | runtime-ready | `div` | `g-voice-state` | ai | — |
| `GGenerationPlaceholder` | `generation-placeholder` | ai | interactive | runtime-ready | `div` | `g-generation-placeholder` | ai | — |
| `GAiWorkspace` | `ai-workspace` | ai | interactive | runtime-ready | `div` | `g-ai-shell` | ai | — |
| `GPromptStarter` | `prompt-starter` | ai | interactive | runtime-ready | `div` | `g-prompt-starter` | prompt-fill, ai | — |
| `GAiCommandMenu` | `ai-command-menu` | ai | interactive | runtime-ready | `div` | `g-ai-command-menu` | roving-nav, ai | — |
| `GStreamingResponse` | `streaming-response` | ai | interactive | runtime-ready | `div` | `g-streaming-response` | ai | — |
| `GMultiAgentBoard` | `multi-agent-board` | ai | interactive | runtime-ready | `div` | `g-agent-board` | ai | — |
| `GAgentHandoff` | `agent-handoff` | ai | interactive | runtime-ready | `div` | `g-agent-handoff` | ai | — |
| `GArtifactWorkspace` | `artifact-workspace` | ai | interactive | runtime-ready | `div` | `g-artifact-layout` | ai | — |
| `GGenerationGallery` | `generation-gallery` | ai | interactive | runtime-ready | `div` | `g-generation-grid` | ai | — |
| `GAiContextManager` | `ai-context-manager` | ai | interactive | runtime-ready | `div` | `g-ai-context-manager` | ai | — |
| `GAiUsagePanel` | `ai-usage-panel` | ai | interactive | runtime-ready | `div` | `g-ai-usage-panel` | ai | — |
| `GAiSafetyNotice` | `ai-safety-notice` | ai | interactive | runtime-ready | `div` | `g-ai-safety-notice` | ai | — |
| `GAiFeedback` | `ai-feedback` | ai | interactive | runtime-ready | `div` | `g-ai-feedback` | ai-feedback, ai | — |
| `GDatePicker` | `date-picker` | form | interactive | runtime-ready | `div` | `g-date-picker` | picker | role:group, role:grid, role:row, role:columnheader, role:gridcell, role:status, aria-label, aria-labelledby, aria-describedby, aria-selected, aria-current, aria-disabled, aria-live, aria-invalid, aria-readonly |
| `GTimePicker` | `time-picker` | form | interactive | runtime-ready | `div` | `g-time-picker` | wheel-picker | role:group, role:listbox, role:option, role:status, aria-label, aria-labelledby, aria-describedby, aria-expanded, aria-controls, aria-selected, aria-disabled, aria-invalid, aria-readonly, aria-live |
| `GPinInput` | `pin-input` | form | interactive | runtime-ready | `div` | `g-pin-input` | otp-input | role:group, role:status, key:ArrowLeft, key:ArrowRight, key:Home, key:End, key:Backspace, key:Delete, key:Paste, aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-readonly, aria-live |
| `GRating` | `rating` | form | interactive | runtime-ready | `div` | `g-rating` | rating | role:radiogroup, role:radio, role:status, key:ArrowLeft, key:ArrowRight, key:ArrowUp, key:ArrowDown, key:Home, key:End, key:Space, key:Enter, aria-label, aria-labelledby, aria-describedby, aria-checked, aria-disabled, aria-readonly, aria-invalid, aria-live |
| `GTransferList` | `transfer-list` | interaction | interactive | runtime-ready | `div` | `g-transfer` | transfer, interaction | key:Control+ArrowLeft, key:Control+ArrowRight |
| `GValidationSummary` | `validation-summary` | form | interactive | runtime-ready | `div` | `g-validation-summary` | validation-summary | role:alert, role:status, role:list, key:Tab, key:Enter, key:Space, aria-labelledby, aria-describedby, aria-live, aria-atomic, aria-invalid, aria-hidden, hidden |
| `GMegaMenu` | `mega-menu` | navigation | css | css-ready | `div` | `g-mega-menu` | — | — |
| `GAnchorNavigation` | `anchor-navigation` | navigation | css | css-ready | `div` | `g-anchor-nav` | — | — |
| `GTourSpotlight` | `tour-spotlight` | help | interactive | runtime-ready | `div` | `g-tour` | tour, help | role:dialog, key:Escape |
| `GVirtualList` | `virtual-list` | data | interactive | runtime-ready | `div` | `g-virtual-list` | data-display | — |
| `GKanban` | `kanban` | data | interactive | runtime-ready | `div` | `g-kanban` | data-display | — |
| `GGanttShell` | `gantt-shell` | data | interactive | runtime-ready | `div` | `g-gantt` | data-display | — |
| `GQueryBuilder` | `query-builder` | data | interactive | runtime-ready | `div` | `g-query-builder` | data-display | — |
| `GCarousel` | `carousel` | media | interactive | runtime-ready | `div` | `g-carousel` | carousel, media | — |
| `GGalleryLightbox` | `gallery-lightbox` | media | interactive | runtime-ready | `div` | `g-gallery` | media | — |
| `GMediaPlayer` | `media-player` | media | interactive | runtime-ready | `div` | `g-media-player` | media | — |
| `GDocumentViewer` | `document-viewer` | media | interactive | runtime-ready | `div` | `g-document-viewer` | media | — |
| `GSplitPane` | `split-pane` | interaction | interactive | runtime-ready | `div` | `g-split-pane` | split-pane, interaction | — |
| `GDragSort` | `drag-sort` | interaction | interactive | runtime-ready | `div` | `g-sortable-item` | interaction | — |
| `GInfiniteScroll` | `infinite-scroll` | interaction | interactive | runtime-ready | `div` | `g-infinite-status` | interaction | — |
| `GPullRefresh` | `pull-refresh` | interaction | interactive | runtime-ready | `div` | `g-pull-refresh` | interaction | — |
| `GProductCard` | `product-card` | commerce | interactive | runtime-ready | `div` | `g-product-card` | commerce | — |
| `GCartItem` | `cart-item` | commerce | interactive | runtime-ready | `div` | `g-cart-item` | commerce | — |
| `GPriceQuantity` | `price-quantity` | commerce | interactive | runtime-ready | `div` | `g-price` | commerce | — |
| `GConversationList` | `conversation-list` | ai | interactive | runtime-ready | `div` | `g-conversation-list` | ai | — |
| `GPromptLibrary` | `prompt-library` | ai | interactive | runtime-ready | `div` | `g-prompt-library` | ai | — |
| `GMentionSlashCommand` | `mention-slash-command` | ai | interactive | runtime-ready | `div` | `g-mention` | ai | — |
| `GGenerationCard` | `generation-card` | ai | interactive | runtime-ready | `div` | `g-generation-card` | ai | — |
| `GFileTree` | `file-tree` | ai | interactive | runtime-ready | `div` | `g-file-tree` | ai | — |
| `GVersionHistory` | `version-history` | ai | interactive | runtime-ready | `div` | `g-version-list` | ai | — |
| `GPermissionScope` | `permission-scope` | ai | interactive | runtime-ready | `div` | `g-permission-scope` | ai | — |
| `GCostRateLimit` | `cost-rate-limit` | ai | interactive | runtime-ready | `div` | `g-cost` | ai | — |
| `GPrivacyNotice` | `privacy-notice` | ai | interactive | runtime-ready | `div` | `g-privacy-notice` | ai | — |
| `GAuthenticationShell` | `authentication-shell` | auth | interactive | runtime-ready | `div` | `g-auth-shell` | auth | — |
| `GMobileCategory` | `mobile-category` | mobile | interactive | runtime-ready | `div` | `g-mobile-category` | mobile | — |
| `GCmsShell` | `cms-shell` | cms | interactive | runtime-ready | `div` | `g-cms-shell` | cms | — |
| `GVisualBuilder` | `visual-builder` | cms | interactive | runtime-ready | `div` | `g-cms-canvas` | cms | — |
| `GRichEditor` | `rich-editor` | cms | interactive | runtime-ready | `div` | `g-editor` | cms | — |
| `GMediaLibrary` | `media-library` | cms | interactive | runtime-ready | `div` | `g-media-library` | cms | — |
| `GContentWorkflow` | `content-workflow` | cms | interactive | runtime-ready | `div` | `g-workflow` | cms | — |
| `GLocalizationGrid` | `localization-grid` | cms | interactive | runtime-ready | `div` | `g-localization-grid` | cms | — |
| `GSiteHeader` | `site-header` | marketing | interactive | runtime-ready | `div` | `g-site-header` | marketing | — |
| `GHero` | `hero` | marketing | interactive | runtime-ready | `div` | `g-hero` | marketing | — |
| `GPricing` | `pricing` | marketing | interactive | runtime-ready | `div` | `g-pricing-grid` | marketing | — |
| `GArticleLayout` | `article-layout` | content | interactive | runtime-ready | `div` | `g-article-shell` | content | — |
| `GProductDetail` | `product-detail` | commerce | interactive | runtime-ready | `div` | `g-product-detail` | commerce | — |
| `GCheckout` | `checkout` | commerce | interactive | runtime-ready | `div` | `g-checkout-layout` | commerce | — |
| `GEnterpriseSettings` | `enterprise-settings` | enterprise | interactive | runtime-ready | `div` | `g-settings-shell` | enterprise | — |
| `GPermissionMatrix` | `permission-matrix` | enterprise | interactive | runtime-ready | `div` | `g-permission-matrix` | enterprise | — |
| `GAuditLog` | `audit-log` | enterprise | interactive | runtime-ready | `div` | `g-audit-event` | enterprise | — |
| `GDesktopShell` | `desktop-shell` | desktop | interactive | runtime-ready | `div` | `g-desktop-shell` | desktop | — |
| `GDesktopTitlebar` | `desktop-titlebar` | desktop | interactive | runtime-ready | `div` | `g-titlebar` | desktop | — |
| `GDesktopWorkbench` | `desktop-workbench` | desktop | interactive | runtime-ready | `div` | `g-workbench` | desktop | — |
| `GOnboarding` | `onboarding` | workflow | interactive | runtime-ready | `div` | `g-onboarding` | workflow | — |
| `GWizardLayout` | `wizard-layout` | workflow | interactive | runtime-ready | `div` | `g-wizard-layout` | workflow | — |
| `GNotificationCenter` | `notification-center` | communication | interactive | runtime-ready | `div` | `g-notification-center` | communication | — |
| `GInbox` | `inbox` | communication | interactive | runtime-ready | `div` | `g-inbox` | communication | — |
| `GSearchResults` | `search-results` | content | interactive | runtime-ready | `div` | `g-search-page` | content | — |
| `GCalendar` | `calendar` | data | interactive | runtime-ready | `div` | `g-calendar` | data-display | — |
| `GAgenda` | `agenda` | data | interactive | runtime-ready | `div` | `g-agenda` | data-display | — |
| `GFileManager` | `file-manager` | data | interactive | runtime-ready | `div` | `g-file-manager` | data-display | — |
| `GUploadQueue` | `upload-queue` | form | interactive | runtime-ready | `div` | `g-upload-queue` | upload-manager | role:region, role:list, role:listitem, role:progressbar, role:status, key:Tab, key:Enter, key:Space, aria-label, aria-labelledby, aria-describedby, aria-busy, aria-disabled, aria-live, aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext, hidden |
| `GFormBuilder` | `form-builder` | form | interactive | runtime-ready | `div` | `g-form-builder` | builder-list | role:region, role:toolbar, role:list, role:listitem, role:status, key:Tab, key:Enter, key:Space, key:Alt+ArrowUp, key:Alt+ArrowDown, aria-label, aria-labelledby, aria-describedby, aria-selected, aria-disabled, aria-readonly, aria-live, hidden |
| `GFilterBuilder` | `filter-builder` | data | interactive | runtime-ready | `div` | `g-filter-builder` | data-display | — |
| `GPivotTable` | `pivot-table` | data | interactive | runtime-ready | `div` | `g-pivot` | data-display | — |
| `GOrganizationChart` | `organization-chart` | data | css | css-ready | `div` | `g-org-chart` | — | — |
| `GMapShell` | `map-shell` | data | interactive | runtime-ready | `div` | `g-map-shell` | data-display | — |
| `GCommentThread` | `comment-thread` | communication | interactive | runtime-ready | `div` | `g-comment-thread` | communication | — |
| `GActivityFeed` | `activity-feed` | communication | interactive | runtime-ready | `div` | `g-activity-feed` | communication | — |
| `GReportInvoice` | `report-invoice` | content | interactive | runtime-ready | `div` | `g-report` | content | — |
| `GCookieConsent` | `cookie-consent` | legal | interactive | runtime-ready | `div` | `g-cookie-banner` | legal | — |
| `GCopyAction` | `copy-action` | interaction | interactive | runtime-ready | `div` | `g-copy-action` | copy, interaction | — |
| `GFullscreenAction` | `fullscreen-action` | interaction | interactive | runtime-ready | `div` | `g-fullscreen-action` | fullscreen, interaction | — |
| `GBackToTop` | `back-to-top` | navigation | interactive | runtime-ready | `div` | `g-back-to-top` | scroll-top | — |
| `GImageCropShell` | `image-crop-shell` | media | interactive | runtime-ready | `div` | `g-image-crop` | media | — |
| `GContentFileDrop` | `content-file-drop` | content | interactive | runtime-ready | `div` | `g-file-drop` | dropzone, content | — |
| `GContentFileList` | `content-file-list` | content | interactive | runtime-ready | `div` | `g-file-list` | content | — |
| `GContentUploadQueue` | `content-upload-queue` | content | interactive | runtime-ready | `div` | `g-upload-queue` | upload-manager, content | — |
| `GChunkUpload` | `chunk-upload` | content | interactive | runtime-ready | `div` | `g-chunk-upload` | content | — |
| `GUploadProgressComposition` | `upload-progress-composition` | content | interactive | runtime-ready | `div` | `g-upload-progress` | upload-manager, content | — |
| `GFailedUpload` | `failed-upload` | content | interactive | runtime-ready | `div` | `g-failed-upload` | upload-manager, content | — |
| `GFileCardComposition` | `file-card-composition` | content | interactive | runtime-ready | `div` | `g-file-card` | content | — |
| `GFolderTreeComposition` | `folder-tree-composition` | content | interactive | runtime-ready | `div` | `g-folder-tree` | content | — |
| `GFileBrowserComposition` | `file-browser-composition` | content | interactive | runtime-ready | `div` | `g-file-browser` | file-browser, content | — |
| `GFilePreviewComposition` | `file-preview-composition` | content | interactive | runtime-ready | `div` | `g-file-preview` | content | — |
| `GMediaLibraryComposition` | `media-library-composition` | content | interactive | runtime-ready | `div` | `g-media-library` | file-browser, content | — |
| `GMediaGridComposition` | `media-grid-composition` | content | interactive | runtime-ready | `div` | `g-media-grid` | content | — |
| `GMediaDetailsComposition` | `media-details-composition` | content | interactive | runtime-ready | `div` | `g-media-details` | content | — |
| `GImageCropComposition` | `image-crop-composition` | content | interactive | runtime-ready | `div` | `g-content-image-crop` | content | — |
| `GImageAnnotationComposition` | `image-annotation-composition` | content | interactive | runtime-ready | `div` | `g-image-annotation` | content | — |
| `GDocumentViewerComposition` | `document-viewer-composition` | content | interactive | runtime-ready | `div` | `g-content-document-viewer` | content | — |
| `GPdfViewer` | `pdf-viewer` | content | interactive | runtime-ready | `div` | `g-pdf-viewer` | content | — |
| `GVideoPlayerShell` | `video-player-shell` | content | interactive | runtime-ready | `div` | `g-video-player` | media-player, content | — |
| `GAudioPlayerShell` | `audio-player-shell` | content | interactive | runtime-ready | `div` | `g-audio-player` | media-player, content | — |
| `GCodeEditorShell` | `code-editor-shell` | content | interactive | runtime-ready | `div` | `g-code-editor` | editor-shell, content | — |
| `GRichTextEditorComposition` | `rich-text-editor-composition` | content | interactive | runtime-ready | `div` | `g-rich-text-editor` | editor-shell, content | — |
| `GMarkdownEditor` | `markdown-editor` | content | interactive | runtime-ready | `div` | `g-markdown-editor` | editor-shell, content | — |
| `GBlockEditor` | `block-editor` | content | interactive | runtime-ready | `div` | `g-block-editor` | editor-shell, content | — |
| `GRevisionCompareComposition` | `revision-compare-composition` | content | interactive | runtime-ready | `div` | `g-revision-compare` | revision-compare, content | — |
| `GContentAutosaveIndicator` | `content-autosave-indicator` | content | interactive | runtime-ready | `div` | `g-autosave-indicator` | autosave, content | — |
| `GContentOutline` | `content-outline` | content | interactive | runtime-ready | `div` | `g-content-outline` | content | — |
| `GEditorToolbarComposition` | `editor-toolbar-composition` | content | interactive | runtime-ready | `div` | `g-editor-toolbar` | editor-shell, content | — |
| `GFindReplace` | `find-replace` | content | interactive | runtime-ready | `div` | `g-find-replace` | content | — |
| `GCommentThreadComposition` | `comment-thread-composition` | content | interactive | runtime-ready | `div` | `g-content-comment-thread` | content | — |
| `GVersionHistoryComposition` | `version-history-composition` | content | interactive | runtime-ready | `div` | `g-version-history` | content | — |
| `GFileProperties` | `file-properties` | content | interactive | runtime-ready | `div` | `g-file-properties` | content | — |
| `GStorageMeter` | `storage-meter` | content | interactive | runtime-ready | `div` | `g-storage-meter` | content | — |
| `GAuthCentered` | `auth-centered` | auth | interactive | runtime-ready | `div` | `g-auth-centered` | auth | — |
| `GAuthSplit` | `auth-split` | auth | interactive | runtime-ready | `div` | `g-auth-split` | auth | — |
| `GSignInComposition` | `sign-in-composition` | auth | interactive | runtime-ready | `div` | `g-sign-in` | auth | — |
| `GRegistrationComposition` | `registration-composition` | auth | interactive | runtime-ready | `div` | `g-registration` | auth | — |
| `GPasswordRecovery` | `password-recovery` | auth | interactive | runtime-ready | `div` | `g-password-recovery` | auth | — |
| `GPasswordReset` | `password-reset` | auth | interactive | runtime-ready | `div` | `g-password-reset` | auth | — |
| `GEmailVerification` | `email-verification` | auth | interactive | runtime-ready | `div` | `g-email-verification` | auth | — |
| `GPhoneVerification` | `phone-verification` | auth | interactive | runtime-ready | `div` | `g-phone-verification` | auth | — |
| `GMfaChallenge` | `mfa-challenge` | auth | interactive | runtime-ready | `div` | `g-mfa-challenge` | auth | — |
| `GOtpInput` | `otp-input` | auth | interactive | runtime-ready | `div` | `g-otp-input` | otp-input, auth | key:ArrowLeft, key:ArrowRight, key:Home, key:End, key:Backspace, key:Paste |
| `GPasskeyComposition` | `passkey-composition` | auth | interactive | runtime-ready | `div` | `g-passkey` | auth | — |
| `GSsoComposition` | `sso-composition` | auth | interactive | runtime-ready | `div` | `g-sso` | auth | — |
| `GQrLogin` | `qr-login` | auth | interactive | runtime-ready | `div` | `g-qr-login` | auth-timer, auth | — |
| `GMagicLink` | `magic-link` | auth | interactive | runtime-ready | `div` | `g-magic-link` | auth | — |
| `GInvitationComposition` | `invitation-composition` | auth | interactive | runtime-ready | `div` | `g-invitation` | auth | — |
| `GFirstTimeSetup` | `first-time-setup` | auth | interactive | runtime-ready | `div` | `g-first-time-setup` | auth | — |
| `GLockScreen` | `lock-screen` | auth | interactive | runtime-ready | `div` | `g-lock-screen` | auth | — |
| `GSessionExpired` | `session-expired` | auth | interactive | runtime-ready | `div` | `g-session-expired` | auth | — |
| `GAccountChooser` | `account-chooser` | auth | interactive | runtime-ready | `div` | `g-account-chooser` | saved-choice, auth | — |
| `GTenantChooser` | `tenant-chooser` | auth | interactive | runtime-ready | `div` | `g-tenant-chooser` | saved-choice, auth | — |
| `GIdentitySwitcher` | `identity-switcher` | auth | interactive | runtime-ready | `div` | `g-identity-switcher` | dropdown, auth | — |
| `GProfileSetup` | `profile-setup` | auth | interactive | runtime-ready | `div` | `g-profile-setup` | auth | — |
| `GAccountSecurity` | `account-security` | auth | interactive | runtime-ready | `div` | `g-account-security` | auth | — |
| `GDeviceManagement` | `device-management` | auth | interactive | runtime-ready | `div` | `g-device-management` | auth | — |
| `GLoginActivity` | `login-activity` | auth | interactive | runtime-ready | `div` | `g-login-activity` | auth | — |
| `GSecurityAlert` | `security-alert` | auth | interactive | runtime-ready | `div` | `g-security-alert` | auth | — |
| `GRecoveryCodes` | `recovery-codes` | auth | interactive | runtime-ready | `div` | `g-recovery-codes` | auth | — |
| `GTrustedDevice` | `trusted-device` | auth | interactive | runtime-ready | `div` | `g-trusted-device` | auth | — |
| `GConnectedAccounts` | `connected-accounts` | auth | interactive | runtime-ready | `div` | `g-connected-accounts` | auth | — |
| `GPasswordStrength` | `password-strength` | auth | interactive | runtime-ready | `div` | `g-password-strength` | password-strength, auth | — |
| `GAuthConsent` | `auth-consent` | auth | interactive | runtime-ready | `div` | `g-auth-consent` | auth | — |
| `GAuthResult` | `auth-result` | auth | interactive | runtime-ready | `div` | `g-auth-result` | auth | — |
| `GCommerceProductCard` | `commerce-product-card` | commerce | interactive | runtime-ready | `div` | `g-commerce-product-card` | commerce | — |
| `GCommerceProductList` | `commerce-product-list` | commerce | interactive | runtime-ready | `div` | `g-commerce-product-list` | commerce | — |
| `GCommerceProductDetail` | `commerce-product-detail` | commerce | interactive | runtime-ready | `div` | `g-commerce-product-detail` | commerce | — |
| `GCommerceProductGallery` | `commerce-product-gallery` | commerce | interactive | runtime-ready | `div` | `g-commerce-product-gallery` | carousel, commerce | — |
| `GSkuSelector` | `sku-selector` | commerce | interactive | runtime-ready | `div` | `g-sku-selector` | sku-selector, commerce | — |
| `GCommerceQuantityStepper` | `commerce-quantity-stepper` | commerce | interactive | runtime-ready | `div` | `g-quantity-stepper` | quantity-stepper, commerce | — |
| `GPriceDisplay` | `price-display` | commerce | interactive | runtime-ready | `div` | `g-price-display` | commerce | — |
| `GCommerceCartItem` | `commerce-cart-item` | commerce | interactive | runtime-ready | `div` | `g-commerce-cart-item` | commerce | — |
| `GCommerceCart` | `commerce-cart` | commerce | interactive | runtime-ready | `div` | `g-cart` | cart, commerce | — |
| `GMiniCart` | `mini-cart` | commerce | interactive | runtime-ready | `div` | `g-mini-cart` | dropdown, commerce | — |
| `GCartSummary` | `cart-summary` | commerce | interactive | runtime-ready | `div` | `g-cart-summary` | commerce | — |
| `GCommerceCheckout` | `commerce-checkout` | commerce | interactive | runtime-ready | `div` | `g-commerce-checkout` | commerce | — |
| `GCommerceCheckoutSteps` | `commerce-checkout-steps` | commerce | interactive | runtime-ready | `div` | `g-checkout-steps` | commerce | — |
| `GAddressSelector` | `address-selector` | commerce | interactive | runtime-ready | `div` | `g-address-selector` | saved-choice, commerce | — |
| `GAddressCard` | `address-card` | commerce | interactive | runtime-ready | `div` | `g-address-card` | commerce | — |
| `GShippingMethod` | `shipping-method` | commerce | interactive | runtime-ready | `div` | `g-shipping-method` | saved-choice, commerce | — |
| `GPickupSelector` | `pickup-selector` | commerce | interactive | runtime-ready | `div` | `g-pickup-selector` | saved-choice, commerce | — |
| `GCoupon` | `coupon` | commerce | interactive | runtime-ready | `div` | `g-coupon` | coupon, commerce | — |
| `GPromotionList` | `promotion-list` | commerce | interactive | runtime-ready | `div` | `g-promotion-list` | commerce | — |
| `GInvoiceInformation` | `invoice-information` | commerce | interactive | runtime-ready | `div` | `g-invoice-information` | commerce | — |
| `GPaymentMethod` | `payment-method` | commerce | interactive | runtime-ready | `div` | `g-payment-method` | saved-choice, commerce | — |
| `GPaymentSheet` | `payment-sheet` | commerce | interactive | runtime-ready | `div` | `g-payment-sheet` | commerce | — |
| `GPaymentResult` | `payment-result` | commerce | interactive | runtime-ready | `div` | `g-payment-result` | commerce | — |
| `GCommerceOrderSummary` | `commerce-order-summary` | commerce | interactive | runtime-ready | `div` | `g-commerce-order-summary` | commerce | — |
| `GCommerceOrderTimeline` | `commerce-order-timeline` | commerce | interactive | runtime-ready | `div` | `g-commerce-order-timeline` | commerce | — |
| `GOrderDetail` | `order-detail` | commerce | interactive | runtime-ready | `div` | `g-order-detail` | commerce | — |
| `GSubscriptionPlan` | `subscription-plan` | commerce | interactive | runtime-ready | `div` | `g-subscription-plan` | commerce | — |
| `GPricingComparison` | `pricing-comparison` | commerce | interactive | runtime-ready | `div` | `g-pricing-comparison` | commerce | — |
| `GCommerceUsageMeter` | `commerce-usage-meter` | commerce | interactive | runtime-ready | `div` | `g-commerce-usage-meter` | commerce | — |
| `GBillingHistory` | `billing-history` | commerce | interactive | runtime-ready | `div` | `g-billing-history` | commerce | — |
| `GRefundStatus` | `refund-status` | commerce | interactive | runtime-ready | `div` | `g-refund-status` | commerce | — |
| `GTaxSummary` | `tax-summary` | commerce | interactive | runtime-ready | `div` | `g-tax-summary` | commerce | — |
| `GMobileSafeShell` | `mobile-safe-shell` | mobile | interactive | runtime-ready | `div` | `g-mobile-safe-shell` | mobile | — |
| `GMobileAppBar` | `mobile-app-bar` | mobile | interactive | runtime-ready | `div` | `g-mobile-app-bar` | mobile | — |
| `GMobileBottomNavigation` | `mobile-bottom-navigation` | mobile | interactive | runtime-ready | `div` | `g-mobile-bottom-navigation` | mobile | — |
| `GMobileBottomSheet` | `mobile-bottom-sheet` | mobile | interactive | runtime-ready | `div` | `g-mobile-bottom-sheet` | mobile-sheet, mobile | — |
| `GMobileActionSheet` | `mobile-action-sheet` | mobile | interactive | runtime-ready | `div` | `g-mobile-action-sheet` | mobile-sheet, mobile | — |
| `GMobilePullRefresh` | `mobile-pull-refresh` | mobile | interactive | runtime-ready | `div` | `g-mobile-pull-refresh` | pull-refresh, mobile | — |
| `GMobileInfiniteLoad` | `mobile-infinite-load` | mobile | interactive | runtime-ready | `div` | `g-mobile-infinite-load` | infinite-load, mobile | — |
| `GMobileSwipeActions` | `mobile-swipe-actions` | mobile | interactive | runtime-ready | `div` | `g-mobile-swipe-actions` | swipe-actions, mobile | — |
| `GMobileSwipeTabs` | `mobile-swipe-tabs` | mobile | interactive | runtime-ready | `div` | `g-mobile-swipe-tabs` | tabs, mobile | — |
| `GMobileCategoryView` | `mobile-category-view` | mobile | interactive | runtime-ready | `div` | `g-mobile-category-view` | mobile | — |
| `GMobileFilterSheet` | `mobile-filter-sheet` | mobile | interactive | runtime-ready | `div` | `g-mobile-filter-sheet` | mobile-sheet, mobile | — |
| `GMobilePurchaseBar` | `mobile-purchase-bar` | mobile | interactive | runtime-ready | `div` | `g-mobile-purchase-bar` | mobile | — |
| `GMobileSearch` | `mobile-search` | mobile | interactive | runtime-ready | `div` | `g-mobile-search` | clear-input, mobile | — |
| `GMobilePicker` | `mobile-picker` | mobile | interactive | runtime-ready | `div` | `g-mobile-picker` | saved-choice, mobile | — |
| `GMobileWheelPicker` | `mobile-wheel-picker` | mobile | interactive | runtime-ready | `div` | `g-mobile-wheel-picker` | wheel-picker, mobile | — |
| `GMobileFab` | `mobile-fab` | mobile | interactive | runtime-ready | `div` | `g-mobile-fab` | mobile | — |
| `GMobileFullscreenDialog` | `mobile-fullscreen-dialog` | mobile | interactive | runtime-ready | `div` | `g-mobile-fullscreen-dialog` | dialog, mobile | — |
| `GMobileKeyboardAvoidance` | `mobile-keyboard-avoidance` | mobile | interactive | runtime-ready | `div` | `g-mobile-keyboard-avoidance` | mobile | — |
| `GMobileGestureHint` | `mobile-gesture-hint` | mobile | interactive | runtime-ready | `div` | `g-mobile-gesture-hint` | mobile | — |
| `GMobileOfflineBanner` | `mobile-offline-banner` | mobile | interactive | runtime-ready | `div` | `g-mobile-offline-banner` | mobile | — |
| `GMobileSegmentedControl` | `mobile-segmented-control` | mobile | interactive | runtime-ready | `div` | `g-mobile-segmented-control` | saved-choice, mobile | — |
| `GMobileFeed` | `mobile-feed` | mobile | interactive | runtime-ready | `div` | `g-mobile-feed` | mobile | — |
| `GMobileCardCarousel` | `mobile-card-carousel` | mobile | interactive | runtime-ready | `div` | `g-mobile-card-carousel` | carousel, mobile | — |
| `GMobileForm` | `mobile-form` | mobile | interactive | runtime-ready | `div` | `g-mobile-form` | mobile | — |
| `GMobileAuth` | `mobile-auth` | mobile | interactive | runtime-ready | `div` | `g-mobile-auth` | password-toggle, mobile | — |
| `GMobileCheckout` | `mobile-checkout` | mobile | interactive | runtime-ready | `div` | `g-mobile-checkout` | mobile | — |
| `GMobileMediaViewer` | `mobile-media-viewer` | mobile | interactive | runtime-ready | `div` | `g-mobile-media-viewer` | dialog, mobile | — |
| `GMobileKeyboardToolbar` | `mobile-keyboard-toolbar` | mobile | interactive | runtime-ready | `div` | `g-mobile-keyboard-toolbar` | mobile | — |
| `GMobileSelectionMode` | `mobile-selection-mode` | mobile | interactive | runtime-ready | `div` | `g-mobile-selection-mode` | row-select, mobile | — |
| `GMobileSnackbar` | `mobile-snackbar` | mobile | interactive | runtime-ready | `div` | `g-mobile-snackbar` | toast, mobile | — |
| `GMobilePermissionPrompt` | `mobile-permission-prompt` | mobile | interactive | runtime-ready | `div` | `g-mobile-permission-prompt` | mobile | — |
| `GMobileState` | `mobile-state` | mobile | interactive | runtime-ready | `div` | `g-mobile-state` | mobile | — |
| `GDesktopNativeTitlebar` | `desktop-native-titlebar` | desktop | interactive | runtime-ready | `div` | `g-native-titlebar` | desktop | — |
| `GDesktopWindowControlsComposition` | `desktop-window-controls-composition` | desktop | interactive | runtime-ready | `div` | `g-desktop-window-controls` | desktop | — |
| `GDesktopMenubarComposition` | `desktop-menubar-composition` | desktop | interactive | runtime-ready | `div` | `g-desktop-menubar` | roving-nav, desktop | — |
| `GDesktopActivityBarComposition` | `desktop-activity-bar-composition` | desktop | interactive | runtime-ready | `div` | `g-desktop-activity-bar` | roving-nav, desktop | — |
| `GDesktopDockPanel` | `desktop-dock-panel` | desktop | interactive | runtime-ready | `div` | `g-desktop-dock-panel` | nav-toggle, desktop | — |
| `GDesktopSplitPane` | `desktop-split-pane` | desktop | interactive | runtime-ready | `div` | `g-desktop-split-pane` | split-pane, desktop | — |
| `GDesktopInspectorPanel` | `desktop-inspector-panel` | desktop | interactive | runtime-ready | `div` | `g-desktop-inspector-panel` | nav-toggle, desktop | — |
| `GDesktopStatusBar` | `desktop-status-bar` | desktop | interactive | runtime-ready | `div` | `g-desktop-status-bar` | desktop | — |
| `GDesktopCommandPalette` | `desktop-command-palette` | desktop | interactive | runtime-ready | `div` | `g-desktop-command-palette` | command-palette, desktop | — |
| `GShortcutRecorder` | `shortcut-recorder` | desktop | interactive | runtime-ready | `div` | `g-shortcut-recorder` | shortcut-recorder, desktop | — |
| `GDesktopContextMenu` | `desktop-context-menu` | desktop | interactive | runtime-ready | `div` | `g-desktop-context-menu` | context-menu, desktop | — |
| `GDesktopDocumentTabs` | `desktop-document-tabs` | desktop | interactive | runtime-ready | `div` | `g-desktop-document-tabs` | desktop-tabs, desktop | — |
| `GDesktopDragRegion` | `desktop-drag-region` | desktop | interactive | runtime-ready | `div` | `g-desktop-drag-region` | desktop | — |
| `GWindowLoading` | `window-loading` | desktop | interactive | runtime-ready | `div` | `g-window-loading` | desktop | — |
| `GUpdateAvailable` | `update-available` | desktop | interactive | runtime-ready | `div` | `g-update-available` | desktop | — |
| `GDesktopPermissionRequest` | `desktop-permission-request` | desktop | interactive | runtime-ready | `div` | `g-desktop-permission-request` | desktop | — |
| `GNativeFilePicker` | `native-file-picker` | desktop | interactive | runtime-ready | `div` | `g-native-file-picker` | native-file-picker, desktop | — |
| `GTrayMenuShell` | `tray-menu-shell` | desktop | interactive | runtime-ready | `div` | `g-tray-menu` | dropdown, desktop | — |
| `GMultiWindowPlaceholder` | `multi-window-placeholder` | desktop | interactive | runtime-ready | `div` | `g-multi-window-placeholder` | desktop | — |
| `GDesktopWorkspaceComposition` | `desktop-workspace-composition` | desktop | interactive | runtime-ready | `div` | `g-desktop-workspace` | desktop | — |
| `GDesktopWindowSwitcher` | `desktop-window-switcher` | desktop | interactive | runtime-ready | `div` | `g-desktop-window-switcher` | window-switcher, desktop | — |
| `GRecentDocuments` | `recent-documents` | desktop | interactive | runtime-ready | `div` | `g-recent-documents` | desktop | — |
| `GDesktopToolbar` | `desktop-toolbar` | desktop | interactive | runtime-ready | `div` | `g-desktop-toolbar` | desktop | — |
| `GDesktopBottomPanel` | `desktop-bottom-panel` | desktop | interactive | runtime-ready | `div` | `g-desktop-bottom-panel` | nav-toggle, desktop | — |
| `GBackgroundTaskCenter` | `background-task-center` | desktop | interactive | runtime-ready | `div` | `g-background-task-center` | desktop | — |
| `GDesktopNotificationCenter` | `desktop-notification-center` | desktop | interactive | runtime-ready | `div` | `g-desktop-notification-center` | desktop | — |
| `GSyncStatus` | `sync-status` | desktop | interactive | runtime-ready | `div` | `g-sync-status` | desktop | — |
| `GUpdateProgress` | `update-progress` | desktop | interactive | runtime-ready | `div` | `g-update-progress` | desktop | — |
| `GCrashRecovery` | `crash-recovery` | desktop | interactive | runtime-ready | `div` | `g-crash-recovery` | desktop | — |
| `GSingleInstanceNotice` | `single-instance-notice` | desktop | interactive | runtime-ready | `div` | `g-single-instance-notice` | desktop | — |
| `GDeepLinkHandler` | `deep-link-handler` | desktop | interactive | runtime-ready | `div` | `g-deep-link-handler` | desktop | — |
| `GAboutDialog` | `about-dialog` | desktop | interactive | runtime-ready | `div` | `g-about-dialog` | dialog, desktop | — |
| `GSolutionProductLanding` | `solution-product-landing` | solution | interactive | runtime-ready | `div` | `g-product-landing` | solution | — |
| `GSolutionCorporateHome` | `solution-corporate-home` | solution | interactive | runtime-ready | `div` | `g-corporate-home` | solution | — |
| `GSolutionPersonalHome` | `solution-personal-home` | solution | interactive | runtime-ready | `div` | `g-personal-home` | solution | — |
| `GSolutionPortfolioPage` | `solution-portfolio-page` | solution | interactive | runtime-ready | `div` | `g-portfolio-page` | solution | — |
| `GSolutionBlogIndex` | `solution-blog-index` | solution | interactive | runtime-ready | `div` | `g-blog-index` | solution | — |
| `GSolutionArticlePage` | `solution-article-page` | solution | interactive | runtime-ready | `div` | `g-article-page` | solution | — |
| `GSolutionDocsPortal` | `solution-docs-portal` | solution | interactive | runtime-ready | `div` | `g-docs-portal` | solution | — |
| `GSolutionHelpCenter` | `solution-help-center` | solution | interactive | runtime-ready | `div` | `g-help-center-page` | solution | — |
| `GSolutionSearchResults` | `solution-search-results` | solution | interactive | runtime-ready | `div` | `g-search-results-page` | solution | — |
| `GSolutionContactPage` | `solution-contact-page` | solution | interactive | runtime-ready | `div` | `g-contact-page` | solution | — |
| `GSolutionPricingPage` | `solution-pricing-page` | solution | interactive | runtime-ready | `div` | `g-pricing-page` | solution | — |
| `GSolutionDashboardOverview` | `solution-dashboard-overview` | solution | interactive | runtime-ready | `div` | `g-dashboard-overview` | solution | — |
| `GSolutionAdminList` | `solution-admin-list` | solution | interactive | runtime-ready | `div` | `g-admin-list-page` | solution | — |
| `GSolutionRecordDetail` | `solution-record-detail` | solution | interactive | runtime-ready | `div` | `g-record-detail-page` | solution | — |
| `GSolutionSettingsCenter` | `solution-settings-center` | solution | interactive | runtime-ready | `div` | `g-settings-center` | solution | — |
| `GSolutionUserCenter` | `solution-user-center` | solution | interactive | runtime-ready | `div` | `g-user-center` | solution | — |
| `GSolutionNotificationCenter` | `solution-notification-center` | solution | interactive | runtime-ready | `div` | `g-notification-center-page` | solution | — |
| `GSolutionOnboardingFlow` | `solution-onboarding-flow` | solution | interactive | runtime-ready | `div` | `g-onboarding-flow` | solution | — |
| `GSolutionCrmWorkspace` | `solution-crm-workspace` | solution | interactive | runtime-ready | `div` | `g-crm-workspace` | solution | — |
| `GSolutionProjectWorkspace` | `solution-project-workspace` | solution | interactive | runtime-ready | `div` | `g-project-workspace` | solution | — |
| `GSolutionSupportCenter` | `solution-support-center` | solution | interactive | runtime-ready | `div` | `g-support-center` | solution | — |
| `GSolutionApprovalCenter` | `solution-approval-center` | solution | interactive | runtime-ready | `div` | `g-approval-center` | solution | — |
| `GSolutionKnowledgeBase` | `solution-knowledge-base` | solution | interactive | runtime-ready | `div` | `g-knowledge-base` | solution | — |
| `GSolutionLearningPortal` | `solution-learning-portal` | solution | interactive | runtime-ready | `div` | `g-learning-portal` | solution | — |
| `GSolutionEventPortal` | `solution-event-portal` | solution | interactive | runtime-ready | `div` | `g-event-portal` | solution | — |
| `GSolutionBookingPortal` | `solution-booking-portal` | solution | interactive | runtime-ready | `div` | `g-booking-portal` | solution | — |
| `GSolutionHealthcarePortal` | `solution-healthcare-portal` | solution | interactive | runtime-ready | `div` | `g-healthcare-portal` | solution | — |
| `GSolutionFinancePortal` | `solution-finance-portal` | solution | interactive | runtime-ready | `div` | `g-finance-portal` | solution | — |
| `GSolutionPublicServicePortal` | `solution-public-service-portal` | solution | interactive | runtime-ready | `div` | `g-public-service-portal` | solution | — |
| `GSolutionMarketplacePage` | `solution-marketplace-page` | solution | interactive | runtime-ready | `div` | `g-marketplace-page` | solution | — |
| `GSolutionCommunityPage` | `solution-community-page` | solution | interactive | runtime-ready | `div` | `g-community-page` | solution | — |
| `GSolutionStatusCenter` | `solution-status-center` | solution | interactive | runtime-ready | `div` | `g-status-center-page` | solution | — |
| `GCollapse` | `collapse` | disclosure | interactive | runtime-ready | `div` | `g-collapse-panel` | accordion | key:Enter, key:Space, key:ArrowUp, key:ArrowDown, key:Home, key:End, aria-expanded, aria-controls, aria-labelledby |
| `GReadMore` | `read-more` | disclosure | interactive | runtime-ready | `div` | `g-read-more` | accordion | key:Enter, key:Space, key:ArrowUp, key:ArrowDown, key:Home, key:End, aria-expanded, aria-controls, aria-labelledby |
| `GKpiGroup` | `kpi-group` | dashboard | interactive | runtime-ready | `div` | `g-kpi-group` | dashboard | — |
| `GDashboardWidget` | `dashboard-widget` | dashboard | interactive | runtime-ready | `div` | `g-dashboard-widget` | dashboard | — |
| `GGoalTracker` | `goal-tracker` | dashboard | interactive | runtime-ready | `div` | `g-goal-tracker` | dashboard | — |
| `GGaugeChart` | `gauge-chart` | dashboard | interactive | runtime-ready | `div` | `g-gauge-chart` | dashboard | — |
| `GUndoHistory` | `undo-history` | interaction | interactive | runtime-ready | `div` | `g-undo-history` | interaction | — |
| `GMarkdownViewer` | `markdown-viewer` | content | interactive | runtime-ready | `div` | `g-markdown-viewer` | content | — |
| `GResponsiveContainer` | `responsive-container` | layout | interactive | runtime-ready | `div` | `g-responsive-container` | layout | — |
| `GHelpSearch` | `help-search` | help | interactive | runtime-ready | `div` | `g-help-search-composition` | help | — |
| `GHelpGlossary` | `help-glossary` | help | interactive | runtime-ready | `div` | `g-help-glossary` | help | — |
| `GAiRunTimeline` | `ai-run-timeline` | ai | interactive | runtime-ready | `div` | `g-ai-run-timeline` | ai | — |
| `GAiStructuredOutput` | `ai-structured-output` | ai | interactive | runtime-ready | `div` | `g-ai-structured-output` | ai | — |
| `GResponsiveImage` | `responsive-image` | media | interactive | runtime-ready | `div` | `g-responsive-image` | media | — |
| `GImage` | `image` | media | interactive | runtime-ready | `div` | `g-image` | media | — |
| `GImageComparison` | `image-comparison` | media | interactive | runtime-ready | `div` | `g-image-comparison` | media | — |
| `GFeatureGrid` | `feature-grid` | marketing | interactive | runtime-ready | `div` | `g-feature-grid` | marketing | — |
| `GLogoCloud` | `logo-cloud` | marketing | interactive | runtime-ready | `div` | `g-logo-cloud` | marketing | — |
| `GTestimonial` | `testimonial` | marketing | interactive | runtime-ready | `div` | `g-testimonial-grid` | marketing | — |
| `GCtaSection` | `cta-section` | marketing | interactive | runtime-ready | `div` | `g-cta-section` | marketing | — |
| `GNewsletter` | `newsletter` | marketing | interactive | runtime-ready | `div` | `g-newsletter` | marketing | — |
| `GAnnouncementBar` | `announcement-bar` | marketing | interactive | runtime-ready | `div` | `g-announcement-bar` | marketing | — |
| `GSiteFooter` | `site-footer` | marketing | interactive | runtime-ready | `div` | `g-site-footer` | marketing | — |
| `GMemberManagement` | `member-management` | enterprise | interactive | runtime-ready | `div` | `g-member-management` | enterprise | — |
| `GInvitationManager` | `invitation-manager` | enterprise | interactive | runtime-ready | `div` | `g-invitation-manager` | enterprise | — |
| `GRoleManager` | `role-manager` | enterprise | interactive | runtime-ready | `div` | `g-role-manager` | enterprise | — |
| `GTeamManagement` | `team-management` | enterprise | interactive | runtime-ready | `div` | `g-team-management` | enterprise | — |
| `GEnterpriseIntegrations` | `enterprise-integrations` | enterprise | interactive | runtime-ready | `div` | `g-enterprise-integrations` | enterprise | — |
| `GDesktopPreferences` | `desktop-preferences` | desktop | interactive | runtime-ready | `div` | `g-desktop-preferences` | desktop | — |
| `GDesktopSessionManager` | `desktop-session-manager` | desktop | interactive | runtime-ready | `div` | `g-desktop-session-manager` | desktop | — |
| `GDesktopProblemsPanel` | `desktop-problems-panel` | desktop | interactive | runtime-ready | `div` | `g-desktop-problems-panel` | desktop | — |
| `GWorkflowChecklist` | `workflow-checklist` | workflow | interactive | runtime-ready | `div` | `g-workflow-checklist` | workflow | — |
| `GWorkflowApproval` | `workflow-approval` | workflow | interactive | runtime-ready | `div` | `g-workflow-approval` | workflow | — |
| `GWorkflowBuilder` | `workflow-builder` | workflow | interactive | runtime-ready | `div` | `g-workflow-builder` | workflow | — |
| `GWorkflowRunHistory` | `workflow-run-history` | workflow | interactive | runtime-ready | `div` | `g-workflow-run-history` | workflow | — |
| `GWorkflowRunDetail` | `workflow-run-detail` | workflow | interactive | runtime-ready | `div` | `g-workflow-run-detail` | workflow | — |
| `GWorkflowTrigger` | `workflow-trigger` | workflow | interactive | runtime-ready | `div` | `g-workflow-trigger` | workflow | — |
| `GCommunicationComposer` | `communication-composer` | communication | interactive | runtime-ready | `div` | `g-communication-composer` | communication | — |
| `GCommunicationContacts` | `communication-contacts` | communication | interactive | runtime-ready | `div` | `g-communication-contacts` | communication | — |
| `GNotificationPreferences` | `notification-preferences` | communication | interactive | runtime-ready | `div` | `g-notification-preferences` | communication | — |
| `GCommunicationDelivery` | `communication-delivery` | communication | interactive | runtime-ready | `div` | `g-communication-delivery` | communication | — |
| `GConsentPreferences` | `consent-preferences` | legal | interactive | runtime-ready | `div` | `g-consent-preferences` | legal | — |
| `GLegalDocument` | `legal-document` | legal | interactive | runtime-ready | `div` | `g-legal-document` | legal | — |
| `GLegalAgreement` | `legal-agreement` | legal | interactive | runtime-ready | `div` | `g-legal-agreement` | legal | — |
| `GConsentHistory` | `consent-history` | legal | interactive | runtime-ready | `div` | `g-consent-history` | legal | — |
| `GPrivacyRequest` | `privacy-request` | legal | interactive | runtime-ready | `div` | `g-privacy-request` | legal | — |
| `GPrivacyRequestStatus` | `privacy-request-status` | legal | interactive | runtime-ready | `div` | `g-privacy-request-status` | legal | — |
| `GPolicyUpdates` | `policy-updates` | legal | interactive | runtime-ready | `div` | `g-policy-updates` | legal | — |
| `GStatistic` | `statistic` | data | interactive | runtime-ready | `div` | `g-statistic` | data-display | — |
| `GAffix` | `affix` | layout | interactive | runtime-ready | `div` | `g-affix` | foundation | key:Tab, aria-disabled |
| `GResizeBox` | `resize-box` | layout | interactive | runtime-ready | `div` | `g-resize-box` | foundation | key:Tab, aria-disabled |
| `GScrollbar` | `scrollbar` | layout | interactive | runtime-ready | `div` | `g-scrollbar` | foundation | key:Tab, aria-disabled |
| `GSpace` | `space` | layout | interactive | runtime-ready | `div` | `g-space` | foundation | key:Tab, aria-disabled |
| `GWatermark` | `watermark` | data | interactive | runtime-ready | `div` | `g-watermark` | foundation | key:Tab, aria-disabled |
| `GOverflowList` | `overflow-list` | data | interactive | runtime-ready | `div` | `g-overflow-list` | foundation | key:Tab, aria-disabled |
| `GInputNumber` | `input-number` | form | interactive | runtime-ready | `div` | `g-input-number` | foundation | key:Tab, aria-disabled |
| `GInputTag` | `input-tag` | form | interactive | runtime-ready | `div` | `g-input-tag` | foundation | key:Tab, aria-disabled |
| `GColorPicker` | `color-picker` | form | interactive | runtime-ready | `div` | `g-color-picker` | foundation | key:Tab, aria-disabled |
| `GLink` | `link` | basic | interactive | runtime-ready | `a` | `g-link` | foundation | key:Tab, aria-disabled |
| `GTypography` | `typography` | basic | interactive | runtime-ready | `div` | `g-typography` | foundation | key:Tab, aria-disabled |
| `GIcon` | `icon` | basic | interactive | runtime-ready | `div` | `g-icon` | foundation | key:Tab, aria-disabled |
