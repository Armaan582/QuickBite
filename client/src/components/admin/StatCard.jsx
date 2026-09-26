import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'orange' }) => {
  const colorMap = {
    orange: 'bg-orange-500/10 text-orange-600 border-orange-200/60',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-200/60',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/60',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200/60',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-200/60'
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100/80 shadow-lg shadow-gray-100/50 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {title}
        </span>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
      </div>

      {Icon && (
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 ${
            colorMap[color] || colorMap.orange
          }`}
        >
          <Icon className="w-7 h-7" />
        </div>
      )}
    </div>
  );
};
