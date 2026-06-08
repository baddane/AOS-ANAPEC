/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  prenom: string;
  matricule: string;
  telephone: string;
  delegation: string; // ANAPEC Delegation
  role: Role;
  membershipDate: string;
  cotisationStatus: 'active' | 'inactive';
  avatarUrl?: string;
  grade?: string;
}

export type PrestationCategory = 
  | 'EID_AL_ADHA'      // Aide pour l'Aïd Al-Adha
  | 'ESTIVAGE'         // Offres d'été & colonies de vacances
  | 'RENTREE_SCOLAIRE' // Primes pour rentrée scolaire des enfants
  | 'DOSSIER_MEDICAL'  // Remboursements & mutuelles complémentaires
  | 'PRET_SOCIAL'      // Prêts sociaux à taux 0%
  | 'PELLERINAGE'      // Subvention pour le pèlerinage (Hajj)
  | 'SPORT_CULTURE';   // Activités de sport et culture

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface PrestationRequest {
  id: string;
  userId: string;
  userName: string;
  userMatricule: string;
  userDelegation: string;
  category: PrestationCategory;
  title: string;
  submissionDate: string;
  amountRequested?: number;
  amountApproved?: number;
  description: string;
  status: RequestStatus;
  attachedFile?: {
    name: string;
    size: string;
    type: string;
  } | null;
  adminComment?: string;
  history?: {
    status: RequestStatus;
    changeDate: string;
    comment?: string;
  }[];
}

export type ConventionCategory =
  | 'HEBERGEMENT'    // Hôtels & Centres de vacances
  | 'TRANSPORT'      // ONCF, CTM, auto-écoles
  | 'SANTE'          // Cliniques, opticiens, laboratoires
  | 'BANQUE_ASSUR'   // Prêts immobiliers, assurances préférentielles
  | 'EDUCATION'      // Écoles privées, cours de langues, crèches
  | 'SOURIRE';       // Loisirs, abonnements sportifs, bien-être

export interface ConventionArticle {
  number: number;
  title: string;
  content: string;
  icon?: string;
}

export interface ConventionEstablishment {
  name: string;
  code: string;
  city?: string;
}

export interface Convention {
  id: string;
  title: string;
  partnerName: string;
  category: ConventionCategory;
  description: string;
  discountValue: string; // e.g. "30% de réduction", "Taux d'intérêt de 3.5%"
  validityDate: string;
  contactPhone: string;
  contactEmail?: string;
  address: string;
  city: string;
  highlighted?: boolean;
  signatureDate?: string;
  duration?: string;
  partnerLogo?: string;
  beneficiaries?: string[];
  establishments?: ConventionEstablishment[];
  articles?: ConventionArticle[];
  coveredServices?: string[];
  requiredDocuments?: string[];
  partnerAddress?: string;
  partnerPhone?: string;
  partnerEmail?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishDate: string;
  category: 'PRESTATION' | 'CONVENTION' | 'COMMUNIQUE' | 'EVENEMENT';
  importance: 'normal' | 'high';
  author: string;
  readCount: number;
}

export type PublicationCategory = 'TEHNIA' | 'SOLIDARITE_RAPPORT' | 'CONCOURS' | 'BROCHURE';

export interface OfficialPublication {
  id: string;
  title: string;
  titleAr?: string;
  category: PublicationCategory;
  summary: string;
  summaryAr?: string;
  publishDate: string;
  coverImage?: string; // Standard or placeholder key/theme styling (e.g. green celebration pattern, gold, orange)
  contentAr?: string; // Rich Arabic translation as in the posters
  contentFr?: string; // French text
  financialDetails?: {
    year: number;
    receipts: { labelAr: string; labelFr: string; amount: number; date?: string }[];
    expenses: { labelAr: string; labelFr: string; amount: number; date?: string; beneficiaryCount?: number }[];
    totalReceipts: number;
    totalExpenses: number;
    netBalance: number;
  };
  contestRequirements?: {
    subjectAr?: string;
    subjectFr?: string;
    deadline: string;
    prizes: { rank: number; amount: number; titleAr?: string; titleFr?: string }[];
    conditions: string[];
    contactInfo?: string;
  };
}

