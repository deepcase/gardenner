# 电商组件发布复查

组件层检查通过：37 个组件、111 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 和文档已同步。现有组件覆盖商品、规格、购物车、结算、配送、优惠、发票、订单、订阅和账单，本次补足参数与边界行为，不新增重复条目。Blazor 状态输出增加换行，避免长回包撑宽页面。

新增 14 项参数：showHeader、showStatus、showImages、showDescription、showSave、showStock、showOriginalPrice、showCoupon、showSummary、showThumbnails、showCycle、imageFit、imageMaxHeight、listMaxHeight。GardenerDemo 可直接切换参数；CSS 和 Blazor 独立演示均包含全部变体。

修复未选规格被误报缺货、缺货/停用商品阻碍全选取消、未选购物车仍使用独立报价收取费用、订阅请求汇总所有套餐和忽略年付、大金额小数精度损失、文本字段依赖失焦、中文合成输入和受控 Enter 提交旧值、无变化仍触发提案、未知状态字段泄入公开值、错误回包残留等待、业务变体更新未取消请求、确认后更新报价丢失成功提示、销毁后仍可配置、未知请求和未知规格组被接受等问题。发票字段错误与提示关联，图片 URL 拒绝嵌入账号密码。

统一标题 16px、正文 12/14/14px、内距 12/16/20px、控件 28/32/36px；触摸指针环境控件至少 44px。图片可设置填充方式与主图高度；商品列表和表格可限制高度并内部滚动；320px 容器自动重排。隐藏库存不跳过库存校验，隐藏状态保留辅助技术播报。

| 验证 | 结果 |
| --- | --- |
| 电商专项 / 全量运行时 | 30 / 722 项通过 |
| Vue / React / AngularJS | 140 / 89 / 77 项单元测试，Schema 与类型通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过，含可复现构建与包安装入口 |
| 三浏览器常规布局 | 666 个布局，含全部 111 个变体 |
| 三浏览器窄容器 | 333 个 320px 变体通过 |
| 三浏览器状态与新增参数 | 444 个空/加载/错误/只读场景；39 组扩展交互通过 |
| 无障碍 | 74 次 WCAG A/AA 自动扫描无违规，含暗色窄屏 RTL |
| CSS / Blazor 演示 | 各 111 个变体；Blazor 受控数量、尺寸保留、优惠券、完整结算通过 |
| 五端一致性 | 目录、变体、共享样式和运行时哈希一致，559 个 Blazor SSR 合约通过 |
| Website | 七语言、十四页面，每个翻译语言 3318 条文案 |
| 性能 | 42 个 CSS 产物、整体包体、适配器、Blazor 和 45 kB 电商源码限制通过；未提高预算 |

本地 WELCOME10 在服务确认后追加 1000 最小货币单位折扣，清除恢复初始报价。演示包含失败、超时和受控回写。订阅 action.totals 只计算所选套餐的一份月付或年度总价；getTotals 保持通用汇总语义。

演示仅使用本地模拟服务，不创建真实订单、发票、订阅或付款。正式价格、库存、优惠、税费和交易状态由宿主后端确认。自动无障碍扫描不替代人工辅助技术验收。

- [完整演示](http://127.0.0.1:4180/?component=commerce#catalog)
- [逐组件检查清单](release-review/inventory.json)
- [五端参数与服务接入](README.md)
- [机器可读验证](final-verification.json)
- [窄屏结算截图](release-review/checkout-narrow.png)
- [商品详情截图](release-review/product-detail.png)

复现：scripts/build-commerce-examples.mjs、commerce-demo-params.mjs、commerce-docs.mjs、commerce-release-build.mjs、commerce-release-verify-adapters.mjs、commerce-release-checks.mjs、commerce-release-browser-matrix.mjs、commerce-release-extension-matrix.mjs、test-commerce-release-final.mjs、test-commerce-release-static.mjs、test-commerce-release-smoke.mjs、commerce-release-report.mjs，以及 packages/blazor/scripts/test-commerce-release.mjs。原始日志和历史报告位于 release-review。
