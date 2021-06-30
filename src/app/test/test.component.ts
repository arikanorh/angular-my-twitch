import { Component, OnInit } from '@angular/core';
import { TwitchService } from '../twitch.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  href;

  constructor(private twitch: TwitchService) {
    this.href = twitch.getOauthUrl();
  }

  getBaseUrl() {
    return window.location.origin + '/#/oauth_redirect';
  }
}
