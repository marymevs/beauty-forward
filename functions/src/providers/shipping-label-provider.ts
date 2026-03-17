import { ShippingDetails, ShippingLabelResult } from '../models.js';

export interface ShippingLabelInput {
  requestId: string;
  shipping: ShippingDetails;
}

export interface ShippingLabelProvider {
  createLabelIntent(input: ShippingLabelInput): Promise<ShippingLabelResult>;
}
