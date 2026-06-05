import type { ModuleId, ModuleMeta, GtdPhase, ModulePage } from '../../types';

export const MODULE_REGISTRY: Record<ModuleId, ModuleMeta> = {
  // ─── 核心模块：捕捉 ───
  inbox: {
    id: 'inbox',
    name: '收集箱',
    description: '先丢进来，晚点再分类',
    defaultEnabled: true,
    defaultZone: 'main',
    icon: '[▣]',
    gtdPhase: 'capture',
    page: 'actionDesk',
    core: true,
  },
  inspiration: {
    id: 'inspiration',
    name: '灵感仓库',
    description: '想法的冷宫',
    defaultEnabled: false,
    defaultZone: 'side',
    icon: '[✦]',
    gtdPhase: 'capture',
    page: 'actionDesk',
    core: false,
  },

  // ─── 核心模块：支撑 ───
  calendar: {
    id: 'calendar',
    name: '日历',
    description: '按时间标注 — 时间坟场',
    defaultEnabled: true,
    defaultZone: 'side',
    icon: '[◷]',
    gtdPhase: 'support',
    page: 'actionDesk',
    core: false,
  },
  principles: {
    id: 'principles',
    name: '原则',
    description: '精神的指引 — 打破前先写下来',
    defaultEnabled: true,
    defaultZone: 'side',
    icon: '[◈]',
    gtdPhase: 'support',
    page: 'actionDesk',
    core: true,
  },
  habits: {
    id: 'habits',
    name: '习惯',
    description: '行为固化 — 重复性自欺欺人',
    defaultEnabled: false,
    defaultZone: 'side',
    icon: '[◎]',
    gtdPhase: 'support',
    page: 'actionDesk',
    core: false,
  },
  entertainment: {
    id: 'entertainment',
    name: '娱乐',
    description: '能量管理 — 合法摆烂',
    defaultEnabled: true,
    defaultZone: 'side',
    icon: '[♦]',
    gtdPhase: 'support',
    page: 'actionDesk',
    core: false,
  },

  // ─── 核心模块：执行 ───
  weekBoard: {
    id: 'weekBoard',
    name: '周看板',
    description: '本周任务一览',
    defaultEnabled: true,
    defaultZone: 'main',
    icon: '[◫]',
    gtdPhase: 'execute',
    page: 'actionDesk',
    core: true,
  },
  okr: {
    id: 'okr',
    name: 'OKR',
    description: '大梦切片',
    defaultEnabled: true,
    defaultZone: 'main',
    icon: '[◈]',
    gtdPhase: 'execute',
    page: 'actionDesk',
    core: true,
  },
  timeBlocks: {
    id: 'timeBlocks',
    name: '时间块',
    description: '把一天切成碎片',
    defaultEnabled: false,
    defaultZone: 'main',
    icon: '[◫]',
    gtdPhase: 'execute',
    page: 'actionDesk',
    core: false,
  },

  // ─── 核心模块：洞察 ───
  abilities: {
    id: 'abilities',
    name: '能力',
    description: '假装在进步',
    defaultEnabled: true,
    defaultZone: 'main',
    icon: '[◎]',
    gtdPhase: 'insight',
    page: 'reviewArchive',
    core: true,
  },
  reflectionLibrary: {
    id: 'reflectionLibrary',
    name: '反思档案',
    description: '过去的自己写的遗书',
    defaultEnabled: true,
    defaultZone: 'main',
    icon: '[◈]',
    gtdPhase: 'insight',
    page: 'reviewArchive',
    core: true,
  },
  objectiveArchive: {
    id: 'objectiveArchive',
    name: '光荣榜',
    description: '完成的墓碑陈列室',
    defaultEnabled: true,
    defaultZone: 'main',
    icon: '[◫]',
    gtdPhase: 'insight',
    page: 'reviewArchive',
    core: true,
  },
  mood: {
    id: 'mood',
    name: '心情',
    description: '内心天气谎报',
    defaultEnabled: false,
    defaultZone: 'side',
    icon: '[♥]',
    gtdPhase: 'insight',
    page: 'actionDesk',
    core: false,
  },
};

export const DEFAULT_ENABLED_MODULES: ModuleId[] = Object.values(MODULE_REGISTRY)
  .filter((m) => m.defaultEnabled)
  .map((m) => m.id);

export function getModuleMeta(id: ModuleId): ModuleMeta {
  return MODULE_REGISTRY[id];
}

export function getAllModules(): ModuleMeta[] {
  return Object.values(MODULE_REGISTRY);
}

export function getModulesByZone(zone: 'main' | 'side'): ModuleMeta[] {
  return Object.values(MODULE_REGISTRY).filter((m) => m.defaultZone === zone);
}

export function getModulesByPhase(phase: GtdPhase): ModuleMeta[] {
  return Object.values(MODULE_REGISTRY).filter((m) => m.gtdPhase === phase);
}

export function getModulesByPage(page: ModulePage): ModuleMeta[] {
  return Object.values(MODULE_REGISTRY).filter((m) => m.page === page);
}

export function getCoreModules(): ModuleMeta[] {
  return Object.values(MODULE_REGISTRY).filter((m) => m.core);
}

export function getOptionalModules(): ModuleMeta[] {
  return Object.values(MODULE_REGISTRY).filter((m) => !m.core);
}

export function getPhasesOrdered(): GtdPhase[] {
  return ['capture', 'support', 'execute', 'insight'];
}

export function getPhaseLabel(phase: GtdPhase): string {
  const labels: Record<GtdPhase, string> = {
    capture: '捕捉',
    support: '支撑',
    execute: '执行',
    insight: '洞察',
  };
  return labels[phase];
}
