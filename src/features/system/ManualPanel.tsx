import React, { useState } from 'react';
import AsciiBox from '../../components/AsciiBox';
import ManualModal from '../../components/ManualModal';
import { systemCopy } from '../../copy/system-copy';

const ManualPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AsciiBox title={systemCopy.manual.panelTitle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="font-body" style={{ color: 'var(--text-secondary)' }}>
            {systemCopy.manual.panelDescription}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}
          >
            <button
              onClick={() => setIsOpen(true)}
              className="font-caption btn-invert"
              style={{
                background: 'none',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                padding: 'var(--space-1) var(--space-3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.color = 'var(--bg-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-gold)';
                e.currentTarget.style.color = 'var(--bg-primary)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.color = 'var(--bg-primary)';
              }}
            >
              [  {systemCopy.manual.openButton}  ]
            </button>
          </div>
        </div>
      </AsciiBox>

      <ManualModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ManualPanel;
