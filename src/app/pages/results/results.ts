import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Chat } from '../../chat/chat';
import { I18n } from '../../i18n/i18n';
import { BENEFIT_IDS } from '../../state/profile-store';

@Component({
  selector: 'app-results',
  imports: [MatButtonModule, MatIconModule, RouterLink, Chat],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  protected readonly t = inject(I18n).t;
  protected readonly benefits = BENEFIT_IDS;
}
