import React, { useState } from 'react';
import { Lead, Customer, Opportunity, FollowUp } from '../types/crm';

interface NewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Partial<Lead>) => void;
  onAddCustomer: (customer: Partial<Customer>) => void;
  onAddOpportunity: (opp: Partial<Opportunity>) => void;
  onAddFollowUp: (fu: Partial<FollowUp>) => void;
}

type RecordTab = 'lead' | 'customer' | 'opportunity' | 'followup';

export const NewRecordModal: React.FC<NewRecordModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
  onAddCustomer,
  onAddOpportunity,
  onAddFollowUp,
}) => {
  const [activeTab, setActiveTab] = useState<RecordTab>('lead');

  // Lead fields
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSource, setLeadSource] = useState<'Website' | 'LinkedIn' | 'Trade Show' | 'Referral'>('Website');
  const [leadValue, setLeadValue] = useState('75000');

  // Customer fields
  const [custName, setCustName] = useState('');
  const [custContact, setCustContact] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custTier, setCustTier] = useState('Enterprise Tier A');

  // Opp fields
  const [oppTitle, setOppTitle] = useState('');
  const [oppCompany, setOppCompany] = useState('');
  const [oppAmount, setOppAmount] = useState('85000');
  const [oppProb, setOppProb] = useState('50');
  const [oppStage, setOppStage] = useState<'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won'>('Qualification');
  const [oppDate, setOppDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  // Follow-up fields
  const [fuSubject, setFuSubject] = useState('');
  const [fuTarget, setFuTarget] = useState('');
  const [fuType, setFuType] = useState<'Meeting' | 'Call' | 'Email' | 'Task'>('Meeting');
  const [fuDate, setFuDate] = useState(() => new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'lead') {
      if (!leadName || !leadCompany) return;
      onAddLead({
        name: leadName,
        company: leadCompany,
        email: leadEmail || `${leadName.toLowerCase().replace(/\s+/g, '.')}@${leadCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: leadPhone || '+1 (555) 000-0000',
        source: leadSource,
        expValue: Number(leadValue) || 50000,
        priority: Number(leadValue) > 100000 ? 'High' : 'Medium',
        status: 'New',
        assignedTo: 'Sarah Jenkins',
      });
    } else if (activeTab === 'customer') {
      if (!custName) return;
      onAddCustomer({
        name: custName,
        tier: custTier,
        status: 'Active',
        description: 'Enrolled customer account with active SLA tier.',
        decisionMaker: {
          name: custContact || 'Primary Contact',
          role: 'Operations Director',
          email: custEmail || 'contact@company.com',
          phone: custPhone || '+1 (555) 000-0000',
          address: 'Corporate Headquarters',
        },
      });
    } else if (activeTab === 'opportunity') {
      if (!oppTitle || !oppCompany) return;
      onAddOpportunity({
        title: oppTitle,
        company: oppCompany,
        category: 'Enterprise Tech',
        amount: Math.max(1000, Number(oppAmount) || 10000),
        probability: Math.min(100, Math.max(0, Number(oppProb) || 50)),
        stage: oppStage,
        expectedCloseDate: oppDate,
        expectedCloseDays: 14,
        owner: 'Sarah Jenkins',
      });
    } else if (activeTab === 'followup') {
      if (!fuSubject) return;
      onAddFollowUp({
        subject: fuSubject,
        subtext: 'Executive CRM Touchpoint',
        target: fuTarget || 'Strategic Account',
        type: fuType,
        date: fuDate === new Date().toISOString().split('T')[0] ? 'Today' : fuDate,
        status: fuDate === new Date().toISOString().split('T')[0] ? 'Today' : 'Planned',
        assignee: 'Sarah Jenkins',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl border border-soft-slate-border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100 flex flex-col">
        {/* Header */}
        <div className="p-space-md bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-whisper-blue text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">add_circle</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Create New CRM Record
              </h3>
              <p className="text-xs text-on-surface-variant">Real-time validation enforced</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-surface-container bg-surface-container-low/50 px-space-md pt-2 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('lead')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === 'lead'
                ? 'bg-surface-container-lowest text-primary border-t-2 border-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Lead
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === 'customer'
                ? 'bg-surface-container-lowest text-primary border-t-2 border-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('opportunity')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === 'opportunity'
                ? 'bg-surface-container-lowest text-primary border-t-2 border-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Opportunity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('followup')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === 'followup'
                ? 'bg-surface-container-lowest text-primary border-t-2 border-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Follow-Up
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-space-md max-h-[75vh] overflow-y-auto">
          {activeTab === 'lead' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Lead Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rachel Sterling"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Company *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Zenith Dynamics"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Corporate Email</label>
                  <input
                    type="email"
                    placeholder="r.sterling@zenith.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Source</label>
                  <select
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value as any)}
                    className="h-9 px-2 bg-surface-container-low rounded-lg text-xs border border-soft-slate-border"
                  >
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Exp. Value ($)</label>
                  <input
                    type="number"
                    value={leadValue}
                    onChange={(e) => setLeadValue(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'customer' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Customer Organization *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Pacific Ridge Logistics"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none border border-soft-slate-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Primary Contact Name</label>
                  <input
                    type="text"
                    placeholder="Jonathan Reynolds"
                    value={custContact}
                    onChange={(e) => setCustContact(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none border border-soft-slate-border"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Account Tier</label>
                  <select
                    value={custTier}
                    onChange={(e) => setCustTier(e.target.value)}
                    className="h-9 px-2 bg-surface-container-low rounded-lg text-xs border border-soft-slate-border"
                  >
                    <option value="Enterprise Tier A">Enterprise Tier A</option>
                    <option value="Mid-Market Growth">Mid-Market Growth</option>
                    <option value="Strategic Global">Strategic Global</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Email</label>
                  <input
                    type="email"
                    placeholder="j.reynolds@pacific.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none border border-soft-slate-border"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Telephone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 234-5678"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none border border-soft-slate-border"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'opportunity' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Deal Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. NextGen Telematics Gateway"
                  value={oppTitle}
                  onChange={(e) => setOppTitle(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none border border-soft-slate-border"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Target Account *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. CyberNetics Corp"
                  value={oppCompany}
                  onChange={(e) => setOppCompany(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none border border-soft-slate-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Deal Value ($)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={oppAmount}
                    onChange={(e) => setOppAmount(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none border border-soft-slate-border"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Probability (%)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    value={oppProb}
                    onChange={(e) => setOppProb(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none border border-soft-slate-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Stage</label>
                  <select
                    value={oppStage}
                    onChange={(e) => setOppStage(e.target.value as any)}
                    className="h-9 px-2 bg-surface-container-low rounded-lg text-xs border border-soft-slate-border"
                  >
                    <option value="Qualification">Qualification</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Target Close Date</label>
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={oppDate}
                    onChange={(e) => setOppDate(e.target.value)}
                    className="h-9 px-2 bg-surface-container-low rounded-lg text-xs border border-soft-slate-border"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'followup' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Follow-Up Subject *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Q4 SLA Review & Expansion Scope"
                  value={fuSubject}
                  onChange={(e) => setFuSubject(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none border border-soft-slate-border"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Target Customer / Lead</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Logistics Global"
                  value={fuTarget}
                  onChange={(e) => setFuTarget(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low rounded-lg text-sm focus:outline-none border border-soft-slate-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Type</label>
                  <select
                    value={fuType}
                    onChange={(e) => setFuType(e.target.value as any)}
                    className="h-9 px-2 bg-surface-container-low rounded-lg text-xs border border-soft-slate-border"
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Task">Task</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Date (≥ Today)</label>
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={fuDate}
                    onChange={(e) => setFuDate(e.target.value)}
                    className="h-9 px-2 bg-surface-container-low rounded-lg text-xs border border-soft-slate-border"
                  />
                </div>
              </div>
            </>
          )}

          {/* Validation note */}
          <div className="p-2.5 bg-whisper-blue rounded-lg text-xs text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>All entries automatically recorded in the CRM operational audit trail.</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-secondary transition-colors shadow-sm"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
