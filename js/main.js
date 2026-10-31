(function () {
  'use strict';
  var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  // Menú móvil
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var abierto = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', abierto);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  // Slider de juegos destacados
  var slider = document.getElementById('slider');
  var slides = slider.querySelectorAll('.slide'), dots = slider.querySelector('.dots'), actual = 0, timer;
  slides.forEach(function (s, i) {
    var b = document.createElement('button');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', s.querySelector('h2').textContent);
    b.addEventListener('click', function () { ir(i); reiniciar(); });
    dots.appendChild(b);
  });
  function ir(i) {
    actual = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-on', k === actual); });
    dots.querySelectorAll('button').forEach(function (b, k) { b.setAttribute('aria-selected', k === actual); });
  }
  function reiniciar() {
    clearInterval(timer);
    if (!quieto) timer = setInterval(function () { ir(actual + 1); }, 6000);
  }
  slider.querySelector('.prev').addEventListener('click', function () { ir(actual - 1); reiniciar(); });
  slider.querySelector('.next').addEventListener('click', function () { ir(actual + 1); reiniciar(); });
  slider.addEventListener('mouseenter', function () { clearInterval(timer); });
  slider.addEventListener('mouseleave', reiniciar);
  ir(0); reiniciar();

  // Galería de Vaelor
  var principal = document.getElementById('cinemaMain');
  document.querySelectorAll('.cinema-thumbs button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.cinema-thumbs button').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      principal.src = b.dataset.src;
      principal.alt = b.dataset.alt;
    });
  });

  // Visor de capturas
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap');
  document.querySelectorAll('[data-gallery] img').forEach(function (img) {
    if (img.closest('.cinema-thumbs')) return;
    img.addEventListener('click', function () {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
      if (lb.showModal) lb.showModal();
    });
  });
  document.getElementById('lbClose').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });

  // Copiar correo
  var copiar = document.getElementById('copyMail'), aviso = document.getElementById('copied');
  copiar.addEventListener('click', function () {
    var correo = document.getElementById('mail').textContent.trim();
    function seleccionar() {
      var r = document.createRange(); r.selectNodeContents(document.getElementById('mail'));
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      aviso.textContent = 'Seleccionado. Pulsa Ctrl+C para copiar.';
    }
    if (navigator.clipboard) navigator.clipboard.writeText(correo).then(function () { aviso.textContent = '¡Correo copiado!'; }, seleccionar);
    else seleccionar();
  });

  // Resaltar sección actual en el menú
  var enlaces = {};
  menu.querySelectorAll('a').forEach(function (a) { enlaces[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var obsMenu = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && enlaces[e.target.id]) {
          Object.values(enlaces).forEach(function (a) { a.classList.remove('is-here'); });
          enlaces[e.target.id].classList.add('is-here');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { obsMenu.observe(s); });

    // Revelado suave
    var obsRev = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); obsRev.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.card, .show-info, .shots, .cinema, .numbers, .three > div, .mv-card, .values li, .press-item, .mailbox').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top > innerHeight) { el.classList.add('reveal'); obsRev.observe(el); }
    });
  }

  // Brasas flotando en el hero
  var cv = document.getElementById('embers');
  if (cv && !quieto) {
    var ctx = cv.getContext('2d'), brasas = [], W, H, dpr = Math.min(devicePixelRatio || 1, 2);
    function medir() { W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function nueva(inicio) {
      return { x: W * (0.45 + Math.random() * 0.55), y: inicio ? Math.random() * H : H + 10, r: 1 + Math.random() * 2.6,
        v: 0.3 + Math.random() * 0.9, d: Math.random() * Math.PI * 2, a: 0.4 + Math.random() * 0.6 };
    }
    medir(); addEventListener('resize', medir);
    for (var i = 0; i < 46; i++) brasas.push(nueva(true));
    (function paso() {
      ctx.clearRect(0, 0, W, H);
      brasas.forEach(function (b, i) {
        b.y -= b.v; b.d += 0.02; b.x += Math.sin(b.d) * 0.4;
        var vida = Math.max(0, b.y / H);
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,' + (140 + Math.round(80 * vida)) + ',40,' + (b.a * vida) + ')';
        ctx.shadowColor = '#FF6A1A'; ctx.shadowBlur = 8; ctx.fill();
        if (b.y < -10) brasas[i] = nueva(false);
      });
      requestAnimationFrame(paso);
    })();
  }
})();
