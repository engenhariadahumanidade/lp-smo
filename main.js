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

// matriz de risco do PGR (1ª tela), em ciclo: riscos no vermelho com nome -> as células acalmam e os nomes viram as
// ações do Facilitador -> volta. A legenda diz em palavras o que está acontecendo.
(() => {
  const m = document.getElementById('matriz'), leg = document.getElementById('matriz-fase');
  if (!m) return;
  const cor = ['#3d5bd9', '#2f6fd9', '#f5a524', '#ff7a59', '#ff4d6d'], cel = [];
  for (let l = 0; l < 5; l++) for (let c = 0; c < 5; c++) {
    const g = (4 - l) + c, i = document.createElement('i');
    i.dataset.risco = cor[Math.min(4, Math.floor(g / 2))];
    i.dataset.calma = g >= 6 ? '#22d3ee' : g >= 4 ? '#2a4cc4' : '#1a2a78';
    i.dataset.g = g; i.style.background = i.dataset.risco; m.append(i); cel.push(i);
  }
  const NOMES = [['Sobrecarga', 'Roda Estruturada', 0, 4], ['Assédio', 'Escuta', 0, 3], ['Metas abusivas', 'Plano de ação', 1, 4], ['Conflito', 'Reavaliação 90 dias', 1, 3]];
  const rot = NOMES.map(([r, a, l, c]) => { const i = cel[l * 5 + c]; i.classList.add('rot'); i.textContent = r; return { i, r, a }; });
  const fase = (t) => { if (leg) leg.textContent = t; };
  fase('Sem gestão: os riscos ficam no vermelho');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // sem movimento: fica o estado de risco, com a legenda
  const ordem = [...cel].sort((a, b) => b.dataset.g - a.dataset.g);
  const acalmar = () => {
    fase('Com o Facilitador: as ações acalmam o mapa');
    ordem.forEach((i, k) => setTimeout(() => { i.style.background = i.dataset.calma; }, k * 70));
    rot.forEach(({ i, a }, k) => setTimeout(() => { i.textContent = a; i.classList.add('calmo'); }, 300 + k * 140));
  };
  const voltar = () => {
    fase('Sem gestão: os riscos ficam no vermelho');
    [...ordem].reverse().forEach((i, k) => setTimeout(() => { i.style.background = i.dataset.risco; }, k * 40));
    rot.forEach(({ i, r }) => { i.textContent = r; i.classList.remove('calmo'); });
  };
  const ciclo = () => { acalmar(); setTimeout(voltar, 5200); };
  setTimeout(() => { ciclo(); setInterval(ciclo, 10000); }, 2600);
})();
