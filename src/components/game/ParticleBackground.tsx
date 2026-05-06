'use client';

import { useEffect, useRef } from 'react';

/**
 * Subtle ambient particle layer for the game screen.
 * - Fixed, full-viewport, behind everything (-z-10).
 * - 24 slow-drifting particles in warm, low-opacity tones to match the
 *   cream/amber palette without competing with foreground content.
 * - Honors prefers-reduced-motion (renders nothing).
 * - Uses canvas for performance; sized to devicePixelRatio.
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Warm pastel palette that pairs with #faf8f5 / accent
    const palette = [
      'rgba(251, 191, 36, 0.18)', // amber
      'rgba(251, 146, 60, 0.16)', // soft orange
      'rgba(244, 114, 182, 0.14)', // soft pink
      'rgba(167, 139, 250, 0.12)', // soft lavender
    ];

    const COUNT = 24;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2.5,
      vy: -0.05 - Math.random() * 0.12, // drift up
      vx: (Math.random() - 0.5) * 0.05,
      color: palette[Math.floor(Math.random() * palette.length)],
      phase: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(50, now - last); // clamp for tab-switch
      last = now;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.y += p.vy * dt;
        p.x += p.vx * dt + Math.sin((now * 0.0005) + p.phase) * 0.08;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
