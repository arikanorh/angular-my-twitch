import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Constants } from '../model/Constants';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class OauthComponent implements OnInit {
  constructor(
    route: ActivatedRoute,
    cookieService: CookieService,
    rotuer: Router
  ) {
    console.log('Oauth page 2');
    const x = route.snapshot.fragment;
    const access_token = new URLSearchParams(x).get('access_token');

    cookieService.put(Constants.ACCESS_TOKEN, access_token);
    rotuer.navigate(['/games']);
  }

  ngOnInit() {}
}
