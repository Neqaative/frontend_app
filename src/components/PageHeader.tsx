import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DashboardPage.css';

interface PageHeaderProps {
  title: string;
  userName?: string;
  onLogout: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, userName, onLogout }) => {
  return (
    <header className="dashboard-header">
      <h1>{title}</h1>
      <div className="dashboard-header-right">
        <Link to="/tasks" className="dashboard-calendar-link">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '20px', height: '20px', marginRight: '5px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Moje Zadania
        </Link>
        <Link to="/calendar" className="dashboard-calendar-link">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Kalendarz
        </Link>
        {userName && (
          <Link to="/profile" className="dashboard-profile-link">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {userName}
          </Link>
        )}
        <button onClick={onLogout} className="dashboard-logout-button">
          Wyloguj
        </button>
      </div>
    </header>
  );
};
