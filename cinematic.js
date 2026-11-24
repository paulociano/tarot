// ARCANA Cinematic: optional paintings, bounded motion and original procedural audio.
export const scenes={home:{file:'portal',name:'O Portal'},ritual:{file:'santuario',name:'O Santuário'},atlas:{file:'biblioteca',name:'A Biblioteca'},daily:{file:'observatorio',name:'O Observatório'},journal:{file:'grimorio',name:'O Grimório'}};
import {createSoundscape} from './soundscape.js';
let sceneToken=0,currentScene='',requestedScene='',currentLayer=null;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-off');
export function showScene(route,optimized=false){
 const s=scenes[route]||scenes.home;if(requestedScene===s.file)return;requestedScene=s.file;const token=++sceneToken,host=document.querySelector('.scene-background');
 host.style.setProperty('--px','0px');host.style.setProperty('--py','0px');
 if(currentScene===s.file&&currentLayer){requestedScene=s.file;return}
 const paths=[...(optimized?['./assets/optimized/scenes/'+s.file+'.webp']:[]),'./assets/scenes/'+s.file+'.png','./assets/scenes/'+s.file+'.webp'];
 function attempt(i){if(token!==sceneToken)return;if(i>=paths.length){requestedScene='';return}const image=new Image();image.decoding='async';image.alt='';image.className='scene-painting protected-art';image.draggable=false;
 image.onload=()=>{if(token!==sceneToken)return;const previous=currentLayer;
 // Retain the previous painting while the next loads. Discard only obsolete fading layers.
 host.querySelectorAll('.scene-layer').forEach(layer=>{if(layer!==previous)layer.remove()});
 const layer=document.createElement('div');layer.className='scene-layer';layer.dataset.painting=s.file;layer.setAttribute('aria-hidden','true');layer.append(image);host.append(layer);currentLayer=layer;currentScene=s.file;host.dataset.environment=s.file;
 if(reduced()){layer.classList.add('scene-visible');previous?.remove();return}
 requestAnimationFrame(()=>{if(layer!==currentLayer||!layer.isConnected)return;layer.classList.add('scene-visible');if(previous)setTimeout(()=>{if(previous!==currentLayer)previous.remove()},750)});
 };image.onerror=()=>attempt(i+1);image.src=paths[i]}
 attempt(0)
}
let frame=0,px=0,py=0;export function bindAtmosphere(){
 const host=document.querySelector('.scene-background');
 window.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reduced()||document.body.dataset.immersion!=='cinematic')return;px=(e.clientX/innerWidth-.5)*16;py=(e.clientY/innerHeight-.5)*10;if(!frame)frame=requestAnimationFrame(()=>{frame=0;if(!reduced()&&document.body.dataset.immersion==='cinematic'){host.style.setProperty('--px',px+'px');host.style.setProperty('--py',py+'px')}})},{passive:true});
 document.addEventListener('pointerleave',()=>{host.style.setProperty('--px','0px');host.style.setProperty('--py','0px')});
}
export function animateArrival(stage,origin){
 if(!stage||reduced()||document.body.dataset.immersion!=='cinematic'||!stage.animate)return null;
 const target=stage.getBoundingClientRect();let x=0,y=18,scale=.87;
 if(origin&&target.width>0&&target.height>0&&target.top>=0&&target.bottom<=innerHeight&&origin.top>=0&&origin.bottom<=innerHeight){x=origin.left+origin.width/2-target.left-target.width/2;y=origin.top+origin.height/2-target.top-target.height/2;scale=Math.max(.35,Math.min(1,origin.width/target.width))}
 return stage.animate([{transform:'translate('+x+'px,'+y+'px) scale('+scale+')',opacity:.85},{transform:'translate(0,0) scale(1)',opacity:1}],{duration:420,easing:'cubic-bezier(.2,.75,.25,1)'});
}
const soundscape=createSoundscape(()=>new (window.AudioContext||window.webkitAudioContext)(),()=>document.hidden);
export const ambient=(enabled,route)=>soundscape.play(enabled,route);
export const duckAmbient=enabled=>soundscape.duck(enabled);
export const pauseAmbient=()=>soundscape.pause();
