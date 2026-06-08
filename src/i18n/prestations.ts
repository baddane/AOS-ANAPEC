import { TranslationFragment } from './types';

const fragment: TranslationFragment = {
  fr: {
    // ── NewPrestationForm (pf.) ──────────────────────────────────────────────
    'pf.headerTitle': 'Déposer une nouvelle demande de Prestation',
    'pf.headerDesc': "Soumettre un dossier social, d'aide financière ou de mutuelle",
    'pf.espaceBadge': 'Espace Adhérent',

    // Inactive subscription warning
    'pf.inactiveTitle': 'Abonnement / Cotisation suspendu',
    'pf.inactiveBody':
      "Vos cotisations mensuelles ne semblent pas être à jour (Status d'adhésion : inactive). Vous ne pouvez pas finaliser votre demande. Veuillez contacter l'administration de l'AOS au chef-lieu de votre délégation régionale pour régulariser votre dossier.",

    // Validation error messages
    'pf.errNotActive':
      "Votre profil d'adhérent n'est pas actif. Seuls les adhérents à jour de leurs cotisations de l'AOS sont autorisés à émettre des demandes.",
    'pf.errTitleDesc': 'Veuillez remplir le titre et la description détaillée de votre demande.',
    'pf.errNoFile':
      'Veuillez joindre les pièces justificatives requises (RIB, factures, certificats médicaux, fiches de paie, etc.) pour appuyer votre demande.',

    // Field labels
    'pf.labelCategory': 'Nature de la Prestation Sociale',
    'pf.labelTitle': "Intitulé de l'objet",
    'pf.labelAmount': 'Montant estimé ou demandé (DH)',
    'pf.labelDescription': "Description Détaillée & Justifications d'éligibilité",
    'pf.labelFiles': 'Pièces Justificatives Obligatoires (Dossier Compressé / Fichiers PDF, Images)',

    // Placeholders
    'pf.placeholderTitle':
      'Ex: Demande de remboursement monture optique ou prime de rentrée scolaire',
    'pf.placeholderDescription':
      "Veuillez spécifier toutes les informations requises (nombres d'enfants scolarisés, dates précises du voyage d'estivage, factures de dépenses médicales, coordonnées bancaires...). Votre descriptif sera lu attentivement par la commission sociale de l'association.",

    // File upload zone
    'pf.dropZoneText': 'Glissez-déposez votre dossier ici, ou',
    'pf.dropZoneBrowse': 'compulsez vos fichiers',
    'pf.dropZoneHint': 'Fichiers autorisés : PDF, ZIP, PNG ou JPG (Max. 10 Mo pour justificatif social)',
    'pf.fileTypeBadge': 'PDF / Justificatif',

    // Buttons
    'pf.btnCancel': 'Annuler',
    'pf.btnSubmit': "Soumettre ma demande d'aide",

    // Success screen
    'pf.successTitle': 'Demande soumise avec succès !',
    'pf.successBody':
      "Votre requête de prestation sociale a été enregistrée dans notre intranet de l'AOS. L'équipe du Secrétariat Social va étudier vos pièces justificatives sous un délai de 5 à 7 jours ouvrables.",
    'pf.successBack': 'Retour au Tableau de Bord',

    // Category labels
    'pf.cat.EID_AL_ADHA': "Aide Exceptionnelle de l'Aïd Al-Adha",
    'pf.cat.ESTIVAGE': 'Estivage & Vacances Familiales',
    'pf.cat.RENTREE_SCOLAIRE': 'Subvention de la Rentrée Scolaire',
    'pf.cat.DOSSIER_MEDICAL': 'Remboursement Mutuelle Complémentaire',
    'pf.cat.PRET_SOCIAL': 'Prêt Social Sans Intérêt (0%)',
    'pf.cat.PELLERINAGE': 'Subvention Hajj / Omra (Pèlerinage)',
    'pf.cat.SPORT_CULTURE': 'Activités Sportives & Culturelles',

    // Category descriptions
    'pf.catDesc.EID_AL_ADHA':
      "Assistance financière réglementaire forfaitaire annuelle pour l'achat du mouton.",
    'pf.catDesc.ESTIVAGE':
      "Prise en charge partielle des frais d'hébergement ou de camps d'été organisés par l'AOS.",
    'pf.catDesc.RENTREE_SCOLAIRE':
      'Assistance pour frais scolaires et fournitures pour vos enfants scolarisés.',
    'pf.catDesc.DOSSIER_MEDICAL':
      'Soutien aux soins dentaires, optiques, maternité ou opérations chirurgicales complexes.',
    'pf.catDesc.PRET_SOCIAL':
      "Formulation de prêt d'honneur de trésorerie pour urgences ou événements de vie majeurs.",
    'pf.catDesc.PELLERINAGE':
      "Soutien de l'AOS réservé aux agents tirés au sort pour le pèlerinage aux lieux sacrés.",
    'pf.catDesc.SPORT_CULTURE':
      "Remboursement d'abonnements annuels à des clubs sportifs ou événements agréés.",

    // Category limits
    'pf.catLimit.EID_AL_ADHA': 'Montant forfaitaire: 2 000 DH',
    'pf.catLimit.ESTIVAGE': "Subvention jusqu'à: 4 000 DH",
    'pf.catLimit.RENTREE_SCOLAIRE': 'Montant par enfant: 500 DH',
    'pf.catLimit.DOSSIER_MEDICAL': 'Selon barème de mutuelle',
    'pf.catLimit.PRET_SOCIAL': 'Maximum: 20 000 DH',
    'pf.catLimit.PELLERINAGE': 'Subvention forfaitaire: 10 000 DH',
    'pf.catLimit.SPORT_CULTURE': "Subvention jusqu'à: 1 500 DH",

    // ── PrestationRequestList (prl.) ─────────────────────────────────────────
    'prl.heading': 'Historique & Suivi des Demandes',
    'prl.headingDesc': 'Consultez le statut de traitement et les avis de paiement de la commission',

    // Filter buttons
    'prl.filterAll': 'Tous',
    'prl.filterPending': 'En attente',
    'prl.filterApproved': 'Approuvés',
    'prl.filterRejected': 'Rejetés',

    // Status labels
    'prl.statusPending': "En attente d'examen",
    'prl.statusApproved': 'Dossier Approuvé',
    'prl.statusRejected': 'Dossier Rejeté',

    // Category display labels (with emojis kept as-is)
    'prl.cat.EID_AL_ADHA': 'Aïd Al-Adha 🐑',
    'prl.cat.ESTIVAGE': 'Estivage & Camps 🏖️',
    'prl.cat.RENTREE_SCOLAIRE': 'Rentrée Scolaire 🎒',
    'prl.cat.DOSSIER_MEDICAL': 'Complément Mutuelle 🩺',
    'prl.cat.PRET_SOCIAL': "Prêt Social d'Honneur 🏦",
    'prl.cat.PELLERINAGE': 'Pèlerinage Sacré 🕋',
    'prl.cat.SPORT_CULTURE': 'Sports & Culture 🏆',

    // List item metadata
    'prl.refPrefix': 'Ref:',
    'prl.budgetLabel': 'Budget:',

    // Empty state
    'prl.emptyTitle': 'Aucun dossier trouvé',
    'prl.emptyDesc':
      "Vous n'avez aucune demande active en cours ou correspondant au filtre sélectionné.",

    // Detail sidebar
    'prl.sidebarTitle': 'Aperçu du Dossier',
    'prl.submittedBy': 'Soumis par',
    'prl.detailObject': 'Objet détaillé',
    'prl.amountRequested': 'Sollicité',
    'prl.amountApproved': 'Accordé',
    'prl.amountRejected': '0 DH (Refus)',
    'prl.amountPending': 'En cours...',
    'prl.openFile': 'Ouvrir',
    'prl.fileType': 'PDF',
    'prl.simulatedDownload': 'Téléchargement simulé de la pièce justificative.',
    'prl.adminComment': 'Commentaire de la commission',
    'prl.historyTitle': 'Historique de décision',
    'prl.histApproved': "Validation finale par l'AOS",
    'prl.histRejected': 'Rejet du dossier',
    'prl.histPending': 'Dépôt du dossier initial',
    'prl.histDatePrefix': 'Le',
    'prl.histDateSuffix': 'à 10:30',

    // Empty sidebar placeholder
    'prl.selectTitle': 'Détail du Dossier',
    'prl.selectDesc':
      "Veuillez sélectionner une demande dans la liste de gauche pour visualiser son dossier complet, ses pièces justificatives et l'historique réglementaire.",
  },

  ar: {
    // ── NewPrestationForm (pf.) ──────────────────────────────────────────────
    'pf.headerTitle': 'تقديم طلب خدمة اجتماعية جديد',
    'pf.headerDesc': 'تقديم ملف اجتماعي أو طلب مساعدة مالية أو تعويض من صندوق التعاضد',
    'pf.espaceBadge': 'فضاء المنخرط',

    'pf.inactiveTitle': 'الاشتراك موقوف',
    'pf.inactiveBody':
      'يبدو أن اشتراكاتك الشهرية غير مُحدَّثة (حالة الانخراط: غير نشطة). لا يمكنك إتمام طلبك. يرجى التواصل مع إدارة AOS في مقر مندوبيتك الجهوية لتسوية وضعك.',

    'pf.errNotActive':
      'ملفك الشخصي غير نشط. يُسمح فقط للمنخرطين المُحدِّثين لاشتراكاتهم في AOS بتقديم الطلبات.',
    'pf.errTitleDesc': 'يرجى ملء عنوان الطلب ووصفه التفصيلي.',
    'pf.errNoFile':
      'يرجى إرفاق الوثائق المطلوبة (RIB، فواتير، شهادات طبية، أوراق الراتب، إلخ) لدعم طلبك.',

    'pf.labelCategory': 'طبيعة الخدمة الاجتماعية',
    'pf.labelTitle': 'عنوان الطلب',
    'pf.labelAmount': 'المبلغ المقدَّر أو المطلوب (DH)',
    'pf.labelDescription': 'وصف تفصيلي ومبررات الأهلية',
    'pf.labelFiles': 'الوثائق الإثباتية الإلزامية (ملف مضغوط / ملفات PDF، صور)',

    'pf.placeholderTitle': 'مثال: طلب استرداد تكاليف النظارة الطبية أو منحة الدخول المدرسي',
    'pf.placeholderDescription':
      'يرجى تحديد جميع المعلومات المطلوبة (عدد الأطفال في المدرسة، تواريخ العطلة الصيفية، فواتير المصاريف الطبية، بيانات الحساب البنكي...). سيُقرأ وصفك بعناية من قِبَل اللجنة الاجتماعية للجمعية.',

    'pf.dropZoneText': 'اسحب ملفاتك وأفلتها هنا، أو',
    'pf.dropZoneBrowse': 'تصفح ملفاتك',
    'pf.dropZoneHint': 'الملفات المسموح بها: PDF، ZIP، PNG أو JPG (الحد الأقصى 10 ميجابايت)',
    'pf.fileTypeBadge': 'PDF / وثيقة إثبات',

    'pf.btnCancel': 'إلغاء',
    'pf.btnSubmit': 'إرسال طلب المساعدة',

    'pf.successTitle': 'تم إرسال الطلب بنجاح!',
    'pf.successBody':
      'تم تسجيل طلبك للحصول على خدمة اجتماعية في نظامنا الداخلي. سيدرس فريق الأمانة الاجتماعية وثائقك في غضون 5 إلى 7 أيام عمل.',
    'pf.successBack': 'العودة إلى لوحة التحكم',

    'pf.cat.EID_AL_ADHA': 'مساعدة استثنائية لعيد الأضحى',
    'pf.cat.ESTIVAGE': 'الاصطياف والعطل العائلية',
    'pf.cat.RENTREE_SCOLAIRE': 'منحة الدخول المدرسي',
    'pf.cat.DOSSIER_MEDICAL': 'استرداد من صندوق التعاضد التكميلي',
    'pf.cat.PRET_SOCIAL': 'قرض اجتماعي بدون فوائد (0%)',
    'pf.cat.PELLERINAGE': 'منحة الحج / العمرة',
    'pf.cat.SPORT_CULTURE': 'الأنشطة الرياضية والثقافية',

    'pf.catDesc.EID_AL_ADHA': 'مساعدة مالية جزافية سنوية لاقتناء الأضحية.',
    'pf.catDesc.ESTIVAGE': 'تغطية جزئية لتكاليف الإقامة أو المخيمات الصيفية التي تنظمها AOS.',
    'pf.catDesc.RENTREE_SCOLAIRE': 'مساعدة لتغطية المصاريف المدرسية واللوازم لأبنائك الدارسين.',
    'pf.catDesc.DOSSIER_MEDICAL':
      'دعم رعاية الأسنان والبصريات والأمومة أو العمليات الجراحية المعقدة.',
    'pf.catDesc.PRET_SOCIAL': 'قرض شرفي للتدفق النقدي لمواجهة الطوارئ أو الأحداث الحياتية الكبرى.',
    'pf.catDesc.PELLERINAGE': 'دعم AOS مخصص للموظفين المختارين بالقرعة لأداء فريضة الحج.',
    'pf.catDesc.SPORT_CULTURE': 'استرداد الاشتراكات السنوية في الأندية الرياضية أو الفعاليات المعتمدة.',

    'pf.catLimit.EID_AL_ADHA': 'المبلغ الجزافي: 2 000 DH',
    'pf.catLimit.ESTIVAGE': 'منحة تصل إلى: 4 000 DH',
    'pf.catLimit.RENTREE_SCOLAIRE': 'المبلغ لكل طفل: 500 DH',
    'pf.catLimit.DOSSIER_MEDICAL': 'حسب جدول التعاضد',
    'pf.catLimit.PRET_SOCIAL': 'الحد الأقصى: 20 000 DH',
    'pf.catLimit.PELLERINAGE': 'منحة جزافية: 10 000 DH',
    'pf.catLimit.SPORT_CULTURE': 'منحة تصل إلى: 1 500 DH',

    // ── PrestationRequestList (prl.) ─────────────────────────────────────────
    'prl.heading': 'السجل ومتابعة الطلبات',
    'prl.headingDesc': 'اطّلع على حالة المعالجة وإشعارات الدفع الصادرة عن اللجنة',

    'prl.filterAll': 'الكل',
    'prl.filterPending': 'قيد الانتظار',
    'prl.filterApproved': 'مقبولة',
    'prl.filterRejected': 'مرفوضة',

    'prl.statusPending': 'قيد الدراسة',
    'prl.statusApproved': 'الملف مقبول',
    'prl.statusRejected': 'الملف مرفوض',

    'prl.cat.EID_AL_ADHA': 'عيد الأضحى 🐑',
    'prl.cat.ESTIVAGE': 'الاصطياف والمخيمات 🏖️',
    'prl.cat.RENTREE_SCOLAIRE': 'الدخول المدرسي 🎒',
    'prl.cat.DOSSIER_MEDICAL': 'تكملة التعاضد 🩺',
    'prl.cat.PRET_SOCIAL': 'القرض الاجتماعي الشرفي 🏦',
    'prl.cat.PELLERINAGE': 'الحج المقدس 🕋',
    'prl.cat.SPORT_CULTURE': 'الرياضة والثقافة 🏆',

    'prl.refPrefix': 'المرجع:',
    'prl.budgetLabel': 'المبلغ:',

    'prl.emptyTitle': 'لا يوجد ملف',
    'prl.emptyDesc': 'ليس لديك أي طلب نشط أو مطابق للفلتر المحدد.',

    'prl.sidebarTitle': 'معاينة الملف',
    'prl.submittedBy': 'مقدَّم من',
    'prl.detailObject': 'موضوع مفصَّل',
    'prl.amountRequested': 'المطلوب',
    'prl.amountApproved': 'الممنوح',
    'prl.amountRejected': '0 DH (رفض)',
    'prl.amountPending': 'قيد المعالجة...',
    'prl.openFile': 'فتح',
    'prl.fileType': 'PDF',
    'prl.simulatedDownload': 'تنزيل تجريبي للوثيقة الإثباتية.',
    'prl.adminComment': 'تعليق اللجنة',
    'prl.historyTitle': 'سجل القرارات',
    'prl.histApproved': 'المصادقة النهائية من طرف AOS',
    'prl.histRejected': 'رفض الملف',
    'prl.histPending': 'إيداع الملف الأولي',
    'prl.histDatePrefix': 'بتاريخ',
    'prl.histDateSuffix': 'على الساعة 10:30',

    'prl.selectTitle': 'تفاصيل الملف',
    'prl.selectDesc':
      'يرجى تحديد طلب من القائمة على اليسار لعرض ملفه الكامل ووثائقه الإثباتية وسجله الإجرائي.',
  },

  en: {
    // ── NewPrestationForm (pf.) ──────────────────────────────────────────────
    'pf.headerTitle': 'Submit a New Benefit Request',
    'pf.headerDesc': 'Submit a social file, financial aid request, or mutual fund claim',
    'pf.espaceBadge': 'Member Area',

    'pf.inactiveTitle': 'Subscription / Membership Suspended',
    'pf.inactiveBody':
      'Your monthly contributions do not appear to be up to date (membership status: inactive). You cannot finalize your request. Please contact the AOS administration at your regional delegation headquarters to regularize your file.',

    'pf.errNotActive':
      'Your member profile is not active. Only members whose AOS contributions are up to date are allowed to submit requests.',
    'pf.errTitleDesc': 'Please fill in the title and detailed description of your request.',
    'pf.errNoFile':
      'Please attach the required supporting documents (bank details, invoices, medical certificates, pay slips, etc.) to support your request.',

    'pf.labelCategory': 'Nature of the Social Benefit',
    'pf.labelTitle': 'Request Subject',
    'pf.labelAmount': 'Estimated or Requested Amount (DH)',
    'pf.labelDescription': 'Detailed Description & Eligibility Justification',
    'pf.labelFiles': 'Mandatory Supporting Documents (Compressed File / PDF, Images)',

    'pf.placeholderTitle': 'E.g.: Optical frame reimbursement request or back-to-school allowance',
    'pf.placeholderDescription':
      'Please specify all required information (number of school-age children, exact summer trip dates, medical expense invoices, bank account details...). Your description will be carefully reviewed by the association\'s social committee.',

    'pf.dropZoneText': 'Drag and drop your file here, or',
    'pf.dropZoneBrowse': 'browse your files',
    'pf.dropZoneHint': 'Allowed files: PDF, ZIP, PNG or JPG (Max. 10 MB for supporting documents)',
    'pf.fileTypeBadge': 'PDF / Supporting Document',

    'pf.btnCancel': 'Cancel',
    'pf.btnSubmit': 'Submit my benefit request',

    'pf.successTitle': 'Request submitted successfully!',
    'pf.successBody':
      'Your social benefit request has been recorded in the AOS intranet. The Social Secretariat team will review your supporting documents within 5 to 7 business days.',
    'pf.successBack': 'Back to Dashboard',

    'pf.cat.EID_AL_ADHA': "Exceptional Eid Al-Adha Aid",
    'pf.cat.ESTIVAGE': 'Summer Holiday & Family Vacations',
    'pf.cat.RENTREE_SCOLAIRE': 'Back-to-School Subsidy',
    'pf.cat.DOSSIER_MEDICAL': 'Supplementary Mutual Fund Reimbursement',
    'pf.cat.PRET_SOCIAL': 'Interest-Free Social Loan (0%)',
    'pf.cat.PELLERINAGE': 'Hajj / Umra Pilgrimage Subsidy',
    'pf.cat.SPORT_CULTURE': 'Sports & Cultural Activities',

    'pf.catDesc.EID_AL_ADHA': 'Annual flat-rate financial assistance for the purchase of the sacrificial sheep.',
    'pf.catDesc.ESTIVAGE': 'Partial coverage of accommodation costs or summer camps organized by AOS.',
    'pf.catDesc.RENTREE_SCOLAIRE': 'Assistance for school fees and supplies for your enrolled children.',
    'pf.catDesc.DOSSIER_MEDICAL': 'Support for dental, optical, maternity or complex surgical procedures.',
    'pf.catDesc.PRET_SOCIAL': 'Honor loan for cash-flow emergencies or major life events.',
    'pf.catDesc.PELLERINAGE': 'AOS support reserved for employees selected by lottery for the pilgrimage.',
    'pf.catDesc.SPORT_CULTURE': 'Reimbursement of annual subscriptions to approved sports clubs or events.',

    'pf.catLimit.EID_AL_ADHA': 'Flat-rate amount: 2,000 DH',
    'pf.catLimit.ESTIVAGE': 'Subsidy up to: 4,000 DH',
    'pf.catLimit.RENTREE_SCOLAIRE': 'Amount per child: 500 DH',
    'pf.catLimit.DOSSIER_MEDICAL': 'According to mutual fund schedule',
    'pf.catLimit.PRET_SOCIAL': 'Maximum: 20,000 DH',
    'pf.catLimit.PELLERINAGE': 'Flat-rate subsidy: 10,000 DH',
    'pf.catLimit.SPORT_CULTURE': 'Subsidy up to: 1,500 DH',

    // ── PrestationRequestList (prl.) ─────────────────────────────────────────
    'prl.heading': 'Request History & Tracking',
    'prl.headingDesc': 'Check processing status and payment notices from the committee',

    'prl.filterAll': 'All',
    'prl.filterPending': 'Pending',
    'prl.filterApproved': 'Approved',
    'prl.filterRejected': 'Rejected',

    'prl.statusPending': 'Pending Review',
    'prl.statusApproved': 'File Approved',
    'prl.statusRejected': 'File Rejected',

    'prl.cat.EID_AL_ADHA': 'Eid Al-Adha 🐑',
    'prl.cat.ESTIVAGE': 'Summer Holiday & Camps 🏖️',
    'prl.cat.RENTREE_SCOLAIRE': 'Back to School 🎒',
    'prl.cat.DOSSIER_MEDICAL': 'Mutual Fund Top-Up 🩺',
    'prl.cat.PRET_SOCIAL': 'Social Honor Loan 🏦',
    'prl.cat.PELLERINAGE': 'Sacred Pilgrimage 🕋',
    'prl.cat.SPORT_CULTURE': 'Sports & Culture 🏆',

    'prl.refPrefix': 'Ref:',
    'prl.budgetLabel': 'Budget:',

    'prl.emptyTitle': 'No files found',
    'prl.emptyDesc': 'You have no active requests or requests matching the selected filter.',

    'prl.sidebarTitle': 'File Overview',
    'prl.submittedBy': 'Submitted by',
    'prl.detailObject': 'Detailed subject',
    'prl.amountRequested': 'Requested',
    'prl.amountApproved': 'Approved',
    'prl.amountRejected': '0 DH (Refused)',
    'prl.amountPending': 'In progress...',
    'prl.openFile': 'Open',
    'prl.fileType': 'PDF',
    'prl.simulatedDownload': 'Simulated download of the supporting document.',
    'prl.adminComment': 'Committee comment',
    'prl.historyTitle': 'Decision history',
    'prl.histApproved': 'Final validation by AOS',
    'prl.histRejected': 'File rejected',
    'prl.histPending': 'Initial file submission',
    'prl.histDatePrefix': 'On',
    'prl.histDateSuffix': 'at 10:30',

    'prl.selectTitle': 'File Details',
    'prl.selectDesc':
      'Please select a request from the list on the left to view its complete file, supporting documents and regulatory history.',
  },
};

export default fragment;
