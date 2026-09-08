/** Generated from @gardenerim/css 2.2.0 metadata. */
import type { GardenerimComponentDefinition } from "../types.js";

export const componentCatalog: readonly GardenerimComponentDefinition[] = [
  {
    "name": "button",
    "exportName": "GButtonDirective",
    "directiveName": "gButton",
    "elementName": "g-button",
    "category": "basic",
    "type": "css",
    "selector": ".g-btn",
    "className": "g-btn",
    "tag": "button",
    "variants": [
      "primary",
      "secondary",
      "dashed",
      "outline",
      "text",
      "ghost",
      "danger",
      "link",
      "square",
      "circle",
      "round",
      "mini",
      "small",
      "medium",
      "large",
      "sm",
      "lg",
      "icon",
      "long",
      "block",
      "loading"
    ],
    "states": [
      "normal",
      "success",
      "warning",
      "danger",
      "info",
      "disabled",
      "loading"
    ],
    "parts": [],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "button-group",
    "exportName": "GButtonGroupDirective",
    "directiveName": "gButtonGroup",
    "elementName": "g-button-group",
    "category": "basic",
    "type": "css",
    "selector": ".g-btn-group",
    "className": "g-btn-group",
    "tag": "div",
    "variants": [
      "primary",
      "secondary",
      "dashed",
      "outline",
      "text",
      "square",
      "circle",
      "round",
      "mini",
      "small",
      "medium",
      "large",
      "sm",
      "lg",
      "horizontal",
      "vertical",
      "block",
      "justified",
      "split",
      "toggle"
    ],
    "states": [
      "normal",
      "success",
      "warning",
      "danger",
      "info",
      "disabled"
    ],
    "parts": [
      "g-btn-group-primary-action",
      "g-btn-group-trigger",
      "g-btn-toolbar",
      "g-btn-toolbar-spread"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "card",
    "exportName": "GCardDirective",
    "directiveName": "gCard",
    "elementName": "g-card",
    "category": "basic",
    "type": "css",
    "selector": ".g-card",
    "className": "g-card",
    "tag": "div",
    "variants": [
      "bordered",
      "borderless",
      "elevated",
      "hoverable",
      "compact",
      "small",
      "medium",
      "large",
      "horizontal",
      "selectable",
      "inner"
    ],
    "states": [
      "normal",
      "loading",
      "selected",
      "disabled"
    ],
    "parts": [
      "g-card-header",
      "g-card-header-main",
      "g-card-extra",
      "g-card-body",
      "g-card-footer",
      "g-card-title",
      "g-card-subtitle",
      "g-card-cover",
      "g-card-main",
      "g-card-meta",
      "g-card-meta-avatar",
      "g-card-meta-content",
      "g-card-meta-title",
      "g-card-meta-description",
      "g-card-actions",
      "g-card-action",
      "g-card-grid",
      "g-card-grid-item",
      "g-card-inner"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "badge",
    "exportName": "GBadgeDirective",
    "directiveName": "gBadge",
    "elementName": "g-badge",
    "category": "basic",
    "type": "css",
    "selector": ".g-badge",
    "className": "g-badge",
    "tag": "span",
    "variants": [
      "soft",
      "solid",
      "outline",
      "count",
      "dot",
      "status",
      "attached",
      "ribbon",
      "small",
      "medium",
      "large"
    ],
    "states": [
      "normal",
      "success",
      "warning",
      "danger",
      "error",
      "info",
      "processing",
      "disabled"
    ],
    "parts": [
      "g-badge-indicator",
      "g-badge-dot",
      "g-badge-status-text",
      "g-badge-ribbon-wrap"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tag",
    "exportName": "GTagDirective",
    "directiveName": "gTag",
    "elementName": "g-tag",
    "category": "basic",
    "type": "interactive",
    "selector": ".g-tag",
    "className": "g-tag",
    "tag": "span",
    "variants": [
      "soft",
      "solid",
      "outline",
      "small",
      "medium",
      "large",
      "square",
      "round",
      "closable",
      "checkable",
      "loading"
    ],
    "states": [
      "normal",
      "selected",
      "success",
      "warning",
      "danger",
      "error",
      "info",
      "disabled"
    ],
    "parts": [
      "g-tag-icon",
      "g-tag-label",
      "g-tag-close"
    ],
    "behaviors": [
      "tag"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "chip",
    "exportName": "GChipDirective",
    "directiveName": "gChip",
    "elementName": "g-chip",
    "category": "basic",
    "type": "css",
    "selector": ".g-chip",
    "className": "g-chip",
    "tag": "span",
    "variants": [
      "soft",
      "solid",
      "outline",
      "small",
      "medium",
      "large",
      "clickable",
      "selectable",
      "removable",
      "multiline"
    ],
    "states": [
      "normal",
      "selected",
      "success",
      "warning",
      "danger",
      "error",
      "info",
      "disabled"
    ],
    "parts": [
      "g-chip-avatar",
      "g-chip-icon",
      "g-chip-label",
      "g-chip-remove"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "badge-tag-chip",
    "exportName": "GBadgeTagChipDirective",
    "directiveName": "gBadgeTagChip",
    "elementName": "g-badge-tag-chip",
    "category": "basic",
    "type": "css",
    "selector": ".g-badge, .g-tag, .g-chip",
    "className": "g-badge",
    "tag": "div",
    "variants": [
      "soft",
      "solid",
      "outline"
    ],
    "states": [
      "normal",
      "selected",
      "success",
      "warning",
      "danger",
      "info",
      "disabled"
    ],
    "parts": [],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "avatar",
    "exportName": "GAvatarDirective",
    "directiveName": "gAvatar",
    "elementName": "g-avatar",
    "category": "basic",
    "type": "css",
    "selector": ".g-avatar",
    "className": "g-avatar",
    "tag": "div",
    "variants": [
      "xs",
      "sm",
      "medium",
      "lg",
      "xl",
      "2xl",
      "circle",
      "rounded",
      "square",
      "image",
      "icon",
      "text",
      "fit-cover",
      "fit-contain",
      "fit-fill",
      "fit-none",
      "fit-scale-down",
      "bordered",
      "elevated",
      "interactive",
      "status",
      "loading",
      "group"
    ],
    "states": [
      "normal",
      "online",
      "away",
      "busy",
      "offline",
      "loading",
      "disabled"
    ],
    "parts": [
      "g-avatar-image",
      "g-avatar-icon",
      "g-avatar-text",
      "g-avatar-fallback"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "avatar-group",
    "exportName": "GAvatarGroupDirective",
    "directiveName": "gAvatarGroup",
    "elementName": "g-avatar-group",
    "category": "basic",
    "type": "css",
    "selector": ".g-avatar-group",
    "className": "g-avatar-group",
    "tag": "div",
    "variants": [
      "overlap",
      "spaced",
      "compact",
      "small",
      "medium",
      "large",
      "square"
    ],
    "states": [
      "normal",
      "disabled"
    ],
    "parts": [
      "g-avatar-overflow"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "alert",
    "exportName": "GAlertDirective",
    "directiveName": "gAlert",
    "elementName": "g-alert",
    "category": "feedback",
    "type": "css",
    "selector": ".g-alert",
    "className": "g-alert",
    "tag": "div",
    "variants": [
      "soft",
      "outlined",
      "filled",
      "banner",
      "center",
      "compact",
      "spacious",
      "borderless",
      "accent",
      "with-title",
      "closable",
      "no-icon",
      "stacked"
    ],
    "states": [
      "normal",
      "info",
      "success",
      "warning",
      "danger",
      "error",
      "loading"
    ],
    "parts": [
      "g-alert-icon",
      "g-alert-body",
      "g-alert-title",
      "g-alert-content",
      "g-alert-description",
      "g-alert-action",
      "g-alert-actions",
      "g-alert-close"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "progress-meter",
    "exportName": "GProgressMeterDirective",
    "directiveName": "gProgressMeter",
    "elementName": "g-progress-meter",
    "category": "feedback",
    "type": "css",
    "selector": ".g-progress",
    "className": "g-progress",
    "tag": "div",
    "variants": [
      "line",
      "circle",
      "dashboard",
      "steps",
      "meter",
      "mini",
      "small",
      "medium",
      "large",
      "rounded",
      "square",
      "inside",
      "striped",
      "animated",
      "buffered",
      "with-success"
    ],
    "states": [
      "normal",
      "determinate",
      "indeterminate",
      "active",
      "success",
      "warning",
      "danger",
      "error",
      "paused",
      "disabled"
    ],
    "parts": [
      "g-progress-bar",
      "g-progress-buffer",
      "g-progress-success",
      "g-progress-label",
      "g-progress-value",
      "g-progress-text",
      "g-progress-step",
      "g-meter-segment",
      "g-meter-marker"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "spinner-skeleton",
    "exportName": "GSpinnerSkeletonDirective",
    "directiveName": "gSpinnerSkeleton",
    "elementName": "g-spinner-skeleton",
    "category": "feedback",
    "type": "css",
    "selector": ".g-spinner",
    "className": "g-spinner",
    "tag": "div",
    "variants": [
      "spinner",
      "dots",
      "pulse",
      "inline",
      "tip",
      "overlay",
      "fullscreen",
      "xs",
      "small",
      "medium",
      "large",
      "xl",
      "skeleton",
      "text",
      "title",
      "paragraph",
      "avatar",
      "button",
      "input",
      "image",
      "circle",
      "round",
      "active",
      "static",
      "with-avatar",
      "card",
      "list"
    ],
    "states": [
      "loading",
      "paused",
      "loaded",
      "disabled"
    ],
    "parts": [
      "g-spinner-indicator",
      "g-spinner-dot",
      "g-spinner-description",
      "g-spinner-content",
      "g-skeleton-header",
      "g-skeleton-avatar",
      "g-skeleton-content",
      "g-skeleton-title",
      "g-skeleton-paragraph",
      "g-skeleton-row",
      "g-skeleton-text",
      "g-skeleton-image",
      "g-skeleton-button",
      "g-skeleton-input",
      "g-skeleton-list-item"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "empty-state",
    "exportName": "GEmptyStateDirective",
    "directiveName": "gEmptyState",
    "elementName": "g-empty-state",
    "category": "feedback",
    "type": "css",
    "selector": ".g-empty",
    "className": "g-empty",
    "tag": "div",
    "variants": [
      "default",
      "simple",
      "compact",
      "small",
      "medium",
      "large",
      "inline",
      "card",
      "full-page",
      "no-image"
    ],
    "states": [
      "normal",
      "no-data",
      "no-results",
      "first-use",
      "success",
      "error",
      "offline",
      "forbidden",
      "disabled"
    ],
    "parts": [
      "g-empty-visual",
      "g-empty-image",
      "g-empty-icon",
      "g-empty-content",
      "g-empty-title",
      "g-empty-description",
      "g-empty-actions",
      "g-empty-help"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "input",
    "exportName": "GInputDirective",
    "directiveName": "gInput",
    "elementName": "g-input",
    "category": "form",
    "type": "css",
    "selector": ".g-input",
    "className": "g-input",
    "tag": "input",
    "variants": [
      "outlined",
      "filled",
      "borderless",
      "underlined",
      "clearable",
      "prefix",
      "suffix",
      "prepend",
      "append",
      "group",
      "search",
      "search-button",
      "password",
      "word-limit",
      "block",
      "mini",
      "small",
      "medium",
      "large",
      "sm",
      "lg"
    ],
    "states": [
      "default",
      "normal",
      "hover",
      "focus",
      "success",
      "warning",
      "error",
      "disabled",
      "invalid",
      "loading",
      "read-only"
    ],
    "parts": [
      "g-input-control",
      "g-input-prefix",
      "g-input-suffix",
      "g-input-clear",
      "g-input-spinner",
      "g-input-prepend",
      "g-input-append",
      "g-input-search-button",
      "g-password-toggle",
      "g-character-count"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "textarea",
    "exportName": "GTextareaDirective",
    "directiveName": "gTextarea",
    "elementName": "g-textarea",
    "category": "form",
    "type": "css",
    "selector": ".g-textarea",
    "className": "g-textarea",
    "tag": "textarea",
    "variants": [
      "outlined",
      "filled",
      "borderless",
      "underlined",
      "clearable",
      "word-limit",
      "auto-size",
      "resize-none",
      "resize-vertical",
      "resize-horizontal",
      "resize-both",
      "mini",
      "small",
      "medium",
      "large",
      "sm",
      "lg"
    ],
    "states": [
      "default",
      "normal",
      "hover",
      "focus",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "read-only",
      "near-limit",
      "over-limit",
      "max-rows"
    ],
    "parts": [
      "g-textarea-control",
      "g-textarea-clear",
      "g-character-count"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "select",
    "exportName": "GSelectDirective",
    "directiveName": "gSelect",
    "elementName": "g-select",
    "category": "form",
    "type": "css",
    "selector": ".g-select",
    "className": "g-select",
    "tag": "select",
    "variants": [
      "outlined",
      "filled",
      "borderless",
      "underlined",
      "placeholder",
      "clearable",
      "with-prefix",
      "with-suffix",
      "multiple",
      "option-group",
      "auto-width",
      "block",
      "mini",
      "small",
      "medium",
      "large",
      "sm",
      "lg"
    ],
    "states": [
      "default",
      "normal",
      "hover",
      "focus",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-select-control",
      "g-select-prefix",
      "g-select-suffix",
      "g-select-arrow",
      "g-select-spinner",
      "g-select-clear"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "checkbox-radio",
    "exportName": "GCheckboxRadioDirective",
    "directiveName": "gCheckboxRadio",
    "elementName": "g-checkbox-radio",
    "category": "form",
    "type": "css",
    "selector": ".g-check, .g-radio",
    "className": "g-check",
    "tag": "div",
    "variants": [
      "checkbox",
      "radio",
      "mini",
      "small",
      "medium",
      "large",
      "block",
      "bordered",
      "card",
      "reverse",
      "with-description"
    ],
    "states": [
      "normal",
      "hover",
      "focus",
      "unchecked",
      "checked",
      "indeterminate",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-choice-content",
      "g-choice-label",
      "g-choice-description",
      "g-choice-extra"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "switch",
    "exportName": "GSwitchDirective",
    "directiveName": "gSwitch",
    "elementName": "g-switch",
    "category": "form",
    "type": "css",
    "selector": ".g-switch",
    "className": "g-switch",
    "tag": "div",
    "variants": [
      "mini",
      "small",
      "medium",
      "large",
      "wide",
      "inline-prompt",
      "square",
      "with-label",
      "block",
      "reverse",
      "bordered",
      "card"
    ],
    "states": [
      "normal",
      "unchecked",
      "checked",
      "hover",
      "focus",
      "active",
      "disabled",
      "loading",
      "success",
      "warning",
      "danger",
      "error",
      "invalid",
      "read-only"
    ],
    "parts": [
      "g-switch-track",
      "g-switch-handle",
      "g-switch-checked-content",
      "g-switch-unchecked-content",
      "g-switch-content",
      "g-switch-label",
      "g-switch-description",
      "g-switch-extra"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "range-color",
    "exportName": "GRangeColorDirective",
    "directiveName": "gRangeColor",
    "elementName": "g-range-color",
    "category": "form",
    "type": "css",
    "selector": ".g-range-color",
    "className": "g-range-color",
    "tag": "div",
    "variants": [
      "range",
      "color",
      "horizontal",
      "vertical",
      "reverse",
      "mini",
      "small",
      "medium",
      "large",
      "show-stops",
      "with-value",
      "with-input",
      "dual",
      "block",
      "circle",
      "with-label",
      "presets"
    ],
    "states": [
      "default",
      "normal",
      "hover",
      "focus",
      "active",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-range-field",
      "g-range-header",
      "g-range-label",
      "g-range-value",
      "g-range-control",
      "g-range-limit",
      "g-range-description",
      "g-range-marks",
      "g-range-mark",
      "g-range-dual",
      "g-range-dual-rail",
      "g-range-dual-fill",
      "g-color-field",
      "g-color-input",
      "g-color-content",
      "g-color-label",
      "g-color-description",
      "g-color-value",
      "g-color-presets",
      "g-color-preset"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "file-drop",
    "exportName": "GFileDropDirective",
    "directiveName": "gFileDrop",
    "elementName": "g-file-drop",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-dropzone]",
    "cssSelector": ".g-file-drop",
    "className": "g-file-drop",
    "tag": "div",
    "variants": [
      "dragger",
      "button",
      "compact",
      "spacious",
      "block",
      "picture-card",
      "avatar",
      "multiple",
      "directory",
      "manual",
      "with-list",
      "picture-list"
    ],
    "states": [
      "default",
      "hover",
      "focus",
      "dragging",
      "validating",
      "uploading",
      "success",
      "error",
      "rejected",
      "disabled"
    ],
    "parts": [
      "g-file-drop-input",
      "g-file-drop-content",
      "g-file-drop-icon",
      "g-file-drop-title",
      "g-file-drop-description",
      "g-file-drop-rules",
      "g-file-drop-actions",
      "g-file-drop-browse",
      "g-file-drop-feedback",
      "g-file-drop-list",
      "g-file-drop-list-header",
      "g-file-drop-item",
      "g-file-drop-file-icon",
      "g-file-drop-thumbnail",
      "g-file-drop-file-info",
      "g-file-drop-file-name",
      "g-file-drop-file-meta",
      "g-file-drop-progress",
      "g-file-drop-progress-track",
      "g-file-drop-progress-bar",
      "g-file-drop-status",
      "g-file-drop-item-actions",
      "g-file-drop-remove",
      "g-file-drop-retry"
    ],
    "behaviors": [
      "dropzone"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "combobox",
    "exportName": "GComboboxDirective",
    "directiveName": "gCombobox",
    "elementName": "g-combobox",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-combobox]",
    "className": "g-combobox",
    "tag": "div",
    "variants": [
      "filled",
      "outlined",
      "borderless",
      "underlined",
      "inline",
      "block",
      "clearable",
      "with-prefix",
      "grouped",
      "remote",
      "allow-create",
      "mini",
      "small",
      "medium",
      "large"
    ],
    "states": [
      "default",
      "open",
      "searching",
      "loading",
      "empty",
      "has-value",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-combobox-control",
      "g-combobox-input",
      "g-combobox-prefix",
      "g-combobox-suffix",
      "g-combobox-clear",
      "g-combobox-toggle",
      "g-combobox-spinner",
      "g-combobox-status",
      "g-combobox-list",
      "g-combobox-header",
      "g-combobox-footer",
      "g-combobox-group",
      "g-combobox-group-label",
      "g-combobox-option",
      "g-combobox-option-icon",
      "g-combobox-option-avatar",
      "g-combobox-option-content",
      "g-combobox-option-title",
      "g-combobox-option-description",
      "g-combobox-option-meta",
      "g-combobox-create",
      "g-combobox-empty",
      "g-combobox-loading"
    ],
    "behaviors": [
      "combobox"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "form",
    "exportName": "GFormDirective",
    "directiveName": "gForm",
    "elementName": "g-form",
    "category": "form",
    "type": "css",
    "selector": ".g-form",
    "className": "g-form",
    "tag": "form",
    "variants": [
      "default",
      "bordered",
      "vertical",
      "horizontal",
      "inline",
      "compact",
      "spacious"
    ],
    "states": [
      "default",
      "submitting",
      "validated",
      "success",
      "error",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-form-header",
      "g-form-title",
      "g-form-description",
      "g-form-body",
      "g-form-summary",
      "g-form-status",
      "g-form-actions"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "form-section",
    "exportName": "GFormSectionDirective",
    "directiveName": "gFormSection",
    "elementName": "g-form-section",
    "category": "form",
    "type": "css",
    "selector": ".g-form-section",
    "className": "g-form-section",
    "tag": "div",
    "variants": [
      "default",
      "divided",
      "bordered",
      "card",
      "subtle",
      "compact",
      "spacious",
      "numbered",
      "nested",
      "collapsible",
      "no-divider"
    ],
    "states": [
      "default",
      "active",
      "complete",
      "error",
      "invalid",
      "disabled",
      "collapsed",
      "expanded"
    ],
    "parts": [
      "g-form-section-header",
      "g-form-section-heading",
      "g-form-section-eyebrow",
      "g-form-section-number",
      "g-form-section-title",
      "g-form-section-description",
      "g-form-section-meta",
      "g-form-section-actions",
      "g-form-section-toggle",
      "g-form-section-body",
      "g-form-section-content",
      "g-form-section-status",
      "g-form-section-summary",
      "g-form-section-footer"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "field",
    "exportName": "GFieldDirective",
    "directiveName": "gField",
    "elementName": "g-field",
    "category": "form",
    "type": "css",
    "selector": ".g-field",
    "className": "g-field",
    "tag": "div",
    "variants": [
      "default",
      "vertical",
      "horizontal",
      "inline",
      "compact",
      "spacious",
      "label-start",
      "label-end",
      "label-hidden",
      "required-mark",
      "optional-mark",
      "block"
    ],
    "states": [
      "default",
      "focus",
      "pristine",
      "dirty",
      "touched",
      "validating",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-field-header",
      "g-field-label-content",
      "g-field-label",
      "g-field-meta",
      "g-field-required",
      "g-field-optional",
      "g-field-control",
      "g-field-prefix",
      "g-field-suffix",
      "g-field-actions",
      "g-field-action",
      "g-field-messages",
      "g-field-message",
      "g-field-help",
      "g-field-feedback",
      "g-field-counter",
      "g-field-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "fieldset",
    "exportName": "GFieldsetDirective",
    "directiveName": "gFieldset",
    "elementName": "g-fieldset",
    "category": "form",
    "type": "css",
    "selector": ".g-fieldset",
    "className": "g-fieldset",
    "tag": "fieldset",
    "variants": [
      "default",
      "bordered",
      "subtle",
      "card",
      "plain",
      "compact",
      "spacious",
      "inline",
      "grid",
      "two-columns",
      "three-columns",
      "choice-cards",
      "block"
    ],
    "states": [
      "default",
      "focus",
      "active",
      "complete",
      "success",
      "warning",
      "invalid",
      "error",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-fieldset-legend",
      "g-fieldset-legend-content",
      "g-fieldset-title",
      "g-fieldset-description",
      "g-fieldset-meta",
      "g-fieldset-badge",
      "g-fieldset-content",
      "g-fieldset-actions",
      "g-fieldset-help",
      "g-fieldset-feedback",
      "g-fieldset-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "form-row",
    "exportName": "GFormRowDirective",
    "directiveName": "gFormRow",
    "elementName": "g-form-row",
    "category": "form",
    "type": "css",
    "selector": ".g-form-row",
    "className": "g-form-row",
    "tag": "div",
    "variants": [
      "default",
      "auto",
      "one",
      "two",
      "three",
      "four",
      "split",
      "sidebar-start",
      "sidebar-end",
      "compact",
      "spacious",
      "align-start",
      "align-center",
      "align-end",
      "align-baseline",
      "stretch",
      "dense",
      "block"
    ],
    "states": [
      "default",
      "invalid",
      "error",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-form-row-item",
      "g-form-row-main",
      "g-form-row-aside",
      "g-form-row-actions",
      "g-form-row-divider",
      "g-form-row-span-2",
      "g-form-row-span-3",
      "g-form-row-span-full",
      "g-form-row-start-2",
      "g-form-row-start-3"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "form-grid",
    "exportName": "GFormGridDirective",
    "directiveName": "gFormGrid",
    "elementName": "g-form-grid",
    "category": "form",
    "type": "css",
    "selector": ".g-form-grid",
    "className": "g-form-grid",
    "tag": "div",
    "variants": [
      "default",
      "auto",
      "one",
      "two",
      "three",
      "four",
      "six",
      "twelve",
      "compact",
      "spacious",
      "dense",
      "align-start",
      "align-center",
      "align-end",
      "stretch",
      "full-span",
      "block"
    ],
    "states": [
      "default",
      "invalid",
      "error",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-form-grid-item",
      "g-form-grid-section",
      "g-form-grid-actions",
      "g-form-grid-divider",
      "g-form-grid-span-2",
      "g-form-grid-span-3",
      "g-form-grid-span-4",
      "g-form-grid-span-6",
      "g-form-grid-span-full",
      "g-form-grid-row-span-2",
      "g-form-grid-row-span-3",
      "g-form-grid-start-2",
      "g-form-grid-start-3",
      "g-form-grid-start-4"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "horizontal-form",
    "exportName": "GHorizontalFormDirective",
    "directiveName": "gHorizontalForm",
    "elementName": "g-horizontal-form",
    "category": "form",
    "type": "css",
    "selector": ".g-form-horizontal",
    "className": "g-form-horizontal",
    "tag": "div",
    "variants": [
      "default",
      "label-sm",
      "label-md",
      "label-lg",
      "compact",
      "spacious",
      "label-start",
      "label-center",
      "label-end",
      "stacked",
      "bordered",
      "block"
    ],
    "states": [
      "default",
      "invalid",
      "error",
      "success",
      "disabled",
      "read-only",
      "busy"
    ],
    "parts": [
      "g-form-horizontal-header",
      "g-form-horizontal-title",
      "g-form-horizontal-description",
      "g-form-horizontal-body",
      "g-form-horizontal-row",
      "g-form-horizontal-label",
      "g-form-horizontal-required",
      "g-form-horizontal-optional",
      "g-form-horizontal-content",
      "g-form-horizontal-control",
      "g-form-horizontal-help",
      "g-form-horizontal-feedback",
      "g-form-horizontal-actions",
      "g-form-horizontal-divider"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "inline-form",
    "exportName": "GInlineFormDirective",
    "directiveName": "gInlineForm",
    "elementName": "g-inline-form",
    "category": "form",
    "type": "css",
    "selector": ".g-form-inline",
    "className": "g-form-inline",
    "tag": "div",
    "variants": [
      "default",
      "wrap",
      "nowrap",
      "compact",
      "spacious",
      "align-start",
      "align-center",
      "align-end",
      "stretch",
      "field-sm",
      "field-md",
      "field-lg",
      "stacked",
      "bordered",
      "block"
    ],
    "states": [
      "default",
      "invalid",
      "error",
      "success",
      "disabled",
      "read-only",
      "busy",
      "submitted"
    ],
    "parts": [
      "g-form-inline-field",
      "g-form-inline-field-grow",
      "g-form-inline-field-fixed",
      "g-form-inline-label",
      "g-form-inline-required",
      "g-form-inline-optional",
      "g-form-inline-control",
      "g-form-inline-help",
      "g-form-inline-feedback",
      "g-form-inline-actions",
      "g-form-inline-status",
      "g-form-inline-divider"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "compact-form",
    "exportName": "GCompactFormDirective",
    "directiveName": "gCompactForm",
    "elementName": "g-compact-form",
    "category": "form",
    "type": "css",
    "selector": ".g-form-compact",
    "className": "g-form-compact",
    "tag": "form",
    "variants": [
      "default",
      "vertical",
      "inline",
      "joined",
      "two-columns",
      "three-columns",
      "tight",
      "comfortable",
      "bordered",
      "subtle",
      "block"
    ],
    "states": [
      "default",
      "invalid",
      "error",
      "success",
      "disabled",
      "read-only",
      "busy",
      "submitted"
    ],
    "parts": [
      "g-field",
      "g-input-group",
      "g-form-actions",
      "g-compact-form-header",
      "g-compact-form-title",
      "g-compact-form-description",
      "g-compact-form-body",
      "g-compact-form-field",
      "g-compact-form-label",
      "g-compact-form-required",
      "g-compact-form-optional",
      "g-compact-form-control",
      "g-compact-form-help",
      "g-compact-form-feedback",
      "g-compact-form-actions",
      "g-compact-form-status",
      "g-compact-form-divider",
      "g-compact-form-span-full"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "input-group",
    "exportName": "GInputGroupDirective",
    "directiveName": "gInputGroup",
    "elementName": "g-input-group",
    "category": "form",
    "type": "css",
    "selector": ".g-input-group",
    "className": "g-input-group",
    "tag": "div",
    "variants": [
      "default",
      "joined",
      "separated",
      "stacked",
      "block",
      "compact",
      "responsive",
      "mini",
      "small",
      "medium",
      "large",
      "filled",
      "outlined",
      "borderless"
    ],
    "states": [
      "default",
      "focus",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "read-only",
      "loading"
    ],
    "parts": [
      "g-input-group-label",
      "g-input-group-control",
      "g-input-addon",
      "g-input-prepend",
      "g-input-append",
      "g-input-search-button",
      "g-input-group-divider",
      "g-input-group-help",
      "g-input-group-feedback",
      "g-input-group-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "input-affix",
    "exportName": "GInputAffixDirective",
    "directiveName": "gInputAffix",
    "elementName": "g-input-affix",
    "category": "form",
    "type": "css",
    "selector": ".g-input-affix",
    "className": "g-input-affix",
    "tag": "div",
    "variants": [
      "default",
      "filled",
      "outlined",
      "borderless",
      "underlined",
      "block",
      "compact",
      "mini",
      "small",
      "medium",
      "large",
      "prefix",
      "suffix",
      "clearable",
      "loading"
    ],
    "states": [
      "default",
      "hover",
      "focus",
      "success",
      "warning",
      "error",
      "invalid",
      "loading",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-input-affix-label",
      "g-input-affix-control",
      "g-input-affix-start",
      "g-input-affix-end",
      "g-input-prefix",
      "g-input-suffix",
      "g-input-affix-action",
      "g-input-clear",
      "g-input-spinner",
      "g-input-affix-help",
      "g-input-affix-feedback",
      "g-input-affix-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "search-field",
    "exportName": "GSearchFieldDirective",
    "directiveName": "gSearchField",
    "elementName": "g-search-field",
    "category": "form",
    "type": "css",
    "selector": ".g-search-field",
    "className": "g-search-field",
    "tag": "div",
    "variants": [
      "default",
      "icon",
      "button",
      "custom-button",
      "clearable",
      "responsive",
      "block",
      "compact",
      "filled",
      "outlined",
      "borderless",
      "underlined",
      "mini",
      "small",
      "medium",
      "large"
    ],
    "states": [
      "default",
      "hover",
      "focus",
      "searching",
      "loading",
      "empty",
      "results",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-search-field-label",
      "g-search-field-control",
      "g-search-field-input-wrap",
      "g-search-field-icon",
      "g-search-field-input",
      "g-search-field-clear",
      "g-search-field-action",
      "g-search-field-spinner",
      "g-search-field-shortcut",
      "g-search-field-help",
      "g-search-field-feedback",
      "g-search-field-status",
      "g-search-field-result-count"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "password-field",
    "exportName": "GPasswordFieldDirective",
    "directiveName": "gPasswordField",
    "elementName": "g-password-field",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-password-toggle]",
    "cssSelector": ".g-password-field",
    "className": "g-password-field",
    "tag": "div",
    "variants": [
      "filled",
      "outlined",
      "borderless",
      "underlined",
      "clearable",
      "no-toggle",
      "hide-on-blur",
      "with-prefix",
      "with-strength",
      "block",
      "mini",
      "small",
      "medium",
      "large",
      "sm",
      "lg"
    ],
    "states": [
      "default",
      "hidden",
      "visible",
      "hover",
      "focus",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "read-only",
      "caps-lock"
    ],
    "parts": [
      "g-password-field-prefix",
      "g-password-field-input",
      "g-password-field-suffix",
      "g-password-field-action",
      "g-password-toggle",
      "g-password-toggle-icon",
      "g-password-clear",
      "g-password-field-caps"
    ],
    "behaviors": [
      "password-toggle"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "clearable-field",
    "exportName": "GClearableFieldDirective",
    "directiveName": "gClearableField",
    "elementName": "g-clearable-field",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-clear-input]",
    "cssSelector": ".g-clearable-field",
    "className": "g-clearable-field",
    "tag": "div",
    "variants": [
      "filled",
      "outlined",
      "borderless",
      "underlined",
      "interaction",
      "always-visible",
      "clear-on-escape",
      "with-prefix",
      "with-suffix",
      "textarea",
      "select",
      "block",
      "mini",
      "small",
      "medium",
      "large",
      "sm",
      "lg"
    ],
    "states": [
      "default",
      "empty",
      "has-value",
      "hover",
      "focus",
      "clearing",
      "cleared",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-clearable-field-prefix",
      "g-clearable-field-control",
      "g-clearable-field-input",
      "g-clearable-field-suffix",
      "g-clearable-field-action",
      "g-clearable-field-icon",
      "g-input-clear",
      "g-textarea-clear"
    ],
    "behaviors": [
      "clear-input"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "character-counter",
    "exportName": "GCharacterCounterDirective",
    "directiveName": "gCharacterCounter",
    "elementName": "g-character-counter",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-character-count]",
    "cssSelector": ".g-character-field",
    "className": "g-character-field",
    "tag": "div",
    "variants": [
      "default",
      "textarea",
      "input",
      "inline",
      "block",
      "compact",
      "count",
      "remaining",
      "soft-limit",
      "hard-limit",
      "mini",
      "small",
      "medium",
      "large"
    ],
    "states": [
      "default",
      "empty",
      "typing",
      "near-limit",
      "at-limit",
      "over-limit",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-character-field-label",
      "g-character-field-control",
      "g-character-field-input",
      "g-character-count",
      "g-character-count-current",
      "g-character-count-separator",
      "g-character-count-maximum",
      "g-character-field-help",
      "g-character-field-feedback",
      "g-character-field-status"
    ],
    "behaviors": [
      "character-count"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "validation-state",
    "exportName": "GValidationStateDirective",
    "directiveName": "gValidationState",
    "elementName": "g-validation-state",
    "category": "form",
    "type": "css",
    "selector": ".g-validation-state",
    "className": "g-validation-state",
    "tag": "div",
    "variants": [
      "default",
      "block",
      "inline",
      "with-icon",
      "reserve-message",
      "compact",
      "mini",
      "small",
      "medium",
      "large"
    ],
    "states": [
      "default",
      "focus",
      "success",
      "warning",
      "danger",
      "error",
      "invalid",
      "validating",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-validation-label",
      "g-validation-required",
      "g-validation-control",
      "g-validation-input",
      "g-validation-icon",
      "g-validation-message",
      "g-validation-help",
      "g-validation-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "checkbox-group",
    "exportName": "GCheckboxGroupDirective",
    "directiveName": "gCheckboxGroup",
    "elementName": "g-checkbox-group",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-row-select].g-check-group",
    "cssSelector": ".g-check-group",
    "className": "g-check-group",
    "tag": "fieldset",
    "variants": [
      "default",
      "stacked",
      "inline",
      "grid",
      "two",
      "three",
      "four",
      "buttons",
      "cards",
      "compact",
      "block",
      "small",
      "medium",
      "large"
    ],
    "states": [
      "default",
      "normal",
      "empty",
      "partial",
      "selected",
      "max",
      "success",
      "warning",
      "disabled",
      "read-only",
      "invalid",
      "error"
    ],
    "parts": [
      "g-choice-group-legend",
      "g-choice-group-label",
      "g-choice-group-title",
      "g-choice-group-description",
      "g-choice-group-options",
      "g-choice-group-option",
      "g-choice-group-option-content",
      "g-choice-group-select-all",
      "g-choice-group-count",
      "g-choice-group-help",
      "g-choice-group-feedback",
      "g-choice-group-status"
    ],
    "behaviors": [
      "row-select"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "radio-group",
    "exportName": "GRadioGroupDirective",
    "directiveName": "gRadioGroup",
    "elementName": "g-radio-group",
    "category": "form",
    "type": "css",
    "selector": ".g-radio-group",
    "className": "g-radio-group",
    "tag": "fieldset",
    "variants": [
      "default",
      "stacked",
      "inline",
      "grid",
      "two",
      "three",
      "four",
      "buttons",
      "cards",
      "compact",
      "block",
      "small",
      "medium",
      "large"
    ],
    "states": [
      "default",
      "normal",
      "empty",
      "selected",
      "success",
      "warning",
      "disabled",
      "read-only",
      "invalid",
      "error"
    ],
    "parts": [
      "g-choice-group-legend",
      "g-choice-group-label",
      "g-choice-group-title",
      "g-choice-group-description",
      "g-choice-group-options",
      "g-choice-group-option",
      "g-choice-group-option-content",
      "g-choice-group-help",
      "g-choice-group-feedback",
      "g-choice-group-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "switch-row",
    "exportName": "GSwitchRowDirective",
    "directiveName": "gSwitchRow",
    "elementName": "g-switch-row",
    "category": "form",
    "type": "css",
    "selector": ".g-switch-row",
    "className": "g-switch-row",
    "tag": "label",
    "variants": [
      "default",
      "plain",
      "compact",
      "spacious",
      "reverse",
      "bordered",
      "card",
      "block"
    ],
    "states": [
      "default",
      "normal",
      "unchecked",
      "checked",
      "success",
      "warning",
      "disabled",
      "loading",
      "read-only",
      "error",
      "invalid"
    ],
    "parts": [
      "g-switch-row-content",
      "g-switch-row-title",
      "g-switch-row-description",
      "g-switch-row-meta",
      "g-switch-row-control",
      "g-switch-row-extra",
      "g-switch-row-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "choice-card-group",
    "exportName": "GChoiceCardGroupDirective",
    "directiveName": "gChoiceCardGroup",
    "elementName": "g-choice-card-group",
    "category": "form",
    "type": "css",
    "selector": ".g-choice-group",
    "className": "g-choice-group",
    "tag": "fieldset",
    "variants": [
      "default",
      "grid",
      "two",
      "three",
      "four",
      "single",
      "multiple",
      "compact",
      "spacious",
      "horizontal",
      "block"
    ],
    "states": [
      "default",
      "normal",
      "empty",
      "selected",
      "success",
      "warning",
      "disabled",
      "read-only",
      "invalid",
      "error"
    ],
    "parts": [
      "g-choice-group-legend",
      "g-choice-group-description",
      "g-choice-group-options",
      "g-choice-card",
      "g-choice-card-input",
      "g-choice-card-header",
      "g-choice-card-icon",
      "g-choice-card-title",
      "g-choice-card-description",
      "g-choice-card-meta",
      "g-choice-card-badge",
      "g-choice-card-price",
      "g-choice-card-footer",
      "g-choice-card-check",
      "g-choice-group-help",
      "g-choice-group-feedback",
      "g-choice-group-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "name-group",
    "exportName": "GNameGroupDirective",
    "directiveName": "gNameGroup",
    "elementName": "g-name-group",
    "category": "form",
    "type": "css",
    "selector": ".g-name-group",
    "className": "g-name-group",
    "tag": "fieldset",
    "variants": [
      "default",
      "western",
      "eastern",
      "full",
      "compact",
      "spacious",
      "two",
      "three",
      "four",
      "block"
    ],
    "states": [
      "default",
      "normal",
      "success",
      "warning",
      "disabled",
      "read-only",
      "invalid",
      "error"
    ],
    "parts": [
      "g-name-group-legend",
      "g-name-group-description",
      "g-name-field",
      "g-name-prefix",
      "g-name-given",
      "g-name-middle",
      "g-name-family",
      "g-name-suffix",
      "g-name-phonetic",
      "g-name-preferred",
      "g-name-display",
      "g-name-group-help",
      "g-name-group-feedback",
      "g-name-group-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "address-group",
    "exportName": "GAddressGroupDirective",
    "directiveName": "gAddressGroup",
    "elementName": "g-address-group",
    "category": "form",
    "type": "css",
    "selector": ".g-address-group",
    "className": "g-address-group",
    "tag": "fieldset",
    "variants": [
      "default",
      "domestic",
      "international",
      "stacked",
      "card",
      "compact",
      "spacious",
      "block"
    ],
    "states": [
      "default",
      "normal",
      "success",
      "warning",
      "disabled",
      "read-only",
      "invalid",
      "error"
    ],
    "parts": [
      "g-address-group-legend",
      "g-address-group-description",
      "g-address-field",
      "g-address-recipient",
      "g-address-organization",
      "g-address-line",
      "g-address-line-1",
      "g-address-line-2",
      "g-address-country",
      "g-address-city",
      "g-address-region",
      "g-address-district",
      "g-address-dependent-locality",
      "g-address-postal",
      "g-address-sorting-code",
      "g-address-group-help",
      "g-address-group-feedback",
      "g-address-group-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "phone-group",
    "exportName": "GPhoneGroupDirective",
    "directiveName": "gPhoneGroup",
    "elementName": "g-phone-group",
    "category": "form",
    "type": "css",
    "selector": ".g-phone-group",
    "className": "g-phone-group",
    "tag": "fieldset",
    "variants": [
      "default",
      "domestic",
      "international",
      "stacked",
      "card",
      "compact",
      "spacious",
      "block"
    ],
    "states": [
      "default",
      "normal",
      "success",
      "warning",
      "disabled",
      "read-only",
      "invalid",
      "error"
    ],
    "parts": [
      "g-phone-group-legend",
      "g-phone-group-description",
      "g-phone-field",
      "g-phone-country",
      "g-phone-country-code",
      "g-phone-national",
      "g-phone-extension",
      "g-phone-type",
      "g-phone-group-help",
      "g-phone-group-feedback",
      "g-phone-group-status",
      "g-phone-preview"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "money-group",
    "exportName": "GMoneyGroupDirective",
    "directiveName": "gMoneyGroup",
    "elementName": "g-money-group",
    "category": "form",
    "type": "css",
    "selector": ".g-money-group",
    "className": "g-money-group",
    "tag": "fieldset",
    "variants": [
      "default",
      "domestic",
      "international",
      "accounting",
      "stacked",
      "card",
      "compact",
      "spacious",
      "block"
    ],
    "states": [
      "default",
      "normal",
      "success",
      "warning",
      "disabled",
      "read-only",
      "invalid",
      "error"
    ],
    "parts": [
      "g-money-group-legend",
      "g-money-group-description",
      "g-money-field",
      "g-money-currency",
      "g-money-amount",
      "g-money-control",
      "g-money-symbol",
      "g-money-minor-unit",
      "g-money-tax",
      "g-money-exchange-rate",
      "g-money-converted",
      "g-money-group-help",
      "g-money-group-feedback",
      "g-money-group-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "date-range-group",
    "exportName": "GDateRangeGroupDirective",
    "directiveName": "gDateRangeGroup",
    "elementName": "g-date-range-group",
    "category": "form",
    "type": "css",
    "selector": ".g-date-range-group",
    "className": "g-date-range-group",
    "tag": "fieldset",
    "variants": [
      "default",
      "date",
      "datetime",
      "inclusive",
      "exclusive",
      "stacked",
      "card",
      "compact",
      "spacious",
      "block"
    ],
    "states": [
      "default",
      "normal",
      "partial",
      "complete",
      "success",
      "warning",
      "disabled",
      "read-only",
      "invalid",
      "error"
    ],
    "parts": [
      "g-date-range-legend",
      "g-date-range-description",
      "g-date-range-field",
      "g-date-range-start",
      "g-date-range-end",
      "g-range-separator",
      "g-date-range-presets",
      "g-date-range-preset",
      "g-date-range-duration",
      "g-date-range-help",
      "g-date-range-feedback",
      "g-date-range-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "time-range-group",
    "exportName": "GTimeRangeGroupDirective",
    "directiveName": "gTimeRangeGroup",
    "elementName": "g-time-range-group",
    "category": "form",
    "type": "css",
    "selector": ".g-time-range-group",
    "className": "g-time-range-group",
    "tag": "div",
    "variants": [
      "default",
      "same-day",
      "overnight",
      "inclusive",
      "exclusive",
      "stacked",
      "card",
      "compact",
      "spacious",
      "block"
    ],
    "states": [
      "default",
      "normal",
      "partial",
      "complete",
      "success",
      "warning",
      "disabled",
      "read-only",
      "invalid",
      "error"
    ],
    "parts": [
      "g-time-range-legend",
      "g-time-range-description",
      "g-time-range-field",
      "g-time-range-start",
      "g-time-range-end",
      "g-range-separator",
      "g-time-range-timezone",
      "g-time-range-presets",
      "g-time-range-preset",
      "g-time-range-duration",
      "g-time-range-help",
      "g-time-range-feedback",
      "g-time-range-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "unit-field",
    "exportName": "GUnitFieldDirective",
    "directiveName": "gUnitField",
    "elementName": "g-unit-field",
    "category": "form",
    "type": "css",
    "selector": ".g-unit-field",
    "className": "g-unit-field",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "range-field",
    "exportName": "GRangeFieldDirective",
    "directiveName": "gRangeField",
    "elementName": "g-range-field",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-field-sync].g-range-field",
    "cssSelector": ".g-range-field",
    "className": "g-range-field",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-range-field-output"
    ],
    "behaviors": [
      "field-sync"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "file-field",
    "exportName": "GFileFieldDirective",
    "directiveName": "gFileField",
    "elementName": "g-file-field",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-field-sync].g-file-field",
    "cssSelector": ".g-file-field",
    "className": "g-file-field",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-file-field-control",
      "g-file-field-name"
    ],
    "behaviors": [
      "field-sync"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "repeatable-field",
    "exportName": "GRepeatableFieldDirective",
    "directiveName": "gRepeatableField",
    "elementName": "g-repeatable-field",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-repeatable-field]",
    "cssSelector": ".g-repeatable-field",
    "className": "g-repeatable-field",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-repeatable-list",
      "g-repeatable-item",
      "g-repeatable-content",
      "g-repeatable-actions"
    ],
    "behaviors": [
      "repeatable-field"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "conditional-field",
    "exportName": "GConditionalFieldDirective",
    "directiveName": "gConditionalField",
    "elementName": "g-conditional-field",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-conditional-field]",
    "cssSelector": ".g-conditional-field",
    "className": "g-conditional-field",
    "tag": "div",
    "variants": [
      "panel",
      "accent",
      "compact"
    ],
    "states": [
      "visible",
      "hidden",
      "unresolved"
    ],
    "parts": [
      "g-conditional-field-header",
      "g-conditional-field-title",
      "g-conditional-field-description",
      "g-conditional-field-status",
      "g-conditional-field-content"
    ],
    "behaviors": [
      "conditional-field"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "form-actions",
    "exportName": "GFormActionsDirective",
    "directiveName": "gFormActions",
    "elementName": "g-form-actions",
    "category": "form",
    "type": "css",
    "selector": ".g-form-actions",
    "className": "g-form-actions",
    "tag": "div",
    "variants": [
      "end",
      "start",
      "between",
      "center",
      "stacked",
      "block",
      "compact",
      "spacious",
      "bordered",
      "subtle",
      "sticky",
      "sticky-bleed"
    ],
    "states": [
      "default",
      "busy",
      "success",
      "warning",
      "error",
      "disabled"
    ],
    "parts": [
      "g-form-actions-main",
      "g-form-actions-secondary",
      "g-form-actions-meta",
      "g-form-actions-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "autosave-status",
    "exportName": "GAutosaveStatusDirective",
    "directiveName": "gAutosaveStatus",
    "elementName": "g-autosave-status",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-autosave].g-autosave-status",
    "cssSelector": ".g-autosave-status",
    "className": "g-autosave-status",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "badge",
      "subtle",
      "block"
    ],
    "states": [
      "idle",
      "dirty",
      "saving",
      "saved",
      "error",
      "offline",
      "disabled"
    ],
    "parts": [
      "g-autosave-status-indicator",
      "g-autosave-status-label",
      "g-autosave-status-time",
      "g-autosave-status-detail",
      "g-autosave-status-actions",
      "g-autosave-status-retry"
    ],
    "behaviors": [
      "autosave"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "form-progress",
    "exportName": "GFormProgressDirective",
    "directiveName": "gFormProgress",
    "elementName": "g-form-progress",
    "category": "form",
    "type": "css",
    "selector": ".g-form-progress",
    "className": "g-form-progress",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "spacious",
      "card",
      "subtle",
      "rounded",
      "square",
      "segmented",
      "with-steps",
      "vertical-steps"
    ],
    "states": [
      "default",
      "empty",
      "active",
      "partial",
      "complete",
      "success",
      "warning",
      "error",
      "disabled"
    ],
    "parts": [
      "g-form-progress-header",
      "g-form-progress-meta",
      "g-form-progress-heading",
      "g-form-progress-label",
      "g-form-progress-description",
      "g-form-progress-count",
      "g-form-progress-percentage",
      "g-form-progress-track",
      "g-form-progress-value",
      "g-form-progress-steps",
      "g-form-progress-step",
      "g-form-progress-step-marker",
      "g-form-progress-step-content",
      "g-form-progress-step-title",
      "g-form-progress-step-description",
      "g-form-progress-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "form-review",
    "exportName": "GFormReviewDirective",
    "directiveName": "gFormReview",
    "elementName": "g-form-review",
    "category": "form",
    "type": "css",
    "selector": ".g-form-review",
    "className": "g-form-review",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "spacious",
      "bordered",
      "card",
      "subtle",
      "divided",
      "striped",
      "vertical",
      "two-column",
      "editable"
    ],
    "states": [
      "default",
      "complete",
      "changed",
      "warning",
      "error",
      "invalid",
      "disabled",
      "empty",
      "read-only"
    ],
    "parts": [
      "g-form-review-header",
      "g-form-review-heading",
      "g-form-review-title",
      "g-form-review-description",
      "g-form-review-summary",
      "g-form-review-actions",
      "g-form-review-section",
      "g-form-review-section-header",
      "g-form-review-section-title",
      "g-form-review-section-description",
      "g-form-review-list",
      "g-form-review-row",
      "g-form-review-label",
      "g-form-review-value",
      "g-form-review-value-primary",
      "g-form-review-value-secondary",
      "g-form-review-action",
      "g-form-review-empty",
      "g-form-review-note",
      "g-form-review-footer",
      "g-form-review-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "consent-group",
    "exportName": "GConsentGroupDirective",
    "directiveName": "gConsentGroup",
    "elementName": "g-consent-group",
    "category": "form",
    "type": "css",
    "selector": ".g-consent-group",
    "className": "g-consent-group",
    "tag": "div",
    "variants": [
      "default",
      "plain",
      "bordered",
      "card",
      "subtle",
      "compact",
      "spacious",
      "divided",
      "inline",
      "legal"
    ],
    "states": [
      "default",
      "unchecked",
      "partial",
      "accepted",
      "success",
      "warning",
      "error",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-consent-group-header",
      "g-consent-group-title",
      "g-consent-group-required",
      "g-consent-group-description",
      "g-consent-group-summary",
      "g-consent-group-items",
      "g-consent-group-item",
      "g-consent-group-control",
      "g-consent-group-content",
      "g-consent-group-label",
      "g-consent-group-item-description",
      "g-consent-group-links",
      "g-consent-group-link",
      "g-consent-group-meta",
      "g-consent-group-version",
      "g-consent-group-timestamp",
      "g-consent-group-feedback",
      "g-consent-group-footer",
      "g-consent-group-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "navbar",
    "exportName": "GNavbarDirective",
    "directiveName": "gNavbar",
    "elementName": "g-navbar",
    "category": "navigation",
    "type": "css",
    "selector": ".g-navbar",
    "className": "g-navbar",
    "tag": "nav",
    "variants": [
      "default",
      "bordered",
      "transparent",
      "floating",
      "dark",
      "compact",
      "spacious",
      "centered",
      "sticky"
    ],
    "states": [
      "normal",
      "open",
      "scrolled",
      "disabled"
    ],
    "parts": [
      "g-navbar-inner",
      "g-navbar-start",
      "g-navbar-center",
      "g-navbar-end",
      "g-navbar-brand",
      "g-navbar-brand-mark",
      "g-navbar-brand-text",
      "g-navbar-nav",
      "g-navbar-item",
      "g-nav-link",
      "g-navbar-actions",
      "g-navbar-action-secondary",
      "g-navbar-toggle",
      "g-navbar-toggle-icon",
      "g-navbar-mobile-panel",
      "g-navbar-mobile-header",
      "g-navbar-mobile-body",
      "g-navbar-mobile-footer",
      "g-navbar-divider"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "sidebar",
    "exportName": "GSidebarDirective",
    "directiveName": "gSidebar",
    "elementName": "g-sidebar",
    "category": "navigation",
    "type": "css",
    "selector": ".g-sidebar",
    "className": "g-sidebar",
    "tag": "aside",
    "variants": [
      "default",
      "bordered",
      "elevated",
      "floating",
      "compact",
      "spacious",
      "collapsed",
      "drawer",
      "sticky",
      "dark"
    ],
    "states": [
      "normal",
      "open",
      "collapsed",
      "disabled"
    ],
    "parts": [
      "g-sidebar-surface",
      "g-sidebar-header",
      "g-sidebar-brand",
      "g-sidebar-brand-mark",
      "g-sidebar-brand-content",
      "g-sidebar-title",
      "g-sidebar-subtitle",
      "g-sidebar-toggle",
      "g-sidebar-search",
      "g-sidebar-body",
      "g-sidebar-nav",
      "g-sidebar-group",
      "g-sidebar-section",
      "g-sidebar-list",
      "g-sidebar-item",
      "g-sidebar-link",
      "g-sidebar-icon",
      "g-sidebar-label",
      "g-sidebar-meta",
      "g-sidebar-badge",
      "g-sidebar-trailing",
      "g-sidebar-subnav",
      "g-sidebar-divider",
      "g-sidebar-footer",
      "g-sidebar-account",
      "g-sidebar-account-content",
      "g-sidebar-account-name",
      "g-sidebar-account-meta"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "breadcrumb",
    "exportName": "GBreadcrumbDirective",
    "directiveName": "gBreadcrumb",
    "elementName": "g-breadcrumb",
    "category": "navigation",
    "type": "css",
    "selector": ".g-breadcrumb",
    "className": "g-breadcrumb",
    "tag": "nav",
    "variants": [
      "default",
      "compact",
      "spacious",
      "contained",
      "subtle",
      "inverse",
      "wrap",
      "scroll",
      "collapsed",
      "chevron",
      "dot"
    ],
    "states": [
      "normal",
      "current",
      "overflow",
      "disabled"
    ],
    "parts": [
      "g-breadcrumb-list",
      "g-breadcrumb-item",
      "g-breadcrumb-link",
      "g-breadcrumb-home",
      "g-breadcrumb-icon",
      "g-breadcrumb-label",
      "g-breadcrumb-separator",
      "g-breadcrumb-overflow",
      "g-breadcrumb-ellipsis",
      "g-breadcrumb-menu",
      "g-breadcrumb-current"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tabs",
    "exportName": "GTabsDirective",
    "directiveName": "gTabs",
    "elementName": "g-tabs",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-tabs]",
    "className": "g-tabs",
    "tag": "div",
    "variants": [
      "line",
      "card",
      "pill",
      "contained",
      "compact",
      "spacious",
      "block",
      "centered",
      "vertical",
      "scrollable"
    ],
    "states": [
      "normal",
      "active",
      "disabled",
      "loading",
      "empty"
    ],
    "parts": [
      "g-tabs-header",
      "g-tab-list",
      "g-tab-item",
      "g-tab",
      "g-tab-icon",
      "g-tab-label",
      "g-tab-badge",
      "g-tab-close",
      "g-tabs-actions",
      "g-tab-panels",
      "g-tab-panel",
      "g-tab-panel-header",
      "g-tab-panel-body",
      "g-tab-empty"
    ],
    "behaviors": [
      "tabs"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "segmented-control",
    "exportName": "GSegmentedControlDirective",
    "directiveName": "gSegmentedControl",
    "elementName": "g-segmented-control",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-data-view].g-segmented",
    "cssSelector": ".g-segmented",
    "className": "g-segmented",
    "tag": "div",
    "variants": [
      "default",
      "outlined",
      "solid",
      "small",
      "medium",
      "large",
      "compact",
      "spacious",
      "block",
      "responsive",
      "equal",
      "vertical",
      "icon-only"
    ],
    "states": [
      "normal",
      "selected",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-segmented-item",
      "g-segmented-icon",
      "g-segmented-content",
      "g-segmented-label",
      "g-segmented-description",
      "g-segmented-badge",
      "g-segmented-input"
    ],
    "behaviors": [
      "data-view"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "pagination",
    "exportName": "GPaginationDirective",
    "directiveName": "gPagination",
    "elementName": "g-pagination",
    "category": "navigation",
    "type": "css",
    "selector": ".g-pagination",
    "className": "g-pagination",
    "tag": "nav",
    "variants": [
      "default",
      "compact",
      "spacious",
      "mini",
      "simple",
      "bordered",
      "borderless",
      "rounded",
      "circle",
      "block",
      "centered",
      "end",
      "responsive"
    ],
    "states": [
      "normal",
      "current",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-pagination-total",
      "g-pagination-list",
      "g-pagination-item",
      "g-page-link",
      "g-page-previous",
      "g-page-next",
      "g-page-number",
      "g-page-ellipsis",
      "g-page-icon",
      "g-page-label",
      "g-pagination-size-label",
      "g-pagination-size",
      "g-pagination-jumper",
      "g-pagination-jumper-label",
      "g-page-jumper",
      "g-pagination-submit",
      "g-pagination-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "menu-dropdown",
    "exportName": "GMenuDropdownDirective",
    "directiveName": "gMenuDropdown",
    "elementName": "g-menu-dropdown",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-dropdown]",
    "cssSelector": ".g-dropdown",
    "className": "g-dropdown",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "spacious",
      "bordered",
      "borderless",
      "shadowless",
      "start",
      "end",
      "top",
      "block",
      "scrollable"
    ],
    "states": [
      "closed",
      "open",
      "selected",
      "checked",
      "disabled",
      "loading",
      "empty"
    ],
    "parts": [
      "g-dropdown-trigger",
      "g-dropdown-trigger-label",
      "g-dropdown-trigger-icon",
      "g-dropdown-menu",
      "g-dropdown-header",
      "g-dropdown-title",
      "g-dropdown-description",
      "g-menu",
      "g-menu-group",
      "g-menu-label",
      "g-menu-item",
      "g-menu-item-icon",
      "g-menu-item-content",
      "g-menu-item-label",
      "g-menu-item-description",
      "g-menu-item-check",
      "g-menu-badge",
      "g-menu-shortcut",
      "g-menu-divider",
      "g-menu-submenu",
      "g-submenu-menu",
      "g-dropdown-empty",
      "g-dropdown-footer"
    ],
    "behaviors": [
      "dropdown"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "stepper",
    "exportName": "GStepperDirective",
    "directiveName": "gStepper",
    "elementName": "g-stepper",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-stepper]",
    "cssSelector": ".g-stepper",
    "className": "g-stepper",
    "tag": "div",
    "variants": [
      "default",
      "horizontal",
      "vertical",
      "compact",
      "spacious",
      "navigation",
      "responsive",
      "contained",
      "label-start"
    ],
    "states": [
      "pending",
      "active",
      "complete",
      "error",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-step",
      "g-step-action",
      "g-step-indicator",
      "g-step-icon",
      "g-step-content",
      "g-step-title",
      "g-step-label",
      "g-step-description",
      "g-step-status",
      "g-stepper-summary",
      "g-stepper-actions"
    ],
    "behaviors": [
      "stepper"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "command-palette",
    "exportName": "GCommandPaletteDirective",
    "directiveName": "gCommandPalette",
    "elementName": "g-command-palette",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-command-palette]",
    "cssSelector": ".g-command-palette-overlay",
    "className": "g-command-palette-overlay",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "spacious",
      "small",
      "wide",
      "top",
      "centered",
      "responsive"
    ],
    "states": [
      "closed",
      "open",
      "loading",
      "empty",
      "filtered",
      "disabled"
    ],
    "parts": [
      "g-command-palette",
      "g-command-header",
      "g-command-search",
      "g-command-search-icon",
      "g-command-input",
      "g-command-clear",
      "g-command-results",
      "g-command-group",
      "g-command-group-label",
      "g-command-list",
      "g-command-item",
      "g-command-item-icon",
      "g-command-item-content",
      "g-command-item-title",
      "g-command-item-description",
      "g-command-item-shortcut",
      "g-command-empty",
      "g-command-footer",
      "g-command-hint",
      "g-command-count"
    ],
    "behaviors": [
      "command-palette"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "primary-navigation",
    "exportName": "GPrimaryNavigationDirective",
    "directiveName": "gPrimaryNavigation",
    "elementName": "g-primary-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-primary-nav",
    "className": "g-primary-nav",
    "tag": "div",
    "variants": [
      "default",
      "horizontal",
      "vertical",
      "compact",
      "spacious",
      "pill",
      "underline",
      "contained",
      "centered",
      "end",
      "block",
      "scrollable",
      "responsive"
    ],
    "states": [
      "normal",
      "current",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-primary-nav-list",
      "g-primary-nav-item",
      "g-primary-nav-link",
      "g-primary-nav-icon",
      "g-primary-nav-content",
      "g-primary-nav-label",
      "g-primary-nav-description",
      "g-primary-nav-badge",
      "g-primary-nav-indicator",
      "g-primary-nav-actions"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "utility-navigation",
    "exportName": "GUtilityNavigationDirective",
    "directiveName": "gUtilityNavigation",
    "elementName": "g-utility-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-utility-nav",
    "className": "g-utility-nav",
    "tag": "div",
    "variants": [
      "default",
      "horizontal",
      "vertical",
      "compact",
      "spacious",
      "pill",
      "divided",
      "contained",
      "centered",
      "end",
      "scrollable",
      "responsive"
    ],
    "states": [
      "normal",
      "current",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-utility-nav-list",
      "g-utility-nav-item",
      "g-utility-nav-link",
      "g-utility-nav-icon",
      "g-utility-nav-label",
      "g-utility-nav-description",
      "g-utility-nav-badge",
      "g-utility-nav-shortcut",
      "g-utility-nav-separator",
      "g-utility-nav-actions"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "sub-navigation",
    "exportName": "GSubNavigationDirective",
    "directiveName": "gSubNavigation",
    "elementName": "g-sub-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-subnav",
    "className": "g-subnav",
    "tag": "div",
    "variants": [
      "default",
      "horizontal",
      "vertical",
      "compact",
      "spacious",
      "underline",
      "pill",
      "contained",
      "borderless",
      "centered",
      "end",
      "block",
      "scrollable",
      "responsive",
      "sticky"
    ],
    "states": [
      "normal",
      "current",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-subnav-list",
      "g-subnav-item",
      "g-subnav-link",
      "g-subnav-icon",
      "g-subnav-content",
      "g-subnav-label",
      "g-subnav-description",
      "g-subnav-badge",
      "g-subnav-indicator",
      "g-subnav-actions"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "collapsible-navigation",
    "exportName": "GCollapsibleNavigationDirective",
    "directiveName": "gCollapsibleNavigation",
    "elementName": "g-collapsible-navigation",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-nav-toggle].g-collapsible-nav",
    "cssSelector": ".g-collapsible-nav",
    "className": "g-collapsible-nav",
    "tag": "div",
    "variants": [
      "default",
      "bordered",
      "elevated",
      "compact",
      "spacious",
      "flush",
      "inset",
      "nested",
      "responsive"
    ],
    "states": [
      "expanded",
      "collapsed",
      "current",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-collapsible-nav-header",
      "g-collapsible-nav-heading",
      "g-collapsible-nav-title",
      "g-collapsible-nav-description",
      "g-collapsible-nav-trigger",
      "g-collapsible-nav-trigger-label",
      "g-collapsible-nav-trigger-icon",
      "g-collapsible-nav-body",
      "g-collapsible-nav-group",
      "g-collapsible-nav-list",
      "g-collapsible-nav-item",
      "g-collapsible-nav-link",
      "g-collapsible-nav-icon",
      "g-collapsible-nav-label",
      "g-collapsible-nav-link-description",
      "g-collapsible-nav-badge",
      "g-collapsible-nav-footer",
      "g-collapsible-nav-status"
    ],
    "behaviors": [
      "nav-toggle"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "navigation-rail",
    "exportName": "GNavigationRailDirective",
    "directiveName": "gNavigationRail",
    "elementName": "g-navigation-rail",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-roving-nav].g-nav-rail",
    "cssSelector": ".g-nav-rail",
    "className": "g-nav-rail",
    "tag": "nav",
    "variants": [
      "default",
      "compact",
      "expanded",
      "bordered",
      "elevated",
      "floating",
      "dark",
      "responsive"
    ],
    "states": [
      "normal",
      "current",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-nav-rail-header",
      "g-nav-rail-brand",
      "g-nav-rail-brand-mark",
      "g-nav-rail-primary-action",
      "g-nav-rail-list",
      "g-nav-rail-group",
      "g-nav-rail-group-label",
      "g-nav-rail-item",
      "g-nav-rail-icon",
      "g-nav-rail-label",
      "g-nav-rail-description",
      "g-nav-rail-badge",
      "g-nav-rail-indicator",
      "g-nav-rail-divider",
      "g-nav-rail-spacer",
      "g-nav-rail-footer",
      "g-nav-rail-action"
    ],
    "behaviors": [
      "roving-nav"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "activity-bar",
    "exportName": "GActivityBarDirective",
    "directiveName": "gActivityBar",
    "elementName": "g-activity-bar",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-roving-nav].g-activitybar",
    "cssSelector": ".g-activitybar",
    "className": "g-activitybar",
    "tag": "nav",
    "variants": [
      "default",
      "compact",
      "spacious",
      "bordered",
      "floating",
      "dark"
    ],
    "states": [
      "normal",
      "current",
      "disabled",
      "loading",
      "notification"
    ],
    "parts": [
      "g-activitybar-header",
      "g-activitybar-brand",
      "g-activitybar-list",
      "g-activitybar-group",
      "g-activitybar-item",
      "g-activitybar-icon",
      "g-activitybar-label",
      "g-activitybar-badge",
      "g-activitybar-indicator",
      "g-activitybar-spacer",
      "g-activitybar-divider",
      "g-activitybar-footer",
      "g-activitybar-action",
      "g-activitybar-status"
    ],
    "behaviors": [
      "roving-nav"
    ],
    "platforms": [
      "desktop",
      "tauri",
      "electron"
    ]
  },
  {
    "name": "menu-bar",
    "exportName": "GMenuBarDirective",
    "directiveName": "gMenuBar",
    "elementName": "g-menu-bar",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-roving-nav].g-menubar",
    "cssSelector": ".g-menubar",
    "className": "g-menubar",
    "tag": "nav",
    "variants": [
      "default",
      "compact",
      "spacious",
      "bordered",
      "elevated",
      "floating",
      "dark",
      "integrated"
    ],
    "states": [
      "normal",
      "open",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-menubar-start",
      "g-menubar-brand",
      "g-menubar-list",
      "g-menubar-menu",
      "g-menubar-item",
      "g-menubar-item-label",
      "g-menubar-item-caret",
      "g-menubar-menu-panel",
      "g-menubar-menu-group",
      "g-menubar-menu-group-label",
      "g-menubar-menu-item",
      "g-menubar-menu-item-icon",
      "g-menubar-menu-item-label",
      "g-menubar-menu-item-shortcut",
      "g-menubar-menu-item-check",
      "g-menubar-separator",
      "g-menubar-end",
      "g-menubar-status"
    ],
    "behaviors": [
      "roving-nav"
    ],
    "platforms": [
      "desktop",
      "tauri",
      "electron"
    ]
  },
  {
    "name": "context-menu",
    "exportName": "GContextMenuDirective",
    "directiveName": "gContextMenu",
    "elementName": "g-context-menu",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-context-menu].g-context-menu",
    "cssSelector": ".g-context-menu",
    "className": "g-context-menu",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "spacious",
      "bordered",
      "elevated",
      "dark"
    ],
    "states": [
      "normal",
      "open",
      "disabled",
      "loading"
    ],
    "parts": [
      "g-context-menu-target",
      "g-context-menu-target-icon",
      "g-context-menu-target-content",
      "g-context-menu-target-title",
      "g-context-menu-target-description",
      "g-context-menu-target-meta",
      "g-context-menu-panel",
      "g-context-menu-group",
      "g-context-menu-group-label",
      "g-context-menu-item",
      "g-context-menu-item-icon",
      "g-context-menu-item-label",
      "g-context-menu-item-shortcut",
      "g-context-menu-item-check",
      "g-context-menu-separator",
      "g-context-menu-status"
    ],
    "behaviors": [
      "context-menu"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tree-navigation",
    "exportName": "GTreeNavigationDirective",
    "directiveName": "gTreeNavigation",
    "elementName": "g-tree-navigation",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-tree].g-tree-nav",
    "cssSelector": ".g-tree-nav",
    "className": "g-tree-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-tree-nav-group",
      "g-tree-nav-row",
      "g-tree-nav-toggle"
    ],
    "behaviors": [
      "tree"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "vertical-tabs",
    "exportName": "GVerticalTabsDirective",
    "directiveName": "gVerticalTabs",
    "elementName": "g-vertical-tabs",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-tabs].g-vertical-tabs",
    "cssSelector": ".g-vertical-tabs",
    "className": "g-vertical-tabs",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-vertical-tab-list",
      "g-vertical-tab",
      "g-vertical-tab-panel"
    ],
    "behaviors": [
      "tabs"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "pill-navigation",
    "exportName": "GPillNavigationDirective",
    "directiveName": "gPillNavigation",
    "elementName": "g-pill-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-pill-nav",
    "className": "g-pill-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-pill-nav-link"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "scrollspy-navigation",
    "exportName": "GScrollspyNavigationDirective",
    "directiveName": "gScrollspyNavigation",
    "elementName": "g-scrollspy-navigation",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-scrollspy]",
    "cssSelector": ".g-scrollspy-nav",
    "className": "g-scrollspy-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-scrollspy-link"
    ],
    "behaviors": [
      "scrollspy"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "cursor-pagination",
    "exportName": "GCursorPaginationDirective",
    "directiveName": "gCursorPagination",
    "elementName": "g-cursor-pagination",
    "category": "navigation",
    "type": "css",
    "selector": ".g-cursor-pagination",
    "className": "g-cursor-pagination",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-cursor-pagination-info",
      "g-cursor-pagination-actions"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "load-more-navigation",
    "exportName": "GLoadMoreNavigationDirective",
    "directiveName": "gLoadMoreNavigation",
    "elementName": "g-load-more-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-load-more-nav",
    "className": "g-load-more-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-load-more-status"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "wizard-navigation",
    "exportName": "GWizardNavigationDirective",
    "directiveName": "gWizardNavigation",
    "elementName": "g-wizard-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-wizard-nav",
    "className": "g-wizard-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-wizard-nav-steps",
      "g-wizard-nav-step",
      "g-wizard-nav-label",
      "g-wizard-nav-content"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "back-navigation",
    "exportName": "GBackNavigationDirective",
    "directiveName": "gBackNavigation",
    "elementName": "g-back-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-back-nav",
    "className": "g-back-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "previous-next-navigation",
    "exportName": "GPreviousNextNavigationDirective",
    "directiveName": "gPreviousNextNavigation",
    "elementName": "g-previous-next-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-prev-next-nav",
    "className": "g-prev-next-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-prev-next-link",
      "g-prev-next-direction"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "skip-navigation",
    "exportName": "GSkipNavigationDirective",
    "directiveName": "gSkipNavigation",
    "elementName": "g-skip-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-skip-nav",
    "className": "g-skip-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-skip-nav-link"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-top-navigation",
    "exportName": "GMobileTopNavigationDirective",
    "directiveName": "gMobileTopNavigation",
    "elementName": "g-mobile-top-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-mobile-top-nav",
    "className": "g-mobile-top-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-mobile-top-nav-title"
    ],
    "behaviors": [],
    "platforms": [
      "mobile"
    ]
  },
  {
    "name": "bottom-navigation",
    "exportName": "GBottomNavigationDirective",
    "directiveName": "gBottomNavigation",
    "elementName": "g-bottom-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-bottom-nav",
    "className": "g-bottom-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-bottom-nav-item"
    ],
    "behaviors": [],
    "platforms": [
      "mobile"
    ]
  },
  {
    "name": "mobile-tab-bar",
    "exportName": "GMobileTabBarDirective",
    "directiveName": "gMobileTabBar",
    "elementName": "g-mobile-tab-bar",
    "category": "navigation",
    "type": "css",
    "selector": ".g-mobile-tab-bar",
    "className": "g-mobile-tab-bar",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-mobile-tab-item"
    ],
    "behaviors": [],
    "platforms": [
      "mobile"
    ]
  },
  {
    "name": "drawer-navigation",
    "exportName": "GDrawerNavigationDirective",
    "directiveName": "gDrawerNavigation",
    "elementName": "g-drawer-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-drawer-nav",
    "className": "g-drawer-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-drawer-nav-header",
      "g-drawer-nav-body",
      "g-drawer-nav-footer"
    ],
    "behaviors": [],
    "platforms": [
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "command-navigation",
    "exportName": "GCommandNavigationDirective",
    "directiveName": "gCommandNavigation",
    "elementName": "g-command-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-command-nav",
    "className": "g-command-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-command-nav-item",
      "g-command-nav-key"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "jump-navigation",
    "exportName": "GJumpNavigationDirective",
    "directiveName": "gJumpNavigation",
    "elementName": "g-jump-navigation",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-jump-nav]",
    "cssSelector": ".g-jump-nav",
    "className": "g-jump-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [],
    "behaviors": [
      "jump-nav"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "quick-navigation",
    "exportName": "GQuickNavigationDirective",
    "directiveName": "gQuickNavigation",
    "elementName": "g-quick-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-quick-nav",
    "className": "g-quick-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-quick-nav-item"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "locale-navigation",
    "exportName": "GLocaleNavigationDirective",
    "directiveName": "gLocaleNavigation",
    "elementName": "g-locale-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-locale-nav",
    "className": "g-locale-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-locale-nav-trigger",
      "g-locale-nav-menu"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "account-navigation",
    "exportName": "GAccountNavigationDirective",
    "directiveName": "gAccountNavigation",
    "elementName": "g-account-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-account-nav",
    "className": "g-account-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-account-nav-trigger",
      "g-account-nav-menu"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "dialog",
    "exportName": "GDialogDirective",
    "directiveName": "gDialog",
    "elementName": "g-dialog",
    "category": "overlay",
    "type": "interactive",
    "selector": "[data-g-dialog]",
    "cssSelector": ".g-dialog-backdrop",
    "className": "g-dialog-backdrop",
    "tag": "div",
    "variants": [
      "small",
      "medium",
      "large",
      "xl",
      "centered",
      "fullscreen",
      "top"
    ],
    "states": [
      "closed",
      "open",
      "loading"
    ],
    "parts": [
      "g-dialog",
      "g-dialog-header",
      "g-dialog-title",
      "g-dialog-body",
      "g-dialog-footer",
      "g-dialog-close"
    ],
    "behaviors": [
      "dialog"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "drawer",
    "exportName": "GDrawerDirective",
    "directiveName": "gDrawer",
    "elementName": "g-drawer",
    "category": "overlay",
    "type": "interactive",
    "selector": "[data-g-drawer]",
    "cssSelector": ".g-drawer-backdrop",
    "className": "g-drawer-backdrop",
    "tag": "div",
    "variants": [
      "small",
      "medium",
      "large",
      "xl"
    ],
    "states": [
      "closed",
      "open",
      "loading"
    ],
    "parts": [
      "g-drawer",
      "g-drawer-header",
      "g-drawer-title",
      "g-drawer-body",
      "g-drawer-footer"
    ],
    "behaviors": [
      "drawer"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "popover",
    "exportName": "GPopoverDirective",
    "directiveName": "gPopover",
    "elementName": "g-popover",
    "category": "overlay",
    "type": "interactive",
    "selector": "[data-g-popover]",
    "cssSelector": ".g-popover",
    "className": "g-popover",
    "tag": "div",
    "variants": [
      "compact",
      "wide"
    ],
    "states": [
      "closed",
      "open"
    ],
    "parts": [
      "g-popover-title",
      "g-popover-content",
      "g-popover-footer"
    ],
    "behaviors": [
      "popover"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tooltip",
    "exportName": "GTooltipDirective",
    "directiveName": "gTooltip",
    "elementName": "g-tooltip",
    "category": "overlay",
    "type": "interactive",
    "selector": "[data-g-tooltip]",
    "cssSelector": ".g-tooltip",
    "className": "g-tooltip",
    "tag": "div",
    "variants": [
      "top",
      "bottom",
      "start",
      "end",
      "start-aligned",
      "centered",
      "end-aligned"
    ],
    "states": [],
    "parts": [],
    "behaviors": [
      "tooltip"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "popconfirm",
    "exportName": "GPopconfirmDirective",
    "directiveName": "gPopconfirm",
    "elementName": "g-popconfirm",
    "category": "overlay",
    "type": "interactive",
    "selector": "[data-g-popover].g-popconfirm",
    "cssSelector": ".g-popconfirm",
    "className": "g-popconfirm",
    "tag": "div",
    "variants": [
      "compact",
      "wide",
      "danger"
    ],
    "states": [
      "closed",
      "open",
      "loading",
      "disabled"
    ],
    "parts": [
      "g-popconfirm-title",
      "g-popconfirm-description",
      "g-popconfirm-icon",
      "g-popconfirm-actions"
    ],
    "behaviors": [
      "popover"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "confirm-dialog",
    "exportName": "GConfirmDialogDirective",
    "directiveName": "gConfirmDialog",
    "elementName": "g-confirm-dialog",
    "category": "overlay",
    "type": "interactive",
    "selector": "[data-g-dialog].g-confirm-dialog-backdrop",
    "cssSelector": ".g-confirm-dialog-backdrop",
    "className": "g-confirm-dialog-backdrop",
    "tag": "div",
    "variants": [
      "small",
      "medium",
      "large",
      "danger",
      "centered"
    ],
    "states": [
      "closed",
      "open",
      "loading",
      "disabled"
    ],
    "parts": [
      "g-dialog",
      "g-dialog-title",
      "g-dialog-body",
      "g-dialog-footer",
      "g-confirm-dialog-icon"
    ],
    "behaviors": [
      "dialog"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "toast",
    "exportName": "GToastDirective",
    "directiveName": "gToast",
    "elementName": "g-toast",
    "category": "feedback",
    "type": "interactive",
    "selector": "[data-g-toast]",
    "className": "g-toast",
    "tag": "div",
    "variants": [
      "top",
      "bottom",
      "compact",
      "spacious",
      "with-title",
      "closable",
      "with-action",
      "no-icon"
    ],
    "states": [
      "normal",
      "info",
      "success",
      "warning",
      "danger",
      "error",
      "loading",
      "paused",
      "leaving"
    ],
    "parts": [
      "g-toast-icon",
      "g-toast-content",
      "g-toast-title",
      "g-toast-message",
      "g-toast-action",
      "g-toast-close"
    ],
    "behaviors": [
      "toast"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "accordion",
    "exportName": "GAccordionDirective",
    "directiveName": "gAccordion",
    "elementName": "g-accordion",
    "category": "disclosure",
    "type": "interactive",
    "selector": "[data-g-accordion]",
    "cssSelector": ".g-accordion",
    "className": "g-accordion",
    "tag": "div",
    "variants": [
      "borderless",
      "card",
      "separated",
      "compact",
      "comfortable",
      "striped",
      "icon-start",
      "icon-none"
    ],
    "states": [
      "collapsed",
      "expanded",
      "disabled"
    ],
    "parts": [
      "g-accordion-item",
      "g-accordion-trigger",
      "g-accordion-title",
      "g-accordion-description",
      "g-accordion-extra",
      "g-accordion-panel"
    ],
    "behaviors": [
      "accordion"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "table",
    "exportName": "GTableDirective",
    "directiveName": "gTable",
    "elementName": "g-table",
    "category": "data",
    "type": "css",
    "selector": ".g-table",
    "cssSelector": ".g-table",
    "className": "g-table",
    "tag": "table",
    "variants": [
      "striped",
      "hover",
      "bordered",
      "compact",
      "comfortable",
      "relaxed",
      "sticky",
      "responsive-stack",
      "borderless"
    ],
    "states": [
      "normal",
      "loading",
      "empty",
      "error"
    ],
    "parts": [
      "g-table-cell-actions",
      "g-table-summary"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "data-grid",
    "exportName": "GDataGridDirective",
    "directiveName": "gDataGrid",
    "elementName": "g-data-grid",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-grid]",
    "cssSelector": ".g-data-grid",
    "className": "g-data-grid",
    "tag": "div",
    "variants": [
      "bordered",
      "compact",
      "comfortable",
      "sticky",
      "borderless"
    ],
    "states": [
      "loading",
      "empty",
      "error"
    ],
    "parts": [
      "g-data-grid-toolbar",
      "g-data-grid-body",
      "g-data-grid-footer"
    ],
    "behaviors": [
      "data-grid"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "kpi-stat",
    "exportName": "GKpiStatDirective",
    "directiveName": "gKpiStat",
    "elementName": "g-kpi-stat",
    "category": "dashboard",
    "type": "interactive",
    "selector": "[data-g-dashboard].g-kpi",
    "cssSelector": ".g-kpi",
    "className": "g-kpi",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "borderless",
      "horizontal",
      "centered",
      "accent"
    ],
    "states": [
      "up",
      "down",
      "neutral",
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-kpi-label",
      "g-kpi-value",
      "g-kpi-change"
    ],
    "behaviors": [
      "dashboard"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "description-list",
    "exportName": "GDescriptionListDirective",
    "directiveName": "gDescriptionList",
    "elementName": "g-description-list",
    "category": "data",
    "type": "css",
    "selector": ".g-description-list",
    "cssSelector": ".g-description-list",
    "className": "g-description-list",
    "tag": "div",
    "variants": [
      "horizontal",
      "vertical",
      "bordered",
      "compact",
      "comfortable",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-description-term",
      "g-description-value"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "descriptions",
    "exportName": "GDescriptionsDirective",
    "directiveName": "gDescriptions",
    "elementName": "g-descriptions",
    "category": "data",
    "type": "interactive",
    "selector": ".g-descriptions",
    "cssSelector": ".g-descriptions",
    "className": "g-descriptions",
    "tag": "div",
    "variants": [
      "horizontal",
      "vertical",
      "inline-horizontal",
      "inline-vertical",
      "bordered",
      "mini",
      "small",
      "medium",
      "large"
    ],
    "states": [
      "loading",
      "empty",
      "error"
    ],
    "parts": [
      "g-desc-title",
      "g-desc-table",
      "g-desc-label",
      "g-desc-value"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "list",
    "exportName": "GListDirective",
    "directiveName": "gList",
    "elementName": "g-list",
    "category": "data",
    "type": "interactive",
    "selector": ".g-list",
    "cssSelector": ".g-list",
    "className": "g-list",
    "tag": "div",
    "variants": [
      "default",
      "small",
      "medium",
      "large"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-list-item",
      "g-list-title",
      "g-list-description",
      "g-list-actions",
      "g-list-extra"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "list-group",
    "exportName": "GListGroupDirective",
    "directiveName": "gListGroup",
    "elementName": "g-list-group",
    "category": "data",
    "type": "css",
    "selector": ".g-list-group",
    "cssSelector": ".g-list-group",
    "className": "g-list-group",
    "tag": "div",
    "variants": [
      "bordered",
      "borderless",
      "split",
      "compact",
      "comfortable"
    ],
    "states": [
      "normal",
      "loading",
      "empty"
    ],
    "parts": [
      "g-list-item",
      "g-list-item-content",
      "g-list-item-title",
      "g-list-item-meta"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tree",
    "exportName": "GTreeDirective",
    "directiveName": "gTree",
    "elementName": "g-tree",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-tree]",
    "cssSelector": ".g-tree",
    "className": "g-tree",
    "tag": "div",
    "variants": [
      "default",
      "line",
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "normal",
      "loading",
      "empty"
    ],
    "parts": [
      "g-tree-item",
      "g-tree-label",
      "g-tree-toggle"
    ],
    "behaviors": [
      "tree"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "timeline",
    "exportName": "GTimelineDirective",
    "directiveName": "gTimeline",
    "elementName": "g-timeline",
    "category": "data",
    "type": "interactive",
    "selector": ".g-timeline",
    "cssSelector": ".g-timeline",
    "className": "g-timeline",
    "tag": "div",
    "variants": [
      "vertical",
      "alternate",
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "horizontal"
    ],
    "states": [
      "normal",
      "pending"
    ],
    "parts": [
      "g-timeline-item",
      "g-timeline-marker",
      "g-timeline-time"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "responsive-table",
    "exportName": "GResponsiveTableDirective",
    "directiveName": "gResponsiveTable",
    "elementName": "g-responsive-table",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-table-scroll].g-responsive-table",
    "cssSelector": ".g-responsive-table",
    "className": "g-responsive-table",
    "tag": "div",
    "variants": [
      "scroll",
      "stacked",
      "sticky-columns",
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-table-caption",
      "g-table-row",
      "g-table-cell-primary",
      "g-table-cell-secondary",
      "g-table-cell-sticky-start",
      "g-table-cell-sticky-end",
      "g-table-checkbox"
    ],
    "behaviors": [
      "table-scroll"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "table-sort",
    "exportName": "GTableSortDirective",
    "directiveName": "gTableSort",
    "elementName": "g-table-sort",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-table-sort]",
    "cssSelector": ".g-data-scope-table-sort",
    "className": "g-data-scope-table-sort",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-table-sort-indicator",
      "g-sort-button"
    ],
    "behaviors": [
      "table-sort"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "row-selection",
    "exportName": "GRowSelectionDirective",
    "directiveName": "gRowSelection",
    "elementName": "g-row-selection",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-row-select]",
    "cssSelector": ".g-data-scope-row-selection",
    "className": "g-data-scope-row-selection",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "none",
      "partial",
      "all"
    ],
    "parts": [
      "g-selection-summary"
    ],
    "behaviors": [
      "row-select"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "row-disclosure",
    "exportName": "GRowDisclosureDirective",
    "directiveName": "gRowDisclosure",
    "elementName": "g-row-disclosure",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-row-disclosure]",
    "cssSelector": ".g-data-scope-row-disclosure",
    "className": "g-data-scope-row-disclosure",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-row-disclosure"
    ],
    "behaviors": [
      "row-disclosure"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "column-toggle",
    "exportName": "GColumnToggleDirective",
    "directiveName": "gColumnToggle",
    "elementName": "g-column-toggle",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-column-toggle]",
    "cssSelector": ".g-data-scope-column-toggle",
    "className": "g-data-scope-column-toggle",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-column-chooser"
    ],
    "behaviors": [
      "column-toggle"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "data-filter",
    "exportName": "GDataFilterDirective",
    "directiveName": "gDataFilter",
    "elementName": "g-data-filter",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-filter]",
    "cssSelector": ".g-data-scope-data-filter",
    "className": "g-data-scope-data-filter",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "results",
      "empty"
    ],
    "parts": [
      "g-data-toolbar"
    ],
    "behaviors": [
      "data-filter"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "data-view",
    "exportName": "GDataViewDirective",
    "directiveName": "gDataView",
    "elementName": "g-data-view",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-view]",
    "cssSelector": ".g-data-scope-data-view",
    "className": "g-data-scope-data-view",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-data-view-switcher"
    ],
    "behaviors": [
      "data-view"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "editable-grid",
    "exportName": "GEditableGridDirective",
    "directiveName": "gEditableGrid",
    "elementName": "g-editable-grid",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-grid].g-editable-grid",
    "cssSelector": ".g-editable-grid",
    "className": "g-editable-grid",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "default",
      "editing",
      "invalid"
    ],
    "parts": [
      "g-editable-grid-row",
      "g-editable-grid-cell"
    ],
    "behaviors": [
      "data-grid"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tree-table",
    "exportName": "GTreeTableDirective",
    "directiveName": "gTreeTable",
    "elementName": "g-tree-table",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-row-disclosure].g-tree-table",
    "cssSelector": ".g-tree-table",
    "className": "g-tree-table",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-tree-table-row",
      "g-tree-table-toggle"
    ],
    "behaviors": [
      "row-disclosure"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "grouped-table",
    "exportName": "GGroupedTableDirective",
    "directiveName": "gGroupedTable",
    "elementName": "g-grouped-table",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-row-disclosure].g-grouped-table",
    "cssSelector": ".g-grouped-table",
    "className": "g-grouped-table",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-table-group-row",
      "g-table-group-title"
    ],
    "behaviors": [
      "row-disclosure"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "expandable-table",
    "exportName": "GExpandableTableDirective",
    "directiveName": "gExpandableTable",
    "elementName": "g-expandable-table",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-row-disclosure].g-expandable-table",
    "cssSelector": ".g-expandable-table",
    "className": "g-expandable-table",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-expandable-table-detail",
      "g-table-detail-content"
    ],
    "behaviors": [
      "row-disclosure"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "comparison-table",
    "exportName": "GComparisonTableDirective",
    "directiveName": "gComparisonTable",
    "elementName": "g-comparison-table",
    "category": "data",
    "type": "css",
    "selector": ".g-comparison-table",
    "cssSelector": ".g-comparison-table",
    "className": "g-comparison-table",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "highlighted"
    ],
    "states": [
      "highlighted"
    ],
    "parts": [
      "g-table"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "key-value",
    "exportName": "GKeyValueDirective",
    "directiveName": "gKeyValue",
    "elementName": "g-key-value",
    "category": "data",
    "type": "css",
    "selector": ".g-key-value",
    "cssSelector": ".g-key-value",
    "className": "g-key-value",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "horizontal",
      "vertical"
    ],
    "states": [],
    "parts": [
      "g-key-value-row",
      "g-key-value-key",
      "g-key-value-value",
      "g-key-value-action"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "record-detail",
    "exportName": "GRecordDetailDirective",
    "directiveName": "gRecordDetail",
    "elementName": "g-record-detail",
    "category": "data",
    "type": "css",
    "selector": ".g-record-detail",
    "cssSelector": ".g-record-detail",
    "className": "g-record-detail",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "vertical"
    ],
    "states": [],
    "parts": [
      "g-record-detail-header",
      "g-record-detail-main",
      "g-record-detail-title",
      "g-record-detail-sections",
      "g-record-detail-section"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "media-list",
    "exportName": "GMediaListDirective",
    "directiveName": "gMediaList",
    "elementName": "g-media-list",
    "category": "data",
    "type": "css",
    "selector": ".g-media-list",
    "cssSelector": ".g-media-list",
    "className": "g-media-list",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "horizontal"
    ],
    "states": [],
    "parts": [
      "g-media-list-item",
      "g-media-list-media",
      "g-media-list-content"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "dense-list",
    "exportName": "GDenseListDirective",
    "directiveName": "gDenseList",
    "elementName": "g-dense-list",
    "category": "data",
    "type": "css",
    "selector": ".g-dense-list",
    "cssSelector": ".g-dense-list",
    "className": "g-dense-list",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-dense-list-item"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "audit-log-composition",
    "exportName": "GAuditLogCompositionDirective",
    "directiveName": "gAuditLogComposition",
    "elementName": "g-audit-log-composition",
    "category": "data",
    "type": "css",
    "selector": ".g-audit-log",
    "cssSelector": ".g-audit-log",
    "className": "g-audit-log",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-audit-log-date",
      "g-audit-event"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "stat-list",
    "exportName": "GStatListDirective",
    "directiveName": "gStatList",
    "elementName": "g-stat-list",
    "category": "data",
    "type": "css",
    "selector": ".g-stat-list",
    "cssSelector": ".g-stat-list",
    "className": "g-stat-list",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "flat",
      "centered"
    ],
    "states": [],
    "parts": [
      "g-stat",
      "g-stat-value",
      "g-stat-label"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "metric-card",
    "exportName": "GMetricCardDirective",
    "directiveName": "gMetricCard",
    "elementName": "g-metric-card",
    "category": "data",
    "type": "css",
    "selector": ".g-metric-card",
    "cssSelector": ".g-metric-card",
    "className": "g-metric-card",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "flat",
      "centered"
    ],
    "states": [],
    "parts": [
      "g-metric-card-main",
      "g-metric-card-label",
      "g-metric-card-value",
      "g-metric-card-trend"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "sparkline",
    "exportName": "GSparklineDirective",
    "directiveName": "gSparkline",
    "elementName": "g-sparkline",
    "category": "data",
    "type": "css",
    "selector": ".g-sparkline",
    "cssSelector": ".g-sparkline",
    "className": "g-sparkline",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "muted",
      "contrast"
    ],
    "states": [],
    "parts": [
      "g-sparkline-bar",
      "g-sparkline-svg"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "progress-stats",
    "exportName": "GProgressStatsDirective",
    "directiveName": "gProgressStats",
    "elementName": "g-progress-stats",
    "category": "data",
    "type": "css",
    "selector": ".g-progress-stats",
    "cssSelector": ".g-progress-stats",
    "className": "g-progress-stats",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-progress-stat",
      "g-progress-stat-label",
      "g-progress-stat-track",
      "g-progress-stat-value",
      "g-progress-stat-number"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "data-legend",
    "exportName": "GDataLegendDirective",
    "directiveName": "gDataLegend",
    "elementName": "g-data-legend",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-data-legend",
    "cssSelector": ".g-data-legend",
    "className": "g-data-legend",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "horizontal",
      "vertical"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-legend-item",
      "g-data-legend-swatch",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "ranking",
    "exportName": "GRankingDirective",
    "directiveName": "gRanking",
    "elementName": "g-ranking",
    "category": "data",
    "type": "css",
    "selector": ".g-ranking",
    "cssSelector": ".g-ranking",
    "className": "g-ranking",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "ordered"
    ],
    "states": [],
    "parts": [
      "g-ranking-item",
      "g-ranking-value"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "status-summary",
    "exportName": "GStatusSummaryDirective",
    "directiveName": "gStatusSummary",
    "elementName": "g-status-summary",
    "category": "data",
    "type": "css",
    "selector": ".g-status-summary",
    "cssSelector": ".g-status-summary",
    "className": "g-status-summary",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "flat",
      "centered"
    ],
    "states": [],
    "parts": [
      "g-status-summary-item",
      "g-status-summary-value",
      "g-status-summary-label"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "data-matrix",
    "exportName": "GDataMatrixDirective",
    "directiveName": "gDataMatrix",
    "elementName": "g-data-matrix",
    "category": "data",
    "type": "css",
    "selector": ".g-data-matrix",
    "cssSelector": ".g-data-matrix",
    "className": "g-data-matrix",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "muted",
      "contrast"
    ],
    "states": [],
    "parts": [
      "g-data-matrix-grid",
      "g-data-matrix-cell"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "heatmap",
    "exportName": "GHeatmapDirective",
    "directiveName": "gHeatmap",
    "elementName": "g-heatmap",
    "category": "data",
    "type": "css",
    "selector": ".g-heatmap",
    "cssSelector": ".g-heatmap",
    "className": "g-heatmap",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "muted",
      "contrast"
    ],
    "states": [],
    "parts": [
      "g-heatmap-cell"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "data-toolbar",
    "exportName": "GDataToolbarDirective",
    "directiveName": "gDataToolbar",
    "elementName": "g-data-toolbar",
    "category": "data",
    "type": "css",
    "selector": ".g-data-toolbar",
    "cssSelector": ".g-data-toolbar",
    "className": "g-data-toolbar",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-data-toolbar-start",
      "g-data-toolbar-center",
      "g-data-toolbar-end",
      "g-data-toolbar-result"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "column-chooser",
    "exportName": "GColumnChooserDirective",
    "directiveName": "gColumnChooser",
    "elementName": "g-column-chooser",
    "category": "data",
    "type": "css",
    "selector": ".g-column-chooser",
    "cssSelector": ".g-column-chooser",
    "className": "g-column-chooser",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-column-chooser-item"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "saved-views",
    "exportName": "GSavedViewsDirective",
    "directiveName": "gSavedViews",
    "elementName": "g-saved-views",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-saved-views",
    "cssSelector": ".g-saved-views",
    "className": "g-saved-views",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "pills",
      "vertical",
      "editable"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-saved-view",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "saved-choice",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "export-panel",
    "exportName": "GExportPanelDirective",
    "directiveName": "gExportPanel",
    "elementName": "g-export-panel",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-export-panel",
    "cssSelector": ".g-export-panel",
    "className": "g-export-panel",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-export-panel-header",
      "g-export-options",
      "g-export-option",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "data-state",
    "exportName": "GDataStateDirective",
    "directiveName": "gDataState",
    "elementName": "g-data-state",
    "category": "data",
    "type": "css",
    "selector": ".g-data-state",
    "cssSelector": ".g-data-state",
    "className": "g-data-state",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "offline"
    ],
    "parts": [
      "g-data-state-visual",
      "g-data-state-title",
      "g-data-state-actions"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "data-view-switcher",
    "exportName": "GDataViewSwitcherDirective",
    "directiveName": "gDataViewSwitcher",
    "elementName": "g-data-view-switcher",
    "category": "data",
    "type": "css",
    "selector": ".g-data-view-switcher",
    "cssSelector": ".g-data-view-switcher",
    "className": "g-data-view-switcher",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-data-view-button"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "selection-summary",
    "exportName": "GSelectionSummaryDirective",
    "directiveName": "gSelectionSummary",
    "elementName": "g-selection-summary",
    "category": "data",
    "type": "css",
    "selector": ".g-selection-summary",
    "cssSelector": ".g-selection-summary",
    "className": "g-selection-summary",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-selection-summary-count",
      "g-selection-summary-actions"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "table-density",
    "exportName": "GTableDensityDirective",
    "directiveName": "gTableDensity",
    "elementName": "g-table-density",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-table-density].g-table-density",
    "cssSelector": ".g-table-density",
    "className": "g-table-density",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-table-density-button"
    ],
    "behaviors": [
      "table-density"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "filter-summary",
    "exportName": "GFilterSummaryDirective",
    "directiveName": "gFilterSummary",
    "elementName": "g-filter-summary",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-filter-summary].g-filter-summary",
    "cssSelector": ".g-filter-summary",
    "className": "g-filter-summary",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [],
    "parts": [
      "g-filter-summary-label",
      "g-filter-summary-chip",
      "g-filter-summary-clear"
    ],
    "behaviors": [
      "filter-summary"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "sort-builder",
    "exportName": "GSortBuilderDirective",
    "directiveName": "gSortBuilder",
    "elementName": "g-sort-builder",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-builder-list].g-sort-builder",
    "cssSelector": ".g-sort-builder",
    "className": "g-sort-builder",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "inline",
      "stacked"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-sort-rule",
      "g-sort-rule-handle",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "builder-list",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "data-inspector",
    "exportName": "GDataInspectorDirective",
    "directiveName": "gDataInspector",
    "elementName": "g-data-inspector",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-data-inspector",
    "cssSelector": ".g-data-inspector",
    "className": "g-data-inspector",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "flat"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-inspector-header",
      "g-data-inspector-body",
      "g-data-inspector-footer",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "desktop",
      "tauri",
      "electron"
    ]
  },
  {
    "name": "selection-controls",
    "exportName": "GSelectionControlsDirective",
    "directiveName": "gSelectionControls",
    "elementName": "g-selection-controls",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-row-select].g-selection-scope",
    "cssSelector": ".g-selection-control",
    "className": "g-selection-control",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "cards"
    ],
    "states": [
      "none",
      "partial",
      "all",
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-select-all-control",
      "g-invert-selection-control",
      "g-range-selection-control",
      "g-selection-scope-header",
      "g-selection-scope-list",
      "g-selection-item",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "row-select",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "batch-toolbar",
    "exportName": "GBatchToolbarDirective",
    "directiveName": "gBatchToolbar",
    "elementName": "g-batch-toolbar",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-batch-toolbar",
    "cssSelector": ".g-batch-toolbar",
    "className": "g-batch-toolbar",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "inline",
      "sticky"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-batch-toolbar-summary",
      "g-batch-toolbar-actions",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "dual-list",
    "exportName": "GDualListDirective",
    "directiveName": "gDualList",
    "elementName": "g-dual-list",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-transfer].g-dual-list",
    "cssSelector": ".g-dual-list",
    "className": "g-dual-list",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "horizontal",
      "vertical"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-dual-list-pane",
      "g-dual-list-list",
      "g-transfer-option",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "transfer",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tree-select",
    "exportName": "GTreeSelectDirective",
    "directiveName": "gTreeSelect",
    "elementName": "g-tree-select",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-picker].g-tree-select",
    "cssSelector": ".g-tree-select",
    "className": "g-tree-select",
    "tag": "div",
    "variants": [
      "filled",
      "outlined",
      "borderless",
      "underlined",
      "single",
      "multiple",
      "checkable",
      "searchable",
      "clearable",
      "cascade",
      "leaf-only",
      "parent-value",
      "with-header",
      "with-footer",
      "mini",
      "small",
      "medium",
      "large",
      "block",
      "compact",
      "comfortable",
      "bordered"
    ],
    "states": [
      "default",
      "open",
      "searching",
      "empty",
      "success",
      "warning",
      "error",
      "invalid",
      "loading",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-picker-control",
      "g-picker-values",
      "g-picker-value",
      "g-picker-value-label",
      "g-picker-value-remove",
      "g-picker-placeholder",
      "g-picker-input",
      "g-picker-clear",
      "g-picker-arrow",
      "g-picker-panel",
      "g-picker-header",
      "g-picker-footer",
      "g-picker-empty",
      "g-tree-select-search",
      "g-tree-list",
      "g-tree-node",
      "g-tree-node-row",
      "g-tree-toggle",
      "g-tree-toggle-placeholder",
      "g-tree-checkbox",
      "g-tree-node-label",
      "g-tree-node-meta",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "cascader",
    "exportName": "GCascaderDirective",
    "directiveName": "gCascader",
    "elementName": "g-cascader",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-cascader]",
    "cssSelector": ".g-cascader",
    "className": "g-cascader",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "compact-columns",
      "wide-columns"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-cascader-path",
      "g-cascader-columns",
      "g-cascader-column",
      "g-cascader-option",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "cascader",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mention-picker",
    "exportName": "GMentionPickerDirective",
    "directiveName": "gMentionPicker",
    "elementName": "g-mention-picker",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-picker].g-mention-picker",
    "cssSelector": ".g-mention-picker",
    "className": "g-mention-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "avatar",
      "compact-list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-picker-avatar",
      "g-picker-option",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "user-picker",
    "exportName": "GUserPickerDirective",
    "directiveName": "gUserPicker",
    "elementName": "g-user-picker",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-picker].g-user-picker",
    "cssSelector": ".g-user-picker",
    "className": "g-user-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "avatar",
      "compact-list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-picker-avatar",
      "g-picker-option",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "organization-picker",
    "exportName": "GOrganizationPickerDirective",
    "directiveName": "gOrganizationPicker",
    "elementName": "g-organization-picker",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-picker].g-organization-picker",
    "cssSelector": ".g-organization-picker",
    "className": "g-organization-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "hierarchical",
      "compact-list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-picker-control",
      "g-picker-panel",
      "g-picker-option",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "resource-picker",
    "exportName": "GResourcePickerDirective",
    "directiveName": "gResourcePicker",
    "elementName": "g-resource-picker",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-picker].g-resource-picker",
    "cssSelector": ".g-resource-picker",
    "className": "g-resource-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "detailed",
      "compact-list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-picker-control",
      "g-picker-panel",
      "g-picker-option",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "media-picker",
    "exportName": "GMediaPickerDirective",
    "directiveName": "gMediaPicker",
    "elementName": "g-media-picker",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-picker].g-media-picker",
    "cssSelector": ".g-media-picker",
    "className": "g-media-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "grid",
      "list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-media-picker-thumb",
      "g-picker-control",
      "g-picker-panel",
      "g-picker-option",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "icon-picker",
    "exportName": "GIconPickerDirective",
    "directiveName": "gIconPicker",
    "elementName": "g-icon-picker",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-icon-picker",
    "cssSelector": ".g-icon-picker",
    "className": "g-icon-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "grid",
      "list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-icon-picker-grid",
      "g-icon-picker-item",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "saved-choice",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "color-picker-composition",
    "exportName": "GColorPickerCompositionDirective",
    "directiveName": "gColorPickerComposition",
    "elementName": "g-color-picker-composition",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-color-picker",
    "cssSelector": ".g-color-picker",
    "className": "g-color-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "swatches",
      "list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-color-picker-current",
      "g-color-picker-preview",
      "g-color-picker-swatches",
      "g-color-swatch",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "saved-choice",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "date-range-picker-composition",
    "exportName": "GDateRangePickerCompositionDirective",
    "directiveName": "gDateRangePickerComposition",
    "elementName": "g-date-range-picker-composition",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-range-picker].g-date-range-picker",
    "cssSelector": ".g-date-range-picker",
    "className": "g-date-range-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "inline",
      "stacked"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-range-picker-fields",
      "g-range-picker-presets",
      "g-range-picker-calendar",
      "g-range-picker-actions",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "range-picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "time-range-picker-composition",
    "exportName": "GTimeRangePickerCompositionDirective",
    "directiveName": "gTimeRangePickerComposition",
    "elementName": "g-time-range-picker-composition",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-range-picker].g-time-range-picker",
    "cssSelector": ".g-time-range-picker",
    "className": "g-time-range-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "inline",
      "stacked"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-range-picker-fields",
      "g-range-picker-presets",
      "g-range-picker-actions",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "range-picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "saved-filters",
    "exportName": "GSavedFiltersDirective",
    "directiveName": "gSavedFilters",
    "elementName": "g-saved-filters",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-saved-filters",
    "cssSelector": ".g-saved-filters",
    "className": "g-saved-filters",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "pills",
      "vertical",
      "editable"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-saved-filter",
      "g-saved-choice-meta",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "saved-choice",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "group-builder",
    "exportName": "GGroupBuilderDirective",
    "directiveName": "gGroupBuilder",
    "elementName": "g-group-builder",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-builder-list].g-group-builder",
    "cssSelector": ".g-group-builder",
    "className": "g-group-builder",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "inline",
      "stacked"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-group-rule",
      "g-group-rule-handle",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "builder-list",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "entity-picker",
    "exportName": "GEntityPickerDirective",
    "directiveName": "gEntityPicker",
    "elementName": "g-entity-picker",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-picker].g-entity-picker",
    "cssSelector": ".g-entity-picker",
    "className": "g-entity-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "detailed",
      "compact-list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-picker-control",
      "g-picker-value",
      "g-picker-panel",
      "g-picker-results",
      "g-picker-option",
      "g-picker-summary",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tag-picker",
    "exportName": "GTagPickerDirective",
    "directiveName": "gTagPicker",
    "elementName": "g-tag-picker",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-picker].g-tag-picker",
    "cssSelector": ".g-tag-picker",
    "className": "g-tag-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "pills",
      "list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-picker-control",
      "g-picker-panel",
      "g-picker-option",
      "g-picker-chip",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "relation-picker",
    "exportName": "GRelationPickerDirective",
    "directiveName": "gRelationPicker",
    "elementName": "g-relation-picker",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-picker].g-relation-picker",
    "cssSelector": ".g-relation-picker",
    "className": "g-relation-picker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "detailed",
      "compact-list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-picker-control",
      "g-picker-panel",
      "g-picker-option",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "picker",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "bulk-confirmation",
    "exportName": "GBulkConfirmationDirective",
    "directiveName": "gBulkConfirmation",
    "elementName": "g-bulk-confirmation",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-bulk-confirmation",
    "cssSelector": ".g-bulk-confirmation",
    "className": "g-bulk-confirmation",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "danger",
      "warning"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-bulk-confirmation-title",
      "g-bulk-confirmation-summary",
      "g-bulk-confirmation-actions",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "bulk-progress",
    "exportName": "GBulkProgressDirective",
    "directiveName": "gBulkProgress",
    "elementName": "g-bulk-progress",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-bulk-progress",
    "cssSelector": ".g-bulk-progress",
    "className": "g-bulk-progress",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "detailed",
      "summary"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-bulk-progress-header",
      "g-bulk-progress-list",
      "g-bulk-progress-item",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "filter-bar",
    "exportName": "GFilterBarDirective",
    "directiveName": "gFilterBar",
    "elementName": "g-filter-bar",
    "category": "dashboard",
    "type": "interactive",
    "selector": "[data-g-dashboard].g-filter-bar",
    "cssSelector": ".g-filter-bar",
    "className": "g-filter-bar",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "borderless",
      "vertical",
      "sticky",
      "inline"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-filter-bar-main",
      "g-filter-bar-actions"
    ],
    "behaviors": [
      "dashboard"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "code-block",
    "exportName": "GCodeBlockDirective",
    "directiveName": "gCodeBlock",
    "elementName": "g-code-block",
    "category": "content",
    "type": "interactive",
    "selector": ".g-code-block",
    "cssSelector": ".g-code-block",
    "className": "g-code-block",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "wrap",
      "line-numbers"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "terminal",
    "exportName": "GTerminalDirective",
    "directiveName": "gTerminal",
    "elementName": "g-terminal",
    "category": "content",
    "type": "interactive",
    "selector": ".g-terminal",
    "cssSelector": ".g-terminal",
    "className": "g-terminal",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "wrap",
      "line-numbers"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "diff-viewer",
    "exportName": "GDiffViewerDirective",
    "directiveName": "gDiffViewer",
    "elementName": "g-diff-viewer",
    "category": "content",
    "type": "interactive",
    "selector": ".g-diff",
    "cssSelector": ".g-diff",
    "className": "g-diff",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "wrap",
      "line-numbers"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "chart-container",
    "exportName": "GChartContainerDirective",
    "directiveName": "gChartContainer",
    "elementName": "g-chart-container",
    "category": "dashboard",
    "type": "interactive",
    "selector": "[data-g-dashboard].g-chart",
    "cssSelector": ".g-chart",
    "className": "g-chart",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "borderless",
      "line",
      "area",
      "bar",
      "donut"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-chart-legend",
      "g-chart-legend-item",
      "g-chart-legend-swatch"
    ],
    "behaviors": [
      "dashboard"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "grid-system",
    "exportName": "GGridSystemDirective",
    "directiveName": "gGridSystem",
    "elementName": "g-grid-system",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-grid-24",
    "cssSelector": ".g-grid-24",
    "className": "g-grid-24",
    "tag": "div",
    "variants": [
      "24-column",
      "12-column",
      "responsive",
      "container-query",
      "subgrid",
      "rtl",
      "print"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-row",
      "g-grid-12",
      "g-col",
      "g-col-auto",
      "g-col-fill",
      "g-col-fill-from-*",
      "g-col-full"
    ],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "region-layout-system",
    "exportName": "GRegionLayoutSystemDirective",
    "directiveName": "gRegionLayoutSystem",
    "elementName": "g-region-layout-system",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-region-frame",
    "cssSelector": ".g-region-frame",
    "className": "g-region-frame",
    "tag": "div",
    "variants": [
      "top-main-bottom",
      "start-main-end",
      "five-region",
      "holy-grail",
      "sidebar-shell",
      "double-sidebar",
      "master-detail",
      "list-detail-inspector",
      "sticky-footer",
      "fixed-header",
      "fixed-sidebar",
      "sticky-aside",
      "dock",
      "split-view",
      "fullscreen-workspace",
      "mobile-layout"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-region-top",
      "g-region-start",
      "g-region-main",
      "g-region-end",
      "g-region-bottom",
      "g-master",
      "g-detail",
      "g-region-list",
      "g-region-inspector",
      "g-dock-top",
      "g-dock-start",
      "g-dock-main",
      "g-dock-end",
      "g-dock-bottom",
      "g-workspace-toolbar",
      "g-workspace-main",
      "g-workspace-status"
    ],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "tauri",
      "electron",
      "print"
    ]
  },
  {
    "name": "classic-layout-primitives",
    "exportName": "GClassicLayoutPrimitivesDirective",
    "directiveName": "gClassicLayoutPrimitives",
    "elementName": "g-classic-layout-primitives",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-stack",
    "cssSelector": ".g-stack",
    "className": "g-stack",
    "tag": "div",
    "variants": [
      "stack",
      "cluster",
      "center",
      "sidebar",
      "switcher",
      "cover",
      "reel",
      "frame",
      "media-object",
      "grid-auto-fit",
      "grid-auto-fill",
      "bleed",
      "repel",
      "imposter",
      "overlay",
      "masonry",
      "bento",
      "aspect-ratio",
      "scroll-area",
      "scroll-snap",
      "safe-area",
      "sticky-region"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-media-object-media",
      "g-media-object-body",
      "g-media-object-action",
      "g-cover-center",
      "g-overlay-base",
      "g-overlay-layer",
      "g-scroll-snap-item"
    ],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "tauri",
      "electron",
      "print"
    ]
  },
  {
    "name": "page-header",
    "exportName": "GPageHeaderDirective",
    "directiveName": "gPageHeader",
    "elementName": "g-page-header",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-page-header",
    "cssSelector": ".g-page-header",
    "className": "g-page-header",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "centered",
      "sticky",
      "with-back",
      "divided"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-page-header-main",
      "g-page-header-eyebrow",
      "g-page-header-title",
      "g-page-header-description",
      "g-page-header-meta",
      "g-page-header-actions"
    ],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "section-header",
    "exportName": "GSectionHeaderDirective",
    "directiveName": "gSectionHeader",
    "elementName": "g-section-header",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-section-header",
    "cssSelector": ".g-section-header",
    "className": "g-section-header",
    "tag": "div",
    "variants": [
      "default",
      "borderless",
      "compact",
      "centered",
      "divided"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-section-header-main",
      "g-section-header-title",
      "g-section-header-description",
      "g-section-header-actions"
    ],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "subheader",
    "exportName": "GSubheaderDirective",
    "directiveName": "gSubheader",
    "elementName": "g-subheader",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-subheader",
    "cssSelector": ".g-subheader",
    "className": "g-subheader",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "sticky",
      "divided"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-subheader-title",
      "g-subheader-actions"
    ],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "toolbar",
    "exportName": "GToolbarDirective",
    "directiveName": "gToolbar",
    "elementName": "g-toolbar",
    "category": "navigation",
    "type": "css",
    "selector": ".g-toolbar",
    "className": "g-toolbar",
    "tag": "div",
    "variants": [
      "compact",
      "sticky",
      "scrollable"
    ],
    "states": [],
    "parts": [
      "g-toolbar-start",
      "g-toolbar-center",
      "g-toolbar-end",
      "g-toolbar-title",
      "g-toolbar-separator"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "action-bar",
    "exportName": "GActionBarDirective",
    "directiveName": "gActionBar",
    "elementName": "g-action-bar",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-action-bar",
    "cssSelector": ".g-action-bar",
    "className": "g-action-bar",
    "tag": "div",
    "variants": [
      "default",
      "surface",
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "wrap",
      "compact-actions"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-action-bar-main",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "status-bar",
    "exportName": "GStatusBarDirective",
    "directiveName": "gStatusBar",
    "elementName": "g-status-bar",
    "category": "feedback",
    "type": "css",
    "selector": ".g-status-bar",
    "className": "g-status-bar",
    "tag": "div",
    "variants": [
      "primary",
      "subtle",
      "bordered",
      "elevated",
      "compact",
      "comfortable",
      "responsive",
      "scrollable",
      "sticky",
      "fixed",
      "contained"
    ],
    "states": [
      "normal",
      "info",
      "success",
      "warning",
      "danger",
      "error",
      "loading",
      "offline",
      "disabled"
    ],
    "parts": [
      "g-status-bar-section",
      "g-status-bar-item",
      "g-status-bar-icon",
      "g-status-bar-label",
      "g-status-bar-value",
      "g-status-bar-text",
      "g-status-bar-separator",
      "g-status-bar-spacer",
      "g-status-bar-progress",
      "g-status-bar-live"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "command-bar",
    "exportName": "GCommandBarDirective",
    "directiveName": "gCommandBar",
    "elementName": "g-command-bar",
    "category": "navigation",
    "type": "css",
    "selector": ".g-command-bar",
    "className": "g-command-bar",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [
      "g-command-bar-group",
      "g-command-bar-item",
      "g-command-bar-shortcut"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "context-bar",
    "exportName": "GContextBarDirective",
    "directiveName": "gContextBar",
    "elementName": "g-context-bar",
    "category": "feedback",
    "type": "css",
    "selector": ".g-context-bar",
    "className": "g-context-bar",
    "tag": "div",
    "variants": [
      "soft",
      "outlined",
      "filled",
      "banner",
      "borderless",
      "center",
      "compact",
      "spacious",
      "stacked",
      "sticky",
      "dismissible",
      "no-icon",
      "with-title"
    ],
    "states": [
      "normal",
      "info",
      "success",
      "warning",
      "danger",
      "error",
      "loading",
      "disabled"
    ],
    "parts": [
      "g-context-bar-icon",
      "g-context-bar-body",
      "g-context-bar-content",
      "g-context-bar-title",
      "g-context-bar-description",
      "g-context-bar-meta",
      "g-context-bar-actions",
      "g-context-bar-action",
      "g-context-bar-link",
      "g-context-bar-close",
      "g-context-bar-progress"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "bulk-action-bar",
    "exportName": "GBulkActionBarDirective",
    "directiveName": "gBulkActionBar",
    "elementName": "g-bulk-action-bar",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-bulk-action-bar",
    "cssSelector": ".g-bulk-action-bar",
    "className": "g-bulk-action-bar",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "inline",
      "sticky"
    ],
    "states": [
      "active",
      "empty",
      "loading",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-bulk-action-count",
      "g-bulk-action-actions",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "footer-bar",
    "exportName": "GFooterBarDirective",
    "directiveName": "gFooterBar",
    "elementName": "g-footer-bar",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-footer-bar",
    "cssSelector": ".g-footer-bar",
    "className": "g-footer-bar",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "sticky",
      "centered",
      "end"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-footer-bar-actions"
    ],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "floating-action-bar",
    "exportName": "GFloatingActionBarDirective",
    "directiveName": "gFloatingActionBar",
    "elementName": "g-floating-action-bar",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-floating-action-bar",
    "cssSelector": ".g-floating-action-bar",
    "className": "g-floating-action-bar",
    "tag": "div",
    "variants": [
      "center",
      "end",
      "contained",
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "compact-actions"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "divider-with-text",
    "exportName": "GDividerWithTextDirective",
    "directiveName": "gDividerWithText",
    "elementName": "g-divider-with-text",
    "category": "basic",
    "type": "css",
    "selector": ".g-divider",
    "className": "g-divider",
    "tag": "div",
    "variants": [
      "horizontal",
      "vertical",
      "center",
      "start",
      "end",
      "solid",
      "dashed",
      "dotted",
      "double",
      "plain",
      "heading",
      "small",
      "medium",
      "large",
      "inset",
      "strong",
      "stretch"
    ],
    "states": [],
    "parts": [
      "g-divider-text"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "sticky-actions",
    "exportName": "GStickyActionsDirective",
    "directiveName": "gStickyActions",
    "elementName": "g-sticky-actions",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-sticky-actions",
    "cssSelector": ".g-sticky-actions",
    "className": "g-sticky-actions",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "top",
      "bottom"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-sticky-actions-main",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "page-loading",
    "exportName": "GPageLoadingDirective",
    "directiveName": "gPageLoading",
    "elementName": "g-page-loading",
    "category": "feedback",
    "type": "css",
    "selector": ".g-page-loading",
    "className": "g-page-loading",
    "tag": "div",
    "variants": [
      "inline",
      "contained",
      "card",
      "full",
      "overlay",
      "fullscreen",
      "dimmed",
      "compact",
      "small",
      "medium",
      "large",
      "delayed",
      "no-indicator"
    ],
    "states": [
      "loading",
      "determinate",
      "indeterminate",
      "paused",
      "stalled",
      "success",
      "error",
      "cancelled",
      "disabled",
      "hidden"
    ],
    "parts": [
      "g-page-loading-content",
      "g-page-loading-indicator",
      "g-page-loading-ring",
      "g-page-loading-title",
      "g-page-loading-description",
      "g-page-loading-status",
      "g-page-loading-progress-wrap",
      "g-page-loading-progress-header",
      "g-page-loading-progress-value",
      "g-page-loading-progress",
      "g-page-loading-steps",
      "g-page-loading-step",
      "g-page-loading-actions",
      "g-page-loading-action",
      "g-page-loading-host",
      "g-page-loading-container"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "page-state-system",
    "exportName": "GPageStateSystemDirective",
    "directiveName": "gPageStateSystem",
    "elementName": "g-page-state-system",
    "category": "feedback",
    "type": "css",
    "selector": ".g-page-state",
    "className": "g-page-state",
    "tag": "div",
    "variants": [
      "empty",
      "no-results",
      "first-use",
      "success",
      "info",
      "warning",
      "error",
      "403",
      "404",
      "500",
      "offline",
      "maintenance",
      "browser-unsupported",
      "compact",
      "inline",
      "card",
      "full-page",
      "split",
      "left",
      "no-visual"
    ],
    "states": [
      "normal",
      "success",
      "info",
      "warning",
      "error",
      "forbidden",
      "not-found",
      "server-error",
      "offline",
      "maintenance",
      "disabled"
    ],
    "parts": [
      "g-page-state-content",
      "g-page-state-body",
      "g-page-state-visual",
      "g-page-state-visual-icon",
      "g-page-state-illustration",
      "g-page-state-eyebrow",
      "g-page-state-code",
      "g-page-state-title",
      "g-page-state-description",
      "g-page-state-summary",
      "g-page-state-metadata",
      "g-page-state-request-id",
      "g-page-state-details",
      "g-page-state-detail-summary",
      "g-page-state-detail-body",
      "g-page-state-actions",
      "g-page-state-action",
      "g-page-state-primary-action",
      "g-page-state-secondary-action",
      "g-page-state-help",
      "g-page-state-link",
      "g-page-state-suggestions",
      "g-page-state-suggestion"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tip",
    "exportName": "GTipDirective",
    "directiveName": "gTip",
    "elementName": "g-tip",
    "category": "help",
    "type": "interactive",
    "selector": ".g-tip",
    "cssSelector": ".g-tip",
    "className": "g-tip",
    "tag": "div",
    "variants": [
      "default",
      "info",
      "success",
      "warning",
      "danger"
    ],
    "states": [
      "default",
      "info",
      "success",
      "warning",
      "danger",
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "inline-hint",
    "exportName": "GInlineHintDirective",
    "directiveName": "gInlineHint",
    "elementName": "g-inline-hint",
    "category": "help",
    "type": "interactive",
    "selector": ".g-inline-hint",
    "cssSelector": ".g-inline-hint",
    "className": "g-inline-hint",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "success",
      "warning"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "help-text",
    "exportName": "GHelpTextDirective",
    "directiveName": "gHelpText",
    "elementName": "g-help-text",
    "category": "help",
    "type": "interactive",
    "selector": ".g-help-text",
    "cssSelector": ".g-help-text",
    "className": "g-help-text",
    "tag": "div",
    "variants": [
      "default",
      "success",
      "warning",
      "danger"
    ],
    "states": [
      "default",
      "success",
      "warning",
      "danger",
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "help-trigger",
    "exportName": "GHelpTriggerDirective",
    "directiveName": "gHelpTrigger",
    "elementName": "g-help-trigger",
    "category": "help",
    "type": "interactive",
    "selector": ".g-help-trigger",
    "cssSelector": ".g-help-trigger",
    "className": "g-help-trigger",
    "tag": "div",
    "variants": [
      "default",
      "text",
      "icon"
    ],
    "states": [
      "default",
      "hover",
      "focus-visible",
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "rich-tooltip",
    "exportName": "GRichTooltipDirective",
    "directiveName": "gRichTooltip",
    "elementName": "g-rich-tooltip",
    "category": "help",
    "type": "interactive",
    "selector": ".g-tooltip-rich",
    "cssSelector": ".g-tooltip-rich",
    "className": "g-tooltip-rich",
    "tag": "div",
    "variants": [
      "default",
      "top",
      "bottom",
      "start",
      "end"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-tooltip-title",
      "g-tooltip-description"
    ],
    "behaviors": [
      "tooltip",
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "help-popover",
    "exportName": "GHelpPopoverDirective",
    "directiveName": "gHelpPopover",
    "elementName": "g-help-popover",
    "category": "help",
    "type": "interactive",
    "selector": ".g-help-popover",
    "cssSelector": ".g-help-popover",
    "className": "g-help-popover",
    "tag": "div",
    "variants": [
      "default",
      "top",
      "bottom",
      "start",
      "end"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-help-popover-header",
      "g-help-popover-title",
      "g-help-popover-body",
      "g-help-popover-actions"
    ],
    "behaviors": [
      "popover",
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "definition-help",
    "exportName": "GDefinitionHelpDirective",
    "directiveName": "gDefinitionHelp",
    "elementName": "g-definition-help",
    "category": "help",
    "type": "interactive",
    "selector": ".g-definition",
    "cssSelector": ".g-definition",
    "className": "g-definition",
    "tag": "div",
    "variants": [
      "default",
      "inline",
      "popover"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "callout",
    "exportName": "GCalloutDirective",
    "directiveName": "gCallout",
    "elementName": "g-callout",
    "category": "help",
    "type": "interactive",
    "selector": ".g-callout",
    "cssSelector": ".g-callout",
    "className": "g-callout",
    "tag": "div",
    "variants": [
      "default",
      "info",
      "success",
      "warning",
      "danger",
      "dismissible"
    ],
    "states": [
      "neutral",
      "info",
      "success",
      "warning",
      "danger",
      "disabled"
    ],
    "parts": [
      "g-callout-icon",
      "g-callout-title",
      "g-callout-content"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "note",
    "exportName": "GNoteDirective",
    "directiveName": "gNote",
    "elementName": "g-note",
    "category": "help",
    "type": "interactive",
    "selector": ".g-note",
    "cssSelector": ".g-note",
    "className": "g-note",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "warning"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-note-label",
      "g-note-title",
      "g-note-content"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "guidance-pair",
    "exportName": "GGuidancePairDirective",
    "directiveName": "gGuidancePair",
    "elementName": "g-guidance-pair",
    "category": "help",
    "type": "interactive",
    "selector": ".g-guidance-pair",
    "cssSelector": ".g-guidance-pair",
    "className": "g-guidance-pair",
    "tag": "div",
    "variants": [
      "default",
      "stacked",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-guidance-do",
      "g-guidance-dont",
      "g-guidance-label"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "key-hint",
    "exportName": "GKeyHintDirective",
    "directiveName": "gKeyHint",
    "elementName": "g-key-hint",
    "category": "help",
    "type": "interactive",
    "selector": ".g-key-hint",
    "cssSelector": ".g-key-hint",
    "className": "g-key-hint",
    "tag": "div",
    "variants": [
      "default",
      "mac",
      "windows"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "shortcut-list",
    "exportName": "GShortcutListDirective",
    "directiveName": "gShortcutList",
    "elementName": "g-shortcut-list",
    "category": "help",
    "type": "interactive",
    "selector": ".g-shortcut-list",
    "cssSelector": ".g-shortcut-list",
    "className": "g-shortcut-list",
    "tag": "div",
    "variants": [
      "default",
      "searchable",
      "grouped"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-shortcut-item",
      "g-shortcut-keys"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "help-card",
    "exportName": "GHelpCardDirective",
    "directiveName": "gHelpCard",
    "elementName": "g-help-card",
    "category": "help",
    "type": "interactive",
    "selector": ".g-help-card",
    "cssSelector": ".g-help-card",
    "className": "g-help-card",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "borderless"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-help-card-icon",
      "g-help-card-title",
      "g-help-card-description",
      "g-help-card-actions"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "help-panel",
    "exportName": "GHelpPanelDirective",
    "directiveName": "gHelpPanel",
    "elementName": "g-help-panel",
    "category": "help",
    "type": "interactive",
    "selector": ".g-help-panel",
    "cssSelector": ".g-help-panel",
    "className": "g-help-panel",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "borderless"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-help-panel-header",
      "g-help-panel-title",
      "g-help-panel-body",
      "g-help-panel-footer"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "help-center",
    "exportName": "GHelpCenterDirective",
    "directiveName": "gHelpCenter",
    "elementName": "g-help-center",
    "category": "help",
    "type": "interactive",
    "selector": ".g-help-center",
    "cssSelector": ".g-help-center",
    "className": "g-help-center",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "categorized"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-help-center-header",
      "g-help-center-title",
      "g-help-center-description",
      "g-help-search"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "help-topics",
    "exportName": "GHelpTopicsDirective",
    "directiveName": "gHelpTopics",
    "elementName": "g-help-topics",
    "category": "help",
    "type": "interactive",
    "selector": ".g-help-topics",
    "cssSelector": ".g-help-topics",
    "className": "g-help-topics",
    "tag": "div",
    "variants": [
      "default",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-help-topic",
      "g-help-topic-title",
      "g-help-topic-meta"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "faq",
    "exportName": "GFaqDirective",
    "directiveName": "gFaq",
    "elementName": "g-faq",
    "category": "help",
    "type": "interactive",
    "selector": ".g-faq",
    "cssSelector": ".g-faq",
    "className": "g-faq",
    "tag": "div",
    "variants": [
      "default",
      "multiple",
      "searchable",
      "borderless"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-faq-item",
      "g-faq-question",
      "g-faq-answer"
    ],
    "behaviors": [
      "accordion",
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "contextual-help",
    "exportName": "GContextualHelpDirective",
    "directiveName": "gContextualHelp",
    "elementName": "g-contextual-help",
    "category": "help",
    "type": "interactive",
    "selector": ".g-contextual-help",
    "cssSelector": ".g-contextual-help",
    "className": "g-contextual-help",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "dismissible"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-contextual-help-content"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "coach-mark",
    "exportName": "GCoachMarkDirective",
    "directiveName": "gCoachMark",
    "elementName": "g-coach-mark",
    "category": "help",
    "type": "interactive",
    "selector": ".g-coach-mark",
    "cssSelector": ".g-coach-mark",
    "className": "g-coach-mark",
    "tag": "div",
    "variants": [
      "default",
      "top",
      "bottom"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-coach-mark-title",
      "g-coach-mark-description",
      "g-coach-mark-actions"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "spotlight",
    "exportName": "GSpotlightDirective",
    "directiveName": "gSpotlight",
    "elementName": "g-spotlight",
    "category": "help",
    "type": "interactive",
    "selector": ".g-spotlight",
    "cssSelector": ".g-spotlight",
    "className": "g-spotlight",
    "tag": "div",
    "variants": [
      "default",
      "top",
      "bottom"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "hotspot",
    "exportName": "GHotspotDirective",
    "directiveName": "gHotspot",
    "elementName": "g-hotspot",
    "category": "help",
    "type": "interactive",
    "selector": ".g-hotspot",
    "cssSelector": ".g-hotspot",
    "className": "g-hotspot",
    "tag": "div",
    "variants": [
      "default",
      "quiet",
      "text"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-hotspot-label"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "feature-hint",
    "exportName": "GFeatureHintDirective",
    "directiveName": "gFeatureHint",
    "elementName": "g-feature-hint",
    "category": "help",
    "type": "interactive",
    "selector": ".g-feature-hint",
    "cssSelector": ".g-feature-hint",
    "className": "g-feature-hint",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "dismissible"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-feature-hint-badge",
      "g-feature-hint-title",
      "g-feature-hint-description"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "whats-new",
    "exportName": "GWhatsNewDirective",
    "directiveName": "gWhatsNew",
    "elementName": "g-whats-new",
    "category": "help",
    "type": "interactive",
    "selector": ".g-whats-new",
    "cssSelector": ".g-whats-new",
    "className": "g-whats-new",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "grouped"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-whats-new-item",
      "g-whats-new-marker",
      "g-whats-new-title",
      "g-whats-new-description"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "help-checklist",
    "exportName": "GHelpChecklistDirective",
    "directiveName": "gHelpChecklist",
    "elementName": "g-help-checklist",
    "category": "help",
    "type": "interactive",
    "selector": ".g-help-checklist",
    "cssSelector": ".g-help-checklist",
    "className": "g-help-checklist",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "readonly"
    ],
    "states": [
      "pending",
      "complete",
      "disabled"
    ],
    "parts": [
      "g-help-checklist-item",
      "g-help-checklist-marker"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "troubleshooting",
    "exportName": "GTroubleshootingDirective",
    "directiveName": "gTroubleshooting",
    "elementName": "g-troubleshooting",
    "category": "help",
    "type": "interactive",
    "selector": ".g-troubleshooting",
    "cssSelector": ".g-troubleshooting",
    "className": "g-troubleshooting",
    "tag": "div",
    "variants": [
      "default",
      "linear",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-troubleshooting-step",
      "g-troubleshooting-number",
      "g-troubleshooting-title",
      "g-troubleshooting-description"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "help-feedback",
    "exportName": "GHelpFeedbackDirective",
    "directiveName": "gHelpFeedback",
    "elementName": "g-help-feedback",
    "category": "help",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-help-feedback",
    "cssSelector": ".g-help-feedback",
    "className": "g-help-feedback",
    "tag": "div",
    "variants": [
      "default",
      "reason",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-help-feedback-actions"
    ],
    "behaviors": [
      "saved-choice",
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "app-shell",
    "exportName": "GAppShellDirective",
    "directiveName": "gAppShell",
    "elementName": "g-app-shell",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-app-shell",
    "cssSelector": ".g-app-shell",
    "className": "g-app-shell",
    "tag": "div",
    "variants": [
      "sidebar",
      "topbar",
      "double-sidebar",
      "collapsed",
      "contained",
      "full-height"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "desktop",
      "tablet",
      "mobile"
    ]
  },
  {
    "name": "dashboard",
    "exportName": "GDashboardDirective",
    "directiveName": "gDashboard",
    "elementName": "g-dashboard",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-dashboard",
    "cssSelector": ".g-dashboard",
    "className": "g-dashboard",
    "tag": "div",
    "variants": [
      "responsive",
      "two-column",
      "three-column",
      "four-column",
      "auto-fit",
      "dense"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-shell",
    "exportName": "GMobileShellDirective",
    "directiveName": "gMobileShell",
    "elementName": "g-mobile-shell",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-mobile-shell",
    "cssSelector": ".g-mobile-shell",
    "className": "g-mobile-shell",
    "tag": "div",
    "variants": [
      "default",
      "contained",
      "safe-area",
      "header-only",
      "bottom-only",
      "full-height"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "chat",
    "exportName": "GChatDirective",
    "directiveName": "gChat",
    "elementName": "g-chat",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-chat",
    "cssSelector": ".g-chat",
    "className": "g-chat",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "bubbles",
      "readonly"
    ],
    "states": [
      "empty",
      "loading",
      "streaming",
      "complete",
      "error",
      "disabled"
    ],
    "parts": [
      "g-chat-list",
      "g-ai-empty-chat"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "message",
    "exportName": "GMessageDirective",
    "directiveName": "gMessage",
    "elementName": "g-message",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-message",
    "cssSelector": ".g-message",
    "className": "g-message",
    "tag": "div",
    "variants": [
      "assistant",
      "user",
      "system",
      "compact",
      "plain"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-message-avatar",
      "g-message-content",
      "g-message-meta",
      "g-message-author",
      "g-message-body",
      "g-message-actions",
      "g-message-branch",
      "g-message-feedback"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "prompt-composer",
    "exportName": "GPromptComposerDirective",
    "directiveName": "gPromptComposer",
    "elementName": "g-prompt-composer",
    "category": "ai",
    "type": "interactive",
    "selector": "[data-g-ai-composer].g-composer",
    "cssSelector": ".g-composer",
    "className": "g-composer",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "multiline",
      "attachments"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-composer-input",
      "g-composer-toolbar",
      "g-composer-tools",
      "g-composer-actions",
      "g-composer-status"
    ],
    "behaviors": [
      "ai-composer",
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "attachment",
    "exportName": "GAttachmentDirective",
    "directiveName": "gAttachment",
    "elementName": "g-attachment",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-attachment",
    "cssSelector": ".g-attachment",
    "className": "g-attachment",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "list"
    ],
    "states": [
      "uploading",
      "ready",
      "error",
      "disabled"
    ],
    "parts": [
      "g-attachment-list",
      "g-attachment-preview",
      "g-attachment-name",
      "g-attachment-meta"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "thinking",
    "exportName": "GThinkingDirective",
    "directiveName": "gThinking",
    "elementName": "g-thinking",
    "category": "ai",
    "type": "interactive",
    "selector": "[data-g-accordion].g-thinking",
    "cssSelector": ".g-thinking",
    "className": "g-thinking",
    "tag": "div",
    "variants": [
      "default",
      "expanded",
      "compact"
    ],
    "states": [
      "collapsed",
      "expanded",
      "streaming",
      "disabled"
    ],
    "parts": [
      "g-thinking-trigger",
      "g-thinking-content"
    ],
    "behaviors": [
      "accordion",
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tool-call",
    "exportName": "GToolCallDirective",
    "directiveName": "gToolCall",
    "elementName": "g-tool-call",
    "category": "ai",
    "type": "interactive",
    "selector": "[data-g-accordion].g-tool-call",
    "cssSelector": ".g-tool-call",
    "className": "g-tool-call",
    "tag": "div",
    "variants": [
      "default",
      "expanded",
      "compact"
    ],
    "states": [
      "queued",
      "running",
      "success",
      "error",
      "stopped",
      "disabled"
    ],
    "parts": [
      "g-tool-call-header",
      "g-tool-call-name",
      "g-tool-call-status",
      "g-tool-call-body",
      "g-tool-call-progress"
    ],
    "behaviors": [
      "accordion",
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tool-approval",
    "exportName": "GToolApprovalDirective",
    "directiveName": "gToolApproval",
    "elementName": "g-tool-approval",
    "category": "ai",
    "type": "interactive",
    "selector": "[data-g-ai-approval].g-approval",
    "cssSelector": ".g-approval",
    "className": "g-approval",
    "tag": "div",
    "variants": [
      "default",
      "detailed",
      "compact"
    ],
    "states": [
      "pending",
      "approved",
      "rejected",
      "cancelled",
      "expired",
      "disabled"
    ],
    "parts": [
      "g-approval-title",
      "g-approval-description",
      "g-approval-scope",
      "g-approval-actions"
    ],
    "behaviors": [
      "ai-approval",
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "agent-status",
    "exportName": "GAgentStatusDirective",
    "directiveName": "gAgentStatus",
    "elementName": "g-agent-status",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-agent-status",
    "cssSelector": ".g-agent-status",
    "className": "g-agent-status",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "detailed"
    ],
    "states": [
      "idle",
      "working",
      "waiting",
      "blocked",
      "complete",
      "failed",
      "disabled"
    ],
    "parts": [
      "g-agent-status-main",
      "g-agent-status-title",
      "g-agent-status-detail"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "agent-plan",
    "exportName": "GAgentPlanDirective",
    "directiveName": "gAgentPlan",
    "elementName": "g-agent-plan",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-plan",
    "cssSelector": ".g-plan",
    "className": "g-plan",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "checkable"
    ],
    "states": [
      "pending",
      "active",
      "complete",
      "failed",
      "disabled"
    ],
    "parts": [
      "g-plan-header",
      "g-plan-list",
      "g-plan-item"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "sources-citations",
    "exportName": "GSourcesCitationsDirective",
    "directiveName": "gSourcesCitations",
    "elementName": "g-sources-citations",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-sources",
    "cssSelector": ".g-sources",
    "className": "g-sources",
    "tag": "div",
    "variants": [
      "default",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-source-list",
      "g-source",
      "g-citation"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "artifact-panel",
    "exportName": "GArtifactPanelDirective",
    "directiveName": "gArtifactPanel",
    "elementName": "g-artifact-panel",
    "category": "ai",
    "type": "interactive",
    "selector": "[data-g-tabs].g-artifact-panel",
    "cssSelector": ".g-artifact-panel",
    "className": "g-artifact-panel",
    "tag": "div",
    "variants": [
      "default",
      "code",
      "markdown",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-artifact-toolbar",
      "g-artifact-tabs",
      "g-artifact-tab",
      "g-artifact-content",
      "g-artifact-status"
    ],
    "behaviors": [
      "tabs",
      "ai"
    ],
    "platforms": [
      "desktop",
      "tablet",
      "mobile"
    ]
  },
  {
    "name": "model-selector",
    "exportName": "GModelSelectorDirective",
    "directiveName": "gModelSelector",
    "elementName": "g-model-selector",
    "category": "ai",
    "type": "interactive",
    "selector": "[data-g-dropdown].g-model-selector",
    "cssSelector": ".g-model-selector",
    "className": "g-model-selector",
    "tag": "div",
    "variants": [
      "default",
      "detailed",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-model-selector-trigger",
      "g-model-selector-menu",
      "g-model-option"
    ],
    "behaviors": [
      "dropdown",
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "context-meter",
    "exportName": "GContextMeterDirective",
    "directiveName": "gContextMeter",
    "elementName": "g-context-meter",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-context-meter",
    "cssSelector": ".g-context-meter",
    "className": "g-context-meter",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "detailed"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-context-meter-bar",
      "g-context-meter-value"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "voice-state",
    "exportName": "GVoiceStateDirective",
    "directiveName": "gVoiceState",
    "elementName": "g-voice-state",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-voice-state",
    "cssSelector": ".g-voice-state",
    "className": "g-voice-state",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "transcript"
    ],
    "states": [
      "idle",
      "listening",
      "processing",
      "speaking",
      "error",
      "disabled"
    ],
    "parts": [
      "g-voice-bar",
      "g-voice-state-label"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "generation-placeholder",
    "exportName": "GGenerationPlaceholderDirective",
    "directiveName": "gGenerationPlaceholder",
    "elementName": "g-generation-placeholder",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-generation-placeholder",
    "cssSelector": ".g-generation-placeholder",
    "className": "g-generation-placeholder",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "progress"
    ],
    "states": [
      "queued",
      "generating",
      "partial",
      "complete",
      "failed",
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "ai-workspace",
    "exportName": "GAiWorkspaceDirective",
    "directiveName": "gAiWorkspace",
    "elementName": "g-ai-workspace",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-ai-shell",
    "cssSelector": ".g-ai-shell",
    "className": "g-ai-shell",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "sidebar"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-ai-sidebar",
      "g-ai-sidebar-header",
      "g-ai-sidebar-footer",
      "g-ai-main",
      "g-ai-header"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "desktop",
      "tablet",
      "mobile"
    ]
  },
  {
    "name": "prompt-starter",
    "exportName": "GPromptStarterDirective",
    "directiveName": "gPromptStarter",
    "elementName": "g-prompt-starter",
    "category": "ai",
    "type": "interactive",
    "selector": "[data-g-prompt-fill].g-prompt-starter",
    "cssSelector": ".g-prompt-starter",
    "className": "g-prompt-starter",
    "tag": "div",
    "variants": [
      "default",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-prompt-starter-header",
      "g-prompt-suggestions",
      "g-prompt-suggestion"
    ],
    "behaviors": [
      "prompt-fill",
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "ai-command-menu",
    "exportName": "GAiCommandMenuDirective",
    "directiveName": "gAiCommandMenu",
    "elementName": "g-ai-command-menu",
    "category": "ai",
    "type": "interactive",
    "selector": "[data-g-roving-nav].g-ai-command-menu",
    "cssSelector": ".g-ai-command-menu",
    "className": "g-ai-command-menu",
    "tag": "div",
    "variants": [
      "default",
      "grouped",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-ai-command-group",
      "g-ai-command-label",
      "g-ai-command-item",
      "g-mention",
      "g-slash-command"
    ],
    "behaviors": [
      "roving-nav",
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "streaming-response",
    "exportName": "GStreamingResponseDirective",
    "directiveName": "gStreamingResponse",
    "elementName": "g-streaming-response",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-streaming-response",
    "cssSelector": ".g-streaming-response",
    "className": "g-streaming-response",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "plain"
    ],
    "states": [
      "streaming",
      "paused",
      "stopped",
      "complete",
      "error",
      "disabled"
    ],
    "parts": [
      "g-streaming-response-header",
      "g-streaming-response-body",
      "g-streaming-response-actions",
      "g-stream-cursor"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "multi-agent-board",
    "exportName": "GMultiAgentBoardDirective",
    "directiveName": "gMultiAgentBoard",
    "elementName": "g-multi-agent-board",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-agent-board",
    "cssSelector": ".g-agent-board",
    "className": "g-agent-board",
    "tag": "div",
    "variants": [
      "default",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-agent-card",
      "g-agent-card-header",
      "g-agent-card-main",
      "g-agent-card-task"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "agent-handoff",
    "exportName": "GAgentHandoffDirective",
    "directiveName": "gAgentHandoff",
    "elementName": "g-agent-handoff",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-agent-handoff",
    "cssSelector": ".g-agent-handoff",
    "className": "g-agent-handoff",
    "tag": "div",
    "variants": [
      "default",
      "detailed",
      "compact"
    ],
    "states": [
      "proposed",
      "accepted",
      "declined",
      "complete",
      "disabled"
    ],
    "parts": [
      "g-agent-handoff-main",
      "g-agent-handoff-actions"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "artifact-workspace",
    "exportName": "GArtifactWorkspaceDirective",
    "directiveName": "gArtifactWorkspace",
    "elementName": "g-artifact-workspace",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-artifact-layout",
    "cssSelector": ".g-artifact-layout",
    "className": "g-artifact-layout",
    "tag": "div",
    "variants": [
      "default",
      "code",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-artifact-panel",
      "g-preview-frame"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "generation-gallery",
    "exportName": "GGenerationGalleryDirective",
    "directiveName": "gGenerationGallery",
    "elementName": "g-generation-gallery",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-generation-grid",
    "cssSelector": ".g-generation-grid",
    "className": "g-generation-grid",
    "tag": "div",
    "variants": [
      "default",
      "list",
      "compact"
    ],
    "states": [
      "queued",
      "generating",
      "partial",
      "complete",
      "failed",
      "disabled"
    ],
    "parts": [
      "g-generation-card"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "ai-context-manager",
    "exportName": "GAiContextManagerDirective",
    "directiveName": "gAiContextManager",
    "elementName": "g-ai-context-manager",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-ai-context-manager",
    "cssSelector": ".g-ai-context-manager",
    "className": "g-ai-context-manager",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "readonly"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-ai-context-header",
      "g-ai-memory-list",
      "g-ai-memory-item",
      "g-ai-memory-main",
      "g-ai-context-sources",
      "g-context-meter"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "ai-usage-panel",
    "exportName": "GAiUsagePanelDirective",
    "directiveName": "gAiUsagePanel",
    "elementName": "g-ai-usage-panel",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-ai-usage-panel",
    "cssSelector": ".g-ai-usage-panel",
    "className": "g-ai-usage-panel",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "detailed"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-ai-usage-header",
      "g-ai-usage-grid",
      "g-ai-usage-metric",
      "g-ai-limit-status",
      "g-cost",
      "g-limit"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "ai-safety-notice",
    "exportName": "GAiSafetyNoticeDirective",
    "directiveName": "gAiSafetyNotice",
    "elementName": "g-ai-safety-notice",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-ai-safety-notice",
    "cssSelector": ".g-ai-safety-notice",
    "className": "g-ai-safety-notice",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "dismissible"
    ],
    "states": [
      "info",
      "warning",
      "blocked",
      "review-required",
      "disabled"
    ],
    "parts": [
      "g-ai-safety-icon",
      "g-ai-safety-main",
      "g-ai-safety-actions"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "ai-feedback",
    "exportName": "GAiFeedbackDirective",
    "directiveName": "gAiFeedback",
    "elementName": "g-ai-feedback",
    "category": "ai",
    "type": "interactive",
    "selector": "[data-g-ai-feedback].g-ai-feedback",
    "cssSelector": ".g-ai-feedback",
    "className": "g-ai-feedback",
    "tag": "div",
    "variants": [
      "default",
      "detailed",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-ai-feedback-question",
      "g-ai-feedback-options",
      "g-ai-feedback-option",
      "g-ai-feedback-detail"
    ],
    "behaviors": [
      "ai-feedback",
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "date-picker",
    "exportName": "GDatePickerDirective",
    "directiveName": "gDatePicker",
    "elementName": "g-date-picker",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-picker].g-date-picker",
    "cssSelector": ".g-date-picker",
    "className": "g-date-picker",
    "tag": "div",
    "variants": [
      "default",
      "flat",
      "bordered",
      "elevated",
      "inline",
      "compact",
      "spacious",
      "full-width",
      "with-presets",
      "with-footer"
    ],
    "states": [
      "default",
      "empty",
      "single",
      "range",
      "partial",
      "complete",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-date-picker-header",
      "g-date-picker-navigation",
      "g-date-picker-previous",
      "g-date-picker-next",
      "g-date-picker-title",
      "g-date-picker-body",
      "g-calendar-grid",
      "g-calendar-row",
      "g-calendar-weekday",
      "g-calendar-day",
      "g-date-picker-presets",
      "g-date-picker-preset",
      "g-date-picker-footer",
      "g-date-picker-selection",
      "g-date-picker-status",
      "g-date-picker-actions",
      "g-date-picker-output"
    ],
    "behaviors": [
      "picker"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "time-picker",
    "exportName": "GTimePickerDirective",
    "directiveName": "gTimePicker",
    "elementName": "g-time-picker",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-wheel-picker].g-time-picker",
    "cssSelector": ".g-time-picker",
    "className": "g-time-picker",
    "tag": "div",
    "variants": [
      "default",
      "inline",
      "bordered",
      "elevated",
      "compact",
      "spacious",
      "full-width",
      "with-seconds",
      "twelve-hour",
      "with-presets",
      "with-footer"
    ],
    "states": [
      "default",
      "empty",
      "active",
      "open",
      "selected",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-time-picker-control",
      "g-time-picker-input",
      "g-time-picker-icon",
      "g-time-picker-clear",
      "g-time-picker-panel",
      "g-time-picker-presets",
      "g-time-picker-preset",
      "g-time-picker-columns",
      "g-time-picker-column",
      "g-time-picker-column-header",
      "g-time-picker-option",
      "g-time-picker-footer",
      "g-time-picker-status",
      "g-time-picker-actions",
      "g-time-picker-output"
    ],
    "behaviors": [
      "wheel-picker"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "pin-input",
    "exportName": "GPinInputDirective",
    "directiveName": "gPinInput",
    "elementName": "g-pin-input",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-otp-input].g-pin-input",
    "cssSelector": ".g-pin-input",
    "className": "g-pin-input",
    "tag": "div",
    "variants": [
      "default",
      "boxed",
      "underlined",
      "compact",
      "spacious",
      "grouped",
      "masked",
      "full-width"
    ],
    "states": [
      "empty",
      "partial",
      "complete",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-pin-input-label",
      "g-pin-input-cells",
      "g-pin-input-cell",
      "g-pin-input-separator",
      "g-pin-input-output",
      "g-pin-input-footer",
      "g-pin-input-status",
      "g-pin-input-help",
      "g-pin-input-actions",
      "g-pin-input-clear"
    ],
    "behaviors": [
      "otp-input"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "rating",
    "exportName": "GRatingDirective",
    "directiveName": "gRating",
    "elementName": "g-rating",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-rating].g-rating",
    "cssSelector": ".g-rating",
    "className": "g-rating",
    "tag": "div",
    "variants": [
      "default",
      "small",
      "medium",
      "large",
      "compact",
      "spacious",
      "half",
      "clearable",
      "with-label",
      "with-value"
    ],
    "states": [
      "empty",
      "rated",
      "previewing",
      "complete",
      "invalid",
      "disabled",
      "read-only",
      "loading"
    ],
    "parts": [
      "g-rating-label",
      "g-rating-items",
      "g-rating-item",
      "g-rating-icon",
      "g-rating-footer",
      "g-rating-value",
      "g-rating-status",
      "g-rating-help",
      "g-rating-actions",
      "g-rating-clear",
      "g-rating-output"
    ],
    "behaviors": [
      "rating"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "transfer-list",
    "exportName": "GTransferListDirective",
    "directiveName": "gTransferList",
    "elementName": "g-transfer-list",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-transfer]",
    "cssSelector": ".g-transfer",
    "className": "g-transfer",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "horizontal",
      "vertical"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-transfer-pane",
      "g-transfer-header",
      "g-transfer-list",
      "g-transfer-option",
      "g-transfer-actions",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "transfer",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "validation-summary",
    "exportName": "GValidationSummaryDirective",
    "directiveName": "gValidationSummary",
    "elementName": "g-validation-summary",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-validation-summary].g-validation-summary",
    "cssSelector": ".g-validation-summary",
    "className": "g-validation-summary",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "spacious",
      "subtle",
      "banner"
    ],
    "states": [
      "empty",
      "valid",
      "invalid",
      "updating",
      "disabled"
    ],
    "parts": [
      "g-validation-summary-icon",
      "g-validation-summary-content",
      "g-validation-summary-header",
      "g-validation-summary-title",
      "g-validation-summary-count",
      "g-validation-summary-description",
      "g-validation-summary-list",
      "g-validation-summary-item",
      "g-validation-summary-label",
      "g-validation-summary-link",
      "g-validation-summary-message",
      "g-validation-summary-actions",
      "g-validation-summary-status"
    ],
    "behaviors": [
      "validation-summary"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mega-menu",
    "exportName": "GMegaMenuDirective",
    "directiveName": "gMegaMenu",
    "elementName": "g-mega-menu",
    "category": "navigation",
    "type": "css",
    "selector": ".g-mega-menu",
    "className": "g-mega-menu",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "anchor-navigation",
    "exportName": "GAnchorNavigationDirective",
    "directiveName": "gAnchorNavigation",
    "elementName": "g-anchor-navigation",
    "category": "navigation",
    "type": "css",
    "selector": ".g-anchor-nav",
    "className": "g-anchor-nav",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tour-spotlight",
    "exportName": "GTourSpotlightDirective",
    "directiveName": "gTourSpotlight",
    "elementName": "g-tour-spotlight",
    "category": "help",
    "type": "interactive",
    "selector": "[data-g-tour]",
    "cssSelector": ".g-tour",
    "className": "g-tour",
    "tag": "div",
    "variants": [
      "default",
      "top",
      "bottom"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-tour-step",
      "g-tour-header",
      "g-tour-title",
      "g-tour-description",
      "g-tour-progress",
      "g-tour-actions",
      "g-spotlight"
    ],
    "behaviors": [
      "tour",
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "virtual-list",
    "exportName": "GVirtualListDirective",
    "directiveName": "gVirtualList",
    "elementName": "g-virtual-list",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-virtual-list",
    "cssSelector": ".g-virtual-list",
    "className": "g-virtual-list",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-virtual-viewport",
      "g-data-virtual-row",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "kanban",
    "exportName": "GKanbanDirective",
    "directiveName": "gKanban",
    "elementName": "g-kanban",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-kanban",
    "cssSelector": ".g-kanban",
    "className": "g-kanban",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "default",
      "dragging",
      "drop-target",
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-kanban-board",
      "g-kanban-column",
      "g-kanban-header",
      "g-kanban-card",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "gantt-shell",
    "exportName": "GGanttShellDirective",
    "directiveName": "gGanttShell",
    "elementName": "g-gantt-shell",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-gantt",
    "cssSelector": ".g-gantt",
    "className": "g-gantt",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-gantt",
      "g-gantt-row",
      "g-gantt-label",
      "g-gantt-track",
      "g-gantt-bar",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "query-builder",
    "exportName": "GQueryBuilderDirective",
    "directiveName": "gQueryBuilder",
    "elementName": "g-query-builder",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-query-builder",
    "cssSelector": ".g-query-builder",
    "className": "g-query-builder",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-query-rule",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "carousel",
    "exportName": "GCarouselDirective",
    "directiveName": "gCarousel",
    "elementName": "g-carousel",
    "category": "media",
    "type": "interactive",
    "selector": "[data-g-carousel]",
    "cssSelector": ".g-carousel",
    "className": "g-carousel",
    "tag": "div",
    "variants": [
      "default",
      "fade",
      "thumbnails",
      "vertical",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "carousel",
      "media"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "gallery-lightbox",
    "exportName": "GGalleryLightboxDirective",
    "directiveName": "gGalleryLightbox",
    "elementName": "g-gallery-lightbox",
    "category": "media",
    "type": "interactive",
    "selector": ".g-gallery",
    "cssSelector": ".g-gallery",
    "className": "g-gallery",
    "tag": "div",
    "variants": [
      "grid",
      "compact",
      "masonry",
      "strip"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "media"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "media-player",
    "exportName": "GMediaPlayerDirective",
    "directiveName": "gMediaPlayer",
    "elementName": "g-media-player",
    "category": "media",
    "type": "interactive",
    "selector": ".g-media-player",
    "cssSelector": ".g-media-player",
    "className": "g-media-player",
    "tag": "div",
    "variants": [
      "video",
      "audio",
      "playlist",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "media"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "document-viewer",
    "exportName": "GDocumentViewerDirective",
    "directiveName": "gDocumentViewer",
    "elementName": "g-document-viewer",
    "category": "media",
    "type": "interactive",
    "selector": ".g-document-viewer",
    "cssSelector": ".g-document-viewer",
    "className": "g-document-viewer",
    "tag": "div",
    "variants": [
      "default",
      "thumbnails",
      "continuous",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "media"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "split-pane",
    "exportName": "GSplitPaneDirective",
    "directiveName": "gSplitPane",
    "elementName": "g-split-pane",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-split-pane]",
    "cssSelector": ".g-split-pane",
    "className": "g-split-pane",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "horizontal",
      "vertical",
      "collapsible"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "split-pane",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "drag-sort",
    "exportName": "GDragSortDirective",
    "directiveName": "gDragSort",
    "elementName": "g-drag-sort",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-sortable-item",
    "cssSelector": ".g-sortable-item",
    "className": "g-sortable-item",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "cards"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "infinite-scroll",
    "exportName": "GInfiniteScrollDirective",
    "directiveName": "gInfiniteScroll",
    "elementName": "g-infinite-scroll",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-infinite-status",
    "cssSelector": ".g-infinite-status",
    "className": "g-infinite-status",
    "tag": "div",
    "variants": [
      "inline",
      "block",
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "manual",
      "automatic"
    ],
    "states": [
      "idle",
      "loading",
      "complete",
      "error",
      "empty",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-spinner",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "pull-refresh",
    "exportName": "GPullRefreshDirective",
    "directiveName": "gPullRefresh",
    "elementName": "g-pull-refresh",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-pull-refresh",
    "cssSelector": ".g-pull-refresh",
    "className": "g-pull-refresh",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "button",
      "gesture"
    ],
    "states": [
      "idle",
      "pulling",
      "ready",
      "refreshing",
      "complete",
      "error",
      "loading",
      "empty",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-pull-refresh-indicator",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "product-card",
    "exportName": "GProductCardDirective",
    "directiveName": "gProductCard",
    "elementName": "g-product-card",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-product-card",
    "cssSelector": ".g-product-card",
    "className": "g-product-card",
    "tag": "div",
    "variants": [
      "default",
      "horizontal",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "cart-item",
    "exportName": "GCartItemDirective",
    "directiveName": "gCartItem",
    "elementName": "g-cart-item",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-cart-item",
    "cssSelector": ".g-cart-item",
    "className": "g-cart-item",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "readonly"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "price-quantity",
    "exportName": "GPriceQuantityDirective",
    "directiveName": "gPriceQuantity",
    "elementName": "g-price-quantity",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-price",
    "cssSelector": ".g-price",
    "className": "g-price",
    "tag": "div",
    "variants": [
      "default",
      "inline",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "conversation-list",
    "exportName": "GConversationListDirective",
    "directiveName": "gConversationList",
    "elementName": "g-conversation-list",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-conversation-list",
    "cssSelector": ".g-conversation-list",
    "className": "g-conversation-list",
    "tag": "div",
    "variants": [
      "default",
      "grouped",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "prompt-library",
    "exportName": "GPromptLibraryDirective",
    "directiveName": "gPromptLibrary",
    "elementName": "g-prompt-library",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-prompt-library",
    "cssSelector": ".g-prompt-library",
    "className": "g-prompt-library",
    "tag": "div",
    "variants": [
      "default",
      "grouped",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mention-slash-command",
    "exportName": "GMentionSlashCommandDirective",
    "directiveName": "gMentionSlashCommand",
    "elementName": "g-mention-slash-command",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-mention",
    "cssSelector": ".g-mention",
    "className": "g-mention",
    "tag": "div",
    "variants": [
      "default",
      "mentions",
      "commands"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "generation-card",
    "exportName": "GGenerationCardDirective",
    "directiveName": "gGenerationCard",
    "elementName": "g-generation-card",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-generation-card",
    "cssSelector": ".g-generation-card",
    "className": "g-generation-card",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "progress"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "file-tree",
    "exportName": "GFileTreeDirective",
    "directiveName": "gFileTree",
    "elementName": "g-file-tree",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-file-tree",
    "cssSelector": ".g-file-tree",
    "className": "g-file-tree",
    "tag": "div",
    "variants": [
      "default",
      "expanded",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "version-history",
    "exportName": "GVersionHistoryDirective",
    "directiveName": "gVersionHistory",
    "elementName": "g-version-history",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-version-list",
    "cssSelector": ".g-version-list",
    "className": "g-version-list",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "detailed"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "permission-scope",
    "exportName": "GPermissionScopeDirective",
    "directiveName": "gPermissionScope",
    "elementName": "g-permission-scope",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-permission-scope",
    "cssSelector": ".g-permission-scope",
    "className": "g-permission-scope",
    "tag": "div",
    "variants": [
      "default",
      "checkable",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "cost-rate-limit",
    "exportName": "GCostRateLimitDirective",
    "directiveName": "gCostRateLimit",
    "elementName": "g-cost-rate-limit",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-cost",
    "cssSelector": ".g-cost",
    "className": "g-cost",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "detailed"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "privacy-notice",
    "exportName": "GPrivacyNoticeDirective",
    "directiveName": "gPrivacyNotice",
    "elementName": "g-privacy-notice",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-privacy-notice",
    "cssSelector": ".g-privacy-notice",
    "className": "g-privacy-notice",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "dismissible"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "authentication-shell",
    "exportName": "GAuthenticationShellDirective",
    "directiveName": "gAuthenticationShell",
    "elementName": "g-authentication-shell",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-auth-shell",
    "cssSelector": ".g-auth-shell",
    "className": "g-auth-shell",
    "tag": "div",
    "variants": [
      "centered",
      "split",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-category",
    "exportName": "GMobileCategoryDirective",
    "directiveName": "gMobileCategory",
    "elementName": "g-mobile-category",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-category",
    "cssSelector": ".g-mobile-category",
    "className": "g-mobile-category",
    "tag": "div",
    "variants": [
      "grid",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "cms-shell",
    "exportName": "GCmsShellDirective",
    "directiveName": "gCmsShell",
    "elementName": "g-cms-shell",
    "category": "cms",
    "type": "interactive",
    "selector": ".g-cms-shell",
    "cssSelector": ".g-cms-shell",
    "className": "g-cms-shell",
    "tag": "div",
    "variants": [
      "table",
      "cards",
      "compact",
      "inspector"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "cms"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "visual-builder",
    "exportName": "GVisualBuilderDirective",
    "directiveName": "gVisualBuilder",
    "elementName": "g-visual-builder",
    "category": "cms",
    "type": "interactive",
    "selector": ".g-cms-canvas",
    "cssSelector": ".g-cms-canvas",
    "className": "g-cms-canvas",
    "tag": "div",
    "variants": [
      "desktop",
      "tablet",
      "mobile",
      "outline"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "cms"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "rich-editor",
    "exportName": "GRichEditorDirective",
    "directiveName": "gRichEditor",
    "elementName": "g-rich-editor",
    "category": "cms",
    "type": "interactive",
    "selector": ".g-editor",
    "cssSelector": ".g-editor",
    "className": "g-editor",
    "tag": "div",
    "variants": [
      "document",
      "split",
      "minimal",
      "seo"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "cms"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "media-library",
    "exportName": "GMediaLibraryDirective",
    "directiveName": "gMediaLibrary",
    "elementName": "g-media-library",
    "category": "cms",
    "type": "interactive",
    "selector": ".g-media-library",
    "cssSelector": ".g-media-library",
    "className": "g-media-library",
    "tag": "div",
    "variants": [
      "grid",
      "list",
      "multiple",
      "inspector"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "cms"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "content-workflow",
    "exportName": "GContentWorkflowDirective",
    "directiveName": "gContentWorkflow",
    "elementName": "g-content-workflow",
    "category": "cms",
    "type": "interactive",
    "selector": ".g-workflow",
    "cssSelector": ".g-workflow",
    "className": "g-workflow",
    "tag": "div",
    "variants": [
      "board",
      "list",
      "approval",
      "scheduled"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "cms"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "localization-grid",
    "exportName": "GLocalizationGridDirective",
    "directiveName": "gLocalizationGrid",
    "elementName": "g-localization-grid",
    "category": "cms",
    "type": "interactive",
    "selector": ".g-localization-grid",
    "cssSelector": ".g-localization-grid",
    "className": "g-localization-grid",
    "tag": "div",
    "variants": [
      "matrix",
      "stacked",
      "missing",
      "review"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "cms"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "site-header",
    "exportName": "GSiteHeaderDirective",
    "directiveName": "gSiteHeader",
    "elementName": "g-site-header",
    "category": "marketing",
    "type": "interactive",
    "selector": ".g-site-header",
    "cssSelector": ".g-site-header",
    "className": "g-site-header",
    "tag": "div",
    "variants": [
      "standard",
      "centered",
      "compact",
      "sticky"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "marketing"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "hero",
    "exportName": "GHeroDirective",
    "directiveName": "gHero",
    "elementName": "g-hero",
    "category": "marketing",
    "type": "interactive",
    "selector": ".g-hero",
    "cssSelector": ".g-hero",
    "className": "g-hero",
    "tag": "div",
    "variants": [
      "split",
      "centered",
      "compact",
      "media"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "marketing"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "pricing",
    "exportName": "GPricingDirective",
    "directiveName": "gPricing",
    "elementName": "g-pricing",
    "category": "marketing",
    "type": "interactive",
    "selector": ".g-pricing-grid",
    "cssSelector": ".g-pricing-grid",
    "className": "g-pricing-grid",
    "tag": "div",
    "variants": [
      "cards",
      "comparison",
      "compact",
      "enterprise"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "marketing"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "article-layout",
    "exportName": "GArticleLayoutDirective",
    "directiveName": "gArticleLayout",
    "elementName": "g-article-layout",
    "category": "content",
    "type": "interactive",
    "selector": ".g-article-shell",
    "cssSelector": ".g-article-shell",
    "className": "g-article-shell",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "narrow",
      "wide"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "product-detail",
    "exportName": "GProductDetailDirective",
    "directiveName": "gProductDetail",
    "elementName": "g-product-detail",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-product-detail",
    "cssSelector": ".g-product-detail",
    "className": "g-product-detail",
    "tag": "div",
    "variants": [
      "default",
      "split",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "checkout",
    "exportName": "GCheckoutDirective",
    "directiveName": "gCheckout",
    "elementName": "g-checkout",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-checkout-layout",
    "cssSelector": ".g-checkout-layout",
    "className": "g-checkout-layout",
    "tag": "div",
    "variants": [
      "default",
      "steps",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "enterprise-settings",
    "exportName": "GEnterpriseSettingsDirective",
    "directiveName": "gEnterpriseSettings",
    "elementName": "g-enterprise-settings",
    "category": "enterprise",
    "type": "interactive",
    "selector": ".g-settings-shell",
    "cssSelector": ".g-settings-shell",
    "className": "g-settings-shell",
    "tag": "div",
    "variants": [
      "sidebar",
      "tabs",
      "stacked",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "enterprise"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "permission-matrix",
    "exportName": "GPermissionMatrixDirective",
    "directiveName": "gPermissionMatrix",
    "elementName": "g-permission-matrix",
    "category": "enterprise",
    "type": "interactive",
    "selector": ".g-permission-matrix",
    "cssSelector": ".g-permission-matrix",
    "className": "g-permission-matrix",
    "tag": "div",
    "variants": [
      "matrix",
      "grouped",
      "stacked",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "enterprise"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "audit-log",
    "exportName": "GAuditLogDirective",
    "directiveName": "gAuditLog",
    "elementName": "g-audit-log",
    "category": "enterprise",
    "type": "interactive",
    "selector": ".g-audit-event",
    "cssSelector": ".g-audit-event",
    "className": "g-audit-event",
    "tag": "div",
    "variants": [
      "table",
      "timeline",
      "inspector",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "enterprise"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-shell",
    "exportName": "GDesktopShellDirective",
    "directiveName": "gDesktopShell",
    "elementName": "g-desktop-shell",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-shell",
    "cssSelector": ".g-desktop-shell",
    "className": "g-desktop-shell",
    "tag": "div",
    "variants": [
      "standard",
      "compact",
      "focus",
      "studio"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "desktop",
      "tauri",
      "electron"
    ]
  },
  {
    "name": "desktop-titlebar",
    "exportName": "GDesktopTitlebarDirective",
    "directiveName": "gDesktopTitlebar",
    "elementName": "g-desktop-titlebar",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-titlebar",
    "cssSelector": ".g-titlebar",
    "className": "g-titlebar",
    "tag": "div",
    "variants": [
      "windows",
      "macos",
      "compact",
      "centered"
    ],
    "states": [
      "normal",
      "focused",
      "unfocused",
      "maximized",
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "tauri",
      "electron"
    ]
  },
  {
    "name": "desktop-workbench",
    "exportName": "GDesktopWorkbenchDirective",
    "directiveName": "gDesktopWorkbench",
    "elementName": "g-desktop-workbench",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-workbench",
    "cssSelector": ".g-workbench",
    "className": "g-workbench",
    "tag": "div",
    "variants": [
      "editor",
      "split",
      "focus",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "desktop",
      "tauri",
      "electron"
    ]
  },
  {
    "name": "onboarding",
    "exportName": "GOnboardingDirective",
    "directiveName": "gOnboarding",
    "elementName": "g-onboarding",
    "category": "workflow",
    "type": "interactive",
    "selector": ".g-onboarding",
    "cssSelector": ".g-onboarding",
    "className": "g-onboarding",
    "tag": "div",
    "variants": [
      "guided",
      "cards",
      "checklist",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "workflow"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "wizard-layout",
    "exportName": "GWizardLayoutDirective",
    "directiveName": "gWizardLayout",
    "elementName": "g-wizard-layout",
    "category": "workflow",
    "type": "interactive",
    "selector": ".g-wizard-layout",
    "cssSelector": ".g-wizard-layout",
    "className": "g-wizard-layout",
    "tag": "div",
    "variants": [
      "sidebar",
      "top",
      "vertical",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "workflow"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "notification-center",
    "exportName": "GNotificationCenterDirective",
    "directiveName": "gNotificationCenter",
    "elementName": "g-notification-center",
    "category": "communication",
    "type": "interactive",
    "selector": ".g-notification-center",
    "cssSelector": ".g-notification-center",
    "className": "g-notification-center",
    "tag": "div",
    "variants": [
      "list",
      "grouped",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "communication"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "inbox",
    "exportName": "GInboxDirective",
    "directiveName": "gInbox",
    "elementName": "g-inbox",
    "category": "communication",
    "type": "interactive",
    "selector": ".g-inbox",
    "cssSelector": ".g-inbox",
    "className": "g-inbox",
    "tag": "div",
    "variants": [
      "split",
      "list",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "communication"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "search-results",
    "exportName": "GSearchResultsDirective",
    "directiveName": "gSearchResults",
    "elementName": "g-search-results",
    "category": "content",
    "type": "interactive",
    "selector": ".g-search-page",
    "cssSelector": ".g-search-page",
    "className": "g-search-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "narrow",
      "wide"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "calendar",
    "exportName": "GCalendarDirective",
    "directiveName": "gCalendar",
    "elementName": "g-calendar",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-calendar",
    "cssSelector": ".g-calendar",
    "className": "g-calendar",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-calendar-grid",
      "g-data-calendar-day",
      "g-data-calendar-weekday",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions",
      "g-cal-header",
      "g-cal-title",
      "g-cal-control",
      "g-cal-body",
      "g-cal-cell",
      "g-cal-number",
      "g-cal-content",
      "g-cal-event",
      "g-cal-year",
      "g-cal-year-month",
      "g-cal-month-title",
      "g-cal-footer",
      "g-cal-status"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "agenda",
    "exportName": "GAgendaDirective",
    "directiveName": "gAgenda",
    "elementName": "g-agenda",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-agenda",
    "cssSelector": ".g-agenda",
    "className": "g-agenda",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-agenda-list",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "file-manager",
    "exportName": "GFileManagerDirective",
    "directiveName": "gFileManager",
    "elementName": "g-file-manager",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-file-manager",
    "cssSelector": ".g-file-manager",
    "className": "g-file-manager",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "grid",
      "list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-files",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "upload-queue",
    "exportName": "GUploadQueueDirective",
    "directiveName": "gUploadQueue",
    "elementName": "g-upload-queue",
    "category": "form",
    "type": "interactive",
    "selector": ".g-upload-queue",
    "className": "g-upload-queue",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "spacious",
      "bordered",
      "flat"
    ],
    "states": [
      "empty",
      "queued",
      "uploading",
      "paused",
      "success",
      "error",
      "mixed",
      "disabled"
    ],
    "parts": [
      "g-upload-queue-header",
      "g-upload-queue-title",
      "g-upload-summary",
      "g-upload-input",
      "g-upload-list",
      "g-upload-empty",
      "g-upload-item",
      "g-file-icon",
      "g-file-main",
      "g-file-name",
      "g-file-meta",
      "g-upload-status",
      "g-upload-progress",
      "g-upload-progress-bar",
      "g-upload-actions"
    ],
    "behaviors": [
      "upload-manager"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "form-builder",
    "exportName": "GFormBuilderDirective",
    "directiveName": "gFormBuilder",
    "elementName": "g-form-builder",
    "category": "form",
    "type": "interactive",
    "selector": "[data-g-builder-list].g-form-builder",
    "cssSelector": ".g-form-builder",
    "className": "g-form-builder",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "spacious",
      "bordered",
      "flat",
      "preview"
    ],
    "states": [
      "empty",
      "editing",
      "dirty",
      "valid",
      "invalid",
      "disabled",
      "read-only"
    ],
    "parts": [
      "g-form-builder-header",
      "g-form-builder-heading",
      "g-form-builder-title",
      "g-form-builder-description",
      "g-form-builder-status",
      "g-form-builder-actions",
      "g-form-builder-main",
      "g-form-builder-palette",
      "g-form-builder-palette-header",
      "g-form-builder-palette-list",
      "g-form-builder-palette-item",
      "g-form-builder-canvas",
      "g-form-builder-canvas-header",
      "g-form-builder-fields",
      "g-form-builder-empty",
      "g-form-builder-field",
      "g-form-builder-field-header",
      "g-form-builder-field-type",
      "g-form-builder-field-body",
      "g-form-builder-field-actions",
      "g-form-builder-inspector",
      "g-form-builder-inspector-header",
      "g-form-builder-inspector-body",
      "g-form-builder-inspector-empty",
      "g-form-builder-output"
    ],
    "behaviors": [
      "builder-list"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "filter-builder",
    "exportName": "GFilterBuilderDirective",
    "directiveName": "gFilterBuilder",
    "elementName": "g-filter-builder",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-filter-builder",
    "cssSelector": ".g-filter-builder",
    "className": "g-filter-builder",
    "tag": "div",
    "variants": [
      "flat",
      "bordered",
      "nested",
      "compact",
      "comfortable",
      "borderless"
    ],
    "states": [
      "normal",
      "loading",
      "empty",
      "invalid",
      "disabled",
      "error"
    ],
    "parts": [
      "g-filter-builder-header",
      "g-filter-group",
      "g-filter-group-header",
      "g-filter-rule",
      "g-filter-conjunction",
      "g-filter-builder-empty",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "pivot-table",
    "exportName": "GPivotTableDirective",
    "directiveName": "gPivotTable",
    "elementName": "g-pivot-table",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-pivot",
    "cssSelector": ".g-pivot",
    "className": "g-pivot",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-managed-scroll",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "organization-chart",
    "exportName": "GOrganizationChartDirective",
    "directiveName": "gOrganizationChart",
    "elementName": "g-organization-chart",
    "category": "data",
    "type": "css",
    "selector": ".g-org-chart",
    "cssSelector": ".g-org-chart",
    "className": "g-org-chart",
    "tag": "div",
    "variants": [
      "horizontal",
      "vertical",
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "normal",
      "loading",
      "empty",
      "selected",
      "collapsed"
    ],
    "parts": [
      "g-org-level",
      "g-org-children",
      "g-org-branch",
      "g-org-node",
      "g-org-node-title",
      "g-org-node-meta",
      "g-org-chart-empty"
    ],
    "behaviors": [],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "map-shell",
    "exportName": "GMapShellDirective",
    "directiveName": "gMapShell",
    "elementName": "g-map-shell",
    "category": "data",
    "type": "interactive",
    "selector": "[data-g-data-display].g-map-shell",
    "cssSelector": ".g-map-shell",
    "className": "g-map-shell",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-data-map-canvas",
      "g-data-map-world",
      "g-data-map-marker",
      "g-data-managed-toolbar",
      "g-data-managed-empty",
      "g-data-managed-actions"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "comment-thread",
    "exportName": "GCommentThreadDirective",
    "directiveName": "gCommentThread",
    "elementName": "g-comment-thread",
    "category": "communication",
    "type": "interactive",
    "selector": ".g-comment-thread",
    "cssSelector": ".g-comment-thread",
    "className": "g-comment-thread",
    "tag": "div",
    "variants": [
      "threaded",
      "flat",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "communication"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "activity-feed",
    "exportName": "GActivityFeedDirective",
    "directiveName": "gActivityFeed",
    "elementName": "g-activity-feed",
    "category": "communication",
    "type": "interactive",
    "selector": ".g-activity-feed",
    "cssSelector": ".g-activity-feed",
    "className": "g-activity-feed",
    "tag": "div",
    "variants": [
      "timeline",
      "grouped",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "communication"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "report-invoice",
    "exportName": "GReportInvoiceDirective",
    "directiveName": "gReportInvoice",
    "elementName": "g-report-invoice",
    "category": "content",
    "type": "interactive",
    "selector": ".g-report",
    "cssSelector": ".g-report",
    "className": "g-report",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "narrow",
      "wide"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "cookie-consent",
    "exportName": "GCookieConsentDirective",
    "directiveName": "gCookieConsent",
    "elementName": "g-cookie-consent",
    "category": "legal",
    "type": "interactive",
    "selector": ".g-cookie-banner",
    "cssSelector": ".g-cookie-banner",
    "className": "g-cookie-banner",
    "tag": "div",
    "variants": [
      "banner",
      "card",
      "inline",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "legal"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "copy-action",
    "exportName": "GCopyActionDirective",
    "directiveName": "gCopyAction",
    "elementName": "g-copy-action",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-copy]",
    "cssSelector": ".g-copy-action",
    "className": "g-copy-action",
    "tag": "div",
    "variants": [
      "button",
      "icon",
      "text",
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "with-value"
    ],
    "states": [
      "idle",
      "copied",
      "failed",
      "disabled",
      "loading",
      "empty",
      "error",
      "readonly"
    ],
    "parts": [
      "g-btn",
      "g-icon",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "copy",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "fullscreen-action",
    "exportName": "GFullscreenActionDirective",
    "directiveName": "gFullscreenAction",
    "elementName": "g-fullscreen-action",
    "category": "interaction",
    "type": "interactive",
    "selector": "[data-g-fullscreen]",
    "cssSelector": ".g-fullscreen-action",
    "className": "g-fullscreen-action",
    "tag": "div",
    "variants": [
      "button",
      "icon",
      "text",
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "contained"
    ],
    "states": [
      "idle",
      "active",
      "disabled",
      "loading",
      "empty",
      "error",
      "readonly"
    ],
    "parts": [
      "g-btn",
      "g-icon",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "fullscreen",
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "back-to-top",
    "exportName": "GBackToTopDirective",
    "directiveName": "gBackToTop",
    "elementName": "g-back-to-top",
    "category": "navigation",
    "type": "interactive",
    "selector": "[data-g-scroll-top]",
    "cssSelector": ".g-back-to-top",
    "className": "g-back-to-top",
    "tag": "div",
    "variants": [],
    "states": [],
    "parts": [],
    "behaviors": [
      "scroll-top"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "image-crop-shell",
    "exportName": "GImageCropShellDirective",
    "directiveName": "gImageCropShell",
    "elementName": "g-image-crop-shell",
    "category": "media",
    "type": "interactive",
    "selector": ".g-image-crop",
    "cssSelector": ".g-image-crop",
    "className": "g-image-crop",
    "tag": "div",
    "variants": [
      "default",
      "square",
      "wide",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "media"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "content-file-drop",
    "exportName": "GContentFileDropDirective",
    "directiveName": "gContentFileDrop",
    "elementName": "g-content-file-drop",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-dropzone].g-file-drop",
    "cssSelector": ".g-file-drop",
    "className": "g-file-drop",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "summary",
      "detailed"
    ],
    "states": [
      "default",
      "dragging",
      "disabled",
      "loading",
      "empty",
      "error",
      "readonly"
    ],
    "parts": [
      "g-file-drop-icon",
      "g-file-drop-title",
      "g-file-drop-rules",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "dropzone",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "content-file-list",
    "exportName": "GContentFileListDirective",
    "directiveName": "gContentFileList",
    "elementName": "g-content-file-list",
    "category": "content",
    "type": "interactive",
    "selector": ".g-file-list",
    "cssSelector": ".g-file-list",
    "className": "g-file-list",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "grid"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-file-list-header",
      "g-file-row",
      "g-file-icon",
      "g-file-main",
      "g-file-actions",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "content-upload-queue",
    "exportName": "GContentUploadQueueDirective",
    "directiveName": "gContentUploadQueue",
    "elementName": "g-content-upload-queue",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-upload-manager].g-upload-queue",
    "cssSelector": ".g-upload-queue",
    "className": "g-upload-queue",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "summary",
      "detailed"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-upload-queue-header",
      "g-upload-summary",
      "g-upload-item",
      "g-upload-actions",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "upload-manager",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "chunk-upload",
    "exportName": "GChunkUploadDirective",
    "directiveName": "gChunkUpload",
    "elementName": "g-chunk-upload",
    "category": "content",
    "type": "interactive",
    "selector": ".g-chunk-upload",
    "cssSelector": ".g-chunk-upload",
    "className": "g-chunk-upload",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "summary",
      "detailed"
    ],
    "states": [
      "queued",
      "uploading",
      "paused",
      "success",
      "error",
      "loading",
      "empty",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-chunk-map",
      "g-chunk",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "upload-progress-composition",
    "exportName": "GUploadProgressCompositionDirective",
    "directiveName": "gUploadProgressComposition",
    "elementName": "g-upload-progress-composition",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-upload-manager] .g-upload-progress",
    "cssSelector": ".g-upload-progress",
    "className": "g-upload-progress",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "summary",
      "detailed"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-upload-progress-bar",
      "g-upload-status",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "upload-manager",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "failed-upload",
    "exportName": "GFailedUploadDirective",
    "directiveName": "gFailedUpload",
    "elementName": "g-failed-upload",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-upload-manager] .g-failed-upload",
    "cssSelector": ".g-failed-upload",
    "className": "g-failed-upload",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "summary",
      "detailed"
    ],
    "states": [
      "error",
      "retrying",
      "loading",
      "empty",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "upload-manager",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "file-card-composition",
    "exportName": "GFileCardCompositionDirective",
    "directiveName": "gFileCardComposition",
    "elementName": "g-file-card-composition",
    "category": "content",
    "type": "interactive",
    "selector": ".g-file-card",
    "cssSelector": ".g-file-card",
    "className": "g-file-card",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "grid"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-file-card-preview",
      "g-file-card-body",
      "g-file-card-footer",
      "g-file-card-grid",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "folder-tree-composition",
    "exportName": "GFolderTreeCompositionDirective",
    "directiveName": "gFolderTreeComposition",
    "elementName": "g-folder-tree-composition",
    "category": "content",
    "type": "interactive",
    "selector": ".g-folder-tree",
    "cssSelector": ".g-folder-tree",
    "className": "g-folder-tree",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "grid"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-folder-tree-item",
      "g-folder-tree-count",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "file-browser-composition",
    "exportName": "GFileBrowserCompositionDirective",
    "directiveName": "gFileBrowserComposition",
    "elementName": "g-file-browser-composition",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-file-browser].g-file-browser",
    "cssSelector": ".g-file-browser",
    "className": "g-file-browser",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "grid"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-file-browser-header",
      "g-file-browser-tree",
      "g-file-browser-main",
      "g-file-browser-status",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "file-browser",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "file-preview-composition",
    "exportName": "GFilePreviewCompositionDirective",
    "directiveName": "gFilePreviewComposition",
    "elementName": "g-file-preview-composition",
    "category": "content",
    "type": "interactive",
    "selector": ".g-file-preview",
    "cssSelector": ".g-file-preview",
    "className": "g-file-preview",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "fit",
      "thumbnails"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-file-preview-toolbar",
      "g-file-preview-stage",
      "g-file-preview-meta",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "media-library-composition",
    "exportName": "GMediaLibraryCompositionDirective",
    "directiveName": "gMediaLibraryComposition",
    "elementName": "g-media-library-composition",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-file-browser].g-media-library",
    "cssSelector": ".g-media-library",
    "className": "g-media-library",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "grid"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-media-library-main",
      "g-media-library-header",
      "g-media-details",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "file-browser",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "media-grid-composition",
    "exportName": "GMediaGridCompositionDirective",
    "directiveName": "gMediaGridComposition",
    "elementName": "g-media-grid-composition",
    "category": "content",
    "type": "interactive",
    "selector": ".g-media-grid",
    "cssSelector": ".g-media-grid",
    "className": "g-media-grid",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "grid"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-media-item",
      "g-media-thumb",
      "g-media-label",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "media-details-composition",
    "exportName": "GMediaDetailsCompositionDirective",
    "directiveName": "gMediaDetailsComposition",
    "elementName": "g-media-details-composition",
    "category": "content",
    "type": "interactive",
    "selector": ".g-media-details",
    "cssSelector": ".g-media-details",
    "className": "g-media-details",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "grid"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-media-details-preview",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "image-crop-composition",
    "exportName": "GImageCropCompositionDirective",
    "directiveName": "gImageCropComposition",
    "elementName": "g-image-crop-composition",
    "category": "content",
    "type": "interactive",
    "selector": ".g-image-crop.g-content-image-crop",
    "cssSelector": ".g-content-image-crop",
    "className": "g-content-image-crop",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "fit",
      "thumbnails"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-image-tools",
      "g-image-stage",
      "g-crop-frame",
      "g-image-inspector",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "image-annotation-composition",
    "exportName": "GImageAnnotationCompositionDirective",
    "directiveName": "gImageAnnotationComposition",
    "elementName": "g-image-annotation-composition",
    "category": "content",
    "type": "interactive",
    "selector": ".g-image-annotation",
    "cssSelector": ".g-image-annotation",
    "className": "g-image-annotation",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "fit",
      "thumbnails"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-image-tools",
      "g-image-stage",
      "g-annotation-pin",
      "g-image-inspector",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "document-viewer-composition",
    "exportName": "GDocumentViewerCompositionDirective",
    "directiveName": "gDocumentViewerComposition",
    "elementName": "g-document-viewer-composition",
    "category": "content",
    "type": "interactive",
    "selector": ".g-document-viewer.g-content-document-viewer",
    "cssSelector": ".g-content-document-viewer",
    "className": "g-content-document-viewer",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "fit",
      "thumbnails"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-viewer-toolbar",
      "g-viewer-thumbnails",
      "g-viewer-thumbnail",
      "g-viewer-page",
      "g-document-page",
      "g-viewer-status",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "pdf-viewer",
    "exportName": "GPdfViewerDirective",
    "directiveName": "gPdfViewer",
    "elementName": "g-pdf-viewer",
    "category": "content",
    "type": "interactive",
    "selector": ".g-pdf-viewer",
    "cssSelector": ".g-pdf-viewer",
    "className": "g-pdf-viewer",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "fit",
      "thumbnails"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-viewer-toolbar",
      "g-viewer-thumbnails",
      "g-viewer-page",
      "g-viewer-status",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "video-player-shell",
    "exportName": "GVideoPlayerShellDirective",
    "directiveName": "gVideoPlayerShell",
    "elementName": "g-video-player-shell",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-media-player].g-video-player",
    "cssSelector": ".g-video-player",
    "className": "g-video-player",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "compact-controls",
      "wide"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-video-stage",
      "g-media-controls",
      "g-media-timeline",
      "g-media-time",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "media-player",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "audio-player-shell",
    "exportName": "GAudioPlayerShellDirective",
    "directiveName": "gAudioPlayerShell",
    "elementName": "g-audio-player-shell",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-media-player].g-audio-player",
    "cssSelector": ".g-audio-player",
    "className": "g-audio-player",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "compact-controls",
      "wide"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-audio-art",
      "g-media-controls",
      "g-media-timeline",
      "g-media-time",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "media-player",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "code-editor-shell",
    "exportName": "GCodeEditorShellDirective",
    "directiveName": "gCodeEditorShell",
    "elementName": "g-code-editor-shell",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-editor-shell].g-code-editor",
    "cssSelector": ".g-code-editor",
    "className": "g-code-editor",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "split",
      "source-only"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-code-editor-body",
      "g-code-gutter",
      "g-code-content",
      "g-editor-status",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "editor-shell",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "rich-text-editor-composition",
    "exportName": "GRichTextEditorCompositionDirective",
    "directiveName": "gRichTextEditorComposition",
    "elementName": "g-rich-text-editor-composition",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-editor-shell].g-rich-text-editor",
    "cssSelector": ".g-rich-text-editor",
    "className": "g-rich-text-editor",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "split",
      "source-only"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-editor-toolbar",
      "g-editor-surface",
      "g-editor-status",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "editor-shell",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "markdown-editor",
    "exportName": "GMarkdownEditorDirective",
    "directiveName": "gMarkdownEditor",
    "elementName": "g-markdown-editor",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-editor-shell].g-markdown-editor",
    "cssSelector": ".g-markdown-editor",
    "className": "g-markdown-editor",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "split",
      "source-only"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-markdown-source",
      "g-markdown-preview",
      "g-editor-status",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "editor-shell",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "block-editor",
    "exportName": "GBlockEditorDirective",
    "directiveName": "gBlockEditor",
    "elementName": "g-block-editor",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-editor-shell].g-block-editor",
    "cssSelector": ".g-block-editor",
    "className": "g-block-editor",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "split",
      "source-only"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-block",
      "g-block-handle",
      "g-block-content",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "editor-shell",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "revision-compare-composition",
    "exportName": "GRevisionCompareCompositionDirective",
    "directiveName": "gRevisionCompareComposition",
    "elementName": "g-revision-compare-composition",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-revision-compare].g-revision-compare",
    "cssSelector": ".g-revision-compare",
    "className": "g-revision-compare",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "wrap",
      "line-numbers"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-revision-toolbar",
      "g-revision-panels",
      "g-revision-panel",
      "g-diff",
      "g-diff-line",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "revision-compare",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "content-autosave-indicator",
    "exportName": "GContentAutosaveIndicatorDirective",
    "directiveName": "gContentAutosaveIndicator",
    "elementName": "g-content-autosave-indicator",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-autosave].g-autosave-indicator",
    "cssSelector": ".g-autosave-indicator",
    "className": "g-autosave-indicator",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "timeline",
      "compact-list"
    ],
    "states": [
      "dirty",
      "saving",
      "saved",
      "error",
      "loading",
      "empty",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-autosave-dot",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "autosave",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "content-outline",
    "exportName": "GContentOutlineDirective",
    "directiveName": "gContentOutline",
    "elementName": "g-content-outline",
    "category": "content",
    "type": "interactive",
    "selector": ".g-content-outline",
    "cssSelector": ".g-content-outline",
    "className": "g-content-outline",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "narrow",
      "wide"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-content-outline-item",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "editor-toolbar-composition",
    "exportName": "GEditorToolbarCompositionDirective",
    "directiveName": "gEditorToolbarComposition",
    "elementName": "g-editor-toolbar-composition",
    "category": "content",
    "type": "interactive",
    "selector": "[data-g-editor-shell] .g-editor-toolbar",
    "cssSelector": ".g-editor-toolbar",
    "className": "g-editor-toolbar",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "split",
      "source-only"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-editor-toolbar-group",
      "g-editor-tool",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "editor-shell",
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "find-replace",
    "exportName": "GFindReplaceDirective",
    "directiveName": "gFindReplace",
    "elementName": "g-find-replace",
    "category": "content",
    "type": "interactive",
    "selector": ".g-find-replace",
    "cssSelector": ".g-find-replace",
    "className": "g-find-replace",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "split",
      "source-only"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-find-replace-row",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "comment-thread-composition",
    "exportName": "GCommentThreadCompositionDirective",
    "directiveName": "gCommentThreadComposition",
    "elementName": "g-comment-thread-composition",
    "category": "content",
    "type": "interactive",
    "selector": ".g-comment-thread.g-content-comment-thread",
    "cssSelector": ".g-content-comment-thread",
    "className": "g-content-comment-thread",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "timeline",
      "compact-list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-comment",
      "g-comment-avatar",
      "g-comment-body",
      "g-comment-meta",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "version-history-composition",
    "exportName": "GVersionHistoryCompositionDirective",
    "directiveName": "gVersionHistoryComposition",
    "elementName": "g-version-history-composition",
    "category": "content",
    "type": "interactive",
    "selector": ".g-version-history",
    "cssSelector": ".g-version-history",
    "className": "g-version-history",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "timeline",
      "compact-list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-version-item",
      "g-version-dot",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "file-properties",
    "exportName": "GFilePropertiesDirective",
    "directiveName": "gFileProperties",
    "elementName": "g-file-properties",
    "category": "content",
    "type": "interactive",
    "selector": ".g-file-properties",
    "cssSelector": ".g-file-properties",
    "className": "g-file-properties",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "grid"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-file-property",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "storage-meter",
    "exportName": "GStorageMeterDirective",
    "directiveName": "gStorageMeter",
    "elementName": "g-storage-meter",
    "category": "content",
    "type": "interactive",
    "selector": ".g-storage-meter",
    "cssSelector": ".g-storage-meter",
    "className": "g-storage-meter",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "grid"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-storage-header",
      "g-storage-track",
      "g-storage-value",
      "g-storage-legend",
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "auth-centered",
    "exportName": "GAuthCenteredDirective",
    "directiveName": "gAuthCentered",
    "elementName": "g-auth-centered",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-auth-centered",
    "cssSelector": ".g-auth-centered",
    "className": "g-auth-centered",
    "tag": "div",
    "variants": [
      "default",
      "card",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-auth-container",
      "g-auth-panel",
      "g-auth-brand-row",
      "g-auth-header",
      "g-auth-form",
      "g-auth-footer"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "auth-split",
    "exportName": "GAuthSplitDirective",
    "directiveName": "gAuthSplit",
    "elementName": "g-auth-split",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-auth-split",
    "cssSelector": ".g-auth-split",
    "className": "g-auth-split",
    "tag": "div",
    "variants": [
      "default",
      "reversed",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-auth-split-aside",
      "g-auth-split-main",
      "g-auth-container",
      "g-auth-panel"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "sign-in-composition",
    "exportName": "GSignInCompositionDirective",
    "directiveName": "gSignInComposition",
    "elementName": "g-sign-in-composition",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-sign-in",
    "cssSelector": ".g-sign-in",
    "className": "g-sign-in",
    "tag": "div",
    "variants": [
      "password",
      "code",
      "providers"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-sign-in-options",
      "g-auth-provider-list",
      "g-auth-divider"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "registration-composition",
    "exportName": "GRegistrationCompositionDirective",
    "directiveName": "gRegistrationComposition",
    "elementName": "g-registration-composition",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-registration",
    "cssSelector": ".g-registration",
    "className": "g-registration",
    "tag": "div",
    "variants": [
      "default",
      "minimal",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-registration-terms",
      "g-password-strength"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "password-recovery",
    "exportName": "GPasswordRecoveryDirective",
    "directiveName": "gPasswordRecovery",
    "elementName": "g-password-recovery",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-password-recovery",
    "cssSelector": ".g-password-recovery",
    "className": "g-password-recovery",
    "tag": "div",
    "variants": [
      "email",
      "phone",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-password-recovery-methods",
      "g-auth-method"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "password-reset",
    "exportName": "GPasswordResetDirective",
    "directiveName": "gPasswordReset",
    "elementName": "g-password-reset",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-password-reset",
    "cssSelector": ".g-password-reset",
    "className": "g-password-reset",
    "tag": "div",
    "variants": [
      "default",
      "rules",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-password-strength",
      "g-password-rules"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "email-verification",
    "exportName": "GEmailVerificationDirective",
    "directiveName": "gEmailVerification",
    "elementName": "g-email-verification",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-email-verification",
    "cssSelector": ".g-email-verification",
    "className": "g-email-verification",
    "tag": "div",
    "variants": [
      "code",
      "link",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-verification-icon",
      "g-verification-address",
      "g-auth-timer"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "phone-verification",
    "exportName": "GPhoneVerificationDirective",
    "directiveName": "gPhoneVerification",
    "elementName": "g-phone-verification",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-phone-verification",
    "cssSelector": ".g-phone-verification",
    "className": "g-phone-verification",
    "tag": "div",
    "variants": [
      "numeric",
      "alphanumeric",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-verification-icon",
      "g-verification-address",
      "g-otp-input"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mfa-challenge",
    "exportName": "GMfaChallengeDirective",
    "directiveName": "gMfaChallenge",
    "elementName": "g-mfa-challenge",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-mfa-challenge",
    "cssSelector": ".g-mfa-challenge",
    "className": "g-mfa-challenge",
    "tag": "div",
    "variants": [
      "authenticator",
      "recovery",
      "setup"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mfa-methods",
      "g-otp-input",
      "g-trusted-device"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "otp-input",
    "exportName": "GOtpInputDirective",
    "directiveName": "gOtpInput",
    "elementName": "g-otp-input",
    "category": "auth",
    "type": "interactive",
    "selector": "[data-g-otp-input].g-otp-input",
    "cssSelector": ".g-otp-input",
    "className": "g-otp-input",
    "tag": "div",
    "variants": [
      "numeric",
      "alphanumeric",
      "grouped"
    ],
    "states": [
      "complete",
      "invalid",
      "disabled"
    ],
    "parts": [
      "g-otp-cell"
    ],
    "behaviors": [
      "otp-input",
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "passkey-composition",
    "exportName": "GPasskeyCompositionDirective",
    "directiveName": "gPasskeyComposition",
    "elementName": "g-passkey-composition",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-passkey",
    "cssSelector": ".g-passkey",
    "className": "g-passkey",
    "tag": "div",
    "variants": [
      "sign-in",
      "register",
      "manage"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-passkey-graphic",
      "g-passkey-device"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "sso-composition",
    "exportName": "GSsoCompositionDirective",
    "directiveName": "gSsoComposition",
    "elementName": "g-sso-composition",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-sso",
    "cssSelector": ".g-sso",
    "className": "g-sso",
    "tag": "div",
    "variants": [
      "providers",
      "domain",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-auth-provider-list",
      "g-auth-provider",
      "g-auth-provider-icon"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "qr-login",
    "exportName": "GQrLoginDirective",
    "directiveName": "gQrLogin",
    "elementName": "g-qr-login",
    "category": "auth",
    "type": "interactive",
    "selector": "[data-g-auth-timer].g-qr-login",
    "cssSelector": ".g-qr-login",
    "className": "g-qr-login",
    "tag": "div",
    "variants": [
      "waiting",
      "scanned",
      "expired"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-qr-login-layout",
      "g-qr-code",
      "g-auth-timer"
    ],
    "behaviors": [
      "auth-timer",
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "magic-link",
    "exportName": "GMagicLinkDirective",
    "directiveName": "gMagicLink",
    "elementName": "g-magic-link",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-magic-link",
    "cssSelector": ".g-magic-link",
    "className": "g-magic-link",
    "tag": "div",
    "variants": [
      "email",
      "sent",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-verification-icon",
      "g-verification-address"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "invitation-composition",
    "exportName": "GInvitationCompositionDirective",
    "directiveName": "gInvitationComposition",
    "elementName": "g-invitation-composition",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-invitation",
    "cssSelector": ".g-invitation",
    "className": "g-invitation",
    "tag": "div",
    "variants": [
      "default",
      "expired",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-invitation-details",
      "g-invitation-row",
      "g-invitation-label"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "first-time-setup",
    "exportName": "GFirstTimeSetupDirective",
    "directiveName": "gFirstTimeSetup",
    "elementName": "g-first-time-setup",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-first-time-setup",
    "cssSelector": ".g-first-time-setup",
    "className": "g-first-time-setup",
    "tag": "div",
    "variants": [
      "profile",
      "security",
      "steps"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-profile-setup",
      "g-password-strength"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "lock-screen",
    "exportName": "GLockScreenDirective",
    "directiveName": "gLockScreen",
    "elementName": "g-lock-screen",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-lock-screen",
    "cssSelector": ".g-lock-screen",
    "className": "g-lock-screen",
    "tag": "div",
    "variants": [
      "password",
      "pin",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-lock-screen-panel",
      "g-lock-screen-time",
      "g-auth-user"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "session-expired",
    "exportName": "GSessionExpiredDirective",
    "directiveName": "gSessionExpired",
    "elementName": "g-session-expired",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-session-expired",
    "cssSelector": ".g-session-expired",
    "className": "g-session-expired",
    "tag": "div",
    "variants": [
      "expired",
      "warning",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-session-expired-panel",
      "g-auth-notice"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "account-chooser",
    "exportName": "GAccountChooserDirective",
    "directiveName": "gAccountChooser",
    "elementName": "g-account-chooser",
    "category": "auth",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-account-chooser",
    "cssSelector": ".g-account-chooser",
    "className": "g-account-chooser",
    "tag": "div",
    "variants": [
      "cards",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-auth-choice-list",
      "g-auth-choice",
      "g-auth-avatar"
    ],
    "behaviors": [
      "saved-choice",
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tenant-chooser",
    "exportName": "GTenantChooserDirective",
    "directiveName": "gTenantChooser",
    "elementName": "g-tenant-chooser",
    "category": "auth",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-tenant-chooser",
    "cssSelector": ".g-tenant-chooser",
    "className": "g-tenant-chooser",
    "tag": "div",
    "variants": [
      "cards",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-auth-choice-list",
      "g-auth-choice"
    ],
    "behaviors": [
      "saved-choice",
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "identity-switcher",
    "exportName": "GIdentitySwitcherDirective",
    "directiveName": "gIdentitySwitcher",
    "elementName": "g-identity-switcher",
    "category": "auth",
    "type": "interactive",
    "selector": "[data-g-dropdown].g-identity-switcher",
    "cssSelector": ".g-identity-switcher",
    "className": "g-identity-switcher",
    "tag": "div",
    "variants": [
      "default",
      "expanded",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-identity-switcher-trigger",
      "g-identity-switcher-menu",
      "g-auth-choice"
    ],
    "behaviors": [
      "dropdown",
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "profile-setup",
    "exportName": "GProfileSetupDirective",
    "directiveName": "gProfileSetup",
    "elementName": "g-profile-setup",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-profile-setup",
    "cssSelector": ".g-profile-setup",
    "className": "g-profile-setup",
    "tag": "div",
    "variants": [
      "default",
      "avatar",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-auth-avatar",
      "g-auth-form",
      "g-auth-actions"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "account-security",
    "exportName": "GAccountSecurityDirective",
    "directiveName": "gAccountSecurity",
    "elementName": "g-account-security",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-account-security",
    "cssSelector": ".g-account-security",
    "className": "g-account-security",
    "tag": "div",
    "variants": [
      "default",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-security-section",
      "g-security-section-header"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "device-management",
    "exportName": "GDeviceManagementDirective",
    "directiveName": "gDeviceManagement",
    "elementName": "g-device-management",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-device-management",
    "cssSelector": ".g-device-management",
    "className": "g-device-management",
    "tag": "div",
    "variants": [
      "list",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-device-item",
      "g-device-icon",
      "g-device-main",
      "g-device-current"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "login-activity",
    "exportName": "GLoginActivityDirective",
    "directiveName": "gLoginActivity",
    "elementName": "g-login-activity",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-login-activity",
    "cssSelector": ".g-login-activity",
    "className": "g-login-activity",
    "tag": "div",
    "variants": [
      "list",
      "table",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-login-event",
      "g-login-event-icon",
      "g-login-event-main"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "security-alert",
    "exportName": "GSecurityAlertDirective",
    "directiveName": "gSecurityAlert",
    "elementName": "g-security-alert",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-security-alert",
    "cssSelector": ".g-security-alert",
    "className": "g-security-alert",
    "tag": "div",
    "variants": [
      "warning",
      "error",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-security-alert-icon",
      "g-security-alert-actions"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "recovery-codes",
    "exportName": "GRecoveryCodesDirective",
    "directiveName": "gRecoveryCodes",
    "elementName": "g-recovery-codes",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-recovery-codes",
    "cssSelector": ".g-recovery-codes",
    "className": "g-recovery-codes",
    "tag": "div",
    "variants": [
      "hidden",
      "grid",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-recovery-code-grid",
      "g-recovery-code"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "trusted-device",
    "exportName": "GTrustedDeviceDirective",
    "directiveName": "gTrustedDevice",
    "elementName": "g-trusted-device",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-trusted-device",
    "cssSelector": ".g-trusted-device",
    "className": "g-trusted-device",
    "tag": "div",
    "variants": [
      "default",
      "card",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "connected-accounts",
    "exportName": "GConnectedAccountsDirective",
    "directiveName": "gConnectedAccounts",
    "elementName": "g-connected-accounts",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-connected-accounts",
    "cssSelector": ".g-connected-accounts",
    "className": "g-connected-accounts",
    "tag": "div",
    "variants": [
      "list",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-connected-account",
      "g-connected-account-icon",
      "g-connected-account-main"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "password-strength",
    "exportName": "GPasswordStrengthDirective",
    "directiveName": "gPasswordStrength",
    "elementName": "g-password-strength",
    "category": "auth",
    "type": "interactive",
    "selector": "[data-g-password-strength].g-password-strength",
    "cssSelector": ".g-password-strength",
    "className": "g-password-strength",
    "tag": "div",
    "variants": [
      "rules",
      "meter",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-password-strength-header",
      "g-password-strength-meter",
      "g-password-strength-value",
      "g-password-rules",
      "g-password-rule"
    ],
    "behaviors": [
      "password-strength",
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "auth-consent",
    "exportName": "GAuthConsentDirective",
    "directiveName": "gAuthConsent",
    "elementName": "g-auth-consent",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-auth-consent",
    "cssSelector": ".g-auth-consent",
    "className": "g-auth-consent",
    "tag": "div",
    "variants": [
      "default",
      "scopes",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-auth-consent-scopes",
      "g-auth-consent-scope"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "auth-result",
    "exportName": "GAuthResultDirective",
    "directiveName": "gAuthResult",
    "elementName": "g-auth-result",
    "category": "auth",
    "type": "interactive",
    "selector": ".g-auth-result",
    "cssSelector": ".g-auth-result",
    "className": "g-auth-result",
    "tag": "div",
    "variants": [
      "success",
      "error",
      "pending"
    ],
    "states": [
      "success",
      "error",
      "pending",
      "disabled"
    ],
    "parts": [
      "g-auth-result-icon",
      "g-auth-status"
    ],
    "behaviors": [
      "auth"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-product-card",
    "exportName": "GCommerceProductCardDirective",
    "directiveName": "gCommerceProductCard",
    "elementName": "g-commerce-product-card",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-commerce-product-card",
    "cssSelector": ".g-commerce-product-card",
    "className": "g-commerce-product-card",
    "tag": "div",
    "variants": [
      "default",
      "horizontal",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-product-media",
      "g-product-card-badge",
      "g-product-card-body",
      "g-product-card-actions"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-product-list",
    "exportName": "GCommerceProductListDirective",
    "directiveName": "gCommerceProductList",
    "elementName": "g-commerce-product-list",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-commerce-product-list",
    "cssSelector": ".g-commerce-product-list",
    "className": "g-commerce-product-list",
    "tag": "div",
    "variants": [
      "list",
      "grid",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-product-list-item",
      "g-product-list-media",
      "g-product-list-main",
      "g-product-list-action"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-product-detail",
    "exportName": "GCommerceProductDetailDirective",
    "directiveName": "gCommerceProductDetail",
    "elementName": "g-commerce-product-detail",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-commerce-product-detail",
    "cssSelector": ".g-commerce-product-detail",
    "className": "g-commerce-product-detail",
    "tag": "div",
    "variants": [
      "default",
      "split",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-product-detail-summary",
      "g-product-detail-title",
      "g-product-vendor",
      "g-product-sku"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-product-gallery",
    "exportName": "GCommerceProductGalleryDirective",
    "directiveName": "gCommerceProductGallery",
    "elementName": "g-commerce-product-gallery",
    "category": "commerce",
    "type": "interactive",
    "selector": "[data-g-carousel].g-commerce-product-gallery",
    "cssSelector": ".g-commerce-product-gallery",
    "className": "g-commerce-product-gallery",
    "tag": "div",
    "variants": [
      "thumbnails",
      "horizontal",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-product-gallery-thumbs",
      "g-product-gallery-thumb",
      "g-product-gallery-stage"
    ],
    "behaviors": [
      "carousel",
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "sku-selector",
    "exportName": "GSkuSelectorDirective",
    "directiveName": "gSkuSelector",
    "elementName": "g-sku-selector",
    "category": "commerce",
    "type": "interactive",
    "selector": "[data-g-sku-selector].g-sku-selector",
    "cssSelector": ".g-sku-selector",
    "className": "g-sku-selector",
    "tag": "div",
    "variants": [
      "buttons",
      "select",
      "compact"
    ],
    "states": [
      "incomplete",
      "complete",
      "disabled"
    ],
    "parts": [
      "g-sku-group",
      "g-sku-options",
      "g-sku-option",
      "g-sku-selection"
    ],
    "behaviors": [
      "sku-selector",
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-quantity-stepper",
    "exportName": "GCommerceQuantityStepperDirective",
    "directiveName": "gCommerceQuantityStepper",
    "elementName": "g-commerce-quantity-stepper",
    "category": "commerce",
    "type": "interactive",
    "selector": "[data-g-quantity-stepper].g-quantity-stepper",
    "cssSelector": ".g-quantity-stepper",
    "className": "g-quantity-stepper",
    "tag": "div",
    "variants": [
      "default",
      "inline",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-quantity-button",
      "g-quantity-input"
    ],
    "behaviors": [
      "quantity-stepper",
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "price-display",
    "exportName": "GPriceDisplayDirective",
    "directiveName": "gPriceDisplay",
    "elementName": "g-price-display",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-price-display",
    "cssSelector": ".g-price-display",
    "className": "g-price-display",
    "tag": "div",
    "variants": [
      "default",
      "sale",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-price-current",
      "g-price-original",
      "g-price-discount",
      "g-price-note"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-cart-item",
    "exportName": "GCommerceCartItemDirective",
    "directiveName": "gCommerceCartItem",
    "elementName": "g-commerce-cart-item",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-commerce-cart-item",
    "cssSelector": ".g-commerce-cart-item",
    "className": "g-commerce-cart-item",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "readonly"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-cart-item-media",
      "g-cart-item-main",
      "g-cart-item-side",
      "g-cart-item-actions"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-cart",
    "exportName": "GCommerceCartDirective",
    "directiveName": "gCommerceCart",
    "elementName": "g-commerce-cart",
    "category": "commerce",
    "type": "interactive",
    "selector": "[data-g-cart].g-cart",
    "cssSelector": ".g-cart",
    "className": "g-cart",
    "tag": "div",
    "variants": [
      "default",
      "selectable",
      "compact"
    ],
    "states": [
      "default",
      "empty",
      "disabled"
    ],
    "parts": [
      "g-commerce-cart-item",
      "g-cart-empty"
    ],
    "behaviors": [
      "cart",
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mini-cart",
    "exportName": "GMiniCartDirective",
    "directiveName": "gMiniCart",
    "elementName": "g-mini-cart",
    "category": "commerce",
    "type": "interactive",
    "selector": "[data-g-dropdown].g-mini-cart",
    "cssSelector": ".g-mini-cart",
    "className": "g-mini-cart",
    "tag": "div",
    "variants": [
      "default",
      "expanded",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mini-cart-list",
      "g-mini-cart-item",
      "g-mini-cart-footer"
    ],
    "behaviors": [
      "dropdown",
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "cart-summary",
    "exportName": "GCartSummaryDirective",
    "directiveName": "gCartSummary",
    "elementName": "g-cart-summary",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-cart-summary",
    "cssSelector": ".g-cart-summary",
    "className": "g-cart-summary",
    "tag": "div",
    "variants": [
      "default",
      "detailed",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-cart-summary-row",
      "g-cart-summary-total"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-checkout",
    "exportName": "GCommerceCheckoutDirective",
    "directiveName": "gCommerceCheckout",
    "elementName": "g-commerce-checkout",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-commerce-checkout",
    "cssSelector": ".g-commerce-checkout",
    "className": "g-commerce-checkout",
    "tag": "div",
    "variants": [
      "default",
      "steps",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-checkout-main",
      "g-checkout-section",
      "g-checkout-sidebar",
      "g-checkout-mobile-actions"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-checkout-steps",
    "exportName": "GCommerceCheckoutStepsDirective",
    "directiveName": "gCommerceCheckoutSteps",
    "elementName": "g-commerce-checkout-steps",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-checkout-steps",
    "cssSelector": ".g-checkout-steps",
    "className": "g-checkout-steps",
    "tag": "div",
    "variants": [
      "horizontal",
      "vertical",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-checkout-step",
      "g-checkout-step-marker"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "address-selector",
    "exportName": "GAddressSelectorDirective",
    "directiveName": "gAddressSelector",
    "elementName": "g-address-selector",
    "category": "commerce",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-address-selector",
    "cssSelector": ".g-address-selector",
    "className": "g-address-selector",
    "tag": "div",
    "variants": [
      "cards",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-address-card",
      "g-address-main",
      "g-address-meta"
    ],
    "behaviors": [
      "saved-choice",
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "address-card",
    "exportName": "GAddressCardDirective",
    "directiveName": "gAddressCard",
    "elementName": "g-address-card",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-address-card",
    "cssSelector": ".g-address-card",
    "className": "g-address-card",
    "tag": "div",
    "variants": [
      "default",
      "editable",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-address-main",
      "g-address-meta"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "shipping-method",
    "exportName": "GShippingMethodDirective",
    "directiveName": "gShippingMethod",
    "elementName": "g-shipping-method",
    "category": "commerce",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-shipping-method",
    "cssSelector": ".g-shipping-method",
    "className": "g-shipping-method",
    "tag": "div",
    "variants": [
      "cards",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-shipping-option",
      "g-shipping-main",
      "g-shipping-price"
    ],
    "behaviors": [
      "saved-choice",
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "pickup-selector",
    "exportName": "GPickupSelectorDirective",
    "directiveName": "gPickupSelector",
    "elementName": "g-pickup-selector",
    "category": "commerce",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-pickup-selector",
    "cssSelector": ".g-pickup-selector",
    "className": "g-pickup-selector",
    "tag": "div",
    "variants": [
      "cards",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-pickup-option",
      "g-pickup-main",
      "g-pickup-meta"
    ],
    "behaviors": [
      "saved-choice",
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "coupon",
    "exportName": "GCouponDirective",
    "directiveName": "gCoupon",
    "elementName": "g-coupon",
    "category": "commerce",
    "type": "interactive",
    "selector": "[data-g-coupon].g-coupon",
    "cssSelector": ".g-coupon",
    "className": "g-coupon",
    "tag": "div",
    "variants": [
      "default",
      "inline",
      "compact"
    ],
    "states": [
      "idle",
      "applied",
      "invalid",
      "disabled"
    ],
    "parts": [
      "g-coupon-row",
      "g-coupon-status"
    ],
    "behaviors": [
      "coupon",
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "promotion-list",
    "exportName": "GPromotionListDirective",
    "directiveName": "gPromotionList",
    "elementName": "g-promotion-list",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-promotion-list",
    "cssSelector": ".g-promotion-list",
    "className": "g-promotion-list",
    "tag": "div",
    "variants": [
      "default",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-promotion-item",
      "g-promotion-code"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "invoice-information",
    "exportName": "GInvoiceInformationDirective",
    "directiveName": "gInvoiceInformation",
    "elementName": "g-invoice-information",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-invoice-information",
    "cssSelector": ".g-invoice-information",
    "className": "g-invoice-information",
    "tag": "div",
    "variants": [
      "personal",
      "business",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-invoice-type",
      "g-invoice-fields"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "payment-method",
    "exportName": "GPaymentMethodDirective",
    "directiveName": "gPaymentMethod",
    "elementName": "g-payment-method",
    "category": "commerce",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-payment-method",
    "cssSelector": ".g-payment-method",
    "className": "g-payment-method",
    "tag": "div",
    "variants": [
      "cards",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-payment-option",
      "g-payment-brand",
      "g-payment-main"
    ],
    "behaviors": [
      "saved-choice",
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "payment-sheet",
    "exportName": "GPaymentSheetDirective",
    "directiveName": "gPaymentSheet",
    "elementName": "g-payment-sheet",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-payment-sheet",
    "cssSelector": ".g-payment-sheet",
    "className": "g-payment-sheet",
    "tag": "div",
    "variants": [
      "default",
      "summary",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-payment-sheet-total"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "payment-result",
    "exportName": "GPaymentResultDirective",
    "directiveName": "gPaymentResult",
    "elementName": "g-payment-result",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-payment-result",
    "cssSelector": ".g-payment-result",
    "className": "g-payment-result",
    "tag": "div",
    "variants": [
      "success",
      "error",
      "pending"
    ],
    "states": [
      "success",
      "error",
      "pending",
      "disabled"
    ],
    "parts": [
      "g-payment-result-icon",
      "g-payment-result-actions"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-order-summary",
    "exportName": "GCommerceOrderSummaryDirective",
    "directiveName": "gCommerceOrderSummary",
    "elementName": "g-commerce-order-summary",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-commerce-order-summary",
    "cssSelector": ".g-commerce-order-summary",
    "className": "g-commerce-order-summary",
    "tag": "div",
    "variants": [
      "default",
      "detailed",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-order-summary-row",
      "g-order-summary-total"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-order-timeline",
    "exportName": "GCommerceOrderTimelineDirective",
    "directiveName": "gCommerceOrderTimeline",
    "elementName": "g-commerce-order-timeline",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-commerce-order-timeline",
    "cssSelector": ".g-commerce-order-timeline",
    "className": "g-commerce-order-timeline",
    "tag": "div",
    "variants": [
      "vertical",
      "horizontal",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-order-timeline-item",
      "g-order-timeline-dot",
      "g-order-timeline-content"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "order-detail",
    "exportName": "GOrderDetailDirective",
    "directiveName": "gOrderDetail",
    "elementName": "g-order-detail",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-order-detail",
    "cssSelector": ".g-order-detail",
    "className": "g-order-detail",
    "tag": "div",
    "variants": [
      "default",
      "split",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-order-detail-header",
      "g-order-detail-section"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "subscription-plan",
    "exportName": "GSubscriptionPlanDirective",
    "directiveName": "gSubscriptionPlan",
    "elementName": "g-subscription-plan",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-subscription-plan",
    "cssSelector": ".g-subscription-plan",
    "className": "g-subscription-plan",
    "tag": "div",
    "variants": [
      "default",
      "featured",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-plan-price",
      "g-plan-price-value",
      "g-plan-features"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "pricing-comparison",
    "exportName": "GPricingComparisonDirective",
    "directiveName": "gPricingComparison",
    "elementName": "g-pricing-comparison",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-pricing-comparison",
    "cssSelector": ".g-pricing-comparison",
    "className": "g-pricing-comparison",
    "tag": "div",
    "variants": [
      "table",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "commerce-usage-meter",
    "exportName": "GCommerceUsageMeterDirective",
    "directiveName": "gCommerceUsageMeter",
    "elementName": "g-commerce-usage-meter",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-commerce-usage-meter",
    "cssSelector": ".g-commerce-usage-meter",
    "className": "g-commerce-usage-meter",
    "tag": "div",
    "variants": [
      "bar",
      "segmented",
      "compact"
    ],
    "states": [
      "default",
      "warning",
      "danger",
      "disabled"
    ],
    "parts": [
      "g-usage-meter-header",
      "g-usage-meter-track",
      "g-usage-meter-value"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "billing-history",
    "exportName": "GBillingHistoryDirective",
    "directiveName": "gBillingHistory",
    "elementName": "g-billing-history",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-billing-history",
    "cssSelector": ".g-billing-history",
    "className": "g-billing-history",
    "tag": "div",
    "variants": [
      "table",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-billing-history-header",
      "g-billing-history-item"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "refund-status",
    "exportName": "GRefundStatusDirective",
    "directiveName": "gRefundStatus",
    "elementName": "g-refund-status",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-refund-status",
    "cssSelector": ".g-refund-status",
    "className": "g-refund-status",
    "tag": "div",
    "variants": [
      "pending",
      "success",
      "error"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-refund-status-header",
      "g-refund-status-progress",
      "g-refund-status-step"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tax-summary",
    "exportName": "GTaxSummaryDirective",
    "directiveName": "gTaxSummary",
    "elementName": "g-tax-summary",
    "category": "commerce",
    "type": "interactive",
    "selector": ".g-tax-summary",
    "cssSelector": ".g-tax-summary",
    "className": "g-tax-summary",
    "tag": "div",
    "variants": [
      "default",
      "inclusive",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-tax-summary-row"
    ],
    "behaviors": [
      "commerce"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-safe-shell",
    "exportName": "GMobileSafeShellDirective",
    "directiveName": "gMobileSafeShell",
    "elementName": "g-mobile-safe-shell",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-safe-shell",
    "cssSelector": ".g-mobile-safe-shell",
    "className": "g-mobile-safe-shell",
    "tag": "div",
    "variants": [
      "contained",
      "fullscreen",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-safe-content"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "mobile",
      "pwa",
      "desktop-webview"
    ]
  },
  {
    "name": "mobile-app-bar",
    "exportName": "GMobileAppBarDirective",
    "directiveName": "gMobileAppBar",
    "elementName": "g-mobile-app-bar",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-app-bar",
    "cssSelector": ".g-mobile-app-bar",
    "className": "g-mobile-app-bar",
    "tag": "div",
    "variants": [
      "standard",
      "large",
      "search"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-app-bar-start",
      "g-mobile-app-bar-title",
      "g-mobile-app-bar-actions"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-bottom-navigation",
    "exportName": "GMobileBottomNavigationDirective",
    "directiveName": "gMobileBottomNavigation",
    "elementName": "g-mobile-bottom-navigation",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-bottom-navigation",
    "cssSelector": ".g-mobile-bottom-navigation",
    "className": "g-mobile-bottom-navigation",
    "tag": "div",
    "variants": [
      "labels",
      "badges",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-bottom-navigation-item"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-bottom-sheet",
    "exportName": "GMobileBottomSheetDirective",
    "directiveName": "gMobileBottomSheet",
    "elementName": "g-mobile-bottom-sheet",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-mobile-sheet].g-mobile-bottom-sheet",
    "cssSelector": ".g-mobile-bottom-sheet",
    "className": "g-mobile-bottom-sheet",
    "tag": "div",
    "variants": [
      "standard",
      "snap",
      "full"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-sheet-panel",
      "g-mobile-sheet-handle",
      "g-mobile-sheet-header",
      "g-mobile-sheet-footer"
    ],
    "behaviors": [
      "mobile-sheet",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-action-sheet",
    "exportName": "GMobileActionSheetDirective",
    "directiveName": "gMobileActionSheet",
    "elementName": "g-mobile-action-sheet",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-mobile-sheet].g-mobile-action-sheet",
    "cssSelector": ".g-mobile-action-sheet",
    "className": "g-mobile-action-sheet",
    "tag": "div",
    "variants": [
      "list",
      "grid",
      "destructive"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-action-list",
      "g-mobile-action-item"
    ],
    "behaviors": [
      "mobile-sheet",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-pull-refresh",
    "exportName": "GMobilePullRefreshDirective",
    "directiveName": "gMobilePullRefresh",
    "elementName": "g-mobile-pull-refresh",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-pull-refresh].g-mobile-pull-refresh",
    "cssSelector": ".g-mobile-pull-refresh",
    "className": "g-mobile-pull-refresh",
    "tag": "div",
    "variants": [
      "standard",
      "compact",
      "manual"
    ],
    "states": [
      "pulling",
      "refreshing",
      "disabled"
    ],
    "parts": [
      "g-mobile-pull-refresh-indicator",
      "g-mobile-pull-refresh-content"
    ],
    "behaviors": [
      "pull-refresh",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-infinite-load",
    "exportName": "GMobileInfiniteLoadDirective",
    "directiveName": "gMobileInfiniteLoad",
    "elementName": "g-mobile-infinite-load",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-infinite-load].g-mobile-infinite-load",
    "cssSelector": ".g-mobile-infinite-load",
    "className": "g-mobile-infinite-load",
    "tag": "div",
    "variants": [
      "automatic",
      "manual",
      "finished"
    ],
    "states": [
      "loading",
      "done",
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "infinite-load",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-swipe-actions",
    "exportName": "GMobileSwipeActionsDirective",
    "directiveName": "gMobileSwipeActions",
    "elementName": "g-mobile-swipe-actions",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-swipe-actions].g-mobile-swipe-actions",
    "cssSelector": ".g-mobile-swipe-actions",
    "className": "g-mobile-swipe-actions",
    "tag": "div",
    "variants": [
      "end",
      "both",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-swipe-actions-track",
      "g-mobile-swipe-actions-main",
      "g-mobile-swipe-actions-buttons",
      "g-mobile-swipe-action"
    ],
    "behaviors": [
      "swipe-actions",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-swipe-tabs",
    "exportName": "GMobileSwipeTabsDirective",
    "directiveName": "gMobileSwipeTabs",
    "elementName": "g-mobile-swipe-tabs",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-tabs].g-mobile-swipe-tabs",
    "cssSelector": ".g-mobile-swipe-tabs",
    "className": "g-mobile-swipe-tabs",
    "tag": "div",
    "variants": [
      "line",
      "pills",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-swipe-tab"
    ],
    "behaviors": [
      "tabs",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-category-view",
    "exportName": "GMobileCategoryViewDirective",
    "directiveName": "gMobileCategoryView",
    "elementName": "g-mobile-category-view",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-category-view",
    "cssSelector": ".g-mobile-category-view",
    "className": "g-mobile-category-view",
    "tag": "div",
    "variants": [
      "rail",
      "grid",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-category-rail",
      "g-mobile-category-link",
      "g-mobile-category-content",
      "g-mobile-category-grid",
      "g-mobile-category-item"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-filter-sheet",
    "exportName": "GMobileFilterSheetDirective",
    "directiveName": "gMobileFilterSheet",
    "elementName": "g-mobile-filter-sheet",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-mobile-sheet].g-mobile-filter-sheet",
    "cssSelector": ".g-mobile-filter-sheet",
    "className": "g-mobile-filter-sheet",
    "tag": "div",
    "variants": [
      "single",
      "multiple",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-sheet-panel",
      "g-mobile-sheet-footer"
    ],
    "behaviors": [
      "mobile-sheet",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-purchase-bar",
    "exportName": "GMobilePurchaseBarDirective",
    "directiveName": "gMobilePurchaseBar",
    "elementName": "g-mobile-purchase-bar",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-purchase-bar",
    "cssSelector": ".g-mobile-purchase-bar",
    "className": "g-mobile-purchase-bar",
    "tag": "div",
    "variants": [
      "standard",
      "quantity",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-purchase-main",
      "g-mobile-purchase-actions"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-search",
    "exportName": "GMobileSearchDirective",
    "directiveName": "gMobileSearch",
    "elementName": "g-mobile-search",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-clear-input].g-mobile-search",
    "cssSelector": ".g-mobile-search",
    "className": "g-mobile-search",
    "tag": "div",
    "variants": [
      "suggestions",
      "history",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-search-field",
      "g-mobile-search-icon"
    ],
    "behaviors": [
      "clear-input",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-picker",
    "exportName": "GMobilePickerDirective",
    "directiveName": "gMobilePicker",
    "elementName": "g-mobile-picker",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-mobile-picker",
    "cssSelector": ".g-mobile-picker",
    "className": "g-mobile-picker",
    "tag": "div",
    "variants": [
      "single",
      "multiple",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-picker-grid",
      "g-mobile-picker-option"
    ],
    "behaviors": [
      "saved-choice",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-wheel-picker",
    "exportName": "GMobileWheelPickerDirective",
    "directiveName": "gMobileWheelPicker",
    "elementName": "g-mobile-wheel-picker",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-wheel-picker].g-mobile-wheel-picker",
    "cssSelector": ".g-mobile-wheel-picker",
    "className": "g-mobile-wheel-picker",
    "tag": "div",
    "variants": [
      "wheel",
      "native",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-wheel-column",
      "g-mobile-wheel-option"
    ],
    "behaviors": [
      "wheel-picker",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-fab",
    "exportName": "GMobileFabDirective",
    "directiveName": "gMobileFab",
    "elementName": "g-mobile-fab",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-fab",
    "cssSelector": ".g-mobile-fab",
    "className": "g-mobile-fab",
    "tag": "div",
    "variants": [
      "single",
      "extended",
      "menu"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-fullscreen-dialog",
    "exportName": "GMobileFullscreenDialogDirective",
    "directiveName": "gMobileFullscreenDialog",
    "elementName": "g-mobile-fullscreen-dialog",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-dialog].g-mobile-fullscreen-dialog",
    "cssSelector": ".g-mobile-fullscreen-dialog",
    "className": "g-mobile-fullscreen-dialog",
    "tag": "div",
    "variants": [
      "standard",
      "form",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "dialog",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-keyboard-avoidance",
    "exportName": "GMobileKeyboardAvoidanceDirective",
    "directiveName": "gMobileKeyboardAvoidance",
    "elementName": "g-mobile-keyboard-avoidance",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-keyboard-avoidance",
    "cssSelector": ".g-mobile-keyboard-avoidance",
    "className": "g-mobile-keyboard-avoidance",
    "tag": "div",
    "variants": [
      "form",
      "chat",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-gesture-hint",
    "exportName": "GMobileGestureHintDirective",
    "directiveName": "gMobileGestureHint",
    "elementName": "g-mobile-gesture-hint",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-gesture-hint",
    "cssSelector": ".g-mobile-gesture-hint",
    "className": "g-mobile-gesture-hint",
    "tag": "div",
    "variants": [
      "swipe",
      "pull",
      "home"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-gesture-hint-line"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-offline-banner",
    "exportName": "GMobileOfflineBannerDirective",
    "directiveName": "gMobileOfflineBanner",
    "elementName": "g-mobile-offline-banner",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-offline-banner",
    "cssSelector": ".g-mobile-offline-banner",
    "className": "g-mobile-offline-banner",
    "tag": "div",
    "variants": [
      "automatic",
      "offline",
      "online"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-segmented-control",
    "exportName": "GMobileSegmentedControlDirective",
    "directiveName": "gMobileSegmentedControl",
    "elementName": "g-mobile-segmented-control",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-saved-choice].g-mobile-segmented-control",
    "cssSelector": ".g-mobile-segmented-control",
    "className": "g-mobile-segmented-control",
    "tag": "div",
    "variants": [
      "standard",
      "icons",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-segmented-item"
    ],
    "behaviors": [
      "saved-choice",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-feed",
    "exportName": "GMobileFeedDirective",
    "directiveName": "gMobileFeed",
    "elementName": "g-mobile-feed",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-feed",
    "cssSelector": ".g-mobile-feed",
    "className": "g-mobile-feed",
    "tag": "div",
    "variants": [
      "list",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-feed-item",
      "g-mobile-feed-main"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-card-carousel",
    "exportName": "GMobileCardCarouselDirective",
    "directiveName": "gMobileCardCarousel",
    "elementName": "g-mobile-card-carousel",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-carousel].g-mobile-card-carousel",
    "cssSelector": ".g-mobile-card-carousel",
    "className": "g-mobile-card-carousel",
    "tag": "div",
    "variants": [
      "cards",
      "dots",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-carousel-dot",
      "g-carousel-control"
    ],
    "behaviors": [
      "carousel",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-form",
    "exportName": "GMobileFormDirective",
    "directiveName": "gMobileForm",
    "elementName": "g-mobile-form",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-form",
    "cssSelector": ".g-mobile-form",
    "className": "g-mobile-form",
    "tag": "div",
    "variants": [
      "stacked",
      "inline",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-form-actions"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-auth",
    "exportName": "GMobileAuthDirective",
    "directiveName": "gMobileAuth",
    "elementName": "g-mobile-auth",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-password-toggle].g-mobile-auth",
    "cssSelector": ".g-mobile-auth",
    "className": "g-mobile-auth",
    "tag": "div",
    "variants": [
      "password",
      "code",
      "register"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-auth-actions"
    ],
    "behaviors": [
      "password-toggle",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-checkout",
    "exportName": "GMobileCheckoutDirective",
    "directiveName": "gMobileCheckout",
    "elementName": "g-mobile-checkout",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-checkout",
    "cssSelector": ".g-mobile-checkout",
    "className": "g-mobile-checkout",
    "tag": "div",
    "variants": [
      "standard",
      "steps",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-checkout-actions",
      "g-mobile-checkout-summary"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-media-viewer",
    "exportName": "GMobileMediaViewerDirective",
    "directiveName": "gMobileMediaViewer",
    "elementName": "g-mobile-media-viewer",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-dialog].g-mobile-media-viewer",
    "cssSelector": ".g-mobile-media-viewer",
    "className": "g-mobile-media-viewer",
    "tag": "div",
    "variants": [
      "image",
      "gallery",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-media-viewer-stage",
      "g-mobile-media-viewer-tools"
    ],
    "behaviors": [
      "dialog",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-keyboard-toolbar",
    "exportName": "GMobileKeyboardToolbarDirective",
    "directiveName": "gMobileKeyboardToolbar",
    "elementName": "g-mobile-keyboard-toolbar",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-keyboard-toolbar",
    "cssSelector": ".g-mobile-keyboard-toolbar",
    "className": "g-mobile-keyboard-toolbar",
    "tag": "div",
    "variants": [
      "navigation",
      "actions",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-selection-mode",
    "exportName": "GMobileSelectionModeDirective",
    "directiveName": "gMobileSelectionMode",
    "elementName": "g-mobile-selection-mode",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-row-select].g-mobile-selection-mode",
    "cssSelector": ".g-mobile-selection-mode",
    "className": "g-mobile-selection-mode",
    "tag": "div",
    "variants": [
      "standard",
      "multiple",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-selection-main",
      "g-mobile-selection-actions"
    ],
    "behaviors": [
      "row-select",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-snackbar",
    "exportName": "GMobileSnackbarDirective",
    "directiveName": "gMobileSnackbar",
    "elementName": "g-mobile-snackbar",
    "category": "mobile",
    "type": "interactive",
    "selector": "[data-g-toast].g-mobile-snackbar",
    "cssSelector": ".g-mobile-snackbar",
    "className": "g-mobile-snackbar",
    "tag": "div",
    "variants": [
      "standard",
      "action",
      "persistent"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-snackbar-main"
    ],
    "behaviors": [
      "toast",
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-permission-prompt",
    "exportName": "GMobilePermissionPromptDirective",
    "directiveName": "gMobilePermissionPrompt",
    "elementName": "g-mobile-permission-prompt",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-permission-prompt",
    "cssSelector": ".g-mobile-permission-prompt",
    "className": "g-mobile-permission-prompt",
    "tag": "div",
    "variants": [
      "location",
      "camera",
      "notifications"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-mobile-permission-icon",
      "g-mobile-permission-actions"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "mobile-state",
    "exportName": "GMobileStateDirective",
    "directiveName": "gMobileState",
    "elementName": "g-mobile-state",
    "category": "mobile",
    "type": "interactive",
    "selector": ".g-mobile-state",
    "cssSelector": ".g-mobile-state",
    "className": "g-mobile-state",
    "tag": "div",
    "variants": [
      "empty",
      "error",
      "loading"
    ],
    "states": [
      "empty",
      "error",
      "offline",
      "success",
      "disabled"
    ],
    "parts": [
      "g-mobile-state-icon",
      "g-mobile-state-actions"
    ],
    "behaviors": [
      "mobile"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-native-titlebar",
    "exportName": "GDesktopNativeTitlebarDirective",
    "directiveName": "gDesktopNativeTitlebar",
    "elementName": "g-desktop-native-titlebar",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-native-titlebar",
    "cssSelector": ".g-native-titlebar",
    "className": "g-native-titlebar",
    "tag": "div",
    "variants": [
      "windows",
      "macos",
      "compact",
      "centered"
    ],
    "states": [
      "normal",
      "focused",
      "unfocused",
      "maximized",
      "disabled"
    ],
    "parts": [
      "g-native-titlebar-start",
      "g-native-titlebar-title",
      "g-native-titlebar-end"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "tauri",
      "electron"
    ]
  },
  {
    "name": "desktop-window-controls-composition",
    "exportName": "GDesktopWindowControlsCompositionDirective",
    "directiveName": "gDesktopWindowControlsComposition",
    "elementName": "g-desktop-window-controls-composition",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-window-controls",
    "cssSelector": ".g-desktop-window-controls",
    "className": "g-desktop-window-controls",
    "tag": "div",
    "variants": [
      "windows",
      "macos",
      "compact",
      "vertical"
    ],
    "states": [
      "minimize",
      "maximize",
      "restore",
      "close",
      "disabled"
    ],
    "parts": [
      "g-desktop-window-button"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "tauri",
      "electron"
    ]
  },
  {
    "name": "desktop-menubar-composition",
    "exportName": "GDesktopMenubarCompositionDirective",
    "directiveName": "gDesktopMenubarComposition",
    "elementName": "g-desktop-menubar-composition",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-roving-nav].g-desktop-menubar",
    "cssSelector": ".g-desktop-menubar",
    "className": "g-desktop-menubar",
    "tag": "div",
    "variants": [
      "standard",
      "compact",
      "icons",
      "overflow"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-menubar-item"
    ],
    "behaviors": [
      "roving-nav",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-activity-bar-composition",
    "exportName": "GDesktopActivityBarCompositionDirective",
    "directiveName": "gDesktopActivityBarComposition",
    "elementName": "g-desktop-activity-bar-composition",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-roving-nav].g-desktop-activity-bar",
    "cssSelector": ".g-desktop-activity-bar",
    "className": "g-desktop-activity-bar",
    "tag": "div",
    "variants": [
      "rail",
      "horizontal",
      "compact",
      "labels"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-activity-item"
    ],
    "behaviors": [
      "roving-nav",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-dock-panel",
    "exportName": "GDesktopDockPanelDirective",
    "directiveName": "gDesktopDockPanel",
    "elementName": "g-desktop-dock-panel",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-dock-panel",
    "cssSelector": ".g-desktop-dock-panel",
    "className": "g-desktop-dock-panel",
    "tag": "div",
    "variants": [
      "left",
      "right",
      "floating",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-panel-header",
      "g-desktop-panel-body"
    ],
    "behaviors": [
      "nav-toggle",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-split-pane",
    "exportName": "GDesktopSplitPaneDirective",
    "directiveName": "gDesktopSplitPane",
    "elementName": "g-desktop-split-pane",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-split-pane].g-desktop-split-pane",
    "cssSelector": ".g-desktop-split-pane",
    "className": "g-desktop-split-pane",
    "tag": "div",
    "variants": [
      "horizontal",
      "vertical",
      "balanced",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-split-panel",
      "g-split-handle"
    ],
    "behaviors": [
      "split-pane",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-inspector-panel",
    "exportName": "GDesktopInspectorPanelDirective",
    "directiveName": "gDesktopInspectorPanel",
    "elementName": "g-desktop-inspector-panel",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-inspector-panel",
    "cssSelector": ".g-desktop-inspector-panel",
    "className": "g-desktop-inspector-panel",
    "tag": "div",
    "variants": [
      "properties",
      "sections",
      "floating",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-panel-header",
      "g-desktop-panel-body"
    ],
    "behaviors": [
      "nav-toggle",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-status-bar",
    "exportName": "GDesktopStatusBarDirective",
    "directiveName": "gDesktopStatusBar",
    "elementName": "g-desktop-status-bar",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-status-bar",
    "cssSelector": ".g-desktop-status-bar",
    "className": "g-desktop-status-bar",
    "tag": "div",
    "variants": [
      "standard",
      "compact",
      "segmented",
      "subtle"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-status-group",
      "g-desktop-status-item"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-command-palette",
    "exportName": "GDesktopCommandPaletteDirective",
    "directiveName": "gDesktopCommandPalette",
    "elementName": "g-desktop-command-palette",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-command-palette].g-desktop-command-palette",
    "cssSelector": ".g-desktop-command-palette",
    "className": "g-desktop-command-palette",
    "tag": "div",
    "variants": [
      "commands",
      "grouped",
      "recent",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "command-palette",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "shortcut-recorder",
    "exportName": "GShortcutRecorderDirective",
    "directiveName": "gShortcutRecorder",
    "elementName": "g-shortcut-recorder",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-shortcut-recorder].g-shortcut-recorder",
    "cssSelector": ".g-shortcut-recorder",
    "className": "g-shortcut-recorder",
    "tag": "div",
    "variants": [
      "standard",
      "compact",
      "macos",
      "inline"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-shortcut-recorder-control",
      "g-shortcut-recorder-keys",
      "g-shortcut-recorder-status"
    ],
    "behaviors": [
      "shortcut-recorder",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-context-menu",
    "exportName": "GDesktopContextMenuDirective",
    "directiveName": "gDesktopContextMenu",
    "elementName": "g-desktop-context-menu",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-context-menu] .g-desktop-context-menu",
    "cssSelector": ".g-desktop-context-menu",
    "className": "g-desktop-context-menu",
    "tag": "div",
    "variants": [
      "standard",
      "grouped",
      "compact",
      "icons"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-menu-item",
      "g-desktop-menu-separator"
    ],
    "behaviors": [
      "context-menu",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-document-tabs",
    "exportName": "GDesktopDocumentTabsDirective",
    "directiveName": "gDesktopDocumentTabs",
    "elementName": "g-desktop-document-tabs",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-desktop-tabs].g-desktop-document-tabs",
    "cssSelector": ".g-desktop-document-tabs",
    "className": "g-desktop-document-tabs",
    "tag": "div",
    "variants": [
      "standard",
      "compact",
      "pills",
      "underline"
    ],
    "states": [
      "active",
      "dirty",
      "pinned",
      "disabled"
    ],
    "parts": [
      "g-desktop-document-tab",
      "g-desktop-document-tab-close"
    ],
    "behaviors": [
      "desktop-tabs",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-drag-region",
    "exportName": "GDesktopDragRegionDirective",
    "directiveName": "gDesktopDragRegion",
    "elementName": "g-desktop-drag-region",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-drag-region",
    "cssSelector": ".g-desktop-drag-region",
    "className": "g-desktop-drag-region",
    "tag": "div",
    "variants": [
      "standard",
      "compact",
      "toolbar",
      "centered"
    ],
    "states": [
      "idle",
      "dragging",
      "disabled"
    ],
    "parts": [
      "g-desktop-no-drag"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "tauri",
      "electron"
    ]
  },
  {
    "name": "window-loading",
    "exportName": "GWindowLoadingDirective",
    "directiveName": "gWindowLoading",
    "elementName": "g-window-loading",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-window-loading",
    "cssSelector": ".g-window-loading",
    "className": "g-window-loading",
    "tag": "div",
    "variants": [
      "progress",
      "indeterminate",
      "skeleton",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-window-loading-icon",
      "g-window-loading-progress"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "update-available",
    "exportName": "GUpdateAvailableDirective",
    "directiveName": "gUpdateAvailable",
    "elementName": "g-update-available",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-update-available",
    "cssSelector": ".g-update-available",
    "className": "g-update-available",
    "tag": "div",
    "variants": [
      "banner",
      "card",
      "inline",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-notice-main",
      "g-desktop-notice-actions"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-permission-request",
    "exportName": "GDesktopPermissionRequestDirective",
    "directiveName": "gDesktopPermissionRequest",
    "elementName": "g-desktop-permission-request",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-permission-request",
    "cssSelector": ".g-desktop-permission-request",
    "className": "g-desktop-permission-request",
    "tag": "div",
    "variants": [
      "card",
      "inline",
      "detailed",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-notice-icon",
      "g-desktop-notice-main",
      "g-desktop-notice-actions"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "native-file-picker",
    "exportName": "GNativeFilePickerDirective",
    "directiveName": "gNativeFilePicker",
    "elementName": "g-native-file-picker",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-native-file-picker].g-native-file-picker",
    "cssSelector": ".g-native-file-picker",
    "className": "g-native-file-picker",
    "tag": "div",
    "variants": [
      "single",
      "multiple",
      "directory",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-native-file-picker-value"
    ],
    "behaviors": [
      "native-file-picker",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "tray-menu-shell",
    "exportName": "GTrayMenuShellDirective",
    "directiveName": "gTrayMenuShell",
    "elementName": "g-tray-menu-shell",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-dropdown] .g-tray-menu",
    "cssSelector": ".g-tray-menu",
    "className": "g-tray-menu",
    "tag": "div",
    "variants": [
      "standard",
      "grouped",
      "compact",
      "status"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "dropdown",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "multi-window-placeholder",
    "exportName": "GMultiWindowPlaceholderDirective",
    "directiveName": "gMultiWindowPlaceholder",
    "elementName": "g-multi-window-placeholder",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-multi-window-placeholder",
    "cssSelector": ".g-multi-window-placeholder",
    "className": "g-multi-window-placeholder",
    "tag": "div",
    "variants": [
      "empty",
      "cards",
      "inline",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-state-icon",
      "g-desktop-state-actions"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-workspace-composition",
    "exportName": "GDesktopWorkspaceCompositionDirective",
    "directiveName": "gDesktopWorkspaceComposition",
    "elementName": "g-desktop-workspace-composition",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-workspace",
    "cssSelector": ".g-desktop-workspace",
    "className": "g-desktop-workspace",
    "tag": "div",
    "variants": [
      "standard",
      "compact",
      "focus",
      "studio"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-workspace-main"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-window-switcher",
    "exportName": "GDesktopWindowSwitcherDirective",
    "directiveName": "gDesktopWindowSwitcher",
    "elementName": "g-desktop-window-switcher",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-window-switcher].g-desktop-window-switcher",
    "cssSelector": ".g-desktop-window-switcher",
    "className": "g-desktop-window-switcher",
    "tag": "div",
    "variants": [
      "cards",
      "list",
      "recent",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-window-switcher-panel",
      "g-desktop-window-list",
      "g-desktop-window-item",
      "g-desktop-window-main"
    ],
    "behaviors": [
      "window-switcher",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "recent-documents",
    "exportName": "GRecentDocumentsDirective",
    "directiveName": "gRecentDocuments",
    "elementName": "g-recent-documents",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-recent-documents",
    "cssSelector": ".g-recent-documents",
    "className": "g-recent-documents",
    "tag": "div",
    "variants": [
      "list",
      "cards",
      "grouped",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-recent-document",
      "g-recent-document-main",
      "g-recent-document-path"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-toolbar",
    "exportName": "GDesktopToolbarDirective",
    "directiveName": "gDesktopToolbar",
    "elementName": "g-desktop-toolbar",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-toolbar",
    "cssSelector": ".g-desktop-toolbar",
    "className": "g-desktop-toolbar",
    "tag": "div",
    "variants": [
      "standard",
      "compact",
      "icons",
      "grouped"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-toolbar-group",
      "g-desktop-toolbar-separator"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-bottom-panel",
    "exportName": "GDesktopBottomPanelDirective",
    "directiveName": "gDesktopBottomPanel",
    "elementName": "g-desktop-bottom-panel",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-bottom-panel",
    "cssSelector": ".g-desktop-bottom-panel",
    "className": "g-desktop-bottom-panel",
    "tag": "div",
    "variants": [
      "tabs",
      "terminal",
      "problems",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-panel-header",
      "g-desktop-panel-body"
    ],
    "behaviors": [
      "nav-toggle",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "background-task-center",
    "exportName": "GBackgroundTaskCenterDirective",
    "directiveName": "gBackgroundTaskCenter",
    "elementName": "g-background-task-center",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-background-task-center",
    "cssSelector": ".g-background-task-center",
    "className": "g-background-task-center",
    "tag": "div",
    "variants": [
      "list",
      "cards",
      "active",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-background-task",
      "g-background-task-main",
      "g-background-task-progress"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-notification-center",
    "exportName": "GDesktopNotificationCenterDirective",
    "directiveName": "gDesktopNotificationCenter",
    "elementName": "g-desktop-notification-center",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-notification-center",
    "cssSelector": ".g-desktop-notification-center",
    "className": "g-desktop-notification-center",
    "tag": "div",
    "variants": [
      "list",
      "unread",
      "grouped",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-notification",
      "g-desktop-notification-main"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "sync-status",
    "exportName": "GSyncStatusDirective",
    "directiveName": "gSyncStatus",
    "elementName": "g-sync-status",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-sync-status",
    "cssSelector": ".g-sync-status",
    "className": "g-sync-status",
    "tag": "div",
    "variants": [
      "inline",
      "card",
      "detailed",
      "compact"
    ],
    "states": [
      "syncing",
      "synced",
      "offline",
      "error",
      "disabled"
    ],
    "parts": [
      "g-sync-status-dot"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "update-progress",
    "exportName": "GUpdateProgressDirective",
    "directiveName": "gUpdateProgress",
    "elementName": "g-update-progress",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-update-progress",
    "cssSelector": ".g-update-progress",
    "className": "g-update-progress",
    "tag": "div",
    "variants": [
      "linear",
      "steps",
      "detailed",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-update-progress-header",
      "g-update-progress-track",
      "g-update-progress-value"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "crash-recovery",
    "exportName": "GCrashRecoveryDirective",
    "directiveName": "gCrashRecovery",
    "elementName": "g-crash-recovery",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-crash-recovery",
    "cssSelector": ".g-crash-recovery",
    "className": "g-crash-recovery",
    "tag": "div",
    "variants": [
      "card",
      "list",
      "detailed",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-state-icon",
      "g-desktop-state-actions"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "single-instance-notice",
    "exportName": "GSingleInstanceNoticeDirective",
    "directiveName": "gSingleInstanceNotice",
    "elementName": "g-single-instance-notice",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-single-instance-notice",
    "cssSelector": ".g-single-instance-notice",
    "className": "g-single-instance-notice",
    "tag": "div",
    "variants": [
      "inline",
      "card",
      "detailed",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-notice-main",
      "g-desktop-notice-actions"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "deep-link-handler",
    "exportName": "GDeepLinkHandlerDirective",
    "directiveName": "gDeepLinkHandler",
    "elementName": "g-deep-link-handler",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-deep-link-handler",
    "cssSelector": ".g-deep-link-handler",
    "className": "g-deep-link-handler",
    "tag": "div",
    "variants": [
      "card",
      "inline",
      "preview",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-desktop-notice-main",
      "g-desktop-notice-actions"
    ],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "about-dialog",
    "exportName": "GAboutDialogDirective",
    "directiveName": "gAboutDialog",
    "elementName": "g-about-dialog",
    "category": "desktop",
    "type": "interactive",
    "selector": "[data-g-dialog].g-about-dialog",
    "cssSelector": ".g-about-dialog",
    "className": "g-about-dialog",
    "tag": "div",
    "variants": [
      "standard",
      "compact",
      "credits",
      "licenses"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-about-dialog-icon"
    ],
    "behaviors": [
      "dialog",
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "solution-product-landing",
    "exportName": "GSolutionProductLandingDirective",
    "directiveName": "gSolutionProductLanding",
    "elementName": "g-solution-product-landing",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-product-landing",
    "cssSelector": ".g-product-landing",
    "className": "g-product-landing",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-solution-container",
      "g-landing-hero",
      "g-landing-copy",
      "g-landing-title",
      "g-landing-visual",
      "g-landing-proof",
      "g-solution-section"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-corporate-home",
    "exportName": "GSolutionCorporateHomeDirective",
    "directiveName": "gSolutionCorporateHome",
    "elementName": "g-solution-corporate-home",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-corporate-home",
    "cssSelector": ".g-corporate-home",
    "className": "g-corporate-home",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-solution-container",
      "g-corporate-hero",
      "g-corporate-copy",
      "g-corporate-title",
      "g-corporate-visual",
      "g-corporate-trust",
      "g-solution-section"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-personal-home",
    "exportName": "GSolutionPersonalHomeDirective",
    "directiveName": "gSolutionPersonalHome",
    "elementName": "g-solution-personal-home",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-personal-home",
    "cssSelector": ".g-personal-home",
    "className": "g-personal-home",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-solution-container",
      "g-personal-intro",
      "g-personal-copy",
      "g-personal-title",
      "g-personal-portrait",
      "g-personal-links",
      "g-personal-timeline"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-portfolio-page",
    "exportName": "GSolutionPortfolioPageDirective",
    "directiveName": "gSolutionPortfolioPage",
    "elementName": "g-solution-portfolio-page",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-portfolio-page",
    "cssSelector": ".g-portfolio-page",
    "className": "g-portfolio-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-portfolio-hero",
      "g-portfolio-copy",
      "g-portfolio-title",
      "g-portfolio-featured",
      "g-portfolio-grid",
      "g-portfolio-project",
      "g-portfolio-project-media",
      "g-portfolio-project-body"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-blog-index",
    "exportName": "GSolutionBlogIndexDirective",
    "directiveName": "gSolutionBlogIndex",
    "elementName": "g-solution-blog-index",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-blog-index",
    "cssSelector": ".g-blog-index",
    "className": "g-blog-index",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-blog-index-header",
      "g-blog-categories",
      "g-blog-grid-page",
      "g-blog-entry",
      "g-blog-entry-media",
      "g-blog-entry-body"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-article-page",
    "exportName": "GSolutionArticlePageDirective",
    "directiveName": "gSolutionArticlePage",
    "elementName": "g-solution-article-page",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-article-page",
    "cssSelector": ".g-article-page",
    "className": "g-article-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-article-page-layout",
      "g-article-page-body",
      "g-article-page-toc",
      "g-article-page-meta"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile",
      "print"
    ]
  },
  {
    "name": "solution-docs-portal",
    "exportName": "GSolutionDocsPortalDirective",
    "directiveName": "gSolutionDocsPortal",
    "elementName": "g-solution-docs-portal",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-docs-portal",
    "cssSelector": ".g-docs-portal",
    "className": "g-docs-portal",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-docs-layout",
      "g-docs-sidebar",
      "g-docs-main",
      "g-docs-toc"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "solution-help-center",
    "exportName": "GSolutionHelpCenterDirective",
    "directiveName": "gSolutionHelpCenter",
    "elementName": "g-solution-help-center",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-help-center-page",
    "cssSelector": ".g-help-center-page",
    "className": "g-help-center-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-help-center-hero",
      "g-help-center-search",
      "g-help-center-layout",
      "g-help-center-sidebar",
      "g-help-center-main",
      "g-help-center-aside"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "solution-search-results",
    "exportName": "GSolutionSearchResultsDirective",
    "directiveName": "gSolutionSearchResults",
    "elementName": "g-solution-search-results",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-search-results-page",
    "cssSelector": ".g-search-results-page",
    "className": "g-search-results-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-search-results-layout",
      "g-search-filters",
      "g-search-results-list",
      "g-search-result"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-contact-page",
    "exportName": "GSolutionContactPageDirective",
    "directiveName": "gSolutionContactPage",
    "elementName": "g-solution-contact-page",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-contact-page",
    "cssSelector": ".g-contact-page",
    "className": "g-contact-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-contact-layout",
      "g-contact-details",
      "g-contact-form"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-pricing-page",
    "exportName": "GSolutionPricingPageDirective",
    "directiveName": "gSolutionPricingPage",
    "elementName": "g-solution-pricing-page",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-pricing-page",
    "cssSelector": ".g-pricing-page",
    "className": "g-pricing-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-pricing-page-header",
      "g-pricing-page-grid",
      "g-pricing-page-card"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-dashboard-overview",
    "exportName": "GSolutionDashboardOverviewDirective",
    "directiveName": "gSolutionDashboardOverview",
    "elementName": "g-solution-dashboard-overview",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-dashboard-overview",
    "cssSelector": ".g-dashboard-overview",
    "className": "g-dashboard-overview",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-dashboard-overview-header",
      "g-solution-header",
      "g-dashboard-metrics",
      "g-dashboard-layout",
      "g-dashboard-panel",
      "g-solution-stat"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "tablet"
    ]
  },
  {
    "name": "solution-admin-list",
    "exportName": "GSolutionAdminListDirective",
    "directiveName": "gSolutionAdminList",
    "elementName": "g-solution-admin-list",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-admin-list-page",
    "cssSelector": ".g-admin-list-page",
    "className": "g-admin-list-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-admin-list-header",
      "g-admin-list-content",
      "g-admin-list-filters",
      "g-solution-toolbar"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "tablet"
    ]
  },
  {
    "name": "solution-record-detail",
    "exportName": "GSolutionRecordDetailDirective",
    "directiveName": "gSolutionRecordDetail",
    "elementName": "g-solution-record-detail",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-record-detail-page",
    "cssSelector": ".g-record-detail-page",
    "className": "g-record-detail-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-record-detail-header",
      "g-record-detail-layout",
      "g-record-detail-main",
      "g-record-detail-aside",
      "g-record-detail-section"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-settings-center",
    "exportName": "GSolutionSettingsCenterDirective",
    "directiveName": "gSolutionSettingsCenter",
    "elementName": "g-solution-settings-center",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-settings-center",
    "cssSelector": ".g-settings-center",
    "className": "g-settings-center",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-settings-center-header",
      "g-settings-center-layout",
      "g-settings-center-nav",
      "g-settings-center-content",
      "g-settings-center-section"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-user-center",
    "exportName": "GSolutionUserCenterDirective",
    "directiveName": "gSolutionUserCenter",
    "elementName": "g-solution-user-center",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-user-center",
    "cssSelector": ".g-user-center",
    "className": "g-user-center",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-user-center-header",
      "g-user-center-layout",
      "g-user-center-nav",
      "g-user-center-content",
      "g-user-center-section"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-notification-center",
    "exportName": "GSolutionNotificationCenterDirective",
    "directiveName": "gSolutionNotificationCenter",
    "elementName": "g-solution-notification-center",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-notification-center-page",
    "cssSelector": ".g-notification-center-page",
    "className": "g-notification-center-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-notification-center-header",
      "g-notification-groups",
      "g-notification-group",
      "g-notification-row"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-onboarding-flow",
    "exportName": "GSolutionOnboardingFlowDirective",
    "directiveName": "gSolutionOnboardingFlow",
    "elementName": "g-solution-onboarding-flow",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-onboarding-flow",
    "cssSelector": ".g-onboarding-flow",
    "className": "g-onboarding-flow",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-onboarding-aside",
      "g-onboarding-main",
      "g-onboarding-step",
      "g-onboarding-progress",
      "g-onboarding-progress-item"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "solution-crm-workspace",
    "exportName": "GSolutionCrmWorkspaceDirective",
    "directiveName": "gSolutionCrmWorkspace",
    "elementName": "g-solution-crm-workspace",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-crm-workspace",
    "cssSelector": ".g-crm-workspace",
    "className": "g-crm-workspace",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-crm-header",
      "g-crm-layout",
      "g-crm-nav",
      "g-crm-main",
      "g-crm-inspector",
      "g-crm-pipeline",
      "g-crm-stage"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "tauri",
      "electron"
    ]
  },
  {
    "name": "solution-project-workspace",
    "exportName": "GSolutionProjectWorkspaceDirective",
    "directiveName": "gSolutionProjectWorkspace",
    "elementName": "g-solution-project-workspace",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-project-workspace",
    "cssSelector": ".g-project-workspace",
    "className": "g-project-workspace",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-project-header",
      "g-project-layout",
      "g-project-nav",
      "g-project-main",
      "g-project-inspector",
      "g-project-board",
      "g-project-column"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "tauri",
      "electron"
    ]
  },
  {
    "name": "solution-support-center",
    "exportName": "GSolutionSupportCenterDirective",
    "directiveName": "gSolutionSupportCenter",
    "elementName": "g-solution-support-center",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-support-center",
    "cssSelector": ".g-support-center",
    "className": "g-support-center",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-support-header",
      "g-support-layout",
      "g-support-nav",
      "g-support-main",
      "g-support-inspector",
      "g-support-thread",
      "g-support-messages",
      "g-support-reply"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-approval-center",
    "exportName": "GSolutionApprovalCenterDirective",
    "directiveName": "gSolutionApprovalCenter",
    "elementName": "g-solution-approval-center",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-approval-center",
    "cssSelector": ".g-approval-center",
    "className": "g-approval-center",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-approval-header",
      "g-approval-layout",
      "g-approval-nav",
      "g-approval-main",
      "g-approval-inspector",
      "g-approval-queue",
      "g-approval-column"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-knowledge-base",
    "exportName": "GSolutionKnowledgeBaseDirective",
    "directiveName": "gSolutionKnowledgeBase",
    "elementName": "g-solution-knowledge-base",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-knowledge-base",
    "cssSelector": ".g-knowledge-base",
    "className": "g-knowledge-base",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-knowledge-hero",
      "g-knowledge-search",
      "g-knowledge-layout",
      "g-knowledge-sidebar",
      "g-knowledge-main",
      "g-knowledge-aside"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-learning-portal",
    "exportName": "GSolutionLearningPortalDirective",
    "directiveName": "gSolutionLearningPortal",
    "elementName": "g-solution-learning-portal",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-learning-portal",
    "cssSelector": ".g-learning-portal",
    "className": "g-learning-portal",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-learning-layout",
      "g-learning-sidebar",
      "g-learning-main",
      "g-course-grid",
      "g-course-card",
      "g-course-card-body"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-event-portal",
    "exportName": "GSolutionEventPortalDirective",
    "directiveName": "gSolutionEventPortal",
    "elementName": "g-solution-event-portal",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-event-portal",
    "cssSelector": ".g-event-portal",
    "className": "g-event-portal",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-event-hero",
      "g-event-grid",
      "g-event-card",
      "g-event-card-body"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-booking-portal",
    "exportName": "GSolutionBookingPortalDirective",
    "directiveName": "gSolutionBookingPortal",
    "elementName": "g-solution-booking-portal",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-booking-portal",
    "cssSelector": ".g-booking-portal",
    "className": "g-booking-portal",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-booking-layout",
      "g-booking-results",
      "g-booking-summary"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-healthcare-portal",
    "exportName": "GSolutionHealthcarePortalDirective",
    "directiveName": "gSolutionHealthcarePortal",
    "elementName": "g-solution-healthcare-portal",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-healthcare-portal",
    "cssSelector": ".g-healthcare-portal",
    "className": "g-healthcare-portal",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-healthcare-layout",
      "g-industry-portal-nav",
      "g-industry-portal-main",
      "g-healthcare-summary",
      "g-healthcare-record",
      "g-industry-alert"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-finance-portal",
    "exportName": "GSolutionFinancePortalDirective",
    "directiveName": "gSolutionFinancePortal",
    "elementName": "g-solution-finance-portal",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-finance-portal",
    "cssSelector": ".g-finance-portal",
    "className": "g-finance-portal",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-finance-layout",
      "g-industry-portal-nav",
      "g-industry-portal-main",
      "g-finance-summary",
      "g-finance-account",
      "g-industry-alert"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-public-service-portal",
    "exportName": "GSolutionPublicServicePortalDirective",
    "directiveName": "gSolutionPublicServicePortal",
    "elementName": "g-solution-public-service-portal",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-public-service-portal",
    "cssSelector": ".g-public-service-portal",
    "className": "g-public-service-portal",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-public-service-layout",
      "g-industry-portal-nav",
      "g-industry-portal-main",
      "g-public-service-summary",
      "g-public-service-item",
      "g-industry-alert"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "desktop",
      "mobile"
    ]
  },
  {
    "name": "solution-marketplace-page",
    "exportName": "GSolutionMarketplacePageDirective",
    "directiveName": "gSolutionMarketplacePage",
    "elementName": "g-solution-marketplace-page",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-marketplace-page",
    "cssSelector": ".g-marketplace-page",
    "className": "g-marketplace-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-marketplace-hero",
      "g-marketplace-layout",
      "g-marketplace-filters",
      "g-marketplace-grid",
      "g-marketplace-card",
      "g-marketplace-card-body"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-community-page",
    "exportName": "GSolutionCommunityPageDirective",
    "directiveName": "gSolutionCommunityPage",
    "elementName": "g-solution-community-page",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-community-page",
    "cssSelector": ".g-community-page",
    "className": "g-community-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-community-hero",
      "g-community-layout",
      "g-community-feed",
      "g-community-sidebar",
      "g-community-post",
      "g-community-grid",
      "g-community-card"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile"
    ]
  },
  {
    "name": "solution-status-center",
    "exportName": "GSolutionStatusCenterDirective",
    "directiveName": "gSolutionStatusCenter",
    "elementName": "g-solution-status-center",
    "category": "solution",
    "type": "interactive",
    "selector": ".g-status-center-page",
    "cssSelector": ".g-status-center-page",
    "className": "g-status-center-page",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "boxed",
      "wide",
      "fluid",
      "flat",
      "outlined"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-status-center-header",
      "g-status-overall",
      "g-status-services",
      "g-status-service",
      "g-status-history",
      "g-status-incident"
    ],
    "behaviors": [
      "solution"
    ],
    "platforms": [
      "web",
      "mobile",
      "print"
    ]
  },
  {
    "name": "collapse",
    "exportName": "GCollapseDirective",
    "directiveName": "gCollapse",
    "elementName": "g-collapse",
    "category": "disclosure",
    "type": "interactive",
    "selector": "[data-g-accordion].g-collapse-panel",
    "cssSelector": ".g-collapse-panel",
    "className": "g-collapse-panel",
    "tag": "div",
    "variants": [
      "borderless",
      "card",
      "compact",
      "comfortable",
      "icon-start",
      "icon-none"
    ],
    "states": [
      "collapsed",
      "expanded",
      "disabled"
    ],
    "parts": [
      "g-disclosure-trigger",
      "g-disclosure-panel"
    ],
    "behaviors": [
      "accordion"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "read-more",
    "exportName": "GReadMoreDirective",
    "directiveName": "gReadMore",
    "elementName": "g-read-more",
    "category": "disclosure",
    "type": "interactive",
    "selector": "[data-g-accordion].g-read-more",
    "cssSelector": ".g-read-more",
    "className": "g-read-more",
    "tag": "div",
    "variants": [
      "card",
      "compact",
      "comfortable",
      "inline",
      "icon-none"
    ],
    "states": [
      "collapsed",
      "expanded",
      "disabled"
    ],
    "parts": [
      "g-read-more-preview",
      "g-disclosure-trigger",
      "g-disclosure-panel"
    ],
    "behaviors": [
      "accordion"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "kpi-group",
    "exportName": "GKpiGroupDirective",
    "directiveName": "gKpiGroup",
    "elementName": "g-kpi-group",
    "category": "dashboard",
    "type": "interactive",
    "selector": "[data-g-dashboard].g-kpi-group",
    "cssSelector": ".g-kpi-group",
    "className": "g-kpi-group",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "borderless",
      "divided",
      "stacked"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-kpi",
      "g-kpi-label",
      "g-kpi-value"
    ],
    "behaviors": [
      "dashboard"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "dashboard-widget",
    "exportName": "GDashboardWidgetDirective",
    "directiveName": "gDashboardWidget",
    "elementName": "g-dashboard-widget",
    "category": "dashboard",
    "type": "interactive",
    "selector": "[data-g-dashboard].g-dashboard-widget",
    "cssSelector": ".g-dashboard-widget",
    "className": "g-dashboard-widget",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "borderless",
      "flat",
      "accent"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-dashboard-heading",
      "g-dashboard-body",
      "g-dashboard-actions"
    ],
    "behaviors": [
      "dashboard"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "goal-tracker",
    "exportName": "GGoalTrackerDirective",
    "directiveName": "gGoalTracker",
    "elementName": "g-goal-tracker",
    "category": "dashboard",
    "type": "interactive",
    "selector": "[data-g-dashboard].g-goal-tracker",
    "cssSelector": ".g-goal-tracker",
    "className": "g-goal-tracker",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "borderless",
      "horizontal",
      "centered"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-goal-track",
      "g-goal-fill",
      "g-dashboard-value"
    ],
    "behaviors": [
      "dashboard"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "gauge-chart",
    "exportName": "GGaugeChartDirective",
    "directiveName": "gGaugeChart",
    "elementName": "g-gauge-chart",
    "category": "dashboard",
    "type": "interactive",
    "selector": "[data-g-dashboard].g-gauge-chart",
    "cssSelector": ".g-gauge-chart",
    "className": "g-gauge-chart",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "borderless",
      "semicircle",
      "ring"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled"
    ],
    "parts": [
      "g-dashboard-gauge",
      "g-dashboard-value"
    ],
    "behaviors": [
      "dashboard"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "undo-history",
    "exportName": "GUndoHistoryDirective",
    "directiveName": "gUndoHistory",
    "elementName": "g-undo-history",
    "category": "interaction",
    "type": "interactive",
    "selector": ".g-undo-history",
    "cssSelector": ".g-undo-history",
    "className": "g-undo-history",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "list",
      "compact-list"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-interaction-history",
      "g-interaction-heading",
      "g-interaction-actions",
      "g-interaction-status",
      "g-interaction-button"
    ],
    "behaviors": [
      "interaction"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "markdown-viewer",
    "exportName": "GMarkdownViewerDirective",
    "directiveName": "gMarkdownViewer",
    "elementName": "g-markdown-viewer",
    "category": "content",
    "type": "interactive",
    "selector": ".g-markdown-viewer",
    "cssSelector": ".g-markdown-viewer",
    "className": "g-markdown-viewer",
    "tag": "div",
    "variants": [
      "compact",
      "comfortable",
      "bordered",
      "borderless",
      "narrow",
      "wide"
    ],
    "states": [
      "loading",
      "empty",
      "error",
      "disabled",
      "readonly"
    ],
    "parts": [
      "g-content-heading",
      "g-content-actions",
      "g-content-status",
      "g-content-button",
      "g-content-body"
    ],
    "behaviors": [
      "content"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "responsive-container",
    "exportName": "GResponsiveContainerDirective",
    "directiveName": "gResponsiveContainer",
    "elementName": "g-responsive-container",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-responsive-container",
    "cssSelector": ".g-responsive-container",
    "className": "g-responsive-container",
    "tag": "div",
    "variants": [
      "default",
      "fluid",
      "reading",
      "wide",
      "narrow",
      "full-height"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-responsive-container-content"
    ],
    "behaviors": [
      "layout"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop",
      "print"
    ]
  },
  {
    "name": "help-search",
    "exportName": "GHelpSearchDirective",
    "directiveName": "gHelpSearch",
    "elementName": "g-help-search",
    "category": "help",
    "type": "interactive",
    "selector": ".g-help-search-composition",
    "cssSelector": ".g-help-search-composition",
    "className": "g-help-search-composition",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "categorized"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-help-items"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop",
      "print"
    ]
  },
  {
    "name": "help-glossary",
    "exportName": "GHelpGlossaryDirective",
    "directiveName": "gHelpGlossary",
    "elementName": "g-help-glossary",
    "category": "help",
    "type": "interactive",
    "selector": ".g-help-glossary",
    "cssSelector": ".g-help-glossary",
    "className": "g-help-glossary",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "grouped"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-help-items"
    ],
    "behaviors": [
      "help"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop",
      "print"
    ]
  },
  {
    "name": "ai-run-timeline",
    "exportName": "GAiRunTimelineDirective",
    "directiveName": "gAiRunTimeline",
    "elementName": "g-ai-run-timeline",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-ai-run-timeline",
    "cssSelector": ".g-ai-run-timeline",
    "className": "g-ai-run-timeline",
    "tag": "div",
    "variants": [
      "default",
      "compact",
      "detailed"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-ai-item"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop",
      "print"
    ]
  },
  {
    "name": "ai-structured-output",
    "exportName": "GAiStructuredOutputDirective",
    "directiveName": "gAiStructuredOutput",
    "elementName": "g-ai-structured-output",
    "category": "ai",
    "type": "interactive",
    "selector": ".g-ai-structured-output",
    "cssSelector": ".g-ai-structured-output",
    "className": "g-ai-structured-output",
    "tag": "div",
    "variants": [
      "default",
      "tree",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-ai-text"
    ],
    "behaviors": [
      "ai"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop",
      "print"
    ]
  },
  {
    "name": "responsive-image",
    "exportName": "GResponsiveImageDirective",
    "directiveName": "gResponsiveImage",
    "elementName": "g-responsive-image",
    "category": "media",
    "type": "interactive",
    "selector": ".g-responsive-image",
    "cssSelector": ".g-responsive-image",
    "className": "g-responsive-image",
    "tag": "div",
    "variants": [
      "default",
      "square",
      "circle",
      "cover",
      "contain"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-media-image"
    ],
    "behaviors": [
      "media"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop",
      "print"
    ]
  },
  {
    "name": "image",
    "exportName": "GImageDirective",
    "directiveName": "gImage",
    "elementName": "g-image",
    "category": "media",
    "type": "interactive",
    "selector": ".g-image",
    "cssSelector": ".g-image",
    "className": "g-image",
    "tag": "div",
    "variants": [
      "default",
      "square",
      "circle",
      "cover",
      "contain"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-image-img",
      "g-image-footer",
      "g-image-title",
      "g-image-description",
      "g-image-preview"
    ],
    "behaviors": [
      "media"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "image-comparison",
    "exportName": "GImageComparisonDirective",
    "directiveName": "gImageComparison",
    "elementName": "g-image-comparison",
    "category": "media",
    "type": "interactive",
    "selector": ".g-image-comparison",
    "cssSelector": ".g-image-comparison",
    "className": "g-image-comparison",
    "tag": "div",
    "variants": [
      "horizontal",
      "vertical",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-media-image"
    ],
    "behaviors": [
      "media"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop",
      "print"
    ]
  },
  {
    "name": "feature-grid",
    "exportName": "GFeatureGridDirective",
    "directiveName": "gFeatureGrid",
    "elementName": "g-feature-grid",
    "category": "marketing",
    "type": "interactive",
    "selector": ".g-feature-grid",
    "cssSelector": ".g-feature-grid",
    "className": "g-feature-grid",
    "tag": "div",
    "variants": [
      "cards",
      "alternating",
      "compact",
      "tabs"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "marketing"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "logo-cloud",
    "exportName": "GLogoCloudDirective",
    "directiveName": "gLogoCloud",
    "elementName": "g-logo-cloud",
    "category": "marketing",
    "type": "interactive",
    "selector": ".g-logo-cloud",
    "cssSelector": ".g-logo-cloud",
    "className": "g-logo-cloud",
    "tag": "div",
    "variants": [
      "grid",
      "strip",
      "compact",
      "monochrome"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "marketing"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "testimonial",
    "exportName": "GTestimonialDirective",
    "directiveName": "gTestimonial",
    "elementName": "g-testimonial",
    "category": "marketing",
    "type": "interactive",
    "selector": ".g-testimonial-grid",
    "cssSelector": ".g-testimonial-grid",
    "className": "g-testimonial-grid",
    "tag": "div",
    "variants": [
      "cards",
      "carousel",
      "compact",
      "featured"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "marketing"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "cta-section",
    "exportName": "GCtaSectionDirective",
    "directiveName": "gCtaSection",
    "elementName": "g-cta-section",
    "category": "marketing",
    "type": "interactive",
    "selector": ".g-cta-section",
    "cssSelector": ".g-cta-section",
    "className": "g-cta-section",
    "tag": "div",
    "variants": [
      "inline",
      "centered",
      "split",
      "subtle"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "marketing"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "newsletter",
    "exportName": "GNewsletterDirective",
    "directiveName": "gNewsletter",
    "elementName": "g-newsletter",
    "category": "marketing",
    "type": "interactive",
    "selector": ".g-newsletter",
    "cssSelector": ".g-newsletter",
    "className": "g-newsletter",
    "tag": "div",
    "variants": [
      "inline",
      "card",
      "split",
      "minimal"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "marketing"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "announcement-bar",
    "exportName": "GAnnouncementBarDirective",
    "directiveName": "gAnnouncementBar",
    "elementName": "g-announcement-bar",
    "category": "marketing",
    "type": "interactive",
    "selector": ".g-announcement-bar",
    "cssSelector": ".g-announcement-bar",
    "className": "g-announcement-bar",
    "tag": "div",
    "variants": [
      "inline",
      "sticky",
      "countdown",
      "subtle"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "marketing"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "site-footer",
    "exportName": "GSiteFooterDirective",
    "directiveName": "gSiteFooter",
    "elementName": "g-site-footer",
    "category": "marketing",
    "type": "interactive",
    "selector": ".g-site-footer",
    "cssSelector": ".g-site-footer",
    "className": "g-site-footer",
    "tag": "div",
    "variants": [
      "columns",
      "simple",
      "centered",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "marketing"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "member-management",
    "exportName": "GMemberManagementDirective",
    "directiveName": "gMemberManagement",
    "elementName": "g-member-management",
    "category": "enterprise",
    "type": "interactive",
    "selector": ".g-member-management",
    "cssSelector": ".g-member-management",
    "className": "g-member-management",
    "tag": "div",
    "variants": [
      "table",
      "cards",
      "inspector",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "enterprise"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "invitation-manager",
    "exportName": "GInvitationManagerDirective",
    "directiveName": "gInvitationManager",
    "elementName": "g-invitation-manager",
    "category": "enterprise",
    "type": "interactive",
    "selector": ".g-invitation-manager",
    "cssSelector": ".g-invitation-manager",
    "className": "g-invitation-manager",
    "tag": "div",
    "variants": [
      "table",
      "cards",
      "inline",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "enterprise"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "role-manager",
    "exportName": "GRoleManagerDirective",
    "directiveName": "gRoleManager",
    "elementName": "g-role-manager",
    "category": "enterprise",
    "type": "interactive",
    "selector": ".g-role-manager",
    "cssSelector": ".g-role-manager",
    "className": "g-role-manager",
    "tag": "div",
    "variants": [
      "split",
      "cards",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "enterprise"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "team-management",
    "exportName": "GTeamManagementDirective",
    "directiveName": "gTeamManagement",
    "elementName": "g-team-management",
    "category": "enterprise",
    "type": "interactive",
    "selector": ".g-team-management",
    "cssSelector": ".g-team-management",
    "className": "g-team-management",
    "tag": "div",
    "variants": [
      "tree",
      "cards",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "enterprise"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "enterprise-integrations",
    "exportName": "GEnterpriseIntegrationsDirective",
    "directiveName": "gEnterpriseIntegrations",
    "elementName": "g-enterprise-integrations",
    "category": "enterprise",
    "type": "interactive",
    "selector": ".g-enterprise-integrations",
    "cssSelector": ".g-enterprise-integrations",
    "className": "g-enterprise-integrations",
    "tag": "div",
    "variants": [
      "catalog",
      "connected",
      "list",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "enterprise"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-preferences",
    "exportName": "GDesktopPreferencesDirective",
    "directiveName": "gDesktopPreferences",
    "elementName": "g-desktop-preferences",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-preferences",
    "cssSelector": ".g-desktop-preferences",
    "className": "g-desktop-preferences",
    "tag": "div",
    "variants": [
      "sidebar",
      "tabs",
      "stacked",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-session-manager",
    "exportName": "GDesktopSessionManagerDirective",
    "directiveName": "gDesktopSessionManager",
    "elementName": "g-desktop-session-manager",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-session-manager",
    "cssSelector": ".g-desktop-session-manager",
    "className": "g-desktop-session-manager",
    "tag": "div",
    "variants": [
      "cards",
      "list",
      "recent",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "desktop-problems-panel",
    "exportName": "GDesktopProblemsPanelDirective",
    "directiveName": "gDesktopProblemsPanel",
    "elementName": "g-desktop-problems-panel",
    "category": "desktop",
    "type": "interactive",
    "selector": ".g-desktop-problems-panel",
    "cssSelector": ".g-desktop-problems-panel",
    "className": "g-desktop-problems-panel",
    "tag": "div",
    "variants": [
      "table",
      "grouped",
      "errors",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "desktop"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "workflow-checklist",
    "exportName": "GWorkflowChecklistDirective",
    "directiveName": "gWorkflowChecklist",
    "elementName": "g-workflow-checklist",
    "category": "workflow",
    "type": "interactive",
    "selector": ".g-workflow-checklist",
    "cssSelector": ".g-workflow-checklist",
    "className": "g-workflow-checklist",
    "tag": "div",
    "variants": [
      "list",
      "grouped",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "workflow"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "workflow-approval",
    "exportName": "GWorkflowApprovalDirective",
    "directiveName": "gWorkflowApproval",
    "elementName": "g-workflow-approval",
    "category": "workflow",
    "type": "interactive",
    "selector": ".g-workflow-approval",
    "cssSelector": ".g-workflow-approval",
    "className": "g-workflow-approval",
    "tag": "div",
    "variants": [
      "timeline",
      "parallel",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "workflow"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "workflow-builder",
    "exportName": "GWorkflowBuilderDirective",
    "directiveName": "gWorkflowBuilder",
    "elementName": "g-workflow-builder",
    "category": "workflow",
    "type": "interactive",
    "selector": ".g-workflow-builder",
    "cssSelector": ".g-workflow-builder",
    "className": "g-workflow-builder",
    "tag": "div",
    "variants": [
      "canvas",
      "list",
      "split",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "workflow"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "workflow-run-history",
    "exportName": "GWorkflowRunHistoryDirective",
    "directiveName": "gWorkflowRunHistory",
    "elementName": "g-workflow-run-history",
    "category": "workflow",
    "type": "interactive",
    "selector": ".g-workflow-run-history",
    "cssSelector": ".g-workflow-run-history",
    "className": "g-workflow-run-history",
    "tag": "div",
    "variants": [
      "table",
      "cards",
      "timeline",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "workflow"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "workflow-run-detail",
    "exportName": "GWorkflowRunDetailDirective",
    "directiveName": "gWorkflowRunDetail",
    "elementName": "g-workflow-run-detail",
    "category": "workflow",
    "type": "interactive",
    "selector": ".g-workflow-run-detail",
    "cssSelector": ".g-workflow-run-detail",
    "className": "g-workflow-run-detail",
    "tag": "div",
    "variants": [
      "timeline",
      "steps",
      "logs",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "workflow"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "workflow-trigger",
    "exportName": "GWorkflowTriggerDirective",
    "directiveName": "gWorkflowTrigger",
    "elementName": "g-workflow-trigger",
    "category": "workflow",
    "type": "interactive",
    "selector": ".g-workflow-trigger",
    "cssSelector": ".g-workflow-trigger",
    "className": "g-workflow-trigger",
    "tag": "div",
    "variants": [
      "manual",
      "schedule",
      "webhook",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "workflow"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "communication-composer",
    "exportName": "GCommunicationComposerDirective",
    "directiveName": "gCommunicationComposer",
    "elementName": "g-communication-composer",
    "category": "communication",
    "type": "interactive",
    "selector": ".g-communication-composer",
    "cssSelector": ".g-communication-composer",
    "className": "g-communication-composer",
    "tag": "div",
    "variants": [
      "full",
      "inline",
      "reply",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "communication"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "communication-contacts",
    "exportName": "GCommunicationContactsDirective",
    "directiveName": "gCommunicationContacts",
    "elementName": "g-communication-contacts",
    "category": "communication",
    "type": "interactive",
    "selector": ".g-communication-contacts",
    "cssSelector": ".g-communication-contacts",
    "className": "g-communication-contacts",
    "tag": "div",
    "variants": [
      "list",
      "grid",
      "grouped",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "communication"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "notification-preferences",
    "exportName": "GNotificationPreferencesDirective",
    "directiveName": "gNotificationPreferences",
    "elementName": "g-notification-preferences",
    "category": "communication",
    "type": "interactive",
    "selector": ".g-notification-preferences",
    "cssSelector": ".g-notification-preferences",
    "className": "g-notification-preferences",
    "tag": "div",
    "variants": [
      "matrix",
      "grouped",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "communication"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "communication-delivery",
    "exportName": "GCommunicationDeliveryDirective",
    "directiveName": "gCommunicationDelivery",
    "elementName": "g-communication-delivery",
    "category": "communication",
    "type": "interactive",
    "selector": ".g-communication-delivery",
    "cssSelector": ".g-communication-delivery",
    "className": "g-communication-delivery",
    "tag": "div",
    "variants": [
      "table",
      "timeline",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "communication"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "consent-preferences",
    "exportName": "GConsentPreferencesDirective",
    "directiveName": "gConsentPreferences",
    "elementName": "g-consent-preferences",
    "category": "legal",
    "type": "interactive",
    "selector": ".g-consent-preferences",
    "cssSelector": ".g-consent-preferences",
    "className": "g-consent-preferences",
    "tag": "div",
    "variants": [
      "panel",
      "table",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "legal"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "legal-document",
    "exportName": "GLegalDocumentDirective",
    "directiveName": "gLegalDocument",
    "elementName": "g-legal-document",
    "category": "legal",
    "type": "interactive",
    "selector": ".g-legal-document",
    "cssSelector": ".g-legal-document",
    "className": "g-legal-document",
    "tag": "div",
    "variants": [
      "toc",
      "article",
      "print",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "legal"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "legal-agreement",
    "exportName": "GLegalAgreementDirective",
    "directiveName": "gLegalAgreement",
    "elementName": "g-legal-agreement",
    "category": "legal",
    "type": "interactive",
    "selector": ".g-legal-agreement",
    "cssSelector": ".g-legal-agreement",
    "className": "g-legal-agreement",
    "tag": "div",
    "variants": [
      "checklist",
      "document",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "legal"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "consent-history",
    "exportName": "GConsentHistoryDirective",
    "directiveName": "gConsentHistory",
    "elementName": "g-consent-history",
    "category": "legal",
    "type": "interactive",
    "selector": ".g-consent-history",
    "cssSelector": ".g-consent-history",
    "className": "g-consent-history",
    "tag": "div",
    "variants": [
      "table",
      "timeline",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "legal"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "privacy-request",
    "exportName": "GPrivacyRequestDirective",
    "directiveName": "gPrivacyRequest",
    "elementName": "g-privacy-request",
    "category": "legal",
    "type": "interactive",
    "selector": ".g-privacy-request",
    "cssSelector": ".g-privacy-request",
    "className": "g-privacy-request",
    "tag": "div",
    "variants": [
      "form",
      "guided",
      "inline",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "legal"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "privacy-request-status",
    "exportName": "GPrivacyRequestStatusDirective",
    "directiveName": "gPrivacyRequestStatus",
    "elementName": "g-privacy-request-status",
    "category": "legal",
    "type": "interactive",
    "selector": ".g-privacy-request-status",
    "cssSelector": ".g-privacy-request-status",
    "className": "g-privacy-request-status",
    "tag": "div",
    "variants": [
      "timeline",
      "steps",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "legal"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "policy-updates",
    "exportName": "GPolicyUpdatesDirective",
    "directiveName": "gPolicyUpdates",
    "elementName": "g-policy-updates",
    "category": "legal",
    "type": "interactive",
    "selector": ".g-policy-updates",
    "cssSelector": ".g-policy-updates",
    "className": "g-policy-updates",
    "tag": "div",
    "variants": [
      "compare",
      "list",
      "cards",
      "compact"
    ],
    "states": [
      "disabled"
    ],
    "parts": [],
    "behaviors": [
      "legal"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "statistic",
    "exportName": "GStatisticDirective",
    "directiveName": "gStatistic",
    "elementName": "g-statistic",
    "category": "data",
    "type": "interactive",
    "selector": ".g-statistic",
    "cssSelector": ".g-statistic",
    "className": "g-statistic",
    "tag": "div",
    "variants": [
      "small",
      "medium",
      "large"
    ],
    "states": [
      "loading",
      "error"
    ],
    "parts": [
      "g-statistic-title",
      "g-statistic-content",
      "g-statistic-value",
      "g-statistic-value-integer",
      "g-statistic-value-decimal",
      "g-statistic-prefix",
      "g-statistic-suffix",
      "g-statistic-extra"
    ],
    "behaviors": [
      "data-display"
    ],
    "platforms": [
      "web",
      "mobile",
      "desktop"
    ]
  },
  {
    "name": "affix",
    "exportName": "GAffixDirective",
    "directiveName": "gAffix",
    "elementName": "g-affix",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-affix",
    "cssSelector": ".g-affix",
    "className": "g-affix",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "resize-box",
    "exportName": "GResizeBoxDirective",
    "directiveName": "gResizeBox",
    "elementName": "g-resize-box",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-resize-box",
    "cssSelector": ".g-resize-box",
    "className": "g-resize-box",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "scrollbar",
    "exportName": "GScrollbarDirective",
    "directiveName": "gScrollbar",
    "elementName": "g-scrollbar",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-scrollbar",
    "cssSelector": ".g-scrollbar",
    "className": "g-scrollbar",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "space",
    "exportName": "GSpaceDirective",
    "directiveName": "gSpace",
    "elementName": "g-space",
    "category": "layout",
    "type": "interactive",
    "selector": ".g-space",
    "cssSelector": ".g-space",
    "className": "g-space",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "watermark",
    "exportName": "GWatermarkDirective",
    "directiveName": "gWatermark",
    "elementName": "g-watermark",
    "category": "data",
    "type": "interactive",
    "selector": ".g-watermark",
    "cssSelector": ".g-watermark",
    "className": "g-watermark",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "overflow-list",
    "exportName": "GOverflowListDirective",
    "directiveName": "gOverflowList",
    "elementName": "g-overflow-list",
    "category": "data",
    "type": "interactive",
    "selector": ".g-overflow-list",
    "cssSelector": ".g-overflow-list",
    "className": "g-overflow-list",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "input-number",
    "exportName": "GInputNumberDirective",
    "directiveName": "gInputNumber",
    "elementName": "g-input-number",
    "category": "form",
    "type": "interactive",
    "selector": ".g-input-number",
    "cssSelector": ".g-input-number",
    "className": "g-input-number",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "input-tag",
    "exportName": "GInputTagDirective",
    "directiveName": "gInputTag",
    "elementName": "g-input-tag",
    "category": "form",
    "type": "interactive",
    "selector": ".g-input-tag",
    "cssSelector": ".g-input-tag",
    "className": "g-input-tag",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "color-picker",
    "exportName": "GColorPickerDirective",
    "directiveName": "gColorPicker",
    "elementName": "g-color-picker",
    "category": "form",
    "type": "interactive",
    "selector": ".g-color-picker",
    "cssSelector": ".g-color-picker",
    "className": "g-color-picker",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "link",
    "exportName": "GLinkDirective",
    "directiveName": "gLink",
    "elementName": "g-link",
    "category": "basic",
    "type": "interactive",
    "selector": ".g-link",
    "cssSelector": ".g-link",
    "className": "g-link",
    "tag": "a",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "typography",
    "exportName": "GTypographyDirective",
    "directiveName": "gTypography",
    "elementName": "g-typography",
    "category": "basic",
    "type": "interactive",
    "selector": ".g-typography",
    "cssSelector": ".g-typography",
    "className": "g-typography",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  },
  {
    "name": "icon",
    "exportName": "GIconDirective",
    "directiveName": "gIcon",
    "elementName": "g-icon",
    "category": "basic",
    "type": "interactive",
    "selector": ".g-icon",
    "cssSelector": ".g-icon",
    "className": "g-icon",
    "tag": "div",
    "variants": [],
    "states": [
      "disabled"
    ],
    "parts": [
      "g-foundation-body"
    ],
    "behaviors": [
      "foundation"
    ],
    "platforms": [
      "web",
      "mobile",
      "tablet",
      "desktop",
      "print"
    ]
  }
];
export const componentByName = new Map(componentCatalog.map((component) => [component.name, component] as const));
export const componentByExportName = new Map(componentCatalog.map((component) => [component.exportName, component] as const));
export const componentByDirectiveName = new Map(componentCatalog.map((component) => [component.directiveName, component] as const));
