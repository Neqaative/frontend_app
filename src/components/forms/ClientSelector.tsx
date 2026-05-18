import React from 'react';
import { Client } from '../../types/client.types';
import '../../styles/AddWorkPage.css';

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: number;
  showNewClientForm: boolean;
  newClientName: string;
  newClientContact: string;
  onClientChange: (clientId: number) => void;
  onShowNewClientForm: () => void;
  onNewClientNameChange: (name: string) => void;
  onNewClientContactChange: (contact: string) => void;
  onCreateClient: () => void;
  onCancelNewClient: () => void;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
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
    <div className="add-work-section">
      <h2>Klient</h2>
      <div className="add-work-client-selection">
        {!showNewClientForm ? (
          <>
            <select
              name="client_id"
              value={selectedClientId || ''}
              onChange={(e) => onClientChange(Number(e.target.value))}
              required
              className="add-work-select"
            >
              <option value="">Wybierz klienta</option>
              {clients.map(client => (
                <option key={client.client_id} value={client.client_id}>
                  {client.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onShowNewClientForm}
              className="add-work-new-client-button"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj nowego klienta
            </button>
          </>
        ) : (
          <div className="add-work-new-client-form">
            <input
              type="text"
              placeholder="Nazwa klienta *"
              value={newClientName}
              onChange={(e) => onNewClientNameChange(e.target.value)}
              className="add-work-input"
            />
            <input
              type="text"
              placeholder="Kontakt (opcjonalnie)"
              value={newClientContact}
              onChange={(e) => onNewClientContactChange(e.target.value)}
              className="add-work-input"
            />
            <div className="add-work-new-client-actions">
              <button type="button" onClick={onCreateClient} className="add-work-save-button">
                Zapisz
              </button>
              <button
                type="button"
                onClick={onCancelNewClient}
                className="add-work-cancel-button"
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
