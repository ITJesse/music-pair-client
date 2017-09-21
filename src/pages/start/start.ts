import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';

/**
 * Generated class for the StartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appPreferences: AppPreferences,
  ) {
    this.checkSettings();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }

  async checkSettings() {
    const isSet = await this.appPreferences.fetch('is_set');
    if (isSet !== '0') {
      this.navCtrl.setRoot('TabsPage', { tab: 0 });
    } else {
      this.navCtrl.setRoot('TabsPage', { tab: 2 });
    }
  }

}
