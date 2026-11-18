import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The Newcomer Compass mark: four people around a centre, redrawn as a vector
 * from ref/logo.png (same shapes and colours) so it stays sharp at any size.
 */
const BODY =
  'M-23,-27.5 C-15,-28.6 -9.5,-29.4 -6.2,-31.6 A11 11 0 0 0 6.2,-31.6 C9.5,-29.4 15,-28.6 23,-27.5 C12,-22.5 3.5,-17 0,-11 C-3.5,-17 -12,-22.5 -23,-27.5 Z';
const FIGURES = [
  { color: '#f36e1c', rotate: 0 },
  { color: '#0d706a', rotate: 90 },
  { color: '#1969a3', rotate: 180 },
  { color: '#062748', rotate: 270 },
];

/** The mark as a standalone SVG string (for the downloaded roadmap and the favicon). */
export const LOGO_MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" aria-hidden="true">${FIGURES.map(
  (f) =>
    `<g fill="${f.color}" transform="rotate(${f.rotate})"><circle cy="-40" r="8.6"/><path d="${BODY}" stroke="${f.color}" stroke-width="1.6" stroke-linejoin="round"/></g>`,
).join('')}<circle r="9.2" fill="#062748"/></svg>`;

@Component({
  selector: 'app-logo-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block shrink-0' },
  template: `
    <svg
      viewBox="-50 -50 100 100"
      width="96"
      height="96"
      class="size-full overflow-visible"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
      [attr.aria-hidden]="label() ? null : 'true'"
      focusable="false"
    >
      @for (f of figures; track f.rotate) {
        <g [attr.fill]="f.color" [attr.transform]="'rotate(' + f.rotate + ')'">
          <circle cy="-40" r="8.6" />
          <path [attr.d]="body" [attr.stroke]="f.color" stroke-width="1.6" stroke-linejoin="round" />
        </g>
      }
      <circle r="9.2" fill="#062748" />
    </svg>
  `,
})
export class LogoMark {
  /** Accessible name. Leave empty when the mark sits next to visible "Newcomer Compass" text. */
  readonly label = input('');
  protected readonly figures = FIGURES;
  protected readonly body = BODY;
}

/**
 * The full logo: the mark above "Newcomer Compass", as in ref/logo.png.
 * The brand name stays in English in every language, as in the prototype.
 */
@Component({
  selector: 'app-logo-lockup',
  imports: [LogoMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex flex-col items-center text-brand-navy', role: 'img', 'aria-label': 'Newcomer Compass' },
  template: `
    <app-logo-mark class="size-[var(--mark-size,6rem)]" />
    <span
      aria-hidden="true"
      lang="en"
      dir="ltr"
      class="mt-2 text-center leading-[0.95] font-extrabold tracking-tight text-[length:var(--word-size,1.6rem)]"
    >
      Newcomer<br />Compass
    </span>
  `,
})
export class LogoLockup {}
