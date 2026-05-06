'use client';

import { type SVGProps } from 'react';
import type { ArtistArchetype } from '@/types/game';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Hand-drawn stroke icons keyed per artist persona.
 * `fansiteIconMap` is keyed `${artistId}_${fansiteId}`, matching the
 * per-artist roster in `src/data/fansites.ts`. Use `getFansiteIcon` for
 * a graceful fallback to the idol set.
 */

const defaults = {
  fill: 'none',
  stroke: 'currentColor' as const,
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// ===== Idol set =====

/** 星光不负赶路人 — camera + sparkle (技术流大神) */
export function IconFansiteCamera({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M5 11C5 10.17 5.67 9.5 6.5 9.5H10L11.5 7.5H18.5L20 9.5H25.5C26.33 9.5 27 10.17 27 11V23C27 23.83 26.33 24.5 25.5 24.5H6.5C5.67 24.5 5 23.83 5 23V11Z" />
      <circle cx="16" cy="16.5" r="4" />
      <circle cx="16" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M23 7L23.8 8.8L25.6 9.6L23.8 10.4L23 12.2L22.2 10.4L20.4 9.6L22.2 8.8Z" fill="currentColor" stroke="none" opacity="0.8" />
    </svg>
  );
}

/** 前线的风 — flag + wind swirl (元老级大粉) */
export function IconFansiteFlag({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <line x1="8" y1="5" x2="8" y2="27" />
      <path d="M8 7C10 5.5 13 6 15 7.5C17 9 20 9 22 7.5V15C20 16.5 17 16.5 15 15C13 13.5 10 13 8 14.5V7Z" fill="currentColor" fillOpacity="0.18" />
      <line x1="12" y1="8" x2="12" y2="14" opacity="0.55" />
      <path d="M5 20C7 19 9 19 11 20" opacity="0.6" />
      <path d="M14 22.5C16 21.5 18 21.5 20 22.5" opacity="0.6" />
      <path d="M6 25C8 24 10 24 12 25" opacity="0.6" />
    </svg>
  );
}

/** 熬夜冠军追星人 — crescent moon + small star */
export function IconFansiteMoon({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M22 18C17 20 13 16 15 11C15.5 9.8 16.4 8.8 17.5 8C11.5 8 7 12.5 7 18C7 23.5 11.5 28 17 28C22 28 25.5 24 25.5 19C24.4 19.6 23.2 19.9 22 18Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M10 9L10.5 10.2L11.7 10.7L10.5 11.2L10 12.4L9.5 11.2L8.3 10.7L9.5 10.2Z" fill="currentColor" stroke="none" opacity="0.7" />
      <circle cx="24" cy="11" r="0.8" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  );
}

/** 显微镜女孩 — magnifying glass scanning a document */
export function IconFansiteMagnifier({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M9 7H19L22 10V23C22 23.55 21.55 24 21 24H9C8.45 24 8 23.55 8 23V8C8 7.45 8.45 7 9 7Z" opacity="0.5" />
      <line x1="11" y1="12" x2="17" y2="12" opacity="0.5" />
      <line x1="11" y1="15" x2="15" y2="15" opacity="0.5" />
      <circle cx="18" cy="18" r="5.5" fill="currentColor" fillOpacity="0.08" />
      <line x1="22" y1="22" x2="26" y2="26" strokeWidth="2.4" />
    </svg>
  );
}

// ===== Actor set =====

/** 剧抛脸研究所 — film clapper (slate) */
export function IconFansiteClapper({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <rect x="5" y="13" width="22" height="13" rx="1.5" fill="currentColor" fillOpacity="0.08" />
      <path d="M5 13L8 8L13 8.5L10 13Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M10 13L13 8L18 8.5L15 13Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M15 13L18 8L23 8.5L20 13Z" fill="currentColor" fillOpacity="0.18" />
      <line x1="5" y1="13" x2="27" y2="13" />
      <line x1="11" y1="18" x2="21" y2="18" opacity="0.6" />
      <line x1="11" y1="21.5" x2="18" y2="21.5" opacity="0.6" />
    </svg>
  );
}

/** 场记本子 — clipboard with checklist */
export function IconFansiteClipboard({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <rect x="7" y="6" width="18" height="22" rx="2" fill="currentColor" fillOpacity="0.08" />
      <rect x="12" y="4" width="8" height="4" rx="1" />
      <path d="M11 14L13 16L17 12" />
      <line x1="18" y1="14" x2="22" y2="14" opacity="0.6" />
      <path d="M11 20L13 22L17 18" />
      <line x1="18" y1="20" x2="22" y2="20" opacity="0.6" />
    </svg>
  );
}

/** 红毯生图老兵 — old-school SLR with strap */
export function IconFansiteSLR({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M5 12H8L10 9H22L24 12H27V24H5V12Z" fill="currentColor" fillOpacity="0.1" />
      <circle cx="16" cy="17" r="5" />
      <circle cx="16" cy="17" r="2.4" fill="currentColor" stroke="none" opacity="0.7" />
      <rect x="22" y="13" width="3" height="2" fill="currentColor" stroke="none" />
      {/* strap arcs */}
      <path d="M5 12C3 11 3 9 5 8" opacity="0.5" />
      <path d="M27 12C29 11 29 9 27 8" opacity="0.5" />
    </svg>
  );
}

// ===== Singer set =====

/** 耳机党党魁 — headphones */
export function IconFansiteHeadphones({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M6 18C6 11.4 10.5 6 16 6C21.5 6 26 11.4 26 18" />
      <rect x="4" y="17" width="5" height="9" rx="2" fill="currentColor" fillOpacity="0.15" />
      <rect x="23" y="17" width="5" height="9" rx="2" fill="currentColor" fillOpacity="0.15" />
      <line x1="9" y1="21.5" x2="11" y2="21.5" opacity="0.5" />
      <line x1="21" y1="21.5" x2="23" y2="21.5" opacity="0.5" />
    </svg>
  );
}

/** 现场打榜冠军 — microphone */
export function IconFansiteMic({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <rect x="13" y="5" width="6" height="14" rx="3" fill="currentColor" fillOpacity="0.15" />
      <line x1="14.5" y1="9" x2="17.5" y2="9" opacity="0.5" />
      <line x1="14.5" y1="12" x2="17.5" y2="12" opacity="0.5" />
      <path d="M9 16C9 19.87 12.13 23 16 23C19.87 23 23 19.87 23 16" />
      <line x1="16" y1="23" x2="16" y2="27" />
      <line x1="13" y1="27" x2="19" y2="27" />
    </svg>
  );
}

/** 副歌传教士 — megaphone with notes */
export function IconFansiteMegaphone({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M5 14L18 8V24L5 18V14Z" fill="currentColor" fillOpacity="0.18" />
      <rect x="18" y="11" width="3" height="10" rx="1" fill="currentColor" fillOpacity="0.25" />
      <path d="M22 13C24 14 24 18 22 19" />
      {/* notes */}
      <circle cx="9" cy="22.5" r="1.6" fill="currentColor" stroke="none" />
      <line x1="10.6" y1="22.5" x2="10.6" y2="18" />
      <line x1="10.6" y1="18" x2="13" y2="17" />
    </svg>
  );
}

/** 修音侦探 — equalizer sliders */
export function IconFansiteEqualizer({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <line x1="9" y1="6" x2="9" y2="26" />
      <line x1="16" y1="6" x2="16" y2="26" />
      <line x1="23" y1="6" x2="23" y2="26" />
      <rect x="6.5" y="11" width="5" height="3" rx="1" fill="currentColor" />
      <rect x="13.5" y="18" width="5" height="3" rx="1" fill="currentColor" />
      <rect x="20.5" y="14" width="5" height="3" rx="1" fill="currentColor" />
    </svg>
  );
}

// ===== Influencer set =====

/** 数据搬运中心 — bar chart */
export function IconFansiteChart({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <line x1="6" y1="26" x2="26" y2="26" />
      <rect x="8" y="18" width="3.5" height="8" fill="currentColor" fillOpacity="0.4" />
      <rect x="14" y="13" width="3.5" height="13" fill="currentColor" fillOpacity="0.55" />
      <rect x="20" y="8" width="3.5" height="18" fill="currentColor" fillOpacity="0.7" />
      <path d="M9 16L15 11L21 6" opacity="0.6" />
      <path d="M21 6L21 9 M21 6L18 6" opacity="0.6" />
    </svg>
  );
}

/** 反黑组组长 — shield with sword */
export function IconFansiteShield({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M16 4L7 7V15.5C7 21 10.5 25.6 16 27.5C21.5 25.6 25 21 25 15.5V7L16 4Z" fill="currentColor" fillOpacity="0.15" />
      <line x1="16" y1="11" x2="16" y2="20" strokeWidth="2.2" />
      <line x1="13" y1="14" x2="19" y2="14" strokeWidth="2" />
    </svg>
  );
}

/** 种草小报 — shopping bag with sparkle */
export function IconFansiteBag({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M8 11H24L22.5 26C22.4 26.55 21.96 27 21.4 27H10.6C10.04 27 9.6 26.55 9.5 26L8 11Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 11V8C12 6 13.8 5 16 5C18.2 5 20 6 20 8V11" />
      {/* sparkle */}
      <path d="M22 7L22.5 8.2L23.7 8.7L22.5 9.2L22 10.4L21.5 9.2L20.3 8.7L21.5 8.2Z" fill="currentColor" stroke="none" opacity="0.8" />
    </svg>
  );
}

/**
 * Composite-keyed map: `${artistId}_${fansiteId}` → icon component.
 * Use `getFansiteIcon(artistId, fansiteId)` for a fallback to the idol set.
 */
export const fansiteIconMap: Record<string, (props: IconProps) => React.JSX.Element> = {
  // Idol
  idol_fansite_1: IconFansiteCamera,
  idol_fansite_2: IconFansiteFlag,
  idol_fansite_3: IconFansiteMoon,
  idol_fansite_4: IconFansiteMagnifier,
  // Actor
  actor_fansite_1: IconFansiteClapper,
  actor_fansite_2: IconFansiteClipboard,
  actor_fansite_3: IconFansiteSLR,
  // Singer
  singer_fansite_1: IconFansiteHeadphones,
  singer_fansite_2: IconFansiteMic,
  singer_fansite_3: IconFansiteMegaphone,
  singer_fansite_4: IconFansiteEqualizer,
  // Influencer
  influencer_fansite_1: IconFansiteChart,
  influencer_fansite_2: IconFansiteShield,
  influencer_fansite_3: IconFansiteBag,
};

/** Helper that prefers the per-artist icon and falls back to the idol set. */
export function getFansiteIcon(
  artistId: ArtistArchetype | undefined,
  fansiteId: string,
): ((props: IconProps) => React.JSX.Element) | null {
  if (artistId) {
    const composite = fansiteIconMap[`${artistId}_${fansiteId}`];
    if (composite) return composite;
  }
  return fansiteIconMap[`idol_${fansiteId}`] ?? null;
}
