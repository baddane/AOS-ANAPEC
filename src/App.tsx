import React, { useState, useEffect } from 'react';
import { UserProfile, PrestationRequest, Convention, NewsArticle, BoardMember } from './types';
import { MOCK_REQUESTS, MOCK_CONVENTIONS, MOCK_NEWS } from './mockData';
import LoginGate from './components/LoginGate';
import ConventionsDirectory from './components/ConventionsDirectory';
import NewPrestationForm from './components/NewPrestationForm';
import PrestationRequestList from './components/PrestationRequestList';
import UserProfileCard from './components/UserProfileCard';
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
import AnapecLogo from './components/AnapecLogo';
import BoardDirectory from './components/BoardDirectory';
import OfficialPublicationsKiosk from './components/OfficialPublicationsKiosk';
import SocialGovernanceDashboard from './components/SocialGovernanceDashboard';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useLang } from './i18n';
import {
  Newspaper, Handshake, User, ShieldCheck, LogOut,
  PlusCircle, Facebook, FileText, ChevronRight, BookOpen, Loader2, Users,
  Menu, X
} from 'lucide-react';
import {
  isSupabaseConfigured,
  fetchAllUsers,
  fetchAllConventions,
  fetchAllRequests,
  fetchRequestsByUser,
  fetchAllNews,
  fetchAllBoardMembers,
  insertBoardMember,
  deleteBoardMember,
  insertRequest,
  insertNews,
  insertConvention,
  updateUserProfile,
  updateUserStatusAdmin,
  updateRequestStatus,
  signOutUser,
  getAuthSession,
  subscribeToAuthChanges,
  upsertUserFromMicrosoftAuth,
} from './supabaseClient';

export default function App() {
  const { t, dir } = useLang();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<PrestationRequest[]>([]);
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);

  const [dbConnected, setDbConnected] = useState(false);

  const [userTab, setUserTab] = useState<'NEWS' | 'CONVENTIONS' | 'MY_PRESTATIONS' | 'PROFILE' | 'KIOSK' | 'GOVERNANCE' | 'BOARD'>('NEWS');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Auth state listener ────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    let loadingDone = false;
    let sessionHandled = false;
    // Detect OAuth callback: URL contains tokens or authorization code
    const isOAuthCallback =
      window.location.hash.includes('access_token') ||
      window.location.search.includes('code=');

    const markLoaded = () => {
      if (!loadingDone && isMounted) {
        loadingDone = true;
        setAuthLoading(false);
      }
    };

    const processSession = async (
      session: import('@supabase/supabase-js').Session | null,
      fromAuthChange = false,
    ) => {
      if (!isMounted) return;
      if (session?.user) {
        if (sessionHandled) return;
        sessionHandled = true;
        try {
          const profile = await upsertUserFromMicrosoftAuth(session.user);
          if (isMounted) {
            setCurrentUser(profile);
            setIsAdminMode(profile.role === 'admin');
          }
        } catch (e) {
          console.error('Erreur profil:', e);
          sessionHandled = false;
          if (isMounted) { setCurrentUser(null); setIsAdminMode(false); }
        }
        markLoaded();
      } else {
        if (isMounted) { setCurrentUser(null); setIsAdminMode(false); }
        // During an OAuth callback, don't finalize on null — wait for onAuthStateChange
        if (!isOAuthCallback || fromAuthChange) {
          markLoaded();
        }
      }
    };

    // Timeout de secours : jamais bloqué plus de 8 secondes
    const timeout = setTimeout(markLoaded, 8000);

    // Chemin rapide : session existante depuis le stockage local
    getAuthSession().then((s) => processSession(s, false));

    // Chemin OAuth : token dans le hash URL après redirect Microsoft
    const unsubscribe = subscribeToAuthChanges((s) => processSession(s, true));

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  // ─── Chargement des données après login ─────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    loadAppData();
  }, [currentUser?.id]);

  const loadAppData = async () => {
    if (!isSupabaseConfigured || !currentUser) {
      setConventions(MOCK_CONVENTIONS);
      setRequests(MOCK_REQUESTS);
      setNews(MOCK_NEWS);
      return;
    }

    try {
      const isAdmin = currentUser.role === 'admin';

      // Données partagées (légères) — chargées pour tout le monde
      const [dbConventions, dbNews, dbBoard] = await Promise.all([
        fetchAllConventions(),
        fetchAllNews(),
        fetchAllBoardMembers().catch(() => []),
      ]);
      // Merge: DB conventions + mock-only conventions (e.g. Akdital with rich data)
      const dbIds = new Set(dbConventions.map(c => c.id));
      const mockOnly = MOCK_CONVENTIONS.filter(c => !dbIds.has(c.id));
      setConventions([...dbConventions, ...mockOnly]);
      setNews(dbNews.length > 0 ? dbNews : MOCK_NEWS);
      setBoardMembers(dbBoard);

      if (isAdmin) {
        // L'admin a besoin de la vue globale : tous les utilisateurs + toutes les demandes
        const [dbUsers, dbRequests] = await Promise.all([
          fetchAllUsers(),
          fetchAllRequests(),
        ]);
        setUsers(dbUsers);
        setRequests(dbRequests);
      } else {
        // Un adhérent ne charge QUE ses propres demandes — pas la table users entière
        const ownRequests = await fetchRequestsByUser(currentUser.id);
        setRequests(ownRequests);
      }

      setDbConnected(true);
    } catch (err) {
      console.error('Erreur chargement données:', err);
      setConventions(MOCK_CONVENTIONS);
      setRequests(MOCK_REQUESTS);
      setNews(MOCK_NEWS);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setCurrentUser(null);
    setIsAdminMode(false);
  };

  // ─── Actions admin ───────────────────────────────────────────────────────
  const handleApproveRequest = async (id: string, amountApproved: number, comment: string) => {
    const updatedHistory = [
      ...((requests.find(r => r.id === id)?.history) || []),
      { status: 'approved' as const, changeDate: new Date().toISOString().substring(0, 10), comment }
    ];
    if (isSupabaseConfigured && dbConnected) {
      await updateRequestStatus(id, 'approved', amountApproved, comment, updatedHistory).catch(console.error);
    }
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'approved' as const, amountApproved, adminComment: comment, history: updatedHistory } : r
    ));
  };

  const handleRejectRequest = async (id: string, comment: string) => {
    const updatedHistory = [
      ...((requests.find(r => r.id === id)?.history) || []),
      { status: 'rejected' as const, changeDate: new Date().toISOString().substring(0, 10), comment }
    ];
    if (isSupabaseConfigured && dbConnected) {
      await updateRequestStatus(id, 'rejected', undefined, comment, updatedHistory).catch(console.error);
    }
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'rejected' as const, adminComment: comment, history: updatedHistory } : r
    ));
  };

  const handlePostConvention = async (newConv: Convention) => {
    if (isSupabaseConfigured && dbConnected) {
      await insertConvention(newConv).catch(console.error);
    }
    setConventions(prev => [newConv, ...prev]);
  };

  const handlePostNews = async (newArticle: NewsArticle) => {
    if (isSupabaseConfigured && dbConnected) {
      await insertNews(newArticle).catch(console.error);
    }
    setNews(prev => [newArticle, ...prev]);
  };

  const handleAddBoardMember = async (member: BoardMember) => {
    if (isSupabaseConfigured && dbConnected) {
      await insertBoardMember(member).catch(console.error);
    }
    setBoardMembers(prev => [...prev, member].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)));
  };

  const handleDeleteBoardMember = async (id: string) => {
    if (isSupabaseConfigured && dbConnected) {
      await deleteBoardMember(id).catch(console.error);
    }
    setBoardMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleToggleUserStatus = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    const newStatus = target.cotisationStatus === 'active' ? 'inactive' : 'active';
    const updated = { ...target, cotisationStatus: newStatus as 'active' | 'inactive' };
    if (isSupabaseConfigured && dbConnected) {
      await updateUserStatusAdmin(id, newStatus as 'active' | 'inactive').catch(() => {});
    }
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
    if (currentUser?.id === id) setCurrentUser(updated);
  };

  const handleUpdateProfile = async (updatedUser: UserProfile) => {
    // Sanitize: prevent client-side role/status escalation
    const sanitized: UserProfile = {
      ...updatedUser,
      role: currentUser!.role,
      cotisationStatus: currentUser!.cotisationStatus,
      avatarUrl: updatedUser.avatarUrl?.startsWith('https://') ? updatedUser.avatarUrl : '',
    };
    if (isSupabaseConfigured && dbConnected) {
      await updateUserProfile(sanitized).catch(() => {});
    }
    setCurrentUser(sanitized);
    setUsers(prev => prev.map(u => u.id === sanitized.id ? sanitized : u));
  };

  const handleNewBenefitRequest = async (data: any) => {
    if (!currentUser) return;
    const newReq: PrestationRequest = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: `${currentUser.prenom} ${currentUser.name}`,
      userMatricule: currentUser.matricule,
      userDelegation: currentUser.delegation,
      category: data.category,
      title: data.title,
      description: data.description,
      amountRequested: data.amountRequested,
      submissionDate: new Date().toISOString().substring(0, 10),
      status: 'pending' as const,
      attachedFile: data.attachedFile,
      history: [{ status: 'pending' as const, changeDate: new Date().toISOString().substring(0, 10) }],
    };
    if (isSupabaseConfigured && dbConnected) {
      await insertRequest(newReq).catch(console.error);
    }
    setRequests(prev => [newReq, ...prev]);
    setUserTab('MY_PRESTATIONS');
  };

  // ─── Écran de chargement auth ────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <AnapecLogo className="w-16 h-16 opacity-80" />
          <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
          <p className="text-xs font-medium">{t('app.checkingSession')}</p>
        </div>
      </div>
    );
  }

  // ─── Auth gate ───────────────────────────────────────────────────────────
  if (!currentUser) {
    return <LoginGate />;
  }

  const userSpecificRequests = requests.filter(r => r.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800" dir={dir} id="aos-portal-app">

      {/* HEADER */}
      <header className="bg-brand-blue border-b border-brand-blue-deep text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center gap-3">
              <div className="shrink-0 hover:scale-105 transition-transform duration-200">
                <AnapecLogo className="w-12 h-12 bg-white rounded-full p-0.5 shadow-xs" />
              </div>
              <div className="text-start">
                <h1 className="font-display font-extrabold tracking-wide text-sm sm:text-base leading-none text-white flex items-center gap-1.5">
                  AOS ANAPEC
                  <span className="text-[10px] uppercase font-bold text-brand-gold font-mono tracking-wider border border-brand-gold/30 px-1.5 py-0.5 rounded-sm bg-brand-gold/10">
                    {t('app.badge')}
                  </span>
                </h1>
                <p className="text-[10px] text-brand-gold-accent font-semibold font-sans mt-0.5">{t('app.subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop admin toggle */}
              {currentUser.role === 'admin' && (
                <div className="hidden md:flex bg-brand-blue-deep/80 p-0.5 rounded-xl border border-brand-blue-dark">
                  <button
                    onClick={() => setIsAdminMode(true)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${isAdminMode ? 'bg-brand-blue text-white shadow-xs' : 'text-slate-300 hover:text-white'}`}
                  >
                    {t('header.adminBackoffice')}
                  </button>
                  <button
                    onClick={() => { setIsAdminMode(false); setUserTab('NEWS'); }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isAdminMode ? 'bg-brand-blue text-white shadow-xs' : 'text-slate-300 hover:text-white'}`}
                  >
                    {t('header.memberMode')}
                  </button>
                </div>
              )}

              <LanguageSwitcher />

              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-brand-blue-deep/40 border border-brand-blue-dark/50 rounded-xl">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Avatar" referrerPolicy="no-referrer" className="w-7 h-7 rounded-lg object-cover border border-brand-blue-dark shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-brand-blue-deep flex items-center justify-center shrink-0 border border-brand-blue-dark">
                    <span className="text-xs font-bold text-white">{currentUser.prenom?.charAt(0)}{currentUser.name?.charAt(0)}</span>
                  </div>
                )}
                <div className="text-start">
                  <p className="text-xs font-bold font-sans text-white truncate max-w-[120px]">{currentUser.prenom} {currentUser.name}</p>
                  <p className="text-[9px] text-brand-gold font-mono truncate">{currentUser.matricule}</p>
                </div>
                <button onClick={handleLogout} title={t('header.logout')} className="ms-1 p-1 hover:text-brand-gold transition-colors cursor-pointer" id="navbar-logout-btn">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-brand-blue-deep/50 rounded-lg transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-DOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white border-b border-slate-200 shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {/* User info */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" referrerPolicy="no-referrer" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">{currentUser.prenom?.charAt(0)}{currentUser.name?.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{currentUser.prenom} {currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{currentUser.matricule} • {currentUser.delegation}</p>
              </div>
            </div>

            {/* Admin/Member toggle */}
            {currentUser.role === 'admin' && (
              <div className="px-4 py-3 border-b border-slate-100 flex gap-2">
                <button
                  onClick={() => { setIsAdminMode(true); setMobileMenuOpen(false); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${isAdminMode ? 'bg-brand-blue text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
                >
                  💼 {t('header.adminBackoffice')}
                </button>
                <button
                  onClick={() => { setIsAdminMode(false); setUserTab('NEWS'); setMobileMenuOpen(false); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${!isAdminMode ? 'bg-brand-blue text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}
                >
                  👤 {t('header.memberMode')}
                </button>
              </div>
            )}

            {/* Navigation tabs (vertical) */}
            {!isAdminMode && (
              <div className="py-2">
                {[
                  { id: 'NEWS', icon: <Newspaper className="w-4 h-4" />, label: t('nav.news') },
                  { id: 'KIOSK', icon: <BookOpen className="w-4 h-4" />, label: t('nav.kiosk') },
                  { id: 'GOVERNANCE', icon: <ShieldCheck className="w-4 h-4" />, label: t('nav.governance') },
                  { id: 'CONVENTIONS', icon: <Handshake className="w-4 h-4" />, label: t('nav.conventions') },
                  { id: 'BOARD', icon: <Users className="w-4 h-4" />, label: t('nav.board') },
                  { id: 'MY_PRESTATIONS', icon: <FileText className="w-4 h-4" />, label: `${t('nav.myRequests')} (${userSpecificRequests.length})` },
                  { id: 'PROFILE', icon: <User className="w-4 h-4" />, label: t('nav.profile') },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setUserTab(tab.id as any); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                      userTab === tab.id ? 'bg-brand-blue-light text-brand-blue-dark' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Logout */}
            <div className="px-4 py-3 border-t border-slate-100">
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {t('header.logout')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DESKTOP NAVIGATION TABS (mode adhérent) */}
      {!isAdminMode && (
        <nav className="hidden md:block bg-white border-b border-slate-100 shadow-sm sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6 overflow-x-auto py-3 scrollbar-none justify-center">
              {[
                { id: 'NEWS', icon: <Newspaper className="w-4 h-4" />, label: t('nav.news') },
                { id: 'KIOSK', icon: <BookOpen className="w-4 h-4" />, label: t('nav.kiosk') },
                { id: 'GOVERNANCE', icon: <ShieldCheck className="w-4 h-4" />, label: t('nav.governance') },
                { id: 'CONVENTIONS', icon: <Handshake className="w-4 h-4" />, label: t('nav.conventions') },
                { id: 'BOARD', icon: <Users className="w-4 h-4" />, label: t('nav.board') },
                { id: 'MY_PRESTATIONS', icon: <FileText className="w-4 h-4" />, label: `${t('nav.myRequests')} (${userSpecificRequests.length})` },
                { id: 'PROFILE', icon: <User className="w-4 h-4" />, label: t('nav.profile') },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setUserTab(tab.id as any)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    userTab === tab.id ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-600 hover:bg-brand-blue-light hover:text-brand-blue'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {isAdminMode ? (
          <div className="space-y-6">
            <React.Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-blue" /></div>}>
              <AdminPanel
                requests={requests}
                users={users}
                conventions={conventions}
                news={news}
                boardMembers={boardMembers}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                onToggleUserStatus={handleToggleUserStatus}
                onPostConvention={handlePostConvention}
                onPostNews={handlePostNews}
                onAddBoardMember={handleAddBoardMember}
                onDeleteBoardMember={handleDeleteBoardMember}
              />
            </React.Suspense>
          </div>
        ) : (
          <div className="space-y-6">

            {userTab === 'NEWS' && (
              <div className="space-y-6">
                <div className="p-5 bg-blue-50/70 rounded-3xl border border-blue-100 text-start flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-100 text-blue-700">
                      <Facebook className="w-3 h-3" />
                      {t('news.fbBadge')}
                    </span>
                    <h3 className="font-display font-extrabold text-slate-900 text-sm">
                      {t('news.fbTitle')}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {t('news.fbDesc')}
                    </p>
                  </div>
                  <a
                    href="https://web.facebook.com/groups/2127441317474519"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <span>{t('news.fbButton')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="text-start">
                  <h3 className="font-display font-bold text-slate-900 text-base mb-4">
                    {t('news.adminNotes')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map(item => (
                      <div key={item.id} className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                              item.category === 'PRESTATION' ? 'bg-brand-blue-light text-brand-blue-dark'
                              : item.category === 'CONVENTION' ? 'bg-brand-gold-light text-brand-gold-dark'
                              : 'bg-amber-50 text-amber-700'
                            }`}>
                              {item.category}
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">{item.publishDate}</span>
                          </div>
                          <h4 className="font-display font-bold text-slate-900 text-sm line-clamp-2 leading-snug">{item.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{item.summary}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-semibold">{item.readCount} {t('news.views')} • {t('news.staff')}</span>
                          <button onClick={() => setSelectedNews(item)} className="text-xs font-bold text-brand-blue hover:underline cursor-pointer">
                            {t('news.read')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {userTab === 'KIOSK' && <OfficialPublicationsKiosk isAdmin={currentUser.role === 'admin'} />}
            {userTab === 'GOVERNANCE' && <SocialGovernanceDashboard currentUser={currentUser} />}
            {userTab === 'CONVENTIONS' && <ConventionsDirectory currentUser={currentUser} conventions={conventions} />}
            {userTab === 'BOARD' && <BoardDirectory members={boardMembers} />}

            {userTab === 'MY_PRESTATIONS' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-start">
                  <div>
                    <h3 className="font-display font-bold text-slate-950 text-base">{t('prest.title')}</h3>
                    <p className="text-xs text-slate-400">{t('prest.desc')}</p>
                  </div>
                  <button
                    onClick={() => setUserTab('NEW_PRESTATION' as any)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t('prest.create')}</span>
                  </button>
                </div>
                <PrestationRequestList requests={userSpecificRequests} />
              </div>
            )}

            {userTab === 'PROFILE' && <UserProfileCard currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />}

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

      {/* MODAL DETAIL ACTUALITÉ */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col text-start">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-extrabold text-brand-blue-dark uppercase tracking-widest">{t('news.communique')}</span>
              <button onClick={() => setSelectedNews(null)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 font-extrabold cursor-pointer">✕</button>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-100">
                <span className="font-bold text-amber-600">{selectedNews.category}</span>
                <span>{t('news.publishedOn')} {selectedNews.publishDate}</span>
              </div>
              {selectedNews.importance === 'high' && (
                <div className="p-3 bg-amber-50 text-amber-800 border-l-4 border-amber-500 rounded-r-lg text-xs font-semibold">
                  {t('news.priority')}
                </div>
              )}
              <h2 className="font-display font-extrabold text-slate-950 text-base sm:text-lg leading-tight">{selectedNews.title}</h2>
              <p className="text-xs font-bold text-slate-700">{selectedNews.summary}</p>
              <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">{selectedNews.content}</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <p className="font-bold text-slate-800">{t('news.sgNote')}</p>
                <p className="text-slate-500 mt-1">{t('news.sgBody')} <span className="font-mono text-brand-blue underline">aos@anapec.org.ma</span>.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedNews(null)} className="px-5 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg cursor-pointer">
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          header, nav, button, select, input, textarea { display: none !important; }
          body, main { background: white !important; color: black !important; font-size: 11pt !important; }
          #printable-voucher-document, #user-profile-card-container { display: block !important; border: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
