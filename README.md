# Izaluminio — Propuesta de remaquetación de la homepage

Prototipo de homepage para **Izaluminio**, carpintería de aluminio y PVC en Arganda del Rey. Es una **remaquetación 1:1** de su web actual: mismos bloques, mismo orden, sus textos, sus imágenes y sus colores (azul y blanco). La propuesta está en el diseño, la tipografía, la jerarquía y el movimiento.

**Dirección estética:** *"Luz"* — su producto es un hueco por el que entra la luz: cada foto aparece descorriendo un panel, como quien abre una ventana. Web clara y fotográfica con sus fotos reales, su azul en bloques enteros, los corchetes de su logo como motivo, Young Serif + Geologica, y una jerarquía de movimiento clara (grande en el hero, media en fotos y valores, nula en el texto).

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Fuentes variables autoalojadas. Imágenes del cliente en AVIF/WebP con `srcset`.

## Estructura
```
prototype/          Prototipo navegable (se publica en gh-pages con git subtree)
  index.html
  assets/css/       global.css · home.css
  assets/js/        main.js
  assets/fonts/     young-serif · geologica (woff2, latino)
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
