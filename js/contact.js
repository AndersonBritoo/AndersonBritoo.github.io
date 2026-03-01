/**
 * @file contact.js
 * @module contact
 *
 * @description
 * Módulo responsável pela submissão do formulário de contacto.
 *
 * Exporta a função submitForm, referenciada diretamente no atributo
 * onsubmit do elemento <form id="contactForm"> em index.html.
 * A função está também exposta em window.submitForm por main.js,
 * pois os ES Modules têm escopo isolado e não são acessíveis inline no HTML.
 *
 * O envio é realizado via EmailJS, utilizando:
 *  - Service ID:  "service_lmnys1o"
 *  - Template ID: "template_o9lnlfr"
 * A biblioteca EmailJS é carregada e inicializada no <head> do index.html.
 *
 * Fluxo de submissão:
 *  1. Previne o comportamento padrão do formulário (recarregamento da página).
 *  2. Desativa o botão de envio e atualiza o texto para "A enviar...".
 *  3. Chama emailjs.sendForm() com os dados do formulário.
 *  4. Em caso de sucesso: limpa o formulário, oculta-o e exibe #formSuccess.
 *  5. Em caso de erro: reativa o botão, restaura o texto e exibe um alerta.
 */


/* =============================================
   SUBMISSÃO DO FORMULÁRIO
============================================= */

/**
 * Trata a submissão do formulário de contacto via EmailJS.
 *
 * Chamada pelo atributo onsubmit do #contactForm em index.html.
 * Exposta em window.submitForm por main.js.
 *
 * @param {Event} e - Evento de submissão do formulário (submit).
 *                    Usado para prevenir o comportamento padrão (e.preventDefault).
 */
export function submitForm(e) {
  e.preventDefault();

  /* Referências aos elementos do formulário */
  const form       = document.getElementById('contactForm');
  const success    = document.getElementById('formSuccess');
  const button     = form.querySelector('button[type="submit"]');
  const buttonText = button.querySelector('span');

  /* Desativa o botão durante o envio para evitar submissões duplicadas */
  button.disabled       = true;
  buttonText.textContent = 'A enviar...';

  /* ── Envio via EmailJS ── */
  emailjs.sendForm(
    'service_lmnys1o',  /* Service ID configurado no painel do EmailJS */
    'template_o9lnlfr', /* Template ID com os campos name, email, subject, message */
    form
  )
  .then(() => {
    /* Sucesso: limpa o formulário, oculta-o e exibe a mensagem de confirmação */
    form.reset();
    form.style.display    = 'none';
    success.style.display = 'block';
  })
  .catch((error) => {
    /* Erro: regista no console, reativa o botão e informa o utilizador */
    console.error('Erro EmailJS:', error);

    button.disabled        = false;
    buttonText.textContent = 'Enviar mensagem';

    alert('Ocorreu um erro ao enviar a mensagem.');
  });
}
