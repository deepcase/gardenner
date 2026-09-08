# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-browser.spec.mjs >> dashboard filters update real metrics and charts keep readable SVG text after resizing
- Location: tests\browser\cross-browser.spec.mjs:1171:1

# Error details

```
Error: expect(received).toBeTruthy()

Received: false

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- main [ref=e2]:
  - heading "仪表盘 · 指标、筛选、图表与目标" [level=1] [ref=e3]
  - generic [ref=e4]:
    - heading "联动经营概览" [level=2] [ref=e5]
    - paragraph [ref=e6]: 修改周期和团队后点击“应用筛选”，下方图表和营业额会同步使用同一份筛选结果。
    - generic [ref=e7]:
      - region "filter-bar" [ref=e8]:
        - generic [ref=e9]:
          - generic [ref=e10]:
            - generic [ref=e11]: 统计周期
            - combobox "统计周期" [ref=e12] [cursor=pointer]:
              - option "最近 7 天"
              - option "本月" [selected]
              - option "本季度"
          - generic [ref=e13]:
            - generic [ref=e14]: 团队
            - combobox "团队" [ref=e15] [cursor=pointer]:
              - option "全部团队" [selected]
              - option "华东团队"
              - option "华南团队"
          - generic [ref=e16]:
            - generic [ref=e17]: 项目检索
            - searchbox "项目检索" [ref=e18]
        - generic [ref=e19]:
          - button "应用筛选" [ref=e20] [cursor=pointer]
          - button "重置" [ref=e21] [cursor=pointer]
      - generic [ref=e22]:
        - button "加载本地数据" [ref=e23] [cursor=pointer]
        - button "取消加载" [ref=e24] [cursor=pointer]
    - generic [ref=e25]:
      - generic [ref=e26]:
        - region "本月营业额" [ref=e27]:
          - generic [ref=e29]: ¥128,650.75
          - generic [ref=e30]:
            - text: ↑ +14.5%
            - generic [ref=e31]: 较上一周期
          - paragraph [ref=e32]: 已扣除退款，按订单完成时间统计
        - generic [ref=e33]:
          - button "加载本地数据" [ref=e34] [cursor=pointer]
          - button "取消加载" [ref=e35] [cursor=pointer]
      - generic [ref=e36]:
        - region "营收与成本趋势" [ref=e37]:
          - generic [ref=e38]:
            - strong [ref=e39]: 营收与成本趋势
            - button "导出 CSV" [ref=e40] [cursor=pointer]
          - generic [ref=e41]:
            - button "营收" [pressed] [ref=e42] [cursor=pointer]
            - button "成本" [pressed] [ref=e44] [cursor=pointer]
          - group "最近六个月营收与成本，单位万元" [ref=e46]:
            - generic [ref=e47]: "0"
            - generic [ref=e48]: "24"
            - generic [ref=e49]: "48"
            - generic [ref=e50]: "72"
            - generic [ref=e51]: "96"
            - generic [ref=e52]: 1 月
            - generic [ref=e53]: 3 月
            - generic [ref=e54]: 5 月
            - button "营收 · 1 月 · 42.0" [ref=e56] [cursor=pointer]
            - button "营收 · 2 月 · 56.0" [ref=e57] [cursor=pointer]
            - button "营收 · 3 月 · 51.0" [ref=e58] [cursor=pointer]
            - button "营收 · 4 月 · 73.0" [ref=e59] [cursor=pointer]
            - button "营收 · 5 月 · 81.0" [ref=e60] [cursor=pointer]
            - button "营收 · 6 月 · 96.0" [ref=e61] [cursor=pointer]
            - button "成本 · 1 月 · 28.0" [ref=e63] [cursor=pointer]
            - button "成本 · 2 月 · 35.0" [ref=e64] [cursor=pointer]
            - button "成本 · 3 月 · 32.0" [ref=e65] [cursor=pointer]
            - button "成本 · 4 月 · 45.0" [ref=e66] [cursor=pointer]
            - button "成本 · 5 月 · 49.0" [ref=e67] [cursor=pointer]
            - button "成本 · 6 月 · 57.0" [ref=e68] [cursor=pointer]
          - group [ref=e69]:
            - generic "查看数据表" [ref=e70]
        - generic [ref=e71]:
          - button "加载本地数据" [ref=e72] [cursor=pointer]
          - button "取消加载" [ref=e73] [cursor=pointer]
  - generic [ref=e74]:
    - heading "kpi-stat" [level=2] [ref=e75]
    - generic [ref=e76]:
      - text: 变体
      - combobox "变体" [ref=e77]:
        - option "默认" [selected]
        - option "compact"
        - option "comfortable"
        - option "borderless"
        - option "horizontal"
        - option "centered"
        - option "accent"
    - region "本月营业额" [ref=e78]:
      - generic [ref=e80]: ¥128,650.75
      - generic [ref=e81]:
        - text: ↑ +14.5%
        - generic [ref=e82]: 较上一周期
      - paragraph [ref=e83]: 已扣除退款，按订单完成时间统计
    - generic [ref=e84]:
      - button "加载本地数据" [ref=e85] [cursor=pointer]
      - button "取消加载" [ref=e86] [cursor=pointer]
  - generic [ref=e87]:
    - heading "filter-bar" [level=2] [ref=e88]
    - generic [ref=e89]:
      - text: 变体
      - combobox "变体" [ref=e90]:
        - option "默认" [selected]
        - option "compact"
        - option "comfortable"
        - option "borderless"
        - option "vertical"
        - option "sticky"
        - option "inline"
    - region "filter-bar" [ref=e91]:
      - generic [ref=e92]:
        - generic [ref=e93]:
          - generic [ref=e94]: 统计周期
          - combobox "统计周期" [ref=e95] [cursor=pointer]:
            - option "最近 7 天"
            - option "本月" [selected]
            - option "本季度"
        - generic [ref=e96]:
          - generic [ref=e97]: 团队
          - combobox "团队" [ref=e98] [cursor=pointer]:
            - option "全部团队" [selected]
            - option "华东团队"
            - option "华南团队"
        - generic [ref=e99]:
          - generic [ref=e100]: 项目检索
          - searchbox "项目检索" [ref=e101]
      - generic [ref=e102]:
        - button "应用筛选" [ref=e103] [cursor=pointer]
        - button "重置" [ref=e104] [cursor=pointer]
    - generic [ref=e105]:
      - button "加载本地数据" [ref=e106] [cursor=pointer]
      - button "取消加载" [ref=e107] [cursor=pointer]
  - generic [ref=e108]:
    - heading "chart-container" [level=2] [ref=e109]
    - generic [ref=e110]:
      - text: 变体
      - combobox "变体" [ref=e111]:
        - option "默认" [selected]
        - option "compact"
        - option "comfortable"
        - option "borderless"
        - option "line"
        - option "area"
        - option "bar"
        - option "donut"
    - region "营收与成本趋势" [ref=e112]:
      - generic [ref=e113]:
        - strong [ref=e114]: 营收与成本趋势
        - button "导出 CSV" [ref=e115] [cursor=pointer]
      - generic [ref=e116]:
        - button "营收" [pressed] [ref=e117] [cursor=pointer]
        - button "成本" [pressed] [ref=e119] [cursor=pointer]
      - group "最近六个月营收与成本，单位万元" [ref=e121]:
        - generic [ref=e122]: "0"
        - generic [ref=e123]: "24"
        - generic [ref=e124]: "48"
        - generic [ref=e125]: "72"
        - generic [ref=e126]: "96"
        - generic [ref=e127]: 1 月
        - generic [ref=e128]: 3 月
        - generic [ref=e129]: 5 月
        - button "营收 · 1 月 · 42.0" [ref=e131] [cursor=pointer]
        - button "营收 · 2 月 · 56.0" [ref=e132] [cursor=pointer]
        - button "营收 · 3 月 · 51.0" [ref=e133] [cursor=pointer]
        - button "营收 · 4 月 · 73.0" [ref=e134] [cursor=pointer]
        - button "营收 · 5 月 · 81.0" [ref=e135] [cursor=pointer]
        - button "营收 · 6 月 · 96.0" [ref=e136] [cursor=pointer]
        - button "成本 · 1 月 · 28.0" [ref=e138] [cursor=pointer]
        - button "成本 · 2 月 · 35.0" [ref=e139] [cursor=pointer]
        - button "成本 · 3 月 · 32.0" [ref=e140] [cursor=pointer]
        - button "成本 · 4 月 · 45.0" [ref=e141] [cursor=pointer]
        - button "成本 · 5 月 · 49.0" [ref=e142] [cursor=pointer]
        - button "成本 · 6 月 · 57.0" [ref=e143] [cursor=pointer]
      - group [ref=e144]:
        - generic "查看数据表" [ref=e145]
    - generic [ref=e146]:
      - button "加载本地数据" [ref=e147] [cursor=pointer]
      - button "取消加载" [ref=e148] [cursor=pointer]
  - generic [ref=e149]:
    - heading "kpi-group" [level=2] [ref=e150]
    - generic [ref=e151]:
      - text: 变体
      - combobox "变体" [ref=e152]:
        - option "默认" [selected]
        - option "compact"
        - option "comfortable"
        - option "borderless"
        - option "divided"
        - option "stacked"
    - region "kpi-group" [ref=e153]:
      - generic [ref=e154]:
        - generic [ref=e155]: 活跃客户
        - generic [ref=e156]: 2,860户
        - generic [ref=e157]:
          - text: ↑ +19.2%
          - generic [ref=e158]: 较上一周期
      - generic [ref=e159]:
        - generic [ref=e160]: 成交订单
        - generic [ref=e161]: 1,368笔
        - generic [ref=e162]:
          - text: ↑ +14%
          - generic [ref=e163]: 较上一周期
      - generic [ref=e164]:
        - generic [ref=e165]: 转化率
        - generic [ref=e166]: 28.6%
        - generic [ref=e167]:
          - text: ↑ +19.2%
          - generic [ref=e168]: 较上一周期
      - generic [ref=e169]:
        - generic [ref=e170]: 响应时间
        - generic [ref=e171]: 182ms
        - generic [ref=e172]:
          - text: ↓ -24.2%
          - generic [ref=e173]: 较上一周期
    - generic [ref=e174]:
      - button "加载本地数据" [ref=e175] [cursor=pointer]
      - button "取消加载" [ref=e176] [cursor=pointer]
  - generic [ref=e177]:
    - heading "dashboard-widget" [level=2] [ref=e178]
    - generic [ref=e179]:
      - text: 变体
      - combobox "变体" [ref=e180]:
        - option "默认" [selected]
        - option "compact"
        - option "comfortable"
        - option "borderless"
        - option "flat"
        - option "accent"
    - region "团队协作摘要" [ref=e181]:
      - generic [ref=e182]:
        - strong [ref=e183]: 团队协作摘要
        - button "收起" [expanded] [ref=e184] [cursor=pointer]
      - generic [ref=e185]:
        - paragraph [ref=e186]: 本周已交付 8 项任务，另有 3 项正在进行。
        - generic [ref=e187]:
          - text: 交接备注
          - textbox "交接备注" [ref=e188]: 周五安排验收
        - list [ref=e189]:
          - listitem [ref=e190]: 设计变量完成评审
          - listitem [ref=e191]: 移动端适配进入验收
    - generic [ref=e192]:
      - button "加载本地数据" [ref=e193] [cursor=pointer]
      - button "取消加载" [ref=e194] [cursor=pointer]
  - generic [ref=e195]:
    - heading "goal-tracker" [level=2] [ref=e196]
    - generic [ref=e197]:
      - text: 变体
      - combobox "变体" [ref=e198]:
        - option "默认" [selected]
        - option "compact"
        - option "comfortable"
        - option "borderless"
        - option "horizontal"
        - option "centered"
    - region "季度签约目标" [ref=e199]:
      - strong [ref=e201]: 季度签约目标
      - generic [ref=e202]: 780,000元
      - progressbar "季度签约目标" [ref=e203]
      - generic [ref=e205]:
        - generic [ref=e206]: 目标 1,000,000
        - generic [ref=e207]: 剩余 220,000
    - generic [ref=e208]:
      - button "加载本地数据" [ref=e209] [cursor=pointer]
      - button "取消加载" [ref=e210] [cursor=pointer]
  - generic [ref=e211]:
    - heading "gauge-chart" [level=2] [ref=e212]
    - generic [ref=e213]:
      - text: 变体
      - combobox "变体" [ref=e214]:
        - option "默认" [selected]
        - option "compact"
        - option "comfortable"
        - option "borderless"
        - option "semicircle"
        - option "ring"
    - region "服务健康评分" [ref=e215]:
      - strong [ref=e217]: 服务健康评分
      - img "82 · 0–100" [ref=e218]
      - generic [ref=e221]: 82 分
      - paragraph [ref=e222]: 0 — 100
    - generic [ref=e223]:
      - button "加载本地数据" [ref=e224] [cursor=pointer]
      - button "取消加载" [ref=e225] [cursor=pointer]
  - group "参数组合" [ref=e226]:
    - generic [ref=e228]:
      - text: 尺寸
      - combobox "尺寸" [ref=e229]:
        - option "默认" [selected]
        - option "small"
        - option "medium"
        - option "large"
    - generic [ref=e230]:
      - text: 边框
      - combobox "边框" [ref=e231]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e232]:
      - text: 指标列数
      - combobox "指标列数" [ref=e233]:
        - option "默认" [selected]
        - option "1"
        - option "2"
        - option "3"
        - option "4"
    - generic [ref=e234]:
      - text: 标题
      - combobox "标题" [ref=e235]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e236]:
      - text: 图例
      - combobox "图例" [ref=e237]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e238]:
      - text: 网格线
      - combobox "网格线" [ref=e239]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e240]:
      - text: 坐标文字
      - combobox "坐标文字" [ref=e241]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e242]:
      - text: 数据点
      - combobox "数据点" [ref=e243]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e244]:
      - text: 数据表入口
      - combobox "数据表入口" [ref=e245]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e246]:
      - text: 趋势
      - combobox "趋势" [ref=e247]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e248]:
      - text: 指标说明
      - combobox "指标说明" [ref=e249]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e250]:
      - text: 目标值
      - combobox "目标值" [ref=e251]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e252]:
      - text: 剩余目标
      - combobox "剩余目标" [ref=e253]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e254]:
      - text: 仪表范围
      - combobox "仪表范围" [ref=e255]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e256]:
      - text: 数值
      - combobox "数值" [ref=e257]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e258]:
      - text: 应用筛选
      - combobox "应用筛选" [ref=e259]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e260]:
      - text: 重置筛选
      - combobox "重置筛选" [ref=e261]:
        - option "默认" [selected]
        - option "true"
        - option "false"
    - generic [ref=e262]:
      - text: 面板最大高度
      - combobox "面板最大高度" [ref=e263]:
        - option "默认" [selected]
        - option "320"
        - option "480"
        - option "640"
    - generic [ref=e264]:
      - text: 数据表高度
      - combobox "数据表高度" [ref=e265]:
        - option "默认" [selected]
        - option "120"
        - option "240"
        - option "480"
    - generic [ref=e266]:
      - text: 数据点半径
      - combobox "数据点半径" [ref=e267]:
        - option "默认" [selected]
        - option "2"
        - option "4"
        - option "8"
    - generic [ref=e268]:
      - text: 曲线线宽
      - combobox "曲线线宽" [ref=e269]:
        - option "默认" [selected]
        - option "1"
        - option "2"
        - option "4"
    - generic [ref=e270]:
      - text: 圆环宽度
      - combobox "圆环宽度" [ref=e271]:
        - option "默认" [selected]
        - option "12"
        - option "28"
        - option "40"
    - generic [ref=e272]:
      - text: 加载超时
      - combobox "加载超时" [ref=e273]:
        - option "默认" [selected]
        - option "200"
        - option "1000"
        - option "60000"
  - status [ref=e274]: "{\"value\":0,\"filters\":{\"period\":\"month\",\"team\":\"all\",\"keyword\":\"\"},\"hiddenSeries\":[],\"collapsed\":false}"
```

# Test source

```ts
  1078 |   const field = form.locator("#shipping-fields");
  1079 |   const address = form.locator("#shipping-address");
  1080 | 
  1081 |   await expect(field).toBeVisible();
  1082 |   await expect(field).toHaveAttribute("data-g-state", "visible");
  1083 |   await expect(field).toHaveAttribute("aria-hidden", "false");
  1084 |   await expect(controller).toHaveAttribute("aria-controls", /(?:^|\s)shipping-fields(?:\s|$)/u);
  1085 |   await expect(address).toBeEnabled();
  1086 |   await address.fill("上海市徐汇区");
  1087 |   expect(await form.evaluate((node) => Object.fromEntries(new FormData(node))).then((data) => data.shippingAddress)).toBe("上海市徐汇区");
  1088 | 
  1089 |   const style = await field.evaluate((node) => {
  1090 |     const computed = getComputedStyle(node);
  1091 |     return {
  1092 |       width: node.getBoundingClientRect().width,
  1093 |       background: computed.backgroundColor,
  1094 |       border: computed.borderTopWidth,
  1095 |       radius: computed.borderTopLeftRadius,
  1096 |     };
  1097 |   });
  1098 |   expect(style.width).toBeGreaterThan(240);
  1099 |   expect(style.background).not.toBe("rgba(0, 0, 0, 0)");
  1100 |   expect(style.border).toBe("1px");
  1101 |   expect(style.radius).not.toBe("0px");
  1102 | 
  1103 |   await controller.selectOption("pickup");
  1104 |   await expect(field).toBeHidden();
  1105 |   await expect(field).toHaveAttribute("data-g-state", "hidden");
  1106 |   await expect(field).toHaveAttribute("inert", "");
  1107 |   await expect(address).toBeDisabled();
  1108 |   expect(await form.evaluate((node) => Object.fromEntries(new FormData(node))).then((data) => data.shippingAddress)).toBeUndefined();
  1109 | 
  1110 |   await controller.selectOption("shipping");
  1111 |   await expect(field).toBeVisible();
  1112 |   await expect(address).toBeEnabled();
  1113 |   await expect(address).toHaveValue("上海市徐汇区");
  1114 | });
  1115 | 
  1116 | for (const { name, url } of releasePages) {
  1117 |   test(`${name} loads without browser or layout failures`, async ({ page, browserName }) => {
  1118 |     if (name === "website/docs.html") test.setTimeout(90_000);
  1119 |     const failures = collectPageFailures(page);
  1120 |     const response = await page.goto(url, { waitUntil: "networkidle" });
  1121 | 
  1122 |     expect(
  1123 |       response?.ok(),
  1124 |       `${name} must return a successful document response`,
  1125 |     ).toBe(true);
  1126 |     if (name.startsWith("website/")) {
  1127 |       const file = name.endsWith("docs.html") ? "docs.html" : "index.html";
  1128 |       await page.waitForURL(
  1129 |         ({ pathname }) => pathname === `/website/en/${file}`,
  1130 |         { waitUntil: "networkidle" },
  1131 |       );
  1132 |     }
  1133 |     await expect(page.locator("body")).toBeVisible();
  1134 | 
  1135 |     const documentState = await page.evaluate(() => ({
  1136 |       title: document.title.trim(),
  1137 |       language: document.documentElement.lang,
  1138 |       hasGardenerimStylesheet: [...document.styleSheets].some(({ href }) =>
  1139 |         href && /\/gardener(?:\.min)?\.css(?:[?#]|$)/.test(href),
  1140 |       ),
  1141 |       hasHorizontalOverflow:
  1142 |         document.documentElement.scrollWidth >
  1143 |         document.documentElement.clientWidth + 1,
  1144 |     }));
  1145 | 
  1146 |     expect(documentState.title).not.toBe("");
  1147 |     expect(documentState.language).not.toBe("");
  1148 |     expect(documentState.hasGardenerimStylesheet).toBe(true);
  1149 |     expect(documentState.hasHorizontalOverflow).toBe(false);
  1150 |     expect(['examples/content-lab.html','examples/media-lab.html'].includes(name) ? await contentMediaFailures(page, failures, browserName) : failures).toEqual([]);
  1151 |   });
  1152 | }
  1153 | 
  1154 | test("dialog keyboard lifecycle works in the native browser", async ({
  1155 |   page,
  1156 | }) => {
  1157 |   const failures = collectPageFailures(page);
  1158 |   await page.goto(exampleUrl("showcase.html"), { waitUntil: "networkidle" });
  1159 | 
  1160 |   const trigger = page.locator('[data-g-dialog-open="demo-dialog"]');
  1161 |   const dialog = page.locator("#demo-dialog");
  1162 |   await trigger.click();
  1163 |   await expect(dialog).toBeVisible();
  1164 |   await expect(dialog.locator(":focus")).toHaveCount(1);
  1165 | 
  1166 |   await page.keyboard.press("Escape");
  1167 |   await expect(dialog).toBeHidden();
  1168 |   await expect(trigger).toBeFocused();
  1169 |   expect(failures).toEqual([]);
  1170 | });
  1171 | test('dashboard filters update real metrics and charts keep readable SVG text after resizing',async({page})=>{
  1172 |  const failures=collectPageFailures(page);
  1173 |  await page.goto(exampleUrl('dashboard-compositions.html'));
  1174 |  const filter=page.locator('#dashboard-linked-filter'),kpi=page.locator('#dashboard-linked-kpi .g-kpi-value'),chart=page.locator('#dashboard-linked-chart');
  1175 |  await expect(kpi).toContainText('128,650.75');await filter.locator('[data-g-dashboard-field=period]').selectOption('week');await filter.locator('[data-g-dashboard-action=apply]').click();await expect(kpi).toContainText('32,162.69');
  1176 |  await filter.locator('[data-g-dashboard-field=keyword]').fill('成本');await filter.locator('[data-g-dashboard-action=apply]').click();await expect(chart.locator('[data-g-dashboard-action=series]')).toHaveCount(1);await expect(chart.locator('[data-g-dashboard-action=series]')).toContainText('成本');
  1177 |  await filter.locator('[data-g-dashboard-field=keyword]').fill('不存在的系列');await filter.locator('[data-g-dashboard-action=apply]').click();await expect(kpi).toContainText('0.00');await expect(chart.locator('[role=status]')).toBeVisible();await filter.locator('[data-g-dashboard-action=reset]').click();await expect(chart.locator('[data-g-dashboard-action=series]')).toHaveCount(2);
> 1178 |  await page.setViewportSize({width:360,height:800});await expect.poll(()=>chart.locator('svg text').first().evaluate(n=>n.getScreenCTM().a)).toBeGreaterThan(.95);await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
       |                                                                                                                                                                                                                                                                ^ Error: expect(received).toBeTruthy()
  1179 |  await page.setViewportSize({width:1080,height:900});await expect.poll(()=>chart.locator('svg text').first().evaluate(n=>n.getScreenCTM().a)).toBeGreaterThan(.95);expect(failures).toEqual([]);
  1180 | });
  1181 | 
```