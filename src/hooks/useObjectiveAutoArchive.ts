import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useObjectiveAutoArchive() {
  const archiveObjective = useAppStore((s) => s.archiveObjective);
  const deleteObjective = useAppStore((s) => s.deleteObjective);

  const tryArchiveObjective = useCallback(
    (objectiveId: string) => {
      // Read latest state directly from store to avoid stale closure
      const obj = useAppStore.getState().objectives.find((o) => o.id === objectiveId);
      if (!obj) return;

      const allCompleted = obj.krList.length > 0 && obj.krList.every((kr) => kr.completed);
      if (!allCompleted) return;

      archiveObjective(obj);
      deleteObjective(objectiveId);
    },
    [archiveObjective, deleteObjective]
  );

  return { tryArchiveObjective };
}
