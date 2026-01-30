
import React from 'react';
import { DocumentStatus } from '../types';

interface StatusBadgeProps {
  status: DocumentStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case DocumentStatus.COMPLETED:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case DocumentStatus.PENDING:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case DocumentStatus.PROCESSING:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case DocumentStatus.DAMAGED:
        return 'bg-red-100 text-red-700 border-red-200';
      case DocumentStatus.MISSING:
        return 'bg-slate-800 text-white border-slate-900';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
