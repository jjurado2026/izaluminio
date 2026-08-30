/* ============================================================
   IZALUMINIO — "HUECO"
   Todo el contenido es legible sin JavaScript. Esto solo añade.
   ============================================================ */
(() => {
  'use strict';
  // ?ss => modo captura: sin animaciones ni diferidos, para screenshots deterministas
  const captura = location.search.includes('ss');
  const quieto = captura || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (captura) {
    document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
  }
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Cabecera: se comprime al scrollear ---------- */
  const cab = $('#cabecera');
  if (cab) {
    const centinela = document.createElement('div');
    centinela.style.cssText = 'position:absolute;top:120px;height:1px;width:1px';
    document.body.prepend(centinela);
    new IntersectionObserver(
      ([e]) => cab.dataset.compacta = e.isIntersecting ? 'no' : 'si'
    ).observe(centinela);
  }

  /* ---------- Entrada al viewport ---------- */
  const entradas = $$('.entra');
  if (quieto || !('IntersectionObserver' in window)) {
    entradas.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver((filas, obs) => {
      filas.forEach(f => {
        if (!f.isIntersecting) return;
        f.target.classList.add('visible');
        obs.unobserve(f.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    entradas.forEach(el => io.observe(el));
  }

  /* ---------- FIRMA: la mirada a través ----------
     La imagen se desplaza dentro de su marco según dónde mires.
     Es lo que hace una ventana.                                */
  if (!quieto && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const huecos = $$('.hueco[data-mirada]');
    let pendiente = false, cola = [];

    const pintar = () => {
      cola.forEach(([el, x, y]) => {
        el.style.setProperty('--mx', x.toFixed(3));
        el.style.setProperty('--my', y.toFixed(3));
      });
      cola = []; pendiente = false;
    };

    huecos.forEach(el => {
      el.addEventListener('pointermove', ev => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width  * 2 - 1;
        const y = (ev.clientY - r.top)  / r.height * 2 - 1;
        cola.push([el, Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y))]);
        if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); }
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--mx', 0);
        el.style.setProperty('--my', 0);
      });
    });
  }

  /* ---------- FIRMA: chips RAL como filtro real ---------- */
  const chipsRal = $$('.ral__chip');
  const piezas   = $$('.obra__pieza');
  const cuenta   = $('#obra-cuenta');
  const vacio    = $('#obra-vacio');

  const filtrar = acabado => {
    let n = 0;
    piezas.forEach(p => {
      const entra = acabado === 'todo' || p.dataset.acabado === acabado;
      p.hidden = !entra;
      if (entra) n++;
    });
    if (cuenta) cuenta.textContent = n === 1 ? '1 obra' : `${n} obras`;
    if (vacio)  vacio.hidden = n > 0;
  };

  chipsRal.forEach(chip => chip.addEventListener('click', () => {
    chipsRal.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    const aplicar = () => filtrar(chip.dataset.acabado);
    if (!quieto && document.startViewTransition) document.startViewTransition(aplicar);
    else aplicar();
  }));

  const reset = $('[data-reset]');
  if (reset) reset.addEventListener('click', () => chipsRal[0].click());

  /* ---------- Chips de triaje ---------- */
  $$('.triaje__lista').forEach(grupo => {
    const chips = $$('.triaje__chip', grupo);
    chips.forEach(chip => chip.addEventListener('click', () => {
      const activo = chip.getAttribute('aria-pressed') === 'true';
      chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', String(!activo));
      const destino = chip.dataset.va;
      if (destino && !activo) {
        const seccion = $(destino);
        if (seccion) {
          seccion.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'start' });
          const espejo = $$('#form-casos .triaje__chip')
            .find(c => c.textContent.trim() === chip.textContent.trim());
          if (espejo) espejo.click();
        }
      }
    }));
  });

  /* ---------- Horario: abierto o cerrado, ahora ---------- */
  const estado = $('#estado-horario');
  if (estado) {
    const ahora = new Date();
    const dia = ahora.getDay(), min = ahora.getHours() * 60 + ahora.getMinutes();
    const tramos = { 1:[540,840], 2:[540,840], 3:[540,840], 4:[540,840], 5:[540,840], 6:[600,870] };
    const t = tramos[dia];
    const abierto = t && min >= t[0] && min < t[1];
    const cierra = t ? `${String(Math.floor(t[1]/60)).padStart(2,'0')}:${String(t[1]%60).padStart(2,'0')}` : '';
    estado.innerHTML = abierto
      ? `<b>Abierto</b> · hasta las ${cierra}`
      : `<b style="color:var(--anodizado)">Cerrado</b> · lunes a viernes, 9:00–14:00`;
  }

  /* ---------- Formulario ---------- */
  const form = $('#form-presupuesto');
  if (form) {
    const salida = $('#form-estado');
    const foto = $('#foto');
    if (foto) foto.addEventListener('change', () => {
      const n = foto.files && foto.files[0];
      const etiqueta = $('label[for="foto"] span');
      if (n && etiqueta) etiqueta.textContent = n.name.length > 22 ? n.name.slice(0, 20) + '…' : n.name;
    });
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      salida.textContent = 'Prototipo: el formulario aún no envía. En producción llega al correo y al CRM.';
    });
  }
})();
