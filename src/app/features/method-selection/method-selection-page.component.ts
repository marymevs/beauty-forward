import { Component } from '@angular/core';
import { DonationOptionCardComponent } from '../../shared/components/donation-option-card/donation-option-card.component';

@Component({
  selector: 'app-method-selection-page',
  imports: [DonationOptionCardComponent],
  templateUrl: './method-selection-page.component.html',
  styleUrl: './method-selection-page.component.scss'
})
export class MethodSelectionPageComponent {}
