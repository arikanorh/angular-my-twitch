import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwitchService } from '../twitch.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class OauthComponent implements OnInit {
  constructor(route: ActivatedRoute, rotuer: Router, twitch: TwitchService) {
    const x = route.snapshot.fragment;
    const access_token = new URLSearchParams(x).get('access_token');

    // twitch.setAccessToken(access_token);

    // twitch.loadUser();
    // rotuer.navigate(['/games']);
  }

  ngOnInit() {}
}
