import { Component, OnInit, Input, HostListener } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
  selector: "app-channel-component",
  templateUrl: "./channel-component.component.html",
  styleUrls: ["./channel-component.component.css"]
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

  constructor(private _sanitizer: DomSanitizer,private router:Router) {}

  ngOnInit() {
    //console.log(this.value);
    this.channel_name = this.value.channel.name;
    this.channel_id = this.value.channel._id;
    this.channel_image = this.value.preview.medium;
    this.channgel_display_name = this.value.channel.display_name;
    this.channel_status = this.value.channel.status;
    this.viewers = this.value.viewers;
    this.game_name = this.value.game;
  }
  getBackground() {
    return this._sanitizer.bypassSecurityTrustStyle(
      `linear-gradient(rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.5)), url(${
        this.channel_image
      })`
    );
  }
  @HostListener('click')
  handleClick(){
    // window.location.href="https://m.twitch.tv/" + this.channel_name+"?no-mobile-redirect=true";
  this.router.navigate(['show',this.channel_name]);
  }
  goMobile(){
         window.location.href="https://m.twitch.tv/" + this.channel_name+"?no-mobile-redirect=true";

  }
}
