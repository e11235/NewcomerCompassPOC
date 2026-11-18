import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICON_PATHS, type IconName } from './icon-paths';

/**
 * A decorative line icon. Size and colour come from classes on the host
 * (1rem by default, see styles.css); add `flip-rtl` for arrows that should mirror in Arabic.
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'inline-flex shrink-0' },
  template: `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-full"
    focusable="false"
    [innerHTML]="markup()"
  ></svg>`,
})
export class Icon {
  private readonly sanitizer = inject(DomSanitizer);
  readonly name = input.required<IconName>();
  // Safe: the markup comes only from the constant ICON_PATHS table, never from user input.
  protected readonly markup = computed(() => this.sanitizer.bypassSecurityTrustHtml(ICON_PATHS[this.name()]));
}
