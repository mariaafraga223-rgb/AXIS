/* ============================================================
   AXIS, sitio multipágina · vanilla
   Chrome compartido (header/footer) inyectado + i18n + comportamientos
   ============================================================ */

/* ---------- 0. Config del sitio ---------- */
const SITE = {
  prototype: "https://www.figma.com/proto/AIfOQhoTMu2t0PU6HZ3LBQ/AXIS?node-id=1085-5178&t=FnMb1fi6BWgk1GdY-1",
  whatsapp:  "https://wa.me/34674209788",
  portfolio: "https://bymariafraga.myportfolio.com",
  socials: {
    behance:   "https://www.behance.net/mariafraga3",
    linkedin:  "https://es.linkedin.com/in/maría-fraga-alonso-6b1128278/es",
    instagram: "https://www.instagram.com/bymariafraga",
    whatsapp:  "https://wa.me/34674209788"
  },
  nav: [
    { page: "home",    href: "index.html",   key: "nav.home" },
    { page: "about",   href: "about.html",   key: "nav.about" },
    { page: "system",  href: "system.html",  key: "nav.system" },
    { page: "who",     href: "who.html",     key: "nav.who" },
    { page: "contact", href: "contact.html", key: "nav.contact" }
  ]
};

const LOGO = `<svg class="brand__logo" viewBox="0 0 147.83 50.6" aria-label="axis" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M50.6,4.97V0H0v25.3h.66c13.61,0,24.65-11.03,24.65-24.65v24.65h4.97c11.23,0,20.33-9.1,20.33-20.33Z"/>
  <path d="M20.33,25.3C9.1,25.3,0,34.41,0,45.64v4.97h50.6v-25.3h-.66c-13.61,0-24.65,11.03-24.65,24.65v-24.65h-4.97Z"/>
  <path d="M87.96,31.1v-11c0-4.76-3.48-7.49-9.56-7.49-6.38,0-10.28,3.16-10.43,8.44v.49s4.59,0,4.59,0l.03-.44c.24-3.13,2.17-4.65,5.9-4.65,4.55,0,5.16,1.84,5.16,3.65,0,1.22-.45,1.88-2.99,2.33l-5.82.96c-4.96.82-7.37,3.22-7.37,7.35,0,4.4,3.08,7.13,8.04,7.13,4.64,0,7.01-2.32,8.19-4.32.05,1.07.14,2.15.28,3.3l.05.42h4.24l-.04-.52c-.19-2.31-.27-4.05-.27-5.65ZM83.65,24.82v1.11c0,3.73-1.95,8.1-7.45,8.1-1.22,0-4.06-.33-4.06-3.42,0-2.15,1.17-3.23,4.16-3.84l3.81-.78c1.44-.3,2.55-.61,3.55-1.16Z"/>
  <polygon points="114.82 13.39 109.43 13.39 102.93 22.1 96.43 13.39 90.76 13.39 100.03 25.23 90.58 37.27 95.92 37.27 102.79 28.22 109.66 37.27 115.29 37.27 105.65 25.14 114.82 13.39"/>
  <rect x="118.26" y="13.39" width="4.62" height="23.88"/>
  <rect x="118.26" y="5.89" width="4.62" height="4.62"/>
  <path d="M147.83,30.56c0,2.99-1.32,6.49-7.18,7.28-.78.1-1.65.16-2.61.16-2.85,0-4.97-.5-6.56-1.3-2.28-1.12-3.44-2.85-4.01-4.55-.35-1.06-.47-2.12-.49-3.01v-.48s4.31,0,4.31,0l.03.44c.26,3.47,2.49,5.15,6.82,5.15,4.57,0,5.16-1.88,5.16-3.51v-.14c0-.08,0-.15-.01-.22-.14-1.72-1.28-2.62-3.75-2.97l-5.32-.78c-.89-.12-1.71-.32-2.43-.6-2.74-1.03-4.22-3.12-4.22-6.06,0-4.32,3.17-7.01,8.55-7.33.3-.02.61-.03.92-.03h.18c.45.01.89.03,1.32.06.23.02.45.04.67.07.44.06.87.13,1.28.22.62.14,1.2.32,1.74.53.05.02.09.04.14.06.25.1.5.22.73.34.26.13.51.27.74.42.05.03.09.06.13.09.22.14.42.29.62.45.11.09.22.18.33.28.1.1.21.19.3.29.1.11.2.21.29.31.1.11.19.22.28.33.08.11.17.22.25.34.08.11.16.23.23.35.15.24.28.49.41.75.24.52.43,1.08.56,1.67.14.59.21,1.22.23,1.88v.49s-4.59,0-4.59,0l-.03-.44c-.25-3.13-2.17-4.65-5.9-4.65-.97,0-1.77.08-2.42.23-.01,0-.02,0-.04,0-2.33.57-2.7,2-2.7,3.41,0,1.07.34,1.71,2.11,2.15h.02c.39.16.86.28,1.44.36l3.49.49,1.75.29c3.09.51,5.2,1.64,6.33,3.41.08.12.15.23.2.35.47.96.7,2.09.7,3.41Z"/>
</svg>`;

/* ---------- 1. Diccionario i18n (EN por defecto · ES) ---------- */
const I18N = {
  en: {
    "nav.home": "Home", "nav.about": "About", "nav.system": "System", "nav.who": "Who it’s for", "nav.contact": "Contact",
    "cta.prototype": "Try the prototype",

    "ct.label": "Contact",
    "ct.intro": "Let’s talk, tell me about your project, or just say hi.",
    "ct.directlabel": "Reach me directly",
    "ct.formlabel": "Send a message",
    "ct.name": "Name", "ct.email": "Email", "ct.msg": "Message",
    "ct.namePh": "Your name", "ct.emailPh": "you@email.com", "ct.msgPh": "What would you like to talk about?",
    "ct.send": "Send message",
    "ct.sent": "Thanks, your message has been sent.",

    "hero.tagline": "Design with direction.",
    "hero.l1": "AI will <em>not</em> replace you,",
    "hero.l2": "at least if you don’t let it.",
    "hero.sub": "Axis helps designers integrate AI into their creative process, with direction, structure and criteria.",
    "hero.cta_secondary": "See how it works",

    "marquee.label": "Learn how to integrate these in your design process",

    "about.label": "About axis",
    "about.text": "Designers are using more AI tools than ever, but switching between tools isn’t a process. <span class=\"hl\">The real problem isn’t access. It’s direction.</span> Axis turns the scattered use of AI into a <span class=\"hl\">structured, evaluable design practice.</span>",
    "about.note": "Final Degree Project in Design bymariafraga",

    "who.heading": "Who it’s for",
    "w1.title": "You haven’t integrated it yet",
    "w1.body": "You distrust AI’s impact on authorship and judgment. You need clear evidence before adopting it. Axis shows you how, without giving up control.",
    "w1.link": "See the method",
    "w2.title": "You try, but without structure",
    "w2.body": "You’re curious and you experiment, but you get lost among tools and inconsistent results. Axis gives you the map you’re missing.",
    "w2.link": "Start with the phases",
    "w3.title": "You use it, but don’t document it",
    "w3.body": "You integrate AI across phases, but intuitively, with no criteria to evaluate or standardize. Axis makes your process traceable and repeatable.",
    "w3.link": "See the system",

    "phases.heading": "The method",
    "phases.tag": "Prompting is not designing.<br>Creative direction is.",
    "phases.rowlink": "See in the system",
    "f1.label": "Explore & Discover", "f1.cat": "Divergence",
    "f1.body": "Research, review references and surface the first questions. AI opens the field; you decide what to look at.",
    "f2.label": "Define & Reframe", "f2.cat": "Convergence",
    "f2.body": "Cluster findings, spot patterns and frame insights. AI orders; judgment defines.",
    "f3.label": "Ideate & Develop", "f3.cat": "Divergence",
    "f3.body": "Moodboards, visual styles and formal variations in minutes. More paths, without early fixation.",
    "f4.label": "Prototype & Validate", "f4.cat": "Convergence",
    "f4.body": "Organize feedback, synthesize tests and detect recurring issues. AI measures; you interpret.",

    "system.heading": "The system",
    "system.explore": "Explore the system",
    "c1.cat": "Start",     "c1.desc": "Quick tips, shortcuts and featured cases, in one place.",
    "c2.cat": "Practice",  "c2.desc": "The what, the when and the how, in one place.",
    "c3.cat": "Knowledge", "c3.desc": "Phase guides, glossary and when to use AI, in context.",
    "c4.cat": "Community", "c4.desc": "Documented cases, projects and comments, from real designers.",
    "card.link": "Explore",

    /* ABOUT */
    "ab.label": "About axis",
    "ab.intro": "Axis was born from a simple observation: <span class=\"hl\">AI is already part of how designers work, but it’s used without structure.</span> This project investigates where AI adds real value, where human judgment stays decisive, and <span class=\"hl\">how to build a hybrid path that joins both.</span>",
    "ab.meet": "Meet the designer",
    "ab.role": "Designer · Author of Axis",
    "ab.bio": "María Fraga Alonso is a designer working across brand identity, packaging, editorial and photography. Axis is her Final Degree Project for the Design degree at Universidad Complutense de Madrid (2025–2026), tutored by David Alonso Urbano, an investigation into how designers can integrate AI into their process with method and criteria.",
    "ab.project": "The project",
    "ab.dlTitle": "Download the full thesis", "ab.dlMeta": "PDF · ~1.7 MB",
    "ab.f1k": "Degree", "ab.f1v": "BA in Design, UCM",
    "ab.f2k": "Year", "ab.f2v": "2025–2026",
    "ab.f3k": "Tutor", "ab.f3v": "David Alonso Urbano",
    "ab.f4k": "Type", "ab.f4v": "Final Degree Project",
    "ab.c1t": "Objectives", "ab.c1b": "Map where AI adds value and where judgment is decisive, then turn those learnings into a system designers can actually use.",
    "ab.c2t": "Methodology", "ab.c2b": "User-centered design across the double diamond, research, define, ideate and validate, grounded in literature and real designers.",
    "ab.c3t": "Values", "ab.c3b": "Criterion before speed. Autonomy before dependence. Transparency before magic.",

    /* SYSTEM (prototype · dark) */
    "sy.s1label": "The prototype",
    "sy.s1": "Axis is delivered as a <span class=\"hl\">high-fidelity, navigable prototype.</span> It organizes the whole experience by design phase, giving designers tools and evaluation criteria for the exact moment they’re in, <span class=\"hl\">so AI supports the process without replacing the judgment.</span>",
    "sy.label": "The system",
    "sy.tag": "Four areas. One coherent flow.",
    "sy.r1tag": "The start", "sy.r1body": "Quick tips, shortcuts and featured cases, in one place.",
    "sy.r2tag": "The hub", "sy.r2body": "The what, the when and the how, in one place.",
    "sy.r3tag": "The ground", "sy.r3body": "Phase guides, glossary and when to use AI, in context.",
    "sy.r4tag": "The community", "sy.r4body": "Documented cases, projects and comments, from real designers.",
    "sy.rowlink": "Open in prototype",
    "sy.st1l": "process phases", "sy.st2l": "system areas", "sy.st3l": "designers validated",
    "sy.ctaline": "From trial and error to a documented process.",

    /* WHO (marketing · pain points) */
    "wh.label": "Who it’s for",
    "wh.tag": "For designers who want AI on their side, not in their place.",
    "wh.q": "Do you feel AI is replacing you? Not sure where to start? Drowning in tools and unsure what’s actually good? <span class=\"hl\">You’re not falling behind, you just need direction.</span>",
    "wh.painlabel": "The pain points we solve",
    "wh.p1name": "Still on the fence", "wh.p1cat": "Skeptic",
    "wh.p1body": "You feel AI threatens your authorship and judgment, and you need real evidence before trusting it. Axis shows you where it helps, and where you stay in control.",
    "wh.p2name": "Lost in the noise", "wh.p2cat": "Explorer",
    "wh.p2body": "You experiment, but without structure, trial and error, inconsistent results, too many tools. Axis gives you the map and the order you’re missing.",
    "wh.p3name": "Flying blind", "wh.p3cat": "Power user",
    "wh.p3body": "You already use AI across phases, but intuitively, with no way to evaluate or standardize. Axis makes your process traceable and repeatable.",
    "wh.cardlink": "This is me",

    "finalcta.title": "AI will not replace designers. Bad decisions might.",

    "footer.explore": "Explore", "footer.contact": "Contact",
    "footer.legal": "Axis, Final Degree Project in Design · María Fraga Alonso · UCM 2025–2026",
  },
  es: {
    "nav.home": "Inicio", "nav.about": "El proyecto", "nav.system": "Sistema", "nav.who": "Para quién", "nav.contact": "Contacto",
    "cta.prototype": "Probar el prototipo",

    "ct.label": "Contacto",
    "ct.intro": "Hablemos, contame sobre tu proyecto, o escribime sin más.",
    "ct.directlabel": "Escribime directo",
    "ct.formlabel": "Enviá un mensaje",
    "ct.name": "Nombre", "ct.email": "Email", "ct.msg": "Mensaje",
    "ct.namePh": "Tu nombre", "ct.emailPh": "vos@email.com", "ct.msgPh": "¿De qué te gustaría hablar?",
    "ct.send": "Enviar mensaje",
    "ct.sent": "¡Gracias! Tu mensaje fue enviado.",

    "hero.tagline": "Design with direction.",
    "hero.l1": "La IA <em>no</em> te va a reemplazar,",
    "hero.l2": "A menos que se lo permitas.",
    "hero.sub": "Axis te ayuda a integrar la IA en tu proceso creativo, con dirección, estructura y criterio.",
    "hero.cta_secondary": "Ver cómo funciona",

    "marquee.label": "Aprendé a integrarlas en tu proceso de diseño",

    "about.label": "Sobre axis",
    "about.text": "Los diseñadores usan más herramientas de IA que nunca, pero saltar de una a otra no es un proceso. <span class=\"hl\">El problema no es el acceso. Es la dirección.</span> Axis convierte el uso disperso de la IA en una <span class=\"hl\">práctica de diseño estructurada y evaluable.</span>",
    "about.note": "Trabajo Final de Grado en Diseño bymariafraga",

    "who.heading": "Para quién",
    "w1.title": "Todavía no la integrás para nada",
    "w1.body": "Desconfiás del impacto de la IA sobre la autoría y el criterio. Necesitás evidencia clara antes de adoptarla. Axis te muestra cómo, sin ceder control.",
    "w1.link": "Ver el método",
    "w2.title": "Probás, pero sin estructura",
    "w2.body": "Tenés curiosidad y experimentás, pero te perdés entre herramientas y resultados inconsistentes. Axis te da el mapa que falta.",
    "w2.link": "Empezar por las fases",
    "w3.title": "Ya la usás, sin documentar",
    "w3.body": "Integrás IA en varias fases, pero de forma intuitiva, sin criterios para evaluar ni estandarizar. Axis vuelve tu proceso trazable y replicable.",
    "w3.link": "Ver el sistema",

    "phases.heading": "El método",
    "phases.tag": "Prompts no es diseñar.<br>La dirección creativa, sí.",
    "phases.rowlink": "Ver en el sistema",
    "f1.label": "Explorar & Descubrir", "f1.cat": "Divergencia",
    "f1.body": "Investigar, revisar referencias y detectar las preguntas iniciales. La IA abre el campo; vos decidís qué mirar.",
    "f2.label": "Definir & Reencuadrar", "f2.cat": "Convergencia",
    "f2.body": "Agrupar hallazgos, detectar patrones y formular insights. La IA ordena; el criterio define.",
    "f3.label": "Idear & Desarrollar", "f3.cat": "Divergencia",
    "f3.body": "Moodboards, estilos y variaciones formales en minutos. Más caminos, sin fijación temprana.",
    "f4.label": "Prototipar & Validar", "f4.cat": "Convergencia",
    "f4.body": "Ordenar feedback, sintetizar tests y detectar problemas repetidos. La IA mide; vos interpretás.",

    "system.heading": "El sistema",
    "system.explore": "Explorar el sistema",
    "c1.cat": "Inicio",      "c1.desc": "Quick tips, accesos y casos destacados, en un mismo lugar.",
    "c2.cat": "Práctica",    "c2.desc": "El qué, el cuándo y el cómo, en un mismo lugar.",
    "c3.cat": "Conocimiento","c3.desc": "Guías por fases, glosario y cuándo usar IA, en contexto.",
    "c4.cat": "Comunidad",   "c4.desc": "Casos, proyectos y comentarios, de diseñadores reales.",
    "card.link": "Explorar",

    /* ABOUT */
    "ab.label": "Sobre axis",
    "ab.intro": "Axis nace de una observación simple: <span class=\"hl\">la IA ya forma parte de cómo trabajan los diseñadores, pero se usa sin estructura.</span> Este proyecto investiga dónde la IA aporta valor real, dónde el criterio humano sigue siendo determinante y <span class=\"hl\">cómo construir una vía híbrida que una a ambos.</span>",
    "ab.meet": "La diseñadora",
    "ab.role": "Diseñadora · Autora de Axis",
    "ab.bio": "María Fraga Alonso es diseñadora especializada en identidad de marca, packaging, editorial y fotografía. Axis es su Trabajo Final de Grado en Diseño (UCM, 2025–2026), tutorizado por David Alonso Urbano: una investigación sobre cómo integrar la IA en el proceso de diseño con método y criterio.",
    "ab.project": "El proyecto",
    "ab.dlTitle": "Descargar la memoria completa", "ab.dlMeta": "PDF · ~1,7 MB",
    "ab.f1k": "Grado", "ab.f1v": "Grado en Diseño, UCM",
    "ab.f2k": "Año", "ab.f2v": "2025–2026",
    "ab.f3k": "Tutor", "ab.f3v": "David Alonso Urbano",
    "ab.f4k": "Tipo", "ab.f4v": "Trabajo Final de Grado",
    "ab.c1t": "Objetivos", "ab.c1b": "Mapear dónde la IA aporta valor y dónde el criterio es determinante, y traducir esos aprendizajes en un sistema que el diseñador pueda usar de verdad.",
    "ab.c2t": "Metodología", "ab.c2b": "Diseño centrado en el usuario sobre el doble diamante —investigar, definir, idear y validar— apoyado en la literatura y en diseñadores reales.",
    "ab.c3t": "Valores", "ab.c3b": "Criterio antes que velocidad. Autonomía antes que dependencia. Transparencia antes que magia.",

    /* SYSTEM (prototipo · oscuro) */
    "sy.s1label": "El prototipo",
    "sy.s1": "Axis se entrega como un <span class=\"hl\">prototipo navegable de alta fidelidad.</span> Organiza toda la experiencia por fases del proceso, dando al diseñador herramientas y criterios de evaluación según el momento exacto en que se encuentra, <span class=\"hl\">para que la IA acompañe el proceso sin reemplazar el criterio.</span>",
    "sy.label": "El sistema",
    "sy.tag": "Cuatro áreas. Un mismo flujo.",
    "sy.r1tag": "El inicio", "sy.r1body": "Quick tips, accesos y casos destacados, en un mismo lugar.",
    "sy.r2tag": "El centro", "sy.r2body": "El qué, el cuándo y el cómo, en un mismo lugar.",
    "sy.r3tag": "La base", "sy.r3body": "Guías por fases, glosario y cuándo usar IA, en contexto.",
    "sy.r4tag": "La comunidad", "sy.r4body": "Casos, proyectos y comentarios, de diseñadores reales.",
    "sy.rowlink": "Abrir en el prototipo",
    "sy.st1l": "fases del proceso", "sy.st2l": "áreas del sistema", "sy.st3l": "diseñadores validados",
    "sy.ctaline": "Del ensayo y error a un proceso documentado.",

    /* WHO (marketing · pain points) */
    "wh.label": "Para quién",
    "wh.tag": "Para diseñadores que quieren la IA de su lado, no en su lugar.",
    "wh.q": "¿Sentís que la IA te está reemplazando? ¿No sabés por dónde empezar? ¿Te perdés entre mil herramientas sin saber cuál sirve? <span class=\"hl\">No te estás quedando atrás, solo te falta dirección.</span>",
    "wh.painlabel": "Los pain points que resolvemos",
    "wh.p1name": "Con un pie afuera", "wh.p1cat": "Escéptica",
    "wh.p1body": "Sentís que la IA amenaza tu autoría y tu criterio, y necesitás evidencia real antes de confiar. Axis te muestra dónde ayuda, y dónde seguís teniendo el control.",
    "wh.p2name": "Perdida en el ruido", "wh.p2cat": "Exploradora",
    "wh.p2body": "Experimentás, pero sin estructura, ensayo y error, resultados inconsistentes, demasiadas herramientas. Axis te da el mapa y el orden que falta.",
    "wh.p3name": "Volando a ciegas", "wh.p3cat": "Avanzado",
    "wh.p3body": "Ya usás IA en varias fases, pero de forma intuitiva, sin manera de evaluar ni estandarizar. Axis vuelve tu proceso trazable y repetible.",
    "wh.cardlink": "Esta soy yo",

    "finalcta.title": "La IA no reemplaza a los diseñadores. Las malas decisiones, tal vez sí.",

    "footer.explore": "Explorar", "footer.contact": "Contacto",
    "footer.legal": "Axis, Trabajo Final de Grado en Diseño · María Fraga Alonso · UCM 2025–2026",
  }
};

/* ---------- 2. Render del chrome (header + footer) ---------- */
function navLinks(currentPage) {
  return SITE.nav.map(n =>
    `<a href="${n.href}" data-i18n="${n.key}"${n.page === currentPage ? ' aria-current="page"' : ''}>${I18N.en[n.key]}</a>`
  ).join("");
}

function renderHeader(currentPage) {
  return `
  <div class="container site-header__inner">
    <a class="brand" href="index.html" aria-label="axis, home">${LOGO}</a>
    <nav class="site-nav" aria-label="Primary">${navLinks(currentPage)}</nav>
    <div class="header-right">
      <div class="lang-toggle" role="group" aria-label="Language">
        <button type="button" data-lang-btn="en" aria-pressed="true"><span>EN</span></button>
        <button type="button" data-lang-btn="es" aria-pressed="false"><span>ES</span></button>
      </div>
      <button class="nav-toggle" aria-label="Menu"><span></span></button>
    </div>
  </div>`;
}

function socialIcon(name) {
  const icons = {
    behance: { vb: "0 0 90 90", inner: '<path fill="currentColor" d="M81.276 24.925H58.726v-5.601h22.553v5.601zM43.713 47.894c1.455 2.254 2.182 4.99 2.182 8.203 0 3.322-.82 6.303-2.488 8.935-1.061 1.742-2.378 3.214-3.961 4.398-1.783 1.37-3.893 2.31-6.32 2.812C30.693 72.746 28.058 73 25.22 73H0V17h27.045c6.817.111 11.65 2.086 14.504 5.965 1.712 2.379 2.561 5.233 2.561 8.551 0 3.424-.859 6.163-2.588 8.244-.962 1.167-2.383 2.228-4.264 3.187 2.849.844 5.01 2.487 6.455 4.748zM12.915 39.078h11.85c2.435 0 4.404-.463 5.92-1.388 1.515-.924 2.271-2.566 2.271-4.924 0-2.605-1.001-4.334-3.008-5.166-1.725-.578-3.932-.876-6.61-.876H12.915v12.354zM34.097 55.297c0-2.909-1.189-4.92-3.562-5.999-1.327-.613-3.199-.927-5.6-.949h-12.02v14.924h11.834c2.431 0 4.313-.318 5.671-.982 2.449-1.221 3.677-3.544 3.677-6.994zM89.643 46.187c.272 1.832.396 4.49.346 7.965H60.783c.161 4.031 1.553 6.85 4.192 8.464 1.592 1.012 3.522 1.506 5.781 1.506 2.383 0 4.325-.602 5.82-1.841.815-.656 1.533-1.583 2.154-2.752h10.705c-.28 2.381-1.569 4.796-3.886 7.25-3.589 3.9-8.622 5.856-15.086 5.856-5.34 0-10.046-1.649-14.131-4.936-4.071-3.299-6.116-8.648-6.116-16.069 0-6.959 1.836-12.285 5.519-15.992 3.697-3.714 8.469-5.563 14.35-5.563 3.486 0 6.629.623 9.432 1.876 2.795 1.254 5.105 3.228 6.924 5.94 1.732 2.585 2.79 5.347 3.284 8.493zM79.107 47.232c-.196-2.788-1.127-4.897-2.803-6.339-1.662-1.446-3.738-2.172-6.216-2.172-2.696 0-4.778.776-6.258 2.301-1.489 1.522-2.416 3.591-2.796 6.21h18.073z"/>' },
    linkedin: { vb: "0 0 24 24", inner: '<path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm6 0h3.83v1.64h.05c.53-1 1.84-2.06 3.78-2.06 4.04 0 4.79 2.66 4.79 6.12V21h-4v-5.45c0-1.3-.02-2.97-1.81-2.97-1.81 0-2.09 1.42-2.09 2.88V21H9V9z"/>' },
    instagram: { vb: "0 0 24 24", inner: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>' },
    whatsapp: { vb: "0 0 32 32", inner: '<path fill="currentColor" d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732.737 5.291 2.022 7.491l-.038-.07-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h.006c8.209-.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507zM16.062 28.228h-.005c-2.319 0-4.489-.64-6.342-1.753l.056.031-.451-.267-4.675 1.227 1.247-4.559-.294-.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353zM22.838 18.977c-.371-.186-2.197-1.083-2.537-1.208-.341-.124-.589-.185-.837.187-.246.371-.958 1.207-1.175 1.455-.216.249-.434.279-.805.094-1.15-.466-2.138-1.087-2.997-1.852l.01.009c-.799-.74-1.484-1.587-2.037-2.521l-.028-.052c-.216-.371-.023-.572.162-.757.167-.166.372-.434.557-.65.146-.179.271-.384.366-.604l.006-.017c.043-.087.068-.188.068-.296 0-.131-.037-.253-.101-.357l.002.003c-.094-.186-.836-2.014-1.145-2.758-.302-.724-.609-.625-.836-.637-.216-.01-.464-.012-.712-.012-.395.01-.746.188-.988.463l-.001.002c-.802.761-1.3 1.834-1.3 3.023 0 .026 0 .053.001.079l-0-.004c.131 1.467.681 2.784 1.527 3.857l-.012-.015c1.604 2.379 3.742 4.282 6.251 5.564l.094.043c.548.248 1.25.513 1.968.74l.149.041c.442.14.951.221 1.479.221.303 0 .601-.027.889-.078l-.031.004c1.069-.223 1.956-.868 2.497-1.749l.009-.017c.165-.366.261-.793.261-1.242 0-.185-.016-.366-.047-.542l.003.019c-.092-.155-.34-.247-.712-.434z"/>' }
  };
  const ic = icons[name];
  return `<svg viewBox="${ic.vb}" aria-hidden="true">${ic.inner}</svg>`;
}

function renderFooter() {
  return `
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="brand" href="index.html" aria-label="axis, home">${LOGO}</a>
        <p data-i18n="hero.tagline">Design with direction.</p>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.explore">Explore</h4>
        <ul>${SITE.nav.map(n => `<li><a href="${n.href}" data-i18n="${n.key}">${I18N.en[n.key]}</a></li>`).join("")}
          <li><a href="${SITE.prototype}" target="_blank" rel="noopener" data-i18n="cta.prototype">Try the prototype</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer.contact">Contact</h4>
        <div class="footer-socials" aria-label="Social">
          <a href="${SITE.socials.behance}" target="_blank" rel="noopener" aria-label="Behance">${socialIcon("behance")}</a>
          <a href="${SITE.socials.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${socialIcon("linkedin")}</a>
          <a href="${SITE.socials.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${socialIcon("instagram")}</a>
          <a href="${SITE.socials.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${socialIcon("whatsapp")}</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-sign">axis <a href="${SITE.portfolio}" target="_blank" rel="noopener">bymariafraga</a></span>
      <span>© 2026</span>
    </div>
  </div>`;
}

/* Inyectar chrome */
const currentPage = document.body.getAttribute("data-page") || "";
const headerEl = document.getElementById("site-header");
const footerEl = document.getElementById("site-footer");
if (headerEl) { headerEl.className = "site-header"; headerEl.innerHTML = renderHeader(currentPage); }
if (footerEl) { footerEl.className = "site-footer"; footerEl.innerHTML = renderFooter(); }

/* ---------- 3. Aplicar idioma ---------- */
const htmlEl = document.documentElement;
function setLang(lang) {
  const dict = I18N[lang] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    if (dict[k] != null) el.textContent = dict[k];
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const k = el.getAttribute("data-i18n-html");
    if (dict[k] != null) el.innerHTML = dict[k];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const k = el.getAttribute("data-i18n-ph");
    if (dict[k] != null) el.placeholder = dict[k];
  });
  htmlEl.lang = lang;
  htmlEl.setAttribute("data-lang", lang);
  document.querySelectorAll("[data-lang-btn]").forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-btn") === lang));
  });
  try { localStorage.setItem("axis-lang", lang); } catch (e) {}
}
document.querySelectorAll("[data-lang-btn]").forEach(btn => {
  btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang-btn")));
});
let initialLang = "en";
try {
  const saved = localStorage.getItem("axis-lang");
  if (saved) initialLang = saved;
  else if (navigator.language && navigator.language.toLowerCase().startsWith("es")) initialLang = "es";
} catch (e) {}
setLang(initialLang);

/* ---------- 4. Carrusel infinito ---------- */
const track = document.getElementById("marqueeTrack");
if (track) track.innerHTML += track.innerHTML;

/* ---------- 5. Header + bloom del hero al hacer scroll ---------- */
const header = document.querySelector(".site-header");
const heroEl = document.getElementById("hero");
if (header) {
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    if (heroEl) {
      const h = heroEl.offsetHeight || 1;
      const hs = Math.max(0, Math.min(1, y / (h * 0.85)));   // progreso 0→1 a lo largo del hero
      heroEl.style.setProperty("--hs", hs.toFixed(3));
      if (currentPage === "home") header.classList.toggle("on-hero", y < h - 80);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Menú mobile */
  const navToggle = header.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => header.classList.toggle("header-open"));
    header.querySelectorAll(".site-nav a").forEach(a =>
      a.addEventListener("click", () => header.classList.remove("header-open")));
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 900) header.classList.remove("header-open");
    });
  }
}

/* ---------- 5c. Calor del cursor en el hero (pintura termosensible) ---------- */
if (heroEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let tx = window.innerWidth / 2, ty = window.innerHeight * 0.42, cx = tx, cy = ty, raf = null;
  const loop = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    heroEl.style.setProperty("--mx", cx.toFixed(1) + "px");
    heroEl.style.setProperty("--my", cy.toFixed(1) + "px");
    if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) raf = requestAnimationFrame(loop);
    else raf = null;
  };
  heroEl.addEventListener("pointermove", (e) => {
    const r = heroEl.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    heroEl.classList.add("is-warm");
    if (!raf) raf = requestAnimationFrame(loop);
  });
  heroEl.addEventListener("pointerleave", () => heroEl.classList.remove("is-warm", "is-pressed"));
  heroEl.addEventListener("pointerdown", () => heroEl.classList.add("is-pressed"));
  window.addEventListener("pointerup", () => heroEl.classList.remove("is-pressed"));
}

/* ---------- 5b. Formulario de contacto (no funcional · valida requeridos) ---------- */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    contactForm.hidden = true;
    const ok = document.getElementById("contact-sent");
    if (ok) { ok.hidden = false; ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
  });
}

/* ---------- 6. Reveal del hero ---------- */
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("is-ready")));

/* ---------- 7. Reveal de secciones al hacer scroll ---------- */
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add("in"));
}
