import React, { useState } from 'react';
import AsciiBox from '../../components/AsciiBox';
import { toMonksCalendar } from '../../utils/monksCalendar';
import { checkUpdate, APP_VERSION } from '../../utils/checkUpdate';
import { systemCopy } from '../../copy/system-copy';
import { titlesCopy } from '../../copy/titles-copy';

const UpdatePanel: React.FC = () => {
  const [version] = useState<string>(() => getRuntimeVersion());
  const [status, setStatus] = useState<
    'idle' | 'checking' | 'up-to-date' | 'has-update' | 'error'
  >('idle');
  const [latestUrl, setLatestUrl] = useState<string>('');
  const [latestVersion, setLatestVersion] = useState<string>('');
  const [errorDetail, setErrorDetail] = useState<string>('');
  const [fromCache, setFromCache] = useState<boolean>(false);

  const handleCheck = async () => {
    setStatus('checking');
    setErrorDetail('');
    setFromCache(false);

    const result = await checkUpdate(version);
    const nextLatest = result.latest;

    setLatestVersion(nextLatest?.version ?? '');
    setLatestUrl(nextLatest?.url ?? '');
    setFromCache(Boolean(result.fromCache));

    if (result.error) {
      setErrorDetail(result.fromCache ? `使用上次成功结果；本次失败：${result.error}` : result.error);
      if (!result.fromCache) {
        setStatus('error');
        return;
      }
    }

    if (result.hasUpdate && result.latest) {
      setStatus('has-update');
    } else {
      setStatus('up-to-date');
    }
  };

  const statusText = {
    idle: '',
    checking: systemCopy.update.checking,
    'up-to-date': systemCopy.update.upToDate,
    'has-update': `${systemCopy.update.hasUpdate}`,
    error: systemCopy.update.updateError,
  }[status];

  return (
    <AsciiBox title={titlesCopy.update}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div className="font-body" style={{ color: 'var(--text-secondary)' }}>
          {systemCopy.update.currentVersion}：
          <span
            className="font-mono-data"
            style={{ color: 'var(--accent-gold)', marginLeft: 'var(--space-2)' }}
          >
            {toMonksCalendar(version)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <button
            onClick={handleCheck}
            disabled={status === 'checking'}
            className="font-caption btn-invert"
            style={{
              background: 'none',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-secondary)',
              cursor: status === 'checking' ? 'wait' : 'pointer',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              padding: 'var(--space-1) var(--space-3)',
              opacity: status === 'checking' ? 0.6 : 1,
            }}
          >
            {status === 'checking'
              ? `[  ${systemCopy.update.checking}  ]`
              : `[  ${systemCopy.update.checkButton}  ]`}
          </button>
        </div>

        {statusText && (
          <div
            className="font-caption"
            style={{
              color:
                status === 'has-update'
                  ? 'var(--accent-gold)'
                  : status === 'error'
                  ? 'var(--accent-danger)'
                  : 'var(--text-secondary)',
            }}
          >
            {statusText}
            {latestVersion && status !== 'error' && (
              <>
                {' '}
                <span style={{ color: 'var(--text-secondary)' }}>
                  v{latestVersion}
                  {fromCache ? '（缓存）' : ''}
                </span>
              </>
            )}
            {status === 'has-update' && latestUrl && (
              <>
                {' '}
                <a
                  href={latestUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}
                  className="font-caption"
                >
                  {systemCopy.update.downloadUrl}
                </a>
              </>
            )}
            {status === 'error' && latestUrl && (
              <>
                {' '}
                <a
                  href={latestUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}
                  className="font-caption"
                >
                  手动查看
                </a>
              </>
            )}
            {errorDetail && (
              <div style={{ color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
                {errorDetail}
              </div>
            )}
          </div>
        )}
      </div>
    </AsciiBox>
  );
};

function getRuntimeVersion(): string {
  try {
    return window.electronAPI?.getAppVersion?.() || APP_VERSION;
  } catch {
    return APP_VERSION;
  }
}

export default UpdatePanel;
