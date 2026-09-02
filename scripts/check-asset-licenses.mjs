import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const csv = await readFile(new URL('../ASSET_LICENSES.csv', import.meta.url), 'utf8');
const rows = csv.trim().split('\n').slice(1).map(line => {
  const [pattern,status,source,license,evidence,checkedAt] = line.split(',');
  return {pattern,status,source,license,evidence,checkedAt};
});

async function walk(directory) {
  const entries = await readdir(directory,{withFileTypes:true});
  const nested = await Promise.all(entries.filter(entry=>!['.gitkeep','.DS_Store'].includes(entry.name)).map(entry => {
    const path=join(directory,entry.name);
    return entry.isDirectory()?walk(path):[relative(projectRoot,path)];
  }));
  return nested.flat();
}

const matches=(path,pattern)=>pattern.endsWith('*')?path.startsWith(pattern.slice(0,-1)):pattern.includes('*')?path.startsWith(pattern.split('*')[0])&&path.endsWith(pattern.split('*')[1]):path===pattern;
const files=await walk(join(projectRoot,'assets/images'));
const results=files.map(path=>({path,row:rows.find(row=>matches(path,row.pattern))}));
const missing=results.filter(item=>!item.row);
const review=results.filter(item=>item.row?.status==='YELLOW_REVIEW');
const green=results.filter(item=>item.row?.status==='GREEN');

console.log(`GREEN: ${green.length}`);
console.log(`YELLOW_REVIEW: ${review.length}`);
console.log(`UNREGISTERED: ${missing.length}`);
if(review.length) console.log(`Review required:\n${review.map(item=>`- ${item.path}`).join('\n')}`);
if(missing.length){console.error(`Unregistered assets:\n${missing.map(item=>`- ${item.path}`).join('\n')}`);process.exitCode=1;}
