import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { userService } from '../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { User, Role } from '../types';
import { formatDate } from '../utils/date';
import { FORM_LABELS } from '../constants/formLabels';
import '../styles/AdminUsersPage.css';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [inactiveUsers, setInactiveUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role | null>(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const toast = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const [inactive, active] = await Promise.all([
        userService.getInactiveUsers(),
        userService.getActiveUsers(),
      ]);
      setInactiveUsers(inactive);
      setActiveUsers(active);
    } catch (error) {
      toast.error('Nie udało się załadować użytkowników');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId: number) => {
    try {
      await userService.activateUser(userId);
      toast.success('Użytkownik został aktywowany');
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Nie udało się aktywować użytkownika');
    }
  };

  const handleToggleRole = (user: User) => {
    const targetRole = user.role === Role.user ? Role.admin : Role.user;
    setUserToChangeRole(user);
    setNewRole(targetRole);
    setShowRoleModal(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!userToChangeRole || !newRole) return;

    try {
      await userService.changeUserRole(userToChangeRole.user_id, newRole);
      const roleText = newRole === Role.admin ? 'administratora' : 'użytkownika';
      toast.success(`Rola została zmieniona na ${roleText}`);
      setShowRoleModal(false);
      setUserToChangeRole(null);
      setNewRole(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Nie udało się zmienić roli');
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await userService.updateUser(editingUser.user_id, formData);
      toast.success('Dane użytkownika zostały zaktualizowane');
      setShowEditModal(false);
      setEditingUser(null);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Nie udało się zaktualizować użytkownika');
    }
  };

  const handlePasswordClick = (user: User) => {
    setEditingUser(user);
    setPasswordData({
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordModal(true);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Hasła nie są identyczne');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Hasło musi mieć minimum 8 znaków');
      return;
    }

    try {
      await userService.resetPassword(editingUser.user_id, { newPassword: passwordData.newPassword });
      toast.success('Hasło zostało zmienione');
      setShowPasswordModal(false);
      setEditingUser(null);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Nie udało się zmienić hasła');
    }
  };

  if (loading) {
    return <div className="admin-users-loading">Ładowanie...</div>;
  }

  return (
    <div className="admin-users-container">
      <header className="admin-users-header">
        <Link to="/dashboard" className="admin-users-back-button">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {FORM_LABELS.backToDashboard}
        </Link>
        <h1>Zarządzanie użytkownikami</h1>
      </header>

      <div className="admin-users-content">
        <div className="admin-users-stats">
          <div className="admin-users-stat-card">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <div>
              <h3>Oczekujący użytkownicy</h3>
              <p className="admin-users-stat-number">{inactiveUsers.length}</p>
            </div>
          </div>
        </div>

        {inactiveUsers.length > 0 && (
          <div className="admin-users-list">
            <h2>Nieaktywni użytkownicy</h2>
            <div className="admin-users-table">
              <div className="admin-users-table-header inactive-users">
                <div>Użytkownik</div>
                <div>Email</div>
                <div>Data rejestracji</div>
                <div>Akcje</div>
              </div>
              {inactiveUsers.map((user) => (
                <div key={user.user_id} className="admin-users-table-row inactive-users">
                  <div className="admin-users-user-info">
                    <div className="admin-users-avatar">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="admin-users-name">{`${user.first_name} ${user.last_name}`}</p>
                      <span className="admin-users-role">{user.role}</span>
                    </div>
                  </div>
                  <div className="admin-users-email">{user.email}</div>
                  <div className="admin-users-date">
                    {user.created_at ? formatDate(user.created_at) : 'Brak daty'}
                  </div>
                  <div>
                    <button 
                      className="admin-users-activate-button"
                      onClick={() => handleActivateUser(user.user_id)}
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Aktywuj
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="admin-users-list">
          <h2>Aktywni użytkownicy</h2>
          {activeUsers.filter(user => user.user_id !== currentUser?.user_id).length > 0 ? (
            <div className="admin-users-table">
              <div className="admin-users-table-header active-users">
                <div>Użytkownik</div>
                <div>Email</div>
                <div>Rola</div>
                <div>Data dołączenia</div>
                <div>Akcje</div>
              </div>
              {activeUsers.filter(user => user.user_id !== currentUser?.user_id).map((user) => (
                <div key={user.user_id} className="admin-users-table-row active-users">
                  <div className="admin-users-user-info">
                    <div className="admin-users-avatar">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="admin-users-name">{`${user.first_name} ${user.last_name}`}</p>
                    </div>
                  </div>
                  <div className="admin-users-email">{user.email}</div>
                  <div className="admin-users-role">
                    <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
                  </div>
                  <div className="admin-users-date">
                    {user.created_at ? formatDate(user.created_at) : 'Brak daty'}
                  </div>
                  <div className="admin-users-actions">
                    <button 
                      className="admin-users-action-button role"
                      onClick={() => handleToggleRole(user)}
                      title="Zmień rolę"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                    <button 
                      className="admin-users-action-button edit"
                      onClick={() => handleEditClick(user)}
                      title="Edytuj użytkownika"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      className="admin-users-action-button password"
                      onClick={() => handlePasswordClick(user)}
                      title="Zmień hasło"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-users-empty">
              <p>Brak aktywnych użytkowników</p>
            </div>
          )}
        </div>
      </div>

      {showEditModal && editingUser && (
        <div className="event-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <h2>Edytuj użytkownika</h2>
              <button className="event-modal-close" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>
            <form className="event-form" onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Imię *</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nazwisko *</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="form-btn cancel" onClick={() => setShowEditModal(false)}>
                  Anuluj
                </button>
                <button type="submit" className="form-btn submit">
                  Zapisz zmiany
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && editingUser && (
        <div className="event-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <h2>Zmień hasło użytkownika</h2>
              <button className="event-modal-close" onClick={() => setShowPasswordModal(false)}>
                ✕
              </button>
            </div>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
              <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.875rem' }}>
                <strong>Użytkownik:</strong> {editingUser.first_name} {editingUser.last_name} ({editingUser.email})
              </p>
            </div>
            <form className="event-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Nowe hasło *</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Minimum 6 znaków"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>Potwierdź hasło *</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Wprowadź hasło ponownie"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="form-btn cancel" onClick={() => setShowPasswordModal(false)}>
                  Anuluj
                </button>
                <button type="submit" className="form-btn submit">
                  Zmień hasło
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showRoleModal}
        title="Zmiana roli użytkownika"
        message={
          userToChangeRole && newRole
            ? `Czy na pewno chcesz zmienić rolę użytkownika ${userToChangeRole.first_name} ${userToChangeRole.last_name} na ${newRole === Role.admin ? 'administratora' : 'użytkownika'}?`
            : ''
        }
        confirmText="Zmień rolę"
        cancelText={FORM_LABELS.cancel}
        onConfirm={handleConfirmRoleChange}
        onCancel={() => {
          setShowRoleModal(false);
          setUserToChangeRole(null);
          setNewRole(null);
        }}
      />
    </div>
  );
};
