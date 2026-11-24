import {deck} from './deck.js';
import {fold,parseSymbols} from './dream-data.js';
export const PERSONAL_KEY='arcana-personal-v1',MAX_MOMENTS=300;
export const momentTypes=Object.freeze({atelier:{name:'Ateliê',route:'atelier',glyph:'◇'},elder:{name:'Runas',route:'elder',glyph:'ᚠ'},iching:{name:'I Ching',route:'iching',glyph:'☷'},mirrors:{name:'Espelhos',route:'mirrors',glyph:'◈'},silentium:{name:'Silentium',route:'silentium',glyph:'◎'},astrarium:{name:'Astrarium',route:'astrarium',glyph:'☽'},tarot:{name:'Tarot',route:'journal',glyph:'✧'},dream:{name:'Onirium',route:'onirium',glyph:'☾'},aurora:{name:'Aurora',route:'aurora',glyph:'☉'},natal:{name:'Natalis',route:'natal',glyph:'♁'}});
const allowed=['atelier','elder','iching','mirrors','silentium','astrarium','aurora','natal'];
export const emptyPersonal=()=>({profile:{name:'',intention:''},moments:[]});
const str=(v,n)=>typeof v==='string'&&v.length<=n;
const validDesign=d=>!!d&&['mandala','sigil'].includes(d.kind)&&[4,6,8,12].includes(d.symmetry)&&Number.isInteger(d.complexity)&&d.complexity>=2&&d.complexity<=7&&['gold','amethyst','ivory'].includes(d.ink)&&Number.isInteger(d.seed)&&d.seed>=0&&d.seed<=4294967295;
const validDate=d=>str(d,35)&&Number.isFinite(Date.parse(d))&&/^\d{4}-\d{2}-\d{2}T/.test(d);
export function validMoment(r){return !!r&&str(r.id,80)&&/^[a-zA-Z0-9-]+$/.test(r.id)&&allowed.includes(r.type)&&validDate(r.date)&&str(r.title,120)&&!!r.title.trim()&&str(r.body,12000)&&Array.isArray(r.tags)&&r.tags.length<=12&&r.tags.every(t=>str(t,40)&&!!fold(t))&&new Set(r.tags.map(fold)).size===r.tags.length&&(r.type==='atelier'?validDesign(r.design):r.design===undefined)}
function snapshot(r){return {id:r.id,type:r.type,date:r.date,title:r.title,body:r.body,tags:[...r.tags],...(r.type==='atelier'?{design:{kind:r.design.kind,symmetry:r.design.symmetry,complexity:r.design.complexity,ink:r.design.ink,seed:r.design.seed}}:{})}}
export function checkedPersonal(data){if(!data||!data.profile||!str(data.profile.name,60)||!str(data.profile.intention,200)||!Array.isArray(data.moments)||data.moments.length>MAX_MOMENTS||!data.moments.every(validMoment)||new Set(data.moments.map(r=>r.id)).size!==data.moments.length)throw Error('Universum incompatível ou acima de 300 registros.');return {profile:{name:data.profile.name,intention:data.profile.intention},moments:data.moments.map(snapshot)}}
export function mergePersonal(a,b){const local=checkedPersonal(a),incoming=checkedPersonal(b),ids=new Set(local.moments.map(r=>r.id)),newRows=incoming.moments.filter(r=>!ids.has(r.id));const profile=local.profile.name||local.profile.intention?local.profile:incoming.profile;return {data:checkedPersonal({profile,moments:[...local.moments,...newRows]}),added:newRows.length,preserved:incoming.moments.length-newRows.length}}
export function makeMoment(type,title,body,tags=[],design){return {id:crypto.randomUUID(),type,date:new Date().toISOString(),title,body,tags:parseSymbols(tags.join(', ')),...(design?{design}:{})}}
const cardNames=new Map(deck.map(c=>[c.id,c.name]));
export function collectMoments(personal,records,dreams){
 const tarot=records.map(r=>({id:'tarot:'+r.id,type:'tarot',date:r.date,title:r.question||'Tiragem de tarot',body:r.items.map(i=>cardNames.get(i.id)+(i.reversed?' (invertida)':'')).join(' · ')+(r.note?'\n'+r.note:''),tags:parseSymbols(r.items.map(i=>cardNames.get(i.id)).join(', ')),derived:true}));
 const onirium=dreams.map(r=>({id:'dream:'+r.id,type:'dream',date:r.date+'T12:00:00',title:r.title,body:[r.story,r.reflection].filter(Boolean).join('\n\n'),tags:r.symbols,derived:true}));
 return [...personal.moments,...tarot,...onirium].sort((a,b)=>Date.parse(b.date)-Date.parse(a.date))
}
export function personalGraph(rows){
 const groups=new Map(),tags=new Map();
 for(const r of rows){groups.set(r.type,(groups.get(r.type)||0)+1);for(const label of r.tags){const key=fold(label);if(!tags.has(key))tags.set(key,{key,label,count:0,types:new Set()});const t=tags.get(key);t.count++;t.types.add(r.type)}}
 const nodes=Object.keys(momentTypes).filter(k=>groups.has(k)).map(type=>({type,count:groups.get(type),...momentTypes[type]}));
 const links=new Map();for(const t of tags.values()){const types=[...t.types].sort();for(let i=0;i<types.length;i++)for(let j=i+1;j<types.length;j++){const key=types[i]+'|'+types[j],l=links.get(key)||{a:types[i],b:types[j],labels:[]};l.labels.push(t.label);links.set(key,l)}}
 return {nodes,links:[...links.values()],tags:[...tags.values()].sort((a,b)=>b.count-a.count||a.key.localeCompare(b.key,'pt-BR')).slice(0,12).map(t=>({...t,types:[...t.types]}))}
}
export function filterMoments(rows,{type='',tag='',query=''}={}){return rows.filter(r=>(!type||r.type===type)&&(!tag||r.tags.some(t=>fold(t)===fold(tag)))&&(!query||fold([r.title,r.body,...r.tags].join(' ')).includes(fold(query))))}
