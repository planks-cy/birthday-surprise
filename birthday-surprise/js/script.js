/* =====================================================================
   Birthday Surprise — behaviour
   All content comes from js/config.js. You should not need to edit this.
   ===================================================================== */
(function () {
  'use strict';

  const cfg = window.BIRTHDAY_CONFIG || {};
  const root = document.documentElement;

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };
  const rand = (a, b) => a + Math.random() * (b - a);
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMQ.matches;
  const isSmall = () => window.innerWidth < 640 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const isPlaceholder = v => typeof v === 'string' && /^\s*\[[^\]]+\]\s*$/.test(v);
  const SVG_HEART = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-heart"/></svg>';

  function get(path, fallback) {
    const v = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), cfg);
    return v === undefined ? fallback : v;
  }
  function fill(str) {
    return String(str)
      .replace(/\{Priyanka\}/g, cfg.Priyanka || '')
      .replace(/\{Rahul\}/g, cfg.Rahul || '');
  }
  function text(path, fallback) {
    const v = get(path, fallback);
    return typeof v === 'string' ? fill(v) : fallback;
  }
  function scrollToEl(target) {
    const node = typeof target === 'string' ? $(target) : target;
    if (node) node.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------- theme + static text ---------- */
  const colors = Object.assign({
    bg: '#FFF0F5', softPink: '#FFD6E7', rose: '#F7A8B8', coral: '#F47778', burgundy: '#702E3A', white: '#FFFFFF'
  }, cfg.theme || {});
  const varMap = { bg: '--bg', softPink: '--soft-pink', rose: '--rose', coral: '--coral', burgundy: '--burgundy', white: '--white' };
  Object.keys(varMap).forEach(k => root.style.setProperty(varMap[k], colors[k]));
  const themeMeta = $('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', colors.softPink);
  if (cfg.pageTitle) document.title = fill(cfg.pageTitle);

  $$('[data-bind]').forEach(n => {
    const v = text(n.dataset.bind);
    if (v != null) n.textContent = v;
  });

  try {
    const left = Array.from(new Set((JSON.stringify(cfg).match(/\[[^\]]{2,}\]/g) || [])));
    if (left.length) console.info('Birthday site — placeholders still to replace in js/config.js:', left);
  } catch (e) { /* ignore */ }

  /* ---------- canvas FX (hearts + confetti bursts) ---------- */
  const fx = (function () {
    const cv = $('#fx');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, parts = [], raf = 0, last = 0;
    const MAX = isSmall() ? 140 : 260;
    const palette = [colors.coral, colors.rose, colors.softPink, '#FFFFFF', '#FFD98A', colors.burgundy];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    function heartPath(s) {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.9);
      ctx.bezierCurveTo(-s * 1.2, s * 0.1, -s * 0.7, -s * 0.9, 0, -s * 0.35);
      ctx.bezierCurveTo(s * 0.7, -s * 0.9, s * 1.2, s * 0.1, 0, s * 0.9);
      ctx.closePath();
    }
    function add(p) { if (parts.length < MAX) parts.push(p); }

    function burst(x, y, o) {
      if (reduced()) return;
      o = o || {};
      const hearts = o.hearts == null ? 14 : o.hearts;
      const conf = o.confetti == null ? 26 : o.confetti;
      const power = o.power || 1;
      for (let i = 0; i < hearts; i++) {
        const a = rand(-Math.PI * 0.95, -Math.PI * 0.05), v = rand(160, 420) * power;
        add({ t: 'h', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: -35, drag: 0.96,
          rot: rand(-.4, .4), vr: rand(-1.2, 1.2), size: rand(6, 12), life: rand(2.2, 3.4), w: rand(0, 6),
          color: [colors.coral, colors.rose, '#FFFFFF'][i % 3] });
      }
      for (let i = 0; i < conf; i++) {
        const a = rand(-Math.PI, Math.PI) * 0.9 - Math.PI / 2 * 0.2, v = rand(200, 520) * power;
        add({ t: 'c', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, g: 620, drag: 0.985,
          rot: rand(0, 6), vr: rand(-8, 8), size: rand(4, 8), life: rand(2.2, 3.6), w: rand(0, 6),
          round: Math.random() < 0.3, color: palette[Math.floor(Math.random() * palette.length)] });
      }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }

    function frame(ts) {
      const dt = Math.min(0.05, (ts - last) / 1000 || 0.016);
      last = ts;
      ctx.clearRect(0, 0, W, H);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= dt;
        if (p.life <= 0 || p.y > H + 40 || p.y < -100) { parts.splice(i, 1); continue; }
        const k = Math.pow(p.drag, dt * 60);
        p.vx *= k; p.vy = p.vy * k + p.g * dt;
        p.w += dt * 4;
        p.x += p.vx * dt + Math.sin(p.w) * (p.t === 'h' ? 20 : 35) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.t === 'h' ? p.rot * 0.3 : p.rot);
        ctx.globalAlpha = Math.min(1, p.life / 0.5);
        ctx.fillStyle = p.color;
        if (p.t === 'h') { heartPath(p.size); ctx.fill(); }
        else {
          ctx.scale(1, Math.cos(p.w));
          if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, 6.283); ctx.fill(); }
          else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      }
      if (parts.length) raf = requestAnimationFrame(frame);
      else { raf = 0; ctx.clearRect(0, 0, W, H); }
    }
    function clear() { parts.length = 0; ctx.clearRect(0, 0, W, H); }
    return { burst, clear };
  })();

  function burstFrom(node, opts) {
    const r = node.getBoundingClientRect();
    fx.burst(r.left + r.width / 2, r.top + r.height / 2, opts);
  }

  /* ---------- hero ---------- */
  const hero = $('#hero');
  (function buildHero() {
    const title = $('#hero-title');
    const t = text('hero.title', title.textContent);
    title.textContent = '';
    t.split(/\s+/).filter(Boolean).forEach((w, i) => {
      const s = el('span', 'word');
      s.style.setProperty('--i', i);
      s.textContent = w;
      title.appendChild(s);
      title.appendChild(document.createTextNode(' '));
    });

    const box = $('#hero-hearts');
    const n = isSmall() ? 9 : 14;
    const cols = [colors.rose, colors.coral, colors.softPink];
    let placed = 0, tries = 0;
    while (placed < n && tries < 300) {
      tries++;
      const x = rand(3, 92), y = rand(6, 88);
      if (x > 18 && x < 76 && y > 26 && y < 72) continue; // keep clear of the headline
      const h = el('span', 'float-heart');
      h.innerHTML = SVG_HEART;
      h.style.setProperty('--x', x + '%');
      h.style.setProperty('--y', y + '%');
      h.style.setProperty('--s', rand(14, 34).toFixed(0) + 'px');
      h.style.setProperty('--dur', rand(6, 11).toFixed(1) + 's');
      h.style.setProperty('--delay', (-rand(0, 8)).toFixed(1) + 's');
      h.style.setProperty('--c', cols[placed % cols.length]);
      box.appendChild(h);
      placed++;
    }
    requestAnimationFrame(() => hero.classList.add('is-ready'));
  })();

  (function buildAmbient() {
    if (reduced()) return;
    const box = $('#ambient');
    const n = isSmall() ? 10 : 20;
    for (let i = 0; i < n; i++) {
      const r = Math.random();
      const type = r < 0.45 ? 'sparkle' : r < 0.8 ? 'petal' : 'heart';
      const p = el('span', 'particle ' + type);
      if (type === 'heart') p.innerHTML = SVG_HEART;
      const size = type === 'sparkle' ? rand(3, 6) : type === 'petal' ? rand(8, 13) : rand(10, 16);
      p.style.setProperty('--x', rand(0, 98).toFixed(1) + '%');
      p.style.setProperty('--s', size.toFixed(1) + 'px');
      p.style.setProperty('--dx', rand(-60, 60).toFixed(0) + 'px');
      p.style.setProperty('--dur', rand(14, 26).toFixed(1) + 's');
      p.style.setProperty('--delay', (-rand(0, 26)).toFixed(1) + 's');
      box.appendChild(p);
    }
  })();

  /* ---------- gallery + lightbox ---------- */
  const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#FFE3EE"/><stop offset="1" stop-color="#F7A8B8"/></linearGradient></defs>' +
    '<rect width="800" height="1000" fill="url(#g)"/>' +
    '<g transform="translate(400 440) scale(9) translate(-12 -12)" fill="#fff" opacity=".9"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></g>' +
    '<text x="400" y="640" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="44" fill="#702E3A">Add your photo</text></svg>');

  const photos = get('photos', []);
  const photoImgs = [];
  (function buildGallery() {
    const gal = $('#gallery');
    photos.forEach((p, i) => {
      const fig = el('figure', 'photo reveal');
      fig.style.setProperty('--d', (i % 4) * 110 + 'ms');
      const btn = el('button', 'photo-btn');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Open photo: ' + (p.caption || p.alt || 'photo ' + (i + 1)));
      const frame = el('span', 'photo-frame');
      const img = new Image();
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = p.alt || p.caption || '';
      img.addEventListener('error', () => { if (img.dataset.fb) return; img.dataset.fb = '1'; img.src = FALLBACK_IMG; });
      img.src = p.src;
      frame.appendChild(img);
      btn.appendChild(frame);
      const cap = el('figcaption');
      cap.textContent = p.caption || '';
      fig.appendChild(btn);
      fig.appendChild(cap);
      gal.appendChild(fig);
      photoImgs.push(img);
      btn.addEventListener('click', () => openLB(i));
    });
  })();

  const lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
  const lbPrev = $('#lb-prev'), lbNext = $('#lb-next');
  let lbIndex = 0;
  lbImg.addEventListener('error', () => { if (lbImg.dataset.fb) return; lbImg.dataset.fb = '1'; lbImg.src = FALLBACK_IMG; });

  function showLB() {
    const p = photos[lbIndex] || {};
    const thumb = photoImgs[lbIndex];
    delete lbImg.dataset.fb;
    lbImg.src = thumb && thumb.dataset.fb ? FALLBACK_IMG : (p.src || FALLBACK_IMG);
    lbImg.alt = p.alt || p.caption || '';
    lbCap.textContent = p.caption || '';
    lbImg.classList.remove('swap'); void lbImg.offsetWidth; lbImg.classList.add('swap');
  }
  function openLB(i) {
    lbIndex = i;
    showLB();
    lbPrev.hidden = lbNext.hidden = photos.length < 2;
    if (!lb.open) {
      if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
      root.classList.add('lock');
    }
  }
  function stepLB(d) {
    if (photos.length < 2) return;
    lbIndex = (lbIndex + d + photos.length) % photos.length;
    showLB();
  }
  function closeLB() { if (lb.open) { if (typeof lb.close === 'function') lb.close(); else lb.removeAttribute('open'); } root.classList.remove('lock'); }
  $('#lb-close').addEventListener('click', closeLB);
  lbPrev.addEventListener('click', () => stepLB(-1));
  lbNext.addEventListener('click', () => stepLB(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  lb.addEventListener('close', () => root.classList.remove('lock'));
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') stepLB(-1);
    else if (e.key === 'ArrowRight') stepLB(1);
  });

  /* ---------- timeline ---------- */
  (function buildTimeline() {
    const ol = $('#timeline');
    get('story.milestones', []).forEach(m => {
      const li = el('li', 'tl-item reveal');
      const node = el('span', 'tl-node');
      node.setAttribute('aria-hidden', 'true');
      node.innerHTML = SVG_HEART;
      const card = el('div', 'tl-card');
      const date = el('span', 'tl-date'); date.textContent = fill(m.date || '');
      const h = el('h3', 'tl-title'); h.textContent = fill(m.title || '');
      const p = el('p', 'tl-text'); p.textContent = fill(m.text || '');
      card.appendChild(date); card.appendChild(h); card.appendChild(p);
      li.appendChild(node); li.appendChild(card);
      ol.appendChild(li);
    });
  })();

  /* ---------- letter (typewriter) ---------- */
  const letter = (function () {
    const ghost = $('#letter-ghost'), typed = $('#letter-typed'), sr = $('#letter-sr');
    const sign = $('#letter-sign'), heart = $('#letter-heart');
    const skipWrap = $('#letter-actions'), skipBtn = $('#skip-letter');
    let paras = get('letter.paragraphs', []).map(fill);
    const custom = cfg.yourBirthdayMessage;
    if (typeof custom === 'string' && custom.trim() && !isPlaceholder(custom)) {
      paras = fill(custom).trim().split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    }
    const mk = s => { const p = el('p'); p.textContent = s; return p; };
    paras.forEach(s => { ghost.appendChild(mk(s)); sr.appendChild(mk(s)); });

    const off = el('span'); off.textContent = text('letter.signOff', '');
    const nm = el('span'); nm.textContent = text('letter.signature', '');
    sign.appendChild(off); sign.appendChild(nm);

    let token = 0, timer = 0, started = false;

    function showEnd() { sign.classList.add('in'); heart.classList.add('in'); skipWrap.hidden = true; }
    function finish() {
      token++; clearTimeout(timer);
      typed.innerHTML = '';
      paras.forEach(s => typed.appendChild(mk(s)));
      started = true;
      showEnd();
    }
    function start() {
      if (started) return;
      started = true;
      if (reduced()) { finish(); return; }
      const my = ++token;
      typed.innerHTML = '';
      const nodes = paras.map(() => {
        const p = el('p'); const tn = document.createTextNode('');
        p.appendChild(tn); typed.appendChild(p); return tn;
      });
      const chars = paras.map(s => Array.from(s));
      const caret = el('span', 'caret');
      let pi = 0, ci = 0;
      (function step() {
        if (my !== token) return;
        if (pi >= chars.length) { caret.remove(); showEnd(); return; }
        if (ci === 0) nodes[pi].parentNode.appendChild(caret);
        const ch = chars[pi][ci++];
        nodes[pi].data += ch;
        let d = 22;
        if (ci >= chars[pi].length) { pi++; ci = 0; d = 650; }
        else if (/[.!?]/.test(ch)) d = 360;
        else if (ch === ',') d = 180;
        timer = setTimeout(step, d);
      })();
    }
    function reset() {
      token++; clearTimeout(timer);
      typed.innerHTML = '';
      sign.classList.remove('in'); heart.classList.remove('in');
      skipWrap.hidden = false;
      started = false;
    }
    skipBtn.addEventListener('click', finish);
    return { start, finish, reset };
  })();

  const paper = $('#paper');
  let letterIO = null;
  function observeLetter() {
    if (!('IntersectionObserver' in window)) { letter.start(); return; }
    if (!letterIO) {
      letterIO = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { letter.start(); letterIO.unobserve(e.target); } });
      }, { threshold: 0.3 });
    }
    letterIO.observe(paper);
  }
  observeLetter();

  /* ---------- cake ---------- */
  const cake = (function () {
    const stage = $('#cake-stage'), box = $('#candles'), btn = $('#wish-btn'), msg = $('#cake-message');
    const n = Math.max(1, Math.min(9, parseInt(get('cake.candles', 5), 10) || 5));
    for (let i = 0; i < n; i++) {
      const c = el('span', 'candle');
      c.style.setProperty('--fd', (-i * 0.37).toFixed(2) + 's');
      c.innerHTML = '<span class="flame"></span><span class="smoke"></span><span class="wick"></span>';
      box.appendChild(c);
    }
    const labelWish = text('cake.button', 'Make a Wish ✨');
    const labelRelight = text('cake.relightButton', 'Light the Candles Again 🕯️');
    let state = 'lit', timers = [];
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); };

    function ensureVisible(node) {
      const r = node.getBoundingClientRect();
      if (r.bottom > window.innerHeight - 20) {
        window.scrollBy({ top: r.bottom - window.innerHeight + 100, behavior: reduced() ? 'auto' : 'smooth' });
      }
    }
    function celebrate() {
      msg.textContent = text('cake.finalMessage', '');
      msg.classList.add('is-on');
      const r = stage.getBoundingClientRect();
      fx.burst(r.left + r.width / 2, r.top + r.height * 0.35, { hearts: 16, confetti: 60, power: 1.15 });
      later(() => fx.burst(r.left + r.width * 0.2, r.top + r.height * 0.5, { hearts: 8, confetti: 26, power: 0.9 }), 220);
      later(() => fx.burst(r.left + r.width * 0.8, r.top + r.height * 0.5, { hearts: 8, confetti: 26, power: 0.9 }), 380);
      later(() => ensureVisible(msg), 300);
    }
    function blow() {
      state = 'blowing';
      btn.setAttribute('aria-disabled', 'true');
      stage.classList.add('is-blowing');
      const candles = $$('.candle', box);
      const lead = reduced() ? 0 : 700, gap = reduced() ? 0 : 130;
      candles.forEach((c, i) => later(() => c.classList.add('out'), lead + i * gap));
      later(() => {
        stage.classList.remove('is-blowing');
        stage.classList.add('is-out');
        state = 'out';
        btn.textContent = labelRelight;
        btn.removeAttribute('aria-disabled');
        celebrate();
      }, lead + candles.length * gap + 300);
    }
    function relight() {
      $$('.candle', box).forEach(c => c.classList.remove('out'));
      stage.classList.remove('is-out', 'is-blowing');
      msg.classList.remove('is-on'); msg.textContent = '';
      btn.textContent = labelWish;
      state = 'lit';
    }
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      btn.removeAttribute('aria-disabled');
      relight();
    }
    btn.addEventListener('click', () => {
      if (btn.getAttribute('aria-disabled') === 'true') return;
      if (state === 'lit') blow(); else if (state === 'out') relight();
    });
    return { reset };
  })();

  /* ---------- final words ---------- */
  (function buildFinal() {
    const boxEl = $('#final-words');
    const paras = get('final.paragraphs', []);
    let wi = 0;
    paras.forEach((s, pi) => {
      const p = el('p', pi === paras.length - 1 ? 'final-last' : '');
      fill(s).split(/\s+/).filter(Boolean).forEach(w => {
        const sp = el('span', 'fw');
        sp.style.setProperty('--i', wi++);
        sp.textContent = w;
        p.appendChild(sp);
        p.appendChild(document.createTextNode(' '));
      });
      boxEl.appendChild(p);
    });
    $('#final-actions').style.setProperty('--d', (wi * 85 + 500) + 'ms');
  })();

  /* ---------- scroll reveals ---------- */
  const revealEls = $$('.reveal, [data-reveal]');
  let revealIO = null;
  if ('IntersectionObserver' in window) {
    revealIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  }
  function observeReveals() {
    revealEls.forEach(n => {
      n.classList.remove('in');
      if (revealIO) revealIO.observe(n); else n.classList.add('in');
    });
  }
  observeReveals();

  /* ---------- dot navigation ---------- */
  (function dotNav() {
    const links = $$('.dots a');
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false'));
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    ['hero', 'memories', 'story', 'letter', 'cake', 'final'].forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });
  })();

  /* ---------- scroll hint ---------- */
  (function scrollHint() {
    const hint = $('#scroll-hint');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { hint.classList.toggle('is-hidden', window.scrollY > 60); ticking = false; });
    }, { passive: true });
  })();

  /* ---------- start button ---------- */
  const startBtn = $('#start-btn');
  startBtn.addEventListener('click', () => {
    burstFrom(startBtn, { hearts: 16, confetti: 30 });
    setTimeout(() => scrollToEl('#memories'), reduced() ? 0 : 450);
  });

  /* ---------- music player ---------- */
  (function music() {
    const player = $('#player'), btn = $('#music-toggle'), audio = $('#bgm'), title = $('#music-title');
    const file = get('music.file', '');
    title.textContent = text('music.title', 'A Little Melody for You');
    if (!file) { player.hidden = true; return; }
    audio.volume = 0.7;
    let loaded = false;
    function setPlaying(on) {
      player.classList.toggle('is-playing', on);
      if (on) player.classList.add('was-played');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
    }
    btn.addEventListener('click', () => {
      if (!loaded) { audio.src = file; loaded = true; } // only fetched after the first tap
      if (audio.paused) {
        const pr = audio.play();
        if (pr && typeof pr.catch === 'function') pr.catch(() => { /* blocked or failed — 'error' event handles real failures */ });
      } else audio.pause();
    });
    audio.addEventListener('play', () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('error', () => {
      if (!loaded) return;
      setPlaying(false);
      title.textContent = text('music.unavailableText', "Music isn't available right now");
      btn.setAttribute('aria-disabled', 'true');
      setTimeout(() => player.classList.add('is-hidden'), 3200);
    });
  })();

  /* ---------- replay ---------- */
  const replayBtn = $('#replay-btn');
  function waitForTop(cb) {
    const t0 = performance.now();
    (function check() {
      if (window.scrollY < 4 || performance.now() - t0 > 4000) cb();
      else requestAnimationFrame(check);
    })();
  }
  function resetAll() {
    closeLB();
    letter.reset();
    cake.reset();
    fx.clear();
    observeReveals();
    observeLetter();
    hero.classList.remove('is-ready');
    void hero.offsetWidth;
    hero.classList.add('is-ready');
    startBtn.focus({ preventScroll: true });
  }
  replayBtn.addEventListener('click', () => {
    burstFrom(replayBtn, { hearts: 12, confetti: 0 });
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    waitForTop(resetAll);
  });
})();
