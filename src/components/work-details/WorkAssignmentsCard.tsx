import React from 'react';
import { WorkAssignment } from '../../types/work.types';
import { getRoleLabel } from '../../utils/status';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/WorkDetailsPage.css';

interface WorkAssignmentsCardProps {
  assignments?: WorkAssignment[];
}

export const WorkAssignmentsCard: React.FC<WorkAssignmentsCardProps> = ({ assignments }) => {
  if (!assignments || assignments.length === 0) {
    return null;
  }

  return (
    <div className="work-details-card">
      <h2 className="work-details-card-title">
        <svg className="work-details-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {FORM_LABELS.teamAssignments} ({assignments.length})
      </h2>
      <div className="work-details-assignments">
        {assignments.map((assignment) => (
          <div 
            key={assignment.work_assignment_id} 
            className={`work-details-assignment-item ${assignment.role}`}
          >
            <div className="work-details-assignment-user">
              <span className="work-details-assignment-name">
                {`${assignment.user.first_name} ${assignment.user.last_name}`}
              </span>
              <span className="work-details-assignment-email">{assignment.user.email}</span>
            </div>
            <span className={`work-details-assignment-role ${assignment.role}`}>
              {getRoleLabel(assignment.role)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
