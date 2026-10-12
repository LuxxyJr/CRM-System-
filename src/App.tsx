/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CRMView,
  RoleScope,
  Lead,
  Customer,
  Opportunity,
  FollowUp,
  AuditActivity,
  ActivityTimelineItem,
} from './types/crm';
import {
  INITIAL_LEADS,
  INITIAL_CUSTOMERS,
  INITIAL_OPPORTUNITIES,
  INITIAL_FOLLOW_UPS,
  INITIAL_AUDIT_ACTIVITIES,
  INITIAL_TIMELINE,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { NewRecordModal } from './components/NewRecordModal';

import { DashboardView } from './views/DashboardView';
import { LeadsView } from './views/LeadsView';
import { CustomersView } from './views/CustomersView';
import { OpportunitiesView } from './views/OpportunitiesView';
import { FollowUpsView } from './views/FollowUpsView';
import { ActivitiesView } from './views/ActivitiesView';
import { ReportsView } from './views/ReportsView';
import { AuditLogView } from './views/AuditLogView';
import { UserRoleManagementView } from './views/UserRoleManagementView';

export default function App() {
  const [currentView, setCurrentView] = useState<CRMView>('dashboard');
  const [roleScope, setRoleScope] = useState<RoleScope>('Manager View');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-1');

  // Core Data States
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [followUps, setFollowUps] = useState<FollowUp[]>(INITIAL_FOLLOW_UPS);
  const [auditActivities, setAuditActivities] = useState<AuditActivity[]>(INITIAL_AUDIT_ACTIVITIES);
  const [timeline, setTimeline] = useState<ActivityTimelineItem[]>(INITIAL_TIMELINE);

  // Modals & Drawers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to log audit activity
  const logAudit = (
    user: string,
    description: string,
    tag: AuditActivity['tag'],
    type: AuditActivity['type'] = 'edit'
  ) => {
    const newAudit: AuditActivity = {
      id: `audit-${Date.now()}`,
      user,
      timeAgo: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      description,
      tag,
      type,
    };
    setAuditActivities((prev) => [newAudit, ...prev]);
  };

  // Convert Lead Handler (Section 17.13 Master Entity Generation Workflow)
  const handleConvertLead = (
    leadId: string,
    oppAmount: number,
    closeDate: string,
    companyMasterName: string
  ) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    // 1. Mark lead as Converted
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Converted' } : l))
    );

    // 2. Generate new Customer Master
    const newCustCode = `CUST-${Math.floor(Math.random() * 8999) + 1000}`;
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      code: newCustCode,
      name: companyMasterName || `${lead.company} Global Enterprise LLC`,
      tier: 'Enterprise Tier A',
      status: 'Active',
      description: 'Master account generated via Lead Quick-Convert Workflow.',
      accountValue: `$${(oppAmount / 1000).toFixed(0)}K ARR`,
      growthYoY: '+100% New Entrant',
      healthScore: 95,
      churnRisk: 'Low Churn Risk',
      paymentTerms: 'Net 30 EOM',
      assignedDate: 'Assigned Today',
      decisionMaker: {
        name: lead.name,
        role: 'Chief Executive Officer',
        email: lead.email,
        phone: lead.phone,
        address: 'Corporate Headquarters',
      },
      accountExecutive: {
        name: 'Sarah Jenkins',
        role: 'Regional Director',
        initials: 'SJ',
        territory: 'West Coast Enterprise',
        escalation: 'Executive Board',
        lastReviewAudit: new Date().toLocaleDateString(),
      },
      opportunities: [
        {
          id: `opp-gen-${Date.now()}`,
          title: `${lead.company} Core System Deployment`,
          stage: 'Technical Scope',
          targetValue: oppAmount,
          confidence: 75,
          contractId: `OPP-${Math.floor(Math.random() * 8999) + 1000}`,
        },
      ],
      interactionVelocity: {
        touchpoints: 1,
        breakdown: '1 Direct Conversion Audit',
      },
      slaCompliance: {
        uptime: '100% Initial Uptime',
        openEscalations: 0,
      },
    };

    setCustomers((prev) => [newCustomer, ...prev]);

    // 3. Create linked Opportunity in Pipeline
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: `${lead.company} Core System Deployment`,
      company: companyMasterName || lead.company,
      category: 'Enterprise Tech',
      amount: oppAmount,
      probability: 75,
      stage: 'Proposal',
      expectedCloseDays: 30,
      expectedCloseDate: closeDate || '2024-11-30',
      owner: 'Sarah Jenkins',
      ruleVerified: true,
    };
    setOpportunities((prev) => [newOpp, ...prev]);

    // 4. Log in Audit Activities
    logAudit(
      'Sarah Jenkins',
      `Converted lead ${lead.name} (${lead.code}) to customer ${newCustCode} & created $${oppAmount.toLocaleString()} pipeline deal`,
      'Lead Conversion',
      'verified'
    );
  };

  // Add Lead
  const handleAddLead = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      code: `LD-2024-${Math.floor(Math.random() * 899) + 100}`,
      name: leadData.name || 'New Lead',
      company: leadData.company || 'New Company',
      email: leadData.email || 'lead@company.com',
      phone: leadData.phone || '+1 (555) 000-0000',
      source: leadData.source || 'Website',
      expValue: leadData.expValue || 50000,
      priority: leadData.priority || 'Medium',
      status: leadData.status || 'New',
      assignedTo: leadData.assignedTo || 'Sarah Jenkins',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setLeads((prev) => [newLead, ...prev]);
    logAudit(
      'Sarah Jenkins',
      `Captured lead ${newLead.name} (${newLead.company}) valued at $${newLead.expValue.toLocaleString()}`,
      'Lead Enrichment',
      'person_add'
    );
  };

  // Add Customer
  const handleAddCustomer = (custData: Partial<Customer>) => {
    const autoCode = custData.code || `CUST-2024-${Math.floor(Math.random() * 80) + 20}`;
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      code: autoCode,
      name: custData.name || 'New Enterprise Customer',
      tier: custData.tier || 'Enterprise Tier A',
      status: custData.status || 'Active',
      description: custData.description || 'Active account enrolled with SLA terms.',
      accountValue: custData.accountValue || '$250K ARR',
      growthYoY: '+10.0% YoY',
      healthScore: 92,
      churnRisk: 'Low Churn Risk',
      paymentTerms: 'Net 30 EOM',
      assignedDate: 'Assigned Today',
      decisionMaker: custData.decisionMaker || {
        name: 'Primary Contact',
        role: 'Director of Procurement',
        email: 'contact@company.com',
        phone: '+1 (555) 000-0000',
        address: 'Headquarters',
      },
      accountExecutive: custData.accountExecutive || {
        name: 'Sarah Jenkins',
        role: 'Regional Director',
        initials: 'SJ',
        territory: 'National Accounts',
        escalation: 'Executive Committee',
        lastReviewAudit: new Date().toLocaleDateString(),
      },
      opportunities: [],
      interactionVelocity: {
        touchpoints: 1,
        breakdown: '1 Registration Event',
      },
      slaCompliance: {
        uptime: '100% Uptime',
        openEscalations: 0,
      },
    };

    setCustomers((prev) => [newCust, ...prev]);
    setSelectedCustomerId(newCust.id);
    logAudit(
      'Sarah Jenkins',
      `Created Master Customer Record ${newCust.name} (${newCust.code})`,
      'Account Sync',
      'verified'
    );
  };

  // Add Opportunity
  const handleAddOpportunity = (oppData: Partial<Opportunity>) => {
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: oppData.title || 'New Opportunity',
      company: oppData.company || 'Client Organization',
      category: oppData.category || 'Enterprise Tech',
      amount: oppData.amount || 75000,
      probability: oppData.probability || 50,
      stage: oppData.stage || 'Qualification',
      expectedCloseDays: oppData.expectedCloseDays || 14,
      expectedCloseDate: oppData.expectedCloseDate || '2024-11-20',
      owner: oppData.owner || 'Sarah Jenkins',
      ruleVerified: true,
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    logAudit(
      'Sarah Jenkins',
      `Created opportunity ${newOpp.title} ($${newOpp.amount.toLocaleString()}) in stage ${newOpp.stage}`,
      'Deal Mod',
      'edit'
    );
  };

  // Update Opportunity Stage
  const handleUpdateOpportunityStage = (id: string, stage: Opportunity['stage']) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updatedProb =
            stage === 'Closed Won'
              ? 100
              : stage === 'Closed Lost'
              ? 0
              : stage === 'Negotiation'
              ? 80
              : stage === 'Proposal'
              ? 50
              : 20;

          logAudit(
            'Sarah Jenkins',
            `Updated deal "${o.title}" stage to ${stage} (${updatedProb}%)`,
            stage === 'Closed Won' ? 'Closed Won' : 'Deal Mod',
            stage === 'Closed Won' ? 'verified' : 'edit'
          );

          return {
            ...o,
            stage,
            probability: updatedProb,
            lossReason: stage === 'Closed Lost' ? o.lossReason || 'Competitor Selected' : undefined,
          };
        }
        return o;
      })
    );
  };

  // Schedule Follow-Up
  const handleAddFollowUp = (fuData: Partial<FollowUp>) => {
    const newFu: FollowUp = {
      id: `fu-${Date.now()}`,
      date: fuData.date || 'Today',
      subject: fuData.subject || 'Follow-Up Review',
      subtext: fuData.subtext || 'Scheduled account cadence',
      target: fuData.target || 'Customer Account',
      status: fuData.status || 'Planned',
      type: fuData.type || 'Meeting',
      assignee: fuData.assignee || 'Sarah Jenkins',
    };
    setFollowUps((prev) => [newFu, ...prev]);
    logAudit(
      'Sarah Jenkins',
      `Scheduled follow-up: "${newFu.subject}" with ${newFu.target}`,
      'Account Sync',
      'task'
    );
  };

  // Toggle Follow-Up Completed
  const handleToggleFollowUpDone = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const nextStatus = f.status === 'Completed' ? 'Planned' : 'Completed';
          return { ...f, status: nextStatus };
        }
        return f;
      })
    );
  };

  // Add Activity Timeline Item
  const handleAddTimelineItem = (itemData: Partial<ActivityTimelineItem>) => {
    const newItem: ActivityTimelineItem = {
      id: `tl-${Date.now()}`,
      title: itemData.title || 'Client Engagement',
      timestamp: 'Just now',
      type: itemData.type || 'videocam',
      outcome: itemData.outcome || 'Outcome: Recorded',
      outcomeType: itemData.outcomeType || 'positive',
      metadata: itemData.metadata || 'Host: Sarah Jenkins',
      description: itemData.description || 'Logged CRM interaction.',
    };
    setTimeline((prev) => [newItem, ...prev]);
    logAudit(
      'Sarah Jenkins',
      `Logged client interaction: "${newItem.title}"`,
      'Lead Enrichment',
      'person_add'
    );
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col font-body-md">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        roleScope={roleScope}
        onChangeRoleScope={(r) => {
          setRoleScope(r);
          logAudit('System Dispatch', `Role scope switched to ${r}`, 'RBAC Policy', 'security');
        }}
        onOpenNewRecord={() => setIsNewRecordModalOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Wrap */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          recentAudits={auditActivities}
          roleScope={roleScope}
        />

        {/* View Surface */}
        <main className="relative pt-20 w-full flex-1 px-4 sm:px-space-lg py-space-lg bg-background">
          {currentView === 'dashboard' && (
            <DashboardView
              followUps={followUps}
              onToggleFollowUpDone={handleToggleFollowUpDone}
              auditActivities={auditActivities}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'leads' && (
            <LeadsView
              leads={leads}
              onConvertLead={handleConvertLead}
              onOpenNewLead={() => setIsNewRecordModalOpen(true)}
              onScheduleFollowUp={(name, company) => {
                handleAddFollowUp({
                  subject: `Follow-Up with ${name}`,
                  target: company,
                  subtext: 'Sales Cadence Review',
                  date: 'Today',
                  status: 'Today',
                });
                alert(`Follow-up registered for ${name} (${company})!`);
              }}
            />
          )}

          {currentView === 'customers' && (
            <CustomersView
              customers={customers}
              selectedCustomerId={selectedCustomerId}
              onSelectCustomer={(id) => setSelectedCustomerId(id)}
              onAddCustomer={handleAddCustomer}
              onScheduleCustomerFollowUp={handleAddFollowUp}
              timeline={timeline}
            />
          )}

          {currentView === 'opportunities' && (
            <OpportunitiesView
              opportunities={opportunities}
              onUpdateOpportunityStage={handleUpdateOpportunityStage}
              onOpenNewOpportunity={() => setIsNewRecordModalOpen(true)}
            />
          )}

          {currentView === 'follow-ups' && (
            <FollowUpsView
              followUps={followUps}
              onToggleDone={handleToggleFollowUpDone}
              onOpenNewFollowUp={() => setIsNewRecordModalOpen(true)}
            />
          )}

          {currentView === 'activities' && (
            <ActivitiesView
              timeline={timeline}
              onAddActivity={handleAddTimelineItem}
            />
          )}

          {currentView === 'reports' && <ReportsView />}

          {currentView === 'audit-log' && (
            <AuditLogView auditActivities={auditActivities} />
          )}

          {currentView === 'user-and-role-management' && (
            <UserRoleManagementView
              currentRoleScope={roleScope}
              onChangeRoleScope={(r) => {
                setRoleScope(r);
                logAudit('System Dispatch', `Role scope switched to ${r}`, 'RBAC Policy', 'security');
              }}
            />
          )}
        </main>
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        leads={leads}
        customers={customers}
        opportunities={opportunities}
        onNavigate={(view, recordId) => {
          setCurrentView(view);
          if (view === 'customers' && recordId) {
            setSelectedCustomerId(recordId);
          }
        }}
      />

      {/* Global New Record Modal */}
      <NewRecordModal
        isOpen={isNewRecordModalOpen}
        onClose={() => setIsNewRecordModalOpen(false)}
        onAddLead={handleAddLead}
        onAddCustomer={handleAddCustomer}
        onAddOpportunity={handleAddOpportunity}
        onAddFollowUp={handleAddFollowUp}
      />
    </div>
  );
}
