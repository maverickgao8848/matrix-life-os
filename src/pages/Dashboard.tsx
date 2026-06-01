import React from 'react';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
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
import ReflectionQuickEntry from '../features/reflections/ReflectionQuickEntry';
import DataBackupPanel from '../features/data/DataBackupPanel';
import MiniCalendar from '../components/MiniCalendar';
import DraggablePanel from '../components/DraggablePanel';
import AsciiBox from '../components/AsciiBox';
import { useAppStore } from '../store/useAppStore';
import { useSarcasticMonologue } from '../hooks/useSarcasticMonologue';

// All possible panels per zone (defines default order if not yet saved)
const ALL_MAIN_PANELS = ['todayProgress', 'dailyReflection', 'dataBackup', 'timeBlocks'];
const ALL_SIDE_PANELS = ['principles', 'calendar', 'entertainment', 'habits', 'mood', 'inspiration'];
const MAIN_CONTAINER_ID = 'dashboard-main';
const SIDE_CONTAINER_ID = 'dashboard-side';

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

const Dashboard: React.FC = () => {
  const enabledModules = useAppStore((s) => s.enabledModules);
  const dashboardLayout = useAppStore((s) => s.dashboardLayout);
  const setDashboardLayout = useAppStore((s) => s.setDashboardLayout);
  const { text: monologue } = useSarcasticMonologue();

  const isEnabled = (id: string): boolean => {
    if (['todayProgress', 'dailyReflection', 'dataBackup'].includes(id)) return true;
    return enabledModules.includes(id as any);
  };

  // Ordered visible panels: respect saved order, append new/unknown panels at end
  const visibleMain = [
    ...dashboardLayout.main.filter((id) => ALL_MAIN_PANELS.includes(id) && isEnabled(id)),
    ...ALL_MAIN_PANELS.filter((id) => isEnabled(id) && !dashboardLayout.main.includes(id)),
  ];
  const visibleSide = [
    ...dashboardLayout.side.filter((id) => ALL_SIDE_PANELS.includes(id) && isEnabled(id)),
    ...ALL_SIDE_PANELS.filter((id) => isEnabled(id) && !dashboardLayout.side.includes(id)),
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    const findContainer = (id: string): 'main' | 'side' | null => {
      if (id === MAIN_CONTAINER_ID || visibleMain.includes(id)) return 'main';
      if (id === SIDE_CONTAINER_ID || visibleSide.includes(id)) return 'side';
      return null;
    };

    const fromContainer = findContainer(activeId);
    const toContainer = findContainer(overId);
    if (!fromContainer || !toContainer) return;

    if (fromContainer === 'main' && toContainer === 'main') {
      setDashboardLayout({
        main: arrayMove(visibleMain, visibleMain.indexOf(activeId), visibleMain.indexOf(overId)),
        side: visibleSide,
      });
      return;
    }

    if (fromContainer === 'side' && toContainer === 'side') {
      setDashboardLayout({
        main: visibleMain,
        side: arrayMove(visibleSide, visibleSide.indexOf(activeId), visibleSide.indexOf(overId)),
      });
    }
  };

  const renderPanel = (id: string): React.ReactNode => {
    switch (id) {
      case 'todayProgress':
        return <AsciiBox title="DAILY PROGRESS"><TodayProgress /></AsciiBox>;
      case 'dailyReflection':
        return <AsciiBox title="DAILY REFLECTION"><ReflectionQuickEntry /></AsciiBox>;
      case 'dataBackup':
        return <DataBackupPanel />;
      case 'timeBlocks':
        return <TimeBlockPanel />;
      case 'principles':
        return <div style={{ marginTop: 'var(--space-7)' }}><PrinciplesPanel /></div>;
      case 'calendar':
        return <AsciiBox title="CALENDAR"><MiniCalendar /></AsciiBox>;
      case 'entertainment':
        return <EntertainmentPanel />;
      case 'habits':
        return <HabitTrackerPanel />;
      case 'mood':
        return <MoodTrackerPanel />;
      case 'inspiration':
        return <InspirationVaultPanel />;
      default:
        return null;
    }
  };

  return (
    <div>
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

      {/* Task Board: always fixed at top */}
      <TaskBoard />

      {/* Golden Ratio Layout: 61.8% / 38.2% — panels are drag-sortable within each column */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          className="dashboard-layout"
          style={{
            display: 'flex',
            gap: 'var(--space-8)',
            maxWidth: '1400px',
          }}
        >
          {/* Main Content Area ~61.8% */}
          <DroppableColumn id={MAIN_CONTAINER_ID} className="main-area" style={{ flex: '1 1 61.8%' }}>
            <SortableContext items={visibleMain} strategy={verticalListSortingStrategy}>
              {visibleMain.map((id) => (
                <DraggablePanel key={id} id={id}>
                  {renderPanel(id)}
                </DraggablePanel>
              ))}
            </SortableContext>
          </DroppableColumn>

          {/* Auxiliary Panel ~38.2% */}
          <DroppableColumn id={SIDE_CONTAINER_ID} className="side-panel" style={{ flex: '1 1 38.2%' }}>
            <SortableContext items={visibleSide} strategy={verticalListSortingStrategy}>
              {visibleSide.map((id) => (
                <DraggablePanel key={id} id={id}>
                  {renderPanel(id)}
                </DraggablePanel>
              ))}
            </SortableContext>
          </DroppableColumn>
        </div>
      </DndContext>
    </div>
  );
};

export default Dashboard;
