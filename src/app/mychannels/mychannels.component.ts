import { Component, OnInit } from '@angular/core';
import { TwitchService } from '../twitch.service';

@Component({
  selector: 'app-mychannels',
  templateUrl: './mychannels.component.html',
  styleUrls: ['./mychannels.component.css']
})
export class MychannelsComponent implements OnInit {
  data$;

  constructor(private twitch: TwitchService) {}

  ngOnInit() {
    this.data$ = this.twitch.getFavStreams();
    // this.reloadFavs();
  }

  trackByFn(channel) {
    return channel.id;
  }
  reloadFavs(){
    this.twitch.loadFavs();
  }
}
