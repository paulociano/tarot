// Stable registry: navigation, room ownership and cinematic environment are independent.
export const chambers=Object.freeze([
 {id:'sanctuary',name:'O Santuário',glyph:'✧',scene:'ritual',route:'ritual',description:'Tarot e rituais',detail:'Escolha cartas, explore uma questão ou construa uma tiragem.',x:50,y:13,links:[['ritual','Iniciar tiragem'],['architect','Arquiteto de rituais']]},
 {id:'observatory',name:'O Observatório',glyph:'☽',scene:'daily',route:'daily',description:'Símbolo do dia',detail:'Uma imagem para acompanhar suas reflexões.',x:84,y:39,links:[['daily','Carta do dia']]},
 {id:'atelier',name:'O Ateliê',glyph:'◇',scene:'atlas',route:'atelier',description:'Criação simbólica',detail:'Componha sua própria mandala ou sigilo.',x:71,y:82,links:[['atelier','Ateliê Alquímico']]},
 {id:'grimoire',name:'O Grimório',glyph:'▤',scene:'journal',route:'journal',description:'Memória e reflexão',detail:'Revisite suas leituras e proteja seu histórico.',x:29,y:82,links:[['journal','Diário e cofre']]},
 {id:'library',name:'A Biblioteca',glyph:'✷',scene:'atlas',route:'atlas',description:'Conhecimento',detail:'Descubra arcanos, combinações e a Jornada do Louco.',x:16,y:39,links:[['atlas','Baralho completo'],['lab','Combinações'],['journey','Jornada do Louco']]}
].map(r=>Object.freeze({...r,links:Object.freeze(r.links.map(l=>Object.freeze(l)))})));
export const routes=Object.freeze({
 home:{scene:'home',nav:'home',title:'O Portal',room:null},
 ritual:{scene:'ritual',nav:'ritual',title:'O Santuário',room:'sanctuary'},
 architect:{scene:'ritual',nav:'ritual',title:'Arquiteto de Rituais',room:'sanctuary'},
 daily:{scene:'daily',nav:'daily',title:'O Observatório',room:'observatory'},
 atlas:{scene:'atlas',nav:'atlas',title:'A Biblioteca',room:'library'},
 lab:{scene:'atlas',nav:'lab',title:'Laboratório de Combinações',room:'library'},
 journey:{scene:'atlas',nav:'atlas',title:'Jornada do Louco',room:'library'},
 journal:{scene:'journal',nav:'journal',title:'O Grimório',room:'grimoire'},
 atelier:{scene:'atlas',nav:'home',title:'Ateliê Alquímico',room:'atelier'}
});
export function resolveRoute(hash){const requested=String(hash||'').replace(/^#/,'')||'home',name=requested==='museum'?'atlas':Object.hasOwn(routes,requested)?requested:'home';return {name,...routes[name],redirect:requested!==name}}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function portalMarkup(){
 const points=chambers.map(c=>[c.x*4,c.y*4]);
 const links=points.map(([x,y])=>'<path d="M200 200L'+x+' '+y+'" stroke-dasharray="2 5"/>').join('');
 const ticks=Array.from({length:60},(_,i)=>{const a=i*Math.PI/30;return '<path d="M'+(200+166*Math.cos(a)).toFixed(2)+' '+(200+166*Math.sin(a)).toFixed(2)+'L'+(200+(i%5===0?176:170)*Math.cos(a)).toFixed(2)+' '+(200+(i%5===0?176:170)*Math.sin(a)).toFixed(2)+'"/>'}).join('');
 return '<section class="universe-portal" id="universe-portal" aria-labelledby="portal-heading" tabindex="-1"><div class="universe-intro"><p class="eyebrow">ARCANA · Universum</p><h2 id="portal-heading">Escolha uma câmara.</h2><p class="lead">Cada ambiente é uma passagem para um modo diferente de explorar os símbolos. Siga sua curiosidade, sem uma ordem obrigatória.</p></div><div class="universe-map"><svg class="universe-orbit" viewBox="0 0 400 400" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".65"><circle cx="200" cy="200" r="184"/><circle cx="200" cy="200" r="162" stroke-dasharray="1 5"/><circle cx="200" cy="200" r="112"/><circle cx="200" cy="200" r="76"/>'+ticks+links+'<path d="M'+points.map(p=>p.join(' ')).join('L')+'Z" opacity=".35"/></g></svg><div class="universe-heart" aria-hidden="true"><span>ARCANA</span><small>O Portal</small></div>'+chambers.map((c,i)=>'<a class="chamber-link" href="#'+c.route+'" data-chamber="'+c.id+'" style="--chamber-x:'+c.x+'%;--chamber-y:'+c.y+'%;--chamber-delay:'+i*55+'ms"><span class="chamber-glyph" aria-hidden="true">'+c.glyph+'</span><strong>'+escape(c.name)+'</strong><small>'+escape(c.description)+'</small></a>').join('')+'</div><div class="universe-directory" aria-label="Instrumentos das câmaras">'+chambers.map(c=>'<article><h3>'+escape(c.name)+'</h3><p>'+escape(c.detail)+'</p><div class="universe-tools">'+c.links.map(([route,label])=>'<a href="#'+route+'" class="text-link">'+escape(label)+' <span aria-hidden="true">→</span></a>').join('')+'</div></article>').join('')+'</div></section>'
}
export function roomNavigation(route){const entry=routes[route],room=chambers.find(c=>c.id===entry?.room);if(!room)return '';return '<nav class="room-trail" aria-label="Caminho no universo"><a href="#home">O Portal</a><span aria-hidden="true">›</span>'+(room.route!==route?'<a href="#'+room.route+'">'+escape(room.name)+'</a><span aria-hidden="true">›</span>':'')+'<span aria-current="page">'+escape(entry.title)+'</span></nav>'}
