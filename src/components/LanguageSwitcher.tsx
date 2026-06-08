/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLang, LANGUAGES, Lang } from '../i18n';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = LANGUAGES.find(l => l.code === lang);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        title={t('header.language')}
        aria-label={t('header.language')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-blue-deep/40 border border-brand-blue-dark/50 rounded-xl hover:bg-brand-blue-deep/70 transition-colors cursor-pointer text-white"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">{current?.code}</span>
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 py-1">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code as Lang); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors cursor-pointer text-start ${
                lang === l.code ? 'bg-brand-blue-light text-brand-blue-dark font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span className="flex-1">{l.native}</span>
              {lang === l.code && <Check className="w-4 h-4 text-brand-blue" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
