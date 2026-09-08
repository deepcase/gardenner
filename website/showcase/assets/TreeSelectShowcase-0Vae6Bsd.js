var e=`<script setup lang="ts">
import { ref } from "vue";
import { GTreeSelect } from "@gardenerim/vue";

const singleValue = ref<string[]>(["web"])
const multipleValues = ref<string[]>(["web", "design-system"])

const valuesFrom = (event: Event) => (event as CustomEvent<{ values?: string[] }>).detail.values ?? []
<\/script>

<template>
  <article id="component-tree-select" class="component-doc tree-select-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / TREE SELECT</span>
        <h2>树选择器 <span>Tree Select / GTreeSelect</span></h2>
        <p>面向组织、目录、权限等层级数据，支持搜索、展开收起、单选、多选、父子级联、半选、标签移除与清空。</p>
      </div>
      <span class="component-status">runtime-ready · picker</span>
    </header>

    <section class="usage-section">
      <h3>单选</h3>
      <p>单选在确认叶子节点后关闭弹层，保留完整路径浏览和原生键盘树导航。</p>
      <div class="usage-preview usage-preview--block tree-select-demo-grid">
        <label class="g-field">
          <span class="g-label">默认工作区</span>
          <GTreeSelect :variant="['single', 'outlined', 'searchable', 'clearable']" :config="{ pickerTree: true, treeValueStrategy: 'all' }" @gardener:pickerchange="singleValue = valuesFrom($event)">
            <div class="g-picker-control" data-g-picker-trigger tabindex="0" role="combobox" aria-haspopup="tree" aria-expanded="false" aria-describedby="tree-select-single-help">
              <span class="g-picker-values" data-g-picker-values />
              <input class="g-picker-input" data-g-picker-input placeholder="请选择工作区" aria-label="搜索工作区" />
              <button class="g-picker-clear" type="button" data-g-picker-clear aria-label="清空工作区" />
              <span class="g-picker-arrow" aria-hidden="true" />
            </div>
            <div class="g-picker-panel" data-g-picker-panel hidden>
              <div class="g-tree-select-search"><span class="g-help">输入关键词可筛选已加载节点</span></div>
              <div class="g-tree-list" role="tree" aria-label="工作区目录">
                <div class="g-tree-node g-picker-option" role="treeitem" aria-level="1" aria-expanded="true" data-g-picker-option data-g-value="products" data-g-label="产品研发">
                  <div class="g-tree-node-row"><button class="g-tree-toggle" type="button" data-g-tree-toggle aria-label="展开或收起产品研发" /><span class="g-tree-toggle-placeholder" aria-hidden="true" /><span class="g-tree-node-label">产品研发</span><span class="g-tree-node-meta">3</span></div>
                  <div role="group">
                    <div class="g-tree-node g-picker-option" role="treeitem" aria-level="2" data-g-picker-option data-g-value="web" data-g-label="Web 控制台" aria-selected="true"><div class="g-tree-node-row"><span class="g-tree-toggle-placeholder" aria-hidden="true" /><span class="g-tree-toggle-placeholder" aria-hidden="true" /><span class="g-tree-node-label">Web 控制台</span><span class="g-tree-node-meta">默认</span></div></div>
                    <div class="g-tree-node g-picker-option" role="treeitem" aria-level="2" data-g-picker-option data-g-value="mobile" data-g-label="移动客户端"><div class="g-tree-node-row"><span class="g-tree-toggle-placeholder" aria-hidden="true" /><span class="g-tree-toggle-placeholder" aria-hidden="true" /><span class="g-tree-node-label">移动客户端</span></div></div>
                    <div class="g-tree-node g-picker-option" role="treeitem" aria-level="2" data-g-picker-option data-g-value="desktop" data-g-label="桌面客户端"><div class="g-tree-node-row"><span class="g-tree-toggle-placeholder" aria-hidden="true" /><span class="g-tree-toggle-placeholder" aria-hidden="true" /><span class="g-tree-node-label">桌面客户端</span></div></div>
                  </div>
                </div>
                <div class="g-tree-node g-picker-option" role="treeitem" aria-level="1" aria-expanded="false" data-g-picker-option data-g-value="operations" data-g-label="运营平台">
                  <div class="g-tree-node-row"><button class="g-tree-toggle" type="button" data-g-tree-toggle aria-label="展开或收起运营平台" /><span class="g-tree-toggle-placeholder" aria-hidden="true" /><span class="g-tree-node-label">运营平台</span><span class="g-tree-node-meta">2</span></div>
                  <div role="group"><div class="g-tree-node g-picker-option" role="treeitem" aria-level="2" data-g-picker-option data-g-value="cms" data-g-label="内容管理"><div class="g-tree-node-row"><span class="g-tree-toggle-placeholder" /><span class="g-tree-toggle-placeholder" /><span class="g-tree-node-label">内容管理</span></div></div><div class="g-tree-node g-picker-option" role="treeitem" aria-level="2" data-g-picker-option data-g-value="analytics" data-g-label="数据分析"><div class="g-tree-node-row"><span class="g-tree-toggle-placeholder" /><span class="g-tree-toggle-placeholder" /><span class="g-tree-node-label">数据分析</span></div></div></div>
                </div>
              </div>
              <div class="g-picker-empty" data-g-picker-empty hidden>没有匹配的工作区</div>
              <div class="g-picker-footer"><span>↑↓ 移动</span><span>←→ 收起/展开</span><span>Enter 选择</span></div>
            </div>
            <input type="hidden" name="workspace" data-g-picker-output :value="singleValue[0] ?? ''" />
          </GTreeSelect>
          <small id="tree-select-single-help" class="g-field-help">当前值：{{ singleValue.join('、') || '未选择' }}</small>
        </label>
        <div class="tree-select-guidance">
          <strong>单选适用场景</strong>
          <span>选择唯一组织、目录、分类或资源归属</span>
          <span>节点数量多时默认启用搜索</span>
          <span>最终值需要进入表单时使用隐藏输出字段</span>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>多选、级联与半选</h3>
      <p>点击父节点可级联叶子节点，部分子节点选中时父节点进入半选；触发区使用可移除标签，不再使用不直观的原生多选列表框。</p>
      <div class="usage-preview usage-preview--block tree-select-check-demo">
        <label class="g-field">
          <span class="g-label">可访问模块</span>
          <GTreeSelect :variant="['multiple', 'checkable', 'searchable', 'clearable', 'cascade']" :config="{ pickerTree: true, pickerMultiple: true, pickerCascade: true, treeValueStrategy: 'leaf' }" @gardener:pickerchange="multipleValues = valuesFrom($event)">
            <div class="g-picker-control" data-g-picker-trigger tabindex="0" role="combobox" aria-haspopup="tree" aria-expanded="false" aria-describedby="tree-select-multiple-help">
              <span class="g-picker-values" data-g-picker-values />
              <input class="g-picker-input" data-g-picker-input placeholder="搜索模块" aria-label="搜索可访问模块" />
              <button class="g-picker-clear" type="button" data-g-picker-clear aria-label="清空全部模块" />
              <span class="g-picker-arrow" aria-hidden="true" />
            </div>
            <div class="g-picker-panel" data-g-picker-panel hidden>
              <div class="g-picker-header"><strong class="g-picker-title">选择权限范围</strong><span><b data-g-picker-count>0</b> 个叶子节点</span></div>
              <div class="g-tree-list" role="tree" aria-label="模块权限树">
                <div class="g-tree-node g-picker-option" role="treeitem" aria-level="1" aria-expanded="true" data-g-picker-option data-g-value="development" data-g-label="研发中心">
                  <div class="g-tree-node-row"><button class="g-tree-toggle" type="button" data-g-tree-toggle aria-label="展开或收起研发中心" /><span class="g-tree-checkbox" aria-hidden="true" /><span class="g-tree-node-label">研发中心</span><span class="g-tree-node-meta">2</span></div>
                  <div role="group">
                    <div class="g-tree-node g-picker-option" role="treeitem" aria-level="2" aria-selected="true" data-g-picker-option data-g-value="web" data-g-label="Web 工程"><div class="g-tree-node-row"><span class="g-tree-toggle-placeholder" /><span class="g-tree-checkbox" aria-hidden="true" /><span class="g-tree-node-label">Web 工程</span><span class="g-tree-node-meta">读写</span></div></div>
                    <div class="g-tree-node g-picker-option" role="treeitem" aria-level="2" data-g-picker-option data-g-value="api" data-g-label="API 服务"><div class="g-tree-node-row"><span class="g-tree-toggle-placeholder" /><span class="g-tree-checkbox" aria-hidden="true" /><span class="g-tree-node-label">API 服务</span><span class="g-tree-node-meta">只读</span></div></div>
                  </div>
                </div>
                <div class="g-tree-node g-picker-option" role="treeitem" aria-level="1" aria-expanded="true" data-g-picker-option data-g-value="experience" data-g-label="体验设计">
                  <div class="g-tree-node-row"><button class="g-tree-toggle" type="button" data-g-tree-toggle aria-label="展开或收起体验设计" /><span class="g-tree-checkbox" aria-hidden="true" /><span class="g-tree-node-label">体验设计</span><span class="g-tree-node-meta">2</span></div>
                  <div role="group">
                    <div class="g-tree-node g-picker-option" role="treeitem" aria-level="2" aria-selected="true" data-g-picker-option data-g-value="design-system" data-g-label="设计系统"><div class="g-tree-node-row"><span class="g-tree-toggle-placeholder" /><span class="g-tree-checkbox" aria-hidden="true" /><span class="g-tree-node-label">设计系统</span></div></div>
                    <div class="g-tree-node g-picker-option" role="treeitem" aria-level="2" aria-disabled="true" data-g-picker-option data-g-value="brand" data-g-label="品牌资产"><div class="g-tree-node-row"><span class="g-tree-toggle-placeholder" /><span class="g-tree-checkbox" aria-hidden="true" /><span class="g-tree-node-label">品牌资产</span><span class="g-tree-node-meta">无权限</span></div></div>
                  </div>
                </div>
              </div>
              <div class="g-picker-empty" data-g-picker-empty hidden>没有匹配模块</div>
              <div class="g-picker-footer"><span>父子级联</span><span>仅提交叶子值</span></div>
            </div>
            <input type="hidden" name="permissions" data-g-picker-output :value="multipleValues.join(',')" />
          </GTreeSelect>
          <small id="tree-select-multiple-help" class="g-field-help">已选 {{ multipleValues.length }} 项：{{ multipleValues.join('、') || '无' }}</small>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>外观、尺寸与状态</h3>
      <p>四档尺寸与表单体系一致；加载、错误和禁用不改变控件宽度，也不会仅依赖颜色传达状态。</p>
      <div class="usage-preview usage-preview--block tree-select-state-grid">
        <div class="g-field"><span class="g-label">Mini / Filled</span><div class="g-tree-select g-tree-select-mini"><div class="g-picker-control"><span class="g-picker-placeholder">选择节点</span><span class="g-picker-arrow" /></div></div><small class="g-field-help">24px 紧凑密度</small></div>
        <div class="g-field"><span class="g-label">Large / Outlined</span><div class="g-tree-select g-tree-select-large g-tree-select-outlined"><div class="g-picker-control"><span class="g-picker-placeholder">选择节点</span><span class="g-picker-arrow" /></div></div><small class="g-field-help">36px 强调边界</small></div>
        <div class="g-field is-error"><span class="g-label">错误</span><div class="g-tree-select is-error" aria-invalid="true"><div class="g-picker-control"><span class="g-picker-placeholder">必须选择组织</span><span class="g-picker-arrow" /></div></div><small class="g-field-feedback">× 请选择至少一个组织</small></div>
        <div class="g-field"><span class="g-label">加载中</span><div class="g-tree-select is-loading" aria-busy="true"><div class="g-picker-control"><span class="g-picker-placeholder">正在加载子节点…</span><span class="g-picker-arrow" /></div></div><small class="g-field-help">支持异步加载提示</small></div>
        <div class="g-field"><span class="g-label">禁用</span><div class="g-tree-select is-disabled" aria-disabled="true"><div class="g-picker-control"><span class="g-picker-placeholder">组织策略已锁定</span><span class="g-picker-arrow" /></div></div><small class="g-field-help">当前不可修改</small></div>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>模式</b><code>single</code><code>multiple</code><code>checkable</code><code>cascade</code></span>
      <span><b>能力</b><code>search</code><code>clear</code><code>tags</code><code>indeterminate</code><code>leaf strategy</code></span>
      <span><b>键盘</b><code>↑ ↓</code><code>← →</code><code>Home End</code><code>Enter Space</code><code>Escape</code></span>
      <span><b>语义</b><code>combobox</code><code>tree</code><code>treeitem</code><code>aria-checked</code></span>
    </footer>
  </article>
</template>
`;export{e as default};