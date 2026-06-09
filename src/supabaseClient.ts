import { createClient, Session, User } from '@supabase/supabase-js';
import { UserProfile, Convention, PrestationRequest, NewsArticle, BoardMember } from './types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── AUTH : Microsoft / Azure AD ───────────────────────────────────────────

export async function signInWithMicrosoft(): Promise<void> {
  if (!supabase) throw new Error('Supabase non configuré.');
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email profile openid User.Read',
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
}

export async function signOutUser(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getAuthSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export function subscribeToAuthChanges(
  callback: (session: Session | null) => void
): () => void {
  if (!supabase) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN' && (window.location.hash.includes('access_token') || window.location.search.includes('code='))) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      callback(session);
    }
  );
  return () => subscription.unsubscribe();
}

const USER_SAFE_COLUMNS = 'id,email,name,prenom,matricule,telephone,delegation,role,"membershipDate","cotisationStatus","avatarUrl",grade';

export async function fetchUserByEmail(email: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('aos_users')
    .select(USER_SAFE_COLUMNS)
    .ilike('email', email)
    .maybeSingle();
  return (data as UserProfile) || null;
}

export async function upsertUserFromMicrosoftAuth(authUser: User): Promise<UserProfile> {
  if (!supabase) throw new Error('Supabase non configuré.');
  const email = (authUser.email || '').toLowerCase();

  const existing = await fetchUserByEmail(email);
  if (existing) return existing;

  const meta = authUser.user_metadata || {};
  const fullName: string = meta.full_name || meta.name || email.split('@')[0];
  const parts = fullName.trim().split(' ');
  const prenom = meta.given_name || parts[0] || 'Prénom';
  const name = meta.family_name || parts.slice(1).join(' ') || parts[0] || 'Nom';

  const newUser: UserProfile = {
    id: authUser.id,
    email,
    name,
    prenom,
    matricule: `EMP-${email.split('@')[0].toUpperCase().substring(0, 6)}`,
    telephone: '',
    delegation: 'Non assignée',
    role: 'user',
    membershipDate: new Date().toISOString().substring(0, 10),
    cotisationStatus: 'active',
    avatarUrl: meta.avatar_url || meta.picture || '',
  };

  const { error } = await supabase.from('aos_users').insert(newUser);
  if (error) throw error;
  return newUser;
}

// ─── DATA WRAPPERS ─────────────────────────────────────────────────────────

export async function fetchAllUsers(): Promise<UserProfile[]> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { data, error } = await supabase.from('aos_users').select(USER_SAFE_COLUMNS);
  if (error) throw error;
  return data as UserProfile[];
}

export async function insertUser(user: UserProfile): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.from('aos_users').insert({
    id: user.id,
    email: user.email,
    name: user.name,
    prenom: user.prenom,
    matricule: user.matricule,
    telephone: user.telephone,
    delegation: user.delegation,
    role: 'user',
    membershipDate: user.membershipDate,
    cotisationStatus: user.cotisationStatus,
    avatarUrl: user.avatarUrl,
    grade: user.grade,
  });
  if (error) throw error;
}

export async function updateUserProfile(user: UserProfile): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase
    .from('aos_users')
    .update({
      name: user.name,
      prenom: user.prenom,
      telephone: user.telephone,
      grade: user.grade,
      avatarUrl: user.avatarUrl,
    })
    .eq('id', user.id);
  if (error) throw error;
}

export async function updateUserStatusAdmin(userId: string, cotisationStatus: 'active' | 'inactive'): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.rpc('admin_update_user_status', {
    target_user_id: userId,
    new_status: cotisationStatus,
  });
  if (error) throw error;
}

export async function fetchAllConventions(): Promise<Convention[]> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { data, error } = await supabase.from('aos_conventions').select('*').order('highlighted', { ascending: false });
  if (error) throw error;
  return data as Convention[];
}

export async function insertConvention(conv: Convention): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.from('aos_conventions').insert(conv);
  if (error) throw error;
}

export async function fetchAllRequests(): Promise<PrestationRequest[]> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { data, error } = await supabase
    .from('aos_requests')
    .select('*')
    .order('submissionDate', { ascending: false });
  if (error) throw error;
  return data as PrestationRequest[];
}

export async function fetchRequestsByUser(userId: string): Promise<PrestationRequest[]> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { data, error } = await supabase
    .from('aos_requests')
    .select('*')
    .eq('userId', userId)
    .order('submissionDate', { ascending: false });
  if (error) throw error;
  return data as PrestationRequest[];
}

export async function insertRequest(req: PrestationRequest): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.from('aos_requests').insert({
    id: req.id,
    userId: req.userId,
    userName: req.userName,
    userMatricule: req.userMatricule,
    userDelegation: req.userDelegation,
    category: req.category,
    title: req.title,
    description: req.description,
    submissionDate: req.submissionDate,
    amountRequested: req.amountRequested,
    status: 'pending',
    attachedFile: req.attachedFile,
    history: req.history
  });
  if (error) throw error;
}

export async function updateRequestStatus(
  id: string,
  status: 'approved' | 'rejected',
  amountApproved: number | undefined,
  comment: string,
  history: any[]
): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.rpc('admin_update_request_status', {
    request_id: id,
    new_status: status,
    new_amount_approved: amountApproved ?? null,
    new_comment: comment,
    new_history: history,
  });
  if (error) throw error;
}

export async function fetchAllNews(): Promise<NewsArticle[]> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { data, error } = await supabase.from('aos_news').select('*').order('publishDate', { ascending: false });
  if (error) throw error;
  return data as NewsArticle[];
}

export async function insertNews(article: NewsArticle): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.from('aos_news').insert(article);
  if (error) throw error;
}

// ─── BOARD MEMBERS (Bureau exécutif & Conseil national) ────────────────────

export async function fetchAllBoardMembers(): Promise<BoardMember[]> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { data, error } = await supabase
    .from('aos_board_members')
    .select('*')
    .order('orderIndex', { ascending: true });
  if (error) throw error;
  return data as BoardMember[];
}

export async function insertBoardMember(member: BoardMember): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.from('aos_board_members').insert({
    id: member.id,
    fullName: member.fullName,
    role: member.role,
    category: member.category,
    photoUrl: member.photoUrl,
    delegation: member.delegation,
    email: member.email,
    phone: member.phone,
    bio: member.bio,
    orderIndex: member.orderIndex ?? 0,
  });
  if (error) throw error;
}

export async function deleteBoardMember(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.from('aos_board_members').delete().eq('id', id);
  if (error) throw error;
}
