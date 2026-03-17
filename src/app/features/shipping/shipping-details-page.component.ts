import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShippingFlowDraft } from '../../core/models/donation.models';
import { DonationFlowStateService } from '../../core/services/donation-flow-state.service';
import { WarehouseConfigService } from '../../core/services/warehouse-config.service';

@Component({
  selector: 'app-shipping-details-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './shipping-details-page.component.html',
  styleUrl: './shipping-details-page.component.scss'
})
export class ShippingDetailsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly state = inject(DonationFlowStateService);
  private readonly warehouseConfig = inject(WarehouseConfigService);

  protected readonly warehouse = this.warehouseConfig.destination;

  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    addressLine1: ['', [Validators.required, Validators.minLength(4)]],
    addressLine2: [''],
    city: ['', [Validators.required]],
    state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
    instructions: [''],
    shippingLabelRequested: [true],
    packageNotes: [''],
    contributionAmount: ['']
  });

  constructor() {
    const draft = this.state.getShippingDraft();
    if (draft) {
      this.form.patchValue({
        fullName: draft.donor.fullName,
        email: draft.donor.email,
        phone: draft.donor.phone,
        addressLine1: draft.senderAddress.line1,
        addressLine2: draft.senderAddress.line2 ?? '',
        city: draft.senderAddress.city,
        state: draft.senderAddress.state,
        postalCode: draft.senderAddress.postalCode,
        instructions: draft.senderAddress.instructions ?? '',
        shippingLabelRequested: draft.shippingLabelRequested,
        packageNotes: draft.packageNotes ?? '',
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
    const draft: ShippingFlowDraft = {
      donor: {
        fullName: value.fullName,
        email: value.email,
        phone: value.phone
      },
      senderAddress: {
        line1: value.addressLine1,
        line2: value.addressLine2,
        city: value.city,
        state: value.state.toUpperCase(),
        postalCode: value.postalCode,
        instructions: value.instructions
      },
      shippingLabelRequested: value.shippingLabelRequested,
      packageNotes: value.packageNotes,
      contributionAmountUsd: this.parseAmount(value.contributionAmount)
    };

    this.state.setShippingDraft(draft);
    await this.router.navigate(['/shipping/review']);
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
