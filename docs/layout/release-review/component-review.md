# 布局逐组件发布复查

| 组件 | 本轮复查结果与修复 |
| --- | --- |
| grid-system | 显式列数、窄屏多列、跨列重置；subgrid 提供普通网格后备 |
| region-layout-system | 保留五区域与容器响应，最大高度/内部滚动和打印上限解除 |
| classic-layout-primitives | Bento 窄屏移除多余轨道与行跨度；支持行高、列数；瀑布流遵循独立行列间距 |
| page-header | compact 默认 8/12px，显式内距/对齐可覆盖；主标题 20px |
| section-header | 16px 次级标题，紧凑、无边框与对齐参数保持一致 |
| subheader | 16px 标题，逻辑内距与换行参数生效 |
| footer-bar | 16px 信息层级，居中/末尾/吸底组合可调整 |
| app-shell | 移除默认零宽第三列及窄屏空行产生的间隙；修复 sidebar 变体误套内部侧栏样式导致的偏移和高度；双侧栏独立模板；保留原始 hidden/inert/disabled；动态关联、焦点与收起策略 |
| dashboard | 默认 3 列，显式列数/对齐/行高优先，窄屏列数可选 |
| mobile-shell | 头尾、安全区、容器/页面定位保留，主内容逻辑内距同步 |
| responsive-container | reading/wide/narrow/fluid 不再覆盖显式 maxWidth；可组合逻辑内距和最大高度 |


详细参数、五端接口和验证记录见 [布局文档](../README.md)。
