import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch(),page=await browser.newPage(),errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
try {
  await page.goto((process.env.BLAZOR_URL||'http://127.0.0.1:5192')+'/disclosure');
  for(const name of ['accordion','collapse','read-more']) {
    await page.locator('#disclosure-kind').selectOption(name);
    const root=page.locator('#disclosure-root'),trigger=root.locator('button'),panel=root.locator('#blazor-disclosure-panel');
    await expect(root).toHaveAttribute('data-g-disclosure-value','[]');
    await expect(trigger).toHaveAttribute('aria-controls','blazor-disclosure-panel');
    await trigger.click();
    await expect(panel).toBeVisible();
    await expect(page.locator('#disclosure-state')).toHaveText('["a"]');
    await page.locator('#disclosure-input').fill('Edited '+name);
    const size=await root.getAttribute('data-g-disclosure-size');
    await page.locator('#disclosure-resize').click();
    await expect(root).toHaveAttribute('data-g-disclosure-size',size==='small'?'large':'small');
    await expect(panel).toBeVisible();
    await expect(page.locator('#disclosure-input')).toHaveValue('Edited '+name);
    await trigger.press('Enter');
    await expect(panel).toBeHidden();
    await expect(page.locator('#disclosure-state')).toHaveText('[]');
    await trigger.press('Space');
    await expect(panel).toBeVisible();
    await expect(page.locator('#disclosure-input')).toHaveValue('Edited '+name);
    results.push({name,controlled:true,parameterUpdate:true,contentPreserved:true,keyboard:true});
  }
  expect(errors).toEqual([]);
  fs.writeFileSync(new URL('../artifacts/disclosure-browser.json',import.meta.url),JSON.stringify({results,errors},null,2));
  console.log('Blazor disclosure: 3 components, controlled events, parameter updates, keyboard and preserved content passed');
} finally {await browser.close();}
