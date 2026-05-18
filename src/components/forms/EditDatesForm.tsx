import React from 'react';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/EditWorkPage.css';

interface EditDatesFormProps {
  formData: {
    report_date: string;
    notification_date: string;
    fieldwork_date: string;
    completion_date: string;
    ready_date: string;
    acceptance_date: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EditDatesForm: React.FC<EditDatesFormProps> = ({ formData, onInputChange }) => {
  return (
    <div className="edit-work-section">
      <h2>{FORM_LABELS.dates}</h2>
      <div className="edit-work-grid">
        <div className="edit-work-field">
          <label>{FORM_LABELS.reportDate}</label>
          <input
            type="date"
            name="report_date"
            value={formData.report_date}
            onChange={onInputChange}
            required
            className="edit-work-input"
          />
        </div>
        <div className="edit-work-field">
          <label>{FORM_LABELS.notificationDate}</label>
          <input
            type="date"
            name="notification_date"
            value={formData.notification_date}
            onChange={onInputChange}
            required
            className="edit-work-input"
          />
        </div>
        <div className="edit-work-field">
          <label>{FORM_LABELS.fieldworkDate}</label>
          <input
            type="date"
            name="fieldwork_date"
            value={formData.fieldwork_date}
            onChange={onInputChange}
            required
            className="edit-work-input"
          />
        </div>
        <div className="edit-work-field">
          <label>{FORM_LABELS.completionDate}</label>
          <input
            type="date"
            name="completion_date"
            value={formData.completion_date}
            onChange={onInputChange}
            required
            className="edit-work-input"
          />
        </div>
        <div className="edit-work-field">
          <label>{FORM_LABELS.readyDate}</label>
          <input
            type="date"
            name="ready_date"
            value={formData.ready_date}
            onChange={onInputChange}
            required
            className="edit-work-input"
          />
        </div>
        <div className="edit-work-field">
          <label>{FORM_LABELS.acceptanceDate}</label>
          <input
            type="date"
            name="acceptance_date"
            value={formData.acceptance_date}
            onChange={onInputChange}
            required
            className="edit-work-input"
          />
        </div>
      </div>
    </div>
  );
};
