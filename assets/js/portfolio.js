/* Main portfolio page behaviour. Data comes from PHP through data-* attributes. */
const $ = s => document.querySelector(s),
  $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

/* scroll progress, active nav, reveal */
const bar = $("#bar");
addEventListener("scroll", () => {
  const m = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${m>0?scrollY/m:0})`
}, {
  passive: true
});
const links = $$(".nav nav a");
$$("main section").forEach(s => new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.hash === "#" + s.id))
}), {
  rootMargin: "-45% 0px -50% 0px"
}).observe(s));
const rv = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add("in");
    rv.unobserve(e.target)
  }
}), {
  threshold: .08
});
$$(".rv").forEach(s => rv.observe(s));

/* role typer */
const roleEl = $("#role"),
  roles = JSON.parse(roleEl.dataset.roles);
if (!reduce && roles.length > 1) {
  let i = 0,
    j = roles[0].length,
    del = true;
  (function tick() {
    const w = roles[i];
    roleEl.textContent = w.slice(0, j);
    if (del) {
      j--;
      if (j < 0) {
        del = false;
        i = (i + 1) % roles.length;
        j = 0
      }
      setTimeout(tick, 45)
    } else {
      j++;
      if (j > roles[i].length) {
        del = true;
        j = roles[i].length;
        return setTimeout(tick, 1600)
      }
      setTimeout(tick, 85)
    }
  })();
}

/* lightbox with prev/next */
const dlg = $("#dlg"),
  dArt = $("#dArt"),
  dCap = $("#dCap");
let set = [],
  cur = 0;

function show(i) {
  cur = (i + set.length) % set.length;
  const t = set[cur];
  dArt.style.background = t.dataset.bg;
  dArt.style.setProperty("--r", t.dataset.r);
  dCap.textContent = t.dataset.cap
}
$$(".grid").forEach(g => g.addEventListener("click", e => {
  const t = e.target.closest(".tile");
  if (!t) return;
  set = [...g.querySelectorAll(".tile:not([hidden])")];
  show(set.indexOf(t));
  dlg.showModal()
}));
$("#dPrev").onclick = () => show(cur - 1);
$("#dNext").onclick = () => show(cur + 1);
$("#dClose").onclick = () => dlg.close();
dlg.addEventListener("click", e => {
  if (e.target === dlg) dlg.close()
});
dlg.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") show(cur - 1);
  if (e.key === "ArrowRight") show(cur + 1)
});

/* cert tilt */
$$(".cert").forEach(c => {
  if (reduce) return;
  c.addEventListener("pointermove", e => {
    const b = c.getBoundingClientRect(),
      x = (e.clientX - b.left) / b.width - .5,
      y = (e.clientY - b.top) / b.height - .5;
    c.style.transform = `perspective(600px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`
  });
  c.addEventListener("pointerleave", () => c.style.transform = "")
});

/* ===== portrait + rope: ragdoll physics =====
   The portrait is a rigid body (4 corners joined by rods) hanging from two cords.
   The rope is a chain of 14 linked points with a weighted handle on the end.
   Both run on one verlet loop, so everything swings, whips and settles on its own. */
const stage = $(".stage"),
  swing = $(".swing"),
  tilt = $(".tilt"),
  cordA = $("#cordA"),
  cordB = $("#cordB"),
  P = $("#portrait");
/* resolve against the page, not the stylesheet (CSS variables resolve url() from assets/css/) */
P.style.setProperty("--img", `url("${new URL(P.dataset.img, document.baseURI).href}")`);

/* halftone spotlight (offsetX/Y stay correct while the portrait is rotated) */
function aim(e) {
  P.style.setProperty("--mx", e.offsetX + "px");
  P.style.setProperty("--my", e.offsetY + "px");
  P.style.setProperty("--rad", "130px")
}
["pointerenter", "pointermove", "pointerdown"].forEach(t => P.addEventListener(t, aim));
["pointerleave", "pointercancel"].forEach(t => P.addEventListener(t, () => P.style.setProperty("--rad", "0px")));

/* name drift */
const nm = $("#name");
document.addEventListener("pointermove", e => {
  nm.style.setProperty("--dx", ((e.clientX / innerWidth - .5) * 28).toFixed(1));
  nm.style.setProperty("--dy", ((e.clientY / innerHeight - .5) * 18).toFixed(1))
});

/* ---------- shared ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const STEP = 1000 / 60;
let raf = 0,
  last = 0,
  acc = 0,
  down = false;

/* ---------- portrait ragdoll ---------- */
const G = .5, // gravity
  CORD = 22, // cord length
  INSET = 8, // cord x inset from the stage edge
  TOP = 5, // cord anchor y when hanging
  pts = [0, 1, 2, 3].map(() => ({
    x: 0,
    y: 0,
    px: 0,
    py: 0
  })), // TL, TR, BR, BL
  rods = [];
let W = 0,
  H = 0,
  bw = 0,
  bh = 0,
  ay = TOP,
  parkedAy = 0,
  armed = false,
  parked = true,
  lifting = false,
  grab = null,
  eP = 0;

function place(x, y) {
  [
    [x, y],
    [x + bw, y],
    [x + bw, y + bh],
    [x, y + bh]
  ].forEach((c, i) => {
    const p = pts[i];
    p.x = p.px = c[0];
    p.y = p.py = c[1]
  })
}

function layout() {
  W = stage.clientWidth;
  H = stage.clientHeight;
  bw = W - INSET * 2;
  bh = H - CORD - TOP - 8;
  tilt.style.width = bw + "px";
  tilt.style.height = bh + "px";
  parkedAy = -(bh + CORD + 40);
  const diag = Math.hypot(bw, bh);
  rods.length = 0;
  rods.push([0, 1, bw], [1, 2, bh], [2, 3, bw], [3, 0, bh], [0, 2, diag], [1, 3, diag]);
  ay = down ? TOP : parkedAy;
  armed = down;
  parked = !down;
  lifting = false;
  place(INSET, ay + CORD);
  swing.style.visibility = down ? "visible" : "hidden";
  renderPortrait()
}

function rodSolve(a, b, len) {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    d = Math.hypot(dx, dy) || 1e-6,
    k = (d - len) / d * .5;
  a.x += dx * k;
  a.y += dy * k;
  b.x -= dx * k;
  b.y -= dy * k
}

function cordSolve(p, axp) {
  const dx = p.x - axp,
    dy = p.y - ay,
    d = Math.hypot(dx, dy);
  if (d > CORD) {
    const s = (d - CORD) / d;
    p.x -= dx * s;
    p.y -= dy * s
  }
}

function stepPortrait() {
  if (parked) return;
  let en = 0;
  for (const p of pts) {
    const vx = (p.x - p.px) * .992,
      vy = (p.y - p.py) * .992;
    en += Math.abs(vx) + Math.abs(vy);
    p.px = p.x;
    p.py = p.y;
    p.x += vx;
    p.y += vy + G
  }
  eP = en;
  if (lifting) {
    const dy = parkedAy - ay;
    ay += Math.sign(dy) * Math.min(Math.abs(dy), clamp(Math.abs(dy) * .07, 2, 14));
    if (ay <= parkedAy + .5) {
      lifting = false;
      parked = true;
      armed = false;
      swing.style.visibility = "hidden";
      place(INSET, parkedAy + CORD);
      return
    }
  }
  if (!armed && pts[0].y > ay && pts[1].y > ay) armed = true; // cords catch once it has fallen past them
  for (let k = 0; k < 10; k++) {
    for (const [i, j, len] of rods) rodSolve(pts[i], pts[j], len);
    if (armed) {
      cordSolve(pts[0], INSET);
      cordSolve(pts[1], W - INSET)
    }
    if (armed) { // the stage edges act as walls and a floor
      for (const p of pts) {
        p.x = clamp(p.x, 2, W - 2);
        if (p.y > H - 2) p.y = H - 2
      }
    }
    if (grab) {
      grab.p.x += clamp((grab.x - grab.p.x) * .15, -40, 40);
      grab.p.y += clamp((grab.y - grab.p.y) * .15, -40, 40)
    }
  }
}

function renderPortrait() {
  const [tl, tr, br, bl] = pts;
  const cx = (tl.x + tr.x + br.x + bl.x) / 4,
    cy = (tl.y + tr.y + br.y + bl.y) / 4,
    ang = Math.atan2((tr.y - tl.y) + (br.y - bl.y), (tr.x - tl.x) + (br.x - bl.x));
  tilt.style.transform = `translate(${(cx - bw / 2).toFixed(2)}px,${(cy - bh / 2).toFixed(2)}px) rotate(${ang.toFixed(4)}rad)`;
  const vis = parked ? "hidden" : "visible";
  cordA.style.visibility = cordB.style.visibility = vis;
  cordA.setAttribute("x1", INSET);
  cordA.setAttribute("y1", ay);
  cordA.setAttribute("x2", tl.x.toFixed(1));
  cordA.setAttribute("y2", tl.y.toFixed(1));
  cordB.setAttribute("x1", W - INSET);
  cordB.setAttribute("y1", ay);
  cordB.setAttribute("x2", tr.x.toFixed(1));
  cordB.setAttribute("y2", tr.y.toFixed(1))
}

function dropPortrait() {
  down = true;
  lifting = false;
  swing.style.visibility = "visible";
  parked = false;
  if (reduce) {
    ay = TOP;
    armed = true;
    place(INSET, TOP + CORD);
    renderPortrait();
    return
  }
  armed = false;
  ay = TOP;
  const s = Math.random() < .5 ? -1 : 1; // a little random spin as it falls
  pts[0].px -= s * 2;
  pts[2].px += s * 2;
  kick()
}

function liftPortrait() {
  down = false;
  if (reduce) {
    parked = true;
    swing.style.visibility = "hidden";
    ay = parkedAy;
    place(INSET, parkedAy + CORD);
    renderPortrait();
    return
  }
  lifting = true;
  armed = true;
  kick()
}

/* grab and fling the portrait */
P.addEventListener("pointerdown", e => {
  if (parked || reduce || e.button > 0) return;
  const r = stage.getBoundingClientRect(),
    lx = e.clientX - r.left - stage.clientLeft,
    ly = e.clientY - r.top - stage.clientTop;
  let best = pts[0],
    bd = 1e9;
  for (const p of pts) {
    const d = Math.hypot(p.x - lx, p.y - ly);
    if (d < bd) {
      bd = d;
      best = p
    }
  }
  grab = {
    p: best,
    ox: best.x - lx,
    oy: best.y - ly,
    x: best.x,
    y: best.y
  };
  P.setPointerCapture(e.pointerId);
  P.classList.add("grab");
  kick()
});
P.addEventListener("pointermove", e => {
  if (!grab) return;
  const r = stage.getBoundingClientRect();
  grab.x = e.clientX - r.left - stage.clientLeft + grab.ox;
  grab.y = e.clientY - r.top - stage.clientTop + grab.oy
});
["pointerup", "pointercancel"].forEach(t => P.addEventListener(t, () => {
  grab = null;
  P.classList.remove("grab")
}));

/* ---------- rope ragdoll ---------- */
const rig = $("#rig"),
  handle = $("#handle"),
  rCore = $("#rCore"),
  rBackA = $("#rBackA"),
  rBackB = $("#rBackB"),
  rEdge = $("#rEdge"),
  rFrontA = $("#rFrontA"),
  rFrontB = $("#rFrontB"),
  cap2 = $("#cap2"),
  N = 14,
  REST = 150,
  CX = 32,
  rope = Array.from({
    length: N + 1
  }, (_, i) => ({
    x: CX,
    y: REST * i / N,
    px: CX,
    py: REST * i / N
  }));
let extra = 0,
  ev = 0,
  dragging = false,
  tx = CX,
  ty = REST,
  fired = false,
  sy = 0,
  sxs = 0,
  eR = 0;

function stepRope() {
  const end = rope[N];
  let L;
  if (dragging) {
    L = Math.max(REST, Math.hypot(tx - CX, ty)) * 1.01;
  } else {
    ev += -.14 * extra - .09 * ev;
    extra += ev;
    L = Math.max(40, REST + extra)
  }
  const seg = L / N;
  let en = 0;
  for (let i = 1; i <= N; i++) {
    const p = rope[i];
    if (dragging && i === N) continue;
    const vx = (p.x - p.px) * .988,
      vy = (p.y - p.py) * .988;
    en += Math.abs(vx) + Math.abs(vy);
    p.px = p.x;
    p.py = p.y;
    p.x += vx;
    p.y += vy + G * 1.1
  }
  if (dragging) { // the hand moves the end; keep its speed so letting go flings it
    end.px = end.x;
    end.py = end.y;
    end.x += (tx - end.x) * .5;
    end.y += (ty - end.y) * .5
  }
  eR = en + Math.abs(extra) + Math.abs(ev);
  for (let k = 0; k < 14; k++) {
    for (let i = 0; i < N; i++) {
      const a = rope[i],
        b = rope[i + 1],
        wa = i === 0 ? 0 : 1,
        wb = (i + 1 === N) ? (dragging ? 0 : .35) : 1,
        dx = b.x - a.x,
        dy = b.y - a.y,
        d = Math.hypot(dx, dy) || 1e-6,
        diff = (d - seg) / d / (wa + wb || 1);
      a.x += dx * diff * wa;
      a.y += dy * diff * wa;
      b.x -= dx * diff * wb;
      b.y -= dy * diff * wb
    }
  }
}

/* The rope is drawn as two twisted strands. The twist is tied to arc length, so it
   stays evenly spaced and slides along the rope when it stretches or whips. */
const SAMPLES = 44,
  TWIST = 13, // px of rope per full twist
  AMP = 1.8; // how far the strands wind away from the centre line

function renderRope() {
  const cum = [0];
  for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(rope[i].x - rope[i - 1].x, rope[i].y - rope[i - 1].y));
  const total = cum[N] || 1,
    c = [];
  let k = 0;
  for (let i = 0; i <= SAMPLES; i++) {
    const s = total * i / SAMPLES;
    while (k < N - 1 && cum[k + 1] < s) k++;
    const a = rope[k],
      b = rope[k + 1],
      seg = (cum[k + 1] - cum[k]) || 1,
      t = clamp((s - cum[k]) / seg, 0, 1),
      tx = b.x - a.x,
      ty = b.y - a.y,
      tl = Math.hypot(tx, ty) || 1;
    c.push({
      x: a.x + tx * t,
      y: a.y + ty * t,
      nx: -ty / tl,
      ny: tx / tl,
      s
    })
  }
  let core = "",
    bA = "",
    bB = "",
    fA = "",
    fB = "",
    edge = "";
  const f = v => v.toFixed(1),
    o = (p, sgn) => {
      const w = Math.sin(p.s * 2 * Math.PI / TWIST) * AMP * sgn;
      return [p.x + p.nx * w, p.y + p.ny * w]
    };
  core = `M${f(c[0].x)} ${f(c[0].y)}`;
  for (let i = 1; i <= SAMPLES; i++) core += `L${f(c[i].x)} ${f(c[i].y)}`;
  for (let i = 0; i < SAMPLES; i++) {
    const m = (c[i].s + c[i + 1].s) / 2,
      aFront = Math.cos(m * 2 * Math.PI / TWIST) > 0,
      a0 = o(c[i], 1),
      a1 = o(c[i + 1], 1),
      b0 = o(c[i], -1),
      b1 = o(c[i + 1], -1),
      sa = `M${f(a0[0])} ${f(a0[1])}L${f(a1[0])} ${f(a1[1])}`,
      sb = `M${f(b0[0])} ${f(b0[1])}L${f(b1[0])} ${f(b1[1])}`;
    if (aFront) {
      bB += sb;
      fA += sa;
      edge += sa
    } else {
      bA += sa;
      fB += sb;
      edge += sb
    }
  }
  rCore.setAttribute("d", core);
  rBackA.setAttribute("d", bA);
  rBackB.setAttribute("d", bB);
  rEdge.setAttribute("d", edge);
  rFrontA.setAttribute("d", fA);
  rFrontB.setAttribute("d", fB);
  const e = rope[N],
    q = rope[N - 1],
    ang = Math.atan2(e.x - q.x, e.y - q.y) * 180 / Math.PI;
  handle.setAttribute("transform", `translate(${e.x.toFixed(1)} ${e.y.toFixed(1)}) rotate(${(-ang).toFixed(1)})`)
}

let currentImgIndex = 1; // first pull selects portrait.jpg; next pull selects portrait_alt.jpg
function toggle() {
  down ? liftPortrait() : dropPortrait();
  handle.setAttribute("aria-pressed", down);
  rig.classList.toggle("down", down);
  
  if (down && P.dataset.altImg) {
    currentImgIndex = 1 - currentImgIndex;
    const nextImg = currentImgIndex === 1 ? P.dataset.altImg : P.dataset.img;
    P.style.setProperty("--img", `url("${new URL(nextImg, document.baseURI).href}")`);
  }
  
  cap2.textContent = down ? "Pull again to lift it back up. You can also grab the portrait and fling it." : "Pull the rope down to drop the portrait."
}

function tug() {
  toggle();
  if (reduce) return;
  ev = 11;
  const e = rope[N];
  e.px -= (Math.random() < .5 ? -1 : 1) * (2 + Math.random() * 3);
  kick()
}

handle.addEventListener("pointerdown", e => {
  dragging = true;
  fired = false;
  sy = e.clientY;
  sxs = e.clientX;
  tx = CX;
  ty = REST;
  handle.setPointerCapture(e.pointerId);
  rig.classList.add("drag");
  kick()
});
handle.addEventListener("pointermove", e => {
  if (!dragging) return;
  const pull = clamp((e.clientY - sy) * .9, 0, 105);
  tx = CX + clamp((e.clientX - sxs) * .8, -90, 90);
  ty = REST + pull;
  if (pull >= 62 && !fired) {
    fired = true;
    toggle()
  }
});

function release(e) {
  if (!dragging) return;
  dragging = false;
  rig.classList.remove("drag");
  const moved = Math.hypot(e.clientY - sy, e.clientX - sxs);
  if (!fired && e.type === "pointerup" && moved < 6) {
    tug();
    return
  }
  const L = Math.hypot(rope[N].x - CX, rope[N].y);
  extra = Math.max(0, L - REST);
  ev = 0;
  kick()
}
handle.addEventListener("pointerup", release);
handle.addEventListener("pointercancel", release);
handle.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    tug()
  }
});

/* ---------- loop ---------- */
function active() {
  return dragging || grab || lifting || (!parked && (!armed || eP > .05)) || eR > .05
}

function frame(t) {
  acc += Math.min(64, t - last);
  last = t;
  let n = 0;
  while (acc >= STEP && n < 4) {
    stepPortrait();
    stepRope();
    acc -= STEP;
    n++
  }
  if (n === 4) acc = 0;
  renderPortrait();
  renderRope();
  raf = active() ? requestAnimationFrame(frame) : 0
}

function kick() {
  if (reduce || raf) return;
  last = performance.now();
  acc = 0;
  raf = requestAnimationFrame(frame)
}
new ResizeObserver(layout).observe(stage);
layout();
renderRope();


/* Copy the displayed email address */
$$("[data-copy-email]").forEach(button => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copyEmail;
    const status = button.parentElement.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = "Copied!";
      if (status) status.textContent = "Email address copied to clipboard.";
    } catch (error) {
      if (status) status.textContent = value;
      button.textContent = "Select email";
    }
    window.setTimeout(() => { button.textContent = "Copy link"; }, 1800);
  });
});
