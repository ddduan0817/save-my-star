import type { ArtistArchetype, RivalFameLevel } from '@/types/game';

export interface RivalDefinition {
  id: string;
  forArtist: ArtistArchetype;
  name: string;
  avatar: string;
  title: string;
  backstory: string;
  initialFameLevel: RivalFameLevel;
  initialAggression: number;
  stats: {
    commercialValue: number;
    fanLoyalty: number;
    prRisk: number;
    appearance: number;
  };
}

export const rivalDefinitions: RivalDefinition[] = [
  {
    id: 'lin_c',
    forArtist: 'idol',
    name: '林C位',
    avatar: '🏆',
    title: '选秀C位·全能ace',
    backstory: '选秀总决赛断层C位出道，官方钦定中心位，唱跳实力拉满。练习生多年，资本认可度极高，出道即顶配资源。视甄帅为“人气威胁”，毕竟当年总决赛票数差距没那么大，两人同框必上热搜，粉丝常年互撕“谁才是真顶流”。',
    initialFameLevel: 'high',
    initialAggression: 55,
    stats: {
      commercialValue: 55,
      fanLoyalty: 45,
      prRisk: 20,
      appearance: 70,
    },
  },
  {
    id: 'chao_cute',
    forArtist: 'actor',
    name: '晁可爱',
    avatar: '🍬',
    title: '甜妹小花·网剧飞升',
    backstory: '甜宠剧专业户，网剧爆款制造机。非科班出身，从小配角一步步爬上来，靠低成本剧爆火出圈，CP体质爆棚。和郝美丽常年争夺“95花第一甜颜”，红毯、代言、剧本高度重合，据说双方团队互发过黑通稿。',
    initialFameLevel: 'medium',
    initialAggression: 45,
    stats: {
      commercialValue: 35,
      fanLoyalty: 50,
      prRisk: 25,
      appearance: 60,
    },
  },
  {
    id: 'ge_wang',
    forArtist: 'singer',
    name: '葛王',
    avatar: '🎧',
    title: '流量歌手·神曲制造机',
    backstory: '短视频顶流男歌手，洗脑神曲出圈，下沉市场绝对王者。草根出身，酒吧驻唱转型，靠短视频爆火，榜单数据碾压主流歌手。高八度粉丝嘲他“土、没唱功”，他的粉丝反嘲“曲高和寡没人听”。自封“歌王”，谐音刚好就是他的名字。',
    initialFameLevel: 'medium',
    initialAggression: 60,
    stats: {
      commercialValue: 55,
      fanLoyalty: 50,
      prRisk: 30,
      appearance: 40,
    },
  },
  {
    id: 'wang_sc',
    forArtist: 'influencer',
    name: '王思琪',
    avatar: '🎀',
    title: '正统小花·未来青衣',
    backstory: '正经影视公司签约小花，童星出身从小拍戏，剧组经验丰富，被业内看好为“未来青衣”。和冷冰凝颜值路线相似，常撞戏、撞代言、撞造型。最反感冷冰凝这种“网红跨界分资源”，粉丝看不起“网红咖”，而冷冰凝粉丝嘲她“颜值不够热度凑”。',
    initialFameLevel: 'medium',
    initialAggression: 40,
    stats: {
      commercialValue: 40,
      fanLoyalty: 45,
      prRisk: 15,
      appearance: 55,
    },
  },
  {
    id: 'gu_junting',
    forArtist: 'socialite',
    name: '顾君庭',
    avatar: '💎',
    title: '学院派小生·科班贵公子',
    backstory: '北电表演系科班出身，家里是搞艺术的世家。和南陌格一样走“贵公子”路线，但他是“真贵族”，家世清白、演技在线、从不拍商业大片。南陌格每拿一个高奢代言，他的粉丝都要嘲一轮“网红夹子音也配穿定制”。南陌格粉丝反嘲“学院派穷酸”。',
    initialFameLevel: 'medium',
    initialAggression: 50,
    stats: {
      commercialValue: 45,
      fanLoyalty: 55,
      prRisk: 15,
      appearance: 72,
    },
  },
];

export function getRivalForArtist(artistId: ArtistArchetype): RivalDefinition {
  return rivalDefinitions.find(r => r.forArtist === artistId)!;
}
