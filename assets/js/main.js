/* =====================================================================
   IZALUMINIO — "Corredera"
   Todo el contenido es legible sin JavaScript. Esto solo añade movimiento
   y los controles del slider, la foto de servicios, las hojas de valores,
   el menú y la fachada del mapa.
   ===================================================================== */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // ?ss → modo captura: sin animaciones, sin autoplay, todo visible
  const captura = location.search.includes('ss');
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const quieto = captura || reducido;
  const puntero = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (captura) {
    document.documentElement.classList.add('captura');
    $$('img[loading="lazy"]').forEach(i => (i.loading = 'eager'));
  }

  /* ---------- Carga: se descorre la ventana ---------- */
  requestAnimationFrame(() => document.body.classList.add('cargada'));

  /* ---------- Cabecera ---------- */
  const cab = $('.cab');
  if (cab) {
    const sombra = () => (cab.dataset.scroll = scrollY > 8 ? 'si' : 'no');
    sombra();
    addEventListener('scroll', sombra, { passive: true });

    const boton = $('.cab__menu');
    const cerrarMenu = () => {
      cab.dataset.menu = 'cerrado';
      boton.setAttribute('aria-expanded', 'false');
    };
    boton.addEventListener('click', () => {
      const abierto = cab.dataset.menu === 'abierto';
      cab.dataset.menu = abierto ? 'cerrado' : 'abierto';
      boton.setAttribute('aria-expanded', String(!abierto));
    });
    $$('.cab__nav a').forEach(a => a.addEventListener('click', cerrarMenu));
    addEventListener('keydown', e => { if (e.key === 'Escape') cerrarMenu(); });

    const sub = $('.cab__item--sub');
    const toggle = $('.cab__sub-toggle');
    if (sub && toggle) {
      toggle.addEventListener('click', () => {
        const abierto = sub.classList.toggle('is-abierto');
        toggle.setAttribute('aria-expanded', String(abierto));
        toggle.setAttribute('aria-label', (abierto ? 'Cerrar' : 'Abrir') + ' el submenú de Servicios');
      });
      sub.addEventListener('focusout', e => {
        if (!sub.contains(e.relatedTarget)) {
          sub.classList.remove('is-abierto');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ---------- HERO: la corredera ----------
     La hoja entrante se desliza sobre la saliente. Autoplay 7 s como en su
     web, solo con puntero, en pausa al pasar por encima y hasta la primera
     interacción. En táctil: deslizar con el dedo o usar las flechas.       */
  const hero = $('#hero');
  if (hero) {
    const vidrios  = $$('.hero__vidrio', hero);
    const captions = $$('.hero__caption', hero);
    const tramos   = $$('.hero__tramo', hero);
    const guia     = $('.hero__hoja-guia', hero);
    const actualEl = $('#hero-actual');
    const pausaBtn = $('#hero-pausa');
    const N = vidrios.length;
    let i = 0, animando = false, timer = null, pausado = false, enPausaHover = false;
    const INTERVALO = 7000;

    const ir = (n, dir) => {
      n = (n + N) % N;
      if (n === i || animando) return;
      dir = dir || (n > i ? 1 : -1);
      const sale = vidrios[i], entra = vidrios[n];
      animando = true;

      // Coloca la hoja entrante fuera del marco, por el lado que corresponde
      entra.classList.remove('is-saliente', 'is-hacia-derecha');
      entra.classList.toggle('is-desde-izquierda', dir < 0);
      void entra.offsetWidth; // reflow: que parta desde ahí sin transición visible
      entra.classList.add('is-activa');
      sale.classList.remove('is-activa');
      sale.classList.add('is-saliente');
      sale.classList.toggle('is-hacia-derecha', dir < 0);

      captions.forEach((c, k) => {
        c.classList.toggle('is-activa', k === n);
        c.setAttribute('aria-hidden', String(k !== n));
      });
      tramos.forEach((t, k) => {
        if (k === n) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
      });
      if (guia) guia.style.setProperty('--pos', n);
      if (actualEl) actualEl.textContent = String(n + 1);
      i = n;

      const fin = () => {
        sale.classList.remove('is-saliente', 'is-hacia-derecha', 'is-desde-izquierda');
        entra.classList.remove('is-desde-izquierda');
        animando = false;
      };
      if (quieto) fin(); else setTimeout(fin, 820);
    };

    // Controles
    $$('.hero__flecha', hero).forEach(b => b.addEventListener('click', () => { parar(); ir(i + Number(b.dataset.dir), Number(b.dataset.dir)); }));
    tramos.forEach(t => t.addEventListener('click', () => { parar(); ir(Number(t.dataset.i)); }));
    hero.addEventListener('keydown', e => {
      if (!e.target.closest('.hero__carril')) return;
      if (e.key === 'ArrowRight') { parar(); ir(i + 1, 1); }
      if (e.key === 'ArrowLeft')  { parar(); ir(i - 1, -1); }
    });

    // Deslizar con el dedo (o el ratón) sobre el cristal
    const cristal = $('#hero-cristal');
    let x0 = null;
    cristal.addEventListener('pointerdown', e => { x0 = e.clientX; });
    cristal.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { parar(); ir(dx < 0 ? i + 1 : i - 1, dx < 0 ? 1 : -1); }
    });
    cristal.addEventListener('pointercancel', () => { x0 = null; });

    // Autoplay
    const tic = () => { if (!pausado && !enPausaHover && !document.hidden) ir(i + 1, 1); };
    const arrancar = () => { if (timer) return; timer = setInterval(tic, INTERVALO); };
    const parar = () => { if (timer) { clearInterval(timer); timer = null; } pausado = true; pintarPausa(); };
    const pintarPausa = () => {
      if (!pausaBtn) return;
      pausaBtn.setAttribute('aria-pressed', String(pausado));
      pausaBtn.setAttribute('aria-label', pausado ? 'Reanudar el pase automático' : 'Pausar el pase automático');
    };
    if (pausaBtn) pausaBtn.addEventListener('click', () => {
      if (pausado) { pausado = false; pintarPausa(); arrancar(); }
      else parar();
    });
    hero.addEventListener('pointerenter', () => { enPausaHover = true; });
    hero.addEventListener('pointerleave', () => { enPausaHover = false; });
    hero.addEventListener('focusin',  () => { enPausaHover = true; });
    hero.addEventListener('focusout', e => { if (!hero.contains(e.relatedTarget)) enPausaHover = false; });

    if (quieto || !puntero) { pausado = true; pintarPausa(); }
    else arrancar();

    // ?slide=n → abre en esa diapositiva (para revisar cada estado en captura)
    const pedida = location.search.match(/slide=(\d)/);
    if (pedida) { parar(); ir(Number(pedida[1]) - 1); }

    // El flotante de WhatsApp solo aparece cuando el hero (con su propio botón) sale de pantalla
    const flotante = $('.flotante');
    if (flotante && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => flotante.classList.toggle('is-visible', !en.isIntersecting), { threshold: 0.05 })
        .observe(hero);
    } else if (flotante) flotante.classList.add('is-visible');
  }

  /* ---------- SERVICIOS: la foto de la derecha ----------
     Al llegar se ve su foto (la manilla). Al pasar por un servicio, su foto
     entra deslizándose sobre la anterior, como una hoja.                  */
  const marco = $('#servicios-marco');
  if (marco) {
    const vistas = $$('.servicios__vista', marco);
    const filas  = $$('.servicio');
    let actual = 0, temporizador = null;
    const mostrar = n => {
      if (n === actual) return;
      const sale = vistas[actual], entra = vistas[n];
      vistas.forEach(v => v.classList.remove('is-saliente'));
      entra.classList.add('is-activa');
      sale.classList.remove('is-activa');
      sale.classList.add('is-saliente');
      filas.forEach(f => f.classList.toggle('is-activo', Number(f.dataset.foto) === n));
      actual = n;
      clearTimeout(temporizador);
      temporizador = setTimeout(() => sale.classList.remove('is-saliente'), 820);
    };
    filas.forEach(f => {
      const n = Number(f.dataset.foto);
      f.addEventListener('pointerenter', () => { if (puntero) mostrar(n); });
      f.addEventListener('focusin', () => mostrar(n));
    });
    const fotoPedida = location.search.match(/foto=(\d)/);
    if (fotoPedida) mostrar(Number(fotoPedida[1]));
  }

  /* ---------- VALORES: hojas que se abren con el dedo o el teclado ---------- */
  $$('.valor').forEach((valor, k) => {
    const hoja = $('.valor__hoja', valor);
    hoja.addEventListener('click', () => {
      const abierta = valor.classList.toggle('is-abierta');
      hoja.setAttribute('aria-expanded', String(abierta));
    });
    // ?abrir=n → esa hoja abierta (para revisar el reverso en captura)
    if (new RegExp('abrir=' + (k + 1) + '\\b').test(location.search)) {
      valor.classList.add('is-abierta');
      hoja.setAttribute('aria-expanded', 'true');
    }
  });
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    $$('.valor.is-abierta').forEach(v => {
      v.classList.remove('is-abierta');
      $('.valor__hoja', v).setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Fotos que se descorren al entrar en pantalla ---------- */
  const fotos = $$('.descorre');
  if (quieto || !('IntersectionObserver' in window)) {
    fotos.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver((entradas, obs) => {
      entradas.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    fotos.forEach(el => io.observe(el));
  }

  /* ---------- Mapa: su iframe de Google, al pulsar ---------- */
  const mapa = $('#pie-mapa');
  const cargarMapa = $('#pie-mapa-cargar');
  if (mapa && cargarMapa) {
    cargarMapa.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = mapa.dataset.src;
      f.title = 'Mapa de Google: Izaluminio, instalación y reparación, en Arganda del Rey';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      mapa.appendChild(f);
      const fachada = $('.pie__mapa-fachada', mapa);
      if (fachada) fachada.remove();
    });
  }
})();
