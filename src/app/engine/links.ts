/** Ways to reach an organization or do a step: online, in person, by phone, or with a settlement worker. */
import { CONTENT } from '../content/content-data';
import type { Channel, ContentModel, LanguageCode, Organization, Program, Source } from '../content/types';
import { nodeSteps, type JourneyStep, type Roadmap } from './rules';

export interface ChannelLink {
  channel: Channel;
  href: string;
  phone?: string;
}

/** French URL when there is one and the page is in French. */
export const localizedUrl = (url: string | null | undefined, urlFr: string | null | undefined, lang: LanguageCode) =>
  (lang === 'fr' && urlFr ? urlFr : url) ?? null;

export const sourceUrl = (source: Source | undefined, lang: LanguageCode) =>
  source ? localizedUrl(source.url, source.urlFr, lang) : null;

export const telHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`;

export const findOrg = (id: string, model: ContentModel = CONTENT) => model.organizations.find((o) => o.id === id);

/** Links for one step, in the order of the program's channels. */
export function stepLinks(program: Program, lang: LanguageCode, model: ContentModel = CONTENT): ChannelLink[] {
  const org = findOrg(program.orgId, model);
  const source = model.sources.find((s) => s.id === program.sourceId);
  const ircc = findOrg('org_ircc', model);
  const links: ChannelLink[] = [];
  for (const channel of program.channels) {
    if (channel === 'online') {
      const href = sourceUrl(source, lang) ?? localizedUrl(org?.contact.onlineUrl, org?.contact.onlineUrlFr, lang);
      if (href) links.push({ channel, href });
    } else if (channel === 'in_person') {
      const href = localizedUrl(org?.contact.inPersonUrl, org?.contact.inPersonUrlFr, lang);
      if (href) links.push({ channel, href });
    } else if (channel === 'phone') {
      const phone = source?.phone ?? org?.contact.phone ?? undefined;
      if (phone) links.push({ channel, href: telHref(phone), phone });
    } else if (channel === 'worker' && ircc && program.orgId !== 'org_ircc') {
      const href = localizedUrl(ircc.contact.inPersonUrl, ircc.contact.inPersonUrlFr, lang);
      if (href && !links.some((l) => l.href === href)) links.push({ channel, href });
    }
  }
  return links;
}

/** Links for an organization as a whole. */
export function orgLinks(org: Organization, lang: LanguageCode): ChannelLink[] {
  const links: ChannelLink[] = [];
  const online = localizedUrl(org.contact.onlineUrl, org.contact.onlineUrlFr, lang);
  const inPerson = localizedUrl(org.contact.inPersonUrl, org.contact.inPersonUrlFr, lang);
  if (online && online !== inPerson) links.push({ channel: 'online', href: online });
  if (inPerson) links.push({ channel: org.id === 'org_ircc' ? 'worker' : 'in_person', href: inPerson });
  if (org.contact.phone) links.push({ channel: 'phone', href: telHref(org.contact.phone), phone: org.contact.phone });
  return links;
}

/** Organizations on the roadmap with the steps they handle (settlement help is always included). */
export function organizationsOnRoadmap(roadmap: Roadmap, model: ContentModel = CONTENT) {
  const byOrg = new Map<string, JourneyStep[]>();
  for (const step of roadmap.nodes.flatMap(nodeSteps)) {
    byOrg.set(step.program.orgId, [...(byOrg.get(step.program.orgId) ?? []), step]);
  }
  if (!byOrg.has('org_ircc')) byOrg.set('org_ircc', []);
  return [...byOrg.entries()]
    .map(([orgId, steps]) => ({ org: findOrg(orgId, model), steps }))
    .filter((e): e is { org: Organization; steps: JourneyStep[] } => !!e.org);
}

/** Where to find the organization in person (or online if it has no finder). */
export function finderUrl(org: Organization | undefined, lang: LanguageCode): string | null {
  if (!org) return null;
  return (
    localizedUrl(org.contact.inPersonUrl, org.contact.inPersonUrlFr, lang) ??
    localizedUrl(org.contact.onlineUrl, org.contact.onlineUrlFr, lang)
  );
}
