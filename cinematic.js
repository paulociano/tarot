// ARCANA Cinematic: optional paintings, bounded motion and original procedural audio.
export const scenes={home:{file:'portal',name:'O Portal'},ritual:{file:'santuario',name:'O Santuário'},atlas:{file:'biblioteca',name:'A Biblioteca'},daily:{file:'observatorio',name:'O Observatório'},journal:{file:'grimorio',name:'O Grimório'}};
export const modes=['essential','immersive','cinematic'];
let sceneToken=0,currentScene='',currentLayer=null;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-off');
export function showScene(route,optimized=false){
 const s=scenes[route]||scenes.home;if(currentScene===s.file)return;currentScene=s.file;const token=++sceneToken,host=document.querySelector('.scene-background');
 host.dataset.environment=s.file;host.style.setProperty('--px','0px');host.style.setProperty('--py','0px');
 const previous=currentLayer;currentLayer=null;
 if(previous){previous.classList.remove('scene-visible');setTimeout(()=>previous.remove(),700)}
 const paths=[...(optimized?['./assets/optimized/scenes/'+s.file+'.webp']:[]),'./assets/scenes/'+s.file+'.png','./assets/scenes/'+s.file+'.webp'];
 function attempt(i){if(i>=paths.length||token!==sceneToken)return;const image=new Image();image.decoding='async';image.alt='';image.className='scene-painting';image.onload=()=>{if(token!==sceneToken)return;currentLayer=document.createElement('div');currentLayer.className='scene-layer';currentLayer.setAttribute('aria-hidden','true');currentLayer.append(image);host.append(currentLayer);const layer=currentLayer;requestAnimationFrame(()=>{if(layer.isConnected)layer.classList.add('scene-visible')})};image.onerror=()=>attempt(i+1);image.src=paths[i]}
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
let audio=null,voices=[],bus=null,active=false;
const harmony={home:[110,164.81,220],ritual:[98,146.83,196],daily:[130.81,196,261.63],atlas:[110,146.83,220],journal:[82.41,123.47,164.81]};
export async function ambient(enabled,route){
 active=enabled; if(!enabled||document.hidden){stopAmbient();return false}
 try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();await audio.resume();if(!active||document.hidden)return false;stopAmbient();const t=audio.currentTime;bus=audio.createGain();bus.gain.setValueAtTime(.0001,t);bus.gain.exponentialRampToValueAtTime(.045,t+1.2);bus.connect(audio.destination);voices=(harmony[route]||harmony.home).map(f=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=f;g.gain.value=.19;o.connect(g);g.connect(bus);o.start();return o});return true}catch{return false}
}
function stopAmbient(){if(!audio||!bus)return;const old=bus,t=audio.currentTime;old.gain.cancelScheduledValues(t);old.gain.setTargetAtTime(.0001,t,.15);voices.forEach(o=>{try{o.stop(t+.9)}catch{}});voices=[];bus=null;setTimeout(()=>{try{old.disconnect()}catch{}},1000)}
export function pauseAmbient(){stopAmbient()}
