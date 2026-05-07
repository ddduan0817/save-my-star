// 每日晨间简报生成器
// ----------------------------------------------------
// 给玩家在每天开始时看到的"娱乐圈早报" —— 一句拟声词式的氛围文案，
// 让 20 天的节奏不至于被纯系统数字撑满。
//
// 设计原则：
// 1. 简报的"语调"取决于当前 stats（高人气/低人气/高风险）
// 2. 至少有 1 行参考本季的 modifier（让大环境贯穿）
// 3. 一定概率打断大环境，给"塌房圈外消息"来增加随机感（让玩家觉得世界还在动）
// 4. 长度控制在 1–2 行，避免抢戏
//
// 这里不依赖 React/zustand，只是纯函数；endDay.ts / startGame 里调用它。
//
// 注：文案口吻刻意半娱乐圈半八卦风，符合游戏整体调性。

import type { Artist, GameStats } from '@/types/game';
import type { ArtistMentalState } from '@/types/new_systems';
import type { SeasonalModifier } from '@/data/seasonalModifiers';

interface BriefingContext {
  day: number;
  stats: GameStats;
  artist: Artist;
  modifiers: SeasonalModifier[];
  mentalState: ArtistMentalState;
  /** 是否是开局首日（影响开场白） */
  firstDay: boolean;
}

// ---- 各类素材池 ------------------------------------------------------------

const FIRST_DAY_OPENERS = [
  '🌅 微博热搜还没起床，你已经在签新合同了。',
  '🌅 经纪公司大门刚开，工作群已经 99+ 条。',
  '🌅 今天是接手 TA 的第一天，希望不会塌房。',
];

const HIGH_RISK_LINES = [
  '🚨 营销号在群里转发昨晚的瓜，每个人都在 @你。',
  '🚨 通稿组的小姐姐今天换了第三杯咖啡，眼睛通红。',
  '🚨 公关老师早上六点发来电话，说"这事得压一压"。',
];

const LOW_LOYALTY_LINES = [
  '😶 超话签到人数比昨天又少了几百，掉得肉眼可见。',
  '😶 后援会会长在小群里委婉地问"哥/姐还有规划吗？"',
  '😶 死忠粉在评论区维护得很辛苦，看着就累。',
];

const HIGH_FAME_LINES = [
  '🔥 路人盘已经爆了，路边大屏全是 TA 的脸。',
  '🔥 抖音 BGM 又是 TA 那段 OST，刷十条出现八条。',
  '🔥 时尚芭莎、嘉人编辑的私信叠到了 99+。',
];

const NORMAL_LINES = [
  '☕ 工作室门口的咖啡车今天换了限定口味。',
  '☕ 助理小张迟到了 10 分钟，说地铁堵了。',
  '☕ 公司前台收到三束粉丝送来的鲜花，留言条措辞像情书。',
  '☕ 楼下健身房又来了三个想"偶遇"TA 的小姑娘。',
];

const LOW_MOOD_LINES = [
  '🌧 助理说 TA 早上没出酒店房间，让先把今天的通告挪到下午。',
  '🌧 化妆师小声跟你说，"姐/哥今天的眼神不太对"。',
];

const HIGH_BURNOUT_LINES = [
  '💤 司机说 TA 在车上一句话没说，靠在窗边睡着了。',
  '💤 经纪助理在备忘录上偷偷写了"是不是该让 TA 休息一下"。',
];

// ---- 大环境联动文案 -------------------------------------------------------

const MODIFIER_FLAVOR: Record<string, string[]> = {
  variety_year: [
    '📺 隔壁工作室又有人接了第三档综艺。',
    '📺 综艺总导演的助理今早给你打了三通电话问档期。',
  ],
  fanquan_crackdown: [
    '⚖️ 超话又挂了一批控评号，粉头在群里求"低调一点"。',
    '⚖️ 清朗办最新动态：再有数据造假就处罚。',
  ],
  economic_downturn: [
    '📉 三家品牌方今早发邮件想砍预算。',
    '📉 朋友圈一片"今年生意难做"，连茶艺师都涨价了。',
  ],
  paparazzi_era: [
    '📸 八点见的工作室对面又出现了陌生车牌。',
    '📸 据说昨晚有人蹲到了某顶流，这两天人人自危。',
  ],
  top_star_retirement: [
    '🌠 又一个 S 级宣布退圈，资源招标群炸开了锅。',
    '🌠 之前对手家的代言突然空了三个，等着新人接。',
  ],
  content_drought: [
    '🏜️ 热搜榜前十有六条是去年的旧瓜回锅。',
    '🏜️ 大家实在没瓜可吃，连你艺人的早餐都能上热搜。',
  ],
  award_season: [
    '🏆 颁奖礼公关战已经打到飞起，对家昨晚发了三篇通稿。',
    '🏆 各大奖项的评委名单刚刚流出，都在算关系。',
  ],
  cp_economy: [
    '💑 #XX 上 CP# 的话题已经爆了三个小时。',
    '💑 嗑学家们眼睛比侦探还亮，每个互动都被拉片。',
  ],
  short_video_boom: [
    '📱 抖音切片号又涨了 30w 粉，全是搬运 TA 的剧。',
    '📱 平台运营找你聊"独家分成"，开价不低。',
  ],
  policy_tightening: [
    '📜 新规又下来了：高片酬要登记备案。',
    '📜 财务老师今天看你的眼神比税务局还严肃。',
  ],
};

// ---- 主入口 ----------------------------------------------------------------

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDailyBriefing(ctx: BriefingContext): string {
  const { day, stats, modifiers, mentalState, firstDay } = ctx;
  const lines: string[] = [];

  // 首日加一个特殊开场
  if (firstDay) {
    lines.push(pick(FIRST_DAY_OPENERS));
  }

  // 1) 主线情绪线 —— 优先级：高风险 > 低忠诚 > 高名气 > 普通
  const fame = stats.commercialValue + stats.fanLoyalty;
  if (stats.prRisk >= 70) {
    lines.push(pick(HIGH_RISK_LINES));
  } else if (stats.fanLoyalty < 35 && day >= 3) {
    lines.push(pick(LOW_LOYALTY_LINES));
  } else if (fame >= 130) {
    lines.push(pick(HIGH_FAME_LINES));
  } else {
    lines.push(pick(NORMAL_LINES));
  }

  // 2) 大环境联动 —— 70% 概率出一行（避免每天都念同一张卡）
  if (modifiers.length > 0 && Math.random() < 0.7) {
    const m = pick(modifiers);
    const pool = MODIFIER_FLAVOR[m.id];
    if (pool) lines.push(pick(pool));
  }

  // 3) 心理状态加注 —— 低 mood / 高倦怠时偶尔提醒
  if (mentalState.mood < 25 && Math.random() < 0.5) {
    lines.push(pick(LOW_MOOD_LINES));
  } else if (mentalState.burnout > 70 && Math.random() < 0.5) {
    lines.push(pick(HIGH_BURNOUT_LINES));
  }

  return lines.join('\n');
}
