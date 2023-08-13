import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { Constants } from './model/Constants';
import { Stream } from './model/Stream';
import { Game } from './model/Game';
import { User } from './model/User';

@Injectable()
export class TwitchService {
  private user_id; // Gargamelion's channel client_id
  // private user_id = '127194472'; // Gargamelion's channel client_id
  private client_id = '1e4gz76ye3w3f71ic955m4seb8jfph';

  private access_token: string;
  private TWITCH_HELIX_API_URL = 'https://api.twitch.tv/helix';


  private _favs = new BehaviorSubject<Stream[]>(null);
  private favs$ = this._favs.asObservable();


  private _games = new BehaviorSubject<Game[]>(null);
  private games$ = this._games.asObservable();

  private _user = new ReplaySubject<User>(1);
  private user$ = this._user.asObservable();

  constructor(
    private httpService: HttpClient
  ) {

    this.loadAccessToken();


    // this.getUser().subscribe(e => {
    //   if (e) {
    //     this.router.navigate(['games']);
    //   }
    // })

    if (this.access_token) {
      this.loadUser();
    } else {
      this._user.next(null);
    }
  }

  private makeTwitchAPIRequest<T>(url: string): Observable<T[]> {
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
            this.setAccessToken(null);
            this.redirectToOauth();
          } else {
            console.error('ERR :', err);
          }
          return throwError(() => err); //Rethrow it back to component
        })
      )
      .pipe(map((e: any) => e.data));
  }

  private getUserFromAPI(): Observable<User> {
    return this.makeTwitchAPIRequest<User>(
      this.TWITCH_HELIX_API_URL + '/users'
    ).pipe(map((e: User[]) => {
      console.log("Got user");
      let user = e[0];
      this.user_id = user.id;
      return user;
    }),
      tap(e => {
        this.loadFavs();
      }));
  }

  private getGamesFromAPI(): Observable<Game[]> {
    return this.makeTwitchAPIRequest<Game>(
      this.TWITCH_HELIX_API_URL + '/games/top?first=100'
    );
  }

  public getStreamsOfGameFromAPI(id: string): Observable<Stream[]> {
    return this.makeTwitchAPIRequest<Stream>(
      this.TWITCH_HELIX_API_URL + '/streams?game_id=' + id
    );
  }

  private getMyFollowedStreamsFromAPI(): Observable<Stream[]> {
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

  public loadUser(): void {
    this.getUserFromAPI().subscribe((e: User) => {
      this._user.next(e);
    });
  }

  public getFavStreams(): Observable<Stream[]> {
    return this.favs$;
  }

  public getGames(): Observable<Game[]> {
    return this.games$;
  }

  public getUser(): Observable<User> {
    return this.user$;
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
    console.log("Redirecting Oauth");
    window.location.replace(this.getOauthUrl());
  }


  private getAccessTokenFromCookie(): string {
    return localStorage.getItem(Constants.ACCESS_TOKEN);

  }
  public setAccessToken(access_token: string) {
    console.log("Settings access token");
    this.access_token = access_token;
    localStorage.setItem(Constants.ACCESS_TOKEN, access_token);
  }

  private loadAccessToken() {
    this.access_token = this.getAccessTokenFromUrl();
    if (!this.access_token) {
      this.access_token = this.getAccessTokenFromCookie();
    }
  }

  //TODO I DONT LIKE THIS , BUT I HAD TO SORRY
  private getAccessTokenFromUrl() {
    var hash = window.location.hash;
    var i = hash.indexOf('access_token');
    if (i > 0) {

      var hash2 = hash.substr(i + 13)// U asking why 13 right?
      var acces_token = hash2.substr(0, hash2.indexOf('&scope'));
      if (acces_token) {
        this.setAccessToken(acces_token);
      }
    }
    return null;
  }
}
