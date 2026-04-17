'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { storyChainDefinitions } from '@/data/chainDefinitions';
import { cn } from '@/lib/utils';

interface ChainProgress {
  id: string;
  title: string;
  emoji: string;
  description: string;
  progress: number;
  total: number;
  isActive: boolean; // 有 pending follow-up 在等待
}

function computeChainProgress(
  eventUsageMap: Record<string, number>,
  pendingFollowUpEventIds: string[],
): ChainProgress[] {
  const results: ChainProgress[] = [];

  for (const chain of storyChainDefinitions) {
    // 统计该链中已触发的事件数
    const played = chain.eventIds.filter(eid => eid in eventUsageMap).length;
    if (played === 0) continue; // 未触发的链不显示

    // 是否有 pending follow-up 属于该链
    const isActive = pendingFollowUpEventIds.some(pid => chain.eventIds.includes(pid));

    results.push({
      id: chain.id,
      title: chain.title,
      emoji: chain.emoji,
      description: chain.description,
      progress: Math.min(played, chain.totalSteps),
      total: chain.totalSteps,
      isActive,
    });
  }

  return results;
}

export default function StoryTracker() {
  const eventUsageMap = useGameStore(s => s.eventUsageMap);
  const pendingFollowUpEventIds = useGameStore(s => s.pendingFollowUpEventIds);

  const chains = computeChainProgress(eventUsageMap, pendingFollowUpEventIds);

  if (chains.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-100/60 shadow-sm"
    >
      <div className="px-4 py-3 border-b border-gray-100/60">
        <span className="text-xs font-medium text-gray-400 tracking-wider">进行中的剧情线</span>
      </div>
      <div className="p-3 space-y-2.5">
        {chains.map(chain => {
          const isComplete = chain.progress >= chain.total;
          const pct = Math.round((chain.progress / chain.total) * 100);

          return (
            <div
              key={chain.id}
              className={cn(
                "px-3 py-2.5 rounded-xl transition-all",
                isComplete ? "bg-gray-50 opacity-60" : "bg-gradient-to-r from-orange-50/50 to-amber-50/50",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{chain.emoji}</span>
                  <span className={cn(
                    "text-xs font-semibold",
                    isComplete ? "text-gray-400" : "text-gray-700",
                  )}>
                    {chain.title}
                  </span>
                  {chain.isActive && !isComplete && (
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded">
                      待续
                    </span>
                  )}
                  {isComplete && (
                    <span className="text-[10px] font-medium text-green-500 bg-green-50 px-1.5 py-0.5 rounded">
                      完结
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 tabular-nums">
                  {chain.progress}/{chain.total}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-1.5 h-1 bg-gray-200/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={cn(
                    "h-full rounded-full",
                    isComplete
                      ? "bg-green-400"
                      : "bg-gradient-to-r from-orange-400 to-amber-400",
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
