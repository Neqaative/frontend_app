import React from 'react';

interface NoScheduleCardProps {
  onCreate: () => void;
  isAdmin?: boolean;
}

export const NoScheduleCard: React.FC<NoScheduleCardProps> = ({ onCreate, isAdmin = false }) => {
  return (
    <div className="no-schedule">
      <p>Brak harmonogramu.{isAdmin ? ' Kliknij "Utwórz Harmonogram".' : ''}</p>
      {isAdmin && (
        <button onClick={onCreate} className="btn btn-primary">
          Utwórz Harmonogram
        </button>
      )}
    </div>
  );
};
