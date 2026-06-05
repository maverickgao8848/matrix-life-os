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
import AsciiBox from '../components/AsciiBox';
import DraggablePanel from '../components/DraggablePanel';
import UpdatePanel from '../features/system/UpdatePanel';
import ManualPanel from '../features/system/ManualPanel';


import DataHealthPanel from '../features/system/DataHealthPanel';
import MonkQuote from '../features/system/MonkQuote';
import ReflectionTemplateManager from '../features/reflections/ReflectionTemplateManager';
import ModuleManager from '../features/modules/ModuleManager';
import { useAppStore } from '../store/useAppStore';
import { systemCopy } from '../copy/system-copy';
import { titlesCopy } from '../copy/titles-copy';

const ALL_LEFT_PANELS = ['moduleManager'];
const ALL_RIGHT_PANELS = ['aboutBox', 'monkQuote', 'reflectionTemplateManager', 'dataHealthPanel', 'updatePanel', 'manualPanel'];
const LEFT_CONTAINER_ID = 'system-left';
const RIGHT_CONTAINER_ID = 'system-right';

interface DroppableColumnProps {
  id: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, style, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

const System: React.FC = () => {
  const systemLayout = useAppStore((s) => s.systemLayout);
  const setSystemLayout = useAppStore((s) => s.setSystemLayout);

  const visibleLeft = [
    ...systemLayout.left.filter((id) => ALL_LEFT_PANELS.includes(id)),
    ...ALL_LEFT_PANELS.filter((id) => !systemLayout.left.includes(id)),
  ];
  const visibleRight = [
    ...systemLayout.right.filter((id) => ALL_RIGHT_PANELS.includes(id)),
    ...ALL_RIGHT_PANELS.filter((id) => !systemLayout.right.includes(id)),
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    const findContainer = (id: string): 'left' | 'right' | null => {
      if (id === LEFT_CONTAINER_ID || visibleLeft.includes(id)) return 'left';
      if (id === RIGHT_CONTAINER_ID || visibleRight.includes(id)) return 'right';
      return null;
    };

    const fromContainer = findContainer(activeId);
    const toContainer = findContainer(overId);
    if (!fromContainer || !toContainer) return;

    if (fromContainer === 'left' && toContainer === 'left') {
      setSystemLayout({
        left: arrayMove(visibleLeft, visibleLeft.indexOf(activeId), visibleLeft.indexOf(overId)),
        right: visibleRight,
      });
      return;
    }

    if (fromContainer === 'right' && toContainer === 'right') {
      setSystemLayout({
        left: visibleLeft,
        right: arrayMove(visibleRight, visibleRight.indexOf(activeId), visibleRight.indexOf(overId)),
      });
    }
  };

  const renderPanel = (id: string): React.ReactNode => {
    switch (id) {
      case 'updatePanel':
        return <UpdatePanel />;
      case 'manualPanel':
        return <ManualPanel />;
      case 'dataHealthPanel':
        return <DataHealthPanel />;
      case 'aboutBox':
        return (
          <AsciiBox title={systemCopy.about.title}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              <div className="font-h2" style={{ color: 'var(--accent-gold)' }}>
                {systemCopy.about.appName}
              </div>
              <div className="font-body" style={{ color: 'var(--text-secondary)' }}>
                {systemCopy.about.description}
              </div>
            </div>
          </AsciiBox>
        );
      case 'monkQuote':
        return <MonkQuote />;
      case 'reflectionTemplateManager':
        return (
          <AsciiBox title={titlesCopy.reflectionTemplates}>
            <ReflectionTemplateManager />
          </AsciiBox>
        );
      case 'moduleManager':
        return (
          <AsciiBox title={titlesCopy.moduleManager}>
            <ModuleManager />
          </AsciiBox>
        );
      default:
        return null;
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-6)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Left Column */}
        <DroppableColumn id={LEFT_CONTAINER_ID} style={{ flex: '1 1 50%', minWidth: 0 }}>
          <SortableContext items={visibleLeft} strategy={verticalListSortingStrategy}>
            {visibleLeft.map((id) => (
              <DraggablePanel key={id} id={id}>
                {renderPanel(id)}
              </DraggablePanel>
            ))}
          </SortableContext>
        </DroppableColumn>

        {/* Right Column */}
        <DroppableColumn id={RIGHT_CONTAINER_ID} style={{ flex: '1 1 50%', minWidth: 0 }}>
          <SortableContext items={visibleRight} strategy={verticalListSortingStrategy}>
            {visibleRight.map((id) => (
              <DraggablePanel key={id} id={id}>
                {renderPanel(id)}
              </DraggablePanel>
            ))}
          </SortableContext>
        </DroppableColumn>
      </div>
    </DndContext>
  );
};

export default System;
