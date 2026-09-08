# 表单 51 项逐项核对

以下保留基础比例对齐记录；本次发布复查的问题归类、参数与验证结果见[51项发布清单](release-components.md)和[发布验证](verification.md)。

本轮以元数据 form 分类的 51 个入口为范围。原有 102 个桌面/窄屏视图均有内容，无占位和页面横向溢出；问题主要来自组件比例、公共状态协作和少量演示未接入行为。

| 入口 | 分析与处理 |
| --- | --- |
| input / .g-input | 圆角 2；mini/small/medium/large 24/28/32/36；large 正文恢复 14px。 |
| textarea / .g-textarea | 默认 2 行几何、4×12 内边距、14/1.5715；原生 rows 生效；硬字数限制不截断 IME 组合过程。 |
| select / .g-select | 对齐输入框尺寸、默认圆角和 large 字号；保留原生 select 的键盘与提交语义。 |
| checkbox-radio / .g-check, .g-radio | 选择框由 18 调为 14、正文 400、行高 22、间隔 8，修复触屏覆盖；保留原生 checkbox/radio。 |
| switch / .g-switch | 普通轨道 40×24、手柄 16、内距 4；小号 28×16、手柄 12、内距 2。 |
| range-color / .g-range-color | 范围滑块默认轨道 2、手柄 12，修复容器收缩；颜色选择和其他尺寸为扩展。 |
| file-drop / [data-g-dropzone] | 检查点击/文件选择/上传限制与列表既有逻辑；按钮使用共同基础比例，拖放布局为扩展。 |
| combobox / [data-g-combobox] | mini 内部输入和按钮曾撑高到 26，触屏曾撑到 38；修复四档尺寸、字号与弹出内容接入。 |
| form / .g-form | 新增共享 formSize/formLayout/formDisabled/formReadOnly 参数；参数面板提交、校验、重置完整演示。 |
| form-section / .g-form-section | 检查分区场景、折叠和响应式结构；共同标签字体与容器禁用/只读生效。 |
| field / .g-field | 标签改为 14/400，帮助和错误 12/20；明确标签宽度、方向及容器禁用/只读。 |
| fieldset / .g-fieldset | 保留原生 fieldset 分组和 disabled 行为；子控件采用统一比例。 |
| form-row / .g-form-row | 核对列数、对齐与窄屏换行；列布局为扩展，内部控件使用共同比例。 |
| form-grid / .g-form-grid | 核对自动/多列/跨度与窄屏布局；内部控件统一，网格不是 Arco 独立组件。 |
| horizontal-form / .g-form-horizontal | 保留旧布局 API；GForm 的 formLayout=horizontal 提供 Arco 比例参数，标签列宽和对齐可配置。 |
| inline-form / .g-form-inline | 保留旧布局 API；GForm 的 formLayout=inline 支持共同尺寸和自动换行参数。 |
| compact-form / .g-form-compact | 保留紧凑/连接布局；内部输入与按钮使用统一比例。 |
| input-group / .g-input-group | 四档组合高度、附加区宽度/字号/内边距对照；修复移动端强制高度覆盖显式尺寸。 |
| input-affix / .g-input-affix | 四档外框、文字起点、圆角统一；修复高优先级尺寸规则覆盖 12px 内边距、前缀间隔不足。 |
| search-field / .g-search-field | 修复简单结构中尺寸只作用于外层的问题；保留图标/按钮搜索结构。 |
| password-field / [data-g-password-toggle] | 外框尺寸、mini 内部字号、圆角统一；显隐与安全隐藏既有运行时回归。 |
| clearable-field / [data-g-clear-input] | 四档比例统一；修复禁用/只读反射状态锁住输入、按钮未跟随属性更新，销毁恢复原有状态。 |
| character-counter / [data-g-character-count] | 硬限制在输入事件捕获阶段归一后交给框架；IME 延后处理；修复反射禁用/只读状态无法恢复。 |
| validation-state / .g-validation-state | 标签/反馈采用共同正文和 12/20 消息比例，状态语义保留。 |
| checkbox-group / [data-g-row-select] | 组内选择框与标签比例统一；全选/部分选择由既有 row-select 执行。 |
| radio-group / .g-radio-group | 组内原生 radio、键盘及互斥选择保留，尺寸和标签共享。 |
| switch-row / .g-switch-row | 内部开关比例修复；扩展行描述和操作布局保留。 |
| choice-card-group / .g-choice-group | 卡片式单选/多选结构检查；容器禁用和只读增强。 |
| name-group / .g-name-group | 补齐 given/middle/family 三个声明部件的最小宽度，配合既有姓名排序/列数。 |
| address-group / .g-address-group | 检查地址组合、原生输入和窄屏排列；统一子控件及容器状态。 |
| phone-group / .g-phone-group | 检查区号/号码分组与窄屏布局；统一子控件及容器状态。 |
| money-group / .g-money-group | 检查币种/金额分组与数值输入；统一子控件及容器状态。 |
| date-range-group / .g-date-range-group | 补齐 start/end 部件，新增共享顺序校验、首尾包含与时长边界参数。 |
| time-range-group / .g-time-range-group | 补齐 12 个声明部件和完整布局；默认演示接入顺序校验、时长输出；允许跨午夜参数。 |
| unit-field / .g-unit-field | 复合单位字段检查，内部输入/附加内容按共同尺寸渲染。 |
| range-field / [data-g-field-sync].g-range-field | 修复原生 form.reset 后显示值未更新；保留 fieldchange 协议。 |
| file-field / [data-g-field-sync].g-file-field | 复验原生选择文件及 fieldchange；同步重置显示，文件数据由浏览器提供。 |
| repeatable-field / [data-g-repeatable-field] | 复验既有增加/删除/重排控制与销毁逻辑；输入比例共享。 |
| conditional-field / [data-g-conditional-field] | 复验条件显示、隐藏内容禁用与销毁恢复；输入比例共享。 |
| form-actions / .g-form-actions | 基础按钮比例共用，检查对齐、堆叠、窄屏操作区域。 |
| autosave-status / [data-g-autosave].g-autosave-status | 复验既有 dirty/saving/saved/error 状态逻辑；没有伪装成真实远端保存。 |
| form-progress / .g-form-progress | 内部进度沿用前轮反馈标准；分段/步骤布局为扩展。 |
| form-review / .g-form-review | 检查只读摘要与修改入口；作为业务组合使用统一字体和按钮。 |
| consent-group / .g-consent-group | 统一勾选框比例，分组只读/禁用保护与原生提交语义。 |
| date-picker / [data-g-picker].g-date-picker | 真实浏览器复验翻月/选择/输出；当前日历面板为自有组合，不宣称全部 Arco DatePicker API 相同。 |
| time-picker / [data-g-wheel-picker].g-time-picker | 真实浏览器复验预设时间选择/输出；滚轮面板为自有组合。 |
| pin-input / [data-g-otp-input].g-pin-input | 检查原有 OTP 输入、粘贴、焦点和完成事件测试；输入单元使用共同控件基础。 |
| rating / [data-g-rating].g-rating | 发现 inline-size 容器令默认评分根宽为 0，已移除尺寸包含；星形框、8px 间隔、32px 行高对齐；修复触屏强行放大。 |
| validation-summary / [data-g-validation-summary].g-validation-summary | 真实浏览器复验错误收集、阻止无效提交、跳转字段；原生校验消息与事件保留。 |
| upload-queue / .g-upload-queue | 复验既有队列/暂停/重试/移除与聚合进度逻辑；上传传输由业务实现。 |
| form-builder / [data-g-builder-list].g-form-builder | 真实浏览器复验新增/修改标签/删除；生成字段采用统一基础控件比例。 |

64 组真实对照覆盖输入、选择、密码、清空、附加内容、搜索、组合输入、文本域、checkbox/radio、switch、slider、rating，以及三种 Form 布局。Arco 没有独立的姓名/地址/表单构建器等同名组件，这些组合按内部控制比例对齐并保留 Gardener 布局能力。图形、配色、所有 API 名称和全部日期面板行为不作完全兼容声明。
