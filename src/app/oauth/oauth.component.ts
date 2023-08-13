import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwitchService } from '../twitch.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class OauthComponent implements OnInit {
  constructor(rotuer: Router, twitch: TwitchService) {


    twitch.getUser().subscribe(e => {
      if (e)
        rotuer.navigate(["auto_redirect"]);
    })
  }

  ngOnInit() { }
}
