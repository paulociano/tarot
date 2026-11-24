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

Publicação via GitHub Pages: Settings → Pages → Deploy from a branch → main → /(root).
