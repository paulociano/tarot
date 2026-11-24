import {deck} from './deck.js';
import {optimizedArt} from './assets/optimized/manifest.js';
let installPrompt=null,downloading=false;
const artCache='arcana-art-v1';
const $=id=>document.getElementById(id);
function note(text){$('pwa-status').textContent=text}
function online(){const offline=!navigator.onLine;$('network-indicator').hidden=!offline;if(offline)note('Sem conexão. As funções locais continuam disponíveis; pinturas não armazenadas podem aparecer como sigilos.');}
async function prepareArt(){
 if(downloading)return;
 if(!optimizedArt){note('O pacote completo exige a publicação WebP otimizada. As pinturas visitadas são armazenadas conforme a capacidade do navegador.');return}
 if(!navigator.onLine){note('Conecte-se à internet para preparar as pinturas.');return}
 if(!('caches' in window)){note('O navegador não oferece armazenamento offline.');return}
 downloading=true;const button=$('offline-art');button.disabled=true;
 const paths=[...deck.map(c=>'./assets/optimized/'+c.id+'-420.webp'),'./assets/optimized/back-420.webp','./assets/optimized/aureola.webp',...['portal','santuario','biblioteca','observatorio','grimorio'].map(n=>'./assets/optimized/scenes/'+n+'.webp')];
 let count=0,failed=0;
 try{const cache=await caches.open(artCache);for(let i=0;i<paths.length;i+=3){await Promise.all(paths.slice(i,i+3).map(async path=>{try{const url=new URL(path,location.href);let response=await cache.match(url.href);if(!response){response=await fetch(url.href);if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw Error('invalid image');await cache.put(url.href,response)}count++}catch{failed++}}));note('Preparando pinturas: '+count+'/'+paths.length)}
 note(failed?'Pacote parcial: '+count+' de '+paths.length+' pinturas disponíveis. Você pode tentar novamente.':'Pacote offline pronto: 79 cartas/verso, cinco ambientes e a auréola em resolução reduzida. O navegador pode liberar esse armazenamento.');
 }catch{note('Não foi possível armazenar o pacote neste navegador.')}
 finally{downloading=false;button.disabled=false}
}
export function initPwa(){
 $('install-app').onclick=async()=>{if(installPrompt){const p=installPrompt;installPrompt=null;try{await p.prompt();const r=await p.userChoice;note(r.outcome==='accepted'?'Instalação solicitada.':'Instalação não realizada.')}catch{note('Use o menu do navegador para instalar.')}}else note('No menu do navegador, procure Instalar aplicativo ou Adicionar à tela de início. No Safari do iPhone, use Compartilhar → Adicionar à Tela de Início.')};
 $('offline-art').onclick=prepareArt;
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event});
 window.addEventListener('appinstalled',()=>{installPrompt=null;note('ARCANA instalado.');$('install-app').hidden=true});
 if(matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)$('install-app').hidden=true;
 window.addEventListener('online',()=>{online();note('Conexão restabelecida.')});window.addEventListener('offline',online);online();
 if(!('serviceWorker' in navigator)||!window.isSecureContext){$('offline-art').disabled=true;note('Instalação offline indisponível neste navegador ou contexto.');return}
 navigator.serviceWorker.register('./sw.js').then(reg=>{
  function updateNotice(){if(reg.waiting)note('Nova versão disponível. Feche todas as abas e reabra ARCANA para atualizar.')}
  updateNotice();reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)updateNotice()})});
  navigator.serviceWorker.ready.then(()=>{if(navigator.onLine&&!reg.waiting)note('Aplicação preparada para abrir offline após esta visita.')});
 }).catch(()=>note('Não foi possível preparar o modo offline. A versão online continua disponível.'));
}
initPwa();
