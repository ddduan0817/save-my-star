// 事件/结局文案里的占位符替换。
//
// 历史上事件正文用字面量 "XX" 指代当前艺人（写死、无法随艺人变化）。现在统一
// 改用 {name} 占位符，运行时按当前艺人名替换 —— 和微博/热搜/竞对文案
// （weiboPostEngine / socialGenerator / rivalEngine）用的是同一套约定。
//
// 注意：只替换指代「艺人本人」的占位符。事件里故意保留模糊的地名（如
// “XX 城市”）和别家艺人（“XXX 前辈”）不使用 {name}，因此不受影响。

import type { ArtistArchetype } from '@/types/game';

const NAME_TOKEN = /\{name\}/g;

export function fillName(text: string | undefined, name: string): string | undefined {
  if (!text) return text;
  return text.replace(NAME_TOKEN, name);
}

// ---- 职业词典 --------------------------------------------------------------
//
// 结局文案里有大量「舞台向」的写死意象（演唱会散场、练习室摔倒、单曲循环…），
// 对演员/网红/古偶来说读起来很跳戏。为此把这些意象抽成 {token}，按当前艺人的
// archetype 填不同的词，让同一段结局既能给歌手也能给演员，且都读得通顺。
//
// 约定：结局文案里默认保留「歌手/偶像」口吻（token 值和原文一致），只有其它
// 职业才替换 —— 这样既修好了违和，又不动原本就贴切的那一档。

type ProfessionTokens = {
  /** 职业称谓：偶像 / 歌手 / 演员 / 主播 */
  roleNoun: string;
  /** 受众称谓：粉丝 / 观众 */
  fansWord: string;
  /** 演出/亮相散场的场景：演唱会散场后 / 路演结束后 / 直播下播后 */
  showEnd: string;
  /** 粉丝当面夸的那句话：你唱得真好 / 你演得真好 */
  praise: string;
  /** 刚出道时的青涩画面：在练习室摔倒又爬起来 / 第一次进剧组念不利索台词 */
  rookieScene: string;
  /** 稳定期日常的一整句：有戏拍、有歌唱、有人在深夜的出租车里单曲循环TA的歌 */
  steadyLife: string;
  /** 早年商场活动的画面：站在台上唱歌 / 站在台上和影迷合影 */
  marketScene: string;
};

const PROFESSION_LEXICON: Record<ArtistArchetype, ProfessionTokens> = {
  idol: {
    roleNoun: '偶像',
    fansWord: '粉丝',
    showEnd: '演唱会散场后',
    praise: '今天的舞台真好看',
    rookieScene: '在练习室摔倒又爬起来',
    steadyLife: '有舞台可站、有代言可接、有人在深夜的出租车里反复看TA的舞台直拍',
    marketScene: '站在台上唱跳',
  },
  singer: {
    roleNoun: '歌手',
    fansWord: '粉丝',
    showEnd: '演唱会散场后',
    praise: '你唱得真好',
    rookieScene: '在练习室摔倒又爬起来',
    steadyLife: '有戏拍、有歌唱、有人在深夜的出租车里单曲循环TA的歌',
    marketScene: '站在台上唱歌',
  },
  actor: {
    roleNoun: '演员',
    fansWord: '观众',
    showEnd: '路演结束后',
    praise: '你演得真好',
    rookieScene: '第一次进剧组紧张到台词都念不利索',
    steadyLife: '有戏拍、有好角色找上门、有人在深夜的出租车里重温TA的剧',
    marketScene: '站在台上和影迷合影',
  },
  influencer: {
    roleNoun: '主播',
    fansWord: '粉丝',
    showEnd: '线下见面会结束后',
    praise: '你说的话真戳心',
    rookieScene: '对着只有三个人的直播间也认真播完',
    steadyLife: '有直播可开、有商单可接、有人在深夜的出租车里刷着TA的直播回放',
    marketScene: '站在台上直播带货',
  },
  socialite: {
    roleNoun: '演员',
    fansWord: '粉丝',
    showEnd: '活动结束后',
    praise: '你演得真好',
    rookieScene: '第一次试戏被刷下来还站在原地不肯走',
    steadyLife: '有戏拍、有活动可走、有人在深夜的出租车里重温TA的剧',
    marketScene: '站在台上走秀签售',
  },
};

const TOKEN = /\{(\w+)\}/g;

/**
 * 结局文案专用填充：先替换 {name}，再按艺人职业替换 {roleNoun}/{showEnd} 等
 * 职业词典 token。未知 token 原样保留（不会误伤别处的花括号文本）。
 */
export function fillEndingText(
  text: string,
  artist: { id: ArtistArchetype; name: string },
): string {
  const lex = PROFESSION_LEXICON[artist.id];
  return text.replace(TOKEN, (match, key: string) => {
    if (key === 'name') return artist.name;
    return lex?.[key as keyof ProfessionTokens] ?? match;
  });
}
