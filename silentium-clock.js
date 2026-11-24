// Monotonic active-time clock. Paused time never contributes to a session.
export const durations=Object.freeze([3,5,10,20]);
export function createContemplationClock(now=()=>performance.now()){
 let total=180000,elapsed=0,anchor=0,status='idle';
 function snapshot(){const e=Math.min(total,elapsed+(status==='running'?Math.max(0,now()-anchor):0));if(status==='running'&&e>=total){elapsed=total;status='complete'}return {status,total,elapsed:e,remaining:total-e,progress:e/total}}
 function start(minutes){if(!durations.includes(minutes))throw Error('Duração inválida.');total=minutes*60000;elapsed=0;anchor=now();status='running';return snapshot()}
 function pause(){const s=snapshot();if(status==='running'){elapsed=s.elapsed;status='paused'}return snapshot()}
 function resume(){if(status==='paused'){anchor=now();status='running'}return snapshot()}
 function reset(){elapsed=0;anchor=0;status='idle';return snapshot()}
 return {start,pause,resume,reset,snapshot}
}
// Optional, gentle visual rhythm. No holding, no requirement to synchronize.
export function breathCue(elapsed){const t=((elapsed%10000)+10000)%10000;return {label:t<4000?'Inspirar suavemente':'Expirar suavemente',scale:t<4000?.88+.24*t/4000:1.12-.24*(t-4000)/6000}}
export function formatRemaining(ms){const seconds=Math.ceil(Math.max(0,ms)/1000);return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')}
