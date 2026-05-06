'use client';

import { type SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Flat hand-drawn stroke icons that inherit color from currentColor.
 * Match the landing-page handwritten/sticker aesthetic — no gradients,
 * no iOS-style skeuomorphism. strokeLinecap="round" for a marker feel.
 */

/**
 * 概览 — 小柱状图 + 上升箭头（手绘线条）
 */
export function IconOverview({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* 三根柱子 */}
      <line x1="6" y1="19" x2="6" y2="14" />
      <line x1="12" y1="19" x2="12" y2="10" />
      <line x1="18" y1="19" x2="18" y2="6" />
      {/* 底线 */}
      <line x1="4" y1="20" x2="20" y2="20" opacity="0.55" />
      {/* 上升趋势小线 */}
      <path d="M5 11L12 6L18 4" opacity="0.5" strokeDasharray="2 2" />
    </svg>
  );
}

/**
 * 大粉 — 相机（手绘轮廓 + 镜头 + 快门提示）
 */
export function IconFansite({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* 相机主体 */}
      <path d="M4 8.5C4 7.67 4.67 7 5.5 7H8L9.5 5H14.5L16 7H18.5C19.33 7 20 7.67 20 8.5V17C20 17.83 19.33 18.5 18.5 18.5H5.5C4.67 18.5 4 17.83 4 17V8.5Z" />
      {/* 镜头 */}
      <circle cx="12" cy="13" r="3.2" />
      {/* 小闪光点 */}
      <circle cx="16.5" cy="9.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * 保险 — 盾牌 + 勾（手绘，无渐变）
 */
export function IconInsurance({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* 盾牌 */}
      <path d="M12 3L5 5.5V12C5 16.2 8 19.6 12 21C16 19.6 19 16.2 19 12V5.5L12 3Z" />
      {/* 勾 */}
      <path d="M9 12L11.2 14.2L15 10" opacity="0.9" />
    </svg>
  );
}
