import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  UserCheck,
  Play,
  Code2,
  User,
  ChevronDown,
  LogOut,
  ShieldCheck,
  BarChart2,
  LogIn,
  UserPlus,
  Settings,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CandidateProfile } from '../types';

interface HeaderProps {
  isAuthenticated: boolean;
  currentUser: { name: string; email: string; role: string; avatar: string } | null;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onLogout: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCandidate: CandidateProfile;
  setSelectedCandidate: (candidate: CandidateProfile) => void;
  candidatesList: CandidateProfile[];
  onStartInterviewClick: () => void;
  onOpenTechSpec: () => void;
  onOpenSteerPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  currentUser,
  onOpenLogin,
  onOpenSignup,
  onLogout,
  currentView,
  setCurrentView,
  selectedCandidate,
  setSelectedCandidate,
  candidatesList,
  onStartInterviewClick,
  onOpenTechSpec,
  onOpenSteerPanel
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'dashboard', label: 'Home' },
    { id: 'candidates', label: 'Candidates' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'my-interviews', label: 'Interviews' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const landingNavLinks = [
    { id: 'platform', label: 'Platform' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'ai-interviewer', label: 'AI Interviewer' },
    { id: 'reports', label: 'Reports' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleLandingNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isLandingMode = !isAuthenticated || currentView === 'landing';

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-2xl dark:bg-[#030712]/90 bg-white/95 dark:border-white/10 border-slate-200 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* 1. DISTINCT LOGO AREA (Always Visible) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          >
            {/* Glowing Icon Container */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full dark:bg-[#030712] bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>
            </div>

            {/* Brand Name & Enterprise Badge */}
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight dark:text-white text-slate-900 group-hover:text-blue-500 transition-colors">
                ABTalks <span className="text-blue-500">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold tracking-wider rounded-md border dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400 bg-blue-50 border-blue-200 text-blue-700 shadow-sm">
                ENTERPRISE
              </span>
            </div>
          </button>
        </div>

        {/* 2. NAVIGATION LINKS - DYNAMIC FOR LANDING VS AUTHENTICATED APP */}
        {isLandingMode ? (
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-semibold">
            {landingNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLandingNavClick(link.id)}
                className="dark:text-slate-300 text-slate-600 hover:dark:text-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium">
            {navLinks.map((nav) => {
              const isActive = currentView === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setCurrentView(nav.id)}
                  className={`relative py-1.5 transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'dark:text-white text-slate-900 font-bold'
                      : 'dark:text-slate-300 text-slate-600 hover:dark:text-white hover:text-slate-900'
                  }`}
                >
                  <span>{nav.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm shadow-blue-500/50" />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* 3. RIGHT ACTIONS - DYNAMIC AUTH VS LANDING MODE */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">

          {/* Steer Challenge / Dev Control Panel Button */}
          {onOpenSteerPanel && (
            <button
              onClick={onOpenSteerPanel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-bold cursor-pointer shadow-sm"
              title="Open Steer Challenge & Mock Preset Control Panel"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden sm:inline">Steer Panel</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl dark:bg-white/5 bg-slate-100 dark:border-white/10 border-slate-200 border dark:text-slate-300 text-slate-600 hover:dark:text-white hover:text-slate-900 hover:dark:bg-white/10 hover:bg-slate-200 transition-colors focus:outline-none cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* AUTHENTICATED MODE vs UNAUTHENTICATED MODE BUTTONS */}
          {isAuthenticated && currentUser ? (
            <>
              {/* User Profile Avatar Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl dark:bg-white/5 bg-slate-100 dark:border-white/10 border-slate-200 border hover:dark:bg-white/10 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-2 ring-blue-500/40"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-[11px] font-bold dark:text-white text-slate-900 leading-tight">{currentUser.name}</p>
                    <p className="text-[9px] dark:text-slate-400 text-slate-500 leading-none">{currentUser.role.slice(0, 18)}...</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 dark:text-slate-400 text-slate-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl dark:bg-[#090d16]/95 bg-white dark:border-white/15 border-slate-200 border backdrop-blur-2xl shadow-2xl p-3 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Info Header */}
                    <div className="p-2.5 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/10 border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/40"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold dark:text-white text-slate-900 truncate">{currentUser.name}</p>
                          <p className="text-[10px] dark:text-slate-400 text-slate-500 truncate">{currentUser.email}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-extrabold dark:bg-blue-500/20 bg-blue-100 dark:text-blue-300 text-blue-700">
                            {currentUser.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Target Candidate Switcher */}
                    <div className="space-y-1.5">
                      <p className="px-1 text-[10px] font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">
                        Selected Candidate Profile
                      </p>
                      <select
                        value={selectedCandidate.id}
                        onChange={(e) => {
                          const found = candidatesList.find(c => c.id === e.target.value);
                          if (found) setSelectedCandidate(found);
                        }}
                        className="w-full p-2 rounded-xl text-xs font-semibold dark:bg-white/5 bg-slate-100 dark:border-white/10 border-slate-200 border dark:text-white text-slate-900 focus:outline-none cursor-pointer"
                      >
                        {candidatesList.map((c) => (
                          <option key={c.id} value={c.id} className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">
                            {c.name} ({c.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Links & Actions */}
                    <div className="space-y-1 pt-2 border-t dark:border-white/10 border-slate-200">
                      <button
                        onClick={() => {
                          setCurrentView('analytics');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium dark:text-slate-300 text-slate-700 hover:dark:bg-white/10 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
                        <span>Evaluation Analytics</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('settings');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium dark:text-slate-300 text-slate-700 hover:dark:bg-white/10 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Account Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary High-Contrast Gradient CTA Button */}
              <button
                onClick={onStartInterviewClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] border border-white/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Interview</span>
              </button>
            </>
          ) : (
            /* UNAUTHENTICATED STATE BUTTONS: LOG IN & GET STARTED */
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold dark:text-slate-200 text-slate-700 dark:bg-white/5 bg-slate-100 hover:dark:bg-white/10 hover:bg-slate-200 border dark:border-white/10 border-slate-200 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-500" />
                <span>Log In</span>
              </button>

              <button
                onClick={onOpenSignup}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] border border-white/20 transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-100 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* MOBILE SLIDE-DOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t dark:border-white/10 border-slate-200 dark:bg-[#050b1a] bg-white space-y-3 animate-in fade-in slide-in-from-top-2">
          {isLandingMode ? (
            <nav className="flex flex-col space-y-1 text-xs font-semibold text-slate-300">
              {landingNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLandingNavClick(link.id)}
                  className="text-left py-2 px-3 rounded-lg dark:hover:bg-white/10 hover:bg-slate-100 dark:text-slate-200 text-slate-800"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          ) : (
            <nav className="flex flex-col space-y-1 text-xs font-semibold text-slate-300">
              {navLinks.map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => {
                    setCurrentView(nav.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg ${
                    currentView === nav.id
                      ? 'bg-blue-500/10 text-blue-500 font-bold'
                      : 'dark:text-slate-200 text-slate-800 dark:hover:bg-white/10 hover:bg-slate-100'
                  }`}
                >
                  {nav.label}
                </button>
              ))}
            </nav>
          )}

          {!isAuthenticated && (
            <div className="pt-2 border-t dark:border-white/10 border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 rounded-xl dark:bg-white/10 bg-slate-100 dark:text-white text-slate-900 font-bold text-xs text-center border dark:border-white/10 border-slate-200"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignup();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

