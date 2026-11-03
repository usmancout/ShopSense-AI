import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

const USERS_DB_KEY = 'shopsense_users_db';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function decodeEmailFromToken(token?: string): string | null {
  if (!token) return localStorage.getItem('shopsense_pending_reset_email');
  if (token.startsWith('local-reset-')) {
    try {
      const parts = token.replace('local-reset-', '').split('-');
      return decodeURIComponent(atob(parts[0]));
    } catch {
      return localStorage.getItem('shopsense_pending_reset_email');
    }
  }
  try {
    const payloadPart = token.split('.')[1];
    if (payloadPart) {
      const decoded = JSON.parse(atob(payloadPart));
      if (decoded.email) return decoded.email;
    }
  } catch {
    // Ignore JWT decode errors
  }
  return localStorage.getItem('shopsense_pending_reset_email');
}

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const targetEmail = decodeEmailFromToken(token);

  const updateLocalPassword = (emailToUpdate: string | null, passwordToSet: string) => {
    if (!emailToUpdate) return;
    try {
      const normalized = emailToUpdate.trim().toLowerCase();
      const raw = localStorage.getItem(USERS_DB_KEY);
      const users = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(users) ? users : [];
      const idx = list.findIndex((u: any) => String(u.email || '').toLowerCase() === normalized);
      if (idx >= 0) {
        list[idx].password = passwordToSet;
      } else {
        const displayName = (normalized.split('@')[0] || 'Customer')
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        list.push({
          id: `user-${Date.now()}`,
          username: displayName,
          email: normalized,
          password: passwordToSet,
          location: 'Lahore, Pakistan',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=059669&color=fff&bold=true`
        });
      }
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(list));
    } catch {
      // Ignore storage errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('Both fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    // Always update local user DB so Vercel sign-in works immediately with the new password
    updateLocalPassword(targetEmail, newPassword);

    if (token && !token.startsWith('local-reset-')) {
      try {
        const response = await axios.post(
          `${API_BASE}/api/auth/reset-password/${token}`,
          { newPassword },
          { timeout: 3000 }
        );
        if (response.data?.email) {
          updateLocalPassword(response.data.email, newPassword);
        }
      } catch {
        // Local password update already succeeded
      }
    }

    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 text-center shadow-lg">
          <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-600/20">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Password Reset Successful</h2>
          <p className="text-slate-500 text-sm mb-6">
            Your password{targetEmail ? ` for ${targetEmail}` : ''} has been updated. You can now sign in with your new password.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl font-bold transition-colors text-sm shadow-sm"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-600/20">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1.5">Reset Your Password</h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            {targetEmail ? `Set a new password for ${targetEmail}` : 'Enter your new password below.'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold mb-4 flex items-start">
            <XCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="Enter new password (min. 6 chars)"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="Confirm new password"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white py-3.5 px-4 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 text-sm shadow-sm mt-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
