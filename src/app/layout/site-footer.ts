import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CONTENT } from '../content/content-data';
import { I18n } from '../i18n/i18n';
import { LogoMark } from '../shared/logo';

@Component({
  selector: 'app-site-footer',
  imports: [LogoMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="no-print border-t-4 border-red-700 bg-[#26374a] text-white">
      <div class="mx-auto grid max-w-6xl gap-3 px-4 py-6 text-sm md:grid-cols-2">
        <p>{{ t().privacy }}</p>
        <div class="space-y-1">
          <p>{{ t().disclaimer }}</p>
          <p>{{ i18n.pick(scenario.scenarioLabel) }} {{ i18n.pick(scenario.scenarioStatus) }}</p>
        </div>
      </div>
      <div class="border-t border-white/15">
        <div class="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 text-sm font-semibold">
          <span class="flex size-7 items-center justify-center rounded-full bg-white p-0.5"><app-logo-mark class="size-6" /></span>
          <span>{{ t().appName }}</span>
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly scenario = CONTENT.scenario;
}
