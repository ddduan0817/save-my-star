import type { GameStats, Artist, WeiboTrend, FanComment, ArtistArchetype } from '@/types/game';
import { SOCIAL_CONFIG } from '@/data/constants';

// ===== Weibo Trends =====

const scandalTrends = [
  '#{name}黑料被扒#', '#{name}人设崩塌#', '#{name}被锤#',
  '#{name}道歉#', '#{name}又翻车了#', '#{name}塌房实锤#',
  '#爆料{name}真面目#', '#{name}粉丝脱粉回踩#',
  '#{name}工作室回应争议#', '#{name}被拍到不当行为#',
  '#{name}前队友爆料#', '#某知名艺人涉嫌违规 疑似{name}#',
  '#{name}代言品牌紧急撤图#', '#{name}直播翻车名场面#',
  '#{name}私生活曝光#', '#{name}经纪团队被质疑#',
  '#{name}粉丝站关站跑路#', '#全网劝退{name}#',
  '#{name}又上热搜了 这次不是好事#', '#{name}相关话题被限流#',
  '#{name}合作方紧急切割#', '#{name}被前员工实名举报#',
  '#{name}深夜道歉长文 网友不买账#', '#{name}黑历史合集#',
];

const positiveFanTrends = [
  '#{name}超话#', '#{name}太绝了#', '#{name}YYDS#',
  '#{name}新物料#', '#谁懂{name}的魅力#', '#{name}粉丝破千万#',
  '#{name}直拍#', '#{name}又帅又能打#',
  '#{name}生日快乐#', '#{name}我可以#', '#{name}好会长#',
  '#{name}路人缘逆天#', '#{name}怼脸拍也好看#', '#{name}综艺感太强了#',
  '#被{name}笑容治愈了#', '#{name}出道N周年#', '#{name}粉丝应援太壮观了#',
  '#{name}营业好勤快#', '#{name}素颜也绝了#', '#{name}宠粉时刻#',
  '#追{name}这辈子值了#', '#{name}又双叒发福利了#', '#{name}新歌循环一万遍#',
  '#{name}舞台王者#', '#{name}反差萌#',
];

const businessTrends = [
  '#{name}新代言#', '#{name}商务资源逆天#', '#{name}品牌大使#',
  '#{name}时尚大片#', '#{name}登杂志封面#', '#{name}商业价值榜TOP#',
  '#{name}×某奢侈品牌#', '#{name}拿下顶奢代言#',
  '#{name}成为全球代言人#', '#{name}时装周邀请函曝光#',
  '#{name}商业版图再扩张#', '#{name}广告片质感绝了#',
  '#{name}成某品牌最年轻代言人#', '#{name}双十一带货破亿#',
  '#{name}又官宣新代言了#', '#{name}杂志预售秒空#',
  '#{name}机场穿搭好绝#', '#{name}活动造型太顶了#',
];

const neutralTrends = [
  '#娱乐圈又地震了#', '#某顶流深夜发文#', '#今天追星了吗#',
  '#新剧开机阵容曝光#', '#综艺路透流出#', '#选秀节目争议#',
  '#导演内涵某明星#', '#经纪人有多难当#', '#明星的一天#',
  '#饭圈文化观察#', '#娱乐圈隐藏CP#', '#明星收入排行#',
  '#某顶流被传恋爱#', '#今日份娱乐圈瓜#', '#内娱什么时候争气#',
  '#选秀出道的都怎么样了#', '#明星真实性格#', '#经纪人日常崩溃#',
  '#综艺剧本痕迹太重了#', '#某男星疑似整容#', '#今天饭圈又打架了#',
  '#谁家哥哥又营业了#', '#路人对明星的真实看法#', '#内娱需要作品不需要热搜#',
  '#明星翻车名场面合集#', '#追星追到破产#', '#你的爱豆塌房了吗#',
  '#娱乐圈学历盘点#', '#明星隐婚猜测#', '#今年最火综艺是哪个#',
  '#导演选角内幕#', '#某平台热播剧争议#', '#饭圈集资该不该管#',
  '#明星的奇葩合同#', '#经纪公司套路大全#', '#艺人解约潮#',
];

// 艺人专属热搜模板
const artistSpecificTrends: Record<ArtistArchetype, { positive: string[]; scandal: string[] }> = {
  idol: {
    positive: [
      '#{name}舞台直拍播放量破亿#', '#{name}应援色好好看#',
      '#{name}回归预告#', '#{name}粉丝手幅太壮观了#',
      '#{name}团综名场面#', '#{name}饭拍绝美#',
      '#{name}打歌舞台#', '#{name}签售会太甜了#',
    ],
    scandal: [
      '#{name}被拍到和异性逛街#', '#{name}私联粉丝被锤#',
      '#{name}前粉丝手撕#', '#{name}人气下滑严重#',
      '#{name}被爆耍大牌#', '#{name}和队友不和传闻#',
    ],
  },
  actor: {
    positive: [
      '#{name}新剧官宣#', '#{name}演技封神#',
      '#{name}入围最佳演员#', '#{name}哭戏太绝了#',
      '#{name}角色深入人心#', '#{name}剧组路透好帅#',
      '#{name}获奖感言#', '#{name}和导演互动好可爱#',
    ],
    scandal: [
      '#{name}被批演技浮夸#', '#{name}新剧口碑崩盘#',
      '#{name}抠图被骂#', '#{name}片酬曝光引争议#',
      '#{name}和对手戏演员闹不和#', '#{name}被导演公开批评#',
    ],
  },
  singer: {
    positive: [
      '#{name}新专辑#', '#{name}live太稳了#',
      '#{name}演唱会一票难求#', '#{name}高音炸裂#',
      '#{name}写歌太有才了#', '#{name}音乐节封神#',
      '#{name}新歌首日销量破百万#', '#{name}和某歌手合作#',
    ],
    scandal: [
      '#{name}被质疑假唱#', '#{name}演唱会车祸现场#',
      '#{name}被批曲风单一#', '#{name}新歌被指抄袭#',
      '#{name}和音乐博主互撕#', '#{name}综艺上破音名场面#',
    ],
  },
  influencer: {
    positive: [
      '#{name}直播间太好笑了#', '#{name}种草合集#',
      '#{name}带货记录又破了#', '#{name}日常vlog好真实#',
      '#{name}穿搭被疯狂模仿#', '#{name}和粉丝互动太接地气#',
      '#{name}探店视频播放破千万#', '#{name}又整活了#',
    ],
    scandal: [
      '#{name}带货翻车 被指虚假宣传#', '#{name}直播怼网友#',
      '#{name}被爆月入千万还卖惨#', '#{name}推荐的产品出问题了#',
      '#{name}被前助理爆料真实人品#', '#{name}滤镜关了认不出#',
    ],
  },
  socialite: {
    positive: [
      '#{name}全球代言人官宣#', '#{name}米兰时装周出街#',
      '#{name}高奢晚宴座上宾#', '#{name}新剧贵公子造型绝了#',
      '#{name}机场私服被奉为教科书#', '#{name}香槟色大片太顶了#',
      '#{name}被外媒评为"亚洲新贵"#', '#{name}慈善晚宴拍出天价#',
    ],
    scandal: [
      '#{name}被扒出道前身份#', '#{name}疑似富婆圈旧识认亲#',
      '#{name}私密群聊天截图流出#', '#{name}深夜进出豪宅被拍#',
      '#{name}代言品牌紧急暂停合作#', '#{name}团队否认"商务男模"传闻#',
    ],
  },
};

// 低数值特殊热搜
const lowMoneyTrends = [
  '#{name}被爆拖欠工资#', '#{name}经纪公司疑似资金链断裂#',
  '#某艺人团队疑似发不出工资 是{name}吗#', '#{name}被传接不到商务#',
];

const lowFanTrends = [
  '#{name}超话签到人数暴跌#', '#{name}粉丝大规模脱粉#',
  '#{name}活动现场冷清#', '#{name}还有粉丝吗#',
];

/**
 * Fisher-Yates style "good enough" shuffle. Note: `Array.sort(() => random)` is
 * not a uniform shuffle, but it's acceptable here since trend ordering is
 * cosmetic, not gameplay-critical. Centralized so we have one place to swap
 * for a stronger algorithm if needed.
 */
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, Math.min(count, arr.length));
}

function formatHeat(): string {
  const base = Math.floor(Math.random() * 9000 + 1000);
  if (base > 5000) return `${(base / 100).toFixed(0)}万`;
  return `${base}万`;
}

export function generateWeiboTrends(
  stats: GameStats,
  artist: Artist,
): WeiboTrend[] {
  const name = artist.name;
  const trends: WeiboTrend[] = [];
  let rank = 1;

  const artistPool = artistSpecificTrends[artist.id];

  // High risk → scandal trends (generic + artist-specific)
  if (stats.prRisk > SOCIAL_CONFIG.SCANDAL_TREND_RISK_THRESHOLD) {
    const count =
      stats.prRisk > SOCIAL_CONFIG.SCANDAL_TREND_HIGH_RISK_THRESHOLD
        ? SOCIAL_CONFIG.SCANDAL_TREND_COUNT_HIGH
        : SOCIAL_CONFIG.SCANDAL_TREND_COUNT_NORMAL;
    const allScandal = [...scandalTrends, ...artistPool.scandal];
    const selected = pickRandom(allScandal, count);
    for (const t of selected) {
      trends.push({
        rank: rank++,
        title: t.replace('{name}', name),
        heat: formatHeat(),
        isHot: Math.random() < 0.5,
        sentiment: 'negative',
      });
    }
  }

  // Low money → financial scandal
  if (stats.money < SOCIAL_CONFIG.LOW_MONEY_TREND_THRESHOLD) {
    const selected = pickRandom(lowMoneyTrends, 1);
    for (const t of selected) {
      trends.push({
        rank: rank++,
        title: t.replace('{name}', name),
        heat: formatHeat(),
        isHot: false,
        sentiment: 'negative',
      });
    }
  }

  // Low fan loyalty → fan exodus
  if (stats.fanLoyalty < SOCIAL_CONFIG.LOW_LOYALTY_TREND_THRESHOLD) {
    const selected = pickRandom(lowFanTrends, 1);
    for (const t of selected) {
      trends.push({
        rank: rank++,
        title: t.replace('{name}', name),
        heat: formatHeat(),
        isHot: false,
        sentiment: 'negative',
      });
    }
  }

  // High fan loyalty → fan trends (generic + artist-specific)
  if (stats.fanLoyalty > SOCIAL_CONFIG.POSITIVE_TREND_MIN_LOYALTY) {
    const count =
      stats.fanLoyalty > SOCIAL_CONFIG.POSITIVE_TREND_HIGH_LOYALTY
        ? SOCIAL_CONFIG.POSITIVE_TREND_COUNT_HIGH
        : SOCIAL_CONFIG.POSITIVE_TREND_COUNT_NORMAL;
    const allPositive = [...positiveFanTrends, ...artistPool.positive];
    const selected = pickRandom(allPositive, count);
    for (const t of selected) {
      trends.push({
        rank: rank++,
        title: t.replace('{name}', name),
        heat: formatHeat(),
        isHot: stats.fanLoyalty > SOCIAL_CONFIG.POSITIVE_TREND_HIGH_LOYALTY,
        sentiment: 'positive',
      });
    }
  }

  // High commercial → business trends
  if (stats.commercialValue > SOCIAL_CONFIG.BUSINESS_TREND_MIN_COMMERCIAL) {
    const count =
      stats.commercialValue > SOCIAL_CONFIG.BUSINESS_TREND_HIGH_COMMERCIAL
        ? SOCIAL_CONFIG.BUSINESS_TREND_COUNT_HIGH
        : SOCIAL_CONFIG.BUSINESS_TREND_COUNT_NORMAL;
    const selected = pickRandom(businessTrends, count);
    for (const t of selected) {
      trends.push({
        rank: rank++,
        title: t.replace('{name}', name),
        heat: formatHeat(),
        isHot: false,
        sentiment: 'positive',
      });
    }
  }

  // Fill rest with neutral (aim for ~7-9 total)
  const target =
    SOCIAL_CONFIG.TARGET_TREND_COUNT_MIN +
    Math.floor(Math.random() * SOCIAL_CONFIG.TARGET_TREND_COUNT_RANDOM_RANGE);
  const remaining = Math.max(
    SOCIAL_CONFIG.TARGET_TREND_COUNT_MIN_FILL,
    target - trends.length,
  );
  const neutralSelected = pickRandom(neutralTrends, remaining);
  for (const t of neutralSelected) {
    trends.push({
      rank: rank++,
      title: t.replace('{name}', name),
      heat: formatHeat(),
      isHot: false,
      sentiment: 'neutral',
    });
  }

  // 按热度数值降序排列，然后重新编号
  trends.sort((a, b) => {
    const parseHeat = (h: string) => parseFloat(h.replace('万', ''));
    return parseHeat(b.heat) - parseHeat(a.heat);
  });
  return trends.map((t, i) => ({ ...t, rank: i + 1 }));
}

// ===== Fan Comments =====

const supportiveComments = [
  '永远支持你！加油！', '今天也好帅/好美！', '冲鸭！我们一直在！',
  '啊啊啊太好看了吧', '妈妈爱你！', '你值得所有美好的事',
  '追星追到最好的了', '这才是真正的艺人！', '笑死 又被圈粉了',
  '你好好休息 我们等你', '今天也是为你骄傲的一天', '别理那些黑子 我们挺你',
  '每天第一件事就是打开超话', '已经安利给所有朋友了', '你是我见过最努力的艺人',
  '宝宝加油 粉丝永远是你的后盾', '啊啊啊我要疯了 好喜欢', '全世界最好的就是你',
  '看到你开心我就开心', '今天的物料好多 好幸福', '你笑起来好好看',
  '刚入坑 已经无法自拔了', '别管外面说什么 做自己就好', '活该你红！太优秀了',
  '看完直拍 今晚不用睡了', '这个人到底有多少面啊 全是魅力',
  '呜呜呜 太帅了我不行了', '你是我的快乐源泉', '每天都有新的心动瞬间',
  '事业粉狂喜！', '你的努力大家都看到了', '这颜值 真的犯规了',
];

const angryComments = [
  '真的好失望...', '你对得起粉丝吗', '脱粉了 再见', '路转黑',
  '早就看出来了 人设而已', '粉丝的钱是大风刮来的？',
  '别装了 累不累', '以前多喜欢 现在多讨厌',
  '说好的宠粉呢？', '营业了就来 不营业就消失？', '经纪团队是摆设吗',
  '粉了三年 换来的就是这个？', '你变了', '取关了 不伺候了',
  '从今天起我不追了', '心寒了 真的心寒了', '对你期望太高是我的错',
  '以后再也不花钱了', '你的良心不会痛吗', '再见 祝好（不是真的祝好）',
  '连道歉都敷衍', '你不配拥有这么好的粉丝', '失望透顶',
  '追星三年一场空', '我要去追别人了 告辞',
];

const hateComments = [
  '塌房活该 早该凉了', '就这还有人喜欢？？', '黑料一箩筐',
  '啥时候退圈啊 等着呢', '爬', '哈哈哈终于翻车了',
  '资源咖 没实力就是没实力', '路人表示很反感',
  '糊了糊了 可以下去了', '德不配位', '圈钱圈到没底线',
  '有这流量不如给有实力的人', '翻车翻得好 大快人心',
  '营销号赶紧来搬', '什么垃圾 占公共资源', '就这也配上热搜？',
  '一看就不是什么好人', '迟早要完', '求求了 别出来恶心人了',
  '凉了 下一位', '这人还没凉？', '粉丝洗不动了吧',
  '笑死 公关稿都写不好', '真·红不过三天',
];

const neutralComments = [
  '路过 看看热闹', '这个人最近好火啊', '不了解 有人科普一下吗',
  '吃瓜ing', '围观不站队', '热搜又见 频率好高',
  '有没有人理性分析一下', '客观来说 有好有坏吧', '这瓜有后续吗',
  '刚从别的热搜过来 什么情况', '坐等反转', '先不表态 再看看',
  '这一行真的不容易', '不粉不黑 路人观感还行', '看完评论区我更迷糊了',
  '这条热搜是买的吧', '天天上热搜 有完没完', '所以到底什么情况',
  '吃完这个瓜我去睡了', '现在的娱乐圈真的...', '正在搬小板凳看戏',
  '评论区好精彩 比正片好看', '关注此事后续发展', '有一说一 确实',
];

// 艺人专属评论
const artistComments: Record<ArtistArchetype, { supportive: string[]; angry: string[] }> = {
  idol: {
    supportive: [
      '帅帅帅！每一帧都是壁纸', '哥哥下次见面会什么时候啊',
      '今天也是为哥哥打投的一天', '偶像就该是你这个样子',
      '快发自拍！！！', '演唱会求加场！！',
      '小卡交换有人吗', '哥哥看我看我看我！！！',
    ],
    angry: [
      '营业都不会营业了', '什么时候发自拍？失踪人口吧',
      '隔壁都在营业 你在哪', '粉丝为你做了多少你知道吗',
    ],
  },
  actor: {
    supportive: [
      '期待新剧！！', '演技真的绝了 每个角色都不一样',
      '这才是真正的演员', '刚看完你的剧 哭死我了',
      '求你多接好剧本', '影帝/影后预定！', '老戏骨看了都得夸',
      '你让我相信了角色是真实存在的',
    ],
    angry: [
      '接的都什么烂剧', '能不能挑挑剧本', '演技退步了吧',
      '流量明星去演戏就是灾难',
    ],
  },
  singer: {
    supportive: [
      '新歌单曲循环中', '这嗓子是老天爷赏饭吃',
      '演唱会太炸了！！', 'live就是比录音棚好听',
      '什么时候出新专 等不及了', '这个高音 绝了绝了', '唱功天花板',
      '能不能出个全国巡演啊',
    ],
    angry: [
      '最近发的什么歌 越来越难听了', '以前的歌好听多了',
      '是江郎才尽了吗', '别综艺了 好好做音乐吧',
    ],
  },
  influencer: {
    supportive: [
      '按你推荐的买了 真的好用', '笑死 你的段子太绝了',
      '直播间蹲到了 开心', '你推荐的我闭眼入',
      '终于营业了 等好久了', '日常太有趣了 好真实', '求链接！！！',
      '你是我见过最真实的博主',
    ],
    angry: [
      '你推荐的东西越来越贵了', '恰饭归恰饭 能不能走心点',
      '明明是广告还装种草', '你和以前不一样了 全是商务',
    ],
  },
  socialite: {
    supportive: [
      '贵公子本公子了 太帅了', '今天的大片又让我破产',
      '{name}的香槟色真的无人能敌', '听说今天又官宣了新代言？',
      '我们家公子出门都是头等舱', '格调永远拿捏', '内娱顶奢担当就是你',
      '你穿什么我买什么',
    ],
    angry: [
      '别装贵公子了 我们都知道你以前干嘛的', '代言吃相别太难看',
      '你和那个富婆到底什么关系 说清楚', '能不能别接这种低端综艺 掉价',
    ],
  },
};

const avatarColors = [
  '#FB923C', '#F97316', '#EA580C', '#FDBA74', '#FED7AA',
  '#F59E0B', '#FBBF24', '#D97706', '#FDE68A',
  '#EF4444', '#F87171', '#FCA5A5',
  '#EC4899', '#F472B6', '#FBCFE8',
  '#A78BFA', '#8B5CF6', '#C4B5FD',
  '#60A5FA', '#3B82F6', '#93C5FD',
  '#34D399', '#10B981', '#6EE7B7',
  '#F472B6', '#E879F9', '#C084FC',
  '#FB7185', '#FDA4AF', '#FECDD3',
];

// 通用昵称（路人 / 吃瓜群众）
const genericNicknames = [
  '吃瓜群众', '路人甲', '不明真相围观', '娱乐博主', '理性讨论',
  '微博冲浪选手', '十级冲浪', '瓜田守望者', '贵圈真乱',
  '娱乐圈老司机', '刚下飞机', '蹲一个瓜', '冷静分析',
  '吃完这个瓜我就走', '不关注但总能看到', '理性路人',
  '今日份娱乐', '某不愿透露姓名的网友', '前排吃瓜',
];

// 艺人专属粉丝昵称（会替换 {name}）
const artistNicknames: Record<ArtistArchetype, string[]> = {
  idol: [
    '帅帅的小太阳', '{name}老婆', '甄帅全球后援会',
    '帅帅今天营业了吗', 'C位永远是帅帅', '甄爱帅帅',
    '{name}超话管理', '帅帅数据组', '为帅帅打投第365天',
    '帅帅的氪金粉', '追帅帅追到地老天荒', '帅帅冲鸭',
    '{name}反黑站', '帅帅的小棉袄', '只看帅帅舞台',
  ],
  actor: [
    '丽姐演技粉', '{name}影迷会', '郝美丽作品站',
    '丽姐拿影后我请客', '美丽姐姐加油', '{name}全球粉丝团',
    '等丽姐新剧等到秃头', '丽姐的老粉', '只为演技追{name}',
    '郝美丽路人粉', '{name}颜值担当', '看丽姐哭戏我先哭了',
    '丽姐选剧本我放心', '追丽姐第三年', '美丽永远美丽',
  ],
  singer: [
    '八哥的音乐粉', '{name}全球歌迷会', '高八度live永远的神',
    '八哥新歌循环中', '为八哥高音尖叫', '{name}演唱会蹲票中',
    '高八度超话管理', '八哥的死忠粉', '听{name}的歌长大的',
    '{name}音乐站', '八哥唱功天花板', '等八哥巡演等到退休',
    '高八度反黑组', '八哥我可以', '只听{name}的歌',
  ],
  influencer: [
    '冰冰的小粉丝', '{name}日常搬运', '冷冰凝种草笔记',
    '冰冰推荐我闭眼入', '冰冰直播间蹲守', '{name}粉丝后援团',
    '冰冰的铁粉', '跟着冰冰买买买', '{name}探店合集',
    '冰冰太真实了', '冷冰凝颜值粉', '看冰冰日常好治愈',
    '冰冰加油站', '{name}的路人粉', '冰冰段子手',
  ],
  socialite: [
    '陌陌的贵公子', '{name}的香槟色', '南陌全球后援会',
    '陌少的小蜜蜂', '陌陌氪金粉', '{name}时尚站',
    '南陌反黑组', '陌陌高奢 bot', '贵公子爱好者',
    '{name}的钱包们', '陌少今天又美了', '追{name}到顶奢',
    '陌陌小跟班', '看陌陌红毯我破防了', '南陌数据组',
  ],
};

export function generateFanComments(stats: GameStats, artist: Artist): FanComment[] {
  const comments: FanComment[] = [];
  const artistPool = artistComments[artist.id];

  // Determine distribution based on stats
  let supportiveRatio = 0.4;
  let angryRatio = 0.2;
  let hateRatio = 0.1;
  let neutralRatio = 0.3;

  if (stats.fanLoyalty > 70) {
    supportiveRatio = 0.6;
    angryRatio = 0.1;
    hateRatio = 0.05;
    neutralRatio = 0.25;
  } else if (stats.fanLoyalty < 30) {
    supportiveRatio = 0.15;
    angryRatio = 0.35;
    hateRatio = 0.2;
    neutralRatio = 0.3;
  }

  if (stats.prRisk > 60) {
    hateRatio += 0.15;
    angryRatio += 0.1;
    supportiveRatio -= 0.2;
    neutralRatio -= 0.05;
  }

  // Generate 10-12 comments for more variety
  const total = 10 + Math.floor(Math.random() * 3);
  const counts = {
    supportive: Math.max(0, Math.round(total * supportiveRatio)),
    angry: Math.max(0, Math.round(total * angryRatio)),
    hate: Math.max(0, Math.round(total * hateRatio)),
    neutral: 0,
  };
  counts.neutral = Math.max(1, total - counts.supportive - counts.angry - counts.hate);

  // Merge generic + artist-specific pools
  const pools: Record<string, string[]> = {
    supportive: [...supportiveComments, ...artistPool.supportive],
    angry: [...angryComments, ...artistPool.angry],
    hate: hateComments,
    neutral: neutralComments,
  };

  const sentimentTypes = ['supportive', 'angry', 'hate', 'neutral'] as const;

  for (const sentiment of sentimentTypes) {
    const count = counts[sentiment];
    const selected = pickRandom(pools[sentiment], count);
    for (const content of selected) {
      // 粉丝/脱粉用艺人相关昵称，路人/黑粉用通用昵称
      const isFanNick = sentiment === 'supportive' || sentiment === 'angry';
      const nickPool = isFanNick ? artistNicknames[artist.id] : genericNicknames;
      const rawNick = nickPool[Math.floor(Math.random() * nickPool.length)];
      const nickname = rawNick.replace('{name}', artist.name);

      comments.push({
        id: `comment-${comments.length}-${Math.random().toString(36).slice(2, 6)}`,
        avatar: avatarColors[Math.floor(Math.random() * avatarColors.length)],
        nickname,
        content,
        likes: Math.floor(Math.random() * 5000),
        sentiment,
      });
    }
  }

  // Shuffle for visual variety
  return shuffle(comments);
}
