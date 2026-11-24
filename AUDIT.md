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
