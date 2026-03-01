# Portfólio Pessoal

## Descrição Geral

Este repositório contém o código-fonte de um website de portfólio pessoal.
O projeto está atualmente **em desenvolvimento** e será atualizado de forma contínua à medida que novas funcionalidades forem implementadas e o conteúdo for evoluindo.

---

## Objetivo do Projeto

O objetivo principal é criar um espaço na web para apresentar informações profissionais, projetos e competências de forma organizada e acessível.

O projeto serve também como exercício prático de aprendizagem — tanto na construção do website em si, como na aplicação de boas práticas de desenvolvimento e organização de código.

---

## Tecnologias Utilizadas

O projeto é construído com tecnologias web fundamentais, sem dependência de frameworks externos:

- **HTML** — estrutura e marcação do conteúdo
- **CSS** — estilos e layout responsivo
- **JavaScript** — interatividade e comportamento da página

Bibliotecas externas utilizadas via CDN:
- **PDF.js** — renderização de documentos PDF diretamente no browser
- **EmailJS** — envio de formulários de contacto sem servidor próprio

---

## Como Executar o Projeto

Por ser um projeto de frontend estático, não é necessária qualquer instalação ou configuração de ambiente.

**Passos:**

1. Faça o clone ou download deste repositório.
2. Abra o ficheiro `index.html` diretamente no seu browser.

> **Nota:** Algumas funcionalidades (como o envio de formulários ou o carregamento de PDFs) podem requerer um servidor local para funcionar corretamente. Nesse caso, pode utilizar a extensão **Live Server** no VS Code ou qualquer servidor HTTP simples.

---

## Estrutura do Projeto

```
portfolio/
│
├─ assets/                             # Recursos estáticos
│  └─ CV_Anderson_Brito_FullStack.pdf  # Curriculum Vitae em PDF
│
├─ css/
│  └─ style.css                   # Estilos globais, design tokens, layout e animações
│
├─ js/
│  ├─ main.js                     # Ponto de entrada — orquestra todos os módulos
│  ├─ data.js                     # Dados estáticos dos projetos (títulos, descrições, links)
│  ├─ projects.js                 # Renderização dos cartões e controlo do slider de projetos
│  ├─ modal.js                    # Abertura e fecho do modal de detalhe de projeto
│  ├─ pdfModal.js                 # Viewer de CV em PDF com canvas + text layer + annotation layer
│  ├─ language.js                 # Gestão do idioma ativo (PT/EN) e atualização da interface
│  ├─ navbar.js                   # Comportamento da navbar ao scroll e realce do link ativo
│  ├─ hamburger.js                # Menu mobile e animação do ícone hamburger → X
│  ├─ scrollReveal.js             # Animações de entrada dos elementos ao fazer scroll
│  ├─ contact.js                  # Submissão do formulário de contacto via EmailJS
│  ├─ footer.js                   # Preenchimento dinâmico do ano no rodapé
│  └─ ticker.js                   # Construção do ticker horizontal de tecnologias
│
├─ index.html                     # Página principal (estrutura HTML da SPA)
├─ .gitgnore
├─ LICENSE
└─ README.md
```

---

## Observações Finais

- Este projeto está em **fase de desenvolvimento ativo**. Funcionalidades e conteúdos podem mudar a qualquer momento.
- O código é pessoal e tem também um propósito educativo — algumas decisões de implementação foram tomadas com o objetivo de aprender, e não necessariamente por serem as mais eficientes.
- Contribuições externas não estão previstas neste momento, mas feedback é sempre bem-vindo.