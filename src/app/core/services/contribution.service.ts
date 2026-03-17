import { Injectable } from '@angular/core';
import { DonationType } from '../models/donation.models';
import { DonationApiService } from './donation-api.service';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {
  constructor(private readonly donationApi: DonationApiService) {}

  async launchGivebutterCheckout(
    donationType: DonationType,
    donorEmail: string,
    amountUsd?: number,
    requestId?: string
  ): Promise<string> {
    const session = await this.donationApi.createContributionSession({
      donationType,
      donorEmail,
      amountUsd,
      requestId
    });

    if (typeof window !== 'undefined') {
      window.open(session.checkoutUrl, '_blank', 'noopener');
    }

    return session.checkoutUrl;
  }
}
