import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retryFileOperation } from './fs-retry.mjs';
test('temporary Windows locks are retried without hiding persistent failures', async () => {
  let calls=0;
  assert.equal(await retryFileOperation(() => { if (++calls<3) throw Object.assign(new Error('busy'),{code:'UNKNOWN'}); return 42; }, 'win32'),42);
  assert.equal(calls,3);
  const missing=Object.assign(new Error('missing'),{code:'ENOENT'});
  await assert.rejects(retryFileOperation(()=>{throw missing;},'win32'),e=>e===missing);
  const locked=Object.assign(new Error('locked'),{code:'EPERM'}); calls=0;
  await assert.rejects(retryFileOperation(()=>{calls++;throw locked;},'win32'),e=>e===locked);
  assert.equal(calls,6);
});
