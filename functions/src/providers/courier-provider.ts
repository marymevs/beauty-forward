import { CourierDispatchResult, DonorInfo, PickupDetails } from '../models.js';

export interface CourierDispatchInput {
  requestId: string;
  donor: DonorInfo;
  pickup: PickupDetails;
}

export interface CourierDispatchProvider {
  dispatchPickup(input: CourierDispatchInput): Promise<CourierDispatchResult>;
}
