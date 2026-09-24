'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';
import { rollVoyeurFeed, type VoyeurPost } from '@/data/voyeurPosts';

export default function BurnerTab() {
  const artist = useGameStore(s => s.artist);
  const mentalEnergy = useGameStore(s => s.mentalState.energy);
  const dailyVoyeurUsed = useGameStore(s => s.dailyVoyeurUsed);
  const dailyBurnerActionUsed = useGameStore(s => s.dailyBurnerActionUsed);
  const burnerFeed = useGameStore(s => s.burnerFeed);
  const consumeVoyeur = useGameStore(s => s.consumeVoyeur);
  const smearRival = useGameStore(s => s.smearRival);
  const reverseAttack = useGameStore(s => s.reverseAttack);

  const [voyeurFeed, setVoyeurFeed] = useState<VoyeurPost[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // 首次挂载时如果还没视奸过，默认给一批预览
  useEffect(() => {
    if (!dailyVoyeurUsed && voyeurFeed.length === 0 && artist) {
      setVoyeurFeed(rollVoyeurFeed(artist.name, 6));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist?.name]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleLurk = () => {
    if (!artist) return;
    if (dailyVoyeurUsed) {
      showToast('今日视奸额度已用完');
      return;
    }
    const ok = consumeVoyeur();
    if (ok) {
      setVoyeurFeed(rollVoyeurFeed(artist.name, 6));
      showToast('刷新了一批粉圈动态');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSmear = () => {
    const res = smearRival();
    if (!res.ok) {
      showToast(res.reason ?? '操作失败');
      return;
    }
    showToast('已发送匿名黑贴');
  };

  const handleReverse = () => {
    const res = reverseAttack();
    if (!res.ok) {
      showToast(res.reason ?? '操作失败');
      return;
    }
    showToast(res.backfire ? '翻车了！小号被扒' : '反串黑已发送');
  };

  const notEnoughEnergy = mentalEnergy < 15;

  return (
    <div className="flex-1 bg-[#f5f5f7] pb-24">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-10 bg-[#f5f5f7]/95 backdrop-blur px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 ring-1 ring-gray-100">
          <span className="text-gray-400">🔍</span>
          <input
            readOnly
            placeholder="搜索微博"
            className="flex-1 bg-transparent text-xs text-gray-500 outline-none placeholder:text-gray-300"
          />
          <span className="text-[10px] text-orange-500 font-medium">小号</span>
        </div>
      </div>

      {/* 发帖操作栏 */}
      <div className="px-4 pt-3 grid grid-cols-3 gap-2">
        <button
          onClick={handleLurk}
          disabled={dailyVoyeurUsed}
          className={cn(
            'flex flex-col items-center justify-center py-3 rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm transition',
            dailyVoyeurUsed ? 'opacity-50' : 'active:scale-95 hover:ring-orange-200',
          )}
        >
          <span className="text-xl">🔍</span>
          <span className="text-[11px] font-medium text-gray-700 mt-1">视奸粉圈</span>
          <span className="text-[9px] text-gray-400 mt-0.5">
            {dailyVoyeurUsed ? '今日已用' : '免费 · 每日 1 次'}
          </span>
        </button>
        <button
          onClick={handleSmear}
          disabled={dailyBurnerActionUsed || notEnoughEnergy}
          className={cn(
            'flex flex-col items-center justify-center py-3 rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm transition',
            dailyBurnerActionUsed || notEnoughEnergy ? 'opacity-50' : 'active:scale-95 hover:ring-orange-200',
          )}
        >
          <span className="text-xl">💥</span>
          <span className="text-[11px] font-medium text-gray-700 mt-1">黑对家</span>
          <span className="text-[9px] text-gray-400 mt-0.5">
            {dailyBurnerActionUsed ? '今日已用' : '-15 精力'}
          </span>
        </button>
        <button
          onClick={handleReverse}
          disabled={dailyBurnerActionUsed || notEnoughEnergy}
          className={cn(
            'flex flex-col items-center justify-center py-3 rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm transition',
            dailyBurnerActionUsed || notEnoughEnergy ? 'opacity-50' : 'active:scale-95 hover:ring-orange-200',
          )}
        >
          <span className="text-xl">😢</span>
          <span className="text-[11px] font-medium text-gray-700 mt-1">反串黑自家</span>
          <span className="text-[9px] text-gray-400 mt-0.5">
            {dailyBurnerActionUsed ? '今日已用' : '-15 · 15% 翻车'}
          </span>
        </button>
      </div>

      {/* 状态提示 */}
      {notEnoughEnergy && (
        <div className="mx-4 mt-2 text-[10px] text-orange-500 bg-orange-50 rounded-lg px-3 py-1.5">
          艺人精力不足（当前 {mentalEnergy} / 需要 15），先安排休息
        </div>
      )}

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-2 text-[11px] text-gray-700 bg-white rounded-lg px-3 py-1.5 ring-1 ring-gray-100 shadow-sm"
        >
          {toast}
        </motion.div>
      )}

      {/* 信息流 */}
      <div className="px-4 mt-3 space-y-2">
        {/* 玩家自己发的帖子 */}
        {burnerFeed.map(post => (
          <WeiboCard
            key={post.id}
            avatar="🕶️"
            nickname={artist ? `${artist.name.slice(0, 2)}的小号` : '匿名小号'}
            time={post.time}
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            reposts={post.reposts}
            isSelf
            backfired={post.backfired}
          />
        ))}
        {/* 视奸 feed */}
        {voyeurFeed.map(post => (
          <WeiboCard
            key={post.id}
            avatar={post.avatar}
            nickname={post.nickname ?? '匿名用户'}
            time={post.time}
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            reposts={Math.floor(post.likes / 8)}
          />
        ))}
        {burnerFeed.length === 0 && voyeurFeed.length === 0 && (
          <div className="text-center text-xs text-gray-400 py-12">
            点上方「视奸粉圈」刷一波动态
          </div>
        )}
      </div>
    </div>
  );
}

interface WeiboCardProps {
  avatar: string;
  nickname: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  reposts: number;
  isSelf?: boolean;
  backfired?: boolean;
}

function WeiboCard({
  avatar,
  nickname,
  time,
  content,
  likes,
  comments,
  reposts,
  isSelf,
  backfired,
}: WeiboCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white rounded-2xl px-4 py-3 ring-1 shadow-sm',
        backfired ? 'ring-red-200 bg-red-50/40' : 'ring-gray-100',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-800 truncate">{nickname}</span>
            {isSelf && (
              <span className="text-[9px] font-medium text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">
                本人
              </span>
            )}
            {backfired && (
              <span className="text-[9px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                翻车
              </span>
            )}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">{time} · 来自 微博 weibo.com</div>
          <p className="text-xs text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">{content}</p>
          {/* 交互底栏 */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
            <button className="flex-1 flex items-center justify-center gap-1 text-[11px] text-gray-400 hover:text-orange-500 transition-colors">
              <span>🔁</span>
              <span className="tabular-nums">{reposts}</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 text-[11px] text-gray-400 hover:text-orange-500 transition-colors">
              <span>💬</span>
              <span className="tabular-nums">{comments}</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 text-[11px] text-gray-400 hover:text-orange-500 transition-colors">
              <span>❤</span>
              <span className="tabular-nums">{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
