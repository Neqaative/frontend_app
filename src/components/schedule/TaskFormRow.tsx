import React from 'react';

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
}

interface TaskFormData {
  number: string;
  name: string;
  assigned_to: string;
  start_date: string;
  end_date: string;
}

interface TaskFormRowProps {
  taskForm: TaskFormData;
  users: User[];
  isEditing: boolean;
  onTaskFormChange: (form: TaskFormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const TaskFormRow: React.FC<TaskFormRowProps> = ({
  taskForm,
  users,
  isEditing,
  onTaskFormChange,
  onSave,
  onCancel,
}) => {
  return (
    <tr className="form-row">
      <td colSpan={7} style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 140px 140px auto', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Nr"
            value={taskForm.number}
            onChange={(e) => onTaskFormChange({ ...taskForm, number: e.target.value })}
            style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="Nazwa zadania"
            value={taskForm.name}
            onChange={(e) => onTaskFormChange({ ...taskForm, name: e.target.value })}
            style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
          <select
            value={taskForm.assigned_to}
            onChange={(e) => onTaskFormChange({ ...taskForm, assigned_to: e.target.value })}
            style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
          >
            <option value="">Wybierz</option>
            {users.map(user => (
              <option key={user.user_id} value={`${user.first_name} ${user.last_name}`}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={taskForm.start_date}
            onChange={(e) => onTaskFormChange({ ...taskForm, start_date: e.target.value })}
            style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
          <input
            type="date"
            value={taskForm.end_date}
            onChange={(e) => onTaskFormChange({ ...taskForm, end_date: e.target.value })}
            style={{ padding: '0.5rem', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onSave} className="btn btn-success btn-sm">
              {isEditing ? 'Zapisz' : 'Dodaj'}
            </button>
            <button onClick={onCancel} className="btn btn-secondary btn-sm">
              Anuluj
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};
