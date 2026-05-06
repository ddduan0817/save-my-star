'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { FansiteMaster, FansiteInteraction } from '@/types/new_systems';
import type { ArtistArchetype } from '@/types/game';
import { fansiteInteractions } from '@/data/fansites';
import { getFansiteIcon } from '@/components/icons';

interface InteractionResult {
  narration: string;
  cost: number;
  loyaltyDelta: number;
  attitudeChanged: boolean;
}

interface FansiteManagerProps {
  fansites: FansiteMaster[];
  onInteract: (fansiteId: string, interaction: FansiteInteraction) => InteractionResult;
  money: number;
  artistId?: ArtistArchetype;
}

const attitudeConfig: Record<string, { label: string; color: string; bg: string }> = {
  devoted: { label: '死忠', color: 'text-pink-500', bg: 'bg-pink-50' },
  supportive: { label: '支持', color: 'text-green-500', bg: 'bg-green-50' },
  neutral: { label: '中立', color: 'text-gray-500', bg: 'bg-gray-50' },
  dissatisfied: { label: '不满', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  hostile: { label: '敌对', color: 'text-orange-500', bg: 'bg-orange-50' },
  betrayed: { label: '脱粉回踩', color: 'text-red-500', bg: 'bg-red-50' },
};

export default function FansiteManager({ fansites, onInteract, money, artistId }: FansiteManagerProps) {
  const [selectedFansiteId, setSelectedFansiteId] = useState<string | null>(null);
  const [showInteractions, setShowInteractions] = useState(false);
  const [lastResult, setLastResult] = useState<InteractionResult | null>(null);

  // Pull the latest fansite data so the dialog re-renders immediately after an interaction.
  const selectedFansite = selectedFansiteId
    ? fansites.find(f => f.id === selectedFansiteId) ?? null
    : null;

  const activeFansites = fansites.filter(f => f.attitude !== 'betrayed');

  // Auto-dismiss the inline result banner after a few seconds.
  useEffect(() => {
    if (!lastResult) return;
    const t = setTimeout(() => setLastResult(null), 2600);
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

  const renderAvatar = (fansite: FansiteMaster, glyphSize = 26) => {
    const Icon = getFansiteIcon(artistId, fansite.id);
    return Icon ? <Icon size={glyphSize} /> : <span className="text-2xl">{fansite.avatar}</span>;
  };

  return (
    <div className="space-y-4">
      {/* 大粉列表 */}
      <div className="grid gap-3">
        {activeFansites.map((fansite, idx) => (
          <motion.div
            key={fansite.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => {
              setSelectedFansiteId(fansite.id);
              setShowInteractions(true);
            }}
            className="bg-white rounded-2xl p-4 ring-1 ring-gray-200/60 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-start gap-3">
              {/* 头像 */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-orange-500 shrink-0">
                {renderAvatar(fansite)}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 truncate">{fansite.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${attitudeConfig[fansite.attitude].bg} ${attitudeConfig[fansite.attitude].color}`}>
                    {attitudeConfig[fansite.attitude].label}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mt-0.5">
                  粉丝 {fansite.followers.toLocaleString()} · 忠诚度 {fansite.loyalty}%
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
        ))}
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
                    className="px-4 py-3 bg-amber-50 border-b border-amber-100 text-xs text-gray-700"
                  >
                    <div className="leading-relaxed">{lastResult.narration}</div>
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
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 互动选项 */}
              <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                {fansiteInteractions.map((interaction) => {
                  const canAfford = !interaction.cost || money >= interaction.cost;
                  return (
                    <button
                      key={interaction.id}
                      disabled={!canAfford}
                      onClick={() => handleInteract(interaction)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                        canAfford
                          ? 'bg-gray-50 hover:bg-orange-50 active:bg-orange-100'
                          : 'bg-gray-100 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-xl">{interaction.emoji}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{interaction.name}</div>
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
                })}
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
