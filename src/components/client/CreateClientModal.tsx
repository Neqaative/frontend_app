import React, { useState } from 'react';
import { FORM_LABELS } from '../../constants/formLabels';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; contact?: string; notes?: string }) => Promise<void>;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Nazwa klienta jest wymagana');
      return;
    }

    try {
      setSubmitting(true);
      const submitData: any = { name: formData.name.trim() };
      if (formData.contact.trim()) submitData.contact = formData.contact.trim();
      if (formData.notes.trim()) submitData.notes = formData.notes.trim();
      
      await onSubmit(submitData);
      setFormData({ name: '', contact: '', notes: '' });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nie udało się dodać klienta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', contact: '', notes: '' });
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Dodaj nowego klienta</h2>
          <button onClick={handleClose} className="modal-close-button">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="client-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Nazwa klienta *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Wprowadź nazwę klienta"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Kontakt</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="Numer telefonu lub email"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Notatki</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Dodatkowe informacje"
              disabled={submitting}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={handleClose} 
              className="modal-cancel-button"
              disabled={submitting}
            >
              {FORM_LABELS.cancel}
            </button>
            <button 
              type="submit" 
              className="modal-confirm-button"
              disabled={submitting}
            >
              {submitting ? 'Dodaję...' : 'Dodaj klienta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
