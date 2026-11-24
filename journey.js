import {deck} from './deck.js';
const chapters=[
  [
    "O primeiro passo",
    "O Louco abre a narrativa sem mapa completo. Antes de buscar uma resposta definitiva, reconheça a curiosidade que o colocou em movimento.",
    "Escolha uma experiência pequena que possa iniciar com cuidado."
  ],
  [
    "A descoberta dos recursos",
    "Depois da abertura do Louco, o Mago introduz a capacidade de transformar intenção em gesto. O começo ganha ferramentas.",
    "Identifique três recursos que já estão ao seu alcance."
  ],
  [
    "O mundo interior",
    "A Sacerdotisa interrompe a ação para ouvir o que ainda não foi compreendido. Nem todo silêncio é ausência de conhecimento.",
    "Anote uma pergunta que ainda não precisa responder."
  ],
  [
    "O que floresce",
    "A Imperatriz mostra que criar também significa cultivar condições para o crescimento, sem exigir resultados imediatos.",
    "Escolha algo que merece atenção regular."
  ],
  [
    "A forma e o limite",
    "O Imperador oferece estrutura ao que cresceu. Um limite pode proteger a criação sem sufocá-la.",
    "Defina uma regra que ajude a preservar sua energia."
  ],
  [
    "O conhecimento recebido",
    "O Hierofante representa o encontro com a tradição e as comunidades que ensinam. Aprender inclui revisar o que se recebe.",
    "Nomeie um princípio que escolhe manter e outro que deseja investigar."
  ],
  [
    "A escolha consciente",
    "Os Enamorados introduzem o momento de distinguir desejo, compromisso e valores. Escolher é reconhecer aquilo que importa.",
    "Escreva dois valores que orientam uma escolha atual."
  ],
  [
    "O movimento dirigido",
    "O Carro transforma forças distintas em direção. A vontade encontra o desafio de sustentar um percurso.",
    "Defina um objetivo observável para o próximo passo."
  ],
  [
    "A coragem gentil",
    "A Força ensina que a firmeza pode coexistir com a sensibilidade. Dominar um impulso não exige violência.",
    "Imagine uma resposta firme e respeitosa a uma tensão cotidiana."
  ],
  [
    "A lanterna",
    "O Eremita abre um intervalo de recolhimento. O discernimento cresce quando o ruído diminui.",
    "Reserve alguns minutos para observar uma questão sem distrações."
  ],
  [
    "A mudança de ciclo",
    "A Roda da Fortuna lembra que o percurso inclui circunstâncias não escolhidas. Adaptar-se é diferente de desistir.",
    "Divida uma situação em fatores controláveis e não controláveis."
  ],
  [
    "A medida",
    "A Justiça convida a avaliar escolhas com proporcionalidade e atenção às consequências.",
    "Compare uma impressão sua com os fatos disponíveis."
  ],
  [
    "O olhar invertido",
    "O Enforcado suspende a marcha. Outra perspectiva pode revelar uma possibilidade que a pressa escondia.",
    "Reformule uma questão a partir de outro ponto de vista."
  ],
  [
    "A passagem",
    "A Morte simboliza o encerramento de formas que já não servem. A transformação abre espaço sem anunciar acontecimentos inevitáveis.",
    "Identifique um hábito ou etapa que merece conclusão."
  ],
  [
    "A arte da mistura",
    "A Temperança integra diferenças e procura um ritmo sustentável depois da mudança.",
    "Experimente combinar duas necessidades aparentemente opostas."
  ],
  [
    "As correntes",
    "O Diabo revela condicionamentos e a tensão entre desejo e autonomia. Reconhecer um padrão permite examinar alternativas.",
    "Observe uma escolha que costuma fazer automaticamente."
  ],
  [
    "O que se rompe",
    "A Torre questiona estruturas que pareciam certas. A ruptura simbólica convida a reconstruir com critérios mais sólidos.",
    "Identifique uma hipótese que merece ser verificada."
  ],
  [
    "A luz distante",
    "A Estrela recupera a possibilidade de esperança após a desorganização. Renovação pode começar com um gesto modesto.",
    "Faça algo concreto que ajude a restaurar sua confiança."
  ],
  [
    "A travessia noturna",
    "A Lua convida a reconhecer a ambiguidade e distinguir imaginação de evidência. Nem toda sensação oferece uma resposta.",
    "Separe o que sabe do que imagina sobre uma questão."
  ],
  [
    "O dia que nasce",
    "O Sol torna visível o que pode ser celebrado e compreendido. Clareza não exige negar dificuldades.",
    "Reconheça algo que funciona e merece ser preservado."
  ],
  [
    "O chamado",
    "O Julgamento representa revisão e aprendizado. É possível reconhecer erros sem reduzir a própria identidade a eles.",
    "Escreva um aprendizado que quer levar adiante."
  ],
  [
    "O círculo completo",
    "O Mundo integra o percurso. A conclusão não é uma obrigação de perfeição: é espaço para reconhecer a experiência e recomeçar.",
    "Nomeie uma transformação que percebe e uma nova pergunta que permanece."
  ]
];
export const journeyCards=deck.filter(c=>c.arcana==='Maior').map((c,i)=>({id:c.id,title:chapters[i][0],story:chapters[i][1],practice:chapters[i][2]}));
export function journeyProgress(value){const ids=new Set(journeyCards.map(c=>c.id));return Array.isArray(value)?[...new Set(value.filter(id=>ids.has(id)))]:[]}
export function journeyResume(value){const completed=new Set(journeyProgress(value));const first=journeyCards.findIndex(c=>!completed.has(c.id));return first<0?journeyCards.length-1:first}
export function toggleChapter(value,id){const completed=journeyProgress(value);if(!journeyCards.some(c=>c.id===id))return completed;return completed.includes(id)?completed.filter(x=>x!==id):[...completed,id]}
