import { useState, useEffect, useRef } from 'react';

const LAST_WORD_INDEX = Math.floor(Math.random() * systemCopy.lastWords.length);
import ActionDesk from './pages/ActionDesk';
import ReviewArchive from './pages/ReviewArchive';
import System from './pages/System';

import { useDayMigration } from './hooks/useDayMigration';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { useAppStore } from './store/useAppStore';
import { checkUpdate, APP_VERSION } from './utils/checkUpdate';

import { systemCopy } from './copy/system-copy';
import { aloCopy } from './copy/alo-copy';

function App() {
  const [page, setPage] = useState<'actionDesk' | 'reviewArchive' | 'system'>('actionDesk');

  const [hasUpdate, setHasUpdate] = useState(false);
  const config = useAppStore((s) => s.config);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const storageWarning = useAppStore((s) => s.storageWarning);
  const setStorageWarning = useAppStore((s) => s.setStorageWarning);
  const lastWordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme = config.theme ?? 'dark';
    document.documentElement.dataset.theme = theme;
  }, [config.theme]);

  useDayMigration();
  useDocumentTitle();

  // Check for updates on mount
  useEffect(() => {
    let cancelled = false;
    const doCheck = async () => {
      const v = window.electronAPI?.getAppVersion?.() ?? APP_VERSION;
      const result = await checkUpdate(v);
      if (!cancelled && result.hasUpdate) {
        setHasUpdate(true);
      }
    };
    // Delay slightly so it doesn't block first paint
    const timer = setTimeout(doCheck, 3000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Last Words on quit
  useEffect(() => {
    if (!window.electronAPI?.onBeforeQuit) return;

    const handler = () => {
      const today = new Date().toISOString().split('T')[0];
      const reflections = useAppStore.getState().reflections;
      const hasReflection = reflections.some((r) => r.date === today);
      if (!hasReflection && lastWordsRef.current) {
        lastWordsRef.current.style.opacity = '1';
        lastWordsRef.current.style.transform = 'translateY(0)';
      }
    };

    window.electronAPI.onBeforeQuit(handler);
    // ipcRenderer.on returns nothing useful here; cleanup is optional
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Navigation Bar */}
      <nav
        style={{
          height: '48px',
          borderBottom: '1px solid var(--border-primary)',
          padding: '0 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <div
          className="font-display"
          style={{
            color: 'var(--text-primary)',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <img
            src="app://resources/alo-logo-pixel.png"
            alt=""
            style={{
              height: '28px',
              width: 'auto',
              imageRendering: 'pixelated',
              opacity: 0.9,
            }}
          />
          ASCII LIFE OS
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            onClick={() => setPage('actionDesk')}
            className="font-h2"
            title={aloCopy.nav.actionDeskHover}
            style={{
              background: 'none',
              border: 'none',
              color: page === 'actionDesk' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              if (page !== 'actionDesk') {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                page === 'actionDesk' ? 'var(--accent-gold)' : 'var(--text-secondary)';
            }}
          >
            {page === 'actionDesk' ? '[行动台]' : ' 行动台 '}
          </button>
          <button
            onClick={() => setPage('reviewArchive')}
            className="font-h2"
            title={aloCopy.nav.reviewArchiveHover}
            style={{
              background: 'none',
              border: 'none',
              color: page === 'reviewArchive' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              if (page !== 'reviewArchive') {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                page === 'reviewArchive' ? 'var(--accent-gold)' : 'var(--text-secondary)';
            }}
          >
            {page === 'reviewArchive' ? '[回顾档案]' : ' 回顾档案 '}
          </button>
          <button
            onClick={() => setPage('system')}
            className="font-h2"
            style={{
              background: 'none',
              border: 'none',
              color: page === 'system' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              if (page !== 'system') {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                page === 'system' ? 'var(--accent-gold)' : 'var(--text-secondary)';
            }}
            title={aloCopy.nav.systemHover}
          >
            {page === 'system' ? '[◇ 系统]' : ' ◇ 系统 '}
            {hasUpdate && (
              <span style={{ color: 'var(--accent-danger)', marginLeft: 4 }}>
                {systemCopy.nav.hasUpdateMarker}
              </span>
            )}
          </button>
          <button
            onClick={toggleTheme}
            className="font-h2"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            title={aloCopy.nav.themeHover}
          >
            {config.theme === 'dark' ? '[◐]' : '[◑]'}
          </button>
        </div>
      </nav>

      {storageWarning && (
        <div
          style={{
            backgroundColor: 'var(--accent-danger)',
            color: 'var(--bg-primary)',
            padding: 'var(--space-2) var(--space-4)',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <span>
            ⚠ 数据体积接近上限，建议导出备份并清理历史数据
          </span>
          <button
            onClick={() => {
              setPage('system');
              setStorageWarning(false);
            }}
            style={{
              background: 'var(--bg-primary)',
              border: 'none',
              color: 'var(--accent-danger)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: '2px var(--space-2)',
              fontSize: '12px',
            }}
          >
            [导出并清理]
          </button>
          <button
            onClick={() => setStorageWarning(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--bg-primary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: '2px var(--space-2)',
              fontSize: '12px',
              opacity: 0.8,
            }}
          >
            [x]
          </button>
        </div>
      )}


      {/* Page Content */}
      <main style={{ padding: 'var(--space-6)' }}>
        {page === 'actionDesk' && <ActionDesk />}
        {page === 'reviewArchive' && <ReviewArchive />}
        {page === 'system' && <System />}
      </main>

      {/* Last Words Overlay */}
      <div
        ref={lastWordsRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'var(--space-3) var(--space-6)',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-primary)',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          textAlign: 'center',
          opacity: 0,
          transform: 'translateY(100%)',
          transition: 'opacity 300ms ease, transform 300ms ease',
          zIndex: 10000,
          pointerEvents: 'none',
        }}
      >
        {systemCopy.lastWords[LAST_WORD_INDEX]}
      </div>
    </div>
  );
}

export default App;
