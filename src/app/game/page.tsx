'use client';

import { useEffect } from 'react';
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

  // Redirect if no game started
  useEffect(() => {
    if (gamePhase === 'not_started') {
      router.replace('/');
    }
  }, [gamePhase, router]);

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

  if (gamePhase === 'not_started') return null;

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
