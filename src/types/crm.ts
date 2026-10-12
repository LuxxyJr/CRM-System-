export type CRMView = 
  | 'dashboard' 
  | 'customers' 
  | 'leads' 
  | 'opportunities' 
  | 'follow-ups' 
  | 'activities' 
  | 'reports' 
  | 'audit-log' 
  | 'user-and-role-management';

export type RoleScope = 'Manager View' | 'Executive View' | 'AE View' | 'SDR View';

export interface Lead {
  id: string;
  code: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: 'Website' | 'LinkedIn' | 'Trade Show' | 'Referral';
  expValue: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  assignedTo: string;
  assignedAvatar?: string;
  createdAt: string;
}

export interface CustomerOpportunity {
  id: string;
  title: string;
  stage: 'Qualification' | 'Proposal' | 'Negotiation' | 'Technical Scope' | 'Proposal Review' | 'Closed Won' | 'Closed Lost';
  targetValue: number;
  confidence: number;
  contractId: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  tier: string;
  status: 'Active' | 'Onboarding' | 'Inactive';
  description: string;
  avatarUrl?: string;
  accountValue: string;
  growthYoY: string;
  healthScore: number;
  churnRisk: 'Low Churn Risk' | 'Moderate' | 'High';
  paymentTerms: string;
  assignedDate: string;
  decisionMaker: {
    name: string;
    role: string;
    email: string;
    phone: string;
    ext?: string;
    address: string;
    avatarUrl?: string;
  };
  accountExecutive: {
    name: string;
    role: string;
    initials: string;
    territory: string;
    escalation: string;
    lastReviewAudit: string;
  };
  opportunities: CustomerOpportunity[];
  interactionVelocity: {
    touchpoints: number;
    breakdown: string;
  };
  slaCompliance: {
    uptime: string;
    openEscalations: number;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  category: string;
  tier?: string;
  amount: number;
  probability: number; // 0 to 100
  stage: 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  expectedCloseDays: number;
  expectedCloseDate: string;
  owner: string;
  ownerAvatar?: string;
  ownerInitials?: string;
  statusNote?: string;
  lossReason?: string;
  ruleVerified?: boolean;
  priorityHigh?: boolean;
}

export interface FollowUp {
  id: string;
  date: string;
  subject: string;
  subtext: string;
  target: string;
  status: 'Overdue' | 'Today' | 'Planned' | 'Completed';
  type: 'Meeting' | 'Call' | 'Email' | 'Task';
  assignee: string;
  notes?: string;
}

export interface AuditActivity {
  id: string;
  user: string;
  timeAgo: string;
  timestamp: string;
  description: string;
  tag: 'Deal Mod' | 'Closed Won' | 'Lead Enrichment' | 'RBAC Policy' | 'Lead Conversion' | 'Account Sync';
  type: 'edit' | 'verified' | 'person_add' | 'security' | 'task';
}

export interface ActivityTimelineItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'videocam' | 'mail' | 'handshake' | 'verified';
  outcome: string;
  outcomeType: 'positive' | 'pending' | 'verified';
  metadata: string;
  description: string;
}
