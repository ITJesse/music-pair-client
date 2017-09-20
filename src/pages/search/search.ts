import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { QQProvider } from '../../providers/qq/qq';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [ QQProvider ],
})
export class SearchPage {
  song: any;
  keyword: string = '';
  searchRes: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private qqApi: QQProvider,
  ) {
    this.song = this.navParams.data.song;
    this.keyword = `${this.song.name} ${this.song.artist} ${this.song.album}`;
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    try {
      this.searchRes = await this.qqApi.search(this.keyword);
    } catch (error) {
      console.log(error);
    }
  }

  preview(song) {
    this.navCtrl.push('PreviewPage', {
      oldSong: this.song,
      newSong: song,
    });
  }

}
