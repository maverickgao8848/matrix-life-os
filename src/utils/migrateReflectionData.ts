import type { Reflection, ReflectionTemplate } from '../types';
import { DEFAULT_TEMPLATE } from '../store/slices/reflectionTemplateSlice';

/**
 * 检测并迁移旧格式的反思数据到新格式
 * 旧格式: template: 'obstacle-breakthrough', answers: { obstacle, solution, effective, adjustment, control }
 * 新格式: templateId: 'obstacle-breakthrough', answers: Record<string, string | number>
 */
export interface LegacyReflection {
  id: string;
  date: string;
  template: 'obstacle-breakthrough';
  answers: {
    obstacle: string;
    solution: string;
    effective: string;
    adjustment: string;
    control: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export function isLegacyReflection(r: unknown): r is LegacyReflection {
  const obj = typeof r === 'object' && r !== null ? (r as Record<string, unknown>) : null;
  if (!obj) return false;
  return (
    typeof obj.template === 'string' &&
    obj.template === 'obstacle-breakthrough' &&
    obj.answers !== null &&
    obj.answers !== undefined &&
    typeof obj.answers === 'object' &&
    !Array.isArray(obj.answers) &&
    'obstacle' in (obj.answers as Record<string, unknown>)
  );
}

export function migrateReflection(
  legacy: LegacyReflection
): Reflection {
  return {
    id: legacy.id,
    date: legacy.date,
    templateId: legacy.template,
    answers: {
      'q-obstacle': legacy.answers.obstacle,
      'q-solution': legacy.answers.solution,
      'q-effective': legacy.answers.effective,
      'q-adjustment': legacy.answers.adjustment,
      'q-control': legacy.answers.control,
    },
    tags: legacy.tags,
    createdAt: legacy.createdAt,
    updatedAt: legacy.updatedAt,
    linkedObjectiveIds: [],
  };
}

export function migrateAllReflections(
  reflections: unknown[],
  templates: ReflectionTemplate[]
): { reflections: Reflection[]; templates: ReflectionTemplate[] } {
  const hasLegacy = reflections.some(isLegacyReflection);

  if (!hasLegacy) {
    return { reflections: reflections as Reflection[], templates };
  }

  // 确保默认模板存在
  const hasDefaultTemplate = templates.some((t) => t.id === DEFAULT_TEMPLATE.id);
  const nextTemplates = hasDefaultTemplate
    ? templates
    : [DEFAULT_TEMPLATE, ...templates];

  const nextReflections = reflections.map((r) => {
    if (isLegacyReflection(r)) {
      return migrateReflection(r);
    }
    return r as Reflection;
  });

  return { reflections: nextReflections, templates: nextTemplates };
}
