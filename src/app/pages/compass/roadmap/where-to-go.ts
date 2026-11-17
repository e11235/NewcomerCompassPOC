import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { CONTENT } from '../../../content/content-data';
import type { Channel, Program } from '../../../content/types';
import { findOrg, finderUrl, telHref } from '../../../engine/links';
import { FULL_VIEW, fitView, type MapFocus, type Stop, type WhereToGo as WhereData } from '../../../engine/places';
import type { JourneyStep, RoadmapNode } from '../../../engine/rules';
import { I18n, LOCALES } from '../../../i18n/i18n';
import { Icon } from '../../../shared/icon';
import { MediaQuery } from '../../../shared/media-query';
import { CityMap } from './city-map';
import { DemoBadge, LegendPin } from './badges';

/** "Official location finder: Service Canada" links. */
@Component({
  selector: 'app-finder-links',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="mt-3 space-y-2 text-sm">
      @for (f of finders(); track f.id) {
        <li>
          <a [href]="f.href" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-1.5 font-semibold text-blue-800 underline underline-offset-4">
            <app-icon name="external-link" class="size-4" />
            <span>{{ t().finderLink(f.name) }}<span class="sr-only"> ({{ t().opensNewTab }})</span></span>
          </a>
        </li>
      }
    </ul>
  `,
})
export class FinderLinks {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  readonly orgIds = input.required<string[]>();
  protected readonly finders = computed(() =>
    this.orgIds()
      .map((id) => {
        const org = findOrg(id);
        const href = finderUrl(org, this.i18n.lang());
        return org && href ? { id, href, name: this.i18n.pick(org.name) } : null;
      })
      .filter((f) => f !== null),
  );
}

/** The card over the map that shows the selected place or step. */
@Component({
  selector: 'app-map-card',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block rounded-2xl border-2 border-[#26374a] bg-card p-4 shadow-lg' },
  template: `
    <article aria-labelledby="place-h">
      <div class="flex items-start gap-2">
        <div class="min-w-0 flex-1">
          <div class="text-sm font-semibold text-muted-foreground"><ng-content select="[eyebrow]" /></div>
          <h3 id="place-h" tabindex="-1" class="text-lg leading-snug font-bold outline-none focus-visible:outline-2 focus-visible:outline-ring">
            {{ heading() }}
          </h3>
        </div>
        <button type="button" class="btn btn-ghost btn-icon size-11" [attr.aria-label]="t().clearSelection" (click)="clear.emit()">
          <app-icon name="x" />
        </button>
      </div>
      <ng-content />
    </article>
  `,
})
export class MapCard {
  protected readonly t = inject(I18n).t;
  readonly heading = input.required<string>();
  readonly clear = output();
}

interface RoadmapStepRef {
  key: string;
  position: number;
  step: JourneyStep;
}

/** Details of one place: what it helps with, the steps it supports, and how to reach it. */
@Component({
  selector: 'app-place-details',
  imports: [DemoBadge, Icon, MapCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let loc = stop().location;
    <app-map-card [heading]="i18n.pick(loc.displayName)" (clear)="clear.emit()">
      <span eyebrow class="flex flex-wrap items-center gap-2">
        <span>{{ placeType() }}</span>
        @if (loc.isDemo) {
          <app-demo-badge />
        }
      </span>
      <div class="mt-2 space-y-3 text-sm">
        <p>{{ i18n.pick(loc.helpsWith) }}</p>
        <div>
          <p class="font-semibold">{{ t().supports }}:</p>
          @if (stop().kind === 'help') {
            <p class="flex items-center gap-1.5"><app-icon name="life-buoy" class="size-4 text-red-700" />{{ t().helpStopLabel }}</p>
          } @else {
            <ul class="mt-0.5">
              @for (r of stepRefs(); track r.key) {
                <li>
                  <button
                    type="button"
                    (click)="showStep.emit(r.key)"
                    class="inline-flex min-h-11 items-center gap-2 rounded-md text-start font-semibold text-blue-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#26374a] text-xs text-white no-underline">{{
                      r.position
                    }}</span>
                    <span
                      ><span class="sr-only">{{ t().stepLabel(r.position) }}: </span>{{ i18n.pick(r.step.program.shortTitle)
                      }}<span class="sr-only"> ({{ t().showInRoadmap }})</span></span
                    >
                  </button>
                </li>
              }
            </ul>
          }
        </div>
        @if (loc.isDemo && loc.demonstrationAddress) {
          <p class="flex items-start gap-1.5">
            <app-icon name="map-pin" class="mt-0.5 size-4" />
            <span><strong>{{ t().demoAddress }}:</strong> <span dir="ltr">{{ loc.demonstrationAddress }}</span></span>
          </p>
        }
        @if (loc.isDemo) {
          <p class="flex items-start gap-1.5">
            <app-icon name="ruler" class="mt-0.5 size-4" />
            <span><strong>{{ t().distance }}:</strong> {{ t().demoDistance(km(), cityName()) }}</span>
          </p>
        }
        @if (loc.verified; as v) {
          @if (v.address) {
            <p class="flex items-start gap-1.5">
              <app-icon name="map-pin" class="mt-0.5 size-4" /><span><strong>{{ t().address }}:</strong> <span dir="ltr">{{ v.address }}</span></span>
            </p>
          }
          @if (v.phone) {
            <p class="flex items-start gap-1.5">
              <app-icon name="phone" class="mt-0.5 size-4" /><span
                ><strong>{{ t().phone }}:</strong> <a [href]="tel(v.phone)" dir="ltr" class="underline underline-offset-4">{{ v.phone }}</a></span
              >
            </p>
          }
        }
        <div>
          <p class="font-semibold">{{ t().channelsAvailable }}:</p>
          <ul class="mt-1 flex flex-wrap gap-1.5">
            @for (c of channels(); track c) {
              <li class="rounded-full border px-2.5 py-0.5 text-sm">{{ t().channelNames[c] }}</li>
            }
          </ul>
        </div>
        @if (officialHref(); as href) {
          <div class="flex flex-wrap gap-2">
            <a [href]="href" target="_blank" rel="noopener noreferrer" class="btn btn-outline min-h-11">
              <app-icon name="external-link" />{{ t().officialInfo }}<span class="sr-only"> ({{ t().opensNewTab }})</span>
            </a>
          </div>
        }
        @if (!loc.verified) {
          <p class="rounded-lg bg-muted p-2 text-sm">{{ t().demoPlaceNote }}</p>
        }
      </div>
    </app-map-card>
  `,
})
export class PlaceDetails {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  readonly stop = input.required<Stop>();
  readonly cityName = input.required<string>();
  readonly steps = input.required<RoadmapStepRef[]>();
  readonly showStep = output<string>();
  readonly clear = output();
  protected readonly tel = telHref;

  protected readonly placeType = computed(() => this.t().placeTypes[this.stop().location.serviceType] ?? this.t().selectedPlace);
  protected readonly stepRefs = computed(() =>
    this.stop()
      .nodeKeys.map((key) => this.steps().find((s) => s.key === key))
      .filter((s): s is RoadmapStepRef => !!s),
  );
  protected readonly officialHref = computed(() => finderUrl(findOrg(this.stop().location.orgId), this.i18n.lang()));
  protected readonly km = computed(() =>
    this.stop().distanceKm.toLocaleString(LOCALES[this.i18n.lang()], { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  );
  protected readonly channels = computed(() => {
    const s = this.stop();
    const programs: Program[] =
      s.kind === 'help' ? CONTENT.programs.filter((p) => s.location.relatedActionIds.includes(p.id)) : s.steps.map((st) => st.program);
    return (['in_person', 'phone', 'online', 'worker'] as Channel[]).filter(
      (c) => c === 'in_person' || programs.some((p) => p.channels.includes(c)),
    );
  });
}

/** Details for a step focused on the map: several places to choose from, no visit needed, or a finder link. */
@Component({
  selector: 'app-step-places',
  imports: [DemoBadge, FinderLinks, Icon, MapCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ref(); as r) {
      @let title = i18n.pick(r.step.program.shortTitle);
      @switch (places()?.kind) {
        @case ('places') {
          <app-map-card [heading]="t().chooseTitle(choices().length, title)" (clear)="clear.emit()">
            <span eyebrow>{{ t().stepLabel(r.position) }}</span>
            <p class="mt-1 text-sm">{{ t().chooseBody }}</p>
            <ul class="mt-3 space-y-2">
              @for (c of choices(); track c.location.id) {
                <li>
                  <button
                    type="button"
                    (click)="selectPlace.emit(c.location.id)"
                    class="flex min-h-11 w-full items-center gap-3 rounded-xl border-2 p-2.5 text-start font-semibold hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <app-icon name="map-pin" class="size-5 text-red-700" />
                    <span class="min-w-0 flex-1">{{ i18n.pick(c.location.displayName) }}</span>
                    @if (c.location.isDemo) {
                      <app-demo-badge />
                    }
                  </button>
                </li>
              }
            </ul>
          </app-map-card>
        }
        @case ('remote') {
          <app-map-card [heading]="t().remoteTitle(title)" (clear)="clear.emit()">
            <span eyebrow>{{ t().stepLabel(r.position) }}</span>
            <p class="mt-1 text-sm">{{ t().remoteBody }}</p>
          </app-map-card>
        }
        @default {
          <app-map-card [heading]="t().finderTitle(title)" (clear)="clear.emit()">
            <span eyebrow>{{ t().stepLabel(r.position) }}</span>
            <p class="mt-1 text-sm">{{ t().finderBody }}</p>
            <app-finder-links [orgIds]="[r.step.program.orgId]" />
          </app-map-card>
        }
      }
    }
  `,
})
export class StepPlaces {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  readonly where = input.required<WhereData>();
  readonly ref = input.required<RoadmapStepRef | undefined>();
  readonly selectPlace = output<string>();
  readonly clear = output();
  protected readonly places = computed(() => {
    const r = this.ref();
    return r ? this.where().byStep[r.key] : undefined;
  });
  protected readonly choices = computed(() => {
    const p = this.places();
    return p?.kind === 'places'
      ? p.locationIds.map((id) => this.where().stops.find((s) => s.location.id === id)).filter((s): s is Stop => !!s)
      : [];
  });
}

/** "Where to go": the map with the details card, or finder links when we have no map for the city. */
@Component({
  selector: 'app-where-to-go',
  imports: [CityMap, FinderLinks, Icon, LegendPin, PlaceDetails, StepPlaces],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="where-h" id="where-to-go" class="scroll-mt-4">
      <h2 id="where-h" class="flex items-center gap-2 text-2xl font-bold">
        <app-icon name="map-pin" class="size-6 text-red-700" />{{ t().whereToGoTitle }}
      </h2>
      @if (where().area) {
        <p class="mt-1 text-muted-foreground">{{ t().whereToGoIntro }}</p>
      }
      @if (hasDemo()) {
        <p
          class="mt-2 inline-flex items-center gap-2 rounded-lg border border-dashed border-amber-700/60 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-950"
        >
          <app-icon name="flask-conical" class="size-4" />{{ t().demoCaption }}
        </p>
      }

      @if (where().area; as area) {
        <div class="relative mt-3 overflow-hidden rounded-2xl border-2 bg-card">
          <app-city-map
            [where]="where()"
            [target]="target()"
            [selectedId]="selectedId()"
            [candidates]="candidates()"
            (selectPlace)="selectPlace.emit($event)"
          />
          @if (zoomed()) {
            <button type="button" class="btn btn-secondary absolute end-2 top-2 min-h-11 border shadow" (click)="zoomedOutFor.set(focus())">
              <app-icon name="maximize-2" />{{ t().showWholeMap }}
            </button>
          }
          <div
            id="place-details"
            aria-live="polite"
            class="scroll-mt-4 border-t p-3 min-[900px]:absolute min-[900px]:start-3 min-[900px]:bottom-3 min-[900px]:max-h-[calc(100%-1.5rem)] min-[900px]:w-[min(23rem,calc(100%-1.5rem))] min-[900px]:overflow-y-auto min-[900px]:border-t-0 min-[900px]:p-0"
          >
            @if (focus(); as f) {
              @if (f.kind === 'place') {
                @if (focusedStop(); as s) {
                  <app-place-details
                    [stop]="s"
                    [cityName]="i18n.pick(area.name)"
                    [steps]="stepRefs()"
                    (showStep)="showStep.emit($event)"
                    (clear)="clear.emit()"
                  />
                }
              } @else {
                <app-step-places [where]="where()" [ref]="stepRef(f.stepKey)" (selectPlace)="selectPlace.emit($event)" (clear)="clear.emit()" />
              }
            } @else {
              <p class="flex items-center gap-2 rounded-xl bg-card/95 px-3 py-2 text-sm shadow-sm min-[900px]:border">
                <app-icon name="info" class="size-4" />{{ t().selectPrompt }}
              </p>
            }
          </div>
        </div>
        <div class="mt-2 space-y-1 text-sm">
          <ul [attr.aria-label]="t().mapLegend" class="flex flex-wrap gap-x-4 gap-y-1">
            <li class="inline-flex items-center gap-1.5"><app-legend-pin fill="fill-[#26374a]" />{{ t().legendHere }}</li>
            <li class="inline-flex items-center gap-1.5"><app-legend-pin fill="fill-white stroke-[#26374a]" />{{ t().legendLater }}</li>
            <li class="inline-flex items-center gap-1.5"><app-legend-pin fill="fill-green-800" />{{ t().legendDone }}</li>
            <li class="inline-flex items-center gap-1.5"><app-legend-pin fill="fill-red-700" />{{ t().legendHelp }}</li>
            <li class="inline-flex items-center gap-1.5">
              <span class="inline-block size-4 rounded-full border-2 border-dashed border-[#26374a] bg-[#26374a]/10"></span>{{ t().approxArea }}
            </li>
          </ul>
          <p class="text-muted-foreground">
            {{ t().mapCaption(i18n.pick(area.name)) }}
            @if (hasDemo()) {
              {{ t().approxAreaNote(i18n.pick(area.name)) }}
            }
          </p>
        </div>
      } @else {
        <div class="mt-4 rounded-2xl border-2 border-dashed p-5">
          <h3 class="text-lg font-bold">{{ where().noArea === 'notMapped' ? t().notMappedTitle(where().city ?? '') : t().noCityTitle }}</h3>
          <p class="mt-1">{{ where().noArea === 'notMapped' ? t().notMappedBody : t().noCityBody }}</p>
          @if (finderOrgIds().length) {
            <app-finder-links [orgIds]="finderOrgIds()" />
          }
          @if (where().noArea === 'noCity') {
            <button type="button" class="btn btn-outline mt-4 min-h-11" (click)="addCity.emit()">
              <app-icon name="map-pin" />{{ t().addCity }}
            </button>
          }
        </div>
      }
    </section>
  `,
})
export class WhereToGo {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  private readonly wide = inject(MediaQuery).matches('(min-width: 900px)');
  readonly where = input.required<WhereData>();
  readonly nodes = input.required<RoadmapNode[]>();
  readonly focus = input<MapFocus | null>(null);
  readonly selectPlace = output<string>();
  readonly showStep = output<string>();
  readonly clear = output();
  readonly addCity = output();

  /** "Show the whole map" zooms out until the focus changes. */
  protected readonly zoomedOutFor = signal<MapFocus | null>(null);

  protected readonly stepRefs = computed<RoadmapStepRef[]>(() =>
    this.nodes().flatMap((n) => (n.kind === 'step' ? [{ key: n.key, position: n.position, step: n.step }] : [])),
  );
  protected stepRef(key: string): RoadmapStepRef | undefined {
    return this.stepRefs().find((r) => r.key === key);
  }
  protected readonly hasDemo = computed(() => this.where().stops.some((s) => s.location.isDemo));
  protected readonly selectedId = computed(() => {
    const f = this.focus();
    return f?.kind === 'place' ? f.locationId : null;
  });
  protected readonly candidates = computed(() => {
    const f = this.focus();
    const places = f?.kind === 'step' ? this.where().byStep[f.stepKey] : undefined;
    return places?.kind === 'places' ? places.locationIds : [];
  });
  protected readonly focusedStop = computed(() => this.where().stops.find((s) => s.location.id === this.selectedId()));
  private readonly zoomStops = computed(() => {
    const id = this.selectedId();
    const c = this.candidates();
    return id ? this.where().stops.filter((s) => s.location.id === id) : this.where().stops.filter((s) => c.includes(s.location.id));
  });
  protected readonly target = computed(() => {
    const stops = this.zoomStops();
    const zoomedOut = this.zoomedOutFor() !== null && this.zoomedOutFor() === this.focus();
    if (!stops.length || zoomedOut) return FULL_VIEW;
    // On wide screens the details card covers the start side, so the pins sit towards the other side.
    const anchor = this.wide() ? { x: this.i18n.lang() === 'ar' ? 0.36 : 0.64, y: 0.36 } : { x: 0.5, y: 0.5 };
    return fitView(stops, FULL_VIEW, anchor);
  });
  protected readonly zoomed = computed(() => this.target() !== FULL_VIEW);
  protected readonly finderOrgIds = computed(() => {
    const f = this.focus();
    const focusStep = f?.kind === 'step' ? this.stepRef(f.stepKey)?.step : undefined;
    const steps = focusStep ? [focusStep] : this.stepRefs().map((r) => r.step).filter((s) => s.program.channels.includes('in_person'));
    return [...new Set(steps.map((s) => s.program.orgId))];
  });
}
