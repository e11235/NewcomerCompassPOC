/**
 * The roadmap as plain HTML, for printing and for the "Download my roadmap"
 * file. Ported from the click-through prototype. Answers are not included.
 */
import { CONTENT, GLOSSARY } from '../content/content-data';
import type { ContentModel, LanguageCode, Localized } from '../content/types';
import { LOGO_MARK_SVG } from '../shared/logo';
import { orgLinks, organizationsOnRoadmap, sourceUrl, stepLinks, type ChannelLink } from './links';
import { prerequisitesOf, statusForState, type Journey, type JourneyStep, type Roadmap, type RoadmapStatus } from './rules';

export interface DocumentLabels {
  title: string;
  situation: string;
  created: string;
  intro: string;
  disclaimer: string;
  statusNames: Record<RoadmapStatus, string>;
  doThisFirst: string;
  then: string;
  whatToDo: string;
  need: string;
  whereToGo: string;
  official: string;
  places: string;
  help: string;
  helpBody: string;
  channelNames: Record<ChannelLink['channel'], string>;
  stepWord: (n: number) => string;
  otherSupports: string;
  wherePlaces?: { title: string; note: string; items: { steps: string; name: string; lines: string[] }[] };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const link = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;

/** The body of the printable roadmap. */
export function roadmapBodyHtml(
  roadmap: Roadmap,
  journey: Journey,
  completed: Set<string>,
  situationLabel: string,
  lang: LanguageCode,
  labels: DocumentLabels,
  model: ContentModel = CONTENT,
): string {
  const links = (list: ChannelLink[]) =>
    list.map((l) => `<li>${esc(labels.channelNames[l.channel])}: ${link(l.href, l.phone ?? l.href)}</li>`).join('');
  const stepHtml = (step: JourneyStep, status: RoadmapStatus, position: number | null) => {
    const program = step.program;
    const source = model.sources.find((s) => s.id === program.sourceId);
    const official = sourceUrl(source, lang);
    const prereqs = prerequisitesOf(step, journey);
    const done = completed.has(program.id);
    return `<li class="step">
<h3><span class="box" aria-hidden="true">${done ? '&#9745;' : '&#9744;'}</span> ${position ? `${esc(labels.stepWord(position))}: ` : ''}${esc(program.shortTitle[lang])}</h3>
<p class="status">${esc(labels.statusNames[done ? 'done' : status])}</p>
${status === 'not_yet' && prereqs.length ? `<p><strong>${esc(labels.doThisFirst)}:</strong> ${esc(prereqs.map((p) => p.program.shortTitle[lang]).join(', '))}. <strong>${esc(labels.then)}:</strong> ${esc(program.shortTitle[lang])}.</p>` : ''}
<p><strong>${esc(labels.whatToDo)}:</strong> ${esc(program.action[lang])}</p>
<p><strong>${esc(labels.need)}:</strong> ${esc(
      program.documents
        .slice(0, 3)
        .map((d) => d[lang])
        .join('; '),
    )}</p>
<p><strong>${esc(labels.whereToGo)}:</strong> ${esc(model.organizations.find((o) => o.id === program.orgId)?.name[lang] ?? '')}</p>
<ul>${links(stepLinks(program, lang, model))}</ul>
${official ? `<p><strong>${esc(labels.official)}:</strong> ${link(official, official)}</p>` : ''}
</li>`;
  };
  const steps = roadmap.nodes
    .map((node) =>
      node.kind === 'step'
        ? stepHtml(node.step, node.status, node.position)
        : `<li class="step"><h3>${esc(labels.stepWord(node.position))}: ${esc(labels.otherSupports)}</h3><ul class="nested">${node.steps
            .map((s) => stepHtml(s, statusForState(s.result.state), null))
            .join('')}</ul></li>`,
    )
    .join('\n');
  const orgs = organizationsOnRoadmap(roadmap, model)
    .map(({ org }) => `<li><strong>${esc(org.name[lang])}</strong> — ${esc(org.role[lang])}<ul>${links(orgLinks(org, lang))}</ul></li>`)
    .join('\n');
  const places = labels.wherePlaces?.items.length
    ? `<h2>${esc(labels.wherePlaces.title)}</h2>
<ol>
${labels.wherePlaces.items.map((p) => `<li><strong>${esc(p.steps)}</strong>: ${esc(p.name)}${p.lines.map((l) => `<br>${esc(l)}`).join('')}</li>`).join('\n')}
</ol>
<p class="note">${esc(labels.wherePlaces.note)}</p>
`
    : '';
  return `<div class="doc-brand">${LOGO_MARK_SVG}<span>${esc(labels.title)}</span></div>
<h1>${esc(labels.title)}</h1>
<p>${esc(labels.situation)}: <strong>${esc(situationLabel)}</strong><br>${esc(labels.created)}</p>
<p>${esc(labels.intro)}</p>
<ol class="steps">
${steps}
</ol>
${places}<h2>${esc(labels.places)}</h2>
<ul>
${orgs}
</ul>
<h2>${esc(labels.help)}</h2>
<p>${esc(labels.helpBody)}</p>
<p class="note">${esc(labels.disclaimer)}</p>
`;
}

/** A complete, self-contained HTML file for "Download my roadmap". */
export function roadmapFileHtml(body: string, lang: LanguageCode, title: string): string {
  return `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>
<style>body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Arabic",sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem;line-height:1.5;color:#111}
h1{font-size:1.8rem;margin-bottom:.25rem}h2{margin-top:2rem;border-bottom:2px solid #26374a}h3{margin:.25rem 0}.status{font-weight:700;text-transform:uppercase;font-size:.8rem;letter-spacing:.04em}
ol.steps{list-style:none;padding:0}.step{border:1px solid #bbb;border-radius:.75rem;padding:.75rem 1rem;margin:.75rem 0}.nested{list-style:none;padding:0}.box{font-size:1.2rem}
a{color:#1a4d8f;word-break:break-all}.note{font-size:.9rem;border-top:1px solid #bbb;padding-top:.75rem;margin-top:2rem}
.doc-brand{display:flex;align-items:center;gap:.5rem;font-weight:700;color:#062748}.doc-brand svg{width:2.5rem;height:2.5rem}</style></head>
<body>
${body}
</body>
</html>`;
}

/** "Explain in simpler words": approved plain-language text plus glossary terms. */
export function simplerWords(step: JourneyStep): Localized[] {
  const program = step.program;
  const terms = GLOSSARY.filter((g) => program.glossary.includes(g.id));
  return [
    program.plain,
    ...terms.map((g) => ({
      en: `${g.term.en}: ${g.plain.en}`,
      fr: `${g.term.fr} : ${g.plain.fr}`,
      ar: `${g.term.ar}: ${g.plain.ar}`,
    })),
  ];
}
