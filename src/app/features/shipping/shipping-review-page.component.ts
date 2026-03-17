import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  CreateDonationRequestPayload,
  ShippingFlowDraft
} from '../../core/models/donation.models';
import { DonationApiService } from '../../core/services/donation-api.service';
import { DonationFlowStateService } from '../../core/services/donation-flow-state.service';
import { ShippingLabelService } from '../../core/services/shipping-label.service';
import { WarehouseConfigService } from '../../core/services/warehouse-config.service';

@Component({
  selector: 'app-shipping-review-page',
  imports: [RouterLink],
  templateUrl: './shipping-review-page.component.html',
  styleUrl: './shipping-review-page.component.scss'
})
export class ShippingReviewPageComponent {
  private readonly state = inject(DonationFlowStateService);
  private readonly shippingLabelService = inject(ShippingLabelService);
  private readonly donationApi = inject(DonationApiService);
  private readonly warehouseConfig = inject(WarehouseConfigService);
  private readonly router = inject(Router);

  protected readonly warehouse = this.warehouseConfig.destination;

  protected draft: ShippingFlowDraft | null = null;
  protected isSubmitting = false;
  protected isPreparingLabel = false;
  protected error = '';

  constructor() {
    this.draft = this.state.getShippingDraft();
  }

  protected async prepareShippingLabel(): Promise<void> {
    if (!this.draft || !this.draft.shippingLabelRequested) {
      return;
    }

    this.error = '';
    this.isPreparingLabel = true;

    try {
      const labelIntent = await this.shippingLabelService.prepareShippingLabelCheckout(this.draft);
      this.draft = {
        ...this.draft,
        shippingLabelCheckoutPrepared: true,
        shippingLabelQuoteId: labelIntent.quoteId,
        shippingLabelCheckoutUrl: labelIntent.checkoutUrl
      };
      this.state.setShippingDraft(this.draft);

      if (labelIntent.checkoutUrl && typeof window !== 'undefined') {
        window.open(labelIntent.checkoutUrl, '_blank', 'noopener');
      }
    } catch {
      this.error = 'Unable to prepare shipping label checkout right now. You can still submit this request.';
    } finally {
      this.isPreparingLabel = false;
    }
  }

  protected async submitShippingRequest(): Promise<void> {
    if (!this.draft || this.isSubmitting) {
      return;
    }

    this.error = '';
    this.isSubmitting = true;

    const payload: CreateDonationRequestPayload = {
      donationType: 'shipping',
      donor: this.draft.donor,
      contribution: {
        provider: 'givebutter',
        status: 'not_started',
        amountUsd: this.draft.contributionAmountUsd
      },
      shipping: {
        senderAddress: this.draft.senderAddress,
        shippingLabelRequested: this.draft.shippingLabelRequested,
        packageNotes: this.draft.packageNotes,
        shippingLabelIntentAmountUsd: this.draft.contributionAmountUsd,
        shippingLabelQuoteId: this.draft.shippingLabelQuoteId
      },
      metadata: {
        flowVersion: 'mvp-v1',
        channel: 'public-web',
        shippingProvider: 'mock-ready'
      }
    };

    try {
      const result = await this.donationApi.createDonationRequest(payload);
      this.state.setShippingConfirmation(result);
      this.state.clearShippingDraft();
      await this.router.navigate(['/shipping/confirmation']);
    } catch {
      this.error = 'Something went wrong while submitting. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
