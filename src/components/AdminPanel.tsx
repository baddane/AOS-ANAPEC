/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PrestationRequest, UserProfile, Convention, NewsArticle, PrestationCategory, RequestStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ShieldAlert, Check, X, FileText, UserCheck, ShieldCheck, 
  Plus, Calendar, Mail, Phone, Award, Building, Landmark, Settings2, Trash2, Edit
} from 'lucide-react';

interface AdminPanelProps {
  requests: PrestationRequest[];
  users: UserProfile[];
  conventions: Convention[];
  news: NewsArticle[];
  onApproveRequest: (id: string, amountApproved: number, comment: string) => void;
  onRejectRequest: (id: string, comment: string) => void;
  onToggleUserStatus: (id: string) => void;
  onPostConvention: (newConv: Convention) => void;
  onPostNews: (newArticle: NewsArticle) => void;
}

const COLORS = ['#4A69B1', '#DFB035', '#be123c', '#4f46e5', '#8b5cf6', '#06b6d4', '#ec4899'];

const CATEGORY_LABELS: Record<PrestationCategory, string> = {
  EID_AL_ADHA: 'Aïd Al-Adha 🐑',
  ESTIVAGE: 'Estivage & Vacances 🏖️',
  RENTREE_SCOLAIRE: 'Rentrée Scolaire 🎒',
  DOSSIER_MEDICAL: 'Dossier Médical Mutuelle 🩺',
  PRET_SOCIAL: 'Prêt Social Sans Intérêt 🏦',
  PELLERINAGE: 'Pèlerinage Hajj 🕋',
  SPORT_CULTURE: 'Sports & Culture 🏆'
};

export default function AdminPanel({
  requests,
  users,
  conventions,
  news,
  onApproveRequest,
  onRejectRequest,
  onToggleUserStatus,
  onPostConvention,
  onPostNews
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'STATISTICS' | 'REQUESTS' | 'USERS' | 'CONVENTIONS' | 'NEWS'>('STATISTICS');
  
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
  const categoryData = Object.keys(CATEGORY_LABELS).map((catKey) => {
    const subset = requests.filter(r => r.category === catKey);
    return {
      name: catKey.replace('_', ' ').substring(0, 10),
      count: subset.length,
      val: subset.reduce((acc, current) => acc + (current.amountRequested || 0), 0)
    };
  });

  // Charts data calculation 2: Status distribution
  const statusPieData = [
    { name: 'Approuvés', value: approvedRequests, color: '#10b981' },
    { name: 'En attente', value: pendingRequests, color: '#f59e0b' },
    { name: 'Rejetés', value: rejectedRequests, color: '#ef4444' }
  ];

  const handleOpenReviewModal = (req: PrestationRequest) => {
    setSelectedReq(req);
    setCustomApproveAmount(req.amountRequested || 1000);
    setAdminOpinion('');
  };

  const handleApprove = () => {
    if (!selectedReq) return;
    onApproveRequest(selectedReq.id, customApproveAmount, adminOpinion || 'Dossier approuvé par l\'inspecteur social de l\'AOS.');
    setSelectedReq(null);
  };

  const handleReject = () => {
    if (!selectedReq) return;
    onRejectRequest(selectedReq.id, adminOpinion || 'Le dossier ne remplit pas les conditions administratives ou les justificatifs sont manquants.');
    setSelectedReq(null);
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) {
      alert("Veuillez renseigner un titre et le contenu du communiqué.");
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
    alert("Le communiqué a été publié avec succès sur l'intranet.");
  };

  const handleCreateConvention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convPartner || !convTitle || !convValue) {
      alert("Veuillez renseigner le nom du partenaire, l'intitulé et l'avantage.");
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
    alert("Le nouveau partenaire conventionné a été enregistré avec succès.");
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
              Panneau d'Administration AOS
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight">Secrétariat Général de l'Association</h2>
            <p className="text-xs text-slate-400 mt-1">Gérez les demandes de prestations, approuvez les subventions ou ajoutez des actualités de l'AOS</p>
          </div>
          
          {/* Tabs header selector */}
          <div className="flex flex-wrap gap-1 bg-slate-800 p-1.5 rounded-2xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('STATISTICS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'STATISTICS' ? 'bg-brand-blue text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Statistiques & KPIs
            </button>
            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`relative px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'REQUESTS' ? 'bg-brand-blue text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Requêtes</span>
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
              Membre ANAPEC
            </button>
            <button
              onClick={() => setActiveTab('CONVENTIONS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'CONVENTIONS' ? 'bg-brand-blue text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              + Convention
            </button>
            <button
              onClick={() => setActiveTab('NEWS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'NEWS' ? 'bg-brand-blue text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              + Communiqué
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
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Demandes Recues</p>
                <p className="text-xl font-extrabold text-slate-900">{totalRequests}</p>
                <p className="text-[10px] text-slate-400 font-medium">{pendingRequests} dossiers en attente</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl text-left shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl text-xl">
                ⏳
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Dossiers en attente</p>
                <p className="text-xl font-extrabold text-amber-600">{pendingRequests}</p>
                <p className="text-[10px] text-amber-500 font-medium">Requiert votre avis direct</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl text-left shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-xl">
                💰
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Paiements Validés (DH)</p>
                <p className="text-xl font-extrabold text-emerald-700">{totalDistributedAmount.toLocaleString()} DH</p>
                <p className="text-[10px] text-emerald-600 font-medium">Répartis sur {approvedRequests} dossiers</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl text-left shadow-xs flex items-center gap-4">
              <div className="p-3.5 bg-brand-blue-light text-brand-blue border border-brand-blue/20 rounded-2xl text-xl">
                👥
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Donateurs Adhérents</p>
                <p className="text-xl font-extrabold text-slate-900">{users.length} agents</p>
                <p className="text-[10px] text-emerald-600 font-medium">{users.filter(u => u.cotisationStatus === 'active').length} cotisants actifs</p>
              </div>
            </div>

          </div>

          {/* Recharts Analytics Displays */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Volume of demands per category */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 lg:col-span-2 text-left">
              <h4 className="font-display font-bold text-slate-900 text-sm mb-4">Volume des Demandes par Prestation Sociale</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" fill="#4A69B1" radius={[4, 4, 0, 0]} name="Nombre d'adhérents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Status distribution pie chart */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 text-left">
              <h4 className="font-display font-bold text-slate-900 text-sm mb-4">Répartition des Décisions Sociales</h4>
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
                    <span className="font-bold text-slate-800">{item.value} dossiers</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick reminders list */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 text-left">
            <h4 className="font-display font-bold text-slate-900 text-sm mb-3">Tâches de Gestion Recommandées</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-850">📁 Examiner les dossiers ({pendingRequests})</p>
                <p className="text-[11px] text-slate-400">Vérifier la conformité des documents d'estivage ou de Naissance.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-850">📞 Contacter les non-cotisants</p>
                <p className="text-[11px] text-slate-400">{users.filter(u=>u.cotisationStatus==='inactive').length} membres ont des cotisations suspendues et bloquées.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-850">🎯 Ajouter des conventions d'été</p>
                <p className="text-[11px] text-slate-400">Compléter le catalogue avec les résidences d'été partenaires avant juin.</p>
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
              <h4 className="font-display font-bold text-slate-900 text-base">Traitement Officiel des Prestations</h4>
              <p className="text-xs text-slate-400">Inspectez les dossiers de remboursement et arbitrez les subventions de l'ANAPEC</p>
            </div>
            <span className="bg-slate-100 text-slate-800 text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
              {requests.length} requêtes totales
            </span>
          </div>

          {/* Requests table */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-left">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50/70">
                  <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                    <th className="px-5 py-3.5">Adhérent & Matricule</th>
                    <th className="px-5 py-3.5">Délégation</th>
                    <th className="px-5 py-3.5">Catégorie</th>
                    <th className="px-5 py-3.5">Montant demandé</th>
                    <th className="px-5 py-3.5">Dépôt</th>
                    <th className="px-5 py-3.5 text-center">Statut</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
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
                          {CATEGORY_LABELS[req.category]}
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
                          {req.status === 'approved' ? 'Approuvé' : req.status === 'rejected' ? 'Rejeté' : 'À l\'examen'}
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
                          {req.status === 'pending' ? 'Arbiter le dossier 📑' : 'Ré-examiner'}
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
              <h4 className="font-display font-bold text-slate-900 text-base">Base de Données des Adhérents</h4>
              <p className="text-xs text-slate-400">Gérez le statut des cotisations, changez les rôles ou désactivez des profils</p>
            </div>
            <span className="bg-slate-100 text-slate-800 text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
              {users.length} collaborateurs ANAPEC
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-left">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50/70">
                  <tr className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                    <th className="px-5 py-3.5">Collaborateur</th>
                    <th className="px-5 py-3.5">Matricule & Grade</th>
                    <th className="px-5 py-3.5">Délégation</th>
                    <th className="px-5 py-3.5">Téléphone</th>
                    <th className="px-5 py-3.5">Rôle</th>
                    <th className="px-5 py-3.5 text-center">Régularisation Cotisation</th>
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
                          <p className="text-[10px] text-slate-400">{item.grade || 'Collaborateur'}</p>
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
                          {item.role === 'admin' ? 'Administrateur' : 'Adhérent standard'}
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
                          <span>{item.cotisationStatus === 'active' ? 'Cotisant unique (Actif)' : 'Suspendu / Non-payé'}</span>
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
            <h4 className="font-display font-bold text-slate-900 text-base">Ajouter un nouveau contrat de Partenariat</h4>
            <p className="text-xs text-slate-400 mt-0.5">Enregistrez un nouvel accord hôtelier, clinique ou bancaire conventionné</p>
          </div>

          <form onSubmit={handleCreateConvention} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nom du Partenaire</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ONCF, Kenzi Hôtels..."
                  value={convPartner}
                  onChange={(e) => setConvPartner(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Titre de la convention</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Remise d'été Al Boraq"
                  value={convTitle}
                  onChange={(e) => setConvTitle(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Catégorie</label>
                <select
                  value={convCategory}
                  onChange={(e) => setConvCategory(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="HEBERGEMENT">Hôtel & Centres de vacances</option>
                  <option value="TRANSPORT">Transport & Logistique</option>
                  <option value="SANTE">Santé & Clinique de soins</option>
                  <option value="BANQUE_ASSUR">Banque & Crédits Immobiliers</option>
                  <option value="EDUCATION">Enseignement & Crèches</option>
                  <option value="SOURIRE">Loisirs, Sport & Bien-être</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Avantage Accordé ( DH / % )</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 35% de réduction, Taux de 3.2%"
                  value={convValue}
                  onChange={(e) => setConvValue(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-brand-blue-dark"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Villes d'exercice</label>
                <input
                  type="text"
                  placeholder="Ex: National, Marrakech, Agadir..."
                  value={convCity}
                  onChange={(e) => setConvCity(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Téléphone de l'administration</label>
                <input
                  type="text"
                  placeholder="Ex: +212 522..."
                  value={convPhone}
                  onChange={(e) => setConvPhone(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Adresse Complète</label>
              <input
                type="text"
                placeholder="Ex: Avenue Mohamed V..."
                value={convAddress}
                onChange={(e) => setConvAddress(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description Contractuelle</label>
              <textarea
                rows={3}
                placeholder="Indiquez les termes de l'accord, les bénéficiaires autorisés et d'autres modalités..."
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
                Publier le Contrat Partenaire
              </button>
            </div>

          </form>
        </div>
      )}

      {/* 5. POST NEW ANNOUNCEMENT FORM */}
      {activeTab === 'NEWS' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 text-left max-w-2xl mx-auto shadow-xs">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h4 className="font-display font-bold text-slate-900 text-base">Poster un nouveau Communiqué Officiel</h4>
            <p className="text-xs text-slate-400 mt-0.5">Communiquez de nouvelles informations sociales aux collaborateurs connectés</p>
          </div>

          <form onSubmit={handleCreateNews} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Titre de l'Actualité</label>
              <input
                type="text"
                required
                placeholder="Ex: Élection du bureau exécutif, subventions d'hiver..."
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Catégorie d'Information</label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="PRESTATION">Prestation d'aide & Subvention</option>
                  <option value="CONVENTION">Partenariat & Convention</option>
                  <option value="COMMUNIQUE">Note administrative ou Communiqué</option>
                  <option value="EVENEMENT">Événement & Sports</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Urgence administrative</label>
                <select
                  value={newsImportance}
                  onChange={(e) => setNewsImportance(e.target.value as any)}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="normal">Normal</option>
                  <option value="high">🚨 Urgent / Prioritaire</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Résumé introductif (S'affiche dans le flux d'accueil)</label>
              <input
                type="text"
                placeholder="Quelques lignes résumant l'annonce..."
                value={newsSummary}
                onChange={(e) => setNewsSummary(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Corps détaillé du Communiqué</label>
              <textarea
                rows={6}
                required
                placeholder="Saisissez ici le texte intégral de votre annonce..."
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
                Publier l'actualité sur l'Intranet
              </button>
            </div>

          </form>
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
                DÉCISION COMPTABLE & SOCIALE
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
                <span className="text-[10px] uppercase font-bold text-slate-400">Demandeur</span>
                <p className="text-base font-bold text-slate-900">{selectedReq.userName}</p>
                <p className="text-xs text-slate-500 font-mono">Matricule: {selectedReq.userMatricule} (Délégation: {selectedReq.userDelegation})</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{CATEGORY_LABELS[selectedReq.category]}</p>
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
                      <p className="text-[10px] text-brand-blue font-medium">Justificatif certifié de {selectedReq.attachedFile.size}</p>
                    </div>
                  </div>
                  <span className="bg-brand-blue-accent text-brand-blue-dark px-2 py-0.5 rounded-sm font-bold text-[9px]">CLIQUEZ POUR LIRE</span>
                </div>
              )}

              {/* Budget valuation */}
              <div className="space-y-4 pt-3 border-t border-slate-100 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Budget sollicité</label>
                    <p className="text-base font-extrabold text-slate-800 mt-1">{selectedReq.amountRequested?.toLocaleString() || '--'} DH</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Budget accordé ajustable</label>
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
                  <label className="text-[10px] uppercase font-bold text-slate-400">Opinion administrative & Justification de décision</label>
                  <textarea
                    rows={3}
                    placeholder="Saisissez vos observations. Elles s'afficheront instantanément sur l'espace utilisateur de l'adhérent."
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
                Annuler
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Refuser le Dossier
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Approuver & Valider
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
