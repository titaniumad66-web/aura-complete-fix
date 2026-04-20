import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aura.app',
  appName: 'Aura',
  webDir: 'dist',
  server: {
    url: 'https://aura-complete-fix.vercel.app',
    cleartext: true
  }
};

export default config;
