/* Classic Worker: pinned inference runtime, model and phonemizer.
 * Only fixed public editorial narration is posted to this worker.
 * No text is included in network URLs or request bodies.
 */
const ORT='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/';
const PHON='https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/';
const MODEL='https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx';
let engine=null,config=null,busy=false;
const notify=(type,extra={})=>postMessage({type,...extra});
async function resource(url){
 let cache;try{cache=await caches.open('arcana-voice-faber-v1');const hit=await cache.match(url);if(hit)return hit}catch{}
 const response=await fetch(url,{credentials:'omit',referrerPolicy:'no-referrer'});
 if(!response.ok)throw Error('Não foi possível obter o modelo de voz.');
 try{if(cache)await cache.put(url,response.clone())}catch{}
 return response;
}
async function initialize(){
 if(engine)return;
 notify('status',{message:'Preparando o motor neural. Na primeira vez, o modelo tem cerca de 63 MB, além do motor de áudio.'});
 if(typeof ort==='undefined')importScripts(ORT+'ort.wasm.min.js');
 if(typeof createPiperPhonemize==='undefined')importScripts(PHON+'piper_phonemize.js');
 ort.env.wasm.numThreads=1;ort.env.wasm.wasmPaths=ORT;ort.env.wasm.proxy=false;
 config=await (await resource(MODEL+'.json')).json();
 const weights=await resource(MODEL);
 notify('status',{message:'Carregando a voz neural brasileira…'});
 engine=await ort.InferenceSession.create(await weights.arrayBuffer(),{executionProviders:['wasm']});
}
async function synthesize(text){
 let ids;
 const phon=await createPiperPhonemize({locateFile:name=>PHON+name,print:value=>{try{const result=JSON.parse(value);if(Array.isArray(result.phoneme_ids))ids=result.phoneme_ids}catch{}},printErr:()=>{}});
 phon.callMain(['-l',config.espeak.voice,'--input',JSON.stringify([{text}]),'--espeak_data','/espeak-ng-data']);
 if(!ids?.length)throw Error('Não foi possível preparar a pronúncia.');
 const tensor=(values,shape)=>new ort.Tensor('int64',BigInt64Array.from(values.map(BigInt)),shape);
 const feeds={input:tensor(ids,[1,ids.length]),input_lengths:tensor([ids.length],[1]),scales:new ort.Tensor('float32',Float32Array.from([config.inference.noise_scale,Math.min(1.35,(config.inference.length_scale||1)*1.12),config.inference.noise_w]),[3])};
 if(Object.keys(config.speaker_id_map||{}).length)feeds.sid=tensor([0],[1]);
 const result=await engine.run(feeds);const pcm=new Float32Array(result.output.data);
 const rate=config.audio.sample_rate;postMessage({type:'segment',pcm,rate},[pcm.buffer]);
}
self.onmessage=async e=>{
 if(busy||e.data?.type!=='speak')return;
 const parts=e.data.parts;if(!Array.isArray(parts)||!parts.length||parts.length>120||parts.some(p=>typeof p!=='string'||p.length>300))return notify('error',{message:'Texto de narração inválido.'});
 busy=true;try{await initialize();for(let i=0;i<parts.length;i++){notify('progress',{current:i+1,total:parts.length});await synthesize(parts[i])}notify('done')}catch{engine=null;notify('error',{message:'A voz neural não pôde ser carregada neste dispositivo. Verifique a conexão e tente novamente.'})}finally{busy=false}
};
