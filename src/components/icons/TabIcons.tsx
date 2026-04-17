'use client';

import { type SVGProps } from 'react';

interface TabIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
  size?: number;
}

/**
 * 消息 Tab — 气泡对话框，active 时橙色渐变，inactive 时灰色
 */
export function IconMessages({ active, size = 26, ...props }: TabIconProps) {
  const id = 'ic-msg';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="6" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FB923C' : '#B0B0B0'} />
          <stop offset="1" stopColor={active ? '#F97316' : '#9CA3AF'} />
        </linearGradient>
        <linearGradient id={`${id}-dot`} x1="14" y1="24" x2="34" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FED7AA' : '#E5E7EB'} />
          <stop offset="1" stopColor={active ? '#FDBA74' : '#D1D5DB'} />
        </linearGradient>
      </defs>
      {/* 主气泡 */}
      <path
        d="M6 12C6 8.68629 8.68629 6 12 6H36C39.3137 6 42 8.68629 42 12V28C42 31.3137 39.3137 34 36 34H20L12 42V34H12C8.68629 34 6 31.3137 6 28V12Z"
        fill={`url(#${id}-g)`}
      />
      {/* 高光 */}
      <path
        d="M6 12C6 8.68629 8.68629 6 12 6H36C39.3137 6 42 8.68629 42 12V14C42 10.6863 39.3137 8 36 8H12C8.68629 8 6 10.6863 6 14V12Z"
        fill="white"
        fillOpacity="0.25"
      />
      {/* 三个圆点 */}
      <circle cx="16" cy="20" r="2.5" fill={`url(#${id}-dot)`} />
      <circle cx="24" cy="20" r="2.5" fill={`url(#${id}-dot)`} />
      <circle cx="32" cy="20" r="2.5" fill={`url(#${id}-dot)`} />
    </svg>
  );
}

/**
 * 艺人 Tab — 星形人像，active 时橙色渐变
 */
export function IconArtist({ active, size = 26, ...props }: TabIconProps) {
  const id = 'ic-artist';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={`${id}-g`} x1="10" y1="4" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FB923C' : '#B0B0B0'} />
          <stop offset="1" stopColor={active ? '#EA580C' : '#9CA3AF'} />
        </linearGradient>
        <linearGradient id={`${id}-star`} x1="28" y1="4" x2="40" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FDE68A' : '#D1D5DB'} />
          <stop offset="1" stopColor={active ? '#FBBF24' : '#B0B0B0'} />
        </linearGradient>
      </defs>
      {/* 头 */}
      <circle cx="22" cy="16" r="9" fill={`url(#${id}-g)`} />
      {/* 头顶高光 */}
      <ellipse cx="22" cy="13" rx="5" ry="3" fill="white" fillOpacity="0.2" />
      {/* 身体 */}
      <path
        d="M8 42C8 34.268 14.268 28 22 28C29.732 28 36 34.268 36 42V44H8V42Z"
        fill={`url(#${id}-g)`}
      />
      {/* 身体高光 */}
      <path
        d="M8 42C8 34.268 14.268 28 22 28C29.732 28 36 34.268 36 42V42.5C36 34.768 29.732 29 22 29C14.268 29 8 34.768 8 42.5V42Z"
        fill="white"
        fillOpacity="0.15"
      />
      {/* 星星 */}
      <path
        d="M38 8L39.5 12.5L44 14L39.5 15.5L38 20L36.5 15.5L32 14L36.5 12.5L38 8Z"
        fill={`url(#${id}-star)`}
      />
    </svg>
  );
}

/**
 * 工作台 Tab — 圆角剪贴板 + 齿轮，active 时橙色渐变
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
        <linearGradient id={`${id}-gear`} x1="30" y1="28" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FDE68A' : '#D1D5DB'} />
          <stop offset="1" stopColor={active ? '#F59E0B' : '#9CA3AF'} />
        </linearGradient>
      </defs>
      {/* 剪贴板主体 */}
      <rect x="8" y="8" width="26" height="34" rx="4" fill={`url(#${id}-g)`} />
      {/* 剪贴板夹子 */}
      <rect x="16" y="4" width="10" height="8" rx="3" fill={`url(#${id}-g)`} stroke={active ? '#FED7AA' : '#E5E7EB'} strokeWidth="1.5" />
      {/* 高光 */}
      <rect x="8" y="8" width="26" height="4" rx="4" fill="white" fillOpacity="0.2" />
      {/* 横线装饰 */}
      <rect x="14" y="18" width="14" height="2" rx="1" fill="white" fillOpacity="0.4" />
      <rect x="14" y="24" width="10" height="2" rx="1" fill="white" fillOpacity="0.3" />
      <rect x="14" y="30" width="12" height="2" rx="1" fill="white" fillOpacity="0.25" />
      {/* 齿轮 */}
      <circle cx="37" cy="37" r="7" fill={`url(#${id}-gear)`} />
      <circle cx="37" cy="37" r="3" fill={active ? '#EA580C' : '#9CA3AF'} />
      {/* 齿轮齿 */}
      {[0, 45, 90, 135].map(angle => (
        <rect
          key={angle}
          x="35.5"
          y="28"
          width="3"
          height="4"
          rx="1"
          fill={`url(#${id}-gear)`}
          transform={`rotate(${angle} 37 37)`}
        />
      ))}
    </svg>
  );
}

/**
 * 我的 Tab — 圆形头像 + 皇冠，active 时橙色渐变
 */
export function IconMe({ active, size = 26, ...props }: TabIconProps) {
  const id = 'ic-me';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={`${id}-g`} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FB923C' : '#B0B0B0'} />
          <stop offset="1" stopColor={active ? '#EA580C' : '#9CA3AF'} />
        </linearGradient>
        <linearGradient id={`${id}-crown`} x1="14" y1="2" x2="34" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor={active ? '#FDE68A' : '#D1D5DB'} />
          <stop offset="1" stopColor={active ? '#F59E0B' : '#9CA3AF'} />
        </linearGradient>
      </defs>
      {/* 皇冠 */}
      <path
        d="M14 16L18 8L24 14L30 8L34 16H14Z"
        fill={`url(#${id}-crown)`}
      />
      {/* 皇冠底座 */}
      <rect x="14" y="14" width="20" height="3" rx="1" fill={`url(#${id}-crown)`} />
      {/* 皇冠宝石 */}
      <circle cx="18" cy="13" r="1.2" fill={active ? '#EA580C' : '#9CA3AF'} />
      <circle cx="24" cy="11" r="1.2" fill={active ? '#EA580C' : '#9CA3AF'} />
      <circle cx="30" cy="13" r="1.2" fill={active ? '#EA580C' : '#9CA3AF'} />
      {/* 头 */}
      <circle cx="24" cy="26" r="7" fill={`url(#${id}-g)`} />
      {/* 头高光 */}
      <ellipse cx="24" cy="24" rx="4" ry="2.5" fill="white" fillOpacity="0.2" />
      {/* 身体 */}
      <path
        d="M12 44C12 38.4772 16.4772 34 22 34H26C31.5228 34 36 38.4772 36 44V46H12V44Z"
        fill={`url(#${id}-g)`}
      />
    </svg>
  );
}
