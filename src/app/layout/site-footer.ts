import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CONTENT } from '../content/content-data';
import { I18n } from '../i18n/i18n';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="no-print bg-[#26374a] text-white/90">
      <div class="mx-auto grid max-w-6xl gap-x-8 gap-y-1 px-4 py-2.5 text-xs leading-snug md:grid-cols-2">
        <p>{{ t().privacy }}</p>
        <p>{{ t().disclaimer }} {{ i18n.pick(scenario.scenarioLabel) }} {{ i18n.pick(scenario.scenarioStatus) }}</p>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly scenario = CONTENT.scenario;
}
