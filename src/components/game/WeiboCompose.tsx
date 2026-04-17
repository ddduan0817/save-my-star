'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { weiboPostTemplates } from '@/data/weiboPosts';
import { cn, formatMoney } from '@/lib/utils';
import { sfxClick, sfxPositive, sfxNegative } from '@/lib/sounds';
import { IconWeiboCompose } from '@/components/icons';

export default function WeiboCompose() {
  const [isOpen, setIsOpen] = useState(false);
  const dailyPostUsed = useGameStore(s => s.dailyPostUsed);
  const postWeibo = useGameStore(s => s.postWeibo);
  const showPostResult = useGameStore(s => s.showPostResult);
  const lastPostNarration = useGameStore(s => s.lastPostNarration);
  const lastPostStatChanges = useGameStore(s => s.lastPostStatChanges);
  const dismissPostResult = useGameStore(s => s.dismissPostResult);

  const statLabels: Record<string, string> = {
    commercialValue: '商业价值',
    fanLoyalty: '粉丝忠诚',
    prRisk: '舆论风险',
    money: '资金',
  };

  const handlePost = (templateId: string) => {
    sfxClick();
    postWeibo(templateId);
    setIsOpen(false);
    // 音效在结果展示时根据正负播放
    const store = useGameStore.getState();
    if (store.lastPostStatChanges) {
      const net = (store.lastPostStatChanges.fanLoyalty ?? 0) + (store.lastPostStatChanges.commercialValue ?? 0)
        - (store.lastPostStatChanges.prRisk ?? 0);
      if (net >= 0) sfxPositive();
      else sfxNegative();
    }
  };

  const handleDismissResult = () => {
    sfxClick();
    dismissPostResult();
  };

  const changes = lastPostStatChanges
    ? Object.entries(lastPostStatChanges).filter(([, v]) => v && v !== 0)
    : [];

  return (
    <>
      {/* Compose button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        whileHover={!dailyPostUsed ? { scale: 1.02 } : undefined}
        whileTap={!dailyPostUsed ? { scale: 0.97 } : undefined}
        onClick={() => {
          if (!dailyPostUsed) {
            sfxClick();
            setIsOpen(!isOpen);
          }
        }}
        disabled={dailyPostUsed}
        className={cn(
          "w-full rounded-2xl px-4 py-3 text-left ring-1 transition-all duration-200",
          dailyPostUsed
            ? "bg-gray-50 ring-gray-100/60 opacity-60"
            : "bg-white ring-gray-200/50 shadow-sm hover:shadow-md hover:ring-orange-200/50"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{dailyPostUsed ? '✅' : <IconWeiboCompose size={22} />}</span>
            <span className={cn(
              "text-xs font-medium",
              dailyPostUsed ? "text-gray-400" : "text-gray-700"
            )}>
              {dailyPostUsed ? '今日已发微博' : '替艺人发微博'}
            </span>
          </div>
          {!dailyPostUsed && (
            <span className="text-[10px] text-gray-400">每日1次 ›</span>
          )}
        </div>
      </motion.button>

      {/* Template picker */}
      <AnimatePresence>
        {isOpen && !dailyPostUsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl ring-1 ring-gray-100/60 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-100/60">
                <span className="text-[10px] text-gray-400">选择微博内容</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                {weiboPostTemplates.map(template => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handlePost(template.id)}
                    className="text-left p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors ring-1 ring-gray-100/40"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{template.emoji}</span>
                      <span className="text-xs font-medium text-gray-700">{template.title}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{template.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post result overlay */}
      <AnimatePresence>
        {showPostResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
            onClick={handleDismissResult}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-5 shadow-xl w-full max-w-sm ring-1 ring-gray-200/60"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-xs text-gray-300 font-medium tracking-wider mb-2">微博已发出</div>
              <p className="text-sm text-gray-600 leading-relaxed">{lastPostNarration}</p>

              {changes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {changes.map(([key, value]) => {
                    const v = value as number;
                    const isRisk = key === 'prRisk';
                    const isPositive = isRisk ? v < 0 : v > 0;
                    const displayValue = key === 'money' ? formatMoney(v) : String(v);

                    return (
                      <span
                        key={key}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[11px] font-semibold",
                          isPositive
                            ? "bg-green-50 text-green-600 ring-1 ring-green-200/60"
                            : "bg-red-50 text-red-500 ring-1 ring-red-200/60"
                        )}
                      >
                        {statLabels[key]} {v > 0 ? '+' : ''}{displayValue}
                      </span>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleDismissResult}
                className="w-full mt-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-600 transition-colors"
              >
                好的
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
