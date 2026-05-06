'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { FansiteMaster, FansiteInteraction } from '@/types/new_systems';
import { FANSITE_STYLE_META } from '@/types/new_systems';
import type { ArtistArchetype } from '@/types/game';
import { fansiteInteractions } from '@/data/fansites';
import { getFansiteIcon } from '@/components/icons';

interface InteractionResult {
  narration: string;
  cost: number;
  loyaltyDelta: number;
  attitudeChanged: boolean;
  blocked?: 'quota_exceeded' | 'no_money';
}

interface FansiteManagerProps {
  fansites: FansiteMaster[];
  onInteract: (fansiteId: string, interaction: FansiteInteraction) => InteractionResult;
  money: number;
  artistId?: ArtistArchetype;
  /** 当日已用次数 */
  interactionsUsed?: number;
  /** 当日额度 */
  interactionsQuota?: number;
  /** 当前游戏天数 —— 用于判断冷落 */
  currentDay?: number;
  /** 艺人信任值 —— 决定能否使用"安抚"功能 */
  artistTrust?: number;
  /** 安抚消耗的信任值阈值 */
  consoleTrustCost?: number;
  /** 让艺人帮你安抚某个大粉。返回是否成功+消息 */
  onConsole?: (fansiteId: string) => { success: boolean; message: string };
}

const attitudeConfig: Record<string, { label: string; color: string; bg: string }> = {
  devoted: { label: '死忠', color: 'text-pink-500', bg: 'bg-pink-50' },
  supportive: { label: '支持', color: 'text-green-500', bg: 'bg-green-50' },
  neutral: { label: '中立', color: 'text-gray-500', bg: 'bg-gray-50' },
  dissatisfied: { label: '不满', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  hostile: { label: '敌对', color: 'text-orange-500', bg: 'bg-orange-50' },
  betrayed: { label: '脱粉回踩', color: 'text-red-500', bg: 'bg-red-50' },
};

const NEGLECT_THRESHOLD_DAYS = 4;

export default function FansiteManager({
  fansites,
  onInteract,
  money,
  artistId,
  interactionsUsed = 0,
  interactionsQuota = 3,
  currentDay = 0,
  artistTrust = 0,
  consoleTrustCost = 8,
  onConsole,
}: FansiteManagerProps) {
  const [selectedFansiteId, setSelectedFansiteId] = useState<string | null>(null);
  const [showInteractions, setShowInteractions] = useState(false);
  const [lastResult, setLastResult] = useState<InteractionResult | null>(null);

  // Pull the latest fansite data so the dialog re-renders immediately after an interaction.
  const selectedFansite = selectedFansiteId
    ? fansites.find(f => f.id === selectedFansiteId) ?? null
    : null;

  const activeFansites = fansites.filter(f => f.attitude !== 'betrayed');
  const quotaExhausted = interactionsUsed >= interactionsQuota;

  const isNeglected = (f: FansiteMaster) => {
    if (currentDay <= 0 || f.lastInteraction === 0) return false;
    return currentDay - f.lastInteraction > NEGLECT_THRESHOLD_DAYS;
  };

  // Auto-dismiss the inline result banner after a few seconds.
  useEffect(() => {
    if (!lastResult) return;
    const t = setTimeout(() => setLastResult(null), 2800);
    return () => clearTimeout(t);
  }, [lastResult]);

  // Reset banner when the dialog closes.
  useEffect(() => {
    if (!showInteractions) setLastResult(null);
  }, [showInteractions]);

  const handleInteract = (interaction: FansiteInteraction) => {
    if (!selectedFansiteId) return;
    const result = onInteract(selectedFansiteId, interaction);
    setLastResult(result);
  };

  const handleConsole = () => {
    if (!selectedFansiteId || !onConsole) return;
    const r = onConsole(selectedFansiteId);
    setLastResult({
      narration: r.message,
      cost: 0,
      loyaltyDelta: 0,
      attitudeChanged: false,
    });
  };

  const renderAvatar = (fansite: FansiteMaster, glyphSize = 26) => {
    const Icon = getFansiteIcon(artistId, fansite.id);
    return Icon ? <Icon size={glyphSize} /> : <span className="text-2xl">{fansite.avatar}</span>;
  };

  return (
    <div className="space-y-4">
      {/* 当日额度计数器 */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-gray-500">
          今日互动 <span className={`font-bold ${quotaExhausted ? 'text-red-500' : 'text-orange-500'}`}>
            {interactionsUsed}/{interactionsQuota}
          </span>
        </span>
        {quotaExhausted && (
          <span className="text-[11px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
            额度已满，明天再来
          </span>
        )}
      </div>

      {/* 大粉列表 */}
      <div className="grid gap-3">
        {activeFansites.map((fansite, idx) => {
          const neglected = isNeglected(fansite);
          return (
          <motion.div
            key={fansite.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => {
              setSelectedFansiteId(fansite.id);
              setShowInteractions(true);
            }}
            className={`bg-white rounded-2xl p-4 ring-1 shadow-sm cursor-pointer active:scale-[0.98] transition-transform ${
              neglected ? 'ring-amber-300/70' : 'ring-gray-200/60'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* 头像 */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-orange-500 shrink-0">
                {renderAvatar(fansite)}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-800 truncate">{fansite.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${attitudeConfig[fansite.attitude].bg} ${attitudeConfig[fansite.attitude].color}`}>
                    {attitudeConfig[fansite.attitude].label}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${FANSITE_STYLE_META[fansite.style].tint}`}
                    title={FANSITE_STYLE_META[fansite.style].tag}
                  >
                    {FANSITE_STYLE_META[fansite.style].label}
                  </span>
                  {neglected && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600">
                      🥶 被冷落
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500 mt-0.5">
                  粉丝 {fansite.followers.toLocaleString()} · 忠诚度 {fansite.loyalty}%
                  {fansite.lastInteraction > 0 && currentDay > 0 && (
                    <span className="ml-2 text-gray-400">
                      · 上次互动 Day {fansite.lastInteraction}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                  {fansite.specialTrait}
                </div>

                {/* 资源标签 */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {fansite.resources.map(resource => (
                    <span key={resource} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {resource === 'photos' ? '📷 神图' :
                       resource === 'videos' ? '🎥 视频' :
                       resource === 'info' ? '💡 情报' :
                       resource === 'connections' ? '🤝 人脉' : '💰 资金'}
                    </span>
                  ))}
                </div>

                {/* 勒索警告 */}
                {fansite.hasBlackmail && (
                  <div className="mt-2 text-[10px] text-red-500 bg-red-50 px-2 py-1 rounded">
                    ⚠️ 手里有黑料，可能勒索 ¥{fansite.blackmailValue.toLocaleString()}
                  </div>
                )}
              </div>

              {/* 箭头 */}
              <div className="text-gray-300">›</div>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* 互动弹窗 */}
      <AnimatePresence>
        {showInteractions && selectedFansite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowInteractions(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-orange-500 shrink-0">
                    {renderAvatar(selectedFansite, 28)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{selectedFansite.name}</div>
                    <div className="text-xs text-gray-500">
                      忠诚度: {selectedFansite.loyalty}% · {attitudeConfig[selectedFansite.attitude].label}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${FANSITE_STYLE_META[selectedFansite.style].tint}`}
                      >
                        {FANSITE_STYLE_META[selectedFansite.style].label}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {FANSITE_STYLE_META[selectedFansite.style].tag}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400">今日额度</div>
                    <div className={`text-sm font-bold ${quotaExhausted ? 'text-red-500' : 'text-orange-500'}`}>
                      {interactionsUsed}/{interactionsQuota}
                    </div>
                  </div>
                </div>
              </div>

              {/* 上一次互动反馈条 */}
              <AnimatePresence>
                {lastResult && (
                  <motion.div
                    key="result-banner"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`px-4 py-3 border-b text-xs text-gray-700 ${
                      lastResult.blocked
                        ? 'bg-red-50 border-red-100'
                        : 'bg-amber-50 border-amber-100'
                    }`}
                  >
                    <div className="leading-relaxed">{lastResult.narration}</div>
                    {!lastResult.blocked && (
                      <div className="mt-1.5 flex flex-wrap gap-2 text-[11px]">
                        {lastResult.cost > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-500 font-medium">
                            -¥{lastResult.cost.toLocaleString()}
                          </span>
                        )}
                        {lastResult.loyaltyDelta !== 0 && (
                          <span
                            className={`px-1.5 py-0.5 rounded font-medium ${
                              lastResult.loyaltyDelta > 0
                                ? 'bg-pink-50 text-pink-500'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            忠诚度 {lastResult.loyaltyDelta > 0 ? '+' : ''}
                            {lastResult.loyaltyDelta}
                          </span>
                        )}
                        {lastResult.attitudeChanged && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-500 font-medium">
                            态度变化
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 安抚（艺人出面）*/}
              {onConsole && isNeglected(selectedFansite) && (
                <div className="px-4 pt-3">
                  <button
                    disabled={artistTrust < consoleTrustCost}
                    onClick={handleConsole}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                      artistTrust >= consoleTrustCost
                        ? 'bg-purple-50 hover:bg-purple-100'
                        : 'bg-gray-100 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-xl">💞</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm flex items-center gap-1.5">
                        请艺人出面安抚
                        <span className="text-[9px] px-1 py-0.5 rounded bg-purple-100 text-purple-600">
                          不占额度
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        消耗艺人信任 -{consoleTrustCost}（当前 {artistTrust}）
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* 互动选项 */}
              <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                {(() => {
                  const styleMatched = fansiteInteractions.filter(
                    i => !i.requiresStyle || i.requiresStyle.includes(selectedFansite.style),
                  );
                  const universal = fansiteInteractions.filter(i => !i.requiresStyle);
                  const styleSpecific = styleMatched.filter(i => i.requiresStyle);
                  const ordered = [...styleSpecific, ...universal];
                  if (ordered.length === 0) {
                    return (
                      <div className="text-xs text-gray-400 py-4 text-center">
                        当前风格暂无可用互动
                      </div>
                    );
                  }
                  return ordered.map((interaction) => {
                    const canAfford = !interaction.cost || money >= interaction.cost;
                    const isStyleSpecific = !!interaction.requiresStyle;
                    const disabled = !canAfford || quotaExhausted;
                    return (
                      <button
                        key={interaction.id}
                        disabled={disabled}
                        onClick={() => handleInteract(interaction)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                          !disabled
                            ? 'bg-gray-50 hover:bg-orange-50 active:bg-orange-100'
                            : 'bg-gray-100 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-xl">{interaction.emoji}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm flex items-center gap-1.5">
                            {interaction.name}
                            {isStyleSpecific && (
                              <span
                                className={`text-[9px] px-1 py-0.5 rounded ${FANSITE_STYLE_META[selectedFansite.style].tint}`}
                              >
                                专属
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{interaction.description}</div>
                        </div>
                        {interaction.cost ? (
                          <span className={`text-xs font-bold ${canAfford ? 'text-orange-500' : 'text-red-400'}`}>
                            ¥{interaction.cost.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-xs text-green-500 font-bold">免费</span>
                        )}
                      </button>
                    );
                  });
                })()}
              </div>

              {/* 关闭 */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => setShowInteractions(false)}
                  className="w-full py-3 text-gray-500 font-medium"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
