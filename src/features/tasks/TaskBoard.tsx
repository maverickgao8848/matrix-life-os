import React, { useState } from 'react';
import TaskColumn from './TaskColumn';
import { useAppStore } from '../../store/useAppStore';
import { useRef, useEffect } from 'react';
import { aloCopy } from '../../copy/alo-copy';
import { format, addDays } from 'date-fns';
import {
  getWeekStart,
  getWeekDates,
  getNextWeekStart,
  getPrevWeekStart,
  getDayColumnFromDate,
} from '../../utils/date';

const DAY_LABELS: Record<string, string> = {
  MON: '周一',
  TUE: '周二',
  WED: '周三',
  THU: '周四',
  FRI: '周五',
  SAT: '周六',
  SUN: '周日',
};

const TaskBoard: React.FC = () => {
  const { tasks, config } = useAppStore();
  const [weekStart, setWeekStartState] = useState(() => getWeekStart());
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.style.setProperty('--task-column-width', `${config.taskColumnWidth ?? 260}px`);
    }
  }, [config.taskColumnWidth]);

  const weekDates = getWeekDates(weekStart);

  const getDateTasks = (date: string) => {
    return tasks.filter((t) => t.date === date);
  };

  const goToPrevWeek = () => setWeekStartState(getPrevWeekStart(weekStart));
  const goToNextWeek = () => setWeekStartState(getNextWeekStart(weekStart));
  const goToCurrentWeek = () => setWeekStartState(getWeekStart());

  const isCurrentWeek = weekStart === getWeekStart();

  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-3)',
        }}
      >
        <button
          onClick={goToPrevWeek}
          className="font-caption"
          style={{
            background: 'none',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            padding: 'var(--space-1) var(--space-3)',
            transition: 'color var(--duration-instant), border-color var(--duration-instant)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-primary)';
          }}
        >
          {aloCopy.actions.prevWeek}
        </button>
        <span className="font-h3" style={{ color: 'var(--accent-gold)' }}>
          {format(new Date(weekStart), 'yyyy年M月d日')} — {format(addDays(new Date(weekStart), 6), 'M月d日')}
        </span>
        <button
          onClick={goToNextWeek}
          className="font-caption"
          style={{
            background: 'none',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            padding: 'var(--space-1) var(--space-3)',
            transition: 'color var(--duration-instant), border-color var(--duration-instant)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-primary)';
          }}
        >
          {aloCopy.actions.nextWeek}
        </button>
        {!isCurrentWeek && (
          <button
            onClick={goToCurrentWeek}
            className="font-caption"
            style={{
              background: 'none',
              border: '1px solid var(--accent-gold)',
              color: 'var(--accent-gold)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-3)',
            }}
          >
            {aloCopy.actions.currentWeek}
          </button>
        )}
      </div>

      <div
        ref={boardRef}
        className="task-board-scroll"
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)',
        }}
      >
        {weekDates.map((date) => {
          const dayColumn = getDayColumnFromDate(new Date(date));
          return (
            <TaskColumn
              key={date}
              date={date}
              column={dayColumn}
              tasks={getDateTasks(date)}
              title={DAY_LABELS[dayColumn]}
              dateLabel={format(new Date(date), 'MM/dd')}

            />
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
