import React from 'react';

interface DeleteConfirmModalProps {
  type: 'stage' | 'task';
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  type,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Potwierdź usunięcie</h2>
        <p>
          {type === 'stage' 
            ? 'Czy na pewno chcesz usunąć ten etap? Wszystkie zadania w tym etapie również zostaną usunięte.'
            : 'Czy na pewno chcesz usunąć to zadanie?'}
        </p>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-button">
            Anuluj
          </button>
          <button onClick={onConfirm} className="delete-button">
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
};
