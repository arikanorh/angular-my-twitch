import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, switchMap, tap } from "rxjs/operators";
import { games } from "./games";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class TwitchService {
  private user_id = "127194472"; // Gargamelion's channel client_id
  private client_id = "jzkbprff40iqj646a697cyrvl0zt2m6";
  private _favs = new BehaviorSubject(null);
  private favs$ = this._favs.asObservable();

  constructor(private httpService: HttpClient) {}

  public getChannelsOfGame(game: string) {
    return this.httpService.get<any>(
      "https://api.twitch.tv/kraken/streams?client_id=jzkbprff40iqj646a697cyrvl0zt2m6&game=" +
        game +
        "&limit=100"
    ).pipe(map(e=>e.streams));
  }

  public getGames() {
    return this.httpService
      .get<any>(
        "https://api.twitch.tv/kraken/games/top?client_id=jzkbprff40iqj646a697cyrvl0zt2m6&limit=100&offset=0"
      )
      .pipe(
        tap(e => {
          let data = e.top;
          var keys = Object.keys(data);

          let result = {};
          for (var i = 0; i < keys.length; i++) {
            let value = data[keys[i]];
            result[value.game._id] = value.game.name;
          }
          //console.log(JSON.stringify(result));
        })
      );
  }

  getMyFollowedStreams() {
    return this.getMyFollowedChannel().pipe(
      switchMap(e => {
 
        return this.getStreamOfUserIds(e.join(","));
      })
    );
  }

  getMyFollowedChannel() {
    var channels = [];
    return this.httpService
      .get<any>(
        "https://api.twitch.tv/kraken/users/gargamelion/follows/channels?client_id=jzkbprff40iqj646a697cyrvl0zt2m6&limit=100"
      )
      .pipe(
        map(e => {
          let data = e.follows;
          var keys = Object.keys(data);

          let result = [];
          for (var i = 0; i < keys.length; i++) {
            let value = data[keys[i]];
            result.push(value.channel.name);
          }

          return result;
        })
      );
  }

  getGameName(game_id): string {
    return games[game_id];
  }

  public getStreamOfUserIds(user_ids) {
    return this.httpService
      .get<any>("https://api.twitch.tv/kraken/streams?client_id=jzkbprff40iqj646a697cyrvl0zt2m6&channel=" + user_ids)
      .pipe(
        map(e => {

          let data = e.streams;
          var keys = Object.keys(data);

          let result = [];
          for (var i = 0; i < keys.length; i++) {
            let value = data[keys[i]];
            result.push(value);
          }
          return result;
        })
      );
  }

  public loadFavs() {
    this.getMyFollowedStreams().subscribe(e => {
      this._favs.next(e);
    });
  }
  public getFavStreams() {
    return this.favs$;
  }

 
}
