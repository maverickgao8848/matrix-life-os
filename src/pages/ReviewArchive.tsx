import React, { useState } from 'react';
import ReflectionGrid from '../features/reflections/ReflectionGrid';
import ReflectionDetailModal from '../features/reflections/ReflectionDetailModal';
import ReflectionQuickEntry from '../features/reflections/ReflectionQuickEntry';
import AbilityReader from '../features/abilities/AbilityReader';
import AbilityTraining from '../features/abilities/AbilityTraining';
import MoodTrackerPanel from '../features/mood/MoodTrackerPanel';
import AsciiBox from '../components/AsciiBox';
import { useAppStore } from '../store/useAppStore';
import type { Reflection } from '../types';

import { titlesCopy } from '../copy/titles-copy';
import ObjectiveArchivePanel from '../features/archive/ObjectiveArchivePanel';

const ReviewArchive: React.FC = () => {
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const isModuleEnabled = useAppStore((s) => s.isModuleEnabled);

  return (
    <div className="review-view-enter">
      {/* Row 1: 反思 + 能力雷达 */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-8)',
          alignItems: 'stretch',
        }}
      >
        {/* 左：反思（今日反思 + 反思档案 + 光荣榜上下堆叠） */}
        <div style={{ flex: '1 1 50%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <AsciiBox title={titlesCopy.todaysReflection}>
            <ReflectionQuickEntry />
          </AsciiBox>
          <AsciiBox title={titlesCopy.reflectionLibrary}>
            <ReflectionGrid onViewDetail={setSelectedReflection} />
          </AsciiBox>
          <ObjectiveArchivePanel />
        </div>

        {/* 右：能力（雷达图 + 训练上下堆叠） */}
        <div style={{ flex: '1 1 50%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {isModuleEnabled('abilities') && (
            <>
              <AbilityReader />
              <AbilityTraining />
            </>
          )}
        </div>
      </div>

      {/* Row 2: 心情 */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-8)',
          alignItems: 'stretch',
        }}
      >
        <div style={{ flex: '1 1 50%', minWidth: 0 }}>
          {isModuleEnabled('mood') && <MoodTrackerPanel />}
        </div>
        <div style={{ flex: '1 1 50%', minWidth: 0 }} />
      </div>

      <ReflectionDetailModal
        reflection={selectedReflection}
        onClose={() => setSelectedReflection(null)}
      />
    </div>
  );
};

export default ReviewArchive;
