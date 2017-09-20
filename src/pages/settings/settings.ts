import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';

import { UnblockProvider } from '../../providers/unblock/unblock';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'settings.html',
  providers: [ UnblockProvider ],
})
export class SettingsPage {
  host: string = '';
  username: string = '';
  password: string = '';
  proxy: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appPreferences: AppPreferences,
    public toastCtrl: ToastController,
    private unblockApi: UnblockProvider,
  ) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
    this.host = await this.appPreferences.fetch('host');
    this.username = await this.appPreferences.fetch('username');
    this.password = await this.appPreferences.fetch('password');
    this.proxy = (await this.appPreferences.fetch('proxy')) === '1';
  }

  async save() {
    try {
      await this.appPreferences.store('host', this.host);
      await this.appPreferences.store('username', this.username);
      await this.appPreferences.store('password', this.password);
      await this.appPreferences.store('proxy', this.proxy ? '1' : '0');
    } catch (error) {
      const toast = this.toastCtrl.create({
        message: 'Save failed',
        duration: 3000,
      });
      toast.present();
      return console.log(error);
    }

    let res;
    try {
      await this.unblockApi.init();
      res = await this.unblockApi.check();
    } catch (error) {
      await this.appPreferences.store('is_set', '0');
      const toast = this.toastCtrl.create({
        message: 'The server info is not correct.',
        duration: 3000,
      });
      toast.present();
      return console.log(error);
    }

    const toast = this.toastCtrl.create({
      message: 'Saved.',
      duration: 3000
    });
    toast.present();

    await this.appPreferences.store('is_set', '1');

    this.navCtrl.setRoot('TabsPage');
  }

}
