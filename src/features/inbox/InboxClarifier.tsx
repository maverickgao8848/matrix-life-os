import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { InboxItem } from '../../types';

interface InboxClarifierProps {
  item: InboxItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type ClarifyMode = 'menu' | 'kr-select' | 'confirm-delete';

const InboxClarifier: React.FC<InboxClarifierProps> = ({ item, isOpen, onClose }) => {
  const {
    objectives,
    addObjective,
    addKeyResult,
    addTask,
    addInspiration,
    removeFromInbox,
  } = useAppStore();

  const [mode, setMode] = useState<ClarifyMode>('menu');
  const [selectedObjId, setSelectedObjId] = useState('');

  if (!isOpen || !item) return null;

  const today = new Date().toISOString().split('T')[0];

  const handleConvertToObjective = () => {
    addObjective(item.content);
    removeFromInbox(item.id);
    resetAndClose();
  };

  const handleConvertToKR = () => {
    if (!selectedObjId) return;
    addKeyResult(selectedObjId, item.content);
    removeFromInbox(item.id);
    resetAndClose();
  };

  const handleConvertToTodayTask = () => {
    addTask(item.content, today);
    removeFromInbox(item.id);
    resetAndClose();
  };



  const handleConvertToInspiration = () => {
    addInspiration({ content: item.content, source: 'inbox', tags: [] });
    removeFromInbox(item.id);
    resetAndClose();
  };

  const handleDelete = () => {
    removeFromInbox(item.id);
    resetAndClose();
  };

  const resetAndClose = () => {
    setMode('menu');
    setSelectedObjId('');
    onClose();
  };

  const activeObjectives = objectives.filter((o) => o.status === 'active');

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) resetAndClose();
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--accent-gold)',
          padding: 'var(--space-6)',
          minWidth: '380px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflow: 'auto',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div
          className="font-h2"
          style={{
            color: 'var(--accent-gold)',
            marginBottom: 'var(--space-4)',
            textAlign: 'center',
            borderBottom: '1px solid var(--border-primary)',
            paddingBottom: 'var(--space-2)',
          }}
        >
          澄清收集项
        </div>

        <div
          className="font-body"
          style={{
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
            padding: 'var(--space-2)',
            backgroundColor: 'var(--bg-secondary)',
            borderLeft: '2px solid var(--accent-gold)',
            wordBreak: 'break-word',
          }}
        >
          {item.content}
        </div>

        {mode === 'menu' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div className="font-caption" style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
              选择转换方式：
            </div>
            <ClarifyButton label="[转为 Objective]" description="创建一个新的目标" onClick={handleConvertToObjective} />
            <ClarifyButton
              label="[转为 KR]"
              description="关联到现有目标的关键结果"
              onClick={() => {
                if (activeObjectives.length === 0) {
                  alert('当前没有活跃的 Objective，请先创建一个。');
                  return;
                }
                setMode('kr-select');
              }}
            />
            <ClarifyButton label="[转为今日任务]" description="直接添加到今天的看板列" onClick={handleConvertToTodayTask} />

            <ClarifyButton label="[转为灵感]" description="存入灵感库" onClick={handleConvertToInspiration} />

            <div style={{ borderTop: '1px dashed var(--border-primary)', marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
              <ClarifyButton label="[删除]" description="直接丢弃这个想法" danger onClick={() => setMode('confirm-delete')} />
            </div>
          </div>
        )}

        {mode === 'kr-select' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="font-caption" style={{ color: 'var(--text-muted)' }}>
              选择要关联的 Objective：
            </div>
            <select
              value={selectedObjId}
              onChange={(e) => setSelectedObjId(e.target.value)}
              className="font-body"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                padding: 'var(--space-2)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">-- 请选择 --</option>
              {activeObjectives.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setMode('menu')}
                className="font-caption"
                style={{
                  background: 'none',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  padding: 'var(--space-1) var(--space-3)',
                }}
              >
                返回
              </button>
              <button
                onClick={handleConvertToKR}
                disabled={!selectedObjId}
                className="font-caption"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--accent-gold)',
                  color: 'var(--accent-gold)',
                  cursor: selectedObjId ? 'pointer' : 'default',
                  fontFamily: 'var(--font-mono)',
                  padding: 'var(--space-1) var(--space-3)',
                  opacity: selectedObjId ? 1 : 0.5,
                }}
              >
                确认
              </button>
            </div>
          </div>
        )}

        {mode === 'confirm-delete' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div className="font-body" style={{ color: 'var(--accent-danger)', textAlign: 'center' }}>
              确定要删除这条收集项吗？
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                onClick={() => setMode('menu')}
                className="font-caption"
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
                onClick={handleDelete}
                className="font-caption"
                style={{
                  background: 'var(--accent-danger)',
                  border: 'none',
                  color: 'var(--bg-primary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  padding: 'var(--space-1) var(--space-3)',
                }}
              >
                确认删除
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ClarifyButtonProps {
  label: string;
  description: string;
  onClick: () => void;
  danger?: boolean;
}

const ClarifyButton: React.FC<ClarifyButtonProps> = ({ label, description, onClick, danger }) => {
  const color = danger ? 'var(--accent-danger)' : 'var(--text-primary)';
  const hoverColor = danger ? 'var(--text-primary)' : 'var(--accent-gold)';

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        width: '100%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        color: color,
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        padding: 'var(--space-2) var(--space-3)',
        textAlign: 'left',
        transition: 'border-color var(--duration-instant), color var(--duration-instant)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = danger ? 'var(--accent-danger)' : 'var(--accent-gold)';
        e.currentTarget.style.color = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-primary)';
        e.currentTarget.style.color = color;
      }}
    >
      <span className="font-body" style={{ whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <span className="font-caption" style={{ color: 'var(--text-muted)', flex: 1 }}>
        {description}
      </span>
    </button>
  );
};

export default InboxClarifier;
