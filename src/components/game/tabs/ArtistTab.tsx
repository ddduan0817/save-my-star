'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';
import { scheduleActivities } from '@/data/schedules';
import { sfxClick } from '@/lib/sounds';
import StoryTracker from '@/components/game/StoryTracker';

const moodEmojis = [
  { min: 0, emoji: '😰', label: '焦虑' },
  { min: 20, emoji: '😐', label: '一般' },
  { min: 40, emoji: '🙂', label: '还行' },
  { min: 60, emoji: '😊', label: '开心' },
  { min: 80, emoji: '🤩', label: '超棒' },
];

function getMood(stats: { commercialValue: number; fanLoyalty: number; prRisk: number }) {
  const score = Math.round((stats.commercialValue + stats.fanLoyalty - stats.prRisk) / 2);
  const clamped = Math.max(0, Math.min(100, score));
  let mood = moodEmojis[0];
  for (const m of moodEmojis) {
    if (clamped >= m.min) mood = m;
  }
  return mood;
}

export default function ArtistTab() {
  const artist = useGameStore(s => s.artist);
  const stats = useGameStore(s => s.stats);
  const artistSchedule = useGameStore(s => s.artistSchedule);
  const setArtistSchedule = useGameStore(s => s.setArtistSchedule);
  const decisionHistory = useGameStore(s => s.decisionHistory);

  if (!artist) return null;

  const mood = getMood(stats);
  const isScheduleBusy = artistSchedule && artistSchedule.remainingDays > 0;
  const recentDecisions = decisionHistory.slice(-5).reverse();

  const statBars = [
    { label: '商业价值', value: stats.commercialValue, color: 'bg-amber-400', track: 'bg-amber-100' },
    { label: '粉丝忠诚', value: stats.fanLoyalty, color: 'bg-pink-400', track: 'bg-pink-100' },
    { label: '舆论风险', value: stats.prRisk, color: 'bg-red-400', track: 'bg-red-100' },
  ];

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-24">
      {/* Artist Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-3xl shadow-sm">
            {artist.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">{artist.name}</span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{artist.title}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm">{mood.emoji}</span>
              <span className="text-xs text-gray-400">{mood.label}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400">资金</div>
            <div className={cn("text-sm font-bold", stats.money < 0 ? "text-red-500" : "text-amber-600")}>
              ¥{formatMoney(stats.money)}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 space-y-2.5">
          {statBars.map(bar => (
            <div key={bar.label} className="flex items-center gap-3">
              <span className="text-[10px] text-gray-400 w-12 shrink-0">{bar.label}</span>
              <div className={cn("flex-1 h-2 rounded-full overflow-hidden", bar.track)}>
                <motion.div
                  className={cn("h-full rounded-full", bar.color)}
                  initial={false}
                  animate={{ width: `${bar.value}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                />
              </div>
              <span className="text-[11px] font-bold text-gray-600 w-7 text-right tabular-nums">{bar.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Schedule Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="text-xs font-medium text-gray-400 tracking-wider mb-3">今日行程</div>

        {isScheduleBusy ? (
          <div className="flex items-center gap-3 p-3 bg-orange-50/60 rounded-xl ring-1 ring-orange-100/60">
            <span className="text-2xl">{artistSchedule.activity.emoji}</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800">{artistSchedule.activity.name}</div>
              <div className="text-[10px] text-orange-500 mt-0.5">
                进行中 · 还剩 {artistSchedule.remainingDays} 天
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-xs font-bold text-orange-500">{artistSchedule.remainingDays}天</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {scheduleActivities.map(activity => {
              const changes = Object.entries(activity.statChanges)
                .filter(([, v]) => v !== undefined && v !== 0)
                .map(([k, v]) => {
                  const labels: Record<string, string> = {
                    commercialValue: '商业',
                    fanLoyalty: '粉丝',
                    prRisk: '风险',
                    money: '资金',
                  };
                  const val = k === 'money' ? formatMoney(v as number) : String(v);
                  return `${labels[k] ?? k}${(v as number) > 0 ? '+' : ''}${val}`;
                });

              return (
                <motion.button
                  key={activity.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    sfxClick();
                    setArtistSchedule(activity.id);
                  }}
                  className="text-left p-3 rounded-xl border border-gray-100/60 hover:border-orange-200/60 hover:bg-orange-50/30 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{activity.emoji}</span>
                    <span className="text-xs font-semibold text-gray-700">{activity.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">{activity.durationDays}天 · {changes.join(' ')}</div>
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Recent Activity */}
      {recentDecisions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
        >
          <div className="text-xs font-medium text-gray-400 tracking-wider mb-3">最近动态</div>
          <div className="space-y-2.5">
            {recentDecisions.map((d, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                <div>
                  <div className="text-xs text-gray-600">Day {d.day} · {d.eventTitle}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{d.choiceText}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Story Chain Tracker */}
      <StoryTracker />
    </div>
  );
}
