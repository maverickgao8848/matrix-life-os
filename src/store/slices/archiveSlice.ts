import type { StateCreator } from 'zustand';
import type { Objective, ObjectiveArchive } from '../../types';

export interface ArchiveSlice {
  archives: ObjectiveArchive[];
  archiveObjective: (obj: Objective) => void;
  deleteArchive: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const createArchiveSlice: StateCreator<ArchiveSlice> = (set, get) => ({
  archives: [],

  archiveObjective: (obj) => {
    const archive: ObjectiveArchive = {
      id: generateId(),
      objectiveTitle: obj.title,
      krSnapshot: obj.krList.map((kr) => ({ ...kr })),
      completedAt: obj.completedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    set({ archives: [...get().archives, archive] });
  },

  deleteArchive: (id) => {
    set({ archives: get().archives.filter((a) => a.id !== id) });
  },
});
