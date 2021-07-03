import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Twitch from 'src/assets/scripts/twitch.js';

@Component({
  selector: 'app-tw-embed',
  templateUrl: './tw-embed.component.html',
  styleUrls: ['./tw-embed.component.css']
})
export class TwEmbedComponent implements OnInit, AfterViewInit {

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
  _playing: boolean = false;
  @Output() videostatechange = new EventEmitter<any>();

  @Input() set playing(value: boolean) {
    this._playing = value;
    if (this.player) {
      if (this._playing) {
        this.play();
      } else {
        this.pause();
      }
    }
  }

  constructor() { }


  ngOnInit() {
    console.log("INIT " + this._id);

    // this.route.params.subscribe(params => {
    //   this.id = params.id;


    // });

  }

  ngAfterViewInit(): void {

    let self = this;

    let embed = new Twitch.Player(this._id, {
      width: "100%",
      height: "100%",
      channel: this._id,
      autoplay: false,
      // Only needed if this page is going to be embedded on other websites
      parent: ["localhost", "othersite.example.com"]
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
}
