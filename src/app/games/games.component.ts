import { Component, OnInit } from '@angular/core';
import { TwitchService } from '../twitch.service';
import { Game } from '../model/Game';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games$: Observable<Game[]>;

  constructor(private twitch: TwitchService) {

  }

  ngOnInit() {
    this.games$ = this.twitch.getGames();
    this.reloadGames();
  }

  reloadGames() {
    this.twitch.loadGames();
  }

  trackByFn(index,game:Game) {
    return game.id;
  }

}