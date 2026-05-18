import React from 'react';
import { CreateEventDto, EventType } from '../../types/calendar.types';
import { EVENT_TYPE_LABELS } from '../../constants/eventTypes';

interface EventModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: CreateEventDto;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  onChange: (data: Partial<CreateEventDto>) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onSubmit,
  onDelete,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="event-modal-header">
          <h2>{isEditing ? 'Edytuj wydarzenie' : 'Nowe wydarzenie'}</h2>
          <button className="event-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="event-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Typ wydarzenia *</label>
            <select
              value={formData.type}
              onChange={(e) => {
                const newType = e.target.value as EventType;
                onChange({ 
                  type: newType,
                  title: newType === 'OTHER' ? formData.title : ''
                });
              }}
              required
            >
              {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {formData.type === 'OTHER' && (
            <div className="form-group">
              <label>Tytuł *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onChange({ title: e.target.value })}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Data rozpoczęcia *</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => onChange({ start_date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Data zakończenia *</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => onChange({ end_date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Lokalizacja</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => onChange({ location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Opis</label>
            <textarea
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="form-btn cancel" onClick={onClose}>
              Anuluj
            </button>
            {isEditing && onDelete && (
              <button type="button" className="form-btn delete" onClick={onDelete}>
                Usuń
              </button>
            )}
            <button type="submit" className="form-btn submit">
              {isEditing ? 'Zapisz zmiany' : 'Utwórz wydarzenie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
