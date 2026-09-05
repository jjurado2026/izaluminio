# Izaluminio — Propuesta de remaquetación de la homepage

Prototipo de homepage para **Izaluminio**, carpintería de aluminio y PVC en Arganda del Rey. Es una **remaquetación 1:1** de su web actual: mismos bloques, mismo orden, sus textos, sus imágenes y sus colores (azul y blanco). La propuesta está en el diseño, la tipografía, la jerarquía y el movimiento.

**Dirección estética:** *"Corredera"* — la página se comporta como una ventana corredera de aluminio blanco: la hoja entrante del slider se desliza sobre la saliente, la foto de servicios cambia deslizándose, las tarjetas de valores se abren como hojas. Los corchetes de esquina de su logo enmarcan el hero, el titular de valores y la foto de presupuesto. Tipografía Aleo (slab) + Atkinson Hyperlegible Next.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Fuentes variables autoalojadas. Imágenes del cliente en AVIF/WebP con `srcset`.

## Estructura
```
prototype/          Prototipo navegable (se publica en gh-pages con git subtree)
  index.html
  assets/css/       global.css · home.css
  assets/js/        main.js
  assets/fonts/     aleo · aleo-italic · atkinson-next (woff2, latino)
  assets/img/       banners, galería y logo del cliente
```

## Ver en local
```bash
cd prototype && python3 -m http.server 8000
```
Parámetros útiles para revisar: `?ss` (sin animaciones), `&slide=2`, `&foto=3`, `&abrir=1`.

## Publicar
```bash
git subtree push --prefix=prototype origin gh-pages
```

---
Diseño y desarrollo: **Juan Jurado** · [jjuradogarciadelrio.com](https://jjuradogarciadelrio.com)
