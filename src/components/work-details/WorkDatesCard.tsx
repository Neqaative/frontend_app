import React from 'react';
import { Work } from '../../types/work.types';
import { formatDate } from '../../utils/date';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/WorkDetailsPage.css';

// Helper function to determine completion date status
const getCompletionDateStatus = (date: Date | string): 'overdue' | 'critical' | 'warning' | 'caution' | 'ok' => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 14) return 'critical';
  if (diffDays <= 30) return 'warning';
  if (diffDays <= 60) return 'caution';
  return 'ok';
};

// Helper function to determine ready date status
const getReadyDateStatus = (date: Date | string): 'overdue' | 'critical' | 'ok' => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 7) return 'critical';
  return 'ok';
};

interface WorkDatesCardProps {
  work: Work;
}

export const WorkDatesCard: React.FC<WorkDatesCardProps> = ({ work }) => {
  return (
    <div className="work-details-card">
      <h2 className="work-details-card-title">
        <svg className="work-details-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {FORM_LABELS.dates}
      </h2>
      <div className="work-details-info-grid">
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.reportDate}</span>
          <span className="work-details-info-value">{formatDate(work.report_date)}</span>
        </div>
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.notificationDate}</span>
          <span className="work-details-info-value">{formatDate(work.notification_date)}</span>
        </div>
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.fieldworkDate}</span>
          <span className="work-details-info-value">{formatDate(work.fieldwork_date)}</span>
        </div>
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.completionDate}</span>
          <span className={`work-details-info-value date-indicator date-${getCompletionDateStatus(work.completion_date)}`}>
            {formatDate(work.completion_date)}
          </span>
        </div>
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.readyDate}</span>
          <span className={`work-details-info-value date-indicator date-${getReadyDateStatus(work.ready_date)}`}>
            {formatDate(work.ready_date)}
          </span>
        </div>
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.acceptanceDate}</span>
          <span className="work-details-info-value">{formatDate(work.acceptance_date)}</span>
        </div>
      </div>
    </div>
  );
};
