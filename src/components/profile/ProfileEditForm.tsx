import React from 'react';
import { FORM_LABELS } from '../../constants/formLabels';

interface ProfileEditFormProps {
  editForm: {
    first_name: string;
    last_name: string;
    email: string;
  };
  saving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  editForm,
  saving,
  onInputChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="profile-card">
      <div className="profile-avatar">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      
      <div className="profile-edit-form">
        <h3>{FORM_LABELS.editProfile}</h3>
        <div className="profile-form-group">
          <label>{FORM_LABELS.firstName}</label>
          <input
            type="text"
            name="first_name"
            value={editForm.first_name}
            onChange={onInputChange}
            placeholder={FORM_LABELS.firstName}
          />
        </div>
        <div className="profile-form-group">
          <label>{FORM_LABELS.lastName}</label>
          <input
            type="text"
            name="last_name"
            value={editForm.last_name}
            onChange={onInputChange}
            placeholder={FORM_LABELS.lastName}
          />
        </div>
        <div className="profile-form-group">
          <label>{FORM_LABELS.email}</label>
          <input
            type="email"
            name="email"
            value={editForm.email}
            onChange={onInputChange}
            placeholder={FORM_LABELS.email}
          />
        </div>
        <div className="profile-form-actions">
          <button onClick={onCancel} className="profile-cancel-button" disabled={saving}>
            {FORM_LABELS.cancel}
          </button>
          <button onClick={onSave} className="profile-save-button" disabled={saving}>
            {saving ? FORM_LABELS.saving : FORM_LABELS.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
};
