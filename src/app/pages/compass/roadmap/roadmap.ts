import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CONTENT } from '../../../content/content-data';
import { finderUrl, findOrg } from '../../../engine/links';
import { buildWhereToGo, focusForStep, highlightedKeys, type MapFocus } from '../../../engine/places';
import { roadmapBodyHtml, roadmapFileHtml, type DocumentLabels } from '../../../engine/roadmap-document';
import { I18n, LOCALES } from '../../../i18n/i18n';
import { Icon } from '../../../shared/icon';
import { MediaQuery } from '../../../shared/media-query';
import { JourneyStore } from '../../../state/journey-store';
import { PlacesSection } from './places-section';
import { RoadmapChat } from './roadmap-chat';
import { RoadmapRow } from './roadmap-row';
import { WhereToGo } from './where-to-go';

/** Step 3: "Your roadmap": what to do (in order), where to go (map), places that can help. */
@Component({
  selector: 'app-roadmap',
  imports: [Icon, PlacesSection, RoadmapChat, RoadmapRow, WhereToGo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.journey(); as journey) {
      @if (store.roadmap(); as roadmap) {
        <div class="no-print">
          <div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
            <div class="max-w-3xl">
              <p class="text-lg">{{ t().roadmapIntro }}</p>
              <p class="text-muted-foreground">{{ t().guidanceNotDecision }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" class="btn btn-ghost min-h-11 underline underline-offset-4" (click)="store.review()">
                <app-icon name="pencil" />{{ t().change }}
              </button>
              <button type="button" class="btn btn-outline min-h-11" (click)="print()"><app-icon name="printer" />{{ t().printRoadmap }}</button>
              <button type="button" class="btn btn-outline min-h-11" aria-describedby="download-hint" (click)="download()">
                <app-icon name="download" />{{ t().downloadRoadmap }}
              </button>
            </div>
          </div>
          <p id="download-hint" class="sr-only">{{ t().downloadHint }}</p>

          <div class="mt-5 grid gap-8 min-[900px]:grid-cols-[minmax(0,13fr)_minmax(0,7fr)] min-[900px]:gap-x-7">
            <div class="min-w-0 min-[900px]:col-start-2 min-[900px]:row-start-1">
              <h2 class="mb-3 flex items-center gap-2 text-2xl font-bold">
                <app-icon name="list-checks" class="size-6 text-[#26374a]" />{{ t().roadmapWhatToDo }}
              </h2>
              <ol class="relative" [attr.aria-label]="t().roadmapListLabel">
                @for (p of donePrograms(); track p.id) {
                  <li class="grid grid-cols-[2.75rem_1fr] gap-x-3 pb-5">
                    <div class="relative flex justify-center">
                      <span class="z-10 flex size-9 items-center justify-center rounded-full bg-green-800 text-white">
                        <app-icon name="check" class="size-5" />
                      </span>
                      <span class="absolute top-11 bottom-0 w-0 border-s-2 border-border"></span>
                    </div>
                    <div class="min-w-0 pt-1.5">
                      <p class="font-semibold"><span class="sr-only">{{ t().roadmapStatus.done }}: </span>{{ i18n.pick(p.shortTitle) }}</p>
                      <div class="text-sm text-muted-foreground">{{ t().alreadyDoneReported }}</div>
                    </div>
                  </li>
                }
                @for (node of roadmap.nodes; track node.key; let i = $index, last = $last) {
                  <li>
                    <app-roadmap-row
                      [node]="node"
                      [journey]="journey"
                      [handoff]="handoffFor(node.key)"
                      [isCurrent]="i === roadmap.currentIndex"
                      [isLast]="last"
                      [open]="openKey() === node.key"
                      [completed]="store.completed()"
                      [places]="node.kind === 'step' ? where().byStep[node.key] : undefined"
                      [highlighted]="highlighted().has(node.key)"
                      (toggleOpen)="toggleOpen(node.key, node.kind === 'step')"
                      (toggleDone)="store.toggleComplete($event)"
                      (showOnMap)="focusStep(node.key, true)"
                    />
                  </li>
                }
              </ol>
            </div>
            <div class="min-w-0 min-[900px]:sticky min-[900px]:top-4 min-[900px]:col-start-1 min-[900px]:row-start-1 min-[900px]:self-start">
              <app-where-to-go
                [where]="where()"
                [nodes]="roadmap.nodes"
                [focus]="focus()"
                (selectPlace)="selectPlace($event)"
                (showStep)="showStep($event)"
                (clear)="focus.set(null)"
                (addCity)="store.review()"
              />
            </div>
          </div>

          <div class="mt-10 space-y-8">
            <app-places-section [where]="where()" [roadmap]="roadmap" (viewOnMap)="viewOnMap($event)" />
            <section aria-labelledby="want-help-h" class="no-print rounded-2xl bg-muted p-5">
              <h2 id="want-help-h" class="flex items-center gap-2 text-lg font-bold">
                <app-icon name="life-buoy" class="size-5 text-red-700" />{{ t().wantHelp }}
              </h2>
              <p class="mt-1 text-sm">{{ t().wantHelpBody }}</p>
              <button type="button" class="btn btn-primary mt-3" (click)="store.helpOpen.set(true)">
                {{ t().wantHelpCta }}<app-icon name="arrow-right" class="flip-rtl" />
              </button>
            </section>
            <p class="text-sm text-muted-foreground">{{ t().downloadHint }}</p>
          </div>
        </div>
        <app-roadmap-chat />
        <div class="print-only" [innerHTML]="printHtml()"></div>
        @if (toast()) {
          <div role="status" class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[#26374a] px-4 py-3 text-sm font-semibold text-white shadow-lg">
            <span class="inline-flex items-center gap-2"><app-icon name="circle-check" class="size-4" />{{ toast() }}</span>
          </div>
        }
      }
    }
  `,
})
export class RoadmapView {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly store = inject(JourneyStore);
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly wide = inject(MediaQuery).matches('(min-width: 900px)');

  protected readonly openKey = signal<string | null>(null);
  protected readonly focus = signal<MapFocus | null>(null);
  protected readonly toast = signal<string | null>(null);

  protected readonly where = computed(() => {
    const answers = this.store.answers();
    const str = (v: unknown) => (typeof v === 'string' ? v : undefined);
    return buildWhereToGo(this.store.roadmap()!, { province: str(answers['province']), city: str(answers['city']) });
  });
  protected readonly highlighted = computed(() => new Set(highlightedKeys(this.where(), this.focus())));
  protected readonly donePrograms = computed(() =>
    (this.store.journey()?.done ?? []).map((d) => CONTENT.programs.find((p) => p.id === d.programId)!),
  );

  protected handoffFor(key: string) {
    return this.store.handoffs().find((h) => h.handoff.toProgramId === key);
  }

  private afterRender(fn: () => void): void {
    requestAnimationFrame(fn);
  }

  /** Scrolls the map into view (if it isn't) and moves focus to the details card. */
  private revealMap(): void {
    this.afterRender(() => {
      const section = this.document.getElementById('where-to-go');
      const rect = section?.getBoundingClientRect();
      const visible = !!rect && rect.top >= 0 && rect.top < window.innerHeight * 0.5;
      if (section && !visible) section.scrollIntoView({ block: 'start', behavior: 'smooth' });
      this.document.getElementById('place-h')?.focus({ preventScroll: true });
    });
  }

  protected focusStep(key: string, reveal = false): void {
    this.focus.set(focusForStep(this.where(), key));
    if (reveal) this.revealMap();
  }

  protected selectPlace(locationId: string): void {
    const focus: MapFocus = { kind: 'place', locationId };
    this.focus.set(focus);
    const keys = highlightedKeys(this.where(), focus);
    this.afterRender(() => {
      if (this.wide() && keys[0]) {
        this.document.getElementById(`row-${keys[0]}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        this.document.getElementById('place-details')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      this.document.getElementById('place-h')?.focus({ preventScroll: true });
    });
  }

  protected viewOnMap(locationId: string): void {
    this.focus.set({ kind: 'place', locationId });
    this.revealMap();
  }

  protected showStep(key: string): void {
    this.openKey.set(key);
    this.afterRender(() => {
      const toggle = this.document.getElementById(`toggle-${key}`);
      toggle?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      toggle?.focus({ preventScroll: true });
    });
  }

  protected toggleOpen(key: string, isStep: boolean): void {
    const opening = this.openKey() !== key;
    this.openKey.set(opening ? key : null);
    if (opening && isStep) this.focusStep(key);
  }

  private readonly labels = computed<DocumentLabels>(() => {
    const t = this.t();
    const lang = this.i18n.lang();
    const where = this.where();
    const created = new Date().toLocaleDateString(LOCALES[lang], { dateStyle: 'long' });
    return {
      title: `${t.appName}: ${t.roadmapTitle}`,
      situation: t.screens.situation,
      created: t.planCreated(created),
      intro: t.roadmapIntro,
      disclaimer: `${t.guidanceNotDecision} ${t.disclaimer}`,
      statusNames: t.roadmapStatus,
      doThisFirst: t.doThisFirst,
      then: t.thenLabel,
      whatToDo: t.dWhatToDo,
      need: t.dNeed,
      whereToGo: t.dWhere,
      official: t.dOfficial,
      places: t.placesTitle,
      help: t.helpTitle,
      helpBody: t.helpDocBody,
      channelNames: { ...t.channelNames, in_person: t.findInPerson, worker: t.findHelp },
      stepWord: t.stepLabel,
      otherSupports: t.otherSupportsTitle,
      wherePlaces: where.area
        ? {
            title: t.whereToGoTitle,
            note: [
              t.mapCaption(where.area.name[lang]),
              ...(where.stops.some((s) => s.location.isDemo) ? [t.demoCaption, t.demoPlaceNote] : []),
            ].join(' '),
            items: where.stops.map((s) => ({
              steps: s.kind === 'help' ? t.helpStopLabel : t.forStepsN(s.positions),
              name: s.location.displayName[lang],
              lines: [
                ...(s.location.isDemo && s.location.demonstrationAddress ? [`${t.demoAddress}: ${s.location.demonstrationAddress}`] : []),
                ...(s.location.verified?.address ? [s.location.verified.address] : []),
                ...(s.location.verified ? [] : [finderUrl(findOrg(s.location.orgId), lang)].filter((u): u is string => !!u)),
              ],
            })),
          }
        : undefined,
    };
  });

  private readonly bodyHtml = computed(() =>
    roadmapBodyHtml(
      this.store.roadmap()!,
      this.store.journey()!,
      new Set(this.store.completed()),
      this.i18n.pick(this.store.situation()?.label),
      this.i18n.lang(),
      this.labels(),
    ),
  );
  // Safe to trust: every piece of text in the document is HTML-escaped, and it contains no answers.
  protected readonly printHtml = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.bodyHtml()));

  protected print(): void {
    window.print();
  }

  protected download(): void {
    const t = this.t();
    const html = roadmapFileHtml(this.bodyHtml(), this.i18n.lang(), this.labels().title);
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const a = this.document.createElement('a');
    a.href = url;
    a.download = t.roadmapFileName;
    this.document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.toast.set(t.downloaded);
    setTimeout(() => this.toast.set(null), 4000);
  }
}
