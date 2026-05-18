import React from 'react';

interface Work {
  work_id: number;
  name: string;
  city: string;
  client?: { name: string };
}

interface ScheduleHeaderProps {
  work: Work;
  onBack: () => void;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ work, onBack }) => {
  return (
    <div className="page-header">
      <button onClick={onBack} className="back-button">
        ← Powrót
      </button>
      <h1>{work.name}</h1>
      <div className="work-info">
        <span>Miejscowość: {work.city}</span>
        {work.client && <span>Klient: {work.client.name}</span>}
      </div>
    </div>
  );
};
