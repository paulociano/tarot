import {resolve,spreadFor} from './engine.js';
import {study} from './knowledge.js';
// Only published editorial material enters the synthesizer. No question, chat, notes or custom labels.
export function voiceScript(session){
 const spread=session.spread==='custom'?null:spreadFor(session.spread);
 const parts=['Contemple os símbolos da sua tiragem.'];
 session.items.forEach((item,i)=>{const c=resolve(item),k=study(c.id);parts.push(c.name+(item.reversed?', na orientação invertida': '')+'. '+(spread?spread.positions[i]+'. ':'')+'Observe '+c.meaning+'. '+k.depth)});
 parts.push(study(session.items.at(-1).id).question,'Leve consigo esta pergunta, com serenidade.');
 return parts.join('\n');
}
export function splitSpeech(text,max=270){
 const sentences=String(text).split(/(?<=[.!?])\s+|\n+/).map(x=>x.trim()).filter(Boolean);const result=[];
 for(const s of sentences){let part='';for(const word of s.split(/\s+/)){if(part&&part.length+word.length+1>max){result.push(part);part=''}part+=(part?' ':'')+word}if(part)result.push(part)}
 return result;
}
