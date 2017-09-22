import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AppPreferences } from '@ionic-native/app-preferences';
import { Media } from '@ionic-native/media';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';

import { MyApp } from './app.component';
import { UnblockProvider } from '../providers/unblock/unblock';
import { QQProvider } from '../providers/qq/qq';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppPreferences,
    Media,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UnblockProvider,
    QQProvider,
  ]
})
export class AppModule {}
