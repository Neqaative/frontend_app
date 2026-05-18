import React from 'react';

interface Stage {
  name: string;
  description?: string | null;
  order: number;
  start_date: string;
  end_date: string;
  days: number;
  tasks: any[];
}

interface StageRowProps {
  stage: Stage;
  stageIndex: number;
  isExpanded: boolean;
  isAdmin?: boolean;
  onToggleExpand: () => void;
  onAddTask: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const StageRow: React.FC<StageRowProps> = ({
  stage,
  stageIndex,
  isExpanded,
  isAdmin = false,
  onToggleExpand,
  onAddTask,
  onEdit,
  onDelete,
}) => {
  return (
    <tr key={`stage-${stageIndex}`} className="stage-row">
      <td>{stage.order}</td>
      <td colSpan={5}>
        <div className="stage-name-cell">
          <button onClick={onToggleExpand} className="expand-button">
            {isExpanded ? '▼' : '▶'}
          </button>
          <div>
            <strong>{stage.name}</strong>
            {stage.description && (
              <div style={{ fontSize: '0.85em', color: '#6c757d', marginTop: '0.25rem' }}>
                {stage.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td>
        {isAdmin && (
          <div className="action-buttons">
            <button
              onClick={onAddTask}
              className="btn btn-success btn-sm btn-icon"
              title="Dodaj zadanie"
            >
              +
            </button>
            <button
              onClick={onEdit}
              className="btn btn-primary btn-sm btn-icon"
              title="Edytuj etap"
            >
              ✎
            </button>
            <button
              onClick={onDelete}
              className="btn btn-danger btn-sm btn-icon"
              title="Usuń etap"
            >
              ×
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};
