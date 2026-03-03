/**
 * GestureScroll.jsx
 * -----------------------------------------------------------
 * Fitur Gesture Remote Scroll dengan fisika Inersia (Acceleration & Friction)
 * untuk menghilangkan efek "macet" dan memberikan kelenturan saat presentasi.
 * -----------------------------------------------------------
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ── Konstanta Fisika ─────────────────────────────────────── */
const FRICTION = 0.95;  // 0.95 memberikan efek meluncur yang panjang dan seksi
const ACCEL_V = 2.0;   // Akselerasi vertikal dasar
const ACCEL_H = 2.0;   // Akselerasi horizontal dasar
const FPS_LIMIT = 30;    // Batas frame proses MediaPipe

const waitForGlobal = (name, timeout = 8000) =>
    new Promise((resolve, reject) => {
        const deadline = Date.now() + timeout;
        const check = () => {
            if (window[name]) return resolve(window[name]);
            if (Date.now() > deadline) return reject(new Error(`${name} timeout`));
            setTimeout(check, 150);
        };
        check();
    });

/* ── Komponen ─────────────────────────────────────────────── */
const GestureScroll = ({ chartScrollRef }) => {
    const [enabled, setEnabled] = useState(false);
    const [status, setStatus] = useState('idle');
    const [direction, setDirection] = useState({ v: null, h: null });

    const [cursor, setCursor] = useState({ x: 0, y: 0, active: false, yNorm: 0, xNorm: 0 });

    const videoRef = useRef(null);
    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const lastFrameTs = useRef(0);

    const scrollAnimRef = useRef(null);

    // GLOBAL STATE UNTUK VELOCITY (Sesuai instruksi)
    // Kecepatan murni yang akan digosok dengan Friction setiap frame
    const velocityY = useRef(0);
    const velocityX = useRef(0);

    // Ref untuk menampung posisi tangan saat ini agar bisa dibaca oleh loop animasi
    const handPos = useRef({ x: null, y: null });

    /* ── Continuous Smoothing Loop (RequestAnimationFrame) ─── */
    const runSmoothLoop = useCallback(() => {
        // 1. Ambil posisi tangan terakhir yang diketahui
        const { x: xNorm, y: yNorm } = handPos.current;

        let dirV = null;
        let dirH = null;

        if (xNorm !== null && yNorm !== null) {
            // 2. Berikan AKSELERASI jika tangan berada di zona pemicu

            // BONGKAR BLOKADE SCROLL ATAS (y < 0.25)
            // Memberikan akselerasi negatif yang kuat
            if (yNorm < 0.25) {
                // Makin tinggi tangan, makin kuat tarikannya
                const thrust = 1 + ((0.25 - yNorm) / 0.25) * 2;
                velocityY.current -= ACCEL_V * thrust;
                dirV = 'up';
            }
            // SCROLL BAWAH
            else if (yNorm > 0.75) {
                const thrust = 1 + ((yNorm - 0.75) / 0.25) * 2;
                velocityY.current += ACCEL_V * thrust;
                dirV = 'down';
            }

            // TARGETING GRAFIK KANAN-KIRI
            if (xNorm < 0.3) {
                // xNorm kecil (di kamera kiri, aktualnya karena di-mirror adalah kanan)
                const thrust = 1 + ((0.3 - xNorm) / 0.3) * 2;
                velocityX.current += ACCEL_H * thrust;
                dirH = 'right';
            } else if (xNorm > 0.7) {
                const thrust = 1 + ((xNorm - 0.7) / 0.3) * 2;
                velocityX.current -= ACCEL_H * thrust;
                dirH = 'left';
            }
        }

        // 3. APPLY FRICTION (Efek Dekelerasi / Daya Luncur yang mengalir)
        velocityY.current *= FRICTION;
        velocityX.current *= FRICTION;

        // 4. TERAPKAN KE BROWSER BILA KECEPATAN SIGNIFIKAN
        if (Math.abs(velocityY.current) > 0.5) {
            // behavior 'auto' membiarkan fisika kita yang mengatur kehalusannya, tanpa antrian animasi browser
            window.scrollBy({ top: velocityY.current, behavior: 'auto' });
        }
        if (Math.abs(velocityX.current) > 0.5 && chartScrollRef?.current) {
            chartScrollRef.current.scrollLeft += velocityX.current;
        }

        // Update state direksi untuk UI (dimasukkan requestAnimationFrame agak lambat di React, 
        // tapi lebih baik daripada panggil setState terus menerus)
        // Untuk hindari rendering loop, kita biarkan UI update diatur event beda jika perlu, 
        // namun demi sinkronisasi visual kita tempel di ref dulu lalu update di MediaPipe event.

        scrollAnimRef.current = requestAnimationFrame(runSmoothLoop);
    }, [chartScrollRef]);

    /* ── MediaPipe onResults callback ─── */
    const onResults = useCallback((results) => {
        const now = performance.now();
        if (now - lastFrameTs.current < 1000 / FPS_LIMIT) return;
        lastFrameTs.current = now;

        if (!results.multiHandLandmarks?.length) {
            // Tangan di luar frame, lepas gas
            handPos.current = { x: null, y: null };
            setDirection({ v: null, h: null });
            setCursor(prev => ({ ...prev, active: false }));
            return;
        }

        const wrist = results.multiHandLandmarks[0][0];
        const xNorm = wrist.x;
        const yNorm = wrist.y;

        // Simpan ke Mutable Ref agar dieksekusi oleh 60 FPS Loop
        handPos.current = { x: xNorm, y: yNorm };

        // Update UI
        const screenX = (1 - xNorm) * window.innerWidth;
        const screenY = yNorm * window.innerHeight;
        setCursor({ x: screenX, y: screenY, active: true, yNorm, xNorm });

        // UI Direction update (simplifikasi)
        let dv = null; let dh = null;
        if (yNorm < 0.25) dv = 'up'; else if (yNorm > 0.75) dv = 'down';
        if (xNorm < 0.3) dh = 'right'; else if (xNorm > 0.7) dh = 'left';
        setDirection({ v: dv, h: dh });

    }, []);

    /* ── Init / Destroy MediaPipe ─── */
    useEffect(() => {
        if (!enabled) {
            if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
            velocityY.current = 0;
            velocityX.current = 0;
            handPos.current = { x: null, y: null };

            setDirection({ v: null, h: null });
            setCursor({ x: 0, y: 0, active: false, yNorm: 0, xNorm: 0 });

            if (cameraRef.current) {
                cameraRef.current.stop();
                cameraRef.current = null;
            }
            if (handsRef.current) {
                handsRef.current.close();
                handsRef.current = null;
            }
            setStatus('idle');
            return;
        }

        let cancelled = false;
        setStatus('loading');

        // Mulai animasi engine "Inersia" kita di background
        scrollAnimRef.current = requestAnimationFrame(runSmoothLoop);

        (async () => {
            try {
                await waitForGlobal('Hands');
                await waitForGlobal('Camera');
                if (cancelled) return;

                const hands = new window.Hands({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
                });
                hands.setOptions({
                    maxNumHands: 1,
                    modelComplexity: 0,
                    minDetectionConfidence: 0.6,
                    minTrackingConfidence: 0.6,
                });
                hands.onResults(onResults);
                handsRef.current = hands;

                const camera = new window.Camera(videoRef.current, {
                    onFrame: async () => {
                        if (handsRef.current && videoRef.current) {
                            await handsRef.current.send({ image: videoRef.current });
                        }
                    },
                    width: 320, height: 240,
                });
                cameraRef.current = camera;
                await camera.start();
                if (cancelled) { camera.stop(); return; }

                setStatus('active');
            } catch (err) {
                if (!cancelled) {
                    console.error('[GestureScroll]', err);
                    setStatus('error');
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [enabled, onResults, runSmoothLoop]);

    useEffect(() => {
        return () => {
            if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
            cameraRef.current?.stop();
            handsRef.current?.close();
        };
    }, []);

    /* ── Derived UI state ─── */
    const statusColor = {
        idle: '#64748B', loading: '#F59E0B', active: '#22C55E', error: '#EF4444',
    }[status];

    let dirText = 'Tangan di Safe Zone';
    if (direction.v || direction.h) {
        let t = [];
        if (direction.v === 'up') t.push('↑ Elevasi Naik');
        if (direction.v === 'down') t.push('↓ Elevasi Turun');
        if (direction.h === 'left') t.push('← Grafik Kiri');
        if (direction.h === 'right') t.push('→ Grafik Kanan');
        dirText = t.join(' | ');
    }

    const statusLabel = {
        idle: 'Gesture Scroll: Off',
        loading: 'Kamera Inisialisasi...',
        active: cursor.active ? dirText : 'Posisikan Tangan ke Kamera',
        error: 'Kamera Gagal Akses',
    }[status];

    return (
        <>
            <video ref={videoRef} style={{ display: 'none' }} playsInline muted />

            {/* ── Virtual Hand Cursor (Red Dot) ── */}
            {status === 'active' && cursor.active && (
                <div style={{
                    position: 'fixed',
                    left: cursor.x,
                    top: cursor.y,
                    width: 18,
                    height: 18,
                    background: 'rgba(249,115,22,0.85)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    boxShadow: '0 0 16px rgba(249,115,22,0.6)',
                    border: '2px solid #FFF',
                }} />
            )}

            {/* ── UI Badge Bottom Right ── */}
            <div
                title={enabled ? 'Matikan Gesture' : 'Nyalakan Gesture Remote'}
                onClick={() => setEnabled(v => !v)}
                style={{
                    position: 'fixed',
                    bottom: '1.5rem',
                    right: '1.5rem',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.5rem',
                    background: 'rgba(15,23,42,0.92)',
                    border: `1.5px solid ${statusColor}`,
                    borderRadius: 999,
                    padding: '.45rem 1rem',
                    cursor: 'pointer',
                    boxShadow: `0 0 16px ${statusColor}55`,
                    backdropFilter: 'blur(12px)',
                    userSelect: 'none',
                    transition: 'all .3s',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <span style={{
                    width: 10, height: 10, borderRadius: '50%', background: statusColor, flexShrink: 0,
                    animation: status === 'active' ? 'pulseGlow 1.5s ease-in-out infinite' : 'none',
                }} />
                <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#F1F5F9' }}>
                    {statusLabel}
                </span>
                {status === 'active' && cursor.active && (
                    <span style={{ fontSize: '.65rem', color: '#94A3B8', fontFamily: 'monospace', display: 'flex', gap: 4 }}>
                        <span>Y:{(cursor.yNorm * 100).toFixed(0)}</span>
                        <span>X:{(cursor.xNorm * 100).toFixed(0)}</span>
                    </span>
                )}
            </div>

            {/* ── Visual Zones Overlay ── */}
            {status === 'active' && (
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9000 }}>
                    {/* Top zone 25% */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        height: '25%',
                        background: direction.v === 'up' ? 'linear-gradient(to bottom, rgba(34,197,94,0.15), transparent)' : 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)',
                        borderBottom: direction.v === 'up' ? '1px dashed rgba(34,197,94,0.6)' : '1px dashed rgba(255,255,255,0.05)',
                        transition: 'all .3s',
                    }} />

                    {/* Bottom zone 25% */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: '25%',
                        background: direction.v === 'down' ? 'linear-gradient(to top, rgba(239,68,68,0.15), transparent)' : 'linear-gradient(to top, rgba(255,255,255,0.02), transparent)',
                        borderTop: direction.v === 'down' ? '1px dashed rgba(239,68,68,0.6)' : '1px dashed rgba(255,255,255,0.05)',
                        transition: 'all .3s',
                    }} />

                    {/* Left zone 30% */}
                    <div style={{
                        position: 'absolute', top: '25%', bottom: '25%', left: 0, width: '30%',
                        background: direction.h === 'left' ? 'linear-gradient(to right, rgba(249,115,22,0.15), transparent)' : 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)',
                        borderRight: direction.h === 'left' ? '1px dashed rgba(249,115,22,0.6)' : '1px dashed rgba(255,255,255,0.05)',
                        transition: 'all .3s',
                    }} />

                    {/* Right zone 30% */}
                    <div style={{
                        position: 'absolute', top: '25%', bottom: '25%', right: 0, width: '30%',
                        background: direction.h === 'right' ? 'linear-gradient(to left, rgba(249,115,22,0.15), transparent)' : 'linear-gradient(to left, rgba(255,255,255,0.02), transparent)',
                        borderLeft: direction.h === 'right' ? '1px dashed rgba(249,115,22,0.6)' : '1px dashed rgba(255,255,255,0.05)',
                        transition: 'all .3s',
                    }} />
                </div>
            )}
        </>
    );
};

export default GestureScroll;
