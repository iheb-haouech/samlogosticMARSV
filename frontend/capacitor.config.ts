import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.samlogistic.app',
  appName: 'SAM Logistic',
  webDir: 'dist',
  server: {
    url: 'https://samlogistic.tn',
    hostname: 'samlogistic.tn',
    iosScheme: 'https',
    allowNavigation: ['samlogistic.tn', 'api.samlogistic.tn']
  }
};

export default config;