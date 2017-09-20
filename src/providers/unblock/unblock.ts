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

}
