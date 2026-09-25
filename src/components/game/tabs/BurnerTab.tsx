'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Eye, Zap, Bell, X, Flame,
  Repeat2, MessageCircle, Heart,
  Camera, Moon, ShieldAlert, Megaphone, Gift, HeartHandshake, Swords, Smile, HeartCrack, BookText,
} from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';
import { rollVoyeurFeed, type VoyeurPost } from '@/data/voyeurPosts';
import { GAME_CONFIG } from '@/data/constants';
import { weiboPostTemplates } from '@/data/weiboPosts';
import { sfxClick } from '@/lib/sounds';

const BURNER_NICKNAME_BY_ARTIST: Record<string, string> = {
  idol: '我就说他甄帅吧',
  actor: '好一朵美丽',
  singer: '糕糕的话筒',
  influencer: '爱语梦翠霜',
  socialite: 'mogelove',
};

const SUB_TABS = ['推荐', '热门', '关注', '同城'] as const;
const ACTIVE_SUB_TAB = '推荐';

const TEMPLATE_META: Record<string, { icon: React.ReactNode; desc: string }> = {
  post_work_photo:         { icon: <Camera size={18} strokeWidth={2.2} />,        desc: '晒片场花絮，粉丝会心一笑' },
  post_late_night:         { icon: <Moon size={18} strokeWidth={2.2} />,          desc: '深夜emo小作文，路人容易共情' },
  post_respond_controversy:{ icon: <ShieldAlert size={18} strokeWidth={2.2} />,   desc: '亲自回应争议，赌一把舆论' },
  post_promote_work:       { icon: <Megaphone size={18} strokeWidth={2.2} />,     desc: '硬广新剧新歌，商务先笑了' },
  post_fan_gift:           { icon: <Gift size={18} strokeWidth={2.2} />,          desc: '送生日惊喜，唯粉一夜狂欢' },
  post_charity:            { icon: <HeartHandshake size={18} strokeWidth={2.2} />,desc: '低调做公益，把路人拉进盘' },
  post_fight_haters:       { icon: <Swords size={18} strokeWidth={2.2} />,        desc: '亲自下场撕黑粉，很爽也危险' },
  post_selfie:             { icon: <Smile size={18} strokeWidth={2.2} />,         desc: '甩一张神图，全网喊救命' },
  post_hint_romance:       { icon: <HeartCrack size={18} strokeWidth={2.2} />,    desc: '暗示恋情，唯粉集体破防' },
  post_apology:            { icon: <BookText size={18} strokeWidth={2.2} />,      desc: '发道歉小作文，诚意值决定生死' },
};

export default function BurnerTab() {
  const artist = useGameStore(s => s.artist);
  const mentalEnergy = useGameStore(s => s.mentalState.energy);
  const stats = useGameStore(s => s.stats);
  const activeTags = useGameStore(s => s.activeTags);
  const dailyVoyeurCount = useGameStore(s => s.dailyVoyeurCount);
  const dailyBurnerActionUsed = useGameStore(s => s.dailyBurnerActionUsed);
  const burnerFeed = useGameStore(s => s.burnerFeed);
  const consumeVoyeur = useGameStore(s => s.consumeVoyeur);
  const smearRival = useGameStore(s => s.smearRival);
  const reverseAttack = useGameStore(s => s.reverseAttack);
  const postWeibo = useGameStore(s => s.postWeibo);
  const dailyPostUsed = useGameStore(s => s.dailyPostUsed);
  const showPostResult = useGameStore(s => s.showPostResult);
  const lastPostNarration = useGameStore(s => s.lastPostNarration);
  const lastPostStatChanges = useGameStore(s => s.lastPostStatChanges);
  const dismissPostResult = useGameStore(s => s.dismissPostResult);
  const weiboTrends = useGameStore(s => s.weiboTrends);
  const burnerIdentity = useGameStore(s => s.burnerIdentity) ?? 'self';
  const switchBurnerIdentity = useGameStore(s => s.switchBurnerIdentity);
  const weiboPostHistory = useGameStore(s => s.weiboPostHistory);
  const currentDay = useGameStore(s => s.currentDay);

  const [voyeurFeed, setVoyeurFeed] = useState<VoyeurPost[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const voyeurLimit = GAME_CONFIG.VOYEUR_DAILY_LIMIT;
  const voyeurExhausted = dailyVoyeurCount >= voyeurLimit;

  const buildVoyeurCtx = () => ({
    fanLoyalty: stats.fanLoyalty,
    prRisk: stats.prRisk,
    commercialValue: stats.commercialValue,
    tags: activeTags,
    artistId: artist?.id,
  });

  useEffect(() => {
    if (dailyVoyeurCount === 0 && voyeurFeed.length === 0 && artist) {
      setVoyeurFeed(rollVoyeurFeed(artist.name, 6, buildVoyeurCtx()));
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
    if (voyeurExhausted) {
      showToast('今日视奸额度已用完');
      return;
    }
    const ok = consumeVoyeur();
    if (ok) {
      setVoyeurFeed(rollVoyeurFeed(artist.name, 6, buildVoyeurCtx()));
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

  const handlePostTemplate = (templateId: string) => {
    if (dailyPostUsed) {
      showToast('今日已发过微博');
      return;
    }
    sfxClick();
    setDrawerOpen(false);
    postWeibo(templateId);
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
        {/* 二级 tab：全部展示但只固定"推荐"高亮，其余为灰不可点 */}
        <div className="flex items-center px-2 h-9">
          {SUB_TABS.map(t => {
            const active = t === ACTIVE_SUB_TAB;
            return (
              <div
                key={t}
                className={cn(
                  'relative px-3 py-1.5 text-[13px] select-none',
                  active ? 'text-gray-900 font-medium' : 'text-gray-400',
                )}
              >
                {t}
                {active && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-4 rounded-full bg-[#ff8200]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 发博操作区（单行） */}
      <div className="border-b-8 border-gray-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={toggleIdentity} className="relative shrink-0 active:scale-95 transition-transform">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-xl shadow-sm overflow-hidden">
              {burnerIdentity === 'self'
                ? <span>🕶️</span>
                : (artist
                  ? <img src={`./artists/${artist.id}.png`} alt="" className="w-full h-full object-cover" />
                  : <span>✨</span>)}
            </div>
            <span className={cn(
              'absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ring-2 ring-white',
              burnerIdentity === 'self' ? 'bg-gray-800 text-white' : 'bg-red-500 text-white',
            )}>
              {burnerIdentity === 'self' ? '小号' : '大号'}
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

        {/* 艺人本人发的博（今日+近3日） */}
        {weiboPostHistory
          .filter(rec => currentDay - rec.day <= 3)
          .slice()
          .reverse()
          .map((rec, idx) => {
            const template = weiboPostTemplates.find(t => t.id === rec.templateId);
            if (!template || !artist) return null;
            const raw = rec.wasBackfire && template.backfireNarration
              ? template.backfireNarration
              : (template.postContent ?? template.successNarration);
            const content = renderWithName(raw, artist.name);
            const daysAgo = currentDay - rec.day;
            const timeLabel = daysAgo === 0 ? '刚刚' : `${daysAgo}天前`;
            return (
              <WeiboCard
                key={`artistpost_${rec.day}_${idx}`}
                avatar={<img src={`./artists/${artist.id}.png`} alt="" className="w-full h-full object-cover rounded-full" />}
                nickname={artist.name}
                time={timeLabel}
                content={content}
                likes={Math.floor(Math.random() * 8000) + 2000}
                comments={Math.floor(Math.random() * 1500) + 300}
                reposts={Math.floor(Math.random() * 2000) + 400}
                selfLabel="艺人"
                backfired={rec.wasBackfire}
              />
            );
          })}

        {burnerFeed.map(post => (
          <WeiboCard
            key={post.id}
            avatar="🕶️"
            nickname={artist ? (BURNER_NICKNAME_BY_ARTIST[artist.id] ?? `${artist.name}的小号`) : '匿名小号'}
            time={post.time}
            content={artist ? renderWithName(post.content, artist.name) : post.content}
            likes={post.likes}
            comments={post.comments}
            reposts={post.reposts}
            selfLabel="小号"
            backfired={post.backfired}
          />
        ))}
        {voyeurFeed.map(post => (
          <WeiboCard
            key={post.id}
            avatar={post.avatar}
            nickname={post.nickname ?? '匿名用户'}
            time={post.time}
            content={artist ? renderWithName(post.content, artist.name) : post.content}
            likes={post.likes}
            comments={post.comments}
            reposts={Math.floor(post.likes / 8)}
          />
        ))}
        {burnerFeed.length === 0 && voyeurFeed.length === 0 && weiboPostHistory.length === 0 && (
          <div className="text-center text-xs text-gray-400 py-12">
            点上方输入框，选「视奸粉圈」刷一波动态
          </div>
        )}
      </div>

      {/* 底部抽屉 —— 约束在手机框内 */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-transparent flex justify-center pointer-events-none"
            onClick={() => setDrawerOpen(false)}
          >
            <div className="relative w-full max-w-lg pointer-events-auto" onClick={() => setDrawerOpen(false)}>
              <motion.div
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                exit={{ y: '110%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl ring-1 ring-gray-200/70 shadow-lg pb-3 max-h-[70vh] flex flex-col"
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
              <div className="mb-2" />

              <div className="px-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-1 pb-2">
                  <DrawerCard
                    icon={<Eye size={18} strokeWidth={2.2} />}
                    tone="blue"
                    title="视奸粉圈"
                    desc="蹲一眼粉圈动态，摸清风向"
                    hint={voyeurExhausted ? '今日已用完' : `${dailyVoyeurCount}/${voyeurLimit}`}
                    onClick={handleLurk}
                    disabled={voyeurExhausted}
                  />
                  <DrawerCard
                    icon={<Zap size={18} strokeWidth={2.2} />}
                    tone="orange"
                    title="黑对家"
                    desc="匿名爆料放黑稿，有翻车风险"
                    hint={dailyBurnerActionUsed ? '今日已用' : '15 精力'}
                    onClick={handleSmear}
                    disabled={dailyBurnerActionUsed || notEnoughEnergy}
                  />
                  {weiboPostTemplates.map(template => {
                    const meta = TEMPLATE_META[template.id];
                    return (
                      <DrawerCard
                        key={template.id}
                        icon={meta?.icon ?? <Camera size={18} strokeWidth={2.2} />}
                        tone="pink"
                        title={template.title}
                        desc={meta?.desc ?? template.description}
                        hint={dailyPostUsed ? '今日已发' : '每日1次'}
                        onClick={() => handlePostTemplate(template.id)}
                        disabled={dailyPostUsed}
                      />
                    );
                  })}
                </div>
              </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 发博结果 overlay */}
      <AnimatePresence>
        {showPostResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-6 pointer-events-none"
            onClick={dismissPostResult}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-5 shadow-xl w-full max-w-sm ring-1 ring-gray-200/60 pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-xs text-gray-300 font-medium tracking-wider mb-2">微博已发出</div>
              <p className="text-sm text-gray-600 leading-relaxed">{lastPostNarration}</p>
              {lastPostStatChanges && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(lastPostStatChanges).filter(([, v]) => v && v !== 0).map(([key, value]) => {
                    const v = value as number;
                    const isRisk = key === 'prRisk';
                    const isPositive = isRisk ? v < 0 : v > 0;
                    const label: Record<string, string> = {
                      commercialValue: '商业价值',
                      fanLoyalty: '粉丝忠诚',
                      prRisk: '舆论风险',
                      money: '资金',
                    };
                    return (
                      <span
                        key={key}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-[11px] font-semibold',
                          isPositive
                            ? 'bg-green-50 text-green-600 ring-1 ring-green-200/60'
                            : 'bg-red-50 text-red-500 ring-1 ring-red-200/60',
                        )}
                      >
                        {label[key] ?? key} {v > 0 ? '+' : ''}{v}
                      </span>
                    );
                  })}
                </div>
              )}
              <button
                onClick={dismissPostResult}
                className="w-full mt-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-600 transition-colors"
              >
                好的
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DrawerCardProps {
  icon: React.ReactNode;
  tone: 'blue' | 'orange' | 'pink';
  title: string;
  desc: string;
  hint?: string;
  onClick: () => void;
  disabled?: boolean;
}

function DrawerCard({ icon, tone, title, desc, onClick, disabled }: DrawerCardProps) {
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
        'flex items-center gap-2 rounded-2xl px-2.5 py-2 bg-white text-left transition',
        disabled ? 'opacity-40' : 'hover:bg-gray-50 active:bg-gray-100',
      )}
    >
      <span className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', toneClass)}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-gray-800 leading-tight truncate">{title}</div>
        <div className="text-[10.5px] text-gray-400 leading-snug mt-0.5 line-clamp-2">{desc}</div>
      </div>
    </button>
  );
}

function renderWithName(raw: string, name: string): React.ReactNode {
  const parts = raw.split(/ ?\{name\} ?/g);
  return parts.reduce<React.ReactNode[]>((acc, part, i) => {
    if (i > 0) acc.push(<strong key={`n${i}`} className="font-semibold text-gray-900">{name}</strong>);
    if (part) acc.push(part);
    return acc;
  }, []);
}

interface WeiboCardProps {
  avatar: React.ReactNode;
  nickname: string;
  time: string;
  content: React.ReactNode;
  likes: number;
  comments: number;
  reposts: number;
  selfLabel?: string;
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
  selfLabel,
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
            {selfLabel && (
              <span className="text-[9px] font-medium text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                {selfLabel}
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
