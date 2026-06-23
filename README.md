# Axis

Landing web del Trabajo de Fin de Grado **Axis** — un sistema que ayuda a diseñadores a integrar la IA en su proceso creativo con estructura, método y criterio.

**Grado en Diseño · Universidad Complutense de Madrid · 2025–2026**  
Autora: María Fraga Alonso · Tutor: David Alonso Urbano

→ [Ver la web](https://mariaafraga223-rgb.github.io/AXIS/)  
→ [Ver el prototipo en Figma](https://www.figma.com/proto/AIfOQhoTMu2t0PU6HZ3LBQ/AXIS?node-id=1085-5178&t=FnMb1fi6BWgk1GdY-1)

---

## Stack

HTML + CSS + JS vanilla, sin frameworks ni dependencias. Multi-página con header/footer inyectados por JS. Bilingüe EN/ES con sistema de i18n propio.

**Tipografía:** PP Telegraf · Season Sans · Season Mix  
**Animación hero:** WebGL (GLSL) — gradiente líquido termosensible con los colores del sistema

## Estructura

```
axis/
├── index.html        Home
├── about.html        Sobre el proyecto y la autora
├── system.html       El prototipo (tema oscuro)
├── who.html          A quién va dirigido
├── contact.html      Contacto
├── css/styles.css    Todos los estilos + design tokens
├── js/
│   ├── script.js     i18n, header/footer, comportamientos
│   └── hero-flow.js  Animación WebGL del hero
├── fonts/            PP Telegraf + Season Sans + Season Mix (woff2)
└── assets/           Logo, foto, PDF memoria
```

## Desarrollo local

```bash
python3 -m http.server 8123 --directory .
# → http://localhost:8123
```
