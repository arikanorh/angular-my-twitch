import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DebugService } from 'src/app/devthings/debug-service.service';
import { VideoState } from 'src/app/model/VideoStates';
import Twitch from 'src/assets/scripts/twitch.js';

@Component({
  selector: 'app-tw-embed',
  templateUrl: './tw-embed.component.html',
  styleUrls: ['./tw-embed.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwEmbedComponent implements OnInit {

  player;
  _id;
  @Input() set id(value: string) {
    if (this.player) {
      this.debugService.addLog("Updating channel from " + this._id + " to " + value);
      this.player.setChannel(value);
    }
    this._id = value;
  }

  embed;
  @Output() videostatechange = new EventEmitter<any>();



  constructor(private debugService: DebugService) {
  }


  ngOnInit() {
    let self = this;

    let embed = new Twitch.Player("twitch-embed", {
      width: "100%",
      height: "100%",
      channel: this._id,
      autoplay: true,
      // Only needed if this page is going to be embedded on other websites
      parent: [this.getBaseUrl()]
    });
    this.player = embed.getPlayer();

    embed.addEventListener(Twitch.Embed.VIDEO_READY, function () {
      self.videostatechange.emit({ id: self._id, type: VideoState.VIDEO_READY });
    });

    embed.addEventListener('keydown', function () {
      this.debugService.addLog("keydown");
    });

    embed.addEventListener(Twitch.Embed.VIDEO_PLAY, function (e) {
      self.player.setVolume(1);
      self.videostatechange.emit({ id: self._id, type: VideoState.VIDEO_PLAY });
    });

    embed.addEventListener(Twitch.Embed.VIDEO_PAUSE, function () {
      self.videostatechange.emit({ id: self._id, type: VideoState.VIDEO_PAUSE });
    });

    this.embed = embed;
  }

  pause() {
    this.player.pause();
  }

  play() {
    this.player.play();
  }


  getBaseUrl() {
    return window.location.hostname;
  }

  getVolume() {
    this.player.getVolume();
  }

  setVolume(vol) {
    this.player.setVolume(vol);
  }


}
