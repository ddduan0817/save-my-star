'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';
import { toPng } from 'html-to-image';

export default function EndingPage() {
  const router = useRouter();
  const ending = useGameStore(s => s.ending);
  const artist = useGameStore(s => s.artist);
  const stats = useGameStore(s => s.stats);
  const currentDay = useGameStore(s => s.currentDay);
  const decisionHistory = useGameStore(s => s.decisionHistory);
  const resetGame = useGameStore(s => s.resetGame);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ending) {
      router.replace('/');
    }
  }, [ending, router]);

  if (!ending || !artist) return null;

  const keyDecisions = decisionHistory.slice(-5);

  const handleShare = async () => {
    if (!shareRef.current) return;
    try {
      const dataUrl = await toPng(shareRef.current, {
        pixelRatio: 2,
        backgroundColor: '#faf8f5',
      });
      const link = document.createElement('a');
      link.download = `经纪人模拟器-${ending.title}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Share card generation failed:', err);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    router.push('/');
  };

  const rarityLabel = {
    common: '普通',
    rare: '稀有',
    legendary: '传说',
  };
  const rarityColor = {
    common: 'text-gray-500 bg-gray-100',
    rare: 'text-purple-600 bg-purple-50 ring-1 ring-purple-200/50',
    legendary: 'text-amber-600 bg-amber-50 ring-1 ring-amber-200/50',
  };

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Share card */}
      <div ref={shareRef} className="rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 ring-1 ring-gray-200/40">
        {/* Header gradient */}
        <div className={cn("bg-gradient-to-br p-6 text-center relative overflow-hidden", ending.color)}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            className="text-5xl mb-2 relative z-10"
          >
            {ending.emoji}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            className="text-2xl font-black text-white mb-1 relative z-10"
          >
            {ending.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-white/80 relative z-10"
          >
            {ending.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className={cn(
              "inline-block text-xs px-3 py-1 rounded-full font-semibold mt-2.5 relative z-10",
              rarityColor[ending.rarity]
            )}
          >
            {rarityLabel[ending.rarity]}
          </motion.div>
        </div>

        {/* Content */}
        <div className="bg-white p-5">
          {/* Artist info */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-xl">{artist.avatar}</span>
            <span className="text-sm font-semibold text-gray-800">{artist.name}</span>
            <span className="text-xs text-gray-400">· {artist.title}</span>
            <span className="text-[10px] text-gray-300 ml-auto bg-gray-50 px-2 py-0.5 rounded-full">坚持了 {currentDay} 天</span>
          </div>

          {/* Story */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {ending.description}
          </p>

          {/* Final stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: '商业价值', value: stats.commercialValue, color: 'text-amber-600' },
              { label: '粉丝忠诚', value: stats.fanLoyalty, color: 'text-pink-500' },
              { label: '舆论风险', value: stats.prRisk, color: 'text-red-500' },
              { label: '资金', value: null, money: stats.money, color: stats.money >= 0 ? 'text-green-600' : 'text-red-500' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
              >
                <div className="text-[10px] text-gray-300 mb-1">{stat.label}</div>
                <div className={cn("text-lg font-bold", stat.color)}>
                  {stat.value !== null ? stat.value : `¥${formatMoney(stat.money!)}`}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Key decisions */}
          {keyDecisions.length > 0 && (
            <div className="border-t border-gray-100/60 pt-3">
              <div className="text-[10px] text-gray-300 mb-2 tracking-wider font-medium">关键决策回顾</div>
              <div className="space-y-2">
                {keyDecisions.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.06 }}
                    className="flex items-start gap-2 text-xs"
                  >
                    <span className="text-gray-300 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-md text-[10px]">Day {d.day}</span>
                    <span className="text-gray-500 truncate">{d.eventTitle} → {d.choiceText}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Branding */}
          <div className="text-center text-[10px] text-gray-200 mt-4 pt-3 border-t border-gray-100/40">
            经纪人模拟器：塌房危机
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 space-y-3">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-orange-200/40 hover:shadow-xl hover:shadow-orange-200/60"
        >
          保存分享卡
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePlayAgain}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-sm font-semibold text-gray-600 transition-all duration-300 shadow-sm"
        >
          再来一局
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/collection')}
          className="w-full py-3.5 rounded-2xl ring-1 ring-gray-200/50 text-sm text-gray-400 hover:text-gray-600 hover:ring-gray-300/60 transition-all duration-300"
        >
          查看结局图鉴
        </motion.button>
      </div>
    </div>
  );
}
