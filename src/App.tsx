import React, { useState, useEffect } from 'react';
import { UserProfile, PrestationRequest, Convention, NewsArticle } from './types';
import { MOCK_REQUESTS, MOCK_CONVENTIONS, MOCK_NEWS } from './mockData';
import LoginGate from './components/LoginGate';
import ConventionsDirectory from './components/ConventionsDirectory';
import NewPrestationForm from './components/NewPrestationForm';
import PrestationRequestList from './components/PrestationRequestList';
import UserProfileCard from './components/UserProfileCard';
import AdminPanel from './components/AdminPanel';
import AnapecLogo from './components/AnapecLogo';
import OfficialPublicationsKiosk from './components/OfficialPublicationsKiosk';
import SocialGovernanceDashboard from './components/SocialGovernanceDashboard';
import {
  Newspaper, Handshake, User, ShieldCheck, LogOut,
  PlusCircle, Facebook, FileText, ChevronRight, BookOpen, Loader2
} from 'lucide-react';
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
  signOutUser,
  getAuthSession,
  subscribeToAuthChanges,
  upsertUserFromMicrosoftAuth,
} from './supabaseClient';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<PrestationRequest[]>([]);
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);

  const [dbConnected, setDbConnected] = useState(false);

  const [userTab, setUserTab] = useState<'NEWS' | 'CONVENTIONS' | 'MY_PRESTATIONS' | 'PROFILE' | 'KIOSK' | 'GOVERNANCE'>('NEWS');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  // ─── Auth state listener ────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const resolveSession = async () => {
      const session = await getAuthSession();
      if (session?.user && isMounted) {
        try {
          const profile = await upsertUserFromMicrosoftAuth(session.user);
          setCurrentUser(profile);
          setIsAdminMode(profile.role === 'admin');
        } catch (e) {
          console.error('Erreur de résolution du profil:', e);
        }
      }
      if (isMounted) setAuthLoading(false);
    };

    resolveSession();

    const unsubscribe = subscribeToAuthChanges(async (session) => {
      if (!isMounted) return;
      if (session?.user) {
        try {
          const profile = await upsertUserFromMicrosoftAuth(session.user);
          setCurrentUser(profile);
          setIsAdminMode(profile.role === 'admin');
        } catch (e) {
          console.error('Erreur auth state change:', e);
        }
      } else {
        setCurrentUser(null);
        setIsAdminMode(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // ─── Chargement des données après login ─────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    loadAppData();
  }, [currentUser?.id]);

  const loadAppData = async () => {
    if (isSupabaseConfigured) {
      try {
        const [dbUsers, dbConventions, dbRequests, dbNews] = await Promise.all([
          fetchAllUsers(),
          fetchAllConventions(),
          fetchAllRequests(),
          fetchAllNews(),
        ]);
        setUsers(dbUsers);
        setConventions(dbConventions);
        setRequests(dbRequests);
        setNews(dbNews);
        setDbConnected(true);
      } catch (err) {
        console.error('Erreur chargement données:', err);
        setConventions(MOCK_CONVENTIONS);
        setRequests(MOCK_REQUESTS);
        setNews(MOCK_NEWS);
      }
    } else {
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

  const handleToggleUserStatus = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    const updated = { ...target, cotisationStatus: (target.cotisationStatus === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' };
    if (isSupabaseConfigured && dbConnected) {
      await updateUserProfile(updated).catch(console.error);
    }
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
    if (currentUser?.id === id) setCurrentUser(updated);
  };

  const handleUpdateProfile = async (updatedUser: UserProfile) => {
    if (isSupabaseConfigured && dbConnected) {
      await updateUserProfile(updatedUser).catch(console.error);
    }
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleNewBenefitRequest = async (data: any) => {
    if (!currentUser) return;
    const newReq: PrestationRequest = {
      id: `req_${Date.now()}`,
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
          <p className="text-xs font-medium">Vérification de la session...</p>
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
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800" id="aos-portal-app">

      {/* HEADER */}
      <header className="bg-brand-blue border-b border-brand-blue-deep text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

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

            <div className="flex items-center gap-3">
              {currentUser.role === 'admin' && (
                <div className="hidden md:flex bg-brand-blue-deep/80 p-0.5 rounded-xl border border-brand-blue-dark">
                  <button
                    onClick={() => setIsAdminMode(true)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${isAdminMode ? 'bg-brand-blue text-white shadow-xs' : 'text-slate-300 hover:text-white'}`}
                  >
                    💼 Admin Backoffice
                  </button>
                  <button
                    onClick={() => { setIsAdminMode(false); setUserTab('NEWS'); }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isAdminMode ? 'bg-brand-blue text-white shadow-xs' : 'text-slate-300 hover:text-white'}`}
                  >
                    👤 Mode Adhérent
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-brand-blue-deep/40 border border-brand-blue-dark/50 rounded-xl">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg object-cover border border-brand-blue-dark shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-brand-blue-deep flex items-center justify-center shrink-0 border border-brand-blue-dark">
                    <span className="text-xs font-bold text-white">
                      {currentUser.prenom?.charAt(0)}{currentUser.name?.charAt(0)}
                    </span>
                  </div>
                )}
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

      {/* ONGLETS NAVIGATION (mode adhérent) */}
      {!isAdminMode && (
        <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto py-3 scrollbar-none justify-start md:justify-center">

              {[
                { id: 'NEWS', icon: <Newspaper className="w-4 h-4" />, label: 'Actualités & Flux Facebook' },
                { id: 'KIOSK', icon: <BookOpen className="w-4 h-4" />, label: 'Kiosque & Rapports' },
                { id: 'GOVERNANCE', icon: <ShieldCheck className="w-4 h-4" />, label: 'Simulateur & Transparence' },
                { id: 'CONVENTIONS', icon: <Handshake className="w-4 h-4" />, label: 'Partenariats & Conventions' },
                { id: 'MY_PRESTATIONS', icon: <FileText className="w-4 h-4" />, label: `Mes Demandes (${userSpecificRequests.length})` },
                { id: 'PROFILE', icon: <User className="w-4 h-4" />, label: "Ma Carte d'Adhérent" },
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
          <div className="space-y-6">

            {userTab === 'NEWS' && (
              <div className="space-y-6">
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
                      Rejoignez plus de 2,000 collaborateurs de l'ANAPEC. Suivez les événements sportifs, les résidences d'été et les communiqués en direct de l'AOS.
                    </p>
                  </div>
                  <a
                    href="https://www.facebook.com/search/top/?q=AOS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <span>Consulter la Page Facebook AOS</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="text-left">
                  <h3 className="font-display font-bold text-slate-900 text-base mb-4">
                    Notes Administratives & Notes de Service
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
                          <span className="text-[10px] text-slate-400 font-semibold">{item.readCount} vues • AOS Staff</span>
                          <button onClick={() => setSelectedNews(item)} className="text-xs font-bold text-brand-blue hover:underline cursor-pointer">
                            Lire l'annonce
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

            {userTab === 'MY_PRESTATIONS' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-left">
                  <div>
                    <h3 className="font-display font-bold text-slate-950 text-base">Mes Prestations d'Aides</h3>
                    <p className="text-xs text-slate-400">Demandez vos subventions de l'Aïd Al-Adha, de l'Estivage ou remboursements de soins médicaux</p>
                  </div>
                  <button
                    onClick={() => setUserTab('NEW_PRESTATION' as any)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Créer un dossier d'aide</span>
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
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col text-left">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-extrabold text-brand-blue-dark uppercase tracking-widest">COMMUNIQUÉ AOS ANAPEC</span>
              <button onClick={() => setSelectedNews(null)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 font-extrabold cursor-pointer">✕</button>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-100">
                <span className="font-bold text-amber-600">{selectedNews.category}</span>
                <span>Publié le : {selectedNews.publishDate}</span>
              </div>
              {selectedNews.importance === 'high' && (
                <div className="p-3 bg-amber-50 text-amber-800 border-l-4 border-amber-500 rounded-r-lg text-xs font-semibold">
                  🚨 Informations Prioritaires : Action requise ou date limite approchant.
                </div>
              )}
              <h2 className="font-display font-extrabold text-slate-950 text-base sm:text-lg leading-tight">{selectedNews.title}</h2>
              <p className="text-xs font-bold text-slate-700">{selectedNews.summary}</p>
              <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">{selectedNews.content}</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <p className="font-bold text-slate-800">Note du Secrétaire Général :</p>
                <p className="text-slate-500 mt-1">Cette décision a été validée par la Commission Sociale de l'ANAPEC. Pour tout complément, écrivez à <span className="font-mono text-brand-blue underline">aos@anapec.org.ma</span>.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedNews(null)} className="px-5 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-lg cursor-pointer">
                Fermer
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
