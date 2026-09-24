'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Zap, Frown, Repeat2, MessageCircle, Heart, Bell } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';
import { rollVoyeurFeed, type VoyeurPost } from '@/data/voyeurPosts';

const SUB_TABS = ['推荐', '热门', '关注', '同城'] as const;

export default function BurnerTab() {
  const artist = useGameStore(s => s.artist);
  const mentalEnergy = useGameStore(s => s.mentalState.energy);
  const dailyVoyeurUsed = useGameStore(s => s.dailyVoyeurUsed);
  const dailyBurnerActionUsed = useGameStore(s => s.dailyBurnerActionUsed);
  const burnerFeed = useGameStore(s => s.burnerFeed);
  const consumeVoyeur = useGameStore(s => s.consumeVoyeur);
  const smearRival = useGameStore(s => s.smearRival);
  const reverseAttack = useGameStore(s => s.reverseAttack);
  const weiboTrends = useGameStore(s => s.weiboTrends);
  const burnerIdentity = useGameStore(s => s.burnerIdentity);
  const switchBurnerIdentity = useGameStore(s => s.switchBurnerIdentity);

  const [voyeurFeed, setVoyeurFeed] = useState<VoyeurPost[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<typeof SUB_TABS[number]>('推荐');

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
    <div className="flex-1 bg-white pb-24">
      {/* 顶部微博 header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-11">
          <span className="text-[17px] font-bold text-[#ff8200] tracking-tight">微博</span>
          <div className="flex-1 flex items-center gap-1.5 bg-gray-100 rounded-full px-3 h-7">
            <Search size={13} className="text-gray-400" strokeWidth={2.5} />
            <span className="text-[11px] text-gray-400">搜索微博</span>
          </div>
          <button className="text-gray-500 active:opacity-60">
            <Bell size={18} strokeWidth={2} />
          </button>
        </div>
        {/* 二级 tab */}
        <div className="flex items-center px-2 h-9">
          {SUB_TABS.map(t => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={cn(
                'relative px-3 py-1.5 text-[13px] transition-colors',
                subTab === t ? 'text-gray-900 font-medium' : 'text-gray-500',
              )}
            >
              {t}
              {subTab === t && (
                <motion.span
                  layoutId="burner-subtab-indicator"
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-4 rounded-full bg-[#ff8200]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 发博操作区 */}
      <div className="border-b-8 border-gray-50">
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg">
            {burnerIdentity === 'self' ? '🕶️' : '✨'}
          </div>
          <div className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-[12px] text-gray-400">
            {burnerIdentity === 'self' ? '点我发条微博…' : `以 ${artist?.name ?? '大号'} 身份发博…`}
          </div>
        </div>
        {/* 身份切换 */}
        <div className="px-4 pb-2 flex items-center gap-2">
          <span className="text-[10px] text-gray-400">当前账号:</span>
          <button
            onClick={() => switchBurnerIdentity('self')}
            className={cn(
              'text-[11px] px-2.5 py-1 rounded-full transition',
              burnerIdentity === 'self'
                ? 'bg-orange-100 text-orange-600 font-medium'
                : 'bg-gray-100 text-gray-500',
            )}
          >
            🕶 我的小号
          </button>
          <button
            onClick={() => switchBurnerIdentity('artist')}
            className={cn(
              'text-[11px] px-2.5 py-1 rounded-full transition',
              burnerIdentity === 'artist'
                ? 'bg-red-100 text-red-600 font-medium'
                : 'bg-gray-100 text-gray-500',
            )}
          >
            ✨ {artist?.name ?? '大号'}
          </button>
          {burnerIdentity === 'artist' && (
            <span className="text-[10px] text-red-500">⚠ 有几率误发</span>
          )}
        </div>
        <div className="px-4 pb-3 flex items-center gap-2">
          <ActionButton
            icon={<Eye size={14} strokeWidth={2.2} />}
            label="视奸粉圈"
            hint={dailyVoyeurUsed ? '已用' : '免费'}
            onClick={handleLurk}
            disabled={dailyVoyeurUsed}
            tone="blue"
          />
          <ActionButton
            icon={<Zap size={14} strokeWidth={2.2} />}
            label="黑对家"
            hint={dailyBurnerActionUsed ? '已用' : '-15'}
            onClick={handleSmear}
            disabled={dailyBurnerActionUsed || notEnoughEnergy}
            tone="orange"
          />
          <ActionButton
            icon={<Frown size={14} strokeWidth={2.2} />}
            label="反串黑"
            hint={dailyBurnerActionUsed ? '已用' : '-15'}
            onClick={handleReverse}
            disabled={dailyBurnerActionUsed || notEnoughEnergy}
            tone="pink"
          />
        </div>
      </div>

      {notEnoughEnergy && (
        <div className="mx-4 mt-2 text-[11px] text-orange-500 bg-orange-50 rounded-lg px-3 py-1.5">
          艺人精力不足（当前 {mentalEnergy} / 需要 15），先安排休息
        </div>
      )}

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-2 text-[11px] text-gray-700 bg-white rounded-lg px-3 py-1.5 ring-1 ring-gray-100 shadow-sm"
        >
          {toast}
        </motion.div>
      )}

      {/* 微博热搜 */}
      {weiboTrends.length > 0 && (
        <div className="bg-white border-b-8 border-gray-50">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-700">微博热搜</span>
            <span className="text-[10px] text-orange-400">🔥 实时</span>
          </div>
          <div>
            {weiboTrends.map((trend) => (
              <div
                key={trend.rank}
                className="flex items-center gap-3 px-4 py-2 border-b border-gray-50 last:border-0"
              >
                <span className={cn(
                  "text-xs font-bold w-5 text-center tabular-nums",
                  trend.rank <= 3 ? "text-red-500" : "text-gray-400"
                )}>
                  {trend.rank}
                </span>
                <span className="flex-1 text-xs text-gray-700 truncate">{trend.title}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-gray-400">{trend.heat}</span>
                  {trend.isHot && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1 rounded">热</span>
                  )}
                  {trend.sentiment === 'negative' && (
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1 rounded">沸</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 信息流 */}
      <div>
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

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
  disabled?: boolean;
  tone: 'blue' | 'orange' | 'pink';
}

function ActionButton({ icon, label, hint, onClick, disabled, tone }: ActionButtonProps) {
  const toneClass = {
    blue: 'text-sky-500 bg-sky-50',
    orange: 'text-orange-500 bg-orange-50',
    pink: 'text-pink-500 bg-pink-50',
  }[tone];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition',
        toneClass,
        disabled ? 'opacity-40' : 'active:scale-95',
      )}
    >
      {icon}
      <span className="text-[12px] font-medium">{label}</span>
      <span className="text-[10px] opacity-70">· {hint}</span>
    </button>
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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'px-4 py-3 border-b border-gray-100 bg-white',
        backfired && 'bg-red-50/40',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-medium text-gray-900 truncate">{nickname}</span>
            {isSelf && (
              <span className="text-[9px] font-medium text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                本人
              </span>
            )}
            {backfired && (
              <span className="text-[9px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                翻车
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">{time} · 来自 微博 weibo.com</div>
          <p className="text-[14px] text-gray-800 mt-1.5 leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
          <div className="flex items-center mt-2.5 -mx-2">
            <FooterAction icon={<Repeat2 size={15} strokeWidth={2} />} value={reposts} />
            <FooterAction icon={<MessageCircle size={15} strokeWidth={2} />} value={comments} />
            <FooterAction icon={<Heart size={15} strokeWidth={2} />} value={likes} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FooterAction({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <button className="flex-1 flex items-center justify-center gap-1 py-1 text-gray-500 hover:text-[#ff8200] transition-colors">
      {icon}
      <span className="text-[12px] tabular-nums">{value > 0 ? value : ''}</span>
    </button>
  );
}
