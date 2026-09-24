'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { rollVoyeurFeed, type VoyeurPost } from '@/data/voyeurPosts';
import { cn } from '@/lib/utils';

/** 黑粉小号入口 —— 卡片形态嵌入 MeTab，点击后弹出深色信息流 */
export default function AntiFanAltPanel() {
  const artist = useGameStore(s => s.artist);
  const dailyVoyeurUsed = useGameStore(s => s.dailyVoyeurUsed);
  const useVoyeur = useGameStore(s => s.useVoyeur);

  const [open, setOpen] = useState(false);
  const [feed, setFeed] = useState<VoyeurPost[]>([]);

  if (!artist) return null;

  const handleOpen = () => {
    if (dailyVoyeurUsed) {
      // 已经用过：只展示上次缓存也没意义，直接不允许再刷
      return;
    }
    const ok = useVoyeur();
    if (!ok) return;
    setFeed(rollVoyeurFeed(artist.name, 5 + Math.floor(Math.random() * 3)));
    setOpen(true);
  };

  return (
    <>
      {/* 入口卡片 —— 深色，塞在 MeTab 卡片流里 */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onClick={handleOpen}
        disabled={dailyVoyeurUsed}
        className={cn(
          'w-full text-left rounded-2xl overflow-hidden ring-1 transition-all',
          dailyVoyeurUsed
            ? 'bg-slate-800/60 ring-slate-700/50 opacity-60 cursor-not-allowed'
            : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ring-red-900/40 shadow-lg hover:shadow-red-900/20 active:scale-[0.99]'
        )}
      >
        <div className="px-4 py-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-900 to-slate-950 flex items-center justify-center text-lg ring-1 ring-red-500/30">
            🌙
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100">我的小号</span>
              <span className="text-[9px] font-bold text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded-full border border-red-900/50">
                匿名
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
              {dailyVoyeurUsed ? '今夜的浑水已经趟过一遍了……' : '潜入粉圈围观一圈？'}
            </div>
          </div>
          <span className={cn(
            'text-[10px] shrink-0 tabular-nums',
            dailyVoyeurUsed ? 'text-slate-600' : 'text-red-400'
          )}>
            {dailyVoyeurUsed ? '0/1' : '1/1'}
          </span>
        </div>
      </motion.button>

      {/* 视奸信息流弹窗 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md max-h-[85vh] bg-slate-950 sm:rounded-2xl rounded-t-3xl overflow-hidden flex flex-col ring-1 ring-red-900/30"
            >
              {/* 头部 */}
              <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-950">
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    🕵️ 粉圈围观
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    #{artist.name}超话 · 最新动态
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800/60 text-slate-400 hover:text-slate-200 text-sm"
                >
                  ✕
                </button>
              </div>

              {/* 信息流 */}
              <div className="flex-1 overflow-y-auto">
                {feed.map((post) => (
                  <div
                    key={post.id}
                    className="px-4 py-3 border-b border-slate-800/60 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm shrink-0">
                        {post.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-slate-300">
                            匿名{post.authorTag}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                            {post.authorTag}
                          </span>
                          <span className="text-[10px] text-slate-600">{post.time}</span>
                        </div>
                        <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500">
                          <span>💬 {post.comments}</span>
                          <span>❤ {post.likes.toLocaleString()}</span>
                          <span className="text-slate-600">🔁 转发</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 底部提示 */}
              <div className="px-5 py-3 bg-slate-900/80 border-t border-slate-800/60">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  你关掉手机，屏幕熄灭那一刻，能听见自己心跳。
                  <span className="text-slate-600">（明天再来）</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
