# ARCANA — auditoria UI/UX e frontend
Baseline: 78ac832. Aplicação estática, 79 PNGs (245.160.886 bytes). Evidência: código e histórico CI; não equivale a métricas de campo ou inspeção visual.

| ID | Evidência e impacto | Severidade 0–4 | Correção e critério de aceite | Estado |
|---|---|---|---|---|
| A01 | assets/cards: PNGs grandes; artImage tentava WebP inexistente | 3 | PNG primeiro, lazy loading, atlas 24 por vez; reduzir transferência com derivados | Parcial; bytes não medidos |
| A02 | setup sem prévia de posições | 2 | Mapa acompanha spread | Implementado |
| A03 | ritual sem próximo passo evidente | 3 | Posição destacada, botão de leitura com foco | Implementado |
| A04 | selectionTray sem controles de avanço | 2 | Botões, escolha aleatória e preservar scroll | Implementado |
| A05 | revelações interrompem animação | 3 | Coreografia e bloqueio de 1050 ms; reduced motion imediato | Implementado |
| A06 | header sem preferência persistida | 2 | Som e movimento persistentes | Implementado |
| A07 | atlas 78 cards simultâneos | 2 | 24 iniciais, carregar mais, filtros | Implementado |
| A08 | leitura extensa, chat/notas distantes | 2 | Atalhos e foco; chat rolável | Implementado |
| A09 | CSS acumulado | 2 | Consolidar após baseline visual | Pendente |
| A10 | contraste, zoom, leitor de tela, LCP/INP/CLS | — | auditoria manual e lab/field | UNKNOWN |

Gate: CI Node + Chromium 360/768/1440; captura home, atlas, mandala, carta revelada. Estado da nova versão pendente até conclusão. Sem medição de campo. PNGs, diário, sigilos e sessões preservados.

## A01 — complemento de performance
Gerador de 158 WebPs (420/1050 px) e manifesto; CI separado produz pacote e estatística. O aplicativo suporta srcset e fallback PNG, e os fundos usam derivados quando o pacote está instalado. A publicação branch-based mantém PNG até instalar o pacote em assets/optimized. Não há alegação de redução medida ou deployment de WebP nesta etapa.

## Atlas — consulta interativa
Cartas com duas faces, prévia por hover/foco e detalhes completos por clique/toque. Escape dispensa a prévia. Sem material de produção artística na aplicação. Testes de hover, teclado, toque e ausência dos controles removidos.

## Fundação ARCANA 3
Correções: salto de conteúdo sem mudar o hash; alertas de armazenamento; validação de sessão/conversa; importação de backup com deduplicação; bloqueio de revelação vinculado à conclusão da animação, com cancelamento por navegação ou desativação. Testes de domínio e navegador ampliados. Revalidação pendente de CI.

## Pipeline de publicação ARCANA 3
CI gera os derivados, testa uso de WebP e valida o pacote (158 arquivos; menos de 50% dos bytes originais). Release automático somente quando a origem de Pages é GitHub Actions. Configuração legada continua funcional. A mudança de origem requer ação do proprietário caso ainda esteja em modo branch; não foi feita via conector.

## Oráculo contextual
Motor local separado em oracle.js; síntese contextual por temas, referências recentes e posição, guardrails anteriores à seleção de cartas, narração somente com voz local. Sem backend ou transmissão de perguntas. Testes de contexto, inversão, limites e continuidade; validação em CI pendente. Voz real depende do dispositivo.

## Grimório e controles
Modos removidos, ícones com nomes acessíveis e áreas de toque de 44 px. Estatísticas descritivas, busca e calendário, selo SVG, preservação do diário local e backups. Testes adicionados; publicação e runtime pendentes.

## PWA e sigilos pictóricos
Manifest e ícones, Service Worker de escopo relativo, app shell versionado, cache público de arte limitado a 20 originais e 200 derivados, pacote completo opt-in WebP, status offline e instalação. Dados privados não entram no Cache Storage. Teste Chromium offline adicionado; instalação real iOS/Android, quota, atualização multiaba e revisão visual permanecem pendentes. A origem Pages observada no último CI é legacy, portanto pacote completo depende de mudar Source para GitHub Actions.

## Proteção de superfície de arte
Remoção do museu e módulos correspondentes; redirecionamento de hash legado. Proteção de contexto e arraste restrita às superfícies de arte, sem bloquear teclado ou cópia de textos. Exportação simbólica sem pinturas. Recursos públicos permanecem recuperáveis por URL ou captura; não é controle de acesso. Testes de navegador adicionados.

## Voz neural
Worker com recursos fixados por versão, inferência local, sem textos pessoais nos payloads do worker, sem chaves de API. Cache de modelo separado. Dependências externas ainda representam risco de supply chain e disponibilidade; teste real de áudio e dispositivos pendente. Encerramento por rota, parada, aba oculta e timeout. Modelo neural não garante qualidade equivalente a um locutor humano.

## Oráculo generativo privado
Implementação opcional sem credenciais nem endpoint ativo por padrão. Código de acesso server-side, origem restrita, payload minimizado, validação de cartas, instruções de segurança, limite de tokens, timeout e respostas sem cache. Sem armazenamento de credenciais do cliente. Throttle local não substitui quota distribuída; habilitação comercial exige autenticação, limites persistentes, avaliação adversarial e consentimento. Nenhuma chamada paga realizada nesta entrega.

Verificação adicional: testes Chromium com endpoint simulado para consentimento, exclusão de anotações/código do payload, resposta, erro recuperável e descarte de credenciais ao navegar. Workflow real da voz acionado por mudanças nos arquivos de inferência e teste (não usa API paga). Resultados dependem do CI.

## Cofre portátil
Piloto generativo e backend excluídos da árvore atual, sem remover conversas antigas. Cofre versionado criptografado no navegador com AES-GCM e PBKDF2, sal/IV aleatórios, validação antes de gravar, mesclagem sem sobrescrever registros locais, tentativa de rollback em erro de quota. Sem transmissão de dados, sem senha persistida, sem recuperação de senha. Testes unitários de roundtrip, autenticação e preservação, e smoke offline. Não é sincronização automática nem criptografia do armazenamento local.

## Auditoria final — primeira rodada
Baseline 675d3c9: CI unitário, Chromium e publicação Pages aprovados; síntese real Piper em 96da0f8 aprovada (47.872 amostras a 22.050 Hz). Findings corrigidos nesta rodada: renderização ilimitada do diário (12 por página) e chat (20 mensagens iniciais, histórico preservado); verificação otimista de dados desatualizados entre abas com aviso e bloqueio; cofre valida versões antes de aplicar; foco e rolagem na expansão do atlas; listeners de imagem não duplicados; remoção de gradiente SVG não utilizado com IDs repetidos. Testes novos de paginação, concorrência local e proteção contra sobrescrita. Não é locking transacional. Revisão automatizada de acessibilidade e métricas de laboratório adicionada separadamente. Validação visual humana, testes físicos, performance de campo e publicação WebP otimizada continuam pendentes. Pages em modo branch no baseline, deploy Actions ignorado.

### Gate contínuo de qualidade
`browser/quality.mjs` verifica 8 rotas em 3 larguras (360/768/1440), pacote otimizado servido sob `/tarot/`, com axe-core 4.10.3. Gating: overflow horizontal, nomes/labels básicos e atributos ARIA essenciais, carregamento sob demanda da voz, orçamento inicial local de 2,5 MB e erros JS. Registra contagens de DOM, recursos, bytes e tempo de navegação, demais violações/incomplete do axe e screenshots. Sem fontes externas nem throttling no laboratório; não equivale a LCP/INP/CLS de campo ou conformidade WCAG. Relatório `arcana-quality-report` no CI. O relatório será produzido na execução; não declarar PASS antes dos resultados.

## Refinamento sensorial
Baseline de concorrência e paginação dfafd08 aprovado. Corrigidos descarte antecipado do cenário, reinício de áudio ao mudar dentro da mesma sala e sobreposição ilimitada potencial em navegação rápida. Mixer procedural com dois grupos máximos, teste de cancelamento de resume e grafo de Web Audio, fallback da pintura e reduced motion. Não houve avaliação auditiva humana; parâmetros são decisões de direção sonora. Relatório axe anterior ainda em execução no início desta etapa.

### Resultado da primeira auditoria e correção do orçamento
CI c43b051: 24 combinações auditadas. Gate de controles acessíveis, overflow e voz sob demanda aprovado; orçamento inicial falhou nas três larguras (2.682.431 bytes contra 2.500.000). Axe reportou uma regra em home e uma em journal, não bloqueantes pelo conjunto de gates selecionado. A auréola PNG de 1.461.335 bytes era baixada na abertura por `pwa.js`, mesmo sem mandala. Removido preload, fundo ornamental solicitado apenas nas superfícies que o utilizam; derivado WebP RGBA de até 720px no build. O pacote offline inclui a auréola. Teste passa a aguardar a pintura do Portal e verificar ausência de requests da auréola, preservando o orçamento original; reteste pendente. Logs agora identificam regras axe, não apenas contagem.

### Revalidação do refinamento sensorial
CI 66c9df9: smoke Chromium aprovado nas três larguras, cofre, voz controlada, armazenamento multiaba e grafo de áudio real. Build interrompido por assertion antiga que contava todos os WebP na raiz (158), incluindo o novo ornamento. Corrigida a validação para comparar os nomes exatos das 158 versões das 79 cartas e validar cenário/auréola separadamente. O gate de 2,5 MB continua inalterado. O relatório imprime os identificadores e alvos das regras axe para diagnóstico. Resultados da nova execução ainda pendentes.

### Hierarquia semântica
Revisão estática identificou títulos H3 sem H2 intermediário no Portal e no Grimório. Corrigida a hierarquia sem mudar a tipografia, com títulos/landmarks identificados para a seção de funcionamento, resumo da jornada, backup e cofre. A regra axe `heading-order` passa a integrar os gates bloqueantes. O resultado final depende da execução do novo pipeline.

## Direção editorial
Baseline 354225e: CI completo aprovado, 24 superfícies axe sem violações nas regras executadas. Home otimizada medida em 1.225.811 bytes nas três larguras contra 2.682.431 no baseline inicial (redução de aproximadamente 54%). Oráculo local revisado para incluir posições intermediárias, comparar alternativas da Encruzilhada sem recomendação preditiva, priorizar relações por afinidade temática e oferecer práticas associadas às cartas; perguntas de prática, sombra e aprofundamento têm rotas distintas. Sem IA generativa, sem transmissão de dados. A narração neural continua com roteiro editorial próprio e sem textos privados. Novos testes unitários e de interface aguardam CI.

## Integração musical
Baseline a433929: testes aprovados. Upload 887c3d2: cinco MP3 identificados no GitHub. Integração com HTMLMediaElement/Web Audio, opt-in, ganho master limitado, cancelamento de trocas concorrentes, duas faixas máximas e timeout de 15 s. Pausa libera elementos de áudio. Os MP3 não são precacheados; PWA offline permanece funcional sem garantia de música offline. Testes de reprodução real Chromium para cada arquivo, ganho-alvo, ducking, pausa e ausência de requests na abertura. Validação auditiva/visual anterior aprovada pelo usuário; novos arquivos ainda não foram escutados por mim. Loop nativo pode revelar diferenças entre começo e fim de cada faixa.

## ARCANA Universe — fase 1
Baseline a5e89f3: CI e publicação aprovados, cinco faixas integradas. Extensão da arquitetura com registry de rotas e câmaras, caminho de navegação, portal radial acessível e Ateliê funcional. Exportação SVG contém apenas geometria autoral; nenhuma pintura, intenção em texto ou recurso externo. Rascunho em memória, sem persistência ainda. Ateliê reutiliza Biblioteca. Novos testes de rotas, geometria, limites, download, foco e largura 360px, além de axe em nove rotas × três larguras. Testes completos pendentes. Nenhum arquivo pictórico ou MP3 modificado.

## Astrarium — fase 2
Astronomy Engine ESM 2.1.19 vendorizado sem alterações (blob upstream 6b73063bbc90bafe1ad9a712cfd9e9b958a54d60), licença MIT preservada. Cálculos geocêntricos, data local ao meio-dia, navegação 1900–2100, cache limitado de meses/estações, import sob demanda com guarda de rota e shell offline. Teste de referência eclipse solar total 2024-04-08 e equinócio 2024-03-20 com tolerância de dez minutos, calendário bissexto e posições finitas; smoke mobile e axe em dez rotas. Não valida visibilidade local, orientação física do disco, astrologia ou precisão de navegação. Sem novos assets pictóricos/sonoros. CI novo pendente.

Revisão do CI 4450d81: testes unitários passaram; smoke parou porque `[data-chamber]` também selecionava o body, contando seis elementos em vez de cinco links. Corrigido o seletor para `.chamber-link[data-chamber]`, preservando a expectativa de cinco câmaras. Verificação direta com código vendorizado: eclipse solar total 2024-04-08 18:17:19 UTC, equinócio 2024-03-20 03:06:24 UTC, nove astros e fevereiro de 2024 com 29 dias. Auditoria do Astrarium aguarda tabela calculada, não só o shell. Reteste do pipeline pendente.

## Fase 3 — oráculos ancestrais
24 runas distintas; biblioteca e sorteio sem reposição por rejeição de viés de módulo via crypto.getRandomValues. Matriz King Wen 8×8 conferida; 64 configurações únicas, 6/9 mutáveis, 7/8 estáveis, seis linhas da base ao topo, distribuição de três moedas 1:3:3:1. Reflexões autorais, não traduções de sentenças clássicas nem previsão. Testes de todas as 64 figuras, pares 1/2, 11/12 e 63, probabilidades, pool oculto, exportação e 360px. Texturas opcionais, nenhuma imagem alterada. Histórico em sessão; integração persistente futura. Novos testes e auditoria de 12 rotas aguardam CI.
