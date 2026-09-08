using System.Reflection;
using System.Text.Json;
using Gardenerim.Blazor.Components;
using Gardenerim.Blazor.Generated;
using Gardenerim.Blazor.Models;
using Gardenerim.Blazor.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;

var failures = new List<string>();
void Assert(bool condition, string message)
{
    if (!condition) failures.Add(message);
}

var assembly = typeof(GardenerimComponentBase).Assembly;
var generated = assembly.GetExportedTypes()
    .Where(type => type.Namespace == "Gardenerim.Blazor.Components" && type.BaseType == typeof(GardenerimComponentBase) && GardenerimCatalog.ByComponentType.ContainsKey(type.Name))
    .OrderBy(type => type.Name, StringComparer.Ordinal)
    .ToArray();

Assert(generated.Length == 575, $"Expected 575 generated components, got {generated.Length}.");
Assert(GardenerimCatalog.Components.Count == 575, "Catalog must contain 575 definitions.");
Assert(GardenerimThemePresets.All.Count == 42 && GardenerimThemePresets.All.Distinct(StringComparer.Ordinal).Count() == 42, "All 42 color themes must be exposed.");
Assert(GardenerimBehaviors.All.Count == 96 && GardenerimBehaviors.All.Distinct(StringComparer.Ordinal).Count() == 96, "All 96 runtime behaviors must be exposed.");
Assert(GardenerimEvents.All.Count == 105 && GardenerimEvents.Guards.Count == 8, "All 105 runtime events and 8 guards must be exposed.");
Assert(GardenerimRuntimeCatalog.Behaviors.Count == 96 && GardenerimRuntimeCatalog.Events.Count == 105, "Runtime member/event catalogs must be complete.");
Assert(GardenerimAssets.Platforms.Count == 5 && GardenerimAssets.ComponentPacks.Count == 28, "All platform/component asset entries must be exposed.");
Assert(GardenerimCatalog.ByName.Count == 575 && GardenerimCatalog.ByComponentType.Count == 575, "Catalog lookup maps must be complete.");
Assert(generated.All(type => type.IsPublic && type.IsSealed && !type.IsGenericType), "Generated components must be public, sealed, and non-generic.");
Assert(generated.Select(type => type.Name).SequenceEqual(GardenerimCatalog.Components.Select(item => item.ComponentType).OrderBy(name => name, StringComparer.Ordinal)), "Generated types and catalog differ.");
Assert(GardenerimCatalog.Components.All(item => !string.IsNullOrWhiteSpace(item.Name) && !string.IsNullOrWhiteSpace(item.Category) && !string.IsNullOrWhiteSpace(item.Kind) && !string.IsNullOrWhiteSpace(item.Selector) && !string.IsNullOrWhiteSpace(item.DefaultTag)), "Every component needs complete metadata.");
Assert(GardenerimCatalog.Components.All(item => !string.IsNullOrWhiteSpace(item.Status)), "Every component status must be preserved.");
Assert(GardenerimCatalog.ByName["tabs"].Accessibility?.Roles.Contains("tablist") == true, "Component accessibility metadata was not preserved.");
Assert(GardenerimCatalog.ByName["fieldset"].DefaultTag == "fieldset", "Fieldset must use a semantic default tag.");
Assert(GardenerimCatalog.ByName["button"].Variants.Contains("dashed") && GardenerimCatalog.ByName["button"].Variants.Contains("circle") && GardenerimCatalog.ByName["button"].Variants.Contains("mini"), "Button variants must cover type, shape, and size.");
Assert(GardenerimCatalog.ByName["button"].States.Contains("success") && GardenerimCatalog.ByName["button"].States.Contains("loading"), "Button states must cover semantic and loading states.");
Assert(new[] { "primary", "vertical", "block", "split", "toggle" }.All(GardenerimCatalog.ByName["button-group"].Variants.Contains) && GardenerimCatalog.ByName["button-group"].States.Contains("warning"), "Button group variants and states are incomplete.");
Assert(new[] { "g-btn-group-primary-action", "g-btn-group-trigger", "g-btn-toolbar" }.All(GardenerimCatalog.ByName["button-group"].Parts.Contains), "Button group structural parts are incomplete.");
Assert(GardenerimCatalog.ByName["button-group"].Accessibility?.Roles.Contains("group") == true && GardenerimCatalog.ByName["button-group"].Accessibility?.Roles.Contains("toolbar") == true, "Button group accessibility roles are incomplete.");
Assert(new[] { "badge", "tag", "chip" }.All(name => GardenerimCatalog.ByName[name].DefaultTag == "span"), "Badge, tag, and chip must use inline semantic roots.");
Assert(new[] { "attached", "dot", "status", "ribbon" }.All(GardenerimCatalog.ByName["badge"].Variants.Contains), "Badge variants are incomplete.");
Assert(new[] { "g-tag-icon", "g-tag-label", "g-tag-close" }.All(GardenerimCatalog.ByName["tag"].Parts.Contains), "Tag structural parts are incomplete.");
Assert(new[] { "clickable", "selectable", "removable", "multiline" }.All(GardenerimCatalog.ByName["chip"].Variants.Contains), "Chip interaction variants are incomplete.");
Assert(new[] { "xs", "2xl", "rounded", "fit-contain", "status", "loading" }.All(GardenerimCatalog.ByName["avatar"].Variants.Contains), "Avatar content, sizing, fit, and status variants are incomplete.");
Assert(new[] { "online", "away", "busy", "offline", "disabled" }.All(GardenerimCatalog.ByName["avatar"].States.Contains), "Avatar presence and disabled states are incomplete.");
Assert(GardenerimCatalog.ByName["avatar-group"].ComponentType == "GAvatarGroup" && new[] { "overlap", "spaced", "compact", "square" }.All(GardenerimCatalog.ByName["avatar-group"].Variants.Contains), "Avatar group must remain an independent generated component.");
Assert(GardenerimCatalog.ByName["avatar-group"].Parts.Contains("g-avatar-overflow") && GardenerimCatalog.ByName["avatar-group"].Accessibility?.Roles.Contains("group") == true, "Avatar group overflow and accessibility contracts are incomplete.");
Assert(new[] { "horizontal", "vertical", "start", "center", "end", "solid", "dashed", "dotted", "double", "plain", "heading", "small", "medium", "large", "inset", "strong", "stretch" }.All(GardenerimCatalog.ByName["divider-with-text"].Variants.Contains), "Divider orientation, title, line, and spacing variants are incomplete.");
Assert(GardenerimCatalog.ByName["divider-with-text"].Parts.Contains("g-divider-text") && GardenerimCatalog.ByName["divider-with-text"].Accessibility?.Roles.Contains("separator") == true, "Divider structure and accessibility contracts are incomplete.");
Assert(new[] { "soft", "outlined", "filled", "banner", "center", "compact", "spacious", "borderless", "accent", "with-title", "closable", "no-icon", "stacked" }.All(GardenerimCatalog.ByName["alert"].Variants.Contains), "Alert appearance variants are incomplete.");
Assert(new[] { "normal", "info", "success", "warning", "danger", "error", "loading" }.All(GardenerimCatalog.ByName["alert"].States.Contains), "Alert semantic states are incomplete.");
Assert(new[] { "g-alert-icon", "g-alert-body", "g-alert-title", "g-alert-content", "g-alert-actions", "g-alert-close" }.All(GardenerimCatalog.ByName["alert"].Parts.Contains) && GardenerimCatalog.ByName["alert"].Accessibility?.Roles.Contains("alert") == true, "Alert structure and accessibility contracts are incomplete.");
Assert(new[] { "top", "bottom", "compact", "spacious", "with-title", "closable", "with-action", "no-icon" }.All(GardenerimCatalog.ByName["toast"].Variants.Contains), "Toast position and content variants are incomplete.");
Assert(new[] { "normal", "info", "success", "warning", "danger", "error", "loading", "paused", "leaving" }.All(GardenerimCatalog.ByName["toast"].States.Contains), "Toast semantic and lifecycle states are incomplete.");
Assert(new[] { "g-toast-icon", "g-toast-content", "g-toast-title", "g-toast-message", "g-toast-action", "g-toast-close" }.All(GardenerimCatalog.ByName["toast"].Parts.Contains) && new[] { "status", "alert" }.All(GardenerimCatalog.ByName["toast"].Accessibility!.Roles.Contains), "Toast structure or accessibility contracts are incomplete.");
Assert(new[] { "line", "circle", "dashboard", "steps", "meter", "mini", "large", "inside", "striped", "animated", "buffered", "with-success" }.All(GardenerimCatalog.ByName["progress-meter"].Variants.Contains), "Progress and meter presentation variants are incomplete.");
Assert(new[] { "determinate", "indeterminate", "active", "success", "warning", "error", "paused", "disabled" }.All(GardenerimCatalog.ByName["progress-meter"].States.Contains), "Progress and meter states are incomplete.");
Assert(new[] { "g-progress-bar", "g-progress-buffer", "g-progress-success", "g-progress-step", "g-meter-segment", "g-meter-marker" }.All(GardenerimCatalog.ByName["progress-meter"].Parts.Contains) && new[] { "progressbar", "meter" }.All(GardenerimCatalog.ByName["progress-meter"].Accessibility!.Roles.Contains), "Progress and meter structure or accessibility contracts are incomplete.");
Assert(new[] { "simple", "compact", "inline", "card", "full-page", "no-image" }.All(GardenerimCatalog.ByName["empty-state"].Variants.Contains), "Empty state responsive layout variants are incomplete.");
Assert(new[] { "no-data", "no-results", "first-use", "success", "error", "offline", "forbidden" }.All(GardenerimCatalog.ByName["empty-state"].States.Contains), "Empty state scenarios are incomplete.");
Assert(new[] { "g-empty-visual", "g-empty-content", "g-empty-title", "g-empty-description", "g-empty-actions", "g-empty-help" }.All(GardenerimCatalog.ByName["empty-state"].Parts.Contains) && GardenerimCatalog.ByName["empty-state"].Accessibility?.Roles.Contains("status") == true, "Empty state structure or accessibility contracts are incomplete.");
Assert(new[] { "spinner", "dots", "pulse", "inline", "tip", "overlay", "fullscreen", "small", "large", "skeleton", "avatar", "button", "input", "image", "active", "static", "with-avatar", "card", "list" }.All(GardenerimCatalog.ByName["spinner-skeleton"].Variants.Contains), "Spinner and skeleton presentation variants are incomplete.");
Assert(new[] { "loading", "paused", "loaded", "disabled" }.All(GardenerimCatalog.ByName["spinner-skeleton"].States.Contains), "Spinner and skeleton states are incomplete.");
Assert(new[] { "g-spinner-indicator", "g-spinner-dot", "g-spinner-description", "g-spinner-content", "g-skeleton-avatar", "g-skeleton-title", "g-skeleton-row", "g-skeleton-image", "g-skeleton-list-item" }.All(GardenerimCatalog.ByName["spinner-skeleton"].Parts.Contains) && GardenerimCatalog.ByName["spinner-skeleton"].Accessibility?.Roles.Contains("status") == true, "Spinner and skeleton structure or accessibility contracts are incomplete.");
Assert(new[] { "filled", "outlined", "borderless", "underlined", "clearable", "prefix", "suffix", "prepend", "append", "group", "search", "search-button", "password", "word-limit", "mini", "small", "medium", "large" }.All(GardenerimCatalog.ByName["input"].Variants.Contains), "Input appearance, composition, and sizing variants are incomplete.");
Assert(new[] { "normal", "focus", "success", "warning", "error", "loading", "disabled", "read-only" }.All(GardenerimCatalog.ByName["input"].States.Contains), "Input interaction and validation states are incomplete.");
Assert(new[] { "g-input-control", "g-input-prefix", "g-input-suffix", "g-input-clear", "g-input-spinner", "g-input-prepend", "g-input-append", "g-input-search-button", "g-password-toggle", "g-character-count" }.All(GardenerimCatalog.ByName["input"].Parts.Contains) && new[] { "textbox", "searchbox" }.All(GardenerimCatalog.ByName["input"].Accessibility!.Roles.Contains), "Input structure or accessibility contracts are incomplete.");
Assert(new[] { "filled", "outlined", "borderless", "underlined", "clearable", "word-limit", "auto-size", "resize-none", "resize-vertical", "resize-horizontal", "resize-both", "mini", "small", "medium", "large" }.All(GardenerimCatalog.ByName["textarea"].Variants.Contains), "Textarea appearance, growth, resize, and sizing variants are incomplete.");
Assert(new[] { "normal", "focus", "success", "warning", "error", "invalid", "disabled", "read-only", "near-limit", "over-limit", "max-rows" }.All(GardenerimCatalog.ByName["textarea"].States.Contains), "Textarea interaction, validation, and limit states are incomplete.");
Assert(new[] { "g-textarea-control", "g-textarea-clear", "g-character-count" }.All(GardenerimCatalog.ByName["textarea"].Parts.Contains) && GardenerimCatalog.ByName["textarea"].Accessibility?.Roles.Contains("textbox") == true, "Textarea structure or accessibility contracts are incomplete.");
Assert(new[] { "filled", "outlined", "borderless", "underlined", "placeholder", "clearable", "with-prefix", "with-suffix", "multiple", "option-group", "auto-width", "block", "mini", "small", "medium", "large" }.All(GardenerimCatalog.ByName["select"].Variants.Contains), "Select native modes, appearance, composition, and sizing variants are incomplete.");
Assert(new[] { "default", "hover", "focus", "success", "warning", "error", "invalid", "disabled", "loading" }.All(GardenerimCatalog.ByName["select"].States.Contains), "Select interaction and validation states are incomplete.");
Assert(new[] { "g-select-control", "g-select-prefix", "g-select-suffix", "g-select-arrow", "g-select-spinner", "g-select-clear" }.All(GardenerimCatalog.ByName["select"].Parts.Contains) && new[] { "combobox", "listbox" }.All(GardenerimCatalog.ByName["select"].Accessibility!.Roles.Contains), "Select structure or accessibility contracts are incomplete.");
Assert(new[] { "filled", "outlined", "borderless", "underlined", "single", "multiple", "checkable", "searchable", "clearable", "cascade", "leaf-only", "parent-value", "with-header", "with-footer", "mini", "small", "medium", "large" }.All(GardenerimCatalog.ByName["tree-select"].Variants.Contains), "Tree select appearance, mode, search, and sizing variants are incomplete.");
Assert(new[] { "default", "open", "searching", "empty", "success", "warning", "error", "invalid", "loading", "disabled" }.All(GardenerimCatalog.ByName["tree-select"].States.Contains), "Tree select interaction and validation states are incomplete.");
Assert(new[] { "g-picker-control", "g-picker-values", "g-picker-input", "g-picker-clear", "g-picker-arrow", "g-picker-panel", "g-tree-list", "g-tree-node", "g-tree-toggle", "g-tree-checkbox", "g-tree-node-label" }.All(GardenerimCatalog.ByName["tree-select"].Parts.Contains) && new[] { "combobox", "tree", "treeitem", "group" }.All(GardenerimCatalog.ByName["tree-select"].Accessibility!.Roles.Contains), "Tree select structure or accessibility contracts are incomplete.");
Assert(new[] { "checkbox", "radio", "mini", "small", "medium", "large", "block", "bordered", "card", "reverse", "with-description" }.All(GardenerimCatalog.ByName["checkbox-radio"].Variants.Contains), "Checkbox and radio variants are incomplete.");
Assert(new[] { "checked", "indeterminate", "success", "warning", "error", "invalid", "disabled", "read-only" }.All(GardenerimCatalog.ByName["checkbox-radio"].States.Contains), "Checkbox and radio states are incomplete.");
Assert(new[] { "g-choice-content", "g-choice-label", "g-choice-description", "g-choice-extra" }.All(GardenerimCatalog.ByName["checkbox-radio"].Parts.Contains) && new[] { "checkbox", "radio" }.All(GardenerimCatalog.ByName["checkbox-radio"].Accessibility!.Roles.Contains), "Checkbox and radio structure or accessibility contracts are incomplete.");
Assert(GardenerimCatalog.ByName["checkbox-group"].DefaultTag == "fieldset" && GardenerimCatalog.ByName["checkbox-group"].Behaviors.Contains("row-select"), "Checkbox group semantic root or runtime contract is incomplete.");
Assert(new[] { "default", "stacked", "inline", "grid", "two", "three", "four", "buttons", "cards", "compact", "block", "small", "medium", "large" }.All(GardenerimCatalog.ByName["checkbox-group"].Variants.Contains), "Checkbox group layouts and sizes are incomplete.");
Assert(new[] { "default", "normal", "empty", "partial", "selected", "max", "success", "warning", "disabled", "read-only", "invalid", "error" }.All(GardenerimCatalog.ByName["checkbox-group"].States.Contains), "Checkbox group selection and validation states are incomplete.");
Assert(new[] { "g-choice-group-legend", "g-choice-group-options", "g-choice-group-option", "g-choice-group-select-all", "g-choice-group-count", "g-choice-group-help", "g-choice-group-feedback", "g-choice-group-status" }.All(GardenerimCatalog.ByName["checkbox-group"].Parts.Contains) && new[] { "group", "status", "alert" }.All(GardenerimCatalog.ByName["checkbox-group"].Accessibility!.Roles.Contains), "Checkbox group structure or accessibility contracts are incomplete.");
Assert(GardenerimCatalog.ByName["radio-group"].DefaultTag == "fieldset", "Radio group must render a semantic fieldset by default.");
Assert(new[] { "default", "stacked", "inline", "grid", "two", "three", "four", "buttons", "cards", "compact", "block", "small", "medium", "large" }.All(GardenerimCatalog.ByName["radio-group"].Variants.Contains), "Radio group layouts and sizes are incomplete.");
Assert(new[] { "default", "normal", "empty", "selected", "success", "warning", "disabled", "read-only", "invalid", "error" }.All(GardenerimCatalog.ByName["radio-group"].States.Contains), "Radio group selection and validation states are incomplete.");
Assert(new[] { "g-choice-group-legend", "g-choice-group-options", "g-choice-group-option", "g-choice-group-option-content", "g-choice-group-help", "g-choice-group-feedback", "g-choice-group-status" }.All(GardenerimCatalog.ByName["radio-group"].Parts.Contains) && new[] { "group", "radiogroup", "status", "alert" }.All(GardenerimCatalog.ByName["radio-group"].Accessibility!.Roles.Contains), "Radio group structure or accessibility contracts are incomplete.");
Assert(new[] { "mini", "small", "medium", "large", "wide", "inline-prompt", "square", "with-label", "block", "reverse", "bordered", "card" }.All(GardenerimCatalog.ByName["switch"].Variants.Contains), "Switch sizing, content, and layout variants are incomplete.");
Assert(GardenerimCatalog.ByName["switch-row"].DefaultTag == "label", "Switch row must render a whole-row label by default.");
Assert(new[] { "default", "plain", "compact", "spacious", "reverse", "bordered", "card", "block" }.All(GardenerimCatalog.ByName["switch-row"].Variants.Contains), "Switch row layouts are incomplete.");
Assert(new[] { "default", "normal", "unchecked", "checked", "success", "warning", "disabled", "loading", "read-only", "error", "invalid" }.All(GardenerimCatalog.ByName["switch-row"].States.Contains), "Switch row states are incomplete.");
Assert(new[] { "g-switch-row-content", "g-switch-row-title", "g-switch-row-description", "g-switch-row-meta", "g-switch-row-control", "g-switch-row-extra", "g-switch-row-status" }.All(GardenerimCatalog.ByName["switch-row"].Parts.Contains), "Switch row structure is incomplete.");
Assert(GardenerimCatalog.ByName["choice-card-group"].DefaultTag == "fieldset", "Choice card group must render a semantic fieldset by default.");
Assert(new[] { "default", "grid", "two", "three", "four", "single", "multiple", "compact", "spacious", "horizontal", "block" }.All(GardenerimCatalog.ByName["choice-card-group"].Variants.Contains), "Choice card group layouts are incomplete.");
Assert(new[] { "default", "normal", "empty", "selected", "success", "warning", "disabled", "read-only", "invalid", "error" }.All(GardenerimCatalog.ByName["choice-card-group"].States.Contains), "Choice card group states are incomplete.");
Assert(new[] { "g-choice-group-legend", "g-choice-group-options", "g-choice-card", "g-choice-card-input", "g-choice-card-header", "g-choice-card-title", "g-choice-card-description", "g-choice-card-meta", "g-choice-card-price", "g-choice-group-feedback", "g-choice-group-status" }.All(GardenerimCatalog.ByName["choice-card-group"].Parts.Contains), "Choice card group structure is incomplete.");
Assert(GardenerimCatalog.ByName["name-group"].DefaultTag == "fieldset", "Name group must render a semantic fieldset by default.");
Assert(new[] { "default", "western", "eastern", "full", "compact", "spacious", "two", "three", "four", "block" }.All(GardenerimCatalog.ByName["name-group"].Variants.Contains), "Name group layouts are incomplete.");
Assert(new[] { "default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error" }.All(GardenerimCatalog.ByName["name-group"].States.Contains), "Name group states are incomplete.");
Assert(new[] { "g-name-group-legend", "g-name-field", "g-name-given", "g-name-middle", "g-name-family", "g-name-phonetic", "g-name-preferred", "g-name-display", "g-name-group-feedback", "g-name-group-status" }.All(GardenerimCatalog.ByName["name-group"].Parts.Contains), "Name group structure is incomplete.");
Assert(GardenerimCatalog.ByName["address-group"].DefaultTag == "fieldset", "Address group must render a semantic fieldset by default.");
Assert(new[] { "default", "domestic", "international", "stacked", "card", "compact", "spacious", "block" }.All(GardenerimCatalog.ByName["address-group"].Variants.Contains), "Address group layouts are incomplete.");
Assert(new[] { "default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error" }.All(GardenerimCatalog.ByName["address-group"].States.Contains), "Address group states are incomplete.");
Assert(new[] { "g-address-group-legend", "g-address-field", "g-address-recipient", "g-address-line-1", "g-address-line-2", "g-address-country", "g-address-city", "g-address-region", "g-address-district", "g-address-postal", "g-address-group-feedback", "g-address-group-status" }.All(GardenerimCatalog.ByName["address-group"].Parts.Contains), "Address group structure is incomplete.");
Assert(GardenerimCatalog.ByName["phone-group"].DefaultTag == "fieldset", "Phone group must render a semantic fieldset by default.");
Assert(new[] { "default", "domestic", "international", "stacked", "card", "compact", "spacious", "block" }.All(GardenerimCatalog.ByName["phone-group"].Variants.Contains), "Phone group layouts are incomplete.");
Assert(new[] { "default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error" }.All(GardenerimCatalog.ByName["phone-group"].States.Contains), "Phone group states are incomplete.");
Assert(new[] { "g-phone-group-legend", "g-phone-field", "g-phone-country", "g-phone-country-code", "g-phone-national", "g-phone-extension", "g-phone-type", "g-phone-group-feedback", "g-phone-group-status", "g-phone-preview" }.All(GardenerimCatalog.ByName["phone-group"].Parts.Contains), "Phone group structure is incomplete.");
Assert(GardenerimCatalog.ByName["money-group"].DefaultTag == "fieldset", "Money group must render a semantic fieldset by default.");
Assert(new[] { "default", "domestic", "international", "accounting", "stacked", "card", "compact", "spacious", "block" }.All(GardenerimCatalog.ByName["money-group"].Variants.Contains), "Money group layouts are incomplete.");
Assert(new[] { "default", "normal", "success", "warning", "disabled", "read-only", "invalid", "error" }.All(GardenerimCatalog.ByName["money-group"].States.Contains), "Money group states are incomplete.");
Assert(new[] { "g-money-group-legend", "g-money-field", "g-money-currency", "g-money-amount", "g-money-control", "g-money-symbol", "g-money-tax", "g-money-exchange-rate", "g-money-converted", "g-money-group-feedback", "g-money-group-status" }.All(GardenerimCatalog.ByName["money-group"].Parts.Contains), "Money group structure is incomplete.");
Assert(GardenerimCatalog.ByName["date-range-group"].DefaultTag == "fieldset", "Date range group must render a semantic fieldset by default.");
Assert(new[] { "default", "date", "datetime", "inclusive", "exclusive", "stacked", "card", "compact", "spacious", "block" }.All(GardenerimCatalog.ByName["date-range-group"].Variants.Contains), "Date range group layouts are incomplete.");
Assert(new[] { "default", "normal", "partial", "complete", "success", "warning", "disabled", "read-only", "invalid", "error" }.All(GardenerimCatalog.ByName["date-range-group"].States.Contains), "Date range group states are incomplete.");
Assert(new[] { "g-date-range-legend", "g-date-range-field", "g-date-range-start", "g-date-range-end", "g-range-separator", "g-date-range-presets", "g-date-range-duration", "g-date-range-feedback", "g-date-range-status" }.All(GardenerimCatalog.ByName["date-range-group"].Parts.Contains), "Date range group structure is incomplete.");
Assert(new[] { "unchecked", "checked", "hover", "focus", "active", "disabled", "loading", "success", "warning", "danger", "error", "invalid", "read-only" }.All(GardenerimCatalog.ByName["switch"].States.Contains), "Switch interaction and semantic states are incomplete.");
Assert(new[] { "g-switch-track", "g-switch-handle", "g-switch-checked-content", "g-switch-unchecked-content", "g-switch-content", "g-switch-label", "g-switch-description", "g-switch-extra" }.All(GardenerimCatalog.ByName["switch"].Parts.Contains) && new[] { "switch", "checkbox" }.All(GardenerimCatalog.ByName["switch"].Accessibility!.Roles.Contains), "Switch structure or accessibility contracts are incomplete.");
Assert(new[] { "range", "color", "horizontal", "vertical", "reverse", "mini", "small", "medium", "large", "show-stops", "with-value", "with-input", "dual", "block", "circle", "with-label", "presets" }.All(GardenerimCatalog.ByName["range-color"].Variants.Contains), "Range and color sizing, orientation, value, and composition variants are incomplete.");
Assert(new[] { "active", "success", "warning", "error", "invalid", "disabled", "read-only" }.All(GardenerimCatalog.ByName["range-color"].States.Contains), "Range and color interaction and validation states are incomplete.");
Assert(new[] { "g-range-field", "g-range-value", "g-range-marks", "g-range-dual", "g-range-dual-fill", "g-color-field", "g-color-input", "g-color-value", "g-color-presets", "g-color-preset" }.All(GardenerimCatalog.ByName["range-color"].Parts.Contains) && new[] { "slider", "group" }.All(GardenerimCatalog.ByName["range-color"].Accessibility!.Roles.Contains), "Range and color structure or accessibility contracts are incomplete.");
Assert(new[] { "dragger", "button", "compact", "spacious", "block", "picture-card", "avatar", "multiple", "directory", "manual", "with-list", "picture-list" }.All(GardenerimCatalog.ByName["file-drop"].Variants.Contains), "File drop picker, layout, and list variants are incomplete.");
Assert(new[] { "default", "hover", "focus", "dragging", "validating", "uploading", "success", "error", "rejected", "disabled" }.All(GardenerimCatalog.ByName["file-drop"].States.Contains), "File drop interaction, validation, and upload states are incomplete.");
Assert(new[] { "g-file-drop-input", "g-file-drop-content", "g-file-drop-icon", "g-file-drop-title", "g-file-drop-description", "g-file-drop-rules", "g-file-drop-browse", "g-file-drop-feedback", "g-file-drop-list", "g-file-drop-item", "g-file-drop-progress-bar", "g-file-drop-remove", "g-file-drop-retry" }.All(GardenerimCatalog.ByName["file-drop"].Parts.Contains) && new[] { "button", "group", "status" }.All(GardenerimCatalog.ByName["file-drop"].Accessibility!.Roles.Contains), "File drop structure or accessibility contracts are incomplete.");
Assert(new[] { "filled", "outlined", "borderless", "underlined", "inline", "block", "clearable", "with-prefix", "grouped", "remote", "allow-create", "mini", "small", "medium", "large" }.All(GardenerimCatalog.ByName["combobox"].Variants.Contains), "Combobox appearance, suggestion, creation, and sizing variants are incomplete.");
Assert(new[] { "default", "open", "searching", "loading", "empty", "has-value", "success", "warning", "error", "invalid", "disabled", "read-only" }.All(GardenerimCatalog.ByName["combobox"].States.Contains), "Combobox interaction, async, value, and validation states are incomplete.");
Assert(new[] { "g-combobox-control", "g-combobox-input", "g-combobox-clear", "g-combobox-toggle", "g-combobox-spinner", "g-combobox-status", "g-combobox-list", "g-combobox-group", "g-combobox-group-label", "g-combobox-option", "g-combobox-option-title", "g-combobox-option-description", "g-combobox-create", "g-combobox-empty", "g-combobox-loading" }.All(GardenerimCatalog.ByName["combobox"].Parts.Contains) && new[] { "combobox", "listbox", "option", "group", "status" }.All(GardenerimCatalog.ByName["combobox"].Accessibility!.Roles.Contains), "Combobox structure or accessibility contracts are incomplete.");
Assert(new[] { "bordered", "vertical", "horizontal", "inline", "compact", "spacious" }.All(GardenerimCatalog.ByName["form"].Variants.Contains), "Form layout and density variants are incomplete.");
Assert(new[] { "default", "submitting", "validated", "success", "error", "disabled", "read-only" }.All(GardenerimCatalog.ByName["form"].States.Contains), "Form lifecycle and availability states are incomplete.");
Assert(new[] { "g-form-header", "g-form-title", "g-form-description", "g-form-body", "g-form-summary", "g-form-status", "g-form-actions" }.All(GardenerimCatalog.ByName["form"].Parts.Contains) && new[] { "form", "group", "alert", "status" }.All(GardenerimCatalog.ByName["form"].Accessibility!.Roles.Contains), "Form structure or accessibility contracts are incomplete.");
Assert(new[] { "vertical", "horizontal", "inline", "compact", "spacious", "label-hidden", "required-mark", "optional-mark", "block" }.All(GardenerimCatalog.ByName["field"].Variants.Contains), "Field layout, density, and label variants are incomplete.");
Assert(new[] { "pristine", "dirty", "touched", "validating", "success", "warning", "error", "invalid", "disabled", "read-only" }.All(GardenerimCatalog.ByName["field"].States.Contains), "Field validation lifecycle and availability states are incomplete.");
Assert(new[] { "g-field-label-content", "g-field-label", "g-field-control", "g-field-prefix", "g-field-suffix", "g-field-actions", "g-field-action", "g-field-messages", "g-field-help", "g-field-feedback", "g-field-counter", "g-field-status" }.All(GardenerimCatalog.ByName["field"].Parts.Contains) && new[] { "group", "status", "alert" }.All(GardenerimCatalog.ByName["field"].Accessibility!.Roles.Contains) && GardenerimCatalog.ByName["fieldset"].Parts.Contains("g-fieldset-content"), "Form field and fieldset structures are incomplete.");
Assert(new[] { "bordered", "subtle", "card", "plain", "compact", "spacious", "inline", "grid", "two-columns", "three-columns", "choice-cards", "block" }.All(GardenerimCatalog.ByName["fieldset"].Variants.Contains), "Fieldset appearance, density, and group layouts are incomplete.");
Assert(new[] { "focus", "active", "complete", "success", "warning", "invalid", "error", "disabled", "read-only" }.All(GardenerimCatalog.ByName["fieldset"].States.Contains), "Fieldset validation and availability states are incomplete.");
Assert(new[] { "g-fieldset-legend", "g-fieldset-legend-content", "g-fieldset-title", "g-fieldset-description", "g-fieldset-meta", "g-fieldset-badge", "g-fieldset-content", "g-fieldset-actions", "g-fieldset-help", "g-fieldset-feedback", "g-fieldset-status" }.All(GardenerimCatalog.ByName["fieldset"].Parts.Contains) && new[] { "group", "radiogroup", "status", "alert" }.All(GardenerimCatalog.ByName["fieldset"].Accessibility!.Roles.Contains), "Fieldset structure or accessibility contracts are incomplete.");
Assert(new[] { "auto", "one", "two", "three", "four", "split", "sidebar-start", "sidebar-end", "compact", "spacious", "align-start", "align-center", "align-end", "align-baseline", "stretch", "dense", "block" }.All(GardenerimCatalog.ByName["form-row"].Variants.Contains), "Form row columns, proportions, density, and alignment variants are incomplete.");
Assert(new[] { "invalid", "error", "disabled", "read-only" }.All(GardenerimCatalog.ByName["form-row"].States.Contains), "Form row contextual states are incomplete.");
Assert(new[] { "g-form-row-item", "g-form-row-main", "g-form-row-aside", "g-form-row-actions", "g-form-row-divider", "g-form-row-span-2", "g-form-row-span-3", "g-form-row-span-full", "g-form-row-start-2", "g-form-row-start-3" }.All(GardenerimCatalog.ByName["form-row"].Parts.Contains) && GardenerimCatalog.ByName["form-row"].Accessibility!.Roles.Contains("group"), "Form row structure or accessibility contracts are incomplete.");
Assert(new[] { "auto", "one", "two", "three", "four", "six", "twelve", "compact", "spacious", "dense", "align-start", "align-center", "align-end", "stretch", "full-span", "block" }.All(GardenerimCatalog.ByName["form-grid"].Variants.Contains), "Form grid columns, density, packing, and alignment variants are incomplete.");
Assert(new[] { "invalid", "error", "disabled", "read-only" }.All(GardenerimCatalog.ByName["form-grid"].States.Contains), "Form grid contextual states are incomplete.");
Assert(new[] { "g-form-grid-item", "g-form-grid-section", "g-form-grid-actions", "g-form-grid-divider", "g-form-grid-span-2", "g-form-grid-span-3", "g-form-grid-span-4", "g-form-grid-span-6", "g-form-grid-span-full", "g-form-grid-row-span-2", "g-form-grid-row-span-3", "g-form-grid-start-2", "g-form-grid-start-3", "g-form-grid-start-4" }.All(GardenerimCatalog.ByName["form-grid"].Parts.Contains) && GardenerimCatalog.ByName["form-grid"].Accessibility!.Roles.Contains("group"), "Form grid structure or accessibility contracts are incomplete.");
Assert(new[] { "label-sm", "label-md", "label-lg", "compact", "spacious", "label-start", "label-center", "label-end", "stacked", "bordered", "block" }.All(GardenerimCatalog.ByName["horizontal-form"].Variants.Contains), "Horizontal form label width, density, alignment, and appearance variants are incomplete.");
Assert(new[] { "invalid", "error", "success", "disabled", "read-only", "busy" }.All(GardenerimCatalog.ByName["horizontal-form"].States.Contains), "Horizontal form contextual states are incomplete.");
Assert(new[] { "g-form-horizontal-header", "g-form-horizontal-body", "g-form-horizontal-row", "g-form-horizontal-label", "g-form-horizontal-content", "g-form-horizontal-control", "g-form-horizontal-help", "g-form-horizontal-feedback", "g-form-horizontal-actions", "g-form-horizontal-divider" }.All(GardenerimCatalog.ByName["horizontal-form"].Parts.Contains) && new[] { "form", "group", "alert", "status" }.All(GardenerimCatalog.ByName["horizontal-form"].Accessibility!.Roles.Contains), "Horizontal form structure or accessibility contracts are incomplete.");
Assert(new[] { "wrap", "nowrap", "compact", "spacious", "align-start", "align-center", "align-end", "stretch", "field-sm", "field-md", "field-lg", "stacked", "bordered", "block" }.All(GardenerimCatalog.ByName["inline-form"].Variants.Contains), "Inline form wrapping, density, alignment, and field width variants are incomplete.");
Assert(new[] { "invalid", "error", "success", "disabled", "read-only", "busy", "submitted" }.All(GardenerimCatalog.ByName["inline-form"].States.Contains), "Inline form contextual states are incomplete.");
Assert(new[] { "g-form-inline-field", "g-form-inline-field-grow", "g-form-inline-field-fixed", "g-form-inline-label", "g-form-inline-control", "g-form-inline-help", "g-form-inline-feedback", "g-form-inline-actions", "g-form-inline-status", "g-form-inline-divider" }.All(GardenerimCatalog.ByName["inline-form"].Parts.Contains) && new[] { "form", "group", "alert", "status" }.All(GardenerimCatalog.ByName["inline-form"].Accessibility!.Roles.Contains), "Inline form structure or accessibility contracts are incomplete.");
Assert(GardenerimCatalog.ByName["compact-form"].DefaultTag == "form" && new[] { "vertical", "inline", "joined", "two-columns", "three-columns", "tight", "comfortable", "bordered", "subtle", "block" }.All(GardenerimCatalog.ByName["compact-form"].Variants.Contains), "Compact form layout, density, and appearance variants are incomplete.");
Assert(new[] { "invalid", "error", "success", "disabled", "read-only", "busy", "submitted" }.All(GardenerimCatalog.ByName["compact-form"].States.Contains), "Compact form contextual states are incomplete.");
Assert(new[] { "g-compact-form-header", "g-compact-form-body", "g-compact-form-field", "g-compact-form-label", "g-compact-form-control", "g-compact-form-help", "g-compact-form-feedback", "g-compact-form-actions", "g-compact-form-status", "g-compact-form-divider", "g-compact-form-span-full" }.All(GardenerimCatalog.ByName["compact-form"].Parts.Contains) && new[] { "form", "group", "alert", "status" }.All(GardenerimCatalog.ByName["compact-form"].Accessibility!.Roles.Contains), "Compact form structure or accessibility contracts are incomplete.");
Assert(new[] { "joined", "separated", "stacked", "block", "compact", "responsive", "mini", "small", "medium", "large", "filled", "outlined", "borderless" }.All(GardenerimCatalog.ByName["input-group"].Variants.Contains), "Input group composition, density, and appearance variants are incomplete.");
Assert(new[] { "focus", "success", "warning", "error", "invalid", "disabled", "read-only", "loading" }.All(GardenerimCatalog.ByName["input-group"].States.Contains), "Input group contextual states are incomplete.");
Assert(new[] { "g-input-group-label", "g-input-group-control", "g-input-addon", "g-input-prepend", "g-input-append", "g-input-search-button", "g-input-group-divider", "g-input-group-help", "g-input-group-feedback", "g-input-group-status" }.All(GardenerimCatalog.ByName["input-group"].Parts.Contains) && new[] { "group", "search", "status", "alert" }.All(GardenerimCatalog.ByName["input-group"].Accessibility!.Roles.Contains), "Input group structure or accessibility contracts are incomplete.");
Assert(new[] { "default", "filled", "outlined", "borderless", "underlined", "block", "compact", "mini", "small", "medium", "large", "prefix", "suffix", "clearable", "loading" }.All(GardenerimCatalog.ByName["input-affix"].Variants.Contains), "Input affix appearance, sizing, and composition variants are incomplete.");
Assert(new[] { "default", "hover", "focus", "success", "warning", "error", "invalid", "loading", "disabled", "read-only" }.All(GardenerimCatalog.ByName["input-affix"].States.Contains), "Input affix contextual states are incomplete.");
Assert(new[] { "g-input-affix-label", "g-input-affix-control", "g-input-affix-start", "g-input-affix-end", "g-input-prefix", "g-input-suffix", "g-input-affix-action", "g-input-clear", "g-input-spinner", "g-input-affix-help", "g-input-affix-feedback", "g-input-affix-status" }.All(GardenerimCatalog.ByName["input-affix"].Parts.Contains) && new[] { "group", "status", "alert" }.All(GardenerimCatalog.ByName["input-affix"].Accessibility!.Roles.Contains), "Input affix structure or accessibility contracts are incomplete.");
Assert(new[] { "default", "icon", "button", "custom-button", "clearable", "responsive", "block", "compact", "filled", "outlined", "borderless", "underlined", "mini", "small", "medium", "large" }.All(GardenerimCatalog.ByName["search-field"].Variants.Contains), "Search field composition, appearance, and sizing variants are incomplete.");
Assert(new[] { "default", "hover", "focus", "searching", "loading", "empty", "results", "success", "warning", "error", "invalid", "disabled", "read-only" }.All(GardenerimCatalog.ByName["search-field"].States.Contains), "Search field lifecycle and contextual states are incomplete.");
Assert(new[] { "g-search-field-label", "g-search-field-control", "g-search-field-input-wrap", "g-search-field-icon", "g-search-field-input", "g-search-field-clear", "g-search-field-action", "g-search-field-spinner", "g-search-field-shortcut", "g-search-field-help", "g-search-field-feedback", "g-search-field-status", "g-search-field-result-count" }.All(GardenerimCatalog.ByName["search-field"].Parts.Contains) && new[] { "search", "status", "alert" }.All(GardenerimCatalog.ByName["search-field"].Accessibility!.Roles.Contains), "Search field structure or accessibility contracts are incomplete.");
Assert(new[] { "default", "textarea", "input", "inline", "block", "compact", "count", "remaining", "soft-limit", "hard-limit", "mini", "small", "medium", "large" }.All(GardenerimCatalog.ByName["character-counter"].Variants.Contains), "Character counter control, display, limit, and sizing variants are incomplete.");
Assert(new[] { "default", "empty", "typing", "near-limit", "at-limit", "over-limit", "invalid", "disabled", "read-only" }.All(GardenerimCatalog.ByName["character-counter"].States.Contains), "Character counter lifecycle and validation states are incomplete.");
Assert(new[] { "g-character-field-label", "g-character-field-control", "g-character-field-input", "g-character-count", "g-character-count-current", "g-character-count-separator", "g-character-count-maximum", "g-character-field-help", "g-character-field-feedback", "g-character-field-status" }.All(GardenerimCatalog.ByName["character-counter"].Parts.Contains) && new[] { "status", "alert" }.All(GardenerimCatalog.ByName["character-counter"].Accessibility!.Roles.Contains), "Character counter structure or accessibility contracts are incomplete.");
Assert(new[] { "default", "block", "inline", "with-icon", "reserve-message", "compact", "mini", "small", "medium", "large" }.All(GardenerimCatalog.ByName["validation-state"].Variants.Contains), "Validation state layout, message, icon, and sizing variants are incomplete.");
Assert(new[] { "default", "focus", "success", "warning", "danger", "error", "invalid", "validating", "disabled", "read-only" }.All(GardenerimCatalog.ByName["validation-state"].States.Contains), "Validation state lifecycle and semantic states are incomplete.");
Assert(new[] { "g-validation-label", "g-validation-required", "g-validation-control", "g-validation-input", "g-validation-icon", "g-validation-message", "g-validation-help", "g-validation-status" }.All(GardenerimCatalog.ByName["validation-state"].Parts.Contains) && new[] { "status", "alert" }.All(GardenerimCatalog.ByName["validation-state"].Accessibility!.Roles.Contains), "Validation state structure or accessibility contracts are incomplete.");
Assert(new[] { "divided", "bordered", "card", "subtle", "compact", "spacious", "numbered", "nested", "collapsible", "no-divider" }.All(GardenerimCatalog.ByName["form-section"].Variants.Contains), "Form section appearance, density, nesting, and disclosure variants are incomplete.");
Assert(new[] { "default", "active", "complete", "error", "invalid", "disabled", "collapsed", "expanded" }.All(GardenerimCatalog.ByName["form-section"].States.Contains), "Form section task and validation states are incomplete.");
Assert(new[] { "g-form-section-header", "g-form-section-heading", "g-form-section-number", "g-form-section-title", "g-form-section-actions", "g-form-section-toggle", "g-form-section-body", "g-form-section-summary", "g-form-section-footer" }.All(GardenerimCatalog.ByName["form-section"].Parts.Contains) && new[] { "region", "group", "status", "alert" }.All(GardenerimCatalog.ByName["form-section"].Accessibility!.Roles.Contains), "Form section structure or accessibility contracts are incomplete.");
Assert(new[] { "filled", "outlined", "borderless", "underlined", "clearable", "no-toggle", "hide-on-blur", "with-prefix", "with-strength", "block", "mini", "small", "medium", "large" }.All(GardenerimCatalog.ByName["password-field"].Variants.Contains), "Password field appearance, visibility, composition, and sizing variants are incomplete.");
Assert(new[] { "default", "hidden", "visible", "hover", "focus", "success", "warning", "error", "invalid", "disabled", "read-only", "caps-lock" }.All(GardenerimCatalog.ByName["password-field"].States.Contains), "Password field interaction, validation, and security states are incomplete.");
Assert(new[] { "g-password-field-prefix", "g-password-field-input", "g-password-field-suffix", "g-password-field-action", "g-password-toggle", "g-password-toggle-icon", "g-password-clear", "g-password-field-caps" }.All(GardenerimCatalog.ByName["password-field"].Parts.Contains) && GardenerimCatalog.ByName["password-field"].Accessibility?.Roles.Contains("group") == true, "Password field structure or accessibility contracts are incomplete.");
Assert(new[] { "filled", "outlined", "borderless", "underlined", "interaction", "always-visible", "clear-on-escape", "with-prefix", "with-suffix", "textarea", "select", "block", "mini", "small", "medium", "large" }.All(GardenerimCatalog.ByName["clearable-field"].Variants.Contains), "Clearable field appearance, content, visibility, and sizing variants are incomplete.");
Assert(new[] { "default", "empty", "has-value", "hover", "focus", "clearing", "cleared", "success", "warning", "error", "invalid", "disabled", "read-only" }.All(GardenerimCatalog.ByName["clearable-field"].States.Contains), "Clearable field interaction and validation states are incomplete.");
Assert(new[] { "g-clearable-field-prefix", "g-clearable-field-control", "g-clearable-field-input", "g-clearable-field-suffix", "g-clearable-field-action", "g-clearable-field-icon", "g-input-clear", "g-textarea-clear" }.All(GardenerimCatalog.ByName["clearable-field"].Parts.Contains) && GardenerimCatalog.ByName["clearable-field"].Accessibility?.Roles.Contains("group") == true, "Clearable field structure or accessibility contracts are incomplete.");
Assert(new[] { "primary", "subtle", "bordered", "elevated", "compact", "comfortable", "responsive", "scrollable", "sticky", "fixed", "contained" }.All(GardenerimCatalog.ByName["status-bar"].Variants.Contains), "Status bar appearance, density, overflow, and positioning variants are incomplete.");
Assert(new[] { "normal", "info", "success", "warning", "danger", "error", "loading", "offline", "disabled" }.All(GardenerimCatalog.ByName["status-bar"].States.Contains), "Status bar semantic and lifecycle states are incomplete.");
Assert(new[] { "g-status-bar-section", "g-status-bar-item", "g-status-bar-icon", "g-status-bar-label", "g-status-bar-value", "g-status-bar-progress", "g-status-bar-live" }.All(GardenerimCatalog.ByName["status-bar"].Parts.Contains) && new[] { "status", "toolbar", "contentinfo" }.All(GardenerimCatalog.ByName["status-bar"].Accessibility!.Roles.Contains), "Status bar structure or accessibility contracts are incomplete.");
Assert(new[] { "soft", "outlined", "filled", "banner", "borderless", "center", "compact", "spacious", "stacked", "sticky", "dismissible", "no-icon", "with-title" }.All(GardenerimCatalog.ByName["context-bar"].Variants.Contains), "Context bar appearance, density, reflow, and dismissal variants are incomplete.");
Assert(new[] { "normal", "info", "success", "warning", "danger", "error", "loading", "disabled" }.All(GardenerimCatalog.ByName["context-bar"].States.Contains), "Context bar semantic and loading states are incomplete.");
Assert(new[] { "g-context-bar-icon", "g-context-bar-body", "g-context-bar-title", "g-context-bar-description", "g-context-bar-actions", "g-context-bar-action", "g-context-bar-close", "g-context-bar-progress" }.All(GardenerimCatalog.ByName["context-bar"].Parts.Contains) && new[] { "status", "alert", "region" }.All(GardenerimCatalog.ByName["context-bar"].Accessibility!.Roles.Contains), "Context bar structure or accessibility contracts are incomplete.");
Assert(new[] { "inline", "contained", "card", "full", "overlay", "fullscreen", "dimmed", "compact", "small", "medium", "large", "delayed", "no-indicator" }.All(GardenerimCatalog.ByName["page-loading"].Variants.Contains), "Page loading layout, density, and presentation variants are incomplete.");
Assert(new[] { "loading", "determinate", "indeterminate", "paused", "stalled", "success", "error", "cancelled", "disabled", "hidden" }.All(GardenerimCatalog.ByName["page-loading"].States.Contains), "Page loading lifecycle states are incomplete.");
Assert(new[] { "g-page-loading-indicator", "g-page-loading-title", "g-page-loading-description", "g-page-loading-progress", "g-page-loading-step", "g-page-loading-actions", "g-page-loading-host", "g-page-loading-container" }.All(GardenerimCatalog.ByName["page-loading"].Parts.Contains) && new[] { "status", "progressbar", "alert" }.All(GardenerimCatalog.ByName["page-loading"].Accessibility!.Roles.Contains), "Page loading structure or accessibility contracts are incomplete.");
Assert(new[] { "empty", "no-results", "first-use", "success", "info", "warning", "error", "403", "404", "500", "offline", "maintenance", "browser-unsupported", "compact", "inline", "card", "full-page", "split", "left", "no-visual" }.All(GardenerimCatalog.ByName["page-state-system"].Variants.Contains), "Page state result, exception, and layout variants are incomplete.");
Assert(new[] { "normal", "success", "info", "warning", "error", "forbidden", "not-found", "server-error", "offline", "maintenance", "disabled" }.All(GardenerimCatalog.ByName["page-state-system"].States.Contains), "Page state semantic and lifecycle states are incomplete.");
Assert(new[] { "g-page-state-body", "g-page-state-visual", "g-page-state-code", "g-page-state-title", "g-page-state-metadata", "g-page-state-details", "g-page-state-detail-summary", "g-page-state-actions", "g-page-state-primary-action", "g-page-state-suggestions" }.All(GardenerimCatalog.ByName["page-state-system"].Parts.Contains) && new[] { "status", "alert", "region" }.All(GardenerimCatalog.ByName["page-state-system"].Accessibility!.Roles.Contains), "Page state structure or accessibility contracts are incomplete.");

var parameters = typeof(GardenerimComponentBase).GetProperties(BindingFlags.Instance | BindingFlags.Public)
    .Where(property => property.GetCustomAttribute<ParameterAttribute>() is not null)
    .Select(property => property.Name)
    .OrderBy(name => name, StringComparer.Ordinal)
    .ToArray();
var expectedParameters = new[] { "AdditionalAttributes", "As", "ChildContent", "Class", "Config", "EventNames", "Id", "Initialize", "OnEvent", "OnValueChange", "PreventDefaultEvents", "State", "States", "Style", "Value", "ValueChanged", "ValueEvent", "ValueKey", "Variant", "Variants" }.OrderBy(name => name, StringComparer.Ordinal);
Assert(parameters.SequenceEqual(expectedParameters.Concat(new[] { "Navigation", "BeforeNavigationChange", "Table" }).OrderBy(name => name, StringComparer.Ordinal)), "GardenerimComponentBase parameter contract changed.");
Assert(typeof(GardenerimNavigationOptions).GetProperty("Items") is not null && typeof(GardenerimNavigationOptions).GetProperty("ExpandedKeys") is not null && typeof(GardenerimNavigationOptions).GetProperty("PageSize") is not null, "Shared navigation options must include data, tree, and pagination contracts.");

var handles = new[] { "Element", "RefreshAsync", "DestroyAsync", "FocusAsync", "GetBehaviorMembersAsync", "InvokeBehaviorAsync" };
Assert(handles.All(name => typeof(GardenerimComponentBase).GetMember(name, BindingFlags.Instance | BindingFlags.Public).Length > 0), "Component handle API is incomplete.");
Assert(typeof(GardenerimField<>).BaseType?.GetGenericTypeDefinition().Name == "InputBase`1", "GardenerimField<TValue> must integrate with EditForm.");

var services = new ServiceCollection();
services.AddLogging();
services.AddSingleton<IJSRuntime, NullJsRuntime>();
services.AddGardenerimBlazor(options => options.JavaScriptModulePath = "./test.js");
await using var provider = services.BuildServiceProvider(validateScopes: true);
await using (var scope = provider.CreateAsyncScope())
{
    Assert(scope.ServiceProvider.GetRequiredService<GardenerimRuntime>() is not null, "Runtime DI registration failed.");
    Assert(scope.ServiceProvider.GetRequiredService<GardenerimThemeService>() is not null, "Theme DI registration failed.");
    Assert(scope.ServiceProvider.GetRequiredService<GardenerimLocalizationService>() is not null, "Localization DI registration failed.");
    Assert(scope.ServiceProvider.GetRequiredService<GardenerimToastService>() is not null, "Toast DI registration failed.");
    Assert(scope.ServiceProvider.GetRequiredService<GardenerimTauriService>() is not null, "Tauri DI registration failed.");
    Assert(scope.ServiceProvider.GetRequiredService<GardenerimElectronService>() is not null, "Electron DI registration failed.");
}

await using var renderScope = provider.CreateAsyncScope();
await using (var renderer = new HtmlRenderer(renderScope.ServiceProvider, renderScope.ServiceProvider.GetRequiredService<ILoggerFactory>()))
{
    await renderer.Dispatcher.InvokeAsync(async () =>
    {
        foreach (var type in generated)
        {
            var rendered = await renderer.RenderComponentAsync(type, ParameterView.Empty);
            var html = rendered.ToHtmlString();
            var definition = GardenerimCatalog.ByComponentType[type.Name];
            Assert(!string.IsNullOrWhiteSpace(html), $"Static SSR produced no HTML for {type.Name}.");
            if (definition.ClassName is not null) Assert(html.Contains(definition.ClassName, StringComparison.Ordinal), $"Static SSR omitted root class for {type.Name}.");
            foreach (var behavior in definition.Behaviors) Assert(html.Contains($"data-g-{ToKebab(behavior)}", StringComparison.Ordinal), $"Static SSR omitted behavior {behavior} for {type.Name}.");
        }

        var attributes = new Dictionary<string, object> { ["class"] = "external", ["style"] = "color:red" };
        var config = new Dictionary<string, object?> { ["maxItems"] = 3, ["data-g-selection"] = new[] { "a", "b" } };
        var probe = await renderer.RenderComponentAsync<GButton>(ParameterView.FromDictionary(new Dictionary<string, object?>
        {
            [nameof(GardenerimComponentBase.AdditionalAttributes)] = attributes,
            [nameof(GardenerimComponentBase.Class)] = "local",
            [nameof(GardenerimComponentBase.Style)] = "background:blue",
            [nameof(GardenerimComponentBase.Variant)] = "primary round mini",
            [nameof(GardenerimComponentBase.State)] = "success",
            [nameof(GardenerimComponentBase.Config)] = config
        }));
        var probeHtml = probe.ToHtmlString();
        Assert(probeHtml.StartsWith("<button", StringComparison.Ordinal) && probeHtml.Contains("type=\"button\"", StringComparison.Ordinal), "Button semantic SSR contract failed.");
        Assert(probeHtml.Contains("external local g-btn g-btn-primary g-btn-round g-btn-mini is-success", StringComparison.Ordinal), "Class/variant/state merge failed.");
        Assert(probeHtml.Contains("color:red;background:blue", StringComparison.Ordinal), "Style merge failed.");
        Assert(probeHtml.Contains("data-g-max-items=\"3\"", StringComparison.Ordinal) && probeHtml.Contains("data-g-selection=", StringComparison.Ordinal), "Configuration attribute normalization failed.");
    });
}

var root = FindRoot();
var publicApi = JsonDocument.Parse(File.ReadAllText(Path.Combine(root, "metadata", "public-api.json"))).RootElement;
Assert(publicApi.GetProperty("version").GetString() == "2.2.0", "Public API version must be 2.2.0.");
Assert(publicApi.GetProperty("targetFramework").GetString() == "net10.0", "Stable target must be net10.0.");
Assert(publicApi.GetProperty("compatibleFrameworks").EnumerateArray().Any(item => item.GetString() == "net11.0"), "net11.0 compatibility declaration missing.");
Assert(publicApi.GetProperty("components").GetInt32() == 575 && publicApi.GetProperty("behaviors").GetInt32() == 96, "Metadata counts are incorrect.");

if (failures.Count > 0)
{
    Console.Error.WriteLine($"Contract failures ({failures.Count}):");
    failures.ForEach(failure => Console.Error.WriteLine($"- {failure}"));
    return 1;
}

Console.WriteLine("Gardenerim.Blazor contracts passed: 575 SSR renders, 96 behaviors, 105 events, 42 themes, DI, forms, handles, metadata, net10/net11 boundary.");
return 0;

static string FindRoot()
{
    var current = new DirectoryInfo(Environment.CurrentDirectory);
    while (current is not null)
    {
        if (File.Exists(Path.Combine(current.FullName, "package.json")) && Directory.Exists(Path.Combine(current.FullName, "src", "Gardenerim.Blazor"))) return current.FullName;
        current = current.Parent;
    }
    throw new DirectoryNotFoundException("Unable to locate the blazor workspace root.");
}

static string ToKebab(string value) => string.Concat(value.Select((character, index) => char.IsUpper(character) && index > 0 ? $"-{char.ToLowerInvariant(character)}" : char.ToLowerInvariant(character).ToString())).Replace('_', '-');

sealed class NullJsRuntime : IJSRuntime
{
    public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args) => new(default(TValue)!);
    public ValueTask<TValue> InvokeAsync<TValue>(string identifier, CancellationToken cancellationToken, object?[]? args) => new(default(TValue)!);
}
