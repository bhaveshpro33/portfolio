import { useEffect, useRef } from "react";
import * as THREE from "three";

// Rounded-rectangle slab (front face at +z)
function rbox(w, h, d, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelSize: .02, bevelThickness: .02, bevelSegments: 2 });
  g.translate(0, 0, -d / 2); return g;
}
// Drawn phone-screen UI (illustrative)
function screenTex() {
  const c = document.createElement("canvas"); c.width = 256; c.height = 540; const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, 540); g.addColorStop(0, "#14297a"); g.addColorStop(1, "#070c24");
  x.fillStyle = g; x.fillRect(0, 0, 256, 540);
  x.fillStyle = "#fff"; x.font = "bold 28px sans-serif"; x.fillText("NewsFlow", 22, 70);
  ["Top", "Tech", "Sport"].forEach((t, i) => { x.fillStyle = i ? "#1f2b5e" : "#3d7bff"; x.beginPath(); x.roundRect(22 + i * 72, 92, 64, 28, 14); x.fill(); x.fillStyle = "#fff"; x.font = "14px sans-serif"; x.fillText(t, 36 + i * 72, 111); });
  [[140, 120], [276, 70], [358, 100]].forEach(([y, h]) => { x.fillStyle = "#16265f"; x.beginPath(); x.roundRect(22, y, 212, h, 14); x.fill(); x.fillStyle = "#3d7bff"; x.fillRect(36, y + 14, 90, 8); x.fillStyle = "#5a6fae"; x.fillRect(36, y + 32, 160, 6); });
  x.fillStyle = "#3d7bff"; x.beginPath(); x.roundRect(22, 478, 212, 36, 18); x.fill(); x.fillStyle = "#fff"; x.font = "bold 14px sans-serif"; x.fillText("▶  Listen", 90, 502);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// Flutter mode: floating phone + UI cards. Java mode: blinking server rack. They flip into each other on toggle.
export default function Hero3D({ mode }) {
  const box = useRef(), modeRef = useRef(mode);
  modeRef.current = mode;
  useEffect(() => {
    const el = box.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ren;
    try { ren = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { el.classList.add("nogl"); return; }
    const small = innerWidth < 700; ren.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
    el.appendChild(ren.domElement);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(45, 1, .1, 50);
    cam.position.set(0, 0, 7.5);
    const g = new THREE.Group(); scene.add(g);
    const metal = new THREE.MeshStandardMaterial({ color: 0x10172e, metalness: .9, roughness: .25 });

    // faint spider-web backdrop
    const R = 3.2, S = 14, N = 7, pts = [];
    const at = (r, i) => [Math.cos(i / S * Math.PI * 2) * r, Math.sin(i / S * Math.PI * 2) * r, 0];
    for (let i = 0; i < S; i++) pts.push(0, 0, 0, ...at(R, i));
    for (let k = 1; k <= N; k++) for (let i = 0; i < S; i++) { const r = k * R / N, a = at(r, i), b = at(r, i + 1), m = at(r * .93, i + .5); pts.push(...a, ...m, ...m, ...b); }
    const web = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)),
      new THREE.LineBasicMaterial({ color: 0x9db4ff, transparent: true, opacity: .22 }));
    web.position.z = -1.5; g.add(web);

    // phone
    const phone = new THREE.Group();
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.55), new THREE.MeshBasicMaterial({ map: screenTex() })); scr.position.z = .1;
    phone.add(new THREE.Mesh(rbox(1.35, 2.7, .14, .22), metal), scr);
    const cards = [0, 1, 2].map(i => {
      const m = new THREE.Mesh(rbox(.85, .3, .04, .08), new THREE.MeshStandardMaterial({ color: 0x16224a, emissive: 0x3d7bff, emissiveIntensity: .45, metalness: .3, roughness: .4 }));
      m.userData.y = .95 - i * .85; m.position.set(i % 2 ? 1.3 : -1.3, m.userData.y, .5 + i * .2); phone.add(m); return m;
    });
    // server rack
    const rack = new THREE.Group(), leds = [];
    for (let i = 0; i < 4; i++) {
      const y = (i - 1.5) * .6, slab = new THREE.Mesh(rbox(2, .44, 1.1, .07), metal); slab.position.y = y; rack.add(slab);
      const vent = new THREE.Mesh(new THREE.BoxGeometry(.9, .05, .02), new THREE.MeshBasicMaterial({ color: 0x2b3558 })); vent.position.set(.45, y, .58); rack.add(vent);
      for (let j = 0; j < 5; j++) { const l = new THREE.Mesh(new THREE.BoxGeometry(.08, .08, .03), new THREE.MeshBasicMaterial({ color: 0xe5243b })); l.position.set(-.8 + j * .14, y, .58); leds.push(l); rack.add(l); }
    }
    g.add(phone, rack);

    // orbit rings + particles
    const rings = [0, 1].map(i => { const r = new THREE.Mesh(new THREE.TorusGeometry(2.7 + i * .35, .008, 8, 120), new THREE.MeshBasicMaterial({ color: 0x3d7bff, transparent: true, opacity: .6 })); r.rotation.set(1.2 + i * .5, i * .8, 0); g.add(r); return r; });
    const P = innerWidth < 700 ? 150 : 320, pa = new Float32Array(P * 3);
    for (let i = 0; i < P; i++) { const r = 3 + Math.random() * 2.5, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1); pa.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3); }
    const dust = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(pa, 3)), new THREE.PointsMaterial({ size: .04, color: 0x3d7bff, transparent: true, opacity: .8 }));
    g.add(dust);

    scene.add(new THREE.AmbientLight(0x334477, 1.1));
    const red = new THREE.PointLight(0xe5243b, 60, 20), blue = new THREE.PointLight(0x3d7bff, 60, 20);
    scene.add(red, blue);
    let px = 0, py = 0, t = 0, kk = modeRef.current === "java" ? 1 : 0, raf, vis = true;
    const size = () => { const w = el.clientWidth, h = el.clientHeight; ren.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); };
    size();
    const ro = new ResizeObserver(size); ro.observe(el);
    const move = e => { const r = el.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - .5; py = (e.clientY - r.top) / r.height - .5; };
    el.addEventListener("pointermove", move);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; loop(); }); io.observe(el);
    const cb = new THREE.Color(0x3d7bff), cr = new THREE.Color(0xe5243b);
    const frame = () => {
      t += .01;
      const k = modeRef.current === "java" ? 1 : 0; kk += (k - kk) * .07;
      red.intensity += ((k ? 90 : 35) - red.intensity) * .05; blue.intensity += ((k ? 35 : 90) - blue.intensity) * .05;
      red.position.set(Math.cos(t) * 4, Math.sin(t * .8) * 3, 3); blue.position.set(-Math.cos(t) * 4, -Math.sin(t * .8) * 3, 3);
      // flip-swap the two models
      phone.scale.setScalar(Math.max(.001, 1 - kk)); phone.visible = kk < .99;
      rack.scale.setScalar(Math.max(.001, kk)); rack.visible = kk > .01;
      phone.rotation.y = Math.sin(t * .8) * .45 + kk * 3; phone.position.y = Math.sin(t * 1.5) * .12;
      rack.rotation.set(.12, -.5 + Math.sin(t * .7) * .3 - (1 - kk) * 3, 0); rack.position.y = Math.sin(t * 1.5) * .12;
      cards.forEach((c, i) => { c.position.y = c.userData.y + Math.sin(t * 1.4 + i * 2) * .1; });
      leds.forEach((l, i) => l.material.color.setHex(Math.sin(t * 4 + i * 1.9) > -.2 ? 0xe5243b : 0x45101a));
      const col = kk > .5 ? cr : cb;
      rings.forEach((r, i) => { r.material.color.lerp(col, .06); r.rotation.z += .004 * (i ? -1 : 1); r.rotation.x += .002; });
      dust.material.color.lerp(col, .06); dust.rotation.y += .0015; web.rotation.z += .0006;
      g.rotation.y += (px * .9 - g.rotation.y) * .05; g.rotation.x += (py * .7 - g.rotation.x) * .05;
      ren.render(scene, cam);
    };
    const loop = () => { cancelAnimationFrame(raf); if (!reduce && vis && !document.hidden) { frame(); raf = requestAnimationFrame(loop); } };
    document.addEventListener("visibilitychange", loop);
    frame(); loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", loop); ren.dispose(); el.innerHTML = ""; };
  }, []);
  return <div ref={box} className="hero3d" aria-hidden="true" />;
}