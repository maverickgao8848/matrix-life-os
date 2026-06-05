import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { TimeBlock } from '../../types';

interface TimeBlockEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: {
    date: string;
    startTime: string;
    endTime: string;
    label: string;
    taskId?: string;
    completed: boolean;
  }) => void;
  initialData?: Partial<TimeBlock>;
}

const getNextHourBlock = () => {
  const now = new Date();
  const start = new Date(now.getTime() + 60 * 60 * 1000);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return { startTime: fmt(start), endTime: fmt(end) };
};

const TimeBlockEditor: React.FC<TimeBlockEditorProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const tasks = useAppStore((s) => s.tasks);
  const today = new Date().toISOString().split('T')[0];
  const blockDate = initialData?.date || today;
  const todayTasks = tasks.filter((t) => t.date === blockDate && t.status === 'active');

  const defaultBlock = getNextHourBlock();
  const [startTime, setStartTime] = useState(defaultBlock.startTime);
  const [endTime, setEndTime] = useState(defaultBlock.endTime);
  const [label, setLabel] = useState('');
  const [taskId, setTaskId] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setStartTime(initialData.startTime || defaultBlock.startTime);
      setEndTime(initialData.endTime || defaultBlock.endTime);
      setLabel(initialData.label || '');
      setTaskId(initialData.taskId || '');
    } else if (isOpen && !initialData) {
      setStartTime(defaultBlock.startTime);
      setEndTime(defaultBlock.endTime);
      setLabel('');
      setTaskId('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!label.trim()) return;
    if (startTime >= endTime) return;
    onSave({
      date: blockDate,
      startTime,
      endTime,
      label: label.trim(),
      taskId: taskId || undefined,
      completed: initialData?.completed ?? false,
    });
    if (!initialData) {
      setStartTime(defaultBlock.startTime);
      setEndTime(defaultBlock.endTime);
      setLabel('');
      setTaskId('');
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          padding: 'var(--space-5)',
          width: '360px',
          maxWidth: '90vw',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="font-h2"
          style={{
            color: 'var(--accent-gold)',
            marginBottom: 'var(--space-4)',
            borderBottom: '1px solid var(--border-primary)',
            paddingBottom: 'var(--space-2)',
          }}
        >
          [ {initialData ? '编辑时间块' : '新建时间块'} ]
        </div>

        {/* Time row */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}>
            <label className="font-caption" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
              开始
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="font-mono-data"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                padding: 'var(--space-1) var(--space-2)',
                width: '100%',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="font-caption" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
              结束
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="font-mono-data"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                padding: 'var(--space-1) var(--space-2)',
                width: '100%',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Label */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <label className="font-caption" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
            标签
          </label>
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="例如：深度工作、会议、阅读..."
            className="font-body"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--accent-gold)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) 0',
              width: '100%',
              outline: 'none',
              caretColor: 'var(--accent-gold)',
            }}
          />
        </div>

        {/* Task link */}
        {todayTasks.length > 0 && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className="font-caption" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
              关联任务（可选）
            </label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="font-body"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                padding: 'var(--space-1) var(--space-2)',
                width: '100%',
                outline: 'none',
              }}
            >
              <option value="">-- 不关联 --</option>
              {todayTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.content}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="font-body"
            style={{
              background: 'none',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-3)',
            }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="font-body"
            style={{
              background: 'var(--accent-gold)',
              border: '1px solid var(--accent-gold)',
              color: 'var(--bg-primary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-3)',
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeBlockEditor;
