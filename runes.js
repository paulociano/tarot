// Original ARCANA sigils: artistic motifs, not historical rune readings.
import {deck} from './deck.js';
const palette={Maiores:'#d8b77b',Paus:'#eab16e',Copas:'#83c4d4',Espadas:'#bbc9ed',Ouros:'#b0c58a'};
const paths=[
'M0 -12V12 M-9 -5L0 -12 9 -5 M-8 5L0 12 8 5',
'M-10 -10L10 10 M10 -10L-10 10 M0 -13V13',
'M0 -13L11 0 0 13 -11 0Z M0 -13V13',
'M-10 10L0 -12 10 10 M-6 3H6 M0 -12V13',
'M-10 -9H10L0 1 10 11H-10 M0 -13V13',
'M-10 -10L0 0 10 -10 M-10 10L0 0 10 10 M-12 0H12',
'M-11 8L-5 -9 5 9 11 -8 M-12 0H12',
'M0 -13L10 -4 0 5 -10 -4Z M0 5V13',
'M-11 -9H11 M-11 9H11 M-6 -9L6 9 M6 -9L-6 9',
'M-9 11V-11L9 0 -9 11 M-9 0H12',
'M0 -13V13 M-10 -7L0 1 10 -7 M-10 2L0 10 10 2',
'M-11 0L0 -11 11 0 0 11Z M-11 0H11 M0 -11V11',
'M-10 11L0 -11 10 11 M-10 -11L0 11 10 -11'
];
const polar=(r,a)=>[Math.round(Math.cos(a)*r*100)/100,Math.round(Math.sin(a)*r*100)/100];
export function sigilInfo(id){const i=deck.findIndex(c=>c.id===id);if(i<0)throw Error('Arcano desconhecido');const c=deck[i];return {id,index:i,shape:i%13,seal:Math.floor(i/13),color:palette[c.suit],suit:c.suit}}
function glyph(info){return '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="'+paths[info.shape]+'"/><circle cx="0" cy="0" r="17" stroke-width=".6" opacity=".65"/>'+Array.from({length:6},(_,j)=>{const [x,y]=polar(21,j*Math.PI/3-Math.PI/2);return '<circle cx="'+x+'" cy="'+y+'" r="'+(j===info.seal?2.5:1)+'" fill="'+(j===info.seal?'currentColor':'none')+'" stroke-width=".7"/>'}).join('')+'</g>'}
function ticks(r,n){return Array.from({length:n},(_,i)=>{const a=i*2*Math.PI/n;const [x,y]=polar(r,a),[u,v]=polar(r+(i%3===0?6:3),a);return '<path d="M'+x+' '+y+'L'+u+' '+v+'"/>'}).join('')}
function orbitGlyphs(r,offset=0){return Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;const [x,y]=polar(r,a);return '<g transform="translate('+x+' '+y+') rotate('+(i*30+offset)+') scale(.32)"><path d="'+paths[(i+offset)%13]+'" fill="none" stroke="currentColor" stroke-width="2"/></g>'}).join('')}
export function runeHalo(id,active=false){const s=sigilInfo(id);return '<svg class="rune-halo '+(active?'rune-awake':'')+'" data-sigil="'+id+'" style="--rune:'+s.color+'" viewBox="-90 -90 180 180" aria-hidden="true"><g class="rune-ring outer-ring" fill="none" stroke="currentColor" stroke-width=".7"><circle r="81"/><circle r="72" stroke-dasharray="2 4"/>'+ticks(76,36)+orbitGlyphs(65,s.shape)+'</g><g class="rune-ring inner-ring" fill="none" stroke="currentColor" stroke-width=".8"><circle r="53"/><path d="M0 -52L45 26 -45 26Z M0 52L45 -26 -45 -26Z" opacity=".7"/><circle r="43" stroke-dasharray="1 5"/></g><g class="rune-core" transform="translate(0 -1)">'+glyph(s)+'</g></svg>'}
export function constellation(items,active=-1){const infos=items.map(i=>sigilInfo(i.id));const count=infos.length;if(!count)return '';const nodes=infos.map((s,i)=>{const a=-Math.PI/2+i*2*Math.PI/count;const [x,y]=polar(count===1?0:count===2?62:96,a);return {...s,x,y,reversed:items[i].reversed}});const edges=[];for(let i=0;i<count;i++)for(let j=i+1;j<count;j++)edges.push('<path class="rune-link '+(i===active||j===active?'new-link':'')+'" d="M'+nodes[i].x+' '+nodes[i].y+'L'+nodes[j].x+' '+nodes[j].y+'" pathLength="1"/>');return '<svg class="constellation '+(active>=0?'constellation-awake':'')+'" data-node-count="'+count+'" viewBox="-144 -144 288 288" aria-hidden="true"><g class="mandala-outer" fill="none" stroke="currentColor" stroke-width=".65"><circle r="132"/><circle r="122" stroke-dasharray="1 5"/>'+ticks(126,48)+orbitGlyphs(115,2)+'</g><g class="mandala-inner" fill="none" stroke="currentColor" stroke-width=".6"><circle r="76"/><circle r="50" stroke-dasharray="2 6"/><path d="M0 -72L62 36 -62 36Z M0 72L62 -36 -62 -36Z"/></g><g class="rune-links" fill="none" stroke="currentColor" stroke-width=".9">'+edges.join('')+'</g>'+nodes.map((s,i)=>'<g transform="translate('+s.x+' '+s.y+')" data-rune-node="'+s.id+'" style="color:'+s.color+'"><g class="mandala-node '+(i===active?'new-node':'')+'"><circle r="26" fill="#111225" stroke="currentColor" stroke-width=".8"/><g transform="rotate('+(s.reversed?180:0)+')">'+glyph(s)+'</g></g></g>').join('')+'</svg>'}
