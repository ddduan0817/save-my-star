'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import StatsBar from '@/components/game/StatsBar';
import TabBar from '@/components/game/TabBar';
import EndDayButton from '@/components/game/EndDayButton';
import AchievementToast from '@/components/game/AchievementToast';
import MessagesTab from '@/components/game/tabs/MessagesTab';
import ArtistTab from '@/components/game/tabs/ArtistTab';
import WorkspaceTab from '@/components/game/tabs/WorkspaceTab';
import MeTab from '@/components/game/tabs/MeTab';
import { sfxAchievement } from '@/lib/sounds';

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
      <StatsBar />

      {/* Achievement toast */}
      <AchievementToast
        achievement={pendingAchievement}
        onDismiss={dismissAchievement}
      />

      {/* Tab content */}
      {activeTab === 'messages' && <MessagesTab />}
      {activeTab === 'artist' && <ArtistTab />}
      {activeTab === 'workspace' && <WorkspaceTab />}
      {activeTab === 'me' && <MeTab />}

      {/* Floating end day button */}
      <EndDayButton />

      {/* Bottom tab bar */}
      <TabBar />
    </div>
  );
}
