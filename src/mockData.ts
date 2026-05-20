/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Convention, PrestationRequest, NewsArticle } from './types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_1',
    email: 'collaborateur@aosanapec.ma',
    name: 'Mansouri',
    prenom: 'Nadia',
    matricule: 'EMP-203',
    telephone: '+212 661 234567',
    delegation: 'Casablanca-Anfa',
    role: 'user',
    membershipDate: '2021-04-12',
    cotisationStatus: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    grade: 'Cadre Supérieur'
  },
  {
    id: 'user_admin',
    email: 'admin@aosanapec.ma',
    name: 'Benchakroun',
    prenom: 'Karim',
    matricule: 'ADM-904',
    telephone: '+212 661 987654',
    delegation: 'Direction Générale (Rabat)',
    role: 'admin',
    membershipDate: '2018-01-15',
    cotisationStatus: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    grade: 'Chef de Service Social'
  },
  {
    id: 'user_2',
    email: 'yassine.idrissi@aosanapec.ma',
    name: 'El Idrissi',
    prenom: 'Yassine',
    matricule: 'EMP-110',
    telephone: '+212 662 445566',
    delegation: 'Marrakech-Gueliz',
    role: 'user',
    membershipDate: '2023-09-01',
    cotisationStatus: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    grade: 'Conseiller en Emploi'
  },
  {
    id: 'user_3',
    email: 'fatima.alaoui@aosanapec.ma',
    name: 'Alaoui',
    prenom: 'Fatima-Zahra',
    matricule: 'EMP-445',
    telephone: '+212 663 778899',
    delegation: 'Fès-Ville',
    role: 'user',
    membershipDate: '2020-02-10',
    cotisationStatus: 'inactive',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    grade: 'Gestionnaire de Compte'
  },
  {
    id: 'user_4',
    email: 'amine.chraibi@aosanapec.ma',
    name: 'Chraibi',
    prenom: 'Amine',
    matricule: 'EMP-302',
    telephone: '+212 665 112233',
    delegation: 'Agadir-Ida-Outanane',
    role: 'user',
    membershipDate: '2019-11-20',
    cotisationStatus: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    grade: 'Chef d\'Agence Régionale'
  }
];

export const MOCK_CONVENTIONS: Convention[] = [
  {
    id: 'conv_oncf',
    title: 'Tarifs Préférentiels sur le Réseau Ferré National',
    partnerName: 'Office National des Chemins de Fer (ONCF)',
    category: 'TRANSPORT',
    description: 'Réduction exceptionnelle accordée à l\'ensemble des adhérents de l\'AOS ANAPEC ainsi que leurs conjoints et enfants sur tous les trains de ligne y compris la grande vitesse Al Boraq (2ème et 1ère classe).',
    discountValue: '35% de réduction',
    validityDate: '2027-12-31',
    contactPhone: '2255',
    contactEmail: 'contact@oncf.ma',
    address: 'Place de la Gare, Rabat',
    city: 'Rabat',
    highlighted: true
  },
  {
    id: 'conv_atlas_hosp',
    title: 'Estivage dans les Hôtels du Groupe Atlas',
    partnerName: 'Atlas Hospitality Morocco',
    category: 'HEBERGEMENT',
    description: 'Bénéficiez de tarifs préférentiels exclusifs de séjour en formule tout compris ou demi-pension dans les complexes hôteliers du groupe Atlas à Agadir, Marrakech, Tanger et Essaouira.',
    discountValue: '30% à 40% de réduction',
    validityDate: '2026-10-31',
    contactPhone: '+212 522 458790',
    contactEmail: 'resa@atlashospitality.ma',
    address: 'Boulevard de la Corniche, Casablanca',
    city: 'Multi-villes',
    highlighted: true
  },
  {
    id: 'conv_banque_pop',
    title: 'Offre de Financement Immobilier & Crédits Conso',
    partnerName: 'Groupe Banque Populaire (GBP)',
    category: 'BANQUE_ASSUR',
    description: 'Taux préférentiels pour les crédits immobiliers destinés à l\'acquisition du logement principal ainsi qu\'un traitement rapide et exonération totale des frais de dossier.',
    discountValue: 'Taux fixe de 3.35%',
    validityDate: '2027-06-30',
    contactPhone: '+212 522 202535',
    contactEmail: 'partenariats@cpm.co.ma',
    address: '101, Boulevard Mohamed V, Casablanca',
    city: 'National',
    highlighted: false
  },
  {
    id: 'conv_afflelou',
    title: 'Correction Visuelle & Lunettes de Vue',
    partnerName: 'Alain Afflelou Maroc',
    category: 'SANTE',
    description: 'Réductions sur les montures optiques et solaires, verres correcteurs de haute qualité, et examen ophtalmologique préventif gratuit dans tous les points de vente agréés.',
    discountValue: '25% de remise + test gratuit',
    validityDate: '2026-12-31',
    contactPhone: '+212 522 984512',
    address: 'Angle Boulevard Massira et Rue Ain Harrouda, Casablanca',
    city: 'Multi-villes',
    highlighted: false
  },
  {
    id: 'conv_cityclub',
    title: 'Abonnements Fitness et Remise en Forme',
    partnerName: 'City Club Maroc',
    category: 'SOURIRE',
    description: 'Accords pour des abonnements annuels exclusifs pour les collaborateurs de l\'ANAPEC, donnant accès à tous les clubs du réseau national (fitness, musculation, cours collectifs et piscine).',
    discountValue: '1900 DH au lieu de 3500 DH',
    validityDate: '2026-12-31',
    contactPhone: '+212 522 101010',
    contactEmail: 'corporate@cityclub.ma',
    address: 'Boulevard Abdelmoumen, Casablanca',
    city: 'Multi-villes',
    highlighted: false
  },
  {
    id: 'conv_lycee_bous',
    title: 'Soutien aux Frais Scolaires & Inscriptions',
    partnerName: 'Groupe Scolaire Al Yassamine (Éducation)',
    category: 'EDUCATION',
    description: 'Réductions spéciales sur les frais d\'inscription annuelle et réduction mensuelle pour tous les cycles scolaires (maternelle, primaire, collège et lycée) au profit des enfants d\'adhérents.',
    discountValue: '15% de réduction mensuelle',
    validityDate: '2027-09-01',
    contactPhone: '+212 522 654321',
    address: 'Quartier Laymoun, Casablanca',
    city: 'Casablanca',
    highlighted: false
  }
];

export const MOCK_REQUESTS: PrestationRequest[] = [
  {
    id: 'req_1',
    userId: 'user_1',
    userName: 'Mansouri Nadia',
    userMatricule: 'EMP-203',
    userDelegation: 'Casablanca-Anfa',
    category: 'ESTIVAGE',
    title: 'Aide à l\'Estivage - Camp d\'été Al Hoceima 2026',
    submissionDate: '2026-05-18',
    amountRequested: 3000,
    amountApproved: 3000,
    description: 'Demande de subvention pour la réservation d\'un bungalow familial au centre d\'estivage de l\'AOS à Al Hoceima pour la période du 10 au 17 juillet 2026.',
    status: 'approved',
    attachedFile: {
      name: 'fiche_reservation_alhoceima.pdf',
      size: '2.4 MB',
      type: 'application/pdf'
    },
    adminComment: 'Demande conforme aux critères d\'éligibilité. Réservation confirmée.',
    history: [
      { status: 'pending', changeDate: '2026-05-18' },
      { status: 'approved', changeDate: '2026-05-19', comment: 'Demande conforme aux critères d\'éligibilité. Réservation confirmée.' }
    ]
  },
  {
    id: 'req_2',
    userId: 'user_1',
    userName: 'Mansouri Nadia',
    userMatricule: 'EMP-203',
    userDelegation: 'Casablanca-Anfa',
    category: 'DOSSIER_MEDICAL',
    title: 'Remboursement Mutuelle Complémentaire Optique',
    submissionDate: '2026-05-10',
    amountRequested: 1200,
    amountApproved: 1200,
    description: 'Dossier de soins optiques pour l\'acquisition de verres progressifs correcteurs et monture, suite à la facture clinique n°F-2026-118.',
    status: 'approved',
    attachedFile: {
      name: 'dossier_medical_nadiamansouri.pdf',
      size: '1.8 MB',
      type: 'application/pdf'
    },
    adminComment: 'Approuvé à 100% selon le barème annuel d\'optique.',
    history: [
      { status: 'pending', changeDate: '2026-05-10' },
      { status: 'approved', changeDate: '2026-05-12', comment: 'Approuvé à 100% selon le barème annuel d\'optique.' }
    ]
  },
  {
    id: 'req_3',
    userId: 'user_2',
    userName: 'El Idrissi Yassine',
    userMatricule: 'EMP-110',
    userDelegation: 'Marrakech-Gueliz',
    category: 'EID_AL_ADHA',
    title: 'Aide Financière Aïd Al-Adha 1447H',
    submissionDate: '2026-05-15',
    amountRequested: 2000,
    description: 'Demande de prime sociale réglementaire pour l\'acquisition du mouton de l\'Aïd El-Adha pour l\'année 2026, au titre de soutien familial.',
    status: 'pending',
    attachedFile: {
      name: 'attestation_rib_idrissi.pdf',
      size: '540 KB',
      type: 'application/pdf'
    },
    history: [
      { status: 'pending', changeDate: '2026-05-15' }
    ]
  },
  {
    id: 'req_4',
    userId: 'user_3',
    userName: 'Alaoui Fatima-Zahra',
    userMatricule: 'EMP-445',
    userDelegation: 'Fès-Ville',
    category: 'PRET_SOCIAL',
    title: 'Demande exceptionelle de Prêt Social Sans Intérêt',
    submissionDate: '2026-04-20',
    amountRequested: 15000,
    description: 'Demande de prêt social de trésorerie urgente de 15,000 DH remboursable sur 18 mois pour frais d\'hospitalisation chirurgicaux imprévus.',
    status: 'rejected',
    attachedFile: {
      name: 'devis_clinique_fezsante.pdf',
      size: '3.1 MB',
      type: 'application/pdf'
    },
    adminComment: 'Rejet en raison d\'un cotisation suspendue (cotisation inactive). Veuillez régulariser votre profil.',
    history: [
      { status: 'pending', changeDate: '2026-04-20' },
      { status: 'rejected', changeDate: '2026-04-22', comment: 'Rejet en raison d\'un cotisation suspendue (cotisation inactive). Veuillez régulariser votre profil.' }
    ]
  },
  {
    id: 'req_5',
    userId: 'user_4',
    userName: 'Chraibi Amine',
    userMatricule: 'EMP-302',
    userDelegation: 'Agadir-Ida-Outanane',
    category: 'PELLERINAGE',
    title: 'Participation financière au Pèlerinage Sacré 2026',
    submissionDate: '2026-05-19',
    amountRequested: 10000,
    description: 'Demande de subvention forfaitaire pour pèlerinage réservée aux agents ayant plus de 10 ans de service à l\'ANAPEC (tirage au sort AOS concluant).',
    status: 'pending',
    attachedFile: {
      name: 'confirmation_ministere_hajj.pdf',
      size: '1.2 MB',
      type: 'application/pdf'
    },
    history: [
      { status: 'pending', changeDate: '2026-05-19' }
    ]
  }
];

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news_1',
    title: 'Lancement de l\'opération "Estivage & Camps d\'été" pour la saison 2026',
    summary: 'L\'AOS ANAPEC annonce l\'ouverture des réservations pour les centres d\'estivage (Saïdia, M\'diq, Al Hoceima, Ifrane et Agadir).',
    content: 'Nous avons le plaisir de vous informer que la campagne d\'estivage pour l\'année 2026 démarrera officiellement le 1er Juin. Les adhérents en situation active de cotisation peuvent formuler leurs demandes de réservation directement sur l\'intranet. Les attributions se feront selon un barème de points valorisant l\'ancienneté et la non-bénéfice au cours des 3 dernières années pour garantir l\'équité sociale.',
    publishDate: '2026-05-19',
    category: 'PRESTATION',
    importance: 'high',
    author: 'Bureau Exécutif AOS',
    readCount: 312
  },
  {
    id: 'news_2',
    title: 'Nouvelle Convention Optique majeure signée avec Alain Afflelou Maroc',
    summary: 'Partenariat exclusif offrant 25% de remise et le tiers payant sur toutes les solutions d\'optique médicale.',
    content: 'Afin d\'améliorer la prise en charge médicale optique de son personnel, l\'Association a signé un accord-cadre avec l\'enseigne d\'optique Alain Afflelou. Cet accord donne droit à des prix subventionnés, une prise en charge rapide des dossiers et des examens préventifs gratuits pour les salariés de l\'ANAPEC ainsi que leurs conjoints et leurs enfants à charge.',
    publishDate: '2026-05-15',
    category: 'CONVENTION',
    importance: 'normal',
    author: 'Responsable Partenariats',
    readCount: 185
  },
  {
    id: 'news_3',
    title: 'Subvention Sociale Spéciale : Événement Aïd Al-Adha 1447H',
    summary: 'La prime exceptionnelle de l\'Aïd Al-Adha est portée à 2 000 DH cette année.',
    content: 'Considérant les circonstances économiques et face à l\'approche de la célébration sacrée de l\'Aïd Al-Adha, le Comité Directeur de l\'Association a validé une augmentation exceptionnelle du montant de la subvention à 2,000 DH versée directement sur le compte bancaire de l\'adhérent d\'ici fin Mai. Veillez à soumettre vos formulaires complets avec justificatifs RIB le plus tôt possible.',
    publishDate: '2026-05-10',
    category: 'COMMUNIQUE',
    importance: 'high',
    author: 'Président de l\'AOS',
    readCount: 524
  },
  {
    id: 'news_4',
    title: 'Tournoi de Mini-Foot Inter-Agences ANAPEC 2026',
    summary: 'Inscriptions ouvertes pour l\'édition régionale de Casablanca du tournoi de football de l\'amitié.',
    content: 'Dans le cadre du développement des relations fraternelles et de la promotion d\'un climat de travail sain, l\'AOS organise la phase éliminatoire régionale du tournoi annuel de football à 5. Les agences de l\'ANAPEC intéressées sont priées de constituer leurs équipes (de 6 à 8 joueurs) et de transmettre le dossier d\'inscription au bureau régional des affaires sociales.',
    publishDate: '2026-05-02',
    category: 'EVENEMENT',
    importance: 'normal',
    author: 'Délégué aux Sports',
    readCount: 94
  }
];

export const INTEGRATION_CHANNELS = {
  facebook_aos: 'https://www.facebook.com/search/top/?q=AOS'
};

export const DELEGATIONS_LIST = [
  'Direction Générale (Rabat)',
  'Casablanca-Anfa',
  'Casablanca-Ain Sebaa',
  'Rabat-Centre',
  'Marrakech-Gueliz',
  'Agadir-Ida-Outanane',
  'Fès-Ville',
  'Tanger-Assilah',
  'Oujda-Angad',
  'Kénitra-Al Qods',
  'Laâyoune-Sakia El Hamra',
  'Nador-Centre',
  'Meknès-Ville'
];
