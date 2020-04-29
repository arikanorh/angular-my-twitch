import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, switchMap, tap } from "rxjs/operators";
import { games } from "./games";

@Injectable()
export class TwitchService {
  private user_id = "127194472"; // Gargamelion's channel client_id

  constructor(private httpService: HttpClient) {}

  public getChannelsOfGame(game: string) {
    return this.httpService.get<any>(
      "https://api.twitch.tv/kraken/streams?client_id=jzkbprff40iqj646a697cyrvl0zt2m6&game=" +
        game +
        "&limit=100"
    );
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

  public getMyFollowedStreams() {
    return this.getMyFollowedChannel().pipe(
      switchMap(e =>
        this.getStreamOfUserIds(e.map(i => "user_id=" + i).join("&"))
      )
    );
  }

  public getMyFollowedChannel() {
    var channels = [];
    return this.httpService
      .get<any>(
        "https://api.twitch.tv/helix/users/follows?first=100&from_id=" +
          this.user_id,
        {
          headers: {
            "Client-ID": "1e4gz76ye3w3f71ic955m4seb8jfph"
          }
        }
      )
      .pipe(
        map(e => {
          let data = e.data;
          var keys = Object.keys(data);

          let result = [];
          for (var i = 0; i < keys.length; i++) {
            let value = data[keys[i]];
            result.push(value.to_id);
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
      .get<any>("https://api.twitch.tv/helix/streams?" + user_ids, {
        headers: {
          "Client-ID": "1e4gz76ye3w3f71ic955m4seb8jfph"
        }
      })
      .pipe(
        map(e => {
          let data = e.data;
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
}
