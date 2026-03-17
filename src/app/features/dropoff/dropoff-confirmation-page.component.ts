import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DonationFlowStateService } from '../../core/services/donation-flow-state.service';

@Component({
  selector: 'app-dropoff-confirmation-page',
  imports: [RouterLink],
  templateUrl: './dropoff-confirmation-page.component.html',
  styleUrl: './dropoff-confirmation-page.component.scss'
})
export class DropoffConfirmationPageComponent {
  private readonly state = inject(DonationFlowStateService);
  protected readonly confirmation = this.state.getDropoffConfirmation();
}
