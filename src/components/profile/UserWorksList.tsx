import React from 'react';
import { Link } from 'react-router-dom';
import { Work, User } from '../../types';
import { getStatusLabel, getRoleLabel, getStatusBadgeClass } from '../../utils/status';
import { formatDate } from '../../utils/date';

interface UserWorksListProps {
  works: Work[];
  currentUser: User | null;
}

export const UserWorksList: React.FC<UserWorksListProps> = ({ works, currentUser }) => {
  if (works.length === 0) {
    return (
      <div className="profile-empty">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3>Brak przypisanych prac</h3>
        <p>Nie jesteś jeszcze przypisany do żadnej pracy</p>
      </div>
    );
  }

  return (
    <div className="profile-works-list">
      {works.map((work) => {
        const myAssignment = work.assignments?.find(a => a.user_id === currentUser?.user_id);
        return (
          <Link 
            to={`/works/${work.work_id}`} 
            key={work.work_id} 
            className="profile-work-item"
          >
            <div className="profile-work-header">
              <h3>{work.name}</h3>
              <div className="profile-work-badges">
                {myAssignment && (
                  <span className={`profile-work-role ${myAssignment.role}`}>
                    {getRoleLabel(myAssignment.role)}
                  </span>
                )}
                <span className={`profile-work-status ${getStatusBadgeClass(work.status)}`}>
                  {getStatusLabel(work.status)}
                </span>
              </div>
            </div>
            <div className="profile-work-details">
              <div className="profile-work-detail">
                <svg className="profile-work-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{work.city}</span>
              </div>
              <div className="profile-work-detail">
                <svg className="profile-work-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Zgłoszono: {formatDate(work.report_date)}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
