import React from 'react';
import { User } from '../../types/user.types';
import { Status } from '../../types/work.types';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/AddWorkPage.css';

interface BasicInfoFormProps {
  formData: {
    name: string;
    city: string;
    district: string;
    region: string;
    parcel_number: string;
    operator_id: number;
    report_id: string;
    status: Status;
  };
  users: User[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  formData,
  users,
  onInputChange,
}) => {
  return (
    <div className="add-work-section">
      <h2>{FORM_LABELS.basicInfo}</h2>
      <div className="add-work-grid">
        <div className="add-work-field">
          <label>{FORM_LABELS.workName}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
            className="add-work-input"
          />
        </div>
        <div className="add-work-field">
          <label>{FORM_LABELS.city}</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            required
            className="add-work-input"
          />
        </div>
        <div className="add-work-field">
          <label>{FORM_LABELS.district}</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={onInputChange}
            required
            className="add-work-input"
          />
        </div>
        <div className="add-work-field">
          <label>{FORM_LABELS.region}</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={onInputChange}
            required
            className="add-work-input"
          />
        </div>
        <div className="add-work-field">
          <label>{FORM_LABELS.parcelNumber}</label>
          <input
            type="text"
            name="parcel_number"
            value={formData.parcel_number}
            onChange={onInputChange}
            required
            className="add-work-input"
          />
        </div>
        <div className="add-work-field">
          <label>{FORM_LABELS.operatorUser}</label>
          <select
            name="operator_id"
            value={formData.operator_id}
            onChange={onInputChange}
            required
            className="add-work-select"
          >
            <option value="">{FORM_LABELS.selectOperator}</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>
                {`${user.first_name} ${user.last_name}`}
              </option>
            ))}
          </select>
        </div>
        <div className="add-work-field">
          <label>{FORM_LABELS.reportId}</label>
          <input
            type="text"
            name="report_id"
            value={formData.report_id}
            onChange={onInputChange}
            required
            className="add-work-input"
            placeholder={FORM_LABELS.reportIdPlaceholder}
          />
        </div>
        <div className="add-work-field">
          <label>{FORM_LABELS.status}</label>
          <input
            type="text"
            value="Zgłoszone"
            disabled
            className="add-work-input add-work-input-disabled"
          />
          <span className="add-work-field-note">{FORM_LABELS.statusNote}</span>
        </div>
      </div>
    </div>
  );
};
