import React from 'react';
import { CALENDAR_MESSAGES } from '../../constants/calendar';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay" onClick={onCancel}>
      <div className="confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{CALENDAR_MESSAGES.CONFIRM_DELETE_TITLE}</h3>
        <p>{CALENDAR_MESSAGES.CONFIRM_DELETE_MESSAGE}</p>
        <div className="confirm-delete-actions">
          <button className="form-btn cancel" onClick={onCancel}>
            Anuluj
          </button>
          <button className="form-btn delete" onClick={onConfirm}>
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
};
