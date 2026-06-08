import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, Award, FileText, TrendingUp, Search, Calendar, ChevronRight,
  Printer, ArrowLeft, Plus, Trash2, Heart, Award as AwardIcon, Users, CheckCircle
} from 'lucide-react';
import { OfficialPublication, PublicationCategory } from '../types';
import { useLang } from '../i18n';

interface OfficialPublicationsKioskProps {
  isAdmin: boolean;
  onAddPublication?: (pub: OfficialPublication) => void;
  onDeletePublication?: (id: string) => void;
  overridePublications?: OfficialPublication[];
}

// Visual category helpers — generated inside component so labels go through t()
type CategoryEntry = { value: PublicationCategory | 'ALL'; label: string; icon: React.ReactNode; color: string };
function buildCategories(t: (k: string) => string): CategoryEntry[] {
  return [
    { value: 'ALL', label: t('kiosk.cat.all'), icon: <BookOpen className="w-4 h-4" />, color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { value: 'TEHNIA', label: t('kiosk.cat.tehnia'), icon: <Award className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'SOLIDARITE_RAPPORT', label: t('kiosk.cat.solidarite'), icon: <TrendingUp className="w-4 h-4" />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'CONCOURS', label: t('kiosk.cat.concours'), icon: <AwardIcon className="w-4 h-4" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'BROCHURE', label: t('kiosk.cat.brochure'), icon: <FileText className="w-4 h-4" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ];
}

// Seed Publications
export const INITIAL_PUBLICATIONS: OfficialPublication[] = [
  {
    id: 'pub_tehnia_2025',
    title: 'Félicitations Officielles : Intégrité Territoriale & Résolution de l\'ONU',
    titleAr: 'تهنئة بمناسبة مصادقة مجلس الأمن الدولي',
    category: 'TEHNIA',
    summary: 'Lettre de félicitations officielle rédigée par le Bureau d\'AOS ANAPEC célébrant l\'adoption de la résolution de l\'ONU consolidant l\'autonomie sous souveraineté marocaine.',
    summaryAr: 'بمناسبة مصادقة مجلس الأمن الدولي، وتأكيد مغربية الصحراء ومبادرة الحكم الذاتي تحت القيادة الرشيدة لصاحب الجلالة الملك محمد السادس نصره الله.',
    publishDate: '2025-11-01',
    coverImage: 'emerald',
    contentFr: `À l'occasion de l'adoption par le Conseil de Sécurité des Nations Unies de la résolution historique n°2756 du 31 octobre 2025, renforçant le soutien international à l'initiative marocaine d'autonomie pour les provinces du Sud, le Président de l'Association des Œuvres Sociales (AOS) de l'ANAPEC, M. Mohamed Al Akhrach, exprime au nom de l'ensemble des adhérents sa joie et sa fierté.

Ce triomphe diplomatique majeur consacre la légitimité historique et la justice de notre cause nationale supérieure, consolidant le rayonnement rayonnant du Royaume du Maroc sous l'impulsion et la vision clairvoyante de Sa Majesté le Roi Mohammed VI, que Dieu L'assiste.

Nous saisissons cette précieuse opportunité pour renouveler notre serment d'allégeance inébranlable et de fidélité absolue au glorieux Trône Alaouite, tout en priant le Très-Haut de préserver le Souverain et de combler Son Altesse Royale le Prince Héritier Moulay El Hassan, Son Altesse Royale le Prince Moulay Rachid, ainsi que toute la famille royale.`,
    contentAr: `بمناسبة مصادقة مجلس الأمن الدولي، يوم الجمعة 31 أكتوبر 2025، على القرار الداعم للمبادرة المغربية بشأن الحكم الذاتي في الأقاليم الجنوبية، بما يعزز الوحدة الترابية للمملكة المغربية تحت القيادة الرشيدة لصاحب الجلالة الملك محمد السادس نصره الله وأيده، يتشرف رئيس جمعية الأعمال الاجتماعية للوكالة الوطنية لإنعاش التشغيل والكفاءات، أصالة عن نفسه ونيابة عن أعضاء المكتب التنفيذي وكافة المنخرطين، بأن يرفع إلى السدة العالية بالله أسمى آيات التهاني والتبريك، مقرونة بمشاعر الفخر والاعتزاز بهذا الانتصار الدبلوماسي الكبير الذي يجسد عدالة قضيتنا الوطنية ويكرس المكانة المتميزة للمملكة المغربية في محيطها الإقليمي وعلى الصعيد الدولي.

وإننا إذ نغتنم هذه المناسبة التاريخية المجيدة، نجدد ولاءنا وإخلاصنا لصاحب الجلالة الملك محمد السادس نصره الله، معبرين عن اعتزازنا بالنهج الحكيم والرؤية المتبصرة التي يقود بها جلالته مسيرة التنمية الشاملة والدبلوماسية الرصينة دفاعا عن القضايا العادلة للوطن وصونا لمصالحه العليا.

ونسأل الله العلي القدير أن يحفظ جلالة الملك محمد السادس، ويديم عليه نعمة الصحة والعافية، وأن يقر عينه بولي عهده صاحب السمو الملكي الأمير الجليل مولاي الحسن، ويشد أزره بصاحب السمو الملكي الأمير مولاي رشيد، وأن يسبغ على الأسرة الملكية الشريفة دوام السعادة والطمأنينة والعزة.`
  },
  {
    id: 'pub_solidarite_2025',
    title: 'Rapport Financier Annuel : Caisse de Solidarité 2024-2025',
    titleAr: 'التقرير السنوي حول صندوق التضامن',
    category: 'SOLIDARITE_RAPPORT',
    summary: 'Bilan comptable annuel d\'exécution et rapport d\'utilisation du Fonds de Solidarité Nationale de l\'AOS ANAPEC au profit des adhérents.',
    summaryAr: 'تقرير مفصل حول مداخيل ومصاريف صندوق التضامن للفترة الممتدة من نونبر 2024 إلى أكتوبر 2025، مبيناً المساعدات والمنح الطبية المصروفة.',
    publishDate: '2025-11-15',
    coverImage: 'amber',
    contentFr: `Chères adhérentes, chers adhérents,
Nous avons le plaisir de vous soumettre le rapport d'exécution annuel de la caisse d'entraide et de solidarité de l'AOS au titre de l'exercice s'étalant du 1er novembre 2024 au 31 octobre 2025.

Grâce aux contributions solidaires de 10 DH prélevées mensuellement sur les bulletins des adhérents volontaires (pour un forfait annuel de 120 DH), ce fonds d'urgence de solidarité a permis d'épauler des dizaines de collègues en difficultés en leur accordant des secours immédiats à la santé (soins intensifs, dossiers médicaux lourds de chirurgie, optique ou dentaire) ainsi que des aides de soutien social lors du mois béni de Ramadan.

Le compte présente une situation saine avec un solde excédentaire net de 29 421,28 DH reporté sur le budget d'action sociale de l'année suivante.`,
    contentAr: `تحية طيبة،
نتشرف بأن نضع بين أيديكم التقرير السنوي الخاص بصندوق التضامن برسم الفترة الممتدة ما بين 01 نوفمبر 2024 و 31 أكتوبر 2025، كما نحيطكم علماً أن اقتطاع مساهماتكم الخاصة بهذا الصندوق برسم سنة 2025 ستكون نهاية شهر نونبر الجاري بالنسبة للمنخرطين الذين سبق لهم ملء وتوقيع مطبوع المساهمة.
كما نخبر الأخوات والإخوة اللواتي والذين لم يقوموا بإرسال المطبوع لسبب من الأسباب، أن بإمكانهم تعبئة هذا الأخير بقيمة 10 دراهم شهرياً كأدنى مساهمة (120 درهم سنوياً)، مع فتح المجال لمن يود المساهمة بمبلغ أكبر على أن يتم تحديده في المطبوع المرفق، وذلك مساهمة في مساعدة البعض لبعض في الحالات الطارئة التي قد تصيب أحدنا لا قدر الله.
معلوم أن صندوق التضامن قد تم إحداثه بقرار من المجلس الوطني واستفادت منه العشرات من الحالات الإنسانية الطارئة.`,
    financialDetails: {
      year: 2025,
      totalReceipts: 76121.28,
      totalExpenses: 46700.00,
      netBalance: 29421.28,
      receipts: [
        { labelAr: "الرصيد المتبقي برسم سنة 2024", labelFr: "Solde de départ de l'exercice 2024", amount: 22484.29, date: "30/11/2024" },
        { labelAr: "مساهمة المنخرطين برسم 2025", labelFr: "Contributions des adhérents pour 2025", amount: 52572.00, date: "31/12/2024" },
        { labelAr: "فوائد الصندوق برسم 2025", labelFr: "Intérêts bancaires du fond (Janvier)", amount: 333.49, date: "08/01/2025" },
        { labelAr: "فوائد الصندوق برسم 2025 (يوليو)", labelFr: "Intérêts bancaires du fond (Juillet)", amount: 731.50, date: "08/07/2025" }
      ],
      expenses: [
        { labelAr: "مساعدة صحية (ملف طبي 1)", labelFr: "Secours médical (Bénéficiaire 1)", amount: 8000.00, date: "07/01/2025" },
        { labelAr: "مساعدة اجتماعية (رمضان)", labelFr: "Allocations de solidarité (Aide Ramadan)", amount: 2000.00, date: "26/02/2025" },
        { labelAr: "مساعدة صحية (ملف طبي 2)", labelFr: "Secours médical (Bénéficiaire 2)", amount: 5000.00, date: "23/07/2025" },
        { labelAr: "مساعدة صحية (ملف طبي 3)", labelFr: "Secours médical (Bénéficiaire 3)", amount: 7000.00, date: "25/07/2025" },
        { labelAr: "مساعدة اجتماعية طارئة", labelFr: "Aide d'urgence familiale", amount: 700.00, date: "25/07/2025" },
        { labelAr: "مساعدة صحية (ملف طبي 4)", labelFr: "Secours médical (Bénéficiaire 4)", amount: 8000.00, date: "17/09/2025" },
        { labelAr: "مساعدة صحية (ملف طبي 5)", labelFr: "Secours médical (Bénéficiaire 5)", amount: 8000.00, date: "26/09/2025" },
        { labelAr: "مساعدة صحية (ملف طبي 6)", labelFr: "Secours médical (Bénéficiaire 6)", amount: 8000.00, date: "01/10/2025" }
      ]
    }
  },
  {
    id: 'pub_excellence_2026',
    title: '4ème Édition du Prix de l\'Excellence Féminine AOS ANAPEC',
    titleAr: 'جائزة التفوق السنوية للمرأة - الدورة الرابعة',
    category: 'CONCOURS',
    summary: 'Grand concours annuel lancé par l\'AOS à l\'occasion de la Journée Internationale des Femmes sous le thème : "Femmes et métiers du futur à l\'ère de l\'IA".',
    summaryAr: 'استعدادا للاحتفال باليوم العالمي للمرأة، تنظم جمعية الأعمال الاجتماعية الدورة الرابعة لجائزة التفوق السنوية للمرأة تحت شعار: "المرأة ووظائف المستقبل".',
    publishDate: '2026-02-01',
    coverImage: 'purple',
    contentFr: `À l'occasion de la Journée Internationale des Droits de la Femme, le Comité de l'AOS ANAPEC est fier de donner le coup d'envoi de la quatrième édition de son Prix de l'Excellence Féminine. Ce prix prestigieux encourage la créativité et la recherche appliquée des collaboratrices.

Sujet de mémoire ou recherche professionnelle : "Femmes et métiers du futur : comment préparer la génération 2030 à l'ère de l'intelligence artificielle ?"
Le concours est ouvert à toutes les employées en exercice de l'agence. Les meilleures contributions seront récompensées lors d'une cérémonie solennelle et se verront attribuer des dotations financières importantes allant jusqu'à 10,000 DH.`,
    contentAr: `استعداداً للاحتفال باليوم العالمي للمرأة، تنظم جمعية الأعمال الاجتماعية للوكالة الوطنية لإنعاش التشغيل والكفاءات الدورة الرابعة لجائزة التفوق السنوية للمرأة تحت شعار: "المرأة ووظائف المستقبل: كيف نعد جيل 2030 لعصر الذكاء الاصطناعي؟" (Femmes et métiers du futur : comment préparer la génération 2030 à l'ère de l'IA ?).

شروط المشاركة:
1. أن تكون المترشحة من مستخدمات الوكالة الوطنية لإنعاش التشغيل (ANAPEC).
2. أن يندرج موضوع البحث المقدم في إطار موضوع الجائزة المعلن عنه.
3. أن يكون العمل المقدم أصيلاً ولم يسبق نشره في أي إطار آخر.
4. أن يكون البحث محرراً باللغة العربية أو الفرنسية متصفاً بجودة الأسلوب.
5. أن يحترم البحث أصول وقواعد الكتابة الأكاديمية والمناهج العلمية.

تقدم الجوائز خلال حفل خاص يقام بالدار البيضاء بمناسبة يوم المرأة العالمي.`,
    contestRequirements: {
      subjectAr: "المرأة ووظائف المستقبل: كيف نعد جيل 2030 لعصر الذكاء الاصطناعي ؟",
      subjectFr: "Femmes et métiers du futur : comment préparer la génération 2030 à l'ère de l'IA ?",
      deadline: '2026-02-20',
      contactInfo: 'aosanapec@anapec.org / 07 02 06 01 46',
      prizes: [
        { rank: 1, amount: 10000, titleAr: "الجائزة الأولى : 10,000 درهم", titleFr: "1er Prix : 10,000 DH" },
        { rank: 2, amount: 7000, titleAr: "الجائزة الثانية : 7,000 درهم", titleFr: "2ème Prix : 7,000 DH" },
        { rank: 3, amount: 5000, titleAr: "الجائزة الثالثة : 5,000 درهم", titleFr: "3ème Prix : 5,000 DH" }
      ],
      conditions: [
        "Adhérente active de l'AOS ANAPEC",
        "Originalité des travaux obligatoires (Non plagiée ou modélisée par IA générative pure)",
        "Structure en format PDF (maximum 15 pages de texte d'étude scientifique)",
        "Dépôt avant le Vendredi 20 Février 2026 au bureau social"
      ]
    }
  },
  {
    id: 'pub_brochure_25h',
    title: 'Brochure Nationale AOS : "25 Heures d\'Action Interne ANAPEC"',
    titleAr: 'الدليل الوطني للأعمال الاجتماعية : "25 ساعة من التقارب والخدمات"',
    category: 'BROCHURE',
    summary: 'Le livret d\'or résumant l\'historique d\'intervention et les objectifs stratégiques triennaux d\'aide concertée.',
    summaryAr: 'الدليل الذهبي التعريفي لأعمال جمعية الأعمال الاجتماعية، ويشمل محاور الخدمات المتنوعة وشرح تفصيلي للشركاء وصيغ الاستفادة الدائمة.',
    publishDate: '2025-05-10',
    coverImage: 'blue',
    contentFr: `Nous sommes particulièrement fiers de publier ce guide d'orientation majeur baptisé "25 Heures d'Écoute et d'Action Solidaire". Ce livret de référence détaille l'accompagnement pas-à-pas offert par l'AOS de notre agence.

Vous y découvrirez des sections pratiques sur la gestion de vos demandes, l'historique complet de nos actions inter-régionales depuis 10 ans, ainsi que des fiches de contact indispensables pour toutes les situations sociales (logement, rapatriement médical, colonies sportives pour enfants, mutuelles). Cet ouvrage est consultable et téléchargeable pour tous les adhérents afin d'en tirer le meilleur parti dans leur quotidien.`,
    contentAr: `يسعد جمعية الأعمال الاجتماعية لوكالة لإنعاش التشغيل والكفاءات أن تصدر هذا الدليل العملي والإرشادي الشامل المسمى "25 ساعة من التدخل والتضامن الاجتماعي المتميز". 

يهدف هذا الدليل إلى توفير إجابات فورية ومعلومات دقيقة وشفافة لكل منخرطينا عبر ربوع المملكة حول شروط الاستفادة وصيغ التعاقد وتنزيل رؤيتنا للأعمال الاجتماعية المستدامة كركيزة للإنتاجية والرفاهية داخل الإدارة.`
  }
];

export default function OfficialPublicationsKiosk({
  isAdmin,
  onAddPublication,
  onDeletePublication,
  overridePublications
}: OfficialPublicationsKioskProps) {
  const { t } = useLang();
  const CATEGORIES = buildCategories(t);

  const [selectedCategory, setSelectedCategory] = useState<PublicationCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePublication, setActivePublication] = useState<OfficialPublication | null>(null);
  
  // Local state fallback list
  const [publications, setPublications] = useState<OfficialPublication[]>(() => {
    const saved = localStorage.getItem('aos_publications');
    return saved ? JSON.parse(saved) : INITIAL_PUBLICATIONS;
  });

  useEffect(() => {
    if (overridePublications && overridePublications.length > 0) {
      setPublications(overridePublications);
    }
  }, [overridePublications]);

  const saveToLocal = (updated: OfficialPublication[]) => {
    setPublications(updated);
    localStorage.setItem('aos_publications', JSON.stringify(updated));
  };

  // Form states for adding publications
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newCat, setNewCat] = useState<PublicationCategory>('TEHNIA');
  const [newSummary, setNewSummary] = useState('');
  const [newSummaryAr, setNewSummaryAr] = useState('');
  const [newContentFr, setNewContentFr] = useState('');
  const [newContentAr, setNewContentAr] = useState('');
  const [newCover, setNewCover] = useState('emerald');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary) return;

    const newPub: OfficialPublication = {
      id: 'pub_' + Math.random().toString(36).substring(7),
      title: newTitle,
      titleAr: newTitleAr || undefined,
      category: newCat,
      summary: newSummary,
      summaryAr: newSummaryAr || undefined,
      publishDate: new Date().toISOString().split('T')[0],
      coverImage: newCover,
      contentFr: newContentFr || undefined,
      contentAr: newContentAr || undefined
    };

    if (onAddPublication) {
      onAddPublication(newPub);
    } else {
      const updated = [newPub, ...publications];
      saveToLocal(updated);
    }

    // Reset
    setNewTitle('');
    setNewTitleAr('');
    setNewSummary('');
    setNewSummaryAr('');
    setNewContentFr('');
    setNewContentAr('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(t('kiosk.confirm.delete'))) return;
    
    if (onDeletePublication) {
      onDeletePublication(id);
    } else {
      const updated = publications.filter(p => p.id !== id);
      saveToLocal(updated);
    }
    
    if (activePublication?.id === id) {
      setActivePublication(null);
    }
  };

  // Filter & Search publications
  const filtered = publications.filter(pub => {
    const matchesCategory = selectedCategory === 'ALL' || pub.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      pub.title.toLowerCase().includes(q) || 
      (pub.titleAr && pub.titleAr.includes(q)) ||
      pub.summary.toLowerCase().includes(q) || 
      (pub.summaryAr && pub.summaryAr.includes(q));
    return matchesCategory && matchesSearch;
  });

  const getCoverGradientClass = (cover?: string) => {
    switch(cover) {
      case 'emerald': return 'from-emerald-600 to-teal-800 text-white border-emerald-500';
      case 'amber': return 'from-amber-500 to-orange-700 text-white border-amber-400';
      case 'purple': return 'from-purple-600 to-indigo-800 text-white border-purple-500';
      case 'blue': return 'from-blue-600 to-sky-800 text-white border-blue-500';
      default: return 'from-slate-700 to-slate-900 text-white border-slate-600';
    }
  };

  const translateCategory = (cat: PublicationCategory) => {
    switch(cat) {
      case 'TEHNIA': return t('kiosk.catLabel.tehnia');
      case 'SOLIDARITE_RAPPORT': return t('kiosk.catLabel.solidarite');
      case 'CONCOURS': return t('kiosk.catLabel.concours');
      case 'BROCHURE': return t('kiosk.catLabel.brochure');
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8" id="publications-kiosk-wrapper">
      
      {/* Visual Banner Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand-blue/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
              <BookOpen className="w-3.5 h-3.5" /> {t('kiosk.banner.badge')}
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">
              {t('kiosk.banner.title')}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-normal font-sans">
              {t('kiosk.banner.desc')}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-5 py-3 bg-brand-gold hover:bg-yellow-500 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-brand-gold/10 transition-all flex items-center gap-2 cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" /> {t('kiosk.admin.publishBtn')}
            </button>
          )}
        </div>
      </div>

      {/* Admin Insertion Form drawer */}
      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md text-left space-y-4"
        >
          <div className="flex justify-between items-center border-b pb-3 border-slate-100">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">{t('kiosk.form.title')}</h3>
            <button onClick={() => setShowAddForm(false)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">{t('kiosk.form.cancel')}</button>
          </div>

          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <label className="block text-slate-600 font-bold">{t('kiosk.form.labelTitleFr')}</label>
              <input 
                type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                placeholder={t('kiosk.form.phTitleFr')}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-slate-600 font-bold">{t('kiosk.form.labelTitleAr')}</label>
              <input 
                type="text" value={newTitleAr} onChange={e => setNewTitleAr(e.target.value)}
                placeholder="مثال: تهنئة بمناسبة المسيرة الخضراء" dir="rtl"
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-brand-blue font-sans text-right"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-600 font-bold">{t('kiosk.form.labelCategory')}</label>
              <select 
                value={newCat} onChange={e => setNewCat(e.target.value as PublicationCategory)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
              >
                <option value="TEHNIA">{t('kiosk.form.opt.tehnia')}</option>
                <option value="SOLIDARITE_RAPPORT">{t('kiosk.form.opt.solidarite')}</option>
                <option value="CONCOURS">{t('kiosk.form.opt.concours')}</option>
                <option value="BROCHURE">{t('kiosk.form.opt.brochure')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-600 font-bold">{t('kiosk.form.labelTheme')}</label>
              <select 
                value={newCover} onChange={e => setNewCover(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
              >
                <option value="emerald">{t('kiosk.form.color.emerald')}</option>
                <option value="amber">{t('kiosk.form.color.amber')}</option>
                <option value="purple">{t('kiosk.form.color.purple')}</option>
                <option value="blue">{t('kiosk.form.color.blue')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-600 font-bold">{t('kiosk.form.labelSummaryFr')}</label>
              <textarea 
                required value={newSummary} onChange={e => setNewSummary(e.target.value)} rows={2}
                placeholder={t('kiosk.form.phSummaryFr')}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-slate-600 font-bold">{t('kiosk.form.labelSummaryAr')}</label>
              <textarea 
                value={newSummaryAr} onChange={e => setNewSummaryAr(e.target.value)} rows={2} dir="rtl"
                placeholder="ملخص وجيز عن هذا المنشور..."
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:outline-hidden font-sans text-right"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-600 font-bold">{t('kiosk.form.labelContentFr')}</label>
              <textarea 
                value={newContentFr} onChange={e => setNewContentFr(e.target.value)} rows={4}
                placeholder={t('kiosk.form.phContentFr')}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:outline-hidden"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-slate-600 font-bold">{t('kiosk.form.labelContentAr')}</label>
              <textarea 
                value={newContentAr} onChange={e => setNewContentAr(e.target.value)} rows={4} dir="rtl"
                placeholder="اكتب تهنئتك أو منشورك الرسمي هنا باللغة العربية الفصحى..."
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:outline-hidden font-sans text-right"
              />
            </div>

            <div className="md:col-span-2 pt-3 flex justify-end gap-2.5">
              <button 
                type="button" onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                {t('kiosk.form.cancel')}
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl"
              >
                {t('kiosk.form.save')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filters and Search utilities */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col lg:flex-row gap-4 justify-between items-center shadow-xs">
        {/* Category scrolling selector */}
        <div className="flex gap-2.5 overflow-x-auto w-full lg:w-auto scrollbar-none py-1 justify-start">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search input field */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('kiosk.search.placeholder')}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-3 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-brand-blue transition-colors text-left"
          />
        </div>
      </div>

      {/* Publications Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filtered.map(pub => {
          const isFelicitation = pub.category === 'TEHNIA';
          const isFinancial = pub.category === 'SOLIDARITE_RAPPORT';
          const isExcellence = pub.category === 'CONCOURS';
          const isBrochure = pub.category === 'BROCHURE';

          return (
            <div
              key={pub.id}
              onClick={() => setActivePublication(pub)}
              className="bg-white rounded-3xl border border-slate-150 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer group text-left relative"
            >
              {/* Header colored banner representation representing the leaflet style */}
              <div className={`p-5 bg-gradient-to-r ${getCoverGradientClass(pub.coverImage)} relative shrink-0`}>
                <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none"></div>
                
                {/* Visual badges */}
                <div className="flex justify-between items-center gap-2 relative z-10">
                  <span className="text-[9px] uppercase font-serif tracking-widest text-white/95 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                    {translateCategory(pub.category)}
                  </span>
                  
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDelete(pub.id, e)}
                      className="p-1 px-2 rounded-lg bg-red-600/20 hover:bg-red-600 border border-white/10 transition-colors text-white text-[10px] font-bold"
                      title={t('kiosk.card.delete')}
                    >
                      {t('kiosk.card.delete')}
                    </button>
                  )}
                </div>

                {/* Cover Main Titles */}
                <div className="mt-8 space-y-1.5 relative z-10">
                  {pub.titleAr && (
                    <h3 className="text-lg md:text-xl font-display font-extrabold text-white text-right font-sans" dir="rtl">
                      {pub.titleAr}
                    </h3>
                  )}
                  <h4 className="text-xs font-semibold text-white/85 line-clamp-1">
                    {pub.title}
                  </h4>
                </div>

                {/* Elegant Moroccan seal emblem on background if it is تهنئة */}
                {isFelicitation && (
                  <div className="absolute bottom-2 left-4 text-3xl opacity-20 transform -rotate-12 pointer-events-none">
                    ⭐🇲🇦⭐
                  </div>
                )}
                {isFinancial && (
                  <div className="absolute bottom-2 left-4 text-3xl opacity-20 pointer-events-none">
                    📊💰
                  </div>
                )}
                {isExcellence && (
                  <div className="absolute bottom-2 left-4 text-3xl opacity-25 pointer-events-none">
                    🏆👩
                  </div>
                )}
              </div>

              {/* Cards Body description */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {pub.summaryAr && (
                    <p className="text-[11px] text-right text-slate-500 font-sans leading-relaxed line-clamp-2" dir="rtl">
                      {pub.summaryAr}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {pub.summary}
                  </p>
                </div>

                {/* Sub elements previews like accounting figures or awards constraints */}
                {isFinancial && pub.financialDetails && (
                  <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 space-y-1.5 text-[10px] text-slate-605">
                    <div className="flex justify-between font-bold">
                      <span className="text-amber-800">{t('kiosk.financial.receipts')}</span>
                      <span>{pub.financialDetails.totalReceipts.toLocaleString()} DH</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-red-700">{t('kiosk.financial.expenses')}</span>
                      <span>{pub.financialDetails.totalExpenses.toLocaleString()} DH</span>
                    </div>
                    <div className="flex justify-between font-extrabold border-t pt-1 border-amber-500/10 text-[11px]">
                      <span className="text-emerald-800">{t('kiosk.financial.balance')}</span>
                      <span className="text-emerald-700">{pub.financialDetails.netBalance.toLocaleString()} DH ✓</span>
                    </div>
                  </div>
                )}

                {isExcellence && pub.contestRequirements && (
                  <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 space-y-1.5 text-[10px] text-slate-605">
                    <div className="flex justify-between">
                      <span className="font-bold text-purple-900">{t('kiosk.contest.firstPrize')}</span>
                      <span className="font-sans font-bold text-slate-900">{pub.contestRequirements.prizes[0].amount.toLocaleString()} DH 🪙</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>{t('kiosk.contest.deadline')}</span>
                      <span className="font-mono font-bold text-purple-700">{pub.contestRequirements.deadline}</span>
                    </div>
                  </div>
                )}

                {/* Metadata footer */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t pt-3 border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t('kiosk.card.publishedOn')} {pub.publishDate}</span>
                  </div>
                  <span className="text-brand-blue font-extrabold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 select-none hover:underline">
                    {t('kiosk.card.details')} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center p-12 bg-white rounded-3xl border border-slate-100 space-y-2 text-slate-500 font-sans">
            <p className="text-base font-bold">{t('kiosk.empty.title')}</p>
            <p className="text-xs">{t('kiosk.empty.desc')}</p>
          </div>
        )}
      </div>

      {/* Modal Detail Immersive Display */}
      <AnimatePresence>
        {activePublication && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
            {/* Modal Body container (with distinct styling optimized for rendering official documents) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between text-left"
            >
              
              {/* Header Controls area */}
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center sm:px-6 shrink-0 print:hidden select-none">
                <button
                  onClick={() => setActivePublication(null)}
                  className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-xs font-bold font-sans cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> {t('kiosk.modal.close')}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={triggerPrint}
                    className="px-4.5 py-2 bg-brand-gold hover:bg-yellow-500 text-slate-950 text-xs font-extrabold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" /> {t('kiosk.modal.print')}
                  </button>
                  <button
                    onClick={() => setActivePublication(null)}
                    className="p-1 px-2 hover:bg-white/10 text-white text-sm rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Document details (printable optimized area) */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 print:p-0 print:overflow-visible scrollbar-thin">
                
                {/* Print Banner containing ANAPEC seal strictly formatting like the official poster headers */}
                <div className="hidden print:flex flex-col items-center justify-center space-y-4 pb-6 border-b border-double border-slate-300 text-center select-none">
                  {/* ANAPEC National Emblem */}
                  <div className="flex items-center gap-4">
                    <div className="text-right font-sans text-[11px] leading-relaxed">
                      <p className="font-bold">المكتب التنفيذي للجمعية</p>
                      <p>لإنعاش التشغيل والكفاءات</p>
                    </div>
                    {/* Moroccan Badge placeholder */}
                    <div className="h-16 w-16 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-xl font-bold">
                      🇲🇦
                    </div>
                    <div className="text-left font-sans text-[11px] leading-relaxed">
                      <p className="font-extrabold">Association des Œuvres Sociales</p>
                      <p>AOS ANAPEC National</p>
                    </div>
                  </div>
                  
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-serif font-bold">
                    {t('kiosk.print.docHeader')}
                  </div>
                </div>

                {/* Sub Affiche Representation */}
                <div className={`p-6 md:p-10 rounded-3xl bg-gradient-to-r ${getCoverGradientClass(activePublication.coverImage)} relative text-white border-2 border-slate-50 shadow-md flex flex-col justify-between min-h-[160px] print:rounded-none print:border-none print:text-black print:bg-none print:from-white print:to-white`}>
                  <div className="space-y-4">
                    <span className="px-3 py-1 bg-white/10 text-[9px] font-bold border border-white/10 rounded-full uppercase tracking-widest text-white print:hidden">
                      AOS Publication Officielle {activePublication.publishDate}
                    </span>
                    
                    <div className="space-y-3">
                      {activePublication.titleAr && (
                        <h2 className="text-xl md:text-3xl font-display font-black text-right print:text-black font-sans tracking-wide leading-relaxed" dir="rtl">
                          {activePublication.titleAr}
                        </h2>
                      )}
                      <h3 className="text-sm font-semibold text-white/95 print:text-slate-700">
                        {activePublication.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Background decors for nice visuals */}
                  <div className="absolute top-4 right-4 text-4xl opacity-15 select-none print:hidden pointer-events-none">⭐</div>
                  <div className="absolute bottom-4 left-4 text-5xl opacity-10 select-none print:hidden pointer-events-none">🇲🇦</div>
                </div>

                {/* Main Content Areas - Dual Language Arabic/French display like the posters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b pb-8 border-slate-100 print:grid-cols-1 print:gap-4 print:pb-0 print:border-b-0">
                  
                  {/* Language Col 1 : Arabic text (Right-to-aligned) */}
                  {activePublication.contentAr && (
                    <div className="space-y-4 text-right md:border-l md:pl-8 md:border-slate-100 print:border-l-0 print:pl-0" dir="rtl">
                      <h4 className="font-serif font-black text-slate-900 border-b pb-1.5 border-emerald-100 tracking-wide text-sm font-sans flex justify-between select-none items-center pr-1">
                        <span>{t('kiosk.modal.sectionAr')}</span>
                        <span className="text-emerald-700">★</span>
                      </h4>
                      <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line font-sans ml-1">
                        {activePublication.contentAr}
                      </p>
                    </div>
                  )}

                  {/* Language Col 2 : French translation (Left-to-aligned) */}
                  {activePublication.contentFr && (
                    <div className="space-y-4 text-left">
                      <h4 className="font-serif font-extrabold text-slate-900 border-b pb-1.5 border-slate-100 tracking-wide text-xs uppercase flex justify-between items-center select-none">
                        <span>{t('kiosk.modal.sectionFr')}</span>
                        <span className="text-slate-405">★</span>
                      </h4>
                      <p className="text-slate-700 text-slate-650 text-xs leading-relaxed whitespace-pre-line font-serif">
                        {activePublication.contentFr}
                      </p>
                    </div>
                  )}
                </div>

                {/* Extra detailed subcomponents for Solidarity Fund tables */}
                {activePublication.category === 'SOLIDARITE_RAPPORT' && activePublication.financialDetails && (
                  <div className="space-y-6 pt-4">
                    
                    <div className="p-4 bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 rounded-xl flex items-center gap-2.5 text-xs">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <p>
                        {t('kiosk.financial.auditNotice')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Recettes table (Arabic side) */}
                      <div className="space-y-3 text-right">
                        <h4 className="text-xs font-black uppercase text-slate-700 border-b border-emerald-500/10 pb-1.5 flex justify-between tracking-wide font-sans">
                          <span>{t('kiosk.financial.receiptsSection')} {activePublication.financialDetails.year}</span>
                          <span className="text-emerald-600 bg-emerald-500/10 p-1 px-2.5 rounded text-[9px]">{t('kiosk.financial.receiptsTag')}</span>
                        </h4>

                        <div className="border border-slate-150/60 rounded-xl overflow-hidden font-sans">
                          <table className="w-full text-[11px] text-right">
                            <thead className="bg-slate-50 text-slate-500 text-[10px]/normal uppercase font-bold border-b border-slate-100">
                              <tr>
                                <th className="p-2 border-l border-slate-100">{t('kiosk.financial.thDate')}</th>
                                <th className="p-2 border-l border-slate-100 text-right">{t('kiosk.financial.thType')}</th>
                                <th className="p-2 text-left">{t('kiosk.financial.thAmount')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                              {activePublication.financialDetails.receipts.map((rec, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="p-2 border-l border-slate-100 font-mono text-[10px] text-slate-400">{rec.date || '-'}</td>
                                  <td className="p-2 border-l border-slate-100 font-bold">{rec.labelAr}</td>
                                  <td className="p-2 font-mono text-left font-bold text-slate-905">{rec.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-slate-50/50 border-t font-extrabold text-[12px]/normal">
                              <tr>
                                <td colSpan={2} className="p-2 text-right border-l border-slate-100">{t('kiosk.financial.receiptsTotal')}</td>
                                <td className="p-2 text-left font-mono text-emerald-800">{activePublication.financialDetails.totalReceipts.toLocaleString(undefined, {minimumFractionDigits: 2})} DH</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      {/* Expenses Table (Expenses side) */}
                      <div className="space-y-3 text-right">
                        <h4 className="text-xs font-black uppercase text-slate-700 border-b border-rose-500/10 pb-1.5 flex justify-between tracking-wide font-sans">
                          <span>{t('kiosk.financial.expensesSection')}</span>
                          <span className="text-rose-600 bg-rose-500/10 p-1 px-2.5 rounded text-[9px]">{t('kiosk.financial.expensesTag')}</span>
                        </h4>

                        <div className="border border-slate-150/60 rounded-xl overflow-hidden font-sans">
                          <table className="w-full text-[11px] text-right">
                            <thead className="bg-slate-50 text-slate-500 text-[10px]/normal uppercase font-bold border-b border-slate-100">
                              <tr>
                                <th className="p-2 border-l border-slate-100">{t('kiosk.financial.thExpDate')}</th>
                                <th className="p-2 border-l border-slate-100 text-right">{t('kiosk.financial.thPrestation')}</th>
                                <th className="p-2 text-left">{t('kiosk.financial.thBeneficiary')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                              {activePublication.financialDetails.expenses.map((exp, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="p-2 border-l border-slate-100 font-mono text-[10px] text-slate-400">{exp.date || '-'}</td>
                                  <td className="p-2 border-l border-slate-100">{exp.labelAr}</td>
                                  <td className="p-2 font-mono text-left font-bold text-slate-905">{exp.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-slate-50/50 border-t font-extrabold text-[12px]/normal">
                              <tr>
                                <td colSpan={2} className="p-2 text-right border-l border-slate-100">{t('kiosk.financial.expensesTotal')}</td>
                                <td className="p-2 text-left font-mono text-rose-800">{activePublication.financialDetails.totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})} DH</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Report Final Summary Ledger */}
                    <div className="p-6 bg-slate-900 text-white rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-4 text-center border border-slate-800">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">{t('kiosk.financial.totalReceipts')}</p>
                        <p className="text-xl font-mono font-bold text-emerald-400 mt-1">{activePublication.financialDetails.totalReceipts.toLocaleString()} DH</p>
                      </div>
                      <div className="border-y md:border-y-0 md:border-x border-slate-800 py-3 md:py-0">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">{t('kiosk.financial.totalExpenses')}</p>
                        <p className="text-xl font-mono font-bold text-red-400 mt-1">{activePublication.financialDetails.totalExpenses.toLocaleString()} DH</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">{t('kiosk.financial.netBalance')}</p>
                        <p className="text-xl font-mono font-black text-brand-gold mt-1 underline decoration-double">{activePublication.financialDetails.netBalance.toLocaleString()} DH</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Extra detailed subcomponents for Contest requirements */}
                {activePublication.category === 'CONCOURS' && activePublication.contestRequirements && (
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-150/80 space-y-6 pt-5">
                    <h4 className="text-sm font-black text-slate-900 border-b pb-1.5 border-slate-200 tracking-wide font-sans text-right" dir="rtl">
                      {t('kiosk.contest.sectionTitle')}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 font-sans leading-relaxed">
                      
                      {/* Left: Prizes & Incentives */}
                      <div className="space-y-4">
                        <strong className="text-slate-800 uppercase tracking-wider text-[11px] block border-l-2 border-purple-500 pl-2">{t('kiosk.contest.prizesLabel')}</strong>
                        <div className="space-y-2.5">
                          {activePublication.contestRequirements.prizes.map((prz, i) => (
                            <div key={i} className="p-3.5 bg-white border border-slate-100 rounded-xl flex justify-between items-center shadow-xs">
                              <div className="flex items-center gap-2">
                                <span className="p-1.5 bg-yellow-500/10 text-yellow-600 rounded-lg text-xs font-black">
                                  #{prz.rank}
                                </span>
                                <span className="font-bold text-slate-800">{prz.titleFr}</span>
                              </div>
                              <span className="font-mono text-xs font-extrabold text-slate-900">
                                {prz.amount.toLocaleString()} DH
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Conditions list */}
                      <div className="space-y-3 text-right">
                        <strong className="text-slate-800 uppercase tracking-wider text-[11px] block pr-2 border-r-2 border-purple-500">{t('kiosk.contest.conditionsLabel')}</strong>
                        <ul className="list-inside space-y-2.5">
                          {activePublication.contestRequirements.conditions.map((cond, i) => (
                            <li key={i} className="flex gap-2 justify-end text-slate-700">
                              <span>{cond}</span>
                              <span className="text-purple-600 font-bold">✓</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400">
                          <p>{t('kiosk.contest.contactPrompt')}</p>
                          <p className="font-mono font-bold text-slate-800 mt-1">📧 {activePublication.contestRequirements.contactInfo}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Closing signature footer */}
                <div className="border-t pt-8 border-slate-100 flex justify-between items-center text-xs text-slate-400 print:pt-4 print:border-t select-none">
                  <div>
                    <p>{t('kiosk.footer.secretariat')}</p>
                    <p className="font-mono font-bold text-slate-800 text-[10px] mt-0.5">Rabat, Maroc</p>
                  </div>
                  
                  {/* Signature block of the President */}
                  <div className="text-right flex flex-col items-end">
                    <p className="italic font-sans">{t('kiosk.footer.signedBy')}</p>
                    <p className="font-bold text-slate-900 mt-1 font-sans">محمد الأخرش - رئيس الجمعية</p>
                    <p className="text-[10px]/normal text-slate-450 uppercase tracking-widest font-bold">M. Mohamed Al Akhrach</p>
                    {/* Cursive Signature Graphic decoration */}
                    <div className="mt-2 h-7 w-20 border-b border-rose-950/20 transform -rotate-3 select-none flex items-center justify-center font-serif text-slate-350 italic text-[11px]">
                      ~ AlAkhrach ~
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal footer view */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0 print:hidden select-none">
                <button
                  onClick={() => setActivePublication(null)}
                  className="px-6 py-2.5 bg-slate-250 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {t('kiosk.modal.closeBtn')}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
