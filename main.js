// UTMs do anúncio seguem até o checkout da Hotmart; src diz qual botão vendeu
(() => {
  const q = new URLSearchParams(location.search);
  document.querySelectorAll('a.comprar').forEach(a => {
    const u = new URL(a.href);
    q.forEach((v, k) => { if (k.startsWith('utm_')) u.searchParams.set(k, v); });
    u.searchParams.set('src', ['lpsmo', q.get('utm_source'), q.get('utm_content'), a.dataset.pos].filter(Boolean).join('-'));
    a.href = u.toString();
  });
})();

// contagem até o fim da Black Friday
(() => {
  const els = document.querySelectorAll('.contagem');
  if (!els.length) return;
  const fim = new Date(els[0].dataset.fim).getTime();
  const tick = () => {
    const s = Math.max(0, Math.floor((fim - Date.now()) / 1000));
    const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
    const txt = s ? `, faltam ${d} dias e ${h}h${String(m).padStart(2, '0')}` : '';
    els.forEach(el => { el.textContent = txt; });
  };
  tick(); setInterval(tick, 30000);
})();

// botão fixo do celular: some no topo e onde já há oferta na tela
(() => {
  const fixo = document.querySelector('.fixo');
  if (!fixo || !('IntersectionObserver' in window)) return;
  const vis = new Set();
  const io = new IntersectionObserver(es => {
    es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target));
    fixo.classList.toggle('oculto', vis.size > 0);
  });
  document.querySelectorAll('.hero, .oferta, .final, .rodape').forEach(a => io.observe(a));
})();

// Visita e clique em comprar: o script do ManyClone (t.js) dispara. Aqui só o clique no WhatsApp (Contact, só navegador).
(() => {
  const fb = (...a) => { try { window.fbq && window.fbq(...a); } catch { /* bloqueador */ } };
  document.querySelectorAll('a[href*="wa.me"]').forEach(a => a.addEventListener('click', () => fb('track', 'Contact')));
})();
