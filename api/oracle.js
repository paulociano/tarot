import {ORIGIN,MAX_BYTES,authorized,validateRequest,providerRequest,localGuard,outputText} from '../server/oracle-service.js';
// Private pilot. A per-instance throttle is defense in depth, not a global quota.
let windowStart=0,requests=0;
function throttle(){const now=Date.now();if(now-windowStart>60000){windowStart=now;requests=0}if(requests>=6)return false;requests++;return true}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Vary','Origin');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.headers.origin!==ORIGIN)return res.status(403).json({error:'origin'});
 res.setHeader('Access-Control-Allow-Origin',ORIGIN);res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
 if(req.method==='OPTIONS')return res.status(204).end();
 if(req.method!=='POST')return res.status(405).json({error:'method'});
 const {OPENAI_API_KEY:key,OPENAI_MODEL:model,ARCANA_ACCESS_CODE:secret}=process.env;
 if(!key||!model||!secret||secret.length<32)return res.status(503).json({error:'not configured'});
 if(!authorized(req.headers.authorization,secret))return res.status(401).json({error:'access'});
 if(!String(req.headers['content-type']||'').toLowerCase().startsWith('application/json'))return res.status(415).json({error:'content type'});
 if(Number(req.headers['content-length'])>MAX_BYTES)return res.status(413).json({error:'size'});
 let parsed;try{const body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(Buffer.byteLength(JSON.stringify(body)||'')>MAX_BYTES)return res.status(413).json({error:'size'});parsed=validateRequest(body)}catch{return res.status(400).json({error:'invalid request'})}
 const safe=localGuard(parsed);if(safe)return res.status(200).json({text:safe});
 if(!throttle())return res.status(429).json({error:'rate limit'});
 try{
 const upstream=await fetch('https://api.openai.com/v1/responses',{method:'POST',redirect:'error',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(providerRequest(parsed,model)),signal:AbortSignal.timeout(25000)});
 if(!upstream.ok)return res.status(upstream.status===429?429:502).json({error:'provider'});
 const text=outputText(await upstream.json());if(!text)return res.status(502).json({error:'empty response'});
 return res.status(200).json({text});
 }catch{return res.status(502).json({error:'provider unavailable'})}
}
