import { ShippingLabelResult } from '../models.js';
import { ShippingLabelInput, ShippingLabelProvider } from './shipping-label-provider.js';

export class MockShippingLabelProvider implements ShippingLabelProvider {
  async createLabelIntent(input: ShippingLabelInput): Promise<ShippingLabelResult> {
    // TODO: Swap this mock for a real label quote and payment flow (Shippo, EasyPost, etc.).
    return {
      provider: 'mock-shipping-provider',
      quoteId: input.shipping.shippingLabelQuoteId ?? `ship_mock_${input.requestId.slice(0, 8)}`,
      status: 'pending_checkout'
    };
  }
}
