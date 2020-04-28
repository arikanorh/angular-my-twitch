import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TwitchService } from '../twitch.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit,OnDestroy {
  games;
  listener;

  constructor(private twitch:TwitchService){
 
  }

  ngOnInit(){
    this.twitch.getGames().subscribe(
      e=>{
        this.games = e.top; 
      }
    );

    this.listener = document.addEventListener('keydown',(e:KeyboardEvent)=>{
      console.log(e.key);
    });
  }

  ngOnDestroy(){
    document.removeEventListener('keypress',this.listener);
  }
}