import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { TwitchService } from "../twitch.service";

@Component({
  selector: "app-channels",
  templateUrl: "./channels.component.html",
  styleUrls: ["./channels.component.css"]
})
export class ChannelsComponent implements OnInit {
  channels$;
  id;
  constructor(
    private httpService: HttpClient,
    route: ActivatedRoute,
    private twitch: TwitchService
  ) {
    this.id = route.snapshot.params.id;
  }

  ngOnInit() {
    this.channels$ = this.twitch.getChannelsOfGame(this.id);
  }
  
  trackByFn(channel) {
    return channel._id;
  }
}
