'use client';

import { type SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * 公关团队 — 蓝绿色盾牌 + 勾
 */
export function IconPrTeam({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="pr-g" x1="10" y1="4" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* 盾牌 */}
      <path
        d="M24 4L6 12V24C6 35.05 13.7 43.73 24 46C34.3 43.73 42 35.05 42 24V12L24 4Z"
        fill="url(#pr-g)"
      />
      {/* 高光 */}
      <path
        d="M24 4L6 12V14L24 6L42 14V12L24 4Z"
        fill="white"
        fillOpacity="0.3"
      />
      {/* 勾 */}
      <path
        d="M16 24L22 30L34 18"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 数据分析 — 蓝紫色柱状图
 */
export function IconDataAnalysis({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="da-g1" x1="6" y1="40" x2="6" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="da-g2" x1="18" y1="40" x2="18" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="da-g3" x1="30" y1="40" x2="30" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="da-g4" x1="42" y1="40" x2="42" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      {/* 四根柱子 */}
      <rect x="4" y="20" width="8" height="22" rx="3" fill="url(#da-g1)" />
      <rect x="16" y="12" width="8" height="30" rx="3" fill="url(#da-g2)" />
      <rect x="28" y="24" width="8" height="18" rx="3" fill="url(#da-g3)" />
      <rect x="38" y="8" width="8" height="34" rx="3" fill="url(#da-g4)" />
      {/* 柱子顶部高光 */}
      <rect x="4" y="20" width="8" height="4" rx="3" fill="white" fillOpacity="0.25" />
      <rect x="16" y="12" width="8" height="4" rx="3" fill="white" fillOpacity="0.25" />
      <rect x="28" y="24" width="8" height="4" rx="3" fill="white" fillOpacity="0.25" />
      <rect x="38" y="8" width="8" height="4" rx="3" fill="white" fillOpacity="0.25" />
    </svg>
  );
}

/**
 * 人脉网络 — 暖黄色节点网络
 */
export function IconNetwork({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="nw-g" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {/* 连接线 */}
      <line x1="24" y1="14" x2="12" y2="30" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="14" x2="36" y2="30" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="30" x2="36" y2="30" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="14" x2="40" y2="12" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="30" x2="6" y2="40" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="30" x2="42" y2="40" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
      {/* 中心大节点 */}
      <circle cx="24" cy="14" r="7" fill="url(#nw-g)" />
      <ellipse cx="24" cy="12" rx="4" ry="2" fill="white" fillOpacity="0.25" />
      {/* 左下节点 */}
      <circle cx="12" cy="30" r="6" fill="url(#nw-g)" />
      <ellipse cx="12" cy="28.5" rx="3.5" ry="1.5" fill="white" fillOpacity="0.25" />
      {/* 右下节点 */}
      <circle cx="36" cy="30" r="6" fill="url(#nw-g)" />
      <ellipse cx="36" cy="28.5" rx="3.5" ry="1.5" fill="white" fillOpacity="0.25" />
      {/* 小节点 */}
      <circle cx="40" cy="12" r="3.5" fill="url(#nw-g)" />
      <circle cx="6" cy="40" r="3.5" fill="url(#nw-g)" />
      <circle cx="42" cy="40" r="3.5" fill="url(#nw-g)" />
    </svg>
  );
}

/**
 * 法务部 — 靛蓝色公文包
 */
export function IconLegal({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="lg-g" x1="4" y1="14" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      {/* 提手 */}
      <path
        d="M18 16V12C18 8.69 20.69 6 24 6C27.31 6 30 8.69 30 12V16"
        stroke="url(#lg-g)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 包体 */}
      <rect x="4" y="16" width="40" height="26" rx="5" fill="url(#lg-g)" />
      {/* 高光 */}
      <rect x="4" y="16" width="40" height="5" rx="5" fill="white" fillOpacity="0.2" />
      {/* 中间锁扣 */}
      <rect x="20" y="26" width="8" height="6" rx="2" fill="white" fillOpacity="0.35" />
      <rect x="22" y="28" width="4" height="2" rx="1" fill="#4338CA" fillOpacity="0.6" />
    </svg>
  );
}
