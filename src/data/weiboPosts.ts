import type { ArtistArchetype, WeiboPostTemplate } from '@/types/game';

type ArtistPostSceneId =
  | 'artist_work_photo'
  | 'artist_late_night'
  | 'artist_controversy_response'
  | 'artist_work_promotion'
  | 'artist_fan_gift'
  | 'artist_charity'
  | 'artist_fight_haters'
  | 'artist_selfie'
  | 'artist_romance_hint'
  | 'artist_apology';

type ArtistWeiboPostTemplate = WeiboPostTemplate & {
  sceneId: ArtistPostSceneId;
  postVariants: string[];
  artistPostVariants: Record<ArtistArchetype, string[]>;
  imageRequirement: 'required' | 'optional' | 'none';
  imageSlot?: string;
};

export const weiboPostTemplates: ArtistWeiboPostTemplate[] = [
  {
    id: 'post_work_photo',
    title: '晒工作照',
    emoji: '📸',
    description: '发一组精修工作照，展示敬业形象',
    baseEffects: { fanLoyalty: 2, commercialValue: 1 },
    backfireConditions: { minPrRisk: 65 },
    backfireEffects: { prRisk: 5, fanLoyalty: -1 },
    backfireNarration: '全网都在骂你，你还有心情晒工作照？评论区炸了：“避重就轻”“装什么岁月静好”……',
    successNarration: '工作照引发大量转发，粉丝纷纷表示“好敬业”“营业好勤快”，路人好感度上升。',
    trendTitle: '#{name}工作照好绝#',
    backfireTrendTitle: '#{name}争议期晒照#',
    sceneId: 'artist_work_photo',
    postVariants: [
      '我把今天的工作记录整理好了，忙到收工，也算没有辜负这一天。📷',
      '今天从天亮忙到天黑，我还是想把现场最喜欢的几个瞬间留给你们。',
      '我在现场认真工作的一天被记录下来了，谢谢每一个陪我熬到收工的人。',
    ],
    artistPostVariants: {
      idol: [
        '我把今天彩排和候场的照片攒成了一组，舞台见之前先给你们检查作业。',
        '今天连着排了好几遍新舞台，我累得很满足，先放几张后台照给你们。',
      ],
      actor: [
        '我在片场又过完了角色的一天，灯亮起时进入人物，灯熄后再慢慢走出来。',
        '今天我把剧本翻得起了毛边，也终于把那场戏拍到了自己满意的状态。',
      ],
      singer: [
        '我从试音唱到正式录制，嗓子有点累，但今天录下来的声音对得起这份辛苦。',
        '今天我在排练室磨了很久的现场版本，照片安静，耳朵里的声音很热闹。',
      ],
      influencer: [
        '我在片场从早拍到晚，剧本页已经翻皱了。成片还没出，先交几张认真工作的证据。',
        '今天一直守在监视器和镜头之间，终于把那场戏拍到了自己满意的状态。',
      ],
      socialite: [
        '我把今天试装和拍摄之间的片刻留了下来，衣服、光线和状态都刚刚好。',
        '我在品牌拍摄现场待到最后一盏灯熄灭，这组造型值得完整记录。',
      ],
    },
    imageRequirement: 'required',
    imageSlot: 'work_photo',
    postContent: '我把今天的工作记录整理好了，忙到收工，也算没有辜负这一天。📷',
  },
  {
    id: 'post_late_night',
    title: '深夜感悟',
    emoji: '🌙',
    description: '深夜发一段走心文字，拉近与粉丝的距离',
    baseEffects: { fanLoyalty: 2 },
    backfireConditions: { maxFanLoyalty: 25 },
    backfireEffects: { prRisk: 3, fanLoyalty: -1 },
    backfireNarration: '深夜感悟发出后，评论区一片冷清。仅有的几条评论都是：“谁care？”“自我感动罢了”……',
    successNarration: '“看哭了”“好真实”“心疼你”，粉丝深夜集体破防，超话活跃度暴涨。',
    trendTitle: '#{name}深夜感悟太真实了#',
    backfireTrendTitle: '#{name}深夜发文被嘲自我感动#',
    sceneId: 'artist_late_night',
    postVariants: [
      '凌晨两点，我还没睡。今年好像走得很快，又像在原地站了很久。谢谢你们一直陪着我，晚安。',
      '我刚结束今天的工作，城市已经安静了。累是真的，但舍不得停下来也是真的。',
      '今晚我想把脚步放慢一点，记住此刻的疲惫，也记住自己为什么走到这里。',
    ],
    artistPostVariants: {
      idol: [
        '我刚从排练室出来，脑子里还在数拍子。你们说过会等新舞台，我也一直记着。',
        '今晚我练到很晚才回去，累的时候会翻翻你们的留言，然后又觉得还能再坚持一下。',
      ],
      actor: [
        '我刚拍完一场夜戏，回酒店后还在想角色最后那个眼神。表演这件事，我仍有很多要学。',
        '今晚我合上剧本时已经很晚了，有些人物要慢慢靠近，我愿意多给自己一点时间。',
      ],
      singer: [
        '我在录音室改到凌晨，删掉又重唱。好声音没有捷径，今晚我再多试一次。',
        '夜深以后我反而更能听清旋律，刚存下一个新版本，希望有一天能唱给你们听。',
      ],
      influencer: [
        '夜戏收工后还在想最后那个镜头。从熟悉镜头到学会忘记镜头，我还有很长的路要走。',
        '刚合上剧本，窗外已经天亮了。有人说网红演不好戏，那我就一场一场演给大家看。',
      ],
      socialite: [
        '我结束晚宴回到酒店，卸下造型才发现窗外已经很安静。今晚只想留一点时间给自己。',
        '灯光散场后我才有空整理今天，喧闹归喧闹，我还是想按自己的节奏往前走。',
      ],
    },
    imageRequirement: 'optional',
    imageSlot: 'late_night',
    postContent: '凌晨两点，我还没睡。今年好像走得很快，又像在原地站了很久。谢谢你们一直陪着我，晚安。',
  },
  {
    id: 'post_respond_controversy',
    title: '回应争议',
    emoji: '📢',
    description: '正面回应当前争议，试图平息舆论',
    baseEffects: { prRisk: -6, fanLoyalty: 1 },
    backfireConditions: { minPrRisk: 0 }, // 引擎里特判：风险<30时翻车
    backfireEffects: { prRisk: 5, commercialValue: -1 },
    backfireNarration: '本来风平浪静，你突然回应一个没人关注的“争议”，反而引起了大家注意：“此地无银三百两？”',
    successNarration: '回应措辞得体，态度诚恳。舆论风向逐渐扭转，“大气”“有担当”的评价多了起来。',
    trendTitle: '#{name}正面回应争议#',
    backfireTrendTitle: '#{name}回应后争议升级#',
    sceneId: 'artist_controversy_response',
    postVariants: [
      '关于最近的讨论，我已经看到了。该由我说明的事实不会回避，也请大家给我一点时间整理完整。',
      '这几天有很多声音，我不想用沉默制造更多猜测。能确认的部分我会逐项回应，也会为自己的选择负责。',
      '我理解大家为什么关心这件事。事实和后续处理我会公开说明，不让情绪代替答案。',
    ],
    artistPostVariants: {
      idol: [
        '我看到了关于近期行程和私人生活的猜测。没有公开过的内容不代表可以随意编造，我会把事实说清楚。',
        '这几天让你们担心了。我不会拿模糊的话敷衍大家，能确认的信息会由我和团队一起说明。',
      ],
      actor: [
        '关于流传的片场片段，我承认当时表达得不够克制，但剪辑之外的完整经过也应该被看见。',
        '我对表演和剧本有自己的坚持，也接受对工作方式的批评。关于片场争议，我会把前因后果如实说明。',
      ],
      singer: [
        '关于作品署名和创作过程的质疑，我正在整理手稿、工程文件和参与记录，会给大家一个完整回应。',
        '我愿意接受对作品的检验，但不接受用片段替代事实。相关创作资料整理好后，我会亲自说明。',
      ],
      influencer: [
        '大家对我推荐过的产品提出质疑，我必须正面回应。检测、合同和售后进度我会逐项公开。',
        '我看到了使用反馈，也联系了品牌和检测机构。该退赔的我会跟进，该承担的责任我不会躲。',
      ],
      socialite: [
        '关于最近流传的行程和旧照片，我不会用含糊的说法回避。能核实的事实，我会一次说明清楚。',
        '我理解私人安排受到关注，但拼接的信息不是事实。相关记录已经交由团队核验，我会正式回应。',
      ],
    },
    imageRequirement: 'none',
    postContent: '关于最近的讨论，我已经看到了。该由我说明的事实不会回避，也请大家给我一点时间整理完整。',
  },
  {
    id: 'post_promote_work',
    title: '宣传新作品',
    emoji: '🎬',
    description: '为最新作品/代言做宣传推广',
    baseEffects: { commercialValue: 2, money: 15000 },
    backfireConditions: { minPrRisk: 55 },
    backfireEffects: { prRisk: 4, commercialValue: -1 },
    backfireNarration: '“争议都没解决就开始恰钱了？”“吃相太难看”，宣传帖底下全是质疑声。',
    successNarration: '新作品宣传帖转发破万，项目方随即追加了宣传预算。',
    trendTitle: '#{name}新作品官宣#',
    backfireTrendTitle: '#{name}争议未平先宣传新作#',
    sceneId: 'artist_work_promotion',
    postVariants: [
      '我准备了很久的新项目终于可以和大家见面了，所有认真都放在里面，期待你们的反馈。',
      '今天我正式交出这份新作业。参与它的每一天都很珍贵，希望你们会喜欢。',
      '我一直忍着没剧透，终于等到官宣。请查收我的新作品，我们很快见。',
    ],
    artistPostVariants: {
      idol: [
        '我准备了很久的新单曲和舞台终于官宣了，这次想让你们看到不一样的我。',
        '我把最近所有训练都交给这个新舞台了，记得来验收，我们正式见面的日子不远了。',
      ],
      actor: [
        '我和这个角色一起生活了几个月，终于可以把作品介绍给大家。播出见，答案留在故事里。',
        '我很珍惜这次走进人物的机会，新作品正式定档，希望我的表演没有辜负这个角色。',
      ],
      singer: [
        '我把这一年的声音做成了新专辑，每一次制作、排练和重录都留在里面，今天正式交给你们。',
        '我的新歌终于上线了，耳机和现场会是两种答案，先听完，再告诉我你们喜欢哪一段。',
      ],
      influencer: [
        '我参与的新剧今天正式官宣。这次不想用流量解释自己，角色会替我回答。',
        '从第一次围读到杀青，我和这个角色一起走了很久。新作品定档，终于可以请大家检验我的表演。',
      ],
      socialite: [
        '我参与的新角色今天正式官宣，造型只是入口，人物真正的分量留到作品里见。',
        '我和品牌共同完成的新季影像发布了，这次我很喜欢镜头里的克制和质感。',
      ],
    },
    imageRequirement: 'required',
    imageSlot: 'work_promotion',
    postContent: '我准备了很久的新项目终于可以和大家见面了，所有认真都放在里面，期待你们的反馈。',
  },
  {
    id: 'post_fan_gift',
    title: '晒粉丝礼物',
    emoji: '🎁',
    description: '晒出粉丝送的礼物，表达感谢',
    baseEffects: { fanLoyalty: 3, prRisk: 1 },
    backfireConditions: { maxFanLoyalty: 30 },
    backfireEffects: { fanLoyalty: -2, prRisk: 2 },
    backfireNarration: '“现在才想起来感谢粉丝？”“晚了”“虚伪”，大批粉丝表示不买账。路人也在说“逼粉丝花钱”。',
    successNarration: '“呜呜呜被cue到了！”“宝宝喜欢就好！”，粉丝群沸腾了，纷纷晒出和偶像的回忆。',
    trendTitle: '#{name}宠粉时刻#',
    backfireTrendTitle: '#{name}被质疑消费粉丝#',
    sceneId: 'artist_fan_gift',
    postVariants: [
      '我收到了你们准备的心意，每一封信都认真看过。谢谢你们记得我，也请先照顾好自己。❤️',
      '今天我拆开这些礼物时一直在笑，比礼物更珍贵的是你们写下的每一句话。',
      '我把大家送来的信和手作都收好了。谢谢你们陪我走到这里，这份心意我不会忘。',
    ],
    artistPostVariants: {
      idol: [
        '我看到你们准备的灯牌、信和生日应援了，原来被这么多人认真惦记着，是这种感觉。',
        '我把你们写来的信带回去慢慢看，舞台下的每一点光我都收到了，谢谢你们。',
      ],
      actor: [
        '我收到了你们为角色做的手账和长信，很多细节比我记得还清楚，谢谢你们认真看完这个故事。',
        '我把剧组转来的信都读完了。你们写下对人物的理解，也让我重新看见了表演里那些容易被忽略的细节。',
      ],
      singer: [
        '我收到了你们做的歌词本和听歌记录，原来我的声音真的陪一些人走过了很长的路。',
        '我把大家写来的听后感带进了录音室，谢谢你们认真听见每一层声音。',
      ],
      influencer: [
        '我收到了你们为角色做的手账和剧评。原来真的有人透过故事重新认识了我，谢谢你们。',
        '老朋友写起我们一路走来的日子，新观众写下对角色的理解。每一封信我都认真看完了。',
      ],
      socialite: [
        '我收到了活动现场送来的花和信，审美与心意都很动人，谢谢你们郑重地记住每次见面。',
        '我把你们写来的卡片一张张看完了。礼物不必昂贵，真诚已经足够被我珍藏。',
      ],
    },
    imageRequirement: 'required',
    imageSlot: 'fan_gift',
    postContent: '我收到了你们准备的心意，每一封信都认真看过。谢谢你们记得我，也请先照顾好自己。❤️',
  },
  {
    id: 'post_charity',
    title: '转发公益',
    emoji: '💚',
    description: '转发公益项目，传递正能量',
    baseEffects: { prRisk: -3, fanLoyalty: 1 },
    backfireConditions: { minPrRisk: 75 },
    backfireEffects: { prRisk: 4 },
    backfireNarration: '“自己一屁股问题还做公益？”“洗白实锤”“这波营销我给0分”，公益帖变成了翻车现场。',
    successNarration: '公益转发获得大量好评：“有社会责任感”“正能量偶像”。路人好感度明显提升。',
    trendTitle: '#{name}助力公益好暖#',
    backfireTrendTitle: '#{name}公益被质疑洗白#',
    sceneId: 'artist_charity',
    postVariants: [
      '我想让更多人看见这个项目。关注不是终点，能持续做一点具体的事才有意义。',
      '这次我也参与其中，希望这份微小的行动能抵达真正需要帮助的人。',
      '我会继续跟进项目进展，也欢迎大家理性了解、量力参与，让善意落到实处。',
    ],
    artistPostVariants: {
      idol: [
        '我参与的青少年成长计划今天启动，希望更多孩子能有安心学习和运动的空间。',
        '我会把这次应援收到的善意继续传下去，也请你们量力参与，先照顾好自己的生活。',
      ],
      actor: [
        '我跟着项目组走进了乡村阅读课堂，孩子们读故事时的专注让我重新理解了陪伴。',
        '我会持续支持女性影像记录计划，希望更多真实经历能被看见、被认真讲述。',
      ],
      singer: [
        '我参与的乡村音乐教室开始招生了，希望乐器和老师能让更多孩子听见自己的声音。',
        '我会把这场演出的部分收入用于听障儿童音乐教育，后续进展也会持续公开。',
      ],
      influencer: [
        '我会持续支持女性影像记录计划，希望更多真实经历能被看见，也被认真地演出来。',
        '这次我参与了女性健康物资项目，需求清单和执行进度都会公开，请大家理性参与。',
      ],
      socialite: [
        '我参与的传统手工艺扶持项目今天启动，希望精细的技艺不只停留在展柜里。',
        '我会持续支持这项儿童艺术教育计划，晚宴上的承诺也应该落实成长期行动。',
      ],
    },
    imageRequirement: 'optional',
    imageSlot: 'charity_project',
    postContent: '我想让更多人看见这个项目。关注不是终点，能持续做一点具体的事才有意义。',
  },
  {
    id: 'post_fight_haters',
    title: '怼黑子',
    emoji: '🔥',
    description: '在线回怼恶意黑子，双刃剑操作',
    baseEffects: { fanLoyalty: 3, prRisk: 2 },
    backfireConditions: { minPrRisk: 50 },
    backfireEffects: { prRisk: 8, fanLoyalty: -1 },
    backfireNarration: '本来想霸气回怼，结果被断章取义上了热搜。“明星怼网友”“素质堪忧”，火上浇油了。',
    successNarration: '“太飒了！”“这才是真性情！”“怼得好！”，粉丝疯狂转发，黑子们反而被群嘲了。',
    trendTitle: '#{name}在线怼黑子#',
    backfireTrendTitle: '#{name}怼网友引争议#',
    sceneId: 'artist_fight_haters',
    postVariants: [
      '有些话我今天就摊开来讲：批评我接受，造谣不接受。相关内容已经取证，法庭见。',
      '我可以为真实的错误负责，但不会替编出来的故事买单。证据已经交给律师。',
      '我一直不回应，不代表任何谣言都能被重复成事实。该澄清的我会澄清，该追责的也不会停。',
    ],
    artistPostVariants: {
      idol: [
        '关于我的私人生活和团队关系，批评可以，编故事不行。我已经完成取证，会依法处理。',
        '我知道沉默会被当成默认，所以今天说清楚：拼接行程、伪造聊天记录的账号，我会追责。',
      ],
      actor: [
        '把片场片段剪掉前后语境再给我定罪，不叫监督。我已经保留原始素材，也会追究造谣责任。',
        '我的表演可以被讨论，片场发生过什么也可以查证，但凭空编造的人请为自己的话负责。',
      ],
      singer: [
        '我的现场和作品都可以拿完整证据讨论，剪一秒音频就说我假唱，我不会认。',
        '关于创作和演出的造谣，我已经整理好工程记录与现场轨道。想讨论作品，就把事实带上。',
      ],
      influencer: [
        '说我推荐过什么，请先拿出完整链接和订单。检测报告、合同和售后记录我都留着，造谣的别删。',
        '我接受大家查我的选品，但伪造聊天截图带节奏不行。证据已经固定，我会追责到底。',
      ],
      socialite: [
        '拼接旧照、虚构行程，再替我写一段人生，不会因此变成事实。相关账号已经完成取证。',
        '我不习惯公开争辩，但恶意加工私人影像已经越界。我的律师会继续处理。',
      ],
    },
    imageRequirement: 'none',
    postContent: '有些话我今天就摊开来讲：批评我接受，造谣不接受。相关内容已经取证，法庭见。',
  },
  {
    id: 'post_selfie',
    title: '日常自拍',
    emoji: '🤳',
    description: '发一张日常自拍，简单安全但收益低',
    baseEffects: { fanLoyalty: 1 },
    backfireConditions: undefined,
    successNarration: '自拍获得大量点赞和“好好看”评论，简单但有效的营业方式。',
    trendTitle: '#{name}自拍好好看#',
    sceneId: 'artist_selfie',
    postVariants: [
      '我今天状态还不错，随手留一张。你们最近过得怎么样？📱',
      '我路过一束很好看的光，于是有了这张照片。今天也要好好生活。',
      '我难得有一点空闲，拍张照片报平安。最近一切都好。',
    ],
    artistPostVariants: {
      idol: [
        '我趁彩排间隙拍了一张，头发已经被汗弄乱了，你们就当没看见。',
        '我今天练完舞还剩一点力气自拍，先交营业作业，再回去继续练。',
      ],
      actor: [
        '我在化妆间等下一场戏，角色的妆还没卸，先留一张今天的样子。',
        '我刚收工，脸上还带着人物的痕迹。照片留给今天，情绪慢慢还给自己。',
      ],
      singer: [
        '我刚做完声场检查，耳返还没摘，先拍一张记录今天的状态。',
        '我在录音室待了一下午，窗边这束光不错，就让耳机和我一起出镜。',
      ],
      influencer: [
        '刚拍完夜戏，角色的妆还没卸。今天先不修图，留住收工时最真实的样子。',
        '候场时在化妆间拍了一张。镜头外是我，镜头亮起以后再把时间交给角色。',
      ],
      socialite: [
        '我在试装间等最后一套造型，镜子和光线都合适，留一张。',
        '我结束活动回到酒店，领结还没拆。今晚的状态值得保存。',
      ],
    },
    imageRequirement: 'required',
    imageSlot: 'selfie',
    postContent: '我今天状态还不错，随手留一张。你们最近过得怎么样？📱',
  },
  {
    id: 'post_hint_romance',
    title: '暗示恋情',
    emoji: '💕',
    description: '发暧昧动态，拉话题热度但粉丝不一定买账',
    baseEffects: { commercialValue: 3, fanLoyalty: -2 },
    backfireConditions: { forArtist: 'idol' },
    backfireEffects: { fanLoyalty: -6, prRisk: 4 },
    backfireNarration: '偶像暗示恋情？粉丝直接炸了：“塌房预警！”“说好的只有粉丝呢？”，脱粉潮已经开始。',
    successNarration: '暧昧动态引发全网猜测，话题热度暴涨。但评论区吵成一团，有人嗑有人骂。',
    trendTitle: '#{name}疑似官宣恋情#',
    backfireTrendTitle: '#{name}恋情暗示引发脱粉#',
    sceneId: 'artist_romance_hint',
    postVariants: [
      '我开始觉得，被爱着的每一天都值得记录。🌙 有些事，时候到了自然会告诉你们。',
      '今天有人提醒我，原来幸福真的会让人变得话多。我先保密。',
      '我最近很好。不是工作上的那种好。',
    ],
    artistPostVariants: {
      idol: [
        '你们总问我最近为什么总在笑。我先把答案欠着，等合适的时候再说。',
        '今晚我不聊工作，只想偷偷记录一个很开心的瞬间。',
      ],
      actor: [
        '我演过很多告别和重逢，最近才发现，生活也会写出让人舍不得喊停的一场戏。',
        '我不急着给一段关系写结局，认真感受当下就很好。',
      ],
      singer: [
        '我最近写了一段旋律，还没想好该唱给谁听。',
        '我发现有些和声，一个人真的唱不完整。',
      ],
      influencer: [
        '夜戏收工后有人陪我吃了顿宵夜。今天不聊角色，只分享一点藏不住的好心情。',
        '最近有人总能接住我的疲惫。是谁先保密，照片里的线索你们也别猜得太快。',
      ],
      socialite: [
        '今晚我只记录晚餐、月色，以及没有出现在镜头里的人。',
        '我的私人时间不多，但今晚值得留档。',
      ],
    },
    imageRequirement: 'required',
    imageSlot: 'romance_hint',
    postContent: '我开始觉得，被爱着的每一天都值得记录。🌙 有些事，时候到了自然会告诉你们。',
  },
  {
    id: 'post_apology',
    title: '发表道歉',
    emoji: '🙏',
    description: '发布道歉声明，化解当前危机',
    baseEffects: { prRisk: -8, commercialValue: -1 },
    backfireConditions: { minPrRisk: 0 }, // 引擎里特判：风险<30时翻车
    backfireEffects: { prRisk: 4, commercialValue: -1 },
    backfireNarration: '“道什么歉？发生什么了？”“无事道歉太怪了吧”，反而引发了大家的好奇和猜测。',
    successNarration: '道歉声明措辞真挚，获得了大部分人的谅解。“知错能改”“态度值得肯定”。',
    trendTitle: '#{name}发布道歉声明#',
    backfireTrendTitle: '#{name}突然道歉引发猜测#',
    sceneId: 'artist_apology',
    postVariants: [
      '关于这次的事情，我郑重道歉。问题出在我身上，我会承担责任，也会公开后续改正进度。',
      '我认真看完了大家的批评。让信任我的人失望，是我必须面对的结果，对不起。',
      '这份道歉不该只停在文字里。我会处理已经造成的影响，也接受大家继续监督我。',
    ],
    artistPostVariants: {
      idol: [
        '我没有把这次舞台和沟通做到应有的标准，让一直等我的你们失望了。对不起，我会用行动补上。',
        '我对这次行程安排中的失误负责，也向受到影响的人道歉。你们的信任不该被我消耗。',
      ],
      actor: [
        '我为自己在片场失当的表达道歉。对创作有意见，不代表我可以伤害一起工作的人。',
        '我没有处理好这次公开表达，给合作伙伴和观众带来了困扰。批评我接受，后续我会认真改正。',
      ],
      singer: [
        '我为这次现场准备不足道歉。声音状态不是借口，我会暂停下一场演出，重新把每个环节练扎实。',
        '我没有及时说明作品信息，让参与创作的人和听众受到伤害。该补充的署名与说明，我会立即处理。',
      ],
      influencer: [
        '我为这次选品失误和迟到的回应道歉。退款、赔付和检测进度都会公开，我不会让消费者自己承担后果。',
        '是我没有把推荐前的审核做到位。信任来自每一次真实体验，这次我辜负了它，对不起。',
      ],
      socialite: [
        '我为这次行程沟通失误和由此造成的等待道歉。礼貌不该只存在于镜头前，我会认真整改。',
        '我没有以应有的态度完成这次合作，影响了现场所有人的工作。责任在我，对不起。',
      ],
    },
    imageRequirement: 'none',
    postContent: '关于这次的事情，我郑重道歉。问题出在我身上，我会承担责任，也会公开后续改正进度。',
  },
];

const WEIBO_POST_IMAGES: Partial<Record<ArtistArchetype, Record<string, string>>> = {
  idol: {
    work_photo: './weibo/idol/work_photo.jpg',
    selfie: './weibo/idol/selfie.jpg',
    work_promotion: './weibo/idol/work_promotion.jpg',
    fan_gift: './weibo/idol/fan_gift.jpg',
    romance_hint: './weibo/idol/romance_hint.jpg',
  },
};

export function getWeiboPostImage(
  artistId: ArtistArchetype,
  imageSlot?: string,
): string | undefined {
  if (!imageSlot) return undefined;
  return WEIBO_POST_IMAGES[artistId]?.[imageSlot];
}
