'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { artists } from '@/data/artists';
import ArtistSelector from '@/components/landing/ArtistSelector';
import type { ArtistArchetype } from '@/types/game';

const marqueeItems = [
  '#塌房预警#', '#经纪人辛酸日常#', '#今天又上热搜了#',
  '#粉丝内战升级#', '#品牌方紧急声明#', '#深夜道歉信#',
  '#AI换脸#', '#恋情实锤？#', '#全网封杀倒计时#',
  '#经纪人崩溃瞬间#', '#偶像人设崩塌#', '#紧急公关中#',
];

export default function HomePage() {
  const router = useRouter();
  const startGame = useGameStore(s => s.startGame);

  const handleSelect = (id: string) => {
    startGame(id as ArtistArchetype);
    router.push('/game');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section - Dark dramatic header */}
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-[var(--bg-primary)] pt-10 pb-12 px-4">
        {/* Ambient light effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-orange-500/8 rounded-full blur-2xl" />
          <div className="absolute top-5 right-1/4 w-28 h-28 bg-purple-500/8 rounded-full blur-2xl" />
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="relative text-center mb-6"
        >
          <h1 className="text-4xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            经纪人模拟器
          </h1>
          <motion.div
            className="text-2xl font-black text-red-500 animate-text-glow-red"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            塌房危机
          </motion.div>
        </motion.div>

        {/* Scrolling marquee - hot search bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative mb-6 -mx-4 overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-gray-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-gray-900 to-transparent z-10" />
          <div className="flex animate-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center mx-2 px-3 py-1 rounded-full text-[11px] font-medium bg-white/8 text-gray-400 border border-white/5"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Message bubble intro */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          className="relative max-w-xs mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">🔥</span>
              <span className="text-[11px] font-semibold text-red-400">紧急消息</span>
              <span className="text-[10px] text-gray-500 ml-auto">刚刚</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              你的艺人刚刚上了热搜。<br/>
              不是好的那种。<br/>
              <span className="text-gray-500">你能撑过20天吗？</span>
            </p>
          </div>
          {/* Bubble tail */}
          <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-white/10 border-l border-b border-white/10 transform rotate-[-35deg] skew-x-[10deg]" />
        </motion.div>
      </div>

      {/* Artist selection */}
      <div className="px-4 pb-6 flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-xs text-gray-300 text-center mb-4 mt-2 tracking-wider font-medium">
            选择你要带的艺人
          </div>
          <ArtistSelector artists={artists} onSelect={handleSelect} />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-6 pb-4 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/collection')}
            className="text-xs text-gray-300 hover:text-gray-600 transition-colors duration-300 font-medium px-4 py-2 rounded-full hover:bg-gray-100/50"
          >
            查看结局图鉴
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
