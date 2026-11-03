import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Chat } from '../../chat/chat';
import { MARITAL_STATUSES, NEWCOMER_GROUPS, ProfileStore } from '../../state/profile-store';

/** Languages offered in the switcher, each labelled in its own language. */
const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
] as const;

@Component({
  selector: 'app-questionnaire',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    Chat,
  ],
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.scss',
})
export class Questionnaire {
  private readonly router = inject(Router);

  protected readonly profile = inject(ProfileStore);
  protected readonly maritalStatuses = MARITAL_STATUSES;
  protected readonly groups = NEWCOMER_GROUPS;
  protected readonly languages = LANGUAGES;
  protected readonly selectedLanguage = signal<(typeof LANGUAGES)[number]['code']>('en');

  protected submit(): void {
    this.router.navigate(['/results']);
  }
}
