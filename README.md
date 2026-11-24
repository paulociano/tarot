# ARCANA · Tarot surrealista

Experiência de tarot Rider-Waite-Smith em português. Aplicação estática para GitHub Pages, com baralho autoral, tiragens, interpretação simbólica e diário local.

A direção artística é uma proposta: surrealismo onírico, óleo sobre tela, arquitetura impossível, índigo, ouro antigo e marfim. As imagens finais serão adicionadas em `assets/cards/<id>.webp`; o aplicativo utiliza arte geométrica provisória quando ausentes.

O assistente local usa regras interpretativas, não um modelo de IA. Uma futura integração com modelo generativo precisa de backend seguro; nunca publique chaves de API no GitHub Pages.

Publicação: Settings → Pages → Deploy from a branch → main → /(root). Abra `index.html` via servidor HTTP local para desenvolvimento.

## Versão 2 — Mesa de leitura

- Sete tiragens, escolha intuitiva no baralho embaralhado de 78 cartas, sorteio automático e registro de cartas físicas.
- Carta do dia local, favoritos, perfil de elementos e pares completos (45 na Cruz Celta).
- Tiragem em andamento, diário e conversas armazenados no navegador. Não há transmissão de perguntas para terceiros.
- O assistente continua baseado em regras locais; respostas não são previsões nem leitura de pensamentos.
- O upload das imagens WebP não exige mudança no código; arquivos ausentes preservam a ilustração provisória.

## Validação

Execute `npm test` para testes de domínio. Para o smoke test em Chromium: `npm install --no-save playwright@1.56.1`, `npx playwright install chromium`, `node browser/smoke.mjs`.
