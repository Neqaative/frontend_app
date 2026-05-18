import React from 'react';
import { User } from '../../types/user.types';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/AddWorkPage.css';

interface TeamAssignmentsProps {
  users: User[];
  fieldworkers: number[];
  completers: number[];
  onToggleFieldworker: (userId: number) => void;
  onToggleCompleter: (userId: number) => void;
}

export const TeamAssignments: React.FC<TeamAssignmentsProps> = ({
  users,
  fieldworkers,
  completers,
  onToggleFieldworker,
  onToggleCompleter,
}) => {
  return (
    <div className="add-work-section">
      <h2>{FORM_LABELS.teamAssignments}</h2>
      {users.length > 0 ? (
        <div className="add-work-assignments">
          <div className="add-work-assignment-group">
            <h3>{FORM_LABELS.fieldworkers}</h3>
            <div className="add-work-user-list">
              {users.map(user => (
                <label key={`field-${user.user_id}`} className="add-work-user-checkbox">
                  <input
                    type="checkbox"
                    checked={fieldworkers.includes(user.user_id)}
                    onChange={() => onToggleFieldworker(user.user_id)}
                  />
                  <span>{`${user.first_name} ${user.last_name}`}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="add-work-assignment-group">
            <h3>{FORM_LABELS.completers}</h3>
            <div className="add-work-user-list">
              {users.map(user => (
                <label key={`comp-${user.user_id}`} className="add-work-user-checkbox">
                  <input
                    type="checkbox"
                    checked={completers.includes(user.user_id)}
                    onChange={() => onToggleCompleter(user.user_id)}
                  />
                  <span>{`${user.first_name} ${user.last_name}`}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="add-work-no-users">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p>{FORM_LABELS.noActiveUsers}</p>
        </div>
      )}
    </div>
  );
};
