'use client';

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
          className="absolute top-[300px] right-[88px] text-[16px] text-[#FF2E2E] rotate-[28deg] pointer-events-none z-20 font-black drop-shadow-[1px_1px_0_rgba(255,255,255,0.9)]"
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

          <div className="mt-3 flex items-center gap-2 text-[12px] text-gray-500">
            <span className="marker-pink font-medium">20 天</span>
            <span>·</span>
            <span>5 个艺人</span>
            <span>·</span>
            <span className="font-medium">13 种结局</span>
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

          {/* Photo area — gradient placeholder, looks like a redacted paparazzi shot */}
          <div className="relative h-[140px] rounded-sm overflow-hidden bg-gradient-to-br from-[#fff5e8] via-[#ffe4c4] to-[#ffc7b5]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#a0764a]/40 to-[#5a3a1f]/30 blur-[6px]" />
            </div>
            <div
              aria-hidden
              className="absolute inset-0 mix-blend-overlay opacity-40"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
              }}
            />
            <span className="absolute bottom-1 right-1.5 text-[9px] font-mono text-white/80 tracking-wider">
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
