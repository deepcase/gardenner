# 组件能力等级

506 表示可寻址的组件契约数量，不表示 506 个独立的完整业务引擎。2.0 没有通过增加别名或目录项来扩大这个数字。

| 层级 | 当前含义 | 应用仍需要完成 |
| --- | --- | --- |
| CSS / css-ready | 类名、结构、变体、状态样式与组合部件 | 数据、事件和业务状态 |
| interactive / runtime-ready | 上述能力及已列出的运行时行为、实例方法、事件 | 业务数据接入与跨组件流程 |
| 数据驱动模式 | DataGrid 显式 setOptions，提供列/行/分页/选择/编辑/定高窗口化等 | 认证、权限、持久化、服务端校验 |

当前基础目录为 373 项 CSS 和 133 项 interactive。相同运行时行为可服务多个组合结构，因此组件数、行为数、事件数不可混为一谈。

组件目录的 `type`、`behaviors`、`parts` 及行为目录的 `instanceMembers` 是实际能力依据；任何选项、方法和事件都应在契约与可执行回归中出现。交互数量之外，还要验证清空、重置、异步选项、IME、卸载、嵌套和并发请求等边界。

TypeScript 消费者可从适配器的 `./contracts` 导入生成的严格类型。它是 opt-in，保留原有开放字符串属性的兼容性：

```ts
import type { GardenerimStrictProps, GardenerimDataGridOptions } from '@gardenerim/react/contracts';
const button = { variant: 'primary' } satisfies GardenerimStrictProps<'button'>;
// variant: 'primray' 会报类型错误。
type Row = { id: number; name: string };
const grid = { columns: [{ field: 'name' }], rows: [] } satisfies GardenerimDataGridOptions<Row>;
// field: 'nmae' 会报类型错误。
```
