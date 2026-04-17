'use client';

import { type SVGProps } from 'react';
import type { ArtistArchetype } from '@/types/game';

interface AvatarProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/* ===== 通用男生剪影（短发） ===== */
function MaleAvatar({ size = 56, color1, color2, ...props }: AvatarProps & { color1: string; color2: string }) {
  const id = `m-${color1.replace('#', '')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={`${id}-g`} x1="20" y1="4" x2="60" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor={color1} />
          <stop offset="1" stopColor={color2} />
        </linearGradient>
      </defs>
      {/* 头 */}
      <circle cx="40" cy="30" r="18" fill={`url(#${id}-g)`} />
      {/* 短发 */}
      <path d="M22 28C22 14 30 6 40 6C50 6 58 14 58 28C58 22 52 12 40 12C28 12 22 22 22 28Z" fill={`url(#${id}-g)`} />
      {/* 身体 */}
      <path d="M14 78C14 64 25 56 40 56C55 56 66 64 66 78H14Z" fill={`url(#${id}-g)`} />
    </svg>
  );
}

/* ===== 通用女生剪影（长发披散） ===== */
function FemaleAvatar({ size = 56, color1, color2, ...props }: AvatarProps & { color1: string; color2: string }) {
  const id = `f-${color1.replace('#', '')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={`${id}-g`} x1="20" y1="4" x2="60" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor={color1} />
          <stop offset="1" stopColor={color2} />
        </linearGradient>
      </defs>
      {/* 长发后层 */}
      <path d="M20 28C18 36 16 48 18 60C19 62 22 62 22 58L21 34C21 30 20 28 20 28Z" fill={`url(#${id}-g)`} />
      <path d="M60 28C62 36 64 48 62 60C61 62 58 62 58 58L59 34C59 30 60 28 60 28Z" fill={`url(#${id}-g)`} />
      {/* 头 */}
      <circle cx="40" cy="30" r="18" fill={`url(#${id}-g)`} />
      {/* 长发覆盖头顶+两侧 */}
      <path d="M22 28C22 14 30 6 40 6C50 6 58 14 58 28C58 22 52 12 40 12C28 12 22 22 22 28Z" fill={`url(#${id}-g)`} />
      <path d="M22 28C20 32 18 42 19 54C19 56 22 56 22 52C22 44 22 34 24 28H22Z" fill={`url(#${id}-g)`} />
      <path d="M58 28C60 32 62 42 61 54C61 56 58 56 58 52C58 44 58 34 56 28H58Z" fill={`url(#${id}-g)`} />
      {/* 身体 */}
      <path d="M14 78C14 64 25 56 40 56C55 56 66 64 66 78H14Z" fill={`url(#${id}-g)`} />
    </svg>
  );
}

/* ===== 四个艺人 ===== */
function AvatarIdol(props: AvatarProps) {
  return <MaleAvatar color1="#FDBA74" color2="#EA580C" {...props} />;
}
function AvatarActor(props: AvatarProps) {
  return <FemaleAvatar color1="#FDBA74" color2="#EA580C" {...props} />;
}
function AvatarSinger(props: AvatarProps) {
  return <MaleAvatar color1="#FDBA74" color2="#EA580C" {...props} />;
}
function AvatarInfluencer(props: AvatarProps) {
  return <FemaleAvatar color1="#FDBA74" color2="#EA580C" {...props} />;
}

export const artistAvatarMap: Record<ArtistArchetype, (props: AvatarProps) => React.JSX.Element> = {
  idol: AvatarIdol,
  actor: AvatarActor,
  singer: AvatarSinger,
  influencer: AvatarInfluencer,
};
