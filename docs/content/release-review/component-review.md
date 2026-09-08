# 内容逐组件发布复查

本轮检查现有 39 个组件、234 个变体；不新增重复组件。所有组件共用 size、bordered、showHeader、showToolbar、maxHeight 和禁用/只读/加载/错误状态契约。下表为各组件的具体能力，参数完整范围见 [API 文档](../README.md)。

| 组件 | 主要可变参数 | 本轮核查及修复覆盖 | 变体数 |
| --- | --- | --- | --- |
| code-block | text、language、wrap、lineNumbers、showCopy | 复制实际文本、换行与行号；关闭复制入口 | 6 |
| terminal | text、language、wrap、lineNumbers、showCopy | 终端输出阅读与复制；不执行终端命令 | 6 |
| diff-viewer | before、after、view、wrap、lineNumbers | 逐行差异、并排/统一视图、大文本有界比较 | 6 |
| article-layout | text、author、date、showMetadata | 安全 Markdown 阅读、阅读宽度、作者日期开关 | 6 |
| search-results | items、pageSize、showDescriptions、showPagination | 真实搜索过滤和分页、描述显示 | 6 |
| report-invoice | items、currency、locale、discount、taxRate | 金额计算与数值校验、紧凑报表排版 | 6 |
| content-file-drop | accept、multiple、maxFiles、maxSize、upload | 真实 File 选择/拖放校验、服务成功和失败 | 6 |
| content-file-list | items、multiple、pageSize、showSort、view | 过滤排序、选择、分页，视图状态优先 | 6 |
| content-upload-queue | upload、concurrency、serviceTimeout、showUploadHints | 并发、超时、取消与重试，失败返回 false | 6 |
| chunk-upload | chunkSize、concurrency、showChunkDetails、serviceTimeout | 实际切片上传、已完成块续传、显示最多 100 块 | 6 |
| upload-progress-composition | upload、showUploadHints、showChunkDetails | 真实回调进度、上传前守卫与中断等待 | 6 |
| failed-upload | upload、serviceTimeout | 首次失败与重试场景、未接服务显式报错 | 6 |
| file-card-composition | items、thumbnailSize、showMetadata、showDescriptions | 文件卡片内容、缩略图尺寸和元数据开关 | 6 |
| folder-tree-composition | items、folder、searchable | 目录导航、循环目录拒绝、切换目录重置页码 | 6 |
| file-browser-composition | items、pageSize、view、showViewSwitcher | 目录、选择、过滤、列表/网格和分页组合 | 6 |
| file-preview-composition | type、src、pages、previewHeight | 文件图片/文本预览、尺寸约束、无效资源错误 | 6 |
| media-library-composition | items、columns、thumbnailSize、showSort | 媒体过滤选择、网格列数、窄容器自适应 | 6 |
| media-grid-composition | items、columns、view、thumbnailSize | 明确视图覆盖默认网格、列数与缩略图配置 | 6 |
| media-details-composition | items、showMetadata、showDescriptions | 选中媒体和属性展示、元数据开关 | 6 |
| image-crop-composition | src、alt、crop、previewHeight | 实际图片坐标层、边界校验、Canvas 导出 PNG | 6 |
| image-annotation-composition | src、annotations、previewHeight | 图片内百分比坐标、文本标注与删除、缩放跟随 | 6 |
| document-viewer-composition | pages、thumbnails、showPagination、previewHeight | 文本页翻页缩放、预览高度和缩略入口 | 6 |
| pdf-viewer | src、pageCount、previewHeight、showPagination | 真实 PDF 资源、原生查看器及独立打开入口 | 6 |
| video-player-shell | sources、poster、volume、playbackRate、loop | 真实原生播放，外观更新保留节点与用户音量 | 6 |
| audio-player-shell | src、volume、muted、loop、playbackRate | 真实播放和状态事件，外观变更不中断播放 | 6 |
| code-editor-shell | text、editorRows、resize、maxLength、showCount | 受控草稿和输入节点保留、行数和统计配置 | 6 |
| rich-text-editor-composition | text、actions、linkUrl、preview、maxLength | 安全格式与链接、受控回写保留节点、中文输入 | 6 |
| markdown-editor | text、preview、editorRows、previewHeight、resize | 实时安全预览、IME、草稿与光标保留、窄容器单列 | 6 |
| block-editor | blocks、editorRows、showToolbar | 块增删排序、行数配置和状态校验 | 6 |
| revision-compare-composition | before、after、view、showCopy | 版本文本差异与复制；不修改持久化版本 | 6 |
| content-autosave-indicator | text、save、saveDelay、serviceTimeout、editorRows | 延迟保存、取消待执行保存、超时和失败重试 | 6 |
| content-outline | sections、smooth、showHeader | 当前文档目标定位，事件报告目标是否存在 | 6 |
| editor-toolbar-composition | text、actions、preview、showToolbar | 编辑命令、可取消变更、工具栏开关 | 6 |
| find-replace | text、findReplace、caseSensitive | 字面查找替换，不解释正则或替换占位符 | 6 |
| comment-thread-composition | comments、author、maxLength、showHeader | 评论草稿保留、添加及解决/重新打开 | 6 |
| version-history-composition | versions、showHeader | 快照阅读与可取消恢复请求，持久化由应用完成 | 6 |
| file-properties | items、showHeader | 文件属性列表、无效数据校验和空状态 | 6 |
| storage-meter | total、used、showHeader | 占用比例边界与有效数值、进度可访问标签 | 6 |
| markdown-viewer | text、showHeader、maxHeight | 安全语法子集、有序/无序列表切换、限高阅读 | 6 |

每项均通过五端目录契约、运行时装配和全变体浏览器矩阵；具体通过状态由 [验证报告](../verification.md) 与机器可读结果记录。未接入服务、媒体编解码限制、PDF 原生查看器和跨域 Canvas 限制均作为显式能力边界保留。
