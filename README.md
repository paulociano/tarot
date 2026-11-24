# ARCANA · Tarot surrealista

[**Acessar a aplicação**](https://paulociano.github.io/tarot/)

ARCANA é uma experiência imersiva de tarot em português, inspirada na tradição Rider-Waite-Smith, com 78 ilustrações autorais de surrealismo onírico e um verso compartilhado. A direção visual reúne pintura a óleo, arquitetura impossível, índigo, ouro antigo e marfim.

## Experiência

- Biblioteca interativa: passe o mouse ou use o teclado para virar as cartas e consultar significados e características. Clique ou toque para abrir o estudo completo.
- Sete modalidades de tiragem, escolha intuitiva, sorteio automático ou registro de cartas físicas, com inversões opcionais.
- Viradas tridimensionais, 78 sigilos autorais animados e mandala progressiva das cartas reveladas.
- Interpretação por posição, orientação, elementos e combinações; carta do dia, favoritos, diário, exportação JSON e retomada de sessões.
- Controles de som e movimento, preferência por movimento reduzido e layout responsivo.

O assistente utiliza regras interpretativas locais, não IA generativa. Tarot é uma ferramenta de reflexão, não previsão nem aconselhamento profissional. Sessões, diário e favoritos são armazenados no navegador, sem sincronização entre dispositivos.

## Projeto

HTML, CSS, JavaScript ES modules e SVG, sem framework ou backend. As 79 imagens originais estão em `assets/cards/`. `deck.js` contém os significados e a iconografia; `engine.js` implementa as leituras e `runes.js` os sigilos. Consulte `DESIGN.md` para identidade visual e `AUDIT.md` para auditoria técnica.

## Desenvolvimento e testes

Requer Node.js 22 para testes. Sirva a raiz com `python -m http.server 8000` e acesse http://localhost:8000/.

- `npm test`: testes de domínio.
- `npm install --no-save playwright@1.56.1`, `npx playwright install chromium` e `node browser/smoke.mjs`: testes de navegador, incluindo desktop, mobile, teclado e viradas.
- GitHub Actions executa as verificações a cada atualização da branch main.

## Imagens e publicação

Os PNGs originais são preservados. A aplicação aceita também WebP, JPG e JPEG. Para gerar derivados responsivos, execute `python -m pip install Pillow==11.3.0` e `python scripts/optimize-art.py`. O workflow **Prepare optimized ARCANA artwork** produz o pacote; extraia em `assets/optimized/` e faça commit para habilitar os derivados. Sem eles, são usados os originais.

Publicação via GitHub Pages: **Settings → Pages → Source → GitHub Actions**. O workflow Test ARCANA gera WebPs, testa a versão otimizada, prepara o site e publica automaticamente quando a origem de Pages é GitHub Actions. Enquanto a origem for Deploy from a branch, a versão PNG existente permanece funcional e o workflow produz o artefato otimizado sem alterar a configuração.

## ARCANA 3 — Fundação
Backup do diário versionado, importação de JSON validada (inclusive formato antigo), deduplicação por ID e alerta de gravação local. A revelação espera o evento de conclusão da animação e respeita a preferência de movimento. A navegação por teclado mantém a rota ao saltar para o conteúdo.

### Release otimizado
O workflow Test ARCANA gera 158 WebPs, verifica o uso efetivo de WebP no Chromium, aplica um limite de tamanho de 50% dos originais e prepara `dist/`. A publicação depende da origem GitHub Actions configurada no Pages. O workflow separado de otimização continua disponível para gerar apenas os derivados.

## ARCANA Cinematic
Cinco ambientes panorâmicos opcionais em `assets/scenes/` (consulte o README dessa pasta). Experiência Cinematográfica única; parallax discreto, entrada de carta coordenada à virada, ambientação sonora procedural opcional e desligada por padrão. A preferência de movimento reduzido mantém toda a funcionalidade. Os fundos existentes continuam funcionando enquanto as pinturas panorâmicas estiverem ausentes.

## Conhecimento dos Arcanos
As 78 cartas possuem arquétipo editorial, aprofundamento, temas e pergunta reflexiva. O laboratório permite comparar duas ou três cartas, com inversões, relações temáticas, eco numérico e mandala, sem modificar a sessão de tiragem. Dez modalidades de tiragem estão disponíveis. Interpretações são autorais, contextuais e não preditivas; não há IA generativa nesta fase.

## Oráculo ARCANA — interpretação contextual local
O Oráculo utiliza temas reconhecidos por palavras-chave, posição, orientação, estudos dos arcanos e relações entre cartas. A síntese distingue o contexto da pergunta de fatos: não faz previsões e não infere sentimentos de terceiros. A conversa retoma referências recentes a cartas e posições; não é um modelo generativo. A narração neural é opcional e usa Piper Faber pt-BR via ONNX Runtime no dispositivo; a voz nativa foi removida. Se indisponível, o texto permanece acessível. Não são enviadas perguntas ou leituras a serviços de IA. Uma integração generativa futura exige backend, consentimento, controle de acesso/custos e configuração segura de credenciais no servidor.

## Grimório pessoal
Histórico visual, contagens de cartas, arcanos recorrentes, calendário, busca e filtros por área, mês e dia. Exportação de selos SVG sem incluir pergunta ou anotação. Os controles de áudio ambiente, sons de interação e animações são ícones acessíveis no cabeçalho. A experiência cinematográfica é única, respeitando a preferência por movimento reduzido. Dados continuam locais, com backup JSON; IndexedDB e sincronização não foram implementados nesta etapa.

## ARCANA Everywhere (PWA)
Manifest, ícones PNG próprios, instalação pelo navegador, shell local via Service Worker e cache limitado de pinturas visitadas. O botão Preparar pinturas offline baixa sob demanda os 79 derivados de 420px e os cinco cenários, quando a publicação WebP está habilitada; no modo legado não baixa os 245 MB de originais automaticamente. Leituras, oráculo local, biblioteca e diário continuam disponíveis sem rede após preparar o shell. Fontes remotas e pinturas não armazenadas podem usar fallbacks. Os dados pessoais continuam no armazenamento local, sujeitos à limpeza do navegador. Não há sincronização nem aplicativo de loja. A versão em espera ativa ao fechar todas as abas. O build Actions carimba a versão do shell pelo hash do conteúdo; em publicação por branch, alterar VERSION em sw.js a cada mudança de shell. O cache de arte é separado; incrementar a versão do cache ao substituir pinturas. `assets/runes/aureola.png` é um ornamento opcional, não substitui sigilos SVG.

## Jornada do Louco
Percurso autoral de 22 capítulos, com estudo, contemplação, práticas e progresso local. Acesse pela página inicial ou pela Biblioteca. Funciona offline depois de preparar o shell; as pinturas não armazenadas usam o fallback vetorial. O estudo não altera a tiragem em andamento. O progresso é separado do backup do diário. O logotipo no cabeçalho exibe somente ARCANA.


## Arquiteto de Rituais
Crie até 50 modelos locais de uma a dez cartas, com nome, títulos, propósitos e disposição em grade, linha ou círculo. Acesse pelo preparo da tiragem (`#architect`). Modelos podem ser editados ou excluídos sem alterar as leituras existentes: cada leitura personalizada guarda a sua própria definição validada, inclusive no backup do Grimório. O modelo reutilizável fica no armazenamento local; o backup do diário inclui as definições das leituras, não a biblioteca de modelos. Em telas pequenas, a geometria se adapta para grade. Funciona offline após a atualização do shell.

## Proteção de imagens e compartilhamento
O Baralho concentra a consulta às pinturas. A rota antiga #museum redireciona ao Baralho. Arraste e menu de contexto são bloqueados nas superfícies de arte, com restrição de long press quando suportada. Isso é uma barreira de interface, não DRM: imagens públicas podem ser recuperadas por ferramentas do navegador, cache, URL, GitHub ou captura de tela. Os originais permanecem preservados. Exportação de composição simbólica em SVG usa somente sigilos, nomes e orientações das cartas; nenhuma pintura, pergunta ou anotação é incorporada.

## Voz neural ARCANA
Piper Faber medium pt-BR (modelo v1.0.0, dataset CC0), ONNX Runtime Web 1.17.3 e piper-wasm 1.0.0, carregados sob demanda em um Worker. O modelo pesa cerca de 63 MB, além dos binários e dados de pronúncia. A voz lê a narrativa editorial das cartas, não perguntas, chats, anotações ou nomes de posições personalizados. A inferência não usa uma API de fala; CDNs e Hugging Face recebem as solicitações dos recursos públicos. O modelo é armazenado quando o navegador permite, mas os recursos externos podem exigir conexão em usos posteriores. O áudio é sintetizado por segmentos, reproduzido em Web Audio, com pausas, cancelamento e redução da ambientação. Sem fallback robótico. A qualidade perceptiva e compatibilidade em dispositivos físicos exigem testes. A dependência externa é pinada por versão; recomenda-se auto-hospedagem dos binários para controle total de supply chain e offline. [Modelo e licença](https://huggingface.co/rhasspy/piper-voices/blob/v1.0.0/pt/pt_BR/faber/medium/MODEL_CARD).

O teste de navegador usa uma fixture PCM controlada para verificar reprodução, cancelamento e finalização sem baixar o modelo. Isso não comprova a qualidade da voz real nem a disponibilidade dos CDNs.


## Cofre portátil ARCANA
O Oráculo permanece exclusivamente local; o piloto generativo foi retirado. O cofre criptografado reúne diário salvo, favoritos, progresso da Jornada do Louco e modelos personalizados. Usa Web Crypto AES-GCM 256 bits e PBKDF2 SHA-256 com 600.000 iterações, sal e IV aleatórios. Transferência manual entre dispositivos, sem conta nem servidor: exporte em Diário, copie o arquivo para o outro dispositivo e importe com a mesma senha (mínimo 12 caracteres). Não há recuperação da senha. Importação valida o conteúdo e une os dados, mantendo registros e modelos locais em conflito; favoritos e capítulos são unidos. Não altera a sessão em andamento, carta do dia ou preferências. O limite é 5 MB de conteúdo/7 MB de arquivo, 5.000 leituras e 50 modelos; quotas do navegador podem ser menores. Criptografia protege o arquivo exportado, não os dados em uso no navegador. Backups antigos do diário continuam compatíveis. Não é sincronização automática. Evite alterações simultâneas em outras abas durante a importação.

## Qualidade e resiliência
O Grimório apresenta 12 registros por página e a conversa exibe inicialmente as últimas 20 mensagens (o histórico anterior continua disponível). O aplicativo verifica versões locais antes de gravar sessão, diário, favoritos, progresso e modelos; alterações de outra aba bloqueiam uma gravação desatualizada e exibem aviso de recuperação. A verificação é otimista, não uma transação atômica entre abas. Para recuperar uma aba em conflito, copie a leitura ou exporte seu cofre antes de recarregar. A integração da voz neural real passou no teste de síntese; avaliação perceptiva em dispositivos físicos continua necessária.

`browser/quality.mjs` audita oito rotas do build otimizado em três larguras, com axe-core e orçamento de carregamento, no pipeline Test ARCANA. Veja o artefato `arcana-quality-report` para os resultados; não é certificação WCAG nem medição de campo.

## Refinamento sensorial
Trilha procedural original em Web Audio, cinco harmonias, camadas suaves de osciladores, modulação lenta, filtro e panorama estéreo quando suportado. Transição de áudio limitada a duas camadas (16 osciladores incluindo moduladores); não reinicia ao navegar dentro do mesmo ambiente. Ducking preservado durante a narração, pausa quando a aba fica oculta. Cenários anteriores permanecem até que a próxima pintura carregue; em falhas, o último cenário permanece. O círculo completo ganha um pulso breve, respeitando movimento reduzido. Sem novos arquivos de arte, música externa ou dependências pesadas. Qualidade auditiva subjetiva ainda requer escuta.

A auréola ornamental carrega somente quando existe mandala e recebe versão WebP transparente no build otimizado. O pacote offline inclui o derivado. O orçamento de abertura continua em 2,5 MB; a auditoria registra a ausência de carregamento prematuro da auréola.

O build confere os 158 derivados das cartas por nome e os ornamentos/cenários separadamente, de modo que a auréola não interfira na validação da coleção.

A síntese do Oráculo local considera as posições intermediárias, destaca até dois fios simbólicos, distingue o tema reconhecido na pergunta da área selecionada e oferece práticas ligadas aos arcanos. A Encruzilhada compara os dois caminhos como perspectivas, não como resultados. O diálogo diferencia pedidos de prática, sombra, combinação e aprofundamento. A voz neural mantém o roteiro editorial separado, sem perguntas ou anotações privadas.

## Trilha sonora Suno
As cinco faixas MP3 enviadas em `assets/` substituem a síntese procedural. Portal, Santuário, Biblioteca (Baralho/Combinações/Jornada), Observatório e Grimório possuem trilhas próprias, em loop. Volume normal de 15%, limite global do ganho musical em 20%, redução para 4% durante a voz. Crossfade linear de 1,8 s, até duas faixas simultâneas; a soma dos ganhos das faixas é limitada a 1. O áudio ambiente permanece opt-in no ícone existente, sem pré-carregamento de MP3 na abertura; pausa ao ocultar a aba. A música depende da disponibilidade do arquivo e do suporte de reprodução do navegador, e não integra o pacote offline das pinturas. A continuidade exata no ponto de repetição depende da edição do arquivo original; não foi feita alteração nos MP3. Testes de áudio real e ausência de carregamento inicial no CI.

## ARCANA Universe — fase 1
O Portal agora reúne cinco câmaras navegáveis e os instrumentos realmente disponíveis. `universe.js` centraliza rotas, títulos, ambiente e navegação contextual. As URLs antigas, tiragens e o Grimório permanecem compatíveis. O Ateliê Alquímico (`#atelier`) permite criar mandalas paramétricas e sigilos geométricos, escolher 4/6/8/12 eixos, complexidade 2–7, pigmento e variação; uma intenção opcional gera uma semente artística local. Exporta SVG autoral sem pinturas, sem texto da intenção e sem dependências externas. A semente não é criptografia. O rascunho permanece apenas durante a sessão; não integra o cofre ainda. O Ateliê reutiliza a atmosfera da Biblioteca até receber direção artística própria. Nenhuma nova imagem ou música é exigida nesta fase. Astrarium está disponível no Observatório.

## Astrarium
`#astrarium` explora datas de 1900–2100, fases e iluminação da Lua, distância aproximada, calendário lunar, próximas fases principais, equinócios/solstícios e eclipses globais, além de longitudes eclípticas geocêntricas de Sol, Lua e sete planetas. Usa Astronomy Engine 2.1.19 (MIT), código original vendorizado e carregado sob demanda, incluído no shell offline. Cálculos ao meio-dia no fuso do dispositivo; não coleta localização. A orientação lunar e os raios do diagrama são ilustrativos. Os eclipses não representam visibilidade local. A contemplação é explicitamente separada dos dados astronômicos. Não implementa mapa natal, constelações reais ou horizonte local nesta versão.

## Oráculos ancestrais
`#elder` contém 24 caracteres do Futhark antigo, seleção de 1 ou 3 pedras sem reposição, posições reflexivas e biblioteca. Os significados são contemporâneos, não prova de divinação histórica. `#iching` possui os 64 hexagramas na sequência recebida, método de três moedas (6/7/8/9), registro manual, linhas da base ao topo, transformação de 6 e 9, biblioteca e perguntas autorais. Fontes: Universidade de Copenhague (https://nors.ku.dk/english/research/runes/), Chinese Text Project (https://ctext.org/book-of-changes), matriz inferior × superior (https://bazi-atlas.com/hexagrams). Sem IA, sem previsão, sem tradução integral dos textos clássicos. Consultas em memória, com exportação textual opcional; não incluídas no cofre nesta fase. Texturas opcionais `assets/instruments/runa.png` e `moeda.png`, sem símbolos rasterizados, com fallback CSS. Ambas usam o Santuário e a música existente.

## Silentium — fase 4
Câmara de contemplação com 3/5/10/20 minutos, práticas livre, respiração confortável opcional (4 s/6 s, sem retenção) e contemplação dos 22 arcanos maiores. Cronômetro monotônico de tempo ativo, pausa/resume, pausa automática ao ocultar aba, descarte do intervalo ao sair da rota, introdução editorial pela voz neural opcional, sem gravação pessoal, metas ou promessas terapêuticas. Respeita redução de movimento; controles de áudio existentes. Cenário próprio opcional `assets/scenes/silentium.png`, fallback Observatório; reutiliza trilha do Observatório até nova faixa enviada. O build deriva WebP dos instrumentos rúnicos e das moedas em até 384px, preservando originais; opcionalmente deriva o cenário Silentium. Não há registro persistente das sessões nesta fase.
