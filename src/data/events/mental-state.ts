import type { GameEvent } from '@/types/game';
import type { MentalStateEffect } from '@/types/new_systems';

// 艺人心理状态相关事件
export const mentalStateEvents: GameEvent[] = [
  // ===== 心情低落事件 =====
  {
    id: 'mental_late_night_post',
    category: 'crisis',
    severity: 'medium',
    title: '艺人凌晨发emo文案',
    description: '凌晨3点，你的艺人发了一条微博：“有时候觉得，所有人喜欢的都是那个「我」，不是真的我。”粉丝开始担心，评论区全是“怎么了”“抱抱”。',
    emoji: '🌙',
    minDay: 4,
    choices: [
      {
        id: 'delete_post',
        text: '秒删，假装没发生',
        subtext: '控制舆情',
        outcome: {
          narration: '你让团队秒删了微博。但粉丝已经截图了，“心虚删博”的话题开始发酵。艺人觉得你不理解TA，关系出现裂痕。',
          statChanges: { fanLoyalty: -2, prRisk: 3 },
          mentalEffect: { mood: -10, trust: -15, stress: 5 },
        },
      },
      {
        id: 'comfort_comment',
        text: '评论“早点睡，明天还要工作”',
        subtext: '公事公办',
        outcome: {
          narration: '你的评论显得很冷漠。粉丝觉得你是“冷血经纪人”，艺人也觉得你只关心工作不关心TA。',
          statChanges: { fanLoyalty: -3 },
          mentalEffect: { mood: -5, trust: -10, cooperation: -5 },
        },
      },
      {
        id: 'private_chat',
        text: '私信问“怎么了，聊聊？”',
        subtext: '关心艺人',
        outcome: {
          narration: '艺人回复：“没事，就是突然有点累。”虽然TA说没事，但你主动关心的态度让关系缓和了一些。',
          statChanges: { fanLoyalty: 2 },
          mentalEffect: { mood: 5, trust: 10, stress: -5 },
        },
      },
      {
        id: 'embrace_vulnerability',
        text: '让艺人发后续：“谢谢关心，只是偶尔emo”',
        subtext: '走真实人设',
        outcome: {
          narration: '艺人发了后续，粉丝被这种真实打动，“原来明星也会emo”上了热搜。路人好感度上升。',
          statChanges: { fanLoyalty: 5, commercialValue: 2, prRisk: -2 },
          mentalEffect: { mood: 10, stress: -10 },
        },
      },
    ],
  },

  // ===== 拒绝营业事件 =====
  {
    id: 'mental_refuse_work',
    category: 'business',
    severity: 'high',
    title: '艺人拒绝营业',
    description: '明天有一个重要的品牌直播，艺人刚才给你发微信：“今天不想播了，能推了吗？我真的太累了。”这是本月第三次推活。',
    emoji: '😔',
    minDay: 6,
    choices: [
      {
        id: 'force_work',
        text: '强硬拒绝：“合同签了，必须去”',
        subtext: '强制执行',
        outcome: {
          narration: '艺人勉强去了，但全程黑脸，配合度极差。品牌方很不满意，粉丝也看出状态不对。',
          statChanges: { commercialValue: -5, fanLoyalty: -3, prRisk: 4 },
          mentalEffect: { mood: -15, energy: -20, trust: -20, stress: 15, burnout: 10, cooperation: -15 },
        },
      },
      {
        id: 'bribe_work',
        text: '哄着去：“播完带你去吃好吃的”',
        subtext: '利诱',
        outcome: {
          narration: '艺人勉强答应了，但直播时状态一般。虽然完成了工作，但你能感觉到TA的疲惫。',
          statChanges: { commercialValue: -2, money: -5000 },
          mentalEffect: { energy: -15, mood: -5, cooperation: -5 },
        },
      },
      {
        id: 'cancel_work',
        text: '真的推掉',
        subtext: '品牌方关系-20',
        outcome: {
          narration: '你推掉了直播。品牌方很生气，“耍大牌”的通稿开始出现。但艺人得到了休息，对你更加信任。',
          statChanges: { commercialValue: -6, prRisk: 5 },
          mentalEffect: { mood: 15, energy: 20, trust: 15, stress: -15, cooperation: 10 },
        },
      },
      {
        id: 'shorten_work',
        text: '跟品牌方商量缩短直播时间',
        subtext: '折中方案',
        outcome: {
          narration: '品牌方勉强同意缩短到30分钟。艺人虽然还是累，但感激你的协调。',
          statChanges: { commercialValue: -2 },
          mentalEffect: { energy: -5, trust: 10, cooperation: 5 },
        },
      },
    ],
  },

  // ===== 信任危机事件 =====
  {
    id: 'mental_trust_crisis',
    category: 'crisis',
    severity: 'high',
    title: '艺人发现你在查TA小号',
    description: '艺人发现你让团队监控TA的小号微博，还做了截图存档。TA质问你：“你是不是一直在监视我？”',
    emoji: '💔',
    minDay: 8,
    choices: [
      {
        id: 'admit_monitoring',
        text: '承认：“这是工作的一部分”',
        subtext: '公事公办',
        outcome: {
          narration: '艺人冷笑：“原来我只是你的工作。”信任崩塌，之后的工作配合度明显下降。',
          statChanges: { fanLoyalty: -2 },
          mentalEffect: { trust: -30, mood: -15, cooperation: -20, stress: 10 },
        },
      },
      {
        id: 'deny_monitoring',
        text: '否认：“是黑粉发的，我正好看到”',
        subtext: '撒谎',
        outcome: {
          narration: '艺人半信半疑，但这件事在TA心里埋下了怀疑的种子。',
          statChanges: { prRisk: 2 },
          mentalEffect: { trust: -10, mood: -5 },
        },
      },
      {
        id: 'apologize_monitoring',
        text: '道歉并解释：“我担心你，方式不对”',
        subtext: '真诚沟通',
        outcome: {
          narration: '艺人沉默了很久，最后说：“下次直接问我。”虽然没完全原谅，但关系有所缓和。',
          statChanges: { fanLoyalty: 3 },
          mentalEffect: { trust: -5, mood: 5, stress: -5 },
        },
      },
      {
        id: 'promise_stop',
        text: '承诺以后不再监控',
        subtext: '放权',
        outcome: {
          narration: '你承诺不再监控小号。艺人松了一口气，对你的信任反而增加了。但你也失去了对艺人私生活的掌控。',
          statChanges: { prRisk: 5 },
          mentalEffect: { trust: 20, mood: 15, stress: -10, cooperation: 10 },
        },
      },
    ],
  },

  // ===== 倦怠/想退圈事件 =====
  {
    id: 'mental_burnout',
    category: 'crisis',
    severity: 'critical',
    title: '艺人说想退圈',
    description: '艺人突然跟你说：“我不想干了。这个行业太假了，我想回老家开个咖啡馆。”TA看起来很认真，不是一时冲动。',
    emoji: '😰',
    minDay: 12,
    choices: [
      {
        id: 'panic_burnout',
        text: '慌张劝阻：“你疯了吗？现在正是上升期！”',
        subtext: '功利角度',
        outcome: {
          narration: '艺人看着你，眼神很失望：“你关心的只是上升期，不是我。”',
          statChanges: { commercialValue: -3 },
          mentalEffect: { trust: -25, mood: -20, burnout: 15, cooperation: -20 },
        },
      },
      {
        id: 'ask_reason',
        text: '问清楚原因：“发生了什么？”',
        subtext: '倾听',
        outcome: {
          narration: '艺人说了很久，关于压力、关于虚假、关于失去自我。你静静听着，TA最后说：“谢谢你听我说这些。”',
          statChanges: { fanLoyalty: 2 },
          mentalEffect: { trust: 10, mood: 10, stress: -15, burnout: -10 },
        },
      },
      {
        id: 'suggest_break',
        text: '建议休息一段时间，不退圈',
        subtext: '折中',
        outcome: {
          narration: '你提议推掉接下来一个月的非必要行程，让艺人彻底休息。艺人考虑后同意了。',
          statChanges: { commercialValue: -8, fanLoyalty: 5 },
          mentalEffect: { energy: 30, mood: 15, stress: -20, burnout: -20, trust: 15 },
        },
      },
      {
        id: 'support_quit',
        text: '支持TA的决定：“如果你真的想好了”',
        subtext: '尊重选择',
        outcome: {
          narration: '艺人很惊讶，然后笑了：“你是第一个支持我的人。”最后TA决定再坚持半年，如果还是不开心就真的退圈。',
          statChanges: { fanLoyalty: 8, commercialValue: -5 },
          mentalEffect: { trust: 25, mood: 20, stress: -15, burnout: -15, cooperation: 15 },
        },
      },
    ],
  },

  // ===== 积极事件：艺人状态好 =====
  {
    id: 'mental_good_mood',
    category: 'random',
    severity: 'low',
    title: '艺人今天状态特别好',
    description: '艺人今天心情很好，主动要求多拍几条物料，还在工作现场跟工作人员开玩笑。这种好状态不多见。',
    emoji: '😊',
    minDay: 3,
    choices: [
      {
        id: 'seize_moment',
        text: '趁机多安排工作',
        subtext: '压榨好状态',
        outcome: {
          narration: '你临时加了两个采访。艺人虽然完成了，但眼神里的光消失了。',
          statChanges: { commercialValue: 3 },
          mentalEffect: { mood: -10, energy: -15, trust: -10, burnout: 5 },
        },
      },
      {
        id: 'praise_artist',
        text: '夸TA：“今天状态真好”',
        subtext: '正向反馈',
        outcome: {
          narration: '艺人笑了：“被你发现了。”今天的工作效率特别高，成品质量也很好。',
          statChanges: { commercialValue: 2, fanLoyalty: 2 },
          mentalEffect: { mood: 10, trust: 5, cooperation: 5 },
        },
      },
      {
        id: 'ask_secret',
        text: '问：“今天怎么这么开心？”',
        subtext: '关心',
        outcome: {
          narration: '艺人神秘一笑：“秘密。”但你感觉到TA愿意跟你分享情绪了。',
          statChanges: { fanLoyalty: 1 },
          mentalEffect: { trust: 10, mood: 5 },
        },
      },
    ],
  },
];

// 根据心理状态触发的被动效果
export const mentalStatePassiveEffects: {
  condition: (state: { mood: number; energy: number; trust: number; stress: number; burnout: number }) => boolean;
  effect: MentalStateEffect;
  description: string;
}[] = [
  {
    condition: (s) => s.energy < 20,
    effect: { cooperation: -10 },
    description: '艺人过度疲劳，配合度下降',
  },
  {
    condition: (s) => s.stress > 70,
    effect: { mood: -5 },
    description: '艺人压力过大，心情持续恶化',
  },
  {
    condition: (s) => s.burnout > 60,
    effect: { energy: -5, cooperation: -10 },
    description: '艺人产生倦怠，工作效率下降',
  },
  {
    condition: (s) => s.trust > 80 && s.mood > 70,
    effect: { cooperation: 5 },
    description: '艺人与经纪人关系良好，配合度提升',
  },
  {
    condition: (s) => s.mood < 20,
    effect: { stress: 5 },
    description: '艺人情绪低落，压力增加',
  },
];
