import { lazy, Suspense, useEffect, useRef, useState } from "react";
import D from "./data.js";

const Hero3D = lazy(() => import("./Hero3D.jsx"));
const L = D.links;

// Illustrative previews (recreated, not real screenshots or verified architecture)
const PV = {
  "NewsFlow": { ui: { head: "NewsFlow", chips: ["Top", "Tech", "Sport"], foot: "▶ Listen · pause · resume" } },
  "Book Bazzar": { flow: ["Flutter app", "Google Sign-In", "Firebase Auth", "Signed-in user"] },
  "SparkMint": { flow: ["Flutter app", "WalletConnect", "Express.js", "MongoDB"] },
  "GymOwl Trainer": { flow: ["Trainer app", "Notification settings API", "Firebase notifications"] },
  "Spring Boot Backend": { flow: ["Client", "Spring Security + JWT", "REST controller", "PostgreSQL"], db: ["users", "orders", "items"] },
  "Pixel Whisper": { flow: ["Image", "Twofish encryption", "Encrypted tiles"] },
  "ChatSpot": { flow: ["Chat client", "Java backend"], db: ["PostgreSQL", "MongoDB"] }
};
const Tags = ({ a }) => a.map(t => <span className="tag" key={t}>{t}</span>);

// pointer → tilt + cursor glow vars
const aim = e => { const r = e.currentTarget.getBoundingClientRect(), s = e.currentTarget.style;
  s.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 8 + "deg"); s.setProperty("--rx", -((e.clientY - r.top) / r.height - .5) * 8 + "deg");
  s.setProperty("--mx", e.clientX - r.left + "px"); s.setProperty("--my", e.clientY - r.top + "px"); };
const rest = e => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };

function Flow({ nodes }) {
  return <div className="flow">{nodes.map((n, i) => <span key={n} className="node" style={{ "--d": i * .6 + "s" }}>{n}</span>)}</div>;
}
function Preview({ id }) {
  const p = PV[id];
  return (
    <div className="pv">
      {p.ui && <div className="ui"><b>{p.ui.head}</b><div>{p.ui.chips.map(c => <u key={c}>{c}</u>)}</div><i /><i className="s" /><i /><em>{p.ui.foot}</em></div>}
      {p.flow && <Flow nodes={p.flow} />}
      {p.db && <div className="db">{p.db.map(t => <span key={t}>{t}</span>)}</div>}
      <small>Illustrative preview</small>
    </div>
  );
}
const Links = ({ p }) => { const ls = ["github", "demo"].filter(k => p.links[k]);
  return ls.length > 0 && <div className="plinks">{ls.map(k => <a key={k} href={p.links[k]} target="_blank" rel="noopener noreferrer">{k === "github" ? "GitHub" : "Live demo"}</a>)}</div>; };
function Card({ p }) {
  return (
    <article className={"pcard" + (p.status === "Planned" ? " planned" : "")} onPointerMove={aim} onPointerLeave={rest}>
      <Preview id={p.id} />
      <div className="pbody">
        <div className="ptop"><h3>{p.id}</h3><span className="badge">{p.status}</span></div>
        <p className="ptype">{p.type}</p><p>{p.desc}</p><div><Tags a={p.tags} /></div><Links p={p} />
      </div>
    </article>
  );
}
// Featured project: big card with a spinning light border
function Spot({ p }) {
  return (
    <article className="spot" onPointerMove={aim}>
      <Preview id={p.id} />
      <div className="spot-body">
        <span className="badge">Featured project</span>
        <h3>{p.id}</h3><p className="ptype">{p.type}</p><p>{p.desc}</p><div><Tags a={p.tags} /></div><Links p={p} />
      </div>
    </article>
  );
}
function Count({ to, dec = 0 }) {
  const r = useRef(), [v, setV] = useState(0);
  useEffect(() => {
    let raf; const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect(); const t0 = performance.now();
      const step = t => { const p = Math.min((t - t0) / 1400, 1); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    });
    io.observe(r.current); return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={r}>{v.toFixed(dec)}</span>;
}
function Typed({ words }) {
  const [i, setI] = useState(0), [n, setN] = useState(0);
  useEffect(() => {
    const w = words[i], id = setTimeout(() => n < w.length ? setN(n + 1) : (setI((i + 1) % words.length), setN(0)), n < w.length ? 70 : 1600);
    return () => clearTimeout(id);
  }, [n, i, words]);
  return <span aria-hidden="true">{words[i].slice(0, n)}<b className="caret" /></span>;
}
const Marquee = ({ a, rev }) => <div className={"mq" + (rev ? " rev" : "")} aria-hidden="true"><div>{[...a, ...a].map((t, i) => <span key={i}>{t}</span>)}</div></div>;

// Education: tilting 3D card, CGPA ring, semester track
function Edu({ e }) {
  const off = 339.3 * (1 - parseFloat(e.cgpa) / 10);
  return (
    <div className="eduwrap rv">
      <div className="edu3d" onPointerMove={aim} onPointerLeave={rest} style={{ "--off": off }}>
        <div className="ering">
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle className="bg" cx="60" cy="60" r="54" /><circle className="fg" cx="60" cy="60" r="54" /></svg>
          <div><b><Count to={parseFloat(e.cgpa)} dec={2} /></b><small>CGPA / 10</small></div>
        </div>
        <div className="etxt">
          <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 12 4 26l28 14 28-14z" fill="currentColor" /><path d="M16 34v12c0 4 8 8 16 8s16-4 16-8V34l-16 8z" fill="currentColor" opacity=".55" /><path d="M58 28v18" stroke="currentColor" strokeWidth="3" /></svg>
          <h3>{e.degree}</h3><p>{e.school}</p>
          <ol className="sems" aria-label={`Semester ${e.sem} of ${e.total}`}>{Array.from({ length: e.total }, (_, i) => <li key={i} style={{ "--k": i }} className={i < e.sem - 1 ? "done" : i === e.sem - 1 ? "now" : ""} />)}</ol>
          <small>Currently  Graduated in Computer Engineering</small>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("flutter");
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.dataset.mode = mode; }, [mode]);
  useEffect(() => {
    const r = document.documentElement;
    const sc = () => r.style.setProperty("--p", scrollY / (r.scrollHeight - innerHeight || 1));
    const mv = e => { r.style.setProperty("--cx", e.clientX + "px"); r.style.setProperty("--cy", e.clientY + "px"); };
    const io = new IntersectionObserver(es => es.forEach(x => x.isIntersecting && (x.target.classList.add("in"), io.unobserve(x.target))), { threshold: .2 });
    document.querySelectorAll(".rv").forEach(n => io.observe(n));
    addEventListener("scroll", sc, { passive: true }); addEventListener("pointermove", mv);
    return () => { io.disconnect(); removeEventListener("scroll", sc); removeEventListener("pointermove", mv); };
  }, []);
  const feat = D.projects.find(p => p.id === D.featured[mode]);
  const projects = D.projects.filter(p => p.mode === mode && p !== feat);
  const s = D.skills, ed = D.education;
  const all = [...s.flutter, ...s.java, ...s.extra];
  const stats = [[D.projects.filter(p => p.status === "Project").length, "Projects built"], [D.experience.length, "Internships"], [parseFloat(ed.cgpa), "CGPA", 2], [new Set(all).size, "Technologies"]];
  const contact = [["Email", L.email && "mailto:" + L.email], ["GitHub", L.github], ["LinkedIn", L.linkedin], ["Call", L.phone && "tel:" + L.phone]].filter(c => c[1]);
  const group = (t, a) => <div className="sgroup" key={t}><h3>{t}</h3><Tags a={a} /></div>;
  return (
    <>
      <div className="bar" aria-hidden="true" /><div className="aura" aria-hidden="true" />
      <header className="nav">
        <a className="mono" href="#home" aria-label="Home">BK</a>
        <div className="toggle" role="group" aria-label="Portfolio mode">
          {[["flutter", "Flutter"], ["java", "Java Backend"]].map(([m, t]) => <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)}>{t}</button>)}
          <span className="thumb" aria-hidden="true" />
        </div>
        <button className="burger" aria-expanded={open} aria-controls="links" aria-label="Menu" onClick={() => setOpen(!open)}><span /><span /></button>
        <nav id="links" className={open ? "open" : ""} aria-label="Primary" onClick={() => setOpen(false)}>
          {["Home", "Projects", "Education", "Experience", "Skills", "Contact"].map(n => <a key={n} href={"#" + n.toLowerCase()}>{n}</a>)}
        </nav>
      </header>
      <main>
        <section id="home" className="hero">
          <div className="hero-copy">
            <p className="status" aria-label={D.role}><Typed words={D.role.split(" · ")} /></p>
            <h1>Building mobile experiences and reliable backend systems.</h1>
            <p className="lead">{D.lead[mode]}</p>
            <div className="cta"><a className="btn primary" href="#projects">View Projects</a><a className="btn" href="#contact">Contact Me</a></div>
          </div>
          <div className="hero-art">
            <Suspense fallback={null}><Hero3D mode={mode} /></Suspense>
            <div className="feat" key={mode}><strong>Featured: {feat.id}</strong><span>{feat.type}</span></div>
          </div>
        </section>
        <div className="band"><Marquee a={mode === "flutter" ? s.flutter : s.java} /><Marquee a={mode === "flutter" ? s.java : s.flutter} rev /></div>
        <section className="wrap stats-wrap"><div className="stats rv">{stats.map(([n, l, d]) => <div key={l}><b><Count to={n} dec={d} /></b><span>{l}</span></div>)}</div></section>
        <section id="projects" className="wrap"><h2 className="rv">Projects</h2>
          <div key={mode}>
            <div className="enter"><Spot p={feat} /></div>
            <div className="grid">{projects.map((p, i) => <div className="enter" style={{ "--i": i + 1 }} key={p.id}><Card p={p} /></div>)}</div>
          </div></section>
        <section id="education" className="wrap"><h2 className="rv">Education</h2><Edu e={ed} /></section>
        <section id="experience" className="wrap"><h2 className="rv">Experience</h2>
          <ol className="timeline">{D.experience.map(e => <li className="tl rv" key={e.company}><h3>{e.role}</h3><p className="meta">{e.company} — {e.place} · {e.date}</p><ul>{e.points.map(x => <li key={x}>{x}</li>)}</ul></li>)}</ol></section>
        <section id="skills" className="wrap"><h2 className="rv">Skills</h2>
          <div key={mode} className="enter">{(mode === "flutter" ? [["Flutter / Mobile", s.flutter], ["Java / Backend", s.java]] : [["Java / Backend", s.java], ["Flutter / Mobile", s.flutter]]).concat([["Additional / Project-specific", s.extra]]).map(([t, a]) => group(t, a))}</div></section>
        <section id="contact" className="wrap"><h2 className="rv">Contact</h2>
          <p>{contact.length ? `Based in ${D.location}. Open to Flutter and Java backend work.` : `Based in ${D.location}. Add your links in src/data.js to show contact buttons here.`}</p>
          <div className="cta">{contact.map(([t, h], i) => <a key={t} className={"btn" + (i ? "" : " primary")} href={h} {...(h.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{t}</a>)}</div></section>
      </main>
      <footer className="foot"><span>© {new Date().getFullYear()} {D.name} — {D.role}</span></footer>
    </>
  );
}
