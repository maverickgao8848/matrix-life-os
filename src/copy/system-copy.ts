// System Page Copy — Updates, Backup, About, Last Words
// 调性：软件不再是一个工具，是一个冷眼旁观你摆烂的室友。
// 规则：精简至上，能删则删，保留黑色幽默内核。

export const systemCopy = {
  update: {
    currentVersion: '版本',
    checkButton: '打听一下',
    checking: '打听中……',
    upToDate: '已是最新。修道院也没新活儿了。',
    hasUpdate: '有新版本——虽然你未必会更自律。',
    updateError: '信使迷路了。可能是网断了，也可能是信使在拖延。',
    downloadUrl: '下载',
  },

  backup: {
    title: '罪证封存',
    exportButton: '导出',
    importButton: '导入',
    exportSuccess: '已封存。',
    importSuccess: '旧账已展开，即将刷新…',
    importFailed: '卷轴破损。又在导入表情包？',
    sepiaHint: '',
    fullExport: '全部',
    highValueExport: '高价值',
  },

  health: {
    title: '体检报告',
    checkButton: '诊断',
    checking: '翻查中…',
    statusOk: '正常',
    statusWarn: '警告',
    statusError: '异常',
    structureOk: '结构',
    structureError: '结构',
    orphanedFound: '失联',
    orphanedNone: '失联',
    sizeLabel: '大小',
    detailOk: '一切正常，强迫症可以安心了。',
    detailWarn: '有些数据断了联系，建议检查。',
    detailError: '数据结构严重异常，请立即备份。',
  },

  about: {
    title: '关于',
    appName: 'ASCII LIFE OS',
    description: '不会替你完成任务，但会冷静记录你欠了多少。',
    author: '',
    license: '',
  },

  // Last words: app-before-quit, softer than quotes
  lastWords: [
    '今日无反思，24 小时将被毫无痕迹地回收。',
    '你没有留下任何文字就离开了，仿佛今天从未存在过。',
    '系统即将关闭，而你今天的答案栏里只有沉默。',
    '记录不是为了完美，是为了证明今天确实发生过。',
    '又一天过去了。软件帮你记住了：什么也没记。',
    '关闭窗口只需 0.3 秒，关闭愧疚感需要更久。',
  ],

  nav: {
    systemTitle: '系统',
    hasUpdateMarker: '*',
  },

  // Monk quote box title
  quoteTitle: '室友说',

  manual: {
    panelTitle: '生存指南',
    panelDescription: '大多数人也不知道自己该怎么活。至少软件有说明书。',
    openButton: '看看',
    closeButton: '关闭',
    title: '生存指南',
    sections: [
      {
        heading: '核心理念',
        content: `记录即存在。

记忆会美化懒惰、淡化遗憾。这个系统不是为了"更高效"，是为了帮你诚实面对自己：今天做了什么？想成为什么样的人？差距有多大？

ASCII 修道院风格 = 自律是一场修行。没有甜蜜鼓励，只有冷静记录。`,
      },
      {
        heading: '方法论与系统架构',
        content: `本系统的设计深受 GTD（Getting Things Done）启发，但按实际功能抽象为四步闭环：捕捉 → 支撑 → 执行 → 洞察。

· 捕捉：大脑不擅长记忆，擅长思考。收集箱和灵感仓库是你与系统的接口——任何念头、任务、想法，先丢进来，不判断、不排序。这一步释放的是"心智能量"，让你从"我是不是忘了什么"的焦虑中解放出来。

· 支撑：执行需要背景。日历标记时间约束，原则划定行为边界，习惯建立重复节奏，娱乐保留喘息空间。它们不直接产生行动，但决定了行动的质量和可持续性。

· 执行：前面的所有准备都是为了这一刻。周看板是你每天的主战场，OKR 确保你在做正确的事，时间块帮你守住专注的边界。

· 洞察：系统默认设计了能力雷达、反思记录与光荣榜。洞察不是自责，是校准——能力雷达让你看见自己的长板与盲区，反思记录帮你把经验沉淀为认知，光荣榜则是对抗遗忘的纪念碑，证明你确实做成过一些事。没有回顾的系统会沦为垃圾堆。

这个循环对个人成长的意义在于：它把"自律"从一种道德要求，变成了一套可操作的流程。你不需要"变得更努力"，你只需要按顺序走完这四步。流程会推着你前进。

此外，本系统的板块支持自由添加与删除。这不是为了炫技，而是因为每个人的成长阶段不同：新手需要收集箱 + 习惯追踪就能起步；进阶者可能需要 OKR + 能力雷达做战略级管理；某人某个月在备考，他可以临时加上时间块，考完后移除。系统应该像乐高一样随你组装，而不是像企业软件一样强迫你用完所有功能。

所有板块集中在一个页面，同样经过深思熟虑。个人管理最大的敌人是"切换成本"——你在 Todo App 记任务，在日历看日程，在备忘录写反思，在 Excel 追踪习惯。每一次切换都是注意力的泄漏。本系统把所有模块放在同一视野下，让你一眼看到全局：今天的任务、本周的进度、心情曲线、能力雷达，它们彼此之间是有关系的。集中不是拥挤，是上下文完整。`,
      },
      {
        heading: '最佳实践',
        content: `· 早上：清空收集箱，不要判断，不要排序。
· 晚上：写今日反思，哪怕一句话。空白的日历会惩罚你。
· 定期校准：打开能力雷达，看看哪些维度长期停滞；翻翻反思记录，同样的坑有没有反复踩。
· 光荣榜不是炫耀：每完成一件值得记住的事，记下来。低谷时它是你"确实可以"的证据。
· 诚实记录情绪：不是为了展示"今天很好"，是为了收集真实数据。
· 不要追求完美：用好 3 个功能就超过 90% 的用户。
· 接受毒舌：刻薄不是 bug，是 feature。温柔的镜子不会改变你。`,
      },
    ],
  },
} as const;

export type SystemCopy = typeof systemCopy;
