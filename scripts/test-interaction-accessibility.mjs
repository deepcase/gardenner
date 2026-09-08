import fs from 'node:fs';
import {chromium} from '../packages/css/node_modules/@playwright/test/index.mjs';
import AxeBuilder from '../packages/css/node_modules/@axe-core/playwright/dist/index.mjs';
const browser=await chromium.launch(),context=await browser.newContext(),page=await context.newPage(),failures=[];
try{for(const c of JSON.parse(fs.readFileSync('packages/css/metadata/components.json')).components.filter(c=>c.category==='interaction')){await page.goto('http://127.0.0.1:4180/preview.html?component='+c.name);await page.waitForSelector('html[data-demo-ready=true]');const audit=await new AxeBuilder({page}).include('[data-demo-component]').analyze();for(const v of audit.violations)failures.push({component:c.name,id:v.id,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))});}console.log(JSON.stringify(failures,null,2));if(failures.length)process.exitCode=1;}finally{await browser.close();}
