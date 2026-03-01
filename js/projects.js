/**
 * @file projects.js
 * @module projects
 *
 * @description
 * Módulo responsável pela renderização dos cartões de projeto
 * e pelo controlo do slider horizontal na secção Projects.
 *
 * O estado do slider (slideIndex, cardsPerView) é mantido no
 * escopo do módulo — não é global nem partilhado com outros módulos.
 *
 * Funções exportadas:
 *  - renderProjects()  → gera o HTML dos cartões no DOM
 *  - updateSlider()    → recalcula posição e limites do slider
 *  - slidePrev()       → navega para o cartão anterior
 *  - slideNext()       → navega para o cartão seguinte
 *  - getCardsPerView() → determina quantos cartões cabem no viewport
 *
 * Dependências:
 *  - data.js     → array de projetos
 *  - language.js → idioma ativo (getLang)
 */

import { projects } from './data.js';
import { getLang }  from './language.js';


/* =============================================
   ESTADO DO SLIDER
============================================= */

/**
 * Índice do primeiro cartão visível no slider.
 * Incrementado por slideNext() e decrementado por slidePrev().
 * Corrigido por updateSlider() se exceder o maxIndex após redimensionamento.
 *
 * @type {number}
 */
let slideIndex = 0;

/**
 * Número de cartões visíveis em simultâneo no slider.
 * Atualizado por getCardsPerView() ao renderizar e ao redimensionar.
 *
 * @type {number}
 */
let cardsPerView = 3;


/* =============================================
   CÁLCULO DE CARTÕES POR VIEWPORT
============================================= */

/**
 * Determina quantos cartões devem ser visíveis com base na
 * largura atual do viewport.
 *
 * Os breakpoints estão alinhados com as media queries definidas
 * em style.css:
 *  - ≤ 768px  → 1 cartão (mobile)
 *  - ≤ 1024px → 2 cartões (tablet)
 *  - > 1024px → 3 cartões (desktop)
 *
 * @returns {number} Número de cartões visíveis: 1, 2 ou 3.
 */
export function getCardsPerView() {
  if (window.innerWidth <= 768)  return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}


/* =============================================
   RENDERIZAÇÃO DOS CARTÕES
============================================= */

/**
 * Gera e injeta o HTML de todos os cartões de projeto em #sliderTrack,
 * no idioma atualmente ativo (getLang()).
 *
 * Chamada por:
 *  - main.js     → na inicialização da página
 *  - language.js → após cada troca de idioma (para atualizar os textos)
 *
 * O atributo onclick de cada cartão chama `window.openModal(id)`.
 * A função openModal está exposta em window por main.js, pois os
 * ES Modules têm escopo isolado e não são acessíveis inline no HTML.
 *
 * Após gerar o HTML, chama updateSlider() para garantir que o
 * estado visual do slider é consistente com o novo conteúdo.
 */
export function renderProjects() {
  const lang  = getLang();
  const track = document.getElementById('sliderTrack');

  track.innerHTML = projects.map(p => `
    <div class="project-card" onclick="openModal(${p.id})">
      <div class="project-img-placeholder" style="background:${p.gradient}">
        <span style="font-size:3rem;">${p.icon}</span>
      </div>
      <div class="project-card-body">
        <h3 class="project-card-title">${p.title[lang]}</h3>
        <p class="project-card-desc">${p.desc[lang]}</p>
        <div class="tag-list">
          ${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  updateSlider();
}


/* =============================================
   CONTROLO DO SLIDER
============================================= */

/**
 * Recalcula cardsPerView e reposiciona a track do slider via
 * transform:translateX() para mostrar o cartão no slideIndex atual.
 *
 * Chamada por:
 *  - renderProjects() → após gerar novo conteúdo
 *  - main.js          → ao redimensionar a janela (evento resize)
 *  - slidePrev()      → após decrementar slideIndex
 *  - slideNext()      → após incrementar slideIndex
 *
 * A largura de deslocamento por passo é calculada a partir do
 * offsetWidth do primeiro cartão acrescido do gap fixo de 24px
 * (definido em CSS via .slider-track gap).
 *
 * slideIndex é corrigido automaticamente se exceder o novo maxIndex
 * após um redimensionamento que aumentou cardsPerView.
 */
export function updateSlider() {
  cardsPerView = getCardsPerView();

  const track = document.getElementById('sliderTrack');
  const cards = track.querySelectorAll('.project-card');
  if (!cards.length) return;

  const cardW    = cards[0].offsetWidth + 24; /* gap = 24px, conforme CSS */
  const maxIndex = Math.max(0, projects.length - cardsPerView);

  /* Corrige slideIndex se exceder o limite após redimensionamento */
  if (slideIndex > maxIndex) slideIndex = maxIndex;

  track.style.transform = `translateX(-${slideIndex * cardW}px)`;
}

/**
 * Recua o slider um cartão, se não estiver já no primeiro cartão.
 *
 * Chamada pelo clique no botão #prevBtn, registado em main.js.
 * Não tem efeito se slideIndex já for 0 (início do slider).
 */
export function slidePrev() {
  if (slideIndex > 0) {
    slideIndex--;
    updateSlider();
  }
}

/**
 * Avança o slider um cartão, se não tiver atingido o último cartão visível.
 *
 * O limite máximo é calculado como `projects.length - cardsPerView`,
 * garantindo que o último grupo de cartões fica completamente visível.
 *
 * Chamada pelo clique no botão #nextBtn, registado em main.js.
 */
export function slideNext() {
  cardsPerView = getCardsPerView();
  if (slideIndex < projects.length - cardsPerView) {
    slideIndex++;
    updateSlider();
  }
}
