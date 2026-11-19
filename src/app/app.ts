import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { I18n } from './i18n/i18n';
import { HelpSheet } from './layout/help-sheet';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';
import { JourneyStore } from './state/journey-store';

@Component({
  selector: 'app-root',
  imports: [HelpSheet, RouterOutlet, SiteFooter, SiteHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-screen flex-col bg-background text-foreground', '[attr.dir]': 'i18n.dir()', '[attr.lang]': 'i18n.lang()' },
  template: `
    <app-site-header [showLanguages]="!onWelcome()" />
    <main id="main" tabindex="-1" class="flex flex-1 flex-col outline-none"><router-outlet /></main>
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

  constructor() {
    const title = inject(Title);
    const store = inject(JourneyStore);
    // The tab title names the current step in the chosen language, e.g. "Questions – Newcomer Compass".
    effect(() => {
      const t = this.i18n.t();
      title.setTitle(this.onWelcome() ? t.appName : `${t.screens[store.screen()]} – ${t.appName}`);
    });
  }
}
