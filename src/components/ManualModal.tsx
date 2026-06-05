import React, { useEffect } from 'react';
import { systemCopy } from '../copy/system-copy';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sections = systemCopy.manual.sections;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(12, 10, 8, 0.75)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          width: 'min(720px, 92vw)',
          maxHeight: 'min(840px, 88vh)',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--border-primary)',
            flexShrink: 0,
          }}
        >
          <span className="font-h2" style={{ color: 'var(--accent-gold)' }}>
            {systemCopy.manual.title}
          </span>
          <button
            onClick={onClose}
            className="font-caption"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            [ x ]
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            overflowY: 'auto',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
          }}
        >
          {sections.map((section, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div className="font-h2" style={{ color: 'var(--text-primary)' }}>
                {section.heading}
              </div>
              <div
                className="font-body"
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--border-primary)',
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            className="font-caption"
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
          >
            [  {systemCopy.manual.closeButton}  ]
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualModal;
