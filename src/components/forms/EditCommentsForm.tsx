import React from 'react';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/EditWorkPage.css';

interface EditCommentsFormProps {
  comments: string;
  onCommentsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const EditCommentsForm: React.FC<EditCommentsFormProps> = ({ comments, onCommentsChange }) => {
  return (
    <div className="edit-work-section">
      <h2>{FORM_LABELS.comments}</h2>
      <textarea
        name="comments"
        value={comments}
        onChange={onCommentsChange}
        rows={4}
        placeholder={FORM_LABELS.additionalInfo}
        className="edit-work-textarea"
      />
    </div>
  );
};
