# 表单发布复查结果

日期：2026-09-07T13:11:20.721Z。本轮覆盖全部 **51 个表单组件、550 个命名变体**，新增 **9 项布局与标签参数**。本轮发布检查通过，未执行包发布。

| 检查 | 结果 |
| --- | --- |
| CSS / Vue / React / AngularJS / Blazor 构建 | 全部通过；Blazor 0 警告、0 错误 |
| 表单专项 / 全量共享运行时 | 26 / 870 项通过 |
| CSS schema / 构建 / HTML | 48 / 11 / 44 项通过 |
| Vue / React / AngularJS | 147 / 95 / 83 项单元测试通过；类型和契约检查通过 |
| Chromium / Firefox / WebKit | 每种浏览器均通过新增参数、原生重置、IME、只读指针、提交、范围、密码清空及4个专项行为演示 |
| React / AngularJS 真实页面 | 9项参数、24/36px尺寸、硬字数限制、模型更新、只读/禁用、清空与计数同步通过 |
| Blazor 真实页面 | 24/28/32/36px尺寸、模型回写、跨午夜、硬字数限制、程序清空、布局参数通过 |
| 全部目录 | 51项 × 1280/390px = 102视图；无占位、横向溢出、页面脚本错误 |
| Arco Vue 2.58.0 实际尺寸 | 64组 × 3环境；被断言的指标差异均不超过0.25px |
| 自动可访问性 | 修复前31项受影响，修复后51项扫描0违规 |
| Website / 文档 | 组件目录、共享样式、说明、六种翻译及本地化页面检查通过 |
| 五端一致性 / 包预算 | 51项元数据、550变体、9参数及CSS/Blazor共享资源校验通过；五端预算通过 |

## 本轮修复

- 字数计数在原生重置和程序更新模型后刷新；硬字数限制尊重输入法组合过程，并将最终截断值回写模型。
- 自动增高在未设置maxRows时正常增长，动态约束生效，销毁恢复原始样式。
- 控件移出禁用/只读容器后恢复原始状态；只读范围控件阻止指针修改，保留Tab焦点移动。
- 范围关闭清理旧反馈；WebKit时间控件降级为文本时仍计算跨午夜，严格校验日期时间格式。
- 校验摘要读取动态配置，区分普通辅助说明与真正的错误消息；表单配置更新保留实例。程序改值刷新依赖视图而不伪造用户输入事件。
- 搜索选择器补齐combobox与结果列表关联；上传区消除嵌套按钮语义。
- 修复示例标签关联、无效分组ARIA与选中状态辅助文字对比度。新增可调间距、宽度、帮助说明、冒号与必填标记演示。

## 证据与边界

[逐项复查](release-components.md) · [参数协议](parameters.md) · [机器可读结果](verification.json) · [共享资源哈希](asset-hashes.json) · [固定预算变更](release-review/budget-adjustments.json)

Arco比较环境为1280px桌面、390px触屏、390px触屏+深色+RTL；覆盖控件/组合根宽高和圆角、文字与标签字号字重、选择图标与开关尺寸、附加区尺寸及输入文字逻辑起点。未断言所有诊断字段，保留Gardener配色和业务组合；这不是Arco全部API或全屏逐像素兼容声明。550为命名变体库存，不代表穷举所有组合。自动可访问性检查不能替代辅助技术人工验收。上传传输、地区/电话号码业务校验、保存服务由应用接入。

Demo生产构建仍有已有的超过500kB分块提示；五端包的固定体积预算均通过。未掩盖体积增长，预算变更保留原始baseline和原因。

## 复验入口

node scripts/check-form.mjs、node scripts/form-release-verify-adapters.mjs、node scripts/form-release-browser-matrix.mjs、node scripts/test-form-adapters-browser.mjs、node scripts/form-release-accessibility.mjs、node scripts/form-release-visuals.mjs、node packages/blazor/scripts/test-form.mjs。

启动Demo 4180、CSS示例4187和Blazor5192后运行浏览器脚本；Firefox使用已安装的.disclosure-firefox路径。构建顺序为CSS→四个适配器→Demo；完整证据在release-review目录。
