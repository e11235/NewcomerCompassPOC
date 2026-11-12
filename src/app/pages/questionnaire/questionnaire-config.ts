/**
 * Content for the guided questionnaire on the first page: the situations people
 * can pick from, and the three parts of dropdown questions that follow.
 *
 * Edit wording here. Every piece of text has an English (en), French (fr) and
 * Arabic (ar) version. Option `value`s are stored in the answers, so keep them
 * stable when changing a label.
 *
 * All questions are required unless they have `optional: true`.
 */
import type { LanguageCode } from '../../i18n/translations';

/** Text in each of the app's languages. */
export type Text = Record<LanguageCode, string>;

// ---------------------------------------------------------------------------
// Situations (first screen)
// ---------------------------------------------------------------------------

export type SituationId =
  | 'lostIncome'
  | 'basicExpenses'
  | 'children'
  | 'recentlyArrived'
  | 'findingWork'
  | 'health'
  | 'housing'
  | 'notSure';

export interface Situation {
  id: SituationId;
  title: Text;
  description: Text;
  /** Material Symbols icon name shown on the tile. */
  icon: string;
  /** Only available situations lead to the questions; the rest show a "coming soon" note. */
  available: boolean;
}

export const SITUATIONS: readonly Situation[] = [
  {
    id: 'lostIncome',
    icon: 'work_off',
    available: true,
    title: {
      en: 'I lost my job or my income changed',
      fr: 'J’ai perdu mon emploi ou mon revenu a changé',
      ar: 'فقدت عملي أو تغيّر دخلي',
    },
    description: {
      en: 'Income, work and the first steps that unlock other supports.',
      fr: 'Revenu, travail et les premières étapes qui donnent accès à d’autres aides.',
      ar: 'الدخل والعمل والخطوات الأولى التي تفتح لك أبواب أنواع الدعم الأخرى.',
    },
  },
  {
    id: 'basicExpenses',
    icon: 'shopping_cart',
    available: false,
    title: {
      en: 'I need help with basic expenses',
      fr: 'J’ai besoin d’aide pour les dépenses de base',
      ar: 'أحتاج إلى مساعدة في النفقات الأساسية',
    },
    description: {
      en: 'Food, rent and urgent costs.',
      fr: 'Nourriture, loyer et frais urgents.',
      ar: 'الطعام والإيجار والتكاليف العاجلة.',
    },
  },
  {
    id: 'children',
    icon: 'family_restroom',
    available: false,
    title: {
      en: 'I have or care for children',
      fr: 'J’ai des enfants ou je m’occupe d’enfants',
      ar: 'لدي أطفال أو أعتني بأطفال',
    },
    description: {
      en: 'Family and child supports.',
      fr: 'Aides pour les familles et les enfants.',
      ar: 'دعم الأسرة والأطفال.',
    },
  },
  {
    id: 'recentlyArrived',
    icon: 'flight_land',
    available: false,
    title: {
      en: 'I recently arrived in Canada',
      fr: 'Je suis arrivé(e) au Canada récemment',
      ar: 'وصلت إلى كندا مؤخرًا',
    },
    description: {
      en: 'First documents and settlement help.',
      fr: 'Premiers documents et aide à l’établissement.',
      ar: 'الوثائق الأولى والمساعدة على الاستقرار.',
    },
  },
  {
    id: 'findingWork',
    icon: 'work',
    available: false,
    title: {
      en: 'I need help finding work',
      fr: 'J’ai besoin d’aide pour trouver un emploi',
      ar: 'أحتاج إلى مساعدة في إيجاد عمل',
    },
    description: {
      en: 'Work authorization, SIN and employment services.',
      fr: 'Autorisation de travail, NAS et services d’emploi.',
      ar: 'تصريح العمل ورقم التأمين الاجتماعي وخدمات التوظيف.',
    },
  },
  {
    id: 'health',
    icon: 'health_and_safety',
    available: false,
    title: {
      en: 'I have a health or disability-related need',
      fr: 'J’ai un besoin lié à la santé ou à un handicap',
      ar: 'لدي احتياج متعلق بالصحة أو بإعاقة',
    },
    description: {
      en: 'Health-related supports.',
      fr: 'Aides liées à la santé.',
      ar: 'الدعم المتعلق بالصحة.',
    },
  },
  {
    id: 'housing',
    icon: 'home',
    available: false,
    title: {
      en: 'I need housing help',
      fr: 'J’ai besoin d’aide pour me loger',
      ar: 'أحتاج إلى مساعدة في السكن',
    },
    description: {
      en: 'Housing help.',
      fr: 'Aide au logement.',
      ar: 'المساعدة في السكن.',
    },
  },
  {
    id: 'notSure',
    icon: 'help',
    available: false,
    title: {
      en: 'I am not sure where to start',
      fr: 'Je ne sais pas par où commencer',
      ar: 'لا أعرف من أين أبدأ',
    },
    description: {
      en: 'A few questions, then a person who can help.',
      fr: 'Quelques questions, puis une personne qui peut vous aider.',
      ar: 'بعض الأسئلة، ثم شخص يمكنه مساعدتك.',
    },
  },
];

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export type QuestionId =
  | 'province'
  | 'immigrationStatus'
  | 'workAuthorization'
  | 'sin'
  | 'taxReturn'
  | 'workSituation'
  | 'householdIncome'
  | 'maritalStatus'
  | 'children'
  | 'helpChannel'
  | 'supports'
  | 'helpLanguage';

/** A single choice is a string; questions with `multiple` store a list of values. */
export type AnswerValue = string | readonly string[];
export type AnswerValues = Partial<Record<QuestionId, AnswerValue>>;

export interface ChoiceOption {
  value: string;
  label: Text;
}

export interface Question {
  id: QuestionId;
  label: Text;
  options: readonly ChoiceOption[];
  /** Lets the person pick more than one option. */
  multiple?: boolean;
  optional?: boolean;
  /** Show the question only when this returns true. Hidden questions are never required. */
  showIf?: (answers: AnswerValues) => boolean;
}

export interface Step {
  id: string;
  title: Text;
  questions: readonly Question[];
}

const YES_NO_NOT_SURE: readonly ChoiceOption[] = [
  { value: 'yes', label: { en: 'Yes', fr: 'Oui', ar: 'نعم' } },
  { value: 'no', label: { en: 'No', fr: 'Non', ar: 'لا' } },
  { value: 'notSure', label: { en: 'I am not sure', fr: 'Je ne suis pas sûr(e)', ar: 'لست متأكدًا' } },
];

const PREFER_NOT_TO_SAY: Text = {
  en: 'I prefer not to say',
  fr: 'Je préfère ne pas répondre',
  ar: 'أفضّل عدم الإجابة',
};

const PROVINCES: readonly ChoiceOption[] = [
  { value: 'AB', label: { en: 'Alberta', fr: 'Alberta', ar: 'ألبرتا' } },
  { value: 'BC', label: { en: 'British Columbia', fr: 'Colombie-Britannique', ar: 'كولومبيا البريطانية' } },
  { value: 'MB', label: { en: 'Manitoba', fr: 'Manitoba', ar: 'مانيتوبا' } },
  { value: 'NB', label: { en: 'New Brunswick', fr: 'Nouveau-Brunswick', ar: 'نيو برونزويك' } },
  {
    value: 'NL',
    label: { en: 'Newfoundland and Labrador', fr: 'Terre-Neuve-et-Labrador', ar: 'نيوفاوندلاند ولابرادور' },
  },
  { value: 'NS', label: { en: 'Nova Scotia', fr: 'Nouvelle-Écosse', ar: 'نوفا سكوشا' } },
  { value: 'ON', label: { en: 'Ontario', fr: 'Ontario', ar: 'أونتاريو' } },
  {
    value: 'PE',
    label: { en: 'Prince Edward Island', fr: 'Île-du-Prince-Édouard', ar: 'جزيرة الأمير إدوارد' },
  },
  { value: 'QC', label: { en: 'Quebec', fr: 'Québec', ar: 'كيبيك' } },
  { value: 'SK', label: { en: 'Saskatchewan', fr: 'Saskatchewan', ar: 'ساسكاتشوان' } },
  {
    value: 'NT',
    label: { en: 'Northwest Territories', fr: 'Territoires du Nord-Ouest', ar: 'الأقاليم الشمالية الغربية' },
  },
  { value: 'NU', label: { en: 'Nunavut', fr: 'Nunavut', ar: 'نونافوت' } },
  { value: 'YT', label: { en: 'Yukon', fr: 'Yukon', ar: 'يوكون' } },
];

/** Languages offered when someone asks for help in another language. */
const HELP_LANGUAGES: readonly ChoiceOption[] = [
  { value: 'ar', label: { en: 'Arabic', fr: 'Arabe', ar: 'العربية' } },
  { value: 'prs', label: { en: 'Dari', fr: 'Dari', ar: 'الدارية' } },
  { value: 'fa', label: { en: 'Farsi (Persian)', fr: 'Farsi (persan)', ar: 'الفارسية' } },
  { value: 'fr', label: { en: 'French', fr: 'Français', ar: 'الفرنسية' } },
  { value: 'hi', label: { en: 'Hindi', fr: 'Hindi', ar: 'الهندية' } },
  { value: 'cmn', label: { en: 'Mandarin', fr: 'Mandarin', ar: 'الماندرين' } },
  { value: 'yue', label: { en: 'Cantonese', fr: 'Cantonais', ar: 'الكانتونية' } },
  { value: 'pa', label: { en: 'Punjabi', fr: 'Pendjabi', ar: 'البنجابية' } },
  { value: 'es', label: { en: 'Spanish', fr: 'Espagnol', ar: 'الإسبانية' } },
  { value: 'tl', label: { en: 'Tagalog', fr: 'Tagalog', ar: 'التاغالوغية' } },
  { value: 'ti', label: { en: 'Tigrinya', fr: 'Tigrigna', ar: 'التغرينية' } },
  { value: 'uk', label: { en: 'Ukrainian', fr: 'Ukrainien', ar: 'الأوكرانية' } },
  { value: 'ur', label: { en: 'Urdu', fr: 'Ourdou', ar: 'الأردية' } },
  { value: 'other', label: { en: 'Another language', fr: 'Une autre langue', ar: 'لغة أخرى' } },
];

export const STEPS: readonly Step[] = [
  {
    id: 'about',
    title: { en: 'About you', fr: 'À propos de vous', ar: 'معلومات عنك' },
    questions: [
      {
        id: 'province',
        label: {
          en: 'Which province or territory do you live in?',
          fr: 'Dans quelle province ou quel territoire habitez-vous ?',
          ar: 'في أي مقاطعة أو إقليم تعيش؟',
        },
        options: PROVINCES,
      },
      {
        id: 'immigrationStatus',
        label: {
          en: 'What is your immigration status?',
          fr: 'Quel est votre statut d’immigration ?',
          ar: 'ما هو وضعك كمهاجر؟',
        },
        options: [
          {
            value: 'permanentResident',
            label: { en: 'Permanent resident', fr: 'Résident(e) permanent(e)', ar: 'مقيم دائم' },
          },
          {
            value: 'protectedPerson',
            label: {
              en: 'Protected person or resettled refugee',
              fr: 'Personne protégée ou réfugié(e) réinstallé(e)',
              ar: 'شخص محمي أو لاجئ مُعاد توطينه',
            },
          },
          {
            value: 'refugeeClaimant',
            label: { en: 'Refugee claimant', fr: 'Demandeur ou demandeuse d’asile', ar: 'طالب لجوء' },
          },
          {
            value: 'workPermit',
            label: { en: 'Work permit holder', fr: 'Titulaire d’un permis de travail', ar: 'حامل تصريح عمل' },
          },
          {
            value: 'studyPermit',
            label: { en: 'Study permit holder', fr: 'Titulaire d’un permis d’études', ar: 'حامل تصريح دراسة' },
          },
          {
            value: 'citizen',
            label: { en: 'Canadian citizen', fr: 'Citoyen(ne) canadien(ne)', ar: 'مواطن كندي' },
          },
          {
            value: 'notSure',
            label: {
              en: 'I am not sure or prefer not to say',
              fr: 'Je ne suis pas sûr(e) ou je préfère ne pas répondre',
              ar: 'لست متأكدًا أو أفضّل عدم الإجابة',
            },
          },
        ],
      },
      {
        id: 'workAuthorization',
        label: {
          en: 'Are you currently authorized to work in Canada?',
          fr: 'Êtes-vous autorisé(e) à travailler au Canada en ce moment ?',
          ar: 'هل يُسمح لك حاليًا بالعمل في كندا؟',
        },
        options: YES_NO_NOT_SURE,
      },
      {
        id: 'sin',
        label: {
          en: 'Do you have a Social Insurance Number (SIN)?',
          fr: 'Avez-vous un numéro d’assurance sociale (NAS) ?',
          ar: 'هل لديك رقم تأمين اجتماعي (SIN)؟',
        },
        options: YES_NO_NOT_SURE,
      },
      {
        id: 'taxReturn',
        label: {
          en: 'Did you file a tax return for last year?',
          fr: 'Avez-vous produit une déclaration de revenus pour l’an dernier ?',
          ar: 'هل قدّمت إقرارًا ضريبيًا عن العام الماضي؟',
        },
        options: [
          YES_NO_NOT_SURE[0],
          YES_NO_NOT_SURE[1],
          {
            value: 'arrivedThisYear',
            label: {
              en: 'I arrived in Canada this year',
              fr: 'Je suis arrivé(e) au Canada cette année',
              ar: 'وصلت إلى كندا هذا العام',
            },
          },
          YES_NO_NOT_SURE[2],
        ],
      },
    ],
  },
  {
    id: 'work',
    title: { en: 'Work and household', fr: 'Travail et ménage', ar: 'العمل والأسرة' },
    questions: [
      {
        id: 'workSituation',
        label: {
          en: 'What best describes your work right now?',
          fr: 'Qu’est-ce qui décrit le mieux votre travail en ce moment ?',
          ar: 'ما الذي يصف وضع عملك حاليًا بشكل أفضل؟',
        },
        options: [
          {
            value: 'lostJob',
            label: { en: 'I recently lost my job', fr: 'J’ai perdu mon emploi récemment', ar: 'فقدت عملي مؤخرًا' },
          },
          {
            value: 'reduced',
            label: {
              en: 'My hours or pay were reduced',
              fr: 'Mes heures ou mon salaire ont été réduits',
              ar: 'انخفضت ساعات عملي أو أجري',
            },
          },
          {
            value: 'usualHours',
            label: {
              en: 'I am working my usual hours',
              fr: 'Je travaille mes heures habituelles',
              ar: 'أعمل ساعاتي المعتادة',
            },
          },
          {
            value: 'notWorking',
            label: {
              en: 'I was not working before',
              fr: 'Je ne travaillais pas avant',
              ar: 'لم أكن أعمل من قبل',
            },
          },
          { value: 'preferNotToSay', label: PREFER_NOT_TO_SAY },
        ],
      },
      {
        id: 'householdIncome',
        label: {
          en: 'About how much income did your household have last year?',
          fr: 'Environ combien votre ménage a-t-il gagné l’an dernier ?',
          ar: 'كم كان دخل أسرتك تقريبًا في العام الماضي؟',
        },
        options: [
          { value: 'under20k', label: { en: 'Under $20,000', fr: 'Moins de 20 000 $', ar: 'أقل من 20,000 دولار' } },
          {
            value: '20to40k',
            label: { en: '$20,000 to $39,999', fr: '20 000 $ à 39 999 $', ar: 'من 20,000 إلى 39,999 دولارًا' },
          },
          {
            value: '40to60k',
            label: { en: '$40,000 to $59,999', fr: '40 000 $ à 59 999 $', ar: 'من 40,000 إلى 59,999 دولارًا' },
          },
          {
            value: '60kPlus',
            label: { en: '$60,000 or more', fr: '60 000 $ ou plus', ar: '60,000 دولار أو أكثر' },
          },
          {
            value: 'notSure',
            label: {
              en: 'I am not sure or prefer not to say',
              fr: 'Je ne suis pas sûr(e) ou je préfère ne pas répondre',
              ar: 'لست متأكدًا أو أفضّل عدم الإجابة',
            },
          },
        ],
      },
      {
        id: 'maritalStatus',
        label: {
          en: 'What is your marital status?',
          fr: 'Quel est votre état matrimonial ?',
          ar: 'ما هي حالتك الاجتماعية؟',
        },
        options: [
          { value: 'single', label: { en: 'Single', fr: 'Célibataire', ar: 'أعزب/عزباء' } },
          {
            value: 'married',
            label: { en: 'Married or common-law', fr: 'Marié(e) ou conjoint(e) de fait', ar: 'متزوج أو في علاقة مساكنة' },
          },
          {
            value: 'separated',
            label: {
              en: 'Separated, divorced or widowed',
              fr: 'Séparé(e), divorcé(e) ou veuf(ve)',
              ar: 'منفصل أو مطلّق أو أرمل',
            },
          },
          { value: 'preferNotToSay', label: PREFER_NOT_TO_SAY },
        ],
      },
      {
        id: 'children',
        label: {
          en: 'How many children under 18 live with you?',
          fr: 'Combien d’enfants de moins de 18 ans vivent avec vous ?',
          ar: 'كم عدد الأطفال دون 18 عامًا الذين يعيشون معك؟',
        },
        options: [
          { value: '0', label: { en: 'None', fr: 'Aucun', ar: 'لا يوجد' } },
          { value: '1', label: { en: '1', fr: '1', ar: '1' } },
          { value: '2', label: { en: '2', fr: '2', ar: '2' } },
          { value: '3plus', label: { en: '3 or more', fr: '3 ou plus', ar: '3 أو أكثر' } },
          { value: 'preferNotToSay', label: PREFER_NOT_TO_SAY },
        ],
      },
    ],
  },
  {
    id: 'preferences',
    title: { en: 'How you want help', fr: 'Comment vous voulez de l’aide', ar: 'كيف تفضّل الحصول على المساعدة' },
    questions: [
      {
        id: 'helpChannel',
        label: {
          en: 'How would you prefer to get help?',
          fr: 'Comment préférez-vous recevoir de l’aide ?',
          ar: 'كيف تفضّل الحصول على المساعدة؟',
        },
        options: [
          { value: 'online', label: { en: 'Online', fr: 'En ligne', ar: 'عبر الإنترنت' } },
          { value: 'phone', label: { en: 'By phone', fr: 'Par téléphone', ar: 'عبر الهاتف' } },
          { value: 'inPerson', label: { en: 'In person', fr: 'En personne', ar: 'شخصيًا' } },
          {
            value: 'worker',
            label: {
              en: 'With a settlement or community worker',
              fr: 'Avec un intervenant en établissement ou communautaire',
              ar: 'مع موظف توطين أو عامل مجتمعي',
            },
          },
          {
            value: 'all',
            label: { en: 'Show me all options', fr: 'Montrez-moi toutes les options', ar: 'اعرض لي كل الخيارات' },
          },
        ],
      },
      {
        id: 'supports',
        multiple: true,
        optional: true,
        label: {
          en: 'Do you need any accessibility or language support? Select all that apply.',
          fr: 'Avez-vous besoin d’aide pour l’accessibilité ou la langue ? Cochez tout ce qui s’applique.',
          ar: 'هل تحتاج إلى دعم في إمكانية الوصول أو اللغة؟ اختر كل ما ينطبق.',
        },
        options: [
          {
            value: 'language',
            label: { en: 'Help in another language', fr: 'Aide dans une autre langue', ar: 'مساعدة بلغة أخرى' },
          },
          {
            value: 'stepFree',
            label: {
              en: 'Step-free or wheelchair access',
              fr: 'Accès sans marches ou en fauteuil roulant',
              ar: 'مدخل بلا درج أو مناسب للكراسي المتحركة',
            },
          },
          { value: 'hearing', label: { en: 'Hearing support', fr: 'Soutien pour l’audition', ar: 'دعم السمع' } },
          { value: 'vision', label: { en: 'Vision support', fr: 'Soutien pour la vision', ar: 'دعم البصر' } },
        ],
      },
      {
        id: 'helpLanguage',
        showIf: (answers) => Array.isArray(answers.supports) && answers.supports.includes('language'),
        label: {
          en: 'Which language would you like help in?',
          fr: 'Dans quelle langue voulez-vous recevoir de l’aide ?',
          ar: 'بأي لغة تريد الحصول على المساعدة؟',
        },
        options: HELP_LANGUAGES,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function isVisible(question: Question, answers: AnswerValues): boolean {
  return question.showIf ? question.showIf(answers) : true;
}

export function isAnswered(value: AnswerValue | undefined): boolean {
  if (value === undefined) {
    return false;
  }
  return typeof value === 'string' ? value.trim() !== '' : value.length > 0;
}

/** True when every visible, required question on the step has an answer. */
export function isStepComplete(step: Step, answers: AnswerValues): boolean {
  return step.questions.every(
    (q) => q.optional || !isVisible(q, answers) || isAnswered(answers[q.id]),
  );
}
