import React, { useState } from 'react';
import { Customer, ActivityTimelineItem, FollowUp } from '../types/crm';

interface CustomersViewProps {
  customers: Customer[];
  selectedCustomerId?: string;
  onSelectCustomer: (id: string) => void;
  onAddCustomer: (customer: Partial<Customer>) => void;
  onScheduleCustomerFollowUp: (followUp: Partial<FollowUp>) => void;
  timeline: ActivityTimelineItem[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onAddCustomer,
  onScheduleCustomerFollowUp,
  timeline,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState<'Active' | 'Onboarding' | 'Inactive'>('Active');
  const [activeSegmentTab, setActiveSegmentTab] = useState<'Overview' | 'Opportunities' | 'Follow-Ups' | 'Audit History' | 'Invoices'>('Overview');

  // Follow up scheduling state
  const [fuSubject, setFuSubject] = useState('');
  const [fuType, setFuType] = useState('Meeting');
  const [fuDate, setFuDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [fuAssignee, setFuAssignee] = useState('Marcus Vance');
  const [fuNotes, setFuNotes] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // New Customer Modal state
  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustStatus, setNewCustStatus] = useState<'Active' | 'Onboarding' | 'Inactive'>('Active');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustRep, setNewCustRep] = useState('Marcus Vance');

  const activeCustomer =
    customers.find((c) => c.id === selectedCustomerId) ||
    customers.find((c) => c.status === activeStatusTab) ||
    customers[0];

  const handleDateChange = (val: string) => {
    setFuDate(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(val);
    if (selected < today) {
      setDateError('Error: Date cannot be earlier than today');
    } else {
      setDateError(null);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fuSubject || dateError) return;

    onScheduleCustomerFollowUp({
      subject: fuSubject,
      target: activeCustomer.name,
      subtext: fuNotes || 'Scheduled account review',
      type: fuType as any,
      date: fuDate === new Date().toISOString().split('T')[0] ? 'Today' : fuDate,
      status: fuDate === new Date().toISOString().split('T')[0] ? 'Today' : 'Planned',
      assignee: fuAssignee,
    });

    setScheduleSuccess(true);
    setFuSubject('');
    setFuNotes('');
    setTimeout(() => {
      setScheduleSuccess(false);
    }, 4000);
  };

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newContactName) return;

    const autoCode = `CUST-2024-0${Math.floor(Math.random() * 80) + 20}`;
    onAddCustomer({
      name: newCustName,
      code: autoCode,
      tier: 'Enterprise Tier A',
      status: newCustStatus,
      description: 'Corporate intermodal operations and commercial services account.',
      decisionMaker: {
        name: newContactName,
        role: 'VP Commercial Logistics',
        email: newCustEmail || `${newContactName.toLowerCase().replace(/\s+/g, '.')}@corporate.com`,
        phone: newCustPhone || '+1 (555) 000-0000',
        address: newCustAddress || 'Corporate Office Suite',
      },
      accountExecutive: {
        name: newCustRep,
        role: 'Senior Strategic AE',
        initials: newCustRep.slice(0, 2).toUpperCase(),
        territory: 'National Accounts',
        escalation: 'Sarah Jenkins',
        lastReviewAudit: new Date().toLocaleDateString(),
      },
    });

    setIsNewCustModalOpen(false);
    setNewCustName('');
    setNewContactName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustAddress('');
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Top Action & Navigation Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-soft-slate-border">
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-whisper-blue flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">domain</span>
          </div>
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Account Directorate
              </span>
              <span className="text-outline-variant font-label-sm text-label-sm">/</span>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                {activeCustomer.code}
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
              Customer Master & Record Details
            </h1>
          </div>
        </div>

        {/* Toolbar Filters & Master Actions */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="relative min-w-[220px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-outline">
              search
            </span>
            <input
              type="text"
              placeholder="Filter customer database..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-surface-container-low pl-9 pr-3 py-2 rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest transition-colors border border-soft-slate-border"
            />
          </div>

          <div className="flex items-center bg-surface-container-low rounded-lg p-1 text-on-surface-variant">
            {(['Active', 'Onboarding', 'Inactive'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                  activeStatusTab === tab
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNewCustModalOpen(true)}
            className="flex items-center gap-space-xs bg-primary text-on-primary font-label-lg text-label-lg px-4 py-2 rounded-lg shadow-xs hover:bg-secondary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            <span>New Customer</span>
          </button>
        </div>
      </div>

      {/* Main Asymmetric Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left / Main Workspace Section (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Customer Overview Master Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col gap-space-lg border border-soft-slate-border">
            {/* Card Header & Status Meta */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
              <div className="flex items-start gap-space-md">
                <div className="relative">
                  <img
                    alt={activeCustomer.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-xs border border-surface-container"
                    src={
                      activeCustomer.avatarUrl ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtd3NcEPw0eJRYTrxV1SAinP1YKw22fg2wK6fhevkY-uBFJjXppEWWJDptuiSWqNxoyU1INPDDW14JQf7PJzfuYTqBVzDVvXf_t83k47ygq575xAstBnMQea3eYRSj27dStngqmjV82cBs--gKSWdQLfvRkPzV_2NqpJxfiuRgniqorPtItWOBHHwLDT3uzy3_XUZNjSdLfHeTlfQefq-pJfzX91p12w83Blp8Gh70X67sC3wGLbWY'
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80';
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-badge-won-bg flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-badge-won-fg"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      {activeCustomer.name}
                    </h2>
                    <span className="bg-badge-won-bg text-badge-won-fg font-label-sm text-label-sm px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-badge-won-fg"></span>
                      Active Account
                    </span>
                    <span className="bg-whisper-blue text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium">
                      {activeCustomer.tier}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {activeCustomer.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-space-xs self-start">
                <button
                  onClick={() => alert(`Edit customer profile for ${activeCustomer.name}`)}
                  className="p-2 text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-whisper-blue rounded-lg transition-colors cursor-pointer"
                  title="Edit Customer"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button
                  onClick={() => alert(`Share record link copied to clipboard!`)}
                  className="p-2 text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-whisper-blue rounded-lg transition-colors cursor-pointer"
                  title="Share"
                >
                  <span className="material-symbols-outlined text-lg">share</span>
                </button>
                <button
                  onClick={() => alert(`Archive customer record`)}
                  className="p-2 text-on-surface-variant hover:text-error hover:bg-badge-lost-bg rounded-lg transition-colors cursor-pointer"
                  title="Archive"
                >
                  <span className="material-symbols-outlined text-lg">archive</span>
                </button>
              </div>
            </div>

            {/* Metric Snapshot Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm p-space-md bg-surface-container-low rounded-xl border border-soft-slate-border/50">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Account Value
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5 font-semibold">
                  {activeCustomer.accountValue}
                </span>
                <span className="font-label-sm text-label-sm text-badge-won-fg flex items-center gap-0.5 mt-0.5 font-semibold">
                  <span className="material-symbols-outlined text-sm">trending_up</span>{' '}
                  {activeCustomer.growthYoY}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Customer Code
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5 font-semibold">
                  {activeCustomer.code}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {activeCustomer.assignedDate}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Health Score
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5 font-semibold">
                  {activeCustomer.healthScore} / 100
                </span>
                <span className="font-label-sm text-label-sm text-badge-won-fg flex items-center gap-0.5 mt-0.5 font-semibold">
                  <span className="material-symbols-outlined text-sm">check_circle</span>{' '}
                  {activeCustomer.churnRisk}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Payment Terms
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface mt-0.5 font-semibold">
                  {activeCustomer.paymentTerms}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Credit Verified
                </span>
              </div>
            </div>

            {/* Primary Contact & Commercial Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Contact Card */}
              <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-xs flex flex-col gap-space-sm border border-soft-slate-border">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">person</span>
                    Primary Decision Maker
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">
                    Secured Contact
                  </span>
                </div>
                <div className="flex items-center gap-space-sm pt-1">
                  <img
                    alt={activeCustomer.decisionMaker.name}
                    className="w-12 h-12 rounded-full object-cover shadow-xs border border-surface-container"
                    src={
                      activeCustomer.decisionMaker.avatarUrl ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuAuvseWmo1HmitlYYS6Ecf4YcA-YWLClo_OpInhUL5zJcwg8eyco_MKLIdpSxJThMv-kDO_BkSNG6ML9Fq11oH-6inABdDQ7DIhDYTn4s9dLRT97LQOzMe15WTSicysNopIrgwFt7JyDXg4Oz65cZ35WpWDKw_c5TaAJ_n5MTewPPIB3SANohEdfMbFUlf2rX8l2de7dQZYJ5_ze-8GcGbwciPFeg_5GDw6MpM7DUmsYNDvDjxgD3_O'
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80';
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      {activeCustomer.decisionMaker.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {activeCustomer.decisionMaker.role}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2 text-on-surface-variant">
                  <div className="flex items-center gap-2 text-on-surface text-sm">
                    <span className="material-symbols-outlined text-base text-primary">mail</span>
                    <span className="font-body-sm text-body-sm">
                      {activeCustomer.decisionMaker.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface text-sm">
                    <span className="material-symbols-outlined text-base text-primary">call</span>
                    <span className="font-body-sm text-body-sm">
                      {activeCustomer.decisionMaker.phone}
                    </span>
                    {activeCustomer.decisionMaker.ext && (
                      <span className="font-label-sm text-label-sm text-on-surface-variant ml-auto bg-surface-container-low px-1.5 py-0.5 rounded">
                        Ext. {activeCustomer.decisionMaker.ext}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-on-surface text-sm">
                    <span className="material-symbols-outlined text-base text-primary">location_on</span>
                    <span className="font-body-sm text-body-sm">
                      {activeCustomer.decisionMaker.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Representative & Territory Details */}
              <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-xs flex flex-col gap-space-sm border border-soft-slate-border">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">badge</span>
                    Internal Account Assignment
                  </span>
                  <span className="font-label-sm text-label-sm text-badge-won-fg font-semibold">
                    Direct Management
                  </span>
                </div>
                <div className="flex items-center gap-space-sm pt-1">
                  <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                    {activeCustomer.accountExecutive.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      {activeCustomer.accountExecutive.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {activeCustomer.accountExecutive.role}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2 text-on-surface-variant">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Assigned Territory:
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-medium">
                      {activeCustomer.accountExecutive.territory}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Primary Escalation:
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-medium">
                      {activeCustomer.accountExecutive.escalation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Last Review Audit:
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-medium">
                      {activeCustomer.accountExecutive.lastReviewAudit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 17.5 & 4.6: Inline System Validation Display */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm border border-soft-slate-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Business Validation Engine Check
                  </span>
                </div>
                <span className="font-label-sm text-label-sm bg-badge-won-bg text-badge-won-fg px-2 py-0.5 rounded-full font-semibold">
                  All 3 Rules Passed
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Field rules enforced per Section 4.6 & 17.5 integrity specifications during record creation &
                real-time synchronization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm pt-1">
                {/* Check 1 */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex items-start gap-2.5 shadow-xs border border-soft-slate-border">
                  <span className="material-symbols-outlined text-badge-won-fg text-lg shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Email Uniqueness
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {activeCustomer.decisionMaker.email} confirmed unique across master DB.
                    </span>
                  </div>
                </div>
                {/* Check 2 */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex items-start gap-2.5 shadow-xs border border-soft-slate-border">
                  <span className="material-symbols-outlined text-badge-won-fg text-lg shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Phone Format Standard
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Matched E.164 / NANP 10-digit rule (+1 area-code prefix).
                    </span>
                  </div>
                </div>
                {/* Check 3 */}
                <div className="bg-surface-container-lowest p-3 rounded-lg flex items-start gap-2.5 shadow-xs border border-soft-slate-border">
                  <span className="material-symbols-outlined text-badge-won-fg text-lg shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Duplicate Customer Scan
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Fuzzy match score &lt;0.05. Zero duplicate corporate entities.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Segmented Customer Workspace Tabs */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border border-soft-slate-border">
            {/* Tab Bar */}
            <div className="flex items-center gap-1 p-2 bg-surface-container-low overflow-x-auto border-b border-surface-container">
              <button
                onClick={() => setActiveSegmentTab('Overview')}
                className={`px-4 py-2 rounded-lg font-label-lg text-label-lg whitespace-nowrap cursor-pointer transition-all ${
                  activeSegmentTab === 'Overview'
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSegmentTab('Opportunities')}
                className={`px-4 py-2 rounded-lg font-label-lg text-label-lg whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeSegmentTab === 'Opportunities'
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>Opportunities</span>
                <span className="bg-secondary-container text-on-secondary-container px-1.5 py-0.2 rounded-full font-label-sm text-label-sm font-bold">
                  {activeCustomer.opportunities.length}
                </span>
              </button>
              <button
                onClick={() => setActiveSegmentTab('Follow-Ups')}
                className={`px-4 py-2 rounded-lg font-label-lg text-label-lg whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeSegmentTab === 'Follow-Ups'
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>Follow-Ups & Activities</span>
                <span className="bg-whisper-blue text-primary px-1.5 py-0.2 rounded-full font-label-sm text-label-sm font-bold">
                  5
                </span>
              </button>
              <button
                onClick={() => setActiveSegmentTab('Audit History')}
                className={`px-4 py-2 rounded-lg font-label-lg text-label-lg whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeSegmentTab === 'Audit History'
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>Audit History</span>
                <span className="bg-surface-container-high text-on-surface-variant px-1.5 py-0.2 rounded-full font-label-sm text-label-sm font-bold">
                  12
                </span>
              </button>
              <button
                onClick={() => setActiveSegmentTab('Invoices')}
                className={`px-4 py-2 rounded-lg font-label-lg text-label-lg whitespace-nowrap cursor-pointer transition-all ${
                  activeSegmentTab === 'Invoices'
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Invoices
              </button>
            </div>

            {/* Active Tab Content: Pipeline & Commercial Overview */}
            <div className="p-space-lg flex flex-col gap-space-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Active Opportunities & Value Delivery
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Direct sales pipelines associated with {activeCustomer.name} operational units.
                  </p>
                </div>
                <button
                  onClick={() => alert(`Add deal modal for ${activeCustomer.name}`)}
                  className="flex items-center gap-1 bg-surface-container-low hover:bg-whisper-blue text-on-surface px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors cursor-pointer border border-soft-slate-border"
                >
                  <span className="material-symbols-outlined text-base">add</span> Add Deal
                </button>
              </div>

              {/* Opportunities Mini Data Table */}
              <div className="overflow-x-auto rounded-lg shadow-xs border border-soft-slate-border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-whisper-blue text-primary">
                      <th className="py-3 px-4 font-label-sm text-label-sm uppercase">Deal Scope</th>
                      <th className="py-3 px-4 font-label-sm text-label-sm uppercase">Stage</th>
                      <th className="py-3 px-4 font-label-sm text-label-sm uppercase">Target Value</th>
                      <th className="py-3 px-4 font-label-sm text-label-sm uppercase">Confidence</th>
                      <th className="py-3 px-4 font-label-sm text-label-sm uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high bg-surface-container-lowest font-body-sm text-body-sm">
                    {activeCustomer.opportunities.map((opp) => (
                      <tr key={opp.id} className="hover:bg-surface-container-low/60 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-on-surface">
                          {opp.title}
                          <span className="block text-body-sm text-on-surface-variant">
                            Contract ID: {opp.contractId}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full inline-block font-semibold ${
                              opp.stage === 'Negotiation'
                                ? 'bg-badge-won-bg text-badge-won-fg'
                                : opp.stage === 'Technical Scope'
                                ? 'bg-badge-pending-bg text-badge-pending-fg'
                                : 'bg-badge-closed-bg text-badge-closed-fg'
                            }`}
                          >
                            {opp.stage}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-on-surface">
                          ${opp.targetValue.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-surface-container-high h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full transition-all duration-300"
                                style={{ width: `${opp.confidence}%` }}
                              ></div>
                            </div>
                            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                              {opp.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="text-primary hover:text-on-surface transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick Engagement KPI Sparklines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2">
                <div className="p-space-md bg-surface-container-low rounded-xl flex items-center justify-between border border-soft-slate-border/50">
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      30-Day Interaction Velocity
                    </span>
                    <p className="font-headline-md text-headline-md text-on-surface mt-1 font-semibold">
                      {activeCustomer.interactionVelocity.touchpoints} Touchpoints
                    </p>
                    <span className="font-body-sm text-body-sm text-badge-won-fg font-medium">
                      {activeCustomer.interactionVelocity.breakdown}
                    </span>
                  </div>
                  {/* Inline Micro Sparkline SVG */}
                  <svg className="w-24 h-12 text-primary" fill="none" viewBox="0 0 100 40">
                    <path
                      d="M0 32 L20 28 L40 34 L60 14 L80 18 L100 4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                    <circle cx="100" cy="4" fill="currentColor" r="3" />
                  </svg>
                </div>

                <div className="p-space-md bg-surface-container-low rounded-xl flex items-center justify-between border border-soft-slate-border/50">
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      SLA & Support Compliance
                    </span>
                    <p className="font-headline-md text-headline-md text-on-surface mt-1 font-semibold">
                      {activeCustomer.slaCompliance.uptime}
                    </p>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {activeCustomer.slaCompliance.openEscalations} Open critical escalations
                    </span>
                  </div>
                  {/* Mini Circular Gauge SVG */}
                  <svg className="w-12 h-12 text-secondary" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-high"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-badge-won-fg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="94, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Schedule Follow-Up & Action Timeline Section (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Interactive Follow-Up Scheduling Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col gap-space-md border border-soft-slate-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">event_upcoming</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Schedule Follow-Up
                </h2>
              </div>
              <span className="font-label-sm text-label-sm bg-whisper-blue text-primary px-2 py-0.5 rounded-full font-medium">
                Sec 5.1 Enforced
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Create structured business events with real-time operational constraint validation.
            </p>

            {/* Form Fields with Inline Validation Feedback */}
            <form className="flex flex-col gap-space-md" onSubmit={handleScheduleSubmit}>
              {/* Subject Field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between">
                  <span>
                    Follow-Up Subject <span className="text-error">*</span>
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {fuSubject.length}/80
                  </span>
                </label>
                <input
                  required
                  maxLength={80}
                  type="text"
                  placeholder="e.g. Q1 Contract Review & SLA Milestones"
                  value={fuSubject}
                  onChange={(e) => setFuSubject(e.target.value)}
                  className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest transition-colors border border-soft-slate-border"
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Provide clear agenda intent for CRM audit log tracking.
                </span>
              </div>

              {/* Type and Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Activity Type <span className="text-error">*</span>
                  </label>
                  <select
                    value={fuType}
                    onChange={(e) => setFuType(e.target.value)}
                    className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest transition-colors border border-soft-slate-border cursor-pointer"
                  >
                    <option value="Meeting">Meeting (Remote/In-person)</option>
                    <option value="Call">Direct Phone Call</option>
                    <option value="Email">Executive Correspondence</option>
                    <option value="Task">Action Item / Task</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium flex items-center justify-between">
                    <span>
                      Date <span className="text-error">*</span>
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-normal">≥ Today</span>
                  </label>
                  <input
                    required
                    type="date"
                    min={todayStr}
                    value={fuDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest transition-colors border border-soft-slate-border"
                  />
                  <span
                    className={`font-body-sm text-body-sm flex items-center gap-1 ${
                      dateError ? 'text-badge-lost-fg' : 'text-badge-won-fg'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {dateError ? 'error' : 'info'}
                    </span>
                    {dateError || 'Rule: Date cannot be earlier than today'}
                  </span>
                </div>
              </div>

              {/* Assigned Representative Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium">
                  Assigned Representative <span className="text-error">*</span>
                </label>
                <select
                  value={fuAssignee}
                  onChange={(e) => setFuAssignee(e.target.value)}
                  className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest transition-colors border border-soft-slate-border cursor-pointer"
                >
                  <option value="Marcus Vance">Marcus Vance (Strategic Account Executive)</option>
                  <option value="Sarah Jenkins">Sarah Jenkins (Regional Director)</option>
                  <option value="Elena Rostova">Elena Rostova (Customer Solutions Architect)</option>
                  <option value="David Chen">David Chen (Commercial Legal Counsel)</option>
                </select>
              </div>

              {/* Notes / Context */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium">
                  Internal Notes & Discussion Points
                </label>
                <textarea
                  rows={2}
                  value={fuNotes}
                  onChange={(e) => setFuNotes(e.target.value)}
                  placeholder="Outline specific objectives, customer dependencies, or agenda topics..."
                  className="w-full bg-surface-container-low px-3.5 py-2 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest transition-colors resize-none border border-soft-slate-border"
                ></textarea>
              </div>

              {/* Schedule Action Button */}
              <div className="pt-1 flex items-center gap-space-sm">
                <button
                  type="submit"
                  disabled={Boolean(dateError) || !fuSubject}
                  className={`flex-1 flex items-center justify-center gap-space-xs bg-primary text-on-primary font-label-lg text-label-lg py-2.5 rounded-lg shadow-xs transition-all cursor-pointer ${
                    !dateError && fuSubject ? 'hover:bg-secondary' : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">calendar_add_on</span>
                  <span>Schedule Follow-Up</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFuSubject('');
                    setFuNotes('');
                    setDateError(null);
                  }}
                  className="px-4 py-2.5 bg-surface-container-low text-on-surface-variant hover:text-on-surface rounded-lg font-label-lg text-label-lg transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {scheduleSuccess && (
                <div className="p-3 rounded-lg bg-badge-won-bg text-badge-won-fg font-body-sm text-body-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Follow-up successfully registered into task pipeline & calendar.</span>
                </div>
              )}
            </form>
          </div>

          {/* Action Timeline & Activity Feed */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col gap-space-md border border-soft-slate-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">history</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Activity Timeline
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Last updated 42m ago
              </span>
            </div>

            {/* Vertical Timeline Items */}
            <div className="relative pl-6 flex flex-col gap-space-md before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
              {timeline.map((item) => (
                <div key={item.id} className="relative flex flex-col gap-1">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-whisper-blue text-primary flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-xs">{item.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {item.title}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {item.timestamp}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1.5 mt-0.5 border border-soft-slate-border/50">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-label-sm text-label-sm flex items-center gap-1 font-semibold ${
                          item.outcomeType === 'positive'
                            ? 'text-badge-won-fg'
                            : item.outcomeType === 'pending'
                            ? 'text-badge-pending-fg'
                            : 'text-on-surface-variant'
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

            <button
              onClick={() => alert('Loaded 18 historical touchpoint logs.')}
              className="w-full py-2 bg-surface-container-low hover:bg-whisper-blue text-on-surface-variant hover:text-on-surface rounded-lg font-label-md text-label-md transition-colors text-center cursor-pointer border border-soft-slate-border"
            >
              Load Full Interaction History (18 events)
            </button>
          </div>
        </div>
      </div>

      {/* Section 4.4 New Customer Registration Modal */}
      {isNewCustModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setIsNewCustModalOpen(false)} />
          <div className="relative bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-xl flex flex-col overflow-hidden z-10 border border-soft-slate-border animate-in fade-in zoom-in-95 duration-100">
            {/* Modal Header */}
            <div className="p-space-lg bg-surface-container-low flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-whisper-blue text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">person_add</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Create Master Customer Record
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Section 4.4 Enterprise Entity Enrollment
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewCustModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateCustomerSubmit} className="p-space-lg flex flex-col gap-space-md max-h-[75vh] overflow-y-auto">
              <div className="p-space-sm bg-whisper-blue rounded-lg flex items-center gap-2 text-primary font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-lg">info</span>
                <span>
                  System validates corporate domain uniqueness and 10-digit phone patterns on submission.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Company Name <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Pacific Ridge Logistics"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Customer Code (Auto-Gen)
                  </label>
                  <input
                    readOnly
                    type="text"
                    value="CUST-2024-094"
                    className="w-full bg-surface-container-high px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface-variant cursor-not-allowed border border-soft-slate-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Contact Person Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Jonathan Reynolds"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Corporate Email <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Telephone Number <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-medium">
                    Initial Lifecycle Status
                  </label>
                  <select
                    value={newCustStatus}
                    onChange={(e) => setNewCustStatus(e.target.value as any)}
                    className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none cursor-pointer border border-soft-slate-border"
                  >
                    <option value="Active">Active Account</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Inactive">Pending Review</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium">
                  Physical Business Address
                </label>
                <input
                  type="text"
                  placeholder="Street Address, City, State / Province, Zip"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-soft-slate-border"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-medium">
                  Assign Sales Representative
                </label>
                <select
                  value={newCustRep}
                  onChange={(e) => setNewCustRep(e.target.value)}
                  className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none cursor-pointer border border-soft-slate-border"
                >
                  <option value="Sarah Jenkins">Sarah Jenkins (Regional Director)</option>
                  <option value="Marcus Vance">Marcus Vance (Strategic AE)</option>
                  <option value="Elena Rostova">Elena Rostova (Enterprise AE)</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="p-space-lg bg-surface-container-low -mx-space-lg -mb-space-lg mt-2 flex items-center justify-end gap-space-sm border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsNewCustModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface bg-surface-container-lowest transition-colors shadow-xs cursor-pointer border border-soft-slate-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-label-lg text-label-lg bg-primary text-on-primary hover:bg-secondary transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-lg">check</span>
                  <span>Save & Enroll Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
