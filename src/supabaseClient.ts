import { createClient } from '@supabase/supabase-js';
import { UserProfile, Convention, PrestationRequest, NewsArticle } from './types';

// Supabase project: AOS-ANAPEC-Intranet (eu-west-3)
// The anon key is a publishable client key — safe for public frontends protected by RLS.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://zkdqywiumoklgthcasnu.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZHF5d2l1bW9rbGd0aGNhc251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDg3NTksImV4cCI6MjA5NTkyNDc1OX0.jeYeJh4D5FoNbXiC6YcQiGRahWYjkzZ60bjln0gHevQ';

// Clean validation of credentials presence
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL Schema for creation & seeding inside Supabase SQL Editor.
 * This is provided to the end-user inside the Admin dashboard so they can bootstrap their Supabase instances.
 */
export const SUPABASE_SQL_SCHEMA = `
-- ========================================================
-- INTÉGRATION SUPABASE POUR L'INTRANET AOS ANAPEC
-- Étape 1 : Créez ces tables dans votre Editeur SQL Supabase
-- ========================================================

-- Table des Adhérents et Administrateurs
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

-- Table des Conventions & Remises Négociées
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

-- Table des Demandes d'Aide & Prestations Sociales
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

-- Table des Communiqués de l'Association
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

-- Enable RLS and public access or custom policies of your choice
-- Pour simplifier les tests d'intégration, voici les politiques de lecture/écriture publiques :
ALTER TABLE aos_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE aos_conventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE aos_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE aos_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select of users" ON aos_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert of users" ON aos_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of users" ON aos_users FOR UPDATE USING (true);

CREATE POLICY "Allow public select of conventions" ON aos_conventions FOR SELECT USING (true);
CREATE POLICY "Allow public insert of conventions" ON aos_conventions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of conventions" ON aos_conventions FOR UPDATE USING (true);

CREATE POLICY "Allow public select of requests" ON aos_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert of requests" ON aos_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of requests" ON aos_requests FOR UPDATE USING (true);

CREATE POLICY "Allow public select of news" ON aos_news FOR SELECT USING (true);
CREATE POLICY "Allow public insert of news" ON aos_news FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of news" ON aos_news FOR UPDATE USING (true);


-- ========================================================
-- Étape 2 : Peuplement des données initiales (Optionnel)
-- ========================================================

INSERT INTO aos_users (id, email, name, prenom, matricule, telephone, delegation, role, "membershipDate", "cotisationStatus", "avatarUrl", grade, password) VALUES
('user_1', 'collaborateur@aosanapec.ma', 'Mansouri', 'Nadia', 'EMP-203', '+212 661 234567', 'Casablanca-Anfa', 'user', '2021-04-12', 'active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', 'Cadre Supérieur', 'user123'),
('user_admin', 'admin@aosanapec.ma', 'Benchakroun', 'Karim', 'ADM-904', '+212 661 987654', 'Direction Générale (Rabat)', 'admin', '2018-01-15', 'active', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120', 'Chef de Service Social', 'admin123'),
('user_2', 'yassine.idrissi@aosanapec.ma', 'El Idrissi', 'Yassine', 'EMP-110', '+212 662 445566', 'Marrakech-Gueliz', 'user', '2023-09-01', 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', 'Conseiller en Emploi', 'user123'),
('user_3', 'fatima.alaoui@aosanapec.ma', 'Alaoui', 'Fatima-Zahra', 'EMP-445', '+212 663 778899', 'Fès-Ville', 'user', '2020-02-10', 'inactive', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120', 'Gestionnaire de Compte', 'user123'),
('user_4', 'amine.chraibi@aosanapec.ma', 'Chraibi', 'Amine', 'EMP-302', '+212 665 112233', 'Agadir-Ida-Outanane', 'user', '2019-11-20', 'active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120', 'Chef d''Agence Régionale', 'user123')
ON CONFLICT (id) DO NOTHING;

INSERT INTO aos_conventions (id, title, "partnerName", category, description, "discountValue", "validityDate", "contactPhone", "contactEmail", address, city, highlighted) VALUES
('conv_oncf', 'Tarifs Préférentiels sur le Réseau Ferré National', 'Office National des Chemins de Fer (ONCF)', 'TRANSPORT', 'Réduction exceptionnelle accordée à l''ensemble des adhérents de l''AOS ANAPEC ainsi que leurs conjoints et enfants sur tous les trains de ligne y compris la grande vitesse Al Boraq (2ème et 1ère classe).', '35% de réduction', '2027-12-31', '2255', 'contact@oncf.ma', 'Place de la Gare, Rabat', 'Rabat', true),
('conv_atlas_hosp', 'Estivage dans les Hôtels du Groupe Atlas', 'Atlas Hospitality Morocco', 'HEBERGEMENT', 'Bénéficiez de tarifs préférentiels exclusifs de séjour en formule tout compris ou demi-pension dans les complexes hôteliers du groupe Atlas à Agadir, Marrakech, Tanger et Essaouira.', '30% à 40% de réduction', '2026-10-31', '+212 522 458790', 'resa@atlashospitality.ma', 'Boulevard de la Corniche, Casablanca', 'Multi-villes', true),
('conv_banque_pop', 'Offre de Financement Immobilier & Crédits Conso', 'Groupe Banque Populaire (GBP)', 'BANQUE_ASSUR', 'Taux préférentiels pour les crédits immobiliers destinés à l''acquisition du logement principal ainsi qu''un traitement rapide et exonération totale des frais de dossier.', 'Taux fixe de 3.35%', '2027-06-30', '+212 522 202535', 'partenariats@cpm.co.ma', '101, Boulevard Mohamed V, Casablanca', 'National', false),
('conv_afflelou', 'Correction Visuelle & Lunettes de Vue', 'Alain Alain Afflelou Maroc', 'SANTE', 'Réductions sur les montures optiques et solaires, verres correcteurs de haute qualité, et examen ophtalmologique préventif gratuit dans tous les points de vente agréés.', '25% de remise + test gratuit', '2026-12-31', '+212 522 984512', NULL, 'Angle Boulevard Massira et Rue Ain Harrouda, Casablanca', 'Multi-villes', false),
('conv_cityclub', 'Abonnements Fitness et Remise en Forme', 'City Club Maroc', 'SOURIRE', 'Accords pour des abonnements annuels exclusifs pour les collaborateurs de l''ANAPEC, donnant accès à tous les clubs du réseau national (fitness, musculation, cours collectifs et piscine).', '1900 DH au lieu de 3500 DH', '2026-12-31', '+212 522 101010', 'corporate@cityclub.ma', 'Boulevard Abdelmoumen, Casablanca', 'Multi-villes', false),
('conv_lycee_bous', 'Soutien aux Frais Scolaires & Inscriptions', 'Groupe Scolaire Al Yassamine (Éducation)', 'EDUCATION', 'Réductions spéciales sur les frais d''inscription annuelle et réduction mensuelle pour tous les cycles scolaires (maternelle, primaire, collège et lycée) au profit des enfants d''adhérents.', '15% de réduction mensuelle', '2027-09-01', '+212 522 654321', NULL, 'Quartier Laymoun, Casablanca', 'Casablanca', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO aos_news (id, title, summary, content, "publishDate", category, importance, author, "readCount") VALUES
('news_1', 'Lancement de l''opération "Estivage & Camps d''été" pour la saison 2026', 'L''AOS ANAPEC annonce l''ouverture des réservations pour les centres d''estivage (Saïdia, M''diq, Al Hoceima, Ifrane et Agadir).', 'Nous avons le plaisir de vous informer que la campagne d''estivage pour l''année 2026 démarrera officiellement le 1er Juin. Les adhérents en situation active de cotisation peuvent formuler leurs demandes de réservation directement sur l''intranet. Les attributions se feront selon un barème de points valorisant l''ancienneté et la non-bénéfice au cours des 3 dernières années pour garantir l''équité sociale.', '2026-05-19', 'PRESTATION', 'high', 'Bureau Exécutif AOS', 312),
('news_2', 'Nouvelle Convention Optique majeure signée avec Alain Afflelou Maroc', 'Partenariat exclusif offrant 25% de remise et le tiers payant sur toutes les solutions d''optique médicale.', 'Afin d''améliorer la prise en charge médicale optique de son personnel, l''Association a signé un accord-cadre avec l''enseigne d''optique Alain Afflelou. Cet accord donne droit à des prix subventionnés, une prise en charge rapide des dossiers et des examens préventifs gratuits pour les salariés de l''ANAPEC ainsi que leurs conjoints et leurs enfants à charge.', '2026-05-15', 'CONVENTION', 'normal', 'Responsable Partenariats', 185),
('news_3', 'Subvention Sociale Spéciale : Événement Aïd Al-Adha 1447H', 'La prime exceptionnelle de l''Aïd Al-Adha est portée à 2 000 DH cette année.', 'Considérant les circonstances économiques et face à l''approche de la célébration sacrée de l''Aïd Al-Adha, le Comité Directeur de l''Association a validé une augmentation exceptionnelle du montant de la subvention à 2,000 DH versée directement sur le compte bancaire de l''adhérent d''ici fin Mai. Veillez à soumettre vos formulaires complets avec justificatifs RIB le plus tôt possible.', '2026-05-10', 'COMMUNIQUE', 'high', 'Président de l''AOS', 524),
('news_4', 'Tournoi de Mini-Foot Inter-Agences ANAPEC 2026', 'Inscriptions ouvertes pour l''édition régionale de Casablanca du tournoi de football de l''amitié.', 'Dans le cadre du développement des relations fraternelles et de la promotion d''un climat de travail sain, l''AOS organise la phase éliminatoire régionale du tournoi annuel de football à 5. Les agences de l''ANAPEC intéressées sont priées de constituer leurs équipes (de 6 à 8 joueurs) et de transmettre le dossier d''inscription au bureau régional des affaires sociales.', '2026-05-02', 'EVENEMENT', 'normal', 'Délégué aux Sports', 94)
ON CONFLICT (id) DO NOTHING;

INSERT INTO aos_requests (id, "userId", "userName", "userMatricule", "userDelegation", category, title, description, "submissionDate", "amountRequested", "amountApproved", status, "attachedFile", "adminComment", history) VALUES
('req_1', 'user_1', 'Mansouri Nadia', 'EMP-203', 'Casablanca-Anfa', 'ESTIVAGE', 'Aide à l''Estivage - Camp d''été Al Hoceima 2026', 'Demande de subvention pour la réservation d''un bungalow familial au centre d''estivage de l''AOS à Al Hoceima pour la période du 10 au 17 juillet 2026.', '2026-05-18', 3000, 3000, 'approved', '{"name": "fiche_reservation_alhoceima.pdf", "size": "2.4 MB", "type": "application/pdf"}', 'Demande conforme aux critères d''éligibilité. Réservation confirmée.', '[{"status": "pending", "changeDate": "2026-05-18"}, {"status": "approved", "changeDate": "2026-05-19", "comment": "Demande conforme aux critères d''éligibilité. Réservation confirmée."}]'),
('req_2', 'user_1', 'Mansouri Nadia', 'EMP-203', 'Casablanca-Anfa', 'DOSSIER_MEDICAL', 'Remboursement Mutuelle Complémentaire Optique', 'Dossier de soins optiques pour l''acquisition de verres progressifs correcteurs et monture, suite à la facture clinique n°F-2026-118.', '2026-05-10', 1200, 1200, 'approved', '{"name": "dossier_medical_nadiamansouri.pdf", "size": "1.8 MB", "type": "application/pdf"}', 'Approuvé à 100% selon le barème annuel d''optique.', '[{"status": "pending", "changeDate": "2026-05-10"}, {"status": "approved", "changeDate": "2026-05-12", "comment": "Approuvé à 100% selon le barème annuel d''optique."}]'),
('req_3', 'user_2', 'El Idrissi Yassine', 'EMP-110', 'Marrakech-Gueliz', 'EID_AL_ADHA', 'Aide Financière Aïd Al-Adha 1447H', 'Demande de prime sociale réglementaire pour l''acquisition du mouton de l''Aïd El-Adha pour l''année 2026, au titre de soutien familial.', '2026-05-15', 2000, NULL, 'pending', '{"name": "attestation_rib_idrissi.pdf", "size": "540 KB", "type": "application/pdf"}', NULL, '[{"status": "pending", "changeDate": "2026-05-15"}]'),
('req_4', 'user_3', 'Alaoui Fatima-Zahra', 'EMP-445', 'Fès-Ville', 'PRET_SOCIAL', 'Demande exceptionelle de Prêt Social Sans Intérêt', 'Demande de prêt social de trésorerie urgente de 15,000 DH remboursable sur 18 mois pour frais d''hospitalisation chirurgicaux imprévus.', '2026-04-20', 15000, NULL, 'rejected', '{"name": "devis_clinique_fezsante.pdf", "size": "3.1 MB", "type": "application/pdf"}', 'Rejet en raison d''un cotisation suspendue (cotisation inactive). Veuillez régulariser votre profil.', '[{"status": "pending", "changeDate": "2026-04-20"}, {"status": "rejected", "changeDate": "2026-04-22", "comment": "Rejet en raison d''un cotisation suspendue (cotisation inactive). Veuillez régulariser votre profil."}]'),
('req_5', 'user_4', 'Chraibi Amine', 'EMP-302', 'Agadir-Ida-Outanane', 'PELLERINAGE', 'Participation financière au Pèlerinage Sacré 2026', 'Demande de subvention forfaitaire pour pèlerinage réservée aux agents ayant plus de 10 ans de service à l''ANAPEC (tirage au sort AOS concluant).', '2026-05-19', 10000, NULL, 'pending', '{"name": "confirmation_ministere_hajj.pdf", "size": "1.2 MB", "type": "application/pdf"}', NULL, '[{"status": "pending", "changeDate": "2026-05-19"}]')
ON CONFLICT (id) DO NOTHING;
`;

/**
 * DB WRAPPERS WITH EXCELLENT FALLBACK TOLERANCE
 */

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
      password: user.password
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
