import {
  ContributionSessionResponse,
  CreateContributionSessionPayload
} from '../models.js';

export class GivebutterService {
  constructor(
    private readonly campaignUrl = process.env.GIVEBUTTER_CAMPAIGN_URL ??
      'https://givebutter.com/beauty-forward'
  ) {}

  async createCheckoutSession(
    payload: CreateContributionSessionPayload
  ): Promise<ContributionSessionResponse> {
    // TODO: Replace this URL builder with a real Givebutter API session creation call.
    const checkoutUrl = new URL(this.campaignUrl);

    if (payload.amountUsd) {
      checkoutUrl.searchParams.set('amount', Math.round(payload.amountUsd).toString());
    }

    if (payload.requestId) {
      checkoutUrl.searchParams.set('requestId', payload.requestId);
    }

    checkoutUrl.searchParams.set('utm_source', 'beauty_forward_donation_flow');

    return {
      provider: 'givebutter',
      sessionId: `gb_mock_${Date.now()}`,
      checkoutUrl: checkoutUrl.toString()
    };
  }
}
