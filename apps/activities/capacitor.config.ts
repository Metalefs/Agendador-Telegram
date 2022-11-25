/// <reference types="@capacitor/local-notifications" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ionicbyrequest.mealPrepActivitiesScheduler',
  appName: 'activities',
  webDir: '../../dist/apps/activities',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
