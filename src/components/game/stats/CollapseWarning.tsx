'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { CollapseWarning, RiskIndicator } from '@/types/new_systems';

interface CollapseWarningProps {
  warning: CollapseWarning;
  indicators: RiskIndicator[];
}

const levelConfig = {
  none: { color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', icon: '✅' },
  low: { color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', icon: 'ℹ️' },
  medium: { color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '⚠️' },
  high: { color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', icon: '🔥' },
  critical: { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', icon: '💥' },
};

const riskTypeLabels: Record<string, string> = {
  relationship: '恋情风险',
  tax: '税务风险',
  speech: '言论风险',
  behavior: '行为风险',
  scandal: '丑闻风险',
  none: '暂无风险',
};

export default function CollapseWarningPanel({ warning, indicators }: CollapseWarningProps) {
  const config = levelConfig[warning.level];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl ${config.bg} border ${config.border} p-4 mb-4`}
    >
      {/* 预警头部 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{config.icon}</span>
        <div className="flex-1">
          <div className={`font-bold ${config.color}`}>
            {warning.level === 'none' ? '舆情雷达正常' : 
             warning.level === 'critical' ? '⚠️ 塌房预警：临界状态' :
             `塌房预警：${riskTypeLabels[warning.riskType] || '综合风险'}`}
          </div>
          {warning.countdown && (
            <div className="text-xs text-gray-500 mt-0.5">
              预计爆发：{warning.countdown}天内
            </div>
          )}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color} border ${config.border}`}>
          {warning.level === 'none' ? '安全' :
           warning.level === 'low' ? '低风险' :
           warning.level === 'medium' ? '中风险' :
           warning.level === 'high' ? '高风险' : '极高'}
        </div>
      </div>

      {/* 预警信号列表 */}
      {warning.indicators.length > 0 && (
        <div className="space-y-2 mb-3">
          {warning.indicators.map((indicator, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <span className="text-red-400">▸</span>
              {indicator}
            </motion.div>
          ))}
        </div>
      )}

      {/* 风险指标仪表盘 */}
      {indicators.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200/50">
          {indicators.slice(0, 4).map((indicator) => (
            <div key={indicator.id} className="bg-white/60 rounded-lg p-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">{indicator.name}</span>
                <span className={`text-xs font-bold ${
                  indicator.value > 70 ? 'text-red-500' :
                  indicator.value > 40 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {indicator.value}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${indicator.value}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    indicator.value > 70 ? 'bg-red-400' :
                    indicator.value > 40 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-gray-400">
                  {indicator.trend === 'up' ? '↗ 上升' :
                   indicator.trend === 'down' ? '↘ 下降' : '→ 平稳'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// 简化的预警徽章（用于顶部状态栏）
export function CollapseWarningBadge({ level }: { level: CollapseWarning['level'] }) {
  const config = levelConfig[level];
  
  if (level === 'none') return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}
    >
      <span className="text-xs">{config.icon}</span>
      <span className="text-[10px] font-bold">
        {level === 'critical' ? '塌房预警' : '风险'}
      </span>
    </motion.div>
  );
}
