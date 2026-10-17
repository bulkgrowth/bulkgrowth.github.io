/* Bulk Growth brand dust: small hexagons and dots from the logo drift up the whole page
   like glowing green dust. Sparse, low-opacity, never blocks clicks, pauses when hidden,
   and stays still for visitors who prefer reduced motion. */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var c = document.createElement("canvas");
  c.className = "bg-dust"; c.setAttribute("aria-hidden", "true");
  document.body.appendChild(c);
  var ctx = c.getContext("2d"), w, h, dpr, parts = [], sprites = [];

  // pre-rendered glowing sprites: hexagons and dots, cyan -> lime (brand gradient)
  var COLORS = ["0,245,255", "70,250,170", "166,255,0", "120,255,60", "166,255,0", "190,255,80"];
  function sprite(rgb, hex, r) {
    var s = Math.ceil(r * 6), o = document.createElement("canvas"); o.width = o.height = s * 2;
    var g = o.getContext("2d"), cx = s, cy = s;
    var glow = g.createRadialGradient(cx, cy, 0, cx, cy, s);
    glow.addColorStop(0, "rgba(" + rgb + ",.55)"); glow.addColorStop(.35, "rgba(" + rgb + ",.12)"); glow.addColorStop(1, "rgba(" + rgb + ",0)");
    g.fillStyle = glow; g.fillRect(0, 0, s * 2, s * 2);
    g.fillStyle = "rgb(" + rgb + ")"; g.beginPath();
    if (hex) { for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i + Math.PI / 6; g.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); } g.closePath(); }
    else g.arc(cx, cy, r * .75, 0, Math.PI * 2);
    g.fill();
    return { c: o, half: s };
  }
  COLORS.forEach(function (rgb) { [1.6, 2.6, 3.8].forEach(function (r) { sprites.push(sprite(rgb, true, r)); sprites.push(sprite(rgb, false, r)); }); });

  function spawn(init) {
    return {
      x: Math.random() * w,
      y: init ? Math.random() * h : h + 20 + Math.random() * 80,
      vy: -(.18 + Math.random() * .5),
      drift: .15 + Math.random() * .35, ph: Math.random() * 6.28, sp: .004 + Math.random() * .01,
      s: sprites[(Math.random() * sprites.length) | 0],
      a: 0, max: .35 + Math.random() * .55, life: 0
    };
  }
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(w < 700 ? 34 : 72, w / 18));
    while (parts.length < n) parts.push(spawn(true));
    parts.length = n;
  }
  var running = false, last = 0;
  function frame(t) {
    if (document.hidden) { running = false; return; }
    running = true;
    var dt = Math.min(3, (t - last) / 16.7 || 1); last = t;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.life += dt; p.ph += p.sp * dt;
      p.y += p.vy * dt; p.x += Math.sin(p.ph) * p.drift * dt * .6 + .08 * dt;
      var fadeTop = Math.min(1, p.y / (h * .25));       // fade out near the top
      p.a = Math.min(p.max, p.life / 90 * p.max) * Math.max(0, fadeTop);
      if (p.y < -20 || p.x > w + 20) { parts[i] = spawn(false); continue; }
      ctx.globalAlpha = p.a;
      ctx.drawImage(p.s.c, p.x - p.s.half, p.y - p.s.half);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  function wake() { if (!running) requestAnimationFrame(frame); }
  var rt; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 150); });
  document.addEventListener("visibilitychange", wake);
  size(); wake();
})();
