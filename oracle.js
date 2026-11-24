import {interpret} from './engine.js';
const norm=s=>String(s??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const has=(s,w)=>(' '+s+' ').includes(' '+w+' ');
const lenses=[
 {id:'decision',words:['escolha','escolher','decisao','decidir','mudar','mudanca','caminho','opcao','alternativa'],title:'Escolhas e caminhos',practice:'Compare duas alternativas reais, seus custos e um pequeno teste reversível.'},
 {id:'limits',words:['limite','limites','medo','conflito','pressao','controle','sobrecarga'],title:'Limites e segurança',practice:'Nomeie o que está sob seu controle e um limite que protege seu bem-estar.'},
 {id:'bond',words:['amor','relacionamento','relacionamentos','vinculo','parceria','conversa','casamento','familia'],title:'Vínculos e comunicação',practice:'Separe o que você sente do que sabe; formule uma pergunta aberta ou um pedido concreto.'},
 {id:'work',words:['trabalho','carreira','emprego','projeto','negocio','profissao','proposito'],title:'Trabalho e propósito',practice:'Identifique um recurso disponível e uma ação observável que possa ser avaliada depois.'},
 {id:'resources',words:['dinheiro','financas','recursos','orcamento','gastos','dividas'],title:'Recursos e escolhas materiais',practice:'Verifique os números e as alternativas antes de decidir; não use as cartas como recomendação financeira.'},
 {id:'change',words:['fim','terminar','recomecar','perda','mudanca','transicao','renovacao'],title:'Transição e renovação',practice:'Diferencie o que terminou daquilo que ainda pode ser ajustado; reconheça o apoio disponível.'},
 {id:'growth',words:['autoconhecimento','crescimento','habito','aprender','reflexao','sentido'],title:'Crescimento pessoal',practice:'Escolha uma prática pequena, observe seu efeito e revise sem se condenar.'}
];
const topicLens={love:'bond',work:'work',money:'resources',growth:'growth'};
// Editorial routing is deliberately deterministic, based only on the drawn cards.
const lensThemes={
 decision:['escolha','autonomia','mudança','ação','planejamento','valores'],
 limits:['limites','autonomia','cuidado','responsabilidade','pausa'],
 bond:['vínculo','reciprocidade','pertencimento','cuidado','valores'],
 work:['ação','recursos','planejamento','conhecimento','estrutura','crescimento'],
 resources:['recursos','estrutura','responsabilidade','planejamento','limites'],
 change:['mudança','renovação','começo','conclusão','pausa'],
 growth:['crescimento','conhecimento','aprendizado','cuidado','intuição','autonomia']
};
function lensMatch(question,topic){const q=norm(question);const ranked=lenses.map(l=>({l,n:l.words.filter(w=>has(q,w)).length})).sort((a,b)=>b.n-a.n);return ranked[0].n?{lens:ranked[0].l,source:'question'}:{lens:lenses.find(l=>l.id===topicLens[topic])||null,source:topicLens[topic]?'topic':'open'}}
function lensFor(question,topic){return lensMatch(question,topic).lens}
const themeScore=(card,lens)=>lens?card.study.themes.filter(t=>(lensThemes[lens.id]||[]).includes(t)).length:0;
const sentence=s=>String(s||'').trim().replace(/[.!?]+$/,'')+'.';
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const cardLabel=c=>c.name+' · '+c.position+(c.isReversed?' (invertida)':'');
function namedCards(q,cards){const exact=cards.filter(c=>has(q,norm(c.name)));return cards.filter(c=>exact.includes(c)||has(q,norm(c.name).replace(/^(o|a|os|as) /,'')))}
function ordinalCards(q,cards){const ord=['primeira','segunda','terceira','quarta','quinta','sexta','setima','oitava','nona','decima'];return cards.filter((c,i)=>has(q,ord[i]+' carta')||has(q,'carta '+(i+1))||has(q,norm(c.position))&&norm(c.position).length>5||i===cards.length-1&&has(q,'ultima carta'))}
function selected(q,cards){const named=namedCards(q,cards),ordinal=ordinalCards(q,cards);return cards.filter(c=>named.includes(c)||ordinal.includes(c))}
function remembered(chat,cards){for(const m of [...chat].reverse()){if(m.role!=='user')continue;const matches=selected(norm(m.text),cards);if(matches.length)return matches}return []}
function linksFor(r,lens){return [...r.combos].sort((a,b)=>{
 const score=p=>Number(p.relation==='Reforço temático')*4+Number(p.relation==='Tensão e revisão')*2+Number(p.adjacent)*2+themeScore(r.cards[p.i],lens)+themeScore(r.cards[p.j],lens);
 return score(b)-score(a)||a.i-b.i||a.j-b.j
}).slice(0,2)}
function connective(a,b){const shared=a.study.themes.filter(t=>b.study.themes.includes(t));if(a.isReversed||b.isReversed)return 'Observe a diferença entre '+a.meaning+' e '+b.meaning+'; a inversão pede revisão, não um desfecho negativo.';if(shared.length)return 'O tema '+shared.join(' e ')+' aproxima as duas posições: '+a.study.archetype+' e '+b.study.archetype+' são modos diferentes de explorá-lo.';return 'Compare '+a.meaning+' com '+b.meaning+' sem presumir que uma carta cause a outra.'}
function synthesis(cards,spread,common){
 const first=cards[0],last=cards.at(-1);
 if(cards.length===1)return first.name+' concentra a reflexão em '+first.meaning+'. '+first.study.depth+(first.isReversed?' A orientação invertida torna especialmente importante examinar o que merece revisão.':'');
 if(spread==='choice'&&cards.length===4){const a=cards[1],b=cards[2];return first.name+' na posição '+first.position+' situa a questão em '+first.meaning+'. '+a.name+' no '+a.position+' oferece '+a.meaning+', enquanto '+b.name+' no '+b.position+' propõe examinar '+b.meaning+'. '+last.name+' em '+last.position+' ajuda a comparar essas possibilidades: '+last.meaning+'. Nenhuma das alternativas é uma previsão de resultado.'}
 const middle=cards.slice(1,-1);
 const start=first.name+' na posição '+first.position+' abre a leitura com '+first.meaning+'.';
 const bridge=middle.length===1?middle[0].name+' em '+middle[0].position+' desloca o olhar para '+middle[0].meaning+'.':middle.length? 'Entre as posições, '+middle.map(c=>c.name+' ('+c.position+'): '+c.meaning).join('; ')+'.':'';
 const end=last.name+' em '+last.position+' convida a examinar '+last.meaning+'.';
 return [start,bridge,end,common.length?'O tema que atravessa mais de uma carta é '+common.join(', ')+'.':'As posições são perspectivas complementares, não etapas inevitáveis de um acontecimento.'].filter(Boolean).join(' ');
}
export function oracleReading(session){
 const r=interpret(session.items,session.spread,session.topic,session.customSpread);if(!r)return null;
 const {lens,source}=lensMatch(session.question,session.topic);
 const themes=new Map();for(const c of r.cards)for(const t of c.study.themes)themes.set(t,(themes.get(t)||0)+1);
 const common=[...themes].filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t])=>t);
 const end=r.cards.at(-1),focusCard=[...r.cards].reverse().sort((a,b)=>themeScore(b,lens)-themeScore(a,lens))[0];
 const links=linksFor(r,lens);
 const threads=links.map(p=>({title:p.title,text:connective(r.cards[p.i],r.cards[p.j])}));
 const practice='A partir de '+focusCard.name+', '+sentence(focusCard.action)+(lens?' '+lens.practice:'');
 return {title:lens?.title||'Reflexão aberta',recognized:!!lens,source,common,narrative:synthesis(r.cards,session.spread,common),links,threads,practice,question:focusCard.study.question,focus:r.focus,reading:r};
}
const followUp=q=>/\b(ela|ele|essa|esse|isso|dessas|desses|continue|mais|exemplo)\b/.test(q)||/^(e |como |por que )/.test(q)||/\baprofund[a-z]*\b/.test(q);
export function oracleReply(question,session){
 const q=norm(question),o=oracleReading(session);if(!o)return 'Comece uma tiragem para conversarmos sobre os símbolos.';
 const safe=safetyReply(question,session,o);if(safe)return safe;
 const all=o.reading.cards;
 let cards=selected(q,all);if(!cards.length&&followUp(q))cards=remembered((session.chat||[]).slice(-30),all);
 const lens=lensFor(question,'general')||lensFor(session.question,session.topic);
 const combination=/\b(combin[a-z]*|conex[a-z]*|juntas|juntos|sintese|compar[a-z]*)\b/.test(q)||/\brelacao\b/.test(q)&&cards.length>1;
 if(combination){
 const links=cards.length?o.reading.combos.filter(p=>cards.length>1?cards.includes(all[p.i])&&cards.includes(all[p.j]):cards.includes(all[p.i])||cards.includes(all[p.j])).slice(0,4):o.links;
 return links.length?links.map(p=>p.title+' · '+p.relation+'\n'+connective(all[p.i],all[p.j])+'\n'+p.text).join('\n\n')+'\n\n'+(lens?.practice||o.practice):'Nesta tiragem, '+all[0].name+' é o único arcano. '+all[0].study.depth+'\n\n'+all[0].study.question;
 }
 if(/\b(invert[a-z]*|sombra[s]?|bloqueio[s]?)\b/.test(q)){const chosen=cards.length?cards:all;return chosen.map(c=>cardLabel(c)+'\n'+cap(sentence(c.reversed))+' '+(c.isReversed?'Saiu invertida; investigue essa possibilidade sem tratá-la como certeza.':'É uma possibilidade de sombra, não a orientação tirada.')+'\n'+c.study.question).join('\n\n')}
 if(/\b(conselho[s]?|pratic[a-z]*|agir|passo[s]?|faco|exercicio[s]?)\b/.test(q)){
 const chosen=cards.length?cards:[...all].reverse().sort((a,b)=>themeScore(b,lens)-themeScore(a,lens)).slice(0,1);
 return chosen.map(c=>cardLabel(c)+'\n'+cap(sentence(c.action))+'\n'+c.study.question).join('\n\n')+(lens?'\n\n'+lens.practice:'');
 }
 if(cards.length)return cards.map(c=>cardLabel(c)+'\n'+c.reading+' '+c.study.depth+'\n'+c.study.question).join('\n\n')+(lens?'\n\n'+lens.practice:'');
 if(lens){const relevant=[...all].sort((a,b)=>themeScore(b,lens)-themeScore(a,lens))[0];return 'Para refletir sobre '+lens.title.toLowerCase()+', observe '+relevant.name+' na posição '+relevant.position+': '+relevant.meaning+'. '+relevant.study.depth+'\n\n'+lens.practice+'\n\n'+relevant.study.question}
 return o.narrative+'\n\n'+o.focus+' '+o.question+'\n\nSe quiser, indique uma carta, posição ou tema específico para aprofundar.';
}
export function safetyReply(question,session,reading){
 const q=norm(question),o=reading||oracleReading(session);if(!o)return null;
 if(/suicid|me matar|tirar minha vida|autoagress|quero morrer|me machucar|acabar com minha vida|nao quero mais viver/.test(q))return 'Sua segurança importa mais que qualquer leitura. Se estiver em risco imediato, procure uma pessoa de confiança e um serviço de emergência agora. No Brasil, o CVV oferece apoio pelo 188.';
 if(/diagnostico|remedio|tratamento|investir|aposta|processo judicial|gravidez|medicamento|doenca|cura|comprar acao/.test(q))return 'O tarot não determina resultados médicos, jurídicos ou financeiros. Busque dados verificáveis e orientação profissional qualificada. '+o.focus;
 if(/vai acontecer|me ama|vai voltar|prever|certeza|quando vou|quando vai|vai dar certo|futuro garantido|esta me traindo|vou morrer/.test(q))return 'As cartas não permitem saber o futuro nem conhecer os sentimentos de outra pessoa. Podemos refletir sobre '+o.title.toLowerCase()+': '+o.practice;
 return null;
}
