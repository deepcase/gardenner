# Arco Design Vue 对应清单

参考安装包 @arco-design/web-vue 2.58.0 的公开顶级组件目录。子组件由 Gardenerim 的节点数据、列定义、原生子内容或对应组合承担；不是逐项导出兼容层。

| Arco | Gardenerim | 本轮处理 | 说明 |
| --- | --- | --- | --- |
| [Affix](https://arco.design/vue/component/affix) | [GAffix](http://127.0.0.1:4180/?component=affix#catalog) | 新增实现 | 固钉遵从最近滚动容器的 CSS sticky 约束，不传送到外部容器。 |
| [Alert](https://arco.design/vue/component/alert) | [GAlert](http://127.0.0.1:4180/?component=alert#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Anchor](https://arco.design/vue/component/anchor) | [GAnchorNavigation](http://127.0.0.1:4180/?component=anchor-navigation#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [AutoComplete](https://arco.design/vue/component/auto-complete) | [GCombobox](http://127.0.0.1:4180/?component=combobox#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Avatar](https://arco.design/vue/component/avatar) | [GAvatar](http://127.0.0.1:4180/?component=avatar#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [BackTop](https://arco.design/vue/component/back-top) | [GBackToTop](http://127.0.0.1:4180/?component=back-to-top#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Badge](https://arco.design/vue/component/badge) | [GBadge](http://127.0.0.1:4180/?component=badge#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Breadcrumb](https://arco.design/vue/component/breadcrumb) | [GBreadcrumb](http://127.0.0.1:4180/?component=breadcrumb#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Button](https://arco.design/vue/component/button) | [GButton](http://127.0.0.1:4180/?component=button#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Card](https://arco.design/vue/component/card) | [GCard](http://127.0.0.1:4180/?component=card#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Calendar](https://arco.design/vue/component/calendar) | [GCalendar](http://127.0.0.1:4180/?component=calendar#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Carousel](https://arco.design/vue/component/carousel) | [GCarousel](http://127.0.0.1:4180/?component=carousel#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Cascader](https://arco.design/vue/component/cascader) | [GCascader](http://127.0.0.1:4180/?component=cascader#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Checkbox](https://arco.design/vue/component/checkbox) | [GCheckboxRadio](http://127.0.0.1:4180/?component=checkbox-radio#catalog) / [GCheckboxGroup](http://127.0.0.1:4180/?component=checkbox-group#catalog) | 核对已有对应 | 单项保留原生 input[type=checkbox]；分组使用 CheckboxGroup。 |
| [Collapse](https://arco.design/vue/component/collapse) | [GCollapse](http://127.0.0.1:4180/?component=collapse#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Comment](https://arco.design/vue/component/comment) | [GCommentThread](http://127.0.0.1:4180/?component=comment-thread#catalog) | 核对已有对应 | CommentThread 提供嵌套、回复、编辑、反应及权限参数。 |
| [ColorPicker](https://arco.design/vue/component/color-picker) | [GColorPicker](http://127.0.0.1:4180/?component=color-picker#catalog) | 新增实现 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [ConfigProvider](https://arco.design/vue/component/config-provider) | GardenerimProvider / configure | 核对已有对应 | CSS 使用主题属性与 configure；四个框架使用 GardenerimProvider。 |
| [DatePicker](https://arco.design/vue/component/date-picker) | [GDatePicker](http://127.0.0.1:4180/?component=date-picker#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Descriptions](https://arco.design/vue/component/descriptions) | [GDescriptions](http://127.0.0.1:4180/?component=descriptions#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Divider](https://arco.design/vue/component/divider) | [GDividerWithText](http://127.0.0.1:4180/?component=divider-with-text#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Drawer](https://arco.design/vue/component/drawer) | [GDrawer](http://127.0.0.1:4180/?component=drawer#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Dropdown](https://arco.design/vue/component/dropdown) | [GMenuDropdown](http://127.0.0.1:4180/?component=menu-dropdown#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Empty](https://arco.design/vue/component/empty) | [GEmptyState](http://127.0.0.1:4180/?component=empty-state#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Form](https://arco.design/vue/component/form) | [GForm](http://127.0.0.1:4180/?component=form#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Grid](https://arco.design/vue/component/grid) | [GGridSystem](http://127.0.0.1:4180/?component=grid-system#catalog) | 核对已有对应 | 24 列、响应式与容器查询使用 GridSystem 的 layout-options。 |
| [Icon](https://arco.design/vue/component/icon) | [GIcon](http://127.0.0.1:4180/?component=icon#catalog) | 新增实现 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Image](https://arco.design/vue/component/image) | [GImage](http://127.0.0.1:4180/?component=image#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Input](https://arco.design/vue/component/input) | [GInput](http://127.0.0.1:4180/?component=input#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [InputNumber](https://arco.design/vue/component/input-number) | [GInputNumber](http://127.0.0.1:4180/?component=input-number#catalog) | 新增实现 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [InputTag](https://arco.design/vue/component/input-tag) | [GInputTag](http://127.0.0.1:4180/?component=input-tag#catalog) | 新增实现 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Layout](https://arco.design/vue/component/layout) | [GRegionLayoutSystem](http://127.0.0.1:4180/?component=region-layout-system#catalog) / [GAppShell](http://127.0.0.1:4180/?component=app-shell#catalog) | 核对已有对应 | RegionLayoutSystem 与 AppShell 使用布局参数和原生子内容。 |
| [Link](https://arco.design/vue/component/link) | [GLink](http://127.0.0.1:4180/?component=link#catalog) | 新增实现 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [List](https://arco.design/vue/component/list) | [GList](http://127.0.0.1:4180/?component=list#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Mention](https://arco.design/vue/component/mention) | [GMentionSlashCommand](http://127.0.0.1:4180/?component=mention-slash-command#catalog) / [GMentionPicker](http://127.0.0.1:4180/?component=mention-picker#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Menu](https://arco.design/vue/component/menu) | [GMenuBar](http://127.0.0.1:4180/?component=menu-bar#catalog) / [GSidebar](http://127.0.0.1:4180/?component=sidebar#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Message](https://arco.design/vue/component/message) | [GToast](http://127.0.0.1:4180/?component=toast#catalog) | 核对已有对应 | 短消息使用 toast()，保留 Gardenerim 的消息队列与事件。 |
| [Modal](https://arco.design/vue/component/modal) | [GDialog](http://127.0.0.1:4180/?component=dialog#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Notification](https://arco.design/vue/component/notification) | [GToast](http://127.0.0.1:4180/?component=toast#catalog) / [GNotificationCenter](http://127.0.0.1:4180/?component=notification-center#catalog) | 核对已有对应 | 带标题通知使用 toast()；通知中心用于持久消息，不等同于瞬时通知。 |
| [PageHeader](https://arco.design/vue/component/page-header) | [GPageHeader](http://127.0.0.1:4180/?component=page-header#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Pagination](https://arco.design/vue/component/pagination) | [GPagination](http://127.0.0.1:4180/?component=pagination#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Popconfirm](https://arco.design/vue/component/popconfirm) | [GPopconfirm](http://127.0.0.1:4180/?component=popconfirm#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Popover](https://arco.design/vue/component/popover) | [GPopover](http://127.0.0.1:4180/?component=popover#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Progress](https://arco.design/vue/component/progress) | [GProgressMeter](http://127.0.0.1:4180/?component=progress-meter#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Radio](https://arco.design/vue/component/radio) | [GCheckboxRadio](http://127.0.0.1:4180/?component=checkbox-radio#catalog) / [GRadioGroup](http://127.0.0.1:4180/?component=radio-group#catalog) | 核对已有对应 | 单项保留原生 input[type=radio]；分组使用 RadioGroup。 |
| [Rate](https://arco.design/vue/component/rate) | [GRating](http://127.0.0.1:4180/?component=rating#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [ResizeBox](https://arco.design/vue/component/resize-box) | [GResizeBox](http://127.0.0.1:4180/?component=resize-box#catalog) | 新增实现 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Result](https://arco.design/vue/component/result) | [GPageStateSystem](http://127.0.0.1:4180/?component=page-state-system#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Scrollbar](https://arco.design/vue/component/scrollbar) | [GScrollbar](http://127.0.0.1:4180/?component=scrollbar#catalog) | 新增实现 | 使用原生可访问滚动区域与 Gardenerim 滚动条样式。 |
| [Select](https://arco.design/vue/component/select) | [GSelect](http://127.0.0.1:4180/?component=select#catalog) | 核对已有对应 | 原生 Select 与可搜索 Combobox 组合覆盖选择需求。 |
| [Skeleton](https://arco.design/vue/component/skeleton) | [GSpinnerSkeleton](http://127.0.0.1:4180/?component=spinner-skeleton#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Slider](https://arco.design/vue/component/slider) | [GRangeField](http://127.0.0.1:4180/?component=range-field#catalog) | 核对已有对应 | 使用原生 range 控件，数值与标签同步由 field-sync 提供。 |
| [Space](https://arco.design/vue/component/space) | [GSpace](http://127.0.0.1:4180/?component=space#catalog) | 新增实现 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Spin](https://arco.design/vue/component/spin) | [GSpinnerSkeleton](http://127.0.0.1:4180/?component=spinner-skeleton#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Split](https://arco.design/vue/component/split) | [GSplitPane](http://127.0.0.1:4180/?component=split-pane#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Statistic](https://arco.design/vue/component/statistic) | [GStatistic](http://127.0.0.1:4180/?component=statistic#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Steps](https://arco.design/vue/component/steps) | [GStepper](http://127.0.0.1:4180/?component=stepper#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Switch](https://arco.design/vue/component/switch) | [GSwitch](http://127.0.0.1:4180/?component=switch#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Table](https://arco.design/vue/component/table) | [GTable](http://127.0.0.1:4180/?component=table#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Tabs](https://arco.design/vue/component/tabs) | [GTabs](http://127.0.0.1:4180/?component=tabs#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Tag](https://arco.design/vue/component/tag) | [GTag](http://127.0.0.1:4180/?component=tag#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Textarea](https://arco.design/vue/component/textarea) | [GTextarea](http://127.0.0.1:4180/?component=textarea#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [TimePicker](https://arco.design/vue/component/time-picker) | [GTimePicker](http://127.0.0.1:4180/?component=time-picker#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Timeline](https://arco.design/vue/component/timeline) | [GTimeline](http://127.0.0.1:4180/?component=timeline#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Tooltip](https://arco.design/vue/component/tooltip) | [GTooltip](http://127.0.0.1:4180/?component=tooltip#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Transfer](https://arco.design/vue/component/transfer) | [GTransferList](http://127.0.0.1:4180/?component=transfer-list#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Tree](https://arco.design/vue/component/tree) | [GTree](http://127.0.0.1:4180/?component=tree#catalog) | 复验既有独立对照 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [TreeSelect](https://arco.design/vue/component/tree-select) | [GTreeSelect](http://127.0.0.1:4180/?component=tree-select#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Trigger](https://arco.design/vue/component/trigger) | [GPopover](http://127.0.0.1:4180/?component=popover#catalog) | 复验既有独立对照 | Popover 提供通用触发、定位、受控显隐和内容模板，不复制 Arco 内部 Trigger 协议。 |
| [Typography](https://arco.design/vue/component/typography) | [GTypography](http://127.0.0.1:4180/?component=typography#catalog) | 新增实现 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Upload](https://arco.design/vue/component/upload) | [GFileDrop](http://127.0.0.1:4180/?component=file-drop#catalog) / [GUploadQueue](http://127.0.0.1:4180/?component=upload-queue#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [OverflowList](https://arco.design/vue/component/overflow-list) | [GOverflowList](http://127.0.0.1:4180/?component=overflow-list#catalog) | 新增实现 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [VerificationCode](https://arco.design/vue/component/verification-code) | [GPinInput](http://127.0.0.1:4180/?component=pin-input#catalog) | 核对已有对应 | 保留 Gardenerim 参数、语义与设计变量，不宣称 Arco API 可直接替换。 |
| [Watermark](https://arco.design/vue/component/watermark) | [GWatermark](http://127.0.0.1:4180/?component=watermark#catalog) | 新增实现 | 视觉水印不作为权限控制或防泄露机制。 |
