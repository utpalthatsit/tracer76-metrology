import React, { useState } from 'react';
import { Shield, Scale, ChevronDown, Check, User, ExternalLink, FileSearch, ArrowRight, LayoutDashboard, FileText, CheckSquare, Layers, History, Settings, LogOut, Database } from 'lucide-react';
import { UserProfile, UserRole } from '../types/metrology';
import { DEFAULT_USERS, storageService } from '../services/storage';
import { getSupabaseConfig } from '../services/supabaseClient';
import { SupabaseModal } from './SupabaseModal';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  currentUser,
  onUserChange,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const supabaseConfig = getSupabaseConfig();

  const isPortal = currentPath.startsWith('/app');

  const publicLinks = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Standards Matrix', path: '/standards' },
    { label: 'Verify Report', path: '/verify' },
    { label: 'Docs', path: '/docs' },
    { label: 'Validation Pack', path: '/validation' },
    { label: 'SIH 2026 PPT', path: '/sih-ppt' },
  ];

  const portalLinks = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Reports', path: '/app/reports', icon: FileText },
    { label: 'Review Queue', path: '/app/review', icon: CheckSquare, badge: 1 },
    { label: 'Equipment & Weights', path: '/app/equipment', icon: Layers },
    { label: 'Audit Log', path: '/app/audit', icon: History },
    { label: 'Lab Admin', path: '/app/admin', icon: Settings },
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'test_engineer':
        return { label: 'Test Engineer', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'reviewer':
        return { label: 'Tech Reviewer', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'approver':
        return { label: 'Approver / Signatory', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'lab_admin':
        return { label: 'Lab Admin', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'quality_manager':
        return { label: 'Quality Manager', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      default:
        return { label: 'Applicant / Client', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const badgeInfo = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner for Role & Separation of Duties */}
      {isPortal && (
        <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Laboratory Testing Portal</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Tenant: <strong className="text-white">{currentUser.labName}</strong></span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-slate-400">
              Role: <strong className="text-blue-300 capitalize">{currentUser.name} ({badgeInfo.label})</strong>
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-amber-300 font-medium hidden sm:inline">
              ISO 17025 Duty Separation Active
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(isPortal ? '/app/dashboard' : '/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black text-slate-900 tracking-tight">TraceR<span className="text-blue-600">76</span></span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase font-mono">
                  v3.0
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                OIML R 76 NAWI METROLOGY
              </p>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="hidden md:flex items-center space-x-1">
            {!isPortal ? (
              // Public links
              publicLinks.map((item) => (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentPath === item.path
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))
            ) : (
              // Portal links
              portalLinks.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || (item.path !== '/app/dashboard' && currentPath.startsWith(item.path));
                return (
                  <button
                    key={item.path}
                    onClick={() => onNavigate(item.path)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition relative ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </nav>

          {/* Right zone: Switch Zone / User switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Toggle between Public and Portal */}
            {!isPortal ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('/verify')}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
                >
                  <FileSearch className="w-3.5 h-3.5 text-slate-500" />
                  <span>Verify Report</span>
                </button>
                <button
                  onClick={() => onNavigate('/app/dashboard')}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                >
                  <span>Lab Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('/')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center space-x-1"
                >
                  <span>Public Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Supabase Cloud Connection Status Button */}
            <button
              type="button"
              onClick={() => setIsSupabaseModalOpen(true)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
                supabaseConfig.isConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Configure Supabase Database"
            >
              <Database className={`w-3.5 h-3.5 ${supabaseConfig.isConfigured ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">
                {supabaseConfig.isConfigured ? 'Supabase' : 'Connect DB'}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${supabaseConfig.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            </button>

            {/* Role Switcher Dropdown (for easy demoing of Separation of Duties) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 p-1.5 pl-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-left transition"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
                  {currentUser.avatar || currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-bold text-slate-900 leading-none truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize leading-none mt-0.5">
                    {badgeInfo.label}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Switch Role (Separation of Duties Demo)
                    </span>
                  </div>

                  {DEFAULT_USERS.map((usr) => {
                    const isSelected = usr.id === currentUser.id;
                    const usrBadge = getRoleBadge(usr.role);
                    return (
                      <button
                        key={usr.id}
                        type="button"
                        onClick={() => {
                          onUserChange(usr);
                          storageService.setCurrentUser(usr);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition ${
                          isSelected ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <div>
                          <div className="text-xs text-slate-900">{usr.name}</div>
                          <div className="text-[10px] text-slate-500">{usrBadge.label}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}

                  <div className="border-t border-slate-100 mt-2 pt-2 px-3">
                    <p className="text-[10px] text-slate-400 leading-tight">
                      * OIML & ISO 17025 enforce that the Test Engineer cannot review or approve their own reports.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </header>
  );
};
