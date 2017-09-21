import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root = 'RecentPage';
  tab2Root = 'PairPage';
  tab3Root = 'SettingsPage';
  selectedIndex: number = 2;
  isSet: boolean = false;

  @ViewChild('myTabs') tabRef: Tabs;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appPreferences: AppPreferences,
  ) {
    this.selectedIndex = navParams.get("tab") ? navParams.get("tab") : 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  async ionViewWillEnter() {
    const isSet = await this.appPreferences.fetch('is_set');
    this.isSet = isSet === '1';
    if (this.isSet) {
      this.tabRef.select(0);
    }
  }

}
