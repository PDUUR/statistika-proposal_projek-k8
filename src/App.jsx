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
import { Users, BarChart3, Info, TrendingUp, BookOpen, Award, ChevronDown, Calendar, MapPin, Database } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import { FaHouse, FaUsers, FaChartBar, FaArrowTrendUp, FaBookOpen } from 'react-icons/fa6';
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

/* ── Slower animations per user request (0.8s - 1.2s) ── */
const SLOW_TWEEN = { duration: 1.2, ease: [0.22, 1, 0.36, 1] };
const TYPEWRITER_TWEEN = { duration: 0.8, ease: [0.22, 1, 0.36, 1] };
const SPRING = { type: 'spring', damping: 20, stiffness: 100 }; // kept for general slow things
const SPRING_FAST = { type: 'spring', damping: 25, stiffness: 260 };
const EASE_QUARTIC = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: { opacity: 0, y: 30,  filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0,   filter: 'blur(0px)', transition: SLOW_TWEEN },
  exit:    { opacity: 0, y: -30, filter: 'blur(10px)', transition: { duration: 0.8, ease: EASE_QUARTIC } },
};

/* ── Hero outer stagger ── */
const heroStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

/* ── BARIS 1 — "Back-to-Front Reveal" ── */
const backToFrontVariant = {
  hidden:  { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
  visible: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: SLOW_TWEEN,
  },
};

/* ── BARIS 2 — "Typewriter" Container ── */
const typewriterContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } }, // Diperlambat
};
const typewriterChar = {
  hidden:  { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: TYPEWRITER_TWEEN,
  },
};

/* ── BARIS 3 — "Slide-in from Left" ── */
const slideFromLeft = {
  hidden:  { opacity: 0, x: '-100%' },
  visible: {
    opacity: 1, x: 0,
    transition: SLOW_TWEEN,
  },
};

/* ── BARIS 4 — "Slide-in from Right" ── */
const slideFromRight = {
  hidden:  { opacity: 0, x: '100%' },
  visible: {
    opacity: 1, x: 0,
    transition: SLOW_TWEEN,
  },
};

/* ── Stat chip — Random Entrance Stagger ── */
const chipEntrances = [
  { hidden: { opacity: 0, y: -60 },  visible: { opacity: 1, y: 0,   transition: SLOW_TWEEN } }, // atas
  { hidden: { opacity: 0, x: 60  },  visible: { opacity: 1, x: 0,   transition: SLOW_TWEEN } }, // kanan
  { hidden: { opacity: 0, y: 60  },  visible: { opacity: 1, y: 0,   transition: SLOW_TWEEN } }, // bawah
  { hidden: { opacity: 0, x: -60 },  visible: { opacity: 1, x: 0,   transition: SLOW_TWEEN } }, // kiri
];

/* Chip stagger container */
const chipStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0 } },
};

/* ── CTA / scroll indicator slide-up ── */
const slideUpChild = {
  hidden:  { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: SLOW_TWEEN },
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
  boxShadow: `0 16px 48px rgba(255,255,255,0.2), 0 0 32px ${color}40`,
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
        const dur = 3000;
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
      boxShadow: '0 12px 40px rgba(255,255,255,0.2), 0 0 20px rgba(34,211,238,0.1)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      minWidth: 210,
    }}>
      <p style={{ color: '#22D3EE', fontWeight: 800, marginBottom: 10, fontFamily: 'Outfit,sans-serif', fontSize: 13, letterSpacing: .5 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0, boxShadow: `0 0 6px ${entry.color}` }} />
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, flex: 1 }}>{entry.name}</span>
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
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '.55rem .7rem', textAlign: 'center', border: '0.5px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}>puncak</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#F87171', fontFamily: 'Outfit,sans-serif' }}>{String(peak).replace('.', ',')}%</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '.55rem .7rem', textAlign: 'center', border: '0.5px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}>th 2025</div>
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" vertical={true} horizontal={true} />
            <XAxis dataKey="label" fontSize={8} interval={3} tick={{ fill: 'rgba(255,255,255,0.85)' }} axisLine={false} tickLine={false} />
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
   INFINITE MARQUEE STATS DATA & COMPONENTS
   ───────────────────────────────────────────────────────────── */
const marqueeData = [
  { icon: Calendar, top: '2018–2025', bottom: 'periode analisis' },
  { icon: MapPin, top: '6 Provinsi', bottom: 'provinsi diamati' },
  { icon: Database, top: '112 Data', bottom: 'total titik data' },
  { icon: TrendingUp, top: '8,16%', bottom: 'puncak rata-rata' },
];

const MarqueeGroup = () => (
  <div style={{ display: 'flex' }}>
    {marqueeData.map((item, i) => {
      const Icon = item.icon;
      return (
        <div key={i} style={{ paddingRight: '1.25rem' }}>
          <div 
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: '#0F172A',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '1.5rem',
              minWidth: '220px',
            }}
          >
            <Icon color="#FFFFFF" size={26} style={{ marginBottom: '12px' }} />
            <span style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '4px', textAlign: 'center' }}>{item.top}</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300, fontSize: '0.85rem', textAlign: 'center' }}>{item.bottom}</span>
          </div>
        </div>
      );
    })}
  </div>
);

const MarqueeStats = () => {
  return (
    <div 
      style={{
        width: '100%',
        maxWidth: 1000,
        margin: '0 auto',
        overflow: 'hidden',
        position: 'relative',
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}
    >
      <div 
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'marquee 20s linear infinite'
        }}
      >
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────────────────────────── */
const App = () => {
  const [activeNav, setActiveNav] = useState('beranda');
  const [isNavVisible, setIsNavVisible] = useState(false);
  const chartScrollRef = useRef(null);
  const hideTimeout = useRef(null);

  /* ── Parallax background ── */
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 120]);

  const navItems = [
    { id: 'beranda',     icon: <FaHouse />        },
    { id: 'tim',         icon: <FaUsers />        },
    { id: 'visualisasi', icon: <FaChartBar />     },
    { id: 'tren',        icon: <FaArrowTrendUp /> },
    { id: 'metodologi',  icon: <FaBookOpen />     },
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

      {/* ── HOVER ZONE TRIGGER (Tepi kanan layar) ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '40px',
          zIndex: 199,
          background: 'transparent'
        }}
        onMouseEnter={() => {
          if (hideTimeout.current) clearTimeout(hideTimeout.current);
          setIsNavVisible(true);
        }}
      />

      {/* ── VERTICAL SIDE NAV (Auto-Hide & Slide) ── */}
      <motion.nav
        aria-label="Navigasi samping"
        initial={{ opacity: 0, x: 50, y: '-50%' }}
        animate={{
          opacity: isNavVisible ? 1 : 0,
          x: isNavVisible ? 0 : 50,
          y: '-50%'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed',
          right: '1.5rem',
          top: '50%',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem .75rem',
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(255,255,255,0.15)',
          borderRadius: 99,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={() => {
          if (hideTimeout.current) clearTimeout(hideTimeout.current);
          setIsNavVisible(true);
        }}
        onMouseLeave={() => {
          hideTimeout.current = setTimeout(() => {
            setIsNavVisible(false);
          }, 200);
        }}
      >
        {navItems.map(n => {
          const isActive = activeNav === n.id;
          return (
            <motion.button
              key={n.id}
              id={`nav-${n.id}`}
              onClick={() => navigateTo(n.id)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                fontSize: '1.5em',
                outline: 'none',
              }}
              whileHover={{ scale: 1.2, color: '#FFFFFF' }}
              whileTap={{ scale: 0.9 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-halo"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '1px solid rgba(34,211,238,0.8)',
                    boxShadow: '0 0 15px rgba(34,211,238,0.4)',
                    background: 'rgba(34,211,238,0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1, display: 'flex' }}>
                {n.icon}
              </span>
            </motion.button>
          );
        })}
      </motion.nav>

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
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
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

                  {/* ── BARIS 2 & 3: "Dinamika Pengangguran" & "Pulau Jawa" ── */}
                  <motion.div
                    variants={typewriterContainer}
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: 'clamp(2.1rem, 6vw, 3.8rem)',
                      fontWeight: 900, lineHeight: 1.1,
                      letterSpacing: '-0.5px',
                      color: '#FFFFFF', textShadow: '0 0 12px rgba(255,255,255,0.2)',
                      marginBottom: '.2rem',
                    }}
                  >
                    <div aria-label="Dinamika Pengangguran">
                      {'Dinamika Pengangguran'.split('').map((char, i) => (
                        <motion.span
                          key={`l1-${i}`}
                          variants={typewriterChar}
                          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : undefined }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                    <div aria-label="Pulau Jawa">
                      {'Pulau Jawa'.split('').map((char, i) => (
                        <motion.span
                          key={`l2-${i}`}
                          variants={typewriterChar}
                          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : undefined }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* ── BARIS 4 container ── */}
                  <div style={{
                    overflow: 'hidden',
                    display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
                    fontSize: 'clamp(1rem, 3.5vw, 1.75rem)',
                    fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                    lineHeight: 1.25, marginTop: '.75rem',
                  }}>
                    <motion.span
                      variants={slideFromLeft}
                      style={{
                        background: 'linear-gradient(90deg, #22D3EE, #A78BFA)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        animation: 'shimmer 4s linear infinite',
                      }}
                    >
                      Era Sebelum, Saat,&nbsp;
                    </motion.span>

                    <motion.span
                      variants={slideFromRight}
                      style={{
                        background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        animation: 'shimmer 4s linear infinite reverse',
                      }}
                    >
                      dan Pasca Pandemi
                    </motion.span>
                  </div>
                </div>

                {/* ── STAT CHIPS — INFINITE MARQUEE ── */}
                <motion.div variants={slideUpChild} style={{ marginTop: '1.5rem' }}>
                  <MarqueeStats />
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
                      padding: '.75rem 2.5rem', color: '#0F172A',
                      fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                      fontSize: '1.2rem', letterSpacing: 1,
                      boxShadow: '0 0 28px rgba(34,211,238,0.4), 0 8px 24px rgba(0,0,0,0.3)',
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    whileHover={{ scale: 1.15, boxShadow: '0 0 40px rgba(34,211,238,0.6), 0 12px 32px rgba(0,0,0,0.4)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Gazz
                  </motion.button>
                </motion.div>

                {/* Scroll bounce indicator */}
                <motion.div
                  variants={slideUpChild}
                  style={{
                    marginTop: '4rem',
                    display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    cursor: 'pointer', color: 'rgba(255,255,255,0.85)', animation: 'scrollBounce 1.8s ease-in-out infinite',
                  }}
                  onClick={() => navigateTo('tim')}
                  whileHover={{ color: 'rgba(255,255,255,0.85)', transition: { duration: 0.2 } }}
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
                  borderBottom: '0.5px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.85)', padding: '1rem 1.5rem',
                  fontWeight: 700, fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: 1.8,
                }}>
                  <span style={{ textAlign: 'center' }}>No.</span>
                  <span>Nama Lengkap Anggota</span>
                  <span>Nomor Induk Mahasiswa (NIM)</span>
                </div>

                {teamMembers.map((member, index) => {
                  const isLast   = index === lastIndex;
                  const displayIndex = index + 1; // 1-based index (1, 2, 3...)
                  const isOdd    = displayIndex % 2 !== 0; // True for 1, 3, 5

                  let rowInitial, rowAnimate;
                  if (isLast) {
                    rowInitial = { opacity: 0, y: '50%', filter: 'blur(4px)' };
                    rowAnimate = { opacity: 1, y: 0,     filter: 'blur(0px)' };
                  } else if (isOdd) {
                    // Baris Ganjil (1, 3, 5): Masuk dari Kiri ke Kanan
                    rowInitial = { opacity: 0, x: '-50%', filter: 'blur(4px)' };
                    rowAnimate = { opacity: 1, x: 0,      filter: 'blur(0px)' };
                  } else {
                    // Baris Genap (2, 4, 6): Masuk dari Kanan ke Kiri
                    rowInitial = { opacity: 0, x: '50%',  filter: 'blur(4px)' };
                    rowAnimate = { opacity: 1, x: 0,      filter: 'blur(0px)' };
                  }

                  return (
                    <motion.div
                      key={index}
                      initial={rowInitial}
                      animate={rowAnimate}
                      transition={{ ...SLOW_TWEEN, delay: index * 0.1 + 0.15 }}
                      style={{
                        display: 'grid', gridTemplateColumns: '60px 1fr 1fr',
                        padding: '1rem 1.5rem', alignItems: 'center',
                        borderBottom: index < lastIndex ? '0.5px solid rgba(255,255,255,0.2)' : 'none',
                        background: index % 2 === 0 ? 'rgba(255,255,255,0.2)' : 'transparent',
                      }}
                      whileHover={{ background: 'rgba(34,211,238,0.04)', x: 4, transition: { duration: 0.2 } }}
                    >
                      <span style={{ textAlign: 'center', fontWeight: 700, color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace', fontSize: '1rem' }}>
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
                        <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '.9rem', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
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
                  <p style={{ fontSize: '.83rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
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
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" vertical={true} horizontal={true} />
                        <XAxis dataKey="label" tick={{ fill: '#FFFFFF', fontWeight: 700, fontSize: 12, fontFamily: 'Outfit,sans-serif' }} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }} dy={10} />
                        <YAxis domain={[0, 13]} tick={{ fill: '#FFFFFF', fontWeight: 700, fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickFormatter={v => `${v}%`} width={42} />
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
                      border: '0.5px solid rgba(255,255,255,0.2)',
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
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: '.78rem', marginTop: '.5rem', animation: 'float 2s ease-in-out infinite' }}>
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
                  border: '0.5px solid rgba(255,255,255,0.2)',
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
                    <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontSize: '.9rem' }}>
                      Data dikompilasi dari laporan <strong style={{ color: '#FFFFFF' }}>Berita Resmi Statistik (BRS)</strong> Badan Pusat Statistik. Periode pengamatan mencakup transisi kebijakan PSBB ke PPKM hingga masa normalisasi ekonomi 2025.
                    </p>
                  </div>

                  <div style={{ flex: '1 1 280px', borderLeft: '0.5px solid rgba(255,255,255,0.2)', paddingLeft: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
                      <Award style={{ color: '#A78BFA', width: 22, height: 22 }} />
                      <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: 1.5, color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                        Komitmen Data
                      </h3>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '.9rem', lineHeight: 1.8, fontStyle: 'italic' }}>
                      "Seluruh angka yang disajikan telah diverifikasi silang dengan tabel statis BPS guna menjamin objektivitas hasil analisis dalam proposal ini."
                    </p>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '.62rem', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 2 }}>tahun terbit</p>
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
        borderTop: '0.5px solid rgba(255,255,255,0.2)',
        padding: '2.5rem', textAlign: 'center',
        background: 'rgba(9,18,38,0.8)', backdropFilter: 'blur(16px)',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '.78rem' }}>
          &copy; 2026 Kel 8 | ST19 | Dibuat untuk pemenuhan tugas akademik
        </p>
      </footer>
    </div>
  );
};

export default App;
