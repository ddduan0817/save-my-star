'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { InsurancePolicy } from '@/types/new_systems';
import { INSURANCE_TEMPLATES } from '@/types/new_systems';

interface InsuranceShopProps {
  policies: InsurancePolicy[];
  onPurchase: (policyId: string) => void;
  onCancel: (policyId: string) => void;
  money: number;
  currentDay: number;
}

export default function InsuranceShop({ policies, onPurchase, onCancel, money, currentDay }: InsuranceShopProps) {
  const [selectedPolicy, setSelectedPolicy] = useState<typeof INSURANCE_TEMPLATES[0] | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // 获取保单状态
  const getPolicyStatus = (id: string) => {
    return policies.find(p => p.id === id);
  };

  return (
    <div className="space-y-4">
      {/* 保险列表 */}
      <div className="grid gap-3">
        {INSURANCE_TEMPLATES.map((template, idx) => {
          const existing = getPolicyStatus(template.id);
          const isActive = existing?.isActive;
          const canAfford = money >= template.annualPremium;

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => {
                setSelectedPolicy(template);
                setShowDetail(true);
              }}
              className={`rounded-2xl p-4 ring-1 cursor-pointer active:scale-[0.98] transition-all ${
                isActive
                  ? 'bg-green-50 ring-green-200'
                  : 'bg-white ring-gray-200/60'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* 图标 */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  isActive ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {template.emoji}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{template.name}</span>
                    {isActive && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">
                        已投保
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mt-0.5">
                    {template.description}
                  </div>

                  {/* 关键信息 */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      年保费 ¥{template.annualPremium.toLocaleString()}
                    </span>
                    <span className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                      赔付 {Math.round(template.coverage * 100)}%
                    </span>
                    <span className="text-[10px] px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                      最高 ¥{template.maxPayout.toLocaleString()}
                    </span>
                  </div>

                  {/* 免责条款预览 */}
                  <div className="mt-2 text-[10px] text-gray-400">
                    免责: {template.exclusions.slice(0, 2).join('、')}等
                  </div>
                </div>

                {/* 状态 */}
                <div className="text-gray-300">›</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 已购保单列表 */}
      {policies.filter(p => p.isActive).length > 0 && (
        <div className="bg-green-50 rounded-2xl p-4">
          <div className="font-bold text-green-800 mb-2">已投保保单</div>
          <div className="space-y-2">
            {policies.filter(p => p.isActive).map(policy => (
              <div key={policy.id} className="flex items-center justify-between bg-white rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span>{policy.emoji}</span>
                  <span className="text-sm font-medium">{policy.name}</span>
                </div>
                <button
                  onClick={() => onCancel(policy.id)}
                  className="text-xs text-red-500 px-2 py-1 rounded hover:bg-red-50"
                >
                  退保
                </button>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-green-600 mt-2">
            年保费总计: ¥{policies.filter(p => p.isActive).reduce((sum, p) => sum + p.annualPremium, 0).toLocaleString()}
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      <AnimatePresence>
        {showDetail && selectedPolicy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowDetail(false)}
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
              <div className="p-6 text-center border-b border-gray-100">
                <div className="text-5xl mb-2">{selectedPolicy.emoji}</div>
                <div className="font-bold text-lg">{selectedPolicy.name}</div>
                <div className="text-sm text-gray-500 mt-1">{selectedPolicy.description}</div>
              </div>

              {/* 详情 */}
              <div className="p-4 space-y-4">
                {/* 保费 */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">年保费</span>
                  <span className="font-bold text-orange-500">¥{selectedPolicy.annualPremium.toLocaleString()}</span>
                </div>

                {/* 赔付比例 */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">赔付比例</span>
                  <span className="font-bold">{Math.round(selectedPolicy.coverage * 100)}%</span>
                </div>

                {/* 免赔额 */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">免赔额</span>
                  <span className="font-bold">¥{selectedPolicy.deductible.toLocaleString()}</span>
                </div>

                {/* 最高赔付 */}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">最高赔付</span>
                  <span className="font-bold text-green-500">¥{selectedPolicy.maxPayout.toLocaleString()}</span>
                </div>

                {/* 免责条款 */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">⚠️ 免责条款</div>
                  <div className="space-y-1">
                    {selectedPolicy.exclusions.map((exclusion, idx) => (
                      <div key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="text-red-400">×</span>
                        {exclusion}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="p-4 border-t border-gray-100 space-y-2">
                {getPolicyStatus(selectedPolicy.id)?.isActive ? (
                  <button
                    onClick={() => {
                      onCancel(selectedPolicy.id);
                      setShowDetail(false);
                    }}
                    className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-medium"
                  >
                    退保
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onPurchase(selectedPolicy.id);
                      setShowDetail(false);
                    }}
                    disabled={money < selectedPolicy.annualPremium}
                    className={`w-full py-3 rounded-xl font-medium ${
                      money >= selectedPolicy.annualPremium
                        ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {money >= selectedPolicy.annualPremium
                      ? `投保 (¥${selectedPolicy.annualPremium.toLocaleString()})`
                      : '资金不足'}
                  </button>
                )}
                <button
                  onClick={() => setShowDetail(false)}
                  className="w-full py-3 text-gray-500 font-medium"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
