import React from 'react';
import { Status } from '../types/work.types';
import '../styles/DashboardPage.css';

interface FilterBarProps {
  statusFilter: Status | 'all';
  completionFilter: 'all' | '2months' | '1month' | '2weeks' | 'overdue';
  readyFilter: 'all' | '1week' | 'overdue';
  onStatusFilterChange: (value: Status | 'all') => void;
  onCompletionFilterChange: (value: 'all' | '2months' | '1month' | '2weeks' | 'overdue') => void;
  onReadyFilterChange: (value: 'all' | '1week' | 'overdue') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  completionFilter,
  readyFilter,
  onStatusFilterChange,
  onCompletionFilterChange,
  onReadyFilterChange,
}) => {
  return (
    <div className="dashboard-filters">
      <div className="dashboard-filter-group">
        <label>Status:</label>
        <select 
          value={statusFilter} 
          onChange={(e) => onStatusFilterChange(e.target.value as Status | 'all')}
          className="dashboard-filter-select"
        >
          <option value="all">Wszystkie</option>
          <option value="submitted">Zgłoszona</option>
          <option value="under_review">Analiza</option>
          <option value="field_work">Prace terenowe</option>
          <option value="compilation">Kompletacja</option>
          <option value="under_clause">W klauzuli</option>
          <option value="correction">Poprawa</option>
          <option value="classified">Zaklauzulowany</option>
          <option value="delivered">Przekazany</option>
        </select>
      </div>
      <div className="dashboard-filter-group">
        <label>Data wykonania:</label>
        <select 
          value={completionFilter} 
          onChange={(e) => onCompletionFilterChange(e.target.value as 'all' | '2months' | '1month' | '2weeks' | 'overdue')}
          className="dashboard-filter-select"
        >
          <option value="all">Wszystkie</option>
          <option value="overdue">Po terminie</option>
          <option value="2weeks">Do 2 tygodni</option>
          <option value="1month">Do 1 miesiąca</option>
          <option value="2months">Do 2 miesięcy</option>
        </select>
      </div>
      <div className="dashboard-filter-group">
        <label>Zgłoszenie gotowości:</label>
        <select 
          value={readyFilter} 
          onChange={(e) => onReadyFilterChange(e.target.value as 'all' | '1week' | 'overdue')}
          className="dashboard-filter-select"
        >
          <option value="all">Wszystkie</option>
          <option value="overdue">Po terminie</option>
          <option value="1week">Do 1 tygodnia</option>
        </select>
      </div>
    </div>
  );
};
