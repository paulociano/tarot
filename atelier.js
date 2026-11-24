// Personal compositions, not historical runes or divinatory results.
const palettes=Object.freeze({gold:['#C6A46C','#EFE4CF','#60466C'],amethyst:['#BA93CF','#EFE4CF','#60466C'],ivory:['#EFE4CF','#C6A46C','#8A799B']});
export const DEFAULT_DESIGN=Object.freeze({kind:'mandala',symmetry:8,complexity:5,ink:'gold',seed:1});
export function normalizeDesign(value={}){
 const input=value&&typeof value==='object'?value:{};
 return {kind:input.kind==='sigil'?'sigil':'mandala',symmetry:[4,6,8,12].includes(Number(input.symmetry))?Number(input.symmetry):8,complexity:Number.isInteger(Number(input.complexity))?Math.max(2,Math.min(7,Number(input.complexity))):5,ink:Object.hasOwn(palettes,input.ink)?input.ink:'gold',seed:Number.isInteger(input.seed)?input.seed>>>0:1}
}
// The intention is hashed only on-device; the result is a reproducible artistic seed, not encryption.
export function intentionSeed(text){let h=2166136261;for(const char of String(text??'').normalize('NFC').trim().toLocaleLowerCase('pt-BR').slice(0,160)){h=Math.imul(h^char.codePointAt(0),16777619)}return h>>>0}
function random(seed){let n=seed>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296}}
const fixed=n=>Number(n.toFixed(2));
const circle=(r,stroke,width=.65,opacity=1)=>'<circle cx="0" cy="0" r="'+r+'" fill="none" stroke="'+stroke+'" stroke-width="'+width+'" opacity="'+opacity+'"/>';
export function compositionSVG(value,{standalone=false}={}){
 const d=normalizeDesign(value),[ink,light,shadow]=palettes[d.ink],rng=random(d.seed),n=d.symmetry;
 let drawing='';
 if(d.kind==='mandala'){
 const petals=Array.from({length:d.complexity},(_,j)=>{const radius=54+j*8+Math.round(rng()*8),bend=9+j*3+rng()*8;return '<path d="M0 0 Q'+fixed(bend)+' '+fixed(-radius*.49)+' 0 '+(-radius)+' Q'+fixed(-bend)+' '+fixed(-radius*.49)+' 0 0" fill="none" stroke="'+(j%3===0?light:ink)+'" stroke-width="'+(.6+j*.08).toFixed(2)+'" opacity="'+(.42+j*.07).toFixed(2)+'"/>'}).join('');
 const spoke='<g>'+petals+'<path d="M0 -100L5 -108 0 -116 -5 -108Z" stroke="'+ink+'" fill="'+shadow+'" stroke-width=".85"/><circle cy="-123" r="2" fill="'+light+'"/></g>';
 drawing=Array.from({length:n},(_,i)=>'<g transform="rotate('+i*360/n+')">'+spoke+'</g>').join('');
 }else{
 const points=Array.from({length:n},(_,i)=>{const angle=-Math.PI/2+i*2*Math.PI/n;return [fixed(Math.cos(angle)*(64+rng()*46)),fixed(Math.sin(angle)*(64+rng()*46))]});
 const order=Array.from({length:d.complexity+2},()=>Math.floor(rng()*n));const path=order.map((p,i)=>(i?'L':'M')+points[p].join(' ')).join(' ');
 drawing='<path d="'+path+'" fill="none" stroke="'+ink+'" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>'+points.map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="'+(order.includes(i)?4:1.8)+'" fill="'+(order.includes(i)?light:shadow)+'" stroke="'+ink+'" stroke-width=".7"/>').join('')+'<path d="M0 -16L16 0 0 16 -16 0Z" fill="none" stroke="'+light+'" stroke-width="1"/>';
 }
 const ticks=Array.from({length:72},(_,i)=>{const a=i*Math.PI/36;return '<path d="M'+fixed(131*Math.cos(a))+' '+fixed(131*Math.sin(a))+'L'+fixed((i%6===0?139:135)*Math.cos(a))+' '+fixed((i%6===0?139:135)*Math.sin(a))+'" stroke="'+ink+'" stroke-width=".6" opacity=".65"/>'}).join('');
 return '<svg '+(standalone?'xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" ':'class="atelier-composition" role="img" aria-label="'+(d.kind==='mandala'?'Mandala':'Sigilo')+' autoral de '+n+' eixos" ')+'viewBox="-160 -160 320 320"><rect x="-160" y="-160" width="320" height="320" rx="0" fill="#0C0D18"/>'+circle(148,ink,.65,.6)+circle(143,ink,.35,.45)+circle(127,ink,.8,.65)+circle(117,shadow,.6,.85)+circle(54,ink,.4,.35)+ticks+drawing+circle(9,ink,.8,.9)+'<circle r="2.4" fill="'+light+'"/></svg>'
}
let draft={...DEFAULT_DESIGN},intention='';
export function renderAtelier(root,saveMoment){
 root.innerHTML='<section class="section-head"><p class="eyebrow">ARCANA · Atelier Alchemicum</p><h1>O Ateliê Alquímico</h1><p class="lead">Crie uma geometria que dê forma à sua intenção. Uma obra pessoal, sem atribuição de poder sobrenatural.</p></section><section class="atelier-workbench" aria-labelledby="atelier-heading"><div class="atelier-stage"><div id="atelier-preview"></div><p class="muted" id="atelier-summary" aria-live="polite"></p></div><div class="panel atelier-controls"><h2 id="atelier-heading" class="section-compact-heading">Instrumentos de criação</h2><label>Composição<select id="atelier-kind"><option value="mandala">Mandala radial</option><option value="sigil">Sigilo geométrico</option></select></label><label>Eixos de simetria<select id="atelier-symmetry"><option>4</option><option>6</option><option>8</option><option>12</option></select></label><label>Complexidade <output id="atelier-complexity-value" for="atelier-complexity"></output><input id="atelier-complexity" type="range" min="2" max="7" step="1"></label><label>Pigmento<select id="atelier-ink"><option value="gold">Ouro antigo</option><option value="amethyst">Ametista</option><option value="ivory">Marfim</option></select></label><label>Intenção (opcional)<input id="atelier-intention" maxlength="160" autocomplete="off" placeholder="Uma palavra, um valor, uma ideia"></label><p class="muted">A intenção modifica a geometria localmente. O texto não será incluído na exportação.</p><div class="actions"><button class="secondary" id="atelier-seed" type="button">Transformar intenção</button><button class="secondary" id="atelier-variation" type="button">Nova variação</button></div><div class="actions"><button class="primary" id="atelier-keep" type="button">Guardar no Universum</button><button class="secondary" id="atelier-export" type="button">Exportar minha criação (SVG)</button><button class="secondary" id="atelier-reset" type="button">Restaurar composição</button></div><p id="atelier-status" role="status"></p><small>Guarde sua composição no Universum ou exporte o SVG. A intenção digitada não será salva; a geometria contém apenas os parâmetros e a semente.</small></div></section>';
 const $=id=>root.querySelector('#atelier-'+id);
 function redraw(){ $('preview').innerHTML=compositionSVG(draft);$('complexity-value').textContent=draft.complexity;$('summary').textContent=(draft.kind==='mandala'?'Mandala radial':'Sigilo geométrico')+' · '+draft.symmetry+' eixos · '+draft.complexity+' camadas';}
 function sync(){for(const field of ['kind','symmetry','complexity','ink'])$(field).value=draft[field];$('intention').value=intention;redraw()}
 for(const field of ['kind','symmetry','complexity','ink'])$(field).addEventListener('input',()=>{draft=normalizeDesign({...draft,[field]:$(field).value});$('status').textContent='';redraw()});
 $('intention').addEventListener('input',()=>{intention=$('intention').value});
 $('seed').onclick=()=>{draft=normalizeDesign({...draft,seed:intentionSeed(intention)});redraw();$('status').textContent='A intenção foi convertida em uma variação visual.'};
 $('variation').onclick=()=>{draft=normalizeDesign({...draft,seed:crypto.getRandomValues(new Uint32Array(1))[0]});redraw();$('status').textContent='Nova composição criada.'};
 $('reset').onclick=()=>{draft={...DEFAULT_DESIGN};intention='';sync();$('status').textContent='Composição inicial restaurada.'};
 $('keep').onclick=()=>{$('status').textContent=saveMoment('atelier',draft.kind==='mandala'?'Minha mandala':'Meu sigilo',$('summary').textContent,[draft.kind==='mandala'?'Mandala':'Sigilo'],{...draft})};
 $('export').onclick=()=>{const url=URL.createObjectURL(new Blob([compositionSVG(draft,{standalone:true})],{type:'image/svg+xml'}));const link=document.createElement('a');link.href=url;link.download='arcana-'+draft.kind+'.svg';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent='Sua composição foi preparada para exportação.'};
 sync()
}
