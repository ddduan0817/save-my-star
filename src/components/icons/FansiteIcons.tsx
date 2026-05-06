'use client';

import { type SVGProps } from 'react';
import type { ArtistArchetype } from '@/types/game';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Hand-drawn stroke icons keyed `${artistId}_${fansiteId}` per persona.
 * See src/data/fansites.ts for persona definitions.
 */

const defaults = {
  fill: 'none',
  stroke: 'currentColor' as const,
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* ============ Generic glyphs — reused across artists ============ */

/** 情绪型 · 催营业 — megaphone + heart */
export function IconFansiteMegaphoneHeart({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M5 13L18 7V25L5 19V13Z" fill="currentColor" fillOpacity="0.18" />
      <rect x="18" y="10" width="3" height="12" rx="1" fill="currentColor" fillOpacity="0.25" />
      <path d="M22 13C24 14 24 18 22 19" />
      <path d="M25 22C25 22 22 20.5 22 18.5C22 17.4 22.9 16.5 24 16.5C24.5 16.5 25 16.8 25 17.2C25 16.8 25.5 16.5 26 16.5C27.1 16.5 28 17.4 28 18.5C28 20.5 25 22 25 22Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 拍图技术流 · 相机 + sparkle */
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

/** 拍图 · 红毯狙击手（长焦 + 准星） */
export function IconFansiteTelephoto({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <rect x="5" y="11" width="14" height="10" rx="1" fill="currentColor" fillOpacity="0.1" />
      <rect x="19" y="13" width="8" height="6" rx="1" fill="currentColor" fillOpacity="0.15" />
      <line x1="23" y1="9" x2="23" y2="12" />
      <line x1="23" y1="20" x2="23" y2="23" />
      <line x1="27" y1="16" x2="29" y2="16" />
      <circle cx="23" cy="16" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 战斗粉 · 反黑盾牌 + 剑 */
export function IconFansiteShieldSword({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M16 4L7 7V15.5C7 21 10.5 25.6 16 27.5C21.5 25.6 25 21 25 15.5V7L16 4Z" fill="currentColor" fillOpacity="0.15" />
      <line x1="16" y1="10" x2="16" y2="22" strokeWidth="2.2" />
      <line x1="12.5" y1="14" x2="19.5" y2="14" strokeWidth="2" />
    </svg>
  );
}

/** 内容向 · 书 + 铅笔 */
export function IconFansiteBook({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M5 7C5 6.45 5.45 6 6 6H14V25H6C5.45 25 5 24.55 5 24V7Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M14 6H22C22.55 6 23 6.45 23 7V24C23 24.55 22.55 25 22 25H14V6Z" fill="currentColor" fillOpacity="0.06" />
      <line x1="7.5" y1="11" x2="11.5" y2="11" opacity="0.5" />
      <line x1="7.5" y1="14" x2="11.5" y2="14" opacity="0.5" />
      <line x1="7.5" y1="17" x2="11.5" y2="17" opacity="0.5" />
      <line x1="16" y1="11" x2="20" y2="11" opacity="0.5" />
      <line x1="16" y1="14" x2="20" y2="14" opacity="0.5" />
      <line x1="16" y1="17" x2="20" y2="17" opacity="0.5" />
      {/* pencil */}
      <path d="M23 22L27 18L25 20L29 16" opacity="0" />
      <path d="M24.5 15.5L27.5 18.5L23.5 22.5L20.5 22.5L20.5 19.5Z" fill="currentColor" fillOpacity="0.4" stroke="none" />
    </svg>
  );
}

/** 演技分析 · 剧场双面具 */
export function IconFansiteMasks({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M5 9C5 9 7 7 11 7C15 7 17 9 17 9C17 15 15 22 11 25C7 22 5 15 5 9Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M15 9C15 9 17 7 21 7C25 7 27 9 27 9C27 15 25 22 21 25C17 22 15 15 15 9Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M8.5 13C9 12.2 10 12.2 10.5 13" />
      <path d="M18.5 13C19 13.8 20 13.8 20.5 13" />
      <path d="M9 18C10 17 12 17 13 18" />
      <path d="M19 19C20 20 22 20 23 19" />
    </svg>
  );
}

/** 片场 · 场记板 */
export function IconFansiteClapper({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <rect x="5" y="13" width="22" height="13" rx="1.5" fill="currentColor" fillOpacity="0.08" />
      <path d="M5 13L8 8L13 8.5L10 13Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M10 13L13 8L18 8.5L15 13Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M15 13L18 8L23 8.5L20 13Z" fill="currentColor" fillOpacity="0.18" />
      <line x1="5" y1="13" x2="27" y2="13" />
      <line x1="11" y1="18" x2="21" y2="18" opacity="0.6" />
    </svg>
  );
}

/** 数据组 · 条形图 + 上升箭头 */
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

/** 歌手 · 耳机（现场录音） */
export function IconFansiteHeadphones({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M6 18C6 11.4 10.5 6 16 6C21.5 6 26 11.4 26 18" />
      <rect x="4" y="17" width="5" height="9" rx="2" fill="currentColor" fillOpacity="0.15" />
      <rect x="23" y="17" width="5" height="9" rx="2" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

/** 歌手 · 麦克风 */
export function IconFansiteMic({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <rect x="13" y="5" width="6" height="14" rx="3" fill="currentColor" fillOpacity="0.15" />
      <path d="M9 16C9 19.87 12.13 23 16 23C19.87 23 23 19.87 23 16" />
      <line x1="16" y1="23" x2="16" y2="27" />
      <line x1="13" y1="27" x2="19" y2="27" />
    </svg>
  );
}

/** 歌手 · 均衡器 */
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

/** 网红 · 衣橱 / 购物袋 */
export function IconFansiteBag({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M8 11H24L22.5 26C22.4 26.55 21.96 27 21.4 27H10.6C10.04 27 9.6 26.55 9.5 26L8 11Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 11V8C12 6 13.8 5 16 5C18.2 5 20 6 20 8V11" />
      <path d="M22 7L22.5 8.2L23.7 8.7L22.5 9.2L22 10.4L21.5 9.2L20.3 8.7L21.5 8.2Z" fill="currentColor" stroke="none" opacity="0.8" />
    </svg>
  );
}

/** 网红 · 口红（美妆教程） */
export function IconFansiteLipstick({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <rect x="11" y="15" width="10" height="13" rx="1" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 15L12 9L20 9L20 15" fill="currentColor" fillOpacity="0.35" stroke="currentColor" />
      <path d="M12 9L14 4L18 4L20 9" fill="currentColor" fillOpacity="0.55" stroke="currentColor" />
      <line x1="11" y1="20" x2="21" y2="20" opacity="0.5" />
    </svg>
  );
}

/** 网红 · 扩音器（安利局） */
export function IconFansiteBullhorn({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M4 14L20 7V25L4 18V14Z" fill="currentColor" fillOpacity="0.15" />
      <rect x="20" y="11" width="4" height="10" rx="1" fill="currentColor" fillOpacity="0.3" />
      <path d="M25 13C27 14 27 18 25 19" />
      <path d="M11 22L11 26" opacity="0.6" />
    </svg>
  );
}

/* ============ Composite-keyed map ============ */

export const fansiteIconMap: Record<string, (props: IconProps) => React.JSX.Element> = {
  // 甄帅（偶像）
  idol_fansite_1: IconFansiteMegaphoneHeart, // 甄帅今天营业了吗
  idol_fansite_2: IconFansiteCamera,          // 前线only·帅
  idol_fansite_3: IconFansiteShieldSword,     // 偷心贼_帅版
  idol_fansite_4: IconFansiteBook,            // 每天一个爱上甄帅的理由
  // 郝美丽（演员）
  actor_fansite_1: IconFansiteCamera,         // 美丽·光影手记
  actor_fansite_2: IconFansiteMasks,          // 郝美丽角色研究所
  actor_fansite_3: IconFansiteTelephoto,      // 红毯狙击手
  actor_fansite_4: IconFansiteClapper,        // 美丽不NG
  // 高八度（歌手）
  singer_fansite_1: IconFansiteHeadphones,    // 高八度不插电
  singer_fansite_2: IconFansiteMic,           // 八度的麦克风
  singer_fansite_3: IconFansiteChart,         // 打榜少女
  singer_fansite_4: IconFansiteEqualizer,     // 八度音域探索者
  // 冷冰凝（网红）
  influencer_fansite_1: IconFansiteBag,       // 冰凝的衣橱
  influencer_fansite_2: IconFansiteBullhorn,  // 冷冰凝安利局
  influencer_fansite_3: IconFansiteShieldSword, // 反黑前线
  influencer_fansite_4: IconFansiteLipstick,  // 跟着冰凝学变美
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
