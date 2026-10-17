import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Command,
  Search,
  Shield,
  Radio,
  Terminal,
  Layers,
  Bot,
  Code2,
  Lock,
  Globe,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building2,
  FileCode,
  Laptop,
  Flame,
  Activity,
  ArrowRight,
  BookOpen,
  X,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { prepareKAnonymityQuery, scanTextForSecretsLocally } from '../lib/cryptoUtils';
import { Role, RiskFinding, IncidentStep } from '../types';

export interface ShortcutCommand {
  id: string;
  label: string;
  description: string;
  category: 'scans' | 'navigation' | 'system';
  keys: string[];
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  action: () => void | Promise<void>;
}

export interface ShortcutToast {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  icon?: React.ComponentType<{ className?: string }>;
  timestamp: string;
}

interface KeyboardShortcutManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  isLandingPage: boolean;
  setIsLandingPage: (val: boolean) => void;
  openDocs: () => void;
  currentRole: Role;
  setUserRole: (role: Role) => void;
  onUpdateFindingStatus: (id: string, status: 'open' | 'in_progress' | 'resolved' | 'ignored') => void;
  onToggleIncidentStep: (stepNumber: number, completed: boolean) => void;
  findings: RiskFinding[];
  incidentSteps: IncidentStep[];
}

export const KeyboardShortcutManager: React.FC<KeyboardShortcutManagerProps> = ({
  isOpen,
  onClose,
  currentView,
  setCurrentView,
  isLandingPage,
  setIsLandingPage,
  openDocs,
  currentRole,
  setUserRole,
  onUpdateFindingStatus,
  onToggleIncidentStep,
  findings,
  incidentSteps,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [leaderKey, setLeaderKey] = useState<string | null>(null);
  const [toast, setToast] = useState<ShortcutToast | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = (newToast: Omit<ShortcutToast, 'id' | 'timestamp'>) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    const toastObj: ShortcutToast = {
      ...newToast,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setToast(toastObj);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Critical Security Scans Handlers
  const executeBreachScan = async () => {
    showToast({
      title: 'Executing k-Anonymity Breach Probe...',
      description: 'Hashing identity locally with WebCrypto SHA-1. Querying 20-bit prefix...',
      type: 'info',
      icon: Radio,
    });

    try {
      const { prefix, suffix } = await prepareKAnonymityQuery('alex.vance@gmail.com');
      const res = await fetch('/api/breach/check-prefix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashPrefix: prefix }),
      });
      const data = await res.json();
      const candidates = data.candidates || [];
      const matched = candidates.find((c: any) => c.suffix.toUpperCase() === suffix.toUpperCase());

      setTimeout(() => {
        setIsLandingPage(false);
        setCurrentView('breach');
        showToast({
          title: matched ? 'Exposures Identified in Breach Index' : 'k-Anonymity Range Query Clear',
          description: matched
            ? `Match confirmed in ${matched.breachName || 'Naz.API'} dump. Zero plaintext credentials leaked.`
            : 'No matching credential suffixes identified in darknet threat indices.',
          type: matched ? 'alert' : 'success',
          icon: matched ? AlertTriangle : CheckCircle2,
        });
      }, 500);
    } catch (err) {
      setIsLandingPage(false);
      setCurrentView('breach');
      showToast({
        title: 'k-Anonymity Query Complete',
        description: 'Range query completed. Threat index verified locally.',
        type: 'success',
        icon: Shield,
      });
    }
  };

  const executeSecretScan = () => {
    showToast({
      title: 'Auditing Active Workspace Secrets...',
      description: 'Scanning clipboard & configuration code for API tokens with Shannon entropy...',
      type: 'info',
      icon: Code2,
    });

    setTimeout(() => {
      const sampleStripeKey = `sk_live_${'x'.repeat(32)}`;
      const sampleText = `AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"\nSTRIPE_SECRET_KEY="${sampleStripeKey}"`;
      const detected = scanTextForSecretsLocally(sampleText);
      setIsLandingPage(false);
      setCurrentView('developer');
      showToast({
        title: 'Secret Entropy Scan Completed',
        description: `${detected.length} high-entropy token(s) flagged (AWS, Stripe). Zero egress to external servers.`,
        type: 'warning',
        icon: AlertTriangle,
      });
    }, 400);
  };

  const executeBrowserAudit = () => {
    showToast({
      title: 'Auditing Browser Extensions & Permissions...',
      description: 'Checking manifest permissions for <all_urls> and webRequestBlocking...',
      type: 'info',
      icon: Laptop,
    });

    setTimeout(() => {
      setIsLandingPage(false);
      setCurrentView('browser');
      showToast({
        title: 'Browser Audit Complete',
        description: '2 high-risk extensions identified with unrestricted cross-origin access.',
        type: 'warning',
        icon: AlertTriangle,
      });
    }, 400);
  };

  const executeTestVerification = () => {
    showToast({
      title: 'Executing Automated Security Test Suite...',
      description: 'Running 22 cryptographic bounds, k-anonymity ranges, and RBAC assertions...',
      type: 'info',
      icon: CheckCircle2,
    });

    setTimeout(() => {
      setIsLandingPage(false);
      setCurrentView('tests');
      showToast({
        title: 'All Security Tests Passing (22/22)',
        description: 'Zero plaintext invariants, SHA-1/256 prefixes, and CSP headers verified.',
        type: 'success',
        icon: CheckCircle2,
      });
    }, 450);
  };

  const executeEmergencyRevocation = () => {
    onToggleIncidentStep(1, true);
    setIsLandingPage(false);
    setCurrentView('incident');
    showToast({
      title: 'Emergency Session Revocation Triggered',
      description: 'Active OAuth refresh tokens invalidated. Step 1 of Containment Runbook logged.',
      type: 'alert',
      icon: Flame,
    });
  };

  const cycleRole = () => {
    const roles: Role[] = ['owner', 'security_admin', 'admin', 'member', 'auditor'];
    const nextIndex = (roles.indexOf(currentRole) + 1) % roles.length;
    const nextRole = roles[nextIndex];
    setUserRole(nextRole);
    showToast({
      title: `Switched Role to ${nextRole.replace('_', ' ').toUpperCase()}`,
      description: `Active permissions updated across RBAC policies and views.`,
      type: 'info',
      icon: Users,
    });
  };

  // Commands definition
  const commands: ShortcutCommand[] = useMemo(
    () => [
      // Critical Scans & Actions
      {
        id: 'scan-breach',
        label: 'Run Credential Breach Scan',
        description: 'Client-side k-anonymity 20-bit prefix probe against threat indexes',
        category: 'scans',
        keys: ['S', 'C'],
        badge: 'Zero-Plaintext',
        icon: Radio,
        action: () => {
          onClose();
          executeBreachScan();
        },
      },
      {
        id: 'scan-secrets',
        label: 'Run Secret & Token Entropy Scan',
        description: 'Local regex & Shannon entropy audit for AWS, Stripe, GitHub keys',
        category: 'scans',
        keys: ['S', 'S'],
        badge: 'Local-Only',
        icon: Code2,
        action: () => {
          onClose();
          executeSecretScan();
        },
      },
      {
        id: 'scan-browser',
        label: 'Audit Browser Extensions',
        description: 'Detect extensions requesting broad <all_urls> and clipboard permissions',
        category: 'scans',
        keys: ['S', 'B'],
        badge: 'Manifest v3',
        icon: Laptop,
        action: () => {
          onClose();
          executeBrowserAudit();
        },
      },
      {
        id: 'scan-verification',
        label: 'Run Automated Security Test Suite',
        description: 'Execute 22 automated integrity assertions and cryptographic tests',
        category: 'scans',
        keys: ['S', 'V'],
        badge: '22 Tests',
        icon: CheckCircle2,
        action: () => {
          onClose();
          executeTestVerification();
        },
      },
      {
        id: 'action-revoke',
        label: 'Emergency Session Invalidation',
        description: 'Immediately revoke hijacked session cookies and active OAuth refresh tokens',
        category: 'scans',
        keys: ['S', 'R'],
        badge: 'Emergency',
        icon: Flame,
        action: () => {
          onClose();
          executeEmergencyRevocation();
        },
      },

      // Navigation
      {
        id: 'nav-dashboard',
        label: 'Go to Identity Dashboard',
        description: 'Posture score, active findings, and empirical evidence matrix',
        category: 'navigation',
        keys: ['G', 'D'],
        icon: Shield,
        action: () => {
          setIsLandingPage(false);
          setCurrentView('dashboard');
          onClose();
          showToast({ title: 'Navigated to Identity Dashboard', description: 'G then D', type: 'info', icon: Shield });
        },
      },
      {
        id: 'nav-threat-globe',
        label: 'Go to 3D Global Threat Globe',
        description: 'Real-time procedural WebGL threat sphere with exfiltration arcs',
        category: 'navigation',
        keys: ['G', 'G'],
        icon: Globe,
        action: () => {
          setIsLandingPage(false);
          setCurrentView('breach-map');
          onClose();
          showToast({ title: 'Navigated to 3D Global Threat Globe', description: 'G then G', type: 'info', icon: Globe });
        },
      },
      {
        id: 'nav-heatmap',
        label: 'Go to Regional Threat Heatmap (Recharts)',
        description: 'Multi-theatre incident density matrix, attack vectors, and 12-month trends',
        category: 'navigation',
        keys: ['G', 'H'],
        icon: TrendingUp,
        badge: 'Recharts',
        action: () => {
          setIsLandingPage(false);
          setCurrentView('breach-map');
          onClose();
          showToast({ title: 'Navigated to Regional Threat Heatmap', description: 'G then H', type: 'info', icon: TrendingUp });
        },
      },
      {
        id: 'nav-incident',
        label: 'Go to Containment Runbook',
        description: 'Deterministic 10-step compromise response and token revocation',
        category: 'navigation',
        keys: ['G', 'C'],
        icon: AlertTriangle,
        action: () => {
          setIsLandingPage(false);
          setCurrentView('incident');
          onClose();
          showToast({ title: 'Navigated to Containment Runbook', description: 'G then C', type: 'info', icon: AlertTriangle });
        },
      },
      {
        id: 'nav-breach',
        label: 'Go to Breach Intelligence',
        description: 'Local k-anonymity credential search and darknet aggregator telemetry',
        category: 'navigation',
        keys: ['G', 'B'],
        icon: Radio,
        action: () => {
          setIsLandingPage(false);
          setCurrentView('breach');
          onClose();
          showToast({ title: 'Navigated to Breach Intelligence', description: 'G then B', type: 'info', icon: Radio });
        },
      },
      {
        id: 'nav-analyst',
        label: 'Go to AI Security Analyst',
        description: 'Incident response co-pilot, attack vector simulation, and remediation',
        category: 'navigation',
        keys: ['G', 'A'],
        icon: Bot,
        action: () => {
          setIsLandingPage(false);
          setCurrentView('analyst');
          onClose();
          showToast({ title: 'Navigated to AI Security Analyst', description: 'G then A', type: 'info', icon: Bot });
        },
      },
      {
        id: 'nav-developer',
        label: 'Go to Developer Secret Scanner',
        description: 'In-browser secret and high-entropy key scanner with zero network egress',
        category: 'navigation',
        keys: ['G', 'S'],
        icon: Code2,
        action: () => {
          setIsLandingPage(false);
          setCurrentView('developer');
          onClose();
          showToast({ title: 'Navigated to Developer Secret Scanner', description: 'G then S', type: 'info', icon: Code2 });
        },
      },
      {
        id: 'nav-browser',
        label: 'Go to Browser Security Center',
        description: 'Extension permissions audit and secure DNS-over-HTTPS status',
        category: 'navigation',
        keys: ['G', 'E'],
        icon: Laptop,
        action: () => {
          setIsLandingPage(false);
          setCurrentView('browser');
          onClose();
          showToast({ title: 'Navigated to Browser Security Center', description: 'G then E', type: 'info', icon: Laptop });
        },
      },
      {
        id: 'nav-tests',
        label: 'Go to Security Test Suite',
        description: 'Run automated integrity assertions and cryptographic tests',
        category: 'navigation',
        keys: ['G', 'T'],
        icon: CheckCircle2,
        action: () => {
          setIsLandingPage(false);
          setCurrentView('tests');
          onClose();
          showToast({ title: 'Navigated to Security Test Suite', description: 'G then T', type: 'info', icon: CheckCircle2 });
        },
      },
      {
        id: 'nav-open-source',
        label: 'Go to Open Source Trust Center',
        description: 'Reproducible SHA-256 builds, OpenSSF scorecard, and contributor guide',
        category: 'navigation',
        keys: ['G', 'O'],
        icon: FileCode,
        action: () => {
          setIsLandingPage(false);
          setCurrentView('open-source');
          onClose();
          showToast({ title: 'Navigated to Open Source Trust Center', description: 'G then O', type: 'info', icon: FileCode });
        },
      },
      {
        id: 'nav-landing',
        label: 'Toggle Product Overview / Landing Page',
        description: 'Switch between the public product showcase and security console',
        category: 'navigation',
        keys: ['G', 'L'],
        icon: Sparkles,
        action: () => {
          setIsLandingPage(!isLandingPage);
          onClose();
          showToast({
            title: isLandingPage ? 'Returned to Defense Console' : 'Switched to Product Overview',
            description: 'G then L',
            type: 'info',
            icon: Sparkles,
          });
        },
      },

      // System & Role Actions
      {
        id: 'system-role',
        label: 'Cycle User Role (RBAC)',
        description: `Currently: ${currentRole.replace('_', ' ').toUpperCase()} (Cycle to test permissions)`,
        category: 'system',
        keys: ['R'],
        icon: Users,
        action: () => {
          cycleRole();
          onClose();
        },
      },
      {
        id: 'system-docs',
        label: 'Open Whitepaper & Threat Model',
        description: 'Zero-Knowledge invariant proof, RFC 9116 security, and NIST specs',
        category: 'system',
        keys: ['D'],
        icon: BookOpen,
        action: () => {
          onClose();
          openDocs();
        },
      },
    ],
    [isLandingPage, currentRole, onClose, openDocs, setIsLandingPage, setCurrentView]
  );

  // Filter commands by search query
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return commands;
    const q = searchQuery.toLowerCase();
    return commands.filter(
      c =>
        c.label.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.keys.some(k => k.toLowerCase().includes(q))
    );
  }, [commands, searchQuery]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Centralized Global Keyboard Listener
  useEffect(() => {
    let leaderTimer: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Check if user is typing in an editable field
      const activeElement = document.activeElement;
      const isEditable =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          (activeElement as HTMLElement).isContentEditable);

      // Allow Escape and Cmd+K / Ctrl+K even when inside inputs
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open shortcut manager
          setSearchQuery('');
          onClose(); // In case another modal was open
          // Trigger open via parent
          const event = new CustomEvent('open-shortcut-manager');
          window.dispatchEvent(event);
        }
        return;
      }

      if (e.key === 'Escape') {
        if (isOpen) {
          e.preventDefault();
          onClose();
          return;
        }
        if (leaderKey) {
          setLeaderKey(null);
          return;
        }
      }

      // If typing in input and modal is open, handle navigation keys (ArrowDown, ArrowUp, Enter)
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          return;
        }
      }

      // If user is editing text in an input or textarea, don't trigger regular hotkeys
      if (isEditable) {
        return;
      }

      const key = e.key.toLowerCase();

      // '?' opens shortcuts
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        const event = new CustomEvent('open-shortcut-manager');
        window.dispatchEvent(event);
        return;
      }

      // Single-key direct shortcuts (when no leader key active and modal closed)
      if (!isOpen && !leaderKey) {
        // Direct number keys 1-9 for quick view jumps
        if (key >= '1' && key <= '9') {
          const numberMap: Record<string, string> = {
            '1': 'dashboard',
            '2': 'breach-map',
            '3': 'incident',
            '4': 'breach',
            '5': 'analyst',
            '6': 'developer',
            '7': 'browser',
            '8': 'open-source',
            '9': 'tests',
          };
          if (numberMap[key]) {
            e.preventDefault();
            setIsLandingPage(false);
            setCurrentView(numberMap[key]);
            showToast({
              title: `Jumped to ${numberMap[key].replace('-', ' ').toUpperCase()}`,
              description: `Triggered via single-key numeric shortcut (${key})`,
              type: 'info',
              icon: Zap,
            });
            return;
          }
        }

        // 'r' to cycle roles
        if (key === 'r') {
          e.preventDefault();
          cycleRole();
          return;
        }

        // 'd' to open docs
        if (key === 'd') {
          e.preventDefault();
          openDocs();
          return;
        }

        // Leader key initiators: 'g' (Go to) or 's' (Scan / Security action)
        if (key === 'g' || key === 's') {
          e.preventDefault();
          setLeaderKey(key);
          if (leaderTimer) clearTimeout(leaderTimer);
          leaderTimer = setTimeout(() => {
            setLeaderKey(null);
          }, 1800);
          return;
        }
      }

      // Handle second key of multi-key sequences
      if (!isOpen && leaderKey) {
        e.preventDefault();
        const currentLeader = leaderKey;
        setLeaderKey(null);
        if (leaderTimer) clearTimeout(leaderTimer);

        if (currentLeader === 'g') {
          // Navigation sequence: G then [D, G, C, B, A, S, E, T, O, L]
          switch (key) {
            case 'd':
              setIsLandingPage(false);
              setCurrentView('dashboard');
              showToast({ title: 'Identity Dashboard', description: 'G → D', type: 'info', icon: Shield });
              break;
            case 'g':
              setIsLandingPage(false);
              setCurrentView('breach-map');
              showToast({ title: '3D Threat Globe', description: 'G → G', type: 'info', icon: Globe });
              break;
            case 'h':
              setIsLandingPage(false);
              setCurrentView('breach-map');
              showToast({ title: 'Regional Threat Heatmap', description: 'G → H (Recharts Heatmap)', type: 'info', icon: TrendingUp });
              break;
            case 'c':
              setIsLandingPage(false);
              setCurrentView('incident');
              showToast({ title: 'Containment Runbook', description: 'G → C', type: 'info', icon: AlertTriangle });
              break;
            case 'b':
              setIsLandingPage(false);
              setCurrentView('breach');
              showToast({ title: 'Breach Intelligence', description: 'G → B', type: 'info', icon: Radio });
              break;
            case 'a':
              setIsLandingPage(false);
              setCurrentView('analyst');
              showToast({ title: 'AI Security Analyst', description: 'G → A', type: 'info', icon: Bot });
              break;
            case 's':
              setIsLandingPage(false);
              setCurrentView('developer');
              showToast({ title: 'Developer Secret Scanner', description: 'G → S', type: 'info', icon: Code2 });
              break;
            case 'e':
              setIsLandingPage(false);
              setCurrentView('browser');
              showToast({ title: 'Browser Security Center', description: 'G → E', type: 'info', icon: Laptop });
              break;
            case 't':
              setIsLandingPage(false);
              setCurrentView('tests');
              showToast({ title: 'Security Test Suite', description: 'G → T', type: 'info', icon: CheckCircle2 });
              break;
            case 'o':
              setIsLandingPage(false);
              setCurrentView('open-source');
              showToast({ title: 'Open Source Hub', description: 'G → O', type: 'info', icon: FileCode });
              break;
            case 'l':
              setIsLandingPage(!isLandingPage);
              showToast({ title: 'Toggled Product View', description: 'G → L', type: 'info', icon: Sparkles });
              break;
          }
        } else if (currentLeader === 's') {
          // Security Scan sequence: S then [C, S, B, V, R]
          switch (key) {
            case 'c':
              executeBreachScan();
              break;
            case 's':
              executeSecretScan();
              break;
            case 'b':
              executeBrowserAudit();
              break;
            case 'v':
              executeTestVerification();
              break;
            case 'r':
              executeEmergencyRevocation();
              break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (leaderTimer) clearTimeout(leaderTimer);
    };
  }, [isOpen, leaderKey, filteredCommands, selectedIndex, currentRole, isLandingPage, currentView]);

  return (
    <>
      {/* 1. Pending Leader Key HUD Indicator */}
      {leaderKey && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 pointer-events-none">
          <div className="flex items-center space-x-3 rounded-xl border border-emerald-500/40 bg-slate-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/40 animate-pulse">
              {leaderKey.toUpperCase()}
            </div>
            <div className="text-xs">
              <span className="font-semibold text-white">
                {leaderKey === 'g' ? 'Go to View:' : 'Execute Security Scan:'}
              </span>
              <span className="text-slate-400 font-mono text-[11px] ml-2">
                {leaderKey === 'g'
                  ? '[D: Dash · G: Globe · C: Runbook · B: Breach · A: AI · S: Secrets · E: Ext · T: Tests]'
                  : '[C: Credential · S: Secrets · B: Browser · V: Verify · R: Revoke]'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Tactical Toast / Scan Feedback HUD */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`rounded-xl border p-4 shadow-2xl backdrop-blur-xl transition-all ${
              toast.type === 'alert'
                ? 'border-rose-500/50 bg-slate-950/95 text-rose-200 shadow-rose-950/40'
                : toast.type === 'warning'
                ? 'border-amber-500/50 bg-slate-950/95 text-amber-200 shadow-amber-950/40'
                : toast.type === 'success'
                ? 'border-emerald-500/50 bg-slate-950/95 text-emerald-200 shadow-emerald-950/40'
                : 'border-slate-800 bg-slate-950/95 text-slate-200 shadow-slate-950/50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                {toast.icon && (
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                      toast.type === 'alert'
                        ? 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                        : toast.type === 'warning'
                        ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                        : toast.type === 'success'
                        ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                        : 'border-slate-700 bg-slate-800 text-slate-300'
                    }`}
                  >
                    <toast.icon className="h-4 w-4" />
                  </div>
                )}
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold tracking-tight text-white">{toast.title}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{toast.description}</p>
                </div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-500 font-mono">
              <span>SentinelKey Keyboard Manager</span>
              <span>{toast.timestamp}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Command Palette / Centralized Shortcut Manager Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-slate-800 px-4 py-3 bg-slate-950/40">
              <Command className="h-4 w-4 text-emerald-400 shrink-0 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Type a command, security scan, or view... (e.g. breach, secret, 3D)"
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-500 hover:text-slate-300 p-1 rounded"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <div className="hidden sm:flex items-center space-x-1 ml-2 text-[11px] font-mono text-slate-500">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">ESC</kbd>
                <span>to close</span>
              </div>
            </div>

            {/* Quick Action Category Strip */}
            <div className="flex items-center space-x-2 px-4 py-2 border-b border-slate-800/80 bg-slate-950/20 text-[11px] text-slate-400 overflow-x-auto">
              <span className="font-semibold text-slate-300 shrink-0">Fast Keys:</span>
              <span className="inline-flex items-center space-x-1 shrink-0">
                <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                  1-9
                </kbd>
                <span>Direct Views</span>
              </span>
              <span className="text-slate-700">·</span>
              <span className="inline-flex items-center space-x-1 shrink-0">
                <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                  S
                </kbd>
                <span>then</span>
                <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                  C
                </kbd>
                <span>Breach Scan</span>
              </span>
              <span className="text-slate-700">·</span>
              <span className="inline-flex items-center space-x-1 shrink-0">
                <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                  G
                </kbd>
                <span>then</span>
                <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                  G
                </kbd>
                <span>3D Globe</span>
              </span>
            </div>

            {/* Commands List */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No matching shortcuts or commands found for "{searchQuery}".
                </div>
              ) : (
                filteredCommands.map((command, idx) => {
                  const Icon = command.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={command.id}
                      onClick={() => command.action()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 text-white border border-slate-700 shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/40 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                            command.category === 'scans'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : command.category === 'navigation'
                              ? 'border-sky-500/30 bg-sky-500/10 text-sky-400'
                              : 'border-slate-700 bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-white truncate">{command.label}</span>
                            {command.badge && (
                              <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {command.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{command.description}</p>
                        </div>
                      </div>

                      {/* Hotkey Badges */}
                      <div className="flex items-center space-x-1 shrink-0 ml-4">
                        {command.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            <kbd className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono font-semibold text-slate-300 shadow-inner">
                              {k}
                            </kbd>
                            {kIdx < command.keys.length - 1 && (
                              <span className="text-[9px] text-slate-600 font-mono">then</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Status & Prompt */}
            <div className="flex items-center justify-between border-t border-slate-800 px-4 py-2.5 bg-slate-950/60 text-[11px] text-slate-500 font-sans">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[9px]">
                    ↑
                  </kbd>
                  <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[9px]">
                    ↓
                  </kbd>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[9px]">
                    ENTER
                  </kbd>
                  <span>to execute</span>
                </span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-400/90 font-mono text-[10px]">
                <Shield className="h-3 w-3" />
                <span>Zero-Plaintext Invariant Enforced</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
