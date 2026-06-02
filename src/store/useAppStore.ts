import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';
import { createTaskSlice, type TaskSlice } from './slices/taskSlice';
import { createPrincipleSlice, type PrincipleSlice } from './slices/principleSlice';
import { createAbilitySlice, type AbilitySlice } from './slices/abilitySlice';
import { createReflectionSlice, type ReflectionSlice } from './slices/reflectionSlice';
import { createEntertainmentSlice, type EntertainmentSlice } from './slices/entertainmentSlice';
import { createConfigSlice, type ConfigSlice } from './slices/configSlice';
import { createCalendarSlice, type CalendarSlice } from './slices/calendarSlice';
import { createOKRSlice, type OKRSlice } from './slices/okrSlice';
import { createModuleSlice, type ModuleSlice } from './slices/moduleSlice';
import { createHabitSlice, type HabitSlice } from './slices/habitSlice';
import { createMoodSlice, type MoodSlice } from './slices/moodSlice';
import { createTimeBlockSlice, type TimeBlockSlice } from './slices/timeBlockSlice';
import { createInspirationSlice, type InspirationSlice } from './slices/inspirationSlice';
import { createReflectionTemplateSlice, type ReflectionTemplateSlice, DEFAULT_TEMPLATE } from './slices/reflectionTemplateSlice';
import { createLayoutSlice, type LayoutSlice, DEFAULT_DASHBOARD_LAYOUT, DEFAULT_REFLECTION_LAYOUT, DEFAULT_SYSTEM_LAYOUT } from './slices/layoutSlice';
import { migrateAllReflections } from '../utils/migrateReflectionData';
import { migrateAppData, CURRENT_APP_VERSION } from '../utils/migrateAppData';
import { electronStorage } from '../utils/electronStorage';
import type { AppState } from '../types';

export type AppStore = TaskSlice &
  CalendarSlice &
  PrincipleSlice &
  AbilitySlice &
  ReflectionSlice &
  EntertainmentSlice &
  ConfigSlice &
  OKRSlice &
  ModuleSlice &
  HabitSlice &
  MoodSlice &
  TimeBlockSlice &
  InspirationSlice &
  ReflectionTemplateSlice &
  LayoutSlice & {
    __version: string;
    storageWarning: boolean;
    setStorageWarning: (v: boolean) => void;
  };

export const useAppStore = create<AppStore>()(
  persist<AppStore, [], [], AppState>(
    (...args) => ({
      ...createTaskSlice(...args),
      ...createCalendarSlice(...args),
      ...createPrincipleSlice(...args),
      ...createAbilitySlice(...args),
      ...createReflectionSlice(...args),
      ...createEntertainmentSlice(...args),
      ...createConfigSlice(...args),
      ...createOKRSlice(...args),
      ...createModuleSlice(...args),
      ...createHabitSlice(...args),
      ...createMoodSlice(...args),
      ...createTimeBlockSlice(...args),
      ...createInspirationSlice(...args),
      ...createReflectionTemplateSlice(...args),
      ...createLayoutSlice(...args),
      __version: CURRENT_APP_VERSION,
      storageWarning: false,
      setStorageWarning: (v: boolean) => args[0]({ storageWarning: v }),
    }),
    {
      name: 'alo-storage',
      storage: electronStorage as PersistStorage<AppState>,
      partialize: (state) => {
        const partial = {
          tasks: state.tasks,
          calendarEvents: state.calendarEvents,
          principles: state.principles,
          abilities: state.abilities,
          reflections: state.reflections,
          entertainments: state.entertainments,
          objectives: state.objectives,
          inboxItems: state.inboxItems,
          config: state.config,
          enabledModules: state.enabledModules,
          habits: state.habits,
          moods: state.moods,
          timeBlocks: state.timeBlocks,
          inspirations: state.inspirations,
          reflectionTemplates: state.reflectionTemplates,
          dashboardLayout: state.dashboardLayout,
          reflectionLayout: state.reflectionLayout,
          systemLayout: state.systemLayout,
          __version: state.__version,
        };
        const size = new Blob([JSON.stringify(partial)]).size;
        const MB = size / (1024 * 1024);
        if (MB > 4.5) {
          console.warn(`[storage] Data size ${MB.toFixed(2)}MB exceeds 4.5MB threshold. Export and clean up recommended.`);
          state.setStorageWarning(true);
        } else if (MB > 4) {
          console.warn(`[storage] Data size ${MB.toFixed(2)}MB approaching 4MB limit.`);
        }
        return partial;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Migrate old reflection data format
        const result = migrateAllReflections(
          state.reflections || [],
          state.reflectionTemplates || []
        );
        state.reflections = result.reflections;
        state.reflectionTemplates = result.templates;

        // Ensure default reflection template exists for new users
        if (!state.reflectionTemplates || state.reflectionTemplates.length === 0) {
          state.reflectionTemplates = [DEFAULT_TEMPLATE];
        }

        // Ensure layout fields have defaults (for users upgrading from older versions)
        if (!state.dashboardLayout) state.dashboardLayout = DEFAULT_DASHBOARD_LAYOUT;
        if (!state.reflectionLayout) state.reflectionLayout = DEFAULT_REFLECTION_LAYOUT;
        if (!state.systemLayout) state.systemLayout = DEFAULT_SYSTEM_LAYOUT;

        // Migrate app data version
        const migrated = migrateAppData(state, CURRENT_APP_VERSION);
        Object.assign(state, migrated);
      },
    }
  )
);
