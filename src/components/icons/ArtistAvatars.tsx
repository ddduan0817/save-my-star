'use client';

import { type SVGProps } from 'react';
import type { ArtistArchetype } from '@/types/game';

interface AvatarProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * 甄帅 — 暖橙色，帅气短发男生，星星装饰
 */
function AvatarIdol({ size = 56, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="idol-skin" x1="28" y1="16" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE0C2" />
          <stop offset="1" stopColor="#FECDA0" />
        </linearGradient>
        <linearGradient id="idol-hair" x1="20" y1="8" x2="56" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A3728" />
          <stop offset="1" stopColor="#2D1F14" />
        </linearGradient>
        <linearGradient id="idol-shirt" x1="20" y1="56" x2="60" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB923C" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      {/* 身体 */}
      <path d="M18 80C18 66 27 58 40 58C53 58 62 66 62 80H18Z" fill="url(#idol-shirt)" />
      <path d="M18 80C18 66 27 58 40 58C53 58 62 66 62 80H18Z" fill="white" fillOpacity="0.1" />
      {/* 脖子 */}
      <rect x="35" y="50" width="10" height="10" rx="3" fill="url(#idol-skin)" />
      {/* 脸 */}
      <ellipse cx="40" cy="36" rx="16" ry="18" fill="url(#idol-skin)" />
      {/* 头发 — 帅气偏分 */}
      <path d="M22 28C22 16 30 8 40 8C50 8 58 16 58 28C58 28 56 18 40 18C28 18 24 24 22 28Z" fill="url(#idol-hair)" />
      <path d="M22 28C22 24 24 20 30 18L20 30L22 28Z" fill="url(#idol-hair)" />
      <path d="M58 28C58 22 52 14 40 12C54 14 58 22 58 28Z" fill="url(#idol-hair)" fillOpacity="0.7" />
      {/* 刘海 */}
      <path d="M26 26C28 20 34 16 42 16C38 18 32 20 28 26H26Z" fill="url(#idol-hair)" />
      {/* 眉毛 */}
      <path d="M30 30C31 29 34 28.5 36 29.5" stroke="#4A3728" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 29.5C46 28.5 49 29 50 30" stroke="#4A3728" strokeWidth="1.5" strokeLinecap="round" />
      {/* 眼睛 */}
      <ellipse cx="34" cy="34" rx="2.5" ry="3" fill="#2D1F14" />
      <ellipse cx="46" cy="34" rx="2.5" ry="3" fill="#2D1F14" />
      <circle cx="33" cy="33" r="1" fill="white" />
      <circle cx="45" cy="33" r="1" fill="white" />
      {/* 微笑 */}
      <path d="M36 42C37.5 44 42.5 44 44 42" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
      {/* 腮红 */}
      <ellipse cx="30" cy="40" rx="3" ry="2" fill="#FDBA74" fillOpacity="0.4" />
      <ellipse cx="50" cy="40" rx="3" ry="2" fill="#FDBA74" fillOpacity="0.4" />
      {/* 星星装饰 */}
      <path d="M64 12L65.5 16L69.5 17L65.5 18L64 22L62.5 18L58.5 17L62.5 16L64 12Z" fill="#FDE68A" />
    </svg>
  );
}

/**
 * 郝美丽 — 粉紫色，精致长发女生，优雅气质
 */
function AvatarActor({ size = 56, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="actor-skin" x1="28" y1="16" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF0E6" />
          <stop offset="1" stopColor="#FFE0CC" />
        </linearGradient>
        <linearGradient id="actor-hair" x1="16" y1="8" x2="60" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D2914" />
          <stop offset="1" stopColor="#1A0F05" />
        </linearGradient>
        <linearGradient id="actor-shirt" x1="20" y1="56" x2="60" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C084FC" />
          <stop offset="1" stopColor="#9333EA" />
        </linearGradient>
      </defs>
      {/* 长发(后层) */}
      <path d="M16 32C16 32 14 52 18 60C20 64 24 58 24 58L20 36C20 36 18 32 16 32Z" fill="url(#actor-hair)" />
      <path d="M64 32C64 32 66 52 62 60C60 64 56 58 56 58L60 36C60 36 62 32 64 32Z" fill="url(#actor-hair)" />
      {/* 身体 */}
      <path d="M18 80C18 66 27 58 40 58C53 58 62 66 62 80H18Z" fill="url(#actor-shirt)" />
      {/* V领 */}
      <path d="M34 58L40 66L46 58" fill="url(#actor-skin)" />
      {/* 脖子 */}
      <rect x="35" y="50" width="10" height="10" rx="3" fill="url(#actor-skin)" />
      {/* 脸 */}
      <ellipse cx="40" cy="36" rx="16" ry="18" fill="url(#actor-skin)" />
      {/* 头发 */}
      <path d="M20 30C20 16 28 8 40 8C52 8 60 16 60 30C60 30 58 20 48 16C38 12 28 18 24 22C20 26 20 30 20 30Z" fill="url(#actor-hair)" />
      {/* 两侧长发 */}
      <path d="M20 30C20 30 18 40 19 50C19 52 22 52 22 48C22 40 22 32 24 28L20 30Z" fill="url(#actor-hair)" />
      <path d="M60 30C60 30 62 40 61 50C61 52 58 52 58 48C58 40 58 32 56 28L60 30Z" fill="url(#actor-hair)" />
      {/* 眉毛 */}
      <path d="M30 30C31.5 28.5 34.5 28 36 29" stroke="#3D2914" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M44 29C45.5 28 48.5 28.5 50 30" stroke="#3D2914" strokeWidth="1.2" strokeLinecap="round" />
      {/* 眼睛 — 大眼睫毛 */}
      <ellipse cx="34" cy="34" rx="3" ry="3.5" fill="#2D1F14" />
      <ellipse cx="46" cy="34" rx="3" ry="3.5" fill="#2D1F14" />
      <circle cx="33" cy="33" r="1.2" fill="white" />
      <circle cx="45" cy="33" r="1.2" fill="white" />
      {/* 睫毛 */}
      <path d="M30 32L29 30" stroke="#2D1F14" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M31 31L30 29.5" stroke="#2D1F14" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M49 31L50 29.5" stroke="#2D1F14" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M50 32L51 30" stroke="#2D1F14" strokeWidth="0.8" strokeLinecap="round" />
      {/* 嘴巴 — 红唇 */}
      <path d="M36 43C37.5 45 42.5 45 44 43" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" />
      {/* 腮红 */}
      <ellipse cx="30" cy="40" rx="3.5" ry="2" fill="#FCA5A5" fillOpacity="0.35" />
      <ellipse cx="50" cy="40" rx="3.5" ry="2" fill="#FCA5A5" fillOpacity="0.35" />
      {/* 耳环 */}
      <circle cx="22" cy="42" r="2" fill="#C084FC" />
      <circle cx="58" cy="42" r="2" fill="#C084FC" />
    </svg>
  );
}

/**
 * 高八度 — 蓝色，酷酷卷发男生，耳机装饰
 */
function AvatarSinger({ size = 56, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="singer-skin" x1="28" y1="16" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDDCB5" />
          <stop offset="1" stopColor="#F5C99A" />
        </linearGradient>
        <linearGradient id="singer-hair" x1="20" y1="4" x2="56" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A1A2E" />
          <stop offset="1" stopColor="#0F0F1A" />
        </linearGradient>
        <linearGradient id="singer-shirt" x1="20" y1="56" x2="60" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* 身体 */}
      <path d="M18 80C18 66 27 58 40 58C53 58 62 66 62 80H18Z" fill="url(#singer-shirt)" />
      {/* 脖子 */}
      <rect x="35" y="50" width="10" height="10" rx="3" fill="url(#singer-skin)" />
      {/* 脸 */}
      <ellipse cx="40" cy="36" rx="16" ry="18" fill="url(#singer-skin)" />
      {/* 头发 — 蓬松微卷 */}
      <path d="M18 28C18 14 28 4 40 4C52 4 62 14 62 28C62 28 60 14 40 12C20 14 18 28 18 28Z" fill="url(#singer-hair)" />
      {/* 蓬松卷发细节 */}
      <circle cx="22" cy="20" r="6" fill="url(#singer-hair)" />
      <circle cx="58" cy="20" r="6" fill="url(#singer-hair)" />
      <circle cx="30" cy="12" r="7" fill="url(#singer-hair)" />
      <circle cx="50" cy="12" r="7" fill="url(#singer-hair)" />
      <circle cx="40" cy="8" r="6" fill="url(#singer-hair)" />
      {/* 眉毛 — 粗犷 */}
      <path d="M29 30C31 28.5 35 28 37 29.5" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
      <path d="M43 29.5C45 28 49 28.5 51 30" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
      {/* 眼睛 — 比较锐利 */}
      <ellipse cx="34" cy="34" rx="2.5" ry="2.5" fill="#1A1A2E" />
      <ellipse cx="46" cy="34" rx="2.5" ry="2.5" fill="#1A1A2E" />
      <circle cx="33.5" cy="33.5" r="0.8" fill="white" />
      <circle cx="45.5" cy="33.5" r="0.8" fill="white" />
      {/* 酷笑 */}
      <path d="M36 43C38 44 42 44 44 43" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
      {/* 耳机 */}
      <path d="M16 30C14 30 12 32 12 36C12 40 14 42 16 42" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M64 30C66 30 68 32 68 36C68 40 66 42 64 42" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M16 26C16 26 12 26 12 30" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M64 26C64 26 68 26 68 30" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M16 26H64" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 * 冷冰凝 — 粉色，时尚短发女生，手机装饰
 */
function AvatarInfluencer({ size = 56, ...props }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="inf-skin" x1="28" y1="16" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF5EE" />
          <stop offset="1" stopColor="#FFE8D6" />
        </linearGradient>
        <linearGradient id="inf-hair" x1="18" y1="4" x2="58" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B2C6F" />
          <stop offset="1" stopColor="#2E1A47" />
        </linearGradient>
        <linearGradient id="inf-shirt" x1="20" y1="56" x2="60" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
      </defs>
      {/* 身体 */}
      <path d="M18 80C18 66 27 58 40 58C53 58 62 66 62 80H18Z" fill="url(#inf-shirt)" />
      {/* 脖子 */}
      <rect x="35" y="50" width="10" height="10" rx="3" fill="url(#inf-skin)" />
      {/* 脸 */}
      <ellipse cx="40" cy="36" rx="15" ry="18" fill="url(#inf-skin)" />
      {/* 头发 — 时尚短发波波头 */}
      <path d="M20 30C20 16 28 6 40 6C52 6 60 16 60 30C60 30 58 16 40 14C22 16 20 30 20 30Z" fill="url(#inf-hair)" />
      {/* 两侧短发到下巴 */}
      <path d="M20 30C18 30 16 36 17 44C17 46 20 46 20 44C20 38 20 32 20 30Z" fill="url(#inf-hair)" />
      <path d="M60 30C62 30 64 36 63 44C63 46 60 46 60 44C60 38 60 32 60 30Z" fill="url(#inf-hair)" />
      {/* 刘海 — 空气刘海 */}
      <path d="M28 24C30 18 36 14 40 14C36 16 32 18 30 24H28Z" fill="url(#inf-hair)" />
      <path d="M34 22C36 16 40 14 44 14C40 16 36 18 34 22Z" fill="url(#inf-hair)" />
      <path d="M40 22C42 16 46 14 50 14C46 16 42 18 40 22Z" fill="url(#inf-hair)" />
      {/* 眉毛 — 精致弯眉 */}
      <path d="M30 30C32 28 35 27.5 37 29" stroke="#3D2914" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M43 29C45 27.5 48 28 50 30" stroke="#3D2914" strokeWidth="1.2" strokeLinecap="round" />
      {/* 眼睛 — 大又亮 */}
      <ellipse cx="34" cy="34" rx="3" ry="3.5" fill="#2E1A47" />
      <ellipse cx="46" cy="34" rx="3" ry="3.5" fill="#2E1A47" />
      <circle cx="33" cy="32.5" r="1.5" fill="white" />
      <circle cx="45" cy="32.5" r="1.5" fill="white" />
      <circle cx="35" cy="34" r="0.6" fill="white" />
      <circle cx="47" cy="34" r="0.6" fill="white" />
      {/* 嘟嘴 */}
      <ellipse cx="40" cy="43" rx="3" ry="2" fill="#FB7185" fillOpacity="0.6" />
      {/* 腮红 */}
      <ellipse cx="29" cy="40" rx="3.5" ry="2" fill="#FCA5A5" fillOpacity="0.4" />
      <ellipse cx="51" cy="40" rx="3.5" ry="2" fill="#FCA5A5" fillOpacity="0.4" />
      {/* 项链 */}
      <circle cx="40" cy="56" r="2" fill="#FDE68A" />
      {/* 小爱心 */}
      <path d="M66 16C66 14 68 12 70 14C72 12 74 14 74 16C74 18 70 22 70 22C70 22 66 18 66 16Z" fill="#FB7185" fillOpacity="0.6" />
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
