import type { GameEvent } from '@/types/game';

export const cosmeticEvents: GameEvent[] = [
  {
    id: 'cosmetic_brand_hint',
    category: 'business',
    severity: 'low',
    title: '品牌方暗示：颜值差点意思',
    description: '某奢侈品牌在谈代言，对方总监委婉地说"形象再精致一点就完美了"。言外之意……你懂的。',
    emoji: '💄',
    minDay: 4,
    statConditions: { minCommercial: 35 },
    choices: [
      {
        id: 'brand_go_cosmetic',
        text: '去医美机构咨询一下',
        subtext: '花点钱解决',
        emoji: '🏥',
        outcome: {
          narration: '带艺人去了顶级医美机构咨询。医生说"底子不错，稍微调整一下就很完美"。代言的事有戏了。',
          statChanges: { money: -10000, commercialValue: 1 },
          unlockTag: 'cosmetic_brand_pressure',
        },
      },
      {
        id: 'brand_refuse_cosmetic',
        text: '用实力和作品说话',
        subtext: '坚持自然',
        emoji: '💪',
        outcome: {
          narration: '"我的艺人不需要整容。"品牌方沉默了几秒，最后还是签了——只是代言费砍了30%。',
          statChanges: { fanLoyalty: 2, money: -15000 },
        },
      },
      {
        id: 'brand_switch',
        text: '换个不看脸的品牌',
        subtext: '另寻出路',
        emoji: '🔄',
        outcome: {
          narration: '转而联系了几个运动品牌，对方对"有性格""真实感"的形象很感兴趣。虽然钱少点，但省心。',
          statChanges: { commercialValue: -1, fanLoyalty: 1 },
        },
      },
    ],
  },
  {
    id: 'cosmetic_variety_question',
    category: 'pr',
    severity: 'medium',
    title: '综艺直播：主持人灵魂发问',
    description: '综艺录制中，主持人突然问"网上说你动过脸，你怎么回应？"全场安静了，镜头对准你的艺人……',
    emoji: '🎤',
    minDay: 5,
    requiredTags: ['cosmetic_discovered'],
    choices: [
      {
        id: 'variety_admit',
        text: '坦然承认',
        subtext: '大方回应',
        emoji: '😊',
        outcome: {
          narration: '"对，做了一些调整，每个人都有变美的权利。"现场响起掌声，弹幕刷满"好真诚"。',
          statChanges: { fanLoyalty: 3, prRisk: -4 },
          unlockTag: 'cosmetic_admitted',
          conditionalOutcomes: [
            {
              condition: { maxFanLoyalty: 30 },
              narration: '"对，做了调整。"但粉丝本来就少，这番坦白让仅存的"原装粉"也走了……',
              statChanges: { fanLoyalty: -3, prRisk: 2 },
            },
          ],
        },
      },
      {
        id: 'variety_deny',
        text: '否认到底',
        subtext: '死不承认',
        emoji: '🙅',
        outcome: {
          narration: '"没有，都是灯光和角度问题。"主持人意味深长地笑了笑。网友开始疯狂挖旧照对比……',
          statChanges: { prRisk: 5 },
          twist: {
            chance: 0.5,
            narration: '有人找到了你艺人进出医美机构的高清监控截图！"打脸"话题直冲热搜第一。',
            statChanges: { prRisk: 8, fanLoyalty: -5 },
          },
        },
      },
      {
        id: 'variety_humor',
        text: '幽默带过',
        subtext: '用段子化解',
        emoji: '😆',
        outcome: {
          narration: '"我这是充值了颜值VIP~"全场爆笑。这个回应被剪成短视频疯传——"高情商""太会了"。',
          statChanges: { fanLoyalty: 2, prRisk: -2, commercialValue: 1 },
        },
      },
    ],
  },
  {
    id: 'cosmetic_fan_discover',
    category: 'crisis',
    severity: 'medium',
    title: '整容前后对比照疯传',
    description: '某营销号发了一组你艺人的"整容前后对比照"，出道时期和现在的脸差距明显。话题 #XX整容实锤# 阅读量已经破亿。',
    emoji: '📸',
    minDay: 6,
    requiredTags: ['cosmetic_discovered'],
    excludeTags: ['cosmetic_admitted'],
    choices: [
      {
        id: 'fan_discover_legal',
        text: '发律师函删帖',
        subtext: '法律手段应对',
        emoji: '⚖️',
        outcome: {
          narration: '律师函一出，营销号删帖了。但网友早已截图保存——"越删越证明心虚"。',
          statChanges: { money: -30000, prRisk: 2 },
          twist: {
            chance: 0.4,
            narration: '删帖反而激发了"史翠珊效应"，更多人开始传播对比照。热度不降反升。',
            statChanges: { prRisk: 6, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'fan_discover_ignore',
        text: '不回应，等热度过去',
        subtext: '冷处理',
        emoji: '🙈',
        outcome: {
          narration: '选择沉默。热度确实在几天后降了，但"整过"已经成为固定标签了。',
          statChanges: { prRisk: 3, fanLoyalty: -2 },
        },
      },
      {
        id: 'fan_discover_own_it',
        text: '"我的脸我做主"',
        subtext: '正面回应',
        emoji: '✊',
        outcome: {
          narration: '"每个人都有追求美的权利。"这个回应引发两极讨论，但支持者明显更多。',
          statChanges: { prRisk: -2, fanLoyalty: 1, commercialValue: 1 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 60 },
              narration: '"我的选择我做主！"忠实粉丝集体控评支持，路人好感也上升了。"自信就是最好的整容"上了热搜。',
              statChanges: { prRisk: -5, fanLoyalty: 3, commercialValue: 2 },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'cosmetic_stiff_trending',
    category: 'crisis',
    severity: 'high',
    title: '僵脸上热搜',
    description: '你艺人的近照被网友放大研究，"表情管理失败""笑起来好僵"的话题冲上热搜。对比图满天飞，连表情包都做出来了……',
    emoji: '😶',
    minDay: 4,
    requiredTags: ['stiff_face_active'],
    choices: [
      {
        id: 'stiff_pr_crisis',
        text: '砸钱紧急公关',
        subtext: '花大价钱压热搜',
        emoji: '💰',
        requireMinMoney: 50000,
        outcome: {
          narration: '花了一大笔钱请公关团队压热搜、引导舆论。效果还行，话题逐渐被其他新闻覆盖了。',
          statChanges: { money: -50000, prRisk: -3 },
        },
      },
      {
        id: 'stiff_wait',
        text: '等风头过去',
        subtext: '反正脸会恢复的',
        emoji: '🕐',
        outcome: {
          narration: '什么都没做。热搜挂了一整天，"僵脸"成了你艺人的新外号。等它自然消退吧……',
          statChanges: { prRisk: 8, fanLoyalty: -3 },
        },
      },
      {
        id: 'stiff_self_mock',
        text: '自嘲回应',
        subtext: '用自黑化解尴尬',
        emoji: '😜',
        outcome: {
          narration: '"确实最近脸有点僵哈哈，是我打了太多瘦脸针~"坦率的回应收获不少好评。',
          statChanges: { fanLoyalty: 2, prRisk: -1 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 50 },
              narration: '自嘲短视频爆火，粉丝疯狂转发"我家哥哥/姐姐太可爱了"。化危为机！',
              statChanges: { fanLoyalty: 5, prRisk: -4, commercialValue: 1 },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'cosmetic_endorsement',
    category: 'business',
    severity: 'low',
    title: '医美品牌代言机会',
    description: '某知名医美品牌想签你的艺人做代言人——"颜值在线，就是最好的活广告。"但接医美代言……会不会坐实整容传闻？',
    emoji: '💎',
    minDay: 6,
    choices: [
      {
        id: 'cosmetic_endorse_accept',
        text: '接！钱给到位就行',
        subtext: '高收入但可能引发议论',
        emoji: '💰',
        outcome: {
          narration: '签约了医美品牌代言，代言费非常可观。但评论区已经炸了——"这不就是承认整过了吗？"',
          statChanges: { money: 80000, commercialValue: 2, prRisk: 4 },
          unlockTag: 'cosmetic_endorsed',
        },
      },
      {
        id: 'cosmetic_endorse_reject',
        text: '拒绝，怕惹争议',
        subtext: '安全第一',
        emoji: '✋',
        outcome: {
          narration: '婉拒了医美品牌的代言。经纪人有点心疼那笔钱，但避免了不必要的争议。',
          statChanges: { commercialValue: -1 },
        },
      },
    ],
  },
];
