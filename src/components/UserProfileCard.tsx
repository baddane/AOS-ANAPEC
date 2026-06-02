/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { DELEGATIONS_LIST } from '../mockData';
import { User, Mail, Phone, MapPin, Award, Download, Edit2, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';

interface UserProfileCardProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function UserProfileCard({ currentUser, onUpdateProfile }: UserProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [prenom, setPrenom] = useState(currentUser.prenom);
  const [telephone, setTelephone] = useState(currentUser.telephone);
  const [delegation, setDelegation] = useState(currentUser.delegation);
  const [grade, setGrade] = useState(currentUser.grade || 'Collaborateur ADHA');
  const [avatar, setAvatar] = useState(currentUser.avatarUrl || '');
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const updatedUser: UserProfile = {
      ...currentUser,
      name: name.trim(),
      prenom: prenom.trim(),
      telephone: telephone.trim(),
      delegation,
      grade,
      avatarUrl: avatar || undefined
    };

    onUpdateProfile(updatedUser);
    setIsEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const isProfileActive = currentUser.cotisationStatus === 'active';

  return (
    <div className="space-y-6" id="user-profile-card-container">
      
      {/* Upper Status Notifications */}
      {success && (
        <div className="p-3 bg-brand-blue-light border border-brand-blue/20 text-brand-blue-dark text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-blue" />
          <span>Profil mis à jour avec succès dans le système central de l'AOS.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Visual membership Card Simulator (Left) */}
        <div className="md:col-span-1 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">CARTE D'ADHÉRENT OFFICIELLE</h4>
          
          {/* Virtual Plastic ID Card */}
          <div className="relative aspect-[1.58/1] w-full rounded-2xl bg-gradient-to-br from-brand-blue-deep via-brand-blue to-slate-900 text-white p-5 overflow-hidden shadow-lg border border-brand-gold/30">
            
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
            
            {/* Hologram or seal */}
            <div className="absolute top-12 right-6 w-12 h-12 bg-brand-gold/10 rounded-full border border-brand-gold/20 flex items-center justify-center font-display text-[8px] font-bold text-brand-gold tracking-wider uppercase select-none pointer-events-none transform rotate-12">
              ★ AOS CERTIFIED
            </div>

            {/* Header info */}
            <div className="flex justify-between items-start border-b border-brand-blue-light/20 pb-2.5">
              <div className="text-left">
                <h5 className="font-display font-extrabold text-[11px] tracking-wide uppercase text-brand-gold">
                  AOS ANAPEC
                </h5>
                <p className="text-[8px] text-brand-blue-light uppercase font-semibold">Œuvres Sociales de l'ANAPEC</p>
              </div>
              <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-md ${
                isProfileActive ? 'bg-brand-blue-light/20 text-white border border-brand-blue-light/30' : 'bg-rose-500/25 text-rose-300 border border-rose-500/30'
              }`}>
                {isProfileActive ? 'Adhérent Actif' : 'Cotisation Suspendue'}
              </span>
            </div>

            {/* Card Body - Avatar + Details */}
            <div className="flex gap-4 mt-4 text-left">
              {/* Profile image placeholder */}
              <div className="w-16 h-16 rounded-xl border-2 border-brand-gold/50 overflow-hidden bg-slate-800 shrink-0">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Personal labels */}
              <div className="space-y-1 text-xs">
                <div>
                  <p className="text-[8px] text-brand-blue-light font-bold uppercase tracking-wider">Nom & Prénom</p>
                  <p className="font-bold text-white text-sm truncate max-w-[150px]">
                    {currentUser.prenom} {currentUser.name}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] text-brand-blue-light font-bold uppercase tracking-wider">Matricule agent</p>
                  <p className="font-mono font-bold text-brand-gold">{currentUser.matricule}</p>
                </div>
              </div>
            </div>

            {/* Card Footer metadata & simulated barcode */}
            <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
              <div className="text-left">
                <p className="text-[7px] text-brand-blue-light uppercase">Délégation régionale</p>
                <p className="font-semibold text-[9px] truncate max-w-[140px] text-teal-100">{currentUser.delegation}</p>
              </div>

              {/* Barcode representation */}
              <div className="flex flex-col items-center">
                <div className="flex gap-0.5 items-end h-4">
                  {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3].map((w, idx) => (
                    <span key={idx} className="bg-white/85" style={{ width: `${w}px`, height: '100%' }} />
                  ))}
                </div>
                <span className="text-[7px] font-mono text-brand-blue-light mt-0.5">AOS-{currentUser.matricule}</span>
              </div>
            </div>

          </div>

          {/* Prompt to download/print card */}
          <button
            onClick={() => window.print()}
            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Imprimer ma carte d'Adhérent
          </button>
        </div>

        {/* Detailed profile configuration (Right) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs text-left">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div>
                <h4 className="font-display font-bold text-slate-900 text-base">Informations de l'Adhérent</h4>
                <p className="text-xs text-slate-400 mt-0.5">Données de l'agent déclarées à l'Association des Œuvres Sociales</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blue-dark bg-brand-blue-light hover:bg-brand-blue-accent/70 rounded-lg transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Annuler l\'édition' : 'Modifier mes coordonnées'}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Prénom</label>
                    <input
                      type="text"
                      required
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nom de famille</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Numéro de Téléphone</label>
                    <input
                      type="text"
                      required
                      placeholder="+212 6..."
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Délégation ANAPEC régionale</label>
                    <select
                      value={delegation}
                      onChange={(e) => setDelegation(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    >
                      {DELEGATIONS_LIST.map((del) => (
                        <option key={del} value={del}>{del}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Grade administratif</label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">URL de l'Avatar (Photo de profil)</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-2.5 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-blue text-white text-xs font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors cursor-pointer"
                  >
                    Mettre à jour mon profil
                  </button>
                </div>

              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                
                {/* Email (read-only) */}
                <div className="flex gap-3 items-start">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Adresse email professionnelle</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{currentUser.email}</p>
                    <p className="text-[10px] text-slate-400 font-italic mt-0.5">Identifiant de connexion intranet unique</p>
                  </div>
                </div>

                {/* Account details */}
                <div className="flex gap-3 items-start">
                  <User className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Identité complète</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{currentUser.prenom} {currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Matricule: {currentUser.matricule}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-3 items-start">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Téléphone portable</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{currentUser.telephone || 'Non renseigné'}</p>
                  </div>
                </div>

                {/* Delegation */}
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rattachement Régional</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{currentUser.delegation}</p>
                  </div>
                </div>

                {/* Membership Metadata details */}
                <div className="flex gap-3 items-start col-span-full pt-4 border-t border-slate-100">
                  <Award className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Situation & Cotisation AOS</p>
                    <div className="flex flex-wrap gap-4 mt-1.5 items-center">
                      <span className="text-xs font-semibold text-slate-600">
                        Membre de l'association depuis le: <strong className="text-slate-800">{new Date(currentUser.membershipDate).toLocaleDateString('fr-FR', {year: 'numeric', month: 'long', day: 'numeric'})}</strong>
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        isProfileActive 
                          ? 'bg-brand-blue-light text-brand-blue-dark border-brand-blue/20' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        🔑 {isProfileActive ? 'Cotisation Régulière' : 'Non à jour'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Section : Sécurité — Microsoft SSO */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:12px_12px] opacity-30 pointer-events-none" />

            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
              <Lock className="w-4 h-4 text-brand-blue" />
              <h4 className="font-display font-bold text-slate-900 text-base">Sécurité & Accès Intranet</h4>
            </div>

            <div className="flex items-start gap-4 p-4 bg-brand-blue-light rounded-2xl border border-brand-blue/15">
              <ShieldCheck className="w-8 h-8 text-brand-blue shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-brand-blue-dark">Authentification Microsoft Azure AD</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Votre accès est sécurisé via votre compte professionnel Microsoft ANAPEC (<span className="font-mono">{currentUser.email}</span>).
                  La gestion du mot de passe s'effectue directement depuis votre portail Microsoft 365.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pour changer votre mot de passe, rendez-vous sur <span className="font-mono text-brand-blue">account.microsoft.com</span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
