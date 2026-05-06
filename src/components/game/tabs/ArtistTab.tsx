'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';
import { scheduleActivities } from '@/data/schedules';
import { sfxClick } from '@/lib/sounds';
import StoryTracker from '@/components/game/StoryTracker';
import WeiboCompose from '@/components/game/WeiboCompose';
import StatsRadar from '@/components/game/StatsRadar';
import { getAppearanceTier } from '@/engine/cosmeticEngine';
import { cosmeticProcedures } from '@/data/cosmetics';
import type { CosmeticCategory } from '@/types/game';
import { scheduleIconMap, cosmeticIconMap } from '@/components/icons';
import ArtistAvatarSVG from '@/components/landing/ArtistAvatarSVG';
import { getMentalStateLabel } from '@/types/new_systems';

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
  const cosmeticState = useGameStore(s => s.cosmeticState);
  const performProcedure = useGameStore(s => s.performProcedure);
  const mentalState = useGameStore(s => s.mentalState);
  const rival = useGameStore(s => s.rival);

  if (!artist) return null;

  const mentalLabels = getMentalStateLabel(mentalState);

  const mood = getMood(stats);
  const isScheduleBusy = artistSchedule && artistSchedule.remainingDays > 0;
  const isRecovering = cosmeticState.recoveryDaysRemaining > 0;
  const recentDecisions = decisionHistory.slice(-5).reverse();
  const appearanceTier = getAppearanceTier(cosmeticState.appearance);

  const CATEGORY_LABELS: Record<CosmeticCategory, { label: string; color: string }> = {
    light: { label: '轻度', color: 'text-green-500' },
    medium: { label: '中度', color: 'text-amber-500' },
    major: { label: '大型', color: 'text-red-500' },
  };

  const statBars = [
    { label: '商业价值', value: stats.commercialValue, color: 'bg-amber-400', track: 'bg-amber-100' },
    { label: '粉丝忠诚', value: stats.fanLoyalty, color: 'bg-pink-400', track: 'bg-pink-100' },
    { label: '舆论风险', value: stats.prRisk, color: 'bg-red-400', track: 'bg-red-100' },
    { label: '外貌颜值', value: cosmeticState.appearance, color: 'bg-purple-400', track: 'bg-purple-100' },
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
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm shrink-0">
            <ArtistAvatarSVG artistId={artist.id} size={64} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">{artist.name}</span>
              <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{artist.title}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">心情</span>
              <span className="text-xs font-medium text-gray-500">{mood.label}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-gray-400">资金</div>
            <div className={cn("text-sm font-bold", stats.money < 0 ? "text-red-500" : "text-amber-600")}>
              ¥{formatMoney(stats.money)}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 space-y-2.5">
          {statBars.map(bar => (
            <div key={bar.label} className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 w-12 shrink-0">{bar.label}</span>
              <div className={cn("flex-1 h-2 rounded-full overflow-hidden", bar.track)}>
                <motion.div
                  className={cn("h-full rounded-full", bar.color)}
                  initial={false}
                  animate={{ width: `${bar.value}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                />
              </div>
              <span className="text-xs font-bold text-gray-600 w-7 text-right tabular-nums">{bar.value}</span>
            </div>
          ))}
        </div>

        {/* Appearance tier & cosmetic badges */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 ring-1 ring-purple-100/60", appearanceTier.color)}>
            {appearanceTier.label}
          </span>
          {cosmeticState.stiffFaceActive && (
            <span className="text-[11px] font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full ring-1 ring-orange-100/60">
              😶 僵脸中 ({cosmeticState.stiffFaceDaysRemaining}天)
            </span>
          )}
          {isRecovering && (
            <span className="text-[11px] font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full ring-1 ring-blue-100/60">
              🏥 术后恢复 ({cosmeticState.recoveryDaysRemaining}天)
            </span>
          )}
        </div>
      </motion.div>

      {/* Stats Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium text-gray-400 tracking-wider">对位分析</div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-gray-600 font-medium">{artist.name}</span>
            </span>
            {rival && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-gray-500">{rival.name}</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <StatsRadar
            commercialValue={stats.commercialValue}
            fanLoyalty={stats.fanLoyalty}
            prRisk={stats.prRisk}
            appearance={cosmeticState.appearance}
            rival={rival ? {
              commercialValue: rival.stats.commercialValue,
              fanLoyalty: rival.stats.fanLoyalty,
              prRisk: rival.stats.prRisk,
              appearance: rival.stats.appearance,
            } : undefined}
            size={200}
          />
        </div>
        {rival && (() => {
          const diffs = [
            { label: '商业', mine: stats.commercialValue,        theirs: rival.stats.commercialValue },
            { label: '粉丝', mine: stats.fanLoyalty,              theirs: rival.stats.fanLoyalty },
            { label: '舆情', mine: 100 - stats.prRisk,            theirs: 100 - rival.stats.prRisk }, // 风险越低越好
            { label: '颜值', mine: cosmeticState.appearance,      theirs: rival.stats.appearance },
          ];
          const lead = diffs.filter(d => d.mine > d.theirs).length;
          const trail = diffs.filter(d => d.mine < d.theirs).length;
          const summary = lead > trail
            ? `领先 ${lead} 项，${trail > 0 ? `${diffs.filter(d => d.mine < d.theirs).map(d => d.label).join('/')} 仍被压制` : '全面碾压'}`
            : lead < trail
              ? `落后 ${trail} 项，重点补 ${diffs.filter(d => d.mine < d.theirs).map(d => d.label).join('/')}`
              : '势均力敌，看接下来谁先翻车';
          return (
            <div className="mt-2 text-center text-[11px] text-gray-500">
              {summary}
            </div>
          );
        })()}
      </motion.div>

      {/* 心理状态面板 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-medium text-gray-400 tracking-wider">艺人状态</div>
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full",
            mentalLabels.overall === 'excellent' ? 'bg-green-100 text-green-600' :
            mentalLabels.overall === 'good' ? 'bg-blue-100 text-blue-600' :
            mentalLabels.overall === 'normal' ? 'bg-gray-100 text-gray-600' :
            mentalLabels.overall === 'tired' ? 'bg-yellow-100 text-yellow-600' :
            mentalLabels.overall === 'stressed' ? 'bg-orange-100 text-orange-600' :
            mentalLabels.overall === 'depressed' ? 'bg-purple-100 text-purple-600' :
            'bg-red-100 text-red-600'
          )}>
            {mentalLabels.overall === 'excellent' ? '状态极佳' :
             mentalLabels.overall === 'good' ? '状态良好' :
             mentalLabels.overall === 'normal' ? '状态一般' :
             mentalLabels.overall === 'tired' ? '疲劳' :
             mentalLabels.overall === 'stressed' ? '压力大' :
             mentalLabels.overall === 'depressed' ? '情绪低落' : '濒临崩溃'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 心情 */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-500">心情</span>
              <span className="text-[10px] text-gray-400">{mentalLabels.moodLabel}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full",
                  mentalState.mood >= 70 ? 'bg-green-400' :
                  mentalState.mood >= 40 ? 'bg-blue-400' :
                  mentalState.mood >= 20 ? 'bg-yellow-400' : 'bg-red-400'
                )}
                initial={false}
                animate={{ width: `${mentalState.mood}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              />
            </div>
            <div className="text-[10px] text-gray-400 mt-1 text-right">{mentalState.mood}%</div>
          </div>

          {/* 精力 */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-500">精力</span>
              <span className="text-[10px] text-gray-400">{mentalLabels.energyLabel}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full",
                  mentalState.energy >= 70 ? 'bg-green-400' :
                  mentalState.energy >= 40 ? 'bg-blue-400' :
                  mentalState.energy >= 20 ? 'bg-yellow-400' : 'bg-red-400'
                )}
                initial={false}
                animate={{ width: `${mentalState.energy}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              />
            </div>
            <div className="text-[10px] text-gray-400 mt-1 text-right">{mentalState.energy}%</div>
          </div>

          {/* 信任 */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-500">信任度</span>
              <span className="text-[10px] text-gray-400">{mentalLabels.trustLabel}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full",
                  mentalState.trust >= 70 ? 'bg-pink-400' :
                  mentalState.trust >= 40 ? 'bg-purple-400' :
                  mentalState.trust >= 20 ? 'bg-orange-400' : 'bg-red-400'
                )}
                initial={false}
                animate={{ width: `${mentalState.trust}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              />
            </div>
            <div className="text-[10px] text-gray-400 mt-1 text-right">{mentalState.trust}%</div>
          </div>

          {/* 配合度 */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-500">配合度</span>
              <span className="text-[10px] text-gray-400">{mentalState.cooperation >= 70 ? '高' : mentalState.cooperation >= 40 ? '中' : '低'}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full",
                  mentalState.cooperation >= 70 ? 'bg-green-400' :
                  mentalState.cooperation >= 40 ? 'bg-blue-400' :
                  mentalState.cooperation >= 20 ? 'bg-yellow-400' : 'bg-red-400'
                )}
                initial={false}
                animate={{ width: `${mentalState.cooperation}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              />
            </div>
            <div className="text-[10px] text-gray-400 mt-1 text-right">{mentalState.cooperation}%</div>
          </div>
        </div>

        {/* 压力和倦怠 */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className={cn("rounded-xl p-3",
            mentalState.stress >= 70 ? 'bg-red-50' :
            mentalState.stress >= 40 ? 'bg-yellow-50' : 'bg-green-50'
          )}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500">压力值</span>
              <span className={cn("text-xs font-bold",
                mentalState.stress >= 70 ? 'text-red-500' :
                mentalState.stress >= 40 ? 'text-yellow-600' : 'text-green-600'
              )}>{mentalState.stress}%</span>
            </div>
            {mentalState.stress >= 70 && (
              <div className="text-[10px] text-red-500 mt-1">⚠️ 压力过高，需要休息</div>
            )}
          </div>

          <div className={cn("rounded-xl p-3",
            mentalState.burnout >= 60 ? 'bg-red-50' :
            mentalState.burnout >= 30 ? 'bg-yellow-50' : 'bg-green-50'
          )}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500">倦怠指数</span>
              <span className={cn("text-xs font-bold",
                mentalState.burnout >= 60 ? 'text-red-500' :
                mentalState.burnout >= 30 ? 'text-yellow-600' : 'text-green-600'
              )}>{mentalState.burnout}%</span>
            </div>
            {mentalState.burnout >= 60 && (
              <div className="text-[10px] text-red-500 mt-1">⚠️ 有退圈风险</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Weibo Compose */}
      <WeiboCompose />

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
            {(() => { const Icon = scheduleIconMap[artistSchedule.activity.id]; return Icon ? <Icon size={28} /> : <span className="text-2xl">{artistSchedule.activity.emoji}</span>; })()}
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800">{artistSchedule.activity.name}</div>
              <div className="text-[11px] text-orange-500 mt-0.5">
                进行中 · 还剩 {artistSchedule.remainingDays} 天
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-xs font-bold text-orange-500">{artistSchedule.remainingDays}天</span>
            </div>
          </div>
        ) : isRecovering ? (
          <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-xl ring-1 ring-blue-100/60">
            <span className="text-2xl">🏥</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800">术后恢复中</div>
              <div className="text-[11px] text-blue-500 mt-0.5">
                还剩 {cosmeticState.recoveryDaysRemaining} 天 · 无法安排行程
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-500">{cosmeticState.recoveryDaysRemaining}天</span>
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
                    {(() => { const Icon = scheduleIconMap[activity.id]; return Icon ? <Icon size={22} /> : <span className="text-lg">{activity.emoji}</span>; })()}
                    <span className="text-xs font-semibold text-gray-700">{activity.name}</span>
                  </div>
                  <div className="text-[11px] text-gray-400">{activity.durationDays}天 · {changes.join(' ')}</div>
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* 医美中心 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-medium text-gray-400 tracking-wider">医美中心</div>
          <div className="text-[11px] text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
            颜值 {cosmeticState.appearance}
          </div>
        </div>

        {isRecovering && (
          <div className="mb-3 p-2.5 bg-blue-50/60 rounded-lg ring-1 ring-blue-100/60 text-[11px] text-blue-500 text-center">
            🏥 术后恢复中，还剩 {cosmeticState.recoveryDaysRemaining} 天
          </div>
        )}

        <div className="space-y-3">
          {(['light', 'medium', 'major'] as CosmeticCategory[]).map(cat => {
            const procs = cosmeticProcedures.filter(p => p.category === cat);
            const catLabel = CATEGORY_LABELS[cat];
            return (
              <div key={cat}>
                <div className={cn("text-[11px] font-semibold mb-1.5", catLabel.color)}>
                  {catLabel.label}项目
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {procs.map(proc => {
                    const canAfford = stats.money >= proc.cost;
                    const disabled = isRecovering || !canAfford;
                    return (
                      <motion.button
                        key={proc.id}
                        whileHover={!disabled ? { scale: 1.01 } : undefined}
                        whileTap={!disabled ? { scale: 0.98 } : undefined}
                        onClick={() => {
                          if (disabled) return;
                          sfxClick();
                          performProcedure(proc.id);
                        }}
                        disabled={disabled}
                        className={cn(
                          "text-left p-3 rounded-xl border transition-all",
                          disabled
                            ? "border-gray-100/60 opacity-50 cursor-not-allowed"
                            : "border-gray-100/60 hover:border-purple-200/60 hover:bg-purple-50/30",
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {(() => { const Icon = cosmeticIconMap[proc.id]; return Icon ? <Icon size={22} /> : <span className="text-lg">{proc.emoji}</span>; })()}
                          <span className="text-xs font-semibold text-gray-700 flex-1">{proc.name}</span>
                          <span className={cn(
                            "text-[11px] font-bold",
                            canAfford ? "text-purple-500" : "text-gray-400"
                          )}>
                            ¥{formatMoney(proc.cost)}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 mb-1">{proc.description}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-green-500">颜值+{proc.appearanceGain}</span>
                          <span className="text-[11px] text-red-400">失败率{Math.round(proc.failChance * 100)}%</span>
                          <span className="text-[11px] text-orange-400">暴露率{Math.round(proc.discoveryChance * 100)}%</span>
                          {proc.recoveryDays > 0 && (
                            <span className="text-[11px] text-blue-400">恢复{proc.recoveryDays}天</span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
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
                  <div className="text-[11px] text-gray-400 mt-0.5">{d.choiceText}</div>
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
