var e=`<script setup lang="ts">
import {computed,ref} from 'vue';
import {GCarousel} from '@gardenerim/vue';
import type {GardenerimMediaOptions} from '@gardenerim/css/runtime';
const items=['mountain','sea','sunset'].map((id,i)=>({id,src:'./media-assets/'+id+'.svg',alt:['山谷日出','碧海晴空','群山晚霞'][i],title:['山谷日出','碧海晴空','群山晚霞'][i]}));
const cfg=(patch:Partial<GardenerimMediaOptions>={})=>({mediaOptions:JSON.stringify({kind:'carousel',title:'轮播参数实验室',items,fit:'cover',showRotation:false,...patch})});
const animation=ref<'slide'|'fade'|'card'>('slide'),position=ref<'bottom'|'top'|'left'|'right'|'outer'>('bottom'),indicator=ref<'dot'|'line'|'slider'|'never'>('dot'),arrows=ref<'always'|'hover'|'never'>('always'),vertical=ref(false),hover=ref(false),loop=ref(true),disabled=ref(false),current=ref(1),last=ref('点击箭头、指示器或使用方向键切换。');
const options=computed(()=>cfg({animationName:animation.value,indicatorPosition:position.value,indicatorType:indicator.value,showArrow:arrows.value,direction:vertical.value?'vertical':'horizontal',trigger:hover.value?'hover':'click',loop:loop.value,disabled:disabled.value}));
function record(e:Event){const d=(e as CustomEvent).detail;last.value=\`第 \${d.previousCurrent} → \${d.current} 项 · \${d.reason}\`;}
function control(e:Event){current.value=(e as CustomEvent).detail.current;}
const scenes:Array<{id:string;title:string;description:string;options:Partial<GardenerimMediaOptions>}>= [
{id:'auto',title:'自动播放',description:'每 3 秒切换；鼠标悬停、键盘焦点进入及页面隐藏时暂停。可显式停止。减少动态效果偏好下不自动播放。',options:{autoPlay:{interval:3000,hoverToPause:true},showRotation:true}},
{id:'fade',title:'淡入淡出',description:'700ms 淡入淡出，悬停显示箭头，顶部线形指示器。',options:{animationName:'fade',moveSpeed:700,showArrow:'hover',indicatorType:'line',indicatorPosition:'top'}},
{id:'card',title:'卡片轮播',description:'保留相邻卡片的上下文；缩放与位移动画共用时长和缓动配置。',options:{animationName:'card',indicatorPosition:'outer'}},
{id:'vertical',title:'垂直轮播',description:'上下方向键及纵向滑动切换，右侧指示器支持悬停选择。',options:{direction:'vertical',indicatorPosition:'right',trigger:'hover',height:280}},
{id:'thumbnails',title:'缩略图导航',description:'适合产品图集与内容预览；缩略图尺寸和主体比例可分别设置。',options:{thumbnails:true,thumbnailSize:92,ratio:2}},
{id:'rtl',title:'从右向左',description:'RTL 同步调整箭头、键盘方向和手势；关闭循环后首尾箭头禁用。',options:{direction:'rtl',loop:false,indicatorType:'slider'}},
{id:'single',title:'单项与空状态',description:'单项自动隐藏无用导航，空数组显示明确的空状态。',options:{items:items.slice(0,1),height:220}}
];
<\/script>
<template>
<div class="carousel-showcase">
<section data-carousel-example="playground"><h3>参数实验室</h3><p>三种动画、四种指示器、五种位置及方向、触发方式可自由组合。</p>
<div class="carousel-options"><label>动画<select v-model="animation"><option>slide</option><option>fade</option><option>card</option></select></label><label>指示器<select v-model="indicator"><option>dot</option><option>line</option><option>slider</option><option>never</option></select></label><label>位置<select v-model="position"><option>bottom</option><option>top</option><option>left</option><option>right</option><option>outer</option></select></label><label>箭头<select v-model="arrows"><option>always</option><option>hover</option><option>never</option></select></label><label><input type="checkbox" v-model="vertical">垂直</label><label><input type="checkbox" v-model="hover">悬停切换</label><label><input type="checkbox" v-model="loop">循环</label><label><input type="checkbox" v-model="disabled">禁用</label></div>
<GCarousel :config="options" @gardener:change="record"/><output aria-live="polite">{{last}}</output></section>
<section data-carousel-example="controlled"><h3>受控页码</h3><p>current 使用从 1 开始的页码；mediaValue.index 与 go(index) 保持从 0 开始，兼容现有代码。</p><label>当前页 <input type="number" min="1" max="3" v-model.number="current"></label><GCarousel :config="cfg({current,title:'受控页码'})" @gardener:change="control"/></section>
<section v-for="scene in scenes" :key="scene.id" :data-carousel-example="scene.id"><h3>{{scene.title}}</h3><p>{{scene.description}}</p><GCarousel :config="cfg({...scene.options,title:scene.title})"/></section>
<section data-carousel-example="empty"><h3>空数据</h3><GCarousel :config="cfg({items:[],height:120,title:'空数据'})"/></section>
<p>五端共用媒体运行时与样式。<a href="https://arco.design/vue/component/carousel" target="_blank" rel="noopener">Arco Carousel 参考</a></p>
</div>
</template>
<style scoped>
.carousel-showcase{width:100%;min-width:0;font-size:14px;line-height:1.6}.carousel-showcase section{margin:28px 0 40px}.carousel-showcase h3{font-size:20px;margin:0 0 8px}.carousel-showcase p{color:var(--g-color-text-muted);margin:8px 0 16px}.carousel-options{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px}.carousel-showcase label{display:inline-flex;align-items:center;gap:6px}.carousel-showcase select,.carousel-showcase input[type=number]{font:inherit;max-width:100%;min-height:28px;border:1px solid var(--g-color-border);border-radius:4px;color:var(--g-color-text);background:var(--g-color-surface);padding:2px 6px}.carousel-showcase input[type=number]{width:72px}.carousel-showcase output{display:block;margin:8px 0;color:var(--g-color-text-muted)}
</style>\r
`;export{e as default};