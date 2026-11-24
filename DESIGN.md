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


## Proteção e compartilhamento
Museu removido por redundância. A biblioteca permanece interativa. Proteção de superfície por eventos e CSS sem bloquear atalhos, seleção de textos ou navegação. Exportação vetorial autoral com selo e identificação das cartas, sem raster ou conteúdo pessoal. Não constitui DRM.

## Voz ARCANA
Narração neural pt-BR sob demanda, ritmo desacelerado em 12% no length scale, pausas entre frases e ducking da trilha. A voz não recita anotações privadas. Sem voz nativa. A direção sonora privilegia clareza e silêncio, não efeitos de eco sobre a fala.

## Continuidade sensorial
Cada sala possui assinatura harmônica discreta. Crossfade e panorama de baixa intensidade; a voz tem prioridade. Trocas de cenários não devem piscar ou deixar o fundo vazio durante a carga. Pulso final da mandala como confirmação breve, sem partículas ou animação infinita adicional. A paleta, pinturas e controles existentes permanecem.

## Trilha final
Cinco composições Suno fornecidas pelo autor, preservadas nos caminhos originais em assets. Ganho de 15% no barramento musical (teto 20%), 4% durante narração; crossfade de 1,8 s. O ícone discreto de áudio ambiente continua sendo o único controle. A trilha é secundária à voz e não inicia automaticamente.

## Universum
Tese visual: o Portal é um instrumento armilar habitável, não um catálogo de widgets. Cinco câmaras reais distribuem-se em um diagrama orbital de SVG e links HTML, com alternativa de navegação linear para toque e teclado. O hero mantém as pinturas e o acesso direto à tiragem. Identidade obsidiana/índigo/ametista/ouro/marfim preservada. O Ateliê começa como uma mesa de criação geométrica em duas colunas, com prévia autoral e controles semânticos; em telas pequenas, composição e controles empilham. Não usar pinturas exportáveis nem prometer significado sobrenatural dos sigilos. Sem novas bibliotecas ou autoplay.

## Astrarium
Instrumento circular em latão visual/indigo com escala de fase, calendário de discos lunares calculados e mapa de longitudes em anéis separados (não escala de distância). Reutiliza pintura e trilha do Observatório. Números e eventos possuem equivalentes textuais acessíveis, não dependem de cor nem do SVG. A navegação temporal é explícita, sem simular influência lunar ou previsões pessoais.

## Oráculos ancestrais
A seleção rúnica utiliza pedras de obsidiana, com símbolo oculto até a escolha, SVG preciso e texto acessível; o I Ching utiliza três moedas, seis linhas que se acumulam da base ao topo, marcação de mutações e figuras em paralelo. Texturas opcionais de autoria ARCANA são somente suportes materiais; a notação permanece vetorial. Não confundir os sigilos autorais do tarot com o Futhark histórico.

## Silentium
Câmara sem exigência de interação contínua. Um disco de luz pictórico em anéis calibrados é a assinatura visual; expansão/contração só na prática respiratória escolhida, sem retenção e com alternativa estática/reduced motion. Tempo restante e fase são textuais. A contemplação de pintura substitui o disco, sem animação adicional. Encerramento não confere pontos ou recompensa. Seis câmaras no Portal, novo ponto em órbita. Reutiliza música do Observatório em 15% e ducking 4%; pintura própria opcional com fallback.

## Speculum
Sete câmaras em constelação regular. A Câmara dos Espelhos usa diagramas SVG em vez de placares: roda de áreas somente desenha o polígono quando todas estão avaliadas, atlas destaca famílias escolhidas, bússola numerada, duas portas para alternativas. Todos têm equivalentes textuais, controles acessíveis e rascunho independente. Não inferir estado psicológico nem prescrever decisões. Reutiliza a trilha Grimório e recebe cenário opcional.

## Onirium
Oito câmaras. Atlas onírico como constelação pessoal de etiquetas explícitas, com conexões somente por sonhos compartilhados, números e lista equivalente. Rascunho em sessão, salvamento explícito e privacidade informada. Perguntas de associação pessoal, não dicionário de significados universais. Arte e música do Grimório como fallback; cenário próprio opcional.

## Universum pessoal
O coração do Portal abre a constelação pessoal; acesso linear também no Grimório e diretório. O diagrama conecta origens de experiências com temas em comum, não presume influência ou progresso pessoal. Lista textual é a alternativa acessível e permite recuperar arte paramétrica. Sem nova pintura, compartilhando atmosfera do Grimório.
