// Reflective instruments, not psychological assessments.
export const areas=['Saúde e energia','Relações','Trabalho e propósito','Recursos materiais','Descanso e lazer','Aprendizado','Ambiente e rotina','Sentido e valores'];
export const emotions=[
 {name:'Alegria',color:'#D9BB77',words:['Contentamento','Entusiasmo','Gratidão','Alívio'],question:'O que gostaria de reconhecer ou cultivar neste momento?'},
 {name:'Tristeza',color:'#9EABC9',words:['Saudade','Decepção','Solidão','Desânimo'],question:'De que cuidado ou apoio preciso agora?'},
 {name:'Medo',color:'#C0A7D3',words:['Insegurança','Preocupação','Apreensão','Vulnerabilidade'],question:'Que informação ou apoio tornaria a situação mais clara?'},
 {name:'Raiva',color:'#D39B85',words:['Frustração','Irritação','Indignação','Impaciência'],question:'Que necessidade ou limite merece ser comunicado?'},
 {name:'Surpresa',color:'#B2C5D5',words:['Espanto','Curiosidade','Confusão','Admiração'],question:'O que mudou na minha compreensão da situação?'},
 {name:'Aversão',color:'#ADB993',words:['Incômodo','Rejeição','Desagrado','Repulsa'],question:'O que quero evitar, e por quais razões?'},
 {name:'Serenidade',color:'#C9D1BE',words:['Calma','Confiança','Aceitação','Descanso'],question:'Que condições contribuem para essa sensação?'}
];
export const values=['Autonomia','Cuidado','Criatividade','Curiosidade','Coragem','Equilíbrio','Família','Generosidade','Honestidade','Justiça','Liberdade','Pertencimento','Responsabilidade','Segurança','Simplicidade','Aprendizado','Respeito','Cooperação','Presença','Sustentabilidade','Lealdade','Humildade','Espiritualidade','Estabilidade'];
export const tools=[{id:'wheel',name:'Roda da vida',glyph:'◎',detail:'Observe áreas da sua vida.'},{id:'emotion',name:'Atlas de emoções',glyph:'✧',detail:'Nomeie o que está sentindo.'},{id:'values',name:'Bússola de valores',glyph:'◇',detail:'Reconheça o que importa.'},{id:'choice',name:'Encruzilhada',glyph:'◈',detail:'Explore caminhos concretos.'}];
export const initialDraft=()=>({wheel:{ratings:Array(8).fill(null),note:''},emotion:{selected:[],intensity:5,note:''},values:{selected:[],note:''},choice:{question:'',paths:[{name:'Caminho A',benefit:'',risk:'',evidence:'',step:''},{name:'Caminho B',benefit:'',risk:'',evidence:'',step:''}],note:''}});
export function setRating(ratings,index,value){if(!Array.isArray(ratings)||ratings.length!==8||!Number.isInteger(index)||index<0||index>=8||!(value===null||Number.isInteger(value)&&value>=0&&value<=10))throw Error('Avaliação inválida');return ratings.map((r,i)=>i===index?value:r)}
export function toggleSelection(items,value,allowed,max){if(!Array.isArray(items)||!allowed.includes(value))return [...items];if(items.includes(value))return items.filter(x=>x!==value);return items.length<max?[...items,value]:[...items]}
export function radialPoints(values,radius=105){const total=values.length;return values.map((v,i)=>{const angle=i*2*Math.PI/total-Math.PI/2,r=radius*Math.max(0,Math.min(10,v??0))/10;return [Number((Math.cos(angle)*r).toFixed(2)),Number((Math.sin(angle)*r).toFixed(2))]})}
export function exportReflection(id,d){
 if(id==='wheel')return ['Roda da vida',...areas.map((name,i)=>name+': '+(d.ratings[i]===null?'Não avaliada':d.ratings[i]+'/10')),d.note].join('\n');
 if(id==='emotion')return ['Atlas de emoções','Palavras escolhidas: '+(d.selected.join(', ')||'Nenhuma'),'Intensidade percebida: '+d.intensity+'/10',d.note].join('\n');
 if(id==='values')return ['Bússola de valores',...d.selected.map((v,i)=>(i+1)+'. '+v),d.note].join('\n');
 if(id==='choice')return ['Encruzilhada',d.question,...d.paths.map(p=>[p.name,'Benefícios: '+p.benefit,'Riscos e custos: '+p.risk,'Informações a verificar: '+p.evidence,'Próximo passo reversível: '+p.step].join('\n')),d.note].join('\n\n');
 throw Error('Instrumento desconhecido')
}
