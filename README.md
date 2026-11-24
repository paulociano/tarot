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
Cinco ambientes panorâmicos opcionais em `assets/scenes/` (consulte o README dessa pasta). Modos Essencial, Imersivo e Cinematográfico; parallax limitado ao último modo, entrada de carta coordenada à virada, ambientação sonora procedural opcional e desligada por padrão. A preferência de movimento reduzido mantém toda a funcionalidade. Os fundos existentes continuam funcionando enquanto as pinturas panorâmicas estiverem ausentes.

## Conhecimento dos Arcanos
As 78 cartas possuem arquétipo editorial, aprofundamento, temas e pergunta reflexiva. O laboratório permite comparar duas ou três cartas, com inversões, relações temáticas, eco numérico e mandala, sem modificar a sessão de tiragem. Dez modalidades de tiragem estão disponíveis. Interpretações são autorais, contextuais e não preditivas; não há IA generativa nesta fase.

## Oráculo ARCANA — interpretação contextual local
O Oráculo utiliza temas reconhecidos por palavras-chave, posição, orientação, estudos dos arcanos e relações entre cartas. A síntese distingue o contexto da pergunta de fatos: não faz previsões e não infere sentimentos de terceiros. A conversa retoma referências recentes a cartas e posições; não é um modelo generativo. A narração é opcional e só usa voz de português com `localService` verdadeiro no dispositivo. Se indisponível, o texto permanece acessível. Não são enviadas perguntas ou leituras a serviços de IA. Uma integração generativa futura exige backend, consentimento, controle de acesso/custos e configuração segura de credenciais no servidor.
