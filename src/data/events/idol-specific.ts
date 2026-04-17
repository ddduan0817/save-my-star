import type { GameEvent } from '@/types/game';

// 甄帅（流量偶像/男）专属事件
export const idolSpecificEvents: GameEvent[] = [
  {
    id: 'idol_fan_fundraise_scandal',
    category: 'crisis',
    severity: 'high',
    title: '粉丝集资账目出问题了',
    description: '后援会被爆出集资款项去向不明，上百万粉丝的钱不知道花到哪里去了。虽然是后援会的锅，但"XX粉丝被割韭菜"的热搜已经上了，品牌方在观望你的态度。',
    emoji: '💸',
    forArtist: 'idol',
    minDay: 6,
    choices: [
      {
        id: 'intervene_fundraise',
        text: '官方介入整顿',
        subtext: '发声明要求后援会公开账目',
        outcome: {
          narration: '工作室发声明要求后援会48小时内公开所有账目，并宣布以后禁止以艺人名义集资。粉丝说"哥哥终于管了"，路人觉得这才是负责任的偶像。',
          statChanges: { fanLoyalty: 6, prRisk: -3, commercialValue: 3 },
        },
      },
      {
        id: 'distance_fundraise',
        text: '撇清关系',
        subtext: '"后援会行为与艺人无关"',
        outcome: {
          narration: '声明一出，粉丝心寒了。"出事了就撇清，享受的时候怎么不说无关？"脱粉潮开始了。',
          statChanges: { fanLoyalty: -9, prRisk: 3 },
        },
      },
      {
        id: 'compensate_fans',
        text: '自掏腰包补偿粉丝',
        subtext: '把缺的钱补上 (-8万)',
        requireMinMoney: 56000,
        outcome: {
          narration: '你让艺人私下补上了后援会的亏空。消息传出去后，"教科书级别的偶像"成了新标签。品牌方对这种负责任的态度印象深刻。',
          statChanges: { money: -56000, fanLoyalty: 12, prRisk: -5, commercialValue: 5 },
        },
      },
    ],
  },
  {
    id: 'idol_trainee_challenger',
    category: 'drama',
    severity: 'medium',
    title: '新生代选秀冠军公开叫板',
    description: '今年最火的选秀节目冠军在采访中说"流量偶像的时代该翻篇了"，粉丝们认定这是在针对甄帅。两边粉丝已经在超话互撕三个小时了。',
    emoji: '⚡',
    forArtist: 'idol',
    minDay: 8,
    choices: [
      {
        id: 'mentor_stance',
        text: '前辈姿态',
        subtext: '公开鼓励后辈',
        outcome: {
          narration: '"每个时代都有属于它的偶像，希望你也能走得更远。"这段回应被赞"格局打开"，路人好感飙升。后辈反而显得小家子气了。',
          statChanges: { fanLoyalty: 5, commercialValue: 6, prRisk: -3 },
        },
      },
      {
        id: 'data_flex',
        text: '用数据说话',
        subtext: '晒出成绩单',
        outcome: {
          narration: '工作室"不经意间"放出了最新的代言数据和演唱会售票率。数据碾压级的差距让对方粉丝沉默了，但也显得有点"欺负新人"。',
          statChanges: { commercialValue: 3, prRisk: 3, fanLoyalty: 3 },
        },
      },
      {
        id: 'collab_rival',
        text: '约他一起上综艺',
        subtext: '化敌为友',
        outcome: {
          narration: '你主动联系对方经纪人，安排了一次综艺同台。节目上两人互相调侃的化学反应炸了，"世纪大和解"上了热搜。两边粉丝都说"磕到了"。',
          statChanges: { fanLoyalty: 7, commercialValue: 5, prRisk: -5 },
        },
      },
    ],
  },
  {
    id: 'idol_nightclub',
    category: 'crisis',
    severity: 'high',
    title: '深夜出入夜店被拍',
    description: '凌晨三点，你的艺人被拍到从高档夜店出来，还搂着一个不认识的人。照片虽然模糊但身份无疑。"偶像人设崩塌"的讨论已经开始了。',
    emoji: '🌙',
    forArtist: 'idol',
    minDay: 10,
    choices: [
      {
        id: 'friend_story',
        text: '解释是朋友聚会',
        subtext: '"给朋友过生日而已"',
        outcome: {
          narration: '"给大学同学庆生"的解释有一半人信了。但"凌晨三点的夜店生日会"这个说法确实有点勉强...评论区充满了质疑。',
          statChanges: { prRisk: 6, fanLoyalty: -5 },
        },
      },
      {
        id: 'own_lifestyle',
        text: '坦然面对',
        subtext: '"我也有自己的生活"',
        outcome: {
          narration: '甄帅发了一条微博："工作之余也需要放松，谢谢大家关心。"路人觉得正常，但核心粉丝接受不了"偶像去夜店"的事实。',
          statChanges: { prRisk: 3, fanLoyalty: -7, commercialValue: 3 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 70 },
              narration: '因为粉丝忠诚度极高，大部分人选择了理解。"他也是普通人"的论调占据主流，危机很快就过去了。',
              statChanges: { prRisk: 3, fanLoyalty: -3, commercialValue: 3 },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'idol_dating_ban',
    category: 'business',
    severity: 'medium',
    title: '代言方要求签恋爱禁令',
    description: '一个顶级快消品牌想签甄帅，但合同里有一条"代言期间不得公开恋爱关系"的条款。代言费很可观，但这条禁令意味着未来两年都得"假装单身"。',
    emoji: '💍',
    forArtist: 'idol',
    minDay: 8,
    choices: [
      {
        id: 'accept_ban',
        text: '签！赚钱要紧',
        subtext: '接受恋爱禁令条款',
        outcome: {
          narration: '合同签了，代言费到手。但你知道这等于在甄帅脖子上套了一个随时会收紧的绳圈——万一恋情曝光，违约金是代言费的三倍。',
          statChanges: { money: 180000, commercialValue: 6, prRisk: 3 },
        },
      },
      {
        id: 'negotiate_ban',
        text: '协商去掉这条',
        subtext: '争取合理条款',
        outcome: {
          narration: '品牌方坚持不让步，谈判陷入僵局。最终你拿到了一个折中方案：代言费降20%但没有恋爱禁令。也算不亏。',
          statChanges: { money: 130000, commercialValue: 5 },
        },
      },
    ],
  },
];
