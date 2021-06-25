import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { Constants } from './model/Constants';

@Injectable()
export class TwitchService {
  private user_id = '127194472'; // Gargamelion's channel client_id
  private client_id = '1e4gz76ye3w3f71ic955m4seb8jfph';
  private _favs = new BehaviorSubject(null);
  private favs$ = this._favs.asObservable();
  private access_token;
  private TWITCH_HELIX_API_URL = 'https://api.twitch.tv/helix';

  constructor(
    private httpService: HttpClient,
    private cookieService: CookieService
  ) {}

  private makeAPIRequest(url: string) {
    this.checkAccessToken();
    return this.httpService
      .get<any>(url, {
        headers: {
          'Client-Id': this.client_id,
          Authorization: 'Bearer ' + this.access_token
        }
      })
      .pipe(this.handle401);
  }

  public getGames() {
    return this.makeAPIRequest(
      this.TWITCH_HELIX_API_URL + '/games/top?first=100'
    );
  }

  public getChannelsOfGame(id: string) {
    return this.makeAPIRequest(
      this.TWITCH_HELIX_API_URL + '/streams?game_id=' + id
    ).pipe(map((e: any) => e.data));
  }

  public getMyFollowedStreams() {
    return this.makeAPIRequest(
      this.TWITCH_HELIX_API_URL + '/streams/followed?user_id=' + this.user_id
    ).pipe(map((e: any) => e.data));
  }

  public loadFavs() {
    this.getMyFollowedStreams().subscribe(e => {
      this._favs.next(e);
    });
  }
  public getFavStreams() {
    return this.favs$;
  }

  public getOauthUrl() {
    let href: string;
    href = 'https://id.twitch.tv/oauth2/authorize?';
    href += 'client_id=1e4gz76ye3w3f71ic955m4seb8jfph';
    href += '&';
    href += 'redirect_uri=' + encodeURIComponent(this.getBaseUrl());
    href += '&';
    href += 'response_type=token';
    href += '&';
    href += 'scope=user:read:follows';
    return href;
  }

  getBaseUrl() {
    return window.location.origin + '/#/oauth_redirect';
  }

  public redirectToOauth() {
    window.location.replace(this.getOauthUrl());
  }

  private checkAccessToken() {
    const access_token = this.cookieService.get(Constants.ACCESS_TOKEN);
    if (access_token) {
      this.access_token = access_token;
    } else {
      console.error('Access token does not exists');
      this.redirectToOauth();
    }
  }
  public hasAccessToken():boolean{
    return this.cookieService.get(Constants.ACCESS_TOKEN)?true:false;
  }
  public setAccessToken(access_token:string){
    this.cookieService.put(Constants.ACCESS_TOKEN, access_token);
  }

  private handle401 = catchError((err: HttpErrorResponse) => {
    if (err.status == 401) {
      console.warn('Got 401. Redirecting to Oauth');
      this.redirectToOauth();
    } else {
      console.error('ERR :', err);
    }
    return throwError(err); //Rethrow it back to component
  });

 
}
