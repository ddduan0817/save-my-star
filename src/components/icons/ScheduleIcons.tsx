'use client';

import { type SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/** 拍戏 — 红色场记板 */
export function IconFilming({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="film-g" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F87171" />
          <stop offset="1" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      {/* 板体 */}
      <rect x="4" y="16" width="40" height="28" rx="4" fill="url(#film-g)" />
      <rect x="4" y="16" width="40" height="5" rx="4" fill="white" fillOpacity="0.2" />
      {/* 场记板上半部分（黑白条纹拍板） */}
      <path d="M4 16L44 16L44 12C44 10.9 43.1 10 42 10H6C4.9 10 4 10.9 4 12V16Z" fill="url(#film-g)" />
      {/* 条纹 */}
      <rect x="8" y="10" width="4" height="6" fill="white" fillOpacity="0.7" transform="skewX(-10)" />
      <rect x="18" y="10" width="4" height="6" fill="white" fillOpacity="0.7" transform="skewX(-10)" />
      <rect x="28" y="10" width="4" height="6" fill="white" fillOpacity="0.7" transform="skewX(-10)" />
      <rect x="38" y="10" width="4" height="6" fill="white" fillOpacity="0.7" transform="skewX(-10)" />
      {/* 文字线 */}
      <rect x="10" y="24" width="20" height="2" rx="1" fill="white" fillOpacity="0.4" />
      <rect x="10" y="30" width="14" height="2" rx="1" fill="white" fillOpacity="0.3" />
      <rect x="10" y="36" width="16" height="2" rx="1" fill="white" fillOpacity="0.25" />
    </svg>
  );
}

/** 上综艺 — 紫色电视机 */
export function IconVariety({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="tv-g" x1="4" y1="10" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* 天线 */}
      <line x1="18" y1="12" x2="24" y2="4" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="12" x2="24" y2="4" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
      {/* 机身 */}
      <rect x="4" y="12" width="40" height="28" rx="5" fill="url(#tv-g)" />
      <rect x="4" y="12" width="40" height="5" rx="5" fill="white" fillOpacity="0.2" />
      {/* 屏幕 */}
      <rect x="9" y="17" width="24" height="18" rx="2" fill="white" fillOpacity="0.2" />
      {/* 播放三角 */}
      <path d="M17 22L27 27L17 32V22Z" fill="white" fillOpacity="0.5" />
      {/* 右侧旋钮 */}
      <circle cx="39" cy="22" r="2.5" fill="white" fillOpacity="0.4" />
      <circle cx="39" cy="30" r="2.5" fill="white" fillOpacity="0.3" />
      {/* 底座 */}
      <rect x="16" y="40" width="16" height="3" rx="1.5" fill="url(#tv-g)" />
    </svg>
  );
}

/** 接代言 — 粉红色口红/品牌 */
export function IconEndorsement({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="end-g" x1="16" y1="2" x2="32" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
        <linearGradient id="end-body" x1="16" y1="20" x2="32" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCA5A5" />
          <stop offset="1" stopColor="#F87171" />
        </linearGradient>
      </defs>
      {/* 口红头 */}
      <path d="M18 18L24 4L30 18H18Z" fill="url(#end-g)" />
      {/* 口红高光 */}
      <path d="M21 18L24 8L25 18H21Z" fill="white" fillOpacity="0.3" />
      {/* 管身 */}
      <rect x="16" y="18" width="16" height="24" rx="3" fill="url(#end-body)" />
      <rect x="16" y="18" width="16" height="4" rx="3" fill="white" fillOpacity="0.2" />
      {/* 金属环 */}
      <rect x="16" y="26" width="16" height="3" rx="1" fill="white" fillOpacity="0.25" />
    </svg>
  );
}

/** 休息 — 蓝色月亮+星星 */
export function IconRest({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="rest-g" x1="4" y1="4" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#93C5FD" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      {/* 月亮 */}
      <path
        d="M20 6C10.06 6 2 14.06 2 24C2 33.94 10.06 42 20 42C26.08 42 31.44 38.88 34.72 34.16C29.5 35.86 23.64 34.46 19.59 30.41C15.54 26.36 14.14 20.5 15.84 15.28C11.12 18.56 6 23.92 6 30"
        fill="url(#rest-g)"
      />
      {/* 星星 */}
      <path d="M36 8L37.5 12.5L42 14L37.5 15.5L36 20L34.5 15.5L30 14L34.5 12.5L36 8Z" fill="#FDE68A" />
      <path d="M42 24L43 27L46 28L43 29L42 32L41 29L38 28L41 27L42 24Z" fill="#FDE68A" fillOpacity="0.7" />
      <path d="M32 30L33 32.5L35.5 33.5L33 34.5L32 37L31 34.5L28.5 33.5L31 32.5L32 30Z" fill="#FDE68A" fillOpacity="0.5" />
    </svg>
  );
}

/** 训练充电 — 绿色书本 */
export function IconTraining({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="train-g1" x1="4" y1="12" x2="44" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="train-g2" x1="4" y1="8" x2="44" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EE7B7" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* 下面的书 */}
      <rect x="6" y="22" width="36" height="8" rx="2" fill="url(#train-g1)" />
      <rect x="6" y="22" width="36" height="2" rx="2" fill="white" fillOpacity="0.2" />
      {/* 中间的书 */}
      <rect x="8" y="14" width="32" height="8" rx="2" fill="url(#train-g2)" />
      <rect x="8" y="14" width="32" height="2" rx="2" fill="white" fillOpacity="0.2" />
      {/* 上面翻开的书 */}
      <path d="M24 8L8 12V6L24 2V8Z" fill="url(#train-g1)" />
      <path d="M24 8L40 12V6L24 2V8Z" fill="url(#train-g2)" />
      {/* 书脊线 */}
      <line x1="24" y1="2" x2="24" y2="8" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      {/* 底座 */}
      <rect x="4" y="30" width="40" height="8" rx="2" fill="url(#train-g1)" fillOpacity="0.7" />
      <rect x="4" y="30" width="40" height="2" rx="2" fill="white" fillOpacity="0.15" />
      {/* 书页线条 */}
      <rect x="8" y="33" width="12" height="1.5" rx="0.75" fill="white" fillOpacity="0.2" />
      <rect x="8" y="25" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.2" />
    </svg>
  );
}
