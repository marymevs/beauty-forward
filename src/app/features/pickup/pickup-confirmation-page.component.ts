import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DonationFlowStateService } from '../../core/services/donation-flow-state.service';

@Component({
  selector: 'app-pickup-confirmation-page',
  imports: [RouterLink],
  templateUrl: './pickup-confirmation-page.component.html',
  styleUrl: './pickup-confirmation-page.component.scss'
})
export class PickupConfirmationPageComponent {
  private readonly state = inject(DonationFlowStateService);
  protected readonly confirmation = this.state.getPickupConfirmation();
}
