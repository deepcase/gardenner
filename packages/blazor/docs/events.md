# Gardenerim 事件完整目录

共 105 个 `gardener:*` 自定义事件，无省略。使用 `EventNames` 订阅、`OnEvent` 接收安全序列化 detail；守卫事件需要在 `PreventDefaultEvents` 中声明，以便浏览器同步执行 `preventDefault()`。

| 事件名 | detail 键 | 守卫 | 冒泡 | 可取消 |
| --- | --- | --- | --- | --- |
| `action` | `component`, `key`, `action`, `item`, `reason`, `count`, `index`, `scrollTop`, `behavior`, `requestId`, `value`, `version`, `keys`, `price`, `href`, `status`, `message`, `phase`, `totals`, `files`, `blob`, `crop`, `playing`, `currentTime`, `duration`, `text`, `id`, `found`, `results`, `items`, `active`, `source`, `trigger` | 否 | 是 | 是 |
| `add` | `reason`, `activeKey`, `item`, `index` | 否 | 是 | 是 |
| `approval` | `value`, `choice`, `reason` | 否 | 是 | 是 |
| `attachmentremove` | `attachment` | 否 | 是 | 是 |
| `authtimerexpired` | `reason` | 否 | 是 | 是 |
| `authtimerstart` | `remaining`, `reason` | 否 | 是 | 是 |
| `autosaverequest` | `reason`, `scope`, `respondWith`, `complete`, `fail` | 否 | 是 | 是 |
| `autosavestate` | `state`, `reason` | 否 | 是 | 是 |
| `beforeapproval` | `value`, `choice`, `reason` | 是 | 是 | 是 |
| `beforechange` | `component`, `reason`, `value`, `key`, `node`, `checked`, `previous`, `previousKey`, `tab`, `panel`, `controlled`, `previousValue`, `behavior`, `action`, `requestId`, `version`, `keys`, `price`, `files`, `label`, `item` | 是 | 是 | 是 |
| `beforeclose` | `reason`, `visible`, `trigger`, `expanded`, `keys`, `controlled` | 是 | 是 | 是 |
| `beforefilepicker` | `input` | 是 | 是 | 是 |
| `beforeopen` | `source`, `reason`, `trigger`, `expanded`, `keys`, `controlled` | 是 | 是 | 是 |
| `beforepromptstop` | `reason` | 是 | 是 | 是 |
| `beforepromptsubmit` | `value`, `reason`, `input` | 是 | 是 | 是 |
| `beforetabclose` | `key`, `value`, `previousKey`, `tab`, `panel`, `reason`, `controlled`, `dirty` | 是 | 是 | 是 |
| `builderchange` | `count`, `reason` | 否 | 是 | 是 |
| `cartchange` | `subtotal`, `discount`, `shipping`, `tax`, `total`, `count`, `reason` | 否 | 是 | 是 |
| `cartremove` | `item` | 否 | 是 | 是 |
| `cascadechange` | `value`, `path`, `reason` | 否 | 是 | 是 |
| `change` | `component`, `reason`, `value`, `previousValue`, `controlled`, `width`, `height`, `key`, `node`, `data`, `selectedKeys`, `checkedKeys`, `halfCheckedKeys`, `expandedKeys`, `loadingKeys`, `dropKey`, `dropPosition`, `checked`, `previousKey`, `tab`, `panel`, `current`, `pageSize`, `visible`, `index`, `behavior`, `action`, `previousIndex`, `previousCurrent`, `isManual`, `open`, `item`, `previousTab`, `previousPanel`, `activeKey`, `trigger`, `expanded`, `keys`, `input`, `resolved`, `values`, `controllers`, `option`, `label`, `step`, `source`, `page`, `total`, `sort`, `filter`, `loading`, `error`, `field`, `previous`, `row`, `link`, `section`, `target`, `date`, `path`, `zoom`, `rules`, `items`, `pageShowDate`, `modelValue`, `mode` | 否 | 是 | 是 |
| `check` | `checked`, `value`, `reason`, `controlled` | 否 | 是 | 是 |
| `clear` | `input`, `previousValue`, `value`, `reason` | 否 | 是 | 是 |
| `close` | `reason`, `visible`, `controlled`, `trigger`, `menu`, `index` | 否 | 是 | 是 |
| `collapse` | `item`, `key` | 否 | 是 | 是 |
| `columnchange` | `key`, `visible` | 否 | 是 | 是 |
| `commandselect` | `item`, `value`, `label`, `query`, `reason` | 否 | 是 | 是 |
| `complete` | `component`, `reason`, `value`, `action`, `src`, `fallback`, `naturalWidth`, `naturalHeight`, `behavior`, `key`, `requestId`, `status`, `items`, `message`, `keys`, `blob` | 否 | 是 | 是 |
| `composerstate` | `streaming`, `reason` | 否 | 是 | 是 |
| `copy` | `value` | 否 | 是 | 是 |
| `count` | `count`, `maximum`, `remaining`, `mode`, `nearLimit`, `atLimit`, `overLimit`, `reason` | 否 | 是 | 是 |
| `couponchange` | `state`, `code`, `reason` | 否 | 是 | 是 |
| `densitychange` | `density`, `table` | 否 | 是 | 是 |
| `desktoptabchange` | `tab`, `reason` | 否 | 是 | 是 |
| `desktoptabclose` | `reason` | 否 | 是 | 是 |
| `disclosure` | `trigger`, `targets`, `expanded`, `reason` | 否 | 是 | 是 |
| `dismiss` | `reason`, `trigger` | 否 | 是 | 是 |
| `drop` | `files`, `acceptedFiles`, `rejectedFiles`, `input`, `dataTransfer`, `source` | 否 | 是 | 是 |
| `editorchange` | `text`, `characters`, `words` | 否 | 是 | 是 |
| `editorcommand` | `command`, `value`, `tool` | 否 | 是 | 是 |
| `error` | `component`, `reason`, `message`, `key`, `action`, `src`, `behavior`, `requestId`, `status`, `error` | 否 | 是 | 是 |
| `expand` | `item`, `key` | 否 | 是 | 是 |
| `export` | `component`, `behavior`, `action`, `value`, `count` | 否 | 是 | 是 |
| `feedbackchange` | `value`, `option`, `reason` | 否 | 是 | 是 |
| `feedbacksubmit` | `value`, `comment`, `reason` | 否 | 是 | 是 |
| `fieldchange` | `kind`, `value`, `files`, `input` | 否 | 是 | 是 |
| `filefilter` | `query`, `visible` | 否 | 是 | 是 |
| `files` | `files`, `acceptedFiles`, `rejectedFiles`, `input`, `dataTransfer`, `source` | 否 | 是 | 是 |
| `fileselect` | `item`, `value`, `reason` | 否 | 是 | 是 |
| `fileview` | `view` | 否 | 是 | 是 |
| `filter` | `query`, `visibleOptions`, `source`, `value`, `terms`, `count`, `items`, `visibleItems`, `reason` | 否 | 是 | 是 |
| `fullscreenchange` | `active`, `target` | 否 | 是 | 是 |
| `init` | `name`, `instance` | 否 | 是 | 是 |
| `loadcomplete` | `done` | 否 | 是 | 是 |
| `loadmore` | `reason`, `complete` | 否 | 是 | 是 |
| `mediachange` | `playing`, `currentTime`, `duration`, `media`, `reason` | 否 | 是 | 是 |
| `nativefiles` | `files`, `input`, `reason` | 否 | 是 | 是 |
| `navigationback` | `value` | 否 | 是 | 是 |
| `navigationchange` | `value`, `previousValue`, `item`, `originalEvent` | 否 | 是 | 是 |
| `navigationcheck` | `value` | 否 | 是 | 是 |
| `navigationcloseitem` | `value` | 否 | 是 | 是 |
| `navigationcollapse` | `value` | 否 | 是 | 是 |
| `navigationerror` | `value` | 否 | 是 | 是 |
| `navigationexpand` | `value` | 否 | 是 | 是 |
| `navigationloadmore` | `value` | 否 | 是 | 是 |
| `navigationnext` | `value` | 否 | 是 | 是 |
| `navigationopen` | `value` | 否 | 是 | 是 |
| `navigationpagesize` | `value` | 否 | 是 | 是 |
| `navigationprevious` | `value` | 否 | 是 | 是 |
| `navigationselect` | `value` | 否 | 是 | 是 |
| `open` | `source`, `reason`, `trigger`, `menu`, `x`, `y` | 否 | 是 | 是 |
| `otpchange` | `value`, `complete`, `filled`, `total`, `reason` | 否 | 是 | 是 |
| `otpcomplete` | `value`, `total`, `reason` | 否 | 是 | 是 |
| `passwordstrength` | `score`, `checks`, `reason` | 否 | 是 | 是 |
| `pickerchange` | `values`, `value`, `start`, `end`, `reason`, `month` | 否 | 是 | 是 |
| `promptfill` | `value`, `item`, `target` | 否 | 是 | 是 |
| `promptstop` | `reason` | 否 | 是 | 是 |
| `promptsubmit` | `value`, `reason`, `input` | 否 | 是 | 是 |
| `quantitychange` | `value`, `reason` | 否 | 是 | 是 |
| `rangechange` | `start`, `end`, `valid`, `inputs`, `reason`, `value`, `duration`, `complete` | 否 | 是 | 是 |
| `ratingchange` | `value`, `maximum`, `step`, `reason` | 否 | 是 | 是 |
| `refresh` | `reason`, `complete` | 否 | 是 | 是 |
| `refreshcomplete` | — | 否 | 是 | 是 |
| `remove` | `key`, `value`, `previousKey`, `tab`, `panel`, `reason`, `controlled`, `index` | 否 | 是 | 是 |
| `resize` | `value` | 否 | 是 | 是 |
| `revisionview` | `view`, `reason` | 否 | 是 | 是 |
| `savedchoice` | `values`, `reason` | 否 | 是 | 是 |
| `selectionchange` | `selected`, `count`, `reason` | 否 | 是 | 是 |
| `shortcutchange` | `value`, `reason` | 否 | 是 | 是 |
| `skuchange` | `value`, `complete`, `reason` | 否 | 是 | 是 |
| `sort` | `key`, `direction`, `type`, `button` | 否 | 是 | 是 |
| `stepchange` | `step`, `index`, `value`, `previousStep`, `previousIndex`, `reason` | 否 | 是 | 是 |
| `swipechange` | `revealed`, `reason` | 否 | 是 | 是 |
| `toggle` | `expanded`, `trigger` | 否 | 是 | 是 |
| `transferchange` | `source`, `target`, `reason` | 否 | 是 | 是 |
| `uploadadd` | `file`, `item` | 否 | 是 | 是 |
| `uploadchange` | `items`, `counts`, `reason` | 否 | 是 | 是 |
| `validationblocked` | `errors`, `count`, `submitter` | 否 | 是 | 是 |
| `validationchange` | `errors`, `count`, `valid`, `reason` | 否 | 是 | 是 |
| `validationnavigate` | `target`, `targetId`, `reason` | 否 | 是 | 是 |
| `viewchange` | `view`, `value`, `item`, `previousItem`, `reason` | 否 | 是 | 是 |
| `visibilitychange` | `visible`, `input`, `reason` | 否 | 是 | 是 |
| `wheelchange` | `values`, `value`, `hour`, `minute`, `second`, `reason` | 否 | 是 | 是 |
| `windowactivate` | `item`, `value` | 否 | 是 | 是 |
| `windowselect` | `item`, `value`, `reason` | 否 | 是 | 是 |
