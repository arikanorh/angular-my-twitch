import { Component, OnInit } from '@angular/core';
import { DebugService } from '../devthings/debug-service.service';
import { TwitchService } from '../twitch.service';

@Component({
  selector: 'app-mychannels',
  templateUrl: './mychannels.component.html',
  styleUrls: ['./mychannels.component.css']
})
export class MychannelsComponent implements OnInit {
  data$;

  constructor(private twitch: TwitchService,private debugService:DebugService) {

  }

  ngOnInit() {
    this.data$ = this.twitch.getFavStreams();
    this.debugService.addLog("My Channels init");
    // this.reloadFavs();
  }

  trackByFn(index,channel) {
    return channel.id;
  }
  reloadFavs(){
    this.twitch.loadFavs();
  }
}
