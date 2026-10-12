import React from 'react';
import { CRMView, RoleScope } from '../types/crm';

interface SidebarProps {
  currentView: CRMView;
  onSelectView: (view: CRMView) => void;
  roleScope: RoleScope;
  onChangeRoleScope: (role: RoleScope) => void;
  onOpenNewRecord: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS: { id: CRMView; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'customers', label: 'Customers', icon: 'group' },
  { id: 'leads', label: 'Leads', icon: 'filter_alt' },
  { id: 'opportunities', label: 'Opportunities', icon: 'trending_up' },
  { id: 'follow-ups', label: 'Follow-Ups', icon: 'event_repeat' },
  { id: 'activities', label: 'Activities', icon: 'checklist' },
  { id: 'reports', label: 'Reports', icon: 'bar_chart' },
  { id: 'audit-log', label: 'Audit Log', icon: 'history' },
  { id: 'user-and-role-management', label: 'User & Role Management', icon: 'manage_accounts' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  roleScope,
  onChangeRoleScope,
  onOpenNewRecord,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const roleOptions: RoleScope[] = [
    'Manager View',
    'Executive View',
    'AE View',
    'SDR View',
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-space-md flex items-center justify-between gap-space-sm border-b border-surface-container/60">
            <button
              onClick={() => {
                onSelectView('dashboard');
                if (onCloseMobile) onCloseMobile();
              }}
              className="flex items-center gap-space-sm text-left focus:outline-none"
            >
              <img
                alt="AcxiomCRM Emblem"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1X288JF_r3GjmyA-TF7V0RrwOCAlvCnEG0jX5bhb2HpzI1Kiy8JszCblMq1cmBRVrfFGZXdeuYvNLeShhS13e5UNIuroshupIYCFqO0H0QTMlkEq6o4-25Hdr2tIVjUM6P25ZTpXdSWgu2nvGrcqWvcqIxfHorGHyK6tDdgE7UZm0wTMvVUvmvMRRKz4Ogn4UT4s3Lobd_-dmwSx_Z1dOisSMFAvZExHIOhR03U6PhBuBljDfYDcBKEoGU"
                onError={(e) => {
                  // Fallback geometric brand mark
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.brand-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'brand-fallback w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm';
                    fallback.innerText = 'A';
                    parent.prepend(fallback);
                  }
                }}
              />
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                AcxiomCRM
              </span>
            </button>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          {/* New Record CTA */}
          <div className="px-space-md py-space-sm">
            <button
              onClick={onOpenNewRecord}
              className="w-full flex items-center justify-center gap-space-xs bg-primary text-on-primary font-label-lg text-label-lg py-2 rounded-lg shadow-sm hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>New Record</span>
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex flex-col gap-1 px-space-md py-space-xs">
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex items-center gap-space-sm px-3 py-2 rounded-lg transition-colors font-body-md text-body-md text-left w-full cursor-pointer ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container font-medium'
                      : 'text-on-surface-variant hover:bg-whisper-blue hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Role Scope Selector */}
        <div className="p-space-md flex flex-col gap-space-xs relative border-t border-surface-container/60">
          <div
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-whisper-blue transition-colors"
          >
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Role Scope
              </span>
              <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                {roleScope}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-base">
              unfold_more
            </span>
          </div>

          {/* Role Scope Popover */}
          {roleMenuOpen && (
            <div className="absolute bottom-16 left-space-md right-space-md bg-surface-container-lowest rounded-xl shadow-lg border border-soft-slate-border p-1.5 z-50 flex flex-col gap-0.5">
              <span className="px-2.5 py-1 text-[10px] uppercase font-bold text-outline tracking-wider">
                Switch Operational View
              </span>
              {roleOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChangeRoleScope(opt);
                    setRoleMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs font-medium transition-colors ${
                    roleScope === opt
                      ? 'bg-secondary-container text-on-secondary-container font-semibold'
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span>{opt}</span>
                  {roleScope === opt && (
                    <span className="material-symbols-outlined text-sm">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
