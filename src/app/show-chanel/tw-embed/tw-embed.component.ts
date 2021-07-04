import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Twitch from 'src/assets/scripts/twitch.js';

@Component({
  selector: 'app-tw-embed',
  templateUrl: './tw-embed.component.html',
  styleUrls: ['./tw-embed.component.css']
})
export class TwEmbedComponent implements OnInit {

  player;
  // id = Math.random().toString(36).substring(7);
  _id;
  @Input() set id(value: string) {
    if (this.player) {
      console.log("Updating channel from " + this._id + " to " + value);
      this.player.setChannel(value);
      this.play();
    }
    this._id = value;
  }
  _playing: boolean = true;
  @Output() videostatechange = new EventEmitter<any>();

  @Input() set playing(value: boolean) {
    this._playing = value;
    if (this.player) {
      this.startStopPlayer();
    }
  }

  constructor() { }


  ngOnInit() {



    let self = this;

    let embed = new Twitch.Player("twitch-embed", {
      width: "100%",
      height: "100%",
      channel: this._id,
      autoplay: this._playing,
      // Only needed if this page is going to be embedded on other websites
      parent: [this.getBaseUrl()]
    });
    this.player = embed.getPlayer();

    embed.addEventListener(Twitch.Embed.VIDEO_READY, function () {
      if (self._playing) {
        self.play();
      }
      self.videostatechange.emit({ id: self._id, type: 'VIDEO_READY' });
    });


    embed.addEventListener(Twitch.Embed.VIDEO_PLAY, function () {
      self.player.setVolume(1);
      self.videostatechange.emit({ id: self._id, type: 'VIDEO_PLAY' });
    });
  }

  pause() {
    this.player.pause();
  }

  play() {
    this.player.play();
  }
  a_seagull() {
    this.player.setChannel('a_seagull');

  }

  getBaseUrl() {
    return window.location.hostname;
  }
  togglePlaying() {
    this._playing = !this._playing;
    this.startStopPlayer();
  }

  startStopPlayer() {
    if (this._playing) {
      this.play();
    } else {
      this.pause();
    }
  }
}
