import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';

/*
  Generated class for the QqProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

interface VKeyResponse {
  code: number;
  key: string;
}

interface Singer {
  name: string;
}
interface Album {
  name: string;
  mid: string;
}
interface Song {
  name: string;
  mid: string;
  album: Album;
  singer: Singer[];
  url: string;
}
interface SongData {
  list: Song[];
}
interface SearchData {
  song: SongData;
}
interface SearchResponse {
  code: number;
  data: SearchData;
}

@Injectable()
export class QQProvider {
  baseUrl: string = 'dl.stream.qqmusic.qq.com';
  vkey: string = '';
  guid: number;
  updateTime: number;
  // baseApi: string = '/qq';
  baseApi: string = 'https://c.y.qq.com';

  constructor(private http: HttpClient) {
    console.log('Hello QQProvider Provider');
  }

  async getVKey() {
    if (!this.updateTime || this.updateTime + 3600 * 1000 < (new Date()).valueOf()) {
      try {
        this.vkey = await this.updateVKey();
        this.updateTime = (new Date()).valueOf();
      } catch (err) {
        console.log('Cannot update vkey.');
        console.log(err);
      }
    }
    return this.vkey;
  }

  private getGUid() {
    const currentMs = (new Date()).getUTCMilliseconds();
    return Math.round(2147483647 * Math.random()) * currentMs % 1e10;
  }

  private async updateVKey() {
    this.guid = this.getGUid();
    const url = `${this.baseApi}/base/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=${this.guid}&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf8&notice=0&platform=yqq&needNewCode=0`;

    try {
      const result = await this.http.get<VKeyResponse>(url).toPromise();
      return result.key;
    } catch (err) {
      throw new Error(err);
    }
  }

  async search(keyword) {
    try {
      await this.getVKey();
    } catch (err) {
      return console.log('QQ Music module initial failed.');
    }

    if (!this.vkey || this.vkey.length !== 112) {
      return console.log('QQ Music module is not ready.');
    }
    const url = `${this.baseApi}/soso/fcgi-bin/client_search_cp?new_json=1&lossless=1&p=1&n=10&w=${encodeURIComponent(keyword)}&format=json`;
    let searchRes;
    try {
      searchRes = await this.http.get<SearchResponse>(url).toPromise();
    } catch (error) {
      throw new Error(error);
    }
    return searchRes.data.song.list.map((e) => {
      return {
        name: e.name,
        artist: e.singer[0].name,
        album: e.album.name,
        albumPic: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${e.album.mid}.jpg?max_age=2592000`,
        mid: e.mid,
        url: this.getUrl('C400', e.mid, 'm4a'),
      }
    })
  }

  getUrl(prefix, mid, type) {
    const url = `http://${this.baseUrl}/${prefix}${mid}.${type}?vkey=${this.vkey}&guid=${this.guid}&uin=0&fromtag=30`;
    return url;
  }
}
