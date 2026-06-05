import React, { useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AsciiBox from '../../components/AsciiBox';
import { systemCopy } from '../../copy/system-copy';
import { formatBytes } from '../../utils/formatBytes';

interface HealthResult {
  status: 'ok' | 'warn' | 'error';
  structureOk: boolean;
  orphanedCount: number;
  sizeBytes: number;
  details: string[];
}

const DataHealthPanel: React.FC = () => {
  const [result, setResult] = useState<HealthResult | null>(null);
  const [checking, setChecking] = useState(false);

  const runCheck = useCallback(async () => {
    setChecking(true);
    setResult(null);

    // Small delay to allow UI to show loading state
    await new Promise((r) => setTimeout(r, 300));

    const state = useAppStore.getState();
    const details: string[] = [];
    let structureOk = true;
    let orphanedCount = 0;

    // 1. Check essential fields exist
    const requiredFields = [
      'tasks',
      'principles',
      'abilities',
      'reflections',
      'entertainments',
      'calendarEvents',
      'config',
    ];
    for (const field of requiredFields) {
      if ((state as unknown as Record<string, unknown>)[field] === undefined) {
        structureOk = false;
        details.push(`缺失必要字段: ${field}`);
      }
    }

    // 2. Check orphaned linkedKrId in tasks
    const krIds = new Set<string>();
    (state.objectives || []).forEach((o) => {
      o.krList.forEach((kr) => krIds.add(kr.id));
    });
    (state.tasks || []).forEach((t) => {
      if (t.linkedKrId && !krIds.has(t.linkedKrId)) {
        orphanedCount++;
        details.push(`任务 "${t.content.substring(0, 20)}" 关联了不存在的 KR`);
      }
    });

    // 3. Check orphaned templateId in reflections
    const templateIds = new Set((state.reflectionTemplates || []).map((t) => t.id));
    (state.reflections || []).forEach((r) => {
      if (!templateIds.has(r.templateId)) {
        orphanedCount++;
        details.push(`反思 ${r.date} 关联了不存在的模板`);
      }
    });

    // 4. Size check
    const sizeBytes = new Blob([JSON.stringify(state)]).size;

    if (sizeBytes > 4.5 * 1024 * 1024) {
      details.push(`存档体积 ${formatBytes(sizeBytes)}，接近上限`);
    }

    // Determine status
    let status: 'ok' | 'warn' | 'error' = 'ok';
    if (!structureOk) {
      status = 'error';
    } else if (orphanedCount > 0 || sizeBytes > 4.5 * 1024 * 1024) {
      status = 'warn';
    }

    setResult({ status, structureOk, orphanedCount, sizeBytes, details });
    setChecking(false);
  }, []);

  const statusEmoji = result
    ? result.status === 'ok'
      ? '✅'
      : result.status === 'warn'
        ? '⚠️'
        : '❌'
    : null;

  const statusText = result
    ? result.status === 'ok'
      ? systemCopy.health.statusOk
      : result.status === 'warn'
        ? systemCopy.health.statusWarn
        : systemCopy.health.statusError
    : '';

  const detailText = result
    ? result.status === 'ok'
      ? systemCopy.health.detailOk
      : result.status === 'warn'
        ? systemCopy.health.detailWarn
        : systemCopy.health.detailError
    : '';

  return (
    <AsciiBox title={systemCopy.health.title}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <button
          onClick={runCheck}
          disabled={checking}
          className="font-caption btn-invert"
          style={{
            background: 'none',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-secondary)',
            cursor: checking ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            padding: 'var(--space-1) var(--space-3)',
            opacity: checking ? 0.5 : 1,
            alignSelf: 'flex-start',
          }}
        >
          [ {checking ? systemCopy.health.checking : systemCopy.health.checkButton} ]
        </button>

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '16px' }}>{statusEmoji}</span>
              <span className="font-caption" style={{ color: 'var(--text-primary)' }}>
                {statusText}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-2)',
              }}
            >
              <div className="font-caption" style={{ color: 'var(--text-muted)' }}>
                {systemCopy.health.structureOk}: {result.structureOk ? '✓' : '✗'}
              </div>
              <div className="font-caption" style={{ color: 'var(--text-muted)' }}>
                {systemCopy.health.orphanedFound}: {result.orphanedCount}
              </div>
              <div className="font-caption" style={{ color: 'var(--text-muted)' }}>
                {systemCopy.health.sizeLabel}: {formatBytes(result.sizeBytes)}
              </div>
            </div>

            <div className="font-caption" style={{ color: 'var(--text-secondary)' }}>
              {detailText}
            </div>

            {result.details.length > 0 && (
              <div
                style={{
                  maxHeight: '120px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-subtle)',
                  padding: 'var(--space-2)',
                  background: 'var(--bg-secondary)',
                }}
              >
                {result.details.map((d, i) => (
                  <div
                    key={i}
                    className="font-caption"
                    style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.5 }}
                  >
                    • {d}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AsciiBox>
  );
};

export default DataHealthPanel;
