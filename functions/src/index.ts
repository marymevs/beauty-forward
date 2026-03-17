import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onRequest } from 'firebase-functions/v2/https';
import {
  CreateContributionSessionPayload,
  CreateDonationRequestPayload,
  DonationStatus,
  DonationSubmissionResult
} from './models.js';
import { MockRoadieCourierProvider } from './providers/mock-roadie-provider.js';
import { MockShippingLabelProvider } from './providers/mock-shipping-label-provider.js';
import { GivebutterService } from './services/givebutter.service.js';
import { generateDropoffReference } from './utils/dropoff-reference.js';
import {
  createContributionSessionSchema,
  createDonationRequestSchema
} from './validators.js';

initializeApp();

const db = getFirestore();
const courierProvider = new MockRoadieCourierProvider();
const shippingLabelProvider = new MockShippingLabelProvider();
const givebutterService = new GivebutterService();

export const createDonationRequest = onCall({ region: 'us-central1' }, async (request) => {
  const parsed = createDonationRequestSchema.safeParse(request.data);

  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.flatten().formErrors.join(' '));
  }

  const payload = parsed.data as CreateDonationRequestPayload;
  const createdAt = Timestamp.now();
  const requestRef = db.collection('donation_requests').doc();

  let status: DonationStatus = 'submitted';
  let dropoffReference: string | undefined;
  let courierDispatchId: string | undefined;
  let shippingLabelReference: string | undefined;

  if (payload.donationType === 'pickup' && payload.pickup) {
    const dispatch = await courierProvider.dispatchPickup({
      requestId: requestRef.id,
      donor: payload.donor,
      pickup: payload.pickup
    });
    status = 'queued_for_dispatch';
    courierDispatchId = dispatch.dispatchId;
  }

  if (payload.donationType === 'shipping' && payload.shipping) {
    status = 'pending_label_purchase';

    if (payload.shipping.shippingLabelRequested) {
      const labelIntent = await shippingLabelProvider.createLabelIntent({
        requestId: requestRef.id,
        shipping: payload.shipping
      });
      shippingLabelReference = labelIntent.quoteId;
    }
  }

  if (payload.donationType === 'dropoff' && payload.dropoff) {
    status = 'dropoff_requested';
    dropoffReference = generateDropoffReference();
    payload.dropoff.referenceCode = dropoffReference;
  }

  const baseDoc = {
    donationType: payload.donationType,
    donor: payload.donor,
    contribution: payload.contribution,
    pickup: payload.pickup,
    shipping: payload.shipping,
    dropoff: payload.dropoff,
    status,
    createdAt,
    updatedAt: createdAt,
    metadata: {
      ...payload.metadata,
      source: 'public-web',
      courierDispatchId,
      shippingLabelReference
    }
  };

  const typedCollectionName = `${payload.donationType}_requests`;

  await db.runTransaction(async (transaction) => {
    transaction.set(requestRef, baseDoc);
    transaction.set(db.collection(typedCollectionName).doc(requestRef.id), {
      donationRequestId: requestRef.id,
      ...baseDoc
    });
  });

  return {
    requestId: requestRef.id,
    donationType: payload.donationType,
    status,
    createdAt: createdAt.toDate().toISOString(),
    dropoffReference,
    courierDispatchId,
    shippingLabelReference,
    nextSteps: buildNextSteps(payload.donationType)
  } satisfies DonationSubmissionResult;
});

export const createContributionSession = onCall({ region: 'us-central1' }, async (request) => {
  const parsed = createContributionSessionSchema.safeParse(request.data);

  if (!parsed.success) {
    throw new HttpsError('invalid-argument', parsed.error.flatten().formErrors.join(' '));
  }

  const payload = parsed.data as CreateContributionSessionPayload;
  return givebutterService.createCheckoutSession(payload);
});

export const handleGivebutterWebhook = onRequest({ region: 'us-central1' }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const eventType = typeof req.body?.type === 'string' ? req.body.type : 'unknown';
  const requestId =
    typeof req.body?.data?.metadata?.requestId === 'string'
      ? req.body.data.metadata.requestId
      : undefined;

  // TODO: Validate Givebutter webhook signatures before processing production traffic.
  if (requestId && eventType.includes('payment')) {
    await db.collection('donation_requests').doc(requestId).set(
      {
        contribution: {
          status: 'completed'
        },
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );
  }

  res.status(200).json({ ok: true });
});

function buildNextSteps(type: CreateDonationRequestPayload['donationType']): string[] {
  if (type === 'pickup') {
    return [
      'We will confirm your courier assignment by email and text shortly.',
      'Please keep your donation packed and accessible during your selected window.'
    ];
  }

  if (type === 'shipping') {
    return [
      'We will send shipping label instructions to your email address.',
      'After shipping, save your receipt so we can trace delivery if needed.'
    ];
  }

  return [
    'Bring your donation during the selected window.',
    'Share your drop-off reference at check-in for fast verification.'
  ];
}
