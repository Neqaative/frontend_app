import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AddWorkPage.css';

interface BackButtonProps {
  to: string;
  label: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ to, label, className = 'add-work-back-button' }) => {
  return (
    <Link to={to} className={className}>
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  );
};
