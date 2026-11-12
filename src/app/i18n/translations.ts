import type { BenefitId, MaritalStatus, NewcomerGroup } from '../state/profile-store';

export type LanguageCode = 'en' | 'fr' | 'ar';

/** Languages offered in the switcher, each labelled in its own language. */
export const LANGUAGES: readonly { code: LanguageCode; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

export type PageKey = 'questionnaire' | 'results';

/** Every user-facing string in the app. English defines the shape; the other languages must match it. */
export interface Translations {
  brand: string;
  pageTitles: Record<PageKey, string>;
  language: { button: string; ariaLabel: string };
  questionnaire: {
    title: string;
    lead: string;
    situationsLabel: string;
    comingSoon: string;
    change: string;
    changeLabel: string;
    stepProgress: (step: number, total: number) => string;
    back: string;
    continue: string;
    continueHint: string;
    optional: string;
    choose: string;
    postalTrimmed: string;
    summaryHeading: string;
    showAll: (hiddenCount: number) => string;
    showFewer: string;
    changeAnswer: string;
    changeStep: (stepTitle: string) => string;
    notAnswered: string;
    reviewHeading: string;
    reviewLead: string;
    submit: string;
    formLabel: string;
    age: string;
    maritalStatus: string;
    maritalPlaceholder: string;
    children: string;
    group: string;
    groupPlaceholder: string;
    years: string;
  };
  maritalStatuses: Record<MaritalStatus, string>;
  groups: Record<NewcomerGroup, string>;
  /** Short plain-language explanation shown under each group in the dropdown (null = none yet). */
  groupHints: Record<NewcomerGroup, string> | null;
  results: {
    editAnswers: string;
    heading: string;
    qualifyHeading: string;
    accessHeading: string;
    benefitDetails: (benefitName: string) => string;
  };
  /** Official program names: keep these exact so people can find the program. */
  benefits: Record<BenefitId, string>;
  /** One plain-language line explaining each benefit. */
  benefitDescriptions: Record<BenefitId, string>;
  header: { signatureAlt: string };
  footer: {
    wordmarkAlt: string;
    dateModified: string;
    linksLabel: string;
    links: {
      socialMedia: string;
      mobileApps: string;
      aboutSite: string;
      terms: string;
      privacy: string;
    };
  };
  chat: {
    heading: string;
    regionLabel: string;
    greeting: string;
    inputLabel: string;
    placeholder: string;
    submit: string;
    open: string;
    hide: string;
    hideLabel: string;
  };
}

const en: Translations = {
  brand: 'Newcomer Compass',
  pageTitles: { questionnaire: 'Tell me about yourself', results: 'Your results' },
  language: { button: 'Language', ariaLabel: 'Change language' },
  questionnaire: {
    title: 'Tell me about yourself',
    lead: 'Answer a few short questions. Then we’ll show you the government benefits you may be able to get.',
    situationsLabel: 'Situations',
    comingSoon: 'Coming soon. Only the first option is available in this prototype.',
    change: 'Change',
    changeLabel: 'Change your situation',
    stepProgress: (step, total) => `Step ${step} of ${total}`,
    back: 'Back',
    continue: 'Continue',
    continueHint: 'Answer the questions on this step to continue.',
    optional: '(optional)',
    choose: 'Choose…',
    postalTrimmed: 'We kept only the first three characters of your postal code.',
    summaryHeading: 'Your answers',
    showAll: (n) => `Show all answers (${n} more)`,
    showFewer: 'Show fewer answers',
    changeAnswer: 'change',
    changeStep: (title) => `Change answers for: ${title}`,
    notAnswered: 'Not answered',
    reviewHeading: 'Check your answers',
    reviewLead: 'You can change any answer before you see your benefits.',
    submit: 'Show my benefits',
    formLabel: 'About you',
    age: 'Age',
    maritalStatus: 'Married or single?',
    maritalPlaceholder: 'Choose',
    children: 'Number of children',
    group: 'Which group do you belong to?',
    groupPlaceholder: 'Choose your group',
    years: 'How many years have you been in Canada?',
  },
  maritalStatuses: { married: 'Married', single: 'Single' },
  groups: {
    permanentResidents: 'Permanent resident',
    resettledRefugees: 'Refugee or protected person',
    asylumClaimants: 'Asylum claimant',
    workPermit: 'Temporary worker',
    studyPermit: 'International student',
  },
  groupHints: {
    permanentResidents: 'You can live and work in Canada with no end date.',
    resettledRefugees: 'Canada has accepted you as a refugee.',
    asylumClaimants: 'You asked Canada for refugee protection and are waiting for an answer.',
    workPermit: 'You have a work permit.',
    studyPermit: 'You have a study permit.',
  },
  results: {
    editAnswers: 'Change my answers',
    heading: 'Your results',
    qualifyHeading: 'Benefits you can get',
    accessHeading: 'How to get these benefits',
    benefitDetails: (name) => `We will show the steps to apply for the ${name} here.`,
  },
  benefits: {
    sin: 'Social Insurance Number',
    childBenefit: 'Canada Child Benefit',
    groceriesBenefit: 'Canada Groceries and Essentials Benefit',
    workersBenefit: 'Canada Workers Benefit',
    dentalCare: 'Canadian Dental Care Plan',
    learningBond: 'Canada Learning Bond',
  },
  benefitDescriptions: {
    sin: 'A 9-digit number you need to work in Canada and to get government benefits.',
    childBenefit: 'Money every month to help families pay for raising children under 18.',
    groceriesBenefit: 'Money to help people with lower incomes pay for food and other basic needs.',
    workersBenefit: 'Money for people who work but earn a low income.',
    dentalCare: 'Helps pay for visits to the dentist if you don’t have dental insurance.',
    learningBond:
      'Money from the government to help families with lower incomes save for their child’s education after high school.',
  },
  header: { signatureAlt: 'Government of Canada' },
  footer: {
    wordmarkAlt: 'Symbol of the Government of Canada',
    dateModified: 'Date modified:',
    linksLabel: 'About this site',
    links: {
      socialMedia: 'Social media',
      mobileApps: 'Mobile applications',
      aboutSite: 'About Canada.ca',
      terms: 'Terms and conditions',
      privacy: 'Privacy',
    },
  },
  chat: {
    heading: 'Questions?',
    regionLabel: 'Chat',
    greeting: 'Hi! I can help you find out which benefits you can get. What would you like to know?',
    inputLabel: 'Type your question',
    placeholder: 'Ask a question…',
    submit: 'Send question',
    open: 'Open chat',
    hide: 'Hide',
    hideLabel: 'Hide chat',
  },
};

// French typography puts a non-breaking space before ? and :.
const fr: Translations = {
  brand: 'Newcomer Compass',
  pageTitles: { questionnaire: 'Parlez-moi de vous', results: 'Vos résultats' },
  language: { button: 'Langue', ariaLabel: 'Changer de langue' },
  questionnaire: {
    title: 'Parlez-moi de vous',
    lead: 'Répondez à quelques questions courtes. Ensuite, nous vous montrerons les prestations du gouvernement que vous pourriez recevoir.',
    situationsLabel: 'Situations',
    comingSoon: 'Bientôt offert. Seule la première option est disponible dans ce prototype.',
    change: 'Modifier',
    changeLabel: 'Modifier votre situation',
    stepProgress: (step, total) => `Étape ${step} de ${total}`,
    back: 'Retour',
    continue: 'Continuer',
    continueHint: 'Répondez aux questions de cette étape pour continuer.',
    optional: '(facultatif)',
    choose: 'Choisir…',
    postalTrimmed: 'Nous avons gardé seulement les trois premiers caractères de votre code postal.',
    summaryHeading: 'Vos réponses',
    showAll: (n) => `Afficher toutes les réponses (${n} de plus)`,
    showFewer: 'Afficher moins de réponses',
    changeAnswer: 'modifier',
    changeStep: (title) => `Modifier les réponses : ${title}`,
    notAnswered: 'Sans réponse',
    reviewHeading: 'Vérifiez vos réponses',
    reviewLead: 'Vous pouvez modifier vos réponses avant de voir vos prestations.',
    submit: 'Voir mes prestations',
    formLabel: 'À propos de vous',
    age: 'Âge',
    maritalStatus: 'Marié(e) ou célibataire ?',
    maritalPlaceholder: 'Choisir',
    children: 'Nombre d’enfants',
    group: 'À quel groupe appartenez-vous ?',
    groupPlaceholder: 'Choisissez votre groupe',
    years: 'Depuis combien d’années êtes-vous au Canada ?',
  },
  maritalStatuses: { married: 'Marié(e)', single: 'Célibataire' },
  groups: {
    permanentResidents: 'Résident(e) permanent(e)',
    resettledRefugees: 'Réfugié(e) ou personne protégée',
    asylumClaimants: 'Demandeur ou demandeuse d’asile',
    workPermit: 'Travailleur ou travailleuse temporaire',
    studyPermit: 'Étudiant(e) étranger(ère)',
  },
  groupHints: {
    permanentResidents: 'Vous pouvez vivre et travailler au Canada sans date de fin.',
    resettledRefugees: 'Le Canada vous a accepté(e) comme réfugié(e).',
    asylumClaimants: 'Vous avez demandé la protection du Canada et vous attendez une réponse.',
    workPermit: 'Vous avez un permis de travail.',
    studyPermit: 'Vous avez un permis d’études.',
  },
  results: {
    editAnswers: 'Changer mes réponses',
    heading: 'Vos résultats',
    qualifyHeading: 'Les prestations que vous pouvez recevoir',
    accessHeading: 'Comment obtenir ces prestations',
    benefitDetails: (name) => `Nous allons montrer ici les étapes pour demander : ${name}.`,
  },
  benefits: {
    sin: 'Numéro d’assurance sociale',
    childBenefit: 'Allocation canadienne pour enfants',
    groceriesBenefit: 'Prestation canadienne pour l’épicerie et les produits essentiels',
    workersBenefit: 'Allocation canadienne pour les travailleurs',
    dentalCare: 'Régime canadien de soins dentaires',
    learningBond: 'Bon d’études canadien',
  },
  benefitDescriptions: {
    sin: 'Un numéro à 9 chiffres dont vous avez besoin pour travailler au Canada et recevoir des prestations du gouvernement.',
    childBenefit: 'De l’argent chaque mois pour aider les familles à élever leurs enfants de moins de 18 ans.',
    groceriesBenefit:
      'De l’argent pour aider les personnes à faible revenu à payer la nourriture et d’autres besoins de base.',
    workersBenefit: 'De l’argent pour les personnes qui travaillent, mais qui ont un faible revenu.',
    dentalCare: 'Aide à payer les visites chez le dentiste si vous n’avez pas d’assurance dentaire.',
    learningBond:
      'De l’argent du gouvernement pour aider les familles à faible revenu à épargner pour les études de leur enfant après le secondaire.',
  },
  header: { signatureAlt: 'Gouvernement du Canada' },
  footer: {
    wordmarkAlt: 'Symbole du gouvernement du Canada',
    dateModified: 'Date de modification :',
    linksLabel: 'À propos de ce site',
    links: {
      socialMedia: 'Médias sociaux',
      mobileApps: 'Applications mobiles',
      aboutSite: 'À propos de Canada.ca',
      terms: 'Avis',
      privacy: 'Confidentialité',
    },
  },
  chat: {
    heading: 'Des questions ?',
    regionLabel: 'Clavardage',
    greeting:
      'Bonjour ! Je peux vous aider à trouver les prestations que vous pouvez recevoir. Quelle est votre question ?',
    inputLabel: 'Écrivez votre question',
    placeholder: 'Posez une question…',
    submit: 'Envoyer la question',
    open: 'Ouvrir le clavardage',
    hide: 'Masquer',
    hideLabel: 'Masquer le clavardage',
  },
};

const ar: Translations = {
  brand: 'Newcomer Compass',
  pageTitles: { questionnaire: 'أخبرنا عن نفسك', results: 'نتائجك' },
  language: { button: 'اللغة', ariaLabel: 'تغيير اللغة' },
  questionnaire: {
    title: 'أخبرنا عن نفسك',
    lead: 'أجب عن بعض الأسئلة السريعة وسنعرض لك المزايا التي قد تكون مؤهلاً لها.',
    situationsLabel: 'الحالات',
    comingSoon: 'قريبًا. الخيار الأول فقط متاح في هذا النموذج الأولي.',
    change: 'تغيير',
    changeLabel: 'تغيير حالتك',
    stepProgress: (step, total) => `الخطوة ${step} من ${total}`,
    back: 'رجوع',
    continue: 'متابعة',
    continueHint: 'أجب عن أسئلة هذه الخطوة للمتابعة.',
    optional: '(اختياري)',
    choose: 'اختر…',
    postalTrimmed: 'احتفظنا فقط بأول ثلاثة أحرف من رمزك البريدي.',
    summaryHeading: 'إجاباتك',
    showAll: (n) => `عرض كل الإجابات (${n} أخرى)`,
    showFewer: 'عرض إجابات أقل',
    changeAnswer: 'تغيير',
    changeStep: (title) => `تغيير الإجابات: ${title}`,
    notAnswered: 'بدون إجابة',
    reviewHeading: 'راجع إجاباتك',
    reviewLead: 'يمكنك تغيير أي إجابة قبل أن ترى المزايا.',
    submit: 'إرسال',
    formLabel: 'معلومات عنك',
    age: 'العمر',
    maritalStatus: 'الحالة الاجتماعية',
    maritalPlaceholder: 'اختر',
    children: 'عدد الأطفال',
    group: 'إلى أي فئة تنتمي؟',
    groupPlaceholder: 'اختر فئتك',
    years: 'منذ كم سنة تقيم في كندا؟',
  },
  maritalStatuses: { married: 'متزوج/ة', single: 'أعزب/عزباء' },
  groups: {
    permanentResidents: 'المقيمون الدائمون',
    resettledRefugees: 'اللاجئون المُعاد توطينهم والأشخاص المحميون',
    asylumClaimants: 'طالبو اللجوء',
    workPermit: 'المقيمون المؤقتون بتصريح عمل',
    studyPermit: 'المقيمون المؤقتون بتصريح دراسة',
  },
  groupHints: null,
  results: {
    editAnswers: 'تعديل إجاباتي',
    heading: 'النتائج',
    qualifyHeading: 'قائمة المزايا التي أنت مؤهل لها',
    accessHeading: 'كيفية الحصول على هذه المزايا',
    benefitDetails: (name) => `ستظهر هنا تفاصيل حول كيفية التقديم على ${name}.`,
  },
  benefits: {
    sin: 'رقم التأمين الاجتماعي',
    childBenefit: 'إعانة الطفل الكندية',
    groceriesBenefit: 'إعانة كندا للبقالة والضروريات',
    workersBenefit: 'إعانة العمال الكندية',
    dentalCare: 'خطة كندا لرعاية الأسنان',
    learningBond: 'سند التعلّم الكندي',
  },
  benefitDescriptions: {
    sin: 'رقم من 9 أرقام تحتاجه للعمل في كندا وللحصول على المزايا الحكومية.',
    childBenefit: 'مبلغ شهري لمساعدة العائلات على تربية أطفالها دون سن 18 عامًا.',
    groceriesBenefit: 'أموال لمساعدة ذوي الدخل المنخفض على دفع ثمن الطعام والاحتياجات الأساسية الأخرى.',
    workersBenefit: 'أموال للأشخاص الذين يعملون ولكن دخلهم منخفض.',
    dentalCare: 'تساعد في دفع تكاليف زيارة طبيب الأسنان إذا لم يكن لديك تأمين على الأسنان.',
    learningBond: 'أموال من الحكومة لمساعدة العائلات ذات الدخل المنخفض على الادخار لتعليم أطفالها بعد المرحلة الثانوية.',
  },
  header: { signatureAlt: 'حكومة كندا' },
  footer: {
    wordmarkAlt: 'رمز حكومة كندا',
    dateModified: 'تاريخ التعديل:',
    linksLabel: 'حول هذا الموقع',
    links: {
      socialMedia: 'وسائل التواصل الاجتماعي',
      mobileApps: 'تطبيقات الهاتف المحمول',
      aboutSite: 'حول Canada.ca',
      terms: 'الشروط والأحكام',
      privacy: 'الخصوصية',
    },
  },
  chat: {
    heading: 'هل لديك أسئلة؟',
    regionLabel: 'المحادثة',
    greeting: 'مرحبًا! يمكنني مساعدتك في فهم المزايا التي قد تنطبق عليك. ماذا تود أن تعرف؟',
    inputLabel: 'اكتب سؤالك',
    placeholder: 'اطرح سؤالاً…',
    submit: 'إرسال السؤال',
    open: 'فتح المحادثة',
    hide: 'إخفاء',
    hideLabel: 'إخفاء المحادثة',
  },
};

export const TRANSLATIONS: Record<LanguageCode, Translations> = { en, fr, ar };
