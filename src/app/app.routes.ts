import { Routes } from '@angular/router';
import {
  dropoffConfirmationGuard,
  dropoffDraftGuard,
  pickupConfirmationGuard,
  pickupDraftGuard,
  shippingConfirmationGuard,
  shippingDraftGuard
} from './core/guards/flow.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/method-selection/method-selection-page.component').then(
        (m) => m.MethodSelectionPageComponent
      )
  },
  {
    path: 'pickup',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/pickup/pickup-details-page.component').then(
            (m) => m.PickupDetailsPageComponent
          )
      },
      {
        path: 'review',
        canActivate: [pickupDraftGuard],
        loadComponent: () =>
          import('./features/pickup/pickup-review-page.component').then(
            (m) => m.PickupReviewPageComponent
          )
      },
      {
        path: 'confirmation',
        canActivate: [pickupConfirmationGuard],
        loadComponent: () =>
          import('./features/pickup/pickup-confirmation-page.component').then(
            (m) => m.PickupConfirmationPageComponent
          )
      }
    ]
  },
  {
    path: 'shipping',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/shipping/shipping-details-page.component').then(
            (m) => m.ShippingDetailsPageComponent
          )
      },
      {
        path: 'review',
        canActivate: [shippingDraftGuard],
        loadComponent: () =>
          import('./features/shipping/shipping-review-page.component').then(
            (m) => m.ShippingReviewPageComponent
          )
      },
      {
        path: 'confirmation',
        canActivate: [shippingConfirmationGuard],
        loadComponent: () =>
          import('./features/shipping/shipping-confirmation-page.component').then(
            (m) => m.ShippingConfirmationPageComponent
          )
      }
    ]
  },
  {
    path: 'dropoff',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dropoff/dropoff-details-page.component').then(
            (m) => m.DropoffDetailsPageComponent
          )
      },
      {
        path: 'review',
        canActivate: [dropoffDraftGuard],
        loadComponent: () =>
          import('./features/dropoff/dropoff-review-page.component').then(
            (m) => m.DropoffReviewPageComponent
          )
      },
      {
        path: 'confirmation',
        canActivate: [dropoffConfirmationGuard],
        loadComponent: () =>
          import('./features/dropoff/dropoff-confirmation-page.component').then(
            (m) => m.DropoffConfirmationPageComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
