import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggablePanelProps {
  id: string;
  children: React.ReactNode;
}

const DraggablePanel: React.FC<DraggablePanelProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className="draggable-panel"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
      }}
    >
      {/* Drag handle — visible on hover, positioned in top-right corner */}
      <div
        className="drag-handle font-caption"
        {...attributes}
        {...listeners}
        title="拖拽移动"
      >
        ⠿⠿⠿
      </div>

      {children}

      <style>{`
        .draggable-panel {
          position: relative;
        }
        .drag-handle {
          position: absolute;
          top: 6px;
          right: 10px;
          z-index: 10;
          cursor: grab;
          color: var(--text-muted);
          font-size: 11px;
          line-height: 1;
          padding: 2px 4px;
          opacity: 0;
          transition: opacity 0.15s ease;
          user-select: none;
          letter-spacing: 3px;
          border: 1px solid transparent;
        }
        .drag-handle:hover {
          opacity: 1 !important;
          color: var(--accent-gold);
          border-color: var(--border-primary);
        }
        .drag-handle:active {
          cursor: grabbing;
        }
        .draggable-panel:hover > .drag-handle {
          opacity: 0.45;
        }
      `}</style>
    </div>
  );
};

export default DraggablePanel;
