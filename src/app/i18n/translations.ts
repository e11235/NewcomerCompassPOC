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
    formLabel: string;
    age: string;
    maritalStatus: string;
    maritalPlaceholder: string;
    children: string;
    group: string;
    groupPlaceholder: string;
    years: string;
    submit: string;
  };
  maritalStatuses: Record<MaritalStatus, string>;
  groups: Record<NewcomerGroup, string>;
  results: {
    editAnswers: string;
    heading: string;
    qualifyHeading: string;
    accessHeading: string;
    benefitDetails: (benefitName: string) => string;
  };
  benefits: Record<BenefitId, string>;
  chat: {
    heading: string;
    regionLabel: string;
    greeting: string;
    inputLabel: string;
    placeholder: string;
    submit: string;
  };
}

const en: Translations = {
  brand: 'Newcomer Compass',
  pageTitles: { questionnaire: 'Tell me about yourself', results: 'Your results' },
  language: { button: 'Language', ariaLabel: 'Change language' },
  questionnaire: {
    title: 'Tell me about yourself',
    lead: 'Answer a few quick questions and we’ll show the benefits you may qualify for.',
    formLabel: 'About you',
    age: 'Age',
    maritalStatus: 'Marital status',
    maritalPlaceholder: 'Select',
    children: 'Number of children',
    group: 'Which group do you belong to?',
    groupPlaceholder: 'Select your group',
    years: 'How many years have you been in Canada?',
    submit: 'Submit',
  },
  maritalStatuses: { married: 'Married', single: 'Single' },
  groups: {
    permanentResidents: 'Permanent residents',
    resettledRefugees: 'Resettled refugees and protected persons',
    asylumClaimants: 'Asylum claimants',
    workPermit: 'Temporary residents on work permit',
    studyPermit: 'Temporary residents on study permit',
  },
  results: {
    editAnswers: 'Edit my answers',
    heading: 'Results',
    qualifyHeading: 'List of benefits you qualify for',
    accessHeading: 'How to access these benefits',
    benefitDetails: (name) => `Details about how to apply for the ${name} will appear here.`,
  },
  benefits: {
    sin: 'Social Insurance Number',
    childBenefit: 'Canada Child Benefit',
    groceriesBenefit: 'Canada Groceries and Essentials Benefit',
    workersBenefit: 'Canada Workers Benefit',
    dentalCare: 'Canadian Dental Care Plan',
    learningBond: 'Canada Learning Bond',
  },
  chat: {
    heading: 'Questions?',
    regionLabel: 'Chat',
    greeting:
      'Hi! I can help you understand which benefits may apply to you. What would you like to know?',
    inputLabel: 'Type your question',
    placeholder: 'Ask a question…',
    submit: 'Submit question',
  },
};

// French typography puts a non-breaking space before ? and :.
const fr: Translations = {
  brand: 'Newcomer Compass',
  pageTitles: { questionnaire: 'Parlez-moi de vous', results: 'Vos résultats' },
  language: { button: 'Langue', ariaLabel: 'Changer de langue' },
  questionnaire: {
    title: 'Parlez-moi de vous',
    lead: 'Répondez à quelques questions rapides et nous vous montrerons les prestations auxquelles vous pourriez avoir droit.',
    formLabel: 'À propos de vous',
    age: 'Âge',
    maritalStatus: 'État civil',
    maritalPlaceholder: 'Sélectionner',
    children: 'Nombre d’enfants',
    group: 'À quel groupe appartenez-vous ?',
    groupPlaceholder: 'Sélectionnez votre groupe',
    years: 'Depuis combien d’années êtes-vous au Canada ?',
    submit: 'Soumettre',
  },
  maritalStatuses: { married: 'Marié(e)', single: 'Célibataire' },
  groups: {
    permanentResidents: 'Résidents permanents',
    resettledRefugees: 'Réfugiés réinstallés et personnes protégées',
    asylumClaimants: 'Demandeurs d’asile',
    workPermit: 'Résidents temporaires titulaires d’un permis de travail',
    studyPermit: 'Résidents temporaires titulaires d’un permis d’études',
  },
  results: {
    editAnswers: 'Modifier mes réponses',
    heading: 'Résultats',
    qualifyHeading: 'Liste des prestations auxquelles vous avez droit',
    accessHeading: 'Comment accéder à ces prestations',
    benefitDetails: (name) =>
      `Les renseignements sur la façon de présenter une demande (${name}) s’afficheront ici.`,
  },
  benefits: {
    sin: 'Numéro d’assurance sociale',
    childBenefit: 'Allocation canadienne pour enfants',
    groceriesBenefit: 'Prestation canadienne pour l’épicerie et les produits essentiels',
    workersBenefit: 'Allocation canadienne pour les travailleurs',
    dentalCare: 'Régime canadien de soins dentaires',
    learningBond: 'Bon d’études canadien',
  },
  chat: {
    heading: 'Des questions ?',
    regionLabel: 'Clavardage',
    greeting:
      'Bonjour ! Je peux vous aider à comprendre quelles prestations pourraient s’appliquer à vous. Que voulez-vous savoir ?',
    inputLabel: 'Tapez votre question',
    placeholder: 'Posez une question…',
    submit: 'Envoyer la question',
  },
};

const ar: Translations = {
  brand: 'Newcomer Compass',
  pageTitles: { questionnaire: 'أخبرنا عن نفسك', results: 'نتائجك' },
  language: { button: 'اللغة', ariaLabel: 'تغيير اللغة' },
  questionnaire: {
    title: 'أخبرنا عن نفسك',
    lead: 'أجب عن بعض الأسئلة السريعة وسنعرض لك المزايا التي قد تكون مؤهلاً لها.',
    formLabel: 'معلومات عنك',
    age: 'العمر',
    maritalStatus: 'الحالة الاجتماعية',
    maritalPlaceholder: 'اختر',
    children: 'عدد الأطفال',
    group: 'إلى أي فئة تنتمي؟',
    groupPlaceholder: 'اختر فئتك',
    years: 'منذ كم سنة تقيم في كندا؟',
    submit: 'إرسال',
  },
  maritalStatuses: { married: 'متزوج/ة', single: 'أعزب/عزباء' },
  groups: {
    permanentResidents: 'المقيمون الدائمون',
    resettledRefugees: 'اللاجئون المُعاد توطينهم والأشخاص المحميون',
    asylumClaimants: 'طالبو اللجوء',
    workPermit: 'المقيمون المؤقتون بتصريح عمل',
    studyPermit: 'المقيمون المؤقتون بتصريح دراسة',
  },
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
  chat: {
    heading: 'هل لديك أسئلة؟',
    regionLabel: 'المحادثة',
    greeting: 'مرحبًا! يمكنني مساعدتك في فهم المزايا التي قد تنطبق عليك. ماذا تود أن تعرف؟',
    inputLabel: 'اكتب سؤالك',
    placeholder: 'اطرح سؤالاً…',
    submit: 'إرسال السؤال',
  },
};

export const TRANSLATIONS: Record<LanguageCode, Translations> = { en, fr, ar };
