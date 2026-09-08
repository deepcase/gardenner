# Gardenerim DOM 行为完整目录

共 96 个行为，无省略。生成组件按元数据自动初始化；任意元素可使用 `GardenerimBehavior`；`GardenerimRuntimeCatalog` 提供机器可读成员契约。

| 行为名 | 属性 | 实例成员 | C# 常量 |
| --- | --- | --- | --- |
| `dialog` | `data-g-dialog` | `open`, `close`, `toggle`, `isOpen`, `setBusy`, `complete`, `destroy` | `GardenerimBehaviors.Dialog` |
| `drawer` | `data-g-drawer` | `open`, `close`, `toggle`, `isOpen`, `setBusy`, `complete`, `destroy` | `GardenerimBehaviors.Drawer` |
| `mobile-sheet` | `data-g-mobile-sheet` | `open`, `close`, `toggle`, `isOpen`, `setBusy`, `complete`, `destroy` | `GardenerimBehaviors.MobileSheet` |
| `dropdown` | `data-g-dropdown` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerimBehaviors.Dropdown` |
| `stepper` | `data-g-stepper` | `current`, `select`, `next`, `previous`, `refresh`, `destroy` | `GardenerimBehaviors.Stepper` |
| `tag` | `data-g-tag` | `check`, `close`, `setOptions`, `getState`, `refresh`, `destroy` | `GardenerimBehaviors.Tag` |
| `tabs` | `data-g-tabs` | `select`, `destroy` | `GardenerimBehaviors.Tabs` |
| `accordion` | `data-g-accordion` | `toggle`, `open`, `close`, `value`, `refresh`, `destroy` | `GardenerimBehaviors.Accordion` |
| `auto-resize` | `data-g-auto-resize` | `resize`, `destroy` | `GardenerimBehaviors.AutoResize` |
| `combobox` | `data-g-combobox` | `open`, `close`, `choose`, `clear`, `search`, `destroy` | `GardenerimBehaviors.Combobox` |
| `password-toggle` | `data-g-password-toggle` | `toggle`, `destroy` | `GardenerimBehaviors.PasswordToggle` |
| `clear-input` | `data-g-clear-input` | `clear`, `update`, `destroy` | `GardenerimBehaviors.ClearInput` |
| `otp-input` | `data-g-otp-input` | `value`, `fill`, `clear`, `destroy` | `GardenerimBehaviors.OtpInput` |
| `password-strength` | `data-g-password-strength` | `update`, `destroy` | `GardenerimBehaviors.PasswordStrength` |
| `auth-timer` | `data-g-auth-timer` | `start`, `reset`, `expire`, `remaining`, `destroy` | `GardenerimBehaviors.AuthTimer` |
| `quantity-stepper` | `data-g-quantity-stepper` | `value`, `set`, `increment`, `decrement`, `destroy` | `GardenerimBehaviors.QuantityStepper` |
| `sku-selector` | `data-g-sku-selector` | `value`, `select`, `destroy` | `GardenerimBehaviors.SkuSelector` |
| `cart` | `data-g-cart` | `update`, `summary`, `destroy` | `GardenerimBehaviors.Cart` |
| `coupon` | `data-g-coupon` | `apply`, `clear`, `state`, `destroy` | `GardenerimBehaviors.Coupon` |
| `pull-refresh` | `data-g-pull-refresh` | `refresh`, `complete`, `isRefreshing`, `destroy` | `GardenerimBehaviors.PullRefresh` |
| `infinite-load` | `data-g-infinite-load` | `load`, `complete`, `isLoading`, `destroy` | `GardenerimBehaviors.InfiniteLoad` |
| `swipe-actions` | `data-g-swipe-actions` | `reveal`, `close`, `toggle`, `destroy` | `GardenerimBehaviors.SwipeActions` |
| `wheel-picker` | `data-g-wheel-picker` | `select`, `values`, `destroy` | `GardenerimBehaviors.WheelPicker` |
| `ai-composer` | `data-g-ai-composer` | `submit`, `stop`, `setStreaming`, `value`, `focus`, `destroy` | `GardenerimBehaviors.AiComposer` |
| `prompt-fill` | `data-g-prompt-fill` | `fill`, `destroy` | `GardenerimBehaviors.PromptFill` |
| `ai-approval` | `data-g-ai-approval` | `choose`, `reset`, `destroy` | `GardenerimBehaviors.AiApproval` |
| `ai-feedback` | `data-g-ai-feedback` | `select`, `submit`, `value`, `destroy` | `GardenerimBehaviors.AiFeedback` |
| `shortcut-recorder` | `data-g-shortcut-recorder` | `start`, `stop`, `clear`, `value`, `destroy` | `GardenerimBehaviors.ShortcutRecorder` |
| `desktop-tabs` | `data-g-desktop-tabs` | `select`, `close`, `tabs`, `destroy` | `GardenerimBehaviors.DesktopTabs` |
| `native-file-picker` | `data-g-native-file-picker` | `open`, `files`, `clear`, `destroy` | `GardenerimBehaviors.NativeFilePicker` |
| `window-switcher` | `data-g-window-switcher` | `open`, `close`, `select`, `isOpen`, `destroy` | `GardenerimBehaviors.WindowSwitcher` |
| `character-count` | `data-g-character-count` | `update`, `destroy` | `GardenerimBehaviors.CharacterCount` |
| `field-sync` | `data-g-field-sync` | `sync`, `value`, `destroy` | `GardenerimBehaviors.FieldSync` |
| `conditional-field` | `data-g-conditional-field` | `update`, `value`, `values`, `controllers`, `isVisible`, `isResolved`, `destroy` | `GardenerimBehaviors.ConditionalField` |
| `rating` | `data-g-rating` | `value`, `setValue`, `clear`, `refresh`, `destroy` | `GardenerimBehaviors.Rating` |
| `validation-summary` | `data-g-validation-summary` | `errors`, `refresh`, `focus`, `navigate`, `destroy` | `GardenerimBehaviors.ValidationSummary` |
| `repeatable-field` | `data-g-repeatable-field` | `add`, `sync`, `destroy` | `GardenerimBehaviors.RepeatableField` |
| `tooltip` | `data-g-tooltip` | `open`, `close`, `toggle`, `isOpen`, `reposition`, `setBusy`, `complete`, `destroy` | `GardenerimBehaviors.Tooltip` |
| `popover` | `data-g-popover` | `open`, `close`, `toggle`, `isOpen`, `reposition`, `setBusy`, `complete`, `destroy` | `GardenerimBehaviors.Popover` |
| `tour` | `data-g-tour` | `open`, `close`, `next`, `previous`, `go`, `isOpen`, `current`, `destroy` | `GardenerimBehaviors.Tour` |
| `carousel` | `data-g-carousel` | `go`, `next`, `previous`, `start`, `stop`, `destroy` | `GardenerimBehaviors.Carousel` |
| `split-pane` | `data-g-split-pane` | `set`, `destroy` | `GardenerimBehaviors.SplitPane` |
| `foundation` | `data-g-foundation` | `setOptions`, `refresh`, `getState`, `value`, `increment`, `decrement`, `add`, `remove`, `resize`, `focus`, `scrollTo`, `destroy` | `GardenerimBehaviors.Foundation` |
| `tree` | `data-g-tree` | `focus`, `refresh`, `expand`, `select`, `value`, `destroy` | `GardenerimBehaviors.Tree` |
| `data-grid` | `data-g-data-grid` | `focus`, `destroy`, `refresh`, `setOptions`, `setRows`, `setPage`, `setSort`, `setFilter`, `select`, `getState`, `updateCell`, `load` | `GardenerimBehaviors.DataGrid` |
| `data-display` | `data-g-data-display` | `setOptions`, `getState`, `refresh`, `select`, `move`, `setDate`, `scrollTo`, `exportCsv`, `load`, `cancel`, `destroy` | `GardenerimBehaviors.DataDisplay` |
| `dashboard` | `data-g-dashboard` | `setOptions`, `getState`, `refresh`, `setValue`, `setFilter`, `reset`, `load`, `cancel`, `exportCsv`, `destroy` | `GardenerimBehaviors.Dashboard` |
| `interaction` | `data-g-interaction` | `setOptions`, `getState`, `refresh`, `setValue`, `select`, `move`, `reorder`, `addRule`, `removeRule`, `setRange`, `load`, `run`, `cancel`, `commit`, `undo`, `redo`, `copy`, `toggleFullscreen`, `destroy` | `GardenerimBehaviors.Interaction` |
| `content` | `data-g-content` | `setOptions`, `getState`, `refresh`, `setValue`, `select`, `addFiles`, `upload`, `pauseUpload`, `cancel`, `save`, `copy`, `exportCrop`, `play`, `pause`, `seek`, `format`, `findNext`, `replace`, `destroy` | `GardenerimBehaviors.Content` |
| `layout` | `data-g-layout` | `refresh`, `setOptions`, `getState`, `setValue`, `toggle`, `destroy` | `GardenerimBehaviors.Layout` |
| `help` | `data-g-help` | `refresh`, `setOptions`, `setValue`, `getState`, `search`, `open`, `close`, `go`, `submit`, `cancel`, `destroy` | `GardenerimBehaviors.Help` |
| `ai` | `data-g-ai` | `refresh`, `setOptions`, `setValue`, `getState`, `generate`, `stop`, `pause`, `resume`, `retry`, `decide`, `submitFeedback`, `destroy` | `GardenerimBehaviors.Ai` |
| `media` | `data-g-media` | `refresh`, `setOptions`, `setValue`, `getState`, `getPlaybackState`, `go`, `next`, `previous`, `open`, `close`, `start`, `stop`, `play`, `pause`, `seek`, `exportCrop`, `retry`, `destroy` | `GardenerimBehaviors.Media` |
| `auth` | `data-g-auth` | `refresh`, `setOptions`, `setValue`, `getState`, `request`, `resolve`, `takeCredentials`, `runPasskey`, `exportRecoveryCodes`, `cancel`, `destroy` | `GardenerimBehaviors.Auth` |
| `mobile` | `data-g-mobile` | `refresh`, `setOptions`, `setValue`, `getState`, `request`, `resolve`, `cancel`, `open`, `close`, `next`, `previous`, `takeCredentials`, `runPasskey`, `getTotals`, `destroy` | `GardenerimBehaviors.Mobile` |
| `workflow` | `data-g-workflow` | `refresh`, `setOptions`, `setValue`, `getState`, `request`, `resolve`, `cancel`, `next`, `previous`, `validate`, `setHost`, `destroy` | `GardenerimBehaviors.Workflow` |
| `communication` | `data-g-communication` | `refresh`, `setOptions`, `setValue`, `getState`, `request`, `resolve`, `cancel`, `setHost`, `destroy` | `GardenerimBehaviors.Communication` |
| `legal` | `data-g-legal` | `refresh`, `setOptions`, `setValue`, `getState`, `request`, `resolve`, `cancel`, `exportData`, `setHost`, `destroy` | `GardenerimBehaviors.Legal` |
| `solution` | `data-g-solution` | `refresh`, `setOptions`, `setValue`, `getState`, `request`, `resolve`, `cancel`, `setHost`, `destroy` | `GardenerimBehaviors.Solution` |
| `desktop` | `data-g-desktop` | `refresh`, `setOptions`, `setValue`, `getState`, `request`, `resolve`, `cancel`, `takeFiles`, `setHost`, `destroy` | `GardenerimBehaviors.Desktop` |
| `enterprise` | `data-g-enterprise` | `refresh`, `setOptions`, `setValue`, `getState`, `request`, `resolve`, `cancel`, `exportCsv`, `destroy` | `GardenerimBehaviors.Enterprise` |
| `marketing` | `data-g-marketing` | `refresh`, `setOptions`, `setValue`, `getState`, `request`, `resolve`, `cancel`, `getPrice`, `next`, `previous`, `destroy` | `GardenerimBehaviors.Marketing` |
| `cms` | `data-g-cms` | `refresh`, `setOptions`, `setValue`, `getState`, `request`, `resolve`, `cancel`, `takeFiles`, `destroy` | `GardenerimBehaviors.Cms` |
| `commerce` | `data-g-commerce` | `refresh`, `setOptions`, `setValue`, `getState`, `getTotals`, `setQuantity`, `selectSku`, `request`, `resolve`, `cancel`, `destroy` | `GardenerimBehaviors.Commerce` |
| `table-scroll` | `data-g-table-scroll` | `update`, `state`, `destroy` | `GardenerimBehaviors.TableScroll` |
| `table-density` | `data-g-table-density` | `set`, `value`, `destroy` | `GardenerimBehaviors.TableDensity` |
| `filter-summary` | `data-g-filter-summary` | `clear`, `show`, `destroy` | `GardenerimBehaviors.FilterSummary` |
| `table-sort` | `data-g-table-sort` | `sort`, `destroy` | `GardenerimBehaviors.TableSort` |
| `row-select` | `data-g-row-select` | `sync`, `clear`, `selectAll`, `invert`, `selected`, `destroy` | `GardenerimBehaviors.RowSelect` |
| `row-disclosure` | `data-g-row-disclosure` | `set`, `destroy` | `GardenerimBehaviors.RowDisclosure` |
| `column-toggle` | `data-g-column-toggle` | `set`, `destroy` | `GardenerimBehaviors.ColumnToggle` |
| `data-filter` | `data-g-data-filter` | `filter`, `clear`, `destroy` | `GardenerimBehaviors.DataFilter` |
| `data-view` | `data-g-data-view` | `select`, `value`, `destroy` | `GardenerimBehaviors.DataView` |
| `transfer` | `data-g-transfer` | `move`, `sync`, `values`, `destroy` | `GardenerimBehaviors.Transfer` |
| `picker` | `data-g-picker` | `open`, `close`, `clear`, `selected`, `choose`, `refresh`, `destroy` | `GardenerimBehaviors.Picker` |
| `cascader` | `data-g-cascader` | `choose`, `destroy` | `GardenerimBehaviors.Cascader` |
| `range-picker` | `data-g-range-picker` | `set`, `clear`, `value`, `apply`, `destroy` | `GardenerimBehaviors.RangePicker` |
| `saved-choice` | `data-g-saved-choice` | `select`, `destroy` | `GardenerimBehaviors.SavedChoice` |
| `builder-list` | `data-g-builder-list` | `add`, `select`, `update`, `move`, `remove`, `duplicate`, `schema`, `load`, `items`, `selected`, `sync`, `destroy` | `GardenerimBehaviors.BuilderList` |
| `toast` | `data-g-toast` | `dismiss`, `pause`, `resume`, `destroy` | `GardenerimBehaviors.Toast` |
| `copy` | `data-g-copy` | `copy`, `destroy` | `GardenerimBehaviors.Copy` |
| `fullscreen` | `data-g-fullscreen` | `toggle`, `destroy` | `GardenerimBehaviors.Fullscreen` |
| `scroll-top` | `data-g-scroll-top` | `update`, `scroll`, `destroy` | `GardenerimBehaviors.ScrollTop` |
| `dropzone` | `data-g-dropzone` | `open`, `files`, `clear`, `destroy` | `GardenerimBehaviors.Dropzone` |
| `nav-toggle` | `data-g-nav-toggle` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerimBehaviors.NavToggle` |
| `roving-nav` | `data-g-roving-nav` | `select`, `refresh`, `destroy` | `GardenerimBehaviors.RovingNav` |
| `context-menu` | `data-g-context-menu` | `open`, `close`, `refresh`, `isOpen`, `destroy` | `GardenerimBehaviors.ContextMenu` |
| `scrollspy` | `data-g-scrollspy` | `update`, `destroy` | `GardenerimBehaviors.Scrollspy` |
| `jump-nav` | `data-g-jump-nav` | `jump`, `destroy` | `GardenerimBehaviors.JumpNav` |
| `upload-manager` | `data-g-upload-manager` | `sync`, `addFile`, `addFiles`, `update`, `remove`, `clear`, `items`, `destroy` | `GardenerimBehaviors.UploadManager` |
| `file-browser` | `data-g-file-browser` | `select`, `filter`, `selected`, `destroy` | `GardenerimBehaviors.FileBrowser` |
| `media-player` | `data-g-media-player` | `play`, `pause`, `toggle`, `seek`, `state`, `destroy` | `GardenerimBehaviors.MediaPlayer` |
| `editor-shell` | `data-g-editor-shell` | `run`, `counts`, `surface`, `destroy` | `GardenerimBehaviors.EditorShell` |
| `revision-compare` | `data-g-revision-compare` | `setView`, `view`, `destroy` | `GardenerimBehaviors.RevisionCompare` |
| `autosave` | `data-g-autosave` | `save`, `dirty`, `complete`, `fail`, `offline`, `enable`, `disable`, `state`, `destroy` | `GardenerimBehaviors.Autosave` |
| `command-palette` | `data-g-command-palette` | `open`, `close`, `toggle`, `isOpen`, `query`, `active`, `select`, `refresh`, `destroy` | `GardenerimBehaviors.CommandPalette` |
