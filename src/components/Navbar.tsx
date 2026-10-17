import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  Radio,
  Terminal,
  Layers,
  Search,
  Bot,
  Activity,
  Code2,
  Users,
  Building2,
  CheckCircle2,
  ChevronDown,
  Lock,
  ExternalLink,
  BookOpen,
  Globe,
  GitBranch,
  Menu,
  X,
  Sparkles,
  Command,
} from 'lucide-react';
import { Role, SecurityPosture, User } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  posture: SecurityPosture;
  user: User;
  setUserRole: (role: Role) => void;
  incidentStepCount: number;
  openDocs: () => void;
  openShortcuts?: () => void;
  isLandingPage: boolean;
  setIsLandingPage: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  posture,
  user,
  setUserRole,
  incidentStepCount,
  openDocs,
  openShortcuts,
  isLandingPage,
  setIsLandingPage,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNavItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'breach-map', label: '3D Threat Globe', icon: Globe, highlight: 'Three.js' },
    { id: 'incident', label: 'Containment', icon: AlertTriangle, count: `${incidentStepCount}/10`, urgent: incidentStepCount < 10 },
    { id: 'breach', label: 'Breach Intel', icon: Search },
    { id: 'open-source', label: 'Open Source Hub', icon: GitBranch, highlight: 'Apache-2.0' },
  ];

  const secondaryNavItems = [
    { id: 'analyst', label: 'AI Security Analyst', icon: Bot, description: 'Gemini grounded threat advisor' },
    { id: 'graph', label: 'Identity Graph', icon: Layers, description: 'Interactive relational attack surface' },
    { id: 'browser', label: 'Browser Center', icon: Radio, description: 'Audited extensions & local state' },
    { id: 'timeline', label: 'Security Timeline', icon: Terminal, description: 'Deterministic audit events' },
    { id: 'developer', label: 'Developer API', icon: Code2, description: 'CLI & headless token audit tools' },
    { id: 'family', label: 'Family Protection', icon: Users, description: 'k-Anonymity group alerts' },
    { id: 'business', label: 'Enterprise Security', icon: Building2, description: 'Role-based device compliance' },
    { id: 'tests', label: 'Test Suite', icon: CheckCircle2, description: '22 verified security invariants' },
    { id: 'pricing', label: 'Pricing Plans', icon: Lock, description: 'Open source vs managed' },
  ];

  const roles: { role: Role; label: string }[] = [
    { role: 'security_admin', label: 'Security Admin' },
    { role: 'owner', label: 'Owner' },
    { role: 'admin', label: 'Administrator' },
    { role: 'member', label: 'Team Member' },
    { role: 'auditor', label: 'Compliance Auditor' },
  ];

  const isSecondaryActive = secondaryNavItems.some(item => item.id === currentView);
  const activeSecondaryItem = secondaryNavItems.find(item => item.id === currentView);

  return (
    <header className="sticky top-0 z-50 border-b border-violet-300/10 bg-[#0c1030]/85 backdrop-blur-xl">
      {/* Editorial Utility Strip */}
      <div className="flex h-7 items-center justify-between border-b border-slate-800/50 px-4 sm:px-6 text-xs text-slate-400">
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="inline-flex items-center space-x-1.5 text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="font-medium">Sample-data prototype</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="hidden md:inline text-slate-500">Local-First k-Anonymity Range Queries</span>
          <span className="hidden lg:inline text-slate-600">·</span>
          <span className="hidden lg:inline text-slate-500">Apache 2.0 Open Source</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <button
            onClick={openDocs}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <BookOpen className="h-3 w-3" />
            <span>Architecture & Threat Model</span>
          </button>
          <span className="text-slate-700">·</span>
          <button
            onClick={() => setIsLandingPage(!isLandingPage)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            {isLandingPage ? 'Open Console →' : 'Public Overview'}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              setIsLandingPage(false);
              setCurrentView('dashboard');
            }}
            className="flex items-center space-x-2.5 text-left group focus:outline-none"
          >
            <div className="playful-icon flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/35 bg-violet-500 text-white transition-transform group-hover:rotate-6 group-hover:scale-110">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-base tracking-tight text-white">SentinelKey</span>
                <span className="text-[10px] text-slate-400 font-mono">v1.2</span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Built by Ferrivox Ltd · Open Source</p>
            </div>
          </button>

          {/* Desktop Primary Nav */}
          {!isLandingPage && (
            <nav className="hidden lg:flex items-center space-x-1">
              {primaryNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMoreMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                    {item.count && (
                      <span className="text-[10px] font-mono font-semibold px-1 rounded bg-rose-500/15 text-rose-300">
                        {item.count}
                      </span>
                    )}
                    {item.highlight && (
                      <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.highlight}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* More Views Popover Menu */}
              <div className="relative">
                <button
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isSecondaryActive
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span>{isSecondaryActive && activeSecondaryItem ? activeSecondaryItem.label : 'More Tools'}</span>
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </button>

                {moreMenuOpen && (
                  <div className="absolute left-0 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      Extended Capabilities
                    </div>
                    <div className="space-y-0.5">
                      {secondaryNavItems.map(item => {
                        const Icon = item.icon;
                        const isCurrent = currentView === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentView(item.id);
                              setMoreMenuOpen(false);
                            }}
                            className={`flex w-full items-start space-x-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                              isCurrent
                                ? 'bg-slate-800 text-white font-medium'
                                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                            }`}
                          >
                            <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${isCurrent ? 'text-emerald-400' : 'text-slate-500'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium leading-none">{item.label}</div>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3">
          {/* Posture Unboxed Stat */}
          {!isLandingPage && <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 font-sans">
            <span>Posture</span>
            <span className="font-semibold text-slate-100">{posture.overallScore}%</span>
            <span className="text-slate-600">·</span>
            <span className={`font-semibold ${
              posture.grade.startsWith('A')
                ? 'text-emerald-400'
                : posture.grade.startsWith('B')
                ? 'text-cyan-400'
                : 'text-amber-400'
            }`}>
              Grade {posture.grade}
            </span>
          </div>}

          {/* Centralized Shortcuts Manager Trigger */}
          {openShortcuts && (
            <button
              onClick={openShortcuts}
              title="Keyboard Shortcuts & Quick Actions (⌘K or ?)"
              className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all font-sans"
            >
              <Command className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-xs font-medium">Shortcuts</span>
              <kbd className="hidden md:inline-block text-[10px] text-slate-400 font-mono bg-slate-950 px-1 py-0.5 rounded border border-slate-800">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Role Dropdown */}
          {!isLandingPage && <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition-all"
            >
              <span className="text-slate-500 text-[11px]">Role:</span>
              <span className="font-medium text-slate-100 capitalize text-xs">
                {user.role.replace('_', ' ')}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl py-1 shadow-2xl z-50">
                <div className="px-3 py-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-800/80">
                  Switch Active Role
                </div>
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setUserRole(r.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      user.role === r.role
                        ? 'bg-emerald-500/10 text-emerald-300 font-medium'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{r.label}</span>
                    {user.role === r.role && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && !isLandingPage && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2 py-1">
            Navigation
          </div>
          {[...primaryNavItems, ...secondaryNavItems].map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {'count' in item && item.count && (
                  <span className="text-[10px] font-mono px-1 rounded bg-rose-500/15 text-rose-300">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
          {openShortcuts && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openShortcuts();
              }}
              className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-900/40 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Command className="h-4 w-4 text-emerald-400" />
                <span>Keyboard Shortcuts & Actions</span>
              </div>
              <span className="text-[10px] font-mono px-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                ⌘K
              </span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
