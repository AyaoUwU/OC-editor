import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.oceditor.app',
  appName: 'OC editor',
  webDir: 'out',
  android: {
    allowMixedContent: true,
  },
  ios: {
    scheme: 'capacitor',
  },
  plugins: {
    Keyboard: {
      resizeOnFullScreen: true,
    },
  },
}

export default config
