import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';

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
})
export class PreviewPage {
  oldSong: any;
  newSong: any;
  playIcon: string = 'play';
  music: MediaObject;
  isPlay: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private media: Media,
  ) {
    const { oldSong, newSong } = this.navParams.data;
    this.oldSong = oldSong;
    this.newSong = newSong;
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

  ionViewDidLeave() {
    this.music.stop();
    this.music.release();
  }

}
