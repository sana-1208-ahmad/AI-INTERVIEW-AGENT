import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  LineChart,
  Settings,
  Sparkles,
  Code2,
  Brain
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCandidate: CandidateProfile;
  onOpenTechSpec: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  selectedCandidate,
  onOpenTechSpec
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'candidates', label: 'Candidate Profiles', icon: Users },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'my-interviews', label: 'My Interviews', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r dark:border-white/15 border-slate-200 dark:bg-[#030712]/60 bg-white/60 backdrop-blur-xl p-4 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      {/* Navigation Group */}
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2">
          Enterprise Portal
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 border border-white/20'
                  : 'dark:text-slate-300 text-slate-700 hover:dark:bg-white/10 hover:bg-slate-100 hover:dark:text-white hover:text-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-6 mt-6 border-t dark:border-white/15 border-slate-200 space-y-1">
        <p className="px-3 text-[11px] font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider mb-2">
          Benchmark API
        </p>
        <button
          onClick={onOpenTechSpec}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold dark:text-blue-300 text-blue-700 dark:bg-white/5 bg-blue-50 dark:border-white/15 border-blue-200 border hover:dark:bg-white/10 hover:bg-blue-100 transition-all duration-150 cursor-pointer"
        >
          <Code2 className="w-4 h-4 text-blue-500" />
          <span>Technical Spec API</span>
        </button>
      </div>

      {/* User Candidate Footer Card */}
      <div className="mt-auto pt-4">
        <div 
          onClick={() => setCurrentView('candidates')}
          className="p-3.5 rounded-2xl dark:bg-white/5 bg-slate-50 backdrop-blur-md dark:border-white/15 border-slate-200 border hover:border-blue-500 transition-colors cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <img
              src={selectedCandidate.avatar}
              alt={selectedCandidate.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/40 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold dark:text-slate-100 text-slate-900 truncate group-hover:text-blue-500 transition-colors">
                {selectedCandidate.name}
              </p>
              <p className="text-[11px] dark:text-slate-400 text-slate-500 truncate">
                {selectedCandidate.role}
              </p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t dark:border-white/10 border-slate-200 flex items-center justify-between text-[11px]">
            <span className="dark:text-slate-400 text-slate-500 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-blue-500" />
              Cohort Mastery
            </span>
            <span className="font-extrabold text-blue-500">
              {Math.round((selectedCandidate.completedDays.length / 31) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
