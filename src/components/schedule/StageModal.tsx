import React from 'react';

interface StageFormData {
  name: string;
  description: string;
  order: number;
}

interface StageModalProps {
  isEditing: boolean;
  stageForm: StageFormData;
  onStageFormChange: (form: StageFormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const StageModal: React.FC<StageModalProps> = ({
  isEditing,
  stageForm,
  onStageFormChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEditing ? 'Edytuj Etap' : 'Dodaj Nowy Etap'}</h3>
        
        <div className="form-group">
          <label>Nazwa Etapu*</label>
          <input
            type="text"
            value={stageForm.name}
            onChange={(e) => onStageFormChange({ ...stageForm, name: e.target.value })}
            placeholder="np. ETAP 1"
          />
        </div>

        <div className="form-group">
          <label>Opis</label>
          <textarea
            value={stageForm.description}
            onChange={(e) => onStageFormChange({ ...stageForm, description: e.target.value })}
            placeholder="Opcjonalny opis etapu"
          />
        </div>

        <div className="form-group">
          <label>Kolejność*</label>
          <input
            type="number"
            value={stageForm.order}
            onChange={(e) => onStageFormChange({ ...stageForm, order: parseInt(e.target.value) || 1 })}
            min="1"
          />
          <small>Numer porządkowy etapu w harmonogramie</small>
        </div>

        <div className="form-actions">
          <button onClick={onCancel} className="btn btn-secondary">
            Anuluj
          </button>
          <button onClick={onSave} className="btn btn-primary">
            {isEditing ? 'Zapisz Zmiany' : 'Dodaj Etap'}
          </button>
        </div>
      </div>
    </div>
  );
};
