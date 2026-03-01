/**
 * @file hamburger.js
 * @module hamburger
 *
 * @description
 * Módulo responsável pelo comportamento do menu de navegação mobile.
 *
 * Controla a abertura/fecho do menu dropdown (#mobileMenu) e a animação
 * do ícone hamburger (três linhas horizontais) → X (duas diagonais cruzadas),
 * aplicada via estilos CSS inline diretamente nos três <span> do botão.
 *
 * Chamado por main.js durante a inicialização da página.
 * Apenas relevante em viewports mobile onde o hamburger é visível
 * (controlado por CSS em @media max-width: 768px).
 */


/* =============================================
   INICIALIZAÇÃO DO MENU MOBILE
============================================= */

/**
 * Regista os event listeners necessários para o funcionamento do menu mobile.
 *
 * Chamada uma única vez por main.js no carregamento da página.
 *
 * Comportamentos registados:
 *  - Clique no hamburger: alterna o estado aberto/fechado do menu (#mobileMenu)
 *    e anima os três <span> para formar o ícone X (aberto) ou
 *    reverter para as três linhas horizontais (fechado).
 *  - Clique num link do menu: fecha o menu e reverte a animação do ícone,
 *    permitindo que o scroll suave para a secção ocorra sem o menu sobreposto.
 *
 * A flag local `menuOpen` mantém o estado do menu para que cada clique
 * inverta o estado anterior sem necessidade de consultar o DOM.
 *
 * Animação hamburger → X:
 *  - span[0]: roda 45° e desce  → forma a diagonal superior do X
 *  - span[1]: opacidade 0       → a linha do meio desaparece
 *  - span[2]: roda -45° e sobe  → forma a diagonal inferior do X
 * Ao fechar, os estilos inline são limpos para que o CSS base retome.
 */
export function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let   menuOpen   = false;

  /* ── Clique no botão hamburger ── */
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);

    const spans = hamburger.querySelectorAll('span');

    if (menuOpen) {
      /* Transforma as três linhas no ícone X */
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      /* Reverte para as três linhas horizontais, limpando os estilos inline */
      spans.forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    }
  });

  /* ── Clique num link do menu mobile ── */
  /**
   * Fecha o menu e reverte o ícone hamburger quando um link é clicado.
   * Necessário para que o scroll suave para a secção não fique bloqueado
   * pelo menu sobreposto ao conteúdo.
   */
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });
}
