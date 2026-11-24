import {Body,MoonPhase,Illumination,SearchMoonQuarter,NextMoonQuarter,GeoVector,Ecliptic,Seasons,SearchGlobalSolarEclipse,SearchLunarEclipse} from './vendor/astronomy.js';
export const MIN_YEAR=1900,MAX_YEAR=2100;
export const quarters=['Lua nova','Quarto crescente','Lua cheia','Quarto minguante'];
export const phaseNames=['Lua nova','Crescente','Quarto crescente','Gibosa crescente','Lua cheia','Gibosa minguante','Quarto minguante','Minguante'];
const bodies=[['Sun','Sol','☉','#C6A46C'],['Moon','Lua','☽','#EFE4CF'],['Mercury','Mercúrio','☿','#B5B8CA'],['Venus','Vênus','♀','#D8B5A0'],['Mars','Marte','♂','#D89A80'],['Jupiter','Júpiter','♃','#C8AD85'],['Saturn','Saturno','♄','#D5C59A'],['Uranus','Urano','♅','#9CC3CD'],['Neptune','Netuno','♆','#A9A7DC']];
export function localDateKey(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')}
export function dateAtNoon(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))throw Error('Data inválida.');const [y,m,d]=value.split('-').map(Number);const date=new Date(y,m-1,d,12);if(y<MIN_YEAR||y>MAX_YEAR||localDateKey(date)!==value)throw Error('Escolha uma data válida entre 1900 e 2100.');return date}
export function shiftDate(value,days){const d=dateAtNoon(value);d.setDate(d.getDate()+days);return localDateKey(d)}
export function phaseLabel(angle){return phaseNames[Math.floor((((angle%360)+360+22.5)%360)/45)]}
export function moonAt(date){const angle=MoonPhase(date),illumination=Illumination(Body.Moon,date);return {angle,phase:phaseLabel(angle),fraction:illumination.phase_fraction,waxing:angle<180,distanceKm:Math.round(illumination.geo_dist*149597870.7)}}
export function nextQuarters(date,count=4){let q=SearchMoonQuarter(date);const result=[];for(let i=0;i<count;i++){result.push({name:quarters[q.quarter],date:q.time.date,quarter:q.quarter});q=NextMoonQuarter(q)}return result}
export function skyPositions(date){return bodies.map(([id,name,glyph,color])=>{const e=Ecliptic(GeoVector(Body[id],date,true));return {id,name,glyph,color,longitude:e.elon,latitude:e.elat}})}
const seasonCache=new Map();
function yearSeasons(y){if(seasonCache.has(y))return seasonCache.get(y);const s=Seasons(y),events=[['Equinócio de março',s.mar_equinox],['Solstício de junho',s.jun_solstice],['Equinócio de setembro',s.sep_equinox],['Solstício de dezembro',s.dec_solstice]].map(([name,time])=>({name,date:time.date}));if(seasonCache.size>8)seasonCache.clear();seasonCache.set(y,events);return events}
export function nextSeason(date){return [...yearSeasons(date.getUTCFullYear()),...yearSeasons(date.getUTCFullYear()+1)].find(e=>e.date>=date)}
const eclipseNames={partial:'parcial',total:'total',annular:'anular',penumbral:'penumbral'};
export function nextEclipses(date){const solar=SearchGlobalSolarEclipse(date),lunar=SearchLunarEclipse(date);return [{name:'Eclipse solar '+(eclipseNames[solar.kind]||solar.kind),date:solar.peak.date},{name:'Eclipse lunar '+(eclipseNames[lunar.kind]||lunar.kind),date:lunar.peak.date}].sort((a,b)=>a.date-b.date)}
export function monthCalendar(date){const y=date.getFullYear(),m=date.getMonth(),days=new Date(y,m+1,0).getDate(),offset=(new Date(y,m,1).getDay()+6)%7;return [...Array(offset).fill(null),...Array.from({length:days},(_,i)=>{const d=new Date(y,m,i+1,12);return {key:localDateKey(d),day:i+1,...moonAt(d)}})]}
