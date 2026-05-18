import React from 'react';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/AddWorkPage.css';

interface CommentsFormProps {
  comments: string;
  onCommentsChange: (comments: string) => void;
}

export const CommentsForm: React.FC<CommentsFormProps> = ({ comments, onCommentsChange }) => {
  return (
    <div className="add-work-section">
      <h2>{FORM_LABELS.comments}</h2>
      <textarea
        name="comments"
        value={comments}
        onChange={(e) => onCommentsChange(e.target.value)}
        rows={4}
        placeholder={FORM_LABELS.additionalInfo}
        className="add-work-textarea"
      />
    </div>
  );
};
