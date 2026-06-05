import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getTodayString, getWeekStart, isSameWeek } from '../utils/date';

export const useDayMigration = () => {
  useEffect(() => {
    const state = useAppStore.getState();
    const { config, deleteCompletedTasks, migrateAllBeforeToday, updateConfig } = state;
    const today = getTodayString();
    const todayWeekStart = getWeekStart();

    // Same day: nothing to do
    if (config.lastVisitDate === today) return;

    // New week: delete all completed tasks
    // This implements the "lightweight history" policy: only keep unfinished tasks.
    if (!isSameWeek(config.currentWeekStart, todayWeekStart)) {
      deleteCompletedTasks();
      updateConfig({ currentWeekStart: todayWeekStart });
    }

    // Migrate all active tasks from before today to today
    migrateAllBeforeToday(today);
    updateConfig({ lastVisitDate: today });
  }, []);
};
