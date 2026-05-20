/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Convention, ConventionCategory, UserProfile } from '../types';
import { MOCK_CONVENTIONS } from '../mockData';
import { Search, MapPin, Phone, Mail, CheckCircle2, Award, Calendar, Share2, Ticket, Printer, X } from 'lucide-react';

interface ConventionsDirectoryProps {
  currentUser: UserProfile;
}

const CATEGORY_META: Record<ConventionCategory, { label: string; bg: string; text: string; icon: string }> = {
  HEBERGEMENT: { label: 'Hôtels & Estivage', bg: 'bg-brand-blue-light', text: 'text-brand-blue-dark font-semibold', icon: '🏨' },
  TRANSPORT: { label: 'Transport & Voyages', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: '🚄' },
  SANTE: { label: 'Santé & Optique', bg: 'bg-rose-50', text: 'text-rose-700', icon: '👓' },
  BANQUE_ASSUR: { label: 'Banque & Assurance', bg: 'bg-amber-50', text: 'text-amber-700', icon: '💳' },
  EDUCATION: { label: 'Éducation & Crèches', bg: 'bg-violet-50', text: 'text-violet-700', icon: '🎓' },
  SOURIRE: { label: 'Loisirs & Bien-être', bg: 'bg-brand-gold-light', text: 'text-brand-gold-dark font-semibold', icon: '💪' }
};

export default function ConventionsDirectory({ currentUser }: ConventionsDirectoryProps) {
  const [conventions, setConventions] = useState<Convention[]>(() => {
    const saved = localStorage.getItem('aos_conventions');
    return saved ? JSON.parse(saved) : MOCK_CONVENTIONS;
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ConventionCategory | 'ALL'>('ALL');
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  // Filtering
  const filtered = conventions.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.partnerName.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateVoucher = (conv: Convention) => {
    if (currentUser.cotisationStatus !== 'active') {
      alert("Votre compte d'adhérent est actuellement inactif ou non cotisant. Veuillez régulariser votre cotisation auprès de l'AOS pour bénéficier des réductions.");
      return;
    }
    const code = `AOS-ANAPEC-${conv.id.toUpperCase().split('_')[1] || 'CONV'}-${Math.floor(100000 + Math.random() * 900000)}`;
    setVoucherCode(code);
    setSelectedConvention(conv);
    setShowVoucher(true);
  };

  return (
    <div className="space-y-6" id="conventions-directory-container">
      
      {/* Visual Hub Header */}
      <div className="bg-gradient-to-br from-brand-blue-deep to-brand-blue rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-brand-blue/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/25 text-brand-gold border border-brand-gold/20 mb-3">
            <Award className="w-3.5 h-3.5" />
            Conventions & Partenariats Actifs
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Accords Sociaux & Remises Négociées
          </h2>
          <p className="mt-2 text-sm text-brand-blue-light/90 leading-relaxed">
            Profitez de réductions exceptionnelles négociées par l'AOS de l'ANAPEC pour vous, vos conjoints et enfants auprès d'acteurs de premier plan au Maroc. Générez vos bons d'accord instantanément.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un hôtel, transport, opticien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all"
          />
        </div>

        {/* Categories Pills */}
        <div className="w-full flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-2 text-xs font-semibold rounded-xl shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tous les accords
          </button>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as ConventionCategory)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === key
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Search Result Information */}
      <div className="flex justify-between items-center px-1">
        <p className="text-xs text-slate-400 font-medium">
          {filtered.length} {filtered.length > 1 ? 'partenaires trouvés' : 'partenaire trouvé'}
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((conv) => {
          const meta = CATEGORY_META[conv.category];
          return (
            <div
              key={conv.id}
              className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300/80 ${
                conv.highlighted ? 'ring-2 ring-brand-blue-dark/20 border-brand-blue/30 bg-linear-to-b from-white to-brand-blue-light/20' : 'border-slate-100'
              }`}
            >
              <div className="p-5 space-y-4">
                {/* Header card info */}
                <div className="flex justify-between items-start gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.text}`}>
                    <span className="mr-0.5">{meta.icon}</span>
                    {meta.label}
                  </span>
                  
                  {conv.highlighted && (
                    <span className="bg-brand-gold-accent text-brand-gold-dark text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider animate-pulse">
                      ★ Recommandé
                    </span>
                  )}
                </div>

                {/* Title & Partner */}
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-brand-blue-dark line-clamp-1">
                    {conv.partnerName}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {conv.title}
                  </p>
                </div>

                {/* Action Offer Rate Badge */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Avantage Adhérent</p>
                    <p className="text-sm font-black text-brand-blue-dark">{conv.discountValue}</p>
                  </div>
                  <div className="p-2 bg-brand-blue-light text-brand-blue-dark rounded-lg text-sm">
                    ✔️
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {conv.description}
                </p>

                {/* Details Footer list */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{conv.city} — {conv.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{conv.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Valide jusqu'au: {new Date(conv.validityDate).toLocaleDateString('fr-FR', {year: 'numeric', month: 'long', day: 'numeric'})}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => handleCreateVoucher(conv)}
                  className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  Générer mon bon d'accord
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-100 space-y-3">
            <p className="text-3xl">🧩</p>
            <h4 className="font-display font-bold text-slate-800 text-base">Aucune convention trouvée</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Nous n'avons trouvé aucun partenariat actif correspondant à vos critères de recherche. Essayez d'autres mots-clés.
            </p>
          </div>
        )}
      </div>

      {/* Printable Accord Voucher Modal */}
      {showVoucher && selectedConvention && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-brand-blue flex items-center gap-1.5">
                <Ticket className="w-4 h-4" />
                VOTRE BON D'OFFRE CONVENTIONNÉ
              </span>
              <button
                onClick={() => setShowVoucher(false)}
                className="p-1 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Voucher Area */}
            <div className="p-6 space-y-6" id="printable-voucher-document">
              
              {/* Official Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-4">
                <div className="text-left">
                  <h4 className="font-display font-extrabold text-sm text-slate-900 tracking-wide uppercase">
                    AOS ANAPEC
                  </h4>
                  <p className="text-[9px] text-slate-400 uppercase font-semibold">
                    Œuvres Sociales de l'ANAPEC
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded-md">
                    {voucherCode}
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1">Généré le: {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Title of service */}
              <div className="space-y-2 text-center py-2 bg-brand-gold-light rounded-xl border border-brand-gold-accent">
                <p className="text-[10px] text-brand-gold-dark font-bold uppercase tracking-wider">Avis d'Accord Conventionné</p>
                <h3 className="text-lg font-bold text-slate-800">
                  {selectedConvention.partnerName}
                </h3>
                <p className="text-sm font-extrabold text-brand-blue-dark">
                  {selectedConvention.discountValue}
                </p>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Bénéficiaire Adhérent</p>
                  <p className="font-bold text-slate-800">{currentUser.prenom} {currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Matricule: {currentUser.matricule}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Délégation de Rattachement</p>
                  <p className="font-bold text-slate-800">{currentUser.delegation}</p>
                  <p className="text-[11px] text-brand-blue-dark font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-brand-blue" /> Cotisation Active
                  </p>
                </div>
              </div>

              {/* Voucher Terms */}
              <div className="text-[11px] text-slate-500 space-y-2 leading-relaxed">
                <p className="font-semibold text-slate-700">Instructions réglementaires :</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Présenter ce bon imprimé accompagné de votre carte d'identité ou la carte de membre officielle AOS lors de votre réservation chez le partenaire.</li>
                  <li>Ce bon d'accord est personnel et incessible, valable uniquement pour l'adhérent susnommé ainsi que ses ayants droit déclarés.</li>
                  <li>L'offre est soumise aux conditions de disponibilité contractuelle de {selectedConvention.partnerName}.</li>
                </ul>
              </div>

              {/* Footer Stamp simulation */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                {/* Simulated QR Code using pixels with accurate styling */}
                <div className="flex items-center gap-2.5">
                  <div className="w-16 h-16 bg-white border border-slate-200 p-1 rounded-sm flex flex-wrap justify-between items-center relative overflow-hidden">
                    <div className="absolute inset-1.5 bg-[radial-gradient(#0f172a_2.5px,transparent_2.5px)] [background-size:6px_6px]" />
                    {/* QR Finder patterns in three corners */}
                    <div className="absolute top-1 left-1 w-4.5 h-4.5 bg-slate-900 rounded-xs border-2 border-white" />
                    <div className="absolute top-1 right-1 w-4.5 h-4.5 bg-slate-900 rounded-xs border-2 border-white" />
                    <div className="absolute bottom-1 left-1 w-4.5 h-4.5 bg-slate-900 rounded-xs border-2 border-white" />
                  </div>
                  <div className="text-left font-mono">
                    <p className="text-[9px] text-slate-400 uppercase font-semibold">Validation instantanée</p>
                    <p className="text-[10px] font-bold text-brand-blue-deep">CERTIFIÉ CONFORME</p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-400">
                  <p className="font-semibold text-brand-blue">Cachet Directeur</p>
                  <p className="italic text-slate-400 mt-0.5">AOS ANAPEC Secrétariat</p>
                  <div className="mt-1 h-8 w-24 bg-brand-blue-light border-2 border-dashed border-brand-blue/20 rounded-md flex items-center justify-center text-[8px] text-brand-blue font-bold tracking-widest uppercase select-none pointer-events-none transform -rotate-3">
                    AOS QUALIFIÉ
                  </div>
                </div>
              </div>

            </div>

            {/* Print trigger */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex justify-center items-center gap-1.5 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimer le Bon d'Accord
              </button>
              <button
                onClick={() => setShowVoucher(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
