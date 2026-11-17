// Synthetic demonstration content, copied from the Newcomer Compass click-through
// prototype (ref/Newcomer-Compass-click-through.html). Arabic text is machine translated.
// Links and phone numbers must be confirmed against official sources before use.
import type {
  Area,
  ContentModel,
  DemoLocation,
  GlossaryEntry,
  ResultStateInfo,
} from "./types";

export const CONTENT: ContentModel = {
  scenario: {
    scenarioId: "ottawa-demo-config-v1",
    scenarioLabel: {
      en: "Demo configuration with synthetic Ottawa content. The MVP scenario has not been selected; the team will decide through Exercise 6.",
      fr: "Configuration de démonstration avec du contenu synthétique pour Ottawa. Le scénario du PMV n'a pas été choisi; l'équipe décidera lors de l'exercice 6.",
      ar: "إعداد تجريبي بمحتوى اصطناعي عن أوتاوا. لم يتم اختيار سيناريو النسخة الأولية (MVP) بعد، وسيقرر الفريق ذلك من خلال التمرين 6.",
    },
    scenarioStatus: {
      en: "No life situation is treated as the main scenario.",
      fr: "Aucune situation de vie n'est traitée comme le scénario principal.",
      ar: "لا تُعامَل أي حالة حياتية على أنها السيناريو الرئيسي.",
    },
    defaultCity: "Ottawa",
    primarySituationId: "",
    situations: [
      {
        id: "recent_arrival",
        icon: "plane",
        label: {
          en: "I recently arrived in Canada",
          fr: "Je suis arrivé ou arrivée au Canada récemment",
          ar: "وصلت إلى كندا مؤخرًا",
        },
        description: {
          en: "First documents and settlement help.",
          fr: "Premiers documents et aide à l'établissement.",
          ar: "الوثائق الأولى والمساعدة في الاستقرار.",
        },
        available: true,
      },
      {
        id: "lost_income",
        icon: "briefcase",
        label: {
          en: "I lost my job or my income changed",
          fr: "J'ai perdu mon emploi ou mon revenu a changé",
          ar: "فقدت عملي أو تغيّر دخلي",
        },
        description: {
          en: "Income, work and the first steps that unlock other supports.",
          fr: "Revenu, travail et premières étapes qui donnent accès à d'autres mesures de soutien.",
          ar: "الدخل والعمل والخطوات الأولى التي تفتح الطريق إلى أشكال دعم أخرى.",
        },
        available: false,
      },
      {
        id: "basic_expenses",
        icon: "wallet",
        label: {
          en: "I need help with basic expenses",
          fr: "J'ai besoin d'aide pour mes dépenses de base",
          ar: "أحتاج إلى مساعدة في النفقات الأساسية",
        },
        description: {
          en: "Food, rent and urgent costs.",
          fr: "Nourriture, loyer et dépenses urgentes.",
          ar: "الطعام والإيجار والتكاليف العاجلة.",
        },
        available: false,
      },
      {
        id: "children",
        icon: "baby",
        label: {
          en: "I have or care for children",
          fr: "J'ai des enfants ou je m'occupe d'enfants",
          ar: "لديّ أطفال أو أعتني بأطفال",
        },
        description: {
          en: "Family and child supports.",
          fr: "Soutiens aux familles et aux enfants.",
          ar: "دعم الأسرة والأطفال.",
        },
        available: false,
      },
      {
        id: "find_work",
        icon: "search",
        label: {
          en: "I need help finding work",
          fr: "J'ai besoin d'aide pour trouver du travail",
          ar: "أحتاج إلى مساعدة في إيجاد عمل",
        },
        description: {
          en: "Work authorization, SIN and employment services.",
          fr: "Autorisation de travail, NAS et services d'emploi.",
          ar: "تصريح العمل ورقم SIN وخدمات التوظيف.",
        },
        available: false,
      },
      {
        id: "health",
        icon: "heart",
        label: {
          en: "I have a health or disability-related need",
          fr: "J'ai un besoin lié à la santé ou à un handicap",
          ar: "لديّ حاجة صحية أو حاجة متعلقة بإعاقة",
        },
        description: {
          en: "Health-related supports.",
          fr: "Soutiens liés à la santé.",
          ar: "دعم متعلق بالصحة.",
        },
        available: false,
      },
      {
        id: "housing",
        icon: "home",
        label: {
          en: "I need housing help",
          fr: "J'ai besoin d'aide pour me loger",
          ar: "أحتاج إلى مساعدة في السكن",
        },
        description: {
          en: "Housing help.",
          fr: "Aide au logement.",
          ar: "المساعدة في السكن.",
        },
        available: false,
      },
      {
        id: "not_sure",
        icon: "compass",
        label: {
          en: "I am not sure where to start",
          fr: "Je ne sais pas par où commencer",
          ar: "لست متأكدًا من أين أبدأ",
        },
        description: {
          en: "A few questions, then a first step and a person who can help.",
          fr: "Quelques questions, puis une première étape et une personne qui peut aider.",
          ar: "بعض الأسئلة، ثم خطوة أولى وشخص يمكنه مساعدتك.",
        },
        available: false,
      },
    ],
    sampleJourney: {
      situationId: "recent_arrival",
      label: {
        en: "Sample person (synthetic): recently arrived in Ottawa, Ontario, permanent resident, two children, no SIN yet, has never filed a Canadian tax return, looking for work.",
        fr: "Personne fictive (synthétique) : arrivée récemment à Ottawa (Ontario), résidente permanente, deux enfants, pas encore de NAS, n'a jamais produit de déclaration de revenus canadienne, cherche du travail.",
        ar: "شخص افتراضي (اصطناعي): وصل حديثًا إلى أوتاوا، أونتاريو، مقيم دائم، لديه طفلان، ليس لديه رقم SIN بعد، لم يقدّم أي إقرار ضريبي كندي، ويبحث عن عمل.",
      },
      answers: {
        province: "ON",
        city: "Ottawa",
        status: "pr",
        hasSin: "no",
        filedTax: "no",
        workStatus: "looking",
        workAuth: "yes",
        children: "2",
        income: "20to40",
      },
    },
    questionOrder: [
      "province",
      "city",
      "status",
      "hasSin",
      "sinCurrent",
      "filedTax",
      "workStatus",
      "workAuth",
      "children",
      "income",
    ],
  },
  questions: [
    {
      id: "province",
      kind: "single",
      required: true,
      label: {
        en: "Which province or territory do you live in?",
        fr: "Dans quelle province ou quel territoire habitez-vous?",
        ar: "في أي مقاطعة أو إقليم تسكن؟",
      },
      why: {
        en: "Some supports are provincial or territorial. Your answer decides which provincial supports we show.",
        fr: "Certains soutiens sont provinciaux ou territoriaux. Votre réponse détermine les soutiens provinciaux que nous affichons.",
        ar: "بعض أشكال الدعم تابعة للمقاطعة أو الإقليم. إجابتك تحدد أشكال الدعم الإقليمية التي نعرضها.",
      },
      options: [
        {
          value: "AB",
          label: {
            en: "Alberta",
            fr: "Alberta",
            ar: "ألبرتا",
          },
        },
        {
          value: "BC",
          label: {
            en: "British Columbia",
            fr: "Colombie-Britannique",
            ar: "كولومبيا البريطانية",
          },
        },
        {
          value: "MB",
          label: {
            en: "Manitoba",
            fr: "Manitoba",
            ar: "مانيتوبا",
          },
        },
        {
          value: "NB",
          label: {
            en: "New Brunswick",
            fr: "Nouveau-Brunswick",
            ar: "نيو برونزويك",
          },
        },
        {
          value: "NL",
          label: {
            en: "Newfoundland and Labrador",
            fr: "Terre-Neuve-et-Labrador",
            ar: "نيوفاوندلاند ولابرادور",
          },
        },
        {
          value: "NT",
          label: {
            en: "Northwest Territories",
            fr: "Territoires du Nord-Ouest",
            ar: "الأقاليم الشمالية الغربية",
          },
        },
        {
          value: "NS",
          label: {
            en: "Nova Scotia",
            fr: "Nouvelle-Écosse",
            ar: "نوفا سكوشا",
          },
        },
        {
          value: "NU",
          label: {
            en: "Nunavut",
            fr: "Nunavut",
            ar: "نونافوت",
          },
        },
        {
          value: "ON",
          label: {
            en: "Ontario",
            fr: "Ontario",
            ar: "أونتاريو",
          },
        },
        {
          value: "PE",
          label: {
            en: "Prince Edward Island",
            fr: "Île-du-Prince-Édouard",
            ar: "جزيرة الأمير إدوارد",
          },
        },
        {
          value: "QC",
          label: {
            en: "Quebec",
            fr: "Québec",
            ar: "كيبيك",
          },
        },
        {
          value: "SK",
          label: {
            en: "Saskatchewan",
            fr: "Saskatchewan",
            ar: "ساسكاتشوان",
          },
        },
        {
          value: "YT",
          label: {
            en: "Yukon",
            fr: "Yukon",
            ar: "يوكون",
          },
        },
        {
          value: "unsure",
          label: {
            en: "I'm not sure",
            fr: "Je ne sais pas",
            ar: "لست متأكدًا",
          },
        },
      ],
      summaryLabel: {
        en: "Province or territory",
        fr: "Province ou territoire",
        ar: "المقاطعة أو الإقليم",
      },
    },
    {
      id: "city",
      kind: "text",
      purpose: "navigation",
      required: false,
      label: {
        en: "What city or community do you live in?",
        fr: "Dans quelle ville ou communauté habitez-vous?",
        ar: "في أي مدينة أو مجتمع تعيش؟",
      },
      summaryLabel: {
        en: "City or community",
        fr: "Ville ou communauté",
        ar: "المدينة أو المجتمع",
      },
      hint: {
        en: "We use this to show services and places that may be available near you.",
        fr: "Nous l'utilisons pour vous montrer les services et les endroits qui pourraient être offerts près de chez vous.",
        ar: "نستخدم هذا لنعرض لك الخدمات والأماكن التي قد تتوفر بالقرب منك.",
      },
      why: {
        en: "Your city or community is used only to show places that can help on the map. It does not change which supports may apply to you. We don't ask for your street address, postal code or exact location. You can skip this question.",
        fr: "Votre ville ou communauté sert seulement à afficher sur la carte les endroits qui peuvent vous aider. Elle ne change pas les mesures de soutien qui pourraient s'appliquer à vous. Nous ne demandons pas votre adresse, votre code postal ni votre emplacement exact. Vous pouvez passer cette question.",
        ar: "تُستخدم مدينتك أو مجتمعك فقط لعرض الأماكن التي يمكنها مساعدتك على الخريطة. ولا تغيّر أنواع الدعم التي قد تنطبق عليك. لا نطلب عنوان شارعك أو رمزك البريدي أو موقعك الدقيق. يمكنك تخطي هذا السؤال.",
      },
    },
    {
      id: "status",
      kind: "single",
      required: true,
      label: {
        en: "Which option best describes your current immigration status?",
        fr: "Quelle option décrit le mieux votre statut d'immigration actuel?",
        ar: "أيّ خيار يصف وضعك الحالي في الهجرة بشكل أفضل؟",
      },
      why: {
        en: "Some programs are open only to certain statuses. We use your answer to avoid showing supports that may not apply to you. We do not check or share it.",
        fr: "Certains programmes sont réservés à certains statuts. Nous utilisons votre réponse pour éviter d'afficher des soutiens qui pourraient ne pas s'appliquer. Nous ne la vérifions pas et ne la communiquons pas.",
        ar: "بعض البرامج مفتوحة لأوضاع معينة فقط. نستخدم إجابتك لتجنّب عرض أشكال دعم قد لا تنطبق عليك. نحن لا نتحقق منها ولا نشاركها.",
      },
      options: [
        {
          value: "pr",
          label: {
            en: "Permanent resident",
            fr: "Résident permanent ou résidente permanente",
            ar: "مقيم دائم",
          },
        },
        {
          value: "protected_person",
          label: {
            en: "Protected person or resettled refugee",
            fr: "Personne protégée ou réfugié réinstallé",
            ar: "شخص محمي أو لاجئ أُعيد توطينه",
          },
        },
        {
          value: "refugee_claimant",
          label: {
            en: "Refugee claimant",
            fr: "Demandeur ou demandeuse d'asile",
            ar: "طالب لجوء",
          },
        },
        {
          value: "work_permit",
          label: {
            en: "Work permit holder",
            fr: "Titulaire d'un permis de travail",
            ar: "حامل تصريح عمل",
          },
        },
        {
          value: "study_permit",
          label: {
            en: "Study permit holder",
            fr: "Titulaire d'un permis d'études",
            ar: "حامل تصريح دراسة",
          },
        },
        {
          value: "unsure",
          label: {
            en: "Other / I'm not sure",
            fr: "Autre / Je ne sais pas",
            ar: "آخر / لست متأكدًا",
          },
        },
      ],
      summaryLabel: {
        en: "Immigration status",
        fr: "Statut d'immigration",
        ar: "وضع الهجرة",
      },
      hint: {
        en: "Choose a category. We never ask for your UCI or permit number.",
        fr: "Choisissez une catégorie. Nous ne demandons jamais votre IUC ni votre numéro de permis.",
        ar: "اختر فئة. لا نطلب أبدًا رقم العميل الفريد (UCI) أو رقم التصريح.",
      },
    },
    {
      id: "hasSin",
      kind: "single",
      required: true,
      label: {
        en: "Do you currently have a Social Insurance Number (SIN)?",
        fr: "Avez-vous actuellement un numéro d'assurance sociale (NAS)?",
        ar: "هل لديك حاليًا رقم تأمين اجتماعي (SIN)؟",
      },
      hint: {
        en: "Don't enter your SIN. We only need to know whether you have one.",
        fr: "N'entrez pas votre NAS. Nous voulons seulement savoir si vous en avez un.",
        ar: "لا تُدخل رقم SIN الخاص بك. نحتاج فقط إلى معرفة ما إذا كان لديك رقم.",
      },
      why: {
        en: "A valid SIN may be needed to work and to receive many government payments. If you need one, getting it is often the first step.",
        fr: "Un NAS valide peut être nécessaire pour travailler et recevoir de nombreux paiements du gouvernement. Si vous en avez besoin, l'obtenir est souvent la première étape.",
        ar: "قد تحتاج إلى رقم SIN صالح للعمل ولتلقي كثير من المدفوعات الحكومية. إذا كنت تحتاج إليه، فالحصول عليه غالبًا هو الخطوة الأولى.",
      },
      options: [
        {
          value: "yes",
          label: {
            en: "Yes",
            fr: "Oui",
            ar: "نعم",
          },
        },
        {
          value: "no",
          label: {
            en: "No",
            fr: "Non",
            ar: "لا",
          },
        },
        {
          value: "unsure",
          label: {
            en: "I'm not sure",
            fr: "Je ne sais pas",
            ar: "لست متأكدًا",
          },
        },
      ],
      summaryLabel: {
        en: "Has a SIN",
        fr: "A un NAS",
        ar: "لديه رقم SIN",
      },
    },
    {
      id: "sinCurrent",
      kind: "single",
      required: true,
      showIf: {
        q: "hasSin",
        op: "eq",
        value: "yes",
      },
      label: {
        en: "Is your SIN still valid?",
        fr: "Votre NAS est-il toujours valide?",
        ar: "هل ما زال رقم SIN الخاص بك صالحًا؟",
      },
      hint: {
        en: "A SIN that starts with 9 usually has an expiry date linked to your immigration document.",
        fr: "Un NAS qui commence par 9 a habituellement une date d'expiration liée à votre document d'immigration.",
        ar: "رقم SIN الذي يبدأ بالرقم 9 يكون له عادةً تاريخ انتهاء مرتبط بوثيقة الهجرة الخاصة بك.",
      },
      why: {
        en: "If your SIN has expired, payments and work can be interrupted. Updating it may need to happen before other steps.",
        fr: "Si votre NAS est expiré, des paiements et le travail peuvent être interrompus. Il faudra peut-être le mettre à jour avant les autres étapes.",
        ar: "إذا انتهت صلاحية رقم SIN، فقد تتوقف المدفوعات والعمل. قد يلزم تحديثه قبل الخطوات الأخرى.",
      },
      options: [
        {
          value: "yes",
          label: {
            en: "Yes, it is valid",
            fr: "Oui, il est valide",
            ar: "نعم، إنه صالح",
          },
        },
        {
          value: "expired",
          label: {
            en: "No, it has expired or will expire soon",
            fr: "Non, il est expiré ou expirera bientôt",
            ar: "لا، انتهت صلاحيته أو ستنتهي قريبًا",
          },
        },
        {
          value: "unsure",
          label: {
            en: "I'm not sure",
            fr: "Je ne sais pas",
            ar: "لست متأكدًا",
          },
        },
      ],
      summaryLabel: {
        en: "SIN still valid",
        fr: "NAS toujours valide",
        ar: "رقم SIN ما زال صالحًا",
      },
    },
    {
      id: "filedTax",
      kind: "single",
      required: true,
      label: {
        en: "Have you ever filed a Canadian income tax return?",
        fr: "Avez-vous déjà produit une déclaration de revenus canadienne?",
        ar: "هل سبق أن قدّمت إقرارًا لضريبة الدخل في كندا؟",
      },
      why: {
        en: "Many benefits and credits are calculated from your Canadian tax return. If you have not filed one yet, filing can be the step that comes first.",
        fr: "De nombreuses prestations et de nombreux crédits sont calculés à partir de votre déclaration de revenus canadienne. Si vous n'en avez pas encore produit, c'est peut-être l'étape à faire en premier.",
        ar: "تُحسب كثير من الإعانات والأرصدة الضريبية من إقرارك الضريبي الكندي. إذا لم تقدّم إقرارًا بعد، فقد يكون تقديمه هو الخطوة الأولى.",
      },
      options: [
        {
          value: "yes",
          label: {
            en: "Yes",
            fr: "Oui",
            ar: "نعم",
          },
        },
        {
          value: "no",
          label: {
            en: "No",
            fr: "Non",
            ar: "لا",
          },
        },
        {
          value: "unsure",
          label: {
            en: "I'm not sure",
            fr: "Je ne sais pas",
            ar: "لست متأكدًا",
          },
        },
      ],
      summaryLabel: {
        en: "Ever filed a Canadian income tax return",
        fr: "Déclaration de revenus canadienne déjà produite",
        ar: "سبق تقديم إقرار ضريبي كندي",
      },
      hint: {
        en: "This means sending an income tax return to the Canada Revenue Agency. We are asking about taxes in Canada, not taxes you may have filed in another country.",
        fr: "Cela veut dire envoyer une déclaration de revenus à l'Agence du revenu du Canada. Nous parlons des impôts au Canada, pas des impôts que vous avez peut-être déclarés dans un autre pays.",
        ar: "يعني ذلك إرسال إقرار ضريبة الدخل إلى وكالة الإيرادات الكندية. نسأل عن الضرائب في كندا، وليس عن الضرائب التي ربما قدّمتها في بلد آخر.",
      },
    },
    {
      id: "workStatus",
      kind: "single",
      required: true,
      label: {
        en: "Which option best describes your work situation right now?",
        fr: "Quelle option décrit le mieux votre situation de travail en ce moment?",
        ar: "أيّ خيار يصف وضعك في العمل الآن بشكل أفضل؟",
      },
      options: [
        {
          value: "working",
          label: {
            en: "I'm working in Canada",
            fr: "Je travaille au Canada",
            ar: "أعمل في كندا",
          },
        },
        {
          value: "looking",
          label: {
            en: "I'm looking for work in Canada",
            fr: "Je cherche du travail au Canada",
            ar: "أبحث عن عمل في كندا",
          },
        },
        {
          value: "worked_abroad",
          label: {
            en: "I worked before coming to Canada but haven't worked in Canada yet",
            fr: "J'ai travaillé avant de venir au Canada, mais je n'ai pas encore travaillé au Canada",
            ar: "عملت قبل القدوم إلى كندا لكنني لم أعمل في كندا بعد",
          },
        },
        {
          value: "first_job",
          label: {
            en: "I haven't worked before and I'm looking for my first job",
            fr: "Je n'ai jamais travaillé et je cherche mon premier emploi",
            ar: "لم أعمل من قبل وأبحث عن أول وظيفة لي",
          },
        },
        {
          value: "studying",
          label: {
            en: "I'm studying and may want to work",
            fr: "J'étudie et je voudrais peut-être travailler",
            ar: "أدرس وقد أرغب في العمل",
          },
        },
        {
          value: "not_looking",
          label: {
            en: "I'm not working and I'm not currently looking for work",
            fr: "Je ne travaille pas et je ne cherche pas de travail en ce moment",
            ar: "لا أعمل ولا أبحث عن عمل حاليًا",
          },
        },
        {
          value: "unsure",
          label: {
            en: "I'm not sure",
            fr: "Je ne sais pas",
            ar: "لست متأكدًا",
          },
        },
      ],
      summaryLabel: {
        en: "Work situation",
        fr: "Situation de travail",
        ar: "الوضع في العمل",
      },
      hint: {
        en: "We don't need your employer, job title or salary.",
        fr: "Nous n'avons pas besoin du nom de votre employeur, de votre poste ni de votre salaire.",
        ar: "لا نحتاج إلى اسم صاحب العمل أو المسمى الوظيفي أو الراتب.",
      },
      why: {
        en: "Your answer decides which work-related supports to show, such as Employment Insurance or employment services. It does not tell us whether you are allowed to work; we ask that separately.",
        fr: "Votre réponse détermine quels soutiens liés au travail afficher, comme l'assurance-emploi ou les services d'emploi. Elle ne nous dit pas si vous avez le droit de travailler; nous le demandons séparément.",
        ar: "تحدد إجابتك أشكال الدعم المتعلقة بالعمل التي نعرضها، مثل تأمين العمل أو خدمات التوظيف. لا تخبرنا إجابتك ما إذا كان مسموحًا لك بالعمل؛ نسأل عن ذلك بشكل منفصل.",
      },
    },
    {
      id: "workAuth",
      kind: "single",
      required: true,
      label: {
        en: "Are you currently allowed to work in Canada?",
        fr: "Avez-vous actuellement le droit de travailler au Canada?",
        ar: "هل يُسمح لك حاليًا بالعمل في كندا؟",
      },
      why: {
        en: "Some employment services depend on whether you are allowed to work. We never decide this from your other answers, and this tool does not give a legal answer.",
        fr: "Certains services d'emploi dépendent de votre droit de travailler. Nous ne le déduisons jamais de vos autres réponses, et cet outil ne donne pas d'avis juridique.",
        ar: "تعتمد بعض خدمات التوظيف على ما إذا كان مسموحًا لك بالعمل. لا نستنتج ذلك أبدًا من إجاباتك الأخرى، ولا تقدم هذه الأداة رأيًا قانونيًا.",
      },
      options: [
        {
          value: "yes",
          label: {
            en: "Yes",
            fr: "Oui",
            ar: "نعم",
          },
        },
        {
          value: "no",
          label: {
            en: "No",
            fr: "Non",
            ar: "لا",
          },
        },
        {
          value: "unsure",
          label: {
            en: "I'm not sure",
            fr: "Je ne sais pas",
            ar: "لست متأكدًا",
          },
        },
      ],
      summaryLabel: {
        en: "Allowed to work in Canada",
        fr: "Droit de travailler au Canada",
        ar: "مسموح بالعمل في كندا",
      },
      hint: {
        en: "We don't need your permit number. If you're not sure, choose “I'm not sure” and we will show you where to check.",
        fr: "Nous n'avons pas besoin de votre numéro de permis. Si vous ne savez pas, choisissez « Je ne sais pas » et nous vous montrerons où vérifier.",
        ar: "لا نحتاج إلى رقم تصريحك. إذا لم تكن متأكدًا، اختر «لست متأكدًا» وسنوضح لك أين يمكنك التحقق.",
      },
    },
    {
      id: "children",
      kind: "single",
      required: true,
      label: {
        en: "How many children under 18 live with you?",
        fr: "Combien d'enfants de moins de 18 ans vivent avec vous?",
        ar: "كم عدد الأطفال دون 18 عامًا الذين يعيشون معك؟",
      },
      options: [
        {
          value: "0",
          label: {
            en: "None",
            fr: "Aucun",
            ar: "لا يوجد",
          },
        },
        {
          value: "1",
          label: {
            en: "1",
            fr: "1",
            ar: "1",
          },
        },
        {
          value: "2",
          label: {
            en: "2",
            fr: "2",
            ar: "2",
          },
        },
        {
          value: "3plus",
          label: {
            en: "3 or more",
            fr: "3 ou plus",
            ar: "3 أو أكثر",
          },
        },
        {
          value: "unsure",
          label: {
            en: "I prefer not to say",
            fr: "Je préfère ne pas répondre",
            ar: "أفضّل عدم الإجابة",
          },
        },
      ],
      summaryLabel: {
        en: "Children under 18 at home",
        fr: "Enfants de moins de 18 ans à la maison",
        ar: "الأطفال دون 18 عامًا في المنزل",
      },
    },
    {
      id: "income",
      kind: "single",
      required: true,
      label: {
        en: "About how much income did your household have last year?",
        fr: "Environ combien de revenus votre ménage a-t-il eus l'an dernier?",
        ar: "كم كان دخل أسرتك تقريبًا في السنة الماضية؟",
      },
      hint: {
        en: "A rough range is enough. Include everyone in your household.",
        fr: "Une fourchette approximative suffit. Incluez toutes les personnes de votre ménage.",
        ar: "يكفي نطاق تقريبي. احسب دخل جميع أفراد أسرتك.",
      },
      why: {
        en: "Several supports are income-tested. A range helps us say 'may be eligible' instead of guessing. We never ask for exact amounts.",
        fr: "Plusieurs soutiens dépendent du revenu. Une fourchette nous aide à indiquer « peut-être admissible » plutôt que de deviner. Nous ne demandons jamais de montant exact.",
        ar: "كثير من أشكال الدعم تعتمد على الدخل. يساعدنا النطاق على أن نقول «قد تكون مؤهلًا» بدلًا من التخمين. لن نطلب أبدًا مبالغ دقيقة.",
      },
      options: [
        {
          value: "under20",
          label: {
            en: "Under $20,000",
            fr: "Moins de 20 000 $",
            ar: "أقل من $20,000",
          },
        },
        {
          value: "20to40",
          label: {
            en: "$20,000 to $39,999",
            fr: "De 20 000 $ à 39 999 $",
            ar: "من $20,000 إلى $39,999",
          },
        },
        {
          value: "40to60",
          label: {
            en: "$40,000 to $59,999",
            fr: "De 40 000 $ à 59 999 $",
            ar: "من $40,000 إلى $59,999",
          },
        },
        {
          value: "over60",
          label: {
            en: "$60,000 or more",
            fr: "60 000 $ ou plus",
            ar: "$60,000 أو أكثر",
          },
        },
        {
          value: "unsure",
          label: {
            en: "I am not sure or prefer not to say",
            fr: "Je ne sais pas ou je préfère ne pas répondre",
            ar: "لست متأكدًا أو أفضّل عدم الإجابة",
          },
        },
      ],
      summaryLabel: {
        en: "Household income last year (range)",
        fr: "Revenu du ménage l'an dernier (fourchette)",
        ar: "دخل الأسرة في السنة الماضية (نطاق)",
      },
    },
  ],
  programs: [
    {
      id: "svc_sin",
      section: "first",
      priority: 1,
      orgId: "org_sc",
      name: {
        en: "Social Insurance Number (SIN)",
        fr: "Numéro d'assurance sociale (NAS)",
        ar: "رقم التأمين الاجتماعي (SIN)",
      },
      shortTitle: {
        en: "Get or update your SIN",
        fr: "Obtenez ou mettez à jour votre NAS",
        ar: "احصل على رقم SIN أو حدّثه",
      },
      oneLiner: {
        en: "You may need it for work and many services.",
        fr: "Vous pourriez en avoir besoin pour travailler et pour plusieurs services.",
        ar: "قد تحتاج إليه للعمل ولكثير من الخدمات.",
      },
      icon: "id-card",
      action: {
        en: "Confirm or update your Social Insurance Number",
        fr: "Confirmez ou mettez à jour votre numéro d'assurance sociale",
        ar: "أكّد رقم التأمين الاجتماعي الخاص بك أو حدّثه",
      },
      summary: {
        en: "A valid SIN may be required for employment and government services.",
        fr: "Un NAS valide peut être exigé pour l'emploi et les services gouvernementaux.",
        ar: "قد يكون رقم SIN صالح مطلوبًا للعمل وللخدمات الحكومية.",
      },
      plain: {
        en: "A SIN is a 9-digit number from the Government of Canada. Employers and government offices use it to pay you. Make sure yours is valid first.",
        fr: "Le NAS est un numéro à 9 chiffres du gouvernement du Canada. Les employeurs et les bureaux gouvernementaux l'utilisent pour vous payer. Assurez-vous d'abord qu'il est valide.",
        ar: "رقم SIN هو رقم من 9 خانات تمنحه حكومة كندا. يستخدمه أصحاب العمل والمكاتب الحكومية لدفع المال لك. تأكّد أولًا من أن رقمك صالح.",
      },
      whyFirst: {
        en: "Other applications, including income and employment supports, may ask for a valid SIN. Doing this first avoids delays later.",
        fr: "D'autres demandes, y compris pour des soutiens au revenu et à l'emploi, peuvent exiger un NAS valide. Le faire en premier évite des retards.",
        ar: "قد تطلب طلبات أخرى رقم SIN صالحًا، ومنها طلبات دعم الدخل والتوظيف. القيام بهذا أولًا يجنّبك التأخير لاحقًا.",
      },
      unlocks: {
        en: "Employment-related steps and other applications",
        fr: "Les étapes liées à l'emploi et d'autres demandes",
        ar: "الخطوات المتعلقة بالعمل والطلبات الأخرى",
      },
      nextStep: {
        en: "Keep your SIN confirmation letter. Then file a Canadian income tax return if you have not yet.",
        fr: "Conservez votre lettre de confirmation du NAS. Produisez ensuite une déclaration de revenus canadienne si ce n'est pas déjà fait.",
        ar: "احتفظ بخطاب تأكيد رقم SIN. ثم قدّم إقرار ضريبة الدخل الكندي إذا لم تكن قد فعلت ذلك.",
      },
      channels: ["online", "in_person"],
      completableOnline: true,
      documents: [
        {
          en: "A primary identity document, such as your permanent resident card or work permit (synthetic list)",
          fr: "Une pièce d'identité principale, comme votre carte de résident permanent ou votre permis de travail (liste synthétique)",
          ar: "وثيقة هوية أساسية، مثل بطاقة الإقامة الدائمة أو تصريح العمل (قائمة اصطناعية)",
        },
        {
          en: "A secondary document if your name is different on your documents (synthetic list)",
          fr: "Un document secondaire si votre nom diffère d'un document à l'autre (liste synthétique)",
          ar: "وثيقة ثانوية إذا كان اسمك مختلفًا في وثائقك (قائمة اصطناعية)",
        },
        {
          en: "Proof of your mailing address (synthetic list)",
          fr: "Une preuve de votre adresse postale (liste synthétique)",
          ar: "إثبات عنوانك البريدي (قائمة اصطناعية)",
        },
      ],
      sourceId: "src_sin",
      glossary: ["sin", "sin900"],
      whyShown: {
        en: "You asked for help after a change in work or income, and a valid SIN is used by employers and programs.",
        fr: "Vous avez demandé de l'aide après un changement de travail ou de revenu, et un NAS valide est utilisé par les employeurs et les programmes.",
        ar: "طلبت المساعدة بعد تغيّر في العمل أو الدخل، ويستخدم أصحاب العمل والبرامج رقم SIN الصالح.",
      },
      humanHelp: {
        en: "Service Canada staff can check your documents in person or by phone. A settlement worker can help you gather the documents before you go.",
        fr: "Le personnel de Service Canada peut vérifier vos documents en personne ou par téléphone. Un intervenant en établissement peut vous aider à rassembler les documents avant d'y aller.",
        ar: "يمكن لموظفي خدمة كندا (Service Canada) فحص وثائقك حضوريًا أو عبر الهاتف. ويمكن لمرشد الاستقرار مساعدتك في جمع الوثائق قبل أن تذهب.",
      },
    },
    {
      id: "svc_tax",
      section: "first",
      priority: 2,
      orgId: "org_cra",
      name: {
        en: "Canadian income tax return",
        fr: "Déclaration de revenus canadienne",
        ar: "الإقرار الضريبي الكندي",
      },
      shortTitle: {
        en: "File a Canadian income tax return",
        fr: "Produire une déclaration de revenus canadienne",
        ar: "قدّم إقرار ضريبة الدخل الكندي",
      },
      oneLiner: {
        en: "This can open access to benefits and credits.",
        fr: "Cela peut donner accès à des prestations et à des crédits.",
        ar: "قد يفتح ذلك الطريق إلى إعانات وأرصدة ضريبية.",
      },
      icon: "receipt",
      action: {
        en: "File a Canadian income tax return, or check whether you have filed one",
        fr: "Produire une déclaration de revenus canadienne, ou vérifier si vous en avez produit une",
        ar: "قدّم إقرار ضريبة الدخل الكندي، أو تحقّق مما إذا كنت قد قدّمته",
      },
      summary: {
        en: "Tax information is used to assess several income-tested benefits.",
        fr: "Les renseignements fiscaux servent à évaluer plusieurs prestations fondées sur le revenu.",
        ar: "تُستخدم المعلومات الضريبية لتقييم عدة إعانات تعتمد على الدخل.",
      },
      plain: {
        en: "A Canadian income tax return is a yearly form about your income that you send to the Canada Revenue Agency. The government uses it to work out which payments you can get. File it even if you earned little or nothing in Canada.",
        fr: "Une déclaration de revenus canadienne est un formulaire annuel sur votre revenu que vous envoyez à l'Agence du revenu du Canada. Le gouvernement s'en sert pour établir les paiements auxquels vous pourriez avoir droit. Produisez-la même si vous avez gagné peu ou rien au Canada.",
        ar: "الإقرار الضريبي الكندي نموذج سنوي عن دخلك ترسله إلى وكالة الإيرادات الكندية. تستخدمه الحكومة لتحديد المدفوعات التي يمكنك الحصول عليها. قدّمه حتى لو كان دخلك في كندا قليلًا أو معدومًا.",
      },
      whyFirst: {
        en: "Benefits such as the GST/HST credit, child benefits and dental coverage are assessed from your tax return. Without it, they cannot be calculated.",
        fr: "Des prestations comme le crédit pour la TPS/TVH, les prestations pour enfants et la couverture dentaire sont évaluées à partir de votre déclaration. Sans elle, elles ne peuvent pas être calculées.",
        ar: "تُقيَّم إعانات مثل رصيد GST/HST وإعانات الأطفال وتغطية الأسنان بناءً على إقرارك الضريبي. ومن دونه لا يمكن حسابها.",
      },
      unlocks: {
        en: "Assessment for relevant credits and benefits",
        fr: "L'évaluation des crédits et prestations pertinents",
        ar: "تقييم الأرصدة الضريبية والإعانات ذات الصلة",
      },
      nextStep: {
        en: "Keep your notice of assessment. Then check the supports that were waiting for this step.",
        fr: "Conservez votre avis de cotisation. Vérifiez ensuite les soutiens qui attendaient cette étape.",
        ar: "احتفظ بإشعار التقييم. ثم تحقّق من أشكال الدعم التي كانت تنتظر هذه الخطوة.",
      },
      channels: ["online", "phone", "in_person"],
      completableOnline: true,
      documents: [
        {
          en: "Your SIN (synthetic list)",
          fr: "Votre NAS (liste synthétique)",
          ar: "رقم SIN الخاص بك (قائمة اصطناعية)",
        },
        {
          en: "Income slips from employers, such as T4 slips (synthetic list)",
          fr: "Feuillets de revenu des employeurs, comme les feuillets T4 (liste synthétique)",
          ar: "كشوف الدخل من أصحاب العمل، مثل كشوف T4 (قائمة اصطناعية)",
        },
        {
          en: "Your date of arrival in Canada and income earned before arriving (synthetic list)",
          fr: "Votre date d'arrivée au Canada et les revenus gagnés avant l'arrivée (liste synthétique)",
          ar: "تاريخ وصولك إلى كندا والدخل الذي كسبته قبل الوصول (قائمة اصطناعية)",
        },
        {
          en: "Rent receipts, if you rent (synthetic list)",
          fr: "Reçus de loyer, si vous êtes locataire (liste synthétique)",
          ar: "إيصالات الإيجار، إذا كنت تستأجر (قائمة اصطناعية)",
        },
      ],
      sourceId: "src_tax",
      glossary: ["tax_return", "noa", "income_tested"],
      whyShown: {
        en: "Many income-tested supports are assessed from your tax return.",
        fr: "De nombreux soutiens fondés sur le revenu sont évalués à partir de votre déclaration de revenus.",
        ar: "تُقيَّم كثير من أشكال الدعم المعتمدة على الدخل بناءً على إقرارك الضريبي.",
      },
      humanHelp: {
        en: "Volunteers at a free community tax clinic can file your return with you. A settlement worker can help you book a clinic appointment.",
        fr: "Des bénévoles d'un comptoir d'impôts communautaire gratuit peuvent produire votre déclaration avec vous. Un intervenant en établissement peut vous aider à prendre rendez-vous.",
        ar: "يمكن للمتطوعين في عيادة ضرائب مجتمعية مجانية تقديم إقرارك معك. ويمكن لمرشد الاستقرار مساعدتك في حجز موعد في العيادة.",
      },
    },
    {
      id: "prog_ei",
      section: "next",
      priority: 3,
      orgId: "org_sc",
      name: {
        en: "Employment Insurance regular benefits",
        fr: "Prestations régulières d'assurance-emploi",
        ar: "الإعانات العادية لتأمين العمل (Employment Insurance)",
      },
      shortTitle: {
        en: "Employment Insurance",
        fr: "Assurance-emploi",
        ar: "تأمين العمل (EI)",
      },
      oneLiner: {
        en: "Temporary income support after some job losses.",
        fr: "Un soutien temporaire du revenu après certaines pertes d'emploi.",
        ar: "دعم مؤقت للدخل بعد بعض حالات فقدان العمل.",
      },
      icon: "briefcase",
      action: {
        en: "Check whether you can apply for Employment Insurance",
        fr: "Vérifiez si vous pouvez demander l'assurance-emploi",
        ar: "تحقّق مما إذا كان يمكنك التقدم بطلب تأمين العمل (EI)",
      },
      summary: {
        en: "Temporary income support for some people who lost a job through no fault of their own. Rules depend on hours worked and the reason for the job loss.",
        fr: "Soutien temporaire du revenu pour certaines personnes ayant perdu leur emploi sans en être responsables. Les règles dépendent des heures travaillées et de la raison de la perte d'emploi.",
        ar: "دعم مؤقت للدخل لبعض الأشخاص الذين فقدوا عملهم دون خطأ منهم. تعتمد القواعد على عدد ساعات العمل وسبب فقدان العمل.",
      },
      plain: {
        en: "EI can pay part of your wages for a while after you lose work in Canada. It depends on how many hours you worked in Canada. A Service Canada officer makes the decision.",
        fr: "L'AE peut verser une partie de votre salaire pendant un certain temps après une perte de travail au Canada. Elle dépend du nombre d'heures travaillées au Canada. Un agent de Service Canada prend la décision.",
        ar: "يمكن لتأمين العمل أن يدفع جزءًا من أجرك لفترة بعد فقدان عملك في كندا. يعتمد ذلك على عدد ساعات عملك في كندا. يتخذ موظف Service Canada القرار.",
      },
      nextStep: {
        en: "Apply soon after your last day of work. Service Canada will tell you if you qualify.",
        fr: "Faites votre demande peu après votre dernier jour de travail. Service Canada vous dira si vous êtes admissible.",
        ar: "قدّم طلبك بعد آخر يوم عمل بوقت قصير. ستخبرك خدمة كندا (Service Canada) إن كنت مؤهلًا.",
      },
      channels: ["online", "phone", "in_person"],
      completableOnline: true,
      documents: [
        {
          en: "Your SIN (synthetic list)",
          fr: "Votre NAS (liste synthétique)",
          ar: "رقم SIN الخاص بك (قائمة اصطناعية)",
        },
        {
          en: "Names, addresses and dates of employers in the last 52 weeks (synthetic list)",
          fr: "Noms, adresses et dates d'emploi des employeurs des 52 dernières semaines (liste synthétique)",
          ar: "أسماء أصحاب العمل وعناوينهم وتواريخ العمل لديهم خلال آخر 52 أسبوعًا (قائمة اصطناعية)",
        },
        {
          en: "Record of Employment, if your employer gave you one (synthetic list)",
          fr: "Relevé d'emploi, si votre employeur vous l'a remis (liste synthétique)",
          ar: "سجل التوظيف (Record of Employment)، إذا أعطاك صاحب العمل واحدًا (قائمة اصطناعية)",
        },
        {
          en: "Banking information for direct deposit (synthetic list)",
          fr: "Renseignements bancaires pour le dépôt direct (liste synthétique)",
          ar: "المعلومات المصرفية للإيداع المباشر (قائمة اصطناعية)",
        },
      ],
      trigger: {
        q: "situation",
        op: "in",
        value: ["lost_income", "basic_expenses", "find_work"],
      },
      sourceId: "src_ei",
      glossary: ["ei", "roe"],
      whyShown: {
        en: "Shown because you chose a situation about work or income.",
        fr: "Affiché parce que vous avez choisi une situation liée au travail ou au revenu.",
        ar: "يظهر لأنك اخترت حالة تتعلق بالعمل أو الدخل.",
      },
      humanHelp: {
        en: "Service Canada can tell you whether you qualify. A settlement worker can help you fill in the application.",
        fr: "Service Canada peut vous dire si vous êtes admissible. Un intervenant en établissement peut vous aider à remplir la demande.",
        ar: "يمكن لخدمة كندا (Service Canada) أن تخبرك إن كنت مؤهلًا. ويمكن لمرشد الاستقرار مساعدتك في تعبئة الطلب.",
      },
    },
    {
      id: "prog_employment",
      section: "next",
      priority: 4,
      orgId: "org_prov_emp",
      name: {
        en: "Employment services",
        fr: "Services d'emploi",
        ar: "خدمات التوظيف",
      },
      shortTitle: {
        en: "Get help finding work",
        fr: "Obtenez de l'aide pour trouver un emploi",
        ar: "احصل على مساعدة في إيجاد عمل",
      },
      oneLiner: {
        en: "Free help with job searching and resumes.",
        fr: "De l'aide gratuite pour chercher un emploi et préparer un CV.",
        ar: "مساعدة مجانية في البحث عن عمل وكتابة السيرة الذاتية.",
      },
      icon: "search",
      action: {
        en: "Get help looking for work",
        fr: "Obtenez de l'aide pour chercher du travail",
        ar: "احصل على مساعدة في البحث عن عمل",
      },
      summary: {
        en: "Free help with job searching, resumes, interviews and training referrals.",
        fr: "Aide gratuite pour la recherche d'emploi, le CV, les entrevues et l'orientation vers une formation.",
        ar: "مساعدة مجانية في البحث عن عمل والسيرة الذاتية والمقابلات والإحالة إلى التدريب.",
      },
      plain: {
        en: "A counsellor can help you find a job, write a resume and practise interviews. It is free.",
        fr: "Un conseiller peut vous aider à trouver un emploi, à rédiger un CV et à vous préparer aux entrevues. C'est gratuit.",
        ar: "يمكن لمستشار أن يساعدك في إيجاد عمل وكتابة سيرة ذاتية والتدرّب على المقابلات. هذه الخدمة مجانية.",
      },
      nextStep: {
        en: "Book a first meeting with an employment counsellor.",
        fr: "Prenez un premier rendez-vous avec un conseiller en emploi.",
        ar: "احجز لقاءً أول مع مستشار توظيف.",
      },
      channels: ["online", "phone", "in_person", "worker"],
      completableOnline: false,
      documents: [
        {
          en: "Proof that you can work in Canada (synthetic list)",
          fr: "Preuve que vous pouvez travailler au Canada (liste synthétique)",
          ar: "إثبات أنه يمكنك العمل في كندا (قائمة اصطناعية)",
        },
        {
          en: "A resume, if you have one (synthetic list)",
          fr: "Un CV, si vous en avez un (liste synthétique)",
          ar: "سيرة ذاتية، إذا كانت لديك (قائمة اصطناعية)",
        },
      ],
      trigger: {
        q: "situation",
        op: "in",
        value: ["lost_income", "find_work", "recent_arrival"],
      },
      sourceId: "src_emp",
      glossary: [],
      whyShown: {
        en: "Shown because you chose a situation about work.",
        fr: "Affiché parce que vous avez choisi une situation liée au travail.",
        ar: "يظهر هذا لأنك اخترت حالة تتعلق بالعمل.",
      },
      humanHelp: {
        en: "An employment counsellor works with you one-on-one. A settlement worker can refer you.",
        fr: "Un conseiller en emploi vous accompagne individuellement. Un intervenant en établissement peut vous orienter.",
        ar: "يعمل معك مستشار التوظيف بشكل فردي. ويمكن لمرشد الاستقرار إحالتك إليه.",
      },
    },
    {
      id: "svc_basic_needs",
      section: "next",
      priority: 5,
      orgId: "org_211",
      name: {
        en: "Community referral for urgent needs (211)",
        fr: "Orientation communautaire pour les besoins urgents (211)",
        ar: "إحالة مجتمعية للاحتياجات العاجلة (211)",
      },
      shortTitle: {
        en: "Call 211 for urgent needs",
        fr: "Appelez le 211 pour les besoins urgents",
        ar: "اتصل بـ 211 للاحتياجات العاجلة",
      },
      oneLiner: {
        en: "A free referral for food, rent or emergency help.",
        fr: "Une orientation gratuite vers de l'aide alimentaire, au loyer ou d'urgence.",
        ar: "إحالة مجانية للطعام أو الإيجار أو المساعدة الطارئة.",
      },
      icon: "phone",
      action: {
        en: "Get referred to food, rent or emergency help",
        fr: "Obtenez une orientation vers de l'aide alimentaire, au loyer ou d'urgence",
        ar: "احصل على إحالة للطعام أو الإيجار أو المساعدة الطارئة",
      },
      summary: {
        en: "A free referral service that connects people to local community and social services.",
        fr: "Un service d'orientation gratuit qui met les gens en contact avec des services communautaires et sociaux locaux.",
        ar: "خدمة إحالة مجانية تربط الناس بالخدمات المجتمعية والاجتماعية المحلية.",
      },
      plain: {
        en: "If you need food or help with rent now, 211 can tell you where to go nearby. It is free and confidential.",
        fr: "Si vous avez besoin de nourriture ou d'aide pour le loyer maintenant, le 211 peut vous dire où aller près de chez vous. C'est gratuit et confidentiel.",
        ar: "إذا كنت تحتاج الآن إلى طعام أو مساعدة في الإيجار، يمكن لخدمة 211 أن تخبرك أين تذهب بالقرب منك. الخدمة مجانية وسرية.",
      },
      nextStep: {
        en: "Contact 211 by phone, text or online and describe what you need today.",
        fr: "Communiquez avec le 211 par téléphone, texto ou en ligne et décrivez ce dont vous avez besoin aujourd'hui.",
        ar: "تواصل مع 211 عبر الهاتف أو الرسائل النصية أو الإنترنت، وصِف ما تحتاجه اليوم.",
      },
      channels: ["online", "phone", "in_person"],
      completableOnline: true,
      documents: [
        {
          en: "No documents needed to ask for a referral (synthetic list)",
          fr: "Aucun document requis pour demander une orientation (liste synthétique)",
          ar: "لا حاجة إلى وثائق لطلب إحالة (قائمة اصطناعية)",
        },
      ],
      trigger: {
        q: "situation",
        op: "in",
        value: ["lost_income", "basic_expenses", "housing", "not_sure"],
      },
      sourceId: "src_211",
      glossary: [],
      whyShown: {
        en: "Shown because a change in income can make basic costs hard to cover right away.",
        fr: "Affiché parce qu'un changement de revenu peut rendre les dépenses de base difficiles à couvrir immédiatement.",
        ar: "يظهر هذا لأن تغيّر الدخل قد يجعل تغطية التكاليف الأساسية صعبة فورًا.",
      },
      humanHelp: {
        en: "211 is staffed by people who can refer you to food, rent and emergency help.",
        fr: "Le 211 est offert par des personnes qui peuvent vous orienter vers de l'aide alimentaire, au loyer ou d'urgence.",
        ar: "يعمل في 211 أشخاص يمكنهم إحالتك إلى مساعدة في الطعام والإيجار والحالات الطارئة.",
      },
    },
    {
      id: "svc_settlement",
      section: "next",
      priority: 6,
      orgId: "org_ircc",
      name: {
        en: "Settlement services",
        fr: "Services d'établissement",
        ar: "خدمات الاستقرار",
      },
      shortTitle: {
        en: "Meet a settlement worker",
        fr: "Rencontrez un intervenant en établissement",
        ar: "قابل مرشد استقرار",
      },
      oneLiner: {
        en: "Free help with forms, referrals and next steps.",
        fr: "De l'aide gratuite pour les formulaires, les orientations et la suite.",
        ar: "مساعدة مجانية في النماذج والإحالات والخطوات التالية.",
      },
      icon: "users",
      action: {
        en: "Meet a settlement worker for guided support",
        fr: "Rencontrez un intervenant en établissement pour un soutien guidé",
        ar: "قابل مرشد استقرار للحصول على دعم موجَّه",
      },
      summary: {
        en: "Free help from IRCC-funded organizations with forms, referrals, language classes and next steps.",
        fr: "Aide gratuite d'organismes financés par IRCC pour les formulaires, l'orientation, les cours de langue et les prochaines étapes.",
        ar: "مساعدة مجانية من منظمات تموّلها IRCC في النماذج والإحالات ودروس اللغة والخطوات التالية.",
      },
      plain: {
        en: "A settlement worker is a person who helps newcomers. They can help you fill in forms and go with you through these steps.",
        fr: "Un intervenant en établissement est une personne qui aide les nouveaux arrivants. Il peut vous aider à remplir des formulaires et vous accompagner dans ces étapes.",
        ar: "مرشد الاستقرار شخص يساعد القادمين الجدد. يمكنه مساعدتك في تعبئة النماذج ومرافقتك خلال هذه الخطوات.",
      },
      nextStep: {
        en: "Book an appointment. Bring this action plan.",
        fr: "Prenez rendez-vous. Apportez ce plan d'action.",
        ar: "احجز موعدًا. أحضر معك خطة العمل هذه.",
      },
      channels: ["phone", "in_person", "worker"],
      completableOnline: false,
      documents: [
        {
          en: "Your immigration document, such as a PR card or confirmation of permanent residence (synthetic list)",
          fr: "Votre document d'immigration, comme une carte de RP ou une confirmation de résidence permanente (liste synthétique)",
          ar: "وثيقة الهجرة الخاصة بك، مثل بطاقة الإقامة الدائمة أو تأكيد الإقامة الدائمة (قائمة اصطناعية)",
        },
      ],
      sourceId: "src_settlement",
      glossary: ["settlement_worker"],
      whyShown: {
        en: "Shown because a settlement worker can guide you through every step in this plan.",
        fr: "Affiché parce qu'un intervenant en établissement peut vous guider à chaque étape de ce plan.",
        ar: "يظهر هذا لأن مرشد الاستقرار يمكنه إرشادك في كل خطوة من هذه الخطة.",
      },
      humanHelp: {
        en: "This step is the human help: a settlement worker reviews your plan with you.",
        fr: "Cette étape est l'aide humaine : un intervenant en établissement examine votre plan avec vous.",
        ar: "هذه الخطوة هي المساعدة البشرية: يراجع مرشد الاستقرار خطتك معك.",
      },
    },
    {
      id: "prog_ow",
      section: "next",
      priority: 7,
      orgId: "org_prov_social",
      name: {
        en: "Provincial social assistance (Ontario Works)",
        fr: "Aide sociale provinciale (Ontario au travail)",
        ar: "المساعدة الاجتماعية الإقليمية (Ontario Works)",
      },
      shortTitle: {
        en: "Ontario Works",
        fr: "Ontario au travail",
        ar: "برنامج أونتاريو للعمل",
      },
      oneLiner: {
        en: "Short-term financial help if you are in need.",
        fr: "Une aide financière à court terme si vous êtes dans le besoin.",
        ar: "مساعدة مالية قصيرة المدى إذا كنت في حاجة.",
      },
      icon: "wallet",
      action: {
        en: "Ask about short-term financial assistance",
        fr: "Renseignez-vous sur l'aide financière à court terme",
        ar: "اسأل عن المساعدة المالية قصيرة المدى",
      },
      summary: {
        en: "Last-resort financial and employment help for people in financial need. A local office checks income, assets and status.",
        fr: "Aide financière et à l'emploi de dernier recours pour les personnes dans le besoin. Un bureau local vérifie le revenu, les biens et le statut.",
        ar: "مساعدة مالية ومساعدة في التوظيف كملاذ أخير للأشخاص المحتاجين ماليًا. يتحقق مكتب محلي من الدخل والأصول والوضع.",
      },
      plain: {
        en: "If you have no money for basic needs, the province may help for a short time. The local office decides.",
        fr: "Si vous n'avez pas d'argent pour vos besoins de base, la province peut vous aider pendant une courte période. Le bureau local décide.",
        ar: "إذا لم يكن لديك مال للاحتياجات الأساسية، فقد تساعدك المقاطعة لفترة قصيرة. المكتب المحلي هو من يقرر.",
      },
      nextStep: {
        en: "Start an application online or by phone. The office will contact you for an interview.",
        fr: "Commencez une demande en ligne ou par téléphone. Le bureau communiquera avec vous pour une entrevue.",
        ar: "ابدأ الطلب عبر الإنترنت أو عبر الهاتف. سيتواصل معك المكتب لإجراء مقابلة.",
      },
      channels: ["online", "phone", "in_person"],
      completableOnline: false,
      documents: [
        {
          en: "Identity and immigration documents (synthetic list)",
          fr: "Pièces d'identité et documents d'immigration (liste synthétique)",
          ar: "وثائق الهوية والهجرة (قائمة اصطناعية)",
        },
        {
          en: "Proof of income and bank statements (synthetic list)",
          fr: "Preuve de revenu et relevés bancaires (liste synthétique)",
          ar: "إثبات الدخل وكشوف الحساب المصرفي (قائمة اصطناعية)",
        },
        {
          en: "Rent or housing costs (synthetic list)",
          fr: "Loyer ou frais de logement (liste synthétique)",
          ar: "تكاليف الإيجار أو السكن (قائمة اصطناعية)",
        },
      ],
      trigger: {
        all: [
          {
            q: "province",
            op: "eq",
            value: "ON",
          },
          {
            q: "situation",
            op: "in",
            value: ["lost_income", "basic_expenses"],
          },
        ],
      },
      sourceId: "src_ow",
      glossary: ["social_assistance"],
      whyShown: {
        en: "Shown because you live in Ontario and chose a situation about income or basic expenses.",
        fr: "Affiché parce que vous habitez en Ontario et avez choisi une situation liée au revenu ou aux dépenses de base.",
        ar: "يظهر هذا لأنك تسكن في أونتاريو واخترت حالة تتعلق بالدخل أو النفقات الأساسية.",
      },
      humanHelp: {
        en: "The local office explains what it checks before you apply. A settlement worker can come with you.",
        fr: "Le bureau local explique ce qu'il vérifie avant la demande. Un intervenant en établissement peut vous accompagner.",
        ar: "يشرح لك المكتب المحلي ما يتحقق منه قبل أن تقدّم طلبك. ويمكن لمرشد الاستقرار مرافقتك.",
      },
    },
    {
      id: "prog_gst",
      section: "explore",
      priority: 8,
      orgId: "org_cra",
      name: {
        en: "GST/HST credit",
        fr: "Crédit pour la TPS/TVH",
        ar: "رصيد GST/HST",
      },
      shortTitle: {
        en: "GST/HST credit",
        fr: "Crédit pour la TPS/TVH",
        ar: "رصيد GST/HST",
      },
      oneLiner: {
        en: "A tax-free payment every three months.",
        fr: "Un paiement non imposable tous les trois mois.",
        ar: "دفعة معفاة من الضرائب كل ثلاثة أشهر.",
      },
      icon: "coins",
      action: {
        en: "Review the GST/HST credit",
        fr: "Examinez le crédit pour la TPS/TVH",
        ar: "راجع رصيد GST/HST",
      },
      summary: {
        en: "A tax-free quarterly payment for individuals and families with low and modest incomes.",
        fr: "Un paiement trimestriel non imposable pour les personnes et les familles à revenu faible ou modeste.",
        ar: "دفعة ربع سنوية معفاة من الضرائب للأفراد والعائلات ذوي الدخل المنخفض والمتوسط.",
      },
      plain: {
        en: "A small payment every three months to help with costs. The government uses your tax return to calculate it.",
        fr: "Un petit paiement tous les trois mois pour aider à payer les dépenses. Le gouvernement utilise votre déclaration de revenus pour le calculer.",
        ar: "دفعة صغيرة كل ثلاثة أشهر للمساعدة في التكاليف. تستخدم الحكومة إقرارك الضريبي لحسابها.",
      },
      nextStep: {
        en: "After your return is assessed, check your CRA account for payment dates.",
        fr: "Une fois votre déclaration évaluée, consultez votre compte de l'ARC pour connaître les dates de paiement.",
        ar: "بعد تقييم إقرارك، راجع حسابك لدى CRA لمعرفة مواعيد الدفع.",
      },
      channels: ["online", "phone"],
      completableOnline: true,
      documents: [
        {
          en: "Your filed tax return (synthetic list)",
          fr: "Votre déclaration de revenus produite (liste synthétique)",
          ar: "إقرارك الضريبي المقدَّم (قائمة اصطناعية)",
        },
      ],
      trigger: {
        q: "situation",
        op: "notIn",
        value: ["not_sure", "find_work"],
      },
      sourceId: "src_gst",
      glossary: ["income_tested", "tax_return"],
      whyShown: {
        en: "Shown because lower or changed income can make you eligible for income-tested credits.",
        fr: "Affiché parce qu'un revenu plus faible ou modifié peut vous rendre admissible à des crédits fondés sur le revenu.",
        ar: "يظهر هذا لأن الدخل المنخفض أو المتغيّر قد يجعلك مؤهلًا لأرصدة تعتمد على الدخل.",
      },
      humanHelp: {
        en: "A tax clinic volunteer can check that your return includes what this credit needs.",
        fr: "Un bénévole du comptoir d'impôts peut vérifier que votre déclaration contient ce dont ce crédit a besoin.",
        ar: "يمكن لمتطوع في عيادة الضرائب التأكد من أن إقرارك يتضمن ما يحتاجه هذا الرصيد.",
      },
    },
    {
      id: "prog_ccb",
      section: "explore",
      priority: 9,
      orgId: "org_cra",
      name: {
        en: "Canada Child Benefit",
        fr: "Allocation canadienne pour enfants",
        ar: "إعانة الطفل الكندية (Canada Child Benefit)",
      },
      shortTitle: {
        en: "Canada Child Benefit",
        fr: "Allocation canadienne pour enfants",
        ar: "إعانة الطفل الكندية",
      },
      oneLiner: {
        en: "A monthly payment to help with the cost of children.",
        fr: "Un paiement mensuel pour aider à payer les coûts liés aux enfants.",
        ar: "دفعة شهرية للمساعدة في تكاليف الأطفال.",
      },
      icon: "baby",
      action: {
        en: "Review the Canada Child Benefit",
        fr: "Examinez l'Allocation canadienne pour enfants",
        ar: "راجع إعانة الطفل الكندية (Canada Child Benefit)",
      },
      summary: {
        en: "A tax-free monthly payment to eligible families to help with the cost of raising children under 18.",
        fr: "Un paiement mensuel non imposable versé aux familles admissibles pour les aider à élever des enfants de moins de 18 ans.",
        ar: "دفعة شهرية معفاة من الضرائب للعائلات المؤهلة للمساعدة في تكاليف تربية الأطفال دون 18 عامًا.",
      },
      plain: {
        en: "A monthly payment for families with children under 18. The amount depends on your family income.",
        fr: "Un paiement mensuel pour les familles avec des enfants de moins de 18 ans. Le montant dépend du revenu familial.",
        ar: "دفعة شهرية للعائلات التي لديها أطفال دون 18 عامًا. يعتمد المبلغ على دخل أسرتك.",
      },
      nextStep: {
        en: "Apply for the child benefit. Both you and your spouse or partner may need to file taxes every year.",
        fr: "Faites une demande d'allocation pour enfants. Vous et votre époux ou conjoint devrez peut-être produire une déclaration chaque année.",
        ar: "قدّم طلب إعانة الطفل. قد تحتاج أنت وزوجك أو شريكك إلى تقديم إقرار ضريبي كل سنة.",
      },
      channels: ["online", "phone"],
      completableOnline: true,
      documents: [
        {
          en: "Proof of your immigration status and your children's (synthetic list)",
          fr: "Preuve de votre statut d'immigration et de celui de vos enfants (liste synthétique)",
          ar: "إثبات وضعك كمهاجر ووضع أطفالك (قائمة اصطناعية)",
        },
        {
          en: "Proof of income for the years before you arrived, if you arrived recently (synthetic list)",
          fr: "Preuve de revenu pour les années avant votre arrivée, si vous êtes arrivé récemment (liste synthétique)",
          ar: "إثبات الدخل للسنوات التي سبقت وصولك، إذا كنت قد وصلت مؤخرًا (قائمة اصطناعية)",
        },
      ],
      trigger: {
        q: "children",
        op: "in",
        value: ["1", "2", "3plus"],
      },
      sourceId: "src_ccb",
      glossary: ["income_tested"],
      whyShown: {
        en: "Shown because you told us children under 18 live with you.",
        fr: "Affiché parce que vous nous avez dit que des enfants de moins de 18 ans vivent avec vous.",
        ar: "يظهر هذا لأنك أخبرتنا أن أطفالًا دون 18 عامًا يعيشون معك.",
      },
      humanHelp: {
        en: "A settlement worker or tax clinic volunteer can help you apply and gather proof of status for your children.",
        fr: "Un intervenant en établissement ou un bénévole du comptoir d'impôts peut vous aider à faire la demande et à réunir la preuve de statut de vos enfants.",
        ar: "يمكن لمرشد الاستقرار أو لمتطوع في عيادة الضرائب مساعدتك في التقديم وجمع إثبات الوضع لأطفالك.",
      },
    },
    {
      id: "prog_ocb",
      section: "explore",
      priority: 10,
      orgId: "org_cra",
      name: {
        en: "Ontario Child Benefit",
        fr: "Prestation ontarienne pour enfants",
        ar: "إعانة الطفل في أونتاريو (Ontario Child Benefit)",
      },
      shortTitle: {
        en: "Ontario Child Benefit",
        fr: "Prestation ontarienne pour enfants",
        ar: "إعانة الطفل في أونتاريو",
      },
      oneLiner: {
        en: "A provincial payment for families with children.",
        fr: "Un paiement provincial pour les familles avec enfants.",
        ar: "دفعة إقليمية للعائلات التي لديها أطفال.",
      },
      icon: "baby",
      action: {
        en: "Review the Ontario Child Benefit",
        fr: "Examinez la Prestation ontarienne pour enfants",
        ar: "راجع إعانة الطفل في أونتاريو (Ontario Child Benefit)",
      },
      summary: {
        en: "A provincial payment for families with children, paid together with the Canada Child Benefit.",
        fr: "Un paiement provincial pour les familles avec enfants, versé avec l'Allocation canadienne pour enfants.",
        ar: "دفعة إقليمية للعائلات التي لديها أطفال، تُدفع مع إعانة الطفل الكندية (Canada Child Benefit).",
      },
      plain: {
        en: "An extra monthly amount from Ontario for families with children. You usually do not apply separately.",
        fr: "Un montant mensuel supplémentaire de l'Ontario pour les familles avec enfants. Habituellement, aucune demande distincte n'est requise.",
        ar: "مبلغ شهري إضافي من أونتاريو للعائلات التي لديها أطفال. عادةً لا تحتاج إلى تقديم طلب منفصل.",
      },
      nextStep: {
        en: "No separate application in this synthetic rule set. It follows your child benefit application.",
        fr: "Aucune demande distincte dans cet ensemble de règles synthétiques. Elle suit votre demande d'allocation pour enfants.",
        ar: "لا يوجد طلب منفصل في مجموعة القواعد الاصطناعية هذه. تتبع طلبك لإعانة الطفل.",
      },
      channels: ["online", "phone"],
      completableOnline: true,
      documents: [
        {
          en: "Same as the Canada Child Benefit (synthetic list)",
          fr: "Les mêmes que pour l'Allocation canadienne pour enfants (liste synthétique)",
          ar: "نفس وثائق إعانة الطفل الكندية (Canada Child Benefit) (قائمة اصطناعية)",
        },
      ],
      trigger: {
        all: [
          {
            q: "children",
            op: "in",
            value: ["1", "2", "3plus"],
          },
          {
            q: "province",
            op: "eq",
            value: "ON",
          },
        ],
      },
      sourceId: "src_ocb",
      glossary: [],
      whyShown: {
        en: "Shown because you live in Ontario and children under 18 live with you.",
        fr: "Affiché parce que vous habitez en Ontario et que des enfants de moins de 18 ans vivent avec vous.",
        ar: "يظهر هذا لأنك تسكن في أونتاريو ويعيش معك أطفال دون 18 عامًا.",
      },
      humanHelp: {
        en: "Ask the same person who helps you with the Canada Child Benefit.",
        fr: "Adressez-vous à la personne qui vous aide pour l'Allocation canadienne pour enfants.",
        ar: "اسأل الشخص نفسه الذي يساعدك في إعانة الطفل الكندية (Canada Child Benefit).",
      },
    },
    {
      id: "prog_otb",
      section: "explore",
      priority: 11,
      orgId: "org_cra",
      name: {
        en: "Ontario Trillium Benefit",
        fr: "Prestation Trillium de l'Ontario",
        ar: "إعانة أونتاريو تريليوم (Ontario Trillium Benefit)",
      },
      shortTitle: {
        en: "Ontario Trillium Benefit",
        fr: "Prestation Trillium de l'Ontario",
        ar: "إعانة أونتاريو تريليوم",
      },
      oneLiner: {
        en: "Help with energy costs, rent and sales tax.",
        fr: "De l'aide pour l'énergie, le loyer et la taxe de vente.",
        ar: "مساعدة في تكاليف الطاقة والإيجار وضريبة المبيعات.",
      },
      icon: "home",
      action: {
        en: "Review the Ontario Trillium Benefit",
        fr: "Examinez la Prestation Trillium de l'Ontario",
        ar: "راجع إعانة أونتاريو تريليوم (Ontario Trillium Benefit)",
      },
      summary: {
        en: "A provincial payment that combines credits for energy costs, property tax or rent, and sales tax.",
        fr: "Un paiement provincial qui regroupe des crédits pour les coûts d'énergie, l'impôt foncier ou le loyer, et la taxe de vente.",
        ar: "دفعة إقليمية تجمع أرصدة لتكاليف الطاقة وضريبة العقار أو الإيجار وضريبة المبيعات.",
      },
      plain: {
        en: "A payment from Ontario to help with rent and energy costs. You ask for it on your tax return.",
        fr: "Un paiement de l'Ontario pour aider à payer le loyer et l'énergie. Vous le demandez dans votre déclaration de revenus.",
        ar: "دفعة من أونتاريو للمساعدة في الإيجار وتكاليف الطاقة. تطلبها في إقرارك الضريبي.",
      },
      nextStep: {
        en: "Complete the provincial credit section of your tax return.",
        fr: "Remplissez la section des crédits provinciaux de votre déclaration de revenus.",
        ar: "أكمل قسم الأرصدة الإقليمية في إقرارك الضريبي.",
      },
      channels: ["online", "phone"],
      completableOnline: true,
      documents: [
        {
          en: "Rent receipts or property tax bills (synthetic list)",
          fr: "Reçus de loyer ou avis d'impôt foncier (liste synthétique)",
          ar: "إيصالات الإيجار أو فواتير ضريبة العقار (قائمة اصطناعية)",
        },
      ],
      trigger: {
        all: [
          {
            q: "province",
            op: "eq",
            value: "ON",
          },
          {
            q: "situation",
            op: "notIn",
            value: ["not_sure", "find_work"],
          },
        ],
      },
      sourceId: "src_otb",
      glossary: ["tax_return"],
      whyShown: {
        en: "Shown because you live in Ontario.",
        fr: "Affiché parce que vous habitez en Ontario.",
        ar: "يظهر هذا لأنك تسكن في أونتاريو.",
      },
      humanHelp: {
        en: "A tax clinic volunteer can complete this section of your return with you.",
        fr: "Un bénévole du comptoir d'impôts peut remplir cette section de votre déclaration avec vous.",
        ar: "يمكن لمتطوع في عيادة الضرائب إكمال هذا القسم من إقرارك معك.",
      },
    },
    {
      id: "prog_cdcp",
      section: "explore",
      priority: 12,
      orgId: "org_sc",
      name: {
        en: "Canadian Dental Care Plan",
        fr: "Régime canadien de soins dentaires",
        ar: "خطة رعاية الأسنان الكندية (Canadian Dental Care Plan)",
      },
      shortTitle: {
        en: "Canadian Dental Care Plan",
        fr: "Régime canadien de soins dentaires",
        ar: "خطة رعاية الأسنان الكندية",
      },
      oneLiner: {
        en: "Dental coverage if you have no dental insurance.",
        fr: "Une couverture dentaire si vous n'avez pas d'assurance dentaire.",
        ar: "تغطية لعلاج الأسنان إذا لم يكن لديك تأمين أسنان.",
      },
      icon: "smile",
      action: {
        en: "Review dental coverage",
        fr: "Examinez la couverture des soins dentaires",
        ar: "راجع تغطية علاج الأسنان",
      },
      summary: {
        en: "Dental coverage for residents without access to dental insurance, with family income under a set limit.",
        fr: "Couverture des soins dentaires pour les résidents sans assurance dentaire, dont le revenu familial est inférieur à une limite fixée.",
        ar: "تغطية لعلاج الأسنان للمقيمين الذين لا يحصلون على تأمين أسنان، ويقل دخل أسرتهم عن حد معيّن.",
      },
      plain: {
        en: "Help paying for the dentist if you do not have dental insurance. It uses your tax return.",
        fr: "De l'aide pour payer le dentiste si vous n'avez pas d'assurance dentaire. On utilise votre déclaration de revenus.",
        ar: "مساعدة في دفع تكاليف طبيب الأسنان إذا لم يكن لديك تأمين أسنان. تعتمد على إقرارك الضريبي.",
      },
      nextStep: {
        en: "Check whether you have dental insurance through work or family, then apply.",
        fr: "Vérifiez si vous avez une assurance dentaire par le travail ou la famille, puis faites une demande.",
        ar: "تحقّق مما إذا كان لديك تأمين أسنان من خلال العمل أو العائلة، ثم قدّم طلبك.",
      },
      channels: ["online", "phone", "in_person"],
      completableOnline: true,
      documents: [
        {
          en: "Your SIN and filed tax return (synthetic list)",
          fr: "Votre NAS et votre déclaration de revenus produite (liste synthétique)",
          ar: "رقم SIN الخاص بك وإقرارك الضريبي المقدَّم (قائمة اصطناعية)",
        },
      ],
      trigger: {
        q: "situation",
        op: "notIn",
        value: ["not_sure", "find_work"],
      },
      sourceId: "src_cdcp",
      glossary: ["income_tested"],
      whyShown: {
        en: "Shown because dental coverage is income-tested and you may not have insurance after a job change.",
        fr: "Affiché parce que la couverture dentaire est fondée sur le revenu et que vous n'avez peut-être plus d'assurance après un changement d'emploi.",
        ar: "يظهر هذا لأن تغطية الأسنان تعتمد على الدخل، وقد لا يكون لديك تأمين بعد تغيير العمل.",
      },
      humanHelp: {
        en: "Service Canada can answer questions about dental coverage by phone or in person.",
        fr: "Service Canada peut répondre à vos questions sur la couverture dentaire par téléphone ou en personne.",
        ar: "يمكن لخدمة كندا (Service Canada) الإجابة عن أسئلتك حول تغطية الأسنان عبر الهاتف أو حضوريًا.",
      },
    },
  ],
  rules: [
    {
      ruleId: "R-SIN-01",
      programId: "svc_sin",
      resultState: "action_required",
      dependencyIds: [],
      conditions: {
        q: "hasSin",
        op: "eq",
        value: "no",
      },
      explanation: {
        en: "You told us you do not have a SIN. A SIN may be needed to work and to receive government payments, so this comes first.",
        fr: "Vous nous avez dit ne pas avoir de NAS. Un NAS peut être nécessaire pour travailler et recevoir des paiements gouvernementaux; c'est donc la première étape.",
        ar: "أخبرتنا أنه ليس لديك رقم SIN. قد تحتاج إلى رقم SIN للعمل ولتلقي المدفوعات الحكومية، لذلك تأتي هذه الخطوة أولًا.",
      },
      sourceId: "src_sin",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Service Canada program reviewer]",
    },
    {
      ruleId: "R-SIN-02",
      programId: "svc_sin",
      resultState: "action_required",
      dependencyIds: [],
      conditions: {
        q: "sinCurrent",
        op: "eq",
        value: "expired",
      },
      explanation: {
        en: "You told us your SIN has expired or will expire soon. SINs that start with 9 are linked to your immigration document. Update it before applying for other supports.",
        fr: "Vous nous avez dit que votre NAS est expiré ou expirera bientôt. Les NAS qui commencent par 9 sont liés à votre document d'immigration. Mettez-le à jour avant de demander d'autres soutiens.",
        ar: "أخبرتنا أن رقم SIN الخاص بك انتهت صلاحيته أو ستنتهي قريبًا. أرقام SIN التي تبدأ بالرقم 9 مرتبطة بوثيقة الهجرة الخاصة بك. حدّثه قبل التقدم بطلب أشكال دعم أخرى.",
      },
      sourceId: "src_sin",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Service Canada program reviewer]",
    },
    {
      ruleId: "R-SIN-03",
      programId: "svc_sin",
      resultState: "action_required",
      dependencyIds: [],
      conditions: {
        any: [
          {
            q: "hasSin",
            op: "eq",
            value: "unsure",
          },
          {
            all: [
              {
                q: "hasSin",
                op: "eq",
                value: "yes",
              },
              {
                q: "sinCurrent",
                op: "missing",
              },
            ],
          },
        ],
      },
      explanation: {
        en: "You are not sure about your SIN status. Confirming it first avoids delays with work and payments.",
        fr: "Vous n'êtes pas certain de l'état de votre NAS. Le confirmer d'abord évite des retards pour le travail et les paiements.",
        ar: "لست متأكدًا من وضع رقم SIN الخاص بك. التأكد منه أولًا يجنّبك التأخير في العمل والمدفوعات.",
      },
      sourceId: "src_sin",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Service Canada program reviewer]",
    },
    {
      ruleId: "R-SIN-04",
      programId: "svc_sin",
      resultState: "done",
      dependencyIds: [],
      conditions: {
        all: [
          {
            q: "hasSin",
            op: "eq",
            value: "yes",
          },
          {
            q: "sinCurrent",
            op: "eq",
            value: "yes",
          },
        ],
      },
      explanation: {
        en: "You told us your SIN is valid. No action needed now.",
        fr: "Vous nous avez dit que votre NAS est valide. Aucune action n'est requise pour l'instant.",
        ar: "أخبرتنا أن رقم SIN الخاص بك صالح. لا حاجة إلى أي إجراء الآن.",
      },
      sourceId: "src_sin",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Service Canada program reviewer]",
    },
    {
      ruleId: "R-SIN-99",
      programId: "svc_sin",
      resultState: "needs_info",
      dependencyIds: [],
      missingQuestionIds: ["hasSin"],
      conditions: {
        always: true,
      },
      explanation: {
        en: "We did not ask about your SIN for this situation. A settlement worker or Service Canada can help you check it.",
        fr: "Nous n'avons pas posé de question sur votre NAS pour cette situation. Un intervenant en établissement ou Service Canada peut vous aider à le vérifier.",
        ar: "لم نسأل عن رقم SIN في هذه الحالة. يمكن لمرشد الاستقرار أو لخدمة كندا (Service Canada) مساعدتك في التحقق منه.",
      },
      sourceId: "src_sin",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Service Canada program reviewer]",
    },
    {
      ruleId: "R-TAX-01",
      programId: "svc_tax",
      resultState: "action_required",
      dependencyIds: [],
      conditions: {
        q: "filedTax",
        op: "eq",
        value: "no",
      },
      explanation: {
        en: "You told us you have not filed a Canadian income tax return yet. Several benefits and credits are calculated from it, so filing comes first.",
        fr: "Vous nous avez dit que vous n'avez pas encore produit de déclaration de revenus canadienne. Plusieurs prestations et crédits sont calculés à partir de celle-ci; il faut donc la produire en premier.",
        ar: "أخبرتنا أنك لم تقدّم إقرارًا ضريبيًا كنديًا بعد. تُحسب عدة إعانات وأرصدة منه، لذلك يأتي تقديمه أولًا.",
      },
      sourceId: "src_tax",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA program reviewer]",
    },
    {
      ruleId: "R-TAX-02",
      programId: "svc_tax",
      resultState: "action_required",
      dependencyIds: [],
      conditions: {
        q: "filedTax",
        op: "eq",
        value: "unsure",
      },
      explanation: {
        en: "You are not sure whether you have filed a Canadian return. Check through the CRA, by phone or at a free tax clinic before you apply for benefits.",
        fr: "Vous ne savez pas si vous avez produit une déclaration canadienne. Vérifiez auprès de l'ARC, par téléphone ou dans un comptoir d'impôts gratuit avant de demander des prestations.",
        ar: "لست متأكدًا مما إذا كنت قد قدّمت إقرارًا كنديًا. تحقّق عبر وكالة الإيرادات الكندية أو بالهاتف أو في عيادة ضرائب مجانية قبل التقدم بطلب الإعانات.",
      },
      sourceId: "src_tax",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA program reviewer]",
    },
    {
      ruleId: "R-TAX-04",
      programId: "svc_tax",
      resultState: "done",
      dependencyIds: [],
      conditions: {
        q: "filedTax",
        op: "eq",
        value: "yes",
      },
      explanation: {
        en: "You told us you have filed a Canadian income tax return before. Keep filing every year; no extra step is shown now.",
        fr: "Vous nous avez dit avoir déjà produit une déclaration de revenus canadienne. Continuez de la produire chaque année; aucune autre étape n'est affichée pour l'instant.",
        ar: "أخبرتنا أنك قدّمت إقرارًا ضريبيًا كنديًا من قبل. استمر في تقديمه كل عام؛ لا توجد خطوة إضافية الآن.",
      },
      sourceId: "src_tax",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA program reviewer]",
    },
    {
      ruleId: "R-TAX-99",
      programId: "svc_tax",
      resultState: "needs_info",
      dependencyIds: [],
      missingQuestionIds: ["filedTax"],
      conditions: {
        always: true,
      },
      explanation: {
        en: "We don't know whether you have filed a Canadian tax return. A free tax clinic or settlement worker can help you check.",
        fr: "Nous ne savons pas si vous avez produit une déclaration de revenus canadienne. Un comptoir d'impôts gratuit ou un intervenant en établissement peut vous aider à vérifier.",
        ar: "لا نعرف ما إذا كنت قد قدّمت إقرارًا ضريبيًا كنديًا. يمكن لعيادة ضرائب مجانية أو لمرشد الاستقرار مساعدتك في التحقق.",
      },
      sourceId: "src_tax",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA program reviewer]",
    },
    {
      ruleId: "R-EI-01",
      programId: "prog_ei",
      resultState: "needs_info",
      dependencyIds: [],
      missingQuestionIds: ["workStatus"],
      conditions: {
        q: "workStatus",
        op: "missing",
      },
      explanation: {
        en: "We need to know your work situation to say more about Employment Insurance. Rather than guess, a person can look at your situation with you.",
        fr: "Nous devons connaître votre situation de travail pour en dire plus sur l'assurance-emploi. Plutôt que de deviner, une personne peut examiner votre situation avec vous.",
        ar: "نحتاج إلى معرفة وضعك في العمل لنقول المزيد عن تأمين العمل. بدلًا من التخمين، يمكن لشخص أن يراجع وضعك معك.",
      },
      sourceId: "src_ei",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — ESDC EI policy reviewer]",
    },
    {
      ruleId: "R-EI-02",
      programId: "prog_ei",
      resultState: "unlikely",
      dependencyIds: [],
      missingQuestionIds: [],
      conditions: {
        q: "workStatus",
        op: "in",
        value: ["worked_abroad", "first_job"],
      },
      explanation: {
        en: "Employment Insurance is based on hours worked in Canada. You told us you have not worked in Canada yet, so EI probably does not apply now. Employment services can help you find work.",
        fr: "L'assurance-emploi est fondée sur les heures travaillées au Canada. Vous nous avez dit ne pas avoir encore travaillé au Canada; l'AE ne s'applique donc probablement pas pour l'instant. Les services d'emploi peuvent vous aider à trouver du travail.",
        ar: "يعتمد تأمين العمل على ساعات العمل في كندا. أخبرتنا أنك لم تعمل في كندا بعد، لذا لا ينطبق عليك تأمين العمل على الأرجح الآن. يمكن لخدمات التوظيف مساعدتك في إيجاد عمل.",
      },
      sourceId: "src_ei",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — ESDC EI policy reviewer]",
    },
    {
      ruleId: "R-EI-03",
      programId: "prog_ei",
      resultState: "unlikely",
      dependencyIds: [],
      missingQuestionIds: [],
      conditions: {
        q: "workStatus",
        op: "in",
        value: ["studying", "not_looking"],
      },
      explanation: {
        en: "EI regular benefits are for people who lost work and are available to work. Based on your answer, they probably do not apply now. Service Canada can confirm.",
        fr: "Les prestations régulières d'AE visent les personnes qui ont perdu leur travail et sont disponibles pour travailler. Selon votre réponse, elles ne s'appliquent probablement pas pour l'instant. Service Canada peut confirmer.",
        ar: "الإعانات العادية لتأمين العمل مخصّصة لمن فقدوا عملهم وهم متاحون للعمل. بناءً على إجابتك، لا تنطبق عليك على الأرجح الآن. يمكن لـ Service Canada التأكيد.",
      },
      sourceId: "src_ei",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — ESDC EI policy reviewer]",
    },
    {
      ruleId: "R-EI-04",
      programId: "prog_ei",
      resultState: "not_yet",
      dependencyIds: ["svc_sin"],
      missingQuestionIds: [],
      conditions: {
        result: "svc_sin",
        resultIn: ["action_required"],
      },
      explanation: {
        en: "You may be able to apply, but the application asks for a valid SIN. Complete the SIN step first.",
        fr: "Vous pourriez peut-être présenter une demande, mais elle exige un NAS valide. Faites d'abord l'étape du NAS.",
        ar: "قد تتمكن من التقديم، لكن الطلب يتطلب رقم SIN صالحًا. أكمل خطوة رقم SIN أولًا.",
      },
      sourceId: "src_ei",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — ESDC EI policy reviewer]",
    },
    {
      ruleId: "R-EI-05",
      programId: "prog_ei",
      resultState: "maybe",
      dependencyIds: ["svc_sin"],
      missingQuestionIds: [],
      conditions: {
        q: "workStatus",
        op: "in",
        value: ["working", "looking"],
      },
      explanation: {
        en: "This may apply to you. EI depends on your hours worked in Canada and the reason your work stopped or was reduced. This prototype does not assess those; Service Canada decides.",
        fr: "Cela pourrait s'appliquer à vous. L'AE dépend de vos heures travaillées au Canada et de la raison de la fin ou de la réduction de votre travail. Ce prototype ne les évalue pas; Service Canada décide.",
        ar: "قد ينطبق هذا عليك. يعتمد تأمين العمل على ساعات عملك في كندا وسبب توقف عملك أو تقليصه. لا يقيّم هذا النموذج ذلك؛ Service Canada هي التي تقرر.",
      },
      sourceId: "src_ei",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — ESDC EI policy reviewer]",
    },
    {
      ruleId: "R-EI-99",
      programId: "prog_ei",
      resultState: "needs_info",
      dependencyIds: [],
      missingQuestionIds: ["workStatus"],
      conditions: {
        always: true,
      },
      explanation: {
        en: "We could not match your answers to a rule. A person can help.",
        fr: "Nous n'avons pas pu associer vos réponses à une règle. Une personne peut vous aider.",
        ar: "لم نتمكن من مطابقة إجاباتك مع قاعدة. يمكن لشخص أن يساعدك.",
      },
      sourceId: "src_ei",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — ESDC EI policy reviewer]",
    },
    {
      ruleId: "R-EMP-00",
      programId: "prog_employment",
      resultState: "unlikely",
      dependencyIds: [],
      conditions: {
        q: "workStatus",
        op: "eq",
        value: "not_looking",
      },
      explanation: {
        en: "You told us you are not looking for work right now, so employment services are not on your path. You can come back to them at any time.",
        fr: "Vous nous avez dit ne pas chercher de travail en ce moment; les services d'emploi ne figurent donc pas dans votre parcours. Vous pourrez y revenir à tout moment.",
        ar: "أخبرتنا أنك لا تبحث عن عمل الآن، لذلك لا تظهر خدمات التوظيف في مسارك. يمكنك العودة إليها في أي وقت.",
      },
      sourceId: "src_emp",
      lastReviewed: "2026-10-15",
      owner:
        "[Rule owner placeholder — provincial employment program reviewer]",
      missingQuestionIds: [],
    },
    {
      ruleId: "R-EMP-01",
      programId: "prog_employment",
      resultState: "needs_info",
      dependencyIds: [],
      missingQuestionIds: ["workAuth"],
      conditions: {
        q: "workAuth",
        op: "missing",
      },
      explanation: {
        en: "Some employment services depend on whether you are allowed to work in Canada. We don't decide this for you: check the official information or ask a settlement worker.",
        fr: "Certains services d'emploi dépendent de votre droit de travailler au Canada. Nous ne le décidons pas pour vous : consultez l'information officielle ou un intervenant en établissement.",
        ar: "تعتمد بعض خدمات التوظيف على ما إذا كان مسموحًا لك بالعمل في كندا. لا نقرر ذلك نيابة عنك: راجع المعلومات الرسمية أو اسأل مرشد الاستقرار.",
      },
      sourceId: "src_emp",
      lastReviewed: "2026-10-15",
      owner:
        "[Rule owner placeholder — provincial employment program reviewer]",
    },
    {
      ruleId: "R-EMP-02",
      programId: "prog_employment",
      resultState: "maybe",
      dependencyIds: [],
      conditions: {
        q: "workAuth",
        op: "eq",
        value: "no",
      },
      explanation: {
        en: "You told us you are not allowed to work now. Some job-readiness and language help may still be open to you through settlement services.",
        fr: "Vous nous avez dit ne pas avoir le droit de travailler pour l'instant. Une aide à la préparation à l'emploi et une aide linguistique pourraient quand même vous être offertes par les services d'établissement.",
        ar: "أخبرتنا أنه غير مسموح لك بالعمل الآن. قد تظل بعض خدمات الاستعداد للعمل ودعم اللغة متاحة لك عبر خدمات الاستقرار.",
      },
      sourceId: "src_emp",
      lastReviewed: "2026-10-15",
      owner:
        "[Rule owner placeholder — provincial employment program reviewer]",
    },
    {
      ruleId: "R-EMP-03",
      programId: "prog_employment",
      resultState: "likely",
      dependencyIds: [],
      conditions: {
        all: [
          {
            q: "workAuth",
            op: "eq",
            value: "yes",
          },
          {
            q: "province",
            op: "eq",
            value: "ON",
          },
        ],
      },
      explanation: {
        en: "You told us you are allowed to work and live in Ontario. In this prototype rule set, employment services are worth checking now.",
        fr: "Vous nous avez dit avoir le droit de travailler et habiter en Ontario. Dans les règles de ce prototype, les services d'emploi valent la peine d'être consultés maintenant.",
        ar: "أخبرتنا أنه مسموح لك بالعمل وأنك تعيش في أونتاريو. وفق قواعد هذا النموذج، تستحق خدمات التوظيف أن تتحقق منها الآن.",
      },
      sourceId: "src_emp",
      lastReviewed: "2026-10-15",
      owner:
        "[Rule owner placeholder — provincial employment program reviewer]",
    },
    {
      ruleId: "R-EMP-99",
      programId: "prog_employment",
      resultState: "maybe",
      dependencyIds: [],
      conditions: {
        always: true,
      },
      explanation: {
        en: "Employment services are offered in every province and territory. Details vary by location.",
        fr: "Des services d'emploi sont offerts dans toutes les provinces et tous les territoires. Les détails varient selon l'endroit.",
        ar: "تُقدَّم خدمات التوظيف في كل مقاطعة وإقليم. تختلف التفاصيل حسب المكان.",
      },
      sourceId: "src_emp",
      lastReviewed: "2026-10-15",
      owner:
        "[Rule owner placeholder — provincial employment program reviewer]",
    },
    {
      ruleId: "R-211-01",
      programId: "svc_basic_needs",
      resultState: "likely",
      dependencyIds: [],
      conditions: {
        always: true,
      },
      explanation: {
        en: "Community referral is open to anyone. It does not depend on status, SIN or taxes.",
        fr: "L'orientation communautaire est ouverte à tous. Elle ne dépend ni du statut, ni du NAS, ni des impôts.",
        ar: "الإحالة المجتمعية متاحة للجميع. لا تعتمد على الوضع أو رقم SIN أو الضرائب.",
      },
      sourceId: "src_211",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — 211 service partner]",
    },
    {
      ruleId: "R-SET-01",
      programId: "svc_settlement",
      resultState: "likely",
      dependencyIds: [],
      conditions: {
        q: "status",
        op: "in",
        value: ["pr", "protected_person"],
      },
      explanation: {
        en: "IRCC-funded settlement services are generally available to permanent residents and protected persons.",
        fr: "Les services d'établissement financés par IRCC sont généralement offerts aux résidents permanents et aux personnes protégées.",
        ar: "خدمات الاستقرار التي تموّلها IRCC متاحة عمومًا للمقيمين الدائمين والأشخاص المحميين.",
      },
      sourceId: "src_settlement",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — IRCC settlement program reviewer]",
    },
    {
      ruleId: "R-SET-03",
      programId: "svc_settlement",
      resultState: "maybe",
      dependencyIds: [],
      conditions: {
        q: "status",
        op: "in",
        value: ["work_permit", "study_permit", "refugee_claimant"],
      },
      explanation: {
        en: "Some settlement services are open to temporary residents and refugee claimants. The organization will confirm what it can offer.",
        fr: "Certains services d'établissement sont ouverts aux résidents temporaires et aux demandeurs d'asile. L'organisme confirmera ce qu'il peut offrir.",
        ar: "بعض خدمات الاستقرار متاحة للمقيمين المؤقتين وطالبي اللجوء. ستؤكد المنظمة ما يمكنها تقديمه.",
      },
      sourceId: "src_settlement",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — IRCC settlement program reviewer]",
    },
    {
      ruleId: "R-SET-99",
      programId: "svc_settlement",
      resultState: "needs_info",
      dependencyIds: [],
      missingQuestionIds: ["status"],
      conditions: {
        always: true,
      },
      explanation: {
        en: "We need your immigration status to say more. A settlement organization can tell you right away whether it can help.",
        fr: "Nous avons besoin de votre statut d'immigration pour en dire plus. Un organisme d'établissement peut vous dire tout de suite s'il peut vous aider.",
        ar: "نحتاج إلى معرفة وضعك كمهاجر لنقول المزيد. يمكن لمنظمة استقرار أن تخبرك فورًا إن كانت تستطيع مساعدتك.",
      },
      sourceId: "src_settlement",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — IRCC settlement program reviewer]",
    },
    {
      ruleId: "R-OW-01",
      programId: "prog_ow",
      resultState: "needs_info",
      dependencyIds: [],
      missingQuestionIds: ["income", "status"],
      conditions: {
        any: [
          {
            q: "income",
            op: "missing",
          },
          {
            q: "status",
            op: "missing",
          },
        ],
      },
      explanation: {
        en: "This support depends on your income, savings and status. You did not share your income range or status, so we will not guess. A settlement worker or the local office can help.",
        fr: "Ce soutien dépend de votre revenu, de vos économies et de votre statut. Vous n'avez pas indiqué votre fourchette de revenu ou votre statut; nous ne devinerons donc pas. Un intervenant en établissement ou le bureau local peut aider.",
        ar: "يعتمد هذا الدعم على دخلك ومدخراتك ووضعك. لم تشارك نطاق دخلك أو وضعك، لذلك لن نخمّن. يمكن لمرشد الاستقرار أو للمكتب المحلي مساعدتك.",
      },
      sourceId: "src_ow",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — provincial social assistance reviewer]",
    },
    {
      ruleId: "R-OW-02",
      programId: "prog_ow",
      resultState: "unlikely",
      dependencyIds: [],
      conditions: {
        q: "status",
        op: "in",
        value: ["work_permit", "study_permit"],
      },
      explanation: {
        en: "In this synthetic rule set, temporary residents are generally not eligible. The local office makes the final decision.",
        fr: "Dans cet ensemble de règles synthétiques, les résidents temporaires ne sont généralement pas admissibles. Le bureau local prend la décision finale.",
        ar: "في مجموعة القواعد الاصطناعية هذه، المقيمون المؤقتون عمومًا غير مؤهلين. المكتب المحلي هو من يتخذ القرار النهائي.",
      },
      sourceId: "src_ow",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — provincial social assistance reviewer]",
    },
    {
      ruleId: "R-OW-03",
      programId: "prog_ow",
      resultState: "maybe",
      dependencyIds: [],
      conditions: {
        any: [
          {
            q: "income",
            op: "eq",
            value: "under20",
          },
          {
            all: [
              {
                q: "income",
                op: "eq",
                value: "20to40",
              },
              {
                q: "children",
                op: "in",
                value: ["1", "2", "3plus"],
              },
            ],
          },
        ],
      },
      explanation: {
        en: "Your income range suggests you may be eligible. The local office also checks savings, assets and your current month's income.",
        fr: "Votre fourchette de revenu indique que vous pourriez être admissible. Le bureau local vérifie aussi vos économies, vos biens et votre revenu du mois en cours.",
        ar: "يشير نطاق دخلك إلى أنك قد تكون مؤهلًا. يتحقق المكتب المحلي أيضًا من المدخرات والأصول ودخلك في الشهر الحالي.",
      },
      sourceId: "src_ow",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — provincial social assistance reviewer]",
    },
    {
      ruleId: "R-OW-99",
      programId: "prog_ow",
      resultState: "unlikely",
      dependencyIds: [],
      conditions: {
        always: true,
      },
      explanation: {
        en: "Your income range is probably above what this support allows. If your income has dropped suddenly, ask the local office.",
        fr: "Votre fourchette de revenu dépasse probablement ce que permet ce soutien. Si votre revenu a chuté soudainement, renseignez-vous auprès du bureau local.",
        ar: "نطاق دخلك على الأرجح أعلى مما يسمح به هذا الدعم. إذا انخفض دخلك فجأة، فاسأل المكتب المحلي.",
      },
      sourceId: "src_ow",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — provincial social assistance reviewer]",
    },
    {
      ruleId: "R-GST-01",
      programId: "prog_gst",
      resultState: "not_yet",
      dependencyIds: ["svc_tax"],
      conditions: {
        result: "svc_tax",
        resultIn: ["action_required"],
      },
      explanation: {
        en: "This credit is calculated from your tax return. File or confirm your return first.",
        fr: "Ce crédit est calculé à partir de votre déclaration de revenus. Produisez ou confirmez d'abord votre déclaration.",
        ar: "يُحسب هذا الرصيد بناءً على إقرارك الضريبي. قدّم إقرارك أو تأكّد منه أولًا.",
      },
      sourceId: "src_gst",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-GST-02",
      programId: "prog_gst",
      resultState: "needs_info",
      dependencyIds: ["svc_tax"],
      missingQuestionIds: ["filedTax", "income"],
      conditions: {
        any: [
          {
            result: "svc_tax",
            resultIn: ["needs_info"],
          },
          {
            q: "income",
            op: "missing",
          },
        ],
      },
      explanation: {
        en: "We need to know whether you filed taxes and your approximate income to say more.",
        fr: "Nous devons savoir si vous avez produit une déclaration et connaître votre revenu approximatif pour en dire plus.",
        ar: "نحتاج إلى معرفة ما إذا كنت قد قدّمت إقرارك الضريبي ودخلك التقريبي لنقول المزيد.",
      },
      sourceId: "src_gst",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-GST-03",
      programId: "prog_gst",
      resultState: "likely",
      dependencyIds: ["svc_tax"],
      conditions: {
        q: "income",
        op: "in",
        value: ["under20", "20to40"],
      },
      explanation: {
        en: "Your tax step is complete and your income range is in the lower ranges used by this synthetic rule. The CRA calculates the actual amount.",
        fr: "Votre étape fiscale est terminée et votre fourchette de revenu se situe dans les tranches inférieures utilisées par cette règle synthétique. L'ARC calcule le montant réel.",
        ar: "خطوة الضرائب مكتملة، ونطاق دخلك ضمن النطاقات الأدنى التي تستخدمها هذه القاعدة الاصطناعية. تحسب CRA المبلغ الفعلي.",
      },
      sourceId: "src_gst",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-GST-04",
      programId: "prog_gst",
      resultState: "maybe",
      dependencyIds: ["svc_tax"],
      conditions: {
        q: "income",
        op: "eq",
        value: "40to60",
      },
      explanation: {
        en: "At your income range, the credit depends on family size. You may receive a reduced amount.",
        fr: "Dans votre fourchette de revenu, le crédit dépend de la taille de la famille. Vous pourriez recevoir un montant réduit.",
        ar: "في نطاق دخلك، يعتمد الرصيد على حجم الأسرة. قد تحصل على مبلغ مخفَّض.",
      },
      sourceId: "src_gst",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-GST-99",
      programId: "prog_gst",
      resultState: "unlikely",
      dependencyIds: ["svc_tax"],
      conditions: {
        always: true,
      },
      explanation: {
        en: "At your income range, this credit is probably reduced to zero. The CRA checks automatically when you file.",
        fr: "Dans votre fourchette de revenu, ce crédit est probablement réduit à zéro. L'ARC vérifie automatiquement quand vous produisez votre déclaration.",
        ar: "في نطاق دخلك، يُخفَّض هذا الرصيد على الأرجح إلى صفر. تتحقق CRA من ذلك تلقائيًا عند تقديم إقرارك.",
      },
      sourceId: "src_gst",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-CCB-01",
      programId: "prog_ccb",
      resultState: "unlikely",
      dependencyIds: [],
      conditions: {
        q: "status",
        op: "eq",
        value: "refugee_claimant",
      },
      explanation: {
        en: "In this synthetic rule set, refugee claimants are not eligible until their status changes. A settlement worker can explain other family supports.",
        fr: "Dans cet ensemble de règles synthétiques, les demandeurs d'asile ne sont pas admissibles avant un changement de statut. Un intervenant en établissement peut expliquer d'autres soutiens aux familles.",
        ar: "في مجموعة القواعد الاصطناعية هذه، طالبو اللجوء غير مؤهلين حتى يتغير وضعهم. يمكن لمرشد الاستقرار شرح أشكال أخرى من دعم الأسرة.",
      },
      sourceId: "src_ccb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-CCB-02",
      programId: "prog_ccb",
      resultState: "not_yet",
      dependencyIds: ["svc_tax"],
      conditions: {
        result: "svc_tax",
        resultIn: ["action_required"],
      },
      explanation: {
        en: "Child benefits are calculated from your Canadian income tax return. File a Canadian return first; then this may become available.",
        fr: "Les prestations pour enfants sont calculées à partir de votre déclaration de revenus canadienne. Produisez d'abord une déclaration canadienne; cette prestation pourrait ensuite devenir accessible.",
        ar: "تُحسب إعانات الأطفال من إقرارك الضريبي الكندي. قدّم إقرارًا كنديًا أولًا؛ ثم قد تصبح هذه الإعانة متاحة.",
      },
      sourceId: "src_ccb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-CCB-03",
      programId: "prog_ccb",
      resultState: "needs_info",
      dependencyIds: ["svc_tax"],
      missingQuestionIds: ["status", "filedTax"],
      conditions: {
        any: [
          {
            q: "status",
            op: "missing",
          },
          {
            result: "svc_tax",
            resultIn: ["needs_info"],
          },
        ],
      },
      explanation: {
        en: "Child benefits depend on immigration status and tax filing. We need those answers to say more.",
        fr: "Les prestations pour enfants dépendent du statut d'immigration et de la production des déclarations. Nous avons besoin de ces réponses pour en dire plus.",
        ar: "تعتمد إعانات الأطفال على وضع الهجرة وتقديم الإقرار الضريبي. نحتاج إلى هذه الإجابات لنقول المزيد.",
      },
      sourceId: "src_ccb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-CCB-04",
      programId: "prog_ccb",
      resultState: "likely",
      dependencyIds: ["svc_tax"],
      conditions: {
        q: "status",
        op: "in",
        value: ["pr", "protected_person"],
      },
      explanation: {
        en: "You have children under 18, your status is one this synthetic rule accepts, and your tax step is in place. The CRA decides the amount.",
        fr: "Vous avez des enfants de moins de 18 ans, votre statut est accepté par cette règle synthétique et votre étape fiscale est en place. L'ARC décide du montant.",
        ar: "لديك أطفال دون 18 عامًا، ووضعك من الأوضاع التي تقبلها هذه القاعدة الاصطناعية، وخطوة الضرائب لديك مكتملة. تحدد CRA المبلغ.",
      },
      sourceId: "src_ccb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-CCB-05",
      programId: "prog_ccb",
      resultState: "maybe",
      dependencyIds: ["svc_tax"],
      conditions: {
        q: "status",
        op: "in",
        value: ["work_permit", "study_permit"],
      },
      explanation: {
        en: "Temporary residents may qualify after living in Canada for a set period with a valid permit. We did not ask how long you have been here.",
        fr: "Les résidents temporaires peuvent être admissibles après avoir vécu au Canada pendant une période déterminée avec un permis valide. Nous n'avons pas demandé depuis combien de temps vous êtes ici.",
        ar: "قد يصبح المقيمون المؤقتون مؤهلين بعد العيش في كندا لفترة محددة مع تصريح صالح. لم نسأل منذ متى أنت هنا.",
      },
      sourceId: "src_ccb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-CCB-99",
      programId: "prog_ccb",
      resultState: "needs_info",
      dependencyIds: [],
      missingQuestionIds: ["status"],
      conditions: {
        always: true,
      },
      explanation: {
        en: "We could not match your answers to a rule. A person can help.",
        fr: "Nous n'avons pas pu associer vos réponses à une règle. Une personne peut vous aider.",
        ar: "لم نتمكن من مطابقة إجاباتك مع قاعدة. يمكن لشخص أن يساعدك.",
      },
      sourceId: "src_ccb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — CRA benefits reviewer]",
    },
    {
      ruleId: "R-OCB-01",
      programId: "prog_ocb",
      resultState: "likely",
      dependencyIds: ["prog_ccb"],
      conditions: {
        result: "prog_ccb",
        resultIn: ["likely"],
      },
      explanation: {
        en: "This provincial payment follows the Canada Child Benefit, which you are likely eligible for.",
        fr: "Ce paiement provincial suit l'Allocation canadienne pour enfants, à laquelle vous êtes probablement admissible.",
        ar: "تتبع هذه الدفعة الإقليمية إعانة الطفل الكندية (Canada Child Benefit)، التي من المرجّح أنك مؤهل لها.",
      },
      sourceId: "src_ocb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Ontario benefits reviewer]",
    },
    {
      ruleId: "R-OCB-02",
      programId: "prog_ocb",
      resultState: "maybe",
      dependencyIds: ["prog_ccb"],
      conditions: {
        result: "prog_ccb",
        resultIn: ["maybe"],
      },
      explanation: {
        en: "This provincial payment follows the Canada Child Benefit, which you may be eligible for.",
        fr: "Ce paiement provincial suit l'Allocation canadienne pour enfants, à laquelle vous pourriez être admissible.",
        ar: "تتبع هذه الدفعة الإقليمية إعانة الطفل الكندية (Canada Child Benefit)، التي قد تكون مؤهلًا لها.",
      },
      sourceId: "src_ocb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Ontario benefits reviewer]",
    },
    {
      ruleId: "R-OCB-03",
      programId: "prog_ocb",
      resultState: "not_yet",
      dependencyIds: ["prog_ccb", "svc_tax"],
      conditions: {
        result: "prog_ccb",
        resultIn: ["not_yet"],
      },
      explanation: {
        en: "This payment follows the Canada Child Benefit, which needs your tax return first.",
        fr: "Ce paiement suit l'Allocation canadienne pour enfants, qui exige d'abord votre déclaration de revenus.",
        ar: "تتبع هذه الدفعة إعانة الطفل الكندية (Canada Child Benefit)، التي تحتاج أولًا إلى إقرارك الضريبي.",
      },
      sourceId: "src_ocb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Ontario benefits reviewer]",
    },
    {
      ruleId: "R-OCB-04",
      programId: "prog_ocb",
      resultState: "unlikely",
      dependencyIds: ["prog_ccb"],
      conditions: {
        result: "prog_ccb",
        resultIn: ["unlikely"],
      },
      explanation: {
        en: "This payment follows the Canada Child Benefit, which probably does not apply to you right now.",
        fr: "Ce paiement suit l'Allocation canadienne pour enfants, qui ne s'applique probablement pas à vous pour l'instant.",
        ar: "تتبع هذه الدفعة إعانة الطفل الكندية (Canada Child Benefit)، التي على الأرجح لا تنطبق عليك الآن.",
      },
      sourceId: "src_ocb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Ontario benefits reviewer]",
    },
    {
      ruleId: "R-OCB-99",
      programId: "prog_ocb",
      resultState: "needs_info",
      dependencyIds: ["prog_ccb"],
      missingQuestionIds: ["status"],
      conditions: {
        always: true,
      },
      explanation: {
        en: "This payment follows the Canada Child Benefit. We need more information about that first.",
        fr: "Ce paiement suit l'Allocation canadienne pour enfants. Nous avons d'abord besoin de plus de renseignements à ce sujet.",
        ar: "تتبع هذه الدفعة إعانة الطفل الكندية (Canada Child Benefit). نحتاج أولًا إلى مزيد من المعلومات عنها.",
      },
      sourceId: "src_ocb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Ontario benefits reviewer]",
    },
    {
      ruleId: "R-OTB-01",
      programId: "prog_otb",
      resultState: "not_yet",
      dependencyIds: ["svc_tax"],
      conditions: {
        result: "svc_tax",
        resultIn: ["action_required"],
      },
      explanation: {
        en: "You apply for this payment on your tax return. File or confirm your return first.",
        fr: "Vous demandez ce paiement dans votre déclaration de revenus. Produisez ou confirmez d'abord votre déclaration.",
        ar: "تطلب هذه الدفعة في إقرارك الضريبي. قدّم إقرارك أو تأكّد منه أولًا.",
      },
      sourceId: "src_otb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Ontario benefits reviewer]",
    },
    {
      ruleId: "R-OTB-02",
      programId: "prog_otb",
      resultState: "needs_info",
      dependencyIds: ["svc_tax"],
      missingQuestionIds: ["income", "filedTax"],
      conditions: {
        any: [
          {
            q: "income",
            op: "missing",
          },
          {
            result: "svc_tax",
            resultIn: ["needs_info"],
          },
        ],
      },
      explanation: {
        en: "We need your approximate income and tax filing status to say more.",
        fr: "Nous avons besoin de votre revenu approximatif et de l'état de votre déclaration pour en dire plus.",
        ar: "نحتاج إلى دخلك التقريبي ووضع تقديم إقرارك الضريبي لنقول المزيد.",
      },
      sourceId: "src_otb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Ontario benefits reviewer]",
    },
    {
      ruleId: "R-OTB-03",
      programId: "prog_otb",
      resultState: "maybe",
      dependencyIds: ["svc_tax"],
      conditions: {
        q: "income",
        op: "in",
        value: ["under20", "20to40", "40to60"],
      },
      explanation: {
        en: "You may be eligible. The amount also depends on rent or property tax and energy costs, which we did not ask about.",
        fr: "Vous pourriez être admissible. Le montant dépend aussi du loyer ou de l'impôt foncier et des coûts d'énergie, que nous n'avons pas demandés.",
        ar: "قد تكون مؤهلًا. يعتمد المبلغ أيضًا على الإيجار أو ضريبة العقار وتكاليف الطاقة، ولم نسأل عنها.",
      },
      sourceId: "src_otb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Ontario benefits reviewer]",
    },
    {
      ruleId: "R-OTB-99",
      programId: "prog_otb",
      resultState: "unlikely",
      dependencyIds: ["svc_tax"],
      conditions: {
        always: true,
      },
      explanation: {
        en: "At your income range, this payment is probably reduced to zero. It is checked automatically when you file.",
        fr: "Dans votre fourchette de revenu, ce paiement est probablement réduit à zéro. Il est vérifié automatiquement lorsque vous produisez votre déclaration.",
        ar: "في نطاق دخلك، تُخفَّض هذه الدفعة على الأرجح إلى صفر. يتم التحقق من ذلك تلقائيًا عند تقديم إقرارك.",
      },
      sourceId: "src_otb",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Ontario benefits reviewer]",
    },
    {
      ruleId: "R-DEN-01",
      programId: "prog_cdcp",
      resultState: "not_yet",
      dependencyIds: ["svc_tax"],
      conditions: {
        result: "svc_tax",
        resultIn: ["action_required"],
      },
      explanation: {
        en: "Dental coverage uses your tax return to check your family income. File or confirm your return first.",
        fr: "La couverture dentaire utilise votre déclaration de revenus pour vérifier le revenu familial. Produisez ou confirmez d'abord votre déclaration.",
        ar: "تستخدم تغطية الأسنان إقرارك الضريبي للتحقق من دخل أسرتك. قدّم إقرارك أو تأكّد منه أولًا.",
      },
      sourceId: "src_cdcp",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Health Canada / ESDC reviewer]",
    },
    {
      ruleId: "R-DEN-02",
      programId: "prog_cdcp",
      resultState: "needs_info",
      dependencyIds: ["svc_tax"],
      missingQuestionIds: ["income", "filedTax"],
      conditions: {
        any: [
          {
            q: "income",
            op: "missing",
          },
          {
            q: "income",
            op: "eq",
            value: "over60",
          },
          {
            result: "svc_tax",
            resultIn: ["needs_info"],
          },
        ],
      },
      explanation: {
        en: "Dental coverage depends on family income and whether you have dental insurance. This prototype cannot assess higher income ranges or insurance, so we will not guess.",
        fr: "La couverture dentaire dépend du revenu familial et de l'existence d'une assurance dentaire. Ce prototype ne peut pas évaluer les tranches de revenu supérieures ni l'assurance; nous ne devinerons donc pas.",
        ar: "تعتمد تغطية الأسنان على دخل الأسرة وعلى ما إذا كان لديك تأمين أسنان. لا يستطيع هذا النموذج الأولي تقييم نطاقات الدخل الأعلى أو التأمين، لذلك لن نخمّن.",
      },
      sourceId: "src_cdcp",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Health Canada / ESDC reviewer]",
    },
    {
      ruleId: "R-DEN-03",
      programId: "prog_cdcp",
      resultState: "maybe",
      dependencyIds: ["svc_tax"],
      conditions: {
        always: true,
      },
      explanation: {
        en: "Your income range may qualify. You also need to have no access to dental insurance, which we did not ask about.",
        fr: "Votre fourchette de revenu pourrait être admissible. Vous ne devez pas non plus avoir accès à une assurance dentaire, ce que nous n'avons pas demandé.",
        ar: "قد يكون نطاق دخلك مؤهلًا. يجب أيضًا ألا يكون لديك وصول إلى تأمين أسنان، ولم نسأل عن ذلك.",
      },
      sourceId: "src_cdcp",
      lastReviewed: "2026-10-15",
      owner: "[Rule owner placeholder — Health Canada / ESDC reviewer]",
    },
  ],
  organizations: [
    {
      id: "org_sc",
      name: {
        en: "Service Canada",
        fr: "Service Canada",
        ar: "خدمة كندا (Service Canada)",
      },
      level: {
        en: "Federal",
        fr: "Fédéral",
        ar: "فدرالي",
      },
      contact: {
        onlineUrl:
          "https://www.canada.ca/en/employment-social-development/corporate/portfolio/service-canada.html",
        onlineUrlFr: null,
        inPersonUrl:
          "https://www.servicecanada.gc.ca/tbsc-fsco/sc-hme.jsp?lang=eng",
        inPersonUrlFr:
          "https://www.servicecanada.gc.ca/tbsc-fsco/sc-hme.jsp?lang=fra",
        phone: "1-800-622-6232",
      },
      role: {
        en: "SIN, Employment Insurance and other federal services",
        fr: "NAS, assurance-emploi et autres services fédéraux",
        ar: "رقم SIN وتأمين العمل وخدمات فيدرالية أخرى",
      },
    },
    {
      id: "org_cra",
      name: {
        en: "Canada Revenue Agency (CRA)",
        fr: "Agence du revenu du Canada (ARC)",
        ar: "وكالة الإيرادات الكندية (CRA)",
      },
      level: {
        en: "Federal",
        fr: "Fédéral",
        ar: "فدرالي",
      },
      contact: {
        onlineUrl: "https://www.canada.ca/en/revenue-agency.html",
        onlineUrlFr: "https://www.canada.ca/fr/agence-revenu.html",
        inPersonUrl:
          "https://www.canada.ca/en/revenue-agency/services/tax/individuals/community-volunteer-income-tax-program.html",
        inPersonUrlFr: null,
        phone: "1-800-959-8281",
      },
      role: {
        en: "Canadian taxes, benefits and credits",
        fr: "Impôts, prestations et crédits canadiens",
        ar: "الضرائب والإعانات والأرصدة الضريبية الكندية",
      },
    },
    {
      id: "org_ircc",
      name: {
        en: "Settlement services",
        fr: "Services d'établissement",
        ar: "خدمات الاستقرار",
      },
      level: {
        en: "Federally funded, delivered by community organizations",
        fr: "Financé par le fédéral, offert par des organismes communautaires",
        ar: "تموّله الحكومة الفدرالية وتقدّمه منظمات مجتمعية",
      },
      contact: {
        onlineUrl:
          "https://ircc.canada.ca/english/newcomers/services/index.asp",
        onlineUrlFr:
          "https://ircc.canada.ca/francais/nouveaux/services/index.asp",
        inPersonUrl:
          "https://ircc.canada.ca/english/newcomers/services/index.asp",
        inPersonUrlFr:
          "https://ircc.canada.ca/francais/nouveaux/services/index.asp",
      },
      role: {
        en: "Help understanding and navigating services, in many languages",
        fr: "Aide pour comprendre les services et s'y retrouver, en plusieurs langues",
        ar: "مساعدة في فهم الخدمات والتنقل بينها، بلغات عديدة",
      },
    },
    {
      id: "org_211",
      name: {
        en: "211 community referral",
        fr: "211 — orientation communautaire",
        ar: "الإحالة المجتمعية 211",
      },
      level: {
        en: "Community service",
        fr: "Service communautaire",
        ar: "خدمة مجتمعية",
      },
      contact: {
        onlineUrl: "https://211.ca",
        onlineUrlFr: null,
        phone: "211",
      },
      role: {
        en: "Referrals to local help with food, housing and other basic needs",
        fr: "Orientation vers de l'aide locale pour la nourriture, le logement et d'autres besoins de base",
        ar: "إحالات إلى مساعدة محلية في الغذاء والسكن والاحتياجات الأساسية الأخرى",
      },
    },
    {
      id: "org_prov_emp",
      name: {
        en: "Employment services",
        fr: "Services d'emploi",
        ar: "خدمات التوظيف",
      },
      level: {
        en: "Provincial",
        fr: "Provincial",
        ar: "إقليمي",
      },
      contact: {
        onlineUrl: "https://www.jobbank.gc.ca",
        onlineUrlFr: "https://www.guichetemplois.gc.ca",
        inPersonUrl:
          "https://ircc.canada.ca/english/newcomers/services/index.asp",
        inPersonUrlFr:
          "https://ircc.canada.ca/francais/nouveaux/services/index.asp",
      },
      role: {
        en: "Job search and employment services",
        fr: "Recherche d'emploi et services d'emploi",
        ar: "البحث عن عمل وخدمات التوظيف",
      },
    },
    {
      id: "org_prov_social",
      name: {
        en: "Ontario Works",
        fr: "Ontario au travail",
        ar: "برنامج Ontario Works",
      },
      level: {
        en: "Provincial program, delivered by the municipality",
        fr: "Programme provincial offert par la municipalité",
        ar: "برنامج إقليمي تقدّمه البلدية",
      },
      contact: {
        onlineUrl: "https://www.ontario.ca/page/ontario-works",
        onlineUrlFr: "https://www.ontario.ca/fr/page/ontario-au-travail",
      },
      role: {
        en: "Financial and employment help in Ontario",
        fr: "Aide financière et aide à l'emploi en Ontario",
        ar: "مساعدة مالية ومساعدة في التوظيف في أونتاريو",
      },
    },
  ],
  sources: [
    {
      id: "src_sin",
      title: {
        en: "Social Insurance Number — eligibility and documents",
        fr: "Numéro d'assurance sociale — admissibilité et documents",
        ar: "رقم التأمين الاجتماعي (SIN) — الأهلية والوثائق",
      },
      placeholder: {
        en: "[Authoritative source placeholder: Service Canada SIN page — URL to be confirmed by program reviewer]",
        fr: "[Espace réservé à la source officielle : page du NAS de Service Canada — URL à confirmer par le responsable du programme]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة رقم SIN لدى خدمة كندا (Service Canada) — سيؤكد مراجع البرنامج الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — Service Canada]",
      url: "https://www.canada.ca/en/employment-social-development/services/sin.html",
      urlFr:
        "https://www.canada.ca/fr/emploi-developpement-social/services/numero-assurance-sociale.html",
      phone: "1-866-274-6627",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_tax",
      title: {
        en: "Filing a tax return as a newcomer",
        fr: "Produire une déclaration de revenus en tant que nouvel arrivant",
        ar: "تقديم الإقرار الضريبي بصفتك قادمًا جديدًا",
      },
      placeholder: {
        en: "[Authoritative source placeholder: CRA newcomers page and free tax clinic program — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : page de l'ARC pour les nouveaux arrivants et programme des comptoirs d'impôts gratuits — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة القادمين الجدد لدى CRA وبرنامج عيادات الضرائب المجانية — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — CRA]",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/newcomers-canada-immigrants.html",
      urlFr: null,
      phone: "1-800-959-8281",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_ei",
      title: {
        en: "Employment Insurance regular benefits",
        fr: "Prestations régulières d'assurance-emploi",
        ar: "الإعانات العادية لتأمين العمل (Employment Insurance)",
      },
      placeholder: {
        en: "[Authoritative source placeholder: ESDC EI regular benefits eligibility page — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : page d'admissibilité aux prestations régulières d'AE d'EDSC — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة أهلية الإعانات العادية لتأمين العمل (EI) لدى ESDC — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — ESDC]",
      url: "https://www.canada.ca/en/services/benefits/ei/ei-regular-benefit.html",
      urlFr: null,
      phone: "1-800-206-7218",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_emp",
      title: {
        en: "Provincial employment services",
        fr: "Services d'emploi provinciaux",
        ar: "خدمات التوظيف الإقليمية",
      },
      placeholder: {
        en: "[Authoritative source placeholder: provincial employment services page — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : page des services d'emploi provinciaux — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة خدمات التوظيف الإقليمية — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — Province of Ontario]",
      url: "https://www.jobbank.gc.ca",
      urlFr: "https://www.guichetemplois.gc.ca",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_211",
      title: {
        en: "211 community and social services referral",
        fr: "211 — orientation vers les services communautaires et sociaux",
        ar: "إحالة 211 إلى الخدمات المجتمعية والاجتماعية",
      },
      placeholder: {
        en: "[Authoritative source placeholder: 211 service page — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : page du service 211 — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة خدمة 211 — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — 211 partner]",
      url: "https://211.ca",
      urlFr: null,
      phone: "211",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_settlement",
      title: {
        en: "Free newcomer settlement services",
        fr: "Services d'établissement gratuits pour les nouveaux arrivants",
        ar: "خدمات استقرار مجانية للقادمين الجدد",
      },
      placeholder: {
        en: "[Authoritative source placeholder: IRCC settlement services finder — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : outil de recherche des services d'établissement d'IRCC — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: أداة البحث عن خدمات الاستقرار لدى IRCC — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — IRCC]",
      url: "https://ircc.canada.ca/english/newcomers/services/index.asp",
      urlFr: "https://ircc.canada.ca/francais/nouveaux/services/index.asp",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_ow",
      title: {
        en: "Ontario Works eligibility",
        fr: "Admissibilité à Ontario au travail",
        ar: "أهلية برنامج أونتاريو للعمل (Ontario Works)",
      },
      placeholder: {
        en: "[Authoritative source placeholder: Ontario Works eligibility page — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : page d'admissibilité à Ontario au travail — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة أهلية برنامج أونتاريو للعمل (Ontario Works) — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — Province of Ontario / City of Ottawa]",
      url: "https://www.ontario.ca/page/ontario-works",
      urlFr: "https://www.ontario.ca/fr/page/ontario-au-travail",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_gst",
      title: {
        en: "GST/HST credit",
        fr: "Crédit pour la TPS/TVH",
        ar: "رصيد GST/HST",
      },
      placeholder: {
        en: "[Authoritative source placeholder: CRA GST/HST credit page — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : page du crédit pour la TPS/TVH de l'ARC — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة رصيد GST/HST لدى CRA — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — CRA]",
      url: "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit.html",
      urlFr: null,
      phone: "1-800-387-1193",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_ccb",
      title: {
        en: "Canada Child Benefit",
        fr: "Allocation canadienne pour enfants",
        ar: "إعانة الطفل الكندية (Canada Child Benefit)",
      },
      placeholder: {
        en: "[Authoritative source placeholder: CRA Canada Child Benefit page — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : page de l'Allocation canadienne pour enfants de l'ARC — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة إعانة الطفل الكندية (Canada Child Benefit) لدى CRA — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — CRA]",
      url: "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html",
      urlFr: null,
      phone: "1-800-387-1193",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_ocb",
      title: {
        en: "Ontario Child Benefit",
        fr: "Prestation ontarienne pour enfants",
        ar: "إعانة الطفل في أونتاريو (Ontario Child Benefit)",
      },
      placeholder: {
        en: "[Authoritative source placeholder: Ontario Child Benefit page — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : page de la Prestation ontarienne pour enfants — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة إعانة الطفل في أونتاريو (Ontario Child Benefit) — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — Province of Ontario]",
      url: "https://www.ontario.ca/page/ontario-child-benefit",
      urlFr: null,
      phone: "1-800-387-1193",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_otb",
      title: {
        en: "Ontario Trillium Benefit",
        fr: "Prestation Trillium de l'Ontario",
        ar: "إعانة أونتاريو تريليوم (Ontario Trillium Benefit)",
      },
      placeholder: {
        en: "[Authoritative source placeholder: Ontario Trillium Benefit page — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : page de la Prestation Trillium de l'Ontario — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة إعانة أونتاريو تريليوم (Ontario Trillium Benefit) — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — Province of Ontario / CRA]",
      url: "https://www.ontario.ca/page/ontario-trillium-benefit",
      urlFr: null,
      phone: "1-800-387-1193",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
    {
      id: "src_cdcp",
      title: {
        en: "Canadian Dental Care Plan",
        fr: "Régime canadien de soins dentaires",
        ar: "خطة رعاية الأسنان الكندية (Canadian Dental Care Plan)",
      },
      placeholder: {
        en: "[Authoritative source placeholder: Canadian Dental Care Plan page — URL to be confirmed]",
        fr: "[Espace réservé à la source officielle : page du Régime canadien de soins dentaires — URL à confirmer]",
        ar: "[عنصر نائب للمصدر الرسمي: صفحة خطة رعاية الأسنان الكندية (Canadian Dental Care Plan) — سيتم تأكيد الرابط]",
      },
      lastReviewed: "2026-10-15",
      owner: "[Owner placeholder — Health Canada / ESDC]",
      url: "https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html",
      urlFr: null,
      phone: "1-833-537-4342",
      linkCheck:
        "Entered from canada.ca / ontario.ca / 211.ca addresses known to the team; not verified live in this build. Confirm before user testing.",
    },
  ],
  handoffs: [
    {
      id: "HO-01",
      fromProgramId: "svc_sin",
      toProgramId: "svc_tax",
      fromLabel: {
        en: "Service Canada (SIN)",
        fr: "Service Canada (NAS)",
        ar: "خدمة كندا (Service Canada) (SIN)",
      },
      toLabel: {
        en: "Canada Revenue Agency, through a free community tax clinic or CRA channels",
        fr: "Agence du revenu du Canada, par un comptoir d'impôts communautaire gratuit ou les services de l'ARC",
        ar: "وكالة الإيرادات الكندية (CRA)، من خلال عيادة ضرائب مجتمعية مجانية أو قنوات CRA",
      },
      conditions: {
        all: [
          {
            result: "svc_sin",
            resultIn: ["action_required"],
          },
          {
            result: "svc_tax",
            resultIn: ["action_required"],
          },
        ],
      },
      why: {
        en: "Your SIN is handled by Service Canada, but your tax return is handled by the CRA. They are different organizations. Your return needs a valid SIN, so you go to the CRA side only after the SIN step.",
        fr: "Votre NAS relève de Service Canada, mais votre déclaration de revenus relève de l'ARC. Ce sont deux organisations différentes. Votre déclaration exige un NAS valide; vous passez donc à l'ARC seulement après l'étape du NAS.",
        ar: "تتولى خدمة كندا (Service Canada) رقم SIN الخاص بك، أما إقرارك الضريبي فتتولاه CRA. إنهما جهتان مختلفتان. يحتاج إقرارك إلى رقم SIN صالح، لذلك تنتقل إلى جهة CRA فقط بعد خطوة رقم SIN.",
      },
      canHelp: [
        {
          en: "File or confirm last year's tax return with you (synthetic description)",
          fr: "Produire ou confirmer avec vous la déclaration de l'an dernier (description synthétique)",
          ar: "تقديم إقرار السنة الماضية الضريبي معك أو التأكد منه (وصف اصطناعي)",
        },
        {
          en: "Explain which credits and benefits are assessed from your return (synthetic description)",
          fr: "Expliquer quels crédits et prestations sont évalués à partir de votre déclaration (description synthétique)",
          ar: "شرح الأرصدة الضريبية والإعانات التي تُقيَّم بناءً على إقرارك (وصف اصطناعي)",
        },
      ],
      bring: [
        {
          en: "The SIN confirmation you receive from Service Canada (synthetic list)",
          fr: "La confirmation du NAS reçue de Service Canada (liste synthétique)",
          ar: "تأكيد رقم SIN الذي تتلقاه من خدمة كندا (Service Canada) (قائمة اصطناعية)",
        },
        {
          en: "Your immigration or identity document (synthetic list)",
          fr: "Votre document d'immigration ou d'identité (liste synthétique)",
          ar: "وثيقة الهجرة أو الهوية الخاصة بك (قائمة اصطناعية)",
        },
        {
          en: "Income slips and your date of arrival in Canada (synthetic list)",
          fr: "Feuillets de revenu et date d'arrivée au Canada (liste synthétique)",
          ar: "كشوف الدخل وتاريخ وصولك إلى كندا (قائمة اصطناعية)",
        },
        {
          en: "This action plan (synthetic list)",
          fr: "Ce plan d'action (liste synthétique)",
          ar: "خطة العمل هذه (قائمة اصطناعية)",
        },
      ],
      sharedQuestionIds: [
        "status",
        "hasSin",
        "sinCurrent",
        "filedTax",
        "children",
      ],
      next: {
        en: "After you file, the CRA sends a notice of assessment. That is what moves your Not yet supports forward.",
        fr: "Après la production de votre déclaration, l'ARC envoie un avis de cotisation. C'est ce qui fait avancer vos soutiens « Pas encore ».",
        ar: "بعد تقديم إقرارك، ترسل CRA إشعار التقييم. هذا ما يدفع أشكال الدعم التي حالتها «ليس بعد» إلى الأمام.",
      },
      sourceId: "src_tax",
      lastReviewed: "2026-11-10",
      owner: "[Hand-off owner placeholder — Service Canada and CRA reviewers]",
    },
    {
      id: "HO-02",
      fromProgramId: null,
      toProgramId: "svc_settlement",
      fromLabel: {
        en: "This guide (Newcomer Compass)",
        fr: "Ce guide (Boussole)",
        ar: "هذا الدليل (بوصلة القادمين الجدد – Newcomer Compass)",
      },
      toLabel: {
        en: "A settlement worker at an IRCC-funded organization",
        fr: "Un intervenant en établissement d'un organisme financé par IRCC",
        ar: "مرشد استقرار في منظمة تموّلها IRCC",
      },
      conditions: {
        result: "svc_settlement",
        resultIn: ["likely", "maybe", "needs_info"],
      },
      why: {
        en: "This guide can sequence steps, but it cannot check your documents, answer questions it did not ask, or decide anything. A settlement worker can pick up your plan where it stops.",
        fr: "Ce guide peut ordonner les étapes, mais il ne peut pas vérifier vos documents, répondre à des questions qu'il n'a pas posées ni décider quoi que ce soit. Un intervenant en établissement peut reprendre votre plan là où il s'arrête.",
        ar: "يمكن لهذا الدليل ترتيب الخطوات، لكنه لا يستطيع فحص وثائقك، أو الإجابة عن أسئلة لم يطرحها، أو اتخاذ أي قرار. يمكن لمرشد الاستقرار متابعة خطتك من حيث يتوقف الدليل.",
      },
      canHelp: [
        {
          en: "Go through this plan with you, in your language where available (synthetic description)",
          fr: "Parcourir ce plan avec vous, dans votre langue si possible (description synthétique)",
          ar: "مراجعة هذه الخطة معك، بلغتك إن كان ذلك متاحًا (وصف اصطناعي)",
        },
        {
          en: "Help with the open questions listed in your plan (synthetic description)",
          fr: "Aider à répondre aux questions en suspens de votre plan (description synthétique)",
          ar: "المساعدة في الأسئلة المفتوحة المذكورة في خطتك (وصف اصطناعي)",
        },
        {
          en: "Help you fill in forms and book appointments with the other organizations (synthetic description)",
          fr: "Vous aider à remplir des formulaires et à prendre rendez-vous auprès des autres organisations (description synthétique)",
          ar: "مساعدتك في تعبئة النماذج وحجز المواعيد مع الجهات الأخرى (وصف اصطناعي)",
        },
      ],
      bring: [
        {
          en: "This action plan, printed or on your phone (synthetic list)",
          fr: "Ce plan d'action, imprimé ou sur votre téléphone (liste synthétique)",
          ar: "خطة العمل هذه، مطبوعة أو على هاتفك (قائمة اصطناعية)",
        },
        {
          en: "Your immigration document (synthetic list)",
          fr: "Votre document d'immigration (liste synthétique)",
          ar: "وثيقة الهجرة الخاصة بك (قائمة اصطناعية)",
        },
        {
          en: "Any letters you received from government (synthetic list)",
          fr: "Toutes les lettres reçues du gouvernement (liste synthétique)",
          ar: "أي رسائل تلقيتها من الحكومة (قائمة اصطناعية)",
        },
      ],
      sharedQuestionIds: ["province", "status"],
      next: {
        en: "The worker reviews what is done, what is open and what is Not yet, then helps you with the next organization. You should not have to start over.",
        fr: "L'intervenant examine ce qui est fait, ce qui reste ouvert et ce qui est « Pas encore », puis vous aide avec la prochaine organisation. Vous ne devriez pas avoir à tout recommencer.",
        ar: "يراجع المرشد ما تم إنجازه وما هو مفتوح وما حالته «ليس بعد»، ثم يساعدك مع الجهة التالية. لا ينبغي أن تضطر إلى البدء من جديد.",
      },
      sourceId: "src_settlement",
      lastReviewed: "2026-11-10",
      owner: "[Hand-off owner placeholder — IRCC settlement program reviewer]",
    },
    {
      id: "HO-03",
      fromProgramId: null,
      toProgramId: "svc_basic_needs",
      fromLabel: {
        en: "This guide (Newcomer Compass)",
        fr: "Ce guide (Boussole)",
        ar: "هذا الدليل (بوصلة القادمين الجدد – Newcomer Compass)",
      },
      toLabel: {
        en: "211 community referral",
        fr: "211 — orientation communautaire",
        ar: "الإحالة المجتمعية 211",
      },
      conditions: {
        all: [
          {
            not: {
              result: "svc_settlement",
              resultIn: ["likely", "maybe", "needs_info"],
            },
          },
          {
            result: "svc_basic_needs",
            resultIn: ["likely"],
          },
        ],
      },
      why: {
        en: "Settlement services may not be open to you, so 211 is the person-to-person route for help with this plan.",
        fr: "Les services d'établissement pourraient ne pas vous être offerts; le 211 est donc la voie d'aide humaine pour ce plan.",
        ar: "قد لا تكون خدمات الاستقرار متاحة لك، لذلك فإن 211 هو الطريق للتواصل مع شخص للمساعدة في هذه الخطة.",
      },
      canHelp: [
        {
          en: "Refer you to local community help for urgent needs (synthetic description)",
          fr: "Vous orienter vers de l'aide communautaire locale pour les besoins urgents (description synthétique)",
          ar: "إحالتك إلى مساعدة مجتمعية محلية للاحتياجات العاجلة (وصف اصطناعي)",
        },
      ],
      bring: [
        {
          en: "This action plan (synthetic list)",
          fr: "Ce plan d'action (liste synthétique)",
          ar: "خطة العمل هذه (قائمة اصطناعية)",
        },
      ],
      sharedQuestionIds: ["province"],
      next: {
        en: "211 refers you to a local organization that can help with the next step.",
        fr: "Le 211 vous oriente vers un organisme local qui peut aider à la prochaine étape.",
        ar: "تحيلك 211 إلى منظمة محلية يمكنها المساعدة في الخطوة التالية.",
      },
      sourceId: "src_211",
      lastReviewed: "2026-11-10",
      owner: "[Hand-off owner placeholder — 211 service partner]",
    },
  ],
};

export const RESULT_STATES: ResultStateInfo[] = [
  {
    id: "action_required",
    label: {
      en: "Complete this step first",
      fr: "Faites cette étape en premier",
      ar: "أكمل هذه الخطوة أولًا",
    },
    description: {
      en: "Other supports depend on this action. Doing it now avoids delays later.",
      fr: "D'autres soutiens dépendent de cette action. La faire maintenant évite des retards.",
      ar: "تعتمد أشكال دعم أخرى على هذا الإجراء. القيام به الآن يجنّبك التأخير لاحقًا.",
    },
  },
  {
    id: "done",
    label: {
      en: "Already in place",
      fr: "Déjà en place",
      ar: "مكتمل بالفعل",
    },
    description: {
      en: "Based on your answers, no action is needed now.",
      fr: "Selon vos réponses, aucune action n'est requise pour l'instant.",
      ar: "بناءً على إجاباتك، لا حاجة إلى أي إجراء الآن.",
    },
  },
  {
    id: "likely",
    label: {
      en: "Likely eligible",
      fr: "Probablement admissible",
      ar: "مؤهل على الأرجح",
    },
    description: {
      en: "Your answers match the main conditions in our synthetic rules. The program makes the final decision.",
      fr: "Vos réponses correspondent aux principales conditions de nos règles synthétiques. Le programme prend la décision finale.",
      ar: "إجاباتك تطابق الشروط الرئيسية في قواعدنا الاصطناعية. البرنامج هو من يتخذ القرار النهائي.",
    },
  },
  {
    id: "maybe",
    label: {
      en: "May be eligible",
      fr: "Peut-être admissible",
      ar: "قد تكون مؤهلًا",
    },
    description: {
      en: "Some conditions match, but the program checks things we did not ask about.",
      fr: "Certaines conditions correspondent, mais le programme vérifie des éléments que nous n'avons pas demandés.",
      ar: "بعض الشروط متطابقة، لكن البرنامج يتحقق من أمور لم نسأل عنها.",
    },
  },
  {
    id: "not_yet",
    label: {
      en: "Not yet",
      fr: "Pas encore",
      ar: "ليس بعد",
    },
    description: {
      en: 'This could apply to you later, but an earlier step has to happen first. It is not a "no".',
      fr: "Cela pourrait s'appliquer à vous plus tard, mais une étape précédente doit d'abord être faite. Ce n'est pas un « non ».",
      ar: "قد ينطبق هذا عليك لاحقًا، لكن يجب إتمام خطوة سابقة أولًا. هذا ليس «لا».",
    },
  },
  {
    id: "needs_info",
    label: {
      en: "More information needed",
      fr: "Plus de renseignements requis",
      ar: "نحتاج إلى مزيد من المعلومات",
    },
    description: {
      en: "We do not have enough information to say more. A person can help instead of us guessing.",
      fr: "Nous n'avons pas assez de renseignements pour en dire plus. Une personne peut aider plutôt que de deviner.",
      ar: "ليست لدينا معلومات كافية لنقول المزيد. يمكن لشخص أن يساعدك بدلًا من أن نخمّن.",
    },
  },
  {
    id: "unlikely",
    label: {
      en: "Probably not eligible",
      fr: "Probablement non admissible",
      ar: "على الأرجح غير مؤهل",
    },
    description: {
      en: "Your answers suggest this does not apply to you now, even after the other steps. Situations change; a person can confirm.",
      fr: "Vos réponses indiquent que cela ne s'applique pas à vous pour l'instant, même après les autres étapes. Les situations changent; une personne peut confirmer.",
      ar: "تشير إجاباتك إلى أن هذا لا ينطبق عليك الآن، حتى بعد الخطوات الأخرى. الأوضاع تتغير؛ ويمكن لشخص أن يؤكد ذلك.",
    },
  },
];

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: "sin",
    term: {
      en: "Social Insurance Number (SIN)",
      fr: "Numéro d'assurance sociale (NAS)",
      ar: "رقم التأمين الاجتماعي (SIN)",
    },
    plain: {
      en: "A 9-digit number you need to work in Canada and get government payments. Keep it private.",
      fr: "Un numéro à 9 chiffres nécessaire pour travailler au Canada et recevoir des paiements du gouvernement. Gardez-le confidentiel.",
      ar: "رقم من 9 خانات تحتاجه للعمل في كندا وللحصول على المدفوعات الحكومية. احتفظ به سرًّا.",
    },
  },
  {
    id: "sin900",
    term: {
      en: "SIN starting with 9",
      fr: "NAS commençant par 9",
      ar: "رقم SIN يبدأ بالرقم 9",
    },
    plain: {
      en: "A SIN given to people who are not citizens or permanent residents. It expires when your permit expires.",
      fr: "Un NAS attribué aux personnes qui ne sont ni citoyennes ni résidentes permanentes. Il expire en même temps que votre permis.",
      ar: "رقم SIN يُعطى للأشخاص الذين ليسوا مواطنين أو مقيمين دائمين. تنتهي صلاحيته عندما تنتهي صلاحية تصريحك.",
    },
  },
  {
    id: "tax_return",
    term: {
      en: "Tax return",
      fr: "Déclaration de revenus",
      ar: "الإقرار الضريبي",
    },
    plain: {
      en: "A form you send to the government once a year about the money you earned.",
      fr: "Un formulaire que vous envoyez au gouvernement une fois par année au sujet de l'argent gagné.",
      ar: "نموذج ترسله إلى الحكومة مرة كل سنة عن المال الذي كسبته.",
    },
  },
  {
    id: "noa",
    term: {
      en: "Notice of assessment",
      fr: "Avis de cotisation",
      ar: "إشعار التقييم",
    },
    plain: {
      en: "A letter from the CRA after you file. It confirms your income. Many programs ask for it.",
      fr: "Une lettre de l'ARC après la production de votre déclaration. Elle confirme votre revenu. De nombreux programmes la demandent.",
      ar: "رسالة من CRA بعد تقديم إقرارك. تؤكد دخلك. تطلبها كثير من البرامج.",
    },
  },
  {
    id: "income_tested",
    term: {
      en: "Income-tested",
      fr: "Fondé sur le revenu",
      ar: "يعتمد على الدخل",
    },
    plain: {
      en: "The amount you get depends on how much money your household earns.",
      fr: "Le montant reçu dépend de l'argent gagné par votre ménage.",
      ar: "المبلغ الذي تحصل عليه يعتمد على مقدار المال الذي تكسبه أسرتك.",
    },
  },
  {
    id: "ei",
    term: {
      en: "Employment Insurance (EI)",
      fr: "Assurance-emploi (AE)",
      ar: "تأمين العمل (EI)",
    },
    plain: {
      en: "Temporary payments from the government for some people who lose their job.",
      fr: "Des paiements temporaires du gouvernement pour certaines personnes qui perdent leur emploi.",
      ar: "مدفوعات مؤقتة من الحكومة لبعض الأشخاص الذين يفقدون عملهم.",
    },
  },
  {
    id: "roe",
    term: {
      en: "Record of Employment (ROE)",
      fr: "Relevé d'emploi (RE)",
      ar: "سجل التوظيف (ROE)",
    },
    plain: {
      en: "A form your employer sends when you stop working. It shows your hours and pay.",
      fr: "Un formulaire que votre employeur envoie quand vous cessez de travailler. Il indique vos heures et votre salaire.",
      ar: "نموذج يرسله صاحب العمل عندما تتوقف عن العمل. يبيّن ساعات عملك وأجرك.",
    },
  },
  {
    id: "settlement_worker",
    term: {
      en: "Settlement worker",
      fr: "Intervenant en établissement",
      ar: "مرشد الاستقرار",
    },
    plain: {
      en: "A person at a newcomer organization who helps you with forms, services and next steps, for free.",
      fr: "Une personne d'un organisme pour nouveaux arrivants qui vous aide gratuitement avec les formulaires, les services et les prochaines étapes.",
      ar: "شخص في منظمة للقادمين الجدد يساعدك مجانًا في النماذج والخدمات والخطوات التالية.",
    },
  },
  {
    id: "social_assistance",
    term: {
      en: "Social assistance",
      fr: "Aide sociale",
      ar: "المساعدة الاجتماعية",
    },
    plain: {
      en: "Money from the province for people who cannot pay for basic needs like food and rent.",
      fr: "De l'argent de la province pour les personnes qui ne peuvent pas payer leurs besoins de base comme la nourriture et le loyer.",
      ar: "مال من المقاطعة للأشخاص الذين لا يستطيعون دفع تكاليف الاحتياجات الأساسية مثل الطعام والإيجار.",
    },
  },
  {
    id: "prerequisite",
    term: {
      en: "Prerequisite",
      fr: "Préalable",
      ar: "شرط مسبق",
    },
    plain: {
      en: "Something you must do before you can do the next thing.",
      fr: "Quelque chose que vous devez faire avant de pouvoir faire la chose suivante.",
      ar: "أمر يجب أن تقوم به قبل أن تتمكن من القيام بالخطوة التالية.",
    },
  },
];

export const DEMO_LOCATIONS: DemoLocation[] = [
  {
    id: "loc_sc",
    isDemo: true,
    serviceType: "service_canada",
    areaId: "ottawa",
    displayName: {
      en: "Service Canada Centre",
      fr: "Centre Service Canada",
      ar: "مركز خدمة كندا (Service Canada)",
    },
    orgId: "org_sc",
    relatedActionIds: ["svc_sin", "prog_ei", "prog_cdcp"],
    helpsWith: {
      en: "Federal services in person, such as a Social Insurance Number and Employment Insurance.",
      fr: "Services fédéraux en personne, comme le numéro d'assurance sociale et l'assurance-emploi.",
      ar: "خدمات فيدرالية حضوريًا، مثل رقم التأمين الاجتماعي وتأمين العمل.",
    },
    demonstrationAddress: "100 Example Street, Ottawa ON",
    latitude: 45.4148,
    longitude: -75.7034,
  },
  {
    id: "loc_tax_clinic",
    isDemo: true,
    serviceType: "tax_clinic",
    areaId: "ottawa",
    displayName: {
      en: "Free community tax clinic",
      fr: "Comptoir d'impôts communautaire gratuit",
      ar: "عيادة ضرائب مجتمعية مجانية",
    },
    orgId: "org_cra",
    relatedActionIds: ["svc_tax"],
    helpsWith: {
      en: "Volunteers who can help people with a modest income file a tax return for free.",
      fr: "Des bénévoles qui peuvent aider les personnes à revenu modeste à produire leur déclaration de revenus gratuitement.",
      ar: "متطوعون يمكنهم مساعدة ذوي الدخل المتواضع على تقديم الإقرار الضريبي مجانًا.",
    },
    demonstrationAddress: "200 Sample Avenue, Ottawa ON",
    latitude: 45.3948,
    longitude: -75.6734,
  },
  {
    id: "loc_settlement",
    isDemo: true,
    serviceType: "settlement",
    areaId: "ottawa",
    displayName: {
      en: "Settlement organization (IRCC-funded)",
      fr: "Organisme d'établissement (financé par IRCC)",
      ar: "منظمة استقرار (بتمويل من IRCC)",
    },
    orgId: "org_ircc",
    relatedActionIds: ["svc_settlement", "prog_employment"],
    helpsWith: {
      en: "Free help from a settlement worker, including help finding work, often in your language.",
      fr: "De l'aide gratuite d'un travailleur d'établissement, y compris pour trouver un emploi, souvent dans votre langue.",
      ar: "مساعدة مجانية من مرشد استقرار، بما في ذلك المساعدة في إيجاد عمل، وغالبًا بلغتك.",
    },
    demonstrationAddress: "300 Placeholder Road, Ottawa ON",
    latitude: 45.399,
    longitude: -75.7309,
  },
  {
    id: "loc_library",
    isDemo: true,
    serviceType: "library",
    areaId: "ottawa",
    displayName: {
      en: "Public library with settlement workers",
      fr: "Bibliothèque publique avec travailleurs d'établissement",
      ar: "مكتبة عامة فيها مرشدو استقرار",
    },
    orgId: "org_ircc",
    relatedActionIds: ["svc_settlement"],
    helpsWith: {
      en: "A public library where settlement workers may offer drop-in help.",
      fr: "Une bibliothèque publique où des travailleurs d'établissement peuvent offrir de l'aide sans rendez-vous.",
      ar: "مكتبة عامة قد يقدم فيها مرشدو الاستقرار مساعدة دون موعد.",
    },
    demonstrationAddress: "400 Demo Crescent, Ottawa ON",
    latitude: 45.4124,
    longitude: -75.6509,
  },
  {
    id: "loc_prov_office",
    isDemo: true,
    serviceType: "prov_office",
    areaId: "ottawa",
    displayName: {
      en: "Ontario Works office",
      fr: "Bureau d'Ontario au travail",
      ar: "مكتب Ontario Works",
    },
    orgId: "org_prov_social",
    relatedActionIds: ["prog_ow"],
    helpsWith: {
      en: "Provincial office for questions about Ontario Works financial and employment help.",
      fr: "Bureau provincial pour les questions sur l'aide financière et l'aide à l'emploi d'Ontario au travail.",
      ar: "مكتب إقليمي للأسئلة عن المساعدة المالية والمساعدة في التوظيف من Ontario Works.",
    },
    demonstrationAddress: "500 Prototype Lane, Ottawa ON",
    latitude: 45.3752,
    longitude: -75.6859,
  },
];

export const AREAS: Area[] = [
  {
    id: "ottawa",
    province: "ON",
    name: {
      en: "Ottawa",
      fr: "Ottawa",
      ar: "أوتاوا",
    },
    aliases: [
      "ottawa",
      "ottawa on",
      "ottawa ontario",
      "city of ottawa",
      "ville d'ottawa",
      "nepean",
      "kanata",
      "orleans",
      "barrhaven",
      "gloucester",
      "vanier",
      "stittsville",
      "manotick",
      "cumberland",
      "riverside south",
      "centretown",
      "the glebe",
      "westboro",
      "اوتاوا",
      "أوتاوا",
    ],
    center: {
      latitude: 45.4215,
      longitude: -75.6972,
    },
    bounds: {
      north: 45.4868,
      south: 45.2621,
      west: -75.9559,
      east: -75.4559,
    },
    showDemoLocations: true,
  },
];

/** At most this many "explore" supports appear as their own roadmap steps; the rest are grouped. */
export const MAX_EXPLORE_STEPS = 3;
