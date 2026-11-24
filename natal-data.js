import {AstroTime, SiderealTime, e_tilt, Body, Ecliptic, GeoVector} from './vendor/astronomy.js';
import {skyPositions} from './astronomy-data.js';
export const signs=[
 ['Áries','♈','Fogo','Cardinal','Iniciativa','Onde posso iniciar algo com responsabilidade?'],
 ['Touro','♉','Terra','Fixo','Estabilidade','Que recurso merece cuidado paciente?'],
 ['Gêmeos','♊','Ar','Mutável','Curiosidade','Que pergunta abre uma perspectiva diferente?'],
 ['Câncer','♋','Água','Cardinal','Pertencimento','O que me oferece acolhimento?'],
 ['Leão','♌','Fogo','Fixo','Expressão','Como expressar criatividade sem depender de aprovação?'],
 ['Virgem','♍','Terra','Mutável','Discernimento','Que pequeno ajuste pode facilitar minha rotina?'],
 ['Libra','♎','Ar','Cardinal','Reciprocidade','Que acordo respeita as necessidades de todos?'],
 ['Escorpião','♏','Água','Fixo','Transformação','O que desejo compreender mais profundamente?'],
 ['Sagitário','♐','Fogo','Mutável','Exploração','Que horizonte de aprendizado me interessa?'],
 ['Capricórnio','♑','Terra','Cardinal','Estrutura','Que compromisso consigo sustentar?'],
 ['Aquário','♒','Ar','Fixo','Inovação','Que possibilidade surge ao questionar uma convenção?'],
 ['Peixes','♓','Água','Mutável','Imaginação','Como acolher a imaginação mantendo meus limites?']
].map(([name,glyph,element,mode,theme,question])=>({name,glyph,element,mode,theme,question}));
export const planetThemes={Sun:'Identidade e expressão',Moon:'Necessidades e pertencimento',Mercury:'Comunicação e aprendizado',Venus:'Afeto e valores',Mars:'Ação e limites',Jupiter:'Exploração e sentido',Saturn:'Estrutura e responsabilidade',Uranus:'Inovação e autonomia',Neptune:'Imaginação e sensibilidade',Pluto:'Transformação e renovação'};
export const houseThemes=['Identidade','Recursos','Comunicação','Origens','Criação','Rotina','Relações','Recursos compartilhados','Exploração','Vocação','Comunidade','Interioridade'];
export const wrap=x=>((x%360)+360)%360;
const rad=x=>x*Math.PI/180,deg=x=>x*180/Math.PI;
export function parseBirth({date,time,offset,latitude='',longitude=''}) {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!/^[-+](?:0\d|1[0-4]):[0-5]\d$/.test(offset))throw Error('Informe data, hora e deslocamento UTC no formato +00:00 ou -03:00.');
 const day=new Date(date+'T00:00:00Z'),year=Number(date.slice(0,4));if(!Number.isFinite(day.getTime())||day.toISOString().slice(0,10)!==date||year<1900||year>2100)throw Error('Escolha uma data válida entre 1900 e 2100.');
 const minutes=Number(offset.slice(1,3))*60+Number(offset.slice(4,6));if(minutes>840)throw Error('Deslocamento UTC fora do intervalo de 14 horas.');
 const instant=new Date(date+'T'+time+':00'+offset);if(!Number.isFinite(instant.getTime()))throw Error('Hora inválida.');
 const missingLat=String(latitude).trim()==='',missingLon=String(longitude).trim()==='';
 if(missingLat!==missingLon)throw Error('Informe as duas coordenadas ou deixe ambas vazias.');
 let location=null;if(!missingLat){const lat=Number(latitude),lon=Number(longitude);if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>66||Math.abs(lon)>180)throw Error('Latitude entre -66 e 66; longitude entre -180 e 180. Regiões polares não são suportadas nesta versão.');location={lat,lon}}
 return {instant,location}
}
export function signOf(lon){const normalized=wrap(lon),index=Math.floor(normalized/30);return {...signs[index],index,degree:normalized-index*30}}
export function anglesAt(instant,{lat,lon}){
 const t=new AstroTime(instant),theta=rad(wrap(SiderealTime(t)*15+lon)),eps=rad(e_tilt(t).tobl),phi=rad(lat);
 // Ecliptic normal cross local zenith in the true equatorial frame.
 const z=[Math.cos(phi)*Math.cos(theta),Math.cos(phi)*Math.sin(theta),Math.sin(phi)],n=[0,-Math.sin(eps),Math.cos(eps)];
 let p=[n[1]*z[2]-n[2]*z[1],n[2]*z[0]-n[0]*z[2],n[0]*z[1]-n[1]*z[0]];
 const east=[-Math.sin(theta),Math.cos(theta),0];if(p[0]*east[0]+p[1]*east[1]<0)p=p.map(v=>-v);
 if(Math.hypot(...p)<1e-10)throw Error('Ascendente indefinido para esta posição.');
 const ascendant=wrap(deg(Math.atan2(p[1]*Math.cos(eps)+p[2]*Math.sin(eps),p[0]))),midheaven=wrap(deg(Math.atan2(Math.sin(theta),Math.cos(theta)*Math.cos(eps))));
 return {ascendant,midheaven};
}
export const wholeHouse=(longitude,ascendant)=>((signOf(longitude).index-signOf(ascendant).index+12)%12)+1;
const definitions=[{name:'Conjunção',angle:0,orb:8,theme:'Integração'},{name:'Sextil',angle:60,orb:4,theme:'Possibilidade'},{name:'Quadratura',angle:90,orb:6,theme:'Tensão'},{name:'Trígono',angle:120,orb:6,theme:'Fluidez'},{name:'Oposição',angle:180,orb:8,theme:'Contraste'}];
export function separation(a,b){const diff=wrap(a-b);return Math.min(diff,360-diff)}
export function aspectsFor(points){const aspects=[];for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){const angle=separation(points[i].longitude,points[j].longitude);for(const d of definitions){const delta=Math.abs(angle-d.angle);if(delta<=d.orb)aspects.push({...d,a:points[i].id,b:points[j].id,deviation:delta,actual:angle})}}return aspects.sort((a,b)=>a.deviation-b.deviation)}
export function natalChart(input){
 const birth=parseBirth(input),positions=skyPositions(birth.instant);
 const p=Ecliptic(GeoVector(Body.Pluto,birth.instant,true));positions.push({id:'Pluto',name:'Plutão',glyph:'♇',color:'#BA93CF',longitude:p.elon,latitude:p.elat});
 const angles=birth.location?anglesAt(birth.instant,birth.location):null;
 return {...birth,angles,points:positions.map(p=>({...p,sign:signOf(p.longitude),house:angles?wholeHouse(p.longitude,angles.ascendant):null})),aspects:aspectsFor(positions)}
}
export function chartSummary(chart){return chart.points.map(p=>p.name+' · '+p.sign.name+' '+p.sign.degree.toFixed(2)+'°'+(p.house?' · Casa '+p.house:'')).concat(chart.angles?['Ascendente · '+signOf(chart.angles.ascendant).name+' '+signOf(chart.angles.ascendant).degree.toFixed(2)+'°','Meio do Céu · '+signOf(chart.angles.midheaven).name+' '+signOf(chart.angles.midheaven).degree.toFixed(2)+'°']:[]).join('\n')}
