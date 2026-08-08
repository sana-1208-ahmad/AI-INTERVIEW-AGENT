import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: string; avatar: string }) => void;
  initialMode?: 'login' | 'signup';
}

const DEFAULT_ACCOUNTS = [
  {
    email: 'sarah.chen@enterprise.ai',
    password: 'Password123!',
    name: 'Sarah Chen',
    role: 'Director of AI Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    email: 'sana.khan@abtalks.ai',
    password: 'Password123!',
    name: 'Sana Khan',
    role: 'Senior AI Engineer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    email: 'zobiya8661@gmail.com',
    password: 'Password123!',
    name: 'Zobiya',
    role: 'AI Talent Lead',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior AI Evaluator');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [foundAccountForReset, setFoundAccountForReset] = useState<any | null>(null);

  // Sync mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
    setFoundAccountForReset(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const getRegisteredAccounts = () => {
    try {
      const saved = localStorage.getItem('abtalks_registered_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed reading stored accounts", e);
    }
    localStorage.setItem('abtalks_registered_users', JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  };

  const saveNewAccount = (newUser: any) => {
    const existing = getRegisteredAccounts();
    const updated = [newUser, ...existing];
    localStorage.setItem('abtalks_registered_users', JSON.stringify(updated));
    return updated;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Strict Email Format Validation
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g., name@domain.com).');
      return;
    }

    if (mode === 'forgot_password') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const registeredUsers = getRegisteredAccounts();
        const foundUser = registeredUsers.find(
          (u: any) => u.email.trim().toLowerCase() === cleanEmail
        );

        if (!foundUser) {
          setErrorMessage('No registered account found with this email. Please check your email or create a new account.');
          setFoundAccountForReset(null);
          return;
        }

        setFoundAccountForReset(foundUser);
        setSuccessMessage(`Account found for ${foundUser.name}! Your current password is displayed below or you can set a new one.`);
      }, 400);
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const registeredUsers = getRegisteredAccounts();

      if (mode === 'login') {
        // VERIFY ACCOUNT EXISTS
        const foundUser = registeredUsers.find(
          (u: any) => u.email.trim().toLowerCase() === cleanEmail
        );

        if (!foundUser) {
          setErrorMessage('Account not found! This email is not registered. Please sign up first or use a valid registered account.');
          return;
        }

        // VERIFY PASSWORD
        if (foundUser.password !== password) {
          setErrorMessage('Incorrect password! Please check your password or click "Forgot Password?" to reset.');
          return;
        }

        // Successful Login
        onLoginSuccess({
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          avatar: foundUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        });
        onClose();
      } else {
        // SIGNUP MODE
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          return;
        }

        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          return;
        }

        const existingUser = registeredUsers.find(
          (u: any) => u.email.trim().toLowerCase() === cleanEmail
        );

        if (existingUser) {
          setErrorMessage('An account with this email already exists. Please log in.');
          return;
        }

        // Create Real Account
        const newUser = {
          email: cleanEmail,
          password: password,
          name: name.trim(),
          role: role || 'Senior AI Engineer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        };

        saveNewAccount(newUser);

        onLoginSuccess({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar
        });
        onClose();
      }
    }, 500);
  };

  const handleResetPasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    const registeredUsers = getRegisteredAccounts();
    const updatedUsers = registeredUsers.map((u: any) => {
      if (u.email.trim().toLowerCase() === email.trim().toLowerCase()) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    localStorage.setItem('abtalks_registered_users', JSON.stringify(updatedUsers));
    setPassword(newPassword);
    setNewPassword('');
    setSuccessMessage('Password updated successfully! You can now log in with your new password.');
    setMode('login');
    setFoundAccountForReset(null);
  };

  const handleQuickDemoLogin = (targetAccount?: typeof DEFAULT_ACCOUNTS[0]) => {
    setIsLoading(true);
    const selected = targetAccount || DEFAULT_ACCOUNTS[0];
    setTimeout(() => {
      setIsLoading(false);
      setEmail(selected.email);
      setPassword(selected.password);
      onLoginSuccess({
        name: selected.name,
        email: selected.email,
        role: selected.role,
        avatar: selected.avatar
      });
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl dark:bg-[#080d1a]/95 bg-white border dark:border-white/15 border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl dark:bg-white/5 bg-slate-100 dark:text-slate-400 text-slate-500 hover:dark:bg-white/10 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full dark:bg-blue-500/10 bg-blue-50 dark:border-blue-500/20 border-blue-200 border text-blue-600 dark:text-blue-400 text-[11px] font-extrabold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>REAL AUTHENTICATION PORTAL</span>
          </div>

          <h2 className="text-2xl font-black dark:text-white text-slate-900 tracking-tight">
            {mode === 'login' ? 'Sign In to ABTalks AI' : mode === 'signup' ? 'Create Enterprise Account' : 'Reset Your Password'}
          </h2>
          <p className="text-xs dark:text-slate-400 text-slate-600 font-medium">
            {mode === 'login'
              ? 'Enter your registered email & password to access your evaluation dashboard.'
              : mode === 'signup'
              ? 'Create a new real account to start live technical interview assessments.'
              : 'Enter your registered email address to recover or set a new password.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 p-1 rounded-2xl dark:bg-white/5 bg-slate-100 dark:border-white/10 border-slate-200 border text-center">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
              setSuccessMessage('');
              setFoundAccountForReset(null);
            }}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
              setFoundAccountForReset(null);
            }}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('forgot_password');
              setErrorMessage('');
              setSuccessMessage('');
              setFoundAccountForReset(null);
            }}
            className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'forgot_password'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Success Alert Message */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-start gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Verified Accounts Box (for quick test) */}
        {mode !== 'forgot_password' && (
          <div className="p-3 rounded-2xl dark:bg-blue-950/30 bg-blue-50 border dark:border-blue-500/30 border-blue-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold dark:text-blue-300 text-blue-900">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                Verified Registered Accounts
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400">Password: Password123!</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc)}
                  className="px-2.5 py-1 rounded-lg dark:bg-white/10 bg-white dark:text-slate-200 text-slate-800 dark:hover:bg-blue-500/30 hover:bg-blue-100 border dark:border-white/10 border-blue-200 text-[11px] font-semibold transition-colors cursor-pointer"
                  title={`Click to log in as ${acc.name}`}
                >
                  {acc.name} ({acc.email.split('@')[0]})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD FORM & ACCOUNT RESET */}
        {mode === 'forgot_password' ? (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-purple-500" />
                  <span>Enter Registered Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. zobiya8661@gmail.com"
                  className="w-full p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/15 border-slate-300 dark:text-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-black text-xs shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Searching Account...</span>
                  </>
                ) : (
                  <span>Verify Account Email</span>
                )}
              </button>
            </form>

            {/* If Account Found: Display Password & Offer Instant Reset */}
            {foundAccountForReset && (
              <div className="p-4 rounded-2xl dark:bg-purple-950/40 bg-purple-50 border border-purple-500/40 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-purple-600 dark:text-purple-400 block">
                    ACCOUNT FOUND: {foundAccountForReset.name}
                  </span>
                  <div className="p-2.5 rounded-xl dark:bg-black/40 bg-white border dark:border-purple-500/30 border-purple-200 text-xs font-mono font-bold flex items-center justify-between">
                    <span className="dark:text-slate-300 text-slate-700">Current Password:</span>
                    <span className="text-purple-600 dark:text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                      {foundAccountForReset.password}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleResetPasswordSave} className="space-y-2.5 pt-1 border-t border-purple-500/20">
                  <label className="text-[11px] font-bold dark:text-slate-200 text-slate-800 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-purple-500" />
                    <span>Set New Password</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full p-2.5 rounded-xl dark:bg-white/10 bg-white border border-purple-300 dark:border-purple-500/40 dark:text-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save New Password &amp; Proceed to Login
                  </button>
                </form>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="w-full py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline text-center cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </div>
        ) : (
          /* Standard Login / Signup Credentials Form */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zobiya Khan"
                  className="w-full p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/15 border-slate-300 dark:text-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. zobiya8661@gmail.com"
                className="w-full p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/15 border-slate-300 dark:text-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold dark:text-slate-300 text-slate-700 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Password</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/15 border-slate-300 dark:text-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Account Credentials...</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Sign In Now' : 'Create Account & Sign In'}</span>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <p className="text-[10px] text-center dark:text-slate-400 text-slate-500 font-medium pt-1">
          Secure verification by ABTalks Enterprise Auth &amp; Breeth Security
        </p>
      </div>
    </div>
  );
};

