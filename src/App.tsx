/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, PrestationRequest, Convention, NewsArticle, RequestStatus } from './types';
import { MOCK_USERS, MOCK_REQUESTS, MOCK_CONVENTIONS, MOCK_NEWS } from './mockData';
import LoginGate from './components/LoginGate';
import ConventionsDirectory from './components/ConventionsDirectory';
import NewPrestationForm from './components/NewPrestationForm';
import PrestationRequestList from './components/PrestationRequestList';
import UserProfileCard from './components/UserProfileCard';
import AdminPanel from './components/AdminPanel';
import AnapecLogo from './components/AnapecLogo';
import AosChatbot from './components/AosChatbot';
import OfficialPublicationsKiosk from './components/OfficialPublicationsKiosk';
import SocialGovernanceDashboard from './components/SocialGovernanceDashboard';
import { 
  Newspaper, HelpCircle, Handshake, HeartHandshake, User, ShieldCheck, 
  LogOut, PlusCircle, LayoutDashboard, Facebook, FileText, ChevronRight, CheckCircle2, AlertCircle, Database, Copy, Check, BookOpen
} from 'lucide-react';
import { OfficialPublication } from './types';
import {
  isSupabaseConfigured,
  fetchAllUsers,
  fetchAllConventions,
  fetchAllRequests,
  fetchAllNews,
  insertRequest,
  insertNews,
  insertConvention,
  updateUserProfile,
  updateRequestStatus,
  SUPABASE_SQL_SCHEMA
} from './supabaseClient';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // States initialized from localStorage or defaults
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<PrestationRequest[]>([]);
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);

  // Supabase connection status
  const [dbStatus, setDbStatus] = useState<{
    configured: boolean;
    connected: boolean;
    error: string | null;
  }>({
    configured: false,
    connected: false,
    error: null
  });

  const [isLoadingDB, setIsLoadingDB] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Navigation states
  const [userTab, setUserTab] = useState<'NEWS' | 'CONVENTIONS' | 'MY_PRESTATIONS' | 'PROFILE' | 'KIOSK' | 'GOVERNANCE'>('NEWS');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  // Load state on startup
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingDB(true);
      if (isSupabaseConfigured) {
        try {
          const [dbUsers, dbConventions, dbRequests, dbNews] = await Promise.all([
            fetchAllUsers(),
            fetchAllConventions(),
            fetchAllRequests(),
            fetchAllNews()
          ]);
          
          setUsers(dbUsers);
          setConventions(dbConventions);
          setRequests(dbRequests);
          setNews(dbNews);
          setDbStatus({
            configured: true,
            connected: true,
            error: null
          });
        } catch (err: any) {
          console.error("Error loading data from Supabase:", err);
          let errMsg = err.message || "Impossible de se connecter aux tables Supabase.";
          // Handle specific relation missing error
          if (err.code === '42P01' || (errMsg.includes("relation") && errMsg.includes("does not exist"))) {
            errMsg = "Tables AOS introuvables. L'administrateur doit lancer le script d'initialisation SQL disponible dans le Backoffice.";
          }
          setDbStatus({
            configured: true,
            connected: false,
            error: errMsg
          });
          loadLocalFallback();
        }
      } else {
        setDbStatus({
          configured: false,
          connected: false,
          error: "Supabase n'est pas encore lié. Utilisation du stockage sandboxed (localStorage)."
        });
        loadLocalFallback();
      }
      setIsLoadingDB(false);
    };

    const loadLocalFallback = () => {
      const cachedUsers = localStorage.getItem('aos_users');
      const cachedRequests = localStorage.getItem('aos_requests');
      const cachedConventions = localStorage.getItem('aos_conventions');
      const cachedNews = localStorage.getItem('aos_news');

      setUsers(cachedUsers ? JSON.parse(cachedUsers) : MOCK_USERS);
      setRequests(cachedRequests ? JSON.parse(cachedRequests) : MOCK_REQUESTS);
      setConventions(cachedConventions ? JSON.parse(cachedConventions) : MOCK_CONVENTIONS);
      setNews(cachedNews ? JSON.parse(cachedNews) : MOCK_NEWS);
    };

    loadData();
  }, []);

  // Save changes helper
  const saveState = (
    updatedUsers: UserProfile[],
    updatedRequests: PrestationRequest[],
    updatedConventions: Convention[],
    updatedNews: NewsArticle[]
  ) => {
    localStorage.setItem('aos_users', JSON.stringify(updatedUsers));
    localStorage.setItem('aos_requests', JSON.stringify(updatedRequests));
    localStorage.setItem('aos_conventions', JSON.stringify(updatedConventions));
    localStorage.setItem('aos_news', JSON.stringify(updatedNews));
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setIsAdminMode(true);
    } else {
      setIsAdminMode(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
  };

  // ACTIONS FOR ADMINISTRATIVE WORKFLOW
  const handleApproveRequest = async (id: string, amountApproved: number, comment: string) => {
    const updatedHistory = [
      ...((requests.find(r => r.id === id)?.history) || []),
      { status: 'approved' as const, changeDate: new Date().toISOString().substring(0, 10), comment }
    ];

    if (isSupabaseConfigured && dbStatus.connected) {
      try {
        await updateRequestStatus(id, 'approved', amountApproved, comment, updatedHistory);
      } catch (err: any) {
        console.error("Supabase request update error:", err);
      }
    }

    const updated = requests.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status: 'approved' as const,
          amountApproved,
          adminComment: comment,
          history: updatedHistory
        };
      }
      return req;
    });

    setRequests(updated);
    saveState(users, updated, conventions, news);
  };

  const handleRejectRequest = async (id: string, comment: string) => {
    const updatedHistory = [
      ...((requests.find(r => r.id === id)?.history) || []),
      { status: 'rejected' as const, changeDate: new Date().toISOString().substring(0, 10), comment }
    ];

    if (isSupabaseConfigured && dbStatus.connected) {
      try {
        await updateRequestStatus(id, 'rejected', undefined, comment, updatedHistory);
      } catch (err: any) {
        console.error("Supabase request update error:", err);
      }
    }

    const updated = requests.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status: 'rejected' as const,
          adminComment: comment,
          history: updatedHistory
        };
      }
      return req;
    });

    setRequests(updated);
    saveState(users, updated, conventions, news);
  };

  const handlePostConvention = async (newConv: Convention) => {
    if (isSupabaseConfigured && dbStatus.connected) {
      try {
        await insertConvention(newConv);
      } catch (err: any) {
        console.error("Supabase request update error:", err);
      }
    }

    const updated = [newConv, ...conventions];
    setConventions(updated);
    saveState(users, requests, updated, news);
  };

  const handlePostNews = async (newArticle: NewsArticle) => {
    if (isSupabaseConfigured && dbStatus.connected) {
      try {
        await insertNews(newArticle);
      } catch (err: any) {
        console.error("Supabase request update error:", err);
      }
    }

    const updated = [newArticle, ...news];
    setNews(updated);
    saveState(users, requests, conventions, updated);
  };

  const handleToggleUserStatus = async (id: string) => {
    const targetUser = users.find(u => u.id === id);
    if (!targetUser) return;
    const nextStatus = targetUser.cotisationStatus === 'active' ? 'inactive' : 'active';
    const updatedUser = { ...targetUser, cotisationStatus: nextStatus as 'active' | 'inactive' };

    if (isSupabaseConfigured && dbStatus.connected) {
      try {
        await updateUserProfile(updatedUser);
      } catch (err: any) {
        console.error("Supabase user update error:", err);
      }
    }

    const updated = users.map((u) => {
      if (u.id === id) {
        return updatedUser;
      }
      return u;
    });

    setUsers(updated);
    saveState(updated, requests, conventions, news);

    // Update currentUser state with edited values if they edit their own profile status
    if (currentUser && currentUser.id === id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleUpdateProfile = async (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);

    if (isSupabaseConfigured && dbStatus.connected) {
      try {
        await updateUserProfile(updatedUser);
      } catch (err: any) {
        console.error("Supabase user update error:", err);
      }
    }

    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updated);
    saveState(updated, requests, conventions, news);
  };

  // NEW BENEFIT REQUEST HANDLER (Submits a requests for the logged-in user profile)
  const handleNewBenefitRequest = async (newBenefitData: any) => {
    if (!currentUser) return;

    const newReq: PrestationRequest = {
      id: `req_${Date.now()}`,
      userId: currentUser.id,
      userName: `${currentUser.prenom} ${currentUser.name}`,
      userMatricule: currentUser.matricule,
      userDelegation: currentUser.delegation,
      category: newBenefitData.category,
      title: newBenefitData.title,
      description: newBenefitData.description,
      amountRequested: newBenefitData.amountRequested,
      submissionDate: new Date().toISOString().substring(0, 10),
      status: 'pending' as const,
      attachedFile: newBenefitData.attachedFile,
      history: [
        { status: 'pending' as const, changeDate: new Date().toISOString().substring(0, 10) }
      ]
    };

    if (isSupabaseConfigured && dbStatus.connected) {
      try {
        await insertRequest(newReq);
      } catch (err: any) {
        console.error("Supabase insert request error:", err);
      }
    }

    const updated = [newReq, ...requests];
    setRequests(updated);
    saveState(users, updated, conventions, news);
    setUserTab('MY_PRESTATIONS'); // Auto redirect to track history
  };

  // Auth gate
  if (!currentUser) {
    return <LoginGate onLoginSuccess={handleLogin} users={users} />;
  }

  // Filter requests belonging exclusively to the currently connected user
  const userSpecificRequests = requests.filter((r) => r.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800" id="aos-portal-app">
      
      {/* 1. TOP NAV PORTAL BAR (Official AOS ANAPEC Branding: Logo Blue and Warm Gold Accents) */}
      <header className="bg-brand-blue border-b border-brand-blue-deep text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and metadata branding with custom high fidelity AnapecLogo vector */}
            <div className="flex items-center gap-3">
              <div className="shrink-0 hover:scale-105 transition-transform duration-200">
                <AnapecLogo className="w-12 h-12 bg-white rounded-full p-0.5 shadow-xs" />
              </div>
              <div className="text-left">
                <h1 className="font-display font-extrabold tracking-wide text-sm sm:text-base leading-none text-white flex items-center gap-1.5">
                  AOS ANAPEC
                  <span className="text-[10px] uppercase font-bold text-brand-gold font-mono tracking-wider border border-brand-gold/30 px-1.5 py-0.5 rounded-sm bg-brand-gold/10">
                    INTRANET
                  </span>
                </h1>
                <p className="text-[10px] text-brand-gold-accent font-semibold font-sans mt-0.5">Œuvres Sociales de l'ANAPEC</p>
              </div>
            </div>

            {/* Quick user role and Switchers */}
            <div className="flex items-center gap-3">
              
              {/* Dual Admin / User toggle for Administrators */}
              {currentUser.role === 'admin' && (
                <div className="hidden md:flex bg-brand-blue-deep/80 p-0.5 rounded-xl border border-brand-blue-dark">
                  <button
                    onClick={() => { setIsAdminMode(true); }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      isAdminMode ? 'bg-brand-blue text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    💼 Admin Backoffice
                  </button>
                  <button
                    onClick={() => { setIsAdminMode(false); setUserTab('NEWS'); }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      !isAdminMode ? 'bg-brand-blue text-white shadow-xs' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    👤 Mode Adhérent
                  </button>
                </div>
              )}

              {/* User credentials Display */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-brand-blue-deep/40 border border-brand-blue-dark/50 rounded-xl">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-lg object-cover border border-brand-blue-dark shrink-0"
                />
                
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold font-sans text-white truncate max-w-[120px]">
                    {currentUser.prenom} {currentUser.name}
                  </p>
                  <p className="text-[9px] text-brand-gold font-mono truncate">{currentUser.matricule}</p>
                </div>

                <button
                  onClick={handleLogout}
                  title="Déconnexion"
                  className="ml-1 p-1 hover:text-brand-gold transition-colors cursor-pointer"
                  id="navbar-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Database Connection Status Banner */}
      <div className={`py-2 px-4 text-xs font-semibold flex justify-between items-center tracking-wide border-b ${
        dbStatus.connected 
          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/10' 
          : dbStatus.configured
          ? 'bg-amber-500/10 text-amber-700 border-amber-500/10'
          : 'bg-indigo-500/10 text-indigo-700 border-indigo-500/10'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-left">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-slate-500" />
            <span>
              {dbStatus.connected ? (
                <span>Base de données : <strong className="text-emerald-800">Supabase Connecté ✓</strong> (Données stockées en temps réel)</span>
              ) : dbStatus.configured ? (
                <span>Base de données : <strong className="text-amber-700">Erreur d'initialisation Supabase</strong> (Utilisation de localStorage pour ne rien perdre)</span>
              ) : (
                <span>Base de données : <strong>Stockage local actif</strong> (Connectez Supabase via les variables d'environnement)</span>
              )}
            </span>
          </div>
          
          <button 
            type="button" 
            onClick={() => setShowSqlGuide(true)}
            className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 hover:text-white hover:bg-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-xs transition-all cursor-pointer"
          >
            📋 {dbStatus.connected ? "Afficher le Schéma SQL" : "Lier mon compte Supabase"}
          </button>
        </div>
      </div>

      {/* 2. SECONDARY ACTION TABS FOR STANDARD SITES */}
      {!isAdminMode && (
        <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto py-3 scrollbar-none justify-start md:justify-center">
              
              <button
                onClick={() => setUserTab('NEWS')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  userTab === 'NEWS' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-600 hover:bg-brand-blue-light hover:text-brand-blue'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                Actualités & Flux Facebook
              </button>

              <button
                onClick={() => setUserTab('KIOSK')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  userTab === 'KIOSK' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-600 hover:bg-brand-blue-light hover:text-brand-blue'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Kiosque & Rapports Officiels
              </button>

              <button
                onClick={() => setUserTab('GOVERNANCE')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  userTab === 'GOVERNANCE' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-600 hover:bg-brand-blue-light hover:text-brand-blue'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Simulateur & Transparence
              </button>

              <button
                onClick={() => setUserTab('CONVENTIONS')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  userTab === 'CONVENTIONS' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-600 hover:bg-brand-blue-light hover:text-brand-blue'
                }`}
              >
                <Handshake className="w-4 h-4" />
                Partenariats & Conventions
              </button>

              <button
                onClick={() => setUserTab('MY_PRESTATIONS')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  userTab === 'MY_PRESTATIONS' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-600 hover:bg-brand-blue-light hover:text-brand-blue'
                }`}
              >
                <FileText className="w-4 h-4" />
                Mes Demandes d'Aide ({userSpecificRequests.length})
              </button>

              <button
                onClick={() => setUserTab('PROFILE')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  userTab === 'PROFILE' ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-600 hover:bg-brand-blue-light hover:text-brand-blue'
                }`}
              >
                <User className="w-4 h-4" />
                Ma Carte d'Adhérent
              </button>

            </div>
          </div>
        </nav>
      )}

      {/* 3. MAIN WRAPPER CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* IF CURRENT USER IS ADMIN AND ACTIVE TAB IS BACKOFFICE CONTROL */}
        {isAdminMode ? (
          <div className="space-y-6">
            
            {/* Admin Switcher indicator on mobile */}
            <div className="md:hidden p-3 bg-amber-500/15 border border-amber-500/20 text-amber-800 text-xs rounded-xl flex justify-between items-center text-left">
              <span>Vous êtes sur le <strong>Panneau Backoffice Admin</strong></span>
              <button
                onClick={() => { setIsAdminMode(false); setUserTab('NEWS'); }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Vue Utilisateur
              </button>
            </div>

            <AdminPanel
              requests={requests}
              users={users}
              conventions={conventions}
              news={news}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onToggleUserStatus={handleToggleUserStatus}
              onPostConvention={handlePostConvention}
              onPostNews={handlePostNews}
            />
          </div>
        ) : (
          
          /* IF USER TAB IS SELECTABLE */
          <div className="space-y-6">
            
            {/* Tab: NEWS AND PUBLIC FACEBOOK ANNOUNCEMENTS */}
            {userTab === 'NEWS' && (
              <div className="space-y-6">
                
                {/* Official Facebook Community Integration Info Banner */}
                <div className="p-5 bg-blue-50/70 rounded-3xl border border-blue-100 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-100 text-blue-700">
                      <Facebook className="w-3 h-3" />
                      Communauté Facebook AOS
                    </span>
                    <h3 className="font-display font-extrabold text-slate-900 text-sm">
                      Flux Officiel & Activités Récentes de l'Association
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Rejoignez plus de 2,000 collaborateurs de l'ANAPEC. Suivez les photos d'événements sportifs, les résidences d'été et les communiqués en direct de l'AOS.
                    </p>
                  </div>
                  <a
                    href="https://www.facebook.com/search/top/?q=AOS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-600/10 cursor-pointer"
                  >
                    <span>Consulter la Page Facebook AOS</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                {/* News Carousel / Grid */}
                <div className="text-left">
                  <h3 className="font-display font-bold text-slate-900 text-base mb-4">
                    Notes Administratives & Notes de Service
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                              item.category === 'PRESTATION' 
                                ? 'bg-brand-blue-light text-brand-blue-dark' 
                                : item.category === 'CONVENTION'
                                ? 'bg-brand-gold-light text-brand-gold-dark'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {item.category}
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">{item.publishDate}</span>
                          </div>

                          <h4 className="font-display font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                            {item.title}
                          </h4>

                          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                            {item.summary}
                          </p>
                        </div>

                        {/* Trigger detailed view modal */}
                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-semibold">{item.readCount} vues • AOS Staff</span>
                          <button
                            onClick={() => setSelectedNews(item)}
                            className="text-xs font-bold text-brand-blue hover:text-brand-blue-dark hover:underline cursor-pointer"
                          >
                            Lire l'annonce complet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab: KIOSK & PUBLICATIONS */}
            {userTab === 'KIOSK' && (
              <OfficialPublicationsKiosk 
                isAdmin={currentUser?.role === 'admin'} 
              />
            )}

            {/* Tab: GOVERNANCE SIMULATOR & TRANSPARENCY */}
            {userTab === 'GOVERNANCE' && (
              <SocialGovernanceDashboard currentUser={currentUser} />
            )}

            {/* Tab: PARTNERS DIRECTORY */}
            {userTab === 'CONVENTIONS' && (
              <ConventionsDirectory currentUser={currentUser} />
            )}

            {/* Tab: MY PRESTATIONS */}
            {userTab === 'MY_PRESTATIONS' && (
              <div className="space-y-6">
                
                {/* Upper Call To Action (Submitting a new benefit dossier) */}
                <div className="flex justify-between items-center text-left">
                  <div>
                    <h3 className="font-display font-bold text-slate-950 text-base">Mes Prestations d'Aides</h3>
                    <p className="text-xs text-slate-400">Demandez vos subventions de l'Aïd Al-Adha, de l'Estivage ou remboursements de soins médicaux</p>
                  </div>
                  
                  <button
                    onClick={() => setUserTab('NEW_PRESTATION' as any)}
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-blue/15 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Créer un dossier d'aide</span>
                  </button>
                </div>

                <PrestationRequestList requests={userSpecificRequests} />

              </div>
            )}

            {/* Tab: PROFILE CARD */}
            {userTab === 'PROFILE' && (
              <UserProfileCard currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />
            )}

            {/* Hidden custom Tab: NEW_PRESTATION FORM TRIGGER */}
            {(userTab as any) === 'NEW_PRESTATION' && (
              <NewPrestationForm
                currentUser={currentUser}
                onSubmitRequest={handleNewBenefitRequest}
                onCancel={() => setUserTab('MY_PRESTATIONS')}
              />
            )}

          </div>
        )}

      </main>

      {/* 4. DETAIL READING DIALOG FOR INTRA NEWS */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col justify-between text-left">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-extrabold text-brand-blue-dark uppercase tracking-widest">COMMUNIQUÉ AOS ANAPEC</span>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 font-extrabold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-100">
                <span className="font-bold text-amber-600">{selectedNews.category}</span>
                <span>Publié le: {selectedNews.publishDate}</span>
              </div>

              {selectedNews.importance === 'high' && (
                <div className="p-3 bg-amber-50 text-amber-800 border-l-4 border-amber-500 rounded-r-lg text-xs leading-relaxed font-semibold">
                  🚨 Informations Prioritaires : Action requise ou date limite approchant pour soumettre vos pièces.
                </div>
              )}

              <h2 className="font-display font-extrabold text-slate-950 text-base sm:text-lg leading-tight">
                {selectedNews.title}
              </h2>

              <p className="text-xs font-bold text-slate-700 leading-normal">
                {selectedNews.summary}
              </p>

              <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed py-2">
                {selectedNews.content}
              </p>

              <div className="p-4 bg-slate-50 rounded-xl text-left border border-slate-100 space-y-1 text-xs">
                <p className="font-bold text-slate-800">Note du Secrétaire Général :</p>
                <p className="text-slate-500">
                  Cette décision a été validée par la Commission Sociale de l'ANAPEC. Pour tout complément d'information, veuillez écrire à <span className="font-mono text-brand-blue hover:text-brand-blue-dark underline font-semibold">aos@anapec.org.ma</span>.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-5 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Compris, Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SQL Setup and Supabase Integration Instructions Drawer/Modal */}
      {showSqlGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col justify-between text-left">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-rose-100/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-brand-blue font-bold" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Configuration & Migration Supabase</h3>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">Associer une base de données cloud temps réel à l'Intranet</p>
                </div>
              </div>
              <button
                onClick={() => { setShowSqlGuide(false); setCopiedSql(false); }}
                className="p-1.5 rounded-xl hover:bg-slate-200 transition-colors text-slate-400 font-extrabold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed max-h-[60vh] scrollbar-thin">
              
              {/* Steps Area */}
              <div className="space-y-4">
                <h4 className="font-display font-extrabold text-slate-905 text-sm pb-1.5 border-b border-slate-100">
                  🛠️ Guide d'installation en 3 étapes :
                </h4>
                
                <ol className="list-decimal list-inside space-y-3.5 pl-1">
                  <li>
                    <strong>Créez un projet gratuit sur Supabase :</strong><br/>
                    Allez sur <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline font-bold">https://supabase.com</a> et ouvrez un nouveau projet vide.
                  </li>
                  <li>
                    <strong>Initialisez le Schema & Seeds SQL :</strong><br/>
                    Depuis votre projet Supabase, accédez à l'onglet <span className="p-1 font-mono bg-slate-100 rounded text-[10px] font-bold">SQL Editor</span> dans la barre latérale gauche, cliquez sur <strong>New Query</strong>, collez le script ci-dessous et cliquez sur <strong>Run</strong>. Cela configurera les RLS et tous les adhérents par défaut !
                  </li>
                  <li>
                    <strong>Configurez les Variables d'Environnement :</strong><br/>
                    Ajoutez ces variables dans vos paramètres Secrets de l'application ou fichier local <span className="font-mono text-red-650">.env</span> :
                    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px]/normal text-slate-700 space-y-1">
                      <p>VITE_SUPABASE_URL="<span className="text-slate-400">votre_url_supabase</span>"</p>
                      <p>VITE_SUPABASE_ANON_KEY="<span className="text-slate-400">votre_cle_anonyme</span>"</p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* SQL Area */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-extrabold text-slate-905 text-sm">
                    📜 Script SQL d'Initialisation (DDL) :
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-slate-900 border border-slate-800 text-white rounded-lg hover:bg-slate-850 shrink-0 cursor-pointer shadow-sm transition-all"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? "Copié !" : "Copier le Script SQL"}</span>
                  </button>
                </div>

                <div className="relative">
                  <pre className="p-4 bg-slate-900 text-slate-200 rounded-2xl overflow-x-auto text-[10px] font-mono leading-relaxed h-56 border border-slate-800 shadow-inner select-all">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                  <div className="absolute bottom-3 right-3 py-1.5 px-3 bg-slate-800/80 text-slate-400 font-mono text-[9px] rounded-lg border border-slate-700/60 pointer-events-none">
                    -- 4 tables + Politiques RLS included
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => { setShowSqlGuide(false); setCopiedSql(false); }}
                className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-blue/10 cursor-pointer"
              >
                Fermer l'Aide d'Intégration
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Corporate Social Advisor Chatbot (Only for Espace Adhérent / Non-Admin views) */}
      {currentUser && !isAdminMode && (
        <AosChatbot 
          currentUser={currentUser} 
          conventions={conventions} 
          requests={requests.filter(r => r.userId === currentUser.id)} 
        />
      )}

      {/* Dynamic Print specific wrapper (hides irrelevant blocks when print trigger is requested) */}
      <style>{`
        @media print {
          header, nav, footer, button, select, input, textarea, .md\\:flex, .p-4 {
            display: none !important;
          }
          body, main {
            background-color: white !important;
            color: black !important;
            font-size: 11pt !important;
          }
          #printable-voucher-document, #user-profile-card-container {
            display: block !important;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>

    </div>
  );
}
