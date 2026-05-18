import React from 'react';
import { User } from '../../types';
import { FORM_LABELS } from '../../constants/formLabels';

interface ProfileCardProps {
  user: User | null;
  onEditClick: () => void;
  onChangePasswordClick: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onEditClick, onChangePasswordClick }) => {
  return (
    <div className="profile-card">
      <div className="profile-avatar">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      
      <div className="profile-info">
        <h2>{user ? `${user.first_name} ${user.last_name}` : ''}</h2>
        <p className="profile-email">{user?.email}</p>
        <span className={`profile-role ${user?.role}`}>
          {user?.role === 'admin' ? 'Administrator' : 'Użytkownik'}
        </span>
        <div className="profile-button-group">
          <button onClick={onEditClick} className="profile-edit-button">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {FORM_LABELS.editProfile}
          </button>
          <button onClick={onChangePasswordClick} className="profile-change-password-button">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Zmień hasło
          </button>
        </div>
      </div>
    </div>
  );
};
