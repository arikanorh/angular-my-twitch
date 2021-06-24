import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class OauthComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
    console.log('Oauth page 2');
    const x = this.route.snapshot.fragment;
    console.log(x);
  }

  ngOnInit() {}
}
