import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { I18n } from './i18n/i18n';
import { HelpSheet } from './layout/help-sheet';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';

@Component({
  selector: 'app-root',
  imports: [HelpSheet, RouterOutlet, SiteFooter, SiteHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-screen flex-col bg-background text-foreground', '[attr.dir]': 'i18n.dir()', '[attr.lang]': 'i18n.lang()' },
  template: `
    <app-site-header [showLanguages]="!onWelcome()" />
    <main id="main" class="flex flex-1 flex-col"><router-outlet /></main>
    <app-site-footer />
    <app-help-sheet />
  `,
})
export class App {
  protected readonly i18n = inject(I18n);
  private readonly router = inject(Router);
  protected readonly onWelcome = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url.split(/[?#]/)[0] === '/'),
    ),
    { initialValue: true },
  );
}
