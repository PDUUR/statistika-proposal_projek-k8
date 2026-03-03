/**
 * GestureScroll.jsx — Clean Physics Engine
 * ------------------------------------------
 * Prinsip: SATU velocity ref, SATU rAF loop, SATU sumber kebenaran.
 * MediaPipe hanya mendorong velocity. Loop rAF yang menerapkannya.
 * ------------------------------------------
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ═══════════════════════════════════════════════
   KONSTANTA — sesuaikan di sini jika perlu
═══════════════════════════════════════════════ */
const FRICTION = 0.85;  // Gesekan per frame. < 1 = melambat alami
const POWER_V = 6;     // Dorongan vertikal per frame MediaPipe
const POWER_H = 6;     // Dorongan horizontal per frame MediaPipe
const ZONE_V_UP = 0.20;  // 20% atas layar  → scroll ke atas
const ZONE_V_DN = 0.80;  // 80% bawah layar → scroll ke bawah
const ZONE_H_L = 0.70;  // tangan di x>0.7 (kiri secara fisik, raw kamera belum mirror) → geser kiri
const ZONE_H_R = 0.30;  // tangan di x<0.3 → geser kanan
const MP_FPS = 25;    // Maksimum frame yg diproses MediaPipe per detik

const waitFor = (name, ms = 9000) =>
    new Promise((resolve, reject) => {
        const end = Date.now() + ms;
        const poll = () =>
            window[name] ? resolve() : Date.now() > end ? reject(Error(name + ' timeout')) : setTimeout(poll, 200);
        poll();
    });

/* ═══════════════════════════════════════════════
   KOMPONEN
═══════════════════════════════════════════════ */
const GestureScroll = ({ chartScrollRef }) => {
    const [enabled, setEnabled] = useState(false);
    const [status, setStatus] = useState('idle');   // idle | loading | active | error
    const [dir, setDir] = useState('');        // teks arah untuk badge

    // ── Satu-satunya state pergerakan ──────────────────────
    const velocity = useRef({ x: 0, y: 0 });

    // Info posisi tangan (mutable, bukan state — tidak perlu re-render)
    const hand = useRef({ x: null, y: null });

    // rAF id
    const rafId = useRef(null);

    // Kamera & Hands
    const videoRef = useRef(null);
    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const mpThrottle = useRef(0);

    // Kursor visual
    const [dot, setDot] = useState(null); // { x, y } | null

    /* ─────────────────────────────────────────────────────
       RAF LOOP — Satu-satunya fungsi yang menyentuh scroll
    ───────────────────────────────────────────────────── */
    const tick = useCallback(() => {
        const { x: hx, y: hy } = hand.current;

        // Hanya berikan dorongan jika tangan terdeteksi
        if (hy !== null) {
            if (hy < ZONE_V_UP) {
                const thrust = (ZONE_V_UP - hy) / ZONE_V_UP; // 0..1
                velocity.current.y -= POWER_V * (1 + thrust * 2); // makin atas makin kencang
            } else if (hy > ZONE_V_DN) {
                const thrust = (hy - ZONE_V_DN) / (1 - ZONE_V_DN);
                velocity.current.y += POWER_V * (1 + thrust * 2);
            }

            if (hx !== null) {
                if (hx < ZONE_H_R) {
                    const thrust = (ZONE_H_R - hx) / ZONE_H_R;
                    velocity.current.x += POWER_H * (1 + thrust * 2); // geser chart kanan
                } else if (hx > ZONE_H_L) {
                    const thrust = (hx - ZONE_H_L) / (1 - ZONE_H_L);
                    velocity.current.x -= POWER_H * (1 + thrust * 2); // geser chart kiri
                }
            }
        }

        // Terapkan ke browser
        if (Math.abs(velocity.current.y) > 0.3) {
            window.scrollBy(0, velocity.current.y);
        }
        if (Math.abs(velocity.current.x) > 0.3 && chartScrollRef?.current) {
            chartScrollRef.current.scrollLeft += velocity.current.x;
        }

        // Friction — hentikan pergerakan secara organik
        velocity.current.y *= FRICTION;
        velocity.current.x *= FRICTION;

        rafId.current = requestAnimationFrame(tick);
    }, [chartScrollRef]);

    /* ─────────────────────────────────────────────────────
       MediaPipe onResults — HANYA update hand.current & UI
    ───────────────────────────────────────────────────── */
    const onResults = useCallback((results) => {
        const now = performance.now();
        if (now - mpThrottle.current < 1000 / MP_FPS) return;
        mpThrottle.current = now;

        if (!results.multiHandLandmarks?.length) {
            hand.current = { x: null, y: null };
            setDot(null);
            setDir('');
            return;
        }

        const wrist = results.multiHandLandmarks[0][0];
        hand.current = { x: wrist.x, y: wrist.y };

        // Visual dot (mirror x karena webcam di-mirror secara natural oleh browser)
        setDot({
            x: (1 - wrist.x) * window.innerWidth,
            y: wrist.y * window.innerHeight,
        });

        // Badge arah
        const v = wrist.y < ZONE_V_UP ? '↑ Atas' : wrist.y > ZONE_V_DN ? '↓ Bawah' : '';
        const h = wrist.x < ZONE_H_R ? '→ Chart' : wrist.x > ZONE_H_L ? '← Chart' : '';
        setDir([v, h].filter(Boolean).join(' | ') || 'Zona Aman');
    }, []);

    /* ─────────────────────────────────────────────────────
       INIT / DESTROY
    ───────────────────────────────────────────────────── */
    useEffect(() => {
        if (!enabled) {
            // Bersih total
            if (rafId.current) cancelAnimationFrame(rafId.current);
            velocity.current = { x: 0, y: 0 };
            hand.current = { x: null, y: null };
            cameraRef.current?.stop(); cameraRef.current = null;
            handsRef.current?.close(); handsRef.current = null;
            setDot(null); setDir('');
            setStatus('idle');
            return;
        }

        setStatus('loading');

        // Mulai loop segera (tanpa tunggu kamera aktif)
        rafId.current = requestAnimationFrame(tick);

        let cancelled = false;
        (async () => {
            try {
                await waitFor('Hands'); await waitFor('Camera');
                if (cancelled) return;

                const hands = new window.Hands({
                    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
                });
                hands.setOptions({ maxNumHands: 1, modelComplexity: 0, minDetectionConfidence: 0.55, minTrackingConfidence: 0.55 });
                hands.onResults(onResults);
                handsRef.current = hands;

                const cam = new window.Camera(videoRef.current, {
                    onFrame: async () => {
                        if (handsRef.current && videoRef.current)
                            await handsRef.current.send({ image: videoRef.current });
                    },
                    width: 320, height: 240,
                });
                cameraRef.current = cam;
                await cam.start();
                if (cancelled) { cam.stop(); return; }
                setStatus('active');
            } catch (e) {
                if (!cancelled) { console.error('[GestureScroll]', e); setStatus('error'); }
            }
        })();

        return () => { cancelled = true; };
    }, [enabled, tick, onResults]);

    // Cleanup on unmount
    useEffect(() => () => {
        if (rafId.current) cancelAnimationFrame(rafId.current);
        cameraRef.current?.stop();
        handsRef.current?.close();
    }, []);

    /* ─────────────────────────────────────────────────────
       UI
    ───────────────────────────────────────────────────── */
    const COLOR = { idle: '#64748B', loading: '#F59E0B', active: '#22C55E', error: '#EF4444' }[status];

    const LABEL = {
        idle: '🚫 Gesture: Off',
        loading: '⏳ Memulai Kamera...',
        active: `✋ ${dir || 'Menunggu Tangan...'}`,
        error: '❌ Kamera Gagal',
    }[status];

    return (
        <>
            {/* Hidden video */}
            <video ref={videoRef} style={{ display: 'none' }} playsInline muted />

            {/* Virtual hand cursor dot */}
            {dot && status === 'active' && (
                <div
                    style={{
                        position: 'fixed', pointerEvents: 'none', zIndex: 9999,
                        left: dot.x, top: dot.y,
                        width: 20, height: 20, borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(249,115,22,0.9)',
                        border: '2px solid white',
                        boxShadow: '0 0 18px rgba(249,115,22,0.7)',
                    }}
                />
            )}

            {/* Badge */}
            <div
                onClick={() => setEnabled(v => !v)}
                title={enabled ? 'Klik untuk mematikan gesture' : 'Klik untuk menghidupkan gesture'}
                style={{
                    position: 'fixed', bottom: '1.25rem', right: '1.25rem', zIndex: 10000,
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(10,15,30,0.92)', border: `1.5px solid ${COLOR}`,
                    borderRadius: 999, padding: '6px 14px',
                    cursor: 'pointer', backdropFilter: 'blur(12px)',
                    boxShadow: `0 0 20px ${COLOR}44`,
                    fontFamily: 'Inter, sans-serif', userSelect: 'none',
                    transition: 'border-color .3s, box-shadow .3s',
                }}
            >
                <span
                    style={{
                        width: 9, height: 9, borderRadius: '50%',
                        background: COLOR, flexShrink: 0,
                        animation: status === 'active' ? 'pulseGlow 1.5s ease-in-out infinite' : 'none',
                    }}
                />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F1F5F9', whiteSpace: 'nowrap' }}>
                    {LABEL}
                </span>
            </div>

            {/* Zone overlays (tipis, hanya sebagai panduan batas area) */}
            {status === 'active' && (
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9000 }}>
                    {/* Top zone */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        height: `${ZONE_V_UP * 100}%`,
                        background: 'linear-gradient(to bottom, rgba(34,197,94,0.06), transparent)',
                        borderBottom: `1px dashed rgba(34,197,94,${dir.includes('Atas') ? 0.8 : 0.15})`,
                        transition: 'border-color .2s',
                    }} />
                    {/* Bottom zone */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: `${(1 - ZONE_V_DN) * 100}%`,
                        background: 'linear-gradient(to top, rgba(239,68,68,0.06), transparent)',
                        borderTop: `1px dashed rgba(239,68,68,${dir.includes('Bawah') ? 0.8 : 0.15})`,
                        transition: 'border-color .2s',
                    }} />
                    {/* Right hand zone (Chart →) */}
                    <div style={{
                        position: 'absolute', top: '20%', bottom: '20%', left: 0,
                        width: `${ZONE_H_R * 100}%`,
                        background: 'linear-gradient(to right, rgba(249,115,22,0.06), transparent)',
                        borderRight: `1px dashed rgba(249,115,22,${dir.includes('→') ? 0.8 : 0.15})`,
                        transition: 'border-color .2s',
                    }} />
                    {/* Left hand zone (Chart ←) */}
                    <div style={{
                        position: 'absolute', top: '20%', bottom: '20%', right: 0,
                        width: `${(1 - ZONE_H_L) * 100}%`,
                        background: 'linear-gradient(to left, rgba(249,115,22,0.06), transparent)',
                        borderLeft: `1px dashed rgba(249,115,22,${dir.includes('←') ? 0.8 : 0.15})`,
                        transition: 'border-color .2s',
                    }} />
                </div>
            )}
        </>
    );
};

export default GestureScroll;
