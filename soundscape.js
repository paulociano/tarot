// Original procedural score. No external audio, no autoplay, bounded voice count.
export const sceneHarmony=Object.freeze({
 home:[110,164.81,220,261.63],
 ritual:[98,146.83,196,233.08],
 daily:[130.81,196,261.63,329.63],
 atlas:[110,146.83,220,293.66],
 journal:[82.41,123.47,164.81,246.94]
});
const NORMAL=.085,DUCK=.022;
export function createSoundscape(factory,hidden=()=>false){
 let ctx=null,master=null,filter=null,desired=false,ducked=false,epoch=0,current=null;const layers=new Set();
 const now=()=>ctx.currentTime;
 function target(param,value,time){const t=now();if(typeof param.cancelAndHoldAtTime==='function')param.cancelAndHoldAtTime(t);else{param.cancelScheduledValues(t);param.setValueAtTime(param.value,t)}param.setTargetAtTime(value,t,time)}
 function initialize(){if(ctx)return;ctx=factory();master=ctx.createGain();master.gain.value=ducked?DUCK:NORMAL;filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1250;filter.Q.value=.45;filter.connect(master);master.connect(ctx.destination)}
 function dispose(layer){if(!layers.has(layer))return;layers.delete(layer);for(const n of layer.sources){try{n.stop()}catch{}try{n.disconnect()}catch{}}for(const n of layer.nodes){try{n.disconnect()}catch{}}if(current===layer)current=null}
 function retire(layer){if(!layer||layer.retiring)return;layer.retiring=true;target(layer.gain.gain,0,.28);for(const source of layer.sources)try{source.stop(now()+1.45)}catch{};layer.sources[0].onended=()=>dispose(layer)}
 function create(route){const gain=ctx.createGain();gain.gain.value=0;gain.connect(filter);const layer={route,gain,nodes:[gain],sources:[],retiring:false};layers.add(layer);
 const freqs=sceneHarmony[route]||sceneHarmony.home;
 // A low fundamental, two gentle partials, a drifting upper tone. Each has its own slow tremolo.
 freqs.forEach((hz,i)=>{const tone=ctx.createOscillator(),volume=ctx.createGain(),lfo=ctx.createOscillator(),depth=ctx.createGain();tone.type=i===1?'triangle':'sine';tone.frequency.value=hz;tone.detune.value=[0,-3,4,-2][i];volume.gain.value=[.22,.105,.10,.055][i];lfo.frequency.value=[.075,.113,.047,.091][i];depth.gain.value=[.032,.025,.023,.018][i];lfo.connect(depth);depth.connect(volume.gain);tone.connect(volume);if(typeof ctx.createStereoPanner==='function'){const pan=ctx.createStereoPanner();pan.pan.value=[0,-.36,.36,.16][i];volume.connect(pan);pan.connect(gain);layer.nodes.push(pan)}else volume.connect(gain);layer.nodes.push(volume,depth);layer.sources.push(tone,lfo);tone.start();lfo.start()});
 target(gain.gain,1,.48);return layer}
 async function play(enabled,route){desired=enabled;const ticket=++epoch;if(!enabled||hidden()){if(current)retire(current);current=null;return false}
 try{initialize();await ctx.resume();if(ticket!==epoch)return desired;if(!desired||hidden())return false;if(current?.route===route&&!current.retiring)return true;
 // Keep at most one fading layer and one new layer even during rapid navigation.
 for(const layer of [...layers])if(layer!==current)dispose(layer);
 if(current)retire(current);current=create(route);return true
 }catch{if(ticket===epoch){for(const layer of [...layers])dispose(layer);desired=false}return false}}
 function duck(enabled){ducked=enabled;if(master)target(master.gain,enabled?DUCK:NORMAL,enabled?.12:.32)}
 function pause(){epoch++;if(current)retire(current);current=null;for(const layer of [...layers])dispose(layer)}
 function state(){return {layers:layers.size,sources:[...layers].reduce((n,l)=>n+l.sources.length,0),route:current?.route||null,ducked,desired}}
 return {play,duck,pause,state}
}
