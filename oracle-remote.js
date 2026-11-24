import {validSession,validItems,spreadFor,topics} from './engine.js';
export function oracleEndpoint(value){
 try{const u=new URL(String(value).trim());if(u.protocol!=='https:'||!u.hostname.endsWith('.vercel.app')||u.username||u.password||u.port||u.search||u.hash||u.pathname!=='/api/oracle')return null;return u.href}catch{return null}
}
export function oraclePayload(session,question){
 const q=String(question??'').trim();if(!q||q.length>500||!spreadFor(session.spread,session.customSpread)||!Object.hasOwn(topics,session.topic)||!validItems(session.items,10)||session.items.length!==spreadFor(session.spread,session.customSpread).positions.length)throw Error('A consulta precisa de uma tiragem concluída e de uma pergunta.');
 // Custom labels, notes, identifier, dates and all unrelated records stay local.
 return {spread:session.spread==='custom'?'custom':session.spread,topic:session.topic,items:session.items.map(i=>({id:i.id,reversed:i.reversed})),question:q,intention:String(session.question||'').slice(0,1000),history:(session.chat||[]).slice(-6).map(m=>({role:m.role,text:String(m.text).slice(0,1000)}))};
}
export async function remoteOracle(endpoint,code,payload,signal){
 const url=oracleEndpoint(endpoint);if(!url||typeof code!=='string'||code.length<32||code.length>256)throw Error('Configure o endereço HTTPS do Oráculo e o código privado de acesso.');
 const response=await fetch(url,{method:'POST',credentials:'omit',redirect:'error',cache:'no-store',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json','Authorization':'Bearer '+code},body:JSON.stringify(payload),signal});
 if(!response.ok){const messages={401:'Código de acesso incorreto.',403:'Origem não autorizada.',429:'Limite de consultas atingido. Use a leitura local.',503:'Oráculo generativo ainda não configurado no servidor.'};throw Error(messages[response.status]||'O Oráculo externo não respondeu. A leitura local continua disponível.')}
 const data=await response.json();if(typeof data.text!=='string'||!data.text.trim()||data.text.length>8000)throw Error('Resposta externa inválida.');return data.text;
}
