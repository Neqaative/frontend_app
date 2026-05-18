import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workService, scheduleService, userService } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { ScheduleHeader } from '../components/schedule/ScheduleHeader';
import { NoScheduleCard } from '../components/schedule/NoScheduleCard';
import { StageModal } from '../components/schedule/StageModal';
import { DeleteConfirmModal } from '../components/schedule/DeleteConfirmModal';
import { StageRow } from '../components/schedule/StageRow';
import { TaskRow } from '../components/schedule/TaskRow';
import { TaskFormRow } from '../components/schedule/TaskFormRow';
import '../styles/WorkSchedulePage.css';

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
}

interface Work {
  work_id: number;
  name: string;
  city: string;
  client?: { name: string };
}

interface Task {
  number: string;
  name: string;
  assigned_to: string;
  start_date: string;
  end_date: string;
  days: number;
}

interface Stage {
  name: string;
  description?: string | null;
  order: number;
  start_date: string;
  end_date: string;
  days: number;
  tasks: Task[];
}

interface WorkSchedule {
  id: string;
  work_id: number;
  stages: Stage[];
}

interface StageFormData {
  name: string;
  description: string;
  order: number;
}

interface TaskFormData {
  number: string;
  name: string;
  assigned_to: string;
  start_date: string;
  end_date: string;
}

export default function WorkSchedulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  const [work, setWork] = useState<Work | null>(null);
  const [schedule, setSchedule] = useState<WorkSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set());
  const [showStageModal, setShowStageModal] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState<number | null>(null);
  const [editingStage, setEditingStage] = useState<{ index: number; data: Stage } | null>(null);
  const [editingTask, setEditingTask] = useState<{ stageIndex: number; taskIndex: number } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'stage' | 'task'; stageIndex: number; taskIndex?: number } | null>(null);

  const [stageForm, setStageForm] = useState<StageFormData>({
    name: '',
    description: '',
    order: 1,
  });

  const [taskForm, setTaskForm] = useState<TaskFormData>({
    number: '',
    name: '',
    assigned_to: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [workData, usersData] = await Promise.all([
        workService.getWork(Number(id)),
        userService.getActiveUsers(),
      ]);
      setWork(workData);
      setUsers(usersData);

      try {
        const scheduleData = await scheduleService.getScheduleByWorkId(Number(id));
        setSchedule(scheduleData);
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.error('Error fetching schedule:', error);
        }
      }
    } catch (error) {
      showToast('Nie udało się pobrać danych pracy', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      await scheduleService.createSchedule({ work_id: Number(id), stages: [] });
      showToast('Harmonogram utworzony pomyślnie', 'success');
      fetchData();
    } catch (error) {
      showToast('Nie udało się utworzyć harmonogramu', 'error');
    }
  };

  const handleAddStage = async () => {
    if (!stageForm.name) {
      showToast('Wypełnij wszystkie wymagane pola', 'error');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const stageDto = {
        ...stageForm,
        start_date: today,
        end_date: today,
      };
      
      if (editingStage !== null) {
        await scheduleService.updateStage(Number(id), editingStage.index, stageDto);
        showToast('Etap zaktualizowany pomyślnie', 'success');
        setEditingStage(null);
      } else {
        await scheduleService.addStage(Number(id), stageDto);
        showToast('Etap dodany pomyślnie', 'success');
      }
      setShowStageModal(false);
      resetStageForm();
      fetchData();
    } catch (error) {
      showToast(editingStage ? 'Nie udało się zaktualizować etapu' : 'Nie udało się dodać etapu', 'error');
    }
  };

  const handleEditStage = (stageIndex: number, stage: Stage) => {
    setEditingStage({ index: stageIndex, data: stage });
    setStageForm({
      name: stage.name,
      description: stage.description || '',
      order: stage.order,
    });
    setShowStageModal(true);
  };

  const handleDeleteStage = (stageIndex: number) => {
    confirmDeleteStage(stageIndex);
  };

  const handleAddTask = async () => {
    if (showTaskForm === null) return;
    if (!taskForm.number || !taskForm.name || !taskForm.assigned_to || !taskForm.start_date || !taskForm.end_date) {
      showToast('Wypełnij wszystkie pola', 'error');
      return;
    }

    const startDate = new Date(taskForm.start_date);
    const endDate = new Date(taskForm.end_date);
    if (endDate < startDate) {
      showToast('Data zakończenia nie może być wcześniejsza niż data rozpoczęcia', 'error');
      return;
    }

    try {
      if (editingTask !== null) {
        await scheduleService.updateTask(Number(id), editingTask.stageIndex, editingTask.taskIndex, taskForm);
        showToast('Zadanie zaktualizowane pomyślnie', 'success');
      } else {
        await scheduleService.addTask(Number(id), showTaskForm, taskForm);
        showToast('Zadanie dodane pomyślnie', 'success');
      }
      setShowTaskForm(null);
      setEditingTask(null);
      resetTaskForm();
      fetchData();
    } catch (error) {
      showToast(editingTask ? 'Nie udało się zaktualizować zadania' : 'Nie udało się dodać zadania', 'error');
    }
  };

  const handleEditTask = (stageIndex: number, taskIndex: number, task: Task) => {
    setEditingTask({ stageIndex, taskIndex });
    setTaskForm({
      number: task.number,
      name: task.name,
      assigned_to: task.assigned_to,
      start_date: task.start_date.split('T')[0],
      end_date: task.end_date.split('T')[0],
    });
    setShowTaskForm(stageIndex);
  };

  const handleDeleteTask = (stageIndex: number, taskIndex: number) => {
    confirmDeleteTask(stageIndex, taskIndex);
  };

  const toggleStageExpansion = (index: number) => {
    setExpandedStages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const resetStageForm = () => {
    setStageForm({
      name: '',
      description: '',
      order: (schedule?.stages.length || 0) + 1,
    });
    setEditingStage(null);
  };

  const resetTaskForm = () => {
    setTaskForm({
      number: '',
      name: '',
      assigned_to: '',
      start_date: '',
      end_date: '',
    });
    setEditingTask(null);
  };

  const confirmDeleteStage = (stageIndex: number) => {
    setDeleteConfirm({ type: 'stage', stageIndex });
  };

  const confirmDeleteTask = (stageIndex: number, taskIndex: number) => {
    setDeleteConfirm({ type: 'task', stageIndex, taskIndex });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;

    try {
      if (deleteConfirm.type === 'stage') {
        await scheduleService.deleteStage(Number(id), deleteConfirm.stageIndex);
        showToast('Etap usunięty pomyślnie', 'success');
      } else if (deleteConfirm.type === 'task' && deleteConfirm.taskIndex !== undefined) {
        await scheduleService.deleteTask(Number(id), deleteConfirm.stageIndex, deleteConfirm.taskIndex);
        showToast('Zadanie usunięte pomyślnie', 'success');
      }
      fetchData();
    } catch (error) {
      showToast('Nie udało się usunąć', 'error');
    }
    setDeleteConfirm(null);
  };

  if (loading) {
    return <div className="loading">Ładowanie...</div>;
  }

  if (!work) {
    return <div className="error">Nie znaleziono pracy</div>;
  }

  return (
    <div className="work-schedule-page">
      <ScheduleHeader work={work} onBack={() => navigate('/dashboard')} />

      {!schedule ? (
        <NoScheduleCard onCreate={handleCreateSchedule} isAdmin={isAdmin} />
      ) : (
        <>
          <div className="schedule-container">
            <div className="schedule-header">
              <h2>Harmonogram Pracy</h2>
              {isAdmin && (
                <button onClick={() => setShowStageModal(true)} className="btn btn-primary">
                  + Dodaj Etap
                </button>
              )}
            </div>

            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Lp.</th>
                  <th>Zdarzenie</th>
                  <th>Pracownik</th>
                  <th>Start</th>
                  <th>Koniec</th>
                  <th>Suma dni</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {schedule.stages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="no-stages">
                      <p>Brak etapów. Kliknij "+ Dodaj Etap" aby rozpocząć.</p>
                    </td>
                  </tr>
                ) : (
                  schedule.stages.map((stage, stageIndex) => (
                    <>
                      <StageRow
                        key={`stage-${stageIndex}`}
                        stage={stage}
                        stageIndex={stageIndex}
                        isExpanded={expandedStages.has(stageIndex)}
                        onToggleExpand={() => toggleStageExpansion(stageIndex)}
                        onAddTask={() => setShowTaskForm(stageIndex)}
                        onEdit={() => handleEditStage(stageIndex, stage)}
                        onDelete={() => handleDeleteStage(stageIndex)}
                        isAdmin={isAdmin}
                      />

                      {expandedStages.has(stageIndex) && stage.tasks.map((task, taskIndex) => (
                        <TaskRow
                          key={`task-${stageIndex}-${taskIndex}`}
                          task={task}
                          taskIndex={taskIndex}
                          stageIndex={stageIndex}
                          onEdit={() => handleEditTask(stageIndex, taskIndex, task)}
                          onDelete={() => handleDeleteTask(stageIndex, taskIndex)}
                          isAdmin={isAdmin}
                        />
                      ))}

                      {isAdmin && showTaskForm === stageIndex && (
                        <TaskFormRow
                          taskForm={taskForm}
                          users={users}
                          isEditing={editingTask !== null}
                          onTaskFormChange={setTaskForm}
                          onSave={handleAddTask}
                          onCancel={() => { setShowTaskForm(null); resetTaskForm(); }}
                        />
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile View */}
            <div className="schedule-mobile-view">
              {schedule.stages.length === 0 ? (
                <div className="no-stages">
                  <p>Brak etapów. Kliknij "+ Dodaj Etap" aby rozpocząć.</p>
                </div>
              ) : (
                schedule.stages.map((stage, stageIndex) => (
                  <div key={`mobile-stage-${stageIndex}`} className="stage-mobile-card">
                    <div className="stage-mobile-header">
                      <div className="stage-mobile-title">
                        <h3>{stage.name}</h3>
                        <span className="stage-mobile-order">#{stage.order}</span>
                      </div>
                      <div className="stage-mobile-dates">
                        <div>Start: {new Date(stage.start_date).toLocaleDateString('pl-PL')}</div>
                        <div>Koniec: {new Date(stage.end_date).toLocaleDateString('pl-PL')}</div>
                        <div>Czas trwania: {stage.days} dni</div>
                      </div>
                      {isAdmin && (
                        <div className="stage-mobile-actions">
                          <button onClick={() => setShowTaskForm(stageIndex)} className="btn btn-success btn-sm">
                            + Task
                          </button>
                          <button onClick={() => handleEditStage(stageIndex, stage)} className="btn btn-secondary btn-sm">
                            Edytuj
                          </button>
                          <button onClick={() => handleDeleteStage(stageIndex)} className="btn btn-danger btn-sm">
                            Usuń
                          </button>
                        </div>
                      )}
                      <button 
                        className="expand-button"
                        onClick={() => toggleStageExpansion(stageIndex)}
                      >
                        {expandedStages.has(stageIndex) ? '▲ Zwiń zadania' : '▼ Pokaż zadania'}
                      </button>
                    </div>

                    {expandedStages.has(stageIndex) && stage.tasks.length > 0 && (
                      <div className="stage-mobile-tasks">
                        {stage.tasks.map((task, taskIndex) => (
                          <div key={`mobile-task-${taskIndex}`} className="task-mobile-card">
                            <div className="task-mobile-header">
                              <span className="task-mobile-number">{task.number}</span>
                            </div>
                            <div className="task-mobile-info">
                              <div><strong>Zdarzenie:</strong> {task.name}</div>
                              <div><strong>Pracownik:</strong> <span>{task.assigned_to}</span></div>
                              <div><strong>Start:</strong> <span>{new Date(task.start_date).toLocaleDateString('pl-PL')}</span></div>
                              <div><strong>Koniec:</strong> <span>{new Date(task.end_date).toLocaleDateString('pl-PL')}</span></div>
                              <div><strong>Suma dni:</strong> <span>{task.days}</span></div>
                            </div>
                            {isAdmin && (
                              <div className="task-mobile-actions">
                                <button onClick={() => handleEditTask(stageIndex, taskIndex, task)} className="btn btn-secondary btn-sm">
                                  Edytuj
                                </button>
                                <button onClick={() => handleDeleteTask(stageIndex, taskIndex)} className="btn btn-danger btn-sm">
                                  Usuń
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {isAdmin && showTaskForm === stageIndex && (
                      <div style={{ padding: '1rem', background: '#f8f9fa', borderTop: '1px solid #e5e7eb' }}>
                        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: '#111827' }}>
                          {editingTask !== null ? 'Edytuj zadanie' : 'Dodaj zadanie'}
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <input
                            type="text"
                            placeholder="Numer"
                            value={taskForm.number}
                            onChange={(e) => setTaskForm({ ...taskForm, number: e.target.value })}
                            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                          />
                          <input
                            type="text"
                            placeholder="Nazwa zadania"
                            value={taskForm.name}
                            onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                          />
                          <select
                            value={taskForm.assigned_to}
                            onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                          >
                            <option value="">Wybierz pracownika</option>
                            {users.map((user) => (
                              <option key={user.user_id} value={`${user.first_name} ${user.last_name}`}>
                                {user.first_name} {user.last_name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="date"
                            value={taskForm.start_date}
                            onChange={(e) => setTaskForm({ ...taskForm, start_date: e.target.value })}
                            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                          />
                          <input
                            type="date"
                            value={taskForm.end_date}
                            onChange={(e) => setTaskForm({ ...taskForm, end_date: e.target.value })}
                            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleAddTask} className="btn btn-success" style={{ flex: 1 }}>
                              Zapisz
                            </button>
                            <button onClick={() => { setShowTaskForm(null); resetTaskForm(); }} className="btn btn-secondary" style={{ flex: 1 }}>
                              Anuluj
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {isAdmin && showStageModal && (
            <StageModal
              isEditing={editingStage !== null}
              stageForm={stageForm}
              onStageFormChange={setStageForm}
              onSave={handleAddStage}
              onCancel={() => { setShowStageModal(false); resetStageForm(); }}
            />
          )}

          {isAdmin && deleteConfirm && (
            <DeleteConfirmModal
              type={deleteConfirm.type}
              onConfirm={executeDelete}
              onCancel={() => setDeleteConfirm(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
