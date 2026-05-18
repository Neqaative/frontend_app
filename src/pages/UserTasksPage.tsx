import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { scheduleService } from '../services/schedule.service';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Task, WorkSchedule } from '../types/schedule.types';
import { FORM_LABELS } from '../constants/formLabels';
import '../styles/UserTasksPage.css';

interface UserTask {
  workId: number;
  stageIndex: number;
  taskIndex: number;
  stageName: string;
  workName: string;
  task: Task;
}

export default function UserTasksPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const schedules = await scheduleService.getAllSchedules();
      const userFullName = `${user.first_name} ${user.last_name}`;
      
      // Fetch work details to get work names
      const workService = (await import('../services/api')).workService;
      const works = await workService.getAllWorks();
      
      const myTasks: UserTask[] = [];
      
      schedules.forEach((schedule: WorkSchedule) => {
        const work = works.find((w: any) => w.work_id === schedule.work_id);
        const workName = work ? work.name : `Praca #${schedule.work_id}`;
        
        schedule.stages?.forEach((stage, stageIndex) => {
          stage.tasks?.forEach((task, taskIndex) => {
            if (task.assigned_to === userFullName) {
              myTasks.push({
                workId: schedule.work_id,
                stageIndex,
                taskIndex,
                stageName: stage.name,
                workName,
                task
              });
            }
          });
        });
      });
      
      setTasks(myTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showToast('Nie udało się pobrać zadań', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (workId: number, stageIndex: number, taskIndex: number) => {
    try {
      await scheduleService.toggleTaskCompletion(workId, stageIndex, taskIndex);
      showToast('Status zadania zaktualizowany', 'success');
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
      showToast('Nie udało się zaktualizować statusu zadania', 'error');
    }
  };

  if (loading) return <div className="user-tasks-loading">Ładowanie...</div>;

  const pendingTasks = tasks.filter(t => !t.task.completed);
  const completedTasks = tasks.filter(t => t.task.completed);

  const TaskTable = ({ taskList }: { taskList: UserTask[] }) => (
    <div className="task-table">
      <div className="task-table-header">
        <div>{FORM_LABELS.nameOfWork}</div>
        <div>{FORM_LABELS.stage}</div>
        <div>{FORM_LABELS.taskName}</div>
        <div>{FORM_LABELS.deadline}</div>
        <div>{FORM_LABELS.actions}</div>
      </div>
      {taskList.map((item) => (
        <div key={`${item.workId}-${item.stageIndex}-${item.taskIndex}`} className="task-table-row">
          <div className="task-cell">{item.workName}</div>
          <div className="task-cell">{item.stageName}</div>
          <div className="task-cell-name">{item.task.name}</div>
          <div className="task-cell">
            {new Date(item.task.end_date).toLocaleDateString()}
          </div>
          <div className="task-actions">
            <button 
              onClick={() => handleToggleTask(item.workId, item.stageIndex, item.taskIndex)}
              className={`task-action-btn ${item.task.completed ? 'completed' : 'pending'}`}
              title={item.task.completed ? FORM_LABELS.markAsPending : FORM_LABELS.markAsCompleted}
            >
              {item.task.completed ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="user-tasks-page">
      <header className="user-tasks-header">
        <Link to="/dashboard" className="user-tasks-back-btn">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {FORM_LABELS.backToDashboard}
        </Link>
        <h1>{FORM_LABELS.tasksPageTitle}</h1>
      </header>

      <div className="user-tasks-content">
        {tasks.length === 0 ? (
          <p className="user-tasks-empty">
            {FORM_LABELS.noTasks}
          </p>
        ) : (
          <div className="tasks-sections">
            {/* Do Wykonania Section */}
            <div className="tasks-section">
              <div className="task-section-card">
                <h2 className="task-section-header">
                  <span className="task-section-icon task-section-icon-warning">📋</span>
                  {FORM_LABELS.pendingTasks} ({pendingTasks.length})
                </h2>
                {pendingTasks.length === 0 ? (
                  <div className="task-empty-state">
                    <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3>{FORM_LABELS.allTasksCompleted}</h3>
                    <p>{FORM_LABELS.allTasksCompletedMsg}</p>
                  </div>
                ) : (
                  <TaskTable taskList={pendingTasks} />
                )}
              </div>
            </div>

            {/* Zakończone Section */}
            <div className="tasks-section">
              <div className="task-section-card">
                <h2 
                  className="task-section-header-collapsible"
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  <div className="task-section-title-wrapper">
                    <span className="task-section-icon task-section-icon-success">✅</span>
                    {FORM_LABELS.completedTasks} ({completedTasks.length})
                  </div>
                  <span className={`task-section-collapse-icon ${showCompleted ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </h2>
                {showCompleted && (
                  completedTasks.length === 0 ? (
                    <div className="task-empty-state">
                      <p>{FORM_LABELS.noCompletedTasks}</p>
                    </div>
                  ) : (
                    <TaskTable taskList={completedTasks} />
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
