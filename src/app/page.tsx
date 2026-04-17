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
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-black tracking-tight mb-1.5 text-transparent bg-clip-text bg-gradient-to-b from-gray-800 to-gray-600">
          经纪人模拟器
        </h1>
        <motion.div
          className="text-red-500 text-sm font-bold mb-3"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          塌房危机
        </motion.div>
        <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
          你是一名娱乐经纪人。你的艺人每天都在塌房的边缘疯狂试探。
          <br />
          你能撑过20天吗？
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        className="w-28 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent mx-auto mb-6"
      />

      {/* Artist selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <div className="text-xs text-gray-300 text-center mb-4 tracking-wider font-medium">
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
  );
}
