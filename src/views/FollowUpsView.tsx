import React, { useState } from 'react';
import { FollowUp } from '../types/crm';

interface FollowUpsViewProps {
  followUps: FollowUp[];
  onToggleDone: (id: string) => void;
  onOpenNewFollowUp: () => void;
}

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  followUps,
  onToggleDone,
  onOpenNewFollowUp,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = followUps.filter((f) => {
    const matchesStatus = filterStatus === 'all' || f.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      f.subject.toLowerCase().includes(search.toLowerCase()) ||
      f.target.toLowerCase().includes(search.toLowerCase()) ||
      f.assignee.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <span>Operational Cadence</span>
            <span>•</span>
            <span className="text-tertiary font-semibold">Calendar & Task Dispatch</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold mt-1">
            Follow-Up Tasks & Engagements
          </h1>
        </div>

        <button
          onClick={onOpenNewFollowUp}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-xs hover:bg-secondary transition-all cursor-pointer font-semibold self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-lg">calendar_add_on</span>
          <span>+ Schedule Follow-Up</span>
        </button>
      </div>

      {/* Filter strip */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-soft-slate-border flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
          {(['all', 'overdue', 'today', 'planned', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-outline">
            search
          </span>
          <input
            type="text"
            placeholder="Search follow-ups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-surface-container-low rounded-lg text-sm border border-soft-slate-border focus:outline-none focus:bg-surface-container-lowest"
          />
        </div>
      </div>

      {/* Task table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-soft-slate-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-whisper-blue text-on-surface-variant font-label-sm text-label-sm">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Subject & Purpose</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Activity Type</th>
                <th className="py-3 px-4">Assigned Rep</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-body-sm text-on-surface">
              {filtered.map((fu) => {
                const isCompleted = fu.status === 'Completed';
                const isOverdue = fu.status === 'Overdue';
                const isToday = fu.status === 'Today';

                return (
                  <tr key={fu.id} className="hover:bg-whisper-blue/50 transition-colors">
                    <td
                      className={`py-3.5 px-4 font-semibold whitespace-nowrap ${
                        isCompleted
                          ? 'line-through text-outline'
                          : isOverdue
                          ? 'text-badge-lost-fg'
                          : isToday
                          ? 'text-badge-pending-fg'
                          : 'text-on-surface'
                      }`}
                    >
                      {fu.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${isCompleted ? 'line-through text-outline' : ''}`}>
                        {fu.subject}
                      </span>
                      <span className="block text-xs text-on-surface-variant mt-0.5">{fu.subtext}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-on-surface">{fu.target}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-surface-container-low px-2 py-0.5 rounded text-xs font-medium text-on-surface-variant">
                        {fu.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant font-medium">{fu.assignee}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                          isCompleted
                            ? 'bg-badge-won-bg text-badge-won-fg'
                            : isOverdue
                            ? 'bg-badge-lost-bg text-badge-lost-fg'
                            : isToday
                            ? 'bg-badge-pending-bg text-badge-pending-fg'
                            : 'bg-badge-closed-bg text-badge-closed-fg'
                        }`}
                      >
                        {fu.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onToggleDone(fu.id)}
                        className={`p-1.5 rounded hover:bg-surface-container transition-colors cursor-pointer ${
                          isCompleted ? 'text-badge-won-fg font-bold' : 'text-on-surface-variant'
                        }`}
                        title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                      >
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-outline text-xs">
                    No follow-ups match current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
