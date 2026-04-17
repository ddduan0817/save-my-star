import type { GameEvent } from '@/types/game';

export const dramaEvents: GameEvent[] = [
  {
    id: 'drama_rival_diss',
    category: 'drama',
    severity: 'medium',
    title: '同行内涵你的艺人了！',
    description: '另一位当红艺人在采访中说了一句"有些人红是因为运气好"，虽然没点名，但所有人都觉得在说你。你的粉丝已经炸了，等你一声令下。',
    emoji: '😒',
    minDay: 5,
    choices: [
      {
        id: 'fire_back',
        text: '直接回怼',
        subtext: '社交媒体上隔空喊话',
        emoji: '🔥',
        outcome: {
          narration: '艺人发了一条意味深长的微博："运气是留给有准备的人的。"粉丝嗨了，对方粉丝也嗨了，一场骂战正式开始。',
          statChanges: { prRisk: 15, fanLoyalty: 8, commercialValue: 3 },
          specialEffect: 'fan_war',
        },
      },
      {
        id: 'high_road',
        text: '高姿态无视',
        subtext: '用实力说话',
        emoji: '😌',
        outcome: {
          narration: '"不回应就是最好的回应。"路人纷纷站你这边，"格局大"的评价让你的艺人路人缘又涨了。',
          statChanges: { prRisk: -3, fanLoyalty: 3, commercialValue: 5 },
        },
      },
      {
        id: 'weaponize_fans',
        text: '暗示粉丝出击',
        subtext: '不公开表态但私下暗示',
        emoji: '⚔️',
        outcome: {
          narration: '粉丝们"自发"出击，把对方的黑料扒了个底朝天。虽然赢了这一仗，但"粉丝太疯了"的标签也贴上来了。',
          statChanges: { prRisk: 10, fanLoyalty: 5 },
        },
      },
    ],
  },
  {
    id: 'drama_cp_war',
    category: 'drama',
    severity: 'medium',
    title: 'CP粉 vs 唯粉大战！',
    description: '你的艺人和合作过的另一位艺人被磕CP磕出圈了。CP超话已经有百万粉丝。但唯粉们不干了——"我家哥哥/姐姐不需要绑定别人"。粉圈内战一触即发。',
    emoji: '💔',
    choices: [
      {
        id: 'clarify_cp',
        text: '"只是好同事"',
        subtext: '澄清关系',
        emoji: '🤝',
        outcome: {
          narration: '声明发了，CP粉心碎了，唯粉满意了。但CP热度带来的流量也没了...这笔账怎么算？',
          statChanges: { fanLoyalty: -5, prRisk: -5, commercialValue: -3 },
        },
      },
      {
        id: 'play_along',
        text: '顺水推舟',
        subtext: '不否认，偶尔互动一下',
        emoji: '😏',
        outcome: {
          narration: '暧昧的互动让CP粉疯了，热度飙升！但唯粉开始脱粉回踩："偶像为了热度什么都做得出来。"',
          statChanges: { commercialValue: 8, fanLoyalty: -8, prRisk: 5 },
        },
      },
      {
        id: 'let_burn',
        text: '不管，让他们吵',
        subtext: '有热度就行',
        emoji: '🍿',
        outcome: {
          narration: '粉圈内战越演越烈，终于闹上了热搜。不是正面热搜，是"XX粉丝又撕起来了"。这下品牌方也看到了...',
          statChanges: { prRisk: 10, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'drama_staff_leak',
    category: 'drama',
    severity: 'high',
    title: '团队出现内鬼！',
    description: '你发现最近艺人的行程、私人照片频繁被泄露给狗仔。一定是团队里有人在卖信息。你需要尽快找出这个人。',
    emoji: '🐀',
    minDay: 8,
    choices: [
      {
        id: 'fire_all',
        text: '大换血',
        subtext: '换掉所有可疑人员',
        emoji: '🔥',
        outcome: {
          narration: '你开掉了三个人，团队元气大伤。新招的人需要磨合期，这段时间工作效率下降了不少。不过至少泄密停了。',
          statChanges: { money: -50000, prRisk: -5 },
        },
      },
      {
        id: 'investigate',
        text: '暗中调查',
        subtext: '放假消息，顺藤摸瓜',
        emoji: '🔍',
        outcome: {
          narration: '你给每个人发了不同版本的假行程，结果——助理小王的版本出现在了八卦号上。抓到你了！处理掉内鬼后，团队士气反而上升了。',
          statChanges: { prRisk: -8, fanLoyalty: 3 },
        },
      },
      {
        id: 'feed_fake',
        text: '将计就计',
        subtext: '通过内鬼放假消息',
        emoji: '🎭',
        outcome: {
          narration: '你通过内鬼放出了一条假新闻，结果狗仔信以为真发了出来，被打脸后信誉大损。"这经纪人有点东西"成了圈内评价。',
          statChanges: { prRisk: -10, commercialValue: 5 },
        },
      },
    ],
  },
  {
    id: 'drama_award_snub',
    category: 'drama',
    severity: 'medium',
    title: '颁奖典礼落选了',
    description: '今年最重要的颁奖典礼提名名单公布，你的艺人竟然没有入围！粉丝们群情激愤，"暗箱操作"的阴谋论满天飞。',
    emoji: '🏆',
    minDay: 12,
    choices: [
      {
        id: 'congratulate',
        text: '大度祝贺获奖者',
        subtext: '展现风度',
        emoji: '👏',
        outcome: {
          narration: '艺人大方转发祝贺，被获奖者在领奖台上公开感谢。"这才是体面"的评价让路人好感飙升。',
          statChanges: { fanLoyalty: 5, commercialValue: 8, prRisk: -5 },
        },
      },
      {
        id: 'shade',
        text: '暗讽评委不公',
        subtext: '发一条意味深长的微博',
        emoji: '😏',
        outcome: {
          narration: '一条"有些奖不发也罢"的微博引爆了舆论。粉丝觉得偶像太酷了，但组委会把你的艺人拉进了黑名单。',
          statChanges: { fanLoyalty: 8, commercialValue: -10, prRisk: 10 },
        },
      },
      {
        id: 'boycott',
        text: '宣布不参加典礼',
        subtext: '用行动表达态度',
        emoji: '✊',
        outcome: {
          narration: '缺席成了最大的新闻。有人说"有骨气"，有人说"输不起"。这波操作评价两极分化严重。',
          statChanges: { prRisk: 8, fanLoyalty: 5, commercialValue: -5 },
        },
      },
    ],
  },
  {
    id: 'drama_collab_scandal',
    category: 'drama',
    severity: 'high',
    title: '合作方突然塌房了！',
    description: '你的艺人正在拍的电视剧男/女主角突然被曝出严重丑闻，整部剧面临停播风险。你的艺人虽然没有问题，但"同一部戏"的标签已经贴上来了。',
    emoji: '🎬',
    minDay: 10,
    choices: [
      {
        id: 'distance',
        text: '立刻切割',
        subtext: '声明与对方只是工作关系',
        emoji: '✂️',
        outcome: {
          narration: '切割声明发得很快，但有人觉得"太绝情了"。不过至少保住了自己的代言不受牵连。',
          statChanges: { prRisk: 5, commercialValue: -3 },
        },
      },
      {
        id: 'stand_by',
        text: '公开力挺',
        subtext: '"在事情查清前不做评价"',
        emoji: '🤝',
        outcome: {
          narration: '你选择了义气，但对方的丑闻越爆越大。现在连你的艺人都被拖下水了——"物以类聚"的评论满天飞。',
          statChanges: { prRisk: 20, fanLoyalty: -5 },
        },
      },
      {
        id: 'no_comment',
        text: '不表态',
        subtext: '低调等事情过去',
        emoji: '🤐',
        outcome: {
          narration: '沉默是金。等对方的事情处理完了，你的艺人也没受到太大影响。虽然这部剧可能要凉了....',
          statChanges: { prRisk: 8, money: -30000 },
        },
      },
    ],
  },
];
