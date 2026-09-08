# 反馈组件验证记录

日期：2026-09-06。实际参照 @arco-design/web-vue@2.58.0，Chromium，固定相同字体与测量宽度。SVG 的路径和呈现属性保留，隔离规则只撤销双方全局样式干扰，并增加实际路径可见性断言。

| 检查 | 结果 |
| --- | --- |
| 五端构建与包检查 | CSS、Vue、React、AngularJS、Blazor 均通过；Blazor 0 警告、0 错误 |
| 三前端适配器类型检查 | Vue、React、AngularJS 通过 |
| CSS 运行时和回归 | 159 / 159，含 9 项反馈协议测试 |
| Vue / React / AngularJS 运行时 | 83 / 83，含三端响应式进度与受控关闭 |
| Blazor SSR / 契约 | 510 个 SSR 渲染、75 behaviors、101 events 及 DI/表单/元数据通过 |
| Blazor 反馈浏览器 | line 3/4/8、circle 64、带标题 Alert 82、Result 图标 45；数值截断、null→关闭原因、加载 inert、禁用恢复、Toast 关闭后继续渲染通过 |
| 55 组 Arco 比例：1280px 桌面 | 55 / 55，超过容差的差异为 0 |
| 55 组 Arco 比例：390px 触屏 | 55 / 55，超过容差的差异为 0 |
| 55 组 Arco 比例：390px 触屏、深色、RTL | 55 / 55，超过容差的差异为 0 |
| 主演示九项 × 桌面/窄屏 | 18 个视图有真实场景，无占位框、页面横向溢出和脚本错误 |
| 主演示参数操作 | 自定义范围/截断/圆环/未知进度、受控关闭/恢复、禁用、键盘 inert、消息队列上限/同 id 更新/关闭/清空、Result 切换通过 |
| 基础与导航回归 | 49 组基础比例、20 个基础视图及参数、41 个导航交互通过；Blazor 基础与 41 个导航交互通过 |

测量根节点宽高和内边距、图标尺寸、标题和内容的字号/字重/行高，以及圆环背景/前景各自的实际直径和线宽，数值容差 0.25px。StatusBar 比较其中按钮，ContextBar 比较 Alert，简单 PageLoading 比较 Spin 内容；不是全部组件全部像素、配色、动画或所有 Arco API 的完全一致声明。

同源资源 SHA256：CSS 与 Blazor 的 gardener.css 均为 98D85AC7A57BD72FE9082C3022D73BF761AC4A38E3B1444F355A4947920E3903；gardener.runtime.min.js 均为 7C729DC617DA643188D1B4ACFE7E5297B7D89B66C2ACD1A8287D55E753DE67BD。Vue/React/AngularJS 的样式和运行时引用同一 @gardenerim/css 包。

## 复验

~~~powershell
# D:\develop\Gardener
npm run build
npm run check:packages
npm --prefix packages/css run test:runtime
node --test --test-concurrency=1 packages/vue/tests/runtime.test.mjs packages/react/tests/runtime.test.mjs packages/angularjs/tests/runtime.test.mjs
npm --prefix packages/blazor run test:contracts
npm --prefix packages/blazor run test:feedback

# D:\develop\GardenerDemo，需先启动 4180；Blazor 测试需 5192
$env:DEMO_URL='http://127.0.0.1:4180'
$env:AUDIT_PHASE='final'
npm run audit:feedback
$env:AUDIT_WIDTH='390'
$env:AUDIT_TOUCH='true'
npm run audit:feedback
$env:AUDIT_RTL='true'
$env:AUDIT_DARK='true'
npm run audit:feedback
npm run test:feedback
npm run test:basic
npm run test:navigation
~~~

详细 JSON 在本目录，截图及源报告在 D:\develop\GardenerDemo\docs\feedback；Blazor 报告在 packages/blazor/artifacts/feedback-browser.json。

独立全仓 contracts.mjs 仍报告原有三个表单入口 name-group、date-range-group、time-range-group 共 17 个 CSS 部件选择器缺项；反馈没有新增契约错误。本轮不宣称全仓 npm test 全绿。Demo 构建有既有的大体积 chunk 提示，无构建错误。
