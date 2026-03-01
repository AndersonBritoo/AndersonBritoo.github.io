/**
 * @file data.js
 * @module data
 *
 * @description
 * Módulo de dados estáticos dos projetos do portfólio.
 *
 * Exporta o array `projects`, consumido por outros módulos:
 *  - projects.js → gera os cartões do slider na secção Projects
 *  - modal.js    → popula o modal de detalhe ao clicar num cartão
 *
 * Cada projeto suporta bilingue (PT/EN) nos campos de texto,
 * usando objetos `{ pt: "...", en: "..." }`. Os módulos consumidores
 * selecionam a língua correta via getLang() de language.js.
 *
 * Para adicionar um novo projeto ao portfólio, basta inserir um novo
 * objeto no array `projects` seguindo a estrutura dos existentes.
 */


/* =============================================
   ARRAY DE PROJETOS
============================================= */

/**
 * Lista de todos os projetos a apresentar no portfólio.
 *
 * @type {Array<{
 *   id:          number,
 *   title:       { pt: string, en: string },
 *   desc:        { pt: string, en: string },
 *   tech:        string[],
 *   gradient:    string,
 *   icon:        string,
 *   description: { pt: string, en: string },
 *   learned:     { pt: string, en: string },
 *   github:      string,
 *   demo:        string
 * }>}
 *
 * Propriedades de cada projeto:
 *  @property {number} id          - Identificador único; usado por modal.js para localizar o projeto.
 *  @property {object} title       - Título do projeto em PT e EN.
 *  @property {object} desc        - Descrição curta exibida no cartão do slider, em PT e EN.
 *  @property {string[]} tech      - Stack tecnológica; renderizada como tags no cartão e no modal.
 *  @property {string} gradient    - Gradiente CSS para o fundo do placeholder do cartão.
 *  @property {string} icon        - Emoji representativo exibido no placeholder quando não há imagem.
 *  @property {object} description - Descrição longa exibida no modal de detalhe, em PT e EN.
 *  @property {object} learned     - O que foi aprendido no projeto (secção do modal), em PT e EN.
 *  @property {string} github      - URL do repositório GitHub; string vazia se não aplicável.
 *  @property {string} demo        - URL da demo ao vivo; string vazia se não existir.
 */
export const projects = [
  {
    id: 1,
    title: {
      pt: "Quiz Fernando Pessoa",
      en: "Quiz Fernando Pessoa"
    },
    desc: {
      pt: "Aplicação mobile em Pygame com perguntas dinâmicas sobre Fernando Pessoa.",
      en: "Pygame mobile application with dynamic questions about Fernando Pessoa."
    },
    tech:     ["PyGame", "SQL"],
    gradient: "linear-gradient(135deg,#1a1a3e,#3b1a5c)",
    icon:     "📚",
    description: {
      pt: "Sistema completo de gestão de biblioteca com autenticação de utilizadores, catálogo de livros, controlo de empréstimos e relatórios. Construído com Python no backend e uma interface web responsiva.",
      en: "Complete library management system with user authentication, book catalog, loan tracking, and reports. Built with Python on the backend and a responsive web interface."
    },
    learned: {
      pt: "Aprendi integração com bases de dados, estrutura modular em Python e desenvolvimento de interfaces gráficas com Pygame.",
      en: "Learned database integration, modular Python structure, and GUI development with Pygame."
    },
    github: "https://github.com/AndersonBritoo/quiz-fernando-pessoa",
    demo:   ""
  },
  {
    id: 2,
    title: {
      pt: "Monitor Arduino IoT",
      en: "Arduino IoT Monitor"
    },
    desc: {
      pt: "Dashboard em tempo real para sensores Arduino com visualização de dados.",
      en: "Real-time dashboard for Arduino sensors with data visualization."
    },
    tech:     ["Arduino", "JavaScript", "C#", "Networking"],
    gradient: "linear-gradient(135deg,#0f3460,#16213e)",
    icon:     "🔌",
    description: {
      pt: "Sistema de monitorização IoT que lê dados de sensores Arduino (temperatura, humidade, luz) e exibe em tempo real num dashboard web com gráficos interativos.",
      en: "IoT monitoring system that reads data from Arduino sensors (temperature, humidity, light) and displays it in real-time on a web dashboard with interactive charts."
    },
    learned: {
      pt: "Aprendi comunicação serial, WebSockets para atualizações em tempo real e visualização de dados com bibliotecas JS.",
      en: "I learned serial communication, WebSockets for real-time updates, and data visualization with JS libraries."
    },
    github: "https://github.com/",
    demo:   ""
  },
  {
    id: 3,
    title: {
      pt: "E-commerce Simples",
      en: "Simple E-commerce"
    },
    desc: {
      pt: "Plataforma de loja online com carrinho e gestão de produtos.",
      en: "Online store platform with cart and product management."
    },
    tech:     ["JavaScript", "HTML", "CSS", "SQL"],
    gradient: "linear-gradient(135deg,#1a3a1a,#0f2d0f)",
    icon:     "🛒",
    description: {
      pt: "Aplicação de e-commerce com listagem de produtos, filtragem por categoria, carrinho de compras, e painel de administração para gerir stock e encomendas.",
      en: "E-commerce application with product listing, category filtering, shopping cart, and admin panel to manage stock and orders."
    },
    learned: {
      pt: "Aprendi gestão de estado no frontend, design de bases de dados para e-commerce e integração de sistemas de pagamento (sandbox).",
      en: "I learned state management in the frontend, database design for e-commerce, and payment system integration (sandbox)."
    },
    github: "https://github.com/",
    demo:   "https://demo.example.com"
  },
  {
    id: 4,
    title: {
      pt: "Network Scanner",
      en: "Network Scanner"
    },
    desc: {
      pt: "Ferramenta CLI para scan de redes e detecção de dispositivos.",
      en: "CLI tool for network scanning and device detection."
    },
    tech:     ["Python", "Networking", "Hardware"],
    gradient: "linear-gradient(135deg,#1a0f2e,#2d0f1a)",
    icon:     "📡",
    description: {
      pt: "Ferramenta de linha de comando que realiza scan de redes locais, identifica dispositivos conectados, verifica portas abertas e gera relatórios de segurança básicos.",
      en: "Command-line tool that scans local networks, identifies connected devices, checks open ports, and generates basic security reports."
    },
    learned: {
      pt: "Aprendi protocolos de rede, programação de sockets em Python e fundamentos de cibersegurança.",
      en: "I learned network protocols, socket programming in Python, and cybersecurity fundamentals."
    },
    github: "https://github.com/",
    demo:   ""
  },
  {
    id: 5,
    title: {
      pt: "App de Tarefas",
      en: "Task App"
    },
    desc: {
      pt: "Aplicação de gestão de tarefas com categorias e prioridades.",
      en: "Task management app with categories and priorities."
    },
    tech:     ["JavaScript", "HTML", "CSS"],
    gradient: "linear-gradient(135deg,#1a1000,#2d2000)",
    icon:     "✅",
    description: {
      pt: "Aplicação web de gestão de tarefas com drag-and-drop, categorias, prioridades, prazos e armazenamento local. Interface limpa e responsiva.",
      en: "Web task management application with drag-and-drop, categories, priorities, deadlines, and local storage. Clean and responsive interface."
    },
    learned: {
      pt: "Aprendi JavaScript avançado (Drag and Drop API), gestão de estado sem frameworks e princípios de UX/UI.",
      en: "I learned advanced JavaScript (Drag and Drop API), state management without frameworks, and UX/UI principles."
    },
    github: "https://github.com/",
    demo:   "https://demo.example.com"
  }
];
