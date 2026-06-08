/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PrestationRequest, UserProfile, Convention, NewsArticle, PrestationCategory, RequestStatus, BoardMember, BoardMemberCategory } from '../types';
import { useLang } from '../i18n';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  ShieldAlert, Check, X, FileText, UserCheck, ShieldCheck,
  Plus, Calendar, Mail, Phone, Award, Building, Landmark, Settings2, Trash2, Edit, Users
} from 'lucide-react';

interface AdminPanelProps {
  requests: PrestationRequest[];
  users: UserProfile[];
  conventions: Convention[];
  news: NewsArticle[];
  boardMembers: BoardMember[];
  onApproveRequest: (id: string, amountApproved: number, comment: string) => void;
  onRejectRequest: (id: string, comment: string) => void;
  onToggleUserStatus: (id: string) => void;
  onPostConvention: (newConv: Convention) => void;
  onPostNews: (newArticle: NewsArticle) => void;
  onAddBoardMember: (member: BoardMember) => void;
  onDeleteBoardMember: (id: string) => void;
}

const COLORS = ['#4A69B1', '#DFB035', '#be123c', '#4f46e5', '#8b5cf6', '#06b6d4', '#ec4899'];

const CATEGORY_EMOJIS: Record<PrestationCategory, string> = {
  EID_AL_ADHA: '🐑',
  ESTIVAGE: '🏖️',
  RENTREE_SCOLAIRE: '🎒',
  DOSSIER_MEDICAL: '🩺',
  PRET_SOCIAL: '🏦',
  PELLERINAGE: '🕋',
  SPORT_CULTURE: '🏆'
};

export default function AdminPanel({
  requests,
  users,
  conventions,
  news,
  boardMembers,
  onApproveRequest,
  onRejectRequest,
  onToggleUserStatus,
  onPostConvention,
  onPostNews,
  onAddBoardMember,
  onDeleteBoardMember
}: AdminPanelProps) {
  const { t } = useLang();

  const categoryLabel = (cat: PrestationCategory): string => {
    const keyMap: Record<PrestationCategory, string> = {
      EID_AL_ADHA: 'adm.catEidAlAdha',
      ESTIVAGE: 'adm.catEstivage',
      RENTREE_SCOLAIRE: 'adm.catRentreeScolaire',
      DOSSIER_MEDICAL: 'adm.catDossierMedical',
      PRET_SOCIAL: 'adm.catPretSocial',
      PELLERINAGE: 'adm.catPellerinage',
      SPORT_CULTURE: 'adm.catSportCulture',
    };
    return `${t(keyMap[cat])} ${CATEGORY_EMOJIS[cat]}`;
  };

  const [activeTab, setActiveTab] = useState<'STATISTICS' | 'REQUESTS' | 'USERS' | 'CONVENTIONS' | 'NEWS' | 'BOARD'>('STATISTICS');

  // Board member form states
  const [bmName, setBmName] = useState('');
  const [bmRole, setBmRole] = useState('');
  const [bmCategory, setBmCategory] = useState<BoardMemberCategory>('BUREAU_EXECUTIF');
  const [bmPhoto, setBmPhoto] = useState('');
  const [bmDelegation, setBmDelegation] = useState('');
  const [bmEmail, setBmEmail] = useState('');
  const [bmPhone, setBmPhone] = useState('');
  const [bmBio, setBmBio] = useState('');
  const [bmOrder, setBmOrder] = useState(0);

  const handleAddBoardMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bmName.trim() || !bmRole.trim()) {
      alert(t('admin.fillRequired'));
      return;
    }
    const newMember: BoardMember = {
      id: crypto.randomUUID(),
      fullName: bmName.trim(),
      role: bmRole.trim(),
      category: bmCategory,
      photoUrl: bmPhoto.startsWith('https://') ? bmPhoto.trim() : undefined,
      delegation: bmDelegation.trim() || undefined,
      email: bmEmail.trim() || undefined,
      phone: bmPhone.trim() || undefined,
      bio: bmBio.trim() || undefined,
      orderIndex: Number(bmOrder) || 0,
    };
    onAddBoardMember(newMember);
    setBmName(''); setBmRole(''); setBmPhoto(''); setBmDelegation('');
    setBmEmail(''); setBmPhone(''); setBmBio(''); setBmOrder(0);
    alert(t('admin.memberAdded'));
  };
  
  // Back office form states
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<'PRESTATION' | 'CONVENTION' | 'COMMUNIQUE' | 'EVENEMENT'>('PRESTATION');
  const [newsImportance, setNewsImportance] = useState<'normal' | 'high'>('normal');

  const [convTitle, setConvTitle] = useState('');
  const [convPartner, setConvPartner] = useState('');
  const [convCategory, setConvCategory] = useState<'HEBERGEMENT' | 'TRANSPORT' | 'SANTE' | 'BANQUE_ASSUR' | 'EDUCATION' | 'SOURIRE'>('HEBERGEMENT');
  const [convValue, setConvValue] = useState('');
  const [convDesc, setConvDesc] = useState('');
  const [convCity, setConvCity] = useState('');
  const [convPhone, setConvPhone] = useState('');
  const [convAddress, setConvAddress] = useState('');

  // Selected request for valuation modal
  const [selectedReq, setSelectedReq] = useState<PrestationRequest | null>(null);
  const [customApproveAmount, setCustomApproveAmount] = useState<number>(0);
  const [adminOpinion, setAdminOpinion] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  // Stats derivation
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;

  // Calcul unique des sommes octroyées à ce jour
  const totalDistributedAmount = requests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + (r.amountApproved || r.amountRequested || 0), 0);

  // Charts data calculation 1: distribution of Requests per Category
  const categoryData = Object.keys(CATEGORY_EMOJIS).map((catKey) => {
    const subset = requests.filter(r => r.category === catKey);
    return {
      name: catKey.replace('_', ' ').substring(0, 10),
      count: subset.length,
      val: subset.reduce((acc, current) => acc + (current.amountRequested || 0), 0)
    };
  });

  // Charts data calculation 2: Status distribution
  const statusPieData = [
    { name: t('adm.chartPieApproved'), value: approvedRequests, color: '#10b981' },
    { name: t('adm.chartPiePending'), value: pendingRequests, color: '#f59e0b' },
    { name: t('adm.chartPieRejected'), value: rejectedRequests, color: '#ef4444' }
  ];

  const handleOpenReviewModal = (req: PrestationRequest) => {
    setSelectedReq(req);
    setCustomApproveAmount(req.amountRequested || 1000);
    setAdminOpinion('');
  };

  const handleApprove = () => {
    if (!selectedReq) return;
    onApproveRequest(selectedReq.id, customApproveAmount, adminOpinion || t('adm.defaultApproveComment'));
    setSelectedReq(null);
  };

  const handleReject = () => {
    if (!selectedReq) return;
    onRejectRequest(selectedReq.id, adminOpinion || t('adm.defaultRejectComment'));
    setSelectedReq(null);
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) {
      alert(t('adm.newsAlertRequired'));
      return;
    }
    const newlyCreated: NewsArticle = {
      id: `news_${Date.now()}`,
      title: newsTitle.trim(),
      summary: newsSummary.trim() || newsContent.trim().substring(0, 100) + '...',
      content: newsContent.trim(),
      publishDate: new Date().toISOString().substring(0, 10),
      category: newsCategory,
      importance: newsImportance,
      author: 'Commission de Communication AOS',
      readCount: 0
    };
    onPostNews(newlyCreated);
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    alert(t('adm.newsAlertSuccess'));
  };

  const handleCreateConvention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convPartner || !convTitle || !convValue) {
      alert(t('adm.convAlertRequired'));
      return;
    }
    const newlyCreated: Convention = {
      id: `conv_${Date.now()}`,
      title: convTitle.trim(),
      partnerName: convPartner.trim(),
      category: convCategory,
      description: convDesc.trim(),
      discountValue: convValue.trim(),
      validityDate: '2027-12-31',
      contactPhone: convPhone || '2255',
      address: convAddress || 'Maroc',
      city: convCity || 'Multi-villes'
    };
    onPostConvention(newlyCreated);
    setConvPartner('');
    setConvTitle('');
    setConvValue('');
    setConvDesc('');
    setConvCity('');
    setConvPhone('');
    setConvAddress('');
    alert(t('adm.convAlertSuccess'));
  };

  return (
    <div className="space-y-6" id="backoffice-admin-panel">
      
      {/* Visual Admin Intro Header */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white text-left relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-bold mb-2">
              <Settings2 className="w-3.5 h-3.5" />
              {t('adm.headerBadge')}
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight">{t('adm.headerTitle')}</h2>
            <p className="text-xs text-slate-400 mt-1">{t('adm.headerDesc')}</p>
          </div>
          
          {/* Tabs header selector */}
          <div className="flex flex-wrap gap-1 bg-slate-800 p-1.5 rounded-2xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('STATISTICS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'STATISTICS' ? 'bg-brand-blue text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t('adm.tabStats')}
            </button>
            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`relative px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'REQUESTS' ? 'bg-brand-blue text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>{t('adm.tabRequests')}</span>
              {pendingRequests > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold font-sans animate-pulse">
                  {pendingRequests}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('USERS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'USERS' ? 'bg-brand-blue text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t('adm.tabUsers')}
            </button>
            <button
              onClick={() => setActiveTab('CONVENTIONS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'CONVENTIONS' ? 'bg-brand-blue text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t('adm.tabConventions')}
            </button>
            <button
              onClick={() => setActiveTab('NEWS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'NEWS' ? 'bg-brand-blue text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t('adm.tabNews')}
            </button>
            <button
              onClick={() => setActiveTab('BOARD')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'BOARD' ? 'bg-brand-blue text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t('admin.board')}
            </button>
          </div>
        </div>
      </div>

      {/* CORE SCREENS BASED ON SELECTED SECTION */}

      {/* 1. STATISTICS DASHBOARD PANEL */}
      {activeTab === 'STATISTICS' && (
        <div className="space-y-6">
          
          {/* Metrics Widget Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-100 p-5 rounded-3xl text-left shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-slate-100 text-slate-800 rounded-2xl text-xl">
                📥
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-slate-400">{t('adm.statTotalLabel')}</p>
                <p className="text-xl font-extrabold text-slate-900">{totalRequests}</p>
                <p className="text-[10px] text-slate-400 font-medium">{t('adm.statTotalSub').replace('{n}', String(pendingRequests))}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl text-left shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl text-xl">
                ⏳
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-slate-400">{t('adm.statPendingLabel')}</p>
                <p className="text-xl font-extrabold text-amber-600">{pendingRequests}</p>
                <p className="text-[10px] text-amber-500 font-medium">{t('adm.statPendingSub')}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl text-left shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-xl">
                💰
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-slate-400">{t('adm.statAmountLabel')}</p>
                <p className="text-xl font-extrabold text-emerald-700">{totalDistributedAmount.toLocaleString()} DH</p>
                <p className="text-[10px] text-emerald-600 font-medium">{t('adm.statAmountSub').replace('{n}', String(approvedRequests))}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl text-left shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-brand-blue-light text-brand-blue border border-brand-blue/20 rounded-2xl text-xl">
                👥
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-slate-400">{t('adm.statUsersLabel')}</p>
                <p className="text-xl font-extrabold text-slate-900">{t('adm.statUsersCount').replace('{n}', String(users.length))}</p>
                <p className="text-[10px] text-emerald-600 font-medium">{t('adm.statUsersSub').replace('{n}', String(users.filter(u => u.cotisationStatus === 'active').length))}</p>
              </div>
            </div>

          </div>

          {/* Recharts Analytics Displays */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Volume of demands per category */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 lg:col-span-2 text-left">
              <h4 className="font-display font-bold text-slate-900 text-sm mb-4">{t('adm.chartBarTitle')}</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" fill="#4A69B1" radius={[4, 4, 0, 0]} name={t('adm.chartBarBarName')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Status distribution pie chart */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 text-left">
              <h4 className="font-display font-bold text-slate-900 text-sm mb-4">{t('adm.chartPieTitle')}</h4>
              <div className="h-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Pie Legends */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-left">
                {statusPieData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.value} {t('adm.chartPieDossiers')}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick reminders list */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 text-left">
            <h4 className="font-display font-bold text-slate-900 text-sm mb-3">{t('adm.reminderTitle')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-850">{t('adm.reminder1Title').replace('{n}', String(pendingRequests))}</p>
                <p className="text-[11px] text-slate-400">{t('adm.reminder1Desc')}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-850">{t('adm.reminder2Title')}</p>
                <p className="text-[11px] text-slate-400">{t('adm.reminder2Desc').replace('{n}', String(users.filter(u=>u.cotisationStatus==='inactive').length))}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-850">{t('adm.reminder3Title')}</p>
                <p className="text-[11px] text-slate-400">{t('adm.reminder3Desc')}</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. REQUESTS WORKFLOW MANAGER */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-6">
          
          <div className="flex justify-between items-center text-left">
            <div>
              <h4 className="font-display font-bold text-slate-900 text-base">{t('adm.reqHeading')}</h4>
              <p className="text-xs text-slate-400">{t('adm.reqSubheading')}</p>
            </div>
            <span className="bg-slate-100 text-slate-800 text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
              {requests.length} {t('adm.reqCounterSuffix')}
            </span>
          </div>

          {/* Requests table */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-left">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50/70">
                  <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                    <th className="px-5 py-3.5">{t('adm.reqColMember')}</th>
                    <th className="px-5 py-3.5">{t('adm.reqColDelegation')}</th>
                    <th className="px-5 py-3.5">{t('adm.reqColCategory')}</th>
                    <th className="px-5 py-3.5">{t('adm.reqColAmount')}</th>
                    <th className="px-5 py-3.5">{t('adm.reqColDate')}</th>
                    <th className="px-5 py-3.5 text-center">{t('adm.reqColStatus')}</th>
                    <th className="px-5 py-3.5 text-right">{t('adm.reqColActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/40">
                      
                      {/* Name & ID */}
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-bold text-slate-900">{req.userName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Ref: {req.userMatricule}</p>
                        </div>
                      </td>

                      {/* Delegation */}
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        {req.userDelegation}
                      </td>

                      {/* Benefit Type */}
                      <td className="px-5 py-3.5 text-xs">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {categoryLabel(req.category)}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 font-bold text-slate-900 text-xs">
                        {req.amountRequested?.toLocaleString() || '--'} DH
                      </td>

                      {/* Submission Date */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
                        {req.submissionDate}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'approved' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                            : req.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/50'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/50 animate-pulse'
                        }`}>
                          {req.status === 'approved' ? t('adm.reqStatusApproved') : req.status === 'rejected' ? t('adm.reqStatusRejected') : t('adm.reqStatusPending')}
                        </span>
                      </td>

                      {/* Review Buttons */}
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenReviewModal(req)}
                          className={`font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            req.status === 'pending'
                              ? 'bg-brand-blue hover:bg-brand-blue-dark text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {req.status === 'pending' ? t('adm.reqBtnReview') : t('adm.reqBtnReReview')}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3. USERS MANAGEMENT DATABASE */}
      {activeTab === 'USERS' && (
        <div className="space-y-6">
          
          <div className="flex justify-between items-center text-left">
            <div>
              <h4 className="font-display font-bold text-slate-900 text-base">{t('adm.usersHeading')}</h4>
              <p className="text-xs text-slate-400">{t('adm.usersSubheading')}</p>
            </div>
            <span className="bg-slate-100 text-slate-800 text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
              {users.length} {t('adm.usersCounterSuffix')}
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-left">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50/70">
                  <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                    <th className="px-5 py-3.5">{t('adm.usersColMember')}</th>
                    <th className="px-5 py-3.5">{t('adm.usersColMatricule')}</th>
                    <th className="px-5 py-3.5">{t('adm.usersColDelegation')}</th>
                    <th className="px-5 py-3.5">{t('adm.usersColPhone')}</th>
                    <th className="px-5 py-3.5">{t('adm.usersColRole')}</th>
                    <th className="px-5 py-3.5 text-center">{t('adm.usersColCotisation')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {users.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/40">
                      
                      {/* Name & Photo */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120'}
                            alt="avatar"
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.prenom} {item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{item.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Credentials */}
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-mono text-xs font-bold text-slate-800">{item.matricule}</p>
                          <p className="text-[10px] text-slate-400">{item.grade || t('adm.usersGradeDefault')}</p>
                        </div>
                      </td>

                      {/* Delegation */}
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        {item.delegation}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
                        {item.telephone}
                      </td>

                      {/* Role representation with toggle capability */}
                      <td className="px-5 py-3.5 text-xs">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border ${
                          item.role === 'admin' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200/50' 
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200/50'
                        }`}>
                          {item.role === 'admin' ? t('adm.usersRoleAdmin') : t('adm.usersRoleMember')}
                        </span>
                      </td>

                      {/* Cotisation toggle triggers */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleUserStatus(item.id)}
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                            item.cotisationStatus === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200/60 hover:bg-rose-100'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.cotisationStatus === 'active' ? '#10b981' : '#f43f5e' }} />
                          <span>{item.cotisationStatus === 'active' ? t('adm.usersCotisationActive') : t('adm.usersCotisationInactive')}</span>
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 4. POST NEW CONVENTIONS FORM */}
      {activeTab === 'CONVENTIONS' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 text-left max-w-2xl mx-auto shadow-xs">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h4 className="font-display font-bold text-slate-900 text-base">{t('adm.convHeading')}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t('adm.convSubheading')}</p>
          </div>

          <form onSubmit={handleCreateConvention} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.convLabelPartner')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('adm.convPlaceholderPartner')}
                  value={convPartner}
                  onChange={(e) => setConvPartner(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.convLabelTitle')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('adm.convPlaceholderTitle')}
                  value={convTitle}
                  onChange={(e) => setConvTitle(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.convLabelCategory')}</label>
                <select
                  value={convCategory}
                  onChange={(e) => setConvCategory(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="HEBERGEMENT">{t('adm.convCatHotel')}</option>
                  <option value="TRANSPORT">{t('adm.convCatTransport')}</option>
                  <option value="SANTE">{t('adm.convCatHealth')}</option>
                  <option value="BANQUE_ASSUR">{t('adm.convCatBank')}</option>
                  <option value="EDUCATION">{t('adm.convCatEducation')}</option>
                  <option value="SOURIRE">{t('adm.convCatLeisure')}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.convLabelValue')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('adm.convPlaceholderValue')}
                  value={convValue}
                  onChange={(e) => setConvValue(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-brand-blue-dark"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.convLabelCity')}</label>
                <input
                  type="text"
                  placeholder={t('adm.convPlaceholderCity')}
                  value={convCity}
                  onChange={(e) => setConvCity(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.convLabelPhone')}</label>
                <input
                  type="text"
                  placeholder={t('adm.convPlaceholderPhone')}
                  value={convPhone}
                  onChange={(e) => setConvPhone(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.convLabelAddress')}</label>
              <input
                type="text"
                placeholder={t('adm.convPlaceholderAddress')}
                value={convAddress}
                onChange={(e) => setConvAddress(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.convLabelDesc')}</label>
              <textarea
                rows={3}
                placeholder={t('adm.convPlaceholderDesc')}
                value={convDesc}
                onChange={(e) => setConvDesc(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                type="submit"
                className="px-6 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {t('adm.convBtnSubmit')}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 5. POST NEW ANNOUNCEMENT FORM */}
      {activeTab === 'NEWS' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 text-left max-w-2xl mx-auto shadow-xs">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h4 className="font-display font-bold text-slate-900 text-base">{t('adm.newsHeading')}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t('adm.newsSubheading')}</p>
          </div>

          <form onSubmit={handleCreateNews} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.newsLabelTitle')}</label>
              <input
                type="text"
                required
                placeholder={t('adm.newsPlaceholderTitle')}
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.newsLabelCategory')}</label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="PRESTATION">{t('adm.newsCatPrestation')}</option>
                  <option value="CONVENTION">{t('adm.newsCatConvention')}</option>
                  <option value="COMMUNIQUE">{t('adm.newsCatCommunique')}</option>
                  <option value="EVENEMENT">{t('adm.newsCatEvent')}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.newsLabelImportance')}</label>
                <select
                  value={newsImportance}
                  onChange={(e) => setNewsImportance(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="normal">{t('adm.newsImportanceNormal')}</option>
                  <option value="high">{t('adm.newsImportanceHigh')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.newsLabelSummary')}</label>
              <input
                type="text"
                placeholder={t('adm.newsPlaceholderSummary')}
                value={newsSummary}
                onChange={(e) => setNewsSummary(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('adm.newsLabelContent')}</label>
              <textarea
                rows={6}
                required
                placeholder={t('adm.newsPlaceholderContent')}
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                type="submit"
                className="px-6 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {t('adm.newsBtnSubmit')}
              </button>
            </div>

          </form>
        </div>
      )}


      {/* 6. BOARD MEMBERS MANAGEMENT */}
      {activeTab === 'BOARD' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Add member form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 text-left shadow-xs h-fit">
            <div className="pb-4 border-b border-slate-100 mb-5">
              <h4 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-blue" />
                {t('admin.boardTitle')}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('admin.boardDesc')}</p>
            </div>

            <form onSubmit={handleAddBoardMember} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('admin.category')}</label>
                <select
                  value={bmCategory}
                  onChange={(e) => setBmCategory(e.target.value as BoardMemberCategory)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="BUREAU_EXECUTIF">{t('board.bureau')}</option>
                  <option value="CONSEIL_NATIONAL">{t('board.council')}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('admin.fullName')} *</label>
                  <input type="text" required value={bmName} onChange={(e) => setBmName(e.target.value)} maxLength={120}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('admin.role')} *</label>
                  <input type="text" required value={bmRole} onChange={(e) => setBmRole(e.target.value)} maxLength={80}
                    placeholder={t('adm.rolePlaceholder')}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('admin.photo')}</label>
                <input type="url" value={bmPhoto} onChange={(e) => setBmPhoto(e.target.value)} placeholder="https://..."
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('admin.delegation')}</label>
                  <input type="text" value={bmDelegation} onChange={(e) => setBmDelegation(e.target.value)} maxLength={80}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('admin.order')}</label>
                  <input type="number" value={bmOrder} onChange={(e) => setBmOrder(Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('admin.email')}</label>
                  <input type="email" value={bmEmail} onChange={(e) => setBmEmail(e.target.value)} maxLength={120}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('admin.phone')}</label>
                  <input type="text" value={bmPhone} onChange={(e) => setBmPhone(e.target.value)} maxLength={40}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('admin.bio')}</label>
                <textarea rows={3} value={bmBio} onChange={(e) => setBmBio(e.target.value)} maxLength={500}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>

              <div className="pt-2 text-right">
                <button type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" />
                  {t('admin.save')}
                </button>
              </div>
            </form>
          </div>

          {/* Current members list */}
          <div className="lg:col-span-3 space-y-5">
            {(['BUREAU_EXECUTIF', 'CONSEIL_NATIONAL'] as BoardMemberCategory[]).map((cat) => {
              const list = boardMembers
                .filter(m => m.category === cat)
                .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
              return (
                <div key={cat} className="bg-white rounded-3xl border border-slate-100 p-5 text-left shadow-xs">
                  <h5 className="font-display font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    {cat === 'BUREAU_EXECUTIF' ? <Building className="w-4 h-4 text-brand-blue" /> : <Landmark className="w-4 h-4 text-brand-blue" />}
                    {cat === 'BUREAU_EXECUTIF' ? t('board.bureau') : t('board.council')}
                    <span className="text-xs font-semibold text-slate-400">({list.length})</span>
                  </h5>
                  {list.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3">{t('board.empty')}</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {list.map((m) => (
                        <div key={m.id} className="flex items-center gap-3 py-2.5">
                          {m.photoUrl ? (
                            <img src={m.photoUrl} alt={m.fullName} referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-brand-blue-light flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-brand-blue-dark">
                                {m.fullName.split(' ').map(p => p.charAt(0)).slice(0, 2).join('').toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-sm truncate">{m.fullName}</p>
                            <p className="text-[10px] text-slate-400">{m.role}{m.delegation ? ` • ${m.delegation}` : ''}</p>
                          </div>
                          <button
                            onClick={() => { if (confirm(t('admin.confirmDelete'))) onDeleteBoardMember(m.id); }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title={t('admin.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Arbitrage Modal detailing request evaluation */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col justify-between text-left">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-display">
                <Settings2 className="w-4 h-4" />
                {t('adm.modalTitle')}
              </span>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 font-extrabold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">{t('adm.modalRequester')}</span>
                <p className="text-base font-bold text-slate-900">{selectedReq.userName}</p>
                <p className="text-xs text-slate-500 font-mono">{t('adm.modalMatricule').replace('{mat}', selectedReq.userMatricule).replace('{del}', selectedReq.userDelegation)}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{categoryLabel(selectedReq.category)}</p>
                <p className="text-xs font-bold text-slate-800">{selectedReq.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed italic">"{selectedReq.description}"</p>
              </div>

              {/* Justificatif file indicator */}
              {selectedReq.attachedFile && (
                <div className="p-3 bg-brand-blue-light/50 rounded-xl border border-brand-blue/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-brand-blue" />
                    <div>
                      <p className="font-bold text-slate-800 truncate max-w-[180px]">{selectedReq.attachedFile.name}</p>
                      <p className="text-[10px] text-brand-blue font-medium">{t('adm.modalFileLabel').replace('{size}', selectedReq.attachedFile.size)}</p>
                    </div>
                  </div>
                  <span className="bg-brand-blue-accent text-brand-blue-dark px-2 py-0.5 rounded-sm font-bold text-[9px]">{t('adm.modalFileClick')}</span>
                </div>
              )}

              {/* Budget valuation */}
              <div className="space-y-4 pt-3 border-t border-slate-100 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">{t('adm.modalBudgetRequested')}</label>
                    <p className="text-base font-extrabold text-slate-800 mt-1">{selectedReq.amountRequested?.toLocaleString() || '--'} DH</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">{t('adm.modalBudgetGranted')}</label>
                    <div className="relative rounded-lg shadow-xs mt-1">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                        DH
                      </div>
                      <input
                        type="number"
                        value={customApproveAmount}
                        onChange={(e) => setCustomApproveAmount(Number(e.target.value))}
                        className="block w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-brand-blue-dark"
                      />
                    </div>
                  </div>
                </div>

                {/* Response Opinion comment */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">{t('adm.modalOpinionLabel')}</label>
                  <textarea
                    rows={3}
                    placeholder={t('adm.modalOpinionPlaceholder')}
                    value={adminOpinion}
                    onChange={(e) => setAdminOpinion(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

            </div>

            {/* Modal actions footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-end">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 bg-white text-slate-600 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                {t('adm.modalBtnCancel')}
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                {t('adm.modalBtnReject')}
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                {t('adm.modalBtnApprove')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
