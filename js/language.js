/**
 * @file language.js
 * @module language
 *
 * @description
 * Módulo central de gestão do idioma do portfólio (PT/EN).
 *
 * Mantém o estado global do idioma ativo e expõe duas funções públicas:
 *  - getLang() → leitura do idioma atual por outros módulos
 *  - setLang() → alteração do idioma e atualização de toda a UI
 *
 * O sistema de tradução assenta em dois mecanismos complementares:
 *  1. Atributos data-pt / data-en em elementos HTML — atualizados
 *     automaticamente por setLang() via querySelectorAll('[data-pt]').
 *  2. Casos especiais (heroTitle, bio, goal, placeholders, footer)
 *     tratados explicitamente porque contêm HTML interno ou lógica
 *     de visibilidade (display toggle) em vez de simples textContent.
 *
 * Dependências:
 *  - projects.js → renderProjects() para re-renderizar os cartões
 *                  com o novo idioma após cada troca
 */

import { renderProjects } from './projects.js';


/* =============================================
   ESTADO DO IDIOMA
============================================= */

/**
 * Idioma atualmente ativo.
 * Inicializado como 'pt' (Português) — idioma padrão da página.
 * Alterado exclusivamente por setLang().
 *
 * @type {string}
 */
let lang = 'pt';


/* =============================================
   LEITURA DO IDIOMA
============================================= */

/**
 * Retorna o idioma atualmente ativo.
 *
 * Usado por outros módulos (projects.js, modal.js) que precisam
 * de saber o idioma sem importar diretamente a variável `lang`,
 * evitando dependências circulares entre módulos.
 *
 * @returns {string} Idioma ativo: 'pt' ou 'en'.
 */
export function getLang() {
  return lang;
}


/* =============================================
   ATUALIZAÇÃO DO IDIOMA
============================================= */

/**
 * Altera o idioma ativo e atualiza toda a interface para o novo idioma.
 *
 * Chamada pelo event listener do botão #langToggle, registado em main.js.
 *
 * Ações realizadas (por ordem):
 *  1. Atualiza a variável de estado `lang` e o atributo lang do <html>.
 *  2. Inverte o label do botão #langToggle (mostra o idioma alternativo).
 *  3. Percorre todos os elementos com data-pt/data-en e atualiza o
 *     textContent — com guarda para elementos com filhos HTML (SVG, spans),
 *     que seriam destruídos por uma atribuição direta de textContent.
 *  4. Reconstrói o heroTitle com innerHTML (contém a tag <em>).
 *  5. Alterna a visibilidade dos blocos de bio e objetivo:
 *     #bioPT / #bioEN e #goalPT / #goalEN.
 *  6. Chama renderProjects() para re-renderizar os cartões no novo idioma.
 *  7. Atualiza manualmente o span do botão de CV (tem filhos SVG).
 *  8. Atualiza os placeholders dos campos do formulário de contacto.
 *  9. Atualiza a mensagem de sucesso do formulário.
 * 10. Atualiza os textos do rodapé ("Feito com" / "por").
 *
 * @param {string} newLang - Novo idioma a aplicar: 'pt' ou 'en'.
 */
export function setLang(newLang) {
  lang = newLang;
  document.documentElement.lang = lang;

  /* ── 1. Label do botão de idioma ── */
  document.getElementById('langToggle').textContent = lang === 'pt' ? 'EN' : 'PT';

  /* ── 2. Atualização genérica via data-pt / data-en ── */
  /**
   * A guarda `el.children.length === 0` protege elementos que contêm
   * filhos (ex: botões com SVG + span) de terem o innerHTML destruído.
   * Esses elementos são atualizados individualmente nos passos seguintes.
   */
  document.querySelectorAll('[data-pt]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt) {
      if (el.children.length === 0) el.textContent = txt;
    }
  });

  /* ── 3. Título hero (contém HTML interno com <em>) ── */
  /**
   * heroTitle usa innerHTML porque contém a tag <em> para o estilo
   * itálico com gradiente do nome — não pode ser tratado como texto simples.
   */
  if (lang === 'pt') {
    document.getElementById('heroTitle').innerHTML = 'Olá, o meu nome é <em>Andérson</em>';
  } else {
    document.getElementById('heroTitle').innerHTML = 'Hi, my name is <em>Andérson</em>';
  }

  /* Subtítulo hero — mantido em inglês em ambos os idiomas (universalmente reconhecido) */

  /* ── 4. Bio e objetivo profissional (toggle de visibilidade) ── */
  /**
   * Bio e objetivo existem em duplicado no DOM (PT e EN).
   * A troca de idioma alterna o display entre os dois pares,
   * preservando o HTML de cada versão sem substituir conteúdo.
   */
  document.getElementById('bioPT').style.display  = lang === 'pt' ? '' : 'none';
  document.getElementById('bioEN').style.display  = lang === 'en' ? '' : 'none';
  document.getElementById('goalPT').style.display = lang === 'pt' ? '' : 'none';
  document.getElementById('goalEN').style.display = lang === 'en' ? '' : 'none';

  /* ── 5. Re-renderização dos cartões de projeto ── */
  renderProjects();

  /* ── 6. Botão de CV (tem filhos SVG, não abrangido pela atualização genérica) ── */
  const cvBtn = document.getElementById('cvBtn');
  cvBtn.querySelector('span').textContent = lang === 'pt' ? 'Baixar CV' : 'Download CV';

  /* ── 7. Placeholders do formulário de contacto ── */
  const inputName = document.getElementById('inputName');
  if (inputName) inputName.placeholder = lang === 'pt' ? 'O teu nome'         : 'Your name';

  const inputSubject = document.getElementById('inputSubject');
  if (inputSubject) inputSubject.placeholder = lang === 'pt' ? 'Sobre o quê'  : 'About what?';

  const inputMessage = document.getElementById('inputMessage');
  if (inputMessage) inputMessage.placeholder = lang === 'pt' ? 'A tua mensagem...' : 'Your message..';

  /* ── 8. Mensagem de sucesso do formulário ── */
  const successMsg = document.getElementById('successMsg');
  if (successMsg) successMsg.textContent = successMsg.getAttribute('data-' + lang);
}
