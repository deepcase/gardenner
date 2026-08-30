# Gardener 事件完整目录

共 75 个 `gardener:*` 自定义事件，无省略。使用 `EventNames` 订阅、`OnEvent` 接收安全序列化 detail；守卫事件需要在 `PreventDefaultEvents` 中声明，以便浏览器同步执行 `preventDefault()`。

| 事件名 | detail 键 | 守卫 | 冒泡 | 可取消 |
| --- | --- | --- | --- | --- |
| `add` | `item`, `index` | 否 | 是 | 是 |
| `approval` | `value`, `choice`, `reason` | 否 | 是 | 是 |
| `attachmentremove` | `attachment` | 否 | 是 | 是 |
| `authtimerexpired` | `reason` | 否 | 是 | 是 |
| `authtimerstart` | `remaining`, `reason` | 否 | 是 | 是 |
| `autosavestate` | `state`, `reason` | 否 | 是 | 是 |
| `beforeapproval` | `value`, `choice`, `reason` | 是 | 是 | 是 |
| `beforeclose` | `reason`, `trigger` | 是 | 是 | 是 |
| `beforefilepicker` | `input` | 是 | 是 | 是 |
| `beforeopen` | `source`, `trigger` | 是 | 是 | 是 |
| `beforepromptstop` | `reason` | 是 | 是 | 是 |
| `beforepromptsubmit` | `value`, `reason`, `input` | 是 | 是 | 是 |
| `beforetabclose` | `tab`, `reason`, `dirty` | 是 | 是 | 是 |
| `builderchange` | `count`, `reason` | 否 | 是 | 是 |
| `cartchange` | `subtotal`, `discount`, `shipping`, `tax`, `total`, `count`, `reason` | 否 | 是 | 是 |
| `cartremove` | `item` | 否 | 是 | 是 |
| `cascadechange` | `value`, `path`, `reason` | 否 | 是 | 是 |
| `change` | `tab`, `trigger`, `expanded`, `visible`, `value`, `option`, `index`, `step`, `source`, `item`, `link`, `section`, `target` | 否 | 是 | 是 |
| `clear` | `input` | 否 | 是 | 是 |
| `close` | `reason`, `index`, `trigger` | 否 | 是 | 是 |
| `collapse` | `item` | 否 | 是 | 是 |
| `columnchange` | `key`, `visible` | 否 | 是 | 是 |
| `composerstate` | `streaming`, `reason` | 否 | 是 | 是 |
| `copy` | `value` | 否 | 是 | 是 |
| `count` | `count`, `maximum` | 否 | 是 | 是 |
| `couponchange` | `state`, `code`, `reason` | 否 | 是 | 是 |
| `desktoptabchange` | `tab`, `reason` | 否 | 是 | 是 |
| `desktoptabclose` | `reason` | 否 | 是 | 是 |
| `disclosure` | `trigger`, `targets`, `expanded`, `reason` | 否 | 是 | 是 |
| `dismiss` | `reason` | 否 | 是 | 是 |
| `drop` | `files`, `dataTransfer` | 否 | 是 | 是 |
| `editorchange` | `text`, `characters`, `words` | 否 | 是 | 是 |
| `editorcommand` | `command`, `value`, `tool` | 否 | 是 | 是 |
| `error` | `action`, `error` | 否 | 是 | 是 |
| `expand` | `item` | 否 | 是 | 是 |
| `feedbackchange` | `value`, `option`, `reason` | 否 | 是 | 是 |
| `feedbacksubmit` | `value`, `comment`, `reason` | 否 | 是 | 是 |
| `filefilter` | `query`, `visible` | 否 | 是 | 是 |
| `files` | `files`, `input` | 否 | 是 | 是 |
| `fileselect` | `item`, `value`, `reason` | 否 | 是 | 是 |
| `fileview` | `view` | 否 | 是 | 是 |
| `filter` | `value`, `terms`, `count` | 否 | 是 | 是 |
| `fullscreenchange` | `active`, `target` | 否 | 是 | 是 |
| `init` | `name`, `instance` | 否 | 是 | 是 |
| `loadcomplete` | `done` | 否 | 是 | 是 |
| `loadmore` | `reason`, `complete` | 否 | 是 | 是 |
| `nativefiles` | `files`, `input`, `reason` | 否 | 是 | 是 |
| `open` | `source`, `trigger`, `x`, `y` | 否 | 是 | 是 |
| `otpchange` | `value`, `complete`, `reason` | 否 | 是 | 是 |
| `otpcomplete` | `value`, `reason` | 否 | 是 | 是 |
| `passwordstrength` | `score`, `checks`, `reason` | 否 | 是 | 是 |
| `pickerchange` | `values`, `reason` | 否 | 是 | 是 |
| `promptfill` | `value`, `item`, `target` | 否 | 是 | 是 |
| `promptstop` | `reason` | 否 | 是 | 是 |
| `promptsubmit` | `value`, `reason`, `input` | 否 | 是 | 是 |
| `quantitychange` | `value`, `reason` | 否 | 是 | 是 |
| `refresh` | `reason`, `complete` | 否 | 是 | 是 |
| `refreshcomplete` | — | 否 | 是 | 是 |
| `remove` | `index` | 否 | 是 | 是 |
| `resize` | `value` | 否 | 是 | 是 |
| `revisionview` | `view`, `reason` | 否 | 是 | 是 |
| `savedchoice` | `values`, `reason` | 否 | 是 | 是 |
| `selectionchange` | `selected`, `count`, `reason` | 否 | 是 | 是 |
| `shortcutchange` | `value`, `reason` | 否 | 是 | 是 |
| `skuchange` | `value`, `complete`, `reason` | 否 | 是 | 是 |
| `sort` | `key`, `direction`, `type`, `button` | 否 | 是 | 是 |
| `swipechange` | `revealed`, `reason` | 否 | 是 | 是 |
| `toggle` | `expanded`, `trigger` | 否 | 是 | 是 |
| `transferchange` | `source`, `target`, `reason` | 否 | 是 | 是 |
| `uploadadd` | `file`, `item` | 否 | 是 | 是 |
| `uploadchange` | `items`, `counts`, `reason` | 否 | 是 | 是 |
| `viewchange` | `view` | 否 | 是 | 是 |
| `wheelchange` | `values`, `reason` | 否 | 是 | 是 |
| `windowactivate` | `item`, `value` | 否 | 是 | 是 |
| `windowselect` | `item`, `value`, `reason` | 否 | 是 | 是 |
