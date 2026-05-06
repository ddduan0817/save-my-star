'use client';

import { type SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Hand-drawn stroke icons for the 5 initial fansites.
 * currentColor driven — the wrapping circle background supplies hue,
 * the glyph itself inherits text color (slate for contrast).
 */

const defaults = {
  fill: 'none',
  stroke: 'currentColor' as const,
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** 星光不负赶路人 — camera + sparkle (技术流大神) */
export function IconFansiteCamera({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M5 11C5 10.17 5.67 9.5 6.5 9.5H10L11.5 7.5H18.5L20 9.5H25.5C26.33 9.5 27 10.17 27 11V23C27 23.83 26.33 24.5 25.5 24.5H6.5C5.67 24.5 5 23.83 5 23V11Z" />
      <circle cx="16" cy="16.5" r="4" />
      <circle cx="16" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
      {/* sparkle */}
      <path d="M23 7L23.8 8.8L25.6 9.6L23.8 10.4L23 12.2L22.2 10.4L20.4 9.6L22.2 8.8Z" fill="currentColor" stroke="none" opacity="0.8" />
    </svg>
  );
}

/** XX的守护天使 — angel (halo + wings) */
export function IconFansiteAngel({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      {/* halo */}
      <ellipse cx="16" cy="7" rx="5" ry="1.8" />
      {/* head */}
      <circle cx="16" cy="12.5" r="3.2" />
      {/* body */}
      <path d="M11.5 24C11.5 21 13.5 18.5 16 18.5C18.5 18.5 20.5 21 20.5 24" />
      {/* wings */}
      <path d="M11.5 19.5C9 18.5 6.5 19.5 5.5 22C8 22 10 21.5 11.5 20.5" fill="currentColor" fillOpacity="0.15" />
      <path d="M20.5 19.5C23 18.5 25.5 19.5 26.5 22C24 22 22 21.5 20.5 20.5" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

/** 熬夜冠军追星人 — crescent moon + small star */
export function IconFansiteMoon({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M22 18C17 20 13 16 15 11C15.5 9.8 16.4 8.8 17.5 8C11.5 8 7 12.5 7 18C7 23.5 11.5 28 17 28C22 28 25.5 24 25.5 19C24.4 19.6 23.2 19.9 22 18Z" fill="currentColor" fillOpacity="0.15" />
      {/* small stars */}
      <path d="M10 9L10.5 10.2L11.7 10.7L10.5 11.2L10 12.4L9.5 11.2L8.3 10.7L9.5 10.2Z" fill="currentColor" stroke="none" opacity="0.7" />
      <circle cx="24" cy="11" r="0.8" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  );
}

/** 显微镜女孩 — magnifying glass scanning a document */
export function IconFansiteMagnifier({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      {/* document behind */}
      <path d="M9 7H19L22 10V23C22 23.55 21.55 24 21 24H9C8.45 24 8 23.55 8 23V8C8 7.45 8.45 7 9 7Z" opacity="0.5" />
      <line x1="11" y1="12" x2="17" y2="12" opacity="0.5" />
      <line x1="11" y1="15" x2="15" y2="15" opacity="0.5" />
      {/* glass */}
      <circle cx="18" cy="18" r="5.5" fill="currentColor" fillOpacity="0.08" />
      <line x1="22" y1="22" x2="26" y2="26" strokeWidth="2.4" />
    </svg>
  );
}

/** 前线的风 — flag + wind swirl (元老级站姐) */
export function IconFansiteFlag({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      {/* pole */}
      <line x1="8" y1="5" x2="8" y2="27" />
      {/* flag */}
      <path d="M8 7C10 5.5 13 6 15 7.5C17 9 20 9 22 7.5V15C20 16.5 17 16.5 15 15C13 13.5 10 13 8 14.5V7Z" fill="currentColor" fillOpacity="0.18" />
      <line x1="12" y1="8" x2="12" y2="14" opacity="0.55" />
      {/* wind lines */}
      <path d="M5 20C7 19 9 19 11 20" opacity="0.6" />
      <path d="M14 22.5C16 21.5 18 21.5 20 22.5" opacity="0.6" />
      <path d="M6 25C8 24 10 24 12 25" opacity="0.6" />
    </svg>
  );
}

export const fansiteIconMap: Record<string, (props: IconProps) => React.JSX.Element> = {
  fansite_1: IconFansiteCamera,
  fansite_2: IconFansiteAngel,
  fansite_3: IconFansiteMoon,
  fansite_4: IconFansiteMagnifier,
  fansite_5: IconFansiteFlag,
};
