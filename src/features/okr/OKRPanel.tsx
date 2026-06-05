import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useAppStore } from '../../store/useAppStore';
import { useObjectiveAutoArchive } from '../../hooks/useObjectiveAutoArchive';
import AsciiBox from '../../components/AsciiBox';
import { titlesCopy } from '../../copy/titles-copy';

interface DraggableKRProps {
  kr: { id: string; content: string; completed: boolean; scheduled: boolean };
  objectiveId: string;
  index: number;
  total: number;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (content: string) => void;
}

const DraggableKR: React.FC<DraggableKRProps> = ({
  kr,
  objectiveId,
  index,
  total,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `kr-${kr.id}`,
    data: { type: 'kr', objectiveId, krId: kr.id, content: kr.content },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(kr.content);

  const branch = index === total - 1 ? '└' : '├';

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(editContent.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditContent(kr.content);
      setIsEditing(false);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="font-body"
        style={{
          color: 'var(--text-muted)',
          opacity: 0.5,
          paddingLeft: 'var(--space-4)',
        }}
      >
        {branch} {kr.content} [→]
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="font-body kr-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        paddingLeft: 'var(--space-4)',
        cursor: 'grab',
        color: kr.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
        textDecoration: kr.completed ? 'line-through' : 'none',
      }}
    >
      <span style={{ whiteSpace: 'nowrap' }}>{branch}</span>
      <span
        onClick={onToggle}
        style={{ cursor: 'pointer', flex: 1 }}
      >
        {kr.completed ? '☑' : '☐'} {kr.content}
      </span>
      {kr.scheduled && (
        <span className="font-caption" style={{ color: 'var(--accent-gold)' }}>
          [→]
        </span>
      )}
      {isEditing ? (
        <input
          autoFocus
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="font-body"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--accent-gold)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            outline: 'none',
            flex: 1,
            caretColor: 'var(--accent-gold)',
          }}
        />
      ) : (
        <span className="kr-actions hidden" style={{ display: 'flex', gap: 'var(--space-1)' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditContent(kr.content);
              setIsEditing(true);
            }}
            className="font-caption"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: '0 var(--space-1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            [✎]
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="font-caption"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-danger)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: '0 var(--space-1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent-danger)'; }}
          >
            [x]
          </button>
        </span>
      )}
    </div>
  );
};

const OKRPanel: React.FC = () => {
  const {
    objectives,
    addObjective,
    deleteObjective,
    updateObjectiveTitle,
    addKeyResult,
    deleteKeyResult,
    toggleKeyResult,
    updateKeyResult,
  } = useAppStore();
  const { tryArchiveObjective } = useObjectiveAutoArchive();

  const activeObjectives = objectives.filter((o) => o.status === 'active');

  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [isAddingObj, setIsAddingObj] = useState(false);
  const [newObjTitle, setNewObjTitle] = useState('');
  const [addingKRFor, setAddingKRFor] = useState<string | null>(null);
  const [newKRContent, setNewKRContent] = useState('');
  const [editingObjId, setEditingObjId] = useState<string | null>(null);
  const [editObjTitle, setEditObjTitle] = useState('');

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddObjective = () => {
    if (newObjTitle.trim()) {
      addObjective(newObjTitle.trim());
      setNewObjTitle('');
      setIsAddingObj(false);
    }
  };

  const handleAddKR = (objId: string) => {
    if (newKRContent.trim()) {
      addKeyResult(objId, newKRContent.trim());
      setNewKRContent('');
      setAddingKRFor(null);
    }
  };

  const handleObjKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddObjective();
    if (e.key === 'Escape') {
      setNewObjTitle('');
      setIsAddingObj(false);
    }
  };

  const handleKRKeyDown = (e: React.KeyboardEvent, objId: string) => {
    if (e.key === 'Enter') handleAddKR(objId);
    if (e.key === 'Escape') {
      setNewKRContent('');
      setAddingKRFor(null);
    }
  };

  return (
    <AsciiBox title={titlesCopy.okr}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {activeObjectives.length === 0 && !isAddingObj && (
          <div
            className="font-caption"
            style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-4) 0' }}
          >
            没有进行中的 Objective — 添加一个中型目标（约 3h+）开始拆解
          </div>
        )}

        {activeObjectives.map((obj) => {
          const isCollapsed = collapsedIds.has(obj.id);
          const isEditingObj = editingObjId === obj.id;

          return (
            <div
              key={obj.id}
              className="okr-objective"
              style={{
                border: '1px solid var(--border-primary)',
                padding: 'var(--space-2) var(--space-3)',
              }}
            >
              {/* Objective Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  cursor: 'pointer',
                }}
                onClick={() => toggleCollapse(obj.id)}
              >
                <span style={{ color: 'var(--accent-gold)', whiteSpace: 'nowrap' }}>
                  {isCollapsed ? '▸' : '▾'} O：
                </span>
                {isEditingObj ? (
                  <input
                    autoFocus
                    value={editObjTitle}
                    onChange={(e) => setEditObjTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (editObjTitle.trim()) updateObjectiveTitle(obj.id, editObjTitle.trim());
                        setEditingObjId(null);
                      }
                      if (e.key === 'Escape') setEditingObjId(null);
                    }}
                    onBlur={() => setEditingObjId(null)}
                    className="font-body"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--accent-gold)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      outline: 'none',
                      flex: 1,
                      caretColor: 'var(--accent-gold)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="font-body" style={{ flex: 1, color: 'var(--text-primary)' }}>
                    {obj.title}
                  </span>
                )}
                {!isEditingObj && (
                  <span className="obj-actions hidden" style={{ display: 'flex', gap: 'var(--space-1)' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingObjId(obj.id);
                        setEditObjTitle(obj.title);
                      }}
                      className="font-caption"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        padding: '0 var(--space-1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      [✎]
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteObjective(obj.id);
                      }}
                      className="font-caption"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-danger)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        padding: '0 var(--space-1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent-danger)'; }}
                    >
                      [x]
                    </button>
                  </span>
                )}
              </div>

              {/* KR List */}
              {!isCollapsed && (
                <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {obj.krList.map((kr, idx) => (
                    <DraggableKR
                      key={kr.id}
                      kr={kr}
                      objectiveId={obj.id}
                      index={idx}
                      total={obj.krList.length}
                      onToggle={() => {
                        toggleKeyResult(obj.id, kr.id);
                        tryArchiveObjective(obj.id);
                      }}
                      onDelete={() => deleteKeyResult(obj.id, kr.id)}
                      onEdit={(content) => updateKeyResult(obj.id, kr.id, content)}
                    />
                  ))}

                  {/* Add KR */}
                  {addingKRFor === obj.id ? (
                    <div style={{ paddingLeft: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
                      <span className="font-body" style={{ color: 'var(--text-muted)' }}>
                        {obj.krList.length === 0 ? '└' : '└'}
                      </span>
                      <input
                        autoFocus
                        value={newKRContent}
                        onChange={(e) => setNewKRContent(e.target.value)}
                        onKeyDown={(e) => handleKRKeyDown(e, obj.id)}
                        onBlur={() => {
                          if (newKRContent.trim()) handleAddKR(obj.id);
                          else setAddingKRFor(null);
                        }}
                        placeholder="新的关键结果……"
                        className="font-body"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid var(--accent-gold)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-mono)',
                          outline: 'none',
                          flex: 1,
                          caretColor: 'var(--accent-gold)',
                        }}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingKRFor(obj.id)}
                      className="font-caption"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        paddingLeft: 'var(--space-4)',
                        textAlign: 'left',
                        transition: 'color var(--duration-instant)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-gold)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      └ [+ 添加 KR]
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Add Objective */}
        {isAddingObj ? (
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <span className="font-body" style={{ color: 'var(--accent-gold)', whiteSpace: 'nowrap' }}>
              O：
            </span>
            <input
              autoFocus
              value={newObjTitle}
              onChange={(e) => setNewObjTitle(e.target.value)}
              onKeyDown={handleObjKeyDown}
              onBlur={() => {
                if (newObjTitle.trim()) handleAddObjective();
                else setIsAddingObj(false);
              }}
              placeholder="输入 Objective 标题，回车确认……"
              className="font-body"
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--accent-gold)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                flex: 1,
                caretColor: 'var(--accent-gold)',
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAddingObj(true)}
            className="font-caption"
            style={{
              background: 'none',
              border: '1px dashed var(--border-primary)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-2) var(--space-3)',
              textAlign: 'center',
              transition: 'color var(--duration-instant), border-color var(--duration-instant)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-gold)';
              e.currentTarget.style.borderColor = 'var(--accent-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border-primary)';
            }}
          >
            [+ 添加 O]
          </button>
        )}
      </div>

      <style>{`
        .okr-objective:hover .obj-actions.hidden {
          display: flex !important;
        }
        .kr-row:hover .kr-actions.hidden {
          display: flex !important;
        }
        .hidden {
          display: none !important;
        }
      `}</style>
    </AsciiBox>
  );
};

export default OKRPanel;
