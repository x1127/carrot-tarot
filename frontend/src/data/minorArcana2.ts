import type { TarotCard } from './types';

const suitMeta = {
  swords: { suit: 'swords', element: 'air' as const, en: 'Swords' },
  pentacles: { suit: 'pentacles', element: 'earth' as const, en: 'Pentacles' },
};

type CardDef = [number, string, string[], string, string[], string];

const swordsDefs: CardDef[] = [
  [1, '宝剑一', ['清晰', '突破', '真相', ' intellect', '决断'], '思维如利剑般清晰，突破迷雾见真相。理性决断与心智突破的时刻。', ['混乱', '错误判断', ' communication受阻', ' clouded'], '思维混乱或判断失误，沟通受阻。需要厘清思绪，避免冲动决策。'],
  [2, '宝剑二', ['僵局', '抉择', '逃避', '平衡', '盲点'], '陷入两难僵局，蒙眼回避抉择。维持表面平衡却逃避真实问题。', ['决定', '看清', '打破僵局', 'info'], '打破僵局做出决定，信息浮现让真相清晰。卸下眼罩直面选择。'],
  [3, '宝剑三', ['心碎', '悲伤', '痛苦', ' release', '失望'], '心碎与悲伤刺痛心头。面对情感的痛苦，在 release 中走向疗愈。', ['恢复', '原谅', '走出伤痛', '释怀'], '从伤痛中恢复，原谅与释怀带来疗愈。伤痛渐退，重见希望。'],
  [4, '宝剑四', ['休息', '休养', 'contemplation', '暂停', '恢复'], '需要休息与休养。暂停纷扰，静心 contemplation 以恢复精力。', [' restlessness', 'burnout', '急于求成', '失眠'], '无法安息或 burnout，急于求成。需要真正停下来恢复。'],
  [5, '宝剑五', ['冲突', '损失', ' hollow胜利', '背叛', '争执'], '冲突后的空虚与损失。即便胜利也可能是 hollow 的，警惕争斗的代价。', ['和解', '释怀', '放下争斗', '反思'], '从冲突中反思与和解，放下争斗。释怀前行，寻找真正价值。'],
  [6, '宝剑六', ['过渡', '前行', ' healing', '远离', '平稳'], '渡过难关走向平静的过渡。带着 healing 缓慢前行，远离风暴。', [' stalled', '抗拒前行', ' baggage', '回流'], '过渡 stalled 或抗拒前行，旧 baggage 未了。需要放下过去继续旅程。'],
  [7, '宝剑七', ['策略', ' deception', '回避', ' cunning', '偷偷摸摸'], '以策略与 cunning 应对局面，或涉及 deception 与回避。审视手段是否正当。', ['坦白', '坦诚', '改正', '暴露'], '坦白坦诚，改正过往的欺骗。隐瞒暴露，回归正直。'],
  [8, '宝剑八', ['束缚', ' self-limiting', ' trapped', '恐惧', '无力'], '被自我设限与恐惧束缚，感到 trapped。束缚多源于心，而非外在。', ['释放', '觉醒', '挣脱束缚', '看清真相'], '从自我束缚中觉醒释放，看清真相挣脱枷锁。找回力量。'],
  [9, '宝剑九', ['焦虑', '噩梦', ' grief', ' insomnia', '担忧'], '深陷焦虑与噩梦般的担忧。心魔放大恐惧，grief 与失眠困扰。', [' hope', '恢复', '看清恐惧', '释然'], '从焦虑中看见 hope，恐惧被看清而释然。黎明将至。'],
  [10, '宝剑十', ['终结', '崩塌', ' rock bottom', '痛苦终结', '放下'], '痛苦的彻底终结，触底 rock bottom。最深的黑暗之后，黎明终将到来。', [' recovery', '重生', '最坏已过', '回升'], '痛苦的终结与 recovery，最坏已过，迎来重生回升。'],
  [11, '宝剑侍从', ['好奇', '机敏', '新想法', '学习', ' vigilance'], '机敏好奇的思考学徒。以敏锐心智探索新想法，保持 vigilance 与求知。', [' gossip', '急躁', '浅薄', ' miscommunication'], '流于 gossip 或浅薄急躁，沟通失误。需要深入思考与谨慎言行。'],
  [12, '宝剑骑士', ['果断', '直言', ' intellect', '急切', '正义'], '果断直言的理智骑士。以 sharp 智慧与急切行动捍卫正义，雷厉风行。', ['冲动', 'ruthless', ' tactless', '冒进'], '冲动 ruthless 或 tactless，冒进伤人。需要审时度势，三思而行。'],
  [13, '宝剑王后', [' perceptive', '独立', '理性', 'straightforward', '公正'], '洞察敏锐的理性王后。以 perceptive 与公正直言，独立而清醒。', [' cold', ' bitter', ' harsh', 'severed'], '显得 cold bitter 或 harsh，关系 severed。需要以同理心平衡锋芒。'],
  [14, '宝剑国王', [' authority', ' truth', '公正', ' intellect', '决断'], '公正严明的理智之王。以 authority 与 truth 做出理性决断，秉持正义。', ['tyrannical', ' cold', 'manipulative', '冷酷'], 'tyrannical 或 manipulative 的冷酷。需要以仁慈平衡权威。'],
];

const pentaclesDefs: CardDef[] = [
  [1, '星币一', ['机遇', '丰盛', ' prosperity', '新投资', '显化'], '物质与丰盛的新机遇降临。 prosperity 的种子已种下，抓住机会显化财富。', ['延迟', '错失', ' scarcity', '计划受阻'], '机遇延迟或错失，感到 scarcity。需要耐心等待，避免错失良机。'],
  [2, '星币二', ['平衡', 'juggling', '灵活', '适应', '波动'], '在多重事务间 juggling 平衡。灵活适应波动，权衡优先级。', [' overwhelmed', '失衡', ' overcommit', '混乱'], ' overwhelmed 或 overcommit，失衡混乱。需要聚焦，减少分心。'],
  [3, '星币三', ['合作', '技艺', ' teamwork', '学习', '精进'], '团队合作与技艺精进。各展所长协作，在学习中提升专业。', ['不协调', ' discord', '缺乏协作', '平庸'], '团队 discord 或缺乏协作，平庸敷衍。需要重新对齐目标与分工。'],
  [4, '星币四', [' security', ' control', ' holding', ' stable', '保守'], '追求 security 与控制，紧握所拥有。 stable 但可能过于保守吝啬。', [' loosening', '放手', ' loss', ' sharing'], ' loosening 控制，学会放手与 sharing。释放囤积，流动带来新生。'],
  [5, '星币五', ['匮乏', '困境', ' hardship', ' isolation', '寒冷'], '物质与精神的匮乏困境。 hardship 中感到孤立寒冷，但援助可能近在咫尺。', [' recovery', '援助', '回暖', '走出困境'], '从困境中 recovery，援助到来，境况回暖。走出匮乏。'],
  [6, '星币六', ['慷慨', ' giving', '平衡', ' charity', '分享'], '慷慨给予与平衡分享。以 charity 与公正分配资源，给予亦收获。', ['失衡', ' strings attached', ' debt', '一方付出'], '给予失衡或带有 strings attached，陷入 debt。需要重建公平的给予。'],
  [7, '星币七', [' patience', '评估', '等待', ' investment', '反思'], '耐心等待 investment 的成果。停下评估进展，反思付出与回报。', [' impatience', '徒劳', '短视', '失望'], ' impatient 或感到徒劳，短视失望。需要调整策略，耐心坚持。'],
  [8, '星币八', ['技艺', ' diligence', '精进', 'craftsmanship', '专注'], '以 diligence 与专注精进技艺。在 craftsmanship 中打磨专业，勤勉成长。', [' perfectionism', '乏味', '缺乏专注', '敷衍'], ' perfectionism 或乏味敷衍，缺乏专注。需要找回热忱与节奏。'],
  [9, '星币九', ['独立', '丰盛', ' self-sufficient', '享受成果', '优雅'], '独立而丰盛的 self-sufficient 状态。享受自己努力换来的成果与优雅。', ['依赖', ' insecurity', 'false wealth', '失衡'], '依赖他人或 insecurity， false wealth 掩盖问题。需要建立真实自立。'],
  [10, '星币十', ['传承', ' wealth', '家庭', ' lasting', '稳固'], '世代传承的 wealth 与稳固根基。家庭与事业的 lasting 成就。', ['家庭纷争', ' loss', 'legacy受损', '不稳'], '家庭纷争或财富 loss， legacy 受损。需要修复根基与传承。'],
  [11, '星币侍从', ['学习', '机遇', ' diligent', '新投资', '务实'], '勤奋务实的学习者。以 diligent 态度把握新机遇，务实积累。', [' lazy', ' procrastinate', '浅尝辄止', '缺乏计划'], ' lazy 或 procrastinate，浅尝辄止。需要脚踏实地付诸行动。'],
  [12, '星币骑士', [' reliable', '勤奋', ' patient', '稳重', '推进'], '可靠勤奋的稳重骑士。以 patient 与可靠持续推进，脚踏实地达成目标。', [' stagnation', '固执', ' boring', ' stuck'], ' stagnation 或固执 stuck， dull 守成。需要灵活突破瓶颈。'],
  [13, '星币王后', [' nurturing', '丰盛', ' practical', ' grounded', '滋养'], '滋养万物的丰盛王后。以 practical 与 grounded 创造物质与情感的丰盛。', [' self-worth低', '依赖', 'materialistic', 'neglect'], ' self-worth 低或 materialistic， neglect 自身。需要回归自我滋养。'],
  [14, '星币国王', [' mastery', ' wealth', ' stability', '可靠', '成就'], '掌控财富与稳定的成就之王。以 mastery 与可靠奠定 lasting 基业。', [' greedy', ' controlling', 'materialistic', 'stubborn'], ' greedy 或 controlling， materialistic 而 stubborn。需要以德御财。'],
];

function buildSuit(suitKey: keyof typeof suitMeta, defs: CardDef[]): TarotCard[] {
  const meta = suitMeta[suitKey];
  return defs.map(([number, name, upKw, upMeaning, revKw, revMeaning]) => ({
    id: `${suitKey}-${String(number).padStart(2, '0')}`,
    name,
    englishName: `${meta.en} ${number}`,
    arcana: 'minor' as const,
    suit: meta.suit as any,
    number,
    element: meta.element,
    keywords: { upright: upKw, reversed: revKw },
    meaning: { upright: upMeaning, reversed: revMeaning },
  }));
}

export const swords = buildSuit('swords', swordsDefs);
export const pentacles = buildSuit('pentacles', pentaclesDefs);
