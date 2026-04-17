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
        backgroundColor: '#0a0a0f',
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
    common: 'text-[#8888aa] border-[#8888aa]/30',
    rare: 'text-purple-400 border-purple-400/30',
    legendary: 'text-amber-400 border-amber-400/30',
  };

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Share card (rendered but also used for screenshot) */}
      <div ref={shareRef} className="rounded-2xl overflow-hidden border border-white/10">
        {/* Header gradient */}
        <div className={cn("bg-gradient-to-br p-6 text-center", ending.color)}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-5xl mb-2"
          >
            {ending.emoji}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-white mb-1"
          >
            {ending.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-white/80"
          >
            {ending.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={cn(
              "inline-block text-xs px-2 py-0.5 rounded-full border mt-2",
              rarityColor[ending.rarity]
            )}
          >
            {rarityLabel[ending.rarity]}
          </motion.div>
        </div>

        {/* Content */}
        <div className="bg-[#141420] p-5">
          {/* Artist info */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{artist.avatar}</span>
            <span className="text-sm font-medium">{artist.name}</span>
            <span className="text-xs text-[#8888aa]">· {artist.title}</span>
            <span className="text-xs text-[#8888aa] ml-auto">坚持了 {currentDay} 天</span>
          </div>

          {/* Story */}
          <p className="text-sm text-[#ccccdd] leading-relaxed mb-4">
            {ending.description}
          </p>

          {/* Final stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: '商业价值', value: stats.commercialValue, color: 'text-amber-400' },
              { label: '粉丝忠诚', value: stats.fanLoyalty, color: 'text-pink-400' },
              { label: '舆论风险', value: stats.prRisk, color: 'text-red-400' },
              { label: '资金', value: null, money: stats.money, color: stats.money >= 0 ? 'text-green-400' : 'text-red-400' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-[10px] text-[#8888aa] mb-1">{stat.label}</div>
                <div className={cn("text-lg font-bold", stat.color)}>
                  {stat.value !== null ? stat.value : `¥${formatMoney(stat.money!)}`}
                </div>
              </div>
            ))}
          </div>

          {/* Key decisions */}
          {keyDecisions.length > 0 && (
            <div className="border-t border-white/5 pt-3">
              <div className="text-[10px] text-[#8888aa] mb-2 tracking-wider">关键决策回顾</div>
              <div className="space-y-1.5">
                {keyDecisions.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-[#8888aa] shrink-0">Day {d.day}</span>
                    <span className="text-white/60 truncate">{d.eventTitle} → {d.choiceText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Branding */}
          <div className="text-center text-[10px] text-[#8888aa]/50 mt-4 pt-3 border-t border-white/5">
            🎭 经纪人模拟器：塌房危机
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 space-y-3">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={handleShare}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm active:scale-[0.98] transition-transform"
        >
          📸 保存分享卡
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={handlePlayAgain}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors active:scale-[0.98]"
        >
          🔄 再来一局
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          onClick={() => router.push('/collection')}
          className="w-full py-3 rounded-xl border border-white/10 text-sm text-[#8888aa] hover:text-white transition-colors active:scale-[0.98]"
        >
          📚 查看结局图鉴
        </motion.button>
      </div>
    </div>
  );
}
