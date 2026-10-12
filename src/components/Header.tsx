import React, { useState } from 'react';
import { AuditActivity, RoleScope } from '../types/crm';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenMobileMenu?: () => void;
  recentAudits: AuditActivity[];
  roleScope: RoleScope;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  onOpenMobileMenu,
  recentAudits,
  roleScope,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md z-40 flex items-center justify-between px-4 sm:px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container/60">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-space-sm flex-1 max-w-lg">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors mr-1"
            title="Open menu"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
        )}

        {/* Global Search Input trigger */}
        <div
          onClick={onOpenCommandPalette}
          className="flex items-center gap-space-sm w-full bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-whisper-blue transition-colors cursor-pointer group"
        >
          <span className="material-symbols-outlined text-lg text-outline group-hover:text-primary transition-colors">
            search
          </span>
          <span className="font-body-sm text-body-sm text-outline flex-1 select-none">
            Search records, contacts, deals...
          </span>
          <kbd className="font-label-sm text-label-sm bg-surface-container-lowest text-on-surface-variant px-1.5 py-0.5 rounded shadow-sm border border-surface-container-high/60 hidden sm:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-space-md">
        {/* Real-time Indicator pill (quiet) */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low rounded-lg text-xs text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-badge-won-fg"></span>
          <span className="font-medium">Live Synced</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-xl border border-soft-slate-border p-space-md z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">notifications</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Activity & Audit Alerts
                  </span>
                </div>
                <span className="font-label-sm text-label-sm bg-whisper-blue text-primary px-2 py-0.5 rounded-full">
                  4 New
                </span>
              </div>

              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto divide-y divide-surface-container-high/50">
                {recentAudits.slice(0, 4).map((audit) => (
                  <div key={audit.id} className="pt-2 first:pt-0 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-sm text-primary p-1 bg-surface-container-low rounded-full mt-0.5">
                      {audit.type}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-on-surface">{audit.user}</span>
                        <span className="text-[11px] text-outline">{audit.timeAgo}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">{audit.description}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface">
                        {audit.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setNotificationsOpen(false)}
                className="w-full mt-3 pt-2 border-t border-surface-container text-center text-xs font-medium text-primary hover:text-tertiary transition-colors"
              >
                Mark all as acknowledged
              </button>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="relative">
          <div
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-space-sm pl-space-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-surface-container-high"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCal_6Sr7H9YlS_BB0XZvqqvn0rC3cjnS1GrEGUhn6VvtgrOflwHst2crXLEAKi8ztScxYIar4dDaYN7XNHxSPDTXSQK_CcaaTUj0d3EuVHb2bovdNgZr2n0kHxQ22-ut_3a9n5rG1PYcnTP4C6jup1lidOlHdaX7OxdCBdjDUjEQbQ-oIad6raYircLKpPzhrHNy1cFEOVhGbERO0xWxXKmwMaJ-HsztkKIQy-e-Mv5o2foqjVtDJq"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80';
              }}
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface font-medium leading-none">
                Sarah Jenkins
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-1">
                Regional Director
              </span>
            </div>
          </div>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-soft-slate-border p-3 z-50">
              <div className="flex flex-col pb-2 border-b border-surface-container">
                <span className="text-xs font-semibold text-on-surface">Sarah Jenkins</span>
                <span className="text-[11px] text-outline">s.jenkins@acxiom-enterprise.com</span>
                <span className="mt-1 text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full w-max font-medium">
                  {roleScope} Active
                </span>
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <div className="text-xs text-on-surface-variant flex items-center justify-between py-1">
                  <span>Region:</span>
                  <span className="font-medium text-on-surface">North America HQ</span>
                </div>
                <div className="text-xs text-on-surface-variant flex items-center justify-between py-1">
                  <span>Security Tier:</span>
                  <span className="font-medium text-badge-won-fg">Level 4 (Audit Cleared)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
