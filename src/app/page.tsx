'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { artists } from '@/data/artists';
import ArtistSelector from '@/components/landing/ArtistSelector';
import type { ArtistArchetype } from '@/types/game';

const heatItems = [
  { tag: '#塌房预警#', heat: '爆' },
  { tag: '#经纪人辛酸日常#', heat: '热' },
  { tag: '#今天又上热搜了#', heat: '沸' },
  { tag: '#粉丝内战升级#', heat: '热' },
  { tag: '#深夜道歉信#', heat: '爆' },
  { tag: '#AI换脸#', heat: '新' },
  { tag: '#恋情实锤？#', heat: '爆' },
  { tag: '#全网封杀倒计时#', heat: '沸' },
];

export default function HomePage() {
  const router = useRouter();
  const startGame = useGameStore(s => s.startGame);

  // 检测「进行中存档」，有则在首页显示"继续上一局"入口。
  // persist 用了 skipHydration，需手动回灌后再读 gamePhase。
  const [saved, setSaved] = useState<{ artistName: string; day: number } | null>(null);
  useEffect(() => {
    const read = () => {
      const s = useGameStore.getState();
      if (s.gamePhase === 'playing' && s.artist) {
        setSaved({ artistName: s.artist.name, day: s.currentDay });
      } else {
        setSaved(null);
      }
    };
    const unsub = useGameStore.persist.onFinishHydration(read);
    useGameStore.persist.rehydrate();
    if (useGameStore.persist.hasHydrated()) read();
    return unsub;
  }, []);

  const handleSelect = (id: string) => {
    startGame(id as ArtistArchetype);
    router.push('/game');
  };

  return (
    <div className="min-h-screen paper-bg overflow-hidden relative">
      {/* Mobile-first container: on desktop, hug the content like Xiaohongshu web */}
      <div className="relative mx-auto w-full max-w-[440px]">

        {/* ===== Decorative doodle stickers — restored to original size & color, just repositioned to corners ===== */}
        <span
          aria-hidden
          className="absolute top-4 left-2 text-[26px] animate-doodle pointer-events-none z-0"
          style={{ ['--rot' as string]: '-12deg' }}
        >
          ✦
        </span>
        <span
          aria-hidden
          className="absolute top-3 right-3 text-[20px] animate-doodle pointer-events-none z-0"
          style={{ ['--rot' as string]: '14deg' }}
        >
          ★
        </span>
        {/* Handwritten "!!!" near the polaroid to dramatize the scandal shot */}
        <span
          aria-hidden
          className="absolute top-[420px] -left-1 text-[16px] text-[#ff2e2e] font-black rotate-[-15deg] pointer-events-none z-20"
        >
          !!!
        </span>
        {/* Arrow doodle — now pointing directly at the central mosaic blob */}
        <span
          aria-hidden
          className="absolute top-[300px] right-[150px] text-[16px] text-[#FF2E2E] rotate-[28deg] pointer-events-none z-20 font-black drop-shadow-[1px_1px_0_rgba(255,255,255,0.9)]"
        >
          ↙ 看这里
        </span>
        {/* Sticky note: "P 过的吧" — anchored to polaroid right side */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
          animate={{ opacity: 1, scale: 1, rotate: 6 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 18 }}
          className="absolute top-[360px] right-0 text-[10px] font-bold text-[#7A4A00] bg-[#FFE9C7] px-2 py-1 shadow-[1px_2px_0_rgba(0,0,0,0.08)] pointer-events-none z-20"
        >
          P过的吧？
        </motion.span>
        {/* Small red urgency badge near hero */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 16 }}
          className="absolute top-[78px] right-3 text-[9px] font-black text-[#FF2E2E] border-2 border-[#FF2E2E] px-1.5 py-0.5 rounded-sm tracking-wider pointer-events-none z-20"
        >
          SCANDAL
        </motion.span>

      {/* ========= Hero ========= */}
      <div className="relative px-5 pt-10 pb-6">

        {/* Title block — handwritten cover */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="relative text-left mb-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">
              SAVE&nbsp;MY&nbsp;STAR
            </span>
            <span className="h-px flex-1 bg-gray-300/60" />
            <span className="text-[10px] text-gray-400 font-medium">第 001 期</span>
          </div>

          <h1 className="font-black leading-[1.05] tracking-tight">
            <span className="block text-[36px] text-gray-900">
              经纪人
              <span className="ml-1 inline-block tilt-right text-gray-900">
                模拟器
              </span>
            </span>
            <span className="block text-[44px] mt-1">
              <span className="rough-underline text-[#FF2E2E]">塌房危机</span>
              <span className="ml-2 ink-stamp text-[12px]">紧急</span>
            </span>
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-gray-500">
            <span className="marker-pink font-medium">20 天</span>
            <span>·</span>
            <span>5 个艺人</span>
            <span>·</span>
            <span className="font-medium">13 种结局</span>
            <span>·</span>
            <span>33 个成就</span>
          </div>

          {/* 一句话玩法说明 —— 让第一次打开的人立刻懂这是什么 */}
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-gray-600">
            你是娱乐圈经纪人。用 <span className="font-semibold text-gray-800">20 天</span>，在
            <span className="font-semibold text-gray-800">钱、商业价值、粉丝、舆论风险</span>之间做取舍，
            帮 TA 别塌房——<span className="marker-yellow font-medium">没有正确答案，只有更糟和更不糟。</span>
          </p>
        </motion.div>

        {/* Polaroid scoop card */}
        <motion.div
          initial={{ opacity: 0, y: 16, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1.2 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 180, damping: 20 }}
          className="relative bg-white p-3 pb-4 mx-1 shadow-[0_8px_22px_-8px_rgba(80,60,30,0.28)]"
        >
          <span
            className="tape-top absolute inset-x-0 top-0 pointer-events-none"
            aria-hidden
          />

          {/* Photo area — 狗仔偷拍现场图（人物面部自带马赛克，维持"未知当事人"悬念） */}
          <div className="relative h-[140px] rounded-sm overflow-hidden bg-[#1a1a2e]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/scoop/paparazzi.png"
              alt="狗仔偷拍现场"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center 42%' }}
              loading="eager"
              draggable={false}
            />
            {/* 底部暗角，让白色贴纸文字更清晰 */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/55 to-transparent"
            />
            <span className="absolute bottom-1 right-1.5 text-[9px] font-mono text-white/90 tracking-wider">
              EXCLUSIVE · 03:47AM
            </span>
            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold tracking-wider">
              马赛克处理
            </div>
          </div>

          {/* Caption */}
          <div className="mt-3 px-1">
            <div className="text-[15px] font-bold text-gray-900 leading-snug">
              你的艺人刚刚上了热搜，
              <span className="text-[#FF2E2E]">不是好的那种。</span>
            </div>
            <div className="mt-1.5 text-[12px] text-gray-500 leading-relaxed">
              凌晨 3 点，工作群已 99+。微博评论区在烧，品牌方在催，
              艺人本人在哭。<span className="marker-yellow font-medium">你能撑过 20 天吗？</span>
            </div>
          </div>
        </motion.div>

        {/* Heat tag pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 -mx-1"
        >
          <div className="flex flex-wrap gap-1.5">
            {heatItems.map((item, i) => (
              <motion.span
                key={i}
                whileHover={{ y: -1, rotate: 0 }}
                className={[
                  'inline-flex items-center gap-1 px-2 py-1 rounded-md',
                  'bg-white/85 ring-1 ring-gray-200/70 text-[10.5px] font-medium text-gray-600',
                  'shadow-[1px_1px_0_rgba(0,0,0,0.04)]',
                  i % 3 === 0 ? '-rotate-[1deg]' : i % 3 === 1 ? 'rotate-[1deg]' : '',
                ].join(' ')}
              >
                <span className={[
                  'text-[9px] font-black px-1 rounded-sm',
                  item.heat === '爆' ? 'bg-[#FF2E2E] text-white'
                    : item.heat === '沸' ? 'bg-[#FF6F2E] text-white'
                    : item.heat === '热' ? 'bg-[#FFB800] text-white'
                    : 'bg-gray-200 text-gray-500',
                ].join(' ')}>
                  {item.heat}
                </span>
                {item.tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ========= Artist selection ========= */}
      <div className="px-5 pb-6">
        {/* 继续上一局 —— 检测到进行中存档时显示 */}
        {saved && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/game')}
            className="w-full mb-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-3.5 shadow-md active:shadow"
          >
            <div className="flex flex-col items-start">
              <span className="text-[15px] font-black">▶ 继续上一局</span>
              <span className="text-[11px] text-white/85 mt-0.5">
                {saved.artistName} · 第 {saved.day} 天
              </span>
            </div>
            <span className="text-[11px] text-white/85">进度已保存 →</span>
          </motion.button>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#FF2E2E] font-black text-base">▶</span>
            <span className="text-[15px] font-black text-gray-900 tracking-tight">
              选一个&nbsp;<span className="marker-pink">"未来塌房当事人"</span>
            </span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5 ml-5">
            点一个艺人即可开始 · <span className="text-gray-400">选错了就重开吧，反正都会塌</span>
          </div>
        </motion.div>

        <ArtistSelector artists={artists} onSelect={handleSelect} />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-8 pb-6 flex flex-col items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.04, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/collection')}
            className="text-[12px] text-gray-700 font-bold px-4 py-2 rounded-full bg-white ring-1 ring-gray-200 shadow-sm hover:shadow"
          >
            <span className="mr-1">📓</span>
            查看结局图鉴
          </motion.button>
          <div className="text-[10px] text-gray-300 tracking-wider">
            made with caffeine &amp; regret
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
