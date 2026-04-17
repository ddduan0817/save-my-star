'use client';

import { type SVGProps } from 'react';

interface TabIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
  size?: number;
}

/**
 * 消息 Tab — 双气泡，active 时橙色渐变
 */
export function IconMessages({ active, size = 26, ...props }: TabIconProps) {
  const id = 'ic-msg';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={`${id}-g`} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FB923C' : '#B0B0B0'} />
          <stop offset="1" stopColor={active ? '#F97316' : '#9CA3AF'} />
        </linearGradient>
      </defs>
      {/* 后方小气泡 */}
      <path
        d="M18 10C18 7.79 19.79 6 22 6H40C42.21 6 44 7.79 44 10V24C44 26.21 42.21 28 40 28H36V33L31 28H22C19.79 28 18 26.21 18 24V10Z"
        fill={`url(#${id}-g)`}
        fillOpacity="0.35"
      />
      {/* 主气泡 */}
      <path
        d="M4 14C4 11.24 6.24 9 9 9H31C33.76 9 36 11.24 36 14V30C36 32.76 33.76 35 31 35H16L9 42V35C6.24 35 4 32.76 4 30V14Z"
        fill={`url(#${id}-g)`}
      />
      {/* 高光 */}
      <path
        d="M4 14C4 11.24 6.24 9 9 9H31C33.76 9 36 11.24 36 14V15.5C36 12.74 33.76 10.5 31 10.5H9C6.24 10.5 4 12.74 4 15.5V14Z"
        fill="white"
        fillOpacity="0.3"
      />
      {/* 三个圆点 */}
      <circle cx="13" cy="22" r="2.2" fill="white" fillOpacity="0.6" />
      <circle cx="20" cy="22" r="2.2" fill="white" fillOpacity="0.6" />
      <circle cx="27" cy="22" r="2.2" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

/**
 * 艺人 Tab — 居中人像 + 小星星，active 时橙色渐变
 */
export function IconArtist({ active, size = 26, ...props }: TabIconProps) {
  const id = 'ic-artist';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={`${id}-g`} x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FB923C' : '#B0B0B0'} />
          <stop offset="1" stopColor={active ? '#EA580C' : '#9CA3AF'} />
        </linearGradient>
      </defs>
      {/* 头 */}
      <circle cx="24" cy="16" r="10" fill={`url(#${id}-g)`} />
      {/* 头顶高光 */}
      <ellipse cx="24" cy="13" rx="6" ry="3" fill="white" fillOpacity="0.2" />
      {/* 身体 */}
      <path
        d="M6 44C6 34.06 14.06 26 24 26C33.94 26 42 34.06 42 44V46H6V44Z"
        fill={`url(#${id}-g)`}
      />
      {/* 身体高光 */}
      <path
        d="M6 44C6 34.06 14.06 26 24 26C33.94 26 42 34.06 42 44V44.5C42 34.56 33.94 27 24 27C14.06 27 6 34.56 6 44.5V44Z"
        fill="white"
        fillOpacity="0.15"
      />
      {/* 小星星 */}
      <path
        d="M39 6L40 9L43 10L40 11L39 14L38 11L35 10L38 9L39 6Z"
        fill={active ? '#FDE68A' : '#D1D5DB'}
      />
    </svg>
  );
}

/**
 * 工作台 Tab — 居中剪贴板 + 小齿轮，active 时橙色渐变
 */
export function IconWorkspace({ active, size = 26, ...props }: TabIconProps) {
  const id = 'ic-ws';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={`${id}-g`} x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FB923C' : '#B0B0B0'} />
          <stop offset="1" stopColor={active ? '#EA580C' : '#9CA3AF'} />
        </linearGradient>
      </defs>
      {/* 剪贴板主体 */}
      <rect x="8" y="10" width="32" height="34" rx="4" fill={`url(#${id}-g)`} />
      {/* 剪贴板夹子 */}
      <rect x="17" y="4" width="14" height="10" rx="4" fill={`url(#${id}-g)`} stroke={active ? '#FED7AA' : '#E5E7EB'} strokeWidth="1.5" />
      {/* 高光 */}
      <rect x="8" y="10" width="32" height="4" rx="4" fill="white" fillOpacity="0.2" />
      {/* 横线装饰 */}
      <rect x="15" y="22" width="18" height="2" rx="1" fill="white" fillOpacity="0.45" />
      <rect x="15" y="28" width="13" height="2" rx="1" fill="white" fillOpacity="0.35" />
      <rect x="15" y="34" width="15" height="2" rx="1" fill="white" fillOpacity="0.25" />
      {/* 小齿轮 */}
      <circle cx="37" cy="38" r="5.5" fill={active ? '#FDE68A' : '#D1D5DB'} />
      <circle cx="37" cy="38" r="2.5" fill={active ? '#EA580C' : '#9CA3AF'} />
    </svg>
  );
}

/**
 * 我的 Tab — 居中头像 + 小皇冠，active 时橙色渐变
 */
export function IconMe({ active, size = 28, ...props }: TabIconProps) {
  const id = 'ic-me';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={`${id}-g`} x1="8" y1="6" x2="40" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FB923C' : '#B0B0B0'} />
          <stop offset="1" stopColor={active ? '#EA580C' : '#9CA3AF'} />
        </linearGradient>
        <linearGradient id={`${id}-crown`} x1="14" y1="0" x2="34" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FDE68A' : '#D1D5DB'} />
          <stop offset="1" stopColor={active ? '#F59E0B' : '#9CA3AF'} />
        </linearGradient>
      </defs>
      {/* 皇冠 */}
      <path
        d="M14 13L18 4L24 11L30 4L34 13H14Z"
        fill={`url(#${id}-crown)`}
      />
      <rect x="14" y="11" width="20" height="3" rx="1" fill={`url(#${id}-crown)`} />
      {/* 头 */}
      <circle cx="24" cy="24" r="9" fill={`url(#${id}-g)`} />
      {/* 身体 */}
      <path
        d="M8 48C8 40 14.27 34 22 34H26C33.73 34 40 40 40 48H8Z"
        fill={`url(#${id}-g)`}
      />
    </svg>
  );
}
