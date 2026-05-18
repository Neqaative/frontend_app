import React from 'react';

interface Task {
  number: string;
  name: string;
  assigned_to: string;
  start_date: string;
  end_date: string;
  days: number;
}

interface TaskRowProps {
  task: Task;
  taskIndex: number;
  stageIndex: number;
  isAdmin?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const dayName = date.toLocaleDateString('pl-PL', { weekday: 'long' });
  const day = date.getDate();
  const monthName = date.toLocaleDateString('pl-PL', { month: 'long' });
  const year = date.getFullYear();
  return `${dayName}, ${day} ${monthName} ${year}`;
};

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  taskIndex,
  stageIndex,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  return (
    <tr key={`task-${stageIndex}-${taskIndex}`} className="task-row">
      <td>{task.number}</td>
      <td>{task.name}</td>
      <td>{task.assigned_to}</td>
      <td>{formatDate(task.start_date)}</td>
      <td>{formatDate(task.end_date)}</td>
      <td>{task.days}</td>
      <td>
        {isAdmin && (
          <div className="action-buttons">
            <button
              onClick={onEdit}
              className="btn btn-primary btn-sm btn-icon"
              title="Edytuj zadanie"
            >
              ✎
            </button>
            <button
              onClick={onDelete}
              className="btn btn-danger btn-sm btn-icon"
              title="Usuń zadanie"
            >
              ×
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};
