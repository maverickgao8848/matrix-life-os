import React from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  pointerWithin,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import TaskBoard from '../features/tasks/TaskBoard';
import TodayProgress from '../features/tasks/TodayProgress';
import EntertainmentPanel from '../features/entertainment/EntertainmentPanel';
import PrinciplesPanel from '../features/principles/PrinciplesPanel';
import HabitTrackerPanel from '../features/habits/HabitTrackerPanel';
import MoodTrackerPanel from '../features/mood/MoodTrackerPanel';
import TimeBlockPanel from '../features/timeblocks/TimeBlockPanel';
import InspirationVaultPanel from '../features/inspiration/InspirationVaultPanel';

import QuickInbox from '../features/inbox/QuickInbox';
import OKRPanel from '../features/okr/OKRPanel';

import MiniCalendar from '../components/MiniCalendar';
import DraggablePanel from '../components/DraggablePanel';
import AsciiBox from '../components/AsciiBox';
import { useAppStore } from '../store/useAppStore';
import { useSarcasticMonologue } from '../hooks/useSarcasticMonologue';
import { titlesCopy } from '../copy/titles-copy';
import type { ModuleId } from '../types';

// Draggable panels below the fixed Daily Progress → OKR section
const ALL_MAIN_PANELS = ['timeBlocks', 'habits'];
const MAIN_CONTAINER_ID = 'actiondesk-main';

interface DroppableColumnProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, className, style, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className} style={style}>
      {children}
    </div>
  );
};

interface DroppableZoneProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  activeDragId: string | null;
}

const DroppableZone: React.FC<DroppableZoneProps> = ({ id, children, className, style, activeDragId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: !activeDragId || !activeDragId.startsWith('inbox-'),
  });

  const isActive = isOver && activeDragId?.startsWith('inbox-');

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={{
        ...style,
        transition: 'box-shadow var(--duration-instant), border-color var(--duration-instant)',
        boxShadow: isActive ? 'inset 0 0 0 2px var(--accent-gold)' : 'none',
        borderRadius: isActive ? 'var(--space-1)' : undefined,
      }}
    >
      {children}
    </div>
  );
};

const ActionDesk: React.FC = () => {
  const isModuleEnabled = useAppStore((s) => s.isModuleEnabled);
  const dashboardLayout = useAppStore((s) => s.dashboardLayout);
  const setDashboardLayout = useAppStore((s) => s.setDashboardLayout);
  const { text: monologue } = useSarcasticMonologue();
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null);
  const [activeDragContent, setActiveDragContent] = React.useState<string>('');

  // Task board drag dependencies
  const tasks = useAppStore((s) => s.tasks);
  const moveTask = useAppStore((s) => s.moveTask);
  const reorderTasks = useAppStore((s) => s.reorderTasks);
  const inboxItems = useAppStore((s) => s.inboxItems);
  const addTask = useAppStore((s) => s.addTask);
  const removeFromInbox = useAppStore((s) => s.removeFromInbox);
  const objectives = useAppStore((s) => s.objectives);
  const scheduleKR = useAppStore((s) => s.scheduleKR);
  const deleteTask = useAppStore((s) => s.deleteTask);

  // Inbox drop target actions
  const addObjective = useAppStore((s) => s.addObjective);
  const addPrinciple = useAppStore((s) => s.addPrinciple);
  const addInspiration = useAppStore((s) => s.addInspiration);
  const addCalendarEvent = useAppStore((s) => s.addCalendarEvent);
  const addHabit = useAppStore((s) => s.addHabit);
  const addEntertainment = useAppStore((s) => s.addEntertainment);
  const addTimeBlock = useAppStore((s) => s.addTimeBlock);

  const isEnabled = (id: string): boolean => {
    if (['todayProgress'].includes(id)) return true;
    return isModuleEnabled(id as ModuleId);
  };

  // Ordered visible panels: respect saved order, append new/unknown panels at end
  const visibleMain = [
    ...dashboardLayout.main.filter((id) => ALL_MAIN_PANELS.includes(id) && isEnabled(id)),
    ...ALL_MAIN_PANELS.filter((id) => isEnabled(id) && !dashboardLayout.main.includes(id)),
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const collisionDetectionStrategy = React.useCallback(
    (args: Parameters<typeof closestCenter>[0]) => {
      const activeId = args.active.id as string;
      // For inbox items and KRs dropping onto zones/calendar days,
      // prefer pointerWithin so the cursor-hit container wins.
      if (activeId.startsWith('inbox-') || activeId.startsWith('kr-')) {
        const collisions = pointerWithin(args);
        if (collisions.length > 0) {
          return collisions;
        }
      }
      return closestCenter(args);
    },
    []
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id as string;
    setActiveDragId(id);
    const data = active.data.current as { content?: string } | undefined;
    setActiveDragContent(data?.content || '');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    setActiveDragContent('');
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // ── Panel reordering (main area panels) ──
    const isPanelId = (id: string) => visibleMain.includes(id) || id === MAIN_CONTAINER_ID;
    if (isPanelId(activeId) && isPanelId(overId)) {
      const fromIdx = visibleMain.indexOf(activeId);
      const toIdx = visibleMain.indexOf(overId);
      if (fromIdx >= 0 && toIdx >= 0) {
        setDashboardLayout({
          main: arrayMove(visibleMain, fromIdx, toIdx),
          side: dashboardLayout.side,
        });
      }
      return;
    }

    // ── KR drop from OKR panel to task board ──
    if (activeId.startsWith('kr-')) {
      const krId = activeId.replace('kr-', '');
      const data = active.data.current as { objectiveId?: string; content?: string } | undefined;
      const objectiveId = data?.objectiveId;
      const content = data?.content;
      if (!objectiveId || !content) return;

      const objective = objectives.find((o) => o.id === objectiveId);
      const kr = objective?.krList.find((k) => k.id === krId);
      if (!kr) return;

      let targetDate: string;
      if (overId.startsWith('column-')) {
        targetDate = overId.replace('column-', '');
      } else {
        const overTask = tasks.find((t) => t.id === overId);
        if (!overTask) return;
        targetDate = overTask.date;
      }

      if (kr.linkedTaskId) {
        deleteTask(kr.linkedTaskId);
      }

      const newTaskId = addTask(content, targetDate, undefined, undefined, 'kr', krId);
      scheduleKR(objectiveId, krId, newTaskId);
      return;
    }

    // ── Inbox item drop to various targets ──
    if (activeId.startsWith('inbox-')) {
      const inboxItemId = activeId.replace('inbox-', '');
      const inboxItem = inboxItems.find((item) => item.id === inboxItemId);
      if (!inboxItem) return;
      const today = new Date().toISOString().split('T')[0];

      // Calendar day drop (precise date)
      if (overId.startsWith('calendar-day-')) {
        const date = overId.replace('calendar-day-', '');
        addCalendarEvent(date, inboxItem.content);
        removeFromInbox(inboxItemId);
        return;
      }

      switch (overId) {
        case 'drop-okr':
          addObjective(inboxItem.content);
          removeFromInbox(inboxItemId);
          return;
        case 'drop-principles':
          addPrinciple(inboxItem.content);
          removeFromInbox(inboxItemId);
          return;
        case 'drop-inspiration':
          addInspiration({ content: inboxItem.content, source: 'inbox', tags: [] });
          removeFromInbox(inboxItemId);
          return;
        case 'drop-calendar':
          addCalendarEvent(today, inboxItem.content);
          removeFromInbox(inboxItemId);
          return;
        case 'drop-habits':
          addHabit({ name: inboxItem.content, color: 'gold', frequency: 'daily', targetDays: 7 });
          removeFromInbox(inboxItemId);
          return;
        case 'drop-entertainment':
          addEntertainment(inboxItem.content, today);
          removeFromInbox(inboxItemId);
          return;
        case 'drop-timeblocks': {
          const now = new Date();
          const start = new Date(now.getTime() + 60 * 60 * 1000);
          const end = new Date(start.getTime() + 60 * 60 * 1000);
          const fmt = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          addTimeBlock({ date: today, startTime: fmt(start), endTime: fmt(end), label: inboxItem.content, completed: false });
          removeFromInbox(inboxItemId);
          return;
        }
        case 'drop-weekboard':
          addTask(inboxItem.content, today, inboxItem.abilityId, inboxItem.abilityPoints, 'inbox');
          removeFromInbox(inboxItemId);
          return;
        default:
          break;
      }

      // Drop to task board (column or existing task)
      let targetDate: string;
      if (overId.startsWith('column-')) {
        targetDate = overId.replace('column-', '');
      } else {
        const overTask = tasks.find((t) => t.id === overId);
        if (!overTask) return;
        targetDate = overTask.date;
      }

      addTask(inboxItem.content, targetDate, inboxItem.abilityId, inboxItem.abilityPoints, 'inbox');
      removeFromInbox(inboxItemId);
      return;
    }

    // ── Task drop (empty column) ──
    if (overId.startsWith('column-')) {
      const targetDate = overId.replace('column-', '');
      const activeTask = tasks.find((t) => t.id === activeId);
      if (!activeTask || activeTask.date === targetDate) return;
      moveTask(activeId, targetDate, 0);
      return;
    }

    // ── Task reorder / move between columns ──
    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask || !overTask) return;

    if (activeTask.date === overTask.date) {
      const columnTasks = tasks
        .filter((t) => t.date === activeTask.date)
        .sort((a, b) => a.order - b.order);
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);
      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      reorderTasks(activeTask.date, reordered.map((t) => t.id));
    } else {
      const targetColumnTasks = tasks
        .filter((t) => t.date === overTask.date)
        .sort((a, b) => a.order - b.order);
      const newOrder = targetColumnTasks.findIndex((t) => t.id === overId);
      moveTask(activeId, overTask.date, newOrder >= 0 ? newOrder : targetColumnTasks.length);
    }
  };

  const renderMainPanel = (id: string): React.ReactNode => {
    switch (id) {
      case 'todayProgress':
        return <AsciiBox title={titlesCopy.dailyProgress}><TodayProgress /></AsciiBox>;
      case 'timeBlocks':
        return (
          <DroppableZone id="drop-timeblocks" activeDragId={activeDragId}>
            <TimeBlockPanel />
          </DroppableZone>
        );
      case 'okr':
        return <OKRPanel />;
      case 'habits':
        return (
          <DroppableZone id="drop-habits" activeDragId={activeDragId}>
            <HabitTrackerPanel />
          </DroppableZone>
        );
      case 'mood':
        return <MoodTrackerPanel />;
      case 'inspiration':
        return <InspirationVaultPanel />;
      default:
        return null;
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetectionStrategy} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="action-desk">
        {/* Sarcastic Monologue Banner */}
        {monologue && (
          <div
            className="font-caption"
            style={{
              textAlign: 'center',
              padding: 'var(--space-2) var(--space-4)',
              marginBottom: 'var(--space-4)',
              color: 'var(--text-muted)',
              borderBottom: '1px dashed var(--border-primary)',
              fontStyle: 'italic',
            }}
          >
            {monologue}
          </div>
        )}

        {/* Quick Inbox: always at top */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <QuickInbox />
        </div>

        {/* Task Board: core weekly view, always fixed below inbox */}
        <DroppableZone id="drop-weekboard" activeDragId={activeDragId} style={{ marginBottom: 'var(--space-4)' }}>
          <TaskBoard />
        </DroppableZone>

        {/* Lower Section: main panels + compact side bar */}
        <div
          className="dashboard-layout actiondesk-lower"
          style={{
            display: 'flex',
            gap: 'var(--space-8)',
            marginTop: 'var(--space-4)',
          }}
        >
          {/* Main Content Area ~61.8% */}
          <div className="main-area" style={{ flex: '1 1 61.8%', minWidth: 0 }}>
            {/* Fixed: OKR (non-draggable) */}
            <DroppableZone id="drop-okr" activeDragId={activeDragId} style={{ marginBottom: 'var(--space-4)' }}>
              <OKRPanel />
            </DroppableZone>

            {/* Draggable modules below OKR */}
            <DroppableColumn id={MAIN_CONTAINER_ID}>
              <SortableContext items={visibleMain} strategy={verticalListSortingStrategy}>
                {visibleMain.map((id) => (
                  <DraggablePanel key={id} id={id}>
                    {renderMainPanel(id)}
                  </DraggablePanel>
                ))}
              </SortableContext>
            </DroppableColumn>
          </div>

          {/* Compact Side Panel ~38.2%: todayProgress + principles + calendar + entertainment + mood + inspiration */}
          <div
            className="side-panel compact-side"
            style={{
              flex: '1 1 38.2%',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <AsciiBox title={titlesCopy.dailyProgress}>
              <TodayProgress />
            </AsciiBox>
            <DroppableZone id="drop-principles" activeDragId={activeDragId}>
              <PrinciplesPanel />
            </DroppableZone>
            {isModuleEnabled('calendar') && (
              <DroppableZone id="drop-calendar" activeDragId={activeDragId}>
                <AsciiBox title={titlesCopy.calendar}>
                  <MiniCalendar />
                </AsciiBox>
              </DroppableZone>
            )}
            {isModuleEnabled('entertainment') && (
              <DroppableZone id="drop-entertainment" activeDragId={activeDragId} className="compact-module">
                <EntertainmentPanel />
              </DroppableZone>
            )}
            {isModuleEnabled('mood') && (
              <div className="compact-module">
                <MoodTrackerPanel />
              </div>
            )}
            {isModuleEnabled('inspiration') && (
              <DroppableZone id="drop-inspiration" activeDragId={activeDragId} className="compact-module">
                <InspirationVaultPanel />
              </DroppableZone>
            )}
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeDragId && (activeDragId.startsWith('kr-') || activeDragId.startsWith('inbox-')) ? (
          <div
            className="font-body"
            style={{
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--accent-gold)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'grabbing',
              whiteSpace: 'nowrap',
              maxWidth: '280px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {activeDragContent}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ActionDesk;
