/**
 * 数据迁移框架
 * 版本链检测 + 自动迁移
 */

import type { AppState } from '../types';
import { compareVersion, APP_VERSION } from './checkUpdate';

export const CURRENT_APP_VERSION = APP_VERSION;

/** 单次迁移函数签名 */
type Migration = (state: AppState) => AppState;

/** 注册所有历史迁移 */
const migrations: Record<string, Migration> = {
  '0.3.0': (state) => {
    const today = new Date().toISOString().split('T')[0];

    // 1) Migrate Objectives from v1.x (period-based) to v2.0 (status-based)
    const migratedObjectives = (state.objectives || []).map((o: unknown) => {
      const oldObj = o as Record<string, unknown>;
      const oldKRs = (oldObj.keyResults as Array<Record<string, unknown>>) || [];
      const newKRs = oldKRs.map((kr) => ({
        id: String(kr.id || Math.random().toString(36).substring(2, 9)),
        content: String(kr.content || ''),
        completed: Boolean(kr.completed),
        scheduled: false,
        linkedTaskId: null as string | null,
      }));
      return {
        id: String(oldObj.id || Math.random().toString(36).substring(2, 9)),
        title: String(oldObj.title || ''),
        status: 'active' as const,
        krList: newKRs,
        createdAt: String(oldObj.createdAt || new Date().toISOString()),
        completedAt: oldObj.completedAt ? String(oldObj.completedAt) : null,
      };
    });

    // 2) Migrate Tasks: ensure source / linkedKrId, and move legacy BACKLOG to today
    const migratedTasks = (state.tasks || []).map((t: unknown) => {
      const task = t as Record<string, unknown>;
      const date = task.date === 'BACKLOG' ? today : String(task.date || today);
      return {
        ...task,
        date,
        source: task.source === 'direct' ? 'manual' : (task.source || 'manual'),
        linkedKrId: (task.linkedKrId as string | null | undefined) ?? null,
      } as unknown as typeof state.tasks[0];
    });

    // 3) Ensure reflections have linkedObjectiveIds
    const migratedReflections = (state.reflections || []).map((r: unknown) => {
      const ref = r as Record<string, unknown>;
      return {
        ...ref,
        linkedObjectiveIds: Array.isArray(ref.linkedObjectiveIds)
          ? ref.linkedObjectiveIds
          : [],
      } as unknown as typeof state.reflections[0];
    });

    // 4) Clean up legacy ability.autoAddToBacklog and snapshot config fields
    const migratedAbilities = (state.abilities || []).map((a: unknown) => {
      const ability = { ...(a as Record<string, unknown>) };
      delete ability.autoAddToBacklog;
      return ability as unknown as typeof state.abilities[0];
    });

    const config = { ...(state.config as unknown as Record<string, unknown>) };
    delete config.autoSnapshot;
    delete config.lastSnapshotAt;

    return {
      ...state,
      objectives: migratedObjectives as unknown as typeof state.objectives,
      tasks: migratedTasks,
      reflections: migratedReflections,
      abilities: migratedAbilities,
      config: config as unknown as typeof state.config,
    };
  },
};

/**
 * 执行数据迁移
 * @param state 当前状态（可能来自旧版本）
 * @param targetVersion 目标版本号
 * @returns 迁移后的新状态
 */
export function migrateAppData(
  state: AppState,
  targetVersion: string
): AppState {
  const currentVersion = state.__version || '0.1.0';

  if (currentVersion === targetVersion) {
    return state;
  }

  // 降级不支持，直接标记版本
  if (compareVersion(currentVersion, targetVersion) > 0) {
    return { ...state, __version: targetVersion };
  }

  let next: AppState = { ...state };
  const versions = Object.keys(migrations).sort(compareVersion);

  for (const v of versions) {
    if (
      compareVersion(v, currentVersion) > 0 &&
      compareVersion(v, targetVersion) <= 0
    ) {
      next = migrations[v](next);
    }
  }

  next.__version = targetVersion;
  return next;
}
