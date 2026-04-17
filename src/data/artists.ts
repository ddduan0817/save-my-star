import type { Artist } from '@/types/game';

export const artists: Artist[] = [
  {
    id: 'idol',
    name: '林星辰',
    title: '流量偶像',
    description: '选秀出道，颜值即正义，粉丝基数庞大但极度敏感',
    avatar: '🌟',
    initialStats: {
      commercialValue: 60,
      fanLoyalty: 75,
      prRisk: 30,
      money: 200000,
    },
    specialTrait: '万人迷体质：粉丝事件收益×1.5，但塌房代价也×1.5',
    backstory: '选秀节目C位出道，凭借一张天选之脸迅速走红。粉丝们为他疯狂打榜，但也意味着任何风吹草动都会被放大一百倍。作为经纪人，你需要在流量和风险之间找到平衡。',
  },
  {
    id: 'actor',
    name: '陈墨白',
    title: '实力派演员',
    description: '科班出身，演技在线，路人缘好但商业号召力一般',
    avatar: '🎬',
    initialStats: {
      commercialValue: 50,
      fanLoyalty: 50,
      prRisk: 15,
      money: 150000,
    },
    specialTrait: '路人缘好：舆论风险增长减半，但商业收益也减半',
    backstory: '北电毕业，靠一部文艺片在圈内崭露头角。观众认可他的演技，但品牌方总觉得他"不够有话题"。你的任务是让实力被更多人看到，同时保住他"零绯闻"的金字招牌。',
  },
  {
    id: 'singer',
    name: '许安歌',
    title: '唱跳歌手',
    description: '音乐才华横溢，舞台表现力强，作品说话',
    avatar: '🎤',
    initialStats: {
      commercialValue: 70,
      fanLoyalty: 55,
      prRisk: 25,
      money: 180000,
    },
    specialTrait: '作品说话：可以抵挡一次致命危机（舆论风险不会直接触发封杀）',
    backstory: '从地下音乐人一路唱到万人体育场，每首歌都是自己写的。品牌方爱他的调性，但他骨子里是个"不想营业"的艺术家。你需要在商业化和艺术追求之间走钢丝。',
  },
  {
    id: 'influencer',
    name: '赵小鱼',
    title: '网红转型',
    description: '从短视频起家，会搞钱但根基不稳，时刻面临"不够格"的质疑',
    avatar: '📱',
    initialStats: {
      commercialValue: 40,
      fanLoyalty: 35,
      prRisk: 45,
      money: 350000,
    },
    specialTrait: '会搞钱：所有资金收益+50%，但起步舆论风险更高',
    backstory: '抖音千万粉丝，靠一条爆款视频出圈。现在想转型做"正经艺人"，但传统娱乐圈对她充满偏见。钱是不缺的，缺的是认可。你能帮她杀出一条血路吗？',
  },
];
