import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwitchService } from '../twitch.service';
import { Stream } from '../model/Stream';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  channels$: Observable<Stream[]>;
  id;
  constructor(route: ActivatedRoute, private twitch: TwitchService) {
    this.id = route.snapshot.params.id;
  }

  ngOnInit() {
    this.channels$ = this.twitch.getStreamsOfGameFromAPI(this.id);
  }

  trackByFn(index,stream:Stream) {
    return stream.user_login;
  }

  reloadFavs() {
    this.twitch.loadFavs();
  }
}
