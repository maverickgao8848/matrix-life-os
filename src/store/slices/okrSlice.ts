import type { StateCreator } from 'zustand';
import type { Objective, KeyResult, InboxItem } from '../../types';

export interface OKRSlice {
  objectives: Objective[];
  inboxItems: InboxItem[];
  addObjective: (title: string) => void;
  deleteObjective: (id: string) => void;
  updateObjectiveTitle: (id: string, title: string) => void;
  completeObjective: (id: string) => void;
  addKeyResult: (objectiveId: string, content: string) => void;
  deleteKeyResult: (objectiveId: string, krId: string) => void;
  toggleKeyResult: (objectiveId: string, krId: string) => void;
  updateKeyResult: (objectiveId: string, krId: string, content: string) => void;
  completeKR: (objectiveId: string, krId: string) => void;
  uncompleteKR: (objectiveId: string, krId: string) => void;
  scheduleKR: (objectiveId: string, krId: string, taskId: string) => void;
  unscheduleKR: (objectiveId: string, krId: string) => void;
  collectToInbox: (objectiveId: string, krId: string) => void;
  addQuickInboxItem: (content: string) => void;
  removeFromInbox: (id: string) => void;
  deleteInboxItem: (id: string) => void;
  toggleInboxItem: (id: string) => void;
  updateInboxItemAbility: (id: string, abilityId?: string, abilityPoints?: number, abilityName?: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const createOKRSlice: StateCreator<OKRSlice> = (set, get) => ({
  objectives: [],
  inboxItems: [],

  addObjective: (title) => {
    const obj: Objective = {
      id: generateId(),
      title,
      status: 'active',
      krList: [],
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    set({ objectives: [...get().objectives, obj] });
  },

  deleteObjective: (id) => {
    set({
      objectives: get().objectives.filter((o) => o.id !== id),
      inboxItems: get().inboxItems.filter((item) => item.objectiveId !== id),
    });
  },

  updateObjectiveTitle: (id, title) => {
    set({
      objectives: get().objectives.map((o) =>
        o.id === id ? { ...o, title } : o
      ),
    });
  },

  completeObjective: (id) => {
    set({
      objectives: get().objectives.map((o) =>
        o.id === id
          ? { ...o, status: 'completed' as const, completedAt: new Date().toISOString() }
          : o
      ),
    });
  },

  addKeyResult: (objectiveId, content) => {
    const kr: KeyResult = {
      id: generateId(),
      content,
      completed: false,
      scheduled: false,
      linkedTaskId: null,
    };
    set({
      objectives: get().objectives.map((o) =>
        o.id === objectiveId
          ? { ...o, krList: [...o.krList, kr] }
          : o
      ),
    });
  },

  deleteKeyResult: (objectiveId, krId) => {
    set({
      objectives: get().objectives.map((o) =>
        o.id === objectiveId
          ? { ...o, krList: o.krList.filter((kr) => kr.id !== krId) }
          : o
      ),
      inboxItems: get().inboxItems.filter((item) => item.id !== krId),
    });
  },

  toggleKeyResult: (objectiveId, krId) => {
    set({
      objectives: get().objectives.map((o) =>
        o.id === objectiveId
          ? {
              ...o,
              krList: o.krList.map((kr) =>
                kr.id === krId ? { ...kr, completed: !kr.completed } : kr
              ),
            }
          : o
      ),
    });
  },

  updateKeyResult: (objectiveId, krId, content) => {
    set({
      objectives: get().objectives.map((o) =>
        o.id === objectiveId
          ? {
              ...o,
              krList: o.krList.map((kr) =>
                kr.id === krId ? { ...kr, content } : kr
              ),
            }
          : o
      ),
    });
  },

  completeKR: (objectiveId, krId) => {
    set({
      objectives: get().objectives.map((o) =>
        o.id === objectiveId
          ? {
              ...o,
              krList: o.krList.map((kr) =>
                kr.id === krId ? { ...kr, completed: true } : kr
              ),
            }
          : o
      ),
    });
  },

  uncompleteKR: (objectiveId, krId) => {
    set({
      objectives: get().objectives.map((o) =>
        o.id === objectiveId
          ? {
              ...o,
              krList: o.krList.map((kr) =>
                kr.id === krId ? { ...kr, completed: false } : kr
              ),
            }
          : o
      ),
    });
  },

  scheduleKR: (objectiveId, krId, taskId) => {
    set({
      objectives: get().objectives.map((o) =>
        o.id === objectiveId
          ? {
              ...o,
              krList: o.krList.map((kr) =>
                kr.id === krId
                  ? { ...kr, scheduled: true, linkedTaskId: taskId }
                  : kr
              ),
            }
          : o
      ),
    });
  },

  unscheduleKR: (objectiveId, krId) => {
    set({
      objectives: get().objectives.map((o) =>
        o.id === objectiveId
          ? {
              ...o,
              krList: o.krList.map((kr) =>
                kr.id === krId
                  ? { ...kr, scheduled: false, linkedTaskId: null }
                  : kr
              ),
            }
          : o
      ),
    });
  },

  collectToInbox: (objectiveId, krId) => {
    const state = get();
    const alreadyInInbox = state.inboxItems.some((item) => item.id === krId);
    if (alreadyInInbox) return;

    const objective = state.objectives.find((o) => o.id === objectiveId);
    const kr = objective?.krList.find((k) => k.id === krId);
    if (!objective || !kr) return;

    const inboxItem: InboxItem = {
      id: kr.id,
      objectiveId: objective.id,
      objectiveTitle: objective.title,
      content: kr.content,
      completed: kr.completed,
      collectedAt: new Date().toISOString(),
    };
    set({ inboxItems: [...state.inboxItems, inboxItem] });
  },

  addQuickInboxItem: (content) => {
    const state = get();
    const inboxItem: InboxItem = {
      id: generateId(),
      content,
      completed: false,
      collectedAt: new Date().toISOString(),
    };
    set({ inboxItems: [...state.inboxItems, inboxItem] });
  },

  removeFromInbox: (id) => {
    set({ inboxItems: get().inboxItems.filter((item) => item.id !== id) });
  },

  deleteInboxItem: (id) => {
    set({ inboxItems: get().inboxItems.filter((item) => item.id !== id) });
  },

  toggleInboxItem: (id) => {
    set({
      inboxItems: get().inboxItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    });
  },

  updateInboxItemAbility: (id, abilityId, abilityPoints, abilityName) => {
    set({
      inboxItems: get().inboxItems.map((item) =>
        item.id === id
          ? { ...item, abilityId, abilityPoints, abilityName: abilityName || item.abilityName }
          : item
      ),
    });
  },
});
