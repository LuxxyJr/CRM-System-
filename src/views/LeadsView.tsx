import React, { useState } from 'react';
import { Lead } from '../types/crm';

interface LeadsViewProps {
  leads: Lead[];
  onConvertLead: (leadId: string, oppAmount: number, closeDate: string, companyMasterName: string) => void;
  onOpenNewLead: () => void;
  onScheduleFollowUp: (leadName: string, company: string) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onConvertLead,
  onOpenNewLead,
  onScheduleFollowUp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [execFilter, setExecFilter] = useState('');
  const [selectedLeadIds, setSelectedLeadIds] = useState<Record<string, boolean>>({
    'lead-1': true, // Elena Rostova checked initially as in screenshot
  });

  // Selected lead for conversion drawer
  const [activeConvertLeadId, setActiveConvertLeadId] = useState<string | null>('lead-1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Convert form state
  const [companyMaster, setCompanyMaster] = useState('CyberNetics Global Enterprise LLC');
  const [oppAmount, setOppAmount] = useState('145000');
  const [oppStage, setOppStage] = useState('poc');
  const [closeDate, setCloseDate] = useState('2024-11-30');
  const [isConverting, setIsConverting] = useState(false);
  const [convertSuccessMessage, setConvertSuccessMessage] = useState<string | null>(null);

  // Active lead record
  const currentLead = leads.find((l) => l.id === activeConvertLeadId) || leads[0];

  const handleSelectLeadForConvert = (lead: Lead) => {
    setActiveConvertLeadId(lead.id);
    setCompanyMaster(`${lead.company} Global Enterprise LLC`);
    setOppAmount(lead.expValue.toString());
    setIsDrawerOpen(true);
    setConvertSuccessMessage(null);
  };

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const all: Record<string, boolean> = {};
      leads.forEach((l) => (all[l.id] = true));
      setSelectedLeadIds(all);
    } else {
      setSelectedLeadIds({});
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedLeadIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || l.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSource = !sourceFilter || l.source.toLowerCase() === sourceFilter.toLowerCase();
    const matchesExec = !execFilter || l.assignedTo.toLowerCase().includes(execFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesSource && matchesExec;
  });

  // KPI Calculations
  const totalCount = leads.length;
  const newCount = leads.filter((l) => l.status === 'New').length;
  const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
  const qualifiedCount = leads.filter((l) => l.status === 'Qualified').length;
  const convertedCount = leads.filter((l) => l.status === 'Converted').length;
  const lostCount = leads.filter((l) => l.status === 'Lost').length;

  // Amount & Date Validations
  const amountVal = parseFloat(oppAmount);
  const isAmountValid = !isNaN(amountVal) && amountVal > 0;
  const isDateValid = Boolean(closeDate && closeDate.trim().length > 0);
  const canConvert = isAmountValid && isDateValid && !isConverting;

  const handleConfirmConvert = () => {
    if (!canConvert || !currentLead) return;
    setIsConverting(true);
    setConvertSuccessMessage('Processing Customer Master record creation and linking opportunity...');
    setTimeout(() => {
      onConvertLead(currentLead.id, amountVal, closeDate, companyMaster);
      setIsConverting(false);
      setConvertSuccessMessage('Converted successfully! Customer master and linked opportunity generated.');
      setTimeout(() => {
        setIsDrawerOpen(false);
        setConvertSuccessMessage(null);
      }, 1500);
    }, 1200);
  };

  const exportLeadsCSV = () => {
    const headers = 'Code,Name,Company,Email,Phone,Source,ExpValue,Priority,Status,AssignedTo\n';
    const rows = leads
      .map(
        (l) =>
          `"${l.code}","${l.name}","${l.company}","${l.email}","${l.phone}","${l.source}",${l.expValue},"${l.priority}","${l.status}","${l.assignedTo}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
            <span>CRM Operational Suite</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span>Pipeline & Acquisition</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary font-semibold">Lead Management</span>
          </nav>
          <div className="flex items-center gap-space-sm mt-0.5">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold">
              Lead Management
            </h1>
            <span className="font-label-sm text-label-sm bg-whisper-blue text-primary px-2.5 py-0.5 rounded-full font-medium">
              v4.5 / Audit Sync Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <button
            onClick={exportLeadsCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-lowest text-secondary font-label-lg text-label-lg rounded-lg shadow-xs hover:bg-whisper-blue transition-all cursor-pointer border border-soft-slate-border"
          >
            <span className="material-symbols-outlined text-lg">file_download</span>
            <span>Export Leads</span>
          </button>
          <button
            onClick={onOpenNewLead}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-xs hover:bg-secondary transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            <span>+ Capture Lead</span>
          </button>
        </div>
      </div>

      {/* Lead Lifecycle Summary KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm">
        {/* Total Leads */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Total Leads
            </span>
            <span className="material-symbols-outlined text-base text-primary">groups</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">{totalCount}</span>
            <span className="font-label-sm text-label-sm text-badge-won-fg font-semibold">+12.4%</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full w-full rounded-full"></div>
          </div>
        </div>

        {/* New */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">New</span>
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">{newCount}</span>
            <span className="font-label-sm text-label-sm text-badge-pending-fg font-semibold">Needs Triage</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-tertiary h-full w-[17%] rounded-full"></div>
          </div>
        </div>

        {/* Contacted */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Contacted</span>
            <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">{contactedCount}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Active Cadence</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary-container h-full w-[31%] rounded-full"></div>
          </div>
        </div>

        {/* Qualified */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Qualified</span>
            <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">{qualifiedCount}</span>
            <span className="font-label-sm text-label-sm text-badge-won-fg font-semibold">High Intent</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-secondary-fixed-dim h-full w-[35%] rounded-full"></div>
          </div>
        </div>

        {/* Converted */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Converted</span>
            <span className="material-symbols-outlined text-base text-badge-won-fg">check_circle</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">{convertedCount}</span>
            <span className="font-label-sm text-label-sm text-badge-won-fg font-semibold">Won Cycle</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-badge-won-fg h-full w-[12%] rounded-full"></div>
          </div>
        </div>

        {/* Lost */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-soft-slate-border">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Lost</span>
            <span className="material-symbols-outlined text-base text-badge-lost-fg">cancel</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">{lostCount}</span>
            <span className="font-label-sm text-label-sm text-badge-lost-fg font-semibold">Disqualified</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-badge-lost-fg h-full w-[5%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Advanced Filter & Control Toolbar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border border-soft-slate-border">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-space-sm">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-outline">search</span>
            <input
              type="text"
              placeholder="Search by Lead Name, Company, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-none focus:bg-surface-container-lowest transition-all border border-soft-slate-border"
            />
          </div>
          <div className="flex items-center gap-space-xs w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-lg focus:outline-none cursor-pointer border border-soft-slate-border"
            >
              <option value="">Status: All Active</option>
              <option value="new">New ({newCount})</option>
              <option value="contacted">Contacted ({contactedCount})</option>
              <option value="qualified">Qualified ({qualifiedCount})</option>
              <option value="converted">Converted ({convertedCount})</option>
              <option value="lost">Lost ({lostCount})</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-10 px-3 bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-lg focus:outline-none cursor-pointer border border-soft-slate-border"
            >
              <option value="">Source: All Sources</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn Direct</option>
              <option value="trade show">Trade Show 2024</option>
            </select>
            <select
              value={execFilter}
              onChange={(e) => setExecFilter(e.target.value)}
              className="h-10 px-3 bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-lg focus:outline-none cursor-pointer hidden xl:block border border-soft-slate-border"
            >
              <option value="">Assigned Exec: Everyone</option>
              <option value="jenkins">Sarah Jenkins</option>
              <option value="mercer">Alex Mercer</option>
              <option value="kalu">David Kalu</option>
              <option value="zane">Rachel Zane</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-space-sm justify-between sm:justify-end">
          <label className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm bg-whisper-blue px-3 py-2 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              id="bulkSelectAll"
              onChange={handleToggleSelectAll}
              checked={leads.length > 0 && Object.keys(selectedLeadIds).length === leads.length}
              className="rounded w-4 h-4 cursor-pointer accent-primary"
            />
            <span>Select All ({totalCount})</span>
          </label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => alert(`Mass email dispatch queued for ${Object.keys(selectedLeadIds).length || 1} leads.`)}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
              title="Mass Email Dispatch"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </button>
            <button
              onClick={() => alert('Lead reassign modal: Select new owner for checked records.')}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
              title="Reassign Owner"
            >
              <span className="material-symbols-outlined text-lg">assignment_ind</span>
            </button>
            <button
              onClick={() => alert('Layout options: Default tabular grid')}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
              title="Column Layout"
            >
              <span className="material-symbols-outlined text-lg">view_column</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Layout with Drawer Integration */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Table Column (8 cols when preview active, or full 12 if drawer closed) */}
        <div
          className={`${
            isDrawerOpen ? 'xl:col-span-8' : 'xl:col-span-12'
          } bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col border border-soft-slate-border`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-whisper-blue text-on-surface-variant font-label-sm text-label-sm tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleToggleSelectAll}
                      checked={leads.length > 0 && Object.keys(selectedLeadIds).length === leads.length}
                      className="w-4 h-4 rounded cursor-pointer accent-primary"
                    />
                  </th>
                  <th className="py-3 px-4">Lead Code & Name</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-right">Exp. Value</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-body-sm font-body-sm text-on-surface">
                {filteredLeads.map((lead) => {
                  const isRowSelected = selectedLeadIds[lead.id];
                  const isActiveForDrawer = activeConvertLeadId === lead.id && isDrawerOpen;

                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors ${
                        isActiveForDrawer
                          ? 'bg-secondary-container/20 hover:bg-whisper-blue/60'
                          : 'hover:bg-whisper-blue/40'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={Boolean(isRowSelected)}
                          onChange={() => handleToggleRow(lead.id)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className="flex flex-col cursor-pointer"
                          onClick={() => handleSelectLeadForConvert(lead)}
                        >
                          <span className="font-label-md text-label-md text-on-surface font-semibold hover:text-tertiary">
                            {lead.name}
                          </span>
                          <span className="font-label-sm text-label-sm text-outline font-mono">
                            {lead.code}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-on-surface">{lead.company}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 text-on-surface-variant">
                            <span className="material-symbols-outlined text-xs text-badge-won-fg">
                              verified
                            </span>
                            {lead.email}
                          </span>
                          <span className="text-outline text-xs">{lead.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-surface-container-low px-2 py-0.5 rounded text-on-surface-variant font-label-sm text-label-sm">
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-on-surface tabular-nums">
                        ${lead.expValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                            lead.priority === 'High'
                              ? 'bg-badge-lost-bg text-badge-lost-fg'
                              : lead.priority === 'Medium'
                              ? 'bg-badge-pending-bg text-badge-pending-fg'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-medium ${
                            lead.status === 'Qualified'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : lead.status === 'Contacted'
                              ? 'bg-badge-pending-bg text-badge-pending-fg'
                              : lead.status === 'Converted'
                              ? 'bg-badge-won-bg text-badge-won-fg'
                              : lead.status === 'Lost'
                              ? 'bg-badge-lost-bg text-badge-lost-fg'
                              : 'bg-whisper-blue text-primary'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {lead.assignedAvatar ? (
                            <img
                              className="w-6 h-6 rounded-full object-cover shadow-xs"
                              src={lead.assignedAvatar}
                              alt={lead.assignedTo}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container text-[10px] flex items-center justify-center font-bold">
                              {lead.assignedTo.slice(0, 2)}
                            </div>
                          )}
                          <span className="truncate max-w-[90px] text-xs font-medium">
                            {lead.assignedTo}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSelectLeadForConvert(lead)}
                            className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title="Quick Convert Lead"
                          >
                            <span className="material-symbols-outlined text-base">transform</span>
                          </button>
                          <button
                            onClick={() => onScheduleFollowUp(lead.name, lead.company)}
                            className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title="Schedule Follow-Up"
                          >
                            <span className="material-symbols-outlined text-base">event</span>
                          </button>
                          <button
                            onClick={() => alert(`Details for lead ${lead.code}`)}
                            className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title="More Options"
                          >
                            <span className="material-symbols-outlined text-base">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-surface-container">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Showing <strong className="text-on-surface">1 to {filteredLeads.length}</strong> of{' '}
              <strong className="text-on-surface">{totalCount}</strong> leads
            </span>
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-whisper-blue disabled:opacity-40 cursor-pointer"
                disabled
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button className="w-7 h-7 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">
                1
              </button>
              <button className="w-7 h-7 rounded-lg text-on-surface-variant hover:bg-whisper-blue font-label-sm text-label-sm flex items-center justify-center cursor-pointer">
                2
              </button>
              <button className="w-7 h-7 rounded-lg text-on-surface-variant hover:bg-whisper-blue font-label-sm text-label-sm flex items-center justify-center cursor-pointer">
                3
              </button>
              <span className="px-1 text-outline font-label-sm text-label-sm">...</span>
              <button className="w-7 h-7 rounded-lg text-on-surface-variant hover:bg-whisper-blue font-label-sm text-label-sm flex items-center justify-center cursor-pointer">
                31
              </button>
              <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-whisper-blue cursor-pointer">
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Convert Lead Drawer (Section 17.13 Master Entity Generation Workflow) */}
        {isDrawerOpen && currentLead && (
          <div
            className="xl:col-span-4 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col gap-space-md transition-all border border-soft-slate-border"
            id="convertDrawer"
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">conversion_path</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Quick Convert Lead
                  </h2>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Section 17.13 Master Entity Generation Workflow
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Target Record Context Card */}
            <div className="bg-whisper-blue p-space-md rounded-lg flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Target Record
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  {currentLead.name}
                </span>
                <span className="font-body-sm text-body-sm text-outline">
                  {currentLead.company} ({currentLead.code})
                </span>
              </div>
              <span className="px-2 py-1 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-semibold">
                {currentLead.status}
              </span>
            </div>

            {/* Business Logic Pre-requisites Checklist */}
            <div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded-lg border border-soft-slate-border/50">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                Business Logic Pre-requisites
              </span>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-badge-won-fg text-sm">check_circle</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Valid Company & Contact info
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-badge-won-fg font-semibold">PASSED</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-sm ${
                      isAmountValid ? 'text-badge-won-fg' : 'text-badge-lost-fg'
                    }`}
                  >
                    {isAmountValid ? 'check_circle' : 'error'}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Opportunity Amount &gt; $0
                  </span>
                </div>
                <span
                  className={`font-label-sm text-label-sm font-semibold ${
                    isAmountValid ? 'text-badge-won-fg' : 'text-badge-lost-fg'
                  }`}
                >
                  {isAmountValid ? `VALID ($${Math.round(amountVal / 1000)}k)` : 'FAIL (Req > 0)'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-sm ${
                      isDateValid ? 'text-badge-won-fg' : 'text-badge-lost-fg'
                    }`}
                  >
                    {isDateValid ? 'check_circle' : 'error'}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Expected Close Date Set
                  </span>
                </div>
                <span
                  className={`font-label-sm text-label-sm font-semibold ${
                    isDateValid ? 'text-badge-won-fg' : 'text-badge-lost-fg'
                  }`}
                >
                  {isDateValid ? 'VALID' : 'DATE REQUIRED'}
                </span>
              </div>
            </div>

            {/* Conversion Form Fields */}
            <form
              className="flex flex-col gap-space-md mt-1"
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmConvert();
              }}
            >
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between">
                  <span>Customer Master Creation</span>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold">
                    Creates Cust #CUST-9921
                  </span>
                </label>
                <input
                  type="text"
                  value={companyMaster}
                  onChange={(e) => setCompanyMaster(e.target.value)}
                  className="h-10 px-3 bg-surface-container-low text-on-surface rounded-lg font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Opportunity Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-outline text-sm font-semibold">$</span>
                    <input
                      type="number"
                      value={oppAmount}
                      onChange={(e) => setOppAmount(e.target.value)}
                      className="h-10 pl-7 pr-3 w-full bg-surface-container-low text-on-surface rounded-lg font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Pipeline Stage
                  </label>
                  <select
                    value={oppStage}
                    onChange={(e) => setOppStage(e.target.value)}
                    className="h-10 px-3 bg-surface-container-low text-on-surface-variant rounded-lg font-body-md text-body-md focus:outline-none cursor-pointer border border-soft-slate-border"
                  >
                    <option value="discovery">Stage 2: Discovery</option>
                    <option value="poc">Stage 3: Technical PoC</option>
                    <option value="negotiation">Stage 4: Negotiation</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium">
                  Target Close Date
                </label>
                <input
                  type="date"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="h-10 px-3 bg-surface-container-low text-on-surface rounded-lg font-body-md text-body-md focus:outline-none border border-soft-slate-border"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium">
                  Account Executive Assignment
                </label>
                <div className="flex items-center gap-2 p-2 bg-surface-container-low rounded-lg border border-soft-slate-border">
                  <img
                    alt="Sarah Jenkins"
                    className="w-7 h-7 rounded-full object-cover shadow-xs"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCal_6Sr7H9YlS_BB0XZvqqvn0rC3cjnS1GrEGUhn6VvtgrOflwHst2crXLEAKi8ztScxYIar4dDaYN7XNHxSPDTXSQK_CcaaTUj0d3EuVHb2bovdNgZr2n0kHxQ22-ut_3a9n5rG1PYcnTP4C6jup1lidOlHdaX7OxdCBdjDUjEQbQ-oIad6raYircLKpPzhrHNy1cFEOVhGbERO0xWxXKmwMaJ-HsztkKIQy-e-Mv5o2foqjVtDJq"
                  />
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Sarah Jenkins
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      Regional Director (Retain as Deal Owner)
                    </span>
                  </div>
                </div>
              </div>

              {/* Notification Feedback Bar */}
              <div
                className={`p-3 rounded-lg flex items-start gap-2 font-body-sm text-body-sm transition-all ${
                  convertSuccessMessage
                    ? 'bg-secondary-fixed text-on-secondary-fixed animate-pulse'
                    : 'bg-muted-sage text-badge-won-fg'
                }`}
              >
                <span className="material-symbols-outlined text-base mt-0.5">
                  {convertSuccessMessage ? 'autorenew' : 'verified_user'}
                </span>
                <span>
                  {convertSuccessMessage ||
                    "All business gates pass. Lead will transition to 'Converted' and trigger Audit Log entry in compliance with sec 17.6."}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-space-sm pt-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-1/2 py-2.5 px-4 bg-surface-container-low text-on-surface-variant font-label-lg text-label-lg rounded-lg hover:bg-surface-container-high transition-colors text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!canConvert}
                  onClick={handleConfirmConvert}
                  className={`w-1/2 py-2.5 px-4 bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-xs transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    canConvert ? 'hover:bg-secondary' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">check</span>
                  <span>{isConverting ? 'Converting...' : 'Confirm & Convert'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
