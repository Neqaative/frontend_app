import React from 'react';
import { Client } from '../../types/client.types';
import { FORM_LABELS } from '../../constants/formLabels';
import '../../styles/EditWorkPage.css';

interface EditClientSelectorProps {
  clients: Client[];
  selectedClientId: number;
  showNewClientForm: boolean;
  newClientName: string;
  newClientContact: string;
  onClientChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onShowNewClientForm: () => void;
  onNewClientNameChange: (name: string) => void;
  onNewClientContactChange: (contact: string) => void;
  onCreateClient: () => void;
  onCancelNewClient: () => void;
}

export const EditClientSelector: React.FC<EditClientSelectorProps> = ({
  clients,
  selectedClientId,
  showNewClientForm,
  newClientName,
  newClientContact,
  onClientChange,
  onShowNewClientForm,
  onNewClientNameChange,
  onNewClientContactChange,
  onCreateClient,
  onCancelNewClient,
}) => {
  return (
    <div className="edit-work-section">
      <h2>{FORM_LABELS.client}</h2>
      <div className="edit-work-client-selection">
        {!showNewClientForm ? (
          <>
            <select
              name="client_id"
              value={selectedClientId || ''}
              onChange={onClientChange}
              required
              className="edit-work-select"
            >
              <option value="">{FORM_LABELS.selectClient}</option>
              {clients.map(client => (
                <option key={client.client_id} value={client.client_id}>
                  {client.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onShowNewClientForm}
              className="edit-work-new-client-button"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj nowego klienta
            </button>
          </>
        ) : (
          <div className="edit-work-new-client-form">
            <input
              type="text"
              placeholder="Nazwa klienta *"
              value={newClientName}
              onChange={(e) => onNewClientNameChange(e.target.value)}
              className="edit-work-input"
            />
            <input
              type="text"
              placeholder="Kontakt (opcjonalnie)"
              value={newClientContact}
              onChange={(e) => onNewClientContactChange(e.target.value)}
              className="edit-work-input"
            />
            <div className="edit-work-new-client-actions">
              <button type="button" onClick={onCreateClient} className="edit-work-save-button">
                Zapisz
              </button>
              <button
                type="button"
                onClick={onCancelNewClient}
                className="edit-work-cancel-button"
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
