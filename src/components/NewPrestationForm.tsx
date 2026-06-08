/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PrestationRequest, PrestationCategory, UserProfile } from '../types';
import { DELEGATIONS_LIST } from '../mockData';
import { HeartHandshake, FileText, Upload, AlertCircle, CheckCircle2, DollarSign, Send, Landmark } from 'lucide-react';
import { useLang } from '../i18n';

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

const BENEFIT_CATEGORY_VALUES: { value: PrestationCategory }[] = [
  { value: 'EID_AL_ADHA' },
  { value: 'ESTIVAGE' },
  { value: 'RENTREE_SCOLAIRE' },
  { value: 'DOSSIER_MEDICAL' },
  { value: 'PRET_SOCIAL' },
  { value: 'PELLERINAGE' },
  { value: 'SPORT_CULTURE' },
];

export default function NewPrestationForm({ currentUser, onSubmitRequest, onCancel }: NewPrestationFormProps) {
  const { t } = useLang();
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
      setErrorMsg(t('pf.errNotActive'));
      return;
    }

    if (!title.trim() || !description.trim()) {
      setErrorMsg(t('pf.errTitleDesc'));
      return;
    }

    if (!attachedFile) {
      setErrorMsg(t('pf.errNoFile'));
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

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-5 max-w-md mx-auto my-8 shadow-xs" id="success-prestation-request-container">
        <div className="mx-auto w-12 h-12 rounded-full bg-brand-blue-light text-brand-blue-dark flex items-center justify-center text-xl">
          ✓
        </div>
        <h3 className="font-display font-bold text-slate-900 text-lg">{t('pf.successTitle')}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {t('pf.successBody')}
        </p>
        <div className="pt-2">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-brand-blue text-white text-xs font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors cursor-pointer"
          >
            {t('pf.successBack')}
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
            {t('pf.headerTitle')}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('pf.headerDesc')}
          </p>
        </div>
        <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-1 rounded-md font-bold uppercase">
          {t('pf.espaceBadge')}
        </span>
      </div>

      <div className="p-6 md:p-8">

        {/* Warning Badge for inactive sub */}
        {!isProfileActive && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">{t('pf.inactiveTitle')}</p>
              <p className="leading-relaxed text-[11px] text-amber-700">
                {t('pf.inactiveBody')}
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
                {t('pf.labelCategory')}
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
                {BENEFIT_CATEGORY_VALUES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {t(`pf.cat.${cat.value}`)}
                  </option>
                ))}
              </select>

              {/* Informative limit box */}
              <div className="p-3 bg-brand-blue-light rounded-xl border border-brand-blue/20 text-[11px] text-brand-blue-dark space-y-0.5 animate-fade-in">
                <p className="font-semibold">{t(`pf.catDesc.${category}`)}</p>
                <p className="font-bold text-brand-blue">{t(`pf.catLimit.${category}`)}</p>
              </div>
            </div>

            {/* Amount & Title */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('pf.labelTitle')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('pf.placeholderTitle')}
                  value={title}
                  disabled={!isProfileActive}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-blue rounded-xl text-slate-900 text-sm transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('pf.labelAmount')}
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
              {t('pf.labelDescription')}
            </label>
            <textarea
              rows={4}
              required
              disabled={!isProfileActive}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('pf.placeholderDescription')}
              className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-blue rounded-xl text-slate-900 text-sm transition-all"
            />
          </div>

          {/* Attachement simulation drag-and-drop */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('pf.labelFiles')}
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
                      <p className="text-[10px] text-slate-400">{attachedFile.size} • {t('pf.fileTypeBadge')}</p>
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
                      {t('pf.dropZoneText')}{" "}
                      <label htmlFor="attached-file-input" className="text-brand-blue font-extrabold hover:underline cursor-pointer">
                        {t('pf.dropZoneBrowse')}
                      </label>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {t('pf.dropZoneHint')}
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
              {t('pf.btnCancel')}
            </button>
            <button
              type="submit"
              disabled={!isProfileActive}
              className={`inline-flex justify-center items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white rounded-lg transition-all shadow-xs ${
                isProfileActive ? 'bg-brand-blue hover:bg-brand-blue-dark cursor-pointer shadow-md shadow-brand-blue/15' : 'bg-slate-300 pointer-events-none'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              {t('pf.btnSubmit')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
