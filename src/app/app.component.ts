import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppPreferences } from '@ionic-native/app-preferences';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = '';

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private appPreferences: AppPreferences,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('ready');
      statusBar.styleDefault();
      statusBar.overlaysWebView(true);
      splashScreen.hide();
      this.checkSettings();
    });
  }

  async checkSettings() {
    const isSet = await this.appPreferences.fetch('is_set');
    if (isSet !== '0') {
      this.rootPage = 'TabsPage';
    } else {
      this.rootPage = 'SettingsPage';
    }
  }
}

