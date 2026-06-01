import React, { useState } from 'react';
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
import ReflectionGrid from '../features/reflections/ReflectionGrid';
import ReflectionDetailModal from '../features/reflections/ReflectionDetailModal';
import OKRPanel from '../features/okr/OKRPanel';
import AbilityReader from '../features/abilities/AbilityReader';
import AbilityTraining from '../features/abilities/AbilityTraining';
import DraggablePanel from '../components/DraggablePanel';
import AsciiBox from '../components/AsciiBox';
import { useAppStore } from '../store/useAppStore';
import type { Reflection } from '../types';

const ALL_LEFT_PANELS = ['reflectionLibrary'];
const ALL_RIGHT_PANELS = ['abilityReader', 'abilityTraining'];
const LEFT_CONTAINER_ID = 'reflection-left';
const RIGHT_CONTAINER_ID = 'reflection-right';

interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
};

const ReflectionPage: React.FC = () => {
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const reflectionLayout = useAppStore((s) => s.reflectionLayout);
  const setReflectionLayout = useAppStore((s) => s.setReflectionLayout);

  const visibleLeft = [
    ...reflectionLayout.left.filter((id) => ALL_LEFT_PANELS.includes(id)),
    ...ALL_LEFT_PANELS.filter((id) => !reflectionLayout.left.includes(id)),
  ];
  const visibleRight = [
    ...reflectionLayout.right.filter((id) => ALL_RIGHT_PANELS.includes(id)),
    ...ALL_RIGHT_PANELS.filter((id) => !reflectionLayout.right.includes(id)),
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
      setReflectionLayout({
        left: arrayMove(visibleLeft, visibleLeft.indexOf(activeId), visibleLeft.indexOf(overId)),
        right: visibleRight,
      });
      return;
    }

    if (fromContainer === 'right' && toContainer === 'right') {
      setReflectionLayout({
        left: visibleLeft,
        right: arrayMove(visibleRight, visibleRight.indexOf(activeId), visibleRight.indexOf(overId)),
      });
    }
  };

  const renderPanel = (id: string): React.ReactNode => {
    switch (id) {
      case 'reflectionLibrary':
        return (
          <AsciiBox title="REFLECTION LIBRARY">
            <ReflectionGrid onViewDetail={setSelectedReflection} />
          </AsciiBox>
        );
      case 'abilityReader':
        return <AbilityReader />;
      case 'abilityTraining':
        return <AbilityTraining />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* OKR Panel: full-width, always at top */}
      <OKRPanel />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          className="reflection-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-8)',
            maxWidth: '1400px',
          }}
        >
          <DroppableColumn id={LEFT_CONTAINER_ID}>
            <SortableContext items={visibleLeft} strategy={verticalListSortingStrategy}>
              {visibleLeft.map((id) => (
                <DraggablePanel key={id} id={id}>
                  {renderPanel(id)}
                </DraggablePanel>
              ))}
            </SortableContext>
          </DroppableColumn>

          <DroppableColumn id={RIGHT_CONTAINER_ID}>
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

      <ReflectionDetailModal
        reflection={selectedReflection}
        onClose={() => setSelectedReflection(null)}
      />
    </div>
  );
};

export default ReflectionPage;
