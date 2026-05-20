/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PrestationRequest, PrestationCategory, UserProfile } from '../types';
import { DELEGATIONS_LIST } from '../mockData';
import { HeartHandshake, FileText, Upload, AlertCircle, CheckCircle2, DollarSign, Send, Landmark } from 'lucide-react';

interface NewPrestationFormProps {
  currentUser: UserProfile;
  onSubmitRequest: (request: {
    category: PrestationCategory;
    title: string;
    amountRequested: number;
    description: string;
    attachedFile: { name: string; size: string; type: string } | null;
  }) => void;
  onCancel: () => void;
}

const BENEFIT_CATEGORIES: { value: PrestationCategory; label: string; description: string; limit?: string }[] = [
  { value: 'EID_AL_ADHA', label: 'Aide Exceptionnelle de l\'Aïd Al-Adha', description: 'Assistance financière réglementaire forfaitaire annuelle pour l\'achat du mouton.', limit: 'Montant forfaitaire: 2 000 DH' },
  { value: 'ESTIVAGE', label: 'Estivage & Vacances Familiales', description: 'Prise en charge partielle des frais d\'hébergement ou de camps d\'été organisés par l\'AOS.', limit: 'Subvention jusqu\'à: 4 000 DH' },
  { value: 'RENTREE_SCOLAIRE', label: 'Subvention de la Rentrée Scolaire', description: 'Assistance pour frais scolaires et fournitures pour vos enfants scolarisés.', limit: 'Montant par enfant: 500 DH' },
  { value: 'DOSSIER_MEDICAL', label: 'Remboursement Mutuelle Complémentaire', description: 'Soutien aux soins dentaires, optiques, maternité ou opérations chirurgicales complexes.', limit: 'Selon barème de mutuelle' },
  { value: 'PRET_SOCIAL', label: 'Prêt Social Sans Intérêt (0%)', description: 'Formulation de prêt d\'honneur de trésorerie pour urgences ou événements de vie majeurs.', limit: 'Maximum: 20 000 DH' },
  { value: 'PELLERINAGE', label: 'Subvention Hajj / Omra (Pèlerinage)', description: 'Soutien de l\'AOS réservé aux agents tirés au sort pour le pèlerinage aux lieux sacrés.', limit: 'Subvention forfaitaire: 10 000 DH' },
  { value: 'SPORT_CULTURE', label: 'Activités Sportives & Culturelles', description: 'Remboursement d\'abonnements annuels à des clubs sportifs ou événements agréés.', limit: 'Subvention jusqu\'à: 1 500 DH' }
];

export default function NewPrestationForm({ currentUser, onSubmitRequest, onCancel }: NewPrestationFormProps) {
  const [category, setCategory] = useState<PrestationCategory>('EID_AL_ADHA');
  const [title, setTitle] = useState('');
  const [amountRequested, setAmountRequested] = useState<number>(2000);
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Validate Active Status before allowing submissions
  const isProfileActive = currentUser.cotisationStatus === 'active';

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      registerFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      registerFile(file);
    }
  };

  const registerFile = (file: File) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setAttachedFile({
      name: file.name,
      size: `${sizeInMB} MB`,
      type: file.type
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isProfileActive) {
      setErrorMsg("Votre profil d'adhérent n'est pas actif. Seuls les adhérents à jour de leurs cotisations de l'AOS sont autorisés à émettre des demandes.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setErrorMsg("Veuillez remplir le titre et la description détaillée de votre demande.");
      return;
    }

    if (!attachedFile) {
      setErrorMsg("Veuillez joindre les pièces justificatives requises (RIB, factures, certificats médicaux, fiches de paie, etc.) pour appuyer votre demande.");
      return;
    }

    // Call submit handler
    onSubmitRequest({
      category,
      title: title.trim(),
      amountRequested: Number(amountRequested),
      description: description.trim(),
      attachedFile
    });

    setSuccess(true);
  };

  const activeCategoryMeta = BENEFIT_CATEGORIES.find(c => c.value === category);

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-5 max-w-md mx-auto my-8 shadow-xs" id="success-prestation-request-container">
        <div className="mx-auto w-12 h-12 rounded-full bg-brand-blue-light text-brand-blue-dark flex items-center justify-center text-xl">
          ✓
        </div>
        <h3 className="font-display font-bold text-slate-900 text-lg">Demande soumise avec succès !</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Votre requête de prestation sociale a été enregistrée dans notre intranet de l'AOS. L'équipe du Secrétariat Social va étudier vos pièces justificatives sous un délai de 5 à 7 jours ouvrables.
        </p>
        <div className="pt-2">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-brand-blue text-white text-xs font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors cursor-pointer"
          >
            Retour au Tableau de Bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden" id="new-prestation-form">
      
      {/* Visual Header */}
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-base">
            Déposer une nouvelle demande de Prestation
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Soumettre un dossier social, d'aide financière ou de mutuelle
          </p>
        </div>
        <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-1 rounded-md font-bold uppercase">
          Espace Adhérent
        </span>
      </div>

      <div className="p-6 md:p-8">
        
        {/* Warning Badge for inactive sub */}
        {!isProfileActive && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Abonnement / Cotisation suspendu</p>
              <p className="leading-relaxed text-[11px] text-amber-700">
                Vos cotisations mensuelles ne semblent pas être à jour (Status d'adhésion : inactive). Vous ne pouvez pas finaliser votre demande. Veuillez contacter l'administration de l'AOS au chef-lieu de votre délégation régionale pour régulariser votre dossier.
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Nature de la Prestation Sociale
              </label>
              <select
                id="benefit-category-select"
                value={category}
                onChange={(e) => {
                  const val = e.target.value as PrestationCategory;
                  setCategory(val);
                  // Setup sensible amounts based on selections
                  if (val === 'EID_AL_ADHA') setAmountRequested(2000);
                  else if (val === 'ESTIVAGE') setAmountRequested(3000);
                  else if (val === 'RENTREE_SCOLAIRE') setAmountRequested(1000);
                  else if (val === 'DOSSIER_MEDICAL') setAmountRequested(1500);
                  else if (val === 'PRET_SOCIAL') setAmountRequested(15000);
                  else if (val === 'PELLERINAGE') setAmountRequested(10000);
                  else if (val === 'SPORT_CULTURE') setAmountRequested(1200);
                }}
                disabled={!isProfileActive}
                className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-blue rounded-xl text-slate-950 text-sm transition-all"
              >
                {BENEFIT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Informative limit box */}
              {activeCategoryMeta && (
                <div className="p-3 bg-brand-blue-light rounded-xl border border-brand-blue/20 text-[11px] text-brand-blue-dark space-y-0.5 animate-fade-in">
                  <p className="font-semibold">{activeCategoryMeta.description}</p>
                  {activeCategoryMeta.limit && (
                    <p className="font-bold text-brand-blue">{activeCategoryMeta.limit}</p>
                  )}
                </div>
              )}
            </div>

            {/* Amount & Title */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Intitulé de l'objet
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Demande de remboursement monture optique ou prime de rentrée scolaire"
                  value={title}
                  disabled={!isProfileActive}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-blue rounded-xl text-slate-900 text-sm transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Montant estimé ou demandé (DH)
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                    DH
                  </div>
                  <input
                    type="number"
                    required
                    min={100}
                    value={amountRequested}
                    disabled={!isProfileActive}
                    onChange={(e) => setAmountRequested(Number(e.target.value))}
                    className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-blue rounded-xl text-slate-900 text-sm transition-all"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Description Détaillée & Justifications d'éligibilité
            </label>
            <textarea
              rows={4}
              required
              disabled={!isProfileActive}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Veuillez spécifier toutes les informations requises (nombres d'enfants scolarisés, dates précises du voyage d'estivage, factures de dépenses médicales, coordonnées bancaires...). Votre descriptif sera lu attentivement par la commission sociale de l'association."
              className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-blue rounded-xl text-slate-900 text-sm transition-all"
            />
          </div>

          {/* Attachement simulation drag-and-drop */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Pièces Justificatives Obligatoires (Dossier Compressé / Fichiers PDF, Images)
            </label>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                dragActive ? 'border-brand-blue bg-brand-blue-light/30' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              } ${!isProfileActive ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input
                id="attached-file-input"
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.zip"
                onChange={handleFileInput}
                disabled={!isProfileActive}
              />
              
              <div className="space-y-3 flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                
                {attachedFile ? (
                  <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs flex gap-2 items-center shadow-xs">
                    <FileText className="w-4 h-4 text-brand-blue" />
                    <div>
                      <p className="font-bold truncate max-w-[200px]">{attachedFile.name}</p>
                      <p className="text-[10px] text-slate-400">{attachedFile.size} • PDF / Justificatif</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="ml-2 hover:text-rose-600 font-extrabold text-sm select-none cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="text-xs space-y-1 text-slate-500">
                    <p className="font-bold text-slate-800">
                      Glissez-déposez votre dossier ici, ou{" "}
                      <label htmlFor="attached-file-input" className="text-brand-blue font-extrabold hover:underline cursor-pointer">
                        compulsez vos fichiers
                      </label>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Fichiers autorisés : PDF, ZIP, PNG ou JPG (Max. 10 Mo pour justificatif social)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 bg-white text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isProfileActive}
              className={`inline-flex justify-center items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white rounded-lg transition-all shadow-xs ${
                isProfileActive ? 'bg-brand-blue hover:bg-brand-blue-dark cursor-pointer shadow-md shadow-brand-blue/15' : 'bg-slate-300 pointer-events-none'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Soumettre ma demande d'aide
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
