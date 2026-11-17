import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { ChannelLink } from '../engine/links';
import { I18n } from '../i18n/i18n';
import { Icon } from '../shared/icon';
import type { IconName } from '../shared/icon-paths';

const CHANNEL_ICONS: Record<ChannelLink['channel'], IconName> = {
  online: 'globe',
  phone: 'phone',
  in_person: 'map-pin',
  worker: 'users',
};

/** Pill links: "Online", "Find an in-person location", "Phone: 1-800-…". */
@Component({
  selector: 'app-channel-links',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (links().length) {
      <ul class="flex flex-wrap gap-2" [attr.aria-label]="label() || t().waysToAct">
        @for (link of items(); track link.channel + link.href) {
          <li>
            <a
              [href]="link.href"
              [attr.target]="link.isPhone ? null : '_blank'"
              [attr.rel]="link.isPhone ? null : 'noopener noreferrer'"
              class="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[#26374a] bg-background px-4 text-sm font-semibold text-[#26374a] no-underline transition-colors hover:bg-[#26374a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <app-icon [name]="link.icon" class="size-4" />
              <span
                >{{ link.text }}
                @if (link.isPhone) {
                  <span dir="ltr">{{ link.phone }}</span>
                }
              </span>
              @if (!link.isPhone) {
                <app-icon name="external-link" class="size-3.5 opacity-70" />
                <span class="sr-only"> ({{ t().opensNewTab }})</span>
              }
            </a>
          </li>
        }
      </ul>
    }
  `,
})
export class ChannelLinks {
  protected readonly t = inject(I18n).t;
  readonly links = input.required<ChannelLink[]>();
  readonly label = input('');

  protected readonly items = computed(() => {
    const t = this.t();
    return this.links().map((l) => ({
      ...l,
      icon: CHANNEL_ICONS[l.channel],
      isPhone: l.channel === 'phone',
      text:
        l.channel === 'in_person'
          ? t.findInPerson
          : l.channel === 'worker'
            ? t.findHelp
            : l.channel === 'phone'
              ? `${t.channelNames.phone}: `
              : t.channelNames.online,
    }));
  });
}
