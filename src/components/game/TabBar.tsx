'use client';

import { useGameStore } from '@/stores/gameStore';
import type { TabId } from '@/types/game';
import { cn } from '@/lib/utils';
import { sfxClick } from '@/lib/sounds';
import { IconMessages, IconArtist, IconWorkspace, IconMe } from '@/components/icons/TabIcons';

const tabs: { id: TabId; label: string }[] = [
  { id: 'messages', label: '消息' },
  { id: 'artist', label: '艺人' },
  { id: 'workspace', label: '工作台' },
  { id: 'me', label: '我的' },
];

const iconMap: Record<TabId, typeof IconMessages> = {
  messages: IconMessages,
  artist: IconArtist,
  workspace: IconWorkspace,
  me: IconMe,
};

export default function TabBar() {
  const activeTab = useGameStore(s => s.activeTab);
  const setActiveTab = useGameStore(s => s.setActiveTab);
  const messages = useGameStore(s => s.messages);
  const gamePhase = useGameStore(s => s.gamePhase);

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const isLocked = gamePhase === 'processing_message' || gamePhase === 'showing_outcome' || gamePhase === 'showing_twist';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-lg glass-card border-t border-gray-100/60 px-2 py-1 safe-area-bottom">
        <div className="flex">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = iconMap[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (isLocked) return;
                  sfxClick();
                  setActiveTab(tab.id);
                }}
                disabled={isLocked}
                className={cn(
                  "flex-1 flex flex-col items-center py-2 transition-all duration-200 relative",
                  isActive ? "text-orange-500" : "text-gray-400",
                  isLocked && !isActive && "opacity-40",
                )}
              >
                <span className="relative">
                  <Icon active={isActive} size={26} />
                  {tab.id === 'messages' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                      {unreadCount}
                    </span>
                  )}
                </span>
                <span className={cn(
                  "text-[10px] mt-0.5 font-medium",
                  isActive ? "text-orange-500" : "text-gray-400",
                )}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-0.5 rounded-full bg-orange-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
