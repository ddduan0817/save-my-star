'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';
import { sfxClick } from '@/lib/sounds';

const statLabels: Record<string, string> = {
  commercialValue: '商业价值',
  fanLoyalty: '粉丝忠诚',
  prRisk: '舆论风险',
  money: '资金',
};

export default function CosmeticResultModal() {
  const show = useGameStore(s => s.showCosmeticResult);
  const narration = useGameStore(s => s.lastCosmeticNarration);
  const statChanges = useGameStore(s => s.lastCosmeticStatChanges);
  const dismiss = useGameStore(s => s.dismissCosmeticResult);
  const cosmeticState = useGameStore(s => s.cosmeticState);

  const changes = statChanges
    ? Object.entries(statChanges).filter(([, v]) => v && v !== 0)
    : [];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          onClick={() => { sfxClick(); dismiss(); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl ring-1 ring-gray-100/60"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">💉</div>
              <div className="text-sm font-bold text-gray-800">医美结果</div>
              <div className="text-[10px] text-purple-500 mt-1">
                当前颜值: {cosmeticState.appearance}
              </div>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
              {narration}
            </div>

            {changes.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {changes.map(([key, val]) => {
                  const v = val as number;
                  const isPositive = key === 'prRisk' ? v < 0 : v > 0;
                  const display = key === 'money'
                    ? `${v > 0 ? '+' : ''}¥${formatMoney(Math.abs(v))}`
                    : `${v > 0 ? '+' : ''}${v}`;
                  return (
                    <span
                      key={key}
                      className={cn(
                        "text-[10px] font-semibold px-2.5 py-1 rounded-full",
                        isPositive
                          ? "text-green-600 bg-green-50"
                          : "text-red-500 bg-red-50"
                      )}
                    >
                      {statLabels[key] ?? key} {display}
                    </span>
                  );
                })}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { sfxClick(); dismiss(); }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm font-semibold shadow-sm"
            >
              知道了
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
