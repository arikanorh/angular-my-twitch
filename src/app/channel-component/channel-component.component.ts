import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Stream } from '../model/Stream';

@Component({
  selector: 'app-channel-component',
  templateUrl: './channel-component.component.html',
  styleUrls: ['./channel-component.component.css']
})
export class ChannelComponentComponent implements OnInit {
  @Input() value:Stream;

  channel_image;

  constructor(private router: Router) {}

  ngOnInit() {
    this.channel_image = this.value.thumbnail_url
      .replace('{width}', '320')
      .replace('{height}', '180'); // thumbnail_url - replace height-width
  }

  @HostListener('click')
  handleClick() {
    this.router.navigate(['show', this.value.user_login]); //user_login
  }
  //TODO move this to TwitchService
  goMobile() {
    window.location.href =
      'https://m.twitch.tv/' +
      this.value.user_login +
      '?no-mobile-redirect=true';
  }
}
