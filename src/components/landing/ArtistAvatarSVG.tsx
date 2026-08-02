'use client';

import { motion } from 'framer-motion';
import type { ArtistArchetype } from '@/types/game';

interface ArtistAvatarSVGProps {
  artistId: ArtistArchetype | string;
  size?: number;
  /** 悬停/展示时的轻微浮动动画 */
  animate?: boolean;
  className?: string;
}

/**
 * 艺人头像。使用绘制好的角色立绘（public/artists/<id>.png），
 * 保留各原型的主题色作为加载前底色与描边，维持整体贴纸风的一致性。
 *
 * 接口（artistId/size/animate/className）保持不变，调用方无需改动：
 *   - ArtistSelector（落地页选人卡）
 *   - ArtistTab（游戏内艺人页）
 *
 * 立绘为竖向 3:4，头像位是正方形，用 object-cover + 顶部对齐裁切，
 * 保证人脸（在画面上半部）不被裁掉。
 */

// 各原型主题色（底色 from/to 用于图片加载前的占位、描边点缀）
const themeColor: Record<string, { from: string; to: string; ring: string }> = {
  idol: { from: '#FFE9C7', to: '#FFD580', ring: '#F59E0B' },
  actor: { from: '#D9EBFF', to: '#A9D0FF', ring: '#3B82F6' },
  singer: { from: '#F4E1FF', to: '#D9B6F8', ring: '#8B5CF6' },
  influencer: { from: '#FFD9DD', to: '#FFA8B2', ring: '#F43F5E' },
  socialite: { from: '#F5E9D4', to: '#D4B572', ring: '#B8883F' },
};

export default function ArtistAvatarSVG({
  artistId,
  size = 64,
  animate = true,
  className = '',
}: ArtistAvatarSVGProps) {
  const theme = themeColor[artistId] || themeColor.idol;
  const radius = Math.round(size * 0.28); // 圆角方形，和原贴纸风一致

  return (
    <motion.div
      className={`inline-flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
        boxShadow: `inset 0 0 0 1.5px ${theme.ring}33`,
      }}
      initial={false}
      animate={animate ? { rotate: [-1, 1, -1] } : undefined}
      transition={animate ? { repeat: Infinity, duration: 4, ease: 'easeInOut' } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/artists/${artistId}.png`}
        alt={`${artistId} avatar`}
        width={size}
        height={size}
        loading="lazy"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
        }}
      />
    </motion.div>
  );
}
