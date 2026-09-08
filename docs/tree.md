# GTree 树形控件

参考 [Arco Design Vue Tree](https://arco.design/vue/component/tree)，对照版本 2.58.0。CSS、Vue、React、AngularJS、Blazor 使用同一份 tree.js 控制器和 data.css 样式。保留手写 role=treeitem 的旧树；通过 tree-options 启用新数据模式。框架延迟写入配置后调用 init 也可以切换模式。

## 接入

CSS / JavaScript：

```html
<div id="files" class="g-tree" data-g-tree
  data-g-tree-options='{"data":[{"key":"docs","title":"文档","children":[{"key":"guide","title":"指南"}]}],"checkable":true,"showLine":true}'></div>
<script type="module">
import {init,getInstance} from '@gardenerim/css/runtime';
init(document.getElementById('files'));
const tree=getInstance('#files','tree');
tree.setOptions({size:'small',multiple:true});
</script>
```

Vue：`<GTree :config="{'tree-options': JSON.stringify(options)}" @gardener:change="onChange" />`。
React：`<GTree config={{'tree-options': JSON.stringify(options)}} />`；通过 ref 的 element 监听 gardener:change。
AngularJS：`<div class="g-tree" g-tree gardener-config="config"></div>`，config 为同名 tree-options 字典，通过 $gardenerHandle.getInstance('tree') 取得控制器。
Blazor：`<GTree Config="Config" EventNames="@(new[]{"change","error"})" OnEvent="Handle" />`，Config["tree-options"] 为序列化选项。完整运行示例见 [TreeLab.razor](../packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/TreeLab.razor)。

函数不能序列化到 JSON：通过组件 handle 的 getInstance('tree').setOptions 安装 loadMore、allowDrop、filterTreeNode 等回调。Blazor 可使用 JS interop，或监听 load-request 并由服务端回写 data/loadingKeys。模板使用原生 template 的 id，避免将业务 HTML 作为字符串直接插入。

## 参数

| 参数 | 默认值 | 用途 |
| --- | --- | --- |
| data | [] | 层级节点数组；key 为全树唯一字符串或有限数字，数字 1 与字符串 "1" 视为同一个 key |
| fieldNames | 标准字段名 | 映射 key/title/children/disabled/disableCheckbox/selectable/checkable/isLeaf |
| size | medium | mini / small / medium / large，节点高度 24 / 28 / 32 / 36 px |
| blockNode / showLine | false / false | 整行标题背景、层级连接线 |
| indent | 22；有线时 24 | 层级缩进，12–80 px |
| multiple / selectable | false / true | 多选；selectable 可为节点谓词 |
| selectedKeys / defaultSelectedKeys | 未设置 / [] | 受控选择与初始选择 |
| checkable / checkStrictly | false / false | 显示勾选框（可为谓词）；取消父子联动 |
| checkedKeys / defaultCheckedKeys | 未设置 / [] | 受控勾选与初始勾选 |
| halfCheckedKeys | [] | 严格模式的半选状态；联动模式自动计算 |
| checkedStrategy | all | all / parent / child，仅改变事件和快照输出，不改变勾选关联 |
| onlyCheckLeaf | false | 只显示叶节点的勾选框 |
| expandedKeys / defaultExpandedKeys | 未设置 / 自动 | 受控展开与初始展开 |
| defaultExpandAll | true | 初次展开已加载分支，不会自动请求全部远程数据 |
| defaultExpandSelected / defaultExpandChecked | false | 初次展开所选、所勾选节点的祖先 |
| autoExpandParent | true | 受控展开值自动包含祖先；收起时建议接收事件中的完整 expandedKeys |
| searchValue / filterTreeNode | 空 / 未设置 | 按标题搜索或节点谓词筛选，保留祖先路径并临时展开 |
| actionOnNodeClick | 未设置 | 默认选择；可设 expand 或 check |
| disabled / loading / error | false / false / 空 | 整体禁用、加载状态、错误说明 |
| emptyText / loadingText / label | No data / Loading… / Tree | 空与加载文案、树的可访问名称 |
| loadingKeys | [] | 外部异步加载节点的忙状态 |
| loadMore | 未设置 | (node,{signal}) => Node[] 或 Promise<Node[]> |
| serviceTimeout | 60000 | 加载超时毫秒，0 关闭，最大 600000 |
| draggable / dataControlled | false / false | 原生拖拽；仅输出新树并等待父组件接收 |
| allowDrop | 未设置 | (source,target,position) => boolean；position 为 before/inside/after |
| virtualListProps | 未设置 | {height:80–2000,overscan:0–30}；overscan 默认 3 |
| titleTemplate / extraTemplate | 未设置 | 原生 template id，可由节点覆盖 |
| onChange | 未设置 | 控制器变更回调，可代替原生事件监听 |

节点支持 title、children、isLeaf、disabled、disableCheckbox、selectable、checkable、icon（文本）、extra（文本）、titleTemplate、extraTemplate。数据在边界克隆并校验；最多 50,000 个节点、100 层，拒绝重复 key、循环数据和非法字段。isLeaf:false 且未提供 children 表示可异步加载的分支；children:[] 表示已加载。

## 状态与事件

选择、勾选、展开分别受控：传入对应 Keys 数组后，操作发送建议值，只有父组件回写才改变该状态。默认值仅首次初始化使用。setOptions 中 undefined 移除命令式覆盖；若 HTML 配置还提供该值，则恢复 HTML 值。

gardener:beforechange 可 preventDefault 取消选择、勾选、展开或拖拽。gardener:change 包含 component:'tree'、reason、key、node、data、selectedKeys、checkedKeys、halfCheckedKeys、expandedKeys、loadingKeys、value 和 controlled；拖拽另含 dropKey/dropPosition。reason 为 select/check/expand/load/load-request/drop。onChange 的快照还包含 count/visibleCount。加载和验证失败发送 gardener:error（reason、message、key）；展开与收起保留 gardener:expand/collapse。

联动勾选将 disabled/disableCheckbox 分支作为边界，不穿过该分支修改子树；selectable:false 仅禁止选择。checkedStrategy 只裁剪输出，受控父组件应采用所选策略返回的完整数组。搜索清空后恢复原展开状态。错误或加载状态阻止节点操作。

loadMore 对同一节点去重。数据替换、销毁会 abort 并忽略过期返回；失败后可再次调用 load 或重新展开重试。仅修改尺寸等选项保留异步数据和本地拖拽；显式 setOptions({data}) 将重置为传入的数据，即便它与初始数据相同。

拖拽拒绝自身、后代循环、禁用目标和显式叶节点内部放置。dataControlled=true 时，调用方必须接收 change.data；也可由按钮或菜单调用 drop 实现键盘可操作的业务排序界面。

## 方法

getState() 返回树与状态快照；value() 返回选择键。setOptions(patch)、refresh() 更新配置；select(key)、check(key,checked?)、expand(key,expanded=true)、load(key)、drop(source,target,position='inside')、focus(key)、scrollTo(key)、destroy()。

键盘：上下移动，左右展开/收起（RTL 对称），Home/End 首尾，Enter 选择，空格勾选，单字符首字定位。树使用 aria-activedescendant、level/posinset/setsize、selected/checked/expanded/busy。自定义模板中的原生输入与按钮保留自身操作。

虚拟列表使用固定行高，只挂载窗口与预加载行；标题单行省略。离开窗口、被搜索隐藏或被收起的模板会卸载，业务编辑值应外部存储；仍挂载且 key/template id 相同的节点会保留原生输入状态。focus/scrollTo 只定位当前可见序列中的节点，需要先展开其祖先。虚拟化限制 DOM 数量，数据校验、索引和快照仍遍历数据。

## 参考边界与演示

本实现对齐 Arco 的核心交互和比例，并统一五端。它使用 JSON/控制器/原生模板接口，不是 Arco Vue API 的逐项替换；未实现任意可变行高、Arco 的动画/插槽协议、checkable 字符串模式和完整 virtualListProps 透传。

[原生演示](../packages/css/examples/tree.html) · [GardenerDemo](http://127.0.0.1:4180/?component=tree#catalog) · [Website](../website/docs.html#tree-data-mode)。GardenerDemo 提供 14 组场景。验收脚本与报告位于 docs/tree/ 和 scripts/test-tree-*.mjs；不将单组件验收推断为全库发布认证。
