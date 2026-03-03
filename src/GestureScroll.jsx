/**
 * GestureScroll.jsx
 * -----------------------------------------------------------
 * Komponen mandiri untuk fitur Gesture Remote Scroll berbasis
 * MediaPipe Hands. Sengaja dipisah dari App.jsx agar:
 *  - Tidak mengganggu rendering Recharts
 *  - Kamera hanya aktif saat toggle "ON"
 *  - Mudah dimaintain / dihapus tanpa menyentuh logika utama
 * -----------------------------------------------------------
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ── Konstanta ──────────────────────────────────────────── */
const SCROLL_ZONE_PCT = 0.30;   // 30% atas/bawah layar
const SCROLL_STEP = 18;     // px per frame
const FPS_LIMIT = 30;     // batas frame hands detection

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
    const [status, setStatus] = useState('idle');   // idle | loading | active | error
    const [gesture, setGesture] = useState(null);     // 'up' | 'down' | null
    const [handY, setHandY] = useState(null);     // 0..1

    const videoRef = useRef(null);
    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const lastFrameTs = useRef(0);
    const scrollAnimRef = useRef(null);
    const currentGesture = useRef(null);

    /* ── Scroll loop (requestAnimationFrame) ─── */
    const runScrollLoop = useCallback(() => {
        if (currentGesture.current === 'up') {
            window.scrollBy({ top: -SCROLL_STEP });
        } else if (currentGesture.current === 'down') {
            window.scrollBy({ top: SCROLL_STEP });
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
        // Rate-limit: proses maks FPS_LIMIT frame/detik
        const now = performance.now();
        if (now - lastFrameTs.current < 1000 / FPS_LIMIT) return;
        lastFrameTs.current = now;

        if (!results.multiHandLandmarks?.length) {
            currentGesture.current = null;
            setGesture(null);
            setHandY(null);
            return;
        }

        // Gunakan landmark 0 (pergelangan tangan)
        const wrist = results.multiHandLandmarks[0][0];
        const yNorm = wrist.y;   // 0 = atas, 1 = bawah
        setHandY(yNorm);

        let next = null;
        if (yNorm < SCROLL_ZONE_PCT) next = 'up';
        else if (yNorm > 1 - SCROLL_ZONE_PCT) next = 'down';

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
            // Bersihkan saat dimatikan
            stopScrollLoop();
            currentGesture.current = null;
            setGesture(null);
            setHandY(null);
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
                // Tunggu MediaPipe tersedia dari CDN (defer script)
                await waitForGlobal('Hands');
                await waitForGlobal('Camera');
                if (cancelled) return;

                /* Init Hands */
                const hands = new window.Hands({
                    locateFile: (file) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
                });
                hands.setOptions({
                    maxNumHands: 1,
                    modelComplexity: 0,      // 0 = lite, lebih ringan
                    minDetectionConfidence: 0.6,
                    minTrackingConfidence: 0.5,
                });
                hands.onResults(onResults);
                handsRef.current = hands;

                /* Init Camera */
                const camera = new window.Camera(videoRef.current, {
                    onFrame: async () => {
                        if (handsRef.current && videoRef.current) {
                            await handsRef.current.send({ image: videoRef.current });
                        }
                    },
                    width: 320, height: 240,   // resolusi rendah = hemat CPU
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
        idle: '#64748B',
        loading: '#F59E0B',
        active: '#22C55E',
        error: '#EF4444',
    }[status];

    const statusLabel = {
        idle: 'Gesture Scroll: Off',
        loading: 'Memulai kamera…',
        active: gesture === 'up' ? '↑ Scroll Atas'
            : gesture === 'down' ? '↓ Scroll Bawah'
                : 'Gesture Scroll: Active',
        error: 'Kamera gagal dimuat',
    }[status];

    /* ── Render ─── */
    return (
        <>
            {/* Hidden video element (MediaPipe butuh ini) */}
            <video
                ref={videoRef}
                style={{ display: 'none' }}
                playsInline
                muted
            />

            {/* ── UI Badge ── */}
            <div
                title={enabled ? 'Klik untuk menonaktifkan Gesture Scroll' : 'Klik untuk mengaktifkan Gesture Scroll'}
                onClick={() => setEnabled(v => !v)}
                style={{
                    position: 'fixed',
                    bottom: '1.5rem',
                    right: '1.5rem',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.5rem',
                    background: 'rgba(15,23,42,0.92)',
                    border: `1.5px solid ${statusColor}`,
                    borderRadius: 999,
                    padding: '.45rem 1rem',
                    cursor: 'pointer',
                    boxShadow: `0 0 16px ${statusColor}55, 0 4px 20px rgba(0,0,0,0.3)`,
                    backdropFilter: 'blur(12px)',
                    userSelect: 'none',
                    transition: 'box-shadow .3s, border-color .3s',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                {/* Pulsing dot */}
                <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: statusColor,
                    flexShrink: 0,
                    animation: status === 'active' ? 'pulseGlow 1.5s ease-in-out infinite' : 'none',
                    boxShadow: status === 'active' ? `0 0 0 3px ${statusColor}40` : 'none',
                }} />

                {/* Label */}
                <span style={{
                    fontSize: '.72rem',
                    fontWeight: 700,
                    color: '#F1F5F9',
                    letterSpacing: .5,
                    whiteSpace: 'nowrap',
                }}>
                    {statusLabel}
                </span>

                {/* Hand Y-position sub-indicator */}
                {status === 'active' && handY !== null && (
                    <span style={{
                        fontSize: '.65rem',
                        color: '#64748B',
                        fontFamily: 'monospace',
                    }}>
                        [{(handY * 100).toFixed(0)}%]
                    </span>
                )}

                {/* Camera icon */}
                <span style={{ fontSize: '.8rem', opacity: .7 }}>
                    {enabled ? '📷' : '🚫'}
                </span>
            </div>

            {/* ── Zone indicator overlay (hanya saat active) ── */}
            {status === 'active' && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 9000,
                    }}
                >
                    {/* Top zone */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: `${SCROLL_ZONE_PCT * 100}%`,
                        background: gesture === 'up'
                            ? 'linear-gradient(to bottom, rgba(34,197,94,0.12), transparent)'
                            : 'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)',
                        transition: 'background .3s',
                        borderBottom: gesture === 'up' ? '1px dashed rgba(34,197,94,0.4)' : '1px dashed rgba(255,255,255,0.1)',
                    }}>
                        {gesture === 'up' && (
                            <div style={{
                                position: 'absolute', bottom: 8, left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '.7rem', fontWeight: 700, color: '#22C55E',
                                fontFamily: 'Inter, sans-serif', letterSpacing: 1,
                            }}>
                                ↑ SCROLL UP
                            </div>
                        )}
                    </div>

                    {/* Bottom zone */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        height: `${SCROLL_ZONE_PCT * 100}%`,
                        background: gesture === 'down'
                            ? 'linear-gradient(to top, rgba(239,68,68,0.12), transparent)'
                            : 'linear-gradient(to top, rgba(255,255,255,0.04), transparent)',
                        transition: 'background .3s',
                        borderTop: gesture === 'down' ? '1px dashed rgba(239,68,68,0.4)' : '1px dashed rgba(255,255,255,0.1)',
                    }}>
                        {gesture === 'down' && (
                            <div style={{
                                position: 'absolute', top: 8, left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '.7rem', fontWeight: 700, color: '#EF4444',
                                fontFamily: 'Inter, sans-serif', letterSpacing: 1,
                            }}>
                                ↓ SCROLL DOWN
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default GestureScroll;
