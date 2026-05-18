import React from 'react';
import { User } from '../../types/user.types';

interface CalendarHeaderProps {
  users: User[];
  selectedUserId: number | null;
  currentUserId: number | undefined;
  onUserChange: (userId: number) => void;
  onBack: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  users,
  selectedUserId,
  currentUserId,
  onUserChange,
  onBack,
}) => {
  return (
    <div className="calendar-header">
      <div className="calendar-header-left">
        <button className="calendar-back-btn" onClick={onBack}>
          ← Powrót
        </button>
        <h1>Kalendarz</h1>
      </div>
      <div className="calendar-actions">
        <div className="user-selector">
          <label>Kalendarz użytkownika:</label>
          <select
            value={selectedUserId || ''}
            onChange={(e) => onUserChange(Number(e.target.value))}
          >
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.first_name} {user.last_name}
                {user.user_id === currentUserId ? ' (Ty)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
