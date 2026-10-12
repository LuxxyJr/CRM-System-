import React from 'react';

export const ReportsView: React.FC = () => {
  const aePerformance = [
    { name: 'Sarah Jenkins', role: 'Regional Director', wonDeals: 12, arr: '$1,840,000', winRate: '78%' },
    { name: 'Marcus Vance', role: 'Strategic AE', wonDeals: 8, arr: '$980,000', winRate: '68%' },
    { name: 'Elena Rostova', role: 'Enterprise AE', wonDeals: 6, arr: '$640,000', winRate: '62%' },
    { name: 'David Kalu', role: 'Mid-Market AE', wonDeals: 5, arr: '$370,000', winRate: '55%' },
  ];

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <span>Executive Intelligence</span>
            <span>•</span>
            <span className="text-tertiary font-semibold">Cohort & Pipeline Realization</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold mt-1">
            Revenue & Pipeline Analytics
          </h1>
        </div>

        <button
          onClick={() => alert('Full analytical breakdown exported to CSV and PDF')}
          className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-lowest text-on-surface font-label-lg text-label-lg rounded-lg shadow-xs hover:bg-whisper-blue transition-all cursor-pointer border border-soft-slate-border font-medium"
        >
          <span className="material-symbols-outlined text-lg">file_download</span>
          <span>Download Executive Brief</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-soft-slate-border">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Total Booked ARR
          </span>
          <div className="font-headline-lg text-headline-lg font-semibold text-on-surface mt-1">
            $3,830,000
          </div>
          <span className="font-body-sm text-body-sm text-badge-won-fg font-semibold mt-1 inline-block">
            +18.4% YoY vs target
          </span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-soft-slate-border">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Average Sales Cycle
          </span>
          <div className="font-headline-lg text-headline-lg font-semibold text-on-surface mt-1">
            42 Days
          </div>
          <span className="font-body-sm text-body-sm text-badge-won-fg font-semibold mt-1 inline-block">
            -6 days faster
          </span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-soft-slate-border">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Win Rate (Qualified)
          </span>
          <div className="font-headline-lg text-headline-lg font-semibold text-on-surface mt-1">
            68.2%
          </div>
          <span className="font-body-sm text-body-sm text-tertiary font-semibold mt-1 inline-block">
            Top Decile Performance
          </span>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-soft-slate-border">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Pipeline Coverage Ratio
          </span>
          <div className="font-headline-lg text-headline-lg font-semibold text-on-surface mt-1">
            3.4x
          </div>
          <span className="font-body-sm text-body-sm text-outline font-normal mt-1 inline-block">
            Industry Benchmark 3.0x
          </span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-soft-slate-border">
        <h2 className="font-headline-md text-headline-md text-on-surface font-semibold mb-1">
          Account Executive Attainment Leaderboard
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          Current trailing quarter booked contract value and conversion percentage.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-whisper-blue text-on-surface-variant font-label-sm text-label-sm">
                <th className="py-3 px-4">Sales Representative</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4 text-center">Won Deals</th>
                <th className="py-3 px-4 text-right">Booked ARR</th>
                <th className="py-3 px-4 text-right">Conversion Efficacy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-body-sm text-on-surface">
              {aePerformance.map((ae) => (
                <tr key={ae.name} className="hover:bg-whisper-blue/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold">{ae.name}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{ae.role}</td>
                  <td className="py-3.5 px-4 text-center font-bold">{ae.wonDeals}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-primary">{ae.arr}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-badge-won-fg">{ae.winRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
