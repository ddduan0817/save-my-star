import type { GameEvent } from '@/types/game';

// 高八度（唱跳歌手/男）专属事件
export const singerSpecificEvents: GameEvent[] = [
  {
    id: 'singer_plagiarism',
    category: 'crisis',
    severity: 'high',
    title: '新歌被指抄袭！',
    description: '高八度的新歌上线三天后，一个小众音乐人发帖称副歌部分和自己两年前的作品高度相似。音乐博主做了对比视频，确实有几个小节很像。"抄袭"的标签已经贴上来了。',
    emoji: '🎵',
    forArtist: 'singer',
    minDay: 6,
    choices: [
      {
        id: 'show_drafts',
        text: '放出创作手稿',
        subtext: '用创作过程证明原创',
        outcome: {
          narration: '你让高八度放出了从demo到成品的全部创作记录，时间线完整到无法反驳。"纯属巧合"的结论被大多数人接受了。音乐博主也改了口。',
          statChanges: { prRisk: -3, fanLoyalty: 3, commercialValue: 3 },
        },
      },
      {
        id: 'contact_musician',
        text: '私下联系原作者',
        subtext: '协商解决',
        outcome: {
          narration: '你安排高八度和那位音乐人见了面。两人聊完发现确实是巧合，对方还成了高八度的粉丝。最后一起录了一首合作曲，反转得很漂亮。',
          statChanges: { fanLoyalty: 4, commercialValue: 3, prRisk: -3, money: -14000 },
        },
      },
      {
        id: 'legal_response_plagiarism',
        text: '发律师函',
        subtext: '维护名誉权',
        outcome: {
          narration: '律师函一出，对方粉丝和音乐圈都站到了对面。"以大欺小""不讲武德"的评价满天飞。这步棋走错了。',
          statChanges: { prRisk: 5, fanLoyalty: -3, money: -20000 },
        },
      },
    ],
  },
  {
    id: 'singer_festival_stage',
    category: 'business',
    severity: 'medium',
    title: '音乐节舞台风波',
    description: '某大型音乐节邀请高八度做第二天的压轴，但主办方临时通知要把他换到第一天的开场。原因是第二天加了一个"更大牌"的艺人。这是赤裸裸的降级。',
    emoji: '🎸',
    forArtist: 'singer',
    minDay: 8,
    choices: [
      {
        id: 'accept_change',
        text: '接受调整',
        subtext: '给主办方面子',
        outcome: {
          narration: '高八度在开场表演中直接炸场，现场观众从第一首歌就开始疯了。"开场比压轴炸"成了当天最大的新闻。有时候亏吃了反而是赚的。',
          statChanges: { fanLoyalty: 4, commercialValue: 3 },
        },
      },
      {
        id: 'withdraw_festival',
        text: '退出音乐节',
        subtext: '"既然不尊重，那就不去了"',
        outcome: {
          narration: '退出的消息引发大量讨论。粉丝觉得"有骨气"，但主办方把你拉进了黑名单，以后的音乐节邀约可能会减少。',
          statChanges: { fanLoyalty: 3, commercialValue: -3, prRisk: 3 },
        },
      },
      {
        id: 'negotiate_special',
        text: '谈一个特别环节',
        subtext: '要一个solo acoustic段',
        outcome: {
          narration: '你争取到了一个15分钟的不插电环节。高八度一把吉他一个话筒，全场万人合唱。视频在全网传疯了，比压轴还出圈。',
          statChanges: { fanLoyalty: 5, commercialValue: 4, prRisk: -3 },
        },
      },
    ],
  },
  {
    id: 'singer_producer_fallout',
    category: 'drama',
    severity: 'high',
    title: '和金牌制作人闹掰了',
    description: '合作了三年的金牌制作人在社交媒体上暗讽："有些歌手红了就飘了，觉得自己不需要制作人了。"所有人都知道在说高八度。圈内都在等你们的反应。',
    emoji: '🎹',
    forArtist: 'singer',
    minDay: 10,
    choices: [
      {
        id: 'reconcile_producer',
        text: '私下和解',
        subtext: '约出来吃饭聊聊',
        outcome: {
          narration: '一顿火锅解决了所有矛盾。两人合发了一条微博："新专辑已经在写了，敬请期待。"粉丝和圈内人都松了一口气。',
          statChanges: { fanLoyalty: 3, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'go_independent',
        text: '宣布独立制作',
        subtext: '"以后的音乐我自己做"',
        outcome: {
          narration: '高八度宣布下张专辑全部自己制作。这个决定很勇敢也很冒险——没有金牌制作人的加持，作品质量是个问号。但音乐圈对这份勇气表示尊重。',
          statChanges: { fanLoyalty: 4, commercialValue: -3, prRisk: 3 },
          unlockTag: 'independent_music',
        },
      },
    ],
  },
  {
    id: 'singer_refuse_commercial',
    category: 'business',
    severity: 'low',
    title: '高八度又拒绝营业了',
    description: '一个综艺节目想让高八度现场即兴写歌给粉丝，但他觉得"音乐不应该被当成表演技巧来消费"，拒绝了节目组的安排。节目已经录到一半了...',
    emoji: '😤',
    forArtist: 'singer',
    choices: [
      {
        id: 'convince_perform',
        text: '劝他配合',
        subtext: '"就当是给粉丝的礼物"',
        outcome: {
          narration: '你花了十分钟说服他。最终高八度在节目上即兴写了一首，写得真的很好。"被逼营业但才华压不住"成了当期最佳片段。',
          statChanges: { fanLoyalty: 3, commercialValue: 3, money: 40000 },
        },
      },
      {
        id: 'respect_artist',
        text: '尊重他的选择',
        subtext: '和节目组解释',
        outcome: {
          narration: '节目组不太高兴但也没办法。这一段被剪掉了，但现场粉丝把高八度拒绝的过程传了出去。评价两极分化："有原则"vs"耍大牌"。',
          statChanges: { fanLoyalty: 3, commercialValue: -3, prRisk: 3 },
        },
      },
    ],
  },
];
