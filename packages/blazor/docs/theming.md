# 主题

`GardenerimProvider` 支持 Theme、Mode、Neutral、Typography、Shape、Density、Elevation、Motion、Platform、Os 十个正交轴，可在同一页面嵌套作用域。默认白色明亮模式、小圆角 `small`，不默认使用大圆角。

```razor
<GardenerimProvider Theme="forest" Mode="light" Shape="small" Density="comfortable">
  @Body
</GardenerimProvider>
```

颜色主题取自 Gardenerim CSS 的完整 42 种预设，并由 `GardenerimThemePresets.All` 提供强类型可发现目录：garden、slate、graphite、zinc、stone、red、rose、ruby、crimson、coral、orange、amber、gold、yellow、lime、olive、green、forest、emerald、mint、teal、aqua、cyan、sky、blue、cobalt、navy、ocean、indigo、violet、purple、lavender、plum、fuchsia、magenta、pink、brown、coffee、sand、sunset、midnight、monochrome。

`GardenerimThemePresets.AxisValues` 同时列出 Mode、Neutral、Typography、Shape、Density、Elevation、Motion、Platform、Os 的有效值。运行时切换可修改 Provider 参数，也可通过 `GardenerimThemeService` 对任意元素应用、读取或清理十轴状态。
