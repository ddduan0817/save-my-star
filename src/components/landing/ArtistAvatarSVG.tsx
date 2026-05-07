'use client';

import { motion } from 'framer-motion';
import type { ArtistArchetype } from '@/types/game';

interface ArtistAvatarSVGProps {
  artistId: ArtistArchetype | string;
  size?: number;
  /**
   * When true, the signature prop & face do a subtle continuous wiggle.
   * Pair with parent `whileHover` from framer-motion for an extra punch.
   */
  animate?: boolean;
  className?: string;
}

/**
 * Plan-A flat sticker avatar.
 *
 * Design philosophy:
 * - One unified face shape across all 4 archetypes (oval + 2 dot eyes + 1 mouth curve)
 * - Differentiation comes from a single signature prop + theme color
 * - Color palette is borrowed verbatim from the sticky-note theme in ArtistSelector
 * - Hover: signature prop wiggles, face nudges
 *
 * Signature props:
 *   idol       → microphone   🎤   (流量偶像)
 *   actor      → clapperboard 🎬   (实力派演员)
 *   singer     → headphones   🎧   (唱跳歌手)
 *   influencer → phone        📱   (网红转型)
 */

interface FaceTheme {
  bgFrom: string;
  bgTo: string;
  faceFill: string;
  faceStroke: string;
  cheek: string;
  accent: string; // for signature prop highlight
}

const themes: Record<string, FaceTheme> = {
  idol: {
    bgFrom: '#FFE9C7',
    bgTo: '#FFD580',
    faceFill: '#FFF1DD',
    faceStroke: '#7A4A00',
    cheek: '#FFB18A',
    accent: '#F59E0B',
  },
  actor: {
    bgFrom: '#D9EBFF',
    bgTo: '#A9D0FF',
    faceFill: '#EAF3FF',
    faceStroke: '#0F3F7A',
    cheek: '#FFB18A',
    accent: '#3B82F6',
  },
  singer: {
    bgFrom: '#F4E1FF',
    bgTo: '#D9B6F8',
    faceFill: '#F8ECFF',
    faceStroke: '#5D2A85',
    cheek: '#FFB18A',
    accent: '#8B5CF6',
  },
  influencer: {
    bgFrom: '#FFD9DD',
    bgTo: '#FFA8B2',
    faceFill: '#FFEAEC',
    faceStroke: '#8B1F2E',
    cheek: '#FF8896',
    accent: '#F43F5E',
  },
  socialite: {
    bgFrom: '#F5E9D4',
    bgTo: '#D4B572',
    faceFill: '#FBF4E3',
    faceStroke: '#4A3714',
    cheek: '#E7B07A',
    accent: '#B8883F',
  },
};

// ===== Signature props: each is a small SVG group on the right of the face =====

function MicProp({ accent, stroke }: { accent: string; stroke: string }) {
  // 偶像 — microphone
  return (
    <g>
      {/* mic body */}
      <rect x="68" y="58" width="10" height="16" rx="4" fill={accent} stroke={stroke} strokeWidth="1.6" />
      {/* mic grill lines */}
      <line x1="70" y1="62" x2="76" y2="62" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <line x1="70" y1="65" x2="76" y2="65" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <line x1="70" y1="68" x2="76" y2="68" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      {/* handle */}
      <rect x="71.5" y="74" width="3" height="10" rx="1" fill={stroke} />
      {/* sparkle */}
      <path d="M82 52L83 55L86 56L83 57L82 60L81 57L78 56L81 55Z" fill={accent} opacity="0.7" />
    </g>
  );
}

function ClapperProp({ accent, stroke }: { accent: string; stroke: string }) {
  // 演员 — clapperboard
  return (
    <g>
      {/* board base */}
      <rect x="64" y="64" width="20" height="14" rx="2" fill="#F5F5F5" stroke={stroke} strokeWidth="1.6" />
      {/* clapper top (angled stripes) */}
      <path d="M64 60 L84 60 L84 65 L64 65 Z" fill={accent} stroke={stroke} strokeWidth="1.6" />
      <path d="M68 60 L66 65" stroke="#fff" strokeWidth="1.4" />
      <path d="M73 60 L71 65" stroke="#fff" strokeWidth="1.4" />
      <path d="M78 60 L76 65" stroke="#fff" strokeWidth="1.4" />
      <path d="M83 60 L81 65" stroke="#fff" strokeWidth="1.4" />
      {/* take label */}
      <line x1="68" y1="71" x2="80" y2="71" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
      <line x1="68" y1="74" x2="76" y2="74" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
    </g>
  );
}

function HeadphonesProp({ accent, stroke }: { accent: string; stroke: string }) {
  // 歌手 — headphones (drawn over the head as a band)
  return (
    <g>
      {/* head band arc */}
      <path
        d="M22 38 Q50 14 78 38"
        fill="none"
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* left ear cup */}
      <ellipse cx="22" cy="42" rx="6" ry="8" fill={accent} stroke={stroke} strokeWidth="1.6" />
      <ellipse cx="22" cy="42" rx="3" ry="4" fill={stroke} opacity="0.3" />
      {/* right ear cup */}
      <ellipse cx="78" cy="42" rx="6" ry="8" fill={accent} stroke={stroke} strokeWidth="1.6" />
      <ellipse cx="78" cy="42" rx="3" ry="4" fill={stroke} opacity="0.3" />
      {/* music note floating */}
      <g transform="translate(82, 22)">
        <circle cx="0" cy="6" r="2" fill={accent} />
        <line x1="2" y1="6" x2="2" y2="0" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="2" y1="0" x2="6" y2="-1" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

function PhoneProp({ accent, stroke }: { accent: string; stroke: string }) {
  // 网红 — phone (selfie pose)
  return (
    <g>
      {/* phone body */}
      <rect x="70" y="56" width="11" height="20" rx="2.5" fill={stroke} />
      <rect x="71.2" y="58" width="8.6" height="14" rx="1" fill={accent} opacity="0.85" />
      {/* screen sparkle */}
      <circle cx="75.5" cy="63" r="1.2" fill="#fff" opacity="0.9" />
      {/* heart bubble */}
      <path
        d="M86 50 C86 47, 90 47, 90 50 C90 47, 94 47, 94 50 C94 53, 90 56, 90 56 C90 56, 86 53, 86 50 Z"
        fill={accent}
        opacity="0.8"
      />
    </g>
  );
}

function ChampagneProp({ accent, stroke }: { accent: string; stroke: string }) {
  // 贵公子 — champagne flute
  return (
    <g>
      {/* flute bowl (elongated cone) */}
      <path
        d="M70 54 L80 54 L78 68 Q75 70 72 68 Z"
        fill={accent}
        opacity="0.85"
        stroke={stroke}
        strokeWidth="1.4"
      />
      {/* liquid surface */}
      <ellipse cx="75" cy="55" rx="5" ry="1.1" fill="#fff" opacity="0.55" />
      {/* stem */}
      <line x1="75" y1="70" x2="75" y2="82" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      {/* base */}
      <ellipse cx="75" cy="83" rx="5" ry="1.4" fill={stroke} />
      {/* bubbles */}
      <circle cx="73" cy="60" r="0.9" fill="#fff" opacity="0.9" />
      <circle cx="76" cy="63" r="0.8" fill="#fff" opacity="0.85" />
      <circle cx="74" cy="65" r="0.7" fill="#fff" opacity="0.8" />
      {/* sparkle */}
      <path d="M84 48 L85 50.5 L87.5 51 L85 51.5 L84 54 L83 51.5 L80.5 51 L83 50.5 Z" fill={accent} opacity="0.75" />
    </g>
  );
}

const SIGNATURE_MAP: Record<string, (props: { accent: string; stroke: string }) => JSX.Element> = {
  idol: MicProp,
  actor: ClapperProp,
  singer: HeadphonesProp,
  influencer: PhoneProp,
  socialite: ChampagneProp,
};

export default function ArtistAvatarSVG({
  artistId,
  size = 64,
  animate = true,
  className = '',
}: ArtistAvatarSVGProps) {
  const theme = themes[artistId] || themes.idol;
  const Signature = SIGNATURE_MAP[artistId] || SIGNATURE_MAP.idol;
  const gradId = `avatar-bg-${artistId}`;

  // Slight asymmetric mouth/eye curves per archetype to add personality
  // without breaking the unified flat-sticker style.
  const expressions: Record<string, {
    leftEye: { cx: number; cy: number; rx: number; ry: number };
    rightEye: { cx: number; cy: number; rx: number; ry: number };
    mouth: string; // path d
  }> = {
    idol: {
      leftEye:  { cx: 40, cy: 44, rx: 2.2, ry: 2.6 },
      rightEye: { cx: 56, cy: 44, rx: 2.2, ry: 2.6 },
      mouth: 'M44 54 Q50 58 56 54', // big smile
    },
    actor: {
      leftEye:  { cx: 40, cy: 44, rx: 2, ry: 2.4 },
      rightEye: { cx: 56, cy: 44, rx: 2, ry: 2.4 },
      mouth: 'M44 54 Q50 56.2 56 54', // soft smile
    },
    singer: {
      leftEye:  { cx: 40, cy: 44, rx: 2.4, ry: 1.8 }, // squinting/cool
      rightEye: { cx: 56, cy: 44, rx: 2.4, ry: 1.8 },
      mouth: 'M44 55 Q50 54 56 55', // smirk (almost flat)
    },
    influencer: {
      leftEye:  { cx: 40, cy: 44, rx: 2.4, ry: 2.8 }, // big anime eyes
      rightEye: { cx: 56, cy: 44, rx: 2.4, ry: 2.8 },
      mouth: 'M43.5 54 Q50 58.5 56.5 54', // wider smile
    },
    socialite: {
      leftEye:  { cx: 40, cy: 44, rx: 2, ry: 2.3 },
      rightEye: { cx: 56, cy: 44, rx: 2, ry: 2.3 },
      mouth: 'M44 55 Q50 53.5 56 55', // half-smirk (贵公子式浅笑)
    },
  };
  const exp = expressions[artistId] || expressions.idol;

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={false}
        animate={animate ? { rotate: [-1, 1, -1] } : undefined}
        transition={animate ? { repeat: Infinity, duration: 4, ease: 'easeInOut' } : undefined}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor={theme.bgFrom} />
            <stop offset="100%" stopColor={theme.bgTo} />
          </linearGradient>
        </defs>

        {/* sticker background — slightly rounded square with hand-drawn outline */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="18"
          fill={`url(#${gradId})`}
          stroke={theme.faceStroke}
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />

        {/* face oval */}
        <ellipse
          cx="50"
          cy="48"
          rx="20"
          ry="22"
          fill={theme.faceFill}
          stroke={theme.faceStroke}
          strokeOpacity="0.45"
          strokeWidth="1.6"
        />

        {/* cheeks */}
        <ellipse cx="38" cy="52" rx="3" ry="2" fill={theme.cheek} opacity="0.55" />
        <ellipse cx="62" cy="52" rx="3" ry="2" fill={theme.cheek} opacity="0.55" />

        {/* eyes — flat dots */}
        <ellipse
          cx={exp.leftEye.cx}
          cy={exp.leftEye.cy}
          rx={exp.leftEye.rx}
          ry={exp.leftEye.ry}
          fill={theme.faceStroke}
        />
        <ellipse
          cx={exp.rightEye.cx}
          cy={exp.rightEye.cy}
          rx={exp.rightEye.rx}
          ry={exp.rightEye.ry}
          fill={theme.faceStroke}
        />

        {/* mouth — single curve */}
        <path
          d={exp.mouth}
          stroke={theme.faceStroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* signature prop with subtle wiggle */}
        <motion.g
          initial={false}
          animate={animate ? { rotate: [-3, 3, -3] } : undefined}
          transition={animate ? { repeat: Infinity, duration: 2.6, ease: 'easeInOut' } : undefined}
          style={{ transformOrigin: '74px 70px' }}
        >
          <Signature accent={theme.accent} stroke={theme.faceStroke} />
        </motion.g>
      </motion.svg>
    </div>
  );
}
