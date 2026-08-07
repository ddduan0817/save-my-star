'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { sfxEnding, sfxDisaster, sfxClick } from '@/lib/sounds';
import { findEventById } from '@/engine/eventSelector';
import type { StatChange } from '@/types/game';

// 统计关键字段的加权绝对值——作为"决策影响力"的粗排序指标
function decisionImpactScore(sc: StatChange): number {
  return (
    Math.abs(sc.commercialValue ?? 0) * 3 +
    Math.abs(sc.fanLoyalty ?? 0) * 3 +
    Math.abs(sc.prRisk ?? 0) * 3 +
    Math.abs(sc.money ?? 0) / 50000
  );
}

// 把 statChanges 渲染成一行易读的小 chips
function StatChangeChips({ sc }: { sc: StatChange }) {
  const items: { label: string; value: number; positive: boolean }[] = [];
  if (sc.commercialValue) items.push({ label: '商业', value: sc.commercialValue, positive: sc.commercialValue > 0 });
  if (sc.fanLoyalty) items.push({ label: '粉忠', value: sc.fanLoyalty, positive: sc.fanLoyalty > 0 });
  if (sc.prRisk !== undefined && sc.prRisk !== 0) items.push({ label: '风险', value: sc.prRisk, positive: sc.prRisk < 0 });
  if (sc.money) items.push({ label: '资金', value: Math.round(sc.money / 10000), positive: sc.money > 0 });

  if (items.length === 0) return <span className="text-[10px] text-gray-300">无显著影响</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((it, i) => (
        <span
          key={i}
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-md tabular-nums',
            it.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          )}
        >
          {it.label} {it.value > 0 ? '+' : ''}
          {it.value}
          {it.label === '资金' ? '万' : ''}
        </span>
      ))}
    </div>
  );
}

export default function EndingPage() {
  const router = useRouter();
  const ending = useGameStore(s => s.ending);
  const artist = useGameStore(s => s.artist);
  const stats = useGameStore(s => s.stats);
  const currentDay = useGameStore(s => s.currentDay);
  const decisionHistory = useGameStore(s => s.decisionHistory);
  const resetGame = useGameStore(s => s.resetGame);
  const shareRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);
  const [showFullTimeline, setShowFullTimeline] = useState(false);

  // persist 用了 skipHydration，需先在 client 端从 localStorage 回灌存档。
  // 回灌完成前不做"无结局 → 跳首页"判断，否则静态导出的首帧(ending=null)
  // 会在存档恢复前把玩家误踢回首页——表现为"到了结局却没展示就回到初始页"。
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useGameStore.persist.onFinishHydration(() => setHydrated(true));
    useGameStore.persist.rehydrate();
    if (useGameStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  // 按"决策影响力"挑出最关键的 5 个决策——数据驱动取代简单 slice(-5)
  const keyDecisions = useMemo(() => {
    return [...decisionHistory]
      .sort((a, b) => decisionImpactScore(b.statChanges) - decisionImpactScore(a.statChanges))
      .slice(0, 5)
      .sort((a, b) => a.day - b.day);
  }, [decisionHistory]);

  useEffect(() => {
    if (!hydrated) return; // 等存档回灌完成再判断
    if (!ending) {
      router.replace('/');
      return;
    }
    // 全屏揭晓动画后再显示内容
    const isBadEnding = ending.id === 'cancelled' || ending.id === 'fallen' || ending.id === 'scandal_king';
    if (isBadEnding) sfxDisaster();
    else sfxEnding();
    const timer = setTimeout(() => setShowContent(true), 1800);
    return () => clearTimeout(timer);
  }, [hydrated, ending, router]);

  if (!hydrated || !ending || !artist) return null;

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
    common: 'text-amber-800/70 bg-amber-800/15',
    rare: 'text-purple-200 bg-purple-500/20 ring-1 ring-purple-300/30',
    legendary: 'text-amber-200 bg-amber-500/20 ring-1 ring-amber-300/30',
  };

  const isBadEnding = ending.id === 'cancelled' || ending.id === 'fallen' || ending.id === 'scandal_king';

  return (
    <div className="min-h-screen px-4 py-8 relative">
      {/* 全屏揭晓动画 */}
      <AnimatePresence>
        {!showContent && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
            style={{ background: isBadEnding ? '#1a1a2e' : '#f5ebe0' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 背景光效 */}
            <motion.div
              className={cn(
                "absolute w-80 h-80 rounded-full blur-3xl",
                isBadEnding ? "bg-red-900/30" : "bg-amber-200/40"
              )}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <motion.div
              className="text-6xl relative z-10"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.3, 1], rotate: [30, -10, 0] }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
              {ending.emoji}
            </motion.div>
            <motion.div
              className={cn(
                "text-2xl font-black mt-4 relative z-10",
                isBadEnding ? "text-red-400" : "text-amber-900"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {ending.title}
            </motion.div>
            <motion.div
              className={cn(
                "text-sm mt-2 relative z-10",
                isBadEnding ? "text-white/60" : "text-amber-700/70"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {ending.subtitle}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
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
            <span className="text-xl">{artist?.avatar}</span>
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
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] text-gray-300 tracking-wider font-medium">关键决策 · 按影响力排序</div>
                <div className="text-[10px] text-gray-300">共 {decisionHistory.length} 次决策</div>
              </div>
              <div className="space-y-2.5">
                {keyDecisions.map((d, i) => {
                  const event = findEventById(d.eventId);
                  const alternatives = event?.choices.filter(c => c.id !== d.choiceId) ?? [];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.08 }}
                      className="text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-gray-300 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-md text-[10px] tabular-nums">Day {d.day}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-600 font-medium truncate">{d.eventTitle}</div>
                          <div className="text-gray-400 text-[11px] mt-0.5">→ {d.choiceText}</div>
                          <div className="mt-1">
                            <StatChangeChips sc={d.statChanges} />
                          </div>
                          {alternatives.length > 0 && (
                            <div className="mt-1.5 text-[10px] text-gray-300 italic">
                              当时你本可以：{alternatives.map(a => a.text).join('、')}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {decisionHistory.length > keyDecisions.length && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  onClick={() => { sfxClick(); setShowFullTimeline(v => !v); }}
                  className="mt-3 w-full text-[11px] text-gray-400 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {showFullTimeline ? '收起完整时间线 ▴' : `展开完整时间线（${decisionHistory.length} 条）▾`}
                </motion.button>
              )}

              <AnimatePresence>
                {showFullTimeline && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-gray-100/60 space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {decisionHistory.map((d, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px]">
                          <span className="text-gray-300 shrink-0 tabular-nums w-10">D{d.day}</span>
                          <span className="text-gray-500 flex-1 truncate">
                            {d.eventTitle} <span className="text-gray-300">→</span> {d.choiceText}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Branding */}
          <div className="text-center text-[10px] text-gray-200 mt-4 pt-3 border-t border-gray-100/40">
            经纪人模拟器：塌房危机
          </div>
        </div>
      </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        className="mt-6 space-y-3"
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { sfxClick(); handleShare(); }}
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
          onClick={() => { sfxClick(); handlePlayAgain(); }}
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
      </motion.div>
    </div>
  );
}
