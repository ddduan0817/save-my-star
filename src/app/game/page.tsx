'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import StatsBar from '@/components/game/stats/StatsBar';
import ParticleBackground from '@/components/game/shared/ParticleBackground';
import TabBar from '@/components/game/shared/TabBar';
import EndDayButton from '@/components/game/shared/EndDayButton';
import AchievementToast from '@/components/game/overlays/AchievementToast';
import RivalActionNotice from '@/components/game/overlays/RivalActionNotice';
import CosmeticResultModal from '@/components/game/overlays/CosmeticResultModal';
import PhoneCallOverlay from '@/components/game/overlays/PhoneCallOverlay';
import SeasonalIntroModal from '@/components/game/overlays/SeasonalIntroModal';
import LevelUpToast from '@/components/game/overlays/LevelUpToast';
import MessagesTab from '@/components/game/tabs/MessagesTab';
import ArtistTab from '@/components/game/tabs/ArtistTab';
import WorkspaceTab from '@/components/game/tabs/WorkspaceTab';
import MeTab from '@/components/game/tabs/MeTab';
import { sfxAchievement } from '@/lib/sounds';

const tabVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function GamePage() {
  const router = useRouter();
  const gamePhase = useGameStore(s => s.gamePhase);
  const ending = useGameStore(s => s.ending);
  const activeTab = useGameStore(s => s.activeTab);
  const pendingAchievement = useGameStore(s => s.pendingAchievement);
  const dismissAchievement = useGameStore(s => s.dismissAchievement);

  // persist 用了 skipHydration，需在 client 端手动从 localStorage 回灌存档。
  // 回灌完成前不做「无存档 → 跳首页」判断，否则静态导出的首屏(not_started)
  // 会在存档恢复前误跳走，导致刷新丢档。
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useGameStore.persist.onFinishHydration(() => setHydrated(true));
    useGameStore.persist.rehydrate();
    if (useGameStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  // Redirect if no game started (仅在回灌完成后判断)
  useEffect(() => {
    if (hydrated && gamePhase === 'not_started') {
      router.replace('/');
    }
  }, [hydrated, gamePhase, router]);

  // Navigate to ending page when game ends
  useEffect(() => {
    if (gamePhase === 'ended' && ending) {
      router.push('/ending');
    }
  }, [gamePhase, ending, router]);

  // Achievement sound + auto dismiss
  useEffect(() => {
    if (pendingAchievement) {
      sfxAchievement();
      const timer = setTimeout(dismissAchievement, 3500);
      return () => clearTimeout(timer);
    }
  }, [pendingAchievement, dismissAchievement]);

  if (!hydrated || gamePhase === 'not_started') return null;

  return (
    <div className="min-h-screen flex flex-col pb-[56px]">
      <ParticleBackground />
      <StatsBar />

      {/* Achievement toast */}
      <AchievementToast
        achievement={pendingAchievement}
        onDismiss={dismissAchievement}
      />

      {/* Rival action notice */}
      <RivalActionNotice />

      {/* Cosmetic result modal */}
      <CosmeticResultModal />

      {/* Phone call overlay */}
      <PhoneCallOverlay />

      {/* Opening modifier intro (first day after startGame) */}
      <SeasonalIntroModal />

      {/* Manager level-up celebration */}
      <LevelUpToast />

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex-1 flex flex-col"
        >
          {activeTab === 'messages' && <MessagesTab />}
          {activeTab === 'artist' && <ArtistTab />}
          {activeTab === 'workspace' && <WorkspaceTab />}
          {activeTab === 'me' && <MeTab />}
        </motion.div>
      </AnimatePresence>

      {/* Floating end day button */}
      <EndDayButton />

      {/* Bottom tab bar */}
      <TabBar />
    </div>
  );
}
