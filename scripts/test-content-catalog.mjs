import {chromium,expect} from '../packages/css/node_modules/@playwright/test/index.mjs';
import {writeFile} from './fs-retry.mjs';
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4180/?component=content#catalog');await expect(page.locator('.complete-documentation[data-component]')).toHaveCount(39);
 const sample=page.locator('#component-markdown-editor');await sample.scrollIntoViewIfNeeded();const frame=sample.frameLocator('iframe');await expect(frame.locator('[data-demo-component]')).toBeVisible();await sample.getByRole('combobox',{name:'尺寸',exact:true}).selectOption('large');await expect(frame.locator('[data-demo-component]')).toHaveAttribute('data-g-content-size','large');await sample.getByRole('combobox',{name:'边框',exact:true}).selectOption('false');await expect(frame.locator('[data-demo-component]')).toHaveCSS('border-top-width','0px');
 await sample.getByRole('combobox',{name:'状态管理',exact:true}).selectOption('true');await frame.locator('textarea').fill('# Catalogue edit');await expect(frame.locator('.g-content-editor-preview h1')).toHaveText('Catalogue edit');await expect(frame.locator('#demo-result')).toContainText('Catalogue edit');
 await sample.getByRole('combobox',{name:'边框',exact:true}).selectOption('true');await expect(frame.locator('[data-demo-component]')).toHaveCSS('border-top-width','1px');
 await page.getByRole('link',{name:'GMarkdownEditor',exact:true}).click();await expect(frame.locator('textarea')).toBeVisible();await frame.locator('[data-demo-component]').evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.screenshot({path:'docs/content/catalog.png'});expect(errors).toEqual([]);await writeFile('docs/content/catalog-browser.json',JSON.stringify({components:39,parameterControls:true,controlledEditor:true,errors},null,2));console.log('Catalog: 39 specimens, parameters and controlled editor passed');
}finally{await browser.close();}
