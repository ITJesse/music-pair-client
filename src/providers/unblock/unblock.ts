import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppPreferences } from '@ionic-native/app-preferences';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';

/*
  Generated class for the UnblockProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

interface ApiResponse {
  error: number;
  result: any;
}

interface SongInfo {
  songId: number;
  name: string;
  artist: string;
  album: string;
  albumPic: string;
  hash: string;
  plugin: string;
}

@Injectable()
export class UnblockProvider {
  host: string = '';
  username: string = '';
  password: string = '';
  isInit: boolean = false;

  constructor(
    public http: HttpClient,
    private appPreferences: AppPreferences,
  ) {
    console.log('Hello UnblockProvider Provider');
  }

  async init() {
    try {
      this.host = await this.appPreferences.fetch('host');
      this.username = await this.appPreferences.fetch('username');
      this.password = await this.appPreferences.fetch('password');
    } catch (error) {
      return console.log(error);
    }
    this.isInit = true;
  }

  private makeHeader(): HttpHeaders {
    if (!this.isInit) throw new Error('Not init.');
    return new HttpHeaders().set('Authorization', 'Basic ' + btoa(`${this.username}:${this.password}`));
  }

  check() {
    return this.http.get<ApiResponse>(`${this.host}/api/pair/check`, { headers: this.makeHeader() }).toPromise();
  }

  getRecents() {
    return this.http.get<ApiResponse>(`${this.host}/api/pair/recent`, { headers: this.makeHeader() }).toPromise();
  }

  getPairs() {
    return this.http.get<ApiResponse>(`${this.host}/api/pair`, { headers: this.makeHeader() }).toPromise();
  }

  pairMusic(songInfo: SongInfo) {
    return this.http.put<ApiResponse>(`${this.host}/api/pair`, songInfo, { headers: this.makeHeader() }).toPromise();
  }

  unpairMusic(songId: number) {
    return this.http.delete<ApiResponse>(`${this.host}/api/pair/${songId}`, { headers: this.makeHeader() }).toPromise();
  }

}
