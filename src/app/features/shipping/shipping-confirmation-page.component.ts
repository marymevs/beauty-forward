import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DonationFlowStateService } from '../../core/services/donation-flow-state.service';

@Component({
  selector: 'app-shipping-confirmation-page',
  imports: [RouterLink],
  templateUrl: './shipping-confirmation-page.component.html',
  styleUrl: './shipping-confirmation-page.component.scss'
})
export class ShippingConfirmationPageComponent {
  private readonly state = inject(DonationFlowStateService);
  protected readonly confirmation = this.state.getShippingConfirmation();
}
