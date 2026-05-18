import React from 'react';
import { Work } from '../types';
import { getStatusLabel, getStatusBadgeClass } from '../utils/status';
import { formatDateMonthYear } from '../utils/date';
import '../styles/WorkCard.css';
import { FORM_LABELS } from '../constants/formLabels';

interface WorkCardProps {
  work: Work;
  onClick?: (work: Work) => void;
}

// Helper function to determine completion date status (Data wykonania)
const getCompletionDateStatus = (date: Date | string): 'overdue' | 'critical' | 'warning' | 'caution' | 'ok' => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'overdue'; // Po terminie - bordowy
  if (diffDays <= 14) return 'critical'; // 2 tygodnie - czerwony
  if (diffDays <= 30) return 'warning'; // 1 miesiąc - pomarańczowy
  if (diffDays <= 60) return 'caution'; // 2 miesiące - żółty
  return 'ok'; // Więcej niż 2 miesiące - zielony
};

// Helper function to determine ready date status (Data zgłoszenia gotowości)
const getReadyDateStatus = (date: Date | string): 'overdue' | 'critical' | 'ok' => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'overdue'; // Po terminie - bordowy
  if (diffDays <= 7) return 'critical'; // Tydzień przed - czerwony
  return 'ok'; // Więcej niż tydzień - zielony
};

export const WorkCard: React.FC<WorkCardProps> = ({ work, onClick }) => {

  const handleClick = () => {
    if (onClick) {
      onClick(work);
    }
  };

  return (
    <div className="work-card" onClick={handleClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={`work-card-badge ${getStatusBadgeClass(work.status)}`}>
        <svg className="work-card-badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {getStatusLabel(work.status)}
      </div>

      <h3 className="work-card-title">{work.name}</h3>

      <div className="work-card-meta">
        <div className="work-card-dates">
          <span className="work-card-date-label">Data zgłoszenia:</span>
          <span className="work-card-date-value">{formatDateMonthYear(work.report_date)}</span>
        </div>
        <div className="work-card-deadline-indicators">
          <div className="work-card-deadline-item">
            <span className="work-card-deadline-label">Data wykonania:</span>
            <span className={`work-card-deadline-value date-indicator date-${getCompletionDateStatus(work.completion_date)}`}>
              {formatDateMonthYear(work.completion_date)}
            </span>
          </div>
          <div className="work-card-deadline-item">
            <span className="work-card-deadline-label">Data zgłoszenia gotowości:</span>
            <span className={`work-card-deadline-value date-indicator date-${getReadyDateStatus(work.ready_date)}`}>
              {formatDateMonthYear(work.ready_date)}
            </span>
          </div>
        </div>
      </div>

      <div className="work-card-info">
        <div className="work-card-info-item">
          <svg className="work-card-info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {work.city}, {work.district}, {work.region}
        </div>

        <div className="work-card-info-item">
          <svg className="work-card-info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {work.user ? `${work.user.first_name} ${work.user.last_name}` : 'Brak'}
        </div>

        <div className="work-card-info-item">
          <svg className="work-card-info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Obiekt: {work.parcel_number}
        </div>

        <div className="work-card-info-item">
          <svg className="work-card-info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {FORM_LABELS.reportId}: {work.report_id}
        </div>
      </div>
    </div>
  );
};
