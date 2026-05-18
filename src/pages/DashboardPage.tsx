import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { workService } from '../services/api';
import { PageHeader } from '../components/PageHeader';
import { AdminPanel } from '../components/AdminPanel';
import { WorksSection } from '../components/WorksSection';
import type { Work, Status } from '../types';
import '../styles/DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | '2months' | '1month' | '2weeks' | 'overdue'>('all');
  const [readyFilter, setReadyFilter] = useState<'all' | '1week' | 'overdue'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const worksData = await workService.getAllWorks();
      setWorks(worksData);
    } catch (error) {
      console.error('Nie udało się załadować danych:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleWorkClick = (work: Work) => {
    navigate(`/works/${work.work_id}`);
  };

  if (loading) {
    return <div className="dashboard-loading">Ładowanie...</div>;
  }

  return (
    <div className="dashboard-container">
      <PageHeader
        title="Panel Główny"
        userName={user ? `${user.first_name} ${user.last_name}` : undefined}
        onLogout={handleLogout}
      />

      <div className="dashboard-content">
        {user?.role === 'admin' && <AdminPanel />}
        
        <WorksSection
          works={works}
          statusFilter={statusFilter}
          completionFilter={completionFilter}
          readyFilter={readyFilter}
          onStatusFilterChange={setStatusFilter}
          onCompletionFilterChange={setCompletionFilter}
          onReadyFilterChange={setReadyFilter}
          onWorkClick={handleWorkClick}
        />
      </div>
    </div>
  );
};
