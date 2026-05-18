import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DashboardPage.css';

export const AdminPanel: React.FC = () => {
  return (
    <div className="dashboard-admin-panel">
      <h2>Panel administratora</h2>
      <div className="dashboard-admin-actions">
        <Link to="/admin/users" className="dashboard-admin-card">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <div>
            <h3>Zarządzaj kontami użytkowników</h3>
            <p>Aktywacja użytkowników</p>
          </div>
        </Link>
        <Link to="/admin/works/new" className="dashboard-admin-card">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <h3>Dodaj pracę</h3>
            <p>Utwórz nową pracę</p>
          </div>
        </Link>
        <Link to="/admin/clients" className="dashboard-admin-card">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div>
            <h3>Zarządzaj klientami</h3>
            <p>Przeglądaj, dodawaj, edytuj oraz usuwaj klientów</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
