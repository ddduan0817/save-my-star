'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface StatsRadarProps {
  commercialValue: number;  // 0-100
  fanLoyalty: number;       // 0-100
  prRisk: number;           // 0-100 (inverted display: 100-risk = displayed value)
  appearance: number;       // 0-100
  size?: number;            // SVG size in px, default 200
  /** Optional rival overlay — drawn underneath the player polygon for comparison */
  rival?: {
    commercialValue: number;
    fanLoyalty: number;
    prRisk: number;
    appearance: number;
  };
}

const AXES = [
  { key: 'commercialValue', label: '商业价值', color: '#f59e0b' },  // amber
  { key: 'fanLoyalty',      label: '粉丝忠诚', color: '#ec4899' },  // pink
  { key: 'prRisk',          label: '舆论风险', color: '#ef4444' },  // red
  { key: 'appearance',      label: '外貌颜值', color: '#a855f7' },  // purple
] as const;

const RING_LEVELS = [0.25, 0.5, 0.75, 1.0];

// Horizontal padding inside the viewBox to leave room for 4-character side labels
const LABEL_PAD_X = 28;
const LABEL_PAD_Y = 14;

export default function StatsRadar({
  commercialValue,
  fanLoyalty,
  prRisk,
  appearance,
  size = 200,
  rival,
}: StatsRadarProps) {
  const n = AXES.length;
  const center = size / 2;
  // Reserve more room for the 4-character labels at the cardinal axes
  const maxRadius = size / 2 - 36;
  const angleStep = (2 * Math.PI) / n;
  // Start from the top (-PI/2) and go clockwise
  const startAngle = -Math.PI / 2;

  // Compute vertex position for a given axis index and fraction of max radius
  const getPoint = (axisIndex: number, fraction: number) => {
    const angle = startAngle + axisIndex * angleStep;
    const r = maxRadius * fraction;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Raw values with prRisk inverted
  const values = useMemo(
    () => [commercialValue, fanLoyalty, 100 - prRisk, appearance],
    [commercialValue, fanLoyalty, prRisk, appearance],
  );

  // Build polygon points string for the data shape
  const dataPoints = useMemo(() => {
    return values
      .map((v, i) => {
        const clamped = Math.max(0, Math.min(100, v)) / 100;
        const p = getPoint(i, clamped);
        return `${p.x},${p.y}`;
      })
      .join(' ');
  }, [values]);

  // Rival polygon (optional)
  const rivalValues = useMemo(
    () =>
      rival
        ? [rival.commercialValue, rival.fanLoyalty, 100 - rival.prRisk, rival.appearance]
        : null,
    [rival],
  );
  const rivalPoints = useMemo(() => {
    if (!rivalValues) return null;
    return rivalValues
      .map((v, i) => {
        const clamped = Math.max(0, Math.min(100, v)) / 100;
        const p = getPoint(i, clamped);
        return `${p.x},${p.y}`;
      })
      .join(' ');
  }, [rivalValues]);

  // Ring polygons
  const rings = useMemo(
    () =>
      RING_LEVELS.map(level => {
        const pts = Array.from({ length: n }, (_, i) => {
          const p = getPoint(i, level);
          return `${p.x},${p.y}`;
        }).join(' ');
        return pts;
      }),
    [],
  );

  // Axis line endpoints
  const axisEndpoints = useMemo(
    () => Array.from({ length: n }, (_, i) => getPoint(i, 1)),
    [],
  );

  // Data point positions
  const dataPointPositions = useMemo(
    () =>
      values.map((v, i) => {
        const clamped = Math.max(0, Math.min(100, v)) / 100;
        return getPoint(i, clamped);
      }),
    [values],
  );

  // Label positions (slightly beyond the axis endpoint)
  const labelPositions = useMemo(
    () =>
      AXES.map((_, i) => {
        const angle = startAngle + i * angleStep;
        const r = maxRadius + 16;
        return {
          x: center + r * Math.cos(angle),
          y: center + r * Math.sin(angle),
        };
      }),
    [],
  );

  return (
    <svg
      width={size + LABEL_PAD_X * 2}
      height={size + LABEL_PAD_Y * 2}
      viewBox={`${-LABEL_PAD_X} ${-LABEL_PAD_Y} ${size + LABEL_PAD_X * 2} ${size + LABEL_PAD_Y * 2}`}
      className="block"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="radarGradientRival" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Concentric rings */}
      {rings.map((pts, i) => (
        <polygon
          key={`ring-${i}`}
          points={pts}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={0.8}
        />
      ))}

      {/* Axis lines */}
      {axisEndpoints.map((ep, i) => (
        <line
          key={`axis-${i}`}
          x1={center}
          y1={center}
          x2={ep.x}
          y2={ep.y}
          stroke="#e5e7eb"
          strokeWidth={0.8}
        />
      ))}

      {/* Rival polygon (drawn first so player sits on top) */}
      {rivalPoints && (
        <motion.polygon
          points={rivalPoints}
          fill="url(#radarGradientRival)"
          stroke="#64748b"
          strokeWidth={1.2}
          strokeDasharray="3 2"
          strokeLinejoin="round"
          initial={false}
          animate={{ points: rivalPoints }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        />
      )}

      {/* Data polygon with animation */}
      <motion.polygon
        points={dataPoints}
        fill="url(#radarGradient)"
        stroke="#f59e0b"
        strokeWidth={1.5}
        strokeLinejoin="round"
        initial={false}
        animate={{ points: dataPoints }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
      />

      {/* Data points */}
      {dataPointPositions.map((p, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={p.x}
          cy={p.y}
          r={3}
          fill={AXES[i].color}
          stroke="#fff"
          strokeWidth={1.5}
          initial={false}
          animate={{ cx: p.x, cy: p.y }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        />
      ))}

      {/* Labels */}
      {AXES.map((axis, i) => {
        const lp = labelPositions[i];
        const anchor =
          Math.abs(lp.x - center) < 2
            ? 'middle'
            : lp.x > center
              ? 'start'
              : 'end';

        return (
          <text
            key={`label-${i}`}
            x={lp.x}
            y={lp.y}
            textAnchor={anchor}
            dominantBaseline="central"
            className="fill-gray-500"
            style={{ fontSize: 10, fontWeight: 500 }}
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
