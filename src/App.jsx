import React, { useEffect, useRef, useState } from 'react';
import GestureScroll from './GestureScroll';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LabelList,
} from 'recharts';
import { Users, BarChart3, Info, TrendingUp, BookOpen, Award, ChevronDown } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import './App.css';

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */
const data = [
  { label: "Feb '18", 'DKI Jakarta': 6.65, 'Jawa Barat': 8.23, 'Jawa Timur': 3.91, 'Jawa Tengah': 4.47, 'DI Yogyakarta': 3.37, 'Banten': 8.47, 'Rata-rata': 5.85 },
  { label: "Agu '18", 'DKI Jakarta': 5.73, 'Jawa Barat': 8.22, 'Jawa Timur': 3.77, 'Jawa Tengah': 4.19, 'DI Yogyakarta': 3.00, 'Banten': 7.72, 'Rata-rata': 5.44 },
  { label: "Feb '19", 'DKI Jakarta': 5.50, 'Jawa Barat': 7.78, 'Jawa Timur': 3.77, 'Jawa Tengah': 4.19, 'DI Yogyakarta': 2.89, 'Banten': 7.55, 'Rata-rata': 5.28 },
  { label: "Agu '19", 'DKI Jakarta': 6.54, 'Jawa Barat': 8.04, 'Jawa Timur': 3.82, 'Jawa Tengah': 4.44, 'DI Yogyakarta': 3.18, 'Banten': 8.11, 'Rata-rata': 5.69 },
  { label: "Feb '20", 'DKI Jakarta': 5.15, 'Jawa Barat': 7.71, 'Jawa Timur': 3.60, 'Jawa Tengah': 4.25, 'DI Yogyakarta': 3.38, 'Banten': 7.99, 'Rata-rata': 5.35 },
  { label: "Agu '20", 'DKI Jakarta': 10.95, 'Jawa Barat': 10.46, 'Jawa Timur': 5.84, 'Jawa Tengah': 6.48, 'DI Yogyakarta': 4.57, 'Banten': 10.64, 'Rata-rata': 8.16 },
  { label: "Feb '21", 'DKI Jakarta': 8.51, 'Jawa Barat': 8.92, 'Jawa Timur': 5.17, 'Jawa Tengah': 5.96, 'DI Yogyakarta': 4.28, 'Banten': 9.01, 'Rata-rata': 6.98 },
  { label: "Agu '21", 'DKI Jakarta': 8.50, 'Jawa Barat': 8.92, 'Jawa Timur': 5.74, 'Jawa Tengah': 5.95, 'DI Yogyakarta': 4.56, 'Banten': 8.98, 'Rata-rata': 7.11 },
  { label: "Feb '22", 'DKI Jakarta': 8.00, 'Jawa Barat': 8.35, 'Jawa Timur': 4.81, 'Jawa Tengah': 5.75, 'DI Yogyakarta': 3.73, 'Banten': 8.53, 'Rata-rata': 6.53 },
  { label: "Agu '22", 'DKI Jakarta': 7.18, 'Jawa Barat': 8.31, 'Jawa Timur': 5.49, 'Jawa Tengah': 5.57, 'DI Yogyakarta': 4.06, 'Banten': 8.09, 'Rata-rata': 6.45 },
  { label: "Feb '23", 'DKI Jakarta': 7.57, 'Jawa Barat': 7.89, 'Jawa Timur': 4.33, 'Jawa Tengah': 5.24, 'DI Yogyakarta': 3.58, 'Banten': 7.97, 'Rata-rata': 6.10 },
  { label: "Agu '23", 'DKI Jakarta': 6.53, 'Jawa Barat': 7.44, 'Jawa Timur': 4.88, 'Jawa Tengah': 5.13, 'DI Yogyakarta': 3.69, 'Banten': 7.52, 'Rata-rata': 5.87 },
  { label: "Feb '24", 'DKI Jakarta': 6.03, 'Jawa Barat': 6.91, 'Jawa Timur': 3.74, 'Jawa Tengah': 4.39, 'DI Yogyakarta': 3.24, 'Banten': 7.02, 'Rata-rata': 5.22 },
  { label: "Agu '24", 'DKI Jakarta': 6.21, 'Jawa Barat': 6.75, 'Jawa Timur': 4.19, 'Jawa Tengah': 4.78, 'DI Yogyakarta': 3.48, 'Banten': 6.68, 'Rata-rata': 5.35 },
  { label: "Feb '25", 'DKI Jakarta': 6.18, 'Jawa Barat': 6.74, 'Jawa Timur': 3.61, 'Jawa Tengah': 4.33, 'DI Yogyakarta': 3.18, 'Banten': 6.64, 'Rata-rata': 5.11 },
  { label: "Agu '25", 'DKI Jakarta': 6.05, 'Jawa Barat': 6.77, 'Jawa Timur': 3.88, 'Jawa Tengah': 4.66, 'DI Yogyakarta': 3.46, 'Banten': 6.69, 'Rata-rata': 5.25 },
];

const teamMembers = [
  { nama: "Aullivhya Shavana Zeevania", nim: "G2401251002" },
  { nama: "Albi Ahmad Andika",          nim: "D1401251053" },
  { nama: "Wisnu Aji Saputra",          nim: "E3401251016" },
  { nama: "Muhammad Zacky",             nim: "E3401251141" },
  { nama: "M Faturrahman Almukhlisin", nim: "G0401251042" },
  { nama: "Naufal Fauzan",              nim: "G4401251094" },
  { nama: "Syaqila Shafa Melani",       nim: "G4401251121" },
  { nama: "Silviani",                   nim: "G8401251047" },
  { nama: "Zafira Zahrani",             nim: "G8401251066" },
];

const provinceColors = [
  { name: 'DKI Jakarta',   color: '#22D3EE' },
  { name: 'Jawa Barat',    color: '#F472B6' },
  { name: 'Jawa Timur',    color: '#FB923C' },
  { name: 'Jawa Tengah',   color: '#34D399' },
  { name: 'DI Yogyakarta', color: '#A78BFA' },
  { name: 'Banten',        color: '#FACC15' },
  { name: 'Rata-rata',     color: '#E2E8F0' },
];

const peakAvg = Math.max(...data.map(d => d['Rata-rata']));

/* ─────────────────────────────────────────────────────────────
   ANIMATION CONSTANTS
   ───────────────────────────────────────────────────────────── */

/* ── Physics spring — organik & mewah ── */
const SPRING = { type: 'spring', damping: 20, stiffness: 100 };

/* ── Fast spring untuk micro-interactions ── */
const SPRING_FAST = { type: 'spring', damping: 25, stiffness: 260 };

/* ── Quartic Ease Out ── */
const EASE_QUARTIC = [0.22, 1, 0.36, 1];

/* ── Global page transition ──
   Entry  0.6s spring | Exit 0.3s fast (ritme navigasi) */
const pageVariants = {
  initial: { opacity: 0, y: 30,  filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0,   filter: 'blur(0px)', transition: { ...SPRING } },
  exit:    { opacity: 0, y: -30, filter: 'blur(10px)', transition: { duration: 0.3, ease: EASE_QUARTIC } },
};

/* ── Hero outer stagger — semua baris dipicu oleh parent ini ── */
const heroStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

/* ── BARIS 1 — "Back-to-Front Reveal"
   scale: 0.5 + blur(10px) → scale: 1 + blur(0) ── */
const backToFrontVariant = {
  hidden:  { opacity: 0, scale: 0.5, filter: 'blur(10px)' },
  visible: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { type: 'spring', damping: 18, stiffness: 90 },
  },
};

/* ── BARIS 2 — "Typewriter" container ── */
const typewriterContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04 } },
};
const typewriterChar = {
  hidden:  { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', damping: 22, stiffness: 180 },
  },
};

/* ── BARIS 3 — "Slide-in from Left" ── */
const slideFromLeft = {
  hidden:  { opacity: 0, x: '-100%' },
  visible: {
    opacity: 1, x: 0,
    transition: { type: 'spring', damping: 24, stiffness: 110 },
  },
};

/* ── BARIS 4 — "Slide-in from Right" ── */
const slideFromRight = {
  hidden:  { opacity: 0, x: '100%' },
  visible: {
    opacity: 1, x: 0,
    transition: { type: 'spring', damping: 24, stiffness: 110 },
  },
};

/* ── Stat chip — Random Entrance Stagger (4 arah berbeda) ── */
const chipEntrances = [
  { hidden: { opacity: 0, y: -60 },  visible: { opacity: 1, y: 0,   transition: { ...SPRING } } }, // atas
  { hidden: { opacity: 0, x: 60  },  visible: { opacity: 1, x: 0,   transition: { ...SPRING } } }, // kanan
  { hidden: { opacity: 0, y: 60  },  visible: { opacity: 1, y: 0,   transition: { ...SPRING } } }, // bawah
  { hidden: { opacity: 0, x: -60 },  visible: { opacity: 1, x: 0,   transition: { ...SPRING } } }, // kiri
];

/* Chip stagger container */
const chipStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0 } },
};

/* ── CTA / scroll indicator slide-up ── */
const slideUpChild = {
  hidden:  { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { ...SPRING } },
};

/* ── Wave child (ProvinceCard header wave) ── */
const childVariants = {
  hidden:  { opacity: 0, x: -10 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: EASE_QUARTIC },
  }),
};

/* ── Card hover ── */
const cardHover = (color) => ({
  scale: 1.02,
  boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 32px ${color}40`,
  borderColor: `${color}44`,
  transition: { duration: 0.2, ease: EASE_QUARTIC },
});

/* ─────────────────────────────────────────────────────────────
   TYPEWRITER TEXT — renders a string char-by-char with stagger
   ───────────────────────────────────────────────────────────── */
const TypewriterText = ({ text, style = {} }) => (
  <motion.span
    variants={typewriterContainer}
    style={{ display: 'inline-block', ...style }}
    aria-label={text}
  >
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        variants={typewriterChar}
        style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : undefined }}
      >
        {char}
      </motion.span>
    ))}
  </motion.span>
);

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER — 0 → target, triggers on intersection
   ───────────────────────────────────────────────────────────── */
const AnimCounter = ({ target, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1600;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / dur, 1);
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setCount(target * ease);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toFixed(decimals).replace('.', ',')}{suffix}</span>;
};

/* ─────────────────────────────────────────────────────────────
   CUSTOM TOOLTIP
   ───────────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(13,27,46,0.92)',
      border: '0.5px solid rgba(34,211,238,0.25)',
      borderRadius: 16, padding: '14px 18px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(34,211,238,0.1)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      minWidth: 210,
    }}>
      <p style={{ color: '#22D3EE', fontWeight: 800, marginBottom: 10, fontFamily: 'Outfit,sans-serif', fontSize: 13, letterSpacing: .5 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0, boxShadow: `0 0 6px ${entry.color}` }} />
          <span style={{ color: '#94A3B8', fontSize: 12, flex: 1 }}>{entry.name}</span>
          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 13, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
            {Number(entry.value).toFixed(2).replace('.', ',')}%
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PROVINCE CARD (Bento child)
   ───────────────────────────────────────────────────────────── */
const ProvinceCard = ({ p, index }) => {
  const latest = data[data.length - 1][p.name];
  const peak   = Math.max(...data.map(d => d[p.name]));

  return (
    <motion.div
      className="card"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden:  { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { ...SPRING, delay: index * 0.07 } },
      }}
      whileHover={cardHover(p.color)}
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'default' }}
    >
      <motion.div
        variants={childVariants} custom={0}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: p.color, flexShrink: 0, boxShadow: `0 0 10px ${p.color}` }} />
          <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1rem', color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>{p.name}</h3>
        </div>
        <div style={{ background: `${p.color}1A`, color: p.color, borderRadius: 99, padding: '2px 12px', fontSize: 12, fontWeight: 700, border: `0.5px solid ${p.color}44` }}>
          {String(latest).replace('.', ',')}%
        </div>
      </motion.div>

      <motion.div variants={childVariants} custom={1} style={{ display: 'flex', gap: '.65rem' }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '.55rem .7rem', textAlign: 'center', border: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}>puncak</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#F87171', fontFamily: 'Outfit,sans-serif' }}>{String(peak).replace('.', ',')}%</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '.55rem .7rem', textAlign: 'center', border: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}>th 2025</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: p.color, fontFamily: 'Outfit,sans-serif' }}>{String(latest).replace('.', ',')}%</div>
        </div>
      </motion.div>

      <motion.div variants={childVariants} custom={2} style={{ width: '100%', height: 130 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`sparkGrad-${p.name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={p.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={p.color} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" vertical={true} horizontal={true} />
            <XAxis dataKey="label" fontSize={8} interval={3} tick={{ fill: '#475569' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 13]} hide />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={p.name} stroke={p.color} fill={`url(#sparkGrad-${p.name.replace(/\s/g, '')})`} strokeWidth={2.5}
              dot={{ r: 2.5, fill: p.color, strokeWidth: 1.5, stroke: '#0F172A' }}
              activeDot={{ r: 5, fill: p.color, stroke: '#0F172A', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
   ───────────────────────────────────────────────────────────── */
const sectionHeaderStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const SectionHeader = ({ icon, title, right }) => (
  <motion.div
    className="section-header"
    style={{ justifyContent: right ? 'space-between' : undefined, marginBottom: '3rem' }}
    initial="hidden"
    animate="visible"
    variants={sectionHeaderStagger}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
      <motion.span variants={slideUpChild}>{icon}</motion.span>
      <motion.h2
        style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}
        variants={slideUpChild}
      >
        {title}
      </motion.h2>
    </div>
    {right && <motion.div variants={slideUpChild}>{right}</motion.div>}
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   STAT CHIP DATA — angka untuk AnimCounter
   ───────────────────────────────────────────────────────────── */
const statChips = [
  {
    label: 'periode analisis',
    staticValue: '2018 – 2025',
    counter: null,
  },
  {
    label: 'provinsi diamati',
    staticValue: null,
    counter: { target: 6, suffix: ' Provinsi', decimals: 0 },
  },
  {
    label: 'total titik data',
    staticValue: null,
    counter: { target: 16, suffix: '× 7 seri', decimals: 0 },
  },
  {
    label: 'puncak rata-rata',
    staticValue: null,
    counter: { target: peakAvg, suffix: '%', decimals: 2 },
  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────────────────────────── */
const App = () => {
  const [activeNav, setActiveNav] = useState('beranda');
  const chartScrollRef = useRef(null);

  /* ── Parallax background ── */
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 120]);

  const navItems = [
    { id: 'beranda',     label: 'Beranda'     },
    { id: 'tim',         label: 'Tim'         },
    { id: 'visualisasi', label: 'Visualisasi' },
    { id: 'tren',        label: 'Tren Daerah' },
    { id: 'metodologi',  label: 'Metodologi'  },
  ];

  const navigateTo = (id) => {
    setActiveNav(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bentoClass = (i) => {
    const patterns = ['bento-1', 'bento-2', 'bento-3', 'bento-wide', 'bento-3', 'bento-tall', 'bento-1'];
    return patterns[i % patterns.length];
  };

  const lastIndex = teamMembers.length - 1;

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', fontFamily: 'Outfit, sans-serif', color: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>

      {/* ── FLOATING PILL NAV ── */}
      <nav className="pill-nav" aria-label="Navigasi utama">
        <span className="pill-nav__logo">K<span style={{ color: '#A78BFA' }}>8</span></span>
        {navItems.map(n => (
          <motion.button
            key={n.id}
            id={`nav-${n.id}`}
            className="pill-nav__btn"
            onClick={() => navigateTo(n.id)}
            style={{ position: 'relative' }}
            whileHover={{ scale: 1.05, transition: SPRING_FAST }}
            whileTap={{ scale: 0.95, transition: SPRING_FAST }}
          >
            {activeNav === n.id && (
              <motion.span
                layoutId="nav-active-pill"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
                  borderRadius: 99, zIndex: -1,
                  boxShadow: '0 0 18px rgba(34,211,238,0.45)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{
              position: 'relative', zIndex: 1,
              color: activeNav === n.id ? '#0F172A' : '#64748B',
              fontWeight: activeNav === n.id ? 800 : 600,
              transition: 'color 0.2s', fontSize: '.82rem', fontFamily: 'Outfit, sans-serif',
            }}>
              {n.label}
            </span>
          </motion.button>
        ))}
      </nav>

      {/* ── MAIN CONTENT — AnimatePresence mode='wait' ── */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">

          {/* ══════════════ BERANDA ══════════════ */}
          {activeNav === 'beranda' && (
            <motion.header
              key="beranda"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                position: 'relative', overflow: 'hidden',
                flex: 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', textAlign: 'center', padding: '8rem 2rem 6rem',
              }}
            >
              {/* ── Parallax background (20% slower) ── */}
              <motion.div
                style={{
                  position: 'absolute', inset: '-20%', zIndex: 0, y: bgY,
                  background: `
                    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(34,211,238,0.14) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(167,139,250,0.14) 0%, transparent 60%),
                    radial-gradient(ellipse 50% 40% at 50% 10%, rgba(249,115,22,0.09) 0%, transparent 60%),
                    linear-gradient(180deg, #0F172A 0%, #061020 100%)
                  `,
                  animation: 'meshMove 12s ease-in-out infinite',
                  backgroundSize: '200% 200%', willChange: 'transform',
                }}
              />
              {/* Dot grid */}
              <div style={{
                position: 'absolute', inset: 0, zIndex: 1,
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '32px 32px', pointerEvents: 'none',
              }} />

              {/* ══ STAGGER CONTAINER — dipicu setelah page entry ══ */}
              <motion.div
                style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto' }}
                variants={heroStagger}
                initial="hidden"
                animate="visible"
              >

                {/* ── BARIS 1: "Proposal Proyek Analisis Data"
                         Gaya: Back-to-Front Reveal
                         scale 0.5, blur(10px) → scale 1, blur(0) ── */}
                <motion.div
                  variants={backToFrontVariant}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                    background: 'rgba(34,211,238,0.08)', border: '0.5px solid rgba(34,211,238,0.3)',
                    borderRadius: 99, padding: '.3rem 1.1rem',
                    fontSize: '.72rem', fontWeight: 700, letterSpacing: 2.5,
                    textTransform: 'uppercase', color: '#22D3EE', marginBottom: '1.75rem',
                  }}
                >
                  <BookOpen size={13} />
                  Proposal Proyek Analisis Data
                </motion.div>

                {/* ── BARIS 2 + 3 + 4 wrapper ── */}
                <div style={{ marginBottom: '2.75rem' }}>

                  {/* ── BARIS 2: "Dinamika Pengangguran Pulau Jawa"
                           Gaya: Typewriter Effect (karakter satu per satu) ── */}
                  <motion.div
                    variants={{
                      hidden:  {},
                      visible: { transition: { staggerChildren: 0.04 } },
                    }}
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: 'clamp(2.1rem, 6vw, 3.8rem)',
                      fontWeight: 900, lineHeight: 1.1,
                      letterSpacing: '-0.5px',
                      color: '#FFFFFF', textShadow: '0 0 12px rgba(255,255,255,0.25)',
                      display: 'block', marginBottom: '.2rem',
                    }}
                    aria-label="Dinamika Pengangguran Pulau Jawa"
                  >
                    {'Dinamika Pengangguran Pulau Jawa'.split('').map((char, i) => (
                      <motion.span
                        key={i}
                        variants={typewriterChar}
                        style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : undefined }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* ── BARIS 3 + 4 container (overflow hidden untuk clip slide) ── */}
                  <div style={{
                    overflow: 'hidden',
                    fontSize: 'clamp(1rem, 3.5vw, 1.75rem)',
                    fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                    lineHeight: 1.25, marginTop: '.75rem',
                  }}>
                    {/* ── BARIS 3: "Era Sebelum, Saat,"
                             Gaya: Slide-in from Left  x: -100% → 0 ── */}
                    <motion.div
                      variants={slideFromLeft}
                      style={{
                        background: 'linear-gradient(90deg, #22D3EE, #A78BFA)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        animation: 'shimmer 4s linear infinite',
                        display: 'block',
                      }}
                    >
                      Era Sebelum, Saat,
                    </motion.div>

                    {/* ── BARIS 4: "dan Pasca Pandemi (2018–2025)"
                             Gaya: Slide-in from Right  x: 100% → 0
                             Bertemu dengan Baris 3 di tengah layar ── */}
                    <motion.div
                      variants={slideFromRight}
                      style={{
                        background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        animation: 'shimmer 4s linear infinite reverse',
                        display: 'block',
                      }}
                    >
                      dan Pasca Pandemi (2018–2025)
                    </motion.div>
                  </div>
                </div>

                {/* ── STAT CHIPS — Random Entrance Stagger (4 arah berbeda)
                       Setiap kotak masuk dari arah yang berbeda, dengan AnimCounter ── */}
                <motion.div
                  variants={chipStagger}
                  style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                >
                  {statChips.map((chip, i) => (
                    <motion.div
                      key={i}
                      className="stat-chip"
                      variants={chipEntrances[i]}  /* setiap chip punya arah masuk unik */
                      whileHover={{ scale: 1.05, transition: SPRING_FAST }}
                      whileTap={{ scale: 0.95, transition: SPRING_FAST }}
                    >
                      <div className="stat-chip__value">
                        {chip.counter
                          ? <AnimCounter target={chip.counter.target} suffix={chip.counter.suffix} decimals={chip.counter.decimals} />
                          : chip.staticValue
                        }
                      </div>
                      <div className="stat-chip__label">{chip.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* ── CTA Button ── */}
                <motion.div variants={slideUpChild} style={{ marginTop: '3rem' }}>
                  <motion.button
                    id="cta-jelajahi"
                    onClick={() => navigateTo('tim')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '.6rem',
                      background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
                      border: 'none', borderRadius: 99, cursor: 'pointer',
                      padding: '.75rem 2rem', color: '#0F172A',
                      fontFamily: 'Outfit, sans-serif', fontWeight: 800,
                      fontSize: '.95rem', letterSpacing: .5,
                      boxShadow: '0 0 28px rgba(34,211,238,0.4), 0 8px 24px rgba(0,0,0,0.3)',
                    }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(34,211,238,0.6), 0 12px 32px rgba(0,0,0,0.4)', transition: SPRING_FAST }}
                    whileTap={{ scale: 0.95, transition: SPRING_FAST }}
                  >
                    Jelajahi Dashboard
                    <ChevronDown size={18} />
                  </motion.button>
                </motion.div>

                {/* Scroll bounce indicator */}
                <motion.div
                  variants={slideUpChild}
                  style={{
                    marginTop: '4rem',
                    display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    cursor: 'pointer', color: '#334155', animation: 'scrollBounce 1.8s ease-in-out infinite',
                  }}
                  onClick={() => navigateTo('tim')}
                  whileHover={{ color: '#64748B', transition: { duration: 0.2 } }}
                >
                  <span style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' }}>lanjutkan</span>
                  <ChevronDown size={18} />
                </motion.div>
              </motion.div>
            </motion.header>
          )}

          {/* ══════════════ TIM ══════════════ */}
          {activeNav === 'tim' && (
            <motion.main
              key="tim"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ padding: '8rem 2rem 5rem', maxWidth: 1000, margin: '0 auto', width: '100%' }}
            >
              <SectionHeader icon={<Users style={{ color: '#22D3EE', width: 32, height: 32 }} />} title="Susunan Tim Pelaksana" />

              <div className="card" style={{ overflow: 'hidden' }}>
                {/* Table header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 1fr',
                  background: 'linear-gradient(90deg, rgba(34,211,238,0.12), rgba(167,139,250,0.08))',
                  borderBottom: '0.5px solid rgba(255,255,255,0.08)',
                  color: '#64748B', padding: '1rem 1.5rem',
                  fontWeight: 700, fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: 1.8,
                }}>
                  <span style={{ textAlign: 'center' }}>No.</span>
                  <span>Nama Lengkap Anggota</span>
                  <span>Nomor Induk Mahasiswa (NIM)</span>
                </div>

                {teamMembers.map((member, index) => {
                  const isLast   = index === lastIndex;
                  const isOdd    = index % 2 !== 0;  // 1-based: 1,3,5 = index 0,2,4 = isOdd false

                  /* ── Determine animation direction ──
                     isLast          → Final Reveal: y:50% → 0
                     odd  row (1,3,5…)  → Left-to-Right: x:-50% → 0
                     even row (2,4,6…)  → Right-to-Left: x:50% → 0 */
                  let rowInitial, rowAnimate;
                  if (isLast) {
                    // Final Reveal — Bottom to Top
                    rowInitial = { opacity: 0, y: '50%', filter: 'blur(4px)' };
                    rowAnimate = { opacity: 1, y: 0,     filter: 'blur(0px)' };
                  } else if (!isOdd) {
                    // index 0,2,4,6 = baris ke-1,3,5,7 → Left to Right
                    rowInitial = { opacity: 0, x: '-50%', filter: 'blur(4px)' };
                    rowAnimate = { opacity: 1, x: 0,      filter: 'blur(0px)' };
                  } else {
                    // index 1,3,5,7 = baris ke-2,4,6,8 → Right to Left
                    rowInitial = { opacity: 0, x: '50%',  filter: 'blur(4px)' };
                    rowAnimate = { opacity: 1, x: 0,      filter: 'blur(0px)' };
                  }

                  return (
                    <motion.div
                      key={index}
                      initial={rowInitial}
                      animate={rowAnimate}
                      transition={{ ...SPRING, delay: index * 0.06 + 0.15 }}
                      style={{
                        display: 'grid', gridTemplateColumns: '60px 1fr 1fr',
                        padding: '1rem 1.5rem', alignItems: 'center',
                        borderBottom: index < lastIndex ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
                        background: index % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                        /* overflow:hidden agar x:-50% tidak menyebabkan horizontal scroll */
                        overflow: 'hidden',
                      }}
                      whileHover={{ background: 'rgba(34,211,238,0.04)', x: 4, transition: { duration: 0.2 } }}
                    >
                      <span style={{ textAlign: 'center', fontWeight: 700, color: '#334155', fontFamily: 'monospace', fontSize: '1rem' }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                          background: `linear-gradient(135deg, hsl(${index * 40 + 180}, 80%, 50%), hsl(${index * 40 + 220}, 80%, 60%))`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#0F172A', fontWeight: 800, fontSize: '.85rem',
                          boxShadow: `0 0 12px hsl(${index * 40 + 180}deg 80% 50% / 35%)`,
                        }}>
                          {member.nama.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '.9rem', textShadow: '0 0 10px rgba(255,255,255,0.15)' }}>
                          {member.nama}
                        </span>
                      </div>
                      <div>
                        <span style={{
                          fontFamily: 'monospace', fontWeight: 700, fontSize: '.88rem',
                          color: '#22D3EE', letterSpacing: .8,
                          background: 'rgba(34,211,238,0.08)', padding: '.2rem .75rem', borderRadius: 8,
                          border: '0.5px solid rgba(34,211,238,0.2)',
                        }}>
                          {member.nim}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.main>
          )}

          {/* ══════════════ VISUALISASI ══════════════ */}
          {activeNav === 'visualisasi' && (
            <motion.main
              key="visualisasi"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ padding: '8rem 2rem 5rem', maxWidth: 1280, margin: '0 auto', width: '100%' }}
            >
              <SectionHeader
                icon={<BarChart3 style={{ color: '#22D3EE', width: 32, height: 32 }} />}
                title="Visualisasi Data TPT Terintegrasi"
                right={
                  <span style={{
                    background: 'linear-gradient(135deg,#22D3EE,#A78BFA)',
                    color: '#0F172A', borderRadius: 99,
                    padding: '.25rem 1rem', fontSize: '.72rem', fontWeight: 800, letterSpacing: 1.5,
                  }}>BPS 2018–2025</span>
                }
              />

              <motion.div
                className="card"
                style={{ padding: '2rem 2.5rem', overflow: 'hidden' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.2 }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '.35rem', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                    Tren Tingkat Pengangguran Terbuka (TPT) Berdasarkan Fase
                  </h3>
                  <p style={{ fontSize: '.83rem', color: '#475569', fontStyle: 'italic' }}>
                    Data ditampilkan dalam persentase (%) berdasarkan laporan berkala BPS (Februari &amp; Agustus).
                    Grid bantu mengikuti standar diagram akademis statistika.
                  </p>
                </div>

                <div id="chart-scroll-container" ref={chartScrollRef} style={{ overflowX: 'auto', paddingBottom: '1rem', scrollBehavior: 'auto' }}>
                  <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
                    <defs>
                      {provinceColors.slice(0, 6).map(p => (
                        <linearGradient key={p.name} id={`barGrad-${p.name.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor={p.color} stopOpacity={1}   />
                          <stop offset="100%" stopColor={p.color} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                  </svg>

                  <div style={{ minWidth: 2200, height: 650, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data} margin={{ top: 50, right: 30, bottom: 80, left: 10 }} barCategoryGap="30%" barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" vertical={true} horizontal={true} />
                        <XAxis dataKey="label" tick={{ fill: '#FFFFFF', fontWeight: 700, fontSize: 12, fontFamily: 'Outfit,sans-serif' }} axisLine={{ stroke: 'rgba(255,255,255,0.3)' }} tickLine={{ stroke: 'rgba(255,255,255,0.3)' }} dy={10} />
                        <YAxis domain={[0, 13]} tick={{ fill: '#FFFFFF', fontWeight: 600, fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.3)' }} tickLine={{ stroke: 'rgba(255,255,255,0.3)' }} tickFormatter={v => `${v}%`} width={42} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 120, fontWeight: 700, fontSize: 12, color: '#FFFFFF', fontFamily: 'Outfit,sans-serif' }} />
                        {provinceColors.slice(0, 6).map((p) => (
                          <Bar key={p.name} dataKey={p.name} fill={`url(#barGrad-${p.name.replace(/\s/g,'')})`} barSize={14} radius={[4, 4, 0, 0]}>
                            <LabelList dataKey={p.name} position="top" style={{ fontSize: 9, fill: p.color, fontWeight: 700 }} formatter={(val) => val.toFixed(2).replace('.', ',')} />
                          </Bar>
                        ))}
                        <Line type="monotone" dataKey="Rata-rata" stroke="#FFFFFF" strokeWidth={3.5} strokeDasharray="0"
                          dot={{ r: 6, fill: '#0F172A', strokeWidth: 2.5, stroke: '#FFFFFF' }}
                          activeDot={{ r: 8, fill: '#FFFFFF', stroke: '#0F172A', strokeWidth: 2 }}>
                          <LabelList dataKey="Rata-rata" position="top" offset={14} style={{ fontSize: 14, fill: '#FFFFFF', fontWeight: 800 }} formatter={(val) => val.toFixed(2).replace('.', ',')} />
                        </Line>
                      </ComposedChart>
                    </ResponsiveContainer>

                    <div style={{
                      position: 'absolute', left: 42, bottom: 152,
                      width: 'calc(100% - 72px)', height: 36,
                      display: 'flex', fontWeight: 800, fontSize: 10.5, color: '#FFFFFF',
                      borderRadius: 99, overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                    }}>
                      <div style={{ flex: `0 0 ${(5/16)*100}%`, background: 'linear-gradient(90deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, letterSpacing: 1 }}>
                        ◀ FASE 1: SEBELUM PANDEMI ▶
                      </div>
                      <div style={{ flex: `0 0 ${(4/16)*100}%`, background: 'linear-gradient(90deg, #DC2626, #EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, letterSpacing: 1, borderLeft: '1.5px solid rgba(255,255,255,0.2)', borderRight: '1.5px solid rgba(255,255,255,0.2)' }}>
                        FASE 2: SAAT PANDEMI (COVID-19)
                      </div>
                      <div style={{ flex: `0 0 ${(7/16)*100}%`, background: 'linear-gradient(90deg, #059669, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, letterSpacing: 1 }}>
                        FASE 3: SETELAH PANDEMI (PEMULIHAN) ▶
                      </div>
                    </div>
                  </div>
                </div>
                <p style={{ textAlign: 'center', color: '#334155', fontSize: '.78rem', marginTop: '.5rem', animation: 'float 2s ease-in-out infinite' }}>
                  ← Geser grafik ke samping untuk melihat timeline lengkap →
                </p>
              </motion.div>
            </motion.main>
          )}

          {/* ══════════════ TREN DAERAH ══════════════ */}
          {activeNav === 'tren' && (
            <motion.main
              key="tren"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ padding: '8rem 2rem 5rem', maxWidth: 1280, margin: '0 auto', width: '100%' }}
            >
              <SectionHeader icon={<TrendingUp style={{ color: '#22D3EE', width: 32, height: 32 }} />} title="Tren Pertumbuhan Per Daerah" />
              <div className="bento-grid">
                {provinceColors.slice(0, 6).map((p, i) => (
                  <div key={p.name} className={bentoClass(i)}>
                    <ProvinceCard p={p} index={i} />
                  </div>
                ))}
                <div className="bento-wide">
                  <ProvinceCard p={provinceColors[6]} index={6} />
                </div>
              </div>
            </motion.main>
          )}

          {/* ══════════════ METODOLOGI ══════════════ */}
          {activeNav === 'metodologi' && (
            <motion.main
              key="metodologi"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ padding: '8rem 2rem 5rem', maxWidth: 1000, margin: '0 auto', width: '100%' }}
            >
              <SectionHeader icon={<Info style={{ color: '#22D3EE', width: 32, height: 32 }} />} title="Informasi & Metodologi" />

              <motion.div
                style={{
                  background: 'rgba(13,27,46,0.7)',
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                  borderRadius: 24, padding: '3rem',
                  border: '0.5px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
                  position: 'relative', overflow: 'hidden',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.25 }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 320, height: 320, borderRadius: '50%', background: 'rgba(34,211,238,0.05)', filter: 'blur(60px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 260, height: 260, borderRadius: '50%', background: 'rgba(167,139,250,0.05)', filter: 'blur(60px)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
                  <div style={{ flex: '1 1 280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
                      <Info style={{ color: '#22D3EE', width: 22, height: 22 }} />
                      <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: 1.5, color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                        Metodologi &amp; Sumber
                      </h3>
                    </div>
                    <p style={{ color: '#94A3B8', lineHeight: 1.8, fontSize: '.9rem' }}>
                      Data dikompilasi dari laporan <strong style={{ color: '#FFFFFF' }}>Berita Resmi Statistik (BRS)</strong> Badan Pusat Statistik. Periode pengamatan mencakup transisi kebijakan PSBB ke PPKM hingga masa normalisasi ekonomi 2025.
                    </p>
                  </div>

                  <div style={{ flex: '1 1 280px', borderLeft: '0.5px solid rgba(255,255,255,0.07)', paddingLeft: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
                      <Award style={{ color: '#A78BFA', width: 22, height: 22 }} />
                      <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: 1.5, color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                        Komitmen Data
                      </h3>
                    </div>
                    <p style={{ color: '#94A3B8', fontSize: '.9rem', lineHeight: 1.8, fontStyle: 'italic' }}>
                      "Seluruh angka yang disajikan telah diverifikasi silang dengan tabel statis BPS guna menjamin objektivitas hasil analisis dalam proposal ini."
                    </p>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '.62rem', color: '#334155', textTransform: 'uppercase', letterSpacing: 2 }}>tahun terbit</p>
                        <p style={{ fontWeight: 900, fontFamily: 'Outfit,sans-serif', fontSize: '1.2rem', color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>2026</p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05, transition: SPRING_FAST }}
                        whileTap={{ scale: 0.95, transition: SPRING_FAST }}
                        style={{
                          background: 'linear-gradient(135deg, #22D3EE, #A78BFA)',
                          padding: '.45rem 1.25rem', borderRadius: 99,
                          fontWeight: 800, fontSize: '.72rem', letterSpacing: 1.8, color: '#0F172A',
                          animation: 'pulseGlow 2.5s ease-in-out infinite', cursor: 'default',
                        }}
                      >
                        OFFICIAL PROPOSAL
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.main>
          )}

        </AnimatePresence>
      </div>

      {/* ── GESTURE SCROLL — GestureScroll beroperasi di DOM level via scrollTop
          langsung, tidak terpengaruh oleh AnimatePresence atau Framer Motion. ── */}
      <GestureScroll chartScrollRef={chartScrollRef} />

      {/* ── FOOTER ── */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '0.5px solid rgba(255,255,255,0.06)',
        padding: '2.5rem', textAlign: 'center',
        background: 'rgba(9,18,38,0.8)', backdropFilter: 'blur(16px)',
      }}>
        <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '.95rem', color: '#FFFFFF', marginBottom: '.35rem', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
          Kelompok 8 &mdash; Analisis TPT Jawa
        </p>
        <p style={{ color: '#334155', fontSize: '.78rem' }}>
          &copy; 2026 Kelompok 8 &mdash; Dibuat untuk pemenuhan tugas akademik.
        </p>
      </footer>
    </div>
  );
};

export default App;
