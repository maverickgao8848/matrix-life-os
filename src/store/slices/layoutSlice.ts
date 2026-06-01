import type { StateCreator } from 'zustand';
import type { DashboardLayout, TwoColumnLayout } from '../../types';

export interface LayoutSlice {
  dashboardLayout: DashboardLayout;
  reflectionLayout: TwoColumnLayout;
  systemLayout: TwoColumnLayout;
  setDashboardLayout: (layout: DashboardLayout) => void;
  setReflectionLayout: (layout: TwoColumnLayout) => void;
  setSystemLayout: (layout: TwoColumnLayout) => void;
}

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayout = {
  main: ['todayProgress', 'dailyReflection', 'dataBackup', 'timeBlocks'],
  side: ['principles', 'calendar', 'entertainment', 'habits', 'mood', 'inspiration'],
};

export const DEFAULT_REFLECTION_LAYOUT: TwoColumnLayout = {
  left: ['reflectionLibrary'],
  right: ['abilityReader', 'abilityTraining'],
};

export const DEFAULT_SYSTEM_LAYOUT: TwoColumnLayout = {
  left: ['updatePanel', 'dataBackupRitual'],
  right: ['aboutBox', 'monkQuote'],
};

export const createLayoutSlice: StateCreator<LayoutSlice> = (set) => ({
  dashboardLayout: DEFAULT_DASHBOARD_LAYOUT,
  reflectionLayout: DEFAULT_REFLECTION_LAYOUT,
  systemLayout: DEFAULT_SYSTEM_LAYOUT,

  setDashboardLayout: (layout) => set({ dashboardLayout: layout }),
  setReflectionLayout: (layout) => set({ reflectionLayout: layout }),
  setSystemLayout: (layout) => set({ systemLayout: layout }),
});
