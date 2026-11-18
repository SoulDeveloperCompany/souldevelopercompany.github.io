// Soul Developer Company — interacciones del sitio

// WhatsApp de la empresa: escribe el número con indicativo y sin espacios ni "+",
// por ejemplo '57300XXXXXXX'. Mientras esté vacío, los botones de WhatsApp no se muestran.
const WHATSAPP = '';

(() => {
  // Botones de WhatsApp
  if (WHATSAPP) {
    document.querySelectorAll('[data-wa]').forEach((a) => {
      a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(a.dataset.wa)}`;
      a.target = '_blank';
      a.rel = 'noopener';
      a.hidden = false;
    });
  }

  // Pausar la demo animada
  document.querySelectorAll('[data-flow]').forEach((flow) => {
    const btn = flow.querySelector('.flow-pause');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const paused = flow.classList.toggle('is-paused');
      btn.setAttribute('aria-pressed', String(paused));
      btn.textContent = paused ? 'Reanudar animación' : 'Pausar animación';
    });
  });

  // Marcar en el menú la sección visible
  const links = [...document.querySelectorAll('.menu a[href^="#"]')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach((t) => io.observe(t));
  }

  const bar = document.getElementById('topbar');
  const onScroll = () => bar && bar.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (burger && menu) {
    const set = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 980) set(false); });
  }

  // Copiar correo
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const txt = btn.textContent;
      try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Copiado'; }
      catch { btn.textContent = 'Selecciona y copia'; }
      setTimeout(() => { btn.textContent = txt; }, 1800);
    });
  });

  // Formulario: valida y abre el correo con el mensaje listo
  const form = document.getElementById('form');
  if (form) {
    const params = new URLSearchParams(location.search);
    const tema = params.get('tema');
    if (tema) { const sel = form.querySelector('select'); [...sel.options].forEach((o) => { if (o.text === tema) sel.value = o.value; }); }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('[required]').forEach((el) => {
        const bad = !el.value.trim();
        el.closest('.field').classList.toggle('is-bad', bad);
        el.setAttribute('aria-invalid', String(bad));
        if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;
      const d = Object.fromEntries(new FormData(form));
      const subject = `${d.tema} · ${d.nombre}${d.empresa ? ' (' + d.empresa + ')' : ''}`;
      const body = `${d.mensaje}\n\n— ${d.nombre}${d.empresa ? '\n' + d.empresa : ''}`;
      location.href = `mailto:souldevelopercompany@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    form.querySelectorAll('[required]').forEach((el) => el.addEventListener('input', () => el.closest('.field').classList.remove('is-bad')));
  }
})();
