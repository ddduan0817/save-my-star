'use client';

import { type SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Hand-drawn stroke icons for the 5 insurance products.
 * currentColor driven; the host card supplies the background tint.
 */

const defaults = {
  fill: 'none',
  stroke: 'currentColor' as const,
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** 恋情险 — heart with crack */
export function IconInsuranceRelationship({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M16 26C16 26 6 20.5 6 13C6 9.7 8.7 7 12 7C13.7 7 15.2 7.7 16 9C16.8 7.7 18.3 7 20 7C23.3 7 26 9.7 26 13C26 20.5 16 26 16 26Z" fill="currentColor" fillOpacity="0.15" />
      {/* lightning crack */}
      <path d="M14 11L17 15L13 18L17 22" strokeWidth="2" stroke="currentColor" />
    </svg>
  );
}

/** 税务险 — document with stamp */
export function IconInsuranceTax({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      {/* doc */}
      <path d="M9 5H19L23 9V25C23 25.55 22.55 26 22 26H9C8.45 26 8 25.55 8 25V6C8 5.45 8.45 5 9 5Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M19 5V9H23" />
      {/* lines */}
      <line x1="11" y1="13" x2="20" y2="13" opacity="0.6" />
      <line x1="11" y1="16.5" x2="18" y2="16.5" opacity="0.6" />
      {/* stamp circle */}
      <circle cx="19" cy="21" r="3" strokeDasharray="2 1" />
    </svg>
  );
}

/** 言论险 — speech bubble with exclamation */
export function IconInsuranceSpeech({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M5 9C5 7.9 5.9 7 7 7H25C26.1 7 27 7.9 27 9V19C27 20.1 26.1 21 25 21H13L8 26V21H7C5.9 21 5 20.1 5 19V9Z" fill="currentColor" fillOpacity="0.12" />
      {/* exclamation */}
      <line x1="16" y1="11" x2="16" y2="15.5" strokeWidth="2.2" />
      <circle cx="16" cy="17.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 行为险 — theater mask */
export function IconInsuranceBehavior({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M8 8C8 8 10 6 16 6C22 6 24 8 24 8C24 14 22 22 16 26C10 22 8 14 8 8Z" fill="currentColor" fillOpacity="0.12" />
      {/* eyes (one happy, one sad — drama mask) */}
      <path d="M11.5 13.5C12 12.5 13 12.5 13.5 13.5" />
      <path d="M18.5 13.5C19 14.5 20 14.5 20.5 13.5" />
      {/* mouth */}
      <path d="M13 19C14.5 18 17.5 18 19 19" />
    </svg>
  );
}

/** 综合险 — shield with star */
export function IconInsuranceComprehensive({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...defaults} {...props}>
      <path d="M16 4L7 7V15.5C7 21 10.5 25.6 16 27.5C21.5 25.6 25 21 25 15.5V7L16 4Z" fill="currentColor" fillOpacity="0.15" />
      {/* star */}
      <path d="M16 11L17.4 14.2L20.8 14.5L18.3 16.8L19 20.2L16 18.5L13 20.2L13.7 16.8L11.2 14.5L14.6 14.2Z" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}

export const insuranceIconMap: Record<string, (props: IconProps) => React.JSX.Element> = {
  relationship: IconInsuranceRelationship,
  tax: IconInsuranceTax,
  speech: IconInsuranceSpeech,
  behavior: IconInsuranceBehavior,
  comprehensive: IconInsuranceComprehensive,
};
