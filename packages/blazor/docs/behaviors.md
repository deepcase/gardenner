# Gardenerim DOM 行为完整目录

共 66 个行为，无省略。生成组件按元数据自动初始化；任意元素可使用 `GardenerimBehavior`；`GardenerimRuntimeCatalog` 提供机器可读成员契约。

| 行为名 | 属性 | 实例成员 | C# 常量 |
| --- | --- | --- | --- |
| `dialog` | `data-g-dialog` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerimBehaviors.Dialog` |
| `drawer` | `data-g-drawer` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerimBehaviors.Drawer` |
| `mobile-sheet` | `data-g-mobile-sheet` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerimBehaviors.MobileSheet` |
| `dropdown` | `data-g-dropdown` | `open`, `close`, `toggle`, `destroy` | `GardenerimBehaviors.Dropdown` |
| `tabs` | `data-g-tabs` | `select`, `destroy` | `GardenerimBehaviors.Tabs` |
| `accordion` | `data-g-accordion` | `toggle`, `destroy` | `GardenerimBehaviors.Accordion` |
| `auto-resize` | `data-g-auto-resize` | `resize`, `destroy` | `GardenerimBehaviors.AutoResize` |
| `combobox` | `data-g-combobox` | `open`, `close`, `choose`, `destroy` | `GardenerimBehaviors.Combobox` |
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
| `conditional-field` | `data-g-conditional-field` | `update`, `destroy` | `GardenerimBehaviors.ConditionalField` |
| `repeatable-field` | `data-g-repeatable-field` | `add`, `sync`, `destroy` | `GardenerimBehaviors.RepeatableField` |
| `tooltip` | `data-g-tooltip` | `open`, `close`, `toggle`, `destroy` | `GardenerimBehaviors.Tooltip` |
| `popover` | `data-g-popover` | `open`, `close`, `toggle`, `destroy` | `GardenerimBehaviors.Popover` |
| `tour` | `data-g-tour` | `open`, `close`, `next`, `previous`, `go`, `isOpen`, `current`, `destroy` | `GardenerimBehaviors.Tour` |
| `carousel` | `data-g-carousel` | `go`, `next`, `previous`, `start`, `stop`, `destroy` | `GardenerimBehaviors.Carousel` |
| `split-pane` | `data-g-split-pane` | `set`, `destroy` | `GardenerimBehaviors.SplitPane` |
| `tree` | `data-g-tree` | `focus`, `destroy` | `GardenerimBehaviors.Tree` |
| `data-grid` | `data-g-data-grid` | `focus`, `destroy`, `refresh`, `setOptions`, `setRows`, `setPage`, `setSort`, `setFilter`, `select`, `getState`, `updateCell`, `load` | `GardenerimBehaviors.DataGrid` |
| `table-sort` | `data-g-table-sort` | `sort`, `destroy` | `GardenerimBehaviors.TableSort` |
| `row-select` | `data-g-row-select` | `sync`, `clear`, `selectAll`, `invert`, `selected`, `destroy` | `GardenerimBehaviors.RowSelect` |
| `row-disclosure` | `data-g-row-disclosure` | `set`, `destroy` | `GardenerimBehaviors.RowDisclosure` |
| `column-toggle` | `data-g-column-toggle` | `set`, `destroy` | `GardenerimBehaviors.ColumnToggle` |
| `data-filter` | `data-g-data-filter` | `filter`, `clear`, `destroy` | `GardenerimBehaviors.DataFilter` |
| `data-view` | `data-g-data-view` | `select`, `destroy` | `GardenerimBehaviors.DataView` |
| `transfer` | `data-g-transfer` | `move`, `sync`, `values`, `destroy` | `GardenerimBehaviors.Transfer` |
| `picker` | `data-g-picker` | `open`, `close`, `selected`, `choose`, `destroy` | `GardenerimBehaviors.Picker` |
| `cascader` | `data-g-cascader` | `choose`, `destroy` | `GardenerimBehaviors.Cascader` |
| `saved-choice` | `data-g-saved-choice` | `select`, `destroy` | `GardenerimBehaviors.SavedChoice` |
| `builder-list` | `data-g-builder-list` | `add`, `sync`, `destroy` | `GardenerimBehaviors.BuilderList` |
| `toast` | `data-g-toast` | `dismiss`, `pause`, `resume`, `destroy` | `GardenerimBehaviors.Toast` |
| `copy` | `data-g-copy` | `copy`, `destroy` | `GardenerimBehaviors.Copy` |
| `fullscreen` | `data-g-fullscreen` | `toggle`, `destroy` | `GardenerimBehaviors.Fullscreen` |
| `scroll-top` | `data-g-scroll-top` | `update`, `scroll`, `destroy` | `GardenerimBehaviors.ScrollTop` |
| `dropzone` | `data-g-dropzone` | `destroy` | `GardenerimBehaviors.Dropzone` |
| `nav-toggle` | `data-g-nav-toggle` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerimBehaviors.NavToggle` |
| `roving-nav` | `data-g-roving-nav` | `select`, `destroy` | `GardenerimBehaviors.RovingNav` |
| `context-menu` | `data-g-context-menu` | `open`, `close`, `isOpen`, `destroy` | `GardenerimBehaviors.ContextMenu` |
| `scrollspy` | `data-g-scrollspy` | `update`, `destroy` | `GardenerimBehaviors.Scrollspy` |
| `jump-nav` | `data-g-jump-nav` | `jump`, `destroy` | `GardenerimBehaviors.JumpNav` |
| `upload-manager` | `data-g-upload-manager` | `sync`, `addFile`, `items`, `destroy` | `GardenerimBehaviors.UploadManager` |
| `file-browser` | `data-g-file-browser` | `select`, `filter`, `selected`, `destroy` | `GardenerimBehaviors.FileBrowser` |
| `editor-shell` | `data-g-editor-shell` | `run`, `counts`, `surface`, `destroy` | `GardenerimBehaviors.EditorShell` |
| `revision-compare` | `data-g-revision-compare` | `setView`, `view`, `destroy` | `GardenerimBehaviors.RevisionCompare` |
| `autosave` | `data-g-autosave` | `save`, `state`, `destroy` | `GardenerimBehaviors.Autosave` |
| `command-palette` | `data-g-command-palette` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerimBehaviors.CommandPalette` |
