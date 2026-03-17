import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DROPOFF_TIME_WINDOWS } from '../../core/constants/time-windows';
import { DropoffFlowDraft } from '../../core/models/donation.models';
import { DonationFlowStateService } from '../../core/services/donation-flow-state.service';
import { WarehouseConfigService } from '../../core/services/warehouse-config.service';

@Component({
  selector: 'app-dropoff-details-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './dropoff-details-page.component.html',
  styleUrl: './dropoff-details-page.component.scss'
})
export class DropoffDetailsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly state = inject(DonationFlowStateService);
  private readonly warehouseConfig = inject(WarehouseConfigService);

  protected readonly minDate = new Date().toISOString().split('T')[0] ?? '';
  protected readonly timeWindows = DROPOFF_TIME_WINDOWS;
  protected readonly warehouse = this.warehouseConfig.destination;

  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    preferredDate: ['', [Validators.required]],
    preferredTimeWindow: ['', [Validators.required]],
    dropoffNotes: [''],
    contributionAmount: ['']
  });

  constructor() {
    const draft = this.state.getDropoffDraft();
    if (draft) {
      this.form.patchValue({
        fullName: draft.donor.fullName,
        email: draft.donor.email,
        phone: draft.donor.phone,
        preferredDate: draft.preferredDate,
        preferredTimeWindow: draft.preferredTimeWindow,
        dropoffNotes: draft.dropoffNotes ?? '',
        contributionAmount: draft.contributionAmountUsd?.toString() ?? ''
      });
    }
  }

  protected async continueToReview(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const draft: DropoffFlowDraft = {
      donor: {
        fullName: value.fullName,
        email: value.email,
        phone: value.phone
      },
      preferredDate: value.preferredDate,
      preferredTimeWindow: value.preferredTimeWindow,
      dropoffNotes: value.dropoffNotes,
      contributionAmountUsd: this.parseAmount(value.contributionAmount)
    };

    this.state.setDropoffDraft(draft);
    await this.router.navigate(['/dropoff/review']);
  }

  protected hasError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  private parseAmount(raw: string): number | undefined {
    if (!raw) {
      return undefined;
    }

    const amount = Number(raw);
    return Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) / 100 : undefined;
  }
}
