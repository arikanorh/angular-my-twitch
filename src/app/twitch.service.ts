import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { Constants } from './model/Constants';
import { Stream } from './model/Stream';
import { Game } from './model/Game';

@Injectable()
export class TwitchService {
  private user_id = '127194472'; // Gargamelion's channel client_id
  private client_id = '1e4gz76ye3w3f71ic955m4seb8jfph';

  private access_token: string;
  private TWITCH_HELIX_API_URL = 'https://api.twitch.tv/helix';


  private _favs = new BehaviorSubject<Stream[]>(null);
  private favs$ = this._favs.asObservable();


  private _games = new BehaviorSubject<Game[]>(null);
  private games$ = this._games.asObservable();

  constructor(
    private httpService: HttpClient,
    private cookieService: CookieService
  ) {}

  private makeTwitchAPIRequest<T>(url: string): Observable<T[]> {
    this.checkAccessToken();
    return this.httpService
      .get<T>(url, {
        headers: {
          'Client-Id': this.client_id,
          Authorization: 'Bearer ' + this.access_token
        }
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status == 401) {
            console.warn('Got 401. Redirecting to Oauth');
            this.redirectToOauth();
          } else {
            console.error('ERR :', err);
          }
          return throwError(err); //Rethrow it back to component
        })
      )
      .pipe(map((e: any) => e.data));
  }

  public getGamesFromAPI(): Observable<Game[]> {
    return this.makeTwitchAPIRequest<Game>(
      this.TWITCH_HELIX_API_URL + '/games/top?first=100'
    );
  }

  public getStreamsOfGameFromAPI(id: string): Observable<Stream[]> {
    return this.makeTwitchAPIRequest<Stream>(
      this.TWITCH_HELIX_API_URL + '/streams?game_id=' + id
    );
  }

  public getMyFollowedStreamsFromAPI(): Observable<Stream[]> {
    return this.makeTwitchAPIRequest<Stream>(
      this.TWITCH_HELIX_API_URL + '/streams/followed?user_id=' + this.user_id
    );
  }

  public loadFavs(): void {
    this.getMyFollowedStreamsFromAPI().subscribe((e: Stream[]) => {
      this._favs.next(e);
    });
  }

  public loadGames(): void {
    this.getGamesFromAPI().subscribe((e: Game[]) => {
      this._games.next(e);
    });
  }

  public getFavStreams(): Observable<Stream[]> {
    return this.favs$;
  }

  public getGames(): Observable<Game[]> {
    return this.games$;
  }


  public getOauthUrl(): string {
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

  private getBaseUrl(): string {
    return window.location.origin + '/#/oauth_redirect';
  }

  public redirectToOauth(): void {
    window.location.replace(this.getOauthUrl());
  }

  private checkAccessToken(): void {
    const access_token = this.cookieService.get(Constants.ACCESS_TOKEN);
    if (access_token) {
      this.access_token = access_token;
    } else {
      console.error('Access token does not exists');
      this.redirectToOauth();
    }
  }
  public hasAccessToken(): boolean {
    return this.cookieService.get(Constants.ACCESS_TOKEN) ? true : false;
  }
  public setAccessToken(access_token: string) {
    this.cookieService.put(Constants.ACCESS_TOKEN, access_token);
  }
}
