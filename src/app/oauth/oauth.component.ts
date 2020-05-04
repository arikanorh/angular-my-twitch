import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class OauthComponent implements OnInit {

  fragment;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.fragment = this.route.url;

    this.route.fragment.subscribe(
      (fragments) => console.log(fragments)
    ); 
  }

}