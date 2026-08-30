# Gardener DOM 行为完整目录

共 66 个行为，无省略。生成组件按元数据自动初始化；任意元素可使用 `GardenerBehavior`；`GardenerRuntimeCatalog` 提供机器可读成员契约。

| 行为名 | 属性 | 实例成员 | C# 常量 |
| --- | --- | --- | --- |
| `dialog` | `data-g-dialog` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerBehaviors.Dialog` |
| `drawer` | `data-g-drawer` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerBehaviors.Drawer` |
| `mobile-sheet` | `data-g-mobile-sheet` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerBehaviors.MobileSheet` |
| `dropdown` | `data-g-dropdown` | `open`, `close`, `toggle`, `destroy` | `GardenerBehaviors.Dropdown` |
| `tabs` | `data-g-tabs` | `select`, `destroy` | `GardenerBehaviors.Tabs` |
| `accordion` | `data-g-accordion` | `toggle`, `destroy` | `GardenerBehaviors.Accordion` |
| `auto-resize` | `data-g-auto-resize` | `resize`, `destroy` | `GardenerBehaviors.AutoResize` |
| `combobox` | `data-g-combobox` | `open`, `close`, `choose`, `destroy` | `GardenerBehaviors.Combobox` |
| `password-toggle` | `data-g-password-toggle` | `toggle`, `destroy` | `GardenerBehaviors.PasswordToggle` |
| `clear-input` | `data-g-clear-input` | `clear`, `update`, `destroy` | `GardenerBehaviors.ClearInput` |
| `otp-input` | `data-g-otp-input` | `value`, `fill`, `clear`, `destroy` | `GardenerBehaviors.OtpInput` |
| `password-strength` | `data-g-password-strength` | `update`, `destroy` | `GardenerBehaviors.PasswordStrength` |
| `auth-timer` | `data-g-auth-timer` | `start`, `reset`, `expire`, `remaining`, `destroy` | `GardenerBehaviors.AuthTimer` |
| `quantity-stepper` | `data-g-quantity-stepper` | `value`, `set`, `increment`, `decrement`, `destroy` | `GardenerBehaviors.QuantityStepper` |
| `sku-selector` | `data-g-sku-selector` | `value`, `select`, `destroy` | `GardenerBehaviors.SkuSelector` |
| `cart` | `data-g-cart` | `update`, `summary`, `destroy` | `GardenerBehaviors.Cart` |
| `coupon` | `data-g-coupon` | `apply`, `clear`, `state`, `destroy` | `GardenerBehaviors.Coupon` |
| `pull-refresh` | `data-g-pull-refresh` | `refresh`, `complete`, `isRefreshing`, `destroy` | `GardenerBehaviors.PullRefresh` |
| `infinite-load` | `data-g-infinite-load` | `load`, `complete`, `isLoading`, `destroy` | `GardenerBehaviors.InfiniteLoad` |
| `swipe-actions` | `data-g-swipe-actions` | `reveal`, `close`, `toggle`, `destroy` | `GardenerBehaviors.SwipeActions` |
| `wheel-picker` | `data-g-wheel-picker` | `select`, `values`, `destroy` | `GardenerBehaviors.WheelPicker` |
| `ai-composer` | `data-g-ai-composer` | `submit`, `stop`, `setStreaming`, `value`, `focus`, `destroy` | `GardenerBehaviors.AiComposer` |
| `prompt-fill` | `data-g-prompt-fill` | `fill`, `destroy` | `GardenerBehaviors.PromptFill` |
| `ai-approval` | `data-g-ai-approval` | `choose`, `reset`, `destroy` | `GardenerBehaviors.AiApproval` |
| `ai-feedback` | `data-g-ai-feedback` | `select`, `submit`, `value`, `destroy` | `GardenerBehaviors.AiFeedback` |
| `shortcut-recorder` | `data-g-shortcut-recorder` | `start`, `stop`, `clear`, `value`, `destroy` | `GardenerBehaviors.ShortcutRecorder` |
| `desktop-tabs` | `data-g-desktop-tabs` | `select`, `close`, `tabs`, `destroy` | `GardenerBehaviors.DesktopTabs` |
| `native-file-picker` | `data-g-native-file-picker` | `open`, `files`, `clear`, `destroy` | `GardenerBehaviors.NativeFilePicker` |
| `window-switcher` | `data-g-window-switcher` | `open`, `close`, `select`, `isOpen`, `destroy` | `GardenerBehaviors.WindowSwitcher` |
| `character-count` | `data-g-character-count` | `update`, `destroy` | `GardenerBehaviors.CharacterCount` |
| `conditional-field` | `data-g-conditional-field` | `update`, `destroy` | `GardenerBehaviors.ConditionalField` |
| `repeatable-field` | `data-g-repeatable-field` | `add`, `sync`, `destroy` | `GardenerBehaviors.RepeatableField` |
| `tooltip` | `data-g-tooltip` | `open`, `close`, `toggle`, `destroy` | `GardenerBehaviors.Tooltip` |
| `popover` | `data-g-popover` | `open`, `close`, `toggle`, `destroy` | `GardenerBehaviors.Popover` |
| `tour` | `data-g-tour` | `open`, `close`, `next`, `previous`, `go`, `isOpen`, `current`, `destroy` | `GardenerBehaviors.Tour` |
| `carousel` | `data-g-carousel` | `go`, `next`, `previous`, `start`, `stop`, `destroy` | `GardenerBehaviors.Carousel` |
| `split-pane` | `data-g-split-pane` | `set`, `destroy` | `GardenerBehaviors.SplitPane` |
| `tree` | `data-g-tree` | `focus`, `destroy` | `GardenerBehaviors.Tree` |
| `data-grid` | `data-g-data-grid` | `focus`, `destroy` | `GardenerBehaviors.DataGrid` |
| `table-sort` | `data-g-table-sort` | `sort`, `destroy` | `GardenerBehaviors.TableSort` |
| `row-select` | `data-g-row-select` | `sync`, `clear`, `selectAll`, `invert`, `selected`, `destroy` | `GardenerBehaviors.RowSelect` |
| `row-disclosure` | `data-g-row-disclosure` | `set`, `destroy` | `GardenerBehaviors.RowDisclosure` |
| `column-toggle` | `data-g-column-toggle` | `set`, `destroy` | `GardenerBehaviors.ColumnToggle` |
| `data-filter` | `data-g-data-filter` | `filter`, `clear`, `destroy` | `GardenerBehaviors.DataFilter` |
| `data-view` | `data-g-data-view` | `select`, `destroy` | `GardenerBehaviors.DataView` |
| `transfer` | `data-g-transfer` | `move`, `sync`, `values`, `destroy` | `GardenerBehaviors.Transfer` |
| `picker` | `data-g-picker` | `open`, `close`, `selected`, `choose`, `destroy` | `GardenerBehaviors.Picker` |
| `cascader` | `data-g-cascader` | `choose`, `destroy` | `GardenerBehaviors.Cascader` |
| `saved-choice` | `data-g-saved-choice` | `select`, `destroy` | `GardenerBehaviors.SavedChoice` |
| `builder-list` | `data-g-builder-list` | `add`, `sync`, `destroy` | `GardenerBehaviors.BuilderList` |
| `toast` | `data-g-toast` | `dismiss`, `pause`, `resume`, `destroy` | `GardenerBehaviors.Toast` |
| `copy` | `data-g-copy` | `copy`, `destroy` | `GardenerBehaviors.Copy` |
| `fullscreen` | `data-g-fullscreen` | `toggle`, `destroy` | `GardenerBehaviors.Fullscreen` |
| `scroll-top` | `data-g-scroll-top` | `update`, `scroll`, `destroy` | `GardenerBehaviors.ScrollTop` |
| `dropzone` | `data-g-dropzone` | `destroy` | `GardenerBehaviors.Dropzone` |
| `nav-toggle` | `data-g-nav-toggle` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerBehaviors.NavToggle` |
| `roving-nav` | `data-g-roving-nav` | `select`, `destroy` | `GardenerBehaviors.RovingNav` |
| `context-menu` | `data-g-context-menu` | `open`, `close`, `isOpen`, `destroy` | `GardenerBehaviors.ContextMenu` |
| `scrollspy` | `data-g-scrollspy` | `update`, `destroy` | `GardenerBehaviors.Scrollspy` |
| `jump-nav` | `data-g-jump-nav` | `jump`, `destroy` | `GardenerBehaviors.JumpNav` |
| `upload-manager` | `data-g-upload-manager` | `sync`, `addFile`, `items`, `destroy` | `GardenerBehaviors.UploadManager` |
| `file-browser` | `data-g-file-browser` | `select`, `filter`, `selected`, `destroy` | `GardenerBehaviors.FileBrowser` |
| `editor-shell` | `data-g-editor-shell` | `run`, `counts`, `surface`, `destroy` | `GardenerBehaviors.EditorShell` |
| `revision-compare` | `data-g-revision-compare` | `setView`, `view`, `destroy` | `GardenerBehaviors.RevisionCompare` |
| `autosave` | `data-g-autosave` | `save`, `state`, `destroy` | `GardenerBehaviors.Autosave` |
| `command-palette` | `data-g-command-palette` | `open`, `close`, `toggle`, `isOpen`, `destroy` | `GardenerBehaviors.CommandPalette` |
