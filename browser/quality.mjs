import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist'),prefix='/tarot/',mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const server=createServer(async(req,res)=>{try{const path=new URL(req.url,'http://localhost').pathname;if(!path.startsWith(prefix))throw Error('outside scope');const p=resolve(root,path.slice(prefix.length)||'index.html');if(!p.startsWith(root+sep))throw Error('outside root');const body=await readFile(p);res.writeHead(200,{'Content-Type':mime[extname(p)]||'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port+prefix;
const browser=await chromium.launch();const report={environment:{browser:browser.version(),assetMode:'optimized dist under /tarot/',motion:'reduce',network:'local server; external fonts blocked; no throttling',deviceScaleFactor:1},routes:[],gates:[],limitations:['Laboratory metrics, not real-user Core Web Vitals','Automated accessibility rules do not certify WCAG compliance','No physical-device or subjective image/audio evaluation']};
const errors=[];
const routes=[['home','.hero'],['ritual','#setup'],['daily','.daily-reading'],['atlas','#grid'],['lab','#main h1'],['journey','#chapter-title'],['architect','#custom-form'],['journal','#vault-panel']];
try{
 await mkdir('browser/screenshots',{recursive:true});
 for(const width of [360,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',serviceWorkers:'block'});
  await context.route('**/*',route=>{const u=new URL(route.request().url());return u.origin===new URL(base).origin?route.continue():route.abort()});
  for(const [route,selector] of routes){
   const page=await context.newPage();page.on('pageerror',e=>errors.push({width,route,message:e.message}));
   await page.goto(base+'#'+route);await page.locator(selector).first().waitFor();
   if(route==='home'){await page.locator('.plate-mount img:not(.pending-art)').first().waitFor();await page.locator('.scene-layer[data-painting="portal"].scene-visible').waitFor();}
   await page.evaluate(()=>document.fonts.ready);
   const measured=await page.evaluate(()=>{const resources=performance.getEntriesByType('resource').filter(r=>r.name.startsWith(location.origin));return {scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,domNodes:document.querySelectorAll('*').length,resourceCount:resources.length,resourceBytes:resources.reduce((n,r)=>n+(r.encodedBodySize||0),0),imageBytes:resources.filter(r=>/\.(webp|png|jpg)(\?|$)/.test(r.name)).reduce((n,r)=>n+(r.encodedBodySize||0),0),voiceRequests:resources.filter(r=>r.name.includes('voice-worker')).length,haloRequests:resources.filter(r=>r.name.includes('aureola.')).length,navigationMs:Math.round(performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd||0)}});
   await page.addScriptTag({content:axe});
   const result=await page.evaluate(async()=>{const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}});return {violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,15),count:v.nodes.length})),incomplete:result.incomplete.map(v=>({id:v.id,count:v.nodes.length})),passed:result.passes.length}});
   report.routes.push({width,route,...measured,...result});console.log('QUALITY '+width+' '+route+' nodes='+measured.domNodes+' bytes='+measured.resourceBytes+' axe='+result.violations.map(v=>v.id).join(','));
   report.gates.push({width,route,check:'horizontal-overflow',pass:measured.scrollWidth<=width+1},{width,route,check:'voice-lazy-load',pass:measured.voiceRequests===0});
   const blockers=result.violations.filter(v=>['button-name','link-name','label','aria-valid-attr-value','aria-required-attr','document-title','html-has-lang'].includes(v.id));
   report.gates.push({width,route,check:'basic accessible controls',pass:blockers.length===0,findings:blockers.map(v=>v.id)});
   if(route==='home'){report.gates.push({width,route,check:'ornament lazy-load',pass:measured.haloRequests===0});report.gates.push({width,route,check:'cold local resource budget 2.5 MB',pass:measured.resourceBytes<=2_500_000});await page.screenshot({path:'browser/screenshots/quality-home-'+width+'.png',fullPage:true})}
   await page.close();
  }
  await context.close();
 }
 report.gates.push({check:'uncaught runtime errors',pass:errors.length===0,errors});
}finally{
 await mkdir('browser/quality',{recursive:true});await writeFile('browser/quality/report.json',JSON.stringify(report,null,2));await browser.close();await new Promise(r=>server.close(r));
}
const failed=report.gates.filter(g=>!g.pass);assert.deepEqual(failed,[],'Quality gate failures (see browser/quality/report.json)');
console.log('PASS quality gates; review axe findings and incomplete checks in report.json');
