import { BidiModule } from '@angular/cdk/bidi';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18n } from './i18n/i18n';

// The `dir` wrapper tells Angular Material (including menus and select panels)
// which way text runs, so Arabic lays out right-to-left.
@Component({
  selector: 'app-root',
  imports: [BidiModule, RouterOutlet],
  template: '<div [dir]="i18n.dir()"><router-outlet /></div>',
})
export class App {
  protected readonly i18n = inject(I18n);
}
