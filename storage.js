import {validRecord} from './engine.js';
import {snapshot} from './custom-ritual.js';
export function readLocal(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
export function writeLocal(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
export function importJournal(text,existing=[]){
 if(typeof text!=='string'||text.length>5_000_000)throw Error('Arquivo excede o limite de 5 MB.');
 let data;try{data=JSON.parse(text)}catch{throw Error('Arquivo JSON inválido.')}
 const rows=Array.isArray(data)?data:data?.format==='arcana-journal'&&data.version===1?data.records:null;
 if(!Array.isArray(rows)||rows.length>5000||!rows.every(validRecord))throw Error('Backup incompatível ou com registros inválidos.');
 const ids=new Set(existing.map(r=>r.id));const added=[];
 for(const r of rows){if(ids.has(r.id))continue;ids.add(r.id);added.push({id:r.id,date:r.date,spread:r.spread,...(r.spread==='custom'?{customSpread:snapshot(r.customSpread)}:{}),topic:r.topic,question:r.question,note:r.note,items:r.items.map(i=>({id:i.id,reversed:i.reversed})),chat:(r.chat||[]).map(m=>({role:m.role,text:m.text}))})}
 return {records:[...existing,...added].sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)),added:added.length,skipped:rows.length-added.length}
}
export const journalBackup=records=>({format:'arcana-journal',version:1,records});
