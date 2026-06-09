import React, { useState } from 'react';
import AnapecLogo from './AnapecLogo';
import { signInWithMicrosoft } from '../supabaseClient';
import { useLang } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginGate() {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithMicrosoft();
      // La page sera redirigée vers Microsoft — pas d'action supplémentaire.
    } catch (err: any) {
      setError(t('login.error'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800" id="login-gate-container">

      {/* Bandeau couleur AOS */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-blue-dark" />

      {/* Sélecteur de langue */}
      <div className="absolute top-4 end-4 z-10">
        <div className="bg-brand-blue rounded-xl">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-10">

        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden px-8 py-10 text-center">

          {/* Motif décoratif */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Logo & titre */}
          <div className="relative z-10 flex flex-col items-center mb-8">
            <div className="mb-5 hover:scale-105 transition-transform duration-300">
              <AnapecLogo className="w-24 h-24 filter drop-shadow-sm" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 leading-tight">
              AOS ANAPEC
            </h1>
            <p className="mt-1 text-sm font-bold text-brand-blue">
              {t('login.assoc')}
            </p>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              {t('login.portal')}
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-start gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Bouton Microsoft SSO */}
          <button
            onClick={handleMicrosoftLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#0078d4] hover:bg-[#006abc] active:bg-[#005ea2] text-white font-semibold rounded-2xl transition-all shadow-md shadow-blue-900/15 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
            )}
            <span>
              {loading ? t('login.redirecting') : t('login.signin')}
            </span>
          </button>

          {/* Instruction compte */}
          <p className="mt-5 text-xs text-slate-400 leading-relaxed">
            {t('login.instruction')}<br />
            <span className="font-mono text-slate-500">prenom.nom@anapec.ma</span>
          </p>

          {/* Badge sécurité */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('login.secure')}</span>
          </div>

        </div>

      </div>

      <footer className="py-5 border-t border-slate-100 text-center text-xs text-slate-400 px-4">
        <p>© {new Date().getFullYear()} {t('login.copyright')}</p>
        <p className="mt-0.5 text-[11px]">{t('login.tagline')}</p>
      </footer>
    </div>
  );
}
