import { createClient, Session, User } from '@supabase/supabase-js';
import { UserProfile, Convention, PrestationRequest, NewsArticle } from './types';

// Supabase project: AOS-ANAPEC-Intranet (eu-west-3)
// The anon key is a publishable client key — safe for public frontends protected by RLS.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://zkdqywiumoklgthcasnu.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZHF5d2l1bW9rbGd0aGNhc251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDg3NTksImV4cCI6MjA5NTkyNDc1OX0.jeYeJh4D5FoNbXiC6YcQiGRahWYjkzZ60bjln0gHevQ';

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
    (_event, session) => callback(session)
  );
  return () => subscription.unsubscribe();
}

export async function fetchUserByEmail(email: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('aos_users')
    .select('*')
    .ilike('email', email)
    .maybeSingle();
  return (data as UserProfile) || null;
}

export async function upsertUserFromMicrosoftAuth(authUser: User): Promise<UserProfile> {
  if (!supabase) throw new Error('Supabase non configuré.');
  const email = (authUser.email || '').toLowerCase();

  // Return existing profile if found
  const existing = await fetchUserByEmail(email);
  if (existing) return existing;

  // Build profile from Microsoft identity claims
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

// ─── SUPABASE SQL SCHEMA (affiché dans le Backoffice) ─────────────────────

export const SUPABASE_SQL_SCHEMA = `
-- ========================================================
-- INTÉGRATION SUPABASE POUR L'INTRANET AOS ANAPEC
-- ========================================================

CREATE TABLE IF NOT EXISTS aos_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  prenom TEXT NOT NULL,
  matricule TEXT NOT NULL,
  telephone TEXT,
  delegation TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  "membershipDate" TEXT NOT NULL,
  "cotisationStatus" TEXT NOT NULL,
  "avatarUrl" TEXT,
  grade TEXT,
  password TEXT
);

CREATE TABLE IF NOT EXISTS aos_conventions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "partnerName" TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  "discountValue" TEXT NOT NULL,
  "validityDate" TEXT NOT NULL,
  "contactPhone" TEXT,
  "contactEmail" TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  highlighted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS aos_requests (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "userMatricule" TEXT NOT NULL,
  "userDelegation" TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "submissionDate" TEXT NOT NULL,
  "amountRequested" NUMERIC,
  "amountApproved" NUMERIC,
  status TEXT DEFAULT 'pending',
  "attachedFile" JSONB,
  "adminComment" TEXT,
  history JSONB
);

CREATE TABLE IF NOT EXISTS aos_news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  "publishDate" TEXT NOT NULL,
  category TEXT NOT NULL,
  importance TEXT DEFAULT 'normal',
  author TEXT,
  "readCount" INT DEFAULT 0
);
`;

// ─── DATA WRAPPERS ─────────────────────────────────────────────────────────

export async function fetchAllUsers(): Promise<UserProfile[]> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { data, error } = await supabase.from('aos_users').select('*');
  if (error) throw error;
  return data as UserProfile[];
}

export async function insertUser(user: UserProfile): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase.from('aos_users').insert(user);
  if (error) throw error;
}

export async function updateUserProfile(user: UserProfile): Promise<void> {
  if (!supabase) throw new Error('Supabase client is not configured.');
  const { error } = await supabase
    .from('aos_users')
    .update({
      email: user.email,
      name: user.name,
      prenom: user.prenom,
      telephone: user.telephone,
      delegation: user.delegation,
      grade: user.grade,
      cotisationStatus: user.cotisationStatus,
    })
    .eq('id', user.id);
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
  const { data, error } = await supabase.from('aos_requests').select('*');
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
    amountApproved: req.amountApproved,
    status: req.status,
    attachedFile: req.attachedFile,
    adminComment: req.adminComment,
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
  const { error } = await supabase
    .from('aos_requests')
    .update({
      status,
      amountApproved,
      adminComment: comment,
      history
    })
    .eq('id', id);
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
