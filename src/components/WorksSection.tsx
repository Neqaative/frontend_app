import React from 'react';
import { Work } from '../types/work.types';
import { WorkCard } from './WorkCard';
import { FilterBar } from './FilterBar';
import { Status } from '../types/work.types';
import '../styles/DashboardPage.css';

interface WorksSectionProps {
  works: Work[];
  statusFilter: Status | 'all';
  completionFilter: 'all' | '2months' | '1month' | '2weeks' | 'overdue';
  readyFilter: 'all' | '1week' | 'overdue';
  onStatusFilterChange: (value: Status | 'all') => void;
  onCompletionFilterChange: (value: 'all' | '2months' | '1month' | '2weeks' | 'overdue') => void;
  onReadyFilterChange: (value: 'all' | '1week' | 'overdue') => void;
  onWorkClick: (work: Work) => void;
}

export const WorksSection: React.FC<WorksSectionProps> = ({
  works,
  statusFilter,
  completionFilter,
  readyFilter,
  onStatusFilterChange,
  onCompletionFilterChange,
  onReadyFilterChange,
  onWorkClick,
}) => {
  const getDaysUntilDate = (targetDate: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredWorks = works.filter((work) => {
    // Status filter
    if (statusFilter !== 'all' && work.status !== statusFilter) {
      return false;
    }

    // Completion date filter (Data wykonania)
    if (completionFilter !== 'all') {
      const daysUntil = getDaysUntilDate(work.completion_date);
      
      if (completionFilter === 'overdue' && daysUntil >= 0) return false;
      if (completionFilter === '2weeks' && (daysUntil < 0 || daysUntil > 14)) return false;
      if (completionFilter === '1month' && (daysUntil < 0 || daysUntil > 30)) return false;
      if (completionFilter === '2months' && (daysUntil < 0 || daysUntil > 60)) return false;
    }

    // Ready date filter (Data zgłoszenia gotowości)
    if (readyFilter !== 'all') {
      const daysUntil = getDaysUntilDate(work.ready_date);
      
      if (readyFilter === 'overdue' && daysUntil >= 0) return false;
      if (readyFilter === '1week' && (daysUntil < 0 || daysUntil > 7)) return false;
    }

    return true;
  });

  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <h2>Prace ({filteredWorks.length})</h2>
        <FilterBar
          statusFilter={statusFilter}
          completionFilter={completionFilter}
          readyFilter={readyFilter}
          onStatusFilterChange={onStatusFilterChange}
          onCompletionFilterChange={onCompletionFilterChange}
          onReadyFilterChange={onReadyFilterChange}
        />
      </div>
      <div className="dashboard-grid">
        {filteredWorks.length > 0 ? (
          filteredWorks.map((work) => (
            <WorkCard key={work.work_id} work={work} onClick={onWorkClick} />
          ))
        ) : (
          <div className="dashboard-empty-message">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3>Brak prac</h3>
            <p>Nie znaleziono żadnych prac spełniających kryteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
