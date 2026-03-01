/**
 * @file scrollReveal.js
 * @module scrollReveal
 *
 * @description
 * Módulo responsável pelas animações de entrada dos elementos
 * à medida que entram no viewport durante o scroll da página.
 *
 * Funciona em conjunto com as classes CSS definidas em style.css:
 *  - .reveal         → estado inicial: opacity:0, translateY(32px)
 *  - .reveal.visible → estado final:   opacity:1, translateY(0)
 *
 * A transição entre os dois estados é gerida exclusivamente por CSS
 * (transition: opacity 0.7s ease, transform 0.7s ease).
 * Este módulo apenas adiciona a classe .visible no momento certo,
 * delegando toda a animação ao motor CSS do browser.
 *
 * Chamado por main.js durante a inicialização da página.
 */


/* =============================================
   INICIALIZAÇÃO DO SCROLL REVEAL
============================================= */

/**
 * Cria um IntersectionObserver que aplica a classe .visible
 * a cada elemento .reveal quando este entra no viewport.
 *
 * Chamada uma única vez por main.js no carregamento da página.
 *
 * Configuração do observer:
 *  - threshold: 0.12 → a animação é ativada quando 12% do elemento
 *    está visível. Evita ativação prematura antes do utilizador
 *    realmente ver o conteúdo, sem atrasar demasiado a animação.
 *
 * Após adicionar .visible, o elemento é removido da observação
 * (unobserve) para evitar processamento desnecessário — a animação
 * de entrada ocorre apenas uma vez por elemento.
 */
export function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        /* Remove da observação: cada elemento anima apenas uma vez */
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  /* Regista todos os elementos .reveal existentes no DOM */
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
