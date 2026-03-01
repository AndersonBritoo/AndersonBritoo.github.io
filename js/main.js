/**
 * @file main.js
 * @module main
 *
 * @description
 * Ponto de entrada da aplicação do portfólio.
 *
 * Este módulo não contém lógica de negócio própria — o seu único
 * papel é orquestrar todos os módulos filhos, registar os event
 * listeners globais e garantir que a inicialização ocorre apenas
 * após o DOM estar completamente carregado (DOMContentLoaded).
 *
 * Módulos importados e as suas responsabilidades:
 *  - ticker.js       → constrói o ticker de tecnologias no hero
 *  - projects.js     → renderiza os cartões e controla o slider
 *  - modal.js        → abre e fecha o modal de detalhe de projeto
 *  - language.js     → gere a troca de idioma PT/EN
 *  - navbar.js       → comportamento de scroll e link ativo na navbar
 *  - hamburger.js    → menu mobile e animação do ícone hamburger
 *  - scrollReveal.js → animações de entrada ao fazer scroll
 *  - contact.js      → submissão do formulário de contacto via EmailJS
 *  - footer.js       → ano dinâmico no rodapé
 *  - pdfModal.js     → viewer de CV em PDF (canvas + textLayer + annotationLayer)
 */

import { buildTicker }      from './ticker.js';
import { renderProjects,
         updateSlider,
         slidePrev,
         slideNext }        from './projects.js';
import { openModal,
         closeModal }       from './modal.js';
import { setLang }          from './language.js';
import { initNavbar }       from './navbar.js';
import { initHamburger }    from './hamburger.js';
import { initScrollReveal } from './scrollReveal.js';
import { submitForm }       from './contact.js';
import { initFooterYear }   from './footer.js';
import { openPdfModal }     from './pdfModal.js';


/* =============================================
   EXPOSIÇÃO AO ESCOPO GLOBAL
============================================= */

/**
 * Promoção de funções para o escopo global (window).
 *
 * As funções abaixo são referenciadas em atributos HTML inline
 * (onclick / onsubmit), tanto em elementos estáticos do index.html
 * como em elementos gerados dinamicamente por projects.js.
 *
 * Como os ES Modules têm escopo próprio e isolado, as funções
 * exportadas não são automaticamente acessíveis em atributos HTML.
 * A promoção explícita para `window` resolve esta limitação.
 *
 * Funções expostas:
 *  - window.openModal    → abre o modal de detalhe de um projeto
 *  - window.submitForm   → submete o formulário de contacto
 *  - window.openPdfModal → abre o viewer de CV em PDF
 */
window.openModal    = openModal;
window.submitForm   = submitForm;
window.openPdfModal = openPdfModal;


/* =============================================
   INICIALIZAÇÃO
============================================= */

/**
 * Bloco de inicialização da aplicação.
 *
 * Toda a inicialização é adiada para o evento DOMContentLoaded
 * para garantir que todos os elementos do DOM existem antes de
 * serem referenciados. O script é carregado com type="module",
 * que por si só adia a execução, mas o listener torna a intenção
 * explícita e robusta.
 *
 * Ordem de inicialização:
 *  1. Ticker de tecnologias
 *  2. Slider de projetos e botões de navegação
 *  3. Listener de redimensionamento da janela
 *  4. Handlers de fecho do modal
 *  5. Toggle de idioma
 *  6. Navbar (scroll + link ativo)
 *  7. Menu hamburger (mobile)
 *  8. Scroll reveal (animações de entrada)
 *  9. Ano do rodapé
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Ticker de tecnologias ── */
  buildTicker();

  /* ── 2. Slider de projetos ── */
  renderProjects();

  /** Botão de recuo do slider — navega para o cartão anterior. */
  document.getElementById('prevBtn').addEventListener('click', slidePrev);

  /** Botão de avanço do slider — navega para o cartão seguinte. */
  document.getElementById('nextBtn').addEventListener('click', slideNext);

  /* ── 3. Redimensionamento da janela ── */
  /**
   * Recalcula o slider ao redimensionar a janela.
   * O número de cartões visíveis pode mudar (3 → 2 → 1) consoante
   * o breakpoint CSS ativo. updateSlider ajusta cardsPerView e
   * reposiciona a track sem animação brusca.
   */
  window.addEventListener('resize', updateSlider);

  /* ── 4. Handlers de fecho do modal ── */

  /**
   * Fecha o modal ao clicar no botão X (#modalClose).
   * Projetos e PDF partilham o mesmo overlay e botão de fecho.
   */
  document.getElementById('modalClose').addEventListener('click', closeModal);

  /**
   * Fecha o modal ao clicar no overlay de fundo.
   * A verificação e.target === overlay garante que cliques dentro
   * da caixa do modal (.modal) não o fecham acidentalmente.
   */
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  /**
   * Fecha o modal ao pressionar a tecla Escape.
   * Comportamento acessível padrão para diálogos modais.
   */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* ── 5. Toggle de idioma ── */
  /**
   * Alterna o idioma entre PT e EN ao clicar em #langToggle.
   * Lê o idioma atual do atributo lang do elemento <html>
   * (mantido em sincronia por setLang) e inverte-o.
   * Usa 'pt' como fallback caso o atributo ainda não exista.
   */
  document.getElementById('langToggle').addEventListener('click', () => {
    const currentLang = document.documentElement.lang || 'pt';
    setLang(currentLang === 'pt' ? 'en' : 'pt');
  });

  /* ── 6. Navbar ── */
  /** Inicializa o comportamento de scroll e realce de link ativo. */
  initNavbar();

  /* ── 7. Menu mobile ── */
  /** Inicializa o hamburger e o menu dropdown mobile. */
  initHamburger();

  /* ── 8. Animações de scroll ── */
  /** Inicializa o IntersectionObserver para as animações .reveal. */
  initScrollReveal();

  /* ── 9. Rodapé ── */
  /** Preenche #year com o ano corrente. */
  initFooterYear();

});
