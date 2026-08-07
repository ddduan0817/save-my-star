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

  // ===== 招牌黑料：《我爱吃饭》真正作者是室友"低音炮" =====
  {
    id: 'singer_roommate_longpost',
    category: 'crisis',
    severity: 'critical',
    title: '大学室友"低音炮"发长文',
    description: '一个 ID 叫"低音炮"的音乐博主发了一篇八千字长文，标题：《写给高八度——关于《我爱吃饭》真正的作者》。文章里附了手稿扫描、早期 demo 的录音时间戳、甚至当年两人同宿舍的生活细节。"高八度代笔"炸上热搜第一，三十万转发。',
    emoji: '📜',
    forArtist: 'singer',
    minDay: 5,
    choices: [
      {
        id: 'deny_forever',
        text: '全盘否认',
        subtext: '"这是有心人炒作"',
        outcome: {
          narration: '你让高八度发微博否认，说手稿是伪造的。但原帖作者"低音炮"第二天把当年两人合写时的语音记录放出来了——语音里高八度说的话一字不差。舆论反向爆炸。',
          statChanges: { prRisk: 18, fanLoyalty: -15, commercialValue: -6 },
          unlockTag: 'denied_then_exposed',
        },
      },
      {
        id: 'partial_credit',
        text: '承认"合作关系"',
        subtext: '"他给了我很多灵感"',
        outcome: {
          narration: '高八度发了一条长微博："这首歌的创作过程中，低音炮给了我非常重要的启发，我没有及时署上他的名字是我的错。"态度摆得够低，"低音炮"没再追击，但核心粉丝心里的"艺术家人设"已经有了裂缝。',
          statChanges: { prRisk: 5, fanLoyalty: -7, commercialValue: -3 },
          unlockTag: 'partial_confession',
        },
      },
      {
        id: 'full_confession',
        text: '全盘坦白 + 补署名',
        subtext: '公开承认 + 补发版税和署名',
        outcome: {
          narration: '高八度直播里说："《我爱吃饭》的词曲作者是我的大学室友，他叫低音炮。我欠他一个道歉，也欠他这首歌全部的版税。"低音炮转发："谢谢你终于开口了。"路人盘被这份坦诚打动，但音乐圈对他彻底失望。',
          statChanges: { money: -200000, fanLoyalty: -10, prRisk: -5, commercialValue: -5 },
          unlockTag: 'full_confession_plagiarism',
        },
      },
      {
        id: 'pay_to_silence',
        text: '私下联系"低音炮"买断',
        subtext: '给一大笔钱换撤稿 (-50万)',
        requireMinMoney: 500000,
        outcome: {
          narration: '五十万打过去，"低音炮"删了长文并发了一条"之前内容系误会"。但网络有记忆，截图和语音已经传到海外论坛。短期内压下去了，未来随时会回来。',
          statChanges: { money: -500000, prRisk: 3, fanLoyalty: -3 },
          unlockTag: 'roommate_bought',
        },
      },
    ],
  },
  {
    id: 'singer_old_demo_leak',
    category: 'crisis',
    severity: 'high',
    title: '二手平台挂出了当年的 demo',
    description: '一个匿名账号在闲鱼挂了一张"2018 年音乐学院宿舍录音机"的照片，卡带上手写着《我爱吃饭》的歌名和一行字：作词作曲 低音炮。要价九万。三小时不到就被媒体截图传遍全网。',
    emoji: '🎹',
    forArtist: 'singer',
    minDay: 9,
    choices: [
      {
        id: 'buy_tape',
        text: '抢在媒体前买下',
        subtext: '付9万买下原带 (-9万)',
        requireMinMoney: 90000,
        outcome: {
          narration: '九万转过去，卖家当天下架。但媒体已经拿到了卡带的高清照，你只拿回了"实物"而不是"信息"。接下来一周每家娱乐号都在讨论这张照片。',
          statChanges: { money: -90000, prRisk: 6, fanLoyalty: -3 },
        },
      },
      {
        id: 'forensic_dispute',
        text: '请鉴定机构做伪造鉴定',
        subtext: '花钱请第三方"证伪" (-5万)',
        requireMinMoney: 50000,
        outcome: {
          narration: '鉴定机构给了一份"该卡带书写笔迹与公开笔迹不一致"的报告，营销号开始带节奏"疑似伪造"。但真有人扒出那家鉴定机构去年帮另一个明星洗过假资质，这份报告变成了新的黑点。',
          statChanges: { money: -50000, prRisk: 7, fanLoyalty: -3 },
          unlockTag: 'shady_forensics',
        },
      },
      {
        id: 'ignore_leak',
        text: '不回应',
        subtext: '等新瓜压下去',
        outcome: {
          narration: '你选择装没看见。但"原带"这种实体证据比网络信息难消化，三天后"低音炮"评论区出现了置顶："我没挂那张照片，但照片是真的。"',
          statChanges: { prRisk: 8, fanLoyalty: -5 },
          unlockTag: 'tape_unchallenged',
        },
      },
    ],
  },
  {
    id: 'singer_variety_improv',
    category: 'drama',
    severity: 'high',
    title: '音综逼他现场改编《我爱吃饭》',
    description: '一档顶级音综请高八度上台，节目组设置了"原创回顾"环节，评委当着镜头问："你能现场改编一下《我爱吃饭》的副歌吗？当年你是怎么想到这段旋律的？"现场直播，退不出去。',
    emoji: '🎵',
    forArtist: 'singer',
    minDay: 12,
    choices: [
      {
        id: 'perform_brilliantly',
        text: '硬着头皮演',
        subtext: '即兴改编糊弄过去',
        outcome: {
          narration: '他闭眼即兴改了一段，效果还不错。但懂音乐的人都听出来——改编的部分和原版的和声逻辑对不上，"不像一个人写的"成了讨论焦点。',
          statChanges: { prRisk: 6, fanLoyalty: -5, commercialValue: 3 },
        },
      },
      {
        id: 'redirect_question',
        text: '换个话题',
        subtext: '"今天我想唱新歌"',
        outcome: {
          narration: '他直接换歌唱了一首新作。评委脸色不好看，观众懵了。剪辑播出后"高八度拒绝改编成名曲"上了热搜，大家都在猜他为什么躲。',
          statChanges: { prRisk: 7, fanLoyalty: -3, commercialValue: -3 },
        },
      },
      {
        id: 'public_dedication',
        text: '现场致谢"低音炮"',
        subtext: '借机当众澄清',
        outcome: {
          narration: '高八度对着镜头说："这首歌副歌的灵感来自我大学室友低音炮——他给了我太多。今天我想把这段改编献给他。"直播间炸了，"音乐人的姿态"反向登上热搜。低音炮本人转发："这就够了。"',
          statChanges: { fanLoyalty: 5, prRisk: -5, commercialValue: 3 },
          unlockTag: 'on_air_credit',
        },
      },
    ],
  },
];
