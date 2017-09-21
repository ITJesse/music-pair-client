import { Component, ViewChild } from '@angular/core';
import { IonicPage, Content, NavController, NavParams, ToastController } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';

import { UnblockProvider } from '../../providers/unblock/unblock';
import { QQProvider } from '../../providers/qq/qq';

/**
 * Generated class for the PairPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pair',
  templateUrl: 'pair.html',
  providers: [ UnblockProvider, QQProvider ],
})
export class PairPage {
  @ViewChild(Content) content: Content;
  pairs: any[];
  proxy: boolean = false;
  loading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private appPreferences: AppPreferences,
    private unblockApi: UnblockProvider,
    private qqApi: QQProvider,
  ) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad PairPage');
    this.proxy = (await this.appPreferences.fetch('proxy')) === '1';
  }

  ionViewDidEnter() {
    this.loadPairData();
  }

  async loadPairData(refresher = null) {
    this.loading = true;
    try {
      await this.unblockApi.init();
      const res = await this.unblockApi.getPairs();
      if (res.error === 0) {
        if (!this.proxy) {
          this.pairs = res.result;
        } else {
          this.pairs = res.result.map((e) => {
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

  editPair(item) {
    this.navCtrl.push('EditPairPage', {
      newSong: {
        name: item.name,
        artist: item.artist,
        album: item.album,
        albumPic: item.albumPic,
        hash: item.hash,
      },
      oldSong: item.song,
    });
  }

  async preview(item) {
    this.loading = true;
    await this.qqApi.init();

    this.navCtrl.push('PreviewPage', {
      newSong: {
        name: item.name,
        artist: item.artist,
        album: item.album,
        albumPic: item.albumPic,
        hash: item.hash,
        url: this.qqApi.getUrl('C400', item.hash, 'm4a'),
      },
      oldSong: item.song,
      isPaired: true,
    });
    this.loading = false;
  }

}
