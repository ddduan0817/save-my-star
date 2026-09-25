'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Zap, Frown, Repeat2, MessageCircle, Heart, Bell, X, Flame } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';
import { rollVoyeurFeed, type VoyeurPost } from '@/data/voyeurPosts';
import WeiboCompose from '@/components/game/features/WeiboCompose';

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
  const burnerIdentity = useGameStore(s => s.burnerIdentity) ?? 'self';
  const switchBurnerIdentity = useGameStore(s => s.switchBurnerIdentity);

  const [voyeurFeed, setVoyeurFeed] = useState<VoyeurPost[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<typeof SUB_TABS[number]>('推荐');
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    setDrawerOpen(false);
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
    setDrawerOpen(false);
    const res = smearRival();
    if (!res.ok) {
      showToast(res.reason ?? '操作失败');
      return;
    }
    showToast('已发送匿名黑贴');
  };

  const handleReverse = () => {
    setDrawerOpen(false);
    const res = reverseAttack();
    if (!res.ok) {
      showToast(res.reason ?? '操作失败');
      return;
    }
    showToast(res.backfire ? '翻车了！小号被扒' : '反串黑已发送');
  };

  const toggleIdentity = () => {
    switchBurnerIdentity(burnerIdentity === 'self' ? 'artist' : 'self');
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

      {/* 发博操作区（单行） */}
      <div className="border-b-8 border-gray-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={toggleIdentity} className="relative shrink-0 active:scale-95 transition-transform">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-xl shadow-sm">
              {burnerIdentity === 'self' ? '🕶️' : '✨'}
            </div>
            <span className={cn(
              'absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ring-2 ring-white',
              burnerIdentity === 'self' ? 'bg-gray-800 text-white' : 'bg-red-500 text-white',
            )}>
              {burnerIdentity === 'self' ? '我' : '艺'}
            </span>
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex-1 text-left bg-gray-50 rounded-full px-4 py-2.5 text-[13px] text-gray-400 active:bg-gray-100"
          >
            {burnerIdentity === 'self' ? '点我发条微博…' : `以 ${artist?.name ?? '大号'} 身份发博…`}
          </button>
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

      {/* 信息流 */}
      <div>
        {/* 微博热搜（作为置顶 feed 卡） */}
        {weiboTrends.length > 0 && (
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-1.5 mb-2">
              <Flame size={14} className="text-orange-500" strokeWidth={2.4} />
              <span className="text-[13px] font-medium text-gray-800">微博热搜榜</span>
              <span className="text-[10px] text-gray-400 ml-auto">实时</span>
            </div>
            <div className="rounded-xl bg-gray-50/60 divide-y divide-gray-100">
              {weiboTrends.map((trend) => (
                <div key={trend.rank} className="flex items-center gap-3 px-3 py-2">
                  <span className={cn(
                    'text-xs font-bold w-5 text-center tabular-nums',
                    trend.rank <= 3 ? 'text-red-500' : 'text-gray-400',
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
            点上方输入框，选「视奸粉圈」刷一波动态
          </div>
        )}
      </div>

      {/* 底部抽屉 */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl pb-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="text-[15px] font-semibold text-gray-800">今天想做点什么？</div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-95"
                >
                  <X size={14} strokeWidth={2.4} />
                </button>
              </div>
              <div className="mx-auto w-10 h-1 rounded-full bg-gray-200 mb-3" />

              <div className="px-4 space-y-2">
                <DrawerRow
                  icon={<Eye size={18} strokeWidth={2.2} />}
                  tone="blue"
                  title="视奸粉圈"
                  desc="免费围观粉丝群组动态，刷新信息流"
                  hint={dailyVoyeurUsed ? '今日已用' : '免费 · 每日 1 次'}
                  onClick={handleLurk}
                  disabled={dailyVoyeurUsed}
                />
                <DrawerRow
                  icon={<Zap size={18} strokeWidth={2.2} />}
                  tone="orange"
                  title="黑对家"
                  desc="匿名放料攻击对家艺人（有翻车风险）"
                  hint={dailyBurnerActionUsed ? '今日已用' : '消耗 15 精力'}
                  onClick={handleSmear}
                  disabled={dailyBurnerActionUsed || notEnoughEnergy}
                />
                <DrawerRow
                  icon={<Frown size={18} strokeWidth={2.2} />}
                  tone="pink"
                  title="反串黑自家"
                  desc="扮演黑粉刺激自家粉团抱团（易翻车）"
                  hint={dailyBurnerActionUsed ? '今日已用' : '消耗 15 精力'}
                  onClick={handleReverse}
                  disabled={dailyBurnerActionUsed || notEnoughEnergy}
                />

                <div className="pt-2">
                  <div className="text-[10px] text-gray-400 px-1 pb-1.5">大号操作</div>
                  <WeiboCompose />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DrawerRowProps {
  icon: React.ReactNode;
  tone: 'blue' | 'orange' | 'pink';
  title: string;
  desc: string;
  hint: string;
  onClick: () => void;
  disabled?: boolean;
}

function DrawerRow({ icon, tone, title, desc, hint, onClick, disabled }: DrawerRowProps) {
  const toneClass = {
    blue: 'bg-sky-50 text-sky-500',
    orange: 'bg-orange-50 text-orange-500',
    pink: 'bg-pink-50 text-pink-500',
  }[tone];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-3 rounded-2xl px-3 py-3 ring-1 ring-gray-100/60 bg-white active:bg-gray-50 transition',
        disabled && 'opacity-40',
      )}
    >
      <span className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', toneClass)}>
        {icon}
      </span>
      <div className="flex-1 min-w-0 text-left">
        <div className="text-[13px] font-medium text-gray-800">{title}</div>
        <div className="text-[11px] text-gray-400 truncate">{desc}</div>
      </div>
      <span className="text-[10px] text-gray-400 shrink-0">{hint}</span>
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
