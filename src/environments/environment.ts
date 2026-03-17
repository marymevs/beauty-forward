export const environment = {
  production: true,
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_FIREBASE_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
    functionsRegion: 'us-central1',
    useEmulators: false
  },
  warehouse: {
    name: 'Beauty Forward Warehouse',
    line1: '1200 Impact Way',
    line2: 'Suite 120',
    city: 'Atlanta',
    state: 'GA',
    postalCode: '30303',
    deliveryNotes: 'Use receiving dock B for donations and ring the donation bell on arrival.'
  },
  integrations: {
    givebutter: {
      publicCampaignUrl: 'https://givebutter.com/beauty-forward'
    },
    shippingLabel: {
      provider: 'mock',
      mockCheckoutUrl: 'https://example.com/shipping-label-checkout'
    }
  }
};
