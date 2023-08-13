import { Component } from '@angular/core';
import { TwitchService } from './twitch.service';
import { User } from './model/User';
import { DebugService } from './devthings/debug-service.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  user: User;

  constructor(private twitch: TwitchService, private debugService:DebugService) {

    this.twitch.getUser().subscribe(e => this.user = e);

  }

  navigateToOauth() {
    this.twitch.redirectToOauth();

  }

  openDebugMenu(){
    this.debugService.setVisible(true);

  }

}
