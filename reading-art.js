import {resolve,validItems} from './engine.js';
import {constellation} from './runes.js';
const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
// A shareable original vector composition, deliberately without raster artwork or personal text.
export function readingArtwork(items){
 if(!validItems(items,10)||!items.length)throw Error('Tiragem inválida.');
 const rows=items.map((i,n)=>{const c=resolve(i);return '<g transform="translate(0 '+(850+n*48)+')"><text x="92" y="0" fill="#c6a46c" font-size="22">'+String(n+1).padStart(2,'0')+'</text><text x="142" y="0" fill="#efe4cf" font-size="26">'+xml(c.name)+'</text><text x="828" y="0" fill="#c6a46c" font-size="20" text-anchor="end">'+(i.reversed?'Invertida':'Normal')+'</text></g>'}).join('');
 const h=950+items.length*48;
 const seal=constellation(items).replace('<svg ','<svg x="170" y="210" width="580" height="580" color="#d8b77b" ');
 return '<svg xmlns="http://www.w3.org/2000/svg" width="920" height="'+h+'" viewBox="0 0 920 '+h+'" role="img" aria-label="ARCANA: composição simbólica"><title>ARCANA · Composição simbólica</title><style>.rune-link{opacity:.5}.mandala-inner{opacity:.75}.mandala-outer{opacity:.85}</style><rect width="920" height="'+h+'" fill="#0c0d18"/><rect x="32" y="32" width="856" height="'+(h-64)+'" fill="none" stroke="#c6a46c" stroke-width="1"/><rect x="42" y="42" width="836" height="'+(h-84)+'" fill="none" stroke="#60466c"/><g font-family="Georgia, serif"><text x="460" y="110" fill="#c6a46c" text-anchor="middle" font-size="38" letter-spacing="10">ARCANA</text><text x="460" y="157" fill="#efe4cf" text-anchor="middle" font-size="22">Composição simbólica</text>'+seal+'<path d="M90 805H830" stroke="#c6a46c" opacity=".5"/>'+rows+'<text x="460" y="'+(h-72)+'" text-anchor="middle" fill="#c6a46c" font-size="17">Reflexão, não previsão · ARCANA</text></g></svg>';
}
export function downloadArtwork(svg){const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='arcana-composicao.svg';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
