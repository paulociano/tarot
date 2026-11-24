import test from 'node:test';
import assert from 'node:assert/strict';
import {voiceScript,splitSpeech} from './voice-script.js';
test('narration excludes private user text and retains inversion',()=>{const s={spread:'custom',customSpread:{name:'SECRETO',positions:['SEGREDO'],layout:'grid',lens:['SEGREDO']},items:[{id:'18-a-lua',reversed:true}],question:'PERGUNTA PRIVADA',note:'NOTA PRIVADA',chat:[{role:'user',text:'CHAT PRIVADO'}]};const script=voiceScript(s);assert.match(script,/A Lua.*invertida/);assert.doesNotMatch(script,/SEGREDO|SECRETO|PRIVAD/);assert.ok(splitSpeech(script).every(p=>p.length<=270))});
test('sentence chunks are bounded and preserve content',()=>{const text='Uma frase. Outra frase? '+('palavra '.repeat(100));const parts=splitSpeech(text);assert.ok(parts.every(p=>p.length<=270));assert.equal(parts.join(' '),text.trim())});
