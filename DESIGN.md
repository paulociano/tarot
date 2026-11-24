# ARCANA — edição de ateliê

## Direção anti-slop

Produto: uma mesa de tarot para escolher cartas, estudar símbolos e anotar leituras.
Caráter: contemplativo, pictórico, editorial.
Mundo: pranchas de uma coleção de pintura a óleo, papel antigo, tinta escura e metal envelhecido.
Momentos: a ilustração autoral de A Lua na entrada; a revelação das cartas na mesa.
Assinatura: prancha vertical com legenda de catálogo e moldura estreita, sem cortar a pintura.

## Contrato visual

- Fundo carvão quente #161513, superfícies #201e1b e #2b2823, marfim #e9dfca, texto secundário #bcb2a1, ouro envelhecido #c4a775. A paleta das cartas mantém sua autonomia.
- Cormorant Garamond para títulos, nomes de cartas e marca; Alegreya para prosa e controles. Google Fonts com display swap e Georgia de fallback. As duas famílias são distribuídas sob SIL Open Font License.
- Hierarquia por escala e composição, caixa normal, alinhamento editorial, divisórias finas, margens em múltiplos de 4px. Sem glassmorphism, glows, órbitas animadas, cápsulas repetidas ou fundos de estrelas.
- A Lua é uma prancha da coleção, carregada da própria pasta de cartas. A imagem completa permanece visível. Nenhuma arte é modificada. Cartas ausentes conservam as gravuras provisórias.
- Movimento restrito a entrada única, embaralhamento breve, revelação e feedback de ação. Reduced motion preservado.
- Funções e ordem das seções preservadas. O assistente é local e baseado em regras.

## Redline e evidência

Auditoria baseada no código da versão 276a722: gradientes radiais e estrelas no body; órbitas e flutuação contínua na hero; painéis arredondados repetidos; títulos e labels com tracking excessivo; ícones decorativos na copy; hero genérica centrada em efeitos. Intervenção completa nos nove passes do unslop. Os PNGs foram identificados no repositório, mas a inspeção visual dos pixels não estava disponível antes da edição. A paleta deriva da direção artística aprovada anteriormente, não de uma amostragem das imagens.

Metodologia: Arsenal web-design-engineer / unslop-redline-passes e typographic-composition. Método unslop adaptado de Damir Sokolovsky (@heydamir), https://github.com/heydamir/unslop, CC BY 4.0.

## Revisão: Noite dos Arcanos (solicitação do proprietário)

A direção de ateliê foi rejeitada em favor de uma experiência imersiva, próxima à versão anterior. Preserva-se a tipografia legível e o acabamento das molduras, mas retornam índigo, obsidiana e ouro. O display usa Cinzel Decorative, os títulos Cormorant Garamond e o texto Alegreya. Os fundos são cenas reais extraídas das ilustrações já existentes: Lua, Sacerdotisa, Sol, Mundo e Eremita, com véus escuros para leitura; não são novas pinturas independentes. A abertura retorna ao trio Estrela, Lua e Sol. A virada de carta é uma rotação de 180° de um objeto CSS 3D com duas faces, de duração 960 ms, sem fade substituindo o verso; somente a carta recém-revelada anima, e o estado persistido não reanima. Reduced motion revela imediatamente. Sem dependências novas. A identidade de ateliê deixa de ser a direção vigente.

## Ritual dos sigilos

Cada carta possui um sigilo original determinístico (13 traçados × 6 marcas de selo = 78 combinações), com cor de naipe. A revelação ativa dois anéis em sentidos opostos durante 2,7 s. A mandala agrega somente cartas já reveladas, com uma ligação para cada par; uma nova carta acende o nó e as linhas correspondentes. Inversões orientam o sigilo da mandala em 180°. Sem loops permanentes; reduced motion preserva o estado final. SVG/CSS sem dependências. Os motivos são ficcionais e não representam um alfabeto rúnico histórico.

## Biblioteca interativa
Cada carta do atlas apresenta a pintura na frente e uma ficha de estudo no verso: arcano/naipe, elemento, significados normal e invertido e área simbólica. Hover ou foco por teclado ativa a rotação; clique/toque abre os detalhes completos. A saída do ponteiro restaura a pintura. A mesa de tiragem permanece com cartas fechadas até a seleção.

## Cinematic — ambientes e atmosfera
Portal, Santuário, Biblioteca, Observatório e Grimório recebem pinturas panorâmicas opcionais (16:9). A pintura é o fundo, não contém UI, texto ou sigilos funcionais. Véus contrastantes, troca de camada em 650 ms, parallax limitado a 8/5 px por eixo no modo cinematográfico. Entrada de carta em 420 ms, virada após chegada, sigilos e conexões em seguida. Modo essencial desativa movimento; áudio ambiente sintetizado e opt-in, independente do som de ação. Sem WebGL ou bibliotecas novas. As imagens de carta originais são fallback; não se afirma que as cinco pinturas já existam.

## Experiência cinematográfica única e Grimório
Removido seletor de imersão; cinematográfico permanente, com desligamento de animações e reduced motion preservados. Ícones SVG de traço fino, estado ativo dourado, estado inativo riscado, aria-pressed e tooltip. Grimório usa frequências reais do diário salvo e calendário local; selo exportado contém apenas a geometria dos arcanos.

## Sigilos híbridos
Geometria dos 78 sigilos continua em SVG. A textura pictórica opcional `assets/runes/aureola.png` é um anel alquímico ornamentado transparente, exibido atrás das mandalas sem interferir nas linhas nem na exportação vetorial. O fallback é o desenho vetorial atual. A identidade dos sigilos não depende de raster.

## Jornada e marca
Marca reduzida ao wordmark ARCANA e ao losango existente. Jornada dos 22 arcanos como sequência editorial livre, com navegação direta, progresso reversível e práticas contemplativas; sem bloquear capítulos. A auréola enviada em assets/runes/aureola.png permanece integrada às mandalas.

## Museu
Sala escura, pintura sem bordas, controles discretos e área de zoom rolável. A contemplação oculta o aprofundamento, não a navegação. Navegação por teclado não interfere no seletor nem na rolagem com zoom. Tela cheia opcional e saída nativa. Mantém a sessão de leitura intacta.
