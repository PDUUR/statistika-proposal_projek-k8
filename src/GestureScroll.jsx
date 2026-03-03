/**
 * GestureScroll.jsx
 * -----------------------------------------------------------
 * Fitur Gesture Remote Scroll dengan kemampuan:
 * 1. Vertical Page Scroll (Up/Down)
 * 2. Horizontal Chart Scroll (Geser grafik)
 * -----------------------------------------------------------
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ── Konstanta ──────────────────────────────────────────── */
const SCROLL_ZONE_PCT_V = 0.35; // Toleransi lebih besar: 35% atas/bawah
const SCROLL_STEP_V = 25;   // Lebih cepat (25px)
// Kurangi FPS untuk melancarkan performa browser
const FPS_LIMIT = 24;

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
const GestureScroll = () => {
    const [enabled, setEnabled] = useState(false);
    const [status, setStatus] = useState('idle');
    const [gesture, setGesture] = useState(null);

    // Posisi kursor/tangan untuk UI feedback
    const [cursor, setCursor] = useState({ x: 0, y: 0, active: false });

    const videoRef = useRef(null);
    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const lastFrameTs = useRef(0);

    // State scroll
    const scrollAnimRef = useRef(null);
    const currentGesture = useRef(null);

    // Menyimpan posisi X sebelumnya untuk mendeteksi pergeseran kiri/kanan
    const prevHandX = useRef(null);

    /* ── Vertical Scroll loop (requestAnimationFrame) ─── */
    const runScrollLoop = useCallback(() => {
        if (currentGesture.current === 'up') {
            window.scrollBy({ top: -SCROLL_STEP_V, behavior: 'auto' });
        } else if (currentGesture.current === 'down') {
            window.scrollBy({ top: SCROLL_STEP_V, behavior: 'auto' });
        }
        scrollAnimRef.current = requestAnimationFrame(runScrollLoop);
    }, []);

    const stopScrollLoop = useCallback(() => {
        if (scrollAnimRef.current) {
            cancelAnimationFrame(scrollAnimRef.current);
            scrollAnimRef.current = null;
        }
    }, []);

    /* ── MediaPipe onResults callback ─── */
    const onResults = useCallback((results) => {
        const now = performance.now();
        if (now - lastFrameTs.current < 1000 / FPS_LIMIT) return;
        lastFrameTs.current = now;

        if (!results.multiHandLandmarks?.length) {
            currentGesture.current = null;
            setGesture(null);
            setCursor(prev => ({ ...prev, active: false }));
            prevHandX.current = null;
            return;
        }

        const wrist = results.multiHandLandmarks[0][0]; // landmark pergelangan tangan
        const xNorm = wrist.x; // 0 = kiri layar webcam, 1 = kanan layar webcam
        const yNorm = wrist.y; // 0 = atas, 1 = bawah

        // Mapping ke ukuran window. 
        // Webcam "mirrored" secara natural: gerak tangan Anda ke kanan -> xNorm makin kecil
        const screenX = (1 - xNorm) * window.innerWidth;
        const screenY = yNorm * window.innerHeight;

        setCursor({ x: screenX, y: screenY, active: true, yNorm });

        /* ── HORIZONTAL CHART SCROLL ─── */
        const chartEl = document.getElementById('chart-scroll-container');
        if (chartEl) {
            const rect = chartEl.getBoundingClientRect();
            // Tambah sedikit margin toleransi hitbox area grafik agar lebih asyik digeser
            const isHoveringChart = (
                screenX >= rect.left - 50 && screenX <= rect.right + 50 &&
                screenY >= rect.top - 80 && screenY <= rect.bottom + 80
            );

            if (isHoveringChart && prevHandX.current !== null) {
                // xNorm mengecil artinya tangan bergerak ke Kanan secara fisik
                const deltaXNorm = xNorm - prevHandX.current;

                // Membalik deltaXNorm lalu mengali dengan faktor windowWidth & sensitivitas (misal 1.8)
                // Jika tangan Anda ditarik ke KIRI, grafik bergeser mengikuti (natural swipe)
                const scrollDeltaPx = deltaXNorm * window.innerWidth * 1.8;

                // Beri sedikit threshold agar tidak terlalu bergetar/jitter
                if (Math.abs(scrollDeltaPx) > 1.5) {
                    chartEl.scrollLeft += scrollDeltaPx;
                }
            }
        }
        prevHandX.current = xNorm;

        /* ── VERTICAL PAGE SCROLL ─── */
        let next = null;
        if (yNorm < SCROLL_ZONE_PCT_V) next = 'up';
        else if (yNorm > 1 - SCROLL_ZONE_PCT_V) next = 'down';

        if (next !== currentGesture.current) {
            currentGesture.current = next;
            setGesture(next);
            if (next && !scrollAnimRef.current) {
                scrollAnimRef.current = requestAnimationFrame(runScrollLoop);
            } else if (!next) {
                stopScrollLoop();
            }
        }
    }, [runScrollLoop, stopScrollLoop]);

    /* ── Init / Destroy MediaPipe ─── */
    useEffect(() => {
        if (!enabled) {
            stopScrollLoop();
            currentGesture.current = null;
            setGesture(null);
            setCursor({ x: 0, y: 0, active: false });
            prevHandX.current = null;

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
    }, [enabled, onResults]);

    /* ── Cleanup on unmount ─── */
    useEffect(() => {
        return () => {
            stopScrollLoop();
            cameraRef.current?.stop();
            handsRef.current?.close();
        };
    }, [stopScrollLoop]);

    /* ── Derived UI state ─── */
    const statusColor = {
        idle: '#64748B', loading: '#F59E0B', active: '#22C55E', error: '#EF4444',
    }[status];

    const statusLabel = {
        idle: 'Gesture Scroll: Off',
        loading: 'Memulai kamera…',
        active: gesture === 'up' ? '↑ Berjalan Naik'
            : gesture === 'down' ? '↓ Berjalan Turun'
                : 'Gesture Active (Tangan Siap)',
        error: 'Kamera gagal dimuat',
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
                    <span style={{ fontSize: '.65rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                        Y:{(cursor.yNorm * 100).toFixed(0)}%
                    </span>
                )}
            </div>

            {/* ── Zone indicator overlay ── */}
            {status === 'active' && (
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9000 }}>
                    {/* Top zone (terlihat samar terus, aktif jadi jelas) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        height: `${SCROLL_ZONE_PCT_V * 100}%`,
                        background: gesture === 'up' ? 'linear-gradient(to bottom, rgba(34,197,94,0.15), transparent)' : 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)',
                        borderBottom: gesture === 'up' ? '2px dashed rgba(34,197,94,0.6)' : '1px dashed rgba(255,255,255,0.1)',
                        transition: 'all .3s',
                    }} />

                    {/* Bottom zone */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: `${SCROLL_ZONE_PCT_V * 100}%`,
                        background: gesture === 'down' ? 'linear-gradient(to top, rgba(239,68,68,0.15), transparent)' : 'linear-gradient(to top, rgba(255,255,255,0.02), transparent)',
                        borderTop: gesture === 'down' ? '2px dashed rgba(239,68,68,0.6)' : '1px dashed rgba(255,255,255,0.1)',
                        transition: 'all .3s',
                    }} />
                </div>
            )}
        </>
    );
};

export default GestureScroll;
