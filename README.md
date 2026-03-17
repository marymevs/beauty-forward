# Beauty Forward Donation Logistics MVP

Public-facing donation logistics flow built with Angular + TypeScript, Firebase, Firestore, and Firebase Cloud Functions.

## What This MVP Includes

- Donation method selection screen with three options:
  - `Schedule Pickup`
  - `Ship Products`
  - `Schedule Drop-Off`
- Pickup flow with Uber-style structure:
  - donor + pickup address capture
  - fixed warehouse destination (not user-editable)
  - preferred date/time window
  - review screen before submission
  - confirmation screen
- Optional pay-what-you-wish contribution UX (high-visibility) with Givebutter checkout scaffold
- Shipping flow:
  - sender details capture
  - shipping-label payment architecture and mock service layer
  - Firestore submission + confirmation with next steps
- Drop-off flow:
  - donor details + slot request
  - generated drop-off reference code
  - Firestore submission + confirmation
- No authentication required for MVP, with data model ready for future account association
- Roadie integration-ready courier abstraction + mock provider in Cloud Functions

## Tech Stack

- Frontend: Angular 21 + TypeScript (standalone components)
- Data: Firestore
- Backend logic: Firebase Cloud Functions (v2)
- Styling: custom mobile-first SCSS

## Project Structure

```text
.
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── constants/time-windows.ts
│   │   │   ├── guards/flow.guard.ts
│   │   │   ├── models/donation.models.ts
│   │   │   └── services/
│   │   │       ├── contribution.service.ts
│   │   │       ├── donation-api.service.ts
│   │   │       ├── donation-flow-state.service.ts
│   │   │       ├── firebase-client.service.ts
│   │   │       ├── shipping-label.service.ts
│   │   │       └── warehouse-config.service.ts
│   │   ├── features/
│   │   │   ├── method-selection/
│   │   │   ├── pickup/
│   │   │   ├── shipping/
│   │   │   └── dropoff/
│   │   ├── shared/components/
│   │   │   ├── contribution-panel/
│   │   │   └── donation-option-card/
│   │   ├── app.routes.ts
│   │   ├── app.ts
│   │   ├── app.html
│   │   └── app.scss
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   └── styles.scss
├── functions/
│   ├── src/
│   │   ├── providers/
│   │   │   ├── courier-provider.ts
│   │   │   ├── mock-roadie-provider.ts
│   │   │   ├── shipping-label-provider.ts
│   │   │   └── mock-shipping-label-provider.ts
│   │   ├── services/givebutter.service.ts
│   │   ├── utils/dropoff-reference.ts
│   │   ├── index.ts
│   │   ├── models.ts
│   │   └── validators.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── firebase.json
├── firestore.rules
└── firestore.indexes.json
```

## Routing

- `/` method selection page
- `/pickup` -> `/pickup/review` -> `/pickup/confirmation`
- `/shipping` -> `/shipping/review` -> `/shipping/confirmation`
- `/dropoff` -> `/dropoff/review` -> `/dropoff/confirmation`

Route guards block direct access to review/confirmation when draft state is missing.

## Firestore Data Model

### Primary collection

`donation_requests/{requestId}`

```ts
{
  donationType: 'pickup' | 'shipping' | 'dropoff',
  donor: { fullName, email, phone, donorAccountId? },
  contribution: { provider: 'givebutter', status, amountUsd?, checkoutUrl? },
  pickup?: { ... },
  shipping?: { ... },
  dropoff?: { ... },
  status: 'queued_for_dispatch' | 'pending_label_purchase' | 'dropoff_requested' | 'submitted',
  createdAt,
  updatedAt,
  metadata
}
```

### Type-specific collections

- `pickup_requests/{requestId}`
- `shipping_requests/{requestId}`
- `dropoff_requests/{requestId}`

Each mirrors the base document and includes `donationRequestId`.

## Cloud Functions

- `createDonationRequest` (`onCall`)
  - validates payload
  - writes to `donation_requests` and the type-specific collection
  - generates drop-off reference for drop-off requests
  - runs courier dispatch abstraction for pickup requests
  - creates shipping-label intent via provider abstraction for shipping requests
- `createContributionSession` (`onCall`)
  - returns Givebutter checkout session scaffold URL
- `handleGivebutterWebhook` (`onRequest`)
  - webhook placeholder for contribution status updates

## Integration Readiness

### Roadie

- `CourierDispatchProvider` interface implemented by `MockRoadieCourierProvider`
- TODO markers show where real Roadie API calls belong

### Givebutter

- Frontend `ContributionService` calls backend `createContributionSession`
- Backend `GivebutterService` currently builds checkout URLs and is structured for API session creation later
- `handleGivebutterWebhook` is scaffolded for payment event updates

### Shipping labels

- Frontend `ShippingLabelService` mock prepares checkout URL + quote
- Backend `ShippingLabelProvider` abstraction + mock provider is in place

## Environment Configuration

Update:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `functions/.env` (copy from `functions/.env.example`)

Key placeholders:

- Firebase web config keys
- warehouse name/address config
- Givebutter campaign URL
- future Roadie credentials

## Local Setup

```bash
npm install
npm run build
npm run start
```

Cloud Functions:

```bash
npm run functions:install
npm run functions:build
```

Combined build:

```bash
npm run build:all
```

## Notes for Future Work

- Add Firebase Auth and set `donorAccountId` from authenticated user
- Replace mock Roadie provider with real API implementation
- Implement true Givebutter checkout session + webhook signature verification
- Implement real shipping label purchase/generation integration
- Add admin dashboard + request management workflow statuses
- Harden Firestore rules for production and authenticated admin reads
