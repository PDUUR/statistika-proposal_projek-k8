/**
 * GestureScroll.jsx
 * -----------------------------------------------------------
 * Fitur Gesture Remote Scroll dengan kemampuan:
 * 1. Vertical Page Scroll (Up/Down) via Lerp
 * 2. Horizontal Chart Scroll (Geser grafik) via Lerp
 * -----------------------------------------------------------
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ── Konstanta ──────────────────────────────────────────── */
const SCROLL_ZONE_PCT = 0.30;   // 30% batas luar zona (atas/bawah/kiri/kanan)
const LERP_FACTOR = 0.08;   // Semakin kecil = makin licin/smooth decelerasi
const MAX_VELOCITY_V = 25;     // Speed max scroll vertikal
const MAX_VELOCITY_H = 25;     // Speed max scroll horizontal
const FPS_LIMIT = 30;     // Batas frame proses MediaPipe

/* ── Helpers ─────────────────────────────────────────────── */
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
    const [direction, setDirection] = useState({ v: null, h: null }); // untuk indikator UI UI

    // Posisi kursor/tangan untuk UI feedback
    const [cursor, setCursor] = useState({ x: 0, y: 0, active: false });

    const videoRef = useRef(null);
    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const lastFrameTs = useRef(0);

    // State Smoothing (Smooth Lerp Loop)
    const scrollAnimRef = useRef(null);

    // Target yang diminta oleh tangan
    const targetVelocityY = useRef(0);
    const targetVelocityX = useRef(0);

    // Nilai kecepatan halus (yang perlahan mengejar target)
    const currentVelocityY = useRef(0);
    const currentVelocityX = useRef(0);

    /* ── Smooth Active Loop (Lerp + requestAnimationFrame) ─── */
    const runSmoothLoop = useCallback(() => {
        // Lerp logic: current = current + (target - current) * factor
        currentVelocityY.current += (targetVelocityY.current - currentVelocityY.current) * LERP_FACTOR;
        currentVelocityX.current += (targetVelocityX.current - currentVelocityX.current) * LERP_FACTOR;

        // Apply Vertical Scroll
        if (Math.abs(currentVelocityY.current) > 0.5) {
            window.scrollBy({ top: currentVelocityY.current, behavior: 'auto' });
        }

        // Apply Horizontal Scroll (jika chartScrollRef tersedia)
        if (Math.abs(currentVelocityX.current) > 0.5 && chartScrollRef?.current) {
            chartScrollRef.current.scrollLeft += currentVelocityX.current;
        }

        scrollAnimRef.current = requestAnimationFrame(runSmoothLoop);
    }, [chartScrollRef]);

    /* ── MediaPipe onResults callback ─── */
    const onResults = useCallback((results) => {
        const now = performance.now();
        if (now - lastFrameTs.current < 1000 / FPS_LIMIT) return;
        lastFrameTs.current = now;

        if (!results.multiHandLandmarks?.length) {
            // Tangan di luar layar -> Perlambat ke 0 (Decelerasi sisa Lerp)
            targetVelocityY.current = 0;
            targetVelocityX.current = 0;
            setDirection({ v: null, h: null });
            setCursor(prev => ({ ...prev, active: false }));
            return;
        }

        const wrist = results.multiHandLandmarks[0][0]; // landmark pergelangan tangan
        const xNorm = wrist.x; // 0 = kiri, 1 = kanan (webcam raw)
        const yNorm = wrist.y; // 0 = atas, 1 = bawah

        // Virtual Red Dot (Mirror mapping)
        const screenX = (1 - xNorm) * window.innerWidth;
        const screenY = yNorm * window.innerHeight;
        setCursor({ x: screenX, y: screenY, active: true, yNorm, xNorm });

        /* ── ZONING LOGIC (30-40-30) ─── */
        let tVy = 0;
        let tVx = 0;

        let dirV = null;
        let dirH = null;

        // VERTIKAL
        if (yNorm < SCROLL_ZONE_PCT) {
            // Masuk area 30% atas -> Velocity Negatif (Naik)
            // Hitung intensitas joystick (semakin ke atas, makin kencang)
            const intensity = (SCROLL_ZONE_PCT - yNorm) / SCROLL_ZONE_PCT;
            tVy = -MAX_VELOCITY_V * Math.max(0, intensity);
            dirV = 'up';
        } else if (yNorm > 1 - SCROLL_ZONE_PCT) {
            // Masuk area 30% bawah -> Velocity Positif (Turun)
            const intensity = (yNorm - (1 - SCROLL_ZONE_PCT)) / SCROLL_ZONE_PCT;
            tVy = MAX_VELOCITY_V * Math.max(0, intensity);
            dirV = 'down';
        }

        // HORIZONTAL
        if (xNorm < SCROLL_ZONE_PCT) {
            // x < 0.3 di web cam berarti sisi KANAN layar user karena mirror
            const intensity = (SCROLL_ZONE_PCT - xNorm) / SCROLL_ZONE_PCT;
            tVx = MAX_VELOCITY_H * Math.max(0, intensity);
            dirH = 'right';
        } else if (xNorm > 1 - SCROLL_ZONE_PCT) {
            // x > 0.7 berarti sisi KIRI layar user
            const intensity = (xNorm - (1 - SCROLL_ZONE_PCT)) / SCROLL_ZONE_PCT;
            tVx = -MAX_VELOCITY_H * Math.max(0, intensity);
            dirH = 'left';
        }

        // Update target velocity. Lerp loop akan mengejarnya perlahan
        targetVelocityY.current = tVy;
        targetVelocityX.current = tVx;
        setDirection({ v: dirV, h: dirH });

    }, []);

    /* ── Init / Destroy MediaPipe ─── */
    useEffect(() => {
        if (!enabled) {
            if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
            targetVelocityY.current = 0;
            targetVelocityX.current = 0;
            currentVelocityY.current = 0;
            currentVelocityX.current = 0;

            setDirection({ v: null, h: null });
            setCursor({ x: 0, y: 0, active: false });

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

        // Mulai animasi loop halus
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

    /* ── Cleanup on unmount ─── */
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

    let dirText = 'Mendeteksi...';
    if (direction.v || direction.h) {
        let t = [];
        if (direction.v === 'up') t.push('↑ Naik');
        if (direction.v === 'down') t.push('↓ Turun');
        if (direction.h === 'left') t.push('← Kiri');
        if (direction.h === 'right') t.push('→ Kanan');
        dirText = t.join(' & ');
    } else {
        dirText = 'Zona Aman (Hold)';
    }

    const statusLabel = {
        idle: 'Gesture Scroll: Off',
        loading: 'Memulai kamera...',
        active: cursor.active ? dirText : 'Tangan Hilang',
        error: 'Kamera Gagal Dimuat',
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

            {/* ── Zone indicator overlay ── */}
            {status === 'active' && (
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9000 }}>
                    {/* Top zone */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        height: `${SCROLL_ZONE_PCT * 100}%`,
                        background: direction.v === 'up' ? 'linear-gradient(to bottom, rgba(34,197,94,0.15), transparent)' : 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)',
                        borderBottom: direction.v === 'up' ? '1px dashed rgba(34,197,94,0.6)' : '1px dashed rgba(255,255,255,0.05)',
                        transition: 'all .3s',
                    }} />

                    {/* Bottom zone */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: `${SCROLL_ZONE_PCT * 100}%`,
                        background: direction.v === 'down' ? 'linear-gradient(to top, rgba(239,68,68,0.15), transparent)' : 'linear-gradient(to top, rgba(255,255,255,0.02), transparent)',
                        borderTop: direction.v === 'down' ? '1px dashed rgba(239,68,68,0.6)' : '1px dashed rgba(255,255,255,0.05)',
                        transition: 'all .3s',
                    }} />

                    {/* Left zone */}
                    <div style={{
                        position: 'absolute', top: '30%', bottom: '30%', left: 0, width: `${SCROLL_ZONE_PCT * 100}%`,
                        background: direction.h === 'left' ? 'linear-gradient(to right, rgba(249,115,22,0.15), transparent)' : 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)',
                        borderRight: direction.h === 'left' ? '1px dashed rgba(249,115,22,0.6)' : '1px dashed rgba(255,255,255,0.05)',
                        transition: 'all .3s',
                    }} />

                    {/* Right zone */}
                    <div style={{
                        position: 'absolute', top: '30%', bottom: '30%', right: 0, width: `${SCROLL_ZONE_PCT * 100}%`,
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
