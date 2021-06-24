import { Component, OnInit, Input, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel-component',
  templateUrl: './channel-component.component.html',
  styleUrls: ['./channel-component.component.css']
})
export class ChannelComponentComponent implements OnInit {
  @Input() value;
  channel_name;
  channel_id;
  channel_image;
  channgel_display_name;
  channel_status;
  viewers;
  game_name;

  constructor(private _sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit() {
    //console.log(this.value);
    this.channel_name = this.value.user_name; //user_name
    this.channel_id = this.value.user_login; //user_login
    this.channel_image = this.value.thumbnail_url
      .replace('{width}', '320')
      .replace('{height}', '180'); // thumbnail_url - replace height-width
    this.channgel_display_name = this.value.user_name; // user_name
    this.channel_status = this.value.title; // title
    this.viewers = this.value.viewer_count; // viewer_count
    this.game_name = this.value.game_name; // game_name
  }
  getBackground() {
    return this._sanitizer.bypassSecurityTrustStyle(
      `linear-gradient(rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.5)), url(${
        this.channel_image
      })`
    );
  }
  @HostListener('click')
  handleClick() {
    this.router.navigate(['show', this.channel_name]); //user_login
  }
  goMobile() {
    window.location.href =
      'https://m.twitch.tv/' + this.channel_name + '?no-mobile-redirect=true';
  }
}
