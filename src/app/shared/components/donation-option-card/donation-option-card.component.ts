import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-donation-option-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './donation-option-card.component.html',
  styleUrl: './donation-option-card.component.scss'
})
export class DonationOptionCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) ctaLabel!: string;
  @Input({ required: true }) route!: string;
  @Input() badge = '';
  @Input() icon = '◌';
  @Input() highlights: string[] = [];
}
