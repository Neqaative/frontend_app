import React from 'react';
import { Work } from '../../types/work.types';
import { getStatusLabel } from '../../utils/status';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/WorkDetailsPage.css';

interface WorkInfoCardProps {
  work: Work;
}

export const WorkInfoCard: React.FC<WorkInfoCardProps> = ({ work }) => {
  return (
    <div className="work-details-card">
      <h2 className="work-details-card-title">
        <svg className="work-details-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {FORM_LABELS.basicInfo}
      </h2>
      <div className="work-details-info-grid">
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.status}</span>
          <span className="work-details-info-value">{getStatusLabel(work.status)}</span>
        </div>
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.parcelNumber}</span>
          <span className="work-details-info-value">{work.parcel_number}</span>
        </div>
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.operator}</span>
          <span className="work-details-info-value">
            {work.user ? `${work.user.first_name} ${work.user.last_name}` : 'Brak'}
          </span>
        </div>
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.reportId}</span>
          <span className="work-details-info-value">{work.report_id || 'Brak'}</span>
        </div>
        <div className="work-details-info-row">
          <span className="work-details-info-label">{FORM_LABELS.client}</span>
          <span className="work-details-info-value">{work.client?.name || 'Brak'}</span>
        </div>
      </div>
    </div>
  );
};
