import React, { useState } from 'react';
import { FollowUp, AuditActivity, CRMView } from '../types/crm';

interface DashboardViewProps {
  followUps: FollowUp[];
  onToggleFollowUpDone: (id: string) => void;
  auditActivities: AuditActivity[];
  onNavigate: (view: CRMView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  followUps,
  onToggleFollowUpDone,
  auditActivities,
  onNavigate,
}) => {
  const [timeRange, setTimeRange] = useState<'Today' | 'This Week' | 'This Month' | 'Custom Range'>('This Month');
  const [activeBarHover, setActiveBarHover] = useState<{ month: string; rev: number; conv: number } | null>(null);
  const [completedFollowUps, setCompletedFollowUps] = useState<Record<string, boolean>>({});

  const monthlyData = [
    { month: 'May', rev: 80, conv: 52 },
    { month: 'Jun', rev: 100, conv: 58 },
    { month: 'Jul', rev: 115, conv: 64 },
    { month: 'Aug', rev: 108, conv: 61 },
    { month: 'Sep', rev: 130, conv: 66 },
    { month: 'Oct', rev: 145, conv: 68.2 },
  ];

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      'Total Pipeline,$2,845,000\n' +
      'Active Customers,428\n' +
      'Total Leads,184\n' +
      'Active Opportunities,36\n' +
      'Won Deals,24\n' +
      'Win Rate,68%\n' +
      'Pending Follow-Ups,14\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Executive_Overview_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleDone = (id: string) => {
    setCompletedFollowUps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    onToggleFollowUpDone(id);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Page Title & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <span>Analytics Engine</span>
            <span>•</span>
            <span className="text-tertiary font-semibold">Real-time Sync</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1">
            Executive Overview
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="inline-flex bg-surface-container-low p-1 rounded-xl shadow-xs">
            {(['Today', 'This Week', 'This Month', 'Custom Range'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-whisper-blue text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg shadow-xs transition-all cursor-pointer border border-soft-slate-border"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 6 Top Metric Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
        {/* Total Pipeline */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-xs transition-all hover:shadow-md border border-soft-slate-border">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-whisper-blue rounded-full pointer-events-none opacity-60"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              Total Pipeline
            </span>
            <span className="p-1.5 rounded-lg bg-whisper-blue text-primary material-symbols-outlined text-base">
              payments
            </span>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              $2,845,000
            </div>
            <div className="flex items-center gap-1 mt-1 text-badge-won-fg font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12.4% vs last mo</span>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="relative overflow-hidden rounded-xl bg-whisper-blue/50 p-space-md shadow-xs transition-all hover:shadow-md border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              Customers
            </span>
            <span className="p-1.5 rounded-lg bg-secondary-container text-on-secondary-container material-symbols-outlined text-base">
              domain
            </span>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              428
            </div>
            <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>+18 new this month</span>
            </div>
          </div>
        </div>

        {/* Total Leads */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-xs transition-all hover:shadow-md border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              Total Leads
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container-high text-on-surface-variant material-symbols-outlined text-base">
              filter_alt
            </span>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              184
            </div>
            <div className="flex items-center gap-1 mt-1 text-primary font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>42 Open Leads</span>
            </div>
          </div>
        </div>

        {/* Opportunities */}
        <div className="relative overflow-hidden rounded-xl bg-tertiary-fixed/30 p-space-md shadow-xs transition-all hover:shadow-md border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-tertiary-fixed-variant">
              Opportunities
            </span>
            <span className="p-1.5 rounded-lg bg-tertiary-fixed text-tertiary material-symbols-outlined text-base">
              lightbulb
            </span>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              36
            </div>
            <div className="flex items-center gap-1 mt-1 text-on-tertiary-fixed-variant font-label-sm text-label-sm font-medium">
              <span>Weighted: $1,420,500</span>
            </div>
          </div>
        </div>

        {/* Won Deals */}
        <div className="relative overflow-hidden rounded-xl bg-badge-won-bg/60 p-space-md shadow-xs transition-all hover:shadow-md border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-badge-won-fg">
              Won Deals
            </span>
            <span className="p-1.5 rounded-lg bg-badge-won-bg text-badge-won-fg material-symbols-outlined text-base">
              verified
            </span>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              24
            </div>
            <div className="flex items-center gap-1 mt-1 text-badge-won-fg font-label-sm text-label-sm font-semibold">
              <span>Win Rate: 68%</span>
            </div>
          </div>
        </div>

        {/* Follow-Ups */}
        <div className="relative overflow-hidden rounded-xl bg-badge-pending-bg/60 p-space-md shadow-xs transition-all hover:shadow-md border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-badge-pending-fg">
              Follow-Ups
            </span>
            <span className="p-1.5 rounded-lg bg-badge-pending-bg text-badge-pending-fg material-symbols-outlined text-base">
              alarm
            </span>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              14
            </div>
            <div className="flex items-center gap-1 mt-1 text-badge-pending-fg font-label-sm text-label-sm font-semibold">
              <span>3 Due Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Pipeline Stages (7 cols) + Revenue Chart (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Opportunity Pipeline Stages */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between border border-soft-slate-border">
          <div>
            <div className="flex items-center justify-between mb-space-sm">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Pipeline Composition
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Opportunity Pipeline Stages
                </h2>
              </div>
              <span className="font-label-md text-label-md bg-surface-container-low px-2.5 py-1 rounded-full text-on-surface-variant font-medium">
                Total: $3.83M Active/Closed
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Real-time stage valuation and conversion velocity across high-touch enterprise accounts.
            </p>

            <div className="flex flex-col gap-space-md">
              {/* Qualification */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span>
                    Qualification
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                    $620,000 <span className="text-xs text-outline font-normal">(16.2%)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary-fixed-dim h-full rounded-full transition-all duration-500" style={{ width: '16.2%' }}></div>
                </div>
              </div>

              {/* Proposal & Solution Fit */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                    Proposal & Solution Fit
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                    $840,000 <span className="text-xs text-outline font-normal">(21.9%)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary-fixed-dim h-full rounded-full transition-all duration-500" style={{ width: '21.9%' }}></div>
                </div>
              </div>

              {/* Negotiation & Legal */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary-fixed-dim"></span>
                    Negotiation & Legal
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                    $980,000 <span className="text-xs text-outline font-normal">(25.6%)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary-fixed-dim h-full rounded-full transition-all duration-500" style={{ width: '25.6%' }}></div>
                </div>
              </div>

              {/* Won (Signed) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-badge-won-bg"></span>
                    Won (Signed)
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                    $1,200,000 <span className="text-xs text-outline font-normal">(31.3%)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-badge-won-fg/60 h-full rounded-full transition-all duration-500" style={{ width: '31.3%' }}></div>
                </div>
              </div>

              {/* Lost */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-badge-lost-bg"></span>
                    Lost
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                    $190,000 <span className="text-xs text-outline font-normal">(5.0%)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-badge-lost-fg/40 h-full rounded-full transition-all duration-500" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-space-md pt-space-sm flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-whisper-blue/50 p-space-sm rounded-lg border border-soft-slate-border">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">info</span>
              Weighted Pipeline Realization: <strong className="ml-1 text-on-surface">72.4%</strong>
            </span>
            <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Updated 4m ago</span>
          </div>
        </div>

        {/* Monthly Revenue & Conversion */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between border border-soft-slate-border">
          <div>
            <div className="flex items-center justify-between mb-space-xs">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Performance Vector
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Monthly Revenue & Conversion
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-xs bg-primary"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Rev ($k)</span>
                <span className="inline-block w-2.5 h-0.5 bg-tertiary"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Conv %</span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Trailing 6-month booked revenue paired with conversion efficacy.
            </p>

            {/* Interactive SVG Chart */}
            <div className="w-full h-52 flex items-end relative">
              {activeBarHover && (
                <div className="absolute top-1 right-2 bg-inverse-surface text-inverse-on-surface text-xs rounded-md px-2 py-1 shadow-md z-10 flex gap-2">
                  <span>{activeBarHover.month}:</span>
                  <span className="font-bold">${activeBarHover.rev}k</span>
                  <span className="text-secondary-fixed">({activeBarHover.conv}%)</span>
                </div>
              )}

              <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 420 180">
                <defs>
                  <linearGradient id="revenueBarGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4c5b71" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#4c5b71" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference grid lines */}
                <line stroke="#e6e8ea" strokeDasharray="3 3" strokeWidth="1" x1="20" x2="400" y1="30" y2="30" />
                <line stroke="#e6e8ea" strokeDasharray="3 3" strokeWidth="1" x1="20" x2="400" y1="80" y2="80" />
                <line stroke="#e6e8ea" strokeDasharray="3 3" strokeWidth="1" x1="20" x2="400" y1="130" y2="130" />
                <line stroke="#c4c6cd" strokeWidth="1" x1="20" x2="400" y1="170" y2="170" />

                {/* Bars */}
                {monthlyData.map((d, i) => {
                  const xPositions = [42, 106, 170, 234, 298, 362];
                  const barHeights = [80, 100, 115, 108, 130, 145];
                  const y = 170 - barHeights[i];
                  return (
                    <rect
                      key={d.month}
                      fill="url(#revenueBarGrad)"
                      height={barHeights[i]}
                      rx="3"
                      width="24"
                      x={xPositions[i]}
                      y={y}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onMouseEnter={() => setActiveBarHover(d)}
                      onMouseLeave={() => setActiveBarHover(null)}
                    />
                  );
                })}

                {/* Conversion Polyline */}
                <path
                  d="M54 110 L 118 90 L 182 65 L 246 72 L 310 45 L 374 30"
                  fill="none"
                  stroke="#454fb8"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />

                {/* Data Points */}
                {[
                  { cx: 54, cy: 110 },
                  { cx: 118, cy: 90 },
                  { cx: 182, cy: 65 },
                  { cx: 246, cy: 72 },
                  { cx: 310, cy: 45 },
                  { cx: 374, cy: 30 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    fill="#fcf9ff"
                    r="3.5"
                    stroke="#454fb8"
                    strokeWidth="2"
                    className="cursor-pointer"
                  />
                ))}
              </svg>
            </div>

            <div className="flex justify-between px-3 mt-2 text-on-surface-variant font-label-sm text-label-sm font-medium">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>

          <div className="mt-space-md pt-space-xs grid grid-cols-2 gap-2 text-center">
            <div className="bg-surface-container-low p-2 rounded-lg">
              <span className="block font-label-sm text-label-sm text-on-surface-variant">Avg Deal Size</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">$118,500</span>
            </div>
            <div className="bg-surface-container-low p-2 rounded-lg">
              <span className="block font-label-sm text-label-sm text-on-surface-variant">Peak Conversion</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">68.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming & Overdue Follow-Ups + Recent Audit Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Task Action Center */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-soft-slate-border">
          <div className="flex items-center justify-between mb-space-md">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Task Action Center
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Upcoming & Overdue Follow-Ups
              </h2>
            </div>
            <button
              onClick={() => onNavigate('follow-ups')}
              className="text-primary hover:text-tertiary font-label-md text-label-md flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View Calendar</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-whisper-blue text-on-surface-variant font-label-sm text-label-sm">
                  <th className="py-2.5 px-3 rounded-l-lg">Date</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Lead / Customer</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface">
                {followUps.slice(0, 5).map((fu) => {
                  const isDone = completedFollowUps[fu.id];
                  const isOverdue = fu.status === 'Overdue';
                  const isToday = fu.status === 'Today';

                  return (
                    <tr key={fu.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td
                        className={`py-3 px-3 font-medium whitespace-nowrap ${
                          isDone
                            ? 'line-through text-outline'
                            : isOverdue
                            ? 'text-badge-lost-fg'
                            : isToday
                            ? 'text-badge-pending-fg'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        {fu.date}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-medium ${isDone ? 'line-through text-outline' : ''}`}>
                          {fu.subject}
                        </span>
                        <span className="block text-on-surface-variant font-body-sm text-body-sm">
                          {fu.subtext}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-on-surface">{fu.target}</td>
                      <td className="py-3 px-3">
                        {isDone ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-badge-won-bg text-badge-won-fg font-label-sm text-label-sm">
                            Done
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-badge-lost-bg text-badge-lost-fg font-label-sm text-label-sm">
                            Overdue
                          </span>
                        ) : isToday ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-badge-pending-bg text-badge-pending-fg font-label-sm text-label-sm">
                            Today
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-badge-closed-bg text-badge-closed-fg font-label-sm text-label-sm">
                            Planned
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => toggleDone(fu.id)}
                          className={`p-1 rounded hover:bg-surface-container transition-colors cursor-pointer ${
                            isDone ? 'text-badge-won-fg' : 'text-on-surface-variant'
                          }`}
                          title={isDone ? 'Mark Incomplete' : 'Mark Done'}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Operations Audit */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-soft-slate-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Security & Operations
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Recent Audit Activities
                </h2>
              </div>
              <span className="material-symbols-outlined text-outline">history</span>
            </div>

            <div className="flex flex-col gap-space-sm">
              {auditActivities.slice(0, 4).map((audit) => {
                let badgeClass = 'bg-surface-container-low text-on-surface';
                let iconClass = 'bg-secondary-container text-on-secondary-container';
                let iconName = 'edit';

                if (audit.tag === 'Closed Won') {
                  badgeClass = 'bg-badge-won-bg text-badge-won-fg';
                  iconClass = 'bg-badge-won-bg text-badge-won-fg';
                  iconName = 'verified';
                } else if (audit.tag === 'Lead Enrichment') {
                  iconClass = 'bg-whisper-blue text-primary';
                  iconName = 'person_add';
                } else if (audit.tag === 'RBAC Policy') {
                  iconClass = 'bg-tertiary-fixed text-tertiary';
                  iconName = 'security';
                }

                return (
                  <div
                    key={audit.id}
                    className="flex items-start gap-space-sm p-space-sm rounded-lg hover:bg-surface-container-low transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-full ${iconClass} flex items-center justify-center shrink-0`}
                    >
                      <span className="material-symbols-outlined text-base">{iconName}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                          {audit.user}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {audit.timeAgo}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {audit.description}
                      </p>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded font-label-sm text-label-sm ${badgeClass}`}>
                          {audit.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-space-sm pt-space-xs text-center border-t border-surface-container">
            <button
              onClick={() => onNavigate('audit-log')}
              className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <span>View Full Audit Trail</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
