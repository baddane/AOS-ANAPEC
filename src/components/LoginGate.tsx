/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MOCK_USERS } from '../mockData';
import { Lock, Mail, ShieldAlert, Award, HelpingHand } from 'lucide-react';
import AnapecLogo from './AnapecLogo';

interface LoginGateProps {
  onLoginSuccess: (user: UserProfile) => void;
  users?: UserProfile[];
}

export default function LoginGate({ onLoginSuccess, users = [] }: LoginGateProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs requis.');
      return;
    }

    // Direct authentic matching
    const trimmedEmail = email.trim().toLowerCase();
    const activeUsersList = users.length > 0 ? users : MOCK_USERS;
    const matchedUser = activeUsersList.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (matchedUser) {
      // In a mock/live environment we accept simple login passwords matching user/admin prefixes
      if (
        (matchedUser.role === 'admin' && password === 'admin123') ||
        (matchedUser.role === 'user' && password === 'user123') ||
        // Support general password entry for other users too
        password === '123' || password === 'user123' || password === 'admin123'
      ) {
        onLoginSuccess(matchedUser);
        return;
      }
    }

    setError('Identifiants incorrects. Veuillez utiliser un des comptes de test ci-dessous.');
  };

  const prefillAccount = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800" id="login-gate-container">
      {/* Decorative Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-blue-dark" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Core Auth Card */}
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden px-8 py-10">
          
          {/* Moroccan Traditional Accent Pattern Backdrop inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
          
          {/* Header Branding */}
          <div className="text-center relative z-10 flex flex-col items-center">
            <div className="mb-4 transform hover:scale-105 transition-all duration-300">
              <AnapecLogo className="w-24 h-24 filter drop-shadow-sm" />
            </div>
            
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 leading-tight">
              AOS ANAPEC
            </h1>
            <p className="mt-1 text-sm font-bold text-brand-blue">
              Association des Œuvres Sociales
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Espace Intranet Sécurisé des Collaborateurs
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5 relative z-10" onSubmit={handleLogin}>
            
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100/80 text-rose-700 text-xs flex gap-2.5 items-start">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Adresse Email Professionnelle
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collaborateur@aosanapec.ma"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Mot de passe
                </label>
                <span className="text-xs text-slate-400 select-none">ID unique</span>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  id="password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              id="submit-login-btn"
              type="submit"
              className="w-full flex justify-center items-center px-4 py-3 h-11 bg-brand-blue hover:bg-brand-blue-dark focus:ring-4 focus:ring-brand-blue-light text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-brand-blue/15"
            >
              Se connecter au portail
            </button>
          </form>

          {/* Test Accounts Segment */}
          <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Accès de démonstration rapide
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Account 1 */}
              <button
                type="button"
                onClick={() => prefillAccount('collaborateur@aosanapec.ma', 'user123')}
                className="flex flex-col items-left text-left p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-brand-blue-light/50 hover:border-brand-blue/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                  <span className="text-xs font-bold text-slate-700">Adhérent Standard</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">collaborateur@aosanapec.ma</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Mot de passe: <strong className="font-semibold text-slate-600">user123</strong></span>
              </button>

              {/* Account 2 */}
              <button
                type="button"
                onClick={() => prefillAccount('admin@aosanapec.ma', 'admin123')}
                className="flex flex-col items-left text-left p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-brand-gold-light/50 hover:border-brand-gold/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                  <span className="text-xs font-bold text-slate-700">Administrateur AOS</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">admin@aosanapec.ma</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Mot de passe: <strong className="font-semibold text-slate-600">admin123</strong></span>
              </button>

            </div>
          </div>

          <div className="mt-6 text-center text-[10px] sm:text-xs text-slate-400">
            <a 
              href="https://www.facebook.com/search/top/?q=AOS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline hover:text-brand-blue inline-flex items-center gap-1"
            >
              Suivre l'actualité publique sur facebook.com/AOS
            </a>
          </div>

        </div>
      </div>

      {/* Elegant Footer */}
      <footer className="py-6 border-t border-slate-100 text-center text-xs text-slate-400 px-4">
        <p>© {new Date().getFullYear()} Association des Œuvres Sociales de l'ANAPEC (AOS ANAPEC).</p>
        <p className="mt-1 text-[11px] text-slate-400">Portail officiel d'accompagnement social, d'estivage et de mutuelle.</p>
      </footer>
    </div>
  );
}
