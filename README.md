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

## Caducidad
La propuesta se ve 10 días desde su envío, el 7 de septiembre de 2026 (el día de envío cuenta): hasta el **16 de septiembre de 2026 a las 23:59** (hora de Madrid). Desde el 17, `index.html` lleva a `caducada.html`: «No puedes ver esta página porque han pasado más de 10 días desde su envío. Si sigues con interés, escríbeme a jjuradogarciadelrio@gmail.com.» y la home entera en miniatura (`assets/img/home-miniatura.webp`). La fecha está en el primer `<script>` de `index.html` (`Date.UTC(2026, 8, 16, 22, 0)`). Solo caduca en `github.io`: en local se sigue viendo; `?caducada` simula el aviso.

---
Diseño y desarrollo: **Juan Jurado** · [jjuradogarciadelrio.com](https://jjuradogarciadelrio.com)
