import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { WorkHeader } from '../components/work-details/WorkHeader';
import { WorkInfoCard } from '../components/work-details/WorkInfoCard';
import { WorkDatesCard } from '../components/work-details/WorkDatesCard';
import { WorkAssignmentsCard } from '../components/work-details/WorkAssignmentsCard';
import { WorkCommentsCard } from '../components/work-details/WorkCommentsCard';
import { Work } from '../types';
import { FORM_LABELS } from '../constants/formLabels';
import '../styles/WorkDetailsPage.css';

export const WorkDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadWork();
  }, [id]);

  const loadWork = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await workService.getWork(parseInt(id));
      setWork(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nie udało się załadować szczegółów pracy');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!work) return;
    
    try {
      await workService.deleteWork(work.work_id);
      setShowDeleteModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Nie udało się usunąć pracy');
    }
  };

  if (loading) {
    return <div className="work-details-loading">Ładowanie szczegółów pracy...</div>;
  }

  if (error || !work) {
    return <div className="work-details-error">{error || 'Praca nie znaleziona'}</div>;
  }

  return (
    <div className="work-details-container">
      <ConfirmModal
        isOpen={showDeleteModal}
        title={FORM_LABELS.delete + ' pracę'}
        message="Czy na pewno chcesz usunąć tę pracę? Ta operacja jest nieodwracalna."
        confirmText={FORM_LABELS.delete}
        cancelText={FORM_LABELS.cancel}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
      
      <WorkHeader
        userRole={user?.role}
        onEdit={() => navigate(`/works/${work.work_id}/edit`)}
        onSchedule={() => navigate(`/works/${work.work_id}/schedule`)}
        onDelete={() => setShowDeleteModal(true)}
      />

      <div className="work-details-content">
        <div className="work-details-title-section">
          <h1 className="work-details-title">{work.name}</h1>
          <div className="work-details-subtitle">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {work.city}, {work.district}, {work.region}
          </div>
        </div>

        <div className="work-details-grid">
          <WorkInfoCard work={work} />
          <WorkDatesCard work={work} />
        </div>

        <WorkAssignmentsCard assignments={work.assignments} />
        <WorkCommentsCard comments={work.comments} />
      </div>
    </div>
  );
};
