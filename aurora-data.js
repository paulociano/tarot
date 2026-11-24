import {parseSymbols} from './dream-data.js';
export const stations=Object.freeze([{id:'sky',name:'O céu',glyph:'☽'},{id:'intention',name:'A intenção',glyph:'◇'},{id:'symbol',name:'O símbolo',glyph:'✧'},{id:'pause',name:'A pausa',glyph:'◎'},{id:'reflection',name:'O registro',glyph:'▤'}]);
export const systems=Object.freeze(['none','tarot','elder','iching']);
export const intervals=Object.freeze([0,3,5,10,20]);
export function newAurora(day){return {day,station:0,sky:null,intention:'',system:'none',symbol:null,minutes:0,completed:false,reflection:'',saved:false}}
export function moveStation(state,delta){return Math.max(0,Math.min(stations.length-1,state.station+delta))}
export function auroraRecord(s){
 const parts=['Data do ritual: '+s.day],tags=[];
 if(s.sky){parts.push('Céu: '+s.sky.phase+' · '+s.sky.light+'% de iluminação (ao meio-dia local).');tags.push(s.sky.phase)}
 if(s.intention.trim()){parts.push('Intenção: '+s.intention.trim());tags.push(...parseSymbols(s.intention))}
 if(s.symbol&&s.system!=='none'){parts.push('Símbolo: '+s.symbol.title+'\n'+s.symbol.body);tags.push(...s.symbol.tags)}
 if(s.completed&&s.minutes>0)parts.push('Pausa concluída: '+s.minutes+' minutos.');
 if(s.reflection.trim())parts.push('Reflexão: '+s.reflection.trim());
 return {title:'Aurora · '+s.day.split('-').reverse().join('/'),body:parts.join('\n\n'),tags:parseSymbols(tags.join(', '))};
}
export function hasExperience(s){return !!(s.sky||s.intention.trim()||s.symbol&&s.system!=='none'||s.completed&&s.minutes>0||s.reflection.trim())}
