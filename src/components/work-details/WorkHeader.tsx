import React from 'react';
import { Role } from '../../types/user.types';
import { BackButton } from '../forms/BackButton';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/WorkDetailsPage.css';

interface WorkHeaderProps {
  userRole?: Role;
  onEdit: () => void;
  onSchedule: () => void;
  onDelete: () => void;
}

export const WorkHeader: React.FC<WorkHeaderProps> = ({
  userRole,
  onEdit,
  onSchedule,
  onDelete,
}) => {
  return (
    <header className="work-details-header">
      <BackButton to="/dashboard" label={FORM_LABELS.backToDashboard} className="work-details-back-button" />
      <div className="work-details-actions">
        <button className="work-details-schedule-button" onClick={onSchedule}>
          Harmonogram
        </button>
        {userRole === Role.admin && (
          <>
            <button className="work-details-edit-button" onClick={onEdit}>
              {FORM_LABELS.edit}
            </button>
            <button className="work-details-delete-button" onClick={onDelete}>
              {FORM_LABELS.delete}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
