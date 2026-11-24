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

// Optimistic concurrency guard for local tabs. Check exact stored versions before writing.
// localStorage is not transactional across tabs: this detects stale snapshots, not a global lock.
export const COLLECTION_KEYS=['arcana-journal-v1','arcana-favorites-v1','arcana-journey-v1','arcana-custom-rituals-v1','arcana-dreams-v1'];
export function storageGuard(provider){
 const expected=new Map(),tracked=new Set([...COLLECTION_KEYS,'arcana-session-v2']);
 const read=(key,fallback)=>{try{const raw=provider().getItem(key);if(tracked.has(key)&&!expected.has(key))expected.set(key,raw);return JSON.parse(raw)??fallback}catch{return fallback}};
 const stale=key=>{try{return tracked.has(key)&&expected.has(key)&&provider().getItem(key)!==expected.get(key)}catch{return false}};
 const fresh=keys=>keys.every(key=>expected.has(key)&&!stale(key));
 const refresh=keys=>{for(const key of keys)expected.set(key,provider().getItem(key))};
 const write=(key,value)=>{try{const s=provider();if(tracked.has(key)&&(!expected.has(key)||stale(key)))return {ok:false,conflict:true};const raw=JSON.stringify(value);s.setItem(key,raw);if(tracked.has(key))expected.set(key,raw);return {ok:true,conflict:false}}catch{return {ok:false,conflict:false}}};
 return {read,write,stale,fresh,refresh};
}
