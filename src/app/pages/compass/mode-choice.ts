import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18n } from '../../i18n/i18n';
import { Icon } from '../../shared/icon';
import { LogoMark } from '../../shared/logo';
import { JourneyStore } from '../../state/journey-store';

/** "How would you like us to guide you?": step-by-step form or guided chat. */
@Component({
  selector: 'app-mode-choice',
  imports: [Icon, LogoMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="mode-title" class="mx-auto max-w-3xl">
      <h2 id="mode-title" class="text-2xl font-bold">{{ t().modeTitle }}</h2>
      <p class="mt-1 text-muted-foreground">{{ t().modeCount(store.asked().length) }}</p>
      <ul class="mt-6 grid gap-4 md:grid-cols-2">
        <li class="flex">
          <article class="flex w-full flex-col rounded-2xl border-2 bg-card p-6">
            <span class="flex size-12 items-center justify-center rounded-2xl bg-[#26374a]/10 text-[#26374a]">
              <app-icon name="list-checks" class="size-6" />
            </span>
            <p class="mt-4 text-sm font-semibold text-muted-foreground">{{ t().modeOption(1) }}</p>
            <h3 class="text-xl font-bold">{{ t().modeFormTitle }}</h3>
            <p class="mt-1 flex-1">{{ t().modeFormBody }}</p>
            <button type="button" class="btn btn-primary btn-lg mt-5 self-start" (click)="store.startForm()">
              {{ t().modeFormCta }}
            </button>
          </article>
        </li>
        <li class="flex">
          <article class="flex w-full flex-col rounded-2xl border-2 bg-card p-6">
            <span class="flex size-12 items-center justify-center rounded-2xl bg-[#26374a]/10 p-1.5">
              <app-logo-mark class="size-9" />
            </span>
            <p class="mt-4 text-sm font-semibold text-muted-foreground">{{ t().modeOption(2) }}</p>
            <h3 class="text-xl font-bold">{{ t().modeChatTitle }}</h3>
            <p class="mt-1">{{ t().modeChatBody }}</p>
            <p class="mt-2 flex-1 text-sm text-muted-foreground">{{ t().modeChatSame }}</p>
            <button type="button" class="btn btn-outline btn-lg mt-5 self-start border-2" (click)="store.startChat()">
              {{ t().modeChatCta }}
            </button>
          </article>
        </li>
      </ul>
    </section>
  `,
})
export class ModeChoice {
  protected readonly t = inject(I18n).t;
  protected readonly store = inject(JourneyStore);
}
