import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { I18n } from '../../../i18n/i18n';
import { Situation, SITUATIONS, SituationId } from '../questionnaire-config';

/** How long the grid takes to fade out after an available situation is chosen. */
const FADE_MS = 200;

/** The grid of situation cards on the first screen. */
@Component({
  selector: 'app-situation-picker',
  imports: [MatIconModule],
  templateUrl: './situation-picker.html',
  styleUrl: './situation-picker.scss',
  host: { '[class.leaving]': 'leaving()' },
})
export class SituationPicker {
  /** The situation already chosen, if any (shown as selected). */
  readonly current = input<SituationId | null>(null);
  readonly chosen = output<SituationId>();

  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly situations = SITUATIONS;

  /** The card last clicked; may be one that isn't available yet. */
  private readonly clicked = signal<SituationId | null>(null);
  protected readonly selected = computed(() => this.clicked() ?? this.current());
  protected readonly comingSoon = computed(() => {
    const id = this.clicked();
    return id !== null && !SITUATIONS.find((s) => s.id === id)!.available;
  });
  protected readonly leaving = signal(false);

  protected choose(situation: Situation): void {
    this.clicked.set(situation.id);
    if (!situation.available || this.leaving()) {
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      this.chosen.emit(situation.id);
      return;
    }
    this.leaving.set(true);
    setTimeout(() => this.chosen.emit(situation.id), FADE_MS);
  }
}
