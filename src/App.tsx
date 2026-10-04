import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { PublicVerify } from './pages/PublicVerify';
import { StandardsMatrix } from './pages/StandardsMatrix';
import { ValidationPackPage } from './pages/ValidationPackPage';
import { Docs } from './pages/Docs';
import { PublicOther } from './pages/PublicOther';
import { Dashboard } from './pages/portal/Dashboard';
import { NewReportWizard } from './pages/portal/NewReportWizard';
import { ReportWorkspace } from './pages/portal/ReportWorkspace';
import { ReportPreviewView } from './pages/portal/ReportPreviewView';
import { ReviewQueueView } from './pages/portal/ReviewQueueView';
import { EquipmentView } from './pages/portal/EquipmentView';
import { AuditLogView } from './pages/portal/AuditLogView';
import { AdminView } from './pages/portal/AdminView';
import { SihPresentation } from './pages/SihPresentation';
import { storageService, DEFAULT_USERS } from './services/storage';
import { supabaseStorage } from './services/supabaseStorage';
import { UserProfile } from './types/metrology';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return storageService.getCurrentUser();
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Automatic Cloud Sync with Supabase PostgreSQL on startup
  useEffect(() => {
    supabaseStorage.getReports().then(({ reports, fromSupabase }) => {
      if (fromSupabase) {
        console.log(`[TraceR76] Synced ${reports.length} reports from Supabase Cloud.`);
      }
    }).catch(e => console.warn('Supabase sync skipped:', e));
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserChange = (user: UserProfile) => {
    setCurrentUser(user);
    storageService.setCurrentUser(user);
  };

  // Route matching logic
  const renderCurrentView = () => {
    // 1. Report Preview Route: /app/reports/:id/preview
    const previewMatch = currentPath.match(/^\/app\/reports\/([^/]+)\/preview$/);
    if (previewMatch) {
      return (
        <ReportPreviewView
          reportId={previewMatch[1]}
          onNavigate={navigate}
          currentUser={currentUser}
        />
      );
    }

    // 2. Report Workspace Route: /app/reports/:id or /app/reports/:id/tests/:type
    const reportWorkspaceMatch = currentPath.match(/^\/app\/reports\/([^/]+)(?:\/tests\/([^/]+))?$/);
    if (reportWorkspaceMatch && reportWorkspaceMatch[1] !== 'new') {
      return (
        <ReportWorkspace
          reportId={reportWorkspaceMatch[1]}
          onNavigate={navigate}
          currentUser={currentUser}
        />
      );
    }

    // 3. New Report Wizard: /app/reports/new
    if (currentPath === '/app/reports/new') {
      return <NewReportWizard onNavigate={navigate} currentUser={currentUser} />;
    }

    // 4. Portal Dashboard & Reports list: /app/dashboard or /app/reports
    if (currentPath === '/app/dashboard' || currentPath === '/app/reports' || currentPath === '/app') {
      return <Dashboard onNavigate={navigate} currentUser={currentUser} />;
    }

    // 5. Review Queue: /app/review or /app/reports/:id/review
    if (currentPath.startsWith('/app/review') || currentPath.includes('/review')) {
      return <ReviewQueueView onNavigate={navigate} currentUser={currentUser} />;
    }

    // 6. Equipment & Weights Registry: /app/equipment or /app/weights
    if (currentPath === '/app/equipment' || currentPath === '/app/weights') {
      return <EquipmentView onNavigate={navigate} currentUser={currentUser} />;
    }

    // 7. Audit Log: /app/audit
    if (currentPath === '/app/audit') {
      return <AuditLogView />;
    }

    // 8. Admin Settings: /app/admin or /app/profile
    if (currentPath === '/app/admin' || currentPath === '/app/profile') {
      return <AdminView onNavigate={navigate} currentUser={currentUser} />;
    }

    // --- PUBLIC SITE ROUTES ---

    // 9. Verify Report Route: /verify or /verify/:reportId
    const verifyMatch = currentPath.match(/^\/verify(?:\/([^/]+))?$/);
    if (verifyMatch) {
      return <PublicVerify initialReportId={verifyMatch[1]} onNavigate={navigate} />;
    }

    // 10. Standards Matrix: /standards
    if (currentPath === '/standards') {
      return <StandardsMatrix onNavigate={navigate} />;
    }

    // 11. Validation Pack: /validation
    if (currentPath === '/validation') {
      return <ValidationPackPage />;
    }

    // 12. Documentation & Glossary: /docs
    if (currentPath === '/docs') {
      return <Docs />;
    }

    // 13. Features, How-it-works, Pricing, Security, Contact, About, Terms
    const publicOtherViews = ['features', 'how-it-works', 'pricing', 'security', 'about', 'contact', 'privacy', 'terms'] as const;
    const foundOther = publicOtherViews.find(v => currentPath === `/${v}`);
    if (foundOther) {
      return <PublicOther view={foundOther} onNavigate={navigate} />;
    }

    // 14. SIH Presentation Pitch Deck (6 Slides)
    if (currentPath === '/sih-ppt') {
      return <SihPresentation onNavigate={navigate} />;
    }

    // 15. Fallback / Home: /
    return <Home onNavigate={navigate} />;
  };

  if (currentPath === '/sih-ppt') {
    return <SihPresentation onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
};

export default App;
