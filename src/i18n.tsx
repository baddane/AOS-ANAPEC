import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Dict, TranslationFragment } from './i18n/types';
import adminpanel from './i18n/adminpanel';
import conventions from './i18n/conventions';
import prestations from './i18n/prestations';
import profile from './i18n/profile';
import kiosk from './i18n/kiosk';
import governance from './i18n/governance';

export type Lang = 'fr' | 'ar' | 'en';
export type { Dict } from './i18n/types';

export const LANGUAGES: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: 'fr', label: 'Français', native: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇲🇦' },
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
];

const fr: Dict = {
  // App chrome
  'app.subtitle': "Œuvres Sociales de l'ANAPEC",
  'app.badge': 'INTRANET',
  'app.checkingSession': 'Vérification de la session...',
  'header.adminBackoffice': '💼 Admin Backoffice',
  'header.memberMode': '👤 Mode Adhérent',
  'header.logout': 'Déconnexion',
  'header.language': 'Langue',
  'header.onAdminPanel': 'Vous êtes sur le Panneau Backoffice Admin',
  'header.userView': 'Vue Utilisateur',

  // Navigation
  'nav.news': 'Actualités & Flux Facebook',
  'nav.kiosk': 'Kiosque & Rapports',
  'nav.governance': 'Simulateur & Transparence',
  'nav.conventions': 'Partenariats & Conventions',
  'nav.board': 'Bureau & Conseil',
  'nav.myRequests': 'Mes Demandes',
  'nav.profile': "Ma Carte d'Adhérent",

  // News
  'news.fbBadge': 'Communauté Facebook AOS',
  'news.fbTitle': "Flux Officiel & Activités Récentes de l'Association",
  'news.fbDesc': "Rejoignez plus de 2,000 collaborateurs de l'ANAPEC. Suivez les événements sportifs, les résidences d'été et les communiqués en direct de l'AOS.",
  'news.fbButton': 'Consulter la Page Facebook AOS',
  'news.adminNotes': 'Notes Administratives & Notes de Service',
  'news.views': 'vues',
  'news.read': "Lire l'annonce",
  'news.publishedOn': 'Publié le :',
  'news.priority': '🚨 Informations Prioritaires : Action requise ou date limite approchant.',
  'news.communique': 'COMMUNIQUÉ AOS ANAPEC',
  'common.close': 'Fermer',

  // Prestations
  'prest.title': "Mes Prestations d'Aides",
  'prest.desc': "Demandez vos subventions de l'Aïd Al-Adha, de l'Estivage ou remboursements de soins médicaux",
  'prest.create': "Créer un dossier d'aide",

  // Board / Bureau & Conseil
  'board.title': "Instances Dirigeantes de l'AOS",
  'board.subtitle': "Découvrez les membres du Bureau Exécutif et du Conseil National qui œuvrent au service des collaborateurs de l'ANAPEC.",
  'board.bureau': 'Bureau Exécutif',
  'board.bureauDesc': "Les membres élus qui dirigent l'association au quotidien.",
  'board.council': 'Conseil National',
  'board.councilDesc': "Les représentants des délégations régionales de l'ANAPEC.",
  'board.empty': 'Aucun membre enregistré pour le moment.',
  'board.members': 'membres',

  // Admin board management
  'admin.board': 'Bureau & Conseil',
  'admin.boardTitle': 'Gestion des Instances Dirigeantes',
  'admin.boardDesc': 'Ajoutez les membres du Bureau Exécutif et du Conseil National un par un.',
  'admin.addMember': 'Ajouter un membre',
  'admin.fullName': 'Nom complet',
  'admin.role': 'Fonction',
  'admin.category': 'Instance',
  'admin.photo': 'URL de la photo (HTTPS)',
  'admin.delegation': 'Délégation',
  'admin.email': 'Email',
  'admin.phone': 'Téléphone',
  'admin.bio': 'Biographie / Mission',
  'admin.order': "Ordre d'affichage",
  'admin.save': 'Enregistrer le membre',
  'admin.delete': 'Supprimer',
  'admin.confirmDelete': 'Supprimer ce membre ?',
  'admin.currentMembers': 'Membres enregistrés',
  'admin.fillRequired': 'Veuillez renseigner au moins le nom et la fonction.',
  'admin.memberAdded': 'Membre ajouté avec succès.',

  // Login
  'login.title': 'AOS ANAPEC',
  'login.assoc': 'Association des Œuvres Sociales',
  'login.portal': 'Portail Intranet Sécurisé des Collaborateurs ANAPEC',
  'login.signin': 'Se connecter avec Microsoft',
  'login.redirecting': 'Redirection vers Microsoft...',
  'login.instruction': 'Connectez-vous avec votre compte professionnel ANAPEC',
  'login.secure': 'Authentification sécurisée via Microsoft Azure AD',
  'login.error': 'Échec de la connexion. Veuillez réessayer ou contacter le support.',
  'news.sgNote': 'Note du Secrétaire Général :',
  'news.sgBody': "Cette décision a été validée par la Commission Sociale de l'ANAPEC. Pour tout complément, écrivez à",
  'news.staff': 'AOS Staff',
  'login.copyright': "Association des Œuvres Sociales de l'ANAPEC (AOS ANAPEC)",
  'login.tagline': "Portail officiel d'accompagnement social, d'estivage et de mutuelle.",
  'prof.certified': '★ AOS CERTIFIED',
  'conv.aosLabel': 'AOS-ANAPEC',
  'conv.socialWorks': "Œuvres Sociales de l'ANAPEC",
  'kiosk.officialPub': 'AOS Publication Officielle',
  'adm.newsAuthor': 'Commission de Communication AOS',
};

const ar: Dict = {
  'app.subtitle': 'الأعمال الاجتماعية للوكالة الوطنية لإنعاش التشغيل والكفاءات',
  'app.badge': 'الشبكة الداخلية',
  'app.checkingSession': 'جارٍ التحقق من الجلسة...',
  'header.adminBackoffice': '💼 لوحة الإدارة',
  'header.memberMode': '👤 وضع المنخرط',
  'header.logout': 'تسجيل الخروج',
  'header.language': 'اللغة',
  'header.onAdminPanel': 'أنت في لوحة الإدارة الخلفية',
  'header.userView': 'عرض المستخدم',

  'nav.news': 'الأخبار وتدفق فيسبوك',
  'nav.kiosk': 'الكشك والتقارير',
  'nav.governance': 'المحاكي والشفافية',
  'nav.conventions': 'الشراكات والاتفاقيات',
  'nav.board': 'المكتب والمجلس',
  'nav.myRequests': 'طلباتي',
  'nav.profile': 'بطاقة المنخرط',

  'news.fbBadge': 'مجتمع فيسبوك AOS',
  'news.fbTitle': 'التدفق الرسمي والأنشطة الأخيرة للجمعية',
  'news.fbDesc': 'انضم إلى أكثر من 2000 موظف بالوكالة. تابع الأحداث الرياضية والإقامات الصيفية والبلاغات مباشرة من AOS.',
  'news.fbButton': 'زيارة صفحة فيسبوك AOS',
  'news.adminNotes': 'الملاحظات الإدارية ومذكرات العمل',
  'news.views': 'مشاهدة',
  'news.read': 'قراءة الإعلان',
  'news.publishedOn': 'نُشر في:',
  'news.priority': '🚨 معلومات ذات أولوية: إجراء مطلوب أو موعد نهائي يقترب.',
  'news.communique': 'بلاغ AOS ANAPEC',
  'common.close': 'إغلاق',

  'prest.title': 'خدمات المساعدة الخاصة بي',
  'prest.desc': 'اطلب منح عيد الأضحى أو الاصطياف أو تعويضات العلاجات الطبية',
  'prest.create': 'إنشاء ملف مساعدة',

  'board.title': 'الهيئات المسيرة لـ AOS',
  'board.subtitle': 'تعرّف على أعضاء المكتب التنفيذي والمجلس الوطني الذين يعملون في خدمة موظفي الوكالة.',
  'board.bureau': 'المكتب التنفيذي',
  'board.bureauDesc': 'الأعضاء المنتخبون الذين يديرون الجمعية يومياً.',
  'board.council': 'المجلس الوطني',
  'board.councilDesc': 'ممثلو المندوبيات الجهوية للوكالة.',
  'board.empty': 'لا يوجد أعضاء مسجلون حالياً.',
  'board.members': 'أعضاء',

  'admin.board': 'المكتب والمجلس',
  'admin.boardTitle': 'تدبير الهيئات المسيرة',
  'admin.boardDesc': 'أضف أعضاء المكتب التنفيذي والمجلس الوطني واحداً تلو الآخر.',
  'admin.addMember': 'إضافة عضو',
  'admin.fullName': 'الاسم الكامل',
  'admin.role': 'المهمة',
  'admin.category': 'الهيئة',
  'admin.photo': 'رابط الصورة (HTTPS)',
  'admin.delegation': 'المندوبية',
  'admin.email': 'البريد الإلكتروني',
  'admin.phone': 'الهاتف',
  'admin.bio': 'السيرة / المهمة',
  'admin.order': 'ترتيب العرض',
  'admin.save': 'حفظ العضو',
  'admin.delete': 'حذف',
  'admin.confirmDelete': 'حذف هذا العضو؟',
  'admin.currentMembers': 'الأعضاء المسجلون',
  'admin.fillRequired': 'يرجى إدخال الاسم والمهمة على الأقل.',
  'admin.memberAdded': 'تمت إضافة العضو بنجاح.',

  'login.title': 'AOS ANAPEC',
  'login.assoc': 'جمعية الأعمال الاجتماعية',
  'login.portal': 'البوابة الداخلية الآمنة لموظفي الوكالة',
  'login.signin': 'تسجيل الدخول عبر مايكروسوفت',
  'login.redirecting': 'جارٍ التحويل إلى مايكروسوفت...',
  'login.instruction': 'سجّل الدخول بحسابك المهني بالوكالة',
  'login.secure': 'مصادقة آمنة عبر Microsoft Azure AD',
  'login.error': 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.',
  'news.sgNote': 'ملاحظة الأمين العام:',
  'news.sgBody': 'تمت المصادقة على هذا القرار من طرف اللجنة الاجتماعية للوكالة. لأي استفسار، راسلونا على',
  'news.staff': 'طاقم AOS',
  'login.copyright': 'جمعية الأعمال الاجتماعية للوكالة الوطنية لإنعاش التشغيل والكفاءات (AOS ANAPEC)',
  'login.tagline': 'البوابة الرسمية للمصاحبة الاجتماعية والاصطياف والتعاضدية.',
  'prof.certified': '★ AOS معتمد',
  'conv.aosLabel': 'AOS-ANAPEC',
  'conv.socialWorks': 'الأعمال الاجتماعية للوكالة',
  'kiosk.officialPub': 'منشور رسمي AOS',
  'adm.newsAuthor': 'لجنة التواصل AOS',
};

const en: Dict = {
  'app.subtitle': 'ANAPEC Social Works Association',
  'app.badge': 'INTRANET',
  'app.checkingSession': 'Checking session...',
  'header.adminBackoffice': '💼 Admin Backoffice',
  'header.memberMode': '👤 Member Mode',
  'header.logout': 'Log out',
  'header.language': 'Language',
  'header.onAdminPanel': 'You are on the Admin Backoffice Panel',
  'header.userView': 'User View',

  'nav.news': 'News & Facebook Feed',
  'nav.kiosk': 'Kiosk & Reports',
  'nav.governance': 'Simulator & Transparency',
  'nav.conventions': 'Partnerships & Agreements',
  'nav.board': 'Board & Council',
  'nav.myRequests': 'My Requests',
  'nav.profile': 'My Member Card',

  'news.fbBadge': 'AOS Facebook Community',
  'news.fbTitle': 'Official Feed & Recent Association Activities',
  'news.fbDesc': 'Join over 2,000 ANAPEC employees. Follow sporting events, summer residencies and announcements live from AOS.',
  'news.fbButton': 'Visit the AOS Facebook Page',
  'news.adminNotes': 'Administrative Notes & Service Memos',
  'news.views': 'views',
  'news.read': 'Read announcement',
  'news.publishedOn': 'Published on:',
  'news.priority': '🚨 Priority Information: Action required or deadline approaching.',
  'news.communique': 'AOS ANAPEC ANNOUNCEMENT',
  'common.close': 'Close',

  'prest.title': 'My Benefit Requests',
  'prest.desc': 'Request your Eid Al-Adha, summer holiday subsidies or medical care reimbursements',
  'prest.create': 'Create a benefit file',

  'board.title': 'AOS Governing Bodies',
  'board.subtitle': 'Meet the members of the Executive Bureau and the National Council serving ANAPEC employees.',
  'board.bureau': 'Executive Bureau',
  'board.bureauDesc': 'The elected members who run the association day to day.',
  'board.council': 'National Council',
  'board.councilDesc': 'Representatives of ANAPEC regional delegations.',
  'board.empty': 'No members registered yet.',
  'board.members': 'members',

  'admin.board': 'Board & Council',
  'admin.boardTitle': 'Governing Bodies Management',
  'admin.boardDesc': 'Add Executive Bureau and National Council members one by one.',
  'admin.addMember': 'Add a member',
  'admin.fullName': 'Full name',
  'admin.role': 'Position',
  'admin.category': 'Body',
  'admin.photo': 'Photo URL (HTTPS)',
  'admin.delegation': 'Delegation',
  'admin.email': 'Email',
  'admin.phone': 'Phone',
  'admin.bio': 'Biography / Mission',
  'admin.order': 'Display order',
  'admin.save': 'Save member',
  'admin.delete': 'Delete',
  'admin.confirmDelete': 'Delete this member?',
  'admin.currentMembers': 'Registered members',
  'admin.fillRequired': 'Please provide at least the name and position.',
  'admin.memberAdded': 'Member added successfully.',

  'login.title': 'AOS ANAPEC',
  'login.assoc': 'Social Works Association',
  'login.portal': 'Secure ANAPEC Employee Intranet Portal',
  'login.signin': 'Sign in with Microsoft',
  'login.redirecting': 'Redirecting to Microsoft...',
  'login.instruction': 'Sign in with your ANAPEC professional account',
  'login.secure': 'Secure authentication via Microsoft Azure AD',
  'login.error': 'Login failed. Please try again or contact support.',
  'news.sgNote': 'Secretary General Note:',
  'news.sgBody': "This decision was approved by the ANAPEC Social Commission. For any additional information, write to",
  'news.staff': 'AOS Staff',
  'login.copyright': 'ANAPEC Social Works Association (AOS ANAPEC)',
  'login.tagline': 'Official social support, summer programs and mutual aid portal.',
  'prof.certified': '★ AOS CERTIFIED',
  'conv.aosLabel': 'AOS-ANAPEC',
  'conv.socialWorks': 'ANAPEC Social Works',
  'kiosk.officialPub': 'AOS Official Publication',
  'adm.newsAuthor': 'AOS Communication Commission',
};

// Merge core dictionaries with per-feature translation fragments.
const FRAGMENTS: TranslationFragment[] = [
  adminpanel, conventions, prestations, profile, kiosk, governance,
];

const DICTS: Record<Lang, Dict> = {
  fr: { ...fr },
  ar: { ...ar },
  en: { ...en },
};

for (const frag of FRAGMENTS) {
  Object.assign(DICTS.fr, frag.fr);
  Object.assign(DICTS.ar, frag.ar);
  Object.assign(DICTS.en, frag.en);
}

interface LangContextValue {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = (typeof localStorage !== 'undefined' && localStorage.getItem('aos_lang')) as Lang | null;
    return stored && ['fr', 'ar', 'en'].includes(stored) ? stored : 'fr';
  });

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('aos_lang', l); } catch (_) { /* ignore */ }
  }, []);

  const t = useCallback((key: string): string => {
    return DICTS[lang][key] ?? DICTS.fr[key] ?? key;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, dir, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
