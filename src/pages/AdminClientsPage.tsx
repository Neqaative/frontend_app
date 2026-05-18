import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clientService } from '../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { CreateClientModal } from '../components/client/CreateClientModal';
import { EditClientModal } from '../components/client/EditClientModal';
import { Client } from '../types';
import { formatDate } from '../utils/date';
import { FORM_LABELS } from '../constants/formLabels';
import '../styles/AdminClientsPage.css';

export const AdminClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleEditClick = (client: Client) => {
    setClientToEdit(client);
    setShowEditModal(true);
  };

  const handleCreateClient = async (data: { name: string; contact?: string; notes?: string }) => {
    const newClient = await clientService.createClient(data);
    setClients(prev => [newClient, ...prev]);
  };

  const handleUpdateClient = async (clientId: number, data: { name: string; contact?: string; notes?: string }) => {
    const updatedClient = await clientService.updateClient(clientId, data);
    setClients(prev => prev.map(c => c.client_id === clientId ? updatedClient : c));
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      await clientService.deleteClient(clientToDelete.client_id);
      setClients(prev => prev.filter(c => c.client_id !== clientToDelete.client_id));
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Nie udało się usunąć klienta');
    }
  };

  if (loading) {
    return <div className="admin-clients-loading">Ładowanie...</div>;
  }

  return (
    <div className="admin-clients-container">
      <ConfirmModal
        isOpen={showDeleteModal}
        title={FORM_LABELS.deleteClient}
        message={`Czy na pewno chcesz usunąć klienta "${clientToDelete?.name}"? Ta operacja jest nieodwracalna.`}
        confirmText={FORM_LABELS.delete}
        cancelText={FORM_LABELS.cancel}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setClientToDelete(null);
        }}
      />

      <CreateClientModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateClient}
      />

      <EditClientModal
        isOpen={showEditModal}
        client={clientToEdit}
        onClose={() => {
          setShowEditModal(false);
          setClientToEdit(null);
        }}
        onSubmit={handleUpdateClient}
      />

      <header className="admin-clients-header">
        <Link to="/dashboard" className="admin-clients-back-button">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {FORM_LABELS.backToDashboard}
        </Link>
        <h1>Zarządzanie klientami</h1>
      </header>

      <div className="admin-clients-content">
        <div className="admin-clients-stats">
          <div className="admin-clients-stat-card">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <h3>Liczba klientów</h3>
              <p className="admin-clients-stat-number">{clients.length}</p>
            </div>
          </div>
        </div>

        {clients.length > 0 ? (
          <div className="admin-clients-list">
            <div className="admin-clients-list-header">
              <h2>Wszyscy klienci</h2>
              <button onClick={() => setShowCreateModal(true)} className="admin-clients-add-button">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Dodaj klienta
              </button>
            </div>
            <div className="admin-clients-grid">
              {clients.map((client) => (
                <div key={client.client_id} className="admin-clients-card">
                  <div className="admin-clients-card-header">
                    <h3>{client.name}</h3>
                    <div className="admin-clients-card-actions">
                      <button
                        onClick={() => handleEditClick(client)}
                        className="admin-clients-edit-button"
                        title="Edytuj klienta"
                      >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(client)}
                        className="admin-clients-delete-button"
                        title="Usuń klienta"
                      >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {client.contact && (
                    <div className="admin-clients-card-info">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{client.contact}</span>
                    </div>
                  )}
                  {client.notes && (
                    <div className="admin-clients-card-notes">
                      <p>{client.notes}</p>
                    </div>
                  )}
                  <div className="admin-clients-card-footer">
                    <span className="admin-clients-card-date">
                      Dodano: {formatDate(client.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-clients-empty">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3>Brak klientów</h3>
            <p>Dodaj pierwszego klienta przy tworzeniu nowej pracy</p>
          </div>
        )}
      </div>
    </div>
  );
};
