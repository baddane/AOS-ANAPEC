/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Convention, ConventionCategory, ConventionEstablishment, UserProfile } from '../types';
import {
  Search, MapPin, Phone, Mail, CheckCircle2, Award, Calendar,
  Ticket, Printer, X, ChevronDown, Building2, FileText,
  Shield, Users, Heart, Eye, Clock, ArrowLeft, Star, Copy, Check
} from 'lucide-react';
import { useLang } from '../i18n';

interface ConventionsDirectoryProps {
  currentUser: UserProfile;
  conventions: Convention[];
}

type DetailTab = 'APERCU' | 'ARTICLES' | 'RESEAU' | 'DOCUMENTS';

const CATEGORY_META: Record<ConventionCategory, { labelKey: string; bg: string; text: string; icon: string; gradient: string }> = {
  HEBERGEMENT: { labelKey: 'conv.cat.HEBERGEMENT', bg: 'bg-brand-blue-light', text: 'text-brand-blue-dark font-semibold', icon: '🏨', gradient: 'from-blue-600 to-cyan-500' },
  TRANSPORT: { labelKey: 'conv.cat.TRANSPORT', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: '🚄', gradient: 'from-indigo-600 to-purple-500' },
  SANTE: { labelKey: 'conv.cat.SANTE', bg: 'bg-rose-50', text: 'text-rose-700', icon: '👓', gradient: 'from-rose-600 to-pink-500' },
  BANQUE_ASSUR: { labelKey: 'conv.cat.BANQUE_ASSUR', bg: 'bg-amber-50', text: 'text-amber-700', icon: '💳', gradient: 'from-amber-600 to-orange-500' },
  EDUCATION: { labelKey: 'conv.cat.EDUCATION', bg: 'bg-violet-50', text: 'text-violet-700', icon: '🎓', gradient: 'from-violet-600 to-indigo-500' },
  SOURIRE: { labelKey: 'conv.cat.SOURIRE', bg: 'bg-brand-gold-light', text: 'text-brand-gold-dark font-semibold', icon: '💪', gradient: 'from-yellow-500 to-amber-500' }
};

export default function ConventionsDirectory({ currentUser, conventions }: ConventionsDirectoryProps) {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ConventionCategory | 'ALL'>('ALL');
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>('APERCU');
  const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set());
  const [networkSearch, setNetworkSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = conventions.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.partnerName.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateVoucher = useCallback((conv: Convention) => {
    if (currentUser.cotisationStatus !== 'active') {
      alert(t('conv.inactiveAlert'));
      return;
    }
    const rnd = crypto.getRandomValues(new Uint32Array(1))[0] % 900000 + 100000;
    const code = `AOS-ANAPEC-${conv.id.toUpperCase().split('_')[1] || 'CONV'}-${rnd}`;
    setVoucherCode(code);
    setSelectedConvention(conv);
    setShowVoucher(true);
  }, [currentUser.cotisationStatus]);

  const handleOpenDetail = useCallback((conv: Convention) => {
    setSelectedConvention(conv);
    setDetailTab('APERCU');
    setExpandedArticles(new Set());
    setNetworkSearch('');
    setShowDetail(true);
  }, []);

  const toggleArticle = useCallback((num: number) => {
    setExpandedArticles(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }, []);

  const expandAllArticles = useCallback(() => {
    if (!selectedConvention?.articles) return;
    setExpandedArticles(prev => {
      if (prev.size === selectedConvention.articles!.length) return new Set();
      return new Set(selectedConvention.articles!.map(a => a.number));
    });
  }, [selectedConvention]);

  const handleShare = useCallback(async () => {
    if (!selectedConvention) return;
    const text = `Convention AOS ANAPEC: ${selectedConvention.title} - ${selectedConvention.discountValue} chez ${selectedConvention.partnerName}`; // partner names are proper nouns, kept as-is
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  }, [selectedConvention]);

  const hasRichData = (conv: Convention) => !!(conv.articles?.length || conv.establishments?.length || conv.beneficiaries?.length);

  const establishmentsByCity = useMemo(() => {
    if (!selectedConvention?.establishments) return [];
    const results = selectedConvention.establishments.filter(e => {
      if (!networkSearch) return true;
      const q = networkSearch.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q) || (e.city || '').toLowerCase().includes(q);
    });
    const map = new Map<string, ConventionEstablishment[]>();
    for (const e of results) {
      const city = e.city || 'Autre';
      if (!map.has(city)) map.set(city, []);
      map.get(city)!.push(e);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [selectedConvention?.establishments, networkSearch]);

  const totalFilteredEstablishments = useMemo(() =>
    establishmentsByCity.reduce((sum, [, ests]) => sum + ests.length, 0),
    [establishmentsByCity]
  );

  const isActive = (conv: Convention) => new Date(conv.validityDate) > new Date();

  return (
    <div className="space-y-6" id="conventions-directory-container">

      {/* Visual Hub Header */}
      <div className="bg-gradient-to-br from-brand-blue-deep to-brand-blue rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-brand-blue/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/25 text-brand-gold border border-brand-gold/20 mb-3">
            <Award className="w-3.5 h-3.5" />
            {t('conv.heroBadge')}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{t('conv.heroTitle')}</h2>
          <p className="mt-2 text-sm text-brand-blue-light/90 leading-relaxed">
            {t('conv.heroDesc')}
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Search className="w-4 h-4" /></div>
          <input type="text" placeholder={t('conv.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" />
        </div>
        <div className="w-full flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button onClick={() => setSelectedCategory('ALL')} className={`px-3 py-2 text-xs font-semibold rounded-xl shrink-0 transition-all cursor-pointer ${selectedCategory === 'ALL' ? 'bg-brand-blue text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{t('conv.filterAll')}</button>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button key={key} onClick={() => setSelectedCategory(key as ConventionCategory)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${selectedCategory === key ? 'bg-brand-blue text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
              <span>{meta.icon}</span><span>{t(meta.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <p className="text-xs text-slate-400 font-medium">{filtered.length} {filtered.length > 1 ? t('conv.partnersFound_plural') : t('conv.partnersFound_singular')}</p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((conv) => {
          const meta = CATEGORY_META[conv.category];
          const rich = hasRichData(conv);
          return (
            <div key={conv.id} className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300/80 group ${conv.highlighted ? 'ring-2 ring-brand-blue-dark/20 border-brand-blue/30 bg-linear-to-b from-white to-brand-blue-light/20' : 'border-slate-100'}`}>
              <div className={`p-5 space-y-4 ${rich ? 'cursor-pointer' : ''}`} onClick={() => rich ? handleOpenDetail(conv) : undefined}>
                <div className="flex justify-between items-start gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.text}`}>
                    <span className="mr-0.5">{meta.icon}</span>{t(meta.labelKey)}
                  </span>
                  {conv.highlighted && (
                    <span className="bg-brand-gold-accent text-brand-gold-dark text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider animate-pulse">
                      <Star className="w-3 h-3 inline -mt-0.5 mr-0.5" />{t('conv.recommended')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {conv.partnerLogo && <span className="text-2xl">{conv.partnerLogo}</span>}
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-brand-blue-dark line-clamp-1">{conv.partnerName}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">{conv.title}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="text-start">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{t('conv.memberBenefit')}</p>
                    <p className="text-sm font-black text-brand-blue-dark">{conv.discountValue}</p>
                  </div>
                  <div className={`p-2 rounded-lg text-sm ${isActive(conv) ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {isActive(conv) ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{conv.description}</p>
                {rich && (
                  <div className="flex gap-2">
                    {conv.establishments && <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg"><Building2 className="w-3 h-3" />{conv.establishments.length} {t('conv.establishments')}</span>}
                    {conv.articles && <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-600 text-[10px] font-bold rounded-lg"><FileText className="w-3 h-3" />{conv.articles.length} {t('conv.articles')}</span>}
                  </div>
                )}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="truncate">{conv.city} — {conv.address}</span></div>
                  <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>{conv.contactPhone}</span></div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>{t('conv.validUntil')} {new Date(conv.validityDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                </div>
              </div>
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex gap-2">
                {rich && <button onClick={() => handleOpenDetail(conv)} className="inline-flex justify-center items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"><Eye className="w-3.5 h-3.5" />{t('conv.explore')}</button>}
                <button onClick={(e) => { e.stopPropagation(); handleCreateVoucher(conv); }} className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs"><Ticket className="w-3.5 h-3.5" />{t('conv.generateVoucher')}</button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-100 space-y-3">
            <p className="text-3xl">🧩</p>
            <h4 className="font-display font-bold text-slate-800 text-base">{t('conv.emptyTitle')}</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">{t('conv.emptyDesc')}</p>
          </div>
        )}
      </div>

      {/* ===== DETAIL MODAL ===== */}
      {showDetail && selectedConvention && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-sm flex items-stretch justify-center">
          <div className="bg-white w-full max-w-4xl flex flex-col overflow-hidden md:my-4 md:rounded-2xl md:mx-4 shadow-2xl">
            {/* Header */}
            <div className={`bg-gradient-to-r ${CATEGORY_META[selectedConvention.category].gradient} p-5 text-white relative overflow-hidden shrink-0`}>
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => setShowDetail(false)} className="inline-flex items-center gap-1 text-white/80 hover:text-white text-xs font-semibold transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" /> {t('conv.back')}</button>
                  <div className="flex gap-2">
                    {selectedConvention.signatureDate && <span className="px-2.5 py-1 bg-white/15 backdrop-blur rounded-lg text-[10px] font-bold flex items-center gap-1"><Calendar className="w-3 h-3" /> {t('conv.signedOn')} {new Date(selectedConvention.signatureDate).toLocaleDateString('fr-FR')}</span>}
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${isActive(selectedConvention) ? 'bg-emerald-400/20 text-emerald-100' : 'bg-red-400/20 text-red-200'}`}>
                      {isActive(selectedConvention) ? <><CheckCircle2 className="w-3 h-3" /> {t('conv.statusActive')}</> : <><Clock className="w-3 h-3" /> {t('conv.statusExpired')}</>}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {selectedConvention.partnerLogo && <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl shrink-0">{selectedConvention.partnerLogo}</div>}
                  <div>
                    <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight">{selectedConvention.partnerName}</h2>
                    <p className="text-sm text-white/80 mt-0.5">{selectedConvention.title}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2">
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">{t('conv.advantageLabel')}</p>
                    <p className="text-base font-black">{selectedConvention.discountValue}</p>
                  </div>
                  {selectedConvention.duration && <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2"><p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">{t('conv.durationLabel')}</p><p className="text-sm font-bold">{selectedConvention.duration}</p></div>}
                  {selectedConvention.establishments && <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2"><p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">{t('conv.networkLabel')}</p><p className="text-sm font-bold">{selectedConvention.establishments.length} {t('conv.establishments')}</p></div>}
                </div>
              </div>
            </div>
            {/* Tabs */}
            <div className="border-b border-slate-100 bg-slate-50/50 px-5 flex gap-1 shrink-0 overflow-x-auto scrollbar-none">
              {[
                { id: 'APERCU' as DetailTab, label: t('conv.tabApercu'), icon: <Eye className="w-3.5 h-3.5" /> },
                ...(selectedConvention.articles?.length ? [{ id: 'ARTICLES' as DetailTab, label: `${t('conv.tabArticles')} (${selectedConvention.articles.length})`, icon: <FileText className="w-3.5 h-3.5" /> }] : []),
                ...(selectedConvention.establishments?.length ? [{ id: 'RESEAU' as DetailTab, label: `${t('conv.tabReseau')} (${selectedConvention.establishments.length})`, icon: <Building2 className="w-3.5 h-3.5" /> }] : []),
                ...(selectedConvention.requiredDocuments?.length ? [{ id: 'DOCUMENTS' as DetailTab, label: t('conv.tabDocuments'), icon: <Shield className="w-3.5 h-3.5" /> }] : []),
              ].map(tab => (
                <button key={tab.id} onClick={() => setDetailTab(tab.id)}
                  className={`px-4 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 ${detailTab === tab.id ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* APERCU */}
              {detailTab === 'APERCU' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100"><p className="text-sm text-slate-700 leading-relaxed">{selectedConvention.description}</p></div>
                  {selectedConvention.beneficiaries && (
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-800 mb-3 flex items-center gap-2"><div className="p-1.5 bg-emerald-50 rounded-lg"><Users className="w-4 h-4 text-emerald-600" /></div>{t('conv.beneficiaries')}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedConvention.beneficiaries.map((b, i) => (
                          <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-lg shrink-0">{i === 0 ? '👤' : i === 1 ? '💑' : '👶'}</div>
                            <p className="text-xs font-semibold text-slate-700">{b}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedConvention.coveredServices && (
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-800 mb-3 flex items-center gap-2"><div className="p-1.5 bg-rose-50 rounded-lg"><Heart className="w-4 h-4 text-rose-600" /></div>{t('conv.coveredServices')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedConvention.coveredServices.map((s, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-semibold text-slate-600 hover:bg-brand-blue-light hover:text-brand-blue-dark hover:border-brand-blue/20 transition-all">
                            <CheckCircle2 className="w-3 h-3 inline -mt-0.5 mr-1 text-emerald-500" />{s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('conv.aosLabel')}</p>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> 4, Lotissement La Colline Entrée B Sidi Maarouf 20100</div>
                        <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> 0661045542</div>
                        <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> aosanapec@anapec.org</div>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selectedConvention.partnerName}</p>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedConvention.partnerAddress || selectedConvention.address}</div>
                        <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedConvention.partnerPhone || selectedConvention.contactPhone}</div>
                        {(selectedConvention.partnerEmail || selectedConvention.contactEmail) && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedConvention.partnerEmail || selectedConvention.contactEmail}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ARTICLES */}
              {detailTab === 'ARTICLES' && selectedConvention.articles && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-semibold text-slate-600">{t('conv.readingProgress')}</p>
                      <div className="flex items-center gap-3">
                        <p className="text-xs font-bold text-brand-blue">{expandedArticles.size}/{selectedConvention.articles.length} {t('conv.articlesConsulted')}</p>
                        <button onClick={expandAllArticles} className="text-[10px] font-bold text-brand-blue hover:underline cursor-pointer">{expandedArticles.size === selectedConvention.articles.length ? t('conv.collapseAll') : t('conv.expandAll')}</button>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-brand-blue to-brand-blue-dark rounded-full transition-all duration-500" style={{ width: `${(expandedArticles.size / selectedConvention.articles.length) * 100}%` }} /></div>
                  </div>
                  <div className="space-y-2">
                    {selectedConvention.articles.map((article) => {
                      const isOpen = expandedArticles.has(article.number);
                      return (
                        <div key={article.number} className={`border rounded-xl overflow-hidden transition-all ${isOpen ? 'border-brand-blue/30 shadow-sm' : 'border-slate-100'}`}>
                          <button onClick={() => toggleArticle(article.number)} className="w-full flex items-center gap-3 p-4 text-start hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition-colors ${isOpen ? 'bg-brand-blue text-white' : 'bg-slate-100'}`}>{article.icon || '📄'}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-md">{t('conv.articlePrefix')} {article.number}</span>
                                <h4 className="text-sm font-bold text-slate-800 truncate">{article.title}</h4>
                              </div>
                            </div>
                            <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><ChevronDown className="w-4 h-4 text-slate-400" /></div>
                          </button>
                          {isOpen && <div className="px-4 pb-4 pt-0"><div className="ml-12 pl-4 border-l-2 border-brand-blue/20"><p className="text-xs text-slate-600 leading-relaxed">{article.content}</p></div></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* RESEAU */}
              {detailTab === 'RESEAU' && selectedConvention.establishments && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Search className="w-4 h-4" /></div>
                    <input type="text" placeholder={t('conv.networkSearchPlaceholder')} value={networkSearch} onChange={(e) => setNetworkSearch(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all" />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <span className="px-3 py-1.5 bg-brand-blue-light text-brand-blue-dark text-xs font-bold rounded-lg">{establishmentsByCity.length} {t('conv.cities')}</span>
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">{totalFilteredEstablishments} {t('conv.establishments')}</span>
                  </div>
                  <div className="space-y-4">
                    {establishmentsByCity.map(([city, items]) => (
                      <div key={city}>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                          <h4 className="text-xs font-bold text-slate-700">{city}</h4>
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-md">{items.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {items.map((est) => (
                            <div key={est.code} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-sm hover:border-slate-200 transition-all">
                              <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-blue-dark rounded-lg flex items-center justify-center shrink-0"><Building2 className="w-4 h-4 text-white" /></div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-700 truncate">{est.name}</p>
                                <span className="text-[10px] font-mono font-bold text-brand-blue bg-brand-blue-light px-1.5 py-0.5 rounded">{est.code}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {establishmentsByCity.length === 0 && <div className="text-center py-8 text-slate-400"><Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-xs font-semibold">{t('conv.noEstablishmentMatch')}</p></div>}
                </div>
              )}
              {/* DOCUMENTS */}
              {detailTab === 'DOCUMENTS' && selectedConvention.requiredDocuments && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4"><p className="text-xs text-amber-700 font-semibold flex items-center gap-2"><Shield className="w-4 h-4" />{t('conv.docsIntro')}</p></div>
                  <div className="space-y-2">
                    {selectedConvention.requiredDocuments.map((doc, i) => {
                      const icons = ['🪪', '🏷️', '📱', '📋', '📄', '📝', '🔬', '💊'];
                      return (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-all">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-lg shrink-0">{icons[i % icons.length]}</div>
                          <p className="text-xs font-semibold text-slate-700 flex-1">{doc}</p>
                          <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-slate-200" /></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {/* Bottom Bar */}
            <div className="shrink-0 p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button onClick={() => { setShowDetail(false); handleCreateVoucher(selectedConvention); }}
                className="flex-1 inline-flex justify-center items-center gap-1.5 px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs">
                <Ticket className="w-4 h-4" />{t('conv.generateVoucher')}
              </button>
              <button onClick={handleShare} className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5">
                {copied ? <><Check className="w-3.5 h-3.5 text-emerald-500" />{t('conv.copied')}</> : <><Copy className="w-3.5 h-3.5" />{t('conv.share')}</>}
              </button>
              <button onClick={() => setShowDetail(false)} className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer">{t('conv.close')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== VOUCHER MODAL ===== */}
      {showVoucher && selectedConvention && (
        <div className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col justify-between">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-brand-blue flex items-center gap-1.5"><Ticket className="w-4 h-4" />{t('conv.voucherHeader')}</span>
              <button onClick={() => setShowVoucher(false)} className="p-1 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6" id="printable-voucher-document">
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-4">
                <div className="text-start"><h4 className="font-display font-extrabold text-sm text-slate-900 tracking-wide uppercase">AOS ANAPEC</h4><p className="text-[9px] text-slate-400 uppercase font-semibold">{t('conv.socialWorks')}</p></div>
                <div className="text-right"><span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded-md">{voucherCode}</span><p className="text-[9px] text-slate-400 mt-1">{t('conv.voucherGenerated')} {new Date().toLocaleDateString('fr-FR')}</p></div>
              </div>
              <div className="space-y-2 text-center py-2 bg-brand-gold-light rounded-xl border border-brand-gold-accent">
                <p className="text-[10px] text-brand-gold-dark font-bold uppercase tracking-wider">{t('conv.voucherNotice')}</p>
                <h3 className="text-lg font-bold text-slate-800">{selectedConvention.partnerName}</h3>
                <p className="text-sm font-extrabold text-brand-blue-dark">{selectedConvention.discountValue}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t('conv.voucherBeneficiary')}</p>
                  <p className="font-bold text-slate-800">{currentUser.prenom} {currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{t('conv.voucherMatricule')} {currentUser.matricule}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t('conv.voucherDelegation')}</p>
                  <p className="font-bold text-slate-800">{currentUser.delegation}</p>
                  <p className="text-[11px] text-brand-blue-dark font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-blue" /> {t('conv.voucherCotisation')}</p>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 space-y-2 leading-relaxed">
                <p className="font-semibold text-slate-700">{t('conv.voucherInstructions')}</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>{t('conv.voucherBullet1')}</li>
                  <li>{t('conv.voucherBullet2')}</li>
                  <li>{t('conv.voucherBullet3').replace('{partner}', selectedConvention.partnerName)}</li>
                </ul>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-16 h-16 bg-white border border-slate-200 p-1 rounded-sm flex flex-wrap justify-between items-center relative overflow-hidden">
                    <div className="absolute inset-1.5 bg-[radial-gradient(#0f172a_2.5px,transparent_2.5px)] [background-size:6px_6px]" />
                    <div className="absolute top-1 left-1 w-4.5 h-4.5 bg-slate-900 rounded-xs border-2 border-white" />
                    <div className="absolute top-1 right-1 w-4.5 h-4.5 bg-slate-900 rounded-xs border-2 border-white" />
                    <div className="absolute bottom-1 left-1 w-4.5 h-4.5 bg-slate-900 rounded-xs border-2 border-white" />
                  </div>
                  <div className="text-start font-mono"><p className="text-[9px] text-slate-400 uppercase font-semibold">{t('conv.voucherInstantValidation')}</p><p className="text-[10px] font-bold text-brand-blue-deep">{t('conv.voucherCertified')}</p></div>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <p className="font-semibold text-brand-blue">{t('conv.voucherStamp')}</p>
                  <p className="italic text-slate-400 mt-0.5">{t('conv.voucherSecretary')}</p>
                  <div className="mt-1 h-8 w-24 bg-brand-blue-light border-2 border-dashed border-brand-blue/20 rounded-md flex items-center justify-center text-[8px] text-brand-blue font-bold tracking-widest uppercase select-none pointer-events-none transform -rotate-3">{t('conv.voucherQualified')}</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button onClick={() => window.print()} className="flex-1 inline-flex justify-center items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"><Printer className="w-3.5 h-3.5" />{t('conv.voucherPrint')}</button>
              <button onClick={() => setShowVoucher(false)} className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer">{t('conv.voucherClose')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
