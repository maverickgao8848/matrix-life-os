import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AsciiBox from '../../components/AsciiBox';
import type { ObjectiveArchive, KeyResult } from '../../types';
import { titlesCopy } from '../../copy/titles-copy';

interface ArchiveItemProps {
  archive: ObjectiveArchive;
  onDelete: (id: string) => void;
}

const ArchiveItem: React.FC<ArchiveItemProps> = ({ archive, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const completedDate = new Date(archive.completedAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const branchFor = (index: number, total: number) => (index === total - 1 ? '└' : '├');

  return (
    <div
      style={{
        borderLeft: '2px solid var(--accent-gold)',
        paddingLeft: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1 }}>
          <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>
            {expanded ? '▾' : '▸'}
          </span>
          <span className="font-body" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {archive.objectiveTitle}
          </span>
          <span className="font-caption" style={{ color: 'var(--text-muted)' }}>
            完成于 {completedDate}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirming) {
              onDelete(archive.id);
            } else {
              setConfirming(true);
              setTimeout(() => setConfirming(false), 3000);
            }
          }}
          className="font-caption"
          style={{
            background: 'none',
            border: 'none',
            color: confirming ? 'var(--accent-danger)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            transition: 'color var(--duration-instant)',
          }}
          onMouseEnter={(e) => {
            if (!confirming) e.currentTarget.style.color = 'var(--accent-danger)';
          }}
          onMouseLeave={(e) => {
            if (!confirming) e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          {confirming ? '[确认删除?]' : '[x]'}
        </button>
      </div>

      {/* KR Snapshot */}
      {expanded && (
        <div
          className="review-view-enter"
          style={{
            marginTop: 'var(--space-2)',
            paddingLeft: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
          }}
        >
          {archive.krSnapshot.length === 0 && (
            <span className="font-caption" style={{ color: 'var(--text-muted)' }}>
              （无关键结果记录）
            </span>
          )}
          {archive.krSnapshot.map((kr: KeyResult, idx) => (
            <div
              key={kr.id}
              className="font-body"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: kr.completed ? 'line-through' : 'none',
              }}
            >
              {branchFor(idx, archive.krSnapshot.length)} {kr.completed ? '☑' : '☐'} {kr.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ObjectiveArchivePanel: React.FC = () => {
  const archives = useAppStore((s) => s.archives);
  const deleteArchive = useAppStore((s) => s.deleteArchive);

  const sorted = [...archives].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return (
    <AsciiBox title={titlesCopy.objectiveArchive}>
      {sorted.length === 0 ? (
        <div
          className="font-caption"
          style={{
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: 'var(--space-6) 0',
          }}
        >
          暂无已归档的 Objective — 完成一个 O 的所有 KR 后，它会自动出现在这里
        </div>
      ) : (
        <div style={{ padding: 'var(--space-2) 0' }}>
          {sorted.map((archive) => (
            <ArchiveItem key={archive.id} archive={archive} onDelete={deleteArchive} />
          ))}
        </div>
      )}
    </AsciiBox>
  );
};

export default ObjectiveArchivePanel;
