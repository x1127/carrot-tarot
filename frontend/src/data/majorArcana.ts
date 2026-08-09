import type { TarotCard } from './types';

// 大阿卡纳 22 张（0-21）
export const majorArcana: TarotCard[] = [
  {
    id: 'major-00',
    name: '愚者',
    englishName: 'The Fool',
    arcana: 'major',
    number: 0,
    element: 'air',
    keywords: {
      upright: ['开始', '自由', '冒险', '纯真', '本能'],
      reversed: ['鲁莽', '冒险', '迷茫', '天真'],
    },
    meaning: {
      upright: '象征新的旅程与无限可能。怀着赤子之心踏入未知，相信直觉，拥抱自由与冒险。这是踏上新征程的勇气时刻。',
      reversed: '提示鲁莽与缺乏规划。盲目冲动可能带来风险，需要在行动前冷静思考，避免因天真而陷入困境。',
    },
  },
  {
    id: 'major-01',
    name: '魔术师',
    englishName: 'The Magician',
    arcana: 'major',
    number: 1,
    element: 'air',
    keywords: {
      upright: ['创造力', '意志', '行动', '显化', '技艺'],
      reversed: ['操纵', '未发挥', '欺骗', '缺乏专注'],
    },
    meaning: {
      upright: '你拥有实现目标所需的一切工具与才能。意志与行动力将想法化为现实，是显化与创造的绝佳时机。',
      reversed: '才华未被善用，或存在操纵欺骗。警惕华而不实，需要真诚面对自己的能力与意图。',
    },
  },
  {
    id: 'major-02',
    name: '女祭司',
    englishName: 'The High Priestess',
    arcana: 'major',
    number: 2,
    element: 'water',
    keywords: {
      upright: ['直觉', '神秘', '潜意识', '静观', '智慧'],
      reversed: ['秘密', '压抑直觉', '失衡', '浮躁'],
    },
    meaning: {
      upright: '倾听内在的声音与直觉。答案藏于潜意识与静默之中，此刻宜静观、内省，而非急于行动。',
      reversed: '直觉被忽视或情绪失衡。过度依赖外在信息，需重新连接内在智慧。',
    },
  },
  {
    id: 'major-03',
    name: '皇后',
    englishName: 'The Empress',
    arcana: 'major',
    number: 3,
    element: 'earth',
    keywords: {
      upright: ['丰盛', '滋养', '母性', '创造', '自然'],
      reversed: ['依赖', '过度保护', '匮乏', '停滞'],
    },
    meaning: {
      upright: '丰盛、创造力与生命力的绽放。享受感官与自然之美，以温柔滋养他人与自我，是孕育与成长的时期。',
      reversed: '过度依赖或控制，或感到匮乏停滞。需要在给予与自我关怀间找回平衡。',
    },
  },
  {
    id: 'major-04',
    name: '皇帝',
    englishName: 'The Emperor',
    arcana: 'major',
    number: 4,
    element: 'fire',
    keywords: {
      upright: ['权威', '结构', '稳定', '领导', '父性'],
      reversed: ['专制', '僵化', '滥用权力', '失控'],
    },
    meaning: {
      upright: '建立秩序与结构，以理性与权威掌控局面。坚持原则、承担责任，是稳固根基与领导的时刻。',
      reversed: '过度专制或规则僵化，亦或权威失控。需要在掌控与灵活之间调整。',
    },
  },
  {
    id: 'major-05',
    name: '教皇',
    englishName: 'The Hierophant',
    arcana: 'major',
    number: 5,
    element: 'earth',
    keywords: {
      upright: ['传统', '信仰', '指引', '归属', '教育'],
      reversed: ['反叛', '非传统', '自由思想', '束缚'],
    },
    meaning: {
      upright: '遵循传统与精神指引，寻求导师或团体的智慧。在既有体系中学习与成长，获得归属感。',
      reversed: '突破常规、挑战传统，或感到教条的束缚。需要按自己的信念前行。',
    },
  },
  {
    id: 'major-06',
    name: '恋人',
    englishName: 'The Lovers',
    arcana: 'major',
    number: 6,
    element: 'air',
    keywords: {
      upright: ['爱', '选择', '和谐', '结合', '价值观'],
      reversed: ['失衡', '冲突', '错误选择', '分离'],
    },
    meaning: {
      upright: '关于爱与价值观的重要选择。在关系与结合中寻找和谐，需以真诚的心做出忠于自我的决定。',
      reversed: '关系失衡或价值观冲突，可能面临错误选择。需要重新审视内心的真实需求。',
    },
  },
  {
    id: 'major-07',
    name: '战车',
    englishName: 'The Chariot',
    arcana: 'major',
    number: 7,
    element: 'water',
    keywords: {
      upright: ['意志', '胜利', '控制', '前进', '决心'],
      reversed: ['失控', '方向不明', '冲动', '挫折'],
    },
    meaning: {
      upright: '凭借坚定意志与自律驾驭对立的力量，取得胜利。专注目标、掌控方向，奋勇前行。',
      reversed: '失去控制或方向混乱，冲动行事导致挫折。需要重新聚焦与调整节奏。',
    },
  },
  {
    id: 'major-08',
    name: '力量',
    englishName: 'Strength',
    arcana: 'major',
    number: 8,
    element: 'fire',
    keywords: {
      upright: ['勇气', '柔韧', '耐心', '内在力量', '驯服'],
      reversed: ['自我怀疑', '脆弱', '失控', '压抑'],
    },
    meaning: {
      upright: '以温柔与耐心驯服内心的野兽。真正的力量源于柔韧与勇气，而非蛮力。相信自己的内在韧性。',
      reversed: '自我怀疑或情绪失控，感到脆弱。需要重建自信，温和地面对恐惧。',
    },
  },
  {
    id: 'major-09',
    name: '隐士',
    englishName: 'The Hermit',
    arcana: 'major',
    number: 9,
    element: 'earth',
    keywords: {
      upright: ['内省', '孤独', '指引', '智慧', '寻觅'],
      reversed: ['孤立', '退缩', '迷失', '拒绝指引'],
    },
    meaning: {
      upright: '退入内在的宁静，独自寻觅真理。这是内省与自我探索的时刻，智慧在独处中浮现。',
      reversed: '过度孤立或拒绝外界帮助，感到迷失。需要适度打开心扉，接受指引。',
    },
  },
  {
    id: 'major-10',
    name: '命运之轮',
    englishName: 'Wheel of Fortune',
    arcana: 'major',
    number: 10,
    element: 'fire',
    keywords: {
      upright: ['转折', '命运', '机遇', '循环', '变化'],
      reversed: ['逆流', '厄运', '抗拒变化', '失控'],
    },
    meaning: {
      upright: '命运的转轮带来机遇与转折。顺势而为，把握变化的浪潮，新的循环正在开启。',
      reversed: '运势逆转或抗拒变化，感到失控。需要接受无常，调整心态迎接转折。',
    },
  },
  {
    id: 'major-11',
    name: '正义',
    englishName: 'Justice',
    arcana: 'major',
    number: 11,
    element: 'air',
    keywords: {
      upright: ['公正', '真相', '因果', '平衡', '责任'],
      reversed: ['不公', '偏颇', '逃避责任', '失衡'],
    },
    meaning: {
      upright: '以公正与理性权衡真相。因果自有定数，承担应尽的责任，做出公平的判断与决定。',
      reversed: '不公或偏颇，逃避责任导致失衡。需要正视真相，回归公正。',
    },
  },
  {
    id: 'major-12',
    name: '倒吊人',
    englishName: 'The Hanged Man',
    arcana: 'major',
    number: 12,
    element: 'water',
    keywords: {
      upright: ['暂停', '视角', '放下', '牺牲', '顿悟'],
      reversed: ['停滞', '抗拒', '无谓牺牲', '拖延'],
    },
    meaning: {
      upright: '主动暂停，换个角度看世界。在等待与放下中获得顿悟，暂时的牺牲将带来新的领悟。',
      reversed: '停滞不前或无谓的拖延，抗拒改变。需要打破僵局，重新审视。',
    },
  },
  {
    id: 'major-13',
    name: '死神',
    englishName: 'Death',
    arcana: 'major',
    number: 13,
    element: 'water',
    keywords: {
      upright: ['结束', '转变', '重生', '释放', '蜕变'],
      reversed: ['抗拒结束', '停滞', '恐惧变化', '拖延'],
    },
    meaning: {
      upright: '一个阶段的自然终结，为新生腾出空间。释放不再服务于你的事物，拥抱深刻的蜕变与重生。',
      reversed: '抗拒必要的结束， clinging 于旧事物。需要勇敢放手，迎接转变。',
    },
  },
  {
    id: 'major-14',
    name: '节制',
    englishName: 'Temperance',
    arcana: 'major',
    number: 14,
    element: 'fire',
    keywords: {
      upright: ['平衡', '调和', '耐心', '中庸', '融合'],
      reversed: ['失衡', '过度', '不和谐', '急躁'],
    },
    meaning: {
      upright: '在对立之间寻找平衡与调和。以耐心与中庸之道融合不同元素，达到内在的和谐。',
      reversed: '失衡或走极端，缺乏协调。需要重新校准，回归适度。',
    },
  },
  {
    id: 'major-15',
    name: '恶魔',
    englishName: 'The Devil',
    arcana: 'major',
    number: 15,
    element: 'earth',
    keywords: {
      upright: ['束缚', '欲望', '执着', '物欲', '成瘾'],
      reversed: ['释放', '觉醒', '挣脱', ' reclaim力量'],
    },
    meaning: {
      upright: '被欲望、执念或物质所束缚。看清束缚你的枷锁，它往往源自内心的恐惧与依附。',
      reversed: '挣脱束缚，重获自由。觉醒于真正的力量，从成瘾与执着中解放。',
    },
  },
  {
    id: 'major-16',
    name: '塔',
    englishName: 'The Tower',
    arcana: 'major',
    number: 16,
    element: 'fire',
    keywords: {
      upright: ['突变', '崩塌', '觉醒', '真相揭露', '颠覆'],
      reversed: ['避免灾难', '抗拒变化', '延缓', '内在动荡'],
    },
    meaning: {
      upright: '突如其来的颠覆与崩塌，虚假的根基被动摇。虽然剧烈，却带来深刻的觉醒与重建契机。',
      reversed: '灾难被延缓或内在抗拒变化。需要正视隐患，主动面对而非逃避。',
    },
  },
  {
    id: 'major-17',
    name: '星星',
    englishName: 'The Star',
    arcana: 'major',
    number: 17,
    element: 'air',
    keywords: {
      upright: ['希望', '疗愈', '信念', '宁静', '灵感'],
      reversed: ['绝望', '失去信心', '消极', 'disconnect'],
    },
    meaning: {
      upright: '风暴过后的希望与疗愈之光。重燃信念与灵感，在宁静中恢复力量，未来可期。',
      reversed: '失去希望或信心，感到消极。需要重新连接内在的星光与信念。',
    },
  },
  {
    id: 'major-18',
    name: '月亮',
    englishName: 'The Moon',
    arcana: 'major',
    number: 18,
    element: 'water',
    keywords: {
      upright: ['幻象', '潜意识', '恐惧', '直觉', '迷雾'],
      reversed: ['释放恐惧', '澄清', '真相显现', '走出迷雾'],
    },
    meaning: {
      upright: '迷雾笼罩，幻象与潜意识恐惧浮现。直觉在模糊中指引，需要勇敢面对未知的阴影。',
      reversed: '迷雾散去，恐惧被释放，真相逐渐清晰。走出困惑，重见光明。',
    },
  },
  {
    id: 'major-19',
    name: '太阳',
    englishName: 'The Sun',
    arcana: 'major',
    number: 19,
    element: 'fire',
    keywords: {
      upright: ['喜悦', '成功', '活力', ' positivity', '明朗'],
      reversed: ['暂时的阴霾', '过度乐观', ' ego', '受阻'],
    },
    meaning: {
      upright: '充满喜悦、成功与生命力的时刻。阴霾散尽，阳光普照，是庆祝与绽放的吉祥之兆。',
      reversed: '喜悦暂时受阻，或过度乐观。需要调整期待，让光芒重新照进。',
    },
  },
  {
    id: 'major-20',
    name: '审判',
    englishName: 'Judgement',
    arcana: 'major',
    number: 20,
    element: 'fire',
    keywords: {
      upright: ['觉醒', '重生', '召唤', '反思', '救赎'],
      reversed: ['自我怀疑', '回避召唤', ' regret', '迟疑'],
    },
    meaning: {
      upright: '聆听内在的召唤，迎来觉醒与重生。反思过往，作出审判与抉择，迈向更高的存在。',
      reversed: '回避召唤或自我怀疑，沉溺于 regret。需要勇敢回应内心的呼唤。',
    },
  },
  {
    id: 'major-21',
    name: '世界',
    englishName: 'The World',
    arcana: 'major',
    number: 21,
    element: 'earth',
    keywords: {
      upright: ['完成', '圆满', '成就', '整合', '新循环'],
      reversed: ['未完成', '延迟', '欠缺', '收尾'],
    },
    meaning: {
      upright: '一个周期的圆满完成与整合。收获成就，感到完整，同时在圆满中开启新的循环。',
      reversed: '接近完成却仍有欠缺，或感到未竟。需要补全最后一步，方能圆满。',
    },
  },
];
