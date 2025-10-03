
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  footer?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, footer, className }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 transform transition-all duration-300 hover:scale-[1.03] hover:border-amber-400/50 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="bg-slate-700/50 p-3 rounded-lg text-amber-400">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-slate-300">{title}</h3>
      </div>
      <p className="text-5xl font-bold text-white mt-4">{value}</p>
      {footer && <p className="text-slate-400 mt-2">{footer}</p>}
    </div>
  );
};

export default StatCard;
