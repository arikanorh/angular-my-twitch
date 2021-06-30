import { Component, OnInit, OnDestroy } from '@angular/core';
import { TwitchService } from '../twitch.service';
import { Game } from '../model/Game';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games$:Observable<Game[]>;
 
  constructor(private twitch:TwitchService){
 
  }

  ngOnInit(){
    this.games$ = this.twitch.getGamesFromAPI();
    this.reloadGames();
    }

    reloadGames(){
      this.twitch.loadGames();
    }
}