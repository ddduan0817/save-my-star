'use client';

import { type SVGProps } from 'react';
import type { ArtistArchetype } from '@/types/game';

interface AvatarProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * 甄帅 — 暖橙色，帅气短发男生剪影
 */
function AvatarIdol({ size = 56, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="idol-g" x1="20" y1="4" x2="60" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDBA74" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      {/* 头 */}
      <circle cx="40" cy="28" r="16" fill="url(#idol-g)" />
      {/* 帅气偏分发型 */}
      <path d="M24 24C24 14 30 6 40 6C50 6 56 14 56 24C56 24 54 14 40 14C30 14 26 20 24 24Z" fill="url(#idol-g)" />
      <path d="M24 24C22 20 26 14 32 12L22 26L24 24Z" fill="url(#idol-g)" />
      {/* 身体 */}
      <path d="M16 76C16 62 26 54 40 54C54 54 64 62 64 76H16Z" fill="url(#idol-g)" />
      {/* 星星 */}
      <path d="M62 8L63.5 12.5L68 14L63.5 15.5L62 20L60.5 15.5L56 14L60.5 12.5L62 8Z" fill="#FDE68A" />
    </svg>
  );
}

/**
 * 郝美丽 — 优雅紫色，长发女生剪影
 */
function AvatarActor({ size = 56, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="actor-g" x1="20" y1="4" x2="60" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* 长发后层 */}
      <path d="M18 28C16 36 16 48 20 56C22 58 24 56 24 52L22 32C22 32 20 28 18 28Z" fill="url(#actor-g)" />
      <path d="M62 28C64 36 64 48 60 56C58 58 56 56 56 52L58 32C58 32 60 28 62 28Z" fill="url(#actor-g)" />
      {/* 头 */}
      <circle cx="40" cy="28" r="16" fill="url(#actor-g)" />
      {/* 长发覆盖 */}
      <path d="M22 26C22 14 30 6 40 6C50 6 58 14 58 26C58 26 56 16 40 14C26 16 22 26 22 26Z" fill="url(#actor-g)" />
      <path d="M22 26C20 30 19 40 20 48C20 50 23 50 23 46C23 38 23 30 24 26H22Z" fill="url(#actor-g)" />
      <path d="M58 26C60 30 61 40 60 48C60 50 57 50 57 46C57 38 57 30 56 26H58Z" fill="url(#actor-g)" />
      {/* 身体 */}
      <path d="M16 76C16 62 26 54 40 54C54 54 64 62 64 76H16Z" fill="url(#actor-g)" />
      {/* 耳环 */}
      <circle cx="22" cy="38" r="2.5" fill="#E9D5FF" />
      <circle cx="58" cy="38" r="2.5" fill="#E9D5FF" />
    </svg>
  );
}

/**
 * 高八度 — 酷蓝色，蓬松卷发男生+耳机剪影
 */
function AvatarSinger({ size = 56, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="singer-g" x1="20" y1="4" x2="60" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#93C5FD" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* 头 */}
      <circle cx="40" cy="28" r="16" fill="url(#singer-g)" />
      {/* 蓬松卷发 */}
      <circle cx="24" cy="18" r="8" fill="url(#singer-g)" />
      <circle cx="56" cy="18" r="8" fill="url(#singer-g)" />
      <circle cx="32" cy="10" r="8" fill="url(#singer-g)" />
      <circle cx="48" cy="10" r="8" fill="url(#singer-g)" />
      <circle cx="40" cy="7" r="7" fill="url(#singer-g)" />
      {/* 身体 */}
      <path d="M16 76C16 62 26 54 40 54C54 54 64 62 64 76H16Z" fill="url(#singer-g)" />
      {/* 耳机 */}
      <path d="M18 26C14 26 12 30 12 34C12 38 14 40 18 40" stroke="#BFDBFE" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M62 26C66 26 68 30 68 34C68 38 66 40 62 40" stroke="#BFDBFE" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M18 22H62" stroke="#BFDBFE" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 冷冰凝 — 粉红色，时尚短发女生剪影
 */
function AvatarInfluencer({ size = 56, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="inf-g" x1="20" y1="4" x2="60" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDA4AF" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
      </defs>
      {/* 头 */}
      <circle cx="40" cy="28" r="16" fill="url(#inf-g)" />
      {/* 波波头短发 */}
      <path d="M22 26C22 14 30 6 40 6C50 6 58 14 58 26C58 26 56 14 40 12C26 14 22 26 22 26Z" fill="url(#inf-g)" />
      <path d="M22 26C20 30 19 38 20 44C20 46 23 46 23 42C23 36 23 30 24 26H22Z" fill="url(#inf-g)" />
      <path d="M58 26C60 30 61 38 60 44C60 46 57 46 57 42C57 36 57 30 56 26H58Z" fill="url(#inf-g)" />
      {/* 身体 */}
      <path d="M16 76C16 62 26 54 40 54C54 54 64 62 64 76H16Z" fill="url(#inf-g)" />
      {/* 小爱心 */}
      <path d="M64 10C64 8 66 6 68 8C70 6 72 8 72 10C72 12 68 16 68 16C68 16 64 12 64 10Z" fill="#FECDD3" />
    </svg>
  );
}

/** 根据 artistId 返回对应头像组件 */
export const artistAvatarMap: Record<ArtistArchetype, (props: AvatarProps) => React.JSX.Element> = {
  idol: AvatarIdol,
  actor: AvatarActor,
  singer: AvatarSinger,
  influencer: AvatarInfluencer,
};
