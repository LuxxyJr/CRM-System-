import React, { useState } from 'react';
import { ActivityTimelineItem } from '../types/crm';

interface ActivitiesViewProps {
  timeline: ActivityTimelineItem[];
  onAddActivity: (activity: Partial<ActivityTimelineItem>) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  timeline,
  onAddActivity,
}) => {
  const [filterType, setFilterType] = useState('all');
  const [isLogging, setIsLogging] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [actType, setActType] = useState<'videocam' | 'mail' | 'handshake' | 'verified'>('videocam');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAddActivity({
      title,
      description: desc || 'Direct client engagement recorded.',
      type: actType,
      outcome: 'Outcome: Logged & Verified',
      outcomeType: 'positive',
      metadata: 'Host: Sarah Jenkins',
      timestamp: 'Just now',
    });
    setIsLogging(false);
    setTitle('');
    setDesc('');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <span>Engagement Stream</span>
            <span>•</span>
            <span className="text-tertiary font-semibold">Audit Synchronized</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold mt-1">
            Activity & Touchpoint Timeline
          </h1>
        </div>

        <button
          onClick={() => setIsLogging(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-xs hover:bg-secondary transition-all cursor-pointer font-semibold self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-lg">add_task</span>
          <span>+ Log Activity</span>
        </button>
      </div>

      {isLogging && (
        <form
          onSubmit={handleCreate}
          className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-soft-slate-border flex flex-col gap-space-md"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Log Real-Time Client Engagement
            </h3>
            <button
              type="button"
              onClick={() => setIsLogging(false)}
              className="p-1 rounded text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">Engagement Title *</label>
              <input
                required
                type="text"
                placeholder="e.g. Q4 Solution Architecture Alignment Call"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 px-3 bg-surface-container-low rounded-lg text-sm border border-soft-slate-border focus:outline-none focus:bg-surface-container-lowest"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">Channel / Medium</label>
              <select
                value={actType}
                onChange={(e) => setActType(e.target.value as any)}
                className="h-9 px-2 bg-surface-container-low rounded-lg text-xs border border-soft-slate-border cursor-pointer"
              >
                <option value="videocam">Video Conference / Remote Meeting</option>
                <option value="mail">Executive Email Correspondence</option>
                <option value="handshake">In-Person Briefing / Meeting</option>
                <option value="verified">System / Compliance Verification</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Summary Notes & Discussion</label>
            <textarea
              rows={2}
              placeholder="Key decisions, agreed action items, or SLA changes..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="p-3 bg-surface-container-low rounded-lg text-sm border border-soft-slate-border focus:outline-none focus:bg-surface-container-lowest resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsLogging(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-secondary"
            >
              Submit Activity
            </button>
          </div>
        </form>
      )}

      {/* Main Timeline Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-soft-slate-border flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            Chronological CRM Feed
          </span>
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
            {(['all', 'meetings', 'emails', 'briefings'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors cursor-pointer ${
                  filterType === t
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="relative pl-6 flex flex-col gap-space-lg before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
          {timeline.map((item) => (
            <div key={item.id} className="relative flex flex-col gap-1">
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-whisper-blue text-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-xs">{item.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  {item.title}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  {item.timestamp}
                </span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-lg flex flex-col gap-1.5 mt-0.5 border border-soft-slate-border/50">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-label-sm text-label-sm flex items-center gap-1 font-semibold ${
                      item.outcomeType === 'positive'
                        ? 'text-badge-won-fg'
                        : item.outcomeType === 'pending'
                        ? 'text-badge-pending-fg'
                        : 'text-primary'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.outcomeType === 'positive'
                          ? 'bg-badge-won-fg'
                          : item.outcomeType === 'pending'
                          ? 'bg-badge-pending-fg'
                          : 'bg-primary'
                      }`}
                    ></span>{' '}
                    {item.outcome}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {item.metadata}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
