'use client';

import { type SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/** 光子嫩肤 — 金色闪光 */
export function IconSkincare({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="sk-g" x1="12" y1="4" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path d="M24 2L28 16L42 12L32 24L44 32L28 30L24 46L20 30L4 32L16 24L6 12L20 16L24 2Z" fill="url(#sk-g)" />
      <path d="M24 2L26 16L24 14L22 16L24 2Z" fill="white" fillOpacity="0.4" />
    </svg>
  );
}

/** 水光针 — 蓝绿色注射器 */
export function IconInjection({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="inj-g" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67E8F9" />
          <stop offset="1" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      {/* 针管 */}
      <rect x="18" y="8" width="12" height="28" rx="3" fill="url(#inj-g)" />
      <rect x="18" y="8" width="12" height="5" rx="3" fill="white" fillOpacity="0.25" />
      {/* 推杆 */}
      <rect x="21" y="2" width="6" height="8" rx="2" fill="#0891B2" />
      {/* 液面 */}
      <rect x="20" y="22" width="8" height="12" rx="1" fill="white" fillOpacity="0.3" />
      {/* 针头 */}
      <rect x="22" y="36" width="4" height="8" rx="1" fill="#0891B2" />
      <line x1="24" y1="44" x2="24" y2="47" stroke="#0891B2" strokeWidth="1.5" strokeLinecap="round" />
      {/* 刻度线 */}
      <rect x="20" y="14" width="3" height="1" rx="0.5" fill="white" fillOpacity="0.4" />
      <rect x="20" y="18" width="3" height="1" rx="0.5" fill="white" fillOpacity="0.4" />
    </svg>
  );
}

/** 鼻部填充 — 粉色水滴(玻尿酸) */
export function IconNoseFiller({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="nf-g" x1="12" y1="4" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9A8D4" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {/* 水滴 */}
      <path d="M24 4C24 4 10 22 10 30C10 37.73 16.27 44 24 44C31.73 44 38 37.73 38 30C38 22 24 4 24 4Z" fill="url(#nf-g)" />
      {/* 高光 */}
      <ellipse cx="19" cy="28" rx="4" ry="6" fill="white" fillOpacity="0.25" />
    </svg>
  );
}

/** 瘦脸针 — 蓝紫色钻石(精致) */
export function IconJawBotox({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="jb-g" x1="4" y1="8" x2="44" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* 钻石上半 */}
      <path d="M4 18L14 6H34L44 18L24 44L4 18Z" fill="url(#jb-g)" />
      {/* 顶面 */}
      <path d="M4 18L14 6H34L44 18H4Z" fill="white" fillOpacity="0.2" />
      {/* 切面线 */}
      <line x1="14" y1="6" x2="18" y2="18" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="34" y1="6" x2="30" y2="18" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="18" y1="18" x2="24" y2="44" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="30" y1="18" x2="24" y2="44" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
      {/* 高光 */}
      <path d="M14 6L18 18H4L14 6Z" fill="white" fillOpacity="0.15" />
    </svg>
  );
}

/** 双眼皮手术 — 蓝色眼睛 */
export function IconDoubleEyelid({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="eye-g" x1="4" y1="16" x2="44" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* 眼白 */}
      <path d="M4 24C4 24 12 10 24 10C36 10 44 24 44 24C44 24 36 38 24 38C12 38 4 24 4 24Z" fill="white" stroke="url(#eye-g)" strokeWidth="2" />
      {/* 虹膜 */}
      <circle cx="24" cy="24" r="9" fill="url(#eye-g)" />
      {/* 瞳孔 */}
      <circle cx="24" cy="24" r="4" fill="#1E3A5F" />
      {/* 高光 */}
      <circle cx="21" cy="21" r="2.5" fill="white" fillOpacity="0.7" />
      <circle cx="27" cy="22" r="1" fill="white" fillOpacity="0.4" />
      {/* 双眼皮线 */}
      <path d="M8 18C8 18 14 8 24 8C34 8 40 18 40 18" stroke="url(#eye-g)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** 鼻综合整形 — 红色医院十字 */
export function IconNoseJob({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="nj-g" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCA5A5" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
      </defs>
      {/* 圆底 */}
      <circle cx="24" cy="24" r="20" fill="url(#nj-g)" />
      <ellipse cx="24" cy="18" rx="12" ry="6" fill="white" fillOpacity="0.15" />
      {/* 十字 */}
      <rect x="20" y="12" width="8" height="24" rx="2" fill="white" fillOpacity="0.8" />
      <rect x="12" y="20" width="24" height="8" rx="2" fill="white" fillOpacity="0.8" />
    </svg>
  );
}

/** 面部轮廓手术 — 深紫色手术刀 */
export function IconFacialContour({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="fc-g" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      {/* 刀柄 */}
      <rect x="8" y="30" width="24" height="10" rx="3" fill="url(#fc-g)" />
      <rect x="8" y="30" width="24" height="3" rx="3" fill="white" fillOpacity="0.2" />
      {/* 刀身 */}
      <path d="M32 30L44 12L40 10L28 30H32Z" fill="#C4B5FD" />
      {/* 刀刃高光 */}
      <path d="M34 30L44 12L42 11L32 30H34Z" fill="white" fillOpacity="0.3" />
      {/* 金属环 */}
      <rect x="28" y="30" width="4" height="10" rx="1" fill="white" fillOpacity="0.2" />
    </svg>
  );
}

/** 微博编辑 — 蓝色铅笔 */
export function IconWeiboCompose({ size = 22, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="wb-g" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* 笔杆 */}
      <rect x="16" y="4" width="12" height="32" rx="2" fill="url(#wb-g)" transform="rotate(-5 22 20)" />
      <rect x="16" y="4" width="12" height="5" rx="2" fill="white" fillOpacity="0.2" transform="rotate(-5 22 20)" />
      {/* 笔尖 */}
      <path d="M16 36L24 46L28 36" fill="#FBBF24" transform="rotate(-5 22 40)" />
      {/* 笔杆条纹 */}
      <rect x="18" y="28" width="8" height="2" rx="1" fill="white" fillOpacity="0.2" transform="rotate(-5 22 29)" />
    </svg>
  );
}
