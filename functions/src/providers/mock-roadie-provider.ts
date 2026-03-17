import { CourierDispatchResult } from '../models.js';
import { CourierDispatchInput, CourierDispatchProvider } from './courier-provider.js';

export class MockRoadieCourierProvider implements CourierDispatchProvider {
  async dispatchPickup(input: CourierDispatchInput): Promise<CourierDispatchResult> {
    // TODO: Replace with a real Roadie API create-delivery call once credentials and contract are ready.
    return {
      provider: 'mock-roadie',
      dispatchId: `roadie_mock_${input.requestId.slice(0, 10)}`,
      status: 'queued',
      etaWindow: `${input.pickup.preferredDate} ${input.pickup.preferredTimeWindow}`
    };
  }
}
