import { Component, OnInit, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Stream } from '../model/Stream';

@Component({
  selector: 'app-channel-component',
  templateUrl: './channel-component.component.html',
  styleUrls: ['./channel-component.component.css']
})
export class ChannelComponentComponent implements OnInit,OnChanges {
  @Input() value: Stream;

  channel_image;

  constructor(private router: Router) {}


  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.channel_image = this.value.thumbnail_url;
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
