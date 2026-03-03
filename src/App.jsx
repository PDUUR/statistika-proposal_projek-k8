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
  LabelList
} from 'recharts';
import { Users, BarChart3, Info, Calendar, TrendingUp, BookOpen, Award, ChevronDown } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   DATA (tidak diubah)
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
  { nama: "Albi Ahmad Andika", nim: "D1401251053" },
  { nama: "Wisnu Aji Saputra", nim: "E3401251016" },
  { nama: "Muhammad Zacky", nim: "E3401251141" },
  { nama: "M Faturrahman Almukhlisin", nim: "G0401251042" },
  { nama: "Naufal Fauzan", nim: "G4401251094" },
  { nama: "Syaqila Shafa Melani", nim: "G4401251121" },
  { nama: "Silviani", nim: "G8401251047" },
  { nama: "Zafira Zahrani", nim: "G8401251066" },
];

const provinceColors = [
  { name: 'DKI Jakarta', color: '#008080' },
  { name: 'Jawa Barat', color: '#F97316' },
  { name: 'Jawa Timur', color: '#78350F' },
  { name: 'Jawa Tengah', color: '#22C55E' },
  { name: 'DI Yogyakarta', color: '#A855F7' },
  { name: 'Banten', color: '#EF4444' },
  { name: 'Rata-rata', color: '#14532D' },
];

/* quick stat di hero */
const peakAvg = Math.max(...data.map(d => d['Rata-rata']));
const latestAvg = data[data.length - 1]['Rata-rata'];
const latestLabel = data[data.length - 1].label;

/* ─────────────────────────────────────────────────────────────
   CUSTOM TOOLTIP
   ───────────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(15,23,42,0.95)',
      border: '1px solid rgba(249,115,22,0.3)',
      borderRadius: 16,
      padding: '12px 18px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(8px)',
      minWidth: 200,
    }}>
      <p style={{ color: '#F97316', fontWeight: 800, marginBottom: 8, fontFamily: 'Outfit,sans-serif', fontSize: 14 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
          <span style={{ color: '#94A3B8', fontSize: 12, flex: 1 }}>{entry.name}</span>
          <span style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 13 }}>
            {Number(entry.value).toFixed(2).replace('.', ',')}%
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
   ───────────────────────────────────────────────────────────── */
const AnimCounter = ({ target, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1400;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(target * ease);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals).replace('.', ',')}{suffix}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────
   PROVINCE CARD (individual trend)
   ───────────────────────────────────────────────────────────── */
const ProvinceCard = ({ p }) => {
  const latest = data[data.length - 1][p.name];
  const peak = Math.max(...data.map(d => d[p.name]));

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <span style={{
            width: 14, height: 14, borderRadius: '50%',
            background: p.color, flexShrink: 0,
            boxShadow: `0 0 0 4px ${p.color}22`
          }} />
          <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
            {p.name}
          </h3>
        </div>
        <div style={{
          background: `${p.color}18`,
          color: p.color,
          borderRadius: 99,
          padding: '2px 12px',
          fontSize: 12,
          fontWeight: 700,
        }}>
          {String(latest).replace('.', ',')}%
        </div>
      </div>

      {/* mini stat */}
      <div style={{ display: 'flex', gap: '.75rem' }}>
        <div style={{
          flex: 1, background: '#F8FAFC', borderRadius: 12,
          padding: '.6rem .75rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Puncak</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#EF4444', fontFamily: 'Outfit,sans-serif' }}>
            {String(peak).replace('.', ',')}%
          </div>
        </div>
        <div style={{
          flex: 1, background: '#F8FAFC', borderRadius: 12,
          padding: '.6rem .75rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Terkini</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: p.color, fontFamily: 'Outfit,sans-serif' }}>
            {String(latest).replace('.', ',')}%
          </div>
        </div>
      </div>

      {/* spark chart */}
      <div style={{ width: '100%', height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${p.name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={p.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={p.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="label" fontSize={8} interval={3} tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 13]} hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={p.name}
              stroke={p.color}
              fill={`url(#grad-${p.name.replace(/\s/g, '')})`}
              strokeWidth={3}
              dot={{ r: 3, fill: p.color, strokeWidth: 2, stroke: 'white' }}
              activeDot={{ r: 5, fill: p.color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────────────────────────── */
const App = () => {
  const [activeNav, setActiveNav] = useState('beranda');

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'tim', label: 'Tim' },
    { id: 'visualisasi', label: 'Visualisasi' },
    { id: 'tren', label: 'Tren Daerah' },
    { id: 'metodologi', label: 'Metodologi' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    setActiveNav(id);
  };

  /* track active section on scroll */
  useEffect(() => {
    const sectionIds = navItems.map(n => n.id);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); });
    }, { threshold: 0.4 });
    sectionIds.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#0F172A' }}>

      {/* ── STICKY NAV ─── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 2px 20px rgba(15,23,42,0.06)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: '1.1rem', color: '#F97316' }}>
            Kelompok<span style={{ color: '#0F172A' }}> 8</span>
          </span>
          <div style={{ display: 'flex', gap: '.25rem' }}>
            {navItems.map(n => (
              <button
                key={n.id}
                id={`nav-${n.id}`}
                onClick={() => scrollTo(n.id)}
                style={{
                  padding: '.4rem .9rem',
                  borderRadius: 99,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '.85rem',
                  transition: 'all .2s',
                  background: activeNav === n.id ? '#F97316' : 'transparent',
                  color: activeNav === n.id ? '#fff' : '#64748B',
                }}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ─── */}
      <header id="beranda" style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        color: '#fff',
        padding: '7rem 2rem 8rem',
        textAlign: 'center',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', top: '40%', right: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 850, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.5rem',
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.35)',
            borderRadius: 99, padding: '.35rem 1.1rem',
            fontSize: '.75rem', fontWeight: 700, letterSpacing: 2,
            textTransform: 'uppercase', color: '#FDBA74',
            marginBottom: '1.5rem',
            animation: 'fadeUp .5s ease forwards',
          }}>
            <BookOpen size={14} />
            Proposal Proyek Analisis Data
          </div>

          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            animation: 'fadeUp .6s .1s ease both',
            textWrap: 'balance',
            maxWidth: '960px',
            margin: '0 auto 1.5rem',
          }}>
            Dinamika Pengangguran Pulau Jawa:
            <span style={{
              display: 'block',
              marginTop: '0.5rem',
              background: 'linear-gradient(90deg,#F97316,#FBBF24,#F97316)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite'
            }}>
              Era Sebelum, Saat, dan Pasca Pandemi
            </span>
          </h1>

          <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.75, animation: 'fadeUp .6s .2s ease both' }}>
            Kajian mendalam mengenai <strong style={{ color: '#CBD5E1' }}>Tingkat Pengangguran Terbuka (TPT)</strong> di 6 Provinsi Pulau Jawa selama periode 2018–2025 berdasarkan data BPS.
          </p>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp .6s .3s ease both' }}>
            {[
              { label: 'Periode Analisis', value: '2018 – 2025' },
              { label: 'Provinsi Diamati', value: '6 Provinsi' },
              { label: 'Total Titik Data', value: <><AnimCounter target={16} />× 7 seri</> },
              { label: 'Puncak Rata-rata', value: <><AnimCounter target={peakAvg} decimals={2} />%</> },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16, padding: '1rem 1.5rem',
                backdropFilter: 'blur(8px)',
                textAlign: 'center', minWidth: 140,
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'Outfit,sans-serif', color: '#F97316' }}>{s.value}</div>
                <div style={{ fontSize: '.75rem', color: '#64748B', marginTop: .25, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div onClick={() => scrollTo('tim')} style={{
            position: 'absolute', bottom: '-4rem', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            cursor: 'pointer', color: '#475569', animation: 'scrollBounce 1.6s ease-in-out infinite',
          }}>
            <span style={{ fontSize: '.7rem', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</span>
            <ChevronDown size={18} />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ─── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>

        {/* ─── 2. TIM ─── */}
        <section id="tim">
          <div className="section-header">
            <Users />
            <h2>Susunan Tim Pelaksana</h2>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            {/* header row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 1fr',
              background: 'linear-gradient(90deg,#0F172A,#1E293B)',
              color: '#fff', padding: '1rem 1.5rem',
              fontWeight: 700, fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: 1.5,
            }}>
              <span style={{ textAlign: 'center' }}>No.</span>
              <span>Nama Lengkap Anggota</span>
              <span>Nomor Induk Mahasiswa (NIM)</span>
            </div>

            {teamMembers.map((member, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 1fr',
                padding: '1rem 1.5rem',
                alignItems: 'center',
                borderBottom: index < teamMembers.length - 1 ? '1px solid #F1F5F9' : 'none',
                background: index % 2 === 0 ? '#fff' : '#FAFAFA',
                transition: 'background .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#FFF7ED'}
                onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? '#fff' : '#FAFAFA'}
              >
                <span style={{ textAlign: 'center', fontWeight: 700, color: '#CBD5E1', fontFamily: 'monospace', fontSize: '1rem' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: `hsl(${index * 40 + 15}, 75%, 55%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: '.85rem',
                  }}>
                    {member.nama.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 600, color: '#1E293B', fontSize: '.95rem' }}>{member.nama}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <span style={{
                    fontFamily: 'monospace', fontWeight: 700, fontSize: '.9rem',
                    color: '#F97316', letterSpacing: 1,
                    background: '#FFF7ED', padding: '.2rem .75rem', borderRadius: 8,
                    border: '1px solid #FED7AA',
                  }}>
                    {member.nim}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 3. VISUALISASI UTAMA ─── */}
        <section id="visualisasi">
          <div className="section-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <BarChart3 style={{ color: '#F97316', width: 32, height: 32 }} />
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.6rem' }}>Visualisasi Data TPT Terintegrasi</h2>
            </div>
            <span style={{
              background: '#F97316', color: '#fff', borderRadius: 99,
              padding: '.25rem 1rem', fontSize: '.75rem', fontWeight: 700, letterSpacing: 1,
            }}>BPS 2018–2025</span>
          </div>

          <div className="card" style={{ padding: '2.5rem', overflow: 'hidden' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '.25rem' }}>
                Tingkat Pengangguran Terbuka (TPT) Per Semester
              </h3>
              <p style={{ fontSize: '.85rem', color: '#94A3B8', fontStyle: 'italic' }}>
                Data ditampilkan dalam persentase (%) berdasarkan laporan BPS per Februari &amp; Agustus.
              </p>
            </div>

            {/* Scrollable chart container */}
            <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
              <div style={{ minWidth: 2200, height: 650, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data} margin={{ top: 50, right: 30, bottom: 80, left: 10 }} barCategoryGap="30%" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="label" tick={{ fill: '#64748B', fontWeight: 700, fontSize: 13 }} axisLine={{ stroke: '#CBD5E1' }} dy={10} />
                    <YAxis hide domain={[0, 13]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 120, fontWeight: 700 }} />

                    {provinceColors.slice(0, 6).map((p) => (
                      <Bar key={p.name} dataKey={p.name} fill={p.color} barSize={15} radius={[4, 4, 0, 0]}>
                        <LabelList dataKey={p.name} position="top" style={{ fontSize: 9, fill: p.color, fontWeight: 700 }} formatter={(val) => val.toFixed(2).replace('.', ',')} />
                      </Bar>
                    ))}

                    <Line type="monotone" dataKey="Rata-rata" stroke={provinceColors[6].color} strokeWidth={4} dot={{ r: 7, fill: provinceColors[6].color, strokeWidth: 3, stroke: 'white' }}>
                      <LabelList dataKey="Rata-rata" position="top" offset={15} style={{ fontSize: 15, fill: provinceColors[6].color, fontWeight: 700 }} formatter={(val) => val.toFixed(2).replace('.', ',')} />
                    </Line>
                  </ComposedChart>
                </ResponsiveContainer>

                {/* Phase labels */}
                <div style={{
                  position: 'absolute', left: 30, bottom: 150,
                  width: 'calc(100% - 60px)', height: 48,
                  display: 'flex', fontWeight: 900, fontSize: 11, color: '#fff',
                  borderRadius: 14, overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}>
                  <div style={{ flex: `0 0 ${(5 / 16) * 100}%`, background: 'linear-gradient(90deg,#2563EB,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, letterSpacing: 1 }}>
                    ◀ PHASE 1: SEBELUM PANDEMI ▶
                  </div>
                  <div style={{ flex: `0 0 ${(4 / 16) * 100}%`, background: 'linear-gradient(90deg,#DC2626,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, letterSpacing: 1, borderLeft: '2px solid rgba(255,255,255,.2)', borderRight: '2px solid rgba(255,255,255,.2)' }}>
                    PHASE 2: SAAT PANDEMI (COVID-19)
                  </div>
                  <div style={{ flex: `0 0 ${(7 / 16) * 100}%`, background: 'linear-gradient(90deg,#059669,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, letterSpacing: 1 }}>
                    PHASE 3: SETELAH PANDEMI (PEMULIHAN) ▶
                  </div>
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '.8rem', marginTop: '.5rem', animation: 'float 2s ease-in-out infinite' }}>
              ← Geser grafik ke samping untuk melihat timeline lengkap →
            </p>
          </div>
        </section>

        {/* ─── 4. TREN PER DAERAH ─── */}
        <section id="tren">
          <div className="section-header">
            <TrendingUp style={{ color: '#F97316', width: 32, height: 32 }} />
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.6rem' }}>Tren Pertumbuhan Per Daerah</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {provinceColors.map((p) => (
              <ProvinceCard key={p.name} p={p} />
            ))}
          </div>
        </section>

        {/* ─── 5. METODOLOGI ─── */}
        <section id="metodologi" style={{
          background: 'linear-gradient(135deg,#0F172A 0%,#1E293B 100%)',
          borderRadius: 24, padding: '3rem', color: '#fff',
          boxShadow: '0 24px 60px rgba(15,23,42,0.3)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* ambient blobs */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, borderRadius: '50%', background: 'rgba(249,115,22,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 250, height: 250, borderRadius: '50%', background: 'rgba(168,85,247,0.06)', filter: 'blur(60px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
            <div style={{ flex: '1 1 280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
                <Info style={{ color: '#F97316', width: 22, height: 22 }} />
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Metodologi &amp; Sumber
                </h3>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: 1.8, fontSize: '.9rem' }}>
                Data dikompilasi dari laporan <strong style={{ color: '#E2E8F0' }}>Berita Resmi Statistik (BRS)</strong> Badan Pusat Statistik. Periode pengamatan mencakup transisi kebijakan PSBB ke PPKM hingga masa normalisasi ekonomi 2025. Analisis ini ditujukan untuk memberikan gambaran komprehensif bagi pemangku kebijakan ketenagakerjaan.
              </p>
            </div>

            <div style={{ flex: '1 1 280px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
                <Award style={{ color: '#F97316', width: 22, height: 22 }} />
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Komitmen Data
                </h3>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '.9rem', lineHeight: 1.8, fontStyle: 'italic' }}>
                "Seluruh angka yang disajikan telah diverifikasi silang dengan tabel statis BPS guna menjamin objektivitas hasil analisis dalam proposal ini."
              </p>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: 1.5 }}>Tahun Terbit</p>
                  <p style={{ fontWeight: 800, fontFamily: 'Outfit,sans-serif', fontSize: '1.1rem' }}>2026</p>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg,#F97316,#FBBF24)',
                  padding: '.5rem 1.25rem', borderRadius: 99,
                  fontWeight: 800, fontSize: '.75rem', letterSpacing: 1.5,
                  animation: 'pulseGlow 2.5s ease-in-out infinite',
                }}>
                  OFFICIAL PROPOSAL
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── GESTURE SCROLL ─── */}
      <GestureScroll />

      {/* ── FOOTER ─── */}
      <footer style={{
        borderTop: '1px solid #E2E8F0',
        padding: '2.5rem',
        textAlign: 'center',
        background: '#fff',
      }}>
        <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '.35rem' }}>
          Kelompok 8 &mdash; Analisis TPT Jawa
        </p>
        <p style={{ color: '#94A3B8', fontSize: '.8rem' }}>
          &copy; 2026 Kelompok 8 &mdash; Dibuat untuk pemenuhan tugas akademik.
        </p>
      </footer>
    </div>
  );
};

export default App;
