import { Component, ViewChild } from '@angular/core';
import { IonicPage, Content, NavController, NavParams, ToastController } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';

import { UnblockProvider } from '../../providers/unblock/unblock';

/**
 * Generated class for the RecentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recent',
  templateUrl: 'recent.html',
  providers: [ UnblockProvider ],
})
export class RecentPage {
  @ViewChild(Content) content: Content;
  recents: any[];
  proxy: boolean = false;
  loading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private appPreferences: AppPreferences,
    private unblockApi: UnblockProvider,
  ) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad RecentPage');
    this.proxy = (await this.appPreferences.fetch('proxy')) === '1';
  }

  ionViewDidEnter() {
    this.loadRecentData();
  }

  async loadRecentData(refresher = null) {
    this.loading = true;
    try {
      await this.unblockApi.init();
      const res = await this.unblockApi.getRecents();
      if (res.error === 0) {
        if (!this.proxy) {
          this.recents = res.result;
        } else {
          this.recents = res.result.map((e) => {
            const song = {
              ...e.song,
              albumPic: e.song.albumPic.replace('http://', 'http://101.96.10.58/'),
            }
            return {
              ...e,
              song,
            };
          });
        }
      }
    } catch (error) {
      const toast = this.toastCtrl.create({
        message: 'Load data failed.',
        duration: 3000,
      });
      toast.present();
      return console.log(error);
    }
    this.loading = false;
    setTimeout(() => this.content.scrollToTop(), 50);

    if (refresher) {
      setTimeout(() => refresher.complete(), 1000);
    }
  }

  search(song) {
    this.navCtrl.push('SearchPage', { song });
  }

}
