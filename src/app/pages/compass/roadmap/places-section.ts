import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { findOrg, organizationsOnRoadmap, orgLinks } from '../../../engine/links';
import { stopLabel, stopTone, type Stop, type WhereToGo } from '../../../engine/places';
import type { Roadmap } from '../../../engine/rules';
import { I18n, LOCALES } from '../../../i18n/i18n';
import { ChannelLinks } from '../../../layout/channel-links';
import { Icon } from '../../../shared/icon';
import { DemoBadge, PinBadge } from './badges';

/** "Places that can help" cards (numbers match the steps), then organizations reachable online or by phone. */
@Component({
  selector: 'app-places-section',
  imports: [ChannelLinks, DemoBadge, Icon, PinBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="places-h">
      <h2 id="places-h" class="text-2xl font-bold">{{ t().placesTitle }}</h2>
      <p class="mt-1 text-muted-foreground">{{ t().placesIntro }}</p>
      @if (where().stops.length) {
        <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (s of where().stops; track s.location.id) {
            <li [id]="'place-card-' + s.location.id" class="flex flex-col rounded-2xl border-2 bg-card p-4">
              <div class="flex items-start gap-3">
                <app-pin-badge [label]="label(s)" [tone]="tone(s)" />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-muted-foreground">{{ t().placeTypes[s.location.serviceType] }}</p>
                  <h3 class="text-lg leading-snug font-bold">{{ i18n.pick(s.location.displayName) }}</h3>
                </div>
              </div>
              <div class="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span class="rounded-full bg-muted px-2.5 py-0.5 font-semibold">{{
                  s.kind === 'help' ? t().helpStopLabel : t().relatedToSteps(s.positions)
                }}</span>
                @if (s.location.isDemo) {
                  <app-demo-badge />
                }
              </div>
              <p class="mt-2">{{ i18n.pick(s.location.helpsWith) }}</p>
              @if (s.location.isDemo) {
                <div class="mt-2 space-y-0.5 text-sm text-muted-foreground">
                  @if (s.location.demonstrationAddress) {
                    <p class="flex items-start gap-1.5">
                      <app-icon name="map-pin" class="mt-0.5 size-4" /><span
                        >{{ t().demoAddress }}: <span dir="ltr">{{ s.location.demonstrationAddress }}</span></span
                      >
                    </p>
                  }
                  <p class="flex items-start gap-1.5">
                    <app-icon name="ruler" class="mt-0.5 size-4" />{{ t().demoDistance(km(s), cityName()) }}
                  </p>
                </div>
              } @else if (s.location.verified?.address) {
                <p class="mt-2 flex items-start gap-1.5 text-sm">
                  <app-icon name="map-pin" class="mt-0.5 size-4" /><span dir="ltr">{{ s.location.verified?.address }}</span>
                </p>
              }
              <div class="mt-auto space-y-3 pt-4">
                <button type="button" class="btn btn-outline min-h-11" aria-controls="where-to-go" (click)="viewOnMap.emit(s.location.id)">
                  <app-icon name="map-pin" />{{ t().viewOnMap }}<span class="sr-only">: {{ i18n.pick(s.location.displayName) }}</span>
                </button>
                @if (orgFor(s); as org) {
                  <app-channel-links [links]="links(org.id)" [label]="t().waysToAct + ': ' + i18n.pick(org.name)" />
                }
              </div>
            </li>
          }
        </ul>
      }

      @if (otherOrgs().length) {
        @if (where().stops.length) {
          <h3 class="mt-8 text-xl font-bold">{{ t().otherWaysTitle }}</h3>
          <p class="mt-1 text-muted-foreground">{{ t().otherWaysIntro }}</p>
        }
        <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (o of otherOrgs(); track o.org.id) {
            <li class="flex flex-col rounded-2xl border-2 bg-card p-4">
              <h4 class="text-lg font-bold">{{ i18n.pick(o.org.name) }}</h4>
              <p class="mt-0.5 text-muted-foreground">{{ i18n.pick(o.org.role) }}</p>
              @if (o.steps.length) {
                <p class="mt-2 text-sm"><span class="font-semibold">{{ t().forSteps }}: </span>{{ o.forText }}</p>
              } @else {
                <p class="mt-2 text-sm">{{ t().humanHelpOrg }}</p>
              }
              <div class="mt-auto pt-4">
                <app-channel-links [links]="links(o.org.id)" [label]="t().waysToAct + ': ' + i18n.pick(o.org.name)" />
              </div>
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class PlacesSection {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  readonly where = input.required<WhereToGo>();
  readonly roadmap = input.required<Roadmap>();
  readonly viewOnMap = output<string>();

  protected readonly label = stopLabel;
  protected readonly tone = stopTone;
  protected readonly cityName = computed(() => this.i18n.pick(this.where().area?.name));

  protected km(s: Stop): string {
    return s.distanceKm.toLocaleString(LOCALES[this.i18n.lang()], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  protected orgFor(s: Stop) {
    return findOrg(s.location.orgId);
  }
  protected links(orgId: string) {
    return orgLinks(findOrg(orgId)!, this.i18n.lang());
  }

  /** Organizations whose steps have no place on the map (they are reached online or by phone). */
  protected readonly otherOrgs = computed(() => {
    const where = this.where();
    const mapped = new Set(where.stops.flatMap((s) => [...s.steps.map((st) => st.program.id), ...(s.kind === 'help' ? ['*help'] : [])]));
    return organizationsOnRoadmap(this.roadmap())
      .map(({ org, steps }) => ({ org, steps, open: steps.filter((s) => !mapped.has(s.program.id)) }))
      .filter((o) => o.open.length > 0 || (o.steps.length === 0 && !mapped.has('*help')))
      .map((o) => ({
        ...o,
        forText: (where.stops.length ? o.open : o.steps).map((s) => this.i18n.pick(s.program.shortTitle)).join(' · '),
      }));
  });
}
