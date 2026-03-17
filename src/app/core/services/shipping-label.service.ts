import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ShippingFlowDraft, ShippingLabelIntentResult } from '../models/donation.models';

@Injectable({
  providedIn: 'root'
})
export class ShippingLabelService {
  async prepareShippingLabelCheckout(draft: ShippingFlowDraft): Promise<ShippingLabelIntentResult> {
    const quoteId = `LBL-${Date.now()}`;

    // TODO: Replace with real shipping provider label quote + payment session creation.
    const checkoutUrl =
      `${environment.integrations.shippingLabel.mockCheckoutUrl}` +
      `?quote=${quoteId}&email=${encodeURIComponent(draft.donor.email)}`;

    return {
      provider: 'mock',
      quoteId,
      status: 'pending_checkout',
      checkoutUrl
    };
  }
}
