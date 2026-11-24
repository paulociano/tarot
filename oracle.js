import {interpret,respond} from './engine.js';
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
function lensFor(question,topic){const q=norm(question);const ranked=lenses.map(l=>({l,n:l.words.filter(w=>has(q,w)).length})).sort((a,b)=>b.n-a.n);return ranked[0].n?ranked[0].l:lenses.find(l=>l.id===topicLens[topic])||null}
function namedCards(q,cards){return cards.filter(c=>{const full=norm(c.name),short=full.replace(/^(o|a|os|as) /,'');return has(q,full)||has(q,short)})}
function ordinalCards(q,cards){const ord=['primeira','segunda','terceira','quarta','quinta','sexta','setima','oitava','nona','decima'];return cards.filter((c,i)=>has(q,ord[i]+' carta')||has(q,'carta '+(i+1))||has(q,norm(c.position))&&norm(c.position).length>5)}
function selected(q,cards){const named=namedCards(q,cards);return named.length?named:ordinalCards(q,cards)}
function remembered(chat,cards){for(const m of [...chat].reverse()){if(m.role!=='user')continue;const matches=selected(norm(m.text),cards);if(matches.length)return matches}return []}
export function oracleReading(session){
 const r=interpret(session.items,session.spread,session.topic,session.customSpread);if(!r)return null;
 const lens=lensFor(session.question,session.topic);
 const themes=new Map();for(const c of r.cards)for(const t of c.study.themes)themes.set(t,(themes.get(t)||0)+1);
 const common=[...themes].filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([t])=>t);
 const anchor=r.cards[0],end=r.cards.at(-1);const links=[...r.combos].sort((a,b)=>Number(b.relation==='Reforço temático')-Number(a.relation==='Reforço temático')||Number(b.adjacent)-Number(a.adjacent)).slice(0,2);
 const narrative=r.cards.length===1?anchor.name+' concentra a leitura em '+anchor.meaning+'. '+anchor.study.depth:anchor.name+' na posição '+anchor.position+' introduz '+anchor.meaning+'. '+end.name+' em '+end.position+' convida a considerar '+end.meaning+'. '+(common.length?'O fio comum é '+common.join(', ')+'.':'As posições oferecem perspectivas diferentes, não uma sequência inevitável.');
 return {title:lens?.title||'Reflexão aberta',recognized:!!lens,common,narrative,links,practice:lens?.practice||end.action+'.',question:end.study.question,focus:r.focus,reading:r};
}
export function oracleReply(question,session){
 const q=norm(question);const o=oracleReading(session);if(!o)return 'Comece uma tiragem para conversarmos sobre os símbolos.';
 const safe=safetyReply(question,session);if(safe)return safe;
 let cards=selected(q,o.reading.cards);const follow=/\b(ela|ele|essa|esse|isso|dessas|dess(es|a)|aprofund|continue|mais|exemplo|e na pratica)\b/.test(q)||/^(e |como |por que )/.test(q);
 if(!cards.length&&follow)cards=remembered((session.chat||[]).slice(-30),o.reading.cards);
 const lens=lensFor(question,session.topic)||lensFor(session.question,session.topic);
 if(/combina|relac|conex|juntas|sintese/.test(q)&&!(/relacionamento/.test(q)&&!/combina|conex|juntas|sintese/.test(q))){
 const links=cards.length?o.reading.combos.filter(p=>cards.length>1?cards.includes(o.reading.cards[p.i])&&cards.includes(o.reading.cards[p.j]):cards.includes(o.reading.cards[p.i])||cards.includes(o.reading.cards[p.j])).slice(0,4):o.links;
 return links.length?links.map(p=>p.title+' · '+p.relation+'\n'+p.text).join('\n\n')+'\n\n'+(lens?.practice||o.practice):o.narrative+' '+o.question;
 }
 if(/invert|sombra|bloqueio/.test(q)){const chosen=cards.length?cards:o.reading.cards;return chosen.map(c=>c.name+' · '+c.position+'\n'+c.reversed+'. '+(c.isReversed?'Saiu invertida.':'É uma possibilidade de sombra, não a orientação tirada.')+' '+c.study.question).join('\n\n')}
 if(cards.length)return cards.map(c=>c.name+' · '+c.position+(c.isReversed?' (invertida)':'')+'\n'+c.reading+' '+c.study.depth+'\n'+(/conselho|pratica|agir|passo|faco/.test(q)?'Prática: '+c.action+'.':c.study.question)).join('\n\n')+(lens?'\n\n'+lens.practice:'');
 if(/conselho|agir|passo|pratica|faco/.test(q))return o.practice+'\n\n'+o.question;
 if(lens)return 'Perspectiva: '+lens.title+'. '+o.narrative+'\n\n'+lens.practice+'\n\n'+o.question;
 return o.narrative+'\n\n'+o.focus+' '+o.question+'\n\nSe quiser, indique uma carta, posição ou tema específico para aprofundar.';
}

export function safetyReply(question,session){const q=norm(question),o=oracleReading(session);if(!o)return null;
 // Guardrails have priority over card matching and conversational references.
 if(/suicid|me matar|tirar minha vida|autoagress|quero morrer|me machucar|acabar com minha vida/.test(q))return 'Sua segurança importa mais que qualquer leitura. Se estiver em risco imediato, procure uma pessoa de confiança e um serviço de emergência agora. No Brasil, o CVV oferece apoio pelo 188.';
 if(/diagnostico|remedio|tratamento|investir|aposta|processo judicial|gravidez|medicamento|doenca|cura|comprar acao/.test(q))return 'O tarot não determina resultados médicos, jurídicos ou financeiros. Busque dados verificáveis e orientação profissional qualificada. '+o.focus;
 if(/vai acontecer|me ama|vai voltar|prever|certeza|quando vou|quando vai|vai dar certo|futuro garantido/.test(q))return 'As cartas não permitem saber o futuro nem conhecer os sentimentos de outra pessoa. Podemos refletir sobre '+o.title.toLowerCase()+': '+o.practice;

 return null;
}
