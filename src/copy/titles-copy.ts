// Titles Copy — 全局模块/面板标题
// 调性：带刺的镜子。笑着笑着突然沉默，然后默默去把任务做了。
// 规则：精简至上，去掉无意义英文前缀，降低认知负荷。

export const titlesCopy = {
  // ── Action Desk 行动台 ──
  quickInbox:      '收集箱',
  weekBoard:       '周看板',
  dailyProgress:   '今日进度',
  okr:             'OKR',
  calendar:        '日历',
  myPrinciples:    '原则',
  entertainment:   '娱乐',
  timeBlocks:      '时间块',
  habitTracker:    '习惯',
  moodTracker:     '心情',
  inspirationVault:'灵感',

  // ── Review Archive 回顾档案 ──
  todaysReflection:   '今日反思',
  reflectionLibrary:  '反思档案',
  abilityReader:      '能力雷达',
  abilityRadar:       '自欺欺人图',
  abilityTraining:    '训练',
  abilityDistribution:'偏科',
  objectiveArchive:   '光荣榜',
  dataBackup:         '备份',

  // ── System 系统 ──
  moduleManager:        '功能开关',
  reflectionTemplates:  '反思模板',
  dataHealth:           '体检报告',
  update:               '版本',
  manual:               '说明书',
  about:                '关于',
  dailyTruth:           '室友说',

  // ── Navigation 导航 ──
  nav: {
    actionDesk:    '行动台',
    reviewArchive: '回顾档案',
    system:        '系统',
  },
} as const;

export type TitlesCopy = typeof titlesCopy;
