import React, { useState, useEffect } from 'react';
import { Lead, Customer, Opportunity, CRMView } from '../types/crm';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  customers: Customer[];
  opportunities: Opportunity[];
  onNavigate: (view: CRMView, recordId?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  leads,
  customers,
  opportunities,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.company.toLowerCase().includes(query.toLowerCase()) ||
      l.code.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase())
  );

  const filteredOpps = opportunities.filter(
    (o) =>
      o.title.toLowerCase().includes(query.toLowerCase()) ||
      o.company.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-xl shadow-2xl border border-soft-slate-border overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-container">
          <span className="material-symbols-outlined text-outline text-xl">search</span>
          <input
            autoFocus
            type="text"
            className="w-full bg-transparent font-body-md text-on-surface focus:outline-none placeholder:text-outline text-sm"
            placeholder="Search records, contacts, opportunities, actions... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-outline hover:text-on-surface text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-3">
          {/* Quick navigation */}
          {!query && (
            <div>
              <span className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-outline block">
                Quick Navigation
              </span>
              <div className="flex flex-col gap-0.5 mt-1">
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium text-on-surface hover:bg-whisper-blue transition-colors"
                >
                  <span className="material-symbols-outlined text-primary text-base">dashboard</span>
                  <span>Executive Overview Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('leads');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium text-on-surface hover:bg-whisper-blue transition-colors"
                >
                  <span className="material-symbols-outlined text-primary text-base">filter_alt</span>
                  <span>Lead Management & Triage</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('opportunities');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium text-on-surface hover:bg-whisper-blue transition-colors"
                >
                  <span className="material-symbols-outlined text-primary text-base">trending_up</span>
                  <span>Opportunity Pipeline Kanban</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('customers');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium text-on-surface hover:bg-whisper-blue transition-colors"
                >
                  <span className="material-symbols-outlined text-primary text-base">group</span>
                  <span>Customer Master Database</span>
                </button>
              </div>
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <span className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-outline block">
                Customers ({filteredCustomers.length})
              </span>
              <div className="flex flex-col gap-0.5 mt-1">
                {filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onNavigate('customers', c.id);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-whisper-blue transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-base">domain</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface">{c.name}</span>
                        <span className="text-[11px] text-outline">{c.code} • {c.tier}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary">{c.accountValue}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <span className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-outline block">
                Leads ({filteredLeads.length})
              </span>
              <div className="flex flex-col gap-0.5 mt-1">
                {filteredLeads.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onNavigate('leads', l.id);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-whisper-blue transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">person</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface">{l.name}</span>
                        <span className="text-[11px] text-outline">{l.company} • {l.code}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-on-surface">${l.expValue.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities */}
          {filteredOpps.length > 0 && (
            <div>
              <span className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-outline block">
                Opportunities ({filteredOpps.length})
              </span>
              <div className="flex flex-col gap-0.5 mt-1">
                {filteredOpps.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      onNavigate('opportunities', o.id);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-whisper-blue transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-tertiary text-base">lightbulb</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface">{o.title}</span>
                        <span className="text-[11px] text-outline">{o.company} • {o.stage}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-on-surface">${o.amount.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredLeads.length === 0 && filteredCustomers.length === 0 && filteredOpps.length === 0 && (
            <div className="py-8 text-center text-outline text-xs">
              No matching CRM records found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
