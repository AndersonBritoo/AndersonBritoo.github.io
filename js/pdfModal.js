/**
 * @file pdfModal.js
 * @module pdfModal
 *
 * @description
 * Viewer de CV em PDF dentro do modal global existente (#modalOverlay / #modalContent).
 *
 * Renderiza o PDF com três camadas sobrepostas sobre um único viewport PDF.js:
 *  1. <canvas>          → visual: bitmap renderizado pixel-a-pixel
 *  2. .textLayer        → texto selecionável (spans HTML transparentes sobre o canvas)
 *  3. .annotationLayer  → links clicáveis (<a href> reais sobre as anotações do PDF)
 *
 * ─── Bugs corrigidos nesta versão ───────────────────────────────────────────
 *
 * BUG A — timing: wrap.clientWidth retornava 0
 *   Após injetar innerHTML, o browser ainda não tinha calculado o layout
 *   e clientWidth era 0, resultando num scale incorreto.
 *   Correção: waitForLayout() aguarda dois requestAnimationFrame encadeados.
 *
 * BUG B — race condition: pdfjsLib podia não estar pronto
 *   O script CDN no <head> podia não ter terminado de executar quando
 *   openPdfModal() era chamada, lançando "pdfjsLib is not defined".
 *   Correção: waitForPdfJs() faz polling a cada 50ms até 3 segundos.
 *
 * BUG C — API v3.11: CSS custom property --scale-factor não definida
 *   Na v3.11, renderTextLayer() lê --scale-factor do container para
 *   calcular os transforms internos dos spans. Sem ela, o texto fica
 *   desalinhado e um aviso é emitido na consola.
 *   Correção: setProperty('--scale-factor', viewport.scale) antes da chamada.
 *
 * BUG D — API v3.11: AnnotationLayer.render() estático removido
 *   Na v2.x existia pdfjsLib.AnnotationLayer.render(params) (estático).
 *   Na v3.x foi substituído por uma classe instanciável:
 *     new pdfjsLib.AnnotationLayer({...}).render({...})
 *   Correção: uso da API v3.x com new e await no método render().
 *
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Versão PDF.js utilizada: 3.11.174 (CDN carregado no <head> do index.html).
 * Exposta em window.openPdfModal por main.js.
 */


/* =============================================
   CONFIGURAÇÃO
============================================= */

/**
 * URL do worker do PDF.js (CDN).
 * Obrigatório antes de qualquer chamada a pdfjsLib.getDocument().
 * Deve corresponder à mesma versão carregada no <head> do index.html.
 *
 * @type {string}
 */
const WORKER_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/**
 * URL do CSS oficial do PDF.js (CDN).
 * Define os estilos internos de .textLayer e .annotationLayer.
 * Injetado uma única vez no <head> por initPdfStyles().
 *
 * @type {string}
 */
const PDFJS_CSS_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf_viewer.min.css';


/* =============================================
   UTILITÁRIOS
============================================= */

/**
 * Injeta o CSS oficial do PDF.js no <head> do documento, uma única vez.
 *
 * O CSS define os estilos base de .textLayer (spans de texto transparentes)
 * e .annotationLayer (links e anotações). Sem este CSS, os spans ficam
 * visíveis a preto sobre o canvas, sobrepondo o conteúdo visual.
 *
 * Usa o id 'pdfjs-css' para garantir idempotência — chamadas repetidas
 * (ex: ao abrir o modal múltiplas vezes) não duplicam o elemento <link>.
 */
function initPdfStyles() {
  if (document.getElementById('pdfjs-css')) return;

  const link  = document.createElement('link');
  link.id     = 'pdfjs-css';
  link.rel    = 'stylesheet';
  link.href   = PDFJS_CSS_URL;
  document.head.appendChild(link);
}

/**
 * Aguarda que pdfjsLib esteja disponível no escopo global (window).
 *
 * Correção do BUG B: o script CDN pode não ter terminado de executar
 * quando openPdfModal() é chamada. Esta função faz polling a cada 50ms
 * até a biblioteca estar pronta, com timeout de 3 segundos (60 tentativas).
 *
 * @returns {Promise<void>} Resolve imediatamente se já disponível;
 *                          resolve após o polling se carregar entretanto;
 *                          rejeita com Error após 3s se nunca carregar.
 */
function waitForPdfJs() {
  return new Promise((resolve, reject) => {
    if (typeof pdfjsLib !== 'undefined') { resolve(); return; }

    let attempts = 0;
    const id = setInterval(() => {
      if (typeof pdfjsLib !== 'undefined') {
        clearInterval(id);
        resolve();
      } else if (++attempts >= 60) {
        clearInterval(id);
        reject(new Error('pdfjsLib não carregou. Verifica o <script> CDN no <head>.'));
      }
    }, 50);
  });
}

/**
 * Aguarda que o browser calcule as dimensões do DOM após uma alteração de innerHTML.
 *
 * Correção do BUG A: imediatamente após injetar innerHTML, clientWidth seria 0
 * porque o browser ainda não executou o layout. Dois requestAnimationFrame
 * encadeados garantem que:
 *  - 1.º rAF: o DOM é atualizado e o browser processa as mudanças
 *  - 2.º rAF: o layout é calculado e clientWidth tem o valor real
 *
 * @returns {Promise<void>} Resolve após dois frames de animação.
 */
function waitForLayout() {
  return new Promise(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  );
}


/* =============================================
   ABERTURA DO MODAL
============================================= */

/**
 * Viewer de PDF completo com três camadas sobrepostas.
 *
 * Abre o modal global existente (#modalOverlay / #modalContent),
 * injeta a estrutura HTML do viewer e renderiza o PDF via PDF.js v3.11.
 *
 * Exposta em window.openPdfModal por main.js.
 * Chamada pelo atributo onclick do botão "Ver CV" em index.html.
 *
 * Fluxo de execução:
 *  1.  Injeta o CSS do PDF.js (uma vez por sessão).
 *  2.  Injeta o HTML do viewer (header + área de scroll + container de camadas).
 *  3.  Abre o modal e bloqueia o scroll da página.
 *  4.  Aguarda o layout (waitForLayout) — fix Bug A.
 *  5.  Aguarda pdfjsLib (waitForPdfJs) — fix Bug B.
 *  6.  Configura o worker e carrega o documento PDF.
 *  7.  Calcula o scale com base na largura real do container.
 *  8.  Configura canvas com as dimensões exatas do viewport.
 *  9.  Renderiza o canvas (camada visual).
 *  10. Renderiza o textLayer (camada de texto selecionável) — fix Bug C.
 *  11. Renderiza o annotationLayer (camada de links) — fix Bug D.
 *  12. Oculta o loading indicator e exibe o container de camadas.
 *
 * Em caso de erro, exibe um fallback com botão de download direto.
 *
 * @param {string} url - Caminho relativo para o ficheiro PDF.
 *                       Exemplo: 'assets/CV_Anderson_Brito_FullStack.pdf'
 */
export async function openPdfModal(url) {

  /* ── 1. CSS do PDF.js (idempotente) ── */
  initPdfStyles();

  /* ── 2. HTML do viewer ── */
  /**
   * Estrutura injetada em #modalContent:
   *   .pdf-modal-inner
   *     .pdf-modal-header   → título + botão de download
   *     .pdf-canvas-wrap    → área de scroll
   *       #pdfLoading       → indicador de carregamento (3 pontos animados)
   *       #pdfPageContainer → container das 3 camadas (display:none até renderizado)
   *         #pdfCanvas      → camada 1: visual (canvas)
   *         #pdfTextLayer   → camada 2: texto selecionável (.textLayer)
   *         #pdfAnnotLayer  → camada 3: links clicáveis (.annotationLayer)
   *
   * #pdfPageContainer começa com display:none e só é tornado visível
   * no passo 12, após todas as camadas estarem completamente renderizadas.
   * Isto evita flashes de canvas sem layers ou de layout parcial.
   */
  document.getElementById('modalContent').innerHTML = `
    <div class="pdf-modal-inner">

      <div class="pdf-modal-header">
        <span class="pdf-modal-title">Curriculum Vitae</span>
        <a href="${url}" download class="btn btn-ghost pdf-download-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download
        </a>
      </div>

      <div class="pdf-canvas-wrap" id="pdfCanvasWrap">

        <div class="pdf-loading" id="pdfLoading">
          <span class="pdf-loading-dot"></span>
          <span class="pdf-loading-dot"></span>
          <span class="pdf-loading-dot"></span>
        </div>

        <!--
          Container das 3 camadas sobrepostas.
          position:relative é obrigatório: textLayer e annotationLayer
          usam position:absolute + inset:0 e ancoram-se neste elemento.
          width/height são definidos por JS com as dimensões exatas do viewport.
        -->
        <div class="pdf-page-container" id="pdfPageContainer" style="display:none;">
          <canvas id="pdfCanvas"></canvas>
          <div id="pdfTextLayer"  class="textLayer"></div>
          <div id="pdfAnnotLayer" class="annotationLayer"></div>
        </div>

      </div>
    </div>
  `;

  /* ── 3. Abrir modal e bloquear scroll ── */
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  try {

    /* ── 4. Aguardar layout — fix Bug A ── */
    await waitForLayout();

    /* ── 5. Aguardar pdfjsLib — fix Bug B ── */
    await waitForPdfJs();

    /* ── 6. Worker, documento e página ── */
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;

    const pdfDoc = await pdfjsLib.getDocument(url).promise;
    const page   = await pdfDoc.getPage(1); /* CV tem uma única página */

    /* ── 7. Calcular scale com a largura real do container ── */
    /**
     * availableWidth = clientWidth do wrap menos padding lateral (1.5rem × 2 = 48px).
     * Fallback mínimo de 200px evita scale negativo ou zero.
     * O scale é a razão entre a largura disponível e a largura nativa do PDF.
     */
    const wrap           = document.getElementById('pdfCanvasWrap');
    const availableWidth = Math.max(wrap.clientWidth - 48, 200);
    const baseViewport   = page.getViewport({ scale: 1 });
    const scale          = availableWidth / baseViewport.width;

    /**
     * CRÍTICO: viewport único partilhado pelas três camadas.
     * Recriar o viewport entre camadas introduz arredondamentos que
     * desalinham visualmente o texto em relação ao canvas.
     */
    const viewport = page.getViewport({ scale });

    /* ── 8. Canvas com dimensões exatas ── */
    const canvas  = document.getElementById('pdfCanvas');
    canvas.width  = viewport.width;
    canvas.height = viewport.height;

    const pageContainer        = document.getElementById('pdfPageContainer');
    pageContainer.style.width  = `${viewport.width}px`;
    pageContainer.style.height = `${viewport.height}px`;

    /* ── 9. Renderizar canvas (camada visual) ── */
    await page.render({
      canvasContext: canvas.getContext('2d'),
      viewport
    }).promise;

    /* ── 10. Renderizar textLayer — fix Bug C ── */
    /**
     * Na v3.11, renderTextLayer() lê a CSS custom property --scale-factor
     * do container para calcular os transforms internos dos spans.
     * Sem ela, emite aviso na consola e o texto fica desalinhado.
     *
     * A propriedade deve ser o valor numérico do scale (ex: 1.138),
     * não uma string com unidade (ex: "1.138px").
     */
    const textLayerDiv = document.getElementById('pdfTextLayer');
    textLayerDiv.style.setProperty('--scale-factor', viewport.scale);

    const textContent = await page.getTextContent();

    pdfjsLib.renderTextLayer({
      textContentSource: textContent,
      container:         textLayerDiv,
      viewport,
      textDivs:          []
    });

    /* ── 11. Renderizar annotationLayer — fix Bug D ── */
    /**
     * Na v2.x: pdfjsLib.AnnotationLayer.render(params) — API estática.
     * Na v3.x: substituída por classe instanciável com dois passos:
     *   1. new pdfjsLib.AnnotationLayer({ viewport, div, page })
     *   2. await instance.render({ annotations, linkService, ... })
     *
     * viewport.clone({ dontFlip: true }):
     *   O sistema de coordenadas do PDF tem Y invertido (origem no canto
     *   inferior-esquerdo, como em PostScript). dontFlip:true corrige
     *   esta inversão para coincidir com o canvas (origem no canto
     *   superior-esquerdo, como em HTML/CSS).
     *
     * linkService mínimo:
     *   addLinkAttributes() é o método mais importante — aplica href,
     *   target="_blank" e rel="noopener noreferrer" a cada elemento de link.
     */
    const annotations = await page.getAnnotations();
    const annotDiv    = document.getElementById('pdfAnnotLayer');

    const annotationLayer = new pdfjsLib.AnnotationLayer({
      viewport:             viewport.clone({ dontFlip: true }),
      div:                  annotDiv,
      page,
      accessibilityManager: null
    });

    await annotationLayer.render({
      annotations,
      linkService: {
        getDestinationHash:  dest => `#${dest}`,
        getAnchorUrl:        hash => hash,
        addLinkAttributes(el, url) {
          el.href   = url;
          el.target = '_blank';
          el.rel    = 'noopener noreferrer';
        },
        navigateTo:    () => {},
        getPageIndex:  () => Promise.resolve(0),
        isPageVisible: () => true,
        cachePageRef:  () => {}
      },
      renderInteractiveForms: false,
      downloadManager:        null,
      imageResourcesPath:     ''
    });

    /* ── 12. Revelar resultado e ocultar loading indicator ── */
    document.getElementById('pdfLoading').style.display = 'none';
    pageContainer.style.display = 'block';

  } catch (err) {
    /**
     * Fallback funcional exibido apenas em caso de erro real:
     *  - Ficheiro não encontrado (404)
     *  - CDN offline
     *  - PDF corrompido ou inacessível
     *  - pdfjsLib não carregou após 3s (timeout de waitForPdfJs)
     *
     * Verifica se o wrap ainda existe no DOM antes de escrever,
     * pois o modal pode ter sido fechado durante o carregamento assíncrono.
     */
    const wrap = document.getElementById('pdfCanvasWrap');
    if (wrap) {
      wrap.innerHTML = `
        <div class="pdf-error">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5"
               stroke-linecap="round" stroke-linejoin="round"
               style="color:var(--text-dim); margin-bottom:1rem;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8"  x2="12"    y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>Não foi possível carregar o CV.</p>
          <a href="${url}" download class="btn btn-primary" style="margin-top:1rem;">
            Descarregar PDF
          </a>
        </div>
      `;
    }

    /* Regista o erro com a mensagem detalhada para diagnóstico em desenvolvimento */
    console.error('[pdfModal] Erro:', err.message ?? err);
  }
}
