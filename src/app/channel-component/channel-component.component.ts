import { Component, OnInit, Input, HostListener } from '@angular/core';
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
  goMobile() {
    window.location.href = 
      'https://m.twitch.tv/' +
      this.value.user_login +
      '?no-mobile-redirect=true';
  }
}
