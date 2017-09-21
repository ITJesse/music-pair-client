import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';

import { UnblockProvider } from '../../providers/unblock/unblock';

/**
 * Generated class for the PreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html',
  providers: [ UnblockProvider ],
})
export class PreviewPage {
  oldSong: any;
  newSong: any;
  playIcon: string = 'play';
  music: MediaObject;
  loading: boolean = false;
  isPlay: boolean = false;
  isPaired: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private media: Media,
    public toastCtrl: ToastController,
    private unblockApi: UnblockProvider,
  ) {
    const { oldSong, newSong, isPaired } = this.navParams.data;
    this.oldSong = oldSong;
    this.newSong = newSong;
    this.isPaired = isPaired;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreviewPage');
    console.log(this.newSong);
    this.music = this.media.create(this.newSong.url);
    this.music.onError.subscribe(error => console.log('Error!', error));
  }

  play() {
    if (!this.isPlay) {
      this.playIcon = 'pause';
      this.music.play();
      this.isPlay = true;
    } else {
      this.playIcon = 'play';
      this.music.pause();
      this.isPlay = false;
    }
  }

  async pair() {
    this.loading = true;
    try {
      await this.unblockApi.init();
      await this.unblockApi.pairMusic({
        songId: this.oldSong.songId,
        plugin: 'QQ Music',
        ...this.newSong,
      });
    } catch (error) {
      const toast = this.toastCtrl.create({
        message: 'Pair music failed.',
        duration: 3000,
      });
      toast.present();
      return console.log(error);
    }
    this.navCtrl.popToRoot();
    this.loading = false;
  }

  async unpair() {
    this.loading = true;
    try {
      await this.unblockApi.init();
      await this.unblockApi.unpairMusic(this.oldSong.songId);
    } catch (error) {
      const toast = this.toastCtrl.create({
        message: 'Unpair music failed.',
        duration: 3000,
      });
      toast.present();
      return console.log(error);
    }
    this.navCtrl.popToRoot();
    this.loading = false;
  }

  ionViewDidLeave() {
    this.music.stop();
    this.music.release();
  }

}
