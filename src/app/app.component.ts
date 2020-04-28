import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  name = 'Angular';
  games;
  
  constructor(private httpService:HttpClient){

  }

  ngOnInit(){
    this.httpService.get('https://api.twitch.tv/kraken/games/top?client_id=jzkbprff40iqj646a697cyrvl0zt2m6&limit=50&offset=0').subscribe(
      
      e=>{
        this.games = e.top;
      }
    );
  }
}
