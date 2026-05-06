'use client';

import { useEffect, useRef } from 'react';

/**
 * Subtle ambient particle layer for the game screen.
 * - Fixed, full-viewport, behind everything (-z-10).
 * - ~30 slow-drifting particles with gentle opacity breathing.
 * - Warm pastel palette (amber / coral / gold / orange) to match cream bg.
 * - Honors prefers-reduced-motion.
 * - Canvas sized to devicePixelRatio (clamped to 2) with safe setTransform reset.
 */

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  opacityDir: number;
  colorPrefix: string; // e.g. 'rgba(255, 107, 107, '
  phase: number;
}

const COLORS = [
  'rgba(255, 107, 107, ',
  'rgba(255, 160, 122, ',
  'rgba(251, 191, 36, ',
  'rgba(249, 115, 22, ',
];

const PARTICLE_COUNT = 30;
const OPACITY_MIN = 0.05;
const OPACITY_MAX = 0.16;

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: 1 + Math.random() * 2,
    speedY: -(0.1 + Math.random() * 0.3),
    speedX: (Math.random() - 0.5) * 0.15,
    opacity: OPACITY_MIN + Math.random() * (OPACITY_MAX - OPACITY_MIN),
    opacityDir: Math.random() > 0.5 ? 0.0022 : -0.0022,
    colorPrefix: COLORS[Math.floor(Math.random() * COLORS.length)],
    phase: Math.random() * Math.PI * 2,
  };
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Reset-then-scale so dpr doesn't accumulate on successive resizes
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(width, height),
      );
    };

    init();

    let raf = 0;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;

        p.opacity += p.opacityDir;
        if (p.opacity >= OPACITY_MAX) {
          p.opacity = OPACITY_MAX;
          p.opacityDir = -Math.abs(p.opacityDir);
        } else if (p.opacity <= OPACITY_MIN) {
          p.opacity = OPACITY_MIN;
          p.opacityDir = Math.abs(p.opacityDir);
        }

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorPrefix}${p.opacity})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('resize', resize);

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
