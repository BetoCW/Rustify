(() => {
  const fine = matchMedia("(pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- i18n ---------- */
  const EN = {
    "nav.memory": "Memory", "nav.features": "Features", "nav.engine": "Engine",
    "hero.pill": "v0.5.0 · Free · Open source",
    "hero.t1": "Your music.", "hero.t2": "Without the weight.",
    "hero.sub": "<strong>Rustify</strong> is a desktop YouTube Music player written from scratch in <strong>Rust</strong>. The whole catalog, no ads, and <strong>~30&nbsp;MB</strong> of memory instead of 600.",
    "cta.download": "Download for Windows", "cta.source": "View the code", "cta.releases": "All releases",
    "hero.note": "Windows 10/11 · x64 · No admin rights needed",
    "float.mem": "Memory", "float.play": "Playing in < 0.2 s",
    "mem.eyebrow": "Why it exists",
    "mem.title": "Same as Electron,<br><span class=\"grad\">20× lighter.</span>",
    "mem.lead": "Private memory measured while a song plays. No hidden browser, no GPU busy just to draw buttons.",
    "mem.prev": "Previous version",
    "stat.less": "less memory than Electron", "stat.start": "from click to first sound",
    "stat.ads": "ads. The website is never loaded, only the audio", "stat.jam": "friends listening with you in Jam",
    "feat.eyebrow": "Everything you expect",
    "feat.title": "Light doesn't mean <span class=\"grad\">incomplete.</span>",
    "f1.t": "Plays instantly", "f1.d": "Playback starts with the first downloaded chunk (~0.4 MB) while the rest keeps arriving. The next song is already preloading.",
    "f2.t": "10-band equalizer", "f2.d": "With presets, exponential volume and a custom DSP that skips leading silence.",
    "f3.t": "Synced lyrics", "f3.d": "From LRCLIB or YouTube Music's official lyrics, line by line.", "f3.l": "and the lyrics follow along",
    "f4.t": "One-click updates", "f4.d": "The UpDate button turns red when there's a new version: it downloads, installs and reopens by itself.",
    "f5.d": "Automatically skips the non-music parts of music videos.",
    "f6.t": "Built into Windows", "f6.d": "Media keys, the system media overlay, tray icon and global hotkeys.",
    "f7.t": "Connected to what you already use",
    "f7.d": "Discord Rich Presence, Last.fm and ListenBrainz scrobbling, notifications and a local HTTP API compatible with Pear. Sign in with Google for your library and likes — or don't, everything else works the same.",
    "f7.c": "Drag-to-reorder queue", "f7.c2": "Automatic radio",
    "jam.title": "Listen to the same thing,<br><span class=\"grad\">each one at home.</span>",
    "jam.lead": "YouTube Music has no Jam, so we built one. A name, a password, done: no IPs, no port forwarding, no firewall prompts.",
    "jam.c1": "<b>One download.</b> The host fetches each song once and sends those same bytes to the guests.",
    "jam.c2": "<b>NTP-style sync.</b> Each guest estimates the host's clock and corrects itself if it drifts more than 120 ms.",
    "jam.c3": "<b>End-to-end encrypted.</b> QUIC over iroh, with a direct connection whenever possible.",
    "jam.sync": "In sync · ±120 ms",
    "gal.eyebrow": "Inside", "gal.title": "Simple, dark and <span class=\"grad\">fast.</span>",
    "gal.home": "Home", "gal.settings": "Settings",
    "eng.eyebrow": "Under the hood", "eng.title": "Every piece chosen <span class=\"grad\">for its weight.</span>",
    "eng.lead": "From search to speaker, pure Rust except for one two-second step.",
    "eng.s1": "UI with the software renderer. No OpenGL or DirectX: just opening a GPU context cost 100 MB.",
    "eng.s2": "YouTube Music catalog: home, search, artists, albums, playlists, radio and lyrics.",
    "eng.s3": "Resolves the audio URL in ~2 s and exits. Cached for 6 h, downloaded and updated automatically.",
    "eng.s4": "Chunked download into memory, AAC decoding and playback. Custom equalizer and DSP.",
    "eng.s5": "QUIC with hole punching and relays for Jam, end-to-end encrypted.",
    "end.title": "Made for fun.<br><span class=\"grad\">Free forever.</span>",
    "end.lead": "Rustify isn't for sale. It's a personal project to prove a music app can be fast, beautiful and kind to your computer.",
    "end.smart": "The installer isn't code-signed: if Windows SmartScreen warns you, choose “More info → Run anyway”.",
    "foot.text": "Open source under GPL-3.0. Not affiliated with YouTube or Google.",
  };
  const ES = {};
  $$("[data-i18n]").forEach(el => (ES[el.dataset.i18n] = el.textContent));
  $$("[data-i18n-html]").forEach(el => (ES[el.dataset.i18nHtml] = el.innerHTML));

  let lang = "es";
  try { lang = localStorage.getItem("rustify-lang") || (navigator.language.startsWith("es") ? "es" : "en"); } catch { /* sin storage */ }
  const applyLang = l => {
    const dict = l === "en" ? EN : ES;
    $$("[data-i18n]").forEach(el => { const v = dict[el.dataset.i18n]; if (v != null) el.textContent = v; });
    $$("[data-i18n-html]").forEach(el => { const v = dict[el.dataset.i18nHtml]; if (v != null) el.innerHTML = v; });
    document.documentElement.lang = l;
    $("#lang").textContent = l === "en" ? "ES" : "EN";
    lang = l;
    moveInk();
  };
  $("#lang").addEventListener("click", () => {
    applyLang(lang === "en" ? "es" : "en");
    try { localStorage.setItem("rustify-lang", lang); } catch { /* sin storage */ }
  });

  /* ---------- nav ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 20);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal + counters ---------- */
  const countUp = el => {
    const to = +el.dataset.to;
        const dur = 1600, t0 = performance.now();
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$(".count", e.target).forEach(c => { if (!c.dataset.done) { c.dataset.done = 1; countUp(c); } });
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  // escalona los elementos hermanos que entran juntos
  $$(".reveal").forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
    io.observe(el);
  });
  // contadores fuera de un .reveal (tarjeta flotante)
  $$(".float-card .count").forEach(c => setTimeout(() => { c.dataset.done = 1; countUp(c); }, 700));

  /* ---------- pointer effects ---------- */
  if (fine) {
    const root = document.documentElement;
    addEventListener("pointermove", e => {
      root.style.setProperty("--mx", e.clientX + "px");
      root.style.setProperty("--my", e.clientY + "px");
    }, { passive: true });

    $$(".spot").forEach(card => card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--cx", e.clientX - r.left + "px");
      card.style.setProperty("--cy", e.clientY - r.top + "px");
    }));

    $$(".magnetic").forEach(b => {
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });
  }

  /* ---------- hero window tilt ---------- */
  const tilt = $("#tilt"), hero = $("#heroVisual");
  if (tilt && matchMedia("(min-width: 1001px)").matches) {
    let hover = null;
    const render = () => {
      // al bajar, la ventana se endereza
      const k = Math.max(0, 1 - scrollY / 500);
      let ry = -14 * k, rx = 8 * k, rz = 1 * k;
      if (hover) { ry = hover.x * 10; rx = -hover.y * 8; rz = 0; }
      tilt.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg)`;
    };
    hero.addEventListener("pointermove", e => {
      const r = tilt.getBoundingClientRect();
      hover = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
      tilt.style.setProperty("--sx", (e.clientX - r.left) + "px");
      tilt.style.setProperty("--sy", (e.clientY - r.top) + "px");
      render();
    });
    hero.addEventListener("pointerleave", () => { hover = null; render(); });
    addEventListener("scroll", () => { if (!hover) render(); }, { passive: true });
  }

  /* ---------- waveform ---------- */
  const wave = $("#wavePath");
  if (wave) {
    let visible = false, t = 0;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) frame(); }).observe(wave.closest(".card"));
    const draw = () => {
      let d = "";
      for (let x = 0; x <= 600; x += 6) {
        const env = Math.sin((x / 600) * Math.PI);
        const y = 40 + env * (Math.sin(x * 0.045 + t) * 16 + Math.sin(x * 0.11 - t * 1.7) * 9 + Math.sin(x * 0.021 + t * 0.6) * 8);
        d += (x ? "L" : "M") + x + " " + y.toFixed(1);
      }
      wave.setAttribute("d", d);
    };
    function frame() {
      if (!visible) return;
      t += 0.045; draw();
      requestAnimationFrame(frame);
    }
    draw();
  }

  /* ---------- gallery tabs ---------- */
  const tabs = $$(".tab"), ink = $(".tab-ink"), shots = $$(".shot");
  function moveInk() {
    const a = $(".tab.active");
    if (!a || !ink) return;
    ink.style.width = a.offsetWidth + "px";
    ink.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  let auto;
  const select = name => {
    tabs.forEach(t => { const on = t.dataset.shot === name; t.classList.toggle("active", on); t.setAttribute("aria-selected", on); });
    shots.forEach(s => s.classList.toggle("active", s.dataset.shot === name));
    moveInk();
  };
  tabs.forEach(t => t.addEventListener("click", () => { clearInterval(auto); select(t.dataset.shot); }));
  {
    const names = tabs.map(t => t.dataset.shot);
    auto = setInterval(() => {
      const i = names.indexOf($(".tab.active").dataset.shot);
      select(names[(i + 1) % names.length]);
    }, 4200);
  }
  addEventListener("resize", moveInk);

  /* ---------- terminal ---------- */
  const term = $("#term");
  const lines = [
    ["d", "$ "], ["", "rustify --play \"Corre Amor\"\n"],
    ["a", "▸ "], ["", "rustypipe   "], ["d", "buscando en YouTube Music ...  "], ["ok", "ok 180 ms\n"],
    ["a", "▸ "], ["", "yt-dlp      "], ["d", "resolviendo audio (cache) ...  "], ["ok", "ok 2 ms\n"],
    ["a", "▸ "], ["", "stream      "], ["d", "primer fragmento 0.4 MB ...    "], ["ok", "ok 140 ms\n"],
    ["a", "▸ "], ["", "symphonia   "], ["d", "AAC 48 kHz → rodio ...         "], ["ok", "sonando ♪\n"],
    ["a", "▸ "], ["", "memoria     "], ["r", "31.8 MB\n"],
  ];
  const linesEN = { "buscando en YouTube Music ...  ": "searching YouTube Music ...    ", "resolviendo audio (cache) ...  ": "resolving audio (cached) ...   ", "primer fragmento 0.4 MB ...    ": "first chunk 0.4 MB ...         ", "sonando ♪\n": "playing ♪\n", "memoria     ": "memory      " };
  if (term) {
    let started = false;
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true;
      const parts = lines.map(([c, s]) => [c, lang === "en" && linesEN[s] ? linesEN[s] : s]);
      let html = "", pi = 0, ci = 0;
      const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      const step = () => {
        if (pi >= parts.length) { term.innerHTML = html + '<span class="caret"></span>'; return; }
        const [cls, text] = parts[pi];
        const chunk = text.slice(0, ++ci);
        term.innerHTML = html + (cls ? `<span class="${cls}">${esc(chunk)}</span>` : esc(chunk)) + '<span class="caret"></span>';
        if (ci >= text.length) {
          html += cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text);
          pi++; ci = 0;
          setTimeout(step, text.endsWith("\n") ? 260 : 40);
        } else setTimeout(step, cls === "d" ? 8 : 22);
      };
      step();
    }, { threshold: 0.4 }).observe(term);
  }

  if (lang !== "es") applyLang(lang);
  addEventListener("load", moveInk);
  moveInk();
})();
