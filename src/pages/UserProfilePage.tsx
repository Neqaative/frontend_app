import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { workService, userService } from '../services/api';
import { ProfileCard } from '../components/profile/ProfileCard';
import { ProfileEditForm } from '../components/profile/ProfileEditForm';
import { ChangePasswordModal } from '../components/profile/ChangePasswordModal';
import { UserWorksList } from '../components/profile/UserWorksList';
import { Work } from '../types';
import { FORM_LABELS } from '../constants/formLabels';
import '../styles/UserProfilePage.css';

export const UserProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [userWorks, setUserWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserWorks();
    if (user) {
      setEditForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [user]);

  const loadUserWorks = async () => {
    try {
      const allWorks = await workService.getAllWorks();
      // Filtruj prace przypisane do zalogowanego użytkownika
      const filteredWorks = allWorks.filter(work => 
        work.assignments?.some(assignment => assignment.user_id === user?.user_id)
      );
      setUserWorks(filteredWorks);
    } catch (error) {
      console.error('Nie udało się załadować prac:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      // Przygotuj dane do wysłania - tylko te które się zmieniły
      const updateData: any = {};
      if (editForm.first_name !== user.first_name) updateData.first_name = editForm.first_name;
      if (editForm.last_name !== user.last_name) updateData.last_name = editForm.last_name;
      if (editForm.email !== user.email) updateData.email = editForm.email;

      if (Object.keys(updateData).length === 0) {
        toast.info('Brak zmian do zapisania');
        setIsEditing(false);
        return;
      }

      const updatedUser = await userService.updateUser(user.user_id, updateData);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Dane zostały zaktualizowane');
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Nie udało się zaktualizować danych');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) return;
    
    await userService.changePassword(user.user_id, { oldPassword, newPassword });
    toast.success('Hasło zostało zmienione');
  };

  if (loading) {
    return <div className="profile-loading">Ładowanie...</div>;
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <Link to="/dashboard" className="profile-back-button">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {FORM_LABELS.backToDashboard}
        </Link>
        <h1>Mój profil</h1>
      </header>

      <div className="profile-content">
        {!isEditing ? (
          <ProfileCard 
            user={user} 
            onEditClick={handleEditClick}
            onChangePasswordClick={() => setShowPasswordModal(true)}
          />
        ) : (
          <ProfileEditForm
            editForm={editForm}
            saving={saving}
            onInputChange={handleInputChange}
            onSave={handleSaveChanges}
            onCancel={handleCancelEdit}
          />
        )}

        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handleChangePassword}
        />

        <div className="profile-works-section">
          <h2>Moje przypisane prace ({userWorks.length})</h2>
          <UserWorksList works={userWorks} currentUser={user} />
        </div>
      </div>
    </div>
  );
};

