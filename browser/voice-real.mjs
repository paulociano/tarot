import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve,sep } from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd();
const server=createServer(async(req,res)=>{try{const p=resolve(root,'.'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));if(!p.startsWith(root+sep))throw Error('invalid');res.writeHead(200,{'Content-Type':p.endsWith('.js')?'text/javascript':'text/html'});res.end(await readFile(p))}catch{res.writeHead(404);res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
try{
 const page=await browser.newPage({serviceWorkers:'block'});await page.goto('http://127.0.0.1:'+server.address().port+'/');
 const result=await page.evaluate(()=>new Promise((resolve,reject)=>{const w=new Worker('./voice-worker.js'),timer=setTimeout(()=>{w.terminate();reject(Error('Real synthesis timeout'))},240000);w.onerror=e=>{clearTimeout(timer);w.terminate();reject(Error(e.message))};w.onmessage=e=>{const d=e.data;if(d.type==='error'){clearTimeout(timer);w.terminate();reject(Error(d.message))}if(d.type==='segment'){clearTimeout(timer);w.terminate();resolve({pcm:Array.from(d.pcm),rate:d.rate})}};w.postMessage({type:'speak',parts:['A Lua ilumina o caminho da reflexão.']})}));
 assert.ok(result.pcm.length>result.rate/4);assert.ok(result.pcm.every(Number.isFinite));assert.ok(result.pcm.some(v=>Math.abs(v)>.01));
 const wav=Buffer.alloc(44+result.pcm.length*2);wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(result.rate,24);wav.writeUInt32LE(result.rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(wav.length-44,40);result.pcm.forEach((v,i)=>wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2));await writeFile('browser/voice-sample.wav',wav);console.log('PASS real neural synthesis: '+result.pcm.length+' samples at '+result.rate+' Hz');
}finally{await browser.close();await new Promise(r=>server.close(r))}
