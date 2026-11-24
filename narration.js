import {splitSpeech} from './voice-script.js';
let worker=null,ctx=null,job=null;
export function neuralAvailable(){return typeof Worker==='function'&&typeof WebAssembly==='object'&&typeof (window.AudioContext||window.webkitAudioContext)==='function'}
export function stopNarration(){const old=job;job=null;if(old){clearTimeout(old.watchdog);for(const node of old.nodes){try{node.stop()}catch{}try{node.disconnect()}catch{}}old.nodes.clear();old.gain.disconnect();if(!old.generated){worker?.terminate();worker=null}old.onState?.('stopped','Narração interrompida.')} }
function finish(state,message){const old=job;if(!old)return;job=null;clearTimeout(old.watchdog);for(const node of old.nodes){try{node.stop()}catch{}try{node.disconnect()}catch{}}old.nodes.clear();old.gain.disconnect();if(state==='error'){worker?.terminate();worker=null}old.onState?.(state,message)}
function renew(){if(!job)return;clearTimeout(job.watchdog);job.watchdog=setTimeout(()=>finish('error','A preparação da voz demorou demais. Tente novamente.'),180000)}
function receive(event){
 if(!job)return;const data=event.data;renew();
 if(data.type==='status'){job.onState('loading',data.message);return}
 if(data.type==='progress'){if(!job.started)job.onState('loading','Preparando narração… '+data.current+' de '+data.total);return}
 if(data.type==='error'){finish('error',data.message);return}
 if(data.type==='done'){job.generated=true;clearTimeout(job.watchdog);if(!job.nodes.size)finish('done','Narração concluída.');return}
 if(data.type!=='segment')return;
 try{
 const current=job;const pcm=data.pcm;if(!(pcm instanceof Float32Array)||!pcm.length||data.rate<8000||data.rate>48000)throw Error('Invalid PCM');
 const buffer=ctx.createBuffer(1,pcm.length,data.rate);buffer.copyToChannel(pcm,0);
 const source=ctx.createBufferSource();source.buffer=buffer;source.connect(current.gain);
 const when=Math.max(ctx.currentTime+.03,current.next);current.next=when+buffer.duration+.22;current.nodes.add(source);
 source.onended=()=>{current.nodes.delete(source);source.disconnect();if(job===current&&current.generated&&!current.nodes.size)finish('done','Narração concluída.')};source.start(when);
 if(!current.started){current.started=true;current.onState('playing','Voz neural ARCANA · português brasileiro.')}
 }catch{finish('error','Não foi possível reproduzir a voz neural.')}
}
export async function narrate(text,onState){
 stopNarration();if(!neuralAvailable()){onState('error','Este navegador não suporta a voz neural.');return false}
 const parts=splitSpeech(text);if(!parts.length||parts.length>120){onState('error','A leitura excede o limite de narração.');return false}
 try{
 ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
 const gain=ctx.createGain();gain.gain.value=.84;gain.connect(ctx.destination);
 const current={onState,nodes:new Set(),gain,next:0,started:false,generated:false,watchdog:null};job=current;
 onState('loading','Preparando a voz neural ARCANA…');renew();await ctx.resume();if(job!==current)return false;
 if(!worker){worker=new Worker(new URL('./voice-worker.js',import.meta.url));worker.onmessage=receive;worker.onerror=()=>finish('error','O motor neural não pôde ser iniciado. Verifique sua conexão.')}
 worker.postMessage({type:'speak',parts});return true;
 }catch{finish('error','Não foi possível iniciar a narração neural.');return false}
}
