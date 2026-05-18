import React from 'react';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/WorkDetailsPage.css';

interface WorkCommentsCardProps {
  comments?: string;
}

export const WorkCommentsCard: React.FC<WorkCommentsCardProps> = ({ comments }) => {
  if (!comments) {
    return null;
  }

  return (
    <div className="work-details-comments">
      <h2 className="work-details-card-title">
        <svg className="work-details-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        {FORM_LABELS.comments}
      </h2>
      <p className="work-details-comments-text">{comments}</p>
    </div>
  );
};
