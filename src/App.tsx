import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { IdentityDashboard } from './components/IdentityDashboard';
import { CompromiseResponseCenter } from './components/CompromiseResponseCenter';
import { BrowserSecurityCenter } from './components/BrowserSecurityCenter';
import { BreachIntelligenceView } from './components/BreachIntelligenceView';
import { GlobalBreachMapView } from './components/GlobalBreachMapView';
import { AiSecurityAnalyst } from './components/AiSecurityAnalyst';
import { SecurityGraphView } from './components/SecurityGraphView';
import { SecurityTimelineView } from './components/SecurityTimelineView';
import { DeveloperSecurityView } from './components/DeveloperSecurityView';
import { FamilySecurityView } from './components/FamilySecurityView';
import { BusinessSecurityView } from './components/BusinessSecurityView';
import { PricingView } from './components/PricingView';
import { TestRunnerView } from './components/TestRunnerView';
import { OpenSourceHubView } from './components/OpenSourceHubView';
import { DocumentationModal } from './components/DocumentationModal';
import { KeyboardShortcutManager } from './components/KeyboardShortcutManager';
import {
  CURRENT_USER,
  INITIAL_POSTURE,
  INITIAL_FINDINGS,
  INITIAL_INCIDENT_STEPS,
  INITIAL_BROWSERS,
  INITIAL_EXTENSIONS,
  INITIAL_MONITORED_IDENTITIES,
  INITIAL_DEVICES,
  INITIAL_SECURITY_POLICIES,
  INITIAL_SECURITY_EVENTS,
  INITIAL_GRAPH_NODES,
  INITIAL_GRAPH_EDGES,
  INITIAL_FAMILY_MEMBERS,
} from './lib/mockSecurityData';
import { Role, RiskFinding, IncidentStep, SecurityPosture, User, SecurityPolicy } from './types';
import { calculatePostureGrade } from './lib/cryptoUtils';

export default function App() {
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [posture, setPosture] = useState<SecurityPosture>(INITIAL_POSTURE);
  const [findings, setFindings] = useState<RiskFinding[]>(INITIAL_FINDINGS);
  const [incidentSteps, setIncidentSteps] = useState<IncidentStep[]>(INITIAL_INCIDENT_STEPS);
  const [policies, setPolicies] = useState<SecurityPolicy[]>(INITIAL_SECURITY_POLICIES);
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [analystInitialPrompt, setAnalystInitialPrompt] = useState<string>('');
  const [focusedFinding, setFocusedFinding] = useState<RiskFinding | null>(null);

  useEffect(() => {
    const handleOpenShortcuts = () => setShowShortcutsModal(true);
    window.addEventListener('open-shortcut-manager', handleOpenShortcuts);
    return () => window.removeEventListener('open-shortcut-manager', handleOpenShortcuts);
  }, []);

  // Recalculate Posture dynamically based on remediation actions
  const recalculatePosture = (updatedFindings: RiskFinding[], updatedSteps: IncidentStep[]) => {
    let score = 55;
    const resolvedFindingsCount = updatedFindings.filter(f => f.remediationStatus === 'resolved').length;
    const completedStepsCount = updatedSteps.filter(s => s.isCompleted).length;

    score += resolvedFindingsCount * 7;
    score += completedStepsCount * 3;
    score = Math.min(99, Math.max(15, score));

    const grade = calculatePostureGrade(score);
    const riskLevel = score >= 85 ? 'LOW' : score >= 65 ? 'MODERATE' : 'CRITICAL';

    setPosture(prev => ({
      ...prev,
      overallScore: score,
      grade,
      identityRisk: riskLevel as any,
    }));
  };

  const handleUpdateFindingStatus = (
    id: string,
    status: 'open' | 'in_progress' | 'resolved' | 'ignored'
  ) => {
    const updated = findings.map(f => (f.id === id ? { ...f, remediationStatus: status } : f));
    setFindings(updated);
    recalculatePosture(updated, incidentSteps);
  };

  const handleToggleIncidentStep = async (
    stepNumber: number,
    completed: boolean,
    notes?: string
  ) => {
    const updated = incidentSteps.map(s =>
      s.stepNumber === stepNumber
        ? { ...s, isCompleted: completed, completedAt: completed ? new Date().toISOString() : undefined }
        : s
    );
    setIncidentSteps(updated);
    recalculatePosture(findings, updated);

    // Sync to server API in background
    try {
      await fetch('/api/incident/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber, completed }),
      });
    } catch (err) {
      console.error('Failed to sync incident step to server:', err);
    }
  };

  const handleResetIncident = () => {
    const reset = incidentSteps.map(s => ({
      ...s,
      isCompleted: s.stepNumber <= 3,
      completedAt: s.stepNumber <= 3 ? s.completedAt : undefined,
    }));
    setIncidentSteps(reset);
    recalculatePosture(findings, reset);
  };

  const handleAskAnalyst = (finding: RiskFinding) => {
    setFocusedFinding(finding);
    setAnalystInitialPrompt(
      `Please explain finding "${finding.title}" (${finding.severity}). What is the adversary vector and what exact steps should I take?`
    );
    setIsLandingPage(false);
    setCurrentView('analyst');
  };

  const handleTogglePolicy = (id: string, enabled: boolean) => {
    setPolicies(prev => prev.map(p => (p.id === id ? { ...p, enabled } : p)));
  };

  const incidentStepCount = incidentSteps.filter(s => s.isCompleted).length;

  return (
    <div className="app-shell min-h-screen flex flex-col text-slate-100 selection:bg-violet-500/30 selection:text-violet-100 antialiased font-sans">
      {/* Global Security Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        posture={posture}
        user={user}
        setUserRole={role => setUser(prev => ({ ...prev, role }))}
        incidentStepCount={incidentStepCount}
        openDocs={() => setShowDocsModal(true)}
        openShortcuts={() => setShowShortcutsModal(true)}
        isLandingPage={isLandingPage}
        setIsLandingPage={setIsLandingPage}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {isLandingPage ? (
          <LandingPage
            onScanClick={() => {
              setIsLandingPage(false);
              setCurrentView('dashboard');
            }}
            onHowItWorksClick={() => {
              setIsLandingPage(false);
              setCurrentView('breach-map');
            }}
            openDocs={() => setShowDocsModal(true)}
          />
        ) : (
          <>
            {currentView === 'dashboard' && (
              <IdentityDashboard
                posture={posture}
                findings={findings}
                onUpdateFindingStatus={handleUpdateFindingStatus}
                onNavigateToIncident={() => setCurrentView('incident')}
                onAskAnalyst={handleAskAnalyst}
                events={INITIAL_SECURITY_EVENTS}
              />
            )}

            {currentView === 'incident' && (
              <CompromiseResponseCenter
                steps={incidentSteps}
                onToggleStep={handleToggleIncidentStep}
                onResetIncident={handleResetIncident}
              />
            )}

            {currentView === 'browser' && (
              <BrowserSecurityCenter
                browsers={INITIAL_BROWSERS}
                extensions={INITIAL_EXTENSIONS}
              />
            )}

            {currentView === 'breach' && (
              <BreachIntelligenceView
                monitoredIdentities={INITIAL_MONITORED_IDENTITIES}
                onNavigateToBreachMap={() => setCurrentView('breach-map')}
              />
            )}

            {currentView === 'breach-map' && (
              <GlobalBreachMapView
                onNavigateToIncident={() => setCurrentView('incident')}
                onNavigateToGraph={() => setCurrentView('graph')}
              />
            )}

            {currentView === 'analyst' && (
              <AiSecurityAnalyst
                initialPrompt={analystInitialPrompt}
                focusedFinding={focusedFinding}
              />
            )}

            {currentView === 'graph' && (
              <SecurityGraphView
                nodes={INITIAL_GRAPH_NODES}
                edges={INITIAL_GRAPH_EDGES}
              />
            )}

            {currentView === 'timeline' && (
              <SecurityTimelineView
                events={INITIAL_SECURITY_EVENTS}
              />
            )}

            {currentView === 'developer' && (
              <DeveloperSecurityView />
            )}

            {currentView === 'family' && (
              <FamilySecurityView
                members={INITIAL_FAMILY_MEMBERS}
              />
            )}

            {currentView === 'business' && (
              <BusinessSecurityView
                currentRole={user.role}
                devices={INITIAL_DEVICES}
                policies={policies}
                onTogglePolicy={handleTogglePolicy}
              />
            )}

            {currentView === 'tests' && (
              <TestRunnerView />
            )}

            {currentView === 'pricing' && (
              <PricingView />
            )}

            {currentView === 'open-source' && (
              <OpenSourceHubView />
            )}
          </>
        )}
      </main>

      {/* Global Defense Footer */}
      <Footer openDocs={() => setShowDocsModal(true)} />

      {/* Embedded Whitepaper & Threat Model Modal */}
      <DocumentationModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />

      {/* Centralized Keyboard Shortcut Manager & Command Palette */}
      <KeyboardShortcutManager
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isLandingPage={isLandingPage}
        setIsLandingPage={setIsLandingPage}
        openDocs={() => setShowDocsModal(true)}
        currentRole={user.role}
        setUserRole={role => setUser(prev => ({ ...prev, role }))}
        onUpdateFindingStatus={handleUpdateFindingStatus}
        onToggleIncidentStep={handleToggleIncidentStep}
        findings={findings}
        incidentSteps={incidentSteps}
      />
    </div>
  );
}
