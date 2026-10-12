import React, { useState } from 'react';
import { Opportunity } from '../types/crm';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  onUpdateOpportunityStage: (id: string, stage: Opportunity['stage']) => void;
  onOpenNewOpportunity: () => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  onUpdateOpportunityStage,
  onOpenNewOpportunity,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchFilter, setSearchFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('All Owners');
  const [stageFilter, setStageFilter] = useState('All Active Stages');
  const [showGuardrail, setShowGuardrail] = useState(true);

  const STAGES: {
    key: Opportunity['stage'];
    num: string;
    label: string;
    headerBg: string;
    textColor: string;
    countLabel: string;
    avgProb: string;
  }[] = [
    {
      key: 'Qualification',
      num: '1',
      label: 'Qualification',
      headerBg: 'bg-whisper-blue',
      textColor: 'text-primary',
      countLabel: '8 Deals',
      avgProb: 'Avg 20%',
    },
    {
      key: 'Proposal',
      num: '2',
      label: 'Proposal',
      headerBg: 'bg-secondary-container/40',
      textColor: 'text-primary',
      countLabel: '10 Deals',
      avgProb: 'Avg 50%',
    },
    {
      key: 'Negotiation',
      num: '3',
      label: 'Negotiation',
      headerBg: 'bg-tertiary-fixed/40',
      textColor: 'text-tertiary',
      countLabel: '9 Deals',
      avgProb: 'Avg 80%',
    },
    {
      key: 'Closed Won',
      num: '4',
      label: 'Closed Won',
      headerBg: 'bg-muted-sage',
      textColor: 'text-badge-won-fg',
      countLabel: '14 Deals',
      avgProb: '100% Realized',
    },
    {
      key: 'Closed Lost',
      num: '5',
      label: 'Closed Lost',
      headerBg: 'bg-badge-lost-bg/70',
      textColor: 'text-badge-lost-fg',
      countLabel: '4 Deals',
      avgProb: '0% Value',
    },
  ];

  // Dynamic calculations based on opportunities array
  const filteredOpps = opportunities.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      o.company.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesOwner =
      ownerFilter === 'All Owners' || o.owner.toLowerCase().includes(ownerFilter.toLowerCase());
    const matchesStage =
      stageFilter === 'All Active Stages' || o.stage.toLowerCase() === stageFilter.toLowerCase();
    return matchesSearch && matchesOwner && matchesStage;
  });

  const totalValue = opportunities.reduce((acc, o) => acc + o.amount, 0);
  const weightedTotal = opportunities.reduce((acc, o) => acc + (o.amount * o.probability) / 100, 0);
  const avgDealSize = Math.round(totalValue / (opportunities.length || 1));
  const activeCount = opportunities.filter((o) => o.stage !== 'Closed Lost').length;

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Header & Controls */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">
              Section 4.8 • Revenue Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Live Synced</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
            Opportunity Pipeline
          </h1>
        </div>

        {/* Actions & Toolbar */}
        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Kanban / List View Toggle */}
          <div className="bg-surface-container-low p-1 rounded-lg flex items-center shadow-xs border border-soft-slate-border">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">view_kanban</span>
              <span>Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">view_list</span>
              <span>List View</span>
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="relative flex items-center min-w-[200px] bg-surface-container-lowest rounded-lg shadow-xs border border-soft-slate-border">
            <span className="material-symbols-outlined absolute left-3 text-outline text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Filter deal or client..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-body-sm font-body-sm text-on-surface bg-transparent focus:outline-none placeholder:text-outline"
            />
          </div>

          {/* Owner Filter */}
          <div className="relative">
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md pl-3 pr-8 py-2 rounded-lg shadow-xs focus:outline-none cursor-pointer border border-soft-slate-border"
            >
              <option value="All Owners">All Owners</option>
              <option value="Sarah Jenkins">Sarah Jenkins</option>
              <option value="David Miller">David Miller</option>
              <option value="Elena Rostova">Elena Rostova</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">
              arrow_drop_down
            </span>
          </div>

          {/* Stage Filter */}
          <div className="relative">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md pl-3 pr-8 py-2 rounded-lg shadow-xs focus:outline-none cursor-pointer border border-soft-slate-border"
            >
              <option value="All Active Stages">All Active Stages</option>
              <option value="Qualification">Qualification</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base">
              arrow_drop_down
            </span>
          </div>

          {/* New Opportunity CTA */}
          <button
            onClick={onOpenNewOpportunity}
            className="flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md px-3.5 py-2 rounded-lg shadow-xs hover:bg-secondary transition-all cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>New Opportunity</span>
          </button>
        </div>
      </header>

      {/* Top Pipeline Metric Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Total Value */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs relative overflow-hidden flex flex-col justify-between border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Total Value
            </span>
            <span className="material-symbols-outlined text-primary text-lg">
              account_balance_wallet
            </span>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-lg text-headline-lg text-on-surface font-semibold">
              ${totalValue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1 font-semibold">
              <span className="material-symbols-outlined text-xs text-badge-won-fg">trending_up</span>
              <span className="font-body-sm text-body-sm text-badge-won-fg">+14.2%</span>
              <span className="font-body-sm text-body-sm text-outline font-normal">vs prior month</span>
            </div>
          </div>
        </div>

        {/* Weighted Pipeline */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs relative overflow-hidden flex flex-col justify-between border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Weighted Pipeline
              </span>
              <span
                className="material-symbols-outlined text-xs text-outline cursor-help"
                title="Calculated as (Amount × Probability / 100)"
              >
                help_outline
              </span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-lg">calculate</span>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-lg text-headline-lg text-on-surface font-semibold">
              ${Math.round(weightedTotal).toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 font-medium">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {((weightedTotal / (totalValue || 1)) * 100).toFixed(1)}% realized weight
              </span>
            </div>
          </div>
        </div>

        {/* Average Deal Size */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs relative overflow-hidden flex flex-col justify-between border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Average Deal Size
            </span>
            <span className="material-symbols-outlined text-secondary text-lg">
              stacked_line_chart
            </span>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-lg text-headline-lg text-on-surface font-semibold">
              ${avgDealSize.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-body-sm text-body-sm text-outline">Baseline target: $65,000</span>
            </div>
          </div>
        </div>

        {/* Active Deals */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs relative overflow-hidden flex flex-col justify-between border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Active Deals
            </span>
            <span className="material-symbols-outlined text-primary text-lg">domain_verification</span>
          </div>
          <div className="mt-space-sm">
            <div className="font-headline-lg text-headline-lg text-on-surface font-semibold">
              {activeCount}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-badge-won-fg"></span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                27 on-track, 9 require touch
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Kanban Board vs List View */}
      {viewMode === 'kanban' ? (
        <section className="w-full overflow-x-auto pb-4">
          <div className="grid grid-cols-5 gap-space-md min-w-[1240px]">
            {STAGES.map((stage) => {
              const stageDeals = filteredOpps.filter((o) => o.stage === stage.key);
              const stageValue = stageDeals.reduce((sum, d) => sum + d.amount, 0);

              return (
                <div
                  key={stage.key}
                  className="flex flex-col gap-space-sm bg-surface-container-low p-2.5 rounded-xl border border-soft-slate-border/50 min-h-[500px]"
                >
                  {/* Column Header */}
                  <div className={`${stage.headerBg} p-3 rounded-lg shadow-xs flex flex-col gap-1 border border-soft-slate-border/40`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-label-md text-label-md ${stage.textColor} font-semibold`}>
                        {stage.num}. {stage.label}
                      </span>
                      <span className={`bg-surface-container-lowest ${stage.textColor} font-label-sm text-label-sm px-2 py-0.5 rounded-full shadow-xs font-semibold`}>
                        {stageDeals.length} Deals
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        ${stageValue.toLocaleString()}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {stage.avgProb}
                      </span>
                    </div>
                  </div>

                  {/* Deals Cards in this stage */}
                  <div className="flex flex-col gap-space-sm">
                    {stageDeals.map((opp) => {
                      const weightedVal = Math.round((opp.amount * opp.probability) / 100);
                      const isLost = opp.stage === 'Closed Lost';
                      const isWon = opp.stage === 'Closed Won';

                      return (
                        <article
                          key={opp.id}
                          className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs hover:shadow-md transition-shadow flex flex-col gap-2.5 border border-soft-slate-border cursor-grab group relative"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                              {opp.category}
                            </span>
                            {opp.ruleVerified && (
                              <span className="inline-flex items-center gap-1 text-xs text-badge-won-fg font-medium">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                <span>Rule Verified</span>
                              </span>
                            )}
                            {opp.statusNote === 'Final Review' && (
                              <span className="inline-flex items-center gap-0.5 text-xs text-badge-pending-fg font-medium">
                                <span className="material-symbols-outlined text-sm">hourglass_top</span>
                                <span>Final Review</span>
                              </span>
                            )}
                            {opp.priorityHigh && (
                              <span
                                className="material-symbols-outlined text-badge-pending-fg text-sm"
                                title="Action pending"
                              >
                                priority_high
                              </span>
                            )}
                            {isLost && (
                              <span className="material-symbols-outlined text-badge-lost-fg text-sm">
                                cancel
                              </span>
                            )}
                            {isWon && (
                              <span className="material-symbols-outlined text-badge-won-fg text-sm">
                                verified_user
                              </span>
                            )}
                          </div>

                          <div>
                            <h3
                              className={`font-headline-sm text-headline-sm text-on-surface font-semibold leading-snug ${
                                isLost ? 'line-through text-outline' : ''
                              }`}
                            >
                              {opp.title}
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {opp.company}
                            </p>
                          </div>

                          <div className="flex items-baseline justify-between pt-1">
                            <span
                              className={`font-headline-md text-headline-md font-semibold ${
                                isLost ? 'text-outline' : 'text-on-surface'
                              }`}
                            >
                              ${opp.amount.toLocaleString()}
                            </span>
                            <span
                              className={`inline-flex items-center font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold ${
                                isWon
                                  ? 'bg-badge-won-bg text-badge-won-fg'
                                  : isLost
                                  ? 'bg-badge-lost-bg text-badge-lost-fg'
                                  : 'bg-badge-pending-bg text-badge-pending-fg'
                              }`}
                            >
                              {isWon ? '100% Won' : `${opp.probability}% Probability`}
                            </span>
                          </div>

                          <div
                            className={`px-2 py-1.5 rounded-lg flex items-center justify-between font-body-sm text-body-sm ${
                              isWon
                                ? 'bg-muted-sage/50'
                                : 'bg-surface-container-low'
                            }`}
                          >
                            <span className="text-on-surface-variant">
                              {isLost ? 'Loss Reason:' : isWon ? 'Closed Total:' : 'Weighted:'}
                            </span>
                            <span
                              className={`font-semibold ${
                                isLost
                                  ? 'text-badge-lost-fg'
                                  : isWon
                                  ? 'text-badge-won-fg'
                                  : 'text-primary'
                              }`}
                            >
                              {isLost ? opp.lossReason || 'Budget Freeze' : `$${weightedVal.toLocaleString()}`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1.5 text-on-surface-variant">
                              <span className="material-symbols-outlined text-sm text-primary">event</span>
                              <span
                                className={`font-label-sm text-label-sm font-medium ${
                                  opp.expectedCloseDays <= 7 ? 'text-badge-won-fg' : 'text-on-surface'
                                }`}
                              >
                                {isWon
                                  ? opp.statusNote || 'Executed Yesterday'
                                  : isLost
                                  ? 'Terminated 12d ago'
                                  : `In ${opp.expectedCloseDays} days`}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {opp.ownerAvatar ? (
                                <img
                                  alt={opp.owner}
                                  className="w-6 h-6 rounded-full object-cover shadow-xs"
                                  src={opp.ownerAvatar}
                                  onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm font-bold text-[10px]">
                                  {opp.ownerInitials || opp.owner.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick stage mover controls on hover */}
                          <div className="pt-2 border-t border-surface-container flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-outline uppercase font-bold">Stage</span>
                            <select
                              value={opp.stage}
                              onChange={(e) =>
                                onUpdateOpportunityStage(opp.id, e.target.value as Opportunity['stage'])
                              }
                              className="text-xs font-semibold bg-surface-container-low px-2 py-0.5 rounded cursor-pointer border border-soft-slate-border"
                            >
                              <option value="Qualification">Qualification</option>
                              <option value="Proposal">Proposal</option>
                              <option value="Negotiation">Negotiation</option>
                              <option value="Closed Won">Closed Won</option>
                              <option value="Closed Lost">Closed Lost</option>
                            </select>
                          </div>
                        </article>
                      );
                    })}

                    {stageDeals.length === 0 && (
                      <div className="p-6 border border-dashed border-outline-variant/60 rounded-xl text-center text-xs text-outline">
                        No deals in this stage.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        /* List View */
        <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border border-soft-slate-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-whisper-blue text-on-surface-variant font-label-sm text-label-sm tracking-wider">
                  <th className="py-3 px-4">Deal Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Probability</th>
                  <th className="py-3 px-4 text-right">Weighted Val</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-body-sm font-body-sm text-on-surface">
                {filteredOpps.map((opp) => (
                  <tr key={opp.id} className="hover:bg-whisper-blue/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-on-surface">{opp.title}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{opp.company}</td>
                    <td className="py-3 px-4 text-outline text-xs">{opp.category}</td>
                    <td className="py-3 px-4 text-right font-medium text-on-surface">
                      ${opp.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-xs">{opp.probability}%</span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-primary">
                      ${Math.round((opp.amount * opp.probability) / 100).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={opp.stage}
                        onChange={(e) =>
                          onUpdateOpportunityStage(opp.id, e.target.value as Opportunity['stage'])
                        }
                        className="text-xs font-semibold bg-surface-container-low px-2 py-1 rounded cursor-pointer border border-soft-slate-border"
                      >
                        <option value="Qualification">Qualification</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">{opp.owner}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          onUpdateOpportunityStage(
                            opp.id,
                            opp.stage === 'Closed Won' ? 'Qualification' : 'Closed Won'
                          )
                        }
                        className="p-1 rounded hover:bg-surface-container text-primary cursor-pointer"
                        title={opp.stage === 'Closed Won' ? 'Reopen' : 'Mark Won'}
                      >
                        <span className="material-symbols-outlined text-base">
                          {opp.stage === 'Closed Won' ? 'restart_alt' : 'verified'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Floating Business Validation Guardrail Strip (Sections 17.7 & 17.12) */}
      {showGuardrail && (
        <aside className="sticky bottom-4 z-30 w-full">
          <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-space-md shadow-md flex flex-col md:flex-row md:items-center justify-between gap-space-sm border border-soft-slate-border">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary text-lg">shield</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Validation Guardrails Active
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-badge-won-fg"></span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Amount &gt; $0 enforced • Probability 0–100% • Close Date ≥ Today • Weighted Pipeline
                  auto-calculates on stage transit
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-md shrink-0 self-end md:self-auto">
              <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-surface-container-low rounded-lg font-label-sm text-label-sm text-outline border border-soft-slate-border/50">
                <span>Formula:</span>
                <code className="text-tertiary font-mono font-bold">Amount × (Prob ÷ 100)</code>
              </div>
              <button
                onClick={() => setShowGuardrail(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
                title="Dismiss banner"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
