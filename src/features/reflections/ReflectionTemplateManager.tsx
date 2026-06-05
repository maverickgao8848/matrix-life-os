import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import TemplateEditor from './TemplateEditor';

const ReflectionTemplateManager: React.FC = () => {
  const templates = useAppStore((s) => s.reflectionTemplates);
  const defaultTemplate = useAppStore((s) =>
    s.reflectionTemplates.find((t) => t.isDefault)
  );
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-3)',
        }}
      >
        <div>
          <div className="font-body" style={{ color: 'var(--text-primary)' }}>
            当前模板数: {templates.length}
          </div>
          {defaultTemplate && (
            <div className="font-caption" style={{ color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
              默认模板: {defaultTemplate.name}（{defaultTemplate.questions.length} 个问题）
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setEditorOpen(true)}
        className="font-caption"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          padding: 'var(--space-1) var(--space-2)',
          textTransform: 'uppercase',
          transition: `background-color var(--duration-instant) var(--ease-instant), color var(--duration-instant) var(--ease-instant)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--text-primary)';
          e.currentTarget.style.color = 'var(--bg-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        [  管理反思模板  ]
      </button>

      <TemplateEditor isOpen={editorOpen} onClose={() => setEditorOpen(false)} />
    </div>
  );
};

export default ReflectionTemplateManager;
