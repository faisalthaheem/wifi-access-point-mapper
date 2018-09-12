import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { WifiSelectorPage } from '../pages/wifiselector/wifiselector';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { BLE } from '@ionic-native/ble';
import { Geolocation } from '@ionic-native/geolocation';
import { Hotspot } from '@ionic-native/hotspot';
import { SQLite } from '@ionic-native/sqlite';
import { File } from '@ionic-native/file';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    WifiSelectorPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    WifiSelectorPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
	BLE,
	Geolocation,
	Hotspot,
	SQLite,
  File,
  {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
