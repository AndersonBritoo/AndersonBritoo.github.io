/**
 * @file ticker.js
 * @module ticker
 *
 * @description
 * Módulo responsável por construir o ticker horizontal de tecnologias
 * exibido na secção hero, imediatamente abaixo do conteúdo principal.
 *
 * O array `techs` é a fonte de dados estática do ticker — para adicionar
 * ou remover tecnologias, basta editar esta lista.
 *
 * A animação de scroll contínuo é gerida exclusivamente por CSS
 * (@keyframes ticker em style.css); este módulo apenas gera o HTML
 * e injeta-o no DOM.
 *
 * Chamado por main.js durante a inicialização da página.
 */


/* =============================================
   DADOS DAS TECNOLOGIAS
============================================= */

/**
 * Lista de tecnologias e ferramentas a exibir no ticker.
 * Editável livremente — cada string torna-se um item visível na faixa.
 *
 * @type {string[]}
 */
const techs = [
  'Python',
  'C#',
  'SQL',
  'JavaScript',
  'Arduino',
  'HTML',
  'CSS',
  'Hardware',
  'Git'
];


/* =============================================
   CONSTRUÇÃO DO TICKER
============================================= */

/**
 * Gera e injeta os itens do ticker no elemento #tickerTrack.
 *
 * Chamada por main.js durante a inicialização da página.
 *
 * Os itens são quadruplicados ([...techs × 4]) para garantir que a
 * faixa seja suficientemente longa para um loop contínuo sem espaço
 * em branco visível. A animação CSS (@keyframes ticker) desloca a
 * track -50% em loop infinito — ao atingir o fim do primeiro conjunto,
 * o segundo conjunto é visualmente idêntico ao início, tornando o
 * ciclo imperceptível ao utilizador.
 *
 * Cada item é composto por:
 *  - Um ponto decorativo (.dot) — separador visual entre itens
 *  - O nome da tecnologia em texto
 */
export function buildTicker() {
  const track = document.getElementById('tickerTrack');

  /* Duplica o array 4 vezes para garantir o loop contínuo sem gaps */
  const items = [...techs, ...techs, ...techs, ...techs];

  track.innerHTML = items.map(t => `
    <span class="ticker-item">
      <span class="dot"></span>${t}
    </span>
  `).join('');
}
