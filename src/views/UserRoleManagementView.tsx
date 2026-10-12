import React, { useState } from 'react';
import { RoleScope } from '../types/crm';

interface UserRoleManagementViewProps {
  currentRoleScope: RoleScope;
  onChangeRoleScope: (role: RoleScope) => void;
}

export const UserRoleManagementView: React.FC<UserRoleManagementViewProps> = ({
  currentRoleScope,
  onChangeRoleScope,
}) => {
  const [users] = useState([
    {
      id: 'u1',
      name: 'Sarah Jenkins',
      email: 's.jenkins@acxiom-enterprise.com',
      role: 'Regional Director',
      scope: 'Manager View',
      status: 'Active',
      permissions: ['All Pipeline Stages', 'Quick Convert Override', 'Audit Trail Export', 'User Role Management'],
    },
    {
      id: 'u2',
      name: 'Marcus Vance',
      email: 'm.vance@acxiom-enterprise.com',
      role: 'Senior Strategic AE',
      scope: 'AE View',
      status: 'Active',
      permissions: ['Opportunity Modification', 'Follow-up Scheduler', 'Customer Record Access'],
    },
    {
      id: 'u3',
      name: 'Elena Rostova',
      email: 'e.rostova@acxiom-enterprise.com',
      role: 'Enterprise AE',
      scope: 'AE View',
      status: 'Active',
      permissions: ['Opportunity Modification', 'Follow-up Scheduler', 'Customer Record Access'],
    },
    {
      id: 'u4',
      name: 'David Kalu',
      email: 'd.kalu@acxiom-enterprise.com',
      role: 'Account Executive',
      scope: 'AE View',
      status: 'Active',
      permissions: ['Opportunity Modification', 'Follow-up Scheduler'],
    },
    {
      id: 'u5',
      name: 'North America SDR Team',
      email: 'sdr-dispatch@acxiom-enterprise.com',
      role: 'Lead Triage / SDR',
      scope: 'SDR View',
      status: 'Active',
      permissions: ['Lead Intake', 'Lead Qualification', 'Contact Enrichment'],
    },
  ]);

  const roleDefinitions: { role: RoleScope; desc: string; access: string }[] = [
    {
      role: 'Manager View',
      desc: 'Operational management view with full revenue visibility, approval workflows, and audit rights.',
      access: 'Read/Write All Pipeline & User Controls',
    },
    {
      role: 'Executive View',
      desc: 'High-level executive dashboard focused on aggregate revenue metrics, conversion rates, and board reports.',
      access: 'Global Reporting & Pipeline Intelligence',
    },
    {
      role: 'AE View',
      desc: 'Account executive workflow focused on assigned customer masters, negotiation stages, and scheduled follow-ups.',
      access: 'Direct Account & Deal Operations',
    },
    {
      role: 'SDR View',
      desc: 'Lead prospecting and triage view with rapid capture, cadence management, and qualification validation.',
      access: 'Inbound Lead Pipeline & Contact Triage',
    },
  ];

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <span>Identity & Access Management</span>
            <span>•</span>
            <span className="text-tertiary font-semibold">RBAC Security Policy</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold mt-1">
            User & Role Management
          </h1>
        </div>
      </div>

      {/* Role Scope Selector Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-soft-slate-border">
        <h2 className="font-headline-md text-headline-md text-on-surface font-semibold mb-1">
          Active Role Scope Context
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          Switch the simulation perspective to test UI adaptations for different CRM security scopes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {roleDefinitions.map((def) => {
            const isCurrent = currentRoleScope === def.role;
            return (
              <div
                key={def.role}
                onClick={() => onChangeRoleScope(def.role)}
                className={`p-space-md rounded-xl cursor-pointer transition-all border ${
                  isCurrent
                    ? 'bg-secondary-container/30 border-primary ring-1 ring-primary shadow-xs'
                    : 'bg-surface-container-low border-soft-slate-border hover:bg-whisper-blue'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                    {def.role}
                  </span>
                  {isCurrent && (
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{def.desc}</p>
                <div className="mt-3 pt-2 border-t border-surface-container">
                  <span className="text-[11px] font-semibold text-primary">{def.access}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-soft-slate-border">
        <h2 className="font-headline-md text-headline-md text-on-surface font-semibold mb-1">
          Authorized Team Members
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          Active CRM operators, role scopes, and assigned capability permissions.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-whisper-blue text-on-surface-variant font-label-sm text-label-sm">
                <th className="py-3 px-4">Operator Name</th>
                <th className="py-3 px-4">Corporate Role</th>
                <th className="py-3 px-4">Current Scope</th>
                <th className="py-3 px-4">Capability Permissions</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-body-sm text-on-surface">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-whisper-blue/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold block text-on-surface">{u.name}</span>
                    <span className="text-xs text-outline font-mono">{u.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-on-surface">{u.role}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-surface-container-low px-2.5 py-0.5 rounded-full font-label-sm text-label-sm text-on-surface font-semibold">
                      {u.scope}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.permissions.map((p) => (
                        <span
                          key={p}
                          className="bg-whisper-blue text-primary text-[10px] font-medium px-2 py-0.5 rounded border border-soft-slate-border/50"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="bg-badge-won-bg text-badge-won-fg font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
