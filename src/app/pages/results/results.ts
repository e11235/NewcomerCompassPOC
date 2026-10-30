import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Chat } from '../../chat/chat';

interface Benefit {
  id: string;
  name: string;
  details: string;
}

// Placeholder content: this proof of concept doesn't calculate eligibility.
const BENEFITS: Benefit[] = [
  'Social Insurance Number',
  'Canada Child Benefit',
  'Canada Groceries and Essentials Benefit',
  'Canada Workers Benefit',
  'Canadian Dental Care Plan',
  'Canada Learning Bond',
].map((name) => ({
  id: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  details: `Details about how to apply for the ${name} will appear here.`,
}));

@Component({
  selector: 'app-results',
  imports: [MatButtonModule, MatIconModule, RouterLink, Chat],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  protected readonly benefits = BENEFITS;
}
