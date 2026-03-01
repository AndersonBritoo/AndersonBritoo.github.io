/**
 * @file footer.js
 * @module footer
 *
 * @description
 * Módulo responsável por inserir o ano corrente no elemento #year do rodapé.
 *
 * Elimina a necessidade de atualizar manualmente o ano a cada novo ano civil —
 * o valor é sempre calculado dinamicamente no momento em que a página é carregada,
 * garantindo que o copyright do rodapé se mantém sempre atualizado.
 *
 * Chamado por main.js durante a inicialização da página.
 */


/* =============================================
   INICIALIZAÇÃO DO ANO
============================================= */

/**
 * Preenche o elemento #year com o ano atual.
 *
 * Chamada por main.js durante a inicialização da página.
 * Usa new Date().getFullYear() para obter o ano corrente
 * diretamente do relógio do browser do utilizador.
 */
export function initFooterYear() {
  document.getElementById('year').textContent = new Date().getFullYear();
}
