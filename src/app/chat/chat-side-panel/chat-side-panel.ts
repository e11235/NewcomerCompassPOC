import { A11yModule } from '@angular/cdk/a11y';
import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { I18n } from '../../i18n/i18n';
import { Chat } from '../chat';

/** Below this width the panel floats over the page instead of sitting beside it. */
const OVERLAY_QUERY = '(max-width: 899.98px)';

/**
 * The chat in a side panel the user can show and hide. It starts closed. On wide
 * screens it opens beside the page and the page reflows around it; on narrow
 * screens it opens over the page.
 *
 * The chat itself is the shared `app-chat` component, unchanged.
 */
@Component({
  selector: 'app-chat-side-panel',
  imports: [A11yModule, MatIconModule, Chat],
  templateUrl: './chat-side-panel.html',
  styleUrl: './chat-side-panel.scss',
  host: {
    '[class.open]': 'open()',
    '[class.overlay]': 'overlay()',
    '(keydown.escape)': 'onEscape()',
  },
})
export class ChatSidePanel {
  protected readonly t = inject(I18n).t;
  private readonly injector = inject(Injector);

  private readonly media = window.matchMedia(OVERLAY_QUERY);
  protected readonly overlay = signal(this.media.matches);
  readonly open = signal(false);

  private readonly hideButton = viewChild.required<ElementRef<HTMLButtonElement>>('hideButton');
  private readonly openButton = viewChild.required<ElementRef<HTMLButtonElement>>('openButton');

  constructor() {
    // Crossing the breakpoint closes the panel, so it never suddenly covers the page.
    const onChange = (event: MediaQueryListEvent) => {
      this.overlay.set(event.matches);
      this.open.set(false);
    };
    this.media.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => this.media.removeEventListener('change', onChange));
  }

  protected setOpen(open: boolean): void {
    this.open.set(open);
    // The button that was pressed disappears, so put focus on its counterpart.
    afterNextRender(
      () => (open ? this.hideButton() : this.openButton()).nativeElement.focus(),
      { injector: this.injector },
    );
  }

  /** Escape closes the panel when it covers the page. */
  protected onEscape(): void {
    if (this.overlay() && this.open()) {
      this.setOpen(false);
    }
  }
}
