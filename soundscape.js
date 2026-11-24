// ARCANA soundtrack. Media is streamed on demand, never preloaded at startup.
export const sceneTracks=Object.freeze({home:'portal',ritual:'santuario',atlas:'biblioteca',daily:'observatorio',journal:'grimorio'});
export const MUSIC_MAX=.20,MUSIC_NORMAL=.15,MUSIC_DUCK=.04;
const FADE=1.8;
export function createSoundscape(factory,hidden=()=>false,mediaFactory=()=>new Audio()){
 let ctx=null,master=null,desired=false,ducked=false,epoch=0,current=null,pending=null;
 const layers=new Set();
 const gainTarget=()=>Math.min(MUSIC_MAX,ducked?MUSIC_DUCK:MUSIC_NORMAL);
 function initialize(){if(ctx)return;ctx=factory();master=ctx.createGain();master.gain.value=gainTarget();master.connect(ctx.destination)}
 function level(layer){if(!layer.ramp)return layer.gain.gain.value;const {from,to,start,end}=layer.ramp;const fraction=Math.max(0,Math.min(1,(ctx.currentTime-start)/(end-start)));return from+(to-from)*fraction}
 function fade(layer,to){const from=Math.max(0,Math.min(1,level(layer))),t=ctx.currentTime;layer.gain.gain.cancelScheduledValues(t);layer.gain.gain.setValueAtTime(from,t);layer.gain.gain.linearRampToValueAtTime(to,t+FADE);layer.ramp={from,to,start:t,end:t+FADE}}
 function dispose(layer){if(!layer||!layers.delete(layer))return;clearTimeout(layer.timer);layer.media.pause();layer.media.removeAttribute('src');layer.media.load();layer.source.disconnect();layer.gain.disconnect();if(current===layer)current=null}
 function cancelPending(){if(!pending)return;const p=pending;pending=null;p.cancel();dispose(p.layer)}
 function clear(){cancelPending();for(const layer of [...layers])dispose(layer);current=null}
 async function play(enabled,route){
 desired=enabled;
 if(!enabled||hidden()){epoch++;clear();return false}
 route=Object.hasOwn(sceneTracks,route)?route:'home';
 if(pending?.layer.route===route)return pending.promise;
 const ticket=++epoch;cancelPending();
 if(current?.route===route)return true;
 for(const layer of [...layers])if(layer!==current)dispose(layer);
 let layer=null;
 try{
 initialize();const media=mediaFactory();media.preload='none';media.loop=true;media.volume=1;media.src='./assets/'+sceneTracks[route]+'.mp3';
 const source=ctx.createMediaElementSource(media),gain=ctx.createGain();gain.gain.value=0;source.connect(gain);gain.connect(master);
 layer={route,media,source,gain,ramp:null,timer:null};layers.add(layer);
 let cancel;const cancelled=new Promise(resolve=>{cancel=()=>resolve(false)});
 const attempt=async()=>{let timeout;try{
 // Both calls occur before awaiting, retaining the initiating click's user activation.
 const resumed=ctx.resume(),started=media.play();
 const ok=await Promise.race([Promise.all([resumed,started]).then(()=>true),cancelled,new Promise(resolve=>{timeout=setTimeout(()=>resolve(false),15000)})]);
 if(ticket!==epoch||!desired||hidden()||!ok){dispose(layer);return false}
 const previous=current;current=layer;fade(layer,1);
 if(previous){fade(previous,0);previous.timer=setTimeout(()=>dispose(previous),FADE*1000+150)}
 return true
 }catch{dispose(layer);return false}finally{clearTimeout(timeout);if(pending?.layer===layer)pending=null}};
 const promise=attempt();pending={layer,cancel,promise};return promise;
 }catch{dispose(layer);return false}
 }
 function duck(enabled){ducked=enabled;if(master){const t=ctx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setTargetAtTime(gainTarget(),t,enabled?.12:.32)}}
 function pause(){epoch++;clear()}
 function state(){return {layers:layers.size,sources:layers.size,route:current?.route||null,ducked,desired,targetVolume:gainTarget(),maxVolume:MUSIC_MAX,playing:!!current&&!current.media.paused,position:current?.media.currentTime||0,duration:current?.media.duration||0}}
 return {play,duck,pause,state}
}
