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
  },
  ar: {
    continueIn: 'المتابعة بالعربية',
    prototypeLabel: 'نموذج أولي.',
    prototypeNotice: 'يعرض هذا النموذج الأولي تجربة خدمة ممكنة. ولا يقدّم قرارات رسمية بشأن الأهلية.',
    prototypeNoticeLabel: 'إشعار النموذج الأولي',
    close: 'إغلاق',
    homeLink: 'Newcomer Compass: اختر لغتك',
    guideName: 'دليل Newcomer Compass',
  },
};
