import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import AsciiBox from '../../components/AsciiBox';
import { useAppStore } from '../../store/useAppStore';
import type { InboxItem } from '../../types';
import { titlesCopy } from '../../copy/titles-copy';

interface DraggableInboxItemProps {
  item: InboxItem;
  onDelete: (id: string) => void;
}

const DraggableInboxItem: React.FC<DraggableInboxItemProps> = ({ item, onDelete }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `inbox-${item.id}`,
    data: { type: 'inbox', itemId: item.id, content: item.content },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-1) var(--space-2)',
        borderBottom: '1px dashed var(--border-primary)',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity var(--duration-instant)',
      }}
    >
      <span
        className="font-body"
        style={{
          flex: 1,
          color: 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        ○ {item.content}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="font-caption"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--accent-danger)',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          padding: '2px var(--space-1)',
          transition: 'color var(--duration-instant)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--accent-danger)';
        }}
      >
        [x]
      </button>
    </div>
  );
};

const QuickInbox: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { inboxItems, addQuickInboxItem, deleteInboxItem } = useAppStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addQuickInboxItem(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <AsciiBox title={titlesCopy.quickInbox}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="脑中闪过的任何事，先丢进来……"
          className="font-body"
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            padding: 'var(--space-2) 0',
            outline: 'none',
            caretColor: 'var(--accent-gold)',
          }}
        />

        {inboxItems.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {inboxItems.map((item) => (
              <DraggableInboxItem key={item.id} item={item} onDelete={deleteInboxItem} />
            ))}
          </div>
        ) : (
          <div
            className="font-caption"
            style={{
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: 'var(--space-2) 0',
              opacity: 0.6,
            }}
          >
            收集箱为空 — 想法出现时，先丢进来，再决定怎么处理
          </div>
        )}
      </div>
    </AsciiBox>
  );
};

export default QuickInbox;
