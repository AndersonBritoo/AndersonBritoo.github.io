/**
 * @file navbar.js
 * @module navbar
 *
 * @description
 * Módulo responsável por dois comportamentos da navbar em resposta
 * ao scroll do utilizador:
 *
 *  1. Fundo fosco (.scrolled): aplica backdrop-blur e sombra à navbar
 *     quando a página desce além de 20px, tornando-a legível sobre
 *     qualquer conteúdo de fundo.
 *
 *  2. Link ativo (.active): destaca o link de navegação correspondente
 *     à secção atualmente visível, com base na posição de scroll.
 *
 * Chamado por main.js durante a inicialização da página.
 */


/* =============================================
   INICIALIZAÇÃO DA NAVBAR
============================================= */

/**
 * Regista o listener de scroll que controla o estilo da navbar
 * e o realce do link de navegação ativo.
 *
 * Chamada uma única vez por main.js no carregamento da página.
 *
 * Comportamento ao scroll:
 *  - Adiciona a classe .scrolled à navbar quando scrollY > 20px;
 *    remove-a ao regressar ao topo. O estilo .scrolled aplica
 *    backdrop-filter:blur e box-shadow (definidos em style.css).
 *  - Percorre todas as <section id="..."> para determinar qual está
 *    visível: a última secção cujo offsetTop é inferior ou igual a
 *    scrollY + 120px é considerada a secção ativa. O offset de 120px
 *    compensa a altura da navbar fixa e antecipa a transição.
 *  - Aplica .active ao link cujo href coincide com a secção ativa.
 */
export function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {

    /* ── Fundo fosco ── */
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    /* ── Link ativo baseado na posição de scroll ── */
    /**
     * O loop sobrepõe `current` a cada secção cujo offsetTop já foi
     * ultrapassado — o último valor atribuído a `current` é, portanto,
     * a secção mais abaixo que está acima da posição de scroll atual.
     * O offset -120px compensa a altura fixa da navbar (#navbar height = 70px)
     * e adiciona uma margem de antecipação para uma transição mais fluida.
     */
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

  });
}
