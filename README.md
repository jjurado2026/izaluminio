# Izaluminio — Propuesta de rediseño web

Prototipo de homepage para **Izaluminio**, carpintería de aluminio y PVC en Arganda del Rey.

**Dirección estética:** *"Sección"* — el lenguaje del perfil extruido. Paleta anclada en acabados RAL reales, tipografía Archivo + IBM Plex, y la cota como motivo gráfico recurrente.

## Stack
HTML, CSS y JavaScript puro. Cero dependencias, cero build. Fuentes variables autoalojadas.

## Objetivos técnicos
LCP < 1,5 s · CLS < 0,05 · INP < 200 ms · Lighthouse 95+ en las cuatro categorías.

## Estructura
```
prototype/          Prototipo navegable
  index.html
  assets/css/       global.css · home.css
  assets/js/
  assets/fonts/     Variables autoalojadas
  assets/img/
```

## Ver en local
```bash
cd prototype && python3 -m http.server 8000
```

---
Diseño y desarrollo: **Juan Jurado** · [jjuradogarciadelrio.com](https://jjuradogarciadelrio.com)
