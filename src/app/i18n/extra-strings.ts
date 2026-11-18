import type { LanguageCode } from '../content/types';

/**
 * Text that this Angular version adds on top of the prototype's strings
 * (the welcome page, the prototype banner, and a few labels).
 */
export interface ExtraStrings {
  /** The language button on the welcome page, written in its own language. */
  continueIn: string;
  prototypeLabel: string;
  prototypeNotice: string;
  prototypeNoticeLabel: string;
  close: string;
  homeLink: string;
  guideName: string;
  roadmapChatOpen: string;
  roadmapChatGreeting: string;
  roadmapChatPlaceholder: string;
  roadmapChatNotice: string;
  roadmapChatThinking: string;
  roadmapChatBusy: string;
  roadmapChatUnavailable: string;
  roadmapChatOffline: string;
  roadmapChatUnreachable: string;
  roadmapChatTimeout: string;
  roadmapChatRejected: string;
  roadmapChatNotSetUp: string;
  roadmapChatRetry: string;
  roadmapChatPersonalInfo: string;
}

export const EXTRA_STRINGS: Record<LanguageCode, ExtraStrings> = {
  en: {
    continueIn: 'Continue in English',
    prototypeLabel: 'Prototype.',
    prototypeNotice:
      'This proof of concept demonstrates a possible service experience. It does not provide official eligibility decisions.',
    prototypeNoticeLabel: 'Proof of concept notice',
    close: 'Close',
    homeLink: 'Newcomer Compass: choose your language',
    guideName: 'Newcomer Compass guide',
    roadmapChatOpen: 'Ask a question about your roadmap',
    roadmapChatGreeting: 'Do you have a question about your roadmap? Type it below.',
    roadmapChatPlaceholder: 'Type your question',
    roadmapChatNotice: 'Answers are written by AI and may be wrong. Do not share personal information.',
    roadmapChatThinking: 'The guide is writing an answer',
    roadmapChatBusy: 'Too many people are asking questions right now. Please wait a moment and try again.',
    roadmapChatUnavailable: 'Sorry, the guide cannot answer right now. Please try again later.',
    roadmapChatOffline: 'You seem to be offline. Check your internet connection, then try again.',
    roadmapChatUnreachable: 'Could not connect to the guide. Check your internet connection, then try again.',
    roadmapChatTimeout: 'The guide took too long to answer. Please try again.',
    roadmapChatRejected: 'The guide could not accept this question. Try asking it in a shorter or different way.',
    roadmapChatNotSetUp: 'The question chat is not set up on this site yet, so the guide cannot answer. Please try again another day.',
    roadmapChatRetry: 'Try again',
    roadmapChatPersonalInfo: 'Please do not share personal details like names, numbers or addresses. Your message was not sent. Remove them and try again.',
  },
  fr: {
    continueIn: 'Continuer en français',
    prototypeLabel: 'Prototype.',
    prototypeNotice:
      "Cette preuve de concept présente une expérience de service possible. Elle ne fournit pas de décisions officielles sur l'admissibilité.",
    prototypeNoticeLabel: 'Avis de preuve de concept',
    close: 'Fermer',
    homeLink: 'Boussole des nouveaux arrivants : choisir votre langue',
    guideName: 'Guide de la Boussole des nouveaux arrivants',
    roadmapChatOpen: 'Poser une question sur votre feuille de route',
    roadmapChatGreeting: 'Avez-vous une question sur votre feuille de route? Écrivez-la ci-dessous.',
    roadmapChatPlaceholder: 'Écrivez votre question',
    roadmapChatNotice: "Les réponses sont rédigées par l'IA et peuvent contenir des erreurs. Ne communiquez pas de renseignements personnels.",
    roadmapChatThinking: 'Le guide rédige une réponse',
    roadmapChatBusy: 'Trop de personnes posent des questions en ce moment. Veuillez patienter un instant et réessayer.',
    roadmapChatUnavailable: 'Désolé, le guide ne peut pas répondre pour le moment. Veuillez réessayer plus tard.',
    roadmapChatOffline: 'Vous semblez être hors ligne. Vérifiez votre connexion Internet, puis réessayez.',
    roadmapChatUnreachable: 'Impossible de joindre le guide. Vérifiez votre connexion Internet, puis réessayez.',
    roadmapChatTimeout: 'Le guide a mis trop de temps à répondre. Veuillez réessayer.',
    roadmapChatRejected: "Le guide n'a pas pu accepter cette question. Essayez de la poser de façon plus courte ou différente.",
    roadmapChatNotSetUp: "Le clavardage n'est pas encore configuré sur ce site, alors le guide ne peut pas répondre. Veuillez réessayer un autre jour.",
    roadmapChatRetry: 'Réessayer',
    roadmapChatPersonalInfo: "Veuillez ne pas communiquer de renseignements personnels comme des noms, des numéros ou des adresses. Votre message n'a pas été envoyé. Retirez-les et réessayez.",
  },
  ar: {
    continueIn: 'المتابعة بالعربية',
    prototypeLabel: 'نموذج أولي.',
    prototypeNotice: 'يعرض هذا النموذج الأولي تجربة خدمة ممكنة. ولا يقدّم قرارات رسمية بشأن الأهلية.',
    prototypeNoticeLabel: 'إشعار النموذج الأولي',
    close: 'إغلاق',
    homeLink: 'Newcomer Compass: اختر لغتك',
    guideName: 'دليل Newcomer Compass',
    roadmapChatOpen: 'اطرح سؤالًا عن خارطة طريقك',
    roadmapChatGreeting: 'هل لديك سؤال عن خارطة طريقك؟ اكتبه أدناه.',
    roadmapChatPlaceholder: 'اكتب سؤالك',
    roadmapChatNotice: 'يكتب الذكاء الاصطناعي الإجابات وقد تكون خاطئة. لا تشارك معلومات شخصية.',
    roadmapChatThinking: 'يكتب الدليل إجابة',
    roadmapChatBusy: 'يطرح عدد كبير من الأشخاص أسئلة الآن. يُرجى الانتظار قليلًا ثم المحاولة مرة أخرى.',
    roadmapChatUnavailable: 'عذرًا، لا يستطيع الدليل الإجابة الآن. يُرجى المحاولة مرة أخرى لاحقًا.',
    roadmapChatOffline: 'يبدو أنك غير متصل بالإنترنت. تحقّق من اتصالك ثم حاول مرة أخرى.',
    roadmapChatUnreachable: 'تعذّر الاتصال بالدليل. تحقّق من اتصالك بالإنترنت ثم حاول مرة أخرى.',
    roadmapChatTimeout: 'استغرق الدليل وقتًا طويلًا للإجابة. يُرجى المحاولة مرة أخرى.',
    roadmapChatRejected: 'تعذّر على الدليل قبول هذا السؤال. حاول طرحه بطريقة أقصر أو مختلفة.',
    roadmapChatNotSetUp: 'لم يتم إعداد المحادثة على هذا الموقع بعد، لذا لا يستطيع الدليل الإجابة. يُرجى المحاولة في يوم آخر.',
    roadmapChatRetry: 'إعادة المحاولة',
    roadmapChatPersonalInfo: 'يُرجى عدم مشاركة تفاصيل شخصية مثل الأسماء أو الأرقام أو العناوين. لم تُرسَل رسالتك. احذفها وحاول مرة أخرى.',
  },
};
