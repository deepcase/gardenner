import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(`${process.env.BLAZOR_URL||'http://127.0.0.1:5192'}/basic`);
 await expect(page.locator('#badges .g-badge-value')).toHaveText('99+');
 const heights=await page.locator('#sizes .g-btn').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height));assert.deepEqual(heights,[24,28,32,36]);
 assert.deepEqual(await page.locator('#cards .g-card-header').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height)),[40,46]);
 assert.deepEqual(await page.locator('#tags .g-tag,#tags .g-chip').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height)),[20,20,24,24,32,32]);
 await page.getByRole('button',{name:'切换计数'}).click();await expect(page.locator('#badges .g-badge-value')).toHaveText('0');await expect(page.locator('#badges .g-badge-value')).toBeVisible();
 await page.locator('#controlled-tag').click();await expect(page.locator('#basic-value')).toHaveText('True');await expect(page.locator('#controlled-tag')).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'切换禁用',exact:true}).click();await expect(page.locator('#controlled-tag')).toBeDisabled();await expect(page.locator('#loading-button')).toBeDisabled();
 await expect(page.locator('#fallback-avatar')).toHaveClass(/has-image-error/);await expect(page.locator('#fallback-avatar .g-avatar-fallback')).toBeVisible();
 await expect(page.locator('#limited-avatars > .g-avatar:visible')).toHaveCount(4);await page.getByRole('button',{name:'切换数量上限'}).click();await expect(page.locator('#limited-avatars > .g-avatar:visible')).toHaveCount(5);
 assert.deepEqual(errors,[]);fs.mkdirSync(new URL('../artifacts/',import.meta.url),{recursive:true});fs.writeFileSync(new URL('../artifacts/basic-browser.json',import.meta.url),JSON.stringify({passed:true,buttonHeights:heights,controlledTag:true,zeroCount:true,disabled:true,imageFallback:true,avatarLimit:true,errors},null,2));console.log('Blazor basic geometry and interactions passed');
}finally{await browser.close();}
