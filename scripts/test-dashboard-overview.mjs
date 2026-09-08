import {chromium,firefox,webkit,expect} from '../packages/css/node_modules/@playwright/test/index.mjs';
import {writeFile} from './fs-retry.mjs';
const engine=process.env.DASHBOARD_BROWSER||'chromium',browser=await ({chromium,firefox,webkit})[engine].launch(),page=await browser.newPage({viewport:{width:1180,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4180/?component=dashboard#catalog');await expect(page.locator('[data-component]')).toHaveCount(7);
 const frame=page.frameLocator('iframe[title="仪表盘筛选与图表联动演示"]'),filter=frame.locator('[data-dashboard-linked=filter]'),kpi=frame.locator('[data-dashboard-linked=kpi] .g-kpi-value'),chart=frame.locator('[data-dashboard-linked=chart]');await expect(kpi).toContainText('128,650.75');
 await filter.locator('[data-g-dashboard-field=period]').selectOption('week');await filter.locator('[data-g-dashboard-action=apply]').click();await expect(kpi).toContainText('32,162.69');await filter.locator('[data-g-dashboard-field=keyword]').fill('成本');await filter.locator('[data-g-dashboard-action=apply]').click();await expect(chart.locator('[data-g-dashboard-action=series]')).toHaveCount(1);await filter.locator('[data-g-dashboard-action=reset]').click();await expect(kpi).toContainText('128,650.75');
 await page.locator('[data-g-theme]').first().evaluate(e=>e.setAttribute('data-g-mode','dark'));await expect(frame.locator('html')).toHaveAttribute('data-g-mode','dark');
 await page.setViewportSize({width:390,height:844});await page.locator('iframe[title="仪表盘筛选与图表联动演示"]').scrollIntoViewIfNeeded();await expect.poll(()=>chart.locator('svg text').first().evaluate(e=>e.getScreenCTM().a)).toBeGreaterThan(.95);expect(await frame.locator('html').evaluate(e=>e.scrollWidth<=innerWidth+1)).toBeTruthy();expect(errors).toEqual([]);
 if(engine==='chromium')await page.screenshot({path:'docs/dashboard/catalog-mobile.png',fullPage:false});
 await writeFile(`docs/dashboard/overview-${engine}.json`,JSON.stringify({engine,components:7,checks:8,filterChartLink:true,themeSync:true,responsive:true,errors},null,2)+'\n');console.log(engine+': GardenerDemo integrated dashboard, filters, chart series, reset, theme and mobile passed');
}finally{await browser.close();}
