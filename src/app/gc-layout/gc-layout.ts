import { Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { I18n } from '../i18n/i18n';

/** Shown in the "Date modified" line; update when the page content changes. */
const DATE_MODIFIED = '2026-11-03';

// Official Federal Identity Program artwork, inlined (no asset pipeline needed) and kept crisp.
const ARTWORK_STYLES = `
  :host { display: block; }
  svg { display: block; width: 100%; height: auto; }
`;

@Component({ selector: 'app-canada-wordmark', templateUrl: './canada-wordmark.svg', styles: ARTWORK_STYLES })
export class CanadaWordmark {
  readonly label = input.required<string>();
}

/** "Government of Canada / Gouvernement du Canada" (English first). */
@Component({ selector: 'app-gc-signature-en', templateUrl: './signature-en.svg', styles: ARTWORK_STYLES })
export class GcSignatureEn {
  readonly label = input.required<string>();
}

/** "Gouvernement du Canada / Government of Canada" (French first). */
@Component({ selector: 'app-gc-signature-fr', templateUrl: './signature-fr.svg', styles: ARTWORK_STYLES })
export class GcSignatureFr {
  readonly label = input.required<string>();
}

/**
 * Canada.ca-style header: the Government of Canada signature at the start
 * edge, and the app's name at the end.
 */
@Component({
  selector: 'app-gc-header',
  imports: [GcSignatureEn, GcSignatureFr, MatIconModule],
  template: `
    <header class="gc-header">
      <!-- There is no Arabic signature; Arabic pages use the English-first one. -->
      @if (i18n.lang() === 'fr') {
        <app-gc-signature-fr class="signature" [label]="i18n.t().header.signatureAlt" />
      } @else {
        <app-gc-signature-en class="signature" [label]="i18n.t().header.signatureAlt" />
      }
      <span class="nc-brand"><mat-icon aria-hidden="true">explore</mat-icon>{{ i18n.t().brand }}</span>
    </header>
  `,
  styles: `
    :host {
      display: block;
    }
    .gc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid var(--nc-border);
      background: var(--nc-surface);
    }
    .signature {
      width: 280px;
      max-width: 70vw;
    }
  `,
})
export class GcHeader {
  protected readonly i18n = inject(I18n);
}

/**
 * Canada.ca-style page end: a "Date modified" line, then a light band with
 * the site links and the Canada wordmark at the end (bottom-right; bottom-left in Arabic).
 */
@Component({
  selector: 'app-gc-footer',
  imports: [CanadaWordmark],
  template: `
    <p class="date-modified">
      {{ t().footer.dateModified }} <!-- dir="ltr" keeps the ISO date reading 2026-11-03 inside Arabic text. -->
      <time dir="ltr" [attr.datetime]="dateModified">{{ dateModified }}</time>
    </p>
    <footer class="gc-footer">
      <nav [attr.aria-label]="t().footer.linksLabel">
        <ul>
          <!-- Placeholder links: they don't go anywhere yet. -->
          @for (link of links(); track link) {
            <li><a href="#" (click)="$event.preventDefault()">{{ link }}</a></li>
          }
        </ul>
      </nav>
      <app-canada-wordmark class="wordmark" [label]="t().footer.wordmarkAlt" />
    </footer>
  `,
  styles: `
    :host {
      display: block;
    }
    .date-modified {
      margin: 0;
      padding: 0.25rem 1.5rem;
      font-size: 0.875rem;
      color: var(--nc-text-muted);
    }
    .gc-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem 2rem;
      flex-wrap: wrap;
      padding: 0.75rem 1.5rem;
      background: var(--gc-alt-bg);
      border-top: 1px solid var(--nc-border);
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 0;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 0.875rem;
    }
    li + li::before {
      content: '•';
      margin-inline: 0.625rem;
      color: var(--nc-text-muted);
    }
    a {
      color: var(--gc-link);
    }
    .wordmark {
      flex-shrink: 0;
      width: 130px;
      margin-inline-start: auto;
    }
    // Phones: stack the links instead of wrapping them mid-row.
    @media (max-width: 600px) {
      ul {
        flex-direction: column;
        gap: 0.5rem;
      }
      li + li::before {
        content: none;
      }
    }
  `,
})
export class GcFooter {
  protected readonly t = inject(I18n).t;
  protected readonly dateModified = DATE_MODIFIED;
  protected readonly links = computed(() => Object.values(this.t().footer.links));
}
