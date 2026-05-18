import React from 'react';
import { User } from '../../types/user.types';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/EditWorkPage.css';

interface EditTeamAssignmentsProps {
  users: User[];
  fieldworkers: number[];
  completers: number[];
  onToggleFieldworker: (userId: number) => void;
  onToggleCompleter: (userId: number) => void;
}

export const EditTeamAssignments: React.FC<EditTeamAssignmentsProps> = ({
  users,
  fieldworkers,
  completers,
  onToggleFieldworker,
  onToggleCompleter,
}) => {
  return (
    <div className="edit-work-section">
      <h2>{FORM_LABELS.teamAssignments}</h2>
      {users.length > 0 ? (
        <div className="edit-work-assignments">
          <div className="edit-work-assignment-group">
            <h3>{FORM_LABELS.fieldworkers}</h3>
            <div className="edit-work-user-list">
              {users.map(user => (
                <label key={`field-${user.user_id}`} className="edit-work-user-checkbox">
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
          <div className="edit-work-assignment-group">
            <h3>{FORM_LABELS.completers}</h3>
            <div className="edit-work-user-list">
              {users.map(user => (
                <label key={`comp-${user.user_id}`} className="edit-work-user-checkbox">
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
        <div className="edit-work-no-users">
          <p>{FORM_LABELS.noActiveUsers}</p>
        </div>
      )}
    </div>
  );
};
