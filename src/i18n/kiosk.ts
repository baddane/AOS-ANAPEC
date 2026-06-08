import { TranslationFragment } from './types';

const fragment: TranslationFragment = {
  fr: {
    // Category filter labels
    'kiosk.cat.all': 'Toutes les Publications',
    'kiosk.cat.tehnia': 'Félicitations & Vœux (تهنئة)',
    'kiosk.cat.solidarite': 'Rapports Solidarité (التقرير المالي)',
    'kiosk.cat.concours': 'Prix & Concours (جوائز)',
    'kiosk.cat.brochure': 'Brochures & Guides (أدلة)',

    // Banner header
    'kiosk.banner.badge': 'Espace Kiosque & Bibliothèque Officielle',
    'kiosk.banner.title': 'Publications, Rapports & Communiqués AOS',
    'kiosk.banner.desc': "Consultez les bilans comptables officiels de la Caisse de Solidarité, les lettres de félicitations royales (تهنئة), les lancements de prix de l'excellence féminine et les guides d'accompagnement de l'ANAPEC.",

    // Admin button
    'kiosk.admin.publishBtn': 'Publier un Document Officiel',

    // Add form
    'kiosk.form.title': '✍️ Publier une nouvelle affiche officielle',
    'kiosk.form.cancel': 'Annuler',
    'kiosk.form.labelTitleFr': 'Titre en Français *',
    'kiosk.form.labelTitleAr': 'العنوان باللغة العربية (Optionnel)',
    'kiosk.form.labelCategory': 'Catégorie de Publication',
    'kiosk.form.labelTheme': 'Thème de design / Couleur',
    'kiosk.form.labelSummaryFr': 'Résumé descriptif (Français) *',
    'kiosk.form.labelSummaryAr': 'الموجز والملخص بالعربية',
    'kiosk.form.labelContentFr': 'Contenu détaillé (Français)',
    'kiosk.form.labelContentAr': 'النص الكامل بالتفصيل بالعربية (مستحسن للتهنيئات)',
    'kiosk.form.save': 'Enregistrer la Publication',

    // Category select options (in add form)
    'kiosk.form.opt.tehnia': 'تهنئة - Félicitations & Vœux',
    'kiosk.form.opt.solidarite': 'التقرير المالي - Bilans & Solidarité',
    'kiosk.form.opt.concours': 'جوائز وتفوق - Prix & Concours',
    'kiosk.form.opt.brochure': 'أدلة ومطبوعات - Brochures & Guides',

    // Color/theme select options
    'kiosk.form.color.emerald': 'Vert Émeraude (تهنئة / Royal)',
    'kiosk.form.color.amber': 'Orange Ambre (التقرير المالي / Solidaire)',
    'kiosk.form.color.purple': 'Violet Royal (المسابقات والجوائز / VIP)',
    'kiosk.form.color.blue': 'Bleu National (أدلة التوجيه / Corporate)',

    // Confirm delete dialog
    'kiosk.confirm.delete': 'Êtes-vous sûr de vouloir supprimer cette publication officielle ?',

    // Admin delete badge on card
    'kiosk.card.delete': 'Supprimer 🗑️',

    // Search placeholder
    'kiosk.search.placeholder': 'Rechercher une publication ou affiche...',

    // Card metadata & actions
    'kiosk.card.publishedOn': 'Publié le',
    'kiosk.card.details': 'Détails & Consulter',

    // Financial card summary
    'kiosk.financial.receipts': 'Recettes :',
    'kiosk.financial.expenses': 'Aides Versées :',
    'kiosk.financial.balance': 'Solde Net Restant :',

    // Contest card summary
    'kiosk.contest.firstPrize': '1er Prix :',
    'kiosk.contest.deadline': 'Date limite :',

    // Empty state
    'kiosk.empty.title': 'Aucune publication trouvée',
    'kiosk.empty.desc': 'Modifiez la catégorie ou essayez une autre recherche.',

    // Modal controls
    'kiosk.modal.close': 'Fermer le Kiosque',
    'kiosk.modal.print': 'Imprimer / Exporter PDF',
    'kiosk.modal.closeBtn': 'Fermer',

    // Modal document section labels
    'kiosk.modal.sectionAr': 'البيان والمضمون الرسمي',
    'kiosk.modal.sectionFr': 'Transcription en Français',

    // Print-only document header
    'kiosk.print.docHeader': '★ Document d\'Information Sociale Officiel à l\'Intention des Adhérents ★',

    // Closing footer
    'kiosk.footer.secretariat': 'Secrétariat Général de l\'AOS',
    'kiosk.footer.signedBy': 'Signé et Validé par :',

    // Contest details section
    'kiosk.contest.prizesLabel': 'DOTATIONS & PRIX DE L\'EXCELLENCE :',
    'kiosk.contest.conditionsLabel': 'من يشارك وكيف ؟',
    'kiosk.contest.contactPrompt': 'Pour soumettre des candidatures ou demander des informations supplémentaires :',

    // translateCategory display strings
    'kiosk.catLabel.tehnia': 'تهنئة ورسائل vœux',
    'kiosk.catLabel.solidarite': 'صندوق التضامن / Rapports',
    'kiosk.catLabel.concours': 'مسابقات وجوائز / Concours',
    'kiosk.catLabel.brochure': 'أدلة التوجيه / Brochures',

    // Summary ledger totals in modal
    'kiosk.financial.totalReceipts': 'Total Recettes المداخيل',
    'kiosk.financial.totalExpenses': 'Total Dépenses المصاريف',
    'kiosk.financial.netBalance': 'الرصيد الكلي الحالي Net Balance',

    // Contest section heading in modal
    'kiosk.contest.sectionTitle': '📋 شروط وتفاصيل المشاركة في جائزة التميز السنوية',

    // Financial table headers & footers
    'kiosk.financial.auditNotice': 'صندوق التضامن الاجتماعي : تم تدقيق هذه الأرقام والمصادقة عليها بالإجماع من طرف اللجنة المالية الوطنية المكلفة بتسيير ملفات الدعم المالي والاجتماعي.',
    'kiosk.financial.receiptsSection': 'المداخيل برسم سنة',
    'kiosk.financial.receiptsTag': 'Recettes',
    'kiosk.financial.thDate': 'Date التاريخ',
    'kiosk.financial.thType': 'نوعية المداخيل Type',
    'kiosk.financial.thAmount': 'المبلغ Sum (DH)',
    'kiosk.financial.receiptsTotal': 'مجموع المداخيل Total',
    'kiosk.financial.expensesSection': 'المنح والمساعدات المصروفة (المصاريف)',
    'kiosk.financial.expensesTag': 'Dépenses',
    'kiosk.financial.thExpDate': 'التاريخ',
    'kiosk.financial.thPrestation': 'نوعية الاستفادة Prestation',
    'kiosk.financial.thBeneficiary': 'المستفيد Sum (DH)',
    'kiosk.financial.expensesTotal': 'مجموع المصاريف Total',
  },
  ar: {
    // Category filter labels
    'kiosk.cat.all': 'جميع المنشورات',
    'kiosk.cat.tehnia': 'التهانئ والتبريكات (تهنئة)',
    'kiosk.cat.solidarite': 'تقارير صندوق التضامن',
    'kiosk.cat.concours': 'الجوائز والمسابقات',
    'kiosk.cat.brochure': 'الأدلة والمطبوعات',

    // Banner header
    'kiosk.banner.badge': 'فضاء الكشك والمكتبة الرسمية',
    'kiosk.banner.title': 'المنشورات والتقارير والبلاغات الرسمية',
    'kiosk.banner.desc': 'اطلع على الحسابات الرسمية لصندوق التضامن، ورسائل التهاني الملكية، وإطلاق جائزة التميز النسوي، والأدلة الإرشادية للوكالة.',

    // Admin button
    'kiosk.admin.publishBtn': 'نشر وثيقة رسمية',

    // Add form
    'kiosk.form.title': '✍️ نشر إعلان رسمي جديد',
    'kiosk.form.cancel': 'إلغاء',
    'kiosk.form.labelTitleFr': 'العنوان بالفرنسية *',
    'kiosk.form.labelTitleAr': 'العنوان باللغة العربية (اختياري)',
    'kiosk.form.labelCategory': 'تصنيف المنشور',
    'kiosk.form.labelTheme': 'اللون والتصميم',
    'kiosk.form.labelSummaryFr': 'الملخص بالفرنسية *',
    'kiosk.form.labelSummaryAr': 'الموجز والملخص بالعربية',
    'kiosk.form.labelContentFr': 'المحتوى التفصيلي بالفرنسية',
    'kiosk.form.labelContentAr': 'النص الكامل بالتفصيل بالعربية (مستحسن للتهنئات)',
    'kiosk.form.save': 'حفظ المنشور',

    // Category select options
    'kiosk.form.opt.tehnia': 'تهنئة - Félicitations & Vœux',
    'kiosk.form.opt.solidarite': 'التقرير المالي - Bilans & Solidarité',
    'kiosk.form.opt.concours': 'جوائز وتفوق - Prix & Concours',
    'kiosk.form.opt.brochure': 'أدلة ومطبوعات - Brochures & Guides',

    // Color/theme select options
    'kiosk.form.color.emerald': 'أخضر زمردي (تهنئة / ملكي)',
    'kiosk.form.color.amber': 'برتقالي كهرماني (التقرير المالي / تضامني)',
    'kiosk.form.color.purple': 'بنفسجي ملكي (المسابقات والجوائز / كبار الشخصيات)',
    'kiosk.form.color.blue': 'أزرق وطني (أدلة التوجيه / مؤسسي)',

    // Confirm delete dialog
    'kiosk.confirm.delete': 'هل أنت متأكد من حذف هذا المنشور الرسمي؟',

    // Admin delete badge on card
    'kiosk.card.delete': 'حذف 🗑️',

    // Search placeholder
    'kiosk.search.placeholder': 'البحث عن منشور أو إعلان...',

    // Card metadata & actions
    'kiosk.card.publishedOn': 'نُشر في',
    'kiosk.card.details': 'التفاصيل والاطلاع',

    // Financial card summary
    'kiosk.financial.receipts': 'المداخيل:',
    'kiosk.financial.expenses': 'المساعدات المصروفة:',
    'kiosk.financial.balance': 'الرصيد الصافي المتبقي:',

    // Contest card summary
    'kiosk.contest.firstPrize': 'الجائزة الأولى:',
    'kiosk.contest.deadline': 'آخر أجل:',

    // Empty state
    'kiosk.empty.title': 'لم يُعثر على أي منشور',
    'kiosk.empty.desc': 'غيّر التصنيف أو جرّب بحثاً آخر.',

    // Modal controls
    'kiosk.modal.close': 'إغلاق الكشك',
    'kiosk.modal.print': 'طباعة / تصدير PDF',
    'kiosk.modal.closeBtn': 'إغلاق',

    // Modal document section labels
    'kiosk.modal.sectionAr': 'البيان والمضمون الرسمي',
    'kiosk.modal.sectionFr': 'الترجمة بالفرنسية',

    // Print-only document header
    'kiosk.print.docHeader': '★ وثيقة إعلام اجتماعي رسمية موجهة للمنخرطين ★',

    // Closing footer
    'kiosk.footer.secretariat': 'الأمانة العامة لـ AOS',
    'kiosk.footer.signedBy': 'موقّع ومصادق عليه من طرف:',

    // Contest details section
    'kiosk.contest.prizesLabel': 'الدوتاسيون والجوائز:',
    'kiosk.contest.conditionsLabel': 'من يشارك وكيف ؟',
    'kiosk.contest.contactPrompt': 'لتقديم الترشيحات أو طلب معلومات إضافية:',

    // translateCategory display strings
    'kiosk.catLabel.tehnia': 'تهنئة ورسائل vœux',
    'kiosk.catLabel.solidarite': 'صندوق التضامن / Rapports',
    'kiosk.catLabel.concours': 'مسابقات وجوائز / Concours',
    'kiosk.catLabel.brochure': 'أدلة التوجيه / Brochures',

    // Summary ledger totals in modal
    'kiosk.financial.totalReceipts': 'إجمالي المداخيل',
    'kiosk.financial.totalExpenses': 'إجمالي المصاريف',
    'kiosk.financial.netBalance': 'الرصيد الكلي الصافي',

    // Contest section heading in modal
    'kiosk.contest.sectionTitle': '📋 شروط وتفاصيل المشاركة في جائزة التميز السنوية',

    // Financial table headers & footers
    'kiosk.financial.auditNotice': 'صندوق التضامن الاجتماعي : تم تدقيق هذه الأرقام والمصادقة عليها بالإجماع من طرف اللجنة المالية الوطنية المكلفة بتسيير ملفات الدعم المالي والاجتماعي.',
    'kiosk.financial.receiptsSection': 'المداخيل برسم سنة',
    'kiosk.financial.receiptsTag': 'مداخيل',
    'kiosk.financial.thDate': 'التاريخ',
    'kiosk.financial.thType': 'نوع المداخيل',
    'kiosk.financial.thAmount': 'المبلغ (درهم)',
    'kiosk.financial.receiptsTotal': 'مجموع المداخيل',
    'kiosk.financial.expensesSection': 'المنح والمساعدات المصروفة (المصاريف)',
    'kiosk.financial.expensesTag': 'مصاريف',
    'kiosk.financial.thExpDate': 'التاريخ',
    'kiosk.financial.thPrestation': 'نوع الاستفادة',
    'kiosk.financial.thBeneficiary': 'المبلغ (درهم)',
    'kiosk.financial.expensesTotal': 'مجموع المصاريف',
  },
  en: {
    // Category filter labels
    'kiosk.cat.all': 'All Publications',
    'kiosk.cat.tehnia': 'Congratulations & Greetings',
    'kiosk.cat.solidarite': 'Solidarity Fund Reports',
    'kiosk.cat.concours': 'Awards & Competitions',
    'kiosk.cat.brochure': 'Brochures & Guides',

    // Banner header
    'kiosk.banner.badge': 'Kiosk & Official Library',
    'kiosk.banner.title': 'AOS Publications, Reports & Communiqués',
    'kiosk.banner.desc': 'Browse official financial statements of the Solidarity Fund, royal congratulatory letters, women\'s excellence prize launches and ANAPEC guidance booklets.',

    // Admin button
    'kiosk.admin.publishBtn': 'Publish an Official Document',

    // Add form
    'kiosk.form.title': '✍️ Publish a new official notice',
    'kiosk.form.cancel': 'Cancel',
    'kiosk.form.labelTitleFr': 'Title in French *',
    'kiosk.form.labelTitleAr': 'Title in Arabic (Optional)',
    'kiosk.form.labelCategory': 'Publication Category',
    'kiosk.form.labelTheme': 'Design Theme / Colour',
    'kiosk.form.labelSummaryFr': 'Descriptive Summary (French) *',
    'kiosk.form.labelSummaryAr': 'Summary in Arabic',
    'kiosk.form.labelContentFr': 'Detailed Content (French)',
    'kiosk.form.labelContentAr': 'Full Content in Arabic (recommended for congratulations)',
    'kiosk.form.save': 'Save Publication',

    // Category select options
    'kiosk.form.opt.tehnia': 'تهنئة - Félicitations & Vœux',
    'kiosk.form.opt.solidarite': 'التقرير المالي - Bilans & Solidarité',
    'kiosk.form.opt.concours': 'جوائز وتفوق - Prix & Concours',
    'kiosk.form.opt.brochure': 'أدلة ومطبوعات - Brochures & Guides',

    // Color/theme select options
    'kiosk.form.color.emerald': 'Emerald Green (Congratulations / Royal)',
    'kiosk.form.color.amber': 'Amber Orange (Financial Report / Solidarity)',
    'kiosk.form.color.purple': 'Royal Purple (Competitions & Awards / VIP)',
    'kiosk.form.color.blue': 'National Blue (Guidance Booklets / Corporate)',

    // Confirm delete dialog
    'kiosk.confirm.delete': 'Are you sure you want to delete this official publication?',

    // Admin delete badge on card
    'kiosk.card.delete': 'Delete 🗑️',

    // Search placeholder
    'kiosk.search.placeholder': 'Search for a publication or notice...',

    // Card metadata & actions
    'kiosk.card.publishedOn': 'Published on',
    'kiosk.card.details': 'Details & View',

    // Financial card summary
    'kiosk.financial.receipts': 'Receipts:',
    'kiosk.financial.expenses': 'Aid Disbursed:',
    'kiosk.financial.balance': 'Net Remaining Balance:',

    // Contest card summary
    'kiosk.contest.firstPrize': '1st Prize:',
    'kiosk.contest.deadline': 'Deadline:',

    // Empty state
    'kiosk.empty.title': 'No publications found',
    'kiosk.empty.desc': 'Adjust the category filter or try a different search.',

    // Modal controls
    'kiosk.modal.close': 'Close Kiosk',
    'kiosk.modal.print': 'Print / Export PDF',
    'kiosk.modal.closeBtn': 'Close',

    // Modal document section labels
    'kiosk.modal.sectionAr': 'البيان والمضمون الرسمي',
    'kiosk.modal.sectionFr': 'French Transcription',

    // Print-only document header
    'kiosk.print.docHeader': '★ Official Social Information Document for Members ★',

    // Closing footer
    'kiosk.footer.secretariat': 'AOS Secretary General',
    'kiosk.footer.signedBy': 'Signed and Validated by:',

    // Contest details section
    'kiosk.contest.prizesLabel': 'EXCELLENCE AWARDS & PRIZES:',
    'kiosk.contest.conditionsLabel': 'Who can participate and how?',
    'kiosk.contest.contactPrompt': 'To submit applications or request further information:',

    // translateCategory display strings
    'kiosk.catLabel.tehnia': 'تهنئة ورسائل vœux',
    'kiosk.catLabel.solidarite': 'صندوق التضامن / Rapports',
    'kiosk.catLabel.concours': 'مسابقات وجوائز / Concours',
    'kiosk.catLabel.brochure': 'أدلة التوجيه / Brochures',

    // Summary ledger totals in modal
    'kiosk.financial.totalReceipts': 'Total Receipts',
    'kiosk.financial.totalExpenses': 'Total Expenses',
    'kiosk.financial.netBalance': 'Current Net Balance',

    // Contest section heading in modal
    'kiosk.contest.sectionTitle': '📋 Contest Conditions & Participation Details',

    // Financial table headers & footers
    'kiosk.financial.auditNotice': 'Solidarity Fund: These figures have been audited and unanimously approved by the National Finance Committee responsible for managing financial and social support cases.',
    'kiosk.financial.receiptsSection': 'Receipts for year',
    'kiosk.financial.receiptsTag': 'Receipts',
    'kiosk.financial.thDate': 'Date',
    'kiosk.financial.thType': 'Receipt Type',
    'kiosk.financial.thAmount': 'Amount (DH)',
    'kiosk.financial.receiptsTotal': 'Total Receipts',
    'kiosk.financial.expensesSection': 'Grants & Aid Disbursed (Expenses)',
    'kiosk.financial.expensesTag': 'Expenses',
    'kiosk.financial.thExpDate': 'Date',
    'kiosk.financial.thPrestation': 'Benefit Type',
    'kiosk.financial.thBeneficiary': 'Amount (DH)',
    'kiosk.financial.expensesTotal': 'Total Expenses',
  },
};

export default fragment;
