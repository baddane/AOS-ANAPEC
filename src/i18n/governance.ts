import { TranslationFragment } from './types';

const fragment: TranslationFragment = {
  fr: {
    // Banner
    'gov.bannerBadge': '🛡️ Transparence, Équité & Déontologie',
    'gov.bannerTitle': "Espace Gouvernance & Simulateur d'Éligibilité",
    'gov.bannerDesc': "Pour garantir un accès équitable de tous les collaborateurs de l'ANAPEC aux subventions et activités sociales, l'AOS s'inspire des ratios de transparence financière des grands comités d'entreprises. Utilisez le simulateur de barème pour calculer vos points de priorité sociale, découvrez la répartition de vos cotisations ou écrivez au médiateur de l'AOS.",

    // Simulator section header
    'gov.simTitle': "Simulateur d'Attribution & Barème Social",
    'gov.simBadge': 'Barème Officiel AOS',
    'gov.simDesc': "Vérifiez instantanément votre score d'éligibilité prioritaire calculé selon la grille éthique votée par le Conseil National.",

    // Grade field
    'gov.fieldGrade': 'Catégorie Socio-Professionnelle (Grade)',
    'gov.gradeExecution': "Employé d'Exécution / Secrétaire / Agent (Éch 1 à 7) (+50 pts)",
    'gov.gradeMaitrise': 'Maîtrise / Conseiller Junior / Technicien (Éch 8-9) (+35 pts)',
    'gov.gradeCadre': 'Cadre / Conseiller Titulaire / Chef de Projets (Éch 10-11) (+20 pts)',
    'gov.gradeCadreSup': 'Cadre Supérieur / Conseiller Senior / Direction (Hors Échelle) (+10 pts)',
    'gov.gradeHint': "Priorité sociale redistributive : les grades à revenus modestes reçoivent un coefficient plus important.",

    // Seniority field
    'gov.fieldSeniority': "Ancienneté d'exercice à l'ANAPEC",
    'gov.seniorityYear': 'An',
    'gov.seniorityYears': 'Ans',
    'gov.seniorityHint': "Valorisation de l'engagement fidèle des agents : +2 points accordés par an (limité à 40 pts max).",

    // Family field
    'gov.fieldFamily': 'Situation familiale & Enfants',
    'gov.maritalSingle': 'Célibataire (+0 pts)',
    'gov.maritalMarried': 'Marié(e) (+10 pts)',
    'gov.children0': 'Compte : 0 Enfants (+0 pts)',
    'gov.children1': '1 Enfant (+5 pts)',
    'gov.children2': '2 Enfants (+10 pts)',
    'gov.children3': '3 Enfants (+15 pts)',
    'gov.children4': '4 Enfants (+20 pts)',
    'gov.children5': '5 Enfants et + (+25 pts)',
    'gov.familyHint': "Soutien aux charges domestiques des foyers : +5 points par enfant scolarisé ou à charge.",

    // Recurrence field
    'gov.fieldRecurrence': 'Récurence : Date de votre dernier estivage reçu',
    'gov.recurrenceNever': "Jamais bénéficié OU il y a plus de 3 ans (+30 pts)",
    'gov.recurrence2Years': "Reçu une prestation d'aide il y a 2 ans (+15 pts)",
    'gov.recurrenceLastYear': "Bénéficiaire récemment (l'année dernière) (+0 pts)",
    'gov.recurrenceHint': "Favoriser l'alternance : prime de priorité aux collègues n'ayant pas encore d'aide pour limiter le monopole.",

    // Benefit category
    'gov.fieldBenefitCat': 'Simuler pour la subvention spécifique :',
    'gov.catEstivage': "🏖️ Camp d'Estivage",
    'gov.catPretSocial': '🏦 Prêt Sans Intérêt',
    'gov.catPellerinage': '🕋 Aide Pèlerinage (Hajj)',

    // Score results
    'gov.scoreLabel': "Votre score d'éligibilité brut",
    'gov.scoreOutOf': 'points sur 145',
    'gov.priorityAbsolute': 'Priorité Absolue (Dossier Élite)',
    'gov.priorityHigh': 'Priorité Élevée (Hautement Éligible)',
    'gov.priorityModerate': "Priorité Modérée / File d'attente",
    'gov.priorityLow': 'Priorité Faible (Alternance active)',
    'gov.scoreMsg100': "Félicitations ! Vous disposez d'un excellent niveau de priorité. Votre dossier d'estivage ou d'aide sera traité au sommet de la pile pour la prochaine session d'affectation.",
    'gov.scoreMsg70': "Votre score est très solide. Vous passerez en commission prioritaire de deuxième tour. Soumettez votre dossier complet avec justificatifs.",
    'gov.scoreMsg45': "Dossier éligible mais susceptible d'être mis en attente selon les places restantes pour favoriser l'alternance sociale.",
    'gov.scoreMsg0': "Votre priorité est basse en raison de votre obtention récente ou de votre niveau de cadre. Nous vous invitons à opter pour les conventions partenariats d'hôtels qui sont illimitées.",
    'gov.priorityIndicator': 'Indicateur Priorité',
    'gov.ceiling': 'Plafond :',

    // Score breakdown toggle
    'gov.breakdownToggle': 'Voir le barème de notation mathématique',
    'gov.breakdownTitle': 'Détails d\'agrégation de vos',
    'gov.breakdownPoints': 'points :',

    // Score detail labels (inline)
    'gov.detailGrade': 'Invert-Revenu (Priorité sociale au grade :',
    'gov.detailSeniority1': 'Fidélité & Ancienneté (',
    'gov.detailSeniority2': " ans à l'ANAPEC • 2 pts/an)",
    'gov.detailFamilyMarried': 'Marié(e) +',
    'gov.detailFamilyChild': 'enfant(s)',
    'gov.detailFamilySingle': 'Célibataire',
    'gov.detailFamily': 'Charges familiales (',
    'gov.detailRecurrence': 'Alternance Equitable (',
    'gov.detailRecurrenceNever': 'Aucune prestation reçue sur les 3 dernières années',
    'gov.detailRecurrence2Years': 'Dernière prestation reçue il y a 2 ans',
    'gov.detailRecurrenceLastYear': "Bénéficiaire l'année dernière (Priorité alternance standard)",
    'gov.gradeName_execution': 'Exécution (Échelle 1-7)',
    'gov.gradeName_maitrise': 'Maîtrise (Échelle 8-9)',
    'gov.gradeName_cadre': 'Cadre (Échelle 10-11)',
    'gov.gradeName_cadre_sup': 'Cadre Supérieur (Hors Échelle)',

    // Budget section
    'gov.budgetTitle': 'Répartition Consensuelle du Budget de l\'AOS',
    'gov.budgetBadge': 'Transparence 100% Audité',
    'gov.budgetDesc': "Visibilité totale sur l'affection des cotisations d'adhésion nationale et des subventions d'état.",
    'gov.budgetIntro': "Chaque dirham investi par l'association est encadré par les ratios de gouvernance du Conseil National. Voici comment sont allouées les ressources financières globales annuelles (Budget estimé à un total de",
    'gov.budgetIntroEnd': ") :",

    // Budget categories
    'gov.budCat1': 'Couverture Médicale Complémentaire',
    'gov.budDesc1': 'Remboursements optiques, dentaires lourds, hospitalisations et capital décès.',
    'gov.budCat2': "Prêts Sociaux d'Honneur à 0%",
    'gov.budDesc2': 'Fonds revolving de prêts de secours remboursables sur salaire sans aucun intérêt.',
    'gov.budCat3': "Estivage, Colonies & Voyage d'été",
    'gov.budDesc3': "Résidences d'été louées au Maroc (M'diq, Saidia, Agadir) subventionnées à 70%.",
    'gov.budCat4': 'Soutien aux Familles & Scolarité',
    'gov.budDesc4': "Bourses scolaires de rentrée, primes de réussite académique (bac, enseignement supérieur).",
    'gov.budCat5': "Allocations Sacrées & Fêtes",
    'gov.budDesc5': "Prime annuelle de l'Aïd Al-Adha et aide exceptionnelle pour le pèlerinage aux lieux saints.",
    'gov.budCat6': "Culture, Club d'Entreprise & Sport",
    'gov.budDesc6': "Prise en charge partielle d'abonnements de sport et compétitions sportives inter-branches ANAPEC.",

    // Budget footer
    'gov.budRedistLabel': 'Indice de Redistribution d\'Action Directe :',
    'gov.budRedistValue': 'Excellent • 95%',
    'gov.budRedistDesc': "95% de nos budgets sont reversés directement en secours et subventions des utilisateurs, limitant les coûts de fonctionnement administratif à 5%.",
    'gov.budAuditBtn': 'Vérifier Audit Externe',
    'gov.budAuditAlert': "Le rapport de certification d'audit externe 2025 est consultable en entier dans le Kiosque ou sous demande au tribunal régional.",

    // Ethics Charter
    'gov.charterTitle': "Charte d'Éthique & Garanties",
    'gov.charterIntro': "Pour promouvoir la justice sociale et une saine écoute, l'AOS de l'ANAPEC applique sans réserve",
    'gov.charterCommitments': '4 engagements fondamentaux',
    'gov.charterIntroEnd': ':',
    'gov.charter1Title': 'Équité Mathématique',
    'gov.charter1Desc': "Aucun passe-droit. Toutes les demandes d'aides à budget limité passent par l'algorithme de barème ci-contre.",
    'gov.charter2Title': 'Confidentialité Intégrale',
    'gov.charter2Desc': "Vos pièces médicales (bilans, mutuelles) sont chiffrées de bout-en-bout et consultables uniquement par le Médecin-conseil.",
    'gov.charter3Title': 'Alternance Transparente',
    'gov.charter3Desc': "Un délai d'alternance interdit le cumul systématique par les mêmes adhérents pour laisser la chance aux nouveaux.",
    'gov.charter4Title': 'Droit de Contestation',
    'gov.charter4Desc': "En cas d'avis non favorable, tout adhérent peut émettre un recours formel direct auprès du Médiateur d'AOS.",
    'gov.charterSigned': 'Charte Éthique Co-Signée ✓',
    'gov.charterSignedDesc': "Vous vous engagez à déclarer avec authenticité vos charges et pièces justificatives.",
    'gov.charterSignPrompt': "Pour garantir l'intégrité de vos déclarations, veuillez lire et co-signer numériquement la charte d'éthique.",
    'gov.charterSignBtn': "📝 Co-signer la charte d'Ethique",

    // Ombudsman / Recourse form
    'gov.recourseTitle': 'Guichet Unique de Recours',
    'gov.recourseDesc': "Une réclamation sur l'historique d'un remboursement ? Un montant accordé non conforme aux promesses ? Envoyez un message confidentiel direct au",
    'gov.recourseMediateur': 'Secrétariat de Médiation Sociale',
    'gov.recourseDescEnd': '.',
    'gov.recourseSuccess': 'Recours transmis. Un numéro de saisine sera envoyé sous 48h.',
    'gov.recourseSubjectLabel': 'Sujet de recours',
    'gov.recourseSubjectPlaceholder': 'Ex : Réclamation montant dossier optique n°302',
    'gov.recourseBodyLabel': 'Exposé circonstancié des faits',
    'gov.recourseBodyPlaceholder': "Spécifiez clairement vos pièces concernées, les dates de rejet, ou votre situation familiale non prise en compte par le calcul d'aide...",
    'gov.recourseSubmitBtn': 'Déposer mon Recours Officiel',

    // Regional delegation contacts
    'gov.delegationTitle': 'Délégation Sociale Nationale :',
    'gov.delegationPhone': 'N° Social unique : +212 537 778 899',
  },

  ar: {
    // Banner
    'gov.bannerBadge': '🛡️ الشفافية والإنصاف وأخلاقيات المهنة',
    'gov.bannerTitle': 'فضاء الحوكمة ومحاكي الأهلية',
    'gov.bannerDesc': 'لضمان وصول عادل لجميع موظفي الوكالة إلى الدعم والأنشطة الاجتماعية، تستلهم AOS من معايير الشفافية المالية للجان الاجتماعية الكبرى. استخدم محاكي السلم لحساب نقاط أولويتك الاجتماعية، واستكشف توزيع اشتراكاتك أو راسل وسيط AOS.',

    // Simulator section header
    'gov.simTitle': 'محاكي التخصيص والسلم الاجتماعي',
    'gov.simBadge': 'السلم الرسمي لـ AOS',
    'gov.simDesc': 'تحقق فورًا من نقاط أهليتك ذات الأولوية المحسوبة وفق الشبكة الأخلاقية التي صادق عليها المجلس الوطني.',

    // Grade field
    'gov.fieldGrade': 'الفئة الاجتماعية والمهنية (الدرجة)',
    'gov.gradeExecution': 'موظف تنفيذي / سكرتير / عون (السلم 1 إلى 7) (+50 نقطة)',
    'gov.gradeMaitrise': 'إتقان / مستشار مبتدئ / تقني (السلم 8-9) (+35 نقطة)',
    'gov.gradeCadre': 'إطار / مستشار متثبت / رئيس مشاريع (السلم 10-11) (+20 نقطة)',
    'gov.gradeCadreSup': 'إطار سامٍ / مستشار أول / إدارة (خارج السلم) (+10 نقاط)',
    'gov.gradeHint': 'أولوية اجتماعية تصاعدية: الدرجات ذات الدخل المحدود تحصل على معامل أعلى.',

    // Seniority field
    'gov.fieldSeniority': 'الأقدمية في الوكالة الوطنية لإنعاش التشغيل والكفاءات',
    'gov.seniorityYear': 'سنة',
    'gov.seniorityYears': 'سنوات',
    'gov.seniorityHint': 'تقدير الالتزام الوفي للموظفين: +2 نقطة لكل سنة (بحد أقصى 40 نقطة).',

    // Family field
    'gov.fieldFamily': 'الوضع العائلي والأطفال',
    'gov.maritalSingle': 'أعزب/عزباء (+0 نقطة)',
    'gov.maritalMarried': 'متزوج/ة (+10 نقاط)',
    'gov.children0': 'العدد: 0 أطفال (+0 نقطة)',
    'gov.children1': 'طفل واحد (+5 نقاط)',
    'gov.children2': 'طفلان (+10 نقاط)',
    'gov.children3': '3 أطفال (+15 نقطة)',
    'gov.children4': '4 أطفال (+20 نقطة)',
    'gov.children5': '5 أطفال وأكثر (+25 نقطة)',
    'gov.familyHint': 'دعم الأعباء الأسرية: +5 نقاط لكل طفل في الدراسة أو تحت الكفالة.',

    // Recurrence field
    'gov.fieldRecurrence': 'التكرار: تاريخ آخر استفادة من الاصطياف',
    'gov.recurrenceNever': 'لم يسبق الاستفادة أو منذ أكثر من 3 سنوات (+30 نقطة)',
    'gov.recurrence2Years': 'تمت الاستفادة منذ سنتين (+15 نقطة)',
    'gov.recurrenceLastYear': 'مستفيد مؤخرًا (السنة الماضية) (+0 نقطة)',
    'gov.recurrenceHint': 'تشجيع التناوب: أولوية للزملاء الذين لم يستفيدوا بعد للحد من الاحتكار.',

    // Benefit category
    'gov.fieldBenefitCat': 'محاكاة للدعم المحدد:',
    'gov.catEstivage': '🏖️ مخيم الاصطياف',
    'gov.catPretSocial': '🏦 قرض بدون فوائد',
    'gov.catPellerinage': '🕋 مساعدة الحج',

    // Score results
    'gov.scoreLabel': 'نقاط أهليتك الإجمالية',
    'gov.scoreOutOf': 'نقطة من 145',
    'gov.priorityAbsolute': 'أولوية مطلقة (ملف نخبة)',
    'gov.priorityHigh': 'أولوية عالية (مؤهل بامتياز)',
    'gov.priorityModerate': 'أولوية معتدلة / قائمة انتظار',
    'gov.priorityLow': 'أولوية منخفضة (تناوب نشط)',
    'gov.scoreMsg100': 'تهانينا! تتمتع بمستوى أولوية ممتاز. سيُعالَج ملف اصطيافك أو مساعدتك في مقدمة القائمة للدورة القادمة.',
    'gov.scoreMsg70': 'نقاطك قوية جدًا. ستنتقل إلى لجنة الأولوية في الجولة الثانية. قدم ملفك الكامل مع المستندات الداعمة.',
    'gov.scoreMsg45': 'الملف مؤهل لكنه قد يُوضع في قائمة الانتظار حسب الأماكن المتاحة لتشجيع التناوب الاجتماعي.',
    'gov.scoreMsg0': 'أولويتك منخفضة نظرًا للاستفادة الحديثة أو درجتك الوظيفية. ندعوك للاستفادة من اتفاقيات شراكة الفنادق غير المحدودة.',
    'gov.priorityIndicator': 'مؤشر الأولوية',
    'gov.ceiling': 'السقف:',

    // Score breakdown toggle
    'gov.breakdownToggle': 'عرض تفاصيل سلم التنقيط',
    'gov.breakdownTitle': 'تفاصيل تجميع نقاطك البالغة',
    'gov.breakdownPoints': ':',

    // Score detail labels
    'gov.detailGrade': 'عكس الدخل (الأولوية الاجتماعية للدرجة:',
    'gov.detailSeniority1': 'الوفاء والأقدمية (',
    'gov.detailSeniority2': ' سنة في الوكالة • 2 نقطة/سنة)',
    'gov.detailFamilyMarried': 'متزوج/ة +',
    'gov.detailFamilyChild': 'طفل/أطفال',
    'gov.detailFamilySingle': 'أعزب/عزباء',
    'gov.detailFamily': 'الأعباء العائلية (',
    'gov.detailRecurrence': 'التناوب العادل (',
    'gov.detailRecurrenceNever': 'لم يتم تلقي أي مساعدة خلال السنوات الثلاث الأخيرة',
    'gov.detailRecurrence2Years': 'آخر مساعدة تلقاها منذ سنتين',
    'gov.detailRecurrenceLastYear': 'مستفيد العام الماضي (أولوية التناوب القياسية)',
    'gov.gradeName_execution': 'تنفيذ (السلم 1-7)',
    'gov.gradeName_maitrise': 'إتقان (السلم 8-9)',
    'gov.gradeName_cadre': 'إطار (السلم 10-11)',
    'gov.gradeName_cadre_sup': 'إطار سامٍ (خارج السلم)',

    // Budget section
    'gov.budgetTitle': 'التوزيع التشاركي لميزانية AOS',
    'gov.budgetBadge': 'شفافية 100% مدققة',
    'gov.budgetDesc': 'رؤية كاملة على تخصيص اشتراكات الانخراط الوطني والدعم الحكومي.',
    'gov.budgetIntro': 'كل درهم تستثمره الجمعية يخضع لمعايير حوكمة المجلس الوطني. إليك كيفية تخصيص الموارد المالية السنوية الإجمالية (الميزانية المقدرة بإجمالي',
    'gov.budgetIntroEnd': '):',

    // Budget categories
    'gov.budCat1': 'التغطية الطبية التكميلية',
    'gov.budDesc1': 'تعويضات البصريات والأسنان الكبرى والاستشفاء ورأس مال الوفاة.',
    'gov.budCat2': 'القروض الاجتماعية الشرفية بنسبة 0%',
    'gov.budDesc2': 'صندوق قروض الطوارئ المتجددة القابلة للسداد من الراتب بدون أي فائدة.',
    'gov.budCat3': 'الاصطياف والمخيمات والرحلات الصيفية',
    'gov.budDesc3': 'إقامات صيفية مستأجرة في المغرب (مضيق، السعيدية، أكادير) مدعومة بنسبة 70%.',
    'gov.budCat4': 'دعم الأسر والتمدرس',
    'gov.budDesc4': 'منح الدراسة في بداية العام، ومكافآت التفوق الأكاديمي (البكالوريا، التعليم العالي).',
    'gov.budCat5': 'المخصصات الدينية والمناسبات',
    'gov.budDesc5': 'المنحة السنوية لعيد الأضحى والمساعدة الاستثنائية لأداء فريضة الحج.',
    'gov.budCat6': 'الثقافة ونادي المقاولة والرياضة',
    'gov.budDesc6': 'التكفل الجزئي باشتراكات الرياضة والمنافسات الرياضية بين فروع الوكالة.',

    // Budget footer
    'gov.budRedistLabel': 'مؤشر إعادة التوزيع المباشر:',
    'gov.budRedistValue': 'ممتاز • 95%',
    'gov.budRedistDesc': '95% من ميزانياتنا تُرجَع مباشرة كإعانات ودعم للمستفيدين، مما يُبقي التكاليف الإدارية في حدود 5%.',
    'gov.budAuditBtn': 'التحقق من المراجعة الخارجية',
    'gov.budAuditAlert': 'تقرير شهادة المراجعة الخارجية لعام 2025 متاح للاطلاع بالكامل في الكشك أو بناءً على طلب للمحكمة الإقليمية.',

    // Ethics Charter
    'gov.charterTitle': 'ميثاق الأخلاقيات والضمانات',
    'gov.charterIntro': 'للنهوض بالعدالة الاجتماعية وحسن الإنصات، تُطبق AOS للوكالة دون تحفظ',
    'gov.charterCommitments': '4 التزامات جوهرية',
    'gov.charterIntroEnd': ':',
    'gov.charter1Title': 'الإنصاف الرياضي',
    'gov.charter1Desc': 'لا محاباة. جميع طلبات المساعدة ذات الميزانية المحدودة تمر عبر خوارزمية السلم المقابلة.',
    'gov.charter2Title': 'السرية التامة',
    'gov.charter2Desc': 'وثائقكم الطبية (الفحوصات والتأمينات) مشفرة من طرف إلى طرف ولا يمكن الاطلاع عليها إلا من قبل الطبيب المستشار.',
    'gov.charter3Title': 'التناوب الشفاف',
    'gov.charter3Desc': 'أجل التناوب يمنع التراكم المنهجي من قبل نفس المنخرطين لإتاحة الفرصة للأعضاء الجدد.',
    'gov.charter4Title': 'حق الطعن',
    'gov.charter4Desc': 'في حالة الرأي غير المؤيد، يمكن لأي منخرط رفع طعن رسمي مباشر لدى وسيط AOS.',
    'gov.charterSigned': 'ميثاق الأخلاقيات موقع مشتركًا ✓',
    'gov.charterSignedDesc': 'تلتزم بالإفصاح بصدق عن أعبائك والمستندات الداعمة.',
    'gov.charterSignPrompt': 'لضمان نزاهة تصريحاتك، يرجى قراءة ميثاق الأخلاقيات والتوقيع عليه رقميًا.',
    'gov.charterSignBtn': '📝 التوقيع المشترك على ميثاق الأخلاقيات',

    // Ombudsman / Recourse form
    'gov.recourseTitle': 'الشباك الموحد للطعون',
    'gov.recourseDesc': 'شكوى حول سجل التعويض؟ مبلغ ممنوح لا يتوافق مع الوعود؟ أرسل رسالة سرية مباشرة إلى',
    'gov.recourseMediateur': 'أمانة الوساطة الاجتماعية',
    'gov.recourseDescEnd': '.',
    'gov.recourseSuccess': 'تم إرسال الطعن. سيُرسَل رقم التسجيل خلال 48 ساعة.',
    'gov.recourseSubjectLabel': 'موضوع الطعن',
    'gov.recourseSubjectPlaceholder': 'مثال: شكوى حول مبلغ ملف البصريات رقم 302',
    'gov.recourseBodyLabel': 'عرض الوقائع بالتفصيل',
    'gov.recourseBodyPlaceholder': 'حدد بوضوح الوثائق المعنية وتواريخ الرفض أو وضعك العائلي غير المأخوذ بعين الاعتبار في حساب المساعدة...',
    'gov.recourseSubmitBtn': 'تقديم طعني الرسمي',

    // Regional delegation contacts
    'gov.delegationTitle': 'المندوبية الاجتماعية الوطنية:',
    'gov.delegationPhone': 'الرقم الاجتماعي الموحد: 899 778 537 212+',
  },

  en: {
    // Banner
    'gov.bannerBadge': '🛡️ Transparency, Equity & Ethics',
    'gov.bannerTitle': 'Governance Space & Eligibility Simulator',
    'gov.bannerDesc': "To guarantee fair access for all ANAPEC employees to subsidies and social activities, AOS draws on the financial transparency standards of major works councils. Use the scoring simulator to calculate your social priority points, discover how your contributions are allocated, or write to the AOS mediator.",

    // Simulator section header
    'gov.simTitle': 'Benefit Assignment Simulator & Social Scoring',
    'gov.simBadge': 'Official AOS Scoring',
    'gov.simDesc': "Instantly check your priority eligibility score calculated using the ethical grid approved by the National Council.",

    // Grade field
    'gov.fieldGrade': 'Socio-Professional Category (Grade)',
    'gov.gradeExecution': 'Executive Employee / Secretary / Agent (Scale 1–7) (+50 pts)',
    'gov.gradeMaitrise': 'Supervisory / Junior Advisor / Technician (Scale 8-9) (+35 pts)',
    'gov.gradeCadre': 'Manager / Senior Advisor / Project Leader (Scale 10-11) (+20 pts)',
    'gov.gradeCadreSup': 'Senior Manager / Senior Advisor / Director (Above Scale) (+10 pts)',
    'gov.gradeHint': 'Redistributive social priority: lower-income grades receive a higher coefficient.',

    // Seniority field
    'gov.fieldSeniority': 'Years of Service at ANAPEC',
    'gov.seniorityYear': 'Year',
    'gov.seniorityYears': 'Years',
    'gov.seniorityHint': 'Recognising loyal employee commitment: +2 points per year (capped at 40 pts max).',

    // Family field
    'gov.fieldFamily': 'Family Situation & Children',
    'gov.maritalSingle': 'Single (+0 pts)',
    'gov.maritalMarried': 'Married (+10 pts)',
    'gov.children0': 'Count: 0 Children (+0 pts)',
    'gov.children1': '1 Child (+5 pts)',
    'gov.children2': '2 Children (+10 pts)',
    'gov.children3': '3 Children (+15 pts)',
    'gov.children4': '4 Children (+20 pts)',
    'gov.children5': '5 Children or more (+25 pts)',
    'gov.familyHint': 'Support for household expenses: +5 points per child in school or as a dependent.',

    // Recurrence field
    'gov.fieldRecurrence': 'Recurrence: Date of your last summer benefit received',
    'gov.recurrenceNever': 'Never benefited OR more than 3 years ago (+30 pts)',
    'gov.recurrence2Years': 'Received a benefit 2 years ago (+15 pts)',
    'gov.recurrenceLastYear': 'Recent beneficiary (last year) (+0 pts)',
    'gov.recurrenceHint': "Encouraging rotation: priority bonus for colleagues who haven't yet received assistance to limit monopoly.",

    // Benefit category
    'gov.fieldBenefitCat': 'Simulate for a specific subsidy:',
    'gov.catEstivage': '🏖️ Summer Camp',
    'gov.catPretSocial': '🏦 Interest-Free Loan',
    'gov.catPellerinage': '🕋 Pilgrimage Assistance (Hajj)',

    // Score results
    'gov.scoreLabel': 'Your gross eligibility score',
    'gov.scoreOutOf': 'points out of 145',
    'gov.priorityAbsolute': 'Absolute Priority (Elite File)',
    'gov.priorityHigh': 'High Priority (Highly Eligible)',
    'gov.priorityModerate': "Moderate Priority / Waiting List",
    'gov.priorityLow': 'Low Priority (Active Rotation)',
    'gov.scoreMsg100': "Congratulations! You have an excellent priority level. Your summer or assistance file will be processed at the top of the queue for the next allocation session.",
    'gov.scoreMsg70': "Your score is very strong. You will move to the second-round priority committee. Submit your complete file with supporting documents.",
    'gov.scoreMsg45': "File eligible but may be placed on hold depending on remaining spots in order to encourage social rotation.",
    'gov.scoreMsg0': "Your priority is low due to a recent benefit or your management grade. We invite you to take advantage of the unlimited hotel partnership agreements.",
    'gov.priorityIndicator': 'Priority Indicator',
    'gov.ceiling': 'Ceiling:',

    // Score breakdown toggle
    'gov.breakdownToggle': 'View the mathematical scoring breakdown',
    'gov.breakdownTitle': 'Aggregation details for your',
    'gov.breakdownPoints': 'points:',

    // Score detail labels
    'gov.detailGrade': 'Inverse-Income (Social priority for grade:',
    'gov.detailSeniority1': 'Loyalty & Seniority (',
    'gov.detailSeniority2': ' years at ANAPEC • 2 pts/year)',
    'gov.detailFamilyMarried': 'Married +',
    'gov.detailFamilyChild': 'child(ren)',
    'gov.detailFamilySingle': 'Single',
    'gov.detailFamily': 'Family Expenses (',
    'gov.detailRecurrence': 'Fair Rotation (',
    'gov.detailRecurrenceNever': 'No benefit received in the last 3 years',
    'gov.detailRecurrence2Years': 'Last benefit received 2 years ago',
    'gov.detailRecurrenceLastYear': 'Beneficiary last year (Standard rotation priority)',
    'gov.gradeName_execution': 'Execution (Scale 1-7)',
    'gov.gradeName_maitrise': 'Supervisory (Scale 8-9)',
    'gov.gradeName_cadre': 'Manager (Scale 10-11)',
    'gov.gradeName_cadre_sup': 'Senior Manager (Above Scale)',

    // Budget section
    'gov.budgetTitle': "AOS Budget Consensual Allocation",
    'gov.budgetBadge': '100% Audited Transparency',
    'gov.budgetDesc': 'Full visibility into the allocation of national membership contributions and state subsidies.',
    'gov.budgetIntro': "Every dirham invested by the association is governed by the National Council's governance ratios. Here is how annual global financial resources are allocated (Estimated total budget of",
    'gov.budgetIntroEnd': '):',

    // Budget categories
    'gov.budCat1': 'Supplementary Medical Coverage',
    'gov.budDesc1': 'Reimbursements for optics, major dental care, hospitalisations and death benefit.',
    'gov.budCat2': 'Interest-Free Social Honour Loans',
    'gov.budDesc2': 'Revolving emergency loan fund repayable from salary with no interest whatsoever.',
    'gov.budCat3': 'Summer Camps, Colonies & Holidays',
    'gov.budDesc3': "Summer residences rented in Morocco (M'diq, Saidia, Agadir) subsidised at 70%.",
    'gov.budCat4': 'Family & Education Support',
    'gov.budDesc4': 'Back-to-school bursaries and academic excellence bonuses (baccalaureate, higher education).',
    'gov.budCat5': 'Religious Allowances & Celebrations',
    'gov.budDesc5': 'Annual Eid Al-Adha grant and exceptional assistance for pilgrimage to the holy sites.',
    'gov.budCat6': 'Culture, Company Club & Sport',
    'gov.budDesc6': 'Partial subsidy for sports subscriptions and inter-branch ANAPEC sports competitions.',

    // Budget footer
    'gov.budRedistLabel': 'Direct Action Redistribution Index:',
    'gov.budRedistValue': 'Excellent • 95%',
    'gov.budRedistDesc': "95% of our budgets are returned directly as relief and subsidies to users, keeping administrative operating costs at 5%.",
    'gov.budAuditBtn': 'Verify External Audit',
    'gov.budAuditAlert': "The 2025 external audit certification report is available in full in the Kiosk or upon request to the regional court.",

    // Ethics Charter
    'gov.charterTitle': 'Ethics Charter & Guarantees',
    'gov.charterIntro': 'To promote social justice and genuine responsiveness, the ANAPEC AOS unreservedly applies',
    'gov.charterCommitments': '4 fundamental commitments',
    'gov.charterIntroEnd': ':',
    'gov.charter1Title': 'Mathematical Equity',
    'gov.charter1Desc': 'No preferential treatment. All limited-budget assistance requests go through the scoring algorithm on the left.',
    'gov.charter2Title': 'Full Confidentiality',
    'gov.charter2Desc': 'Your medical documents (assessments, mutual insurance) are end-to-end encrypted and accessible only by the Medical Advisor.',
    'gov.charter3Title': 'Transparent Rotation',
    'gov.charter3Desc': 'A rotation period prevents systematic accumulation by the same members, giving new members an opportunity.',
    'gov.charter4Title': 'Right to Appeal',
    'gov.charter4Desc': 'In the event of an unfavourable decision, any member may file a formal appeal directly with the AOS Mediator.',
    'gov.charterSigned': 'Ethics Charter Co-Signed ✓',
    'gov.charterSignedDesc': 'You commit to truthfully declaring your expenses and supporting documents.',
    'gov.charterSignPrompt': "To ensure the integrity of your declarations, please read and digitally co-sign the ethics charter.",
    'gov.charterSignBtn': "📝 Co-sign the Ethics Charter",

    // Ombudsman / Recourse form
    'gov.recourseTitle': 'Single Recourse Desk',
    'gov.recourseDesc': 'A complaint about a reimbursement history? An amount granted not matching the promises? Send a confidential message directly to the',
    'gov.recourseMediateur': 'Social Mediation Secretariat',
    'gov.recourseDescEnd': '.',
    'gov.recourseSuccess': 'Appeal submitted. A case number will be sent within 48 hours.',
    'gov.recourseSubjectLabel': 'Subject of appeal',
    'gov.recourseSubjectPlaceholder': 'Ex: Complaint about optical file amount no. 302',
    'gov.recourseBodyLabel': 'Detailed statement of facts',
    'gov.recourseBodyPlaceholder': 'Clearly specify the documents concerned, rejection dates, or your family situation not taken into account in the benefit calculation...',
    'gov.recourseSubmitBtn': 'Submit My Official Appeal',

    // Regional delegation contacts
    'gov.delegationTitle': 'National Social Delegation:',
    'gov.delegationPhone': 'Unique Social No.: +212 537 778 899',
  },
};

export default fragment;
