

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DebugService } from 'src/app/devthings/debug-service.service';
import { Stream } from 'src/app/model/Stream';
import { VideoState } from 'src/app/model/VideoStates';
import { TwitchService } from 'src/app/twitch.service';
import { TwEmbedComponent } from '../tw-embed/tw-embed.component';

@Component({
  selector: 'app-tw-embeds',
  templateUrl: './tw-embeds.component.html',
  styleUrls: ['./tw-embeds.component.css']
})
export class TwEmbedsComponent implements OnInit {
  @ViewChild("embed") video: ElementRef;
  @ViewChild(TwEmbedComponent) embed: TwEmbedComponent;

  ids: Stream[]
  index = 0;


  showList: boolean = false;
  idle: boolean = false;

  id;
  playAll: boolean = false;
  selectedStream: Stream;
  refreshRequest: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private twitch: TwitchService,
    private debugService: DebugService) {

    this.id = this.route.snapshot.paramMap.get('id');

    twitch.getFavStreams().subscribe(e => {
      if (e) {
        this.ids = e;
        this.setIndexAndUpdateStream();
        this.getStreamFromId();
      }
    })
  }


  ngOnInit() {


    this.route.params.subscribe(params => {

      let id = params.id;
      if (this.ids) {
        this.selectedStream = this.ids.find(e => e.user_login === this.id);
      }

      if (this.id !== id) {
        this.id = id;
        // this.getStreamFromId();
      }
    })

    window.addEventListener("keydown", this.eventListener);
  }



  ngOnDestroy() {
    window.removeEventListener("keydown", this.eventListener);
  }

  eventListener = (e: any) => {
    this.debugService.addLog("Key : " + e.key);


    if (e.key === "ArrowUp") {
      this.video.nativeElement.webkitRequestFullScreen();
    } else if (e.key === "ArrowRight") {
      this.index++;
      this.setIndexAndUpdateStream();
      this.idle = false;
    } else if (e.key === "ArrowLeft") {
      this.index--;
      this.setIndexAndUpdateStream();
      this.idle = false;
    } else if (e.key === "Enter") {
      this.router.navigate(['embeds', this.selectedStream.user_login]);
    } else if (e.key === "ArrowDown") {
      if (!this.refreshRequest) {
        this.refreshRequest = true;
        this.debugService.addLog("Ready to reload channe list. Press " + e.key + " to reload");

      }
      else {
        this.refreshRequest = false;
        this.twitch.loadFavs();
        this.debugService.addLog("Reloading channel list");

      }
    }
  };

  toggleList() {
    this.showList = !this.showList;
  }

  setIndexAndUpdateStream() {

    if (this.index >= this.ids.length) {
      this.index = 0;
      // this.twitch.loadFavs();
    }
    else if (this.index < 0) {
      this.index = this.ids.length - 1;
    }
    this.selectedStream = this.ids[this.index];
  }

  private getStreamFromId() {
    if (this.ids) {
      this.index = this.ids.findIndex((e: Stream) => e.user_login === this.id);
      this.setIndexAndUpdateStream();
    }
  }

  videostatechange(e) {
    let videoState: VideoState = e.type;
    this.debugService.addLog("Video state changed to : " + VideoState[videoState])

    if (videoState == VideoState.VIDEO_PLAY) {
      this.idle = true;
    } else if (videoState == VideoState.VIDEO_PAUSE) {
      this.idle = false;
    }
  }

  toggleSound() {
    this.debugService.addLog("Video cover clicked");
    this.embed.setVolume(1);
  }


}