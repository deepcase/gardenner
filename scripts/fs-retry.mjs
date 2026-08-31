import * as fs from 'node:fs/promises';
// Windows file scanners/watchers can briefly prevent replacing generated files.
// Retry only transient errors, bounded to 620ms, and retain the original failure.
export async function retryFileOperation(operation, platform = process.platform) {
  for (let attempt = 0; ; attempt++) {
    try { return await operation(); }
    catch (error) {
      if (platform !== 'win32' || attempt >= 5 || !['EBUSY','EPERM','EACCES','UNKNOWN'].includes(error.code)) throw error;
      await new Promise(resolve => setTimeout(resolve, 20 * 2 ** attempt));
    }
  }
}
export const writeFile = (...args) => retryFileOperation(() => fs.writeFile(...args));
export const copyFile = (...args) => retryFileOperation(() => fs.copyFile(...args));
export const cp = (...args) => retryFileOperation(() => fs.cp(...args));
