import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FULL_VIEW, project, stopLabel, type Stop, type ViewBox, type WhereToGo } from '../../../engine/places';
import { I18n } from '../../../i18n/i18n';

const PIN = 'M0,0 C-4,-8 -18,-14 -18,-25 A18,18 0 1 1 18,-25 C18,-14 4,-8 0,0 Z';

const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * The schematic map of Ottawa with numbered pins, ported from the prototype.
 * Not to scale; the pins are demo places. The view zooms smoothly to the focus.
 */
@Component({
  selector: 'app-city-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="viewBoxAttr()"
      preserveAspectRatio="xMidYMid slice"
      direction="ltr"
      class="block aspect-[4/3] w-full min-[900px]:aspect-auto min-[900px]:h-[clamp(500px,calc(100dvh-16rem),600px)]"
      role="group"
      aria-labelledby="map-title map-desc"
    >
      <title id="map-title">{{ t().mapTitle }}</title>
      <desc id="map-desc">{{ description() }}</desc>

      <!-- Schematic base map -->
      <g>
        <rect x="-200" y="-200" width="1400" height="1040" class="fill-stone-100" />
        <path
          d="M-200,-200 L1200,-200 L1200,85 C820,110 640,150 560,140 C480,150 400,165 280,175 C150,175 -200,150 -200,150 Z"
          class="fill-stone-200"
        />
        <path d="M300,330 C330,300 390,305 400,340 C410,375 360,395 325,380 C300,370 290,350 300,330 Z" class="fill-green-200/80" />
        <path d="M640,300 C670,285 720,300 715,335 C710,360 665,365 645,345 C632,333 630,310 640,300 Z" class="fill-green-200/80" />
        <path d="M455,455 C490,440 540,450 545,480 C548,505 500,520 470,505 C450,495 445,470 455,455 Z" class="fill-green-200/80" />
        <path d="M560,215 C575,208 592,214 590,228 C588,240 570,242 562,235 C556,229 555,220 560,215 Z" class="fill-green-200/80" />
        <g class="stroke-white" stroke-width="4" fill="none">
          <path d="M380,190 L700,182" />
          <path d="M360,225 L720,215" />
          <path d="M340,345 L760,335" />
          <path d="M330,375 L760,368" />
          <path d="M430,180 L445,520" />
          <path d="M475,180 L488,520" />
          <path d="M585,170 L600,520" />
          <path d="M660,160 L668,520" />
          <path d="M720,150 L730,520" />
          <path d="M380,180 L385,520" />
          <path d="M250,250 C300,300 330,360 320,470" />
          <path d="M760,240 C800,300 820,380 860,460" />
        </g>
        <path
          d="M-200,150 C150,175 280,175 400,165 C480,150 560,140 640,150 C760,140 880,100 1200,85"
          fill="none"
          stroke-width="30"
          class="stroke-sky-200"
        />
        <path
          d="M590,150 C610,210 640,260 625,330 C612,390 600,430 610,520 C618,580 640,610 650,700"
          fill="none"
          stroke-width="8"
          class="stroke-sky-200"
        />
        <path d="M515,185 C520,240 540,280 548,320 C556,360 575,400 612,470" fill="none" stroke-width="5" class="stroke-sky-300" />
        <path d="M-100,310 C200,290 320,275 450,268 C560,262 700,250 1100,230" fill="none" stroke-width="8" class="stroke-amber-300" />
        <path d="M150,420 L720,408" fill="none" stroke-width="5" class="stroke-stone-300" />
        <path d="M528,195 L545,640" fill="none" stroke-width="5" class="stroke-stone-300" />
        <g class="fill-stone-700" font-size="13">
          <text x="235" y="207" font-style="italic">{{ t().mapRiver }}</text>
          <text x="300" y="128" font-weight="600">Gatineau (QC)</text>
          <text x="572" y="380" font-style="italic" transform="rotate(58 572 380)">{{ t().mapCanal }}</text>
          <text x="240" y="282">417</text>
          <text x="330" y="404">{{ t().mapBaseline }}</text>
          <text x="225" y="455" font-size="20" font-weight="700">{{ cityName() }}</text>
        </g>
        <g transform="translate(760 450)" class="fill-stone-700">
          <path d="M0,-24 L8,0 L0,-5 L-8,0 Z" />
          <text x="-5" y="16" font-size="13" font-weight="700">N</text>
        </g>
      </g>

      <!-- Approximate area -->
      <g>
        <circle
          [attr.cx]="center().x"
          [attr.cy]="center().y"
          r="70"
          [attr.stroke-width]="2.5 * k()"
          [attr.stroke-dasharray]="8 * k() + ' ' + 6 * k()"
          class="fill-[#26374a]/8 stroke-[#26374a]/70"
        />
        <text
          [attr.x]="center().x"
          [attr.y]="center().y + 70 + 18 * k()"
          text-anchor="middle"
          [attr.font-size]="14 * k()"
          font-weight="700"
          class="fill-[#26374a]"
          paint-order="stroke"
          [attr.stroke-width]="4 * k()"
          stroke="white"
        >
          {{ t().approxArea }}
        </text>
      </g>

      @if (stepStops().length > 1) {
        <polyline
          [attr.points]="route()"
          fill="none"
          [attr.stroke-width]="3 * k()"
          stroke-linejoin="round"
          [attr.stroke-dasharray]="8 * k() + ' ' + 7 * k()"
          class="stroke-[#26374a]/70"
        />
      }
      @if (lastStop(); as last) {
        @for (h of helpStops(); track h.location.id) {
          <line
            [attr.x1]="last.x"
            [attr.y1]="last.y"
            [attr.x2]="h.x"
            [attr.y2]="h.y"
            [attr.stroke-width]="3 * k()"
            [attr.stroke-dasharray]="3 * k() + ' ' + 6 * k()"
            class="stroke-red-700/70"
          />
        }
      }

      @for (s of where().stops; track s.location.id) {
        <a
          href="#place-details"
          [attr.aria-label]="markerLabel(s)"
          [attr.aria-current]="selectedId() === s.location.id ? 'location' : null"
          (click)="$event.preventDefault(); selectPlace.emit(s.location.id)"
          class="group cursor-pointer focus:outline-none"
        >
          <g [attr.id]="'pin-' + s.location.id" [attr.transform]="pinTransform(s)">
            <circle cx="0" cy="-24" r="26" fill="transparent" />
            <ellipse cx="0" cy="0" rx="9" ry="3.5" class="fill-black/20" />
            @if (selectedId() === s.location.id) {
              <circle cx="0" cy="-24" r="27" fill="none" stroke-width="4" class="stroke-red-700" />
            } @else if (candidates().includes(s.location.id)) {
              <circle cx="0" cy="-24" r="27" fill="none" stroke-width="3" stroke-dasharray="5 4" class="stroke-red-700" />
            }
            <path
              [attr.d]="pinPath"
              stroke-width="2.5"
              [attr.stroke-dasharray]="s.kind === 'step' && s.status === 'not_yet' ? '4 3' : null"
              [attr.class]="pinClass(s) + ' drop-shadow-sm'"
            />
            @if (s.kind === 'help') {
              <g
                transform="translate(-10 -35) scale(0.8333)"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </g>
            } @else if (s.status === 'done') {
              <path d="M-7,-25 L-2,-19 L8,-31" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="stroke-white" />
            } @else {
              <text
                x="0"
                [attr.y]="label(s).length > 2 ? -20 : -19"
                text-anchor="middle"
                [attr.font-size]="label(s).length > 2 ? 12 : 16"
                font-weight="700"
                [attr.class]="isFilled(s) ? 'fill-white' : 'fill-[#26374a]'"
              >
                {{ label(s) }}
              </text>
            }
          </g>
          <!-- Keyboard focus ring (not part of the copy drawn on top when selected). -->
          <circle
            [attr.transform]="pinTransform(s)"
            cx="0"
            cy="-24"
            r="27"
            fill="none"
            stroke-width="3.5"
            class="stroke-foreground opacity-0 group-focus-visible:opacity-100"
          />
        </a>
      }
      <!-- The selected pin is drawn again on top so it is never hidden behind another. -->
      @if (selectedId(); as id) {
        <use [attr.href]="'#pin-' + id" pointer-events="none" />
      }
    </svg>
  `,
})
export class CityMap {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  readonly where = input.required<WhereToGo>();
  readonly target = input.required<ViewBox>();
  readonly selectedId = input<string | null>(null);
  readonly candidates = input<string[]>([]);
  readonly selectPlace = output<string>();

  protected readonly pinPath = PIN;

  /** The view box, animated towards `target`. */
  private readonly view = signal<ViewBox>(FULL_VIEW);
  protected readonly viewBoxAttr = computed(() => {
    const v = this.view();
    return `${v.x} ${v.y} ${v.w} ${v.h}`;
  });
  /** Scale factor so strokes and labels keep their size when zoomed. */
  protected readonly k = computed(() => this.view().w / FULL_VIEW.w);

  protected readonly cityName = computed(() => this.i18n.pick(this.where().area?.name));
  protected readonly center = computed(() => {
    const area = this.where().area!;
    return project(area.center, area);
  });
  protected readonly stepStops = computed(() => this.where().stops.filter((s) => s.kind === 'step'));
  protected readonly helpStops = computed(() => this.where().stops.filter((s) => s.kind === 'help'));
  protected readonly lastStop = computed(() => this.stepStops().at(-1) ?? null);
  protected readonly route = computed(() =>
    this.stepStops()
      .map((s) => `${s.x},${s.y}`)
      .join(' '),
  );
  protected readonly description = computed(() => this.where().stops.map((s) => this.markerLabel(s)).join('; '));

  constructor() {
    let frame = 0;
    effect((onCleanup) => {
      const to = this.target();
      const from = untracked(this.view);
      const duration = reducedMotion() ? 0 : 350;
      const start = performance.now();
      const tick = (now: number) => {
        const p = duration ? Math.min(1, (now - start) / duration) : 1;
        const e = 1 - (1 - p) ** 3;
        this.view.set({
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e,
          w: from.w + (to.w - from.w) * e,
          h: from.h + (to.h - from.h) * e,
        });
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      onCleanup(() => cancelAnimationFrame(frame));
    });
  }

  protected label(s: Stop): string {
    return stopLabel(s);
  }

  protected markerLabel(s: Stop): string {
    const t = this.t();
    const what = s.kind === 'help' ? t.helpStopLabel : s.steps.map((st) => this.i18n.pick(st.program.shortTitle)).join(', ');
    return t.markerLabel(s.kind === 'help' ? t.legendHelp : stopLabel(s), this.i18n.pick(s.location.displayName), what);
  }

  protected isFilled(s: Stop): boolean {
    return s.kind === 'help' || s.status === 'done' || s.current;
  }

  protected pinClass(s: Stop): string {
    const fill =
      s.kind === 'help' ? 'fill-red-700' : s.status === 'done' ? 'fill-green-800' : s.current ? 'fill-[#26374a]' : 'fill-white';
    return `${fill} ${this.isFilled(s) ? 'stroke-white' : 'stroke-[#26374a]'}`;
  }

  protected pinTransform(s: Stop): string {
    const scale = (s.current || this.selectedId() === s.location.id ? 1.2 : 1) * this.k();
    return `translate(${s.x} ${s.y}) scale(${scale})`;
  }
}
