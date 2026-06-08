/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PrestationRequest, PrestationCategory, RequestStatus } from '../types';
import { Calendar, Tag, ShieldCheck, Clock, XCircle, AlertCircle, FileText, ChevronRight, CheckCircle2, Search } from 'lucide-react';
import { useLang } from '../i18n';

interface PrestationRequestListProps {
  requests: PrestationRequest[];
}

export default function PrestationRequestList({ requests }: PrestationRequestListProps) {
  const { t } = useLang();
  const [selectedRequest, setSelectedRequest] = useState<PrestationRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'ALL'>('ALL');

  const STATUS_META: Record<RequestStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    pending: {
      label: t('prl.statusPending'),
      bg: 'bg-amber-50 border-amber-200/60',
      text: 'text-amber-700',
      icon: <Clock className="w-3.5 h-3.5 mt-0.5" />
    },
    approved: {
      label: t('prl.statusApproved'),
      bg: 'bg-brand-blue-light border-brand-blue/20',
      text: 'text-brand-blue-dark',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mt-0.5" />
    },
    rejected: {
      label: t('prl.statusRejected'),
      bg: 'bg-rose-50 border-rose-200/60',
      text: 'text-rose-700',
      icon: <XCircle className="w-3.5 h-3.5 mt-0.5" />
    }
  };

  const filtered = requests.filter((r) => {
    return statusFilter === 'ALL' || r.status === statusFilter;
  });

  return (
    <div className="space-y-6" id="prestation-request-list-container">

      {/* Title section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-display font-bold text-slate-950 text-base">
            {t('prl.heading')}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('prl.headingDesc')}
          </p>
        </div>

        {/* Status Quick filter */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('prl.filterAll')}
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('prl.filterPending')}
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'approved' ? 'bg-brand-blue text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('prl.filterApproved')}
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'rejected' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('prl.filterRejected')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main List Table Area */}
        <div className="lg:col-span-2 space-y-3.5">
          {filtered.map((req) => {
            const meta = STATUS_META[req.status];
            const isSelected = selectedRequest?.id === req.id;
            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`bg-white rounded-2xl border p-4 transition-all hover:shadow-sm hover:border-slate-300 flex justify-between items-center cursor-pointer ${
                  isSelected ? 'ring-2 ring-brand-blue/20 border-brand-blue bg-linear-to-r from-brand-blue-light/20 to-transparent' : 'border-slate-100'
                }`}
              >
                <div className="space-y-2 max-w-[70%] text-left">
                  {/* Category and Ref */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                      {t(`prl.cat.${req.category}`)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {t('prl.refPrefix')} #{req.id.replace('req_', '').toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-display font-bold text-slate-900 text-sm line-clamp-1">
                    {req.title}
                  </h4>

                  {/* Dates & Amounts */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(req.submissionDate).toLocaleDateString('fr-FR')}
                    </span>
                    {req.amountRequested && (
                      <span className="font-bold text-slate-700">
                        {t('prl.budgetLabel')} {req.amountRequested.toLocaleString()} DH
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side status badge */}
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-dashed flex gap-1.5 items-center ${meta.bg} ${meta.text}`}>
                    {meta.icon}
                    <span>{meta.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
              <p className="text-2xl mb-2">📋</p>
              <h4 className="text-sm font-bold text-slate-700">{t('prl.emptyTitle')}</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-0.5">
                {t('prl.emptyDesc')}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar details box for selected element */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xs h-fit space-y-5">
          {selectedRequest ? (
            <div className="space-y-5 text-left">

              {/* Box Title */}
              <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('prl.sidebarTitle')}</span>
                <span className="text-[10px] font-mono text-slate-400">#{selectedRequest.id}</span>
              </div>

              {/* Status Header Block */}
              <div className={`p-4 rounded-2xl border border-dashed ${STATUS_META[selectedRequest.status].bg} ${STATUS_META[selectedRequest.status].text}`}>
                <div className="flex gap-2.5">
                  {STATUS_META[selectedRequest.status].icon}
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm">
                      {STATUS_META[selectedRequest.status].label}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t('prl.submittedBy')} {selectedRequest.userName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Descriptions block */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('prl.detailObject')}</p>
                <p className="text-xs font-bold text-slate-800 leading-snug">{selectedRequest.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap pt-1">{selectedRequest.description}</p>
              </div>

              {/* Amount comparisons */}
              <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-slate-100 text-xs text-left">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t('prl.amountRequested')}</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">{selectedRequest.amountRequested?.toLocaleString() || '--'} DH</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{t('prl.amountApproved')}</p>
                  <p className="font-extrabold text-brand-blue-dark text-sm mt-0.5">
                    {selectedRequest.status === 'approved'
                      ? `${(selectedRequest.amountApproved || selectedRequest.amountRequested || 0).toLocaleString()} DH`
                      : selectedRequest.status === 'rejected' ? t('prl.amountRejected') : t('prl.amountPending')
                    }
                  </p>
                </div>
              </div>

              {/* Attached file */}
              {selectedRequest.attachedFile && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5 text-xs truncate">
                    <FileText className="w-5 h-5 text-brand-blue shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 truncate">{selectedRequest.attachedFile.name}</p>
                      <p className="text-[10px] text-slate-400">{selectedRequest.attachedFile.size} • {t('prl.fileType')}</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert(t('prl.simulatedDownload')); }}
                    className="text-[11px] font-bold text-brand-blue hover:underline hover:text-brand-blue-dark select-none shrink-0"
                  >
                    {t('prl.openFile')}
                  </a>
                </div>
              )}

              {/* Admin Note if exists */}
              {selectedRequest.adminComment && (
                <div className="p-3.5 bg-slate-50 rounded-xl border-l-4 border-slate-300 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t('prl.adminComment')}</p>
                  <p className="text-xs text-slate-600 italic">
                    "{selectedRequest.adminComment}"
                  </p>
                </div>
              )}

              {/* Timeline Tracker log */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('prl.historyTitle')}</p>
                <div className="space-y-4">
                  {selectedRequest.history?.map((hist, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs">
                      <div className="flex flex-col items-center">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          hist.status === 'approved' ? 'bg-brand-blue' : hist.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-400'
                        }`} />
                        {idx !== (selectedRequest.history?.length || 0) - 1 && (
                          <span className="w-0.5 h-6 bg-slate-100" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">
                          {hist.status === 'approved' ? t('prl.histApproved') : hist.status === 'rejected' ? t('prl.histRejected') : t('prl.histPending')}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {t('prl.histDatePrefix')} {new Date(hist.changeDate).toLocaleDateString('fr-FR')} {t('prl.histDateSuffix')}
                        </p>
                        {hist.comment && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">"{hist.comment}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <span className="text-3xl">👈</span>
              <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase">{t('prl.selectTitle')}</h4>
              <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                {t('prl.selectDesc')}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
