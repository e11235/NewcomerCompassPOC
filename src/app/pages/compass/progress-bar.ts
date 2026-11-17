import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** "Question 4 of 8" with one segment per question. */
@Component({
  selector: 'app-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-48 flex-1' },
  template: `
    <p class="text-sm font-semibold" aria-live="polite">{{ label() }}</p>
    <div
      role="progressbar"
      aria-valuemin="0"
      [attr.aria-valuemax]="total()"
      [attr.aria-valuenow]="filled()"
      [attr.aria-valuetext]="label()"
      class="mt-2 flex gap-1.5"
    >
      @for (i of segments(); track i) {
        <span
          class="h-2 flex-1 rounded-full"
          [class]="segmentClass(i)"
        ></span>
      }
    </div>
  `,
})
export class ProgressBar {
  readonly current = input.required<number>();
  readonly total = input.required<number>();
  readonly label = input.required<string>();
  /** Answered count (chat); when unset, the current question counts as filled (form). */
  readonly done = input<number | undefined>(undefined);

  protected readonly filled = computed(() => this.done() ?? this.current());
  protected readonly segments = computed(() => Array.from({ length: this.total() }, (_, i) => i));

  protected segmentClass(i: number): string {
    const fill = i < this.filled() ? 'bg-[#26374a]' : 'bg-muted-foreground/20';
    return this.done() === undefined && i === this.current() - 1 ? `${fill} ring-2 ring-[#26374a]/30` : fill;
  }
}
