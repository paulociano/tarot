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
