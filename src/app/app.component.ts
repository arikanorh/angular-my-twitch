import { Component } from '@angular/core';
import { TwitchService } from './twitch.service';
import {  Observable } from 'rxjs';
import { User } from './model/User';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent   {


  user:User;

  constructor(private twitch:TwitchService){

    this.twitch.getUser().subscribe(e=>this.user=e);
  }

  navigateToOauth(){
    this.twitch.redirectToOauth();

  }
}
