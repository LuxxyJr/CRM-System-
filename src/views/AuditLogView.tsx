import React, { useState } from 'react';
import { AuditActivity } from '../types/crm';

interface AuditLogViewProps {
  auditActivities: AuditActivity[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ auditActivities }) => {
  const [filterTag, setFilterTag] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = auditActivities.filter((a) => {
    const matchesTag = filterTag === 'all' || a.tag.toLowerCase() === filterTag.toLowerCase();
    const matchesSearch =
      a.user.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.tag.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const exportAuditCSV = () => {
    const headers = 'ID,User,Timestamp,TimeAgo,Tag,Description\n';
    const rows = auditActivities
      .map((a) => `"${a.id}","${a.user}","${a.timestamp}","${a.timeAgo}","${a.tag}","${a.description}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AcxiomCRM_AuditLog_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <span>Security & Operations</span>
            <span>•</span>
            <span className="text-primary font-semibold">SOC-2 & Sec 17.6 Compliance Audit Trail</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold mt-1">
            System Audit Log
          </h1>
        </div>

        <button
          onClick={exportAuditCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-lowest text-on-surface font-label-lg text-label-lg rounded-lg shadow-xs hover:bg-whisper-blue transition-all cursor-pointer border border-soft-slate-border font-medium self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-lg">file_download</span>
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-soft-slate-border flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center bg-surface-container-low p-1 rounded-lg overflow-x-auto">
          {(['all', 'Deal Mod', 'Closed Won', 'Lead Enrichment', 'RBAC Policy', 'Lead Conversion'] as const).map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterTag === tag
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tag}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-outline">
            search
          </span>
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-surface-container-low rounded-lg text-sm border border-soft-slate-border focus:outline-none focus:bg-surface-container-lowest"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-soft-slate-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-whisper-blue text-on-surface-variant font-label-sm text-label-sm">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator / Principal</th>
                <th className="py-3 px-4">Operation Category</th>
                <th className="py-3 px-4">Detailed Change Description</th>
                <th className="py-3 px-4 text-right">Relative Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-body-sm text-on-surface">
              {filtered.map((log) => {
                let badgeClass = 'bg-surface-container-low text-on-surface';
                if (log.tag === 'Closed Won') badgeClass = 'bg-badge-won-bg text-badge-won-fg';
                if (log.tag === 'Lead Enrichment') badgeClass = 'bg-whisper-blue text-primary';
                if (log.tag === 'RBAC Policy') badgeClass = 'bg-tertiary-fixed text-tertiary font-bold';
                if (log.tag === 'Lead Conversion') badgeClass = 'bg-secondary-fixed text-on-secondary-fixed';

                return (
                  <tr key={log.id} className="hover:bg-whisper-blue/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-outline whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-primary">person</span>
                      <span>{log.user}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${badgeClass}`}>
                        {log.tag}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant max-w-md">
                      {log.description}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-xs text-outline whitespace-nowrap">
                      {log.timeAgo}
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-outline text-xs">
                    No audit records matching query.
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
