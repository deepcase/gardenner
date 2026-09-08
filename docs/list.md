# GList 列表

参考 [Arco Design Vue List](https://arco.design/vue/component/list)。GList 提供独立的文本、图文及带操作列表，原 GListGroup、GMediaList、GVirtualList 保持兼容。

[完整演示](http://127.0.0.1:4180/?component=list#catalog) · [CSS 示例](../packages/css/examples/list.html) · Blazor /list

## 统一参数

五端通过 data-options JSON 配置；原生 DOM 属性为 data-g-data-options。TypeScript 类型 GardenerimListOptions、GardenerimListItem、GardenerimListPagination 从 @gardenerim/css/runtime 导入。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| data | [] | 文本、数字、布尔值、null 或条目对象，最多 100000 项 |
| rowKey | id | 对象键字段，缺省用数组索引；建议提供稳定唯一键 |
| size | medium | small / medium / large；行垂直内边距 9 / 13 / 17px，水平 20px |
| bordered / split | true / true | 边框与分割线 |
| hoverable | false | 鼠标悬停背景 |
| header / footer | 无 | 标题与页脚文字 |
| headerTemplate / footerTemplate / emptyTemplate | 无 | 原生 template 元素 ID |
| loading / disabled | false | 加载中 / 禁止操作；分页、条目操作和加载更多按钮禁用 |
| emptyText / loadingText / error | No data / Loading… / 无 | 空数据、加载与错误状态；error 时停止显示旧条目 |
| label | List | 列表与滚动区域的无障碍名称 |
| actionLayout | horizontal | horizontal 右侧操作 / vertical 内容下方操作 |
| paginationProps | 未设置 | 设置对象后启用分页，见下表 |
| gridProps | 未设置 | span 或 xs/sm/md/lg/xl/xxl 的 1–24 栅格跨度；gutter 为 0–64px，建议跨度使用 24 的约数 |
| maxHeight | 未设置 | 最大滚动高度；0 表示不限制，正数像素或 px/vh/rem/em 字符串 |
| virtualListProps | 未设置 | {height,itemHeight,overscan} 固定行高虚拟列表；height 80–2000px，itemHeight 24–1000px，overscan 默认 3，允许 0–20 |
| bottomOffset | 0 | 距离底部多少像素触发 reachBottom，允许 0–10000 |
| scrollbar | true | false 隐藏原生滚动条，仍可滚动及键盘访问 |
| loadMore / hasMore | false / true | 显示加载更多入口 / 是否还有数据 |
| labels | 内置英文 | previous、next、page、pageSize、loadMore、total、jump 文案 |

四个变体 default、small、medium、large。显式 size 及通用 dataSize、dataBordered、dataDisabled 配置生效；DOM 对应 data-g-data-size、data-g-data-bordered、data-g-data-disabled。

### 条目对象

id 或 rowKey 指定字段为稳定键。title、description、content、extra 按纯文本渲染；avatar 为图片 URL，avatarText 为头像文字，图片失败后显示文字。actions 为 [{key,label,disabled?}]，点击时发出包含条目和操作标识的事件。条目 disabled 禁止本项操作；actionLayout 可以独立覆盖列表布局。

titleTemplate、descriptionTemplate、contentTemplate、extraTemplate 支持富内容。模板不是框架插槽：内容在本页 template 中定义，克隆后初始化 Gardener 控件，移除时销毁。同一条目数据不变的尺寸、边框和栅格更新保留输入值与焦点；翻页或离开虚拟窗口会卸载条目，业务应保存输入状态。

### 分页

| paginationProps 参数 | 默认值 | 说明 |
| --- | --- | --- |
| current / defaultCurrent | 未设置 / 1 | 受控页码 / 首次配置的初始页码，从 1 开始 |
| pageSize / defaultPageSize | 未设置 / 10 | 受控 / 初始每页数量，1–1000 |
| total | 未设置 | 未设置时在 data 上做本地分页；设置时表示服务端总数，data 只传当前页 |
| showTotal / showPageSize / showJumper / simple | false | 总数、每页数量、页码输入（Enter 确认）、简洁页码显示 |
| pageSizeOptions | [10,20,50] | 当前 pageSize 会自动加入选项 |
| hideOnSinglePage | false | 仅一页时隐藏分页栏 |

本地数据缩减时修正越界页码。受控 current/pageSize 只提出修改，宿主必须回写 gardener:change 的 value；更改每页数量会请求第一页。服务端分页的加载与错误处理由业务负责，不自动请求网络。

## 五端用法

共享配置示例：

```js
const options={header:'项目列表',data:[{id:1,title:'Gardener',description:'跨框架组件',actions:[{key:'view',label:'查看'}]}],paginationProps:{defaultPageSize:5,showTotal:true}};
```

- CSS：`<div class="g-list" data-g-data-display></div>`，设置元素 dataset.gDataOptions=JSON.stringify(options)，调用 init(element)。
- Vue：`<GList :config="{'data-options':JSON.stringify(options)}" />`。
- React：`<GList config={{'data-options':JSON.stringify(options)}} />`。
- AngularJS：`<div g-list gardener-config="config"></div>`，config 为 {'data-options':JSON.stringify(options)}。
- Blazor：`<GList Config="Config" />`，字典键 data-options，值 JsonSerializer.Serialize(options)。

Vue 监听 @gardener:change / @gardener:action；React 使用框架事件绑定或原生 addEventListener；AngularJS 与 Blazor 使用既有 Gardener 事件桥。

## 事件与实例

- gardener:beforechange：分页修改前的可取消事件，含 reason、value、previousValue、controlled。
- gardener:change：reason 为 pageChange 或 pageSizeChange，value 为 {current,pageSize}，另含 current、pageSize、controlled。
- gardener:action：reason 为 itemAction、loadMore、scroll、reachBottom。itemAction 含 key、index、action、item；scroll 含 scrollTop；reachBottom/loadMore 含 count。
- gardener:error：无效配置触发，保留上次有效视图。

getInstance(element,'data-display') 返回共享实例，支持 setOptions、getState、refresh、scrollTo(index)、destroy。scrollTo 的 index 从当前页的 0 开始；虚拟列表定位到指定行并更新窗口。加载更多仅发出请求，业务追加 data 后由组件显示；不会伪造返回数据。

## 范围与约束

与 Arco 对齐的尺寸重点是三档列表密度、标题/页脚、图文和操作间距。虚拟列表为固定行高，实现不支持动态高度测量；避免在固定高度条目内放置超高内容。gridProps 与 virtualListProps 不能同时使用，无效组合会被拒绝。栅格使用等宽列布局，未实现 Arco Grid 的所有细项；scrollbar 是原生滚动条，不是自定义滚动条组件。上述边界在五端一致。
