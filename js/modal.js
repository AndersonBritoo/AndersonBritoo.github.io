/**
 * @file modal.js
 * @module modal
 *
 * @description
 * Módulo responsável pela abertura e fecho do modal de detalhe de projeto.
 *
 * Gera o conteúdo HTML do modal dinamicamente com base nos dados do
 * projeto selecionado (importado de data.js) e no idioma ativo (getLang).
 *
 * A função openModal é exposta em window por main.js, pois é chamada
 * pelo atributo onclick dos cartões gerados dinamicamente por projects.js.
 * A função closeModal é também usada por pdfModal.js, pois ambos
 * partilham o mesmo overlay (#modalOverlay).
 *
 * Dependências:
 *  - data.js     → array de projetos (para localizar por id)
 *  - language.js → idioma ativo (getLang)
 */

import { projects } from './data.js';
import { getLang }  from './language.js';


/* =============================================
   ABERTURA DO MODAL
============================================= */

/**
 * Popula e exibe o modal com os detalhes de um projeto.
 *
 * Chamada pelo atributo onclick de cada cartão de projeto (gerado em projects.js).
 * Está exposta em window.openModal por main.js para ser acessível inline no HTML.
 *
 * Comportamento:
 *  1. Localiza o projeto pelo id; termina silenciosamente se não existir.
 *  2. Gera o HTML completo do modal no idioma ativo:
 *       - Imagem/placeholder do projeto
 *       - Título, tags de tecnologia, descrição, o que foi aprendido
 *       - Botões de ação (GitHub e, opcionalmente, Demo)
 *  3. O botão de demo só é renderizado se `p.demo` não for string vazia.
 *  4. Adiciona a classe 'open' ao overlay e bloqueia o scroll da página.
 *
 * @param {number} id - ID do projeto a apresentar (corresponde a projects[n].id).
 */
export function openModal(id) {
  const lang = getLang();
  const p    = projects.find(x => x.id === id);
  if (!p) return;

  /* Labels traduzidas conforme o idioma ativo */
  const demoLabel    = lang === 'pt' ? 'Demo ao Vivo'  : 'Live Demo';
  const learnedLabel = lang === 'pt' ? 'O que aprendi' : 'What I learned';
  const techLabel    = lang === 'pt' ? 'Tecnologias'   : 'Technologies';
  const descLabel    = lang === 'pt' ? 'Descrição'     : 'Description';

  document.getElementById('modalContent').innerHTML = `
    <div class="project-img-placeholder modal-img"
         style="background:${p.gradient}; border-radius:var(--radius-lg) var(--radius-lg) 0 0;">
      <span style="font-size:5rem;">${p.icon}</span>
    </div>

    <div class="modal-body">
      <h2 class="modal-title">${p.title[lang]}</h2>

      <div class="modal-section">
        <h4>${techLabel}</h4>
        <div class="tag-list">
          ${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-section">
        <h4>${descLabel}</h4>
        <p>${p.description[lang]}</p>
      </div>

      <div class="modal-section">
        <h4>${learnedLabel}</h4>
        <p>${p.learned[lang]}</p>
      </div>

      <div class="modal-actions">
        <a href="${p.github}" target="_blank" class="btn btn-ghost">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>

        ${p.demo ? `
        <a href="${p.demo}" target="_blank" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          ${demoLabel}
        </a>` : ''}
      </div>
    </div>
  `;

  /* Exibe o overlay e bloqueia o scroll da página */
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}


/* =============================================
   FECHO DO MODAL
============================================= */

/**
 * Remove o modal do ecrã e restaura o scroll da página.
 *
 * Chamada por múltiplos triggers registados em main.js:
 *  - Clique no botão #modalClose
 *  - Clique fora do modal (no overlay de fundo)
 *  - Pressionar a tecla Escape
 *
 * Também usada implicitamente por pdfModal.js ao abrir o viewer de CV,
 * pois ambos partilham o mesmo #modalOverlay e #modalClose.
 */
export function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  /* Restaura o scroll da página que foi bloqueado em openModal / openPdfModal */
  document.body.style.overflow = '';
}
