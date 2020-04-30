import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TwitchService } from '../../twitch.service';

@Component({
  selector: 'app-new-channel',
  templateUrl: './new-channel.component.html',
  styleUrls: ['../channel-component.component.css']
})
export class NewChannelComponent implements OnInit {

  @Input() channel;
  url;
  game_name;
  constructor(private router: Router, private twitch: TwitchService) { }

  ngOnInit() {
    this.url = this.channel.thumbnail_url.replace("{height}", "180").replace("{width}", "320");
    this.game_name = this.twitch.getGameName(this.channel.game_id);
  }

  @HostListener('click')
  handleClick() {
    // window.location.href="https://m.twitch.tv/" + this.channel_name+"?no-mobile-redirect=true";
    this.router.navigate(['show', this.channel.user_name]);
  }
  goMobile() {
    window.location.href = "https://m.twitch.tv/" + this.channel.user_name + "?no-mobile-redirect=true";

  }

}