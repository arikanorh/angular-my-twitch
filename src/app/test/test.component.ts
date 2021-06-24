import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  href;

  constructor() {}

  ngOnInit() {
    this.href = 'https://id.twitch.tv/oauth2/authorize?';
    this.href += 'client_id=1e4gz76ye3w3f71ic955m4seb8jfph';
    this.href += '&';
    this.href += 'redirect_uri=' + encodeURIComponent(this.getBaseUrl());
    this.href += '&';
    this.href += 'response_type=token';
    this.href += '&';
    this.href += 'scope=user:read:follows';
  }

  getBaseUrl() {
    return window.location.origin + '/#/oauth_redirect';
  }
}
