'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { artists } from '@/data/artists';
import ArtistSelector from '@/components/landing/ArtistSelector';
import type { ArtistArchetype } from '@/types/game';

export default function HomePage() {
  const router = useRouter();
  const startGame = useGameStore(s => s.startGame);

  const handleSelect = (id: string) => {
    startGame(id as ArtistArchetype);
    router.push('/game');
  };

  return (
    <div className="px-4 py-8 min-h-screen flex flex-col">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-5xl mb-3"
        >
          🎭
        </motion.div>
        <h1 className="text-2xl font-black tracking-tight mb-1">
          经纪人模拟器
        </h1>
        <div className="text-red-400 text-sm font-bold mb-3">塌房危机</div>
        <p className="text-xs text-[#8888aa] leading-relaxed max-w-xs mx-auto">
          你是一名娱乐经纪人。你的艺人每天都在塌房的边缘疯狂试探。
          <br />
          你能撑过30天吗？
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3 }}
        className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-6"
      />

      {/* Artist selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <div className="text-xs text-[#8888aa] text-center mb-4 tracking-wider">
          选择你要带的艺人
        </div>
        <ArtistSelector artists={artists} onSelect={handleSelect} />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-auto pt-6 text-center"
      >
        <button
          onClick={() => router.push('/collection')}
          className="text-xs text-[#8888aa] hover:text-white transition-colors"
        >
          📚 查看结局图鉴
        </button>
      </motion.div>
    </div>
  );
}
